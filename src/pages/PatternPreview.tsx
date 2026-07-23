import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { getModule } from '../data/starlight'

export default function PatternPreview() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const [lessonIdx, setLessonIdx] = useState(0)

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/preview" className="btn">返回预习列表</Link>
      </div>
    )
  }

  const lessons = mod.lessons
  const lesson = lessons[lessonIdx]
  const sentences = lesson ? lesson.sentences : []

  return (
    <div className="page pattern-preview">
      <div className="page-head" style={{ '--mc': mod.color } as React.CSSProperties}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · 句型练习</div>
          <h1 className="page-title">{mod.title}</h1>
        </div>
      </div>

      <SafeBoundary label="句型">
        <p className="lead">点击 🔊 听整句，再跟读。括号里的内容可以替换练习。</p>

        <div
          className="lesson-tabs"
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            padding: '4px 2px 10px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {lessons.map((l, i) => {
            const active = i === lessonIdx
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLessonIdx(i)}
                style={{
                  flex: '0 0 auto',
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: `1px solid ${active ? mod.color : 'var(--line)'}`,
                  background: active ? mod.color : 'var(--card)',
                  color: active ? '#fff' : 'var(--brand)',
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                L{l.id} · {l.title}
              </button>
            )
          })}
        </div>

        {lesson && (
          <div style={{ fontSize: 15, fontWeight: 700, margin: '4px 2px 0' }}>
            Lesson {lesson.id}: {lesson.title} · {lesson.titleZh}
          </div>
        )}

        <div className="sent-list">
          {sentences.map((s, i) => (
            <div key={i} className="sent-card">
              <div className="sent-en-row">
                <span className="sent-en">{s.en}</span>
                <SpeakButton text={s.en} label={s.en} />
                <SpeakButton text={s.en} label={`${s.en} 慢速`} slow />
              </div>
              <div className="sent-zh">{s.zh}</div>
              {s.hint && <div className="sent-hint">💡 {s.hint}</div>}
            </div>
          ))}
        </div>

        <section className="card role-card">
          <h2 className="card-title">🎭 角色扮演</h2>
          <p className="role-text">
            家长和孩子轮流读句子，一方读问句，一方读答句。例如：
          </p>
          <div className="role-demo">
            {sentences.slice(0, 2).map((s, i) => (
              <div key={i}>
                <b>{i === 0 ? '家长' : '孩子'}：</b>{s.en} <SpeakButton text={s.en} />
              </div>
            ))}
          </div>
        </section>
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/preview/${unitId}`} className="back-link">← 预习导学</Link>
        <Link to={`/preview/${unitId}/dialogue`} className="btn">下一步：对话练习 →</Link>
      </div>
    </div>
  )
}
