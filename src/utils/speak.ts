/**
 * Universal pronunciation helper.
 *
 * Two-level fallback strategy:
 *   1. 有道词典 TTS (audio 元素) — 音质好，作为主方案（需要网络）
 *   2. Web Speech API (window.speechSynthesis) — 浏览器原生、离线可用，作为兜底
 *   3. 两级都失败则静默
 *
 * 稳定性增强：
 *   - 预载 speechSynthesis 的 voices 并监听 voiceschanged，避免 getVoices 为空时静默
 *   - speak 前若 synthesis 处于 paused 则 resume()，并显式指定 en-US voice
 *   - 有道仅在「2.5s 内从未开始播放」时才降级，不打断正在朗读的句子
 *   - 兜底 native speak 若静默无回调（Chrome 假死），自动复位按钮以便重试
 */

export interface SpeakOptions {
  /** slower rate for kids (0.6) */
  slow?: boolean
  /** override rate; defaults to 0.9 (or 0.6 when slow) */
  rate?: number
  onStart?: () => void
  onEnd?: () => void
}

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

  // Level 1: 有道词典 TTS
  const youdao = (onComplete?: () => void) => {
    try {
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=1`
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
      utter.lang = 'en-US'
      utter.rate = rate
      utter.pitch = 1
      const voice = pickVoice()
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

  // 先尝试有道，失败后降级到 speechSynthesis
  youdao(() => nativeSpeak())
}
