/**
 * Universal pronunciation helper (extracted from SpeakButton).
 *
 * Three-level fallback strategy (per project convention):
 *   1. native window.speechSynthesis
 *   2. 有道词典 TTS API (audio element)
 *   3. silent failure
 *
 * Robustness (added for cross-browser compat with EXTERNAL browsers):
 *   - Chrome desktop / iOS Safari can fail the FIRST speechSynthesis.speak()
 *     silently (no onend, no onerror) when voices aren't ready or the engine
 *     is busy. We detect that and fall back to 有道 TTS after a short timeout.
 *   - Voices are pre-warmed (module load + first user gesture) so later calls
 *     have a voice loaded, fixing "first speak is silent" on iOS/Chrome.
 */

export interface SpeakOptions {
  /** slower rate for kids (0.6) */
  slow?: boolean
  /** override rate; defaults to 0.9 (or 0.6 when slow) */
  rate?: number
  onStart?: () => void
  onEnd?: () => void
}

// --- pre-warm voices so speechSynthesis has a voice loaded ---
// Fixes iOS Safari / Chrome "first speak is silent" where the engine isn't ready.
let voicesWarmed = false
function warmVoices() {
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    if (synth.getVoices().length) {
      voicesWarmed = true
      return
    }
    const onReady = () => {
      voicesWarmed = true
      try {
        synth.onvoiceschanged = null
      } catch {
        /* ignore */
      }
    }
    synth.onvoiceschanged = onReady
    // trigger async voice list load
    synth.getVoices()
  } catch {
    /* ignore */
  }
}
warmVoices()
// Some browsers (iOS Safari) only unlock voices after a real user gesture.
if (typeof window !== 'undefined') {
  const once = () => {
    warmVoices()
    try {
      window.removeEventListener('pointerdown', once)
      window.removeEventListener('keydown', once)
    } catch {
      /* ignore */
    }
  }
  try {
    window.addEventListener('pointerdown', once, { once: true })
    window.addEventListener('keydown', once, { once: true })
  } catch {
    /* ignore */
  }
}

export function speakText(text: string, opts: SpeakOptions = {}) {
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

  const synth = window.speechSynthesis
  if (synth && typeof synth.cancel === 'function') {
    try {
      synth.cancel() // prevent audio overlap
    } catch {
      /* ignore */
    }

    let fellBack = false
    const youdao = () => {
      if (fellBack) return
      fellBack = true
      try {
        const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`
        const audio = new Audio(url)
        audio.playbackRate = slow ? 0.6 : 1
        audio.onended = done
        audio.onerror = done
        // play() is wrapped because external browsers reject it under autoplay policy
        void audio.play().catch(done)
      } catch {
        done()
      }
    }

    try {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'en-US'
      utter.rate = rate
      utter.pitch = 1
      let settled = false
      utter.onend = () => {
        settled = true
        done()
      }
      utter.onerror = () => {
        settled = true
        youdao() // speechSynthesis failed -> try 有道
      }
      synth.speak(utter)
      // Chrome/iOS sometimes swallow the first speak() silently (no callbacks).
      // If neither onend nor onerror fires within 800ms, assume failure -> 有道.
      // (Manual click keeps user-activation alive well past 800ms, so 有道's
      //  audio.play() is still permitted by autoplay policy.)
      setTimeout(() => {
        if (!settled) {
          try {
            synth.cancel()
          } catch {
            /* ignore */
          }
          youdao()
        }
      }, 800)
      return
    } catch {
      youdao()
      return
    }
  }

  // No speechSynthesis available: use 有道 directly
  try {
    const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`
    const audio = new Audio(url)
    audio.playbackRate = slow ? 0.6 : 1
    audio.onended = done
    audio.onerror = done
    void audio.play().catch(done)
    return
  } catch {
    done()
  }
}
