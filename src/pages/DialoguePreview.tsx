import { Link, useParams } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { getModule } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'

export default function DialoguePreview() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const markPreviewDone = useCourseStore((s) => s.markPreviewDone)

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/preview" className="btn">返回预习列表</Link>
      </div>
    )
  }

  // 将句子以问答对话形式展示，奇数索引为问句(左)，偶数索引为答句(右)
  const lines = mod.sentences.map((s, i) => ({
    ...s,
    side: i % 2 === 0 ? ('left' as const) : ('right' as const),
    speaker: i % 2 === 0 ? '👤 A' : '👨‍👩‍👧 B',
  }))

  return (
    <div className="page dialogue-preview">
      <div className="page-head" style={{ '--mc': mod.color } as React.CSSProperties}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · 对话练习</div>
          <h1 className="page-title">{mod.title}</h1>
        </div>
      </div>

      <SafeBoundary label="对话">
        <p className="lead">跟着对话练习说英语，点击 🔊 听一句读一句，和家长轮流扮演 A 和 B。</p>

        <div className="dialogue-list" style={{ display: 'flex', flexDirection: 'column' }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={`dialogue-bubble ${l.side}`}>
                <div className="dialogue-speaker">{l.speaker}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{l.en}</span>
                  <SpeakButton text={l.en} label={l.en} />
                </div>
                <div className="dialogue-zh">{l.zh}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '22px' }}>
          <button
            type="button"
            className="btn"
            onClick={() => markPreviewDone(unitId)}
          >
            ✅ 完成预习，标记完成
          </button>
        </div>
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/preview/${unitId}/patterns`} className="back-link">← 句型练习</Link>
        <Link to={`/preview/${unitId}`} className="btn">返回预习导学 →</Link>
      </div>
    </div>
  )
}
