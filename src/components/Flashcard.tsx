// 共享闪卡组件：LessonPreview 与 StoryPage 的单词卡合并。
// 统一「emoji + 点词朗读(FcWord) + 正常/慢速发音 + 中文翻面」交互，
// 差异内容（音标/例句/自评按钮）通过 extra/footer 注入。

import FcWord from '@/components/FcWord'
import SpeakButton from '@/components/SpeakButton'

interface FlashcardProps {
  emoji?: string
  en: string
  zh: string
  ipa?: string
  showZh: boolean
  onToggleZh: () => void
  mcStyle?: React.CSSProperties
  /** 卡内附加内容（如例句），渲染在中文区之后 */
  extra?: React.ReactNode
  /** 底部操作区（如「会了/不会」自评按钮），仅在中文显示后出现 */
  footer?: React.ReactNode
}

export default function Flashcard({
  emoji,
  en,
  zh,
  ipa,
  showZh,
  onToggleZh,
  mcStyle,
  extra,
  footer,
}: FlashcardProps) {
  return (
    <div className="flashcard" style={mcStyle}>
      <div className="fc-emoji">{emoji ?? '✨'}</div>
      <div className="fc-word-row">
        <FcWord text={en} lang="en" />
      </div>
      <div className="fc-audio">
        <SpeakButton text={en} label={en} />
        <SpeakButton text={en} label={`${en} 慢速`} slow />
      </div>
      {ipa && <div className="fc-ipa">{ipa}</div>}
      {showZh ? (
        <div className="fc-zh" onClick={onToggleZh} title="点击隐藏中文">
          {zh}
        </div>
      ) : (
        <button type="button" className="fc-reveal" onClick={onToggleZh}>
          👀 显示中文
        </button>
      )}
      {showZh && footer}
      {extra}
    </div>
  )
}
