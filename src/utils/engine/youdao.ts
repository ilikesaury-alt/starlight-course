/**
 * 有道词典 TTS 引擎（网络音频）：英文 type=1，中文 type=2。
 *
 * 实测行为（dict.youdao.com）：
 *   - 单词、短语：稳定返回真实音频；
 *   - 整句：约一半返回 HTTP 500（`returned null audio`）；
 *   - 中文：几乎所有「成功」响应都是**同一段 48ms 空白音频**（不同文本返回的字节完全相同），
 *     即「HTTP 200 但根本没有声音」。
 *
 * 故本引擎的策略（有界、绝不递归）：
 *   1. 短文本（单词 / 短语）一次请求即可，命中率高；
 *   2. 长文本先**整段**试一次 —— 成功时语调最自然，失败再按标点分片；
 *   3. 分片逐片重试；某片重试耗尽 → 「本片 + 剩余」整体交给原生合成器
 *      （原生无长度上限），绝不产生二次截断；
 *   4. 连续拿不到有效音频时**熔断**一段时间，直接跳过有道直奔原生合成器，
 *      避免每句都白等一串必然失败的请求（中文场景尤其明显）。
 */

import { PlayOutcome } from './types'
import { playUrl } from './playUrl'
import { speakWithWebSpeech } from './webSpeech'
import { traceNote } from './engineTrace'

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
    // 空白音频的诊断要记在有道名下
    engineName: 'youdao',
  })
}

/** 分片的最大字符数：短于此的片段有道基本都能给出真实音频 */
const CHUNK_MAX = 26

/**
 * 按标点断句，过长句再按 max 字符硬切；返回若干短片段。
 *
 * 标点表同时覆盖中英文（`。！？!?；;，,、` + 换行），英文句子也能按逗号分片。
 */
export function chunkByPunct(text: string, max = CHUNK_MAX): string[] {
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

// ---------- 熔断：连续拿不到有效音频时暂时跳过有道 ----------
/** 连续失败多少次后熔断 */
const BREAKER_THRESHOLD = 3
/** 熔断持续时长（毫秒） */
const BREAKER_COOLDOWN_MS = 60_000
let strikes = 0
let breakerUntil = 0

/** 当前是否处于熔断期（有道应被跳过，直奔原生合成器） */
export function isYoudaoBypassed(): boolean {
  return Date.now() < breakerUntil
}

function onStrike(text: string): void {
  strikes += 1
  if (strikes < BREAKER_THRESHOLD) return
  breakerUntil = Date.now() + BREAKER_COOLDOWN_MS
  strikes = 0
  traceNote(
    'youdao',
    `连续 ${BREAKER_THRESHOLD} 次拿不到有效音频，${BREAKER_COOLDOWN_MS / 1000} 秒内跳过有道、直奔原生合成器`,
    text,
  )
}

function onHit(): void {
  strikes = 0
}

/**
 * 有道的健壮播放入口：整段优先 → 分片重试 → 原生合成器兜底。
 *
 * 无论中间经历多少次降级，本函数**一定**返回一个结果，绝不递归、绝不抛错。
 * @param rate 播放速率（慢速 0.6 / 正常 1）
 */
export async function playYoudaoResilient(
  text: string,
  lang: 'en' | 'zh',
  rate: number,
  guard: () => boolean,
  onAudio?: (el: HTMLAudioElement) => void,
): Promise<PlayOutcome> {
  if (!guard()) return { status: 'aborted' }
  if (isYoudaoBypassed()) return { status: 'failed' }

  // 短文本（单词 / 短语）：一次请求即可
  if (text.length <= CHUNK_MAX) {
    const out = await playYoudaoAudio(text, lang, { rate, guard, onAudio })
    if (out.status === 'success') onHit()
    else if (out.status === 'failed') onStrike(text)
    return out
  }

  // 长文本：先整段试一次（成功则语调最自然）
  const whole = await playYoudaoAudio(text, lang, { rate, guard, onAudio })
  if (whole.status === 'success') {
    onHit()
    return whole
  }
  if (whole.status === 'aborted') return whole
  onStrike(text)
  traceNote('youdao', '整段发音失败，改为按标点分片播放', text)

  const chunks = chunkByPunct(text, CHUNK_MAX)
  for (let i = 0; i < chunks.length; i++) {
    if (!guard()) return { status: 'aborted' }

    // 熔断已触发就别再白试：剩余文本整体交给原生合成器
    if (isYoudaoBypassed()) {
      await speakWithWebSpeech(chunks.slice(i).join(''), { lang, rate, guard, lastResort: true })
      return { status: 'success' }
    }

    const piece = chunks[i]
    let ok = false
    for (let attempt = 0; attempt < 2 && !ok; attempt++) {
      if (!guard()) return { status: 'aborted' }
      const out = await playYoudaoAudio(piece, lang, { rate, guard, onAudio })
      if (out.status === 'success') {
        ok = true
        onHit()
        break
      }
      if (out.status === 'aborted') return { status: 'aborted' }
      if (out.status === 'blocked' && attempt === 0) {
        // 自动播放被拦截：解锁后仅再试一次
        await delay(250)
      }
    }
    if (!ok) {
      onStrike(piece)
      // 重试耗尽：把「本片 + 剩余」整体交给原生合成器兜底（原生无长度上限）
      await speakWithWebSpeech(chunks.slice(i).join(''), { lang, rate, guard, lastResort: true })
      return { status: 'success' }
    }
  }
  return { status: 'success' }
}
