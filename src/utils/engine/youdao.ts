/**
 * 有道词典 TTS 引擎（网络音频）：英文 type=1，中文 type=2。
 *
 * 健壮性设计：
 *   - 单个短词/句：直接请求有道；blocked（自动播放拦截）由上层解锁后重试；
 *   - 中文长文本：有道单请求有长度上限（约 40~50 字），超出返回「截断音频」。
 *     故按标点切分、逐片顺序播放；单片因网络抖动失败时先「同片重试」（最多 3 次）
 *     而非立即丢弃；重试耗尽后把「本片 + 剩余」整体交给原生合成器兜底（原生无长度上限），
 *     绝不出现二次截断，也绝不产生无界递归。
 */

import { PlayOutcome } from './types'
import { playUrl } from './playUrl'
import { speakWithWebSpeech } from './webSpeech'

export interface YoudaoOptions {
  /** 播放速率（慢速 0.6 / 正常 1） */
  rate?: number
  /** 代次守卫 */
  guard?: () => boolean
  /** 创建出 audio 元素时回调，便于上层接管取消逻辑 */
  onAudio?: (el: HTMLAudioElement) => void
}

export function playYoudaoAudio(
  text: string,
  lang: 'en' | 'zh',
  opts: YoudaoOptions = {},
): Promise<PlayOutcome> {
  const type = lang === 'zh' ? 2 : 1
  const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=${type}`
  return playUrl(url, {
    guard: opts.guard,
    onAudio: opts.onAudio,
    playbackRate: opts.rate ?? 1,
    loadTimeout: 8000,
    hardCapMs: 120000,
  })
}

/** 按标点断句，过长句再按 max 字符硬切；返回若干短片段 */
function chunkByPunct(text: string, max = 26): string[] {
  const raw = text.match(/[^。！？!?；;，,、\n]+[。！？!?；;，,、]?|\n+/g) ?? [text]
  const out: string[] = []
  for (const s of raw) {
    const t = s.trim()
    if (!t) continue
    if (t.length <= max) out.push(t)
    else for (let k = 0; k < t.length; k += max) out.push(t.slice(k, k + max))
  }
  return out.length ? out : [text]
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/**
 * 中文长文本：分片顺序播放有道音频，全部成功即 success。
 * 单片失败最多重试 2 次（共 3 次尝试）；重试耗尽后「本片 + 剩余」整体交给
 * 原生合成器兜底并返回 success（任何情况下本函数都会结束，绝不递归无界）。
 */
export async function playYoudaoChunked(
  text: string,
  rate: number,
  guard: () => boolean,
  onAudio?: (el: HTMLAudioElement) => void,
): Promise<PlayOutcome> {
  const chunks = chunkByPunct(text, 26)
  for (let i = 0; i < chunks.length; i++) {
    if (!guard()) return { status: 'aborted' }
    const piece = chunks[i]
    let ok = false
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      if (!guard()) return { status: 'aborted' }
      const out = await playYoudaoAudio(piece, 'zh', { rate, guard, onAudio })
      if (out.status === 'success') {
        ok = true
        break
      }
      if (out.status === 'aborted') return { status: 'aborted' }
      if (out.status === 'blocked' && attempt === 0) {
        // 自动播放被拦截：解锁后仅再试一次，仍拦截则交给剩余文本的原生兜底
        await delay(250)
        continue
      }
    }
    if (!ok) {
      // 重试耗尽：把「本片 + 剩余」整体交给原生合成器兜底（原生无长度上限）
      await speakWithWebSpeech(chunks.slice(i).join(''), { lang: 'zh', rate, guard })
      return { status: 'success' }
    }
  }
  return { status: 'success' }
}
