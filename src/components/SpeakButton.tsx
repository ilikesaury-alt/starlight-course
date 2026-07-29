import { useCallback, useEffect, useRef, useState } from 'react'
import { speakText, cancelSpeech } from '../utils/speak'

interface SpeakButtonProps {
  text: string
  label?: string
  /** slower rate for kids */
  slow?: boolean
  /** 'en' (default) or 'zh' (Chinese) — picks the right voice + TTS engine */
  lang?: 'en' | 'zh'
}

/**
 * Universal pronunciation button.
 * Reuses the shared `speakText` helper (three-level fallback strategy).
 *
 * Must be triggered by a user gesture (onClick) to comply with mobile
 * browsers' autoplay policies.
 */
export default function SpeakButton({ text, label, slow = false, lang = 'en' }: SpeakButtonProps) {
  const [playing, setPlaying] = useState(false)
  // 跟踪本按钮是否正在发声，卸载时据此决定是否停止
  const activeRef = useRef(false)

  const speak = useCallback(() => {
    activeRef.current = true
    speakText(text, {
      slow,
      lang,
      onStart: () => {
        activeRef.current = true
        setPlaying(true)
      },
      onEnd: () => {
        activeRef.current = false
        setPlaying(false)
      },
    })
  }, [text, slow, lang])

  // 离开页面 / 组件卸载时，若本按钮正在发声则立即停止，
  // 避免语音在路由切换后仍残留播放。
  useEffect(
    () => () => {
      if (activeRef.current) cancelSpeech()
    },
    []
  )

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
