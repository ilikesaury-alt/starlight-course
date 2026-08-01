/**
 * Web Speech API 兜底引擎（原生 speechSynthesis）。
 *
 * 本模块专门处理 Chrome 著名的「假死」问题：
 * 连续 speak/cancel 数次后，合成器进入既不触发 onend/onerror、speaking/pending 也
 * 卡在 false 的死状态，表现为「点几个字就彻底静音」。
 *
 * 对策（有界、带冷却，绝不无限自愈）：
 *   1. 绝不 cancel 轰炸：仅在确有发声/排队时才 cancel（新会话切换时由 speakService 处理）；
 *   2. 静默检测：speak 后 1.2s 内既未 onstart 也未在播 → 判定疑似假死；
 *   3. 有界自愈：cancel + resume + 重新 speak，最多 2 次；仍假死则标记 30s 冷却期，
 *      期间直接判定失败，交由上层回退，避免每次点击都在死引擎上浪费 2.5s；
 *   4. 整体 deadline：任何情况下 Promise 都会在 budgetMs 内结束，绝不卡死按钮动画。
 *
 * 注意：speechSynthesis 本身不受自动播放策略限制（Chrome），因此在「有道被拦截」时
 * 通常是有效的兜底；iOS 上它同样静默无回调，此时靠 deadline 兜底复位。
 */

import { PlayOutcome } from './types'

// ---------- 嗓音预载（Chrome 首次 getVoices() 常为空，需等 voiceschanged）----------
let voices: SpeechSynthesisVoice[] = []

function loadVoices() {
  try {
    const vs = window.speechSynthesis?.getVoices?.() ?? []
    if (vs.length) voices = vs
  } catch {
    /* ignore */
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices()
  try {
    window.speechSynthesis.onvoiceschanged = loadVoices
  } catch {
    /* ignore */
  }
}

function pickVoice(kind: 'en' | 'zh'): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined
  const exact = kind === 'zh' ? 'zh-CN' : 'en-US'
  const prefix = kind === 'zh' ? 'zh' : 'en'
  return (
    voices.find((v) => v.lang === exact) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith(prefix)) ||
    undefined
  )
}

// ---------- 引擎状态 ----------
// 假死冷却期：到该时间点之前不再尝试原生合成器，避免在死引擎上反复空转
let nativeDeadUntil = 0

export interface WebSpeechOptions {
  lang?: 'en' | 'zh'
  rate?: number
  /** 代次守卫；返回 false 时放弃本次播放（aborted） */
  guard?: () => boolean
  /** 整体预算（毫秒）：任何情况下都会在该时长内结束 */
  budgetMs?: number
}

const DEFAULT_BUDGET_MS = 20000
const DEAD_COOLDOWN_MS = 30000
const MAX_RECOVERIES = 2

export function speakWithWebSpeech(text: string, opts: WebSpeechOptions = {}): Promise<PlayOutcome> {
  return new Promise<PlayOutcome>((resolve) => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
    if (!synth || typeof synth.speak !== 'function' || typeof synth.cancel !== 'function') {
      resolve({ status: 'failed' })
      return
    }
    if (Date.now() < nativeDeadUntil) {
      resolve({ status: 'failed' })
      return
    }

    let settled = false
    let spoken = false
    let recovering = false
    let attempts = 0
    const settle = (o: PlayOutcome) => {
      if (settled) return
      settled = true
      resolve(o)
    }
    const guardOk = () => (opts.guard ? opts.guard() : true)

    if (!guardOk()) {
      settle({ status: 'aborted' })
      return
    }

    const makeUtter = (): SpeechSynthesisUtterance => {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = opts.lang === 'zh' ? 'zh-CN' : 'en-US'
      u.rate = opts.rate ?? 0.9
      u.pitch = 1
      const v = pickVoice(opts.lang === 'zh' ? 'zh' : 'en')
      if (v) u.voice = v
      return u
    }

    // 预算随文本长度自适应：长朗读（段落/全文）不能被固定 20s 腰斩。
    // 约 500ms/字 + 10s 余量，上限 120s。
    const budgetMs = opts.budgetMs ?? Math.max(DEFAULT_BUDGET_MS, Math.min(120000, text.length * 500 + 10000))
    const deadline = Date.now() + budgetMs

    // 给单个 utterance 挂上统一的事件处理
    const attach = (u: SpeechSynthesisUtterance): SpeechSynthesisUtterance => {
      u.onstart = () => {
        spoken = true
      }
      u.onend = () => settle({ status: 'success' })
      u.onerror = () => {
        if (spoken) {
          // 已播过（如被新会话 cancel 打断）视为成功
          settle({ status: 'success' })
        } else {
          // 未开始即报错：可能是瞬时故障，交给 check 走有界自愈
          window.setTimeout(check, 200)
        }
      }
      return u
    }

    const check = () => {
      if (settled) return
      if (!guardOk()) {
        settle({ status: 'aborted' })
        return
      }
      if (Date.now() > deadline) {
        // 即便音频仍在播，也复位（软兜底语义：不取消音频，让其自然结束）
        settle({ status: 'success' })
        return
      }
      if (spoken) {
        // 已开播，只是 onend 偶发不触发：继续等待，直到 deadline 复位
        window.setTimeout(check, 200)
        return
      }
      if (synth.speaking || synth.pending) {
        // 引擎确实在排队/发声，只是 onstart 尚未触发：继续等待
        window.setTimeout(check, 200)
        return
      }
      // 什么都没发生 → 疑似假死。有界自愈。
      if (recovering) return // 自愈尝试进行中，交由自愈后的 check 决定
      attempts++
      if (attempts > MAX_RECOVERIES) {
        nativeDeadUntil = Date.now() + DEAD_COOLDOWN_MS
        settle({ status: 'failed' })
        return
      }
      recovering = true
      try {
        synth.cancel()
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        recovering = false
        if (settled) return
        if (!guardOk()) {
          settle({ status: 'aborted' })
          return
        }
        try {
          if (synth.paused) synth.resume()
        } catch {
          /* ignore */
        }
        try {
          synth.speak(attach(makeUtter()))
        } catch {
          settle({ status: 'failed' })
          return
        }
        window.setTimeout(check, 1200)
      }, 120)
    }

    // 干净起步：仅当上一会话把引擎留在 busy 状态时才 cancel（避免 cancel 轰炸）
    try {
      if (synth.speaking || synth.pending) synth.cancel()
    } catch {
      /* ignore */
    }
    try {
      if (synth.paused) synth.resume()
    } catch {
      /* ignore */
    }

    try {
      synth.speak(attach(makeUtter()))
    } catch {
      settle({ status: 'failed' })
      return
    }

    window.setTimeout(check, 1200)
  })
}
