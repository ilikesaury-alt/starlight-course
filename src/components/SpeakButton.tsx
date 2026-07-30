import { useEffect } from 'react'
import { useAnimatedSpeak } from '../utils/speakerControl'
import { warmupEdgeTts } from '../utils/engine/edgeTts'

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
 * Reuses the shared `speakText` helper (progressive fallback strategy) and the
 * shared `useAnimatedSpeak` hook (global single-speaker + safety timer), so it
 * stays perfectly consistent with every other play trigger (custom fc-word,
 * auto-read, etc.).
 *
 * Must be triggered by a user gesture (onClick) to comply with mobile
 * browsers' autoplay policies.
 */
export default function SpeakButton({ text, label, slow = false, lang = 'en' }: SpeakButtonProps) {
  const { playing, speak } = useAnimatedSpeak(text, { slow, lang })

  // 中文按钮挂载即预热 Edge TTS 模块（轻量 CDN），让首次点击即低延迟、跟手。
  // 英文不在此预热（Kokoro 模型约 80MB，保持点击时再懒加载）。
  useEffect(() => {
    if (lang === 'zh') warmupEdgeTts()
  }, [lang])

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
