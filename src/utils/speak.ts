/**
 * Universal pronunciation helper.
 *
 * 渐进增强回退链（优先级从高到低）：
 *   - 英文：Kokoro-82M 神经网络 TTS (WebGPU) → 有道 → WebSpeech（见 engine/kokoro.ts）
 *   - 中文：Edge TTS (云端, 仅 Microsoft Edge) → 有道 → WebSpeech（见 engine/edgeTts.ts）
 *   - 任何一层失败都静默回落到下一层，保证「一定能出声」
 *
 * 稳定性增强：
 *   - 预载 speechSynthesis 的 voices 并监听 voiceschanged，避免 getVoices 为空时静默
 *   - speak 前若 synthesis 处于 paused 则 resume()，并显式指定 en-US / zh-CN voice
 *   - 有道仅在「2.5s 内从未开始播放」时才降级，不打断正在朗读的句子
 *   - 兜底 native speak 若静默无回调（Chrome 假死），自动复位按钮以便重试
 *   - Kokoro 仅在「模型已就绪」时优先使用；未就绪则走原有链路并后台预热，避免首屏卡顿
 *   - Edge TTS 仅在 Microsoft Edge 浏览器生效；非 Edge（如 Chrome）直接走有道，无额外延迟
 */

export interface SpeakOptions {
  /** slower rate for kids (0.6) */
  slow?: boolean
  /** override rate; defaults to 0.9 (or 0.6 when slow) */
  rate?: number
  /** 'en' (default) uses English voice + Youdao type=1; 'zh' uses Chinese voice + Youdao type=2 */
  lang?: 'en' | 'zh'
  onStart?: () => void
  onEnd?: () => void
}

// 神经网络 TTS 引擎（WebGPU，英文）；失败/未启用时由下方回退链无缝接管
import { speakWithKokoro, isKokoroReady, isKokoroEnabled, warmupKokoro } from './engine/kokoro'
// 云端中文 TTS 引擎（仅 Microsoft Edge）；非 Edge 时由下方回退链无缝接管
import { speakWithEdgeTts, isEdgeBrowser, isEdgeTtsEnabled } from './engine/edgeTts'

// ---------- Web Speech API 语音预载 ----------
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
  // Chrome 首次 getVoices() 常为空，需等 voiceschanged 事件再取一次
  window.speechSynthesis.onvoiceschanged = loadVoices
}

/** 选一个英文嗓音（优先 en-US），没有则返回 undefined 用浏览器默认 */
function pickVoice(): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined
  return (
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('en')) ||
    undefined
  )
}

/** 选一个中文嗓音（优先 zh-CN），供中文课文/古诗朗读使用 */
function pickZhVoice(): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined
  return (
    voices.find((v) => v.lang === 'zh-CN') ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('zh')) ||
    undefined
  )
}

// ---------- 播放状态管理 ----------
/** 上一次播放的 Audio 引用，用于取消重叠播放 */
let currentAudio: HTMLAudioElement | null = null
/** 递增代次，使旧回调自动失效 */
let generation = 0
/** 所有待结的 onEnd 回调，新调用时全部通知 */
const pendingEnds: Array<() => void> = []

/** 通知所有旧的 onEnd 回调并清空池 */
function flushPendingEnds() {
  const cbs = pendingEnds.splice(0)
  for (const cb of cbs) {
    try {
      cb()
    } catch {
      /* ignore */
    }
  }
}

export function speakText(text: string, opts: SpeakOptions = {}) {
  if (!text?.trim()) return

  const slow = !!opts.slow
  const rate = opts.rate ?? (slow ? 0.6 : 0.9)
  const lang = opts.lang ?? 'en'

  // 先通知所有旧回调，确保上一个按钮的动画停止
  flushPendingEnds()

  opts.onStart?.()

  let finished = false
  const done = () => {
    if (!finished) {
      finished = true
      // 从池中移除自身（防止 flush 时重复调用）
      const i = pendingEnds.indexOf(markDone)
      if (i !== -1) pendingEnds.splice(i, 1)
      opts.onEnd?.()
    }
  }
  const markDone = done

  // 取消上一次播放
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.removeAttribute('src')
      currentAudio.load()
    } catch {
      /* ignore */
    }
    currentAudio = null
  }
  try {
    window.speechSynthesis?.cancel()
  } catch {
    /* ignore */
  }

  // 递增代次，旧回调检测到代次不匹配时自动跳过
  const gen = ++generation

  // Level 1: 有道词典 TTS（英文 type=1，中文 type=2）
  const youdao = (onComplete?: () => void) => {
    try {
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=${lang === 'zh' ? 2 : 1}`
      const audio = new Audio(url)
      audio.playbackRate = slow ? 0.6 : 1
      currentAudio = audio

      let settled = false
      let started = false // 是否真正开始播放（用于区分"卡住"与"正在播"）

      const onSuccess = () => {
        if (!settled && gen === generation) {
          settled = true
          if (currentAudio === audio) currentAudio = null
          done()
        }
      }
      const onFail = () => {
        if (!settled && gen === generation) {
          settled = true
          if (currentAudio === audio) currentAudio = null
          onComplete?.()
        }
      }

      audio.onplaying = () => {
        started = true
      }
      audio.onended = onSuccess
      audio.onerror = onFail

      // 仅当「2.5s 内从未开始播放」才判定为卡住并降级；
      // 已经开播的句子绝不打断（长句也能播完）
      const timer = setTimeout(() => {
        if (!settled && !started) {
          try {
            audio.pause()
            audio.removeAttribute('src')
            audio.load()
          } catch {
            /* ignore */
          }
          onFail()
        }
      }, 2500)

      audio.addEventListener('ended', () => clearTimeout(timer), { once: true })
      audio.addEventListener('error', () => clearTimeout(timer), { once: true })

      void audio.play().catch(() => {
        if (!settled) onFail()
      })
    } catch {
      onComplete?.()
    }
  }

  // Level 2: speechSynthesis 兜底（Web Speech API）
  const nativeSpeak = () => {
    if (gen !== generation) return

    const synth = window.speechSynthesis
    if (!synth || typeof synth.cancel !== 'function') {
      done()
      return
    }

    try {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = lang === 'zh' ? 'zh-CN' : 'en-US'
      utter.rate = rate
      utter.pitch = 1
      const voice = lang === 'zh' ? pickZhVoice() : pickVoice()
      if (voice) utter.voice = voice

      let settled = false
      const settle = () => {
        if (!settled && gen === generation) {
          settled = true
          done()
        }
      }
      utter.onend = settle
      utter.onerror = settle

      // Chrome 有时停在 paused 状态（尤其是 cancel 之后），先 resume 再播
      try {
        if (synth.paused) synth.resume()
      } catch {
        /* ignore */
      }
      synth.speak(utter)

      // 安全网：若合成器静默吞掉本次朗读（onend/onerror 都不触发），
      // 且当前确实没有在播，则复位按钮，让用户能再次点击重试。
      setTimeout(() => {
        if (!settled && gen === generation) {
          try {
            if (!synth.speaking && !synth.pending) settle()
          } catch {
            settle()
          }
        }
      }, 1500)
    } catch {
      done()
    }
  }

  // 将 done 加入池中，供下次调用时通知
  pendingEnds.push(markDone)

  // ---- Level 0a: 中文走 Edge TTS（云端，仅 Microsoft Edge 可用）----
  // 仅在 Edge 浏览器生效；非 Edge（如 Chrome）直接走下方原有链路，无额外延迟。
  // 失败或代次变更则无缝回落到原有「有道 → WebSpeech」链路。
  if (lang === 'zh' && isEdgeTtsEnabled() && isEdgeBrowser()) {
    let settled = false
    const fallbackToLegacy = () => {
      if (!settled && gen === generation && !finished) {
        settled = true
        youdao(() => nativeSpeak())
      }
    }
    speakWithEdgeTts(text, {
      slow,
      guard: () => gen === generation,
      onAudio: (el) => {
        // 接管 Edge TTS 的 audio 元素，使其可由 cancelSpeech / 下次点击取消
        currentAudio = el
        el.addEventListener(
          'ended',
          () => {
            if (currentAudio === el) currentAudio = null
          },
          { once: true }
        )
      },
    })
      .then((ok) => {
        if (ok && gen === generation && !finished) {
          settled = true
          finished = true
          done()
        } else {
          fallbackToLegacy()
        }
      })
      .catch(() => fallbackToLegacy())
    return
  }

  // ---- Level 0b: Kokoro 神经网络 TTS（WebGPU，仅英文首选）----
  // 仅当模型已就绪（已预热）时优先使用，避免首屏模型下载卡顿；
  // 失败或代次变更则无缝回落到原有「有道 → WebSpeech」链路。
  if (lang === 'en' && isKokoroEnabled() && isKokoroReady()) {
    let settled = false
    const fallbackToLegacy = () => {
      if (!settled && gen === generation && !finished) {
        settled = true
        youdao(() => nativeSpeak())
      }
    }
    speakWithKokoro(text, {
      slow,
      guard: () => gen === generation,
      onAudio: (el) => {
        // 接管 Kokoro 的 audio 元素，使其可由 cancelSpeech / 下次点击取消
        currentAudio = el
        el.addEventListener(
          'ended',
          () => {
            if (currentAudio === el) currentAudio = null
          },
          { once: true }
        )
      },
    })
      .then((ok) => {
        if (ok && gen === generation && !finished) {
          settled = true
          finished = true
          done()
        } else {
          fallbackToLegacy()
        }
      })
      .catch(() => fallbackToLegacy())
    return
  }

  // ---- 未走 Kokoro：走原有链路，并在后台预热 Kokoro（仅英文）----
  if (lang === 'en') warmupKokoro()
  youdao(() => nativeSpeak())
}

/**
 * 立即停止任何正在进行的朗读。
 * 组件卸载（离开页面/切换路由）时调用，避免语音残留。
 */
export function cancelSpeech() {
  // 复位所有在播按钮的动画状态
  flushPendingEnds()
  // 终止有道音频
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.removeAttribute('src')
      currentAudio.load()
    } catch {
      /* ignore */
    }
    currentAudio = null
  }
  // 终止原生语音合成
  try {
    window.speechSynthesis?.cancel()
  } catch {
    /* ignore */
  }
  // 代次失效，任何旧回调都不再生效
  generation++
}
