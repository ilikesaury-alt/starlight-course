/**
 * Universal pronunciation helper (extracted from SpeakButton).
 *
 * Three-level fallback strategy (per project convention):
 *   1. native window.speechSynthesis
 *   2. 有道词典 TTS API (audio element)
 *   3. silent failure
 *
 * Note: browsers require a recent user gesture before audio can play.
 * Word switching is always triggered by a click, so calling this from a
 * switch handler / effect is permitted in practice.
 */
export interface SpeakOptions {
  /** slower rate for kids (0.6) */
  slow?: boolean
  /** override rate; defaults to 0.9 (or 0.6 when slow) */
  rate?: number
  onStart?: () => void
  onEnd?: () => void
}

export function speakText(text: string, opts: SpeakOptions = {}) {
  const slow = !!opts.slow
  const rate = opts.rate ?? (slow ? 0.6 : 0.9)
  try {
    opts.onStart?.()
    const synth = window.speechSynthesis
    if (synth && typeof synth.cancel === 'function') {
      try {
        synth.cancel() // prevent audio overlap
      } catch {
        /* ignore */
      }
      try {
        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = 'en-US'
        utter.rate = rate
        utter.pitch = 1
        utter.onend = () => opts.onEnd?.()
        utter.onerror = () => opts.onEnd?.()
        synth.speak(utter)
        return
      } catch {
        /* fall through to level 2 */
      }
    }

    // Level 2: 有道词典 TTS API via hidden audio element
    try {
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`
      const audio = new Audio(url)
      audio.playbackRate = slow ? 0.6 : 1
      audio.onended = () => opts.onEnd?.()
      audio.onerror = () => opts.onEnd?.()
      void audio.play().catch(() => opts.onEnd?.())
      return
    } catch {
      /* fall through to level 3 */
    }

    // Level 3: silent failure
    opts.onEnd?.()
  } catch {
    opts.onEnd?.()
  }
}
