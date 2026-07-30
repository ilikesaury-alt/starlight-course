import { useAnimatedSpeak } from '../utils/speakerControl'

interface FcWordProps {
  text: string
  lang?: 'en' | 'zh'
  className?: string
}

/**
 * 大字「点词朗读」按钮（如复习卡上的单词本身）。
 * 复用与 SpeakButton 完全相同的 useAnimatedSpeak，从而：
 *   - 带 ⏸/🔊 动画反馈（is-playing 类）；
 *   - 参与全局唯一发声者（点它会强制结束其它正在播放的按钮）；
 *   - 享 12/18s 安全定时器兜底，不会卡在「播放中」。
 *
 * 用独立组件包裹 hook，便于在列表 .map 中安全使用（每个实例独立调用 hook）。
 */
export default function FcWord({ text, lang = 'en', className = 'fc-word' }: FcWordProps) {
  const { playing, speak } = useAnimatedSpeak(text, { lang })
  return (
    <button
      type="button"
      className={`${className}${playing ? ' is-playing' : ''}`}
      onClick={speak}
    >
      {text}
    </button>
  )
}
