import { useCallback, useState } from 'react'

interface SpeakButtonProps {
  text: string
  label?: string
  /** slower rate for kids */
  slow?: boolean
}

/**
 * Universal pronunciation button.
 * Three-level fallback strategy (per project convention):
 *   1. native window.speechSynthesis
 *   2. 有道词典 TTS API (audio element)
 *   3. silent failure
 *
 * Must be triggered by a user gesture (onClick) to comply with mobile
 * browsers' autoplay policies.
 */
export default function SpeakButton({ text, label, slow = false }: SpeakButtonProps) {
  const [playing, setPlaying] = useState(false)

  const speak = useCallback(() => {
    try {
      setPlaying(true)
      const rate = slow ? 0.6 : 0.9

      // Level 1: native speechSynthesis
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
          utter.onend = () => {
            try {
              setPlaying(false)
            } catch {
              /* ignore */
            }
          }
          utter.onerror = () => {
            try {
              setPlaying(false)
            } catch {
              /* ignore */
            }
          }
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
        audio.onended = () => {
          try {
            setPlaying(false)
          } catch {
            /* ignore */
          }
        }
        audio.onerror = () => {
          try {
            setPlaying(false)
          } catch {
            /* ignore */
          }
        }
        void audio.play().catch(() => {
          try {
            setPlaying(false)
          } catch {
            /* ignore */
          }
        })
        return
      } catch {
        /* fall through to level 3 */
      }

      // Level 3: silent failure
      setPlaying(false)
    } catch {
      try {
        setPlaying(false)
      } catch {
        /* ignore */
      }
    }
  }, [text, slow])

  return (
    <button
      type="button"
      className={`speak-btn${playing ? ' is-playing' : ''}`}
      onClick={speak}
      aria-label={label ? `播放 ${label}` : `播放 ${text}`}
      title="点击发音"
    >
      <span aria-hidden="true">{playing ? '⏸' : '🔊'}</span>
    </button>
  )
}
