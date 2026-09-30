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
import { traceNote } from './engineTrace'

// ---------- 嗓音预载（Chrome 首次 getVoices() 常为空，需等 voiceschanged）----------
let voices: SpeechSynthesisVoice[] = []
/** 嗓音列表是否曾经成功加载过（空列表 ≠ 没有嗓音，可能只是还没加载完） */
let voicesLoaded = false

function loadVoices() {
  try {
    const vs = window.speechSynthesis?.getVoices?.() ?? []
    if (vs.length) {
      voices = vs
      voicesLoaded = true
    }
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

/**
 * 嗓音列表尚未加载完时，最多等 VOICE_WAIT_MS 让 voiceschanged 补上。
 *
 * 重要：首次进页面时 getVoices() 经常是空数组，**不能**据此判定「系统没语音包」，
 * 否则会把正常设备也判失败。故只在「已成功加载过、且确实没有匹配嗓音」时才算缺失。
 */
const VOICE_WAIT_MS = 800

function waitVoices(): Promise<void> {
  if (voicesLoaded || typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve()
  }
  return new Promise<void>((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(timer)
      try {
        window.speechSynthesis.removeEventListener('voiceschanged', onChange)
      } catch {
        /* ignore */
      }
      resolve()
    }
    const onChange = () => {
      loadVoices()
      if (voicesLoaded) finish()
    }
    const timer = setTimeout(finish, VOICE_WAIT_MS)
    try {
      window.speechSynthesis.addEventListener('voiceschanged', onChange)
    } catch {
      /* ignore */
    }
  })
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
/** 已确认系统缺对应语音包时的压缩预算：早点失败，别让用户干等 */
const MISS_VOICE_BUDGET_MS = 6000

/**
 * 先探一次本地嗓音，再决定本级的预算。
 *
 * 已确认「系统没有对应语音包」时，Chrome/Edge 会转去连 Google 在线 TTS ——
 * 国内不通就静默无回调（既不 onstart 也不 onerror），白等满额预算毫无意义。
 * 故此时把预算压到 MISS_VOICE_BUDGET_MS，并打日志 + 记进诊断流，让失败快速暴露。
 * 反之，「嗓音列表还没加载完」（首次进页面 getVoices() 常为空）不算缺失，
 * 等 VOICE_WAIT_MS 后按正常预算走，避免误杀正常设备。
 */
async function resolveBudgetMs(text: string, opts: WebSpeechOptions): Promise<number> {
  const base = opts.budgetMs ?? Math.max(DEFAULT_BUDGET_MS, Math.min(120000, text.length * 500 + 10000))
  await waitVoices()
  const kind = opts.lang === 'zh' ? 'zh' : 'en'
  if (pickVoice(kind)) return base
  const reason = voicesLoaded
    ? `系统没有 ${kind} 语音包（已加载 ${voices.length} 个嗓音，可用: ${voices
        .map((v) => v.lang)
        .slice(0, 6)
        .join('/')}）`
    : '嗓音列表未就绪（voiceschanged 未触发）'
  console.warn(`[webSpeech] ${reason}`)
  traceNote('webspeech', reason, text)
  return voicesLoaded ? Math.min(base, MISS_VOICE_BUDGET_MS) : base
}

export async function speakWithWebSpeech(
  text: string,
  opts: WebSpeechOptions = {},
): Promise<PlayOutcome> {
  const budgetMs = await resolveBudgetMs(text, opts)
  return runWebSpeech(text, opts, budgetMs)
}

function runWebSpeech(
  text: string,
  opts: WebSpeechOptions,
  budgetMs: number,
): Promise<PlayOutcome> {
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

    // 预算在探测嗓音后已定（见 resolveBudgetMs），deadline 从此刻起算
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
