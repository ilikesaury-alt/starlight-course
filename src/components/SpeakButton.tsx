import { useCallback, useState } from 'react'
import { speakText } from '../utils/speak'

interface SpeakButtonProps {
  text: string
  label?: string
  /** slower rate for kids */
  slow?: boolean
}

/**
 * Universal pronunciation button.
 * Reuses the shared `speakText` helper (three-level fallback strategy).
 *
 * Must be triggered by a user gesture (onClick) to comply with mobile
 * browsers' autoplay policies.
 */
export default function SpeakButton({ text, label, slow = false }: SpeakButtonProps) {
  const [playing, setPlaying] = useState(false)

  const speak = useCallback(() => {
    speakText(text, {
      slow,
      onStart: () => setPlaying(true),
      onEnd: () => setPlaying(false),
    })
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
