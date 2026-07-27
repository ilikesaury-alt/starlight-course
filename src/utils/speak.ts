/**
 * Universal pronunciation helper.
 *
 * Three-level fallback strategy:
 *   1. 有道词典 TTS API (audio element) — 可靠，作为主方案
 *   2. native window.speechSynthesis — 有道失败时兜底
 *   3. silent failure
 */

export interface SpeakOptions {
  /** slower rate for kids (0.6) */
  slow?: boolean
  /** override rate; defaults to 0.9 (or 0.6 when slow) */
  rate?: number
  onStart?: () => void
  onEnd?: () => void
}

/** 上一次播放的 Audio 引用，用于取消重叠播放 */
let currentAudio: HTMLAudioElement | null = null

export function speakText(text: string, opts: SpeakOptions = {}) {
  if (!text?.trim()) return

  const slow = !!opts.slow
  const rate = opts.rate ?? (slow ? 0.6 : 0.9)
  opts.onStart?.()

  let finished = false
  const done = () => {
    if (!finished) {
      finished = true
      opts.onEnd?.()
    }
  }

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

  // Level 1: 有道词典 TTS
  const youdao = (onComplete?: () => void) => {
    try {
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=1`
      const audio = new Audio(url)
      audio.playbackRate = slow ? 0.6 : 1
      currentAudio = audio

      let settled = false
      const settle = () => {
        if (!settled) {
          settled = true
          if (currentAudio === audio) currentAudio = null
          onComplete?.()
        }
      }

      audio.onended = settle
      audio.onerror = settle

      // 5s 超时：有道服务器挂起时降级到 speechSynthesis
      const timer = setTimeout(() => {
        if (!settled) {
          try {
            audio.pause()
            audio.removeAttribute('src')
            audio.load()
          } catch {
            /* ignore */
          }
          settle()
        }
      }, 5000)

      audio.addEventListener('ended', () => clearTimeout(timer), { once: true })
      audio.addEventListener('error', () => clearTimeout(timer), { once: true })

      void audio.play().catch(() => {
        if (!settled) {
          settle()
        }
      })
    } catch {
      onComplete?.()
    }
  }

  // Level 2: speechSynthesis 兜底
  const nativeSpeak = () => {
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
      utter.onend = () => done()
      utter.onerror = () => done()
      synth.speak(utter)
    } catch {
      done()
    }
  }

  // 先尝试有道，失败后降级到 speechSynthesis
  youdao(() => nativeSpeak())
}
