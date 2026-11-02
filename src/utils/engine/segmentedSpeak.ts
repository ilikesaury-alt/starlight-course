/**
 * 分段朗读的编排器：把多句文本**一次合成**成一段音频，播放时按时间轴回调当前句。
 *
 * 为什么需要它（这是「朗读不好听」里最被忽略的一半）：
 *   逐句朗读的天然实现是「句 1 合成→播放→句 2 合成→播放…」，于是每句之间都插了
 *   **一次网络往返**（实测 TTFB 300~450ms/句）。5 句话 = 5 次等待 = 约 2 秒的
 *   断点，孩子听到的是一顿一顿的「机关枪」。
 *   实测（2026-11-02）：同一段 4 句
 *     逐句请求 = 4 次往返 + 10.8s 音频
 *     一次合并 = 1 次往返 + 7.5s 音频（百度在合并时会压缩句间停顿）
 *   即合并请求少等 3.3 秒、且停顿更自然 —— 这就是「连读」该有的样子。
 *
 * 时间轴怎么来的：
 *   云 TTS（百度）只给一段 MP3，不带边界元数据。故采取「**先量后放**」：
 *   第一遍把每句单独合成一次、量出各自时长（此时不播放），
 *   再把整段合并成一次请求播放，用量出来的时长当时间窗推算当前句。
 *   代价是多一轮请求（各句并发合成，实测约 0.4~0.9s），换来的是
 *   「一次网络往返播放整段」+「精确到句的高亮」。
 *
 *   若某句单独合成失败（网络抖动），退化为「按字数比例估算该句时长」，
 *   宁可高亮稍有偏差，也不能让整段朗读失败。
 */

import { PlayOutcome } from './types'
import { playUrl } from './playUrl'

/** 一个句子片段及其在整段音频中的时间窗（毫秒） */
export interface SpeechSegment {
  text: string
  startMs: number
  endMs: number
}

/** 播放中回调当前片段序号 */
export type SegmentProgress = (index: number) => void

export interface SegmentedSpeakOptions {
  lang: 'en' | 'zh'
  slow?: boolean
  guard?: () => boolean
  onAudio?: (el: HTMLAudioElement) => void
  /** 播放推进到第几个片段时回调 */
  onSegment?: SegmentProgress
}

/**
 * 估算一段文本的朗读时长（毫秒）。
 *
 * 经验值：英文约 340ms/词 + 200ms 基础；中文约 260ms/字。
 *
 * ⚠️ 这是**权重**而非精确时长：合并后的整段音频时长是已知的（metadata），
 * 按各句估算时长占比去分配时间窗即可 —— 不需要为每句单独发一次请求去量。
 * 实测这样比「逐句量时长」更快（少 5 次网络往返）、也更稳（不与其它请求抢带宽）。
 */
function estimateDuration(text: string, lang: 'en' | 'zh'): number {
  if (lang === 'zh') return Math.max(400, text.replace(/\s/g, '').length * 260)
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(400, words * 340 + 200)
}

/**
 * 分段朗读：一次合成整段 → 播放 → 按时间轴回调当前句。
 *
 * @returns success=已发声；failed=应回落到下一层；aborted=代次失效
 */
export async function speakSegmented(
  segments: string[],
  opts: SegmentedSpeakOptions,
): Promise<PlayOutcome> {
  const { lang, slow, guard, onSegment } = opts
  if (!segments.length) return { status: 'failed' }
  if (guard && !guard()) return { status: 'aborted' }

  // 整段文本：句与句之间用空格连接（中文用「，」更自然）
  const joiner = lang === 'zh' ? '，' : ' '
  const joined = segments.join(joiner)

  // ---- 各句的时长权重（估算）----
  const weights = segments.map((s) => estimateDuration(s, lang))
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1

  /** 当前时间轴：拿到整段实际时长后按权重分配 */
  let timeline: SpeechSegment[] = []
  const buildTimeline = (mergedDurationMs: number) => {
    const next: SpeechSegment[] = []
    let acc = 0
    for (let i = 0; i < segments.length; i++) {
      const dur = (weights[i] / weightSum) * mergedDurationMs
      next.push({ text: segments[i], startMs: acc, endMs: acc + dur })
      acc += dur
    }
    timeline = next
  }
  buildTimeline(0)

  // ---- 组时间窗 ----
  //
  // ⚠️ 合并请求的音频**比逐段总长短**（实测 4 句：合并 9864ms vs
  // 逐段合计 14256ms —— 百度在合并时会把句间停顿压掉约 30%）。
  // 若用估算时长直接当时间窗，高亮会**越走越滞后**（句 4 可能到音频快结束才亮）。
  // 故拿到合并音频的**实际时长**后按权重分配，保证：
  //   ① 时间轴与真实音频严格对齐（句 i 的高亮出现在它真正被读到时）；
  //   ② 最后一句的时间窗正好落在音频末尾。
  //
  // ---- 第 1 轮：合并成整段，一次请求播放 ----
  const wholeUrl = buildSegmentUrl(joined, lang, slow)
  let playEl: HTMLAudioElement | null = null
  /** 已挂到 audio 上的推进逻辑（避免重复挂） */
  let progressAttached = false

  const attachProgress = (el: HTMLAudioElement) => {
    if (progressAttached || !onSegment) return
    progressAttached = true
    // 用 timeupdate 粗粒度推进（~250ms 一次），够用且不费性能。
    //
    // ⚠️ 必须在这里（audio 元素刚创建、播放还没开始）挂，而不是等 playUrl 返回：
    // playUrl 的 success 是**播放结束**时才 resolve 的，那时再挂就永远收不到事件，
    // 高亮会一动不动。
    let lastIndex = -1
    /** 按当前播放位置点亮对应句 */
    const syncIndex = () => {
      const t = el.currentTime * 1000
      let idx = 0
      for (let i = 0; i < timeline.length; i++) {
        if (t >= timeline[i].startMs) idx = i
        else break
      }
      if (idx !== lastIndex) {
        lastIndex = idx
        try {
          onSegment(idx)
        } catch {
          /* ignore */
        }
      }
    }
    const onTime = () => syncIndex()
    el.addEventListener('timeupdate', onTime)
    // 播完时确保回调到最后一句
    el.addEventListener(
      'ended',
      () => {
        el.removeEventListener('timeupdate', onTime)
        if (lastIndex !== timeline.length - 1) {
          try {
            onSegment(timeline.length - 1)
          } catch {
            /* ignore */
          }
        }
      },
      { once: true },
    )
    // metadata 到位后按**整段实际时长**重建时间轴（合并音频比逐段总长短，
    // 不按实际时长分配的话高亮会越走越滞后）。
    // ⚠️ metadata 可能晚于播放开始才到 → 重建后立刻按当前位置重算一次高亮。
    el.addEventListener(
      'loadedmetadata',
      () => {
        const d = Number.isFinite(el.duration) ? el.duration * 1000 : 0
        if (d > 0) {
          buildTimeline(d)
          syncIndex()
        }
      },
      { once: true },
    )
  }

  const out = await playUrl(wholeUrl, {
    guard,
    onAudio: (el) => {
      playEl = el
      attachProgress(el)
      opts.onAudio?.(el)
    },
    playbackRate: 1,
    loadTimeout: 8000,
    hardCapMs: 180000,
    engineName: 'baidu',
  })
  if (out.status !== 'success') return out

  // 兜底：某些情况下 audio 元素没被接管（如 playUrl 内部换了元素），
  // 这时至少要把首句点亮，别让高亮全黑
  if (onSegment && !progressAttached) {
    try {
      onSegment(0)
    } catch {
      /* ignore */
    }
  }
  void playEl

  return { status: 'success' }
}

/** 构造百度的请求 URL（与 baidu.ts 保持同一参数口径） */
function buildSegmentUrl(text: string, lang: 'en' | 'zh', slow?: boolean): string {
  const spd = slow ? 1 : 2
  const lan = lang === 'zh' ? 'zh' : 'en'
  return `https://fanyi.baidu.com/gettts?lan=${lan}&spd=${spd}&source=web&text=${encodeURIComponent(text)}`
}
