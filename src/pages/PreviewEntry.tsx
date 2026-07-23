import { Link, useParams } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { getModule } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'

export default function PreviewEntry() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const markPreviewDone = useCourseStore((s) => s.markPreviewDone)
  const completed = useCourseStore((s) => s.completedPreviews.includes(unitId))

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/preview" className="btn">返回预习列表</Link>
      </div>
    )
  }

  const { preview } = mod

  const totalWords = mod.lessons.reduce((s, l) => s + l.words.length, 0)
  const totalSentences = mod.lessons.reduce((s, l) => s + l.sentences.length, 0)
  const features = [
    { to: 'vocab', emoji: '🎴', name: '单词卡 + 发音', desc: `${mod.lessons.length} 课 · 共 ${totalWords} 个单词` },
    { to: 'patterns', emoji: '💬', name: '句型练习', desc: `${mod.lessons.length} 课 · 共 ${totalSentences} 个句型` },
    { to: 'dialogue', emoji: '🎭', name: '对话练习', desc: '问答对话，角色扮演' },
  ]

  return (
    <div className="page preview-entry">
      <div className="page-head" style={{ '--mc': mod.color } as React.CSSProperties}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · 预习导学</div>
          <h1 className="page-title">{mod.title} — {mod.titleZh}</h1>
        </div>
      </div>

      <SafeBoundary label="预习">
        <section className="card">
          <h2 className="card-title">🎯 本课学习目标</h2>
          <ul className="goal-list">
            {preview.goals.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="card-title">🔑 重点单词</h2>
          <div className="key-words">
            <SpeakButton text={preview.keyWords} label="重点单词" />
            <span className="key-words-text">{preview.keyWords}</span>
          </div>
          <Link to={`/preview/${unitId}/vocab`} className="btn btn-soft">去单词卡练习 →</Link>
        </section>

        <section className="card">
          <h2 className="card-title">💬 重点句型</h2>
          <div className="key-sent">
            <SpeakButton text={preview.keySentences} label="重点句型" />
            <span className="key-sent-text">{preview.keySentences}</span>
          </div>
          <Link to={`/preview/${unitId}/patterns`} className="btn btn-soft">去句型练习 →</Link>
        </section>

        <section className="card tip-card">
          <h2 className="card-title">💡 预习小贴士（给家长）</h2>
          <p className="tip-text">{preview.tip}</p>
        </section>

        <h2 className="section-title">📚 本单元 8 课内容</h2>
        <div className="feature-grid">
          {mod.lessons.map((lesson) => (
            <div key={lesson.id} className="feature-card">
              <div className="feature-emoji">📖</div>
              <div className="feature-body">
                <div className="feature-name">Lesson {lesson.id} · {lesson.title} · {lesson.titleZh}</div>
                <div className="feature-desc">{lesson.words.length} 词 · {lesson.sentences.length} 句</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title">预习内容</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <Link key={f.to} to={`/preview/${unitId}/${f.to}`} className="feature-card">
              <div className="feature-emoji">{f.emoji}</div>
              <div className="feature-body">
                <div className="feature-name">{f.name}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
              <div className="feature-arrow">›</div>
            </Link>
          ))}
        </div>

        {!completed && (
          <div style={{ textAlign: 'center', marginTop: '22px' }}>
            <button
              type="button"
              className="btn"
              onClick={() => markPreviewDone(unitId)}
            >
              ✅ 标记预习完成
            </button>
          </div>
        )}
        {completed && (
          <p style={{ textAlign: 'center', marginTop: '18px', color: 'var(--ok)', fontWeight: 600 }}>
            ✅ 已完成预习，可以去复习啦！
          </p>
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to="/preview" className="back-link">← 预习列表</Link>
        <Link to={`/review/${unitId}`} className="btn">去复习 →</Link>
      </div>
    </div>
  )
}
