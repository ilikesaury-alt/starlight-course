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
  /** 自动朗读：置 true（或 text 变化）时自动播一遍 —— 用于「上一句/下一句」换句、框架卡换词 */
  autoPlay?: boolean
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
export default function SpeakButton({ text, label, slow = false, lang = 'en', autoPlay = false }: SpeakButtonProps) {
  const { playing, speak } = useAnimatedSpeak(text, { slow, lang })

  // 中文按钮挂载即预热 Edge TTS 模块（轻量 CDN），让首次点击即低延迟、跟手。
  // 英文不在此预热（Kokoro 模型约 80MB，保持点击时再懒加载）。
  useEffect(() => {
    if (lang === 'zh') warmupEdgeTts()
  }, [lang])

  // 自动播放：autoPlay 置 true 或 text 变化时各播一遍（换句 / 换词都会走 text 变化这一路）。
  // 由真实点击触发（用户手势），符合自动播放策略。
  // 不能用 ref「只播一次」守卫：StrictMode 开发态会 跑effect→清理(取消音频)→再跑effect，
  // ref 守卫会把第二次挡住，导致有点击却完全不出声；这里每次 effect 运行都重新播，
  // 重复触发由全局唯一发声者机制兜底（后播的会顶掉先播的，不会叠声）。
  useEffect(() => {
    if (autoPlay) speak()
  }, [autoPlay, speak])

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
