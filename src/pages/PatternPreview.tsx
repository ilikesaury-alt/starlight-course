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

  const mcStyle = { '--mc': mod.color, '--mc-soft': mod.colorSoft } as React.CSSProperties
  const lessons = mod.lessons
  const lesson = lessons[lessonIdx]
  const sentences = lesson ? lesson.sentences : []

  return (
    <div className="page pattern-preview">
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · 句型练习</div>
          <h1 className="page-title">{mod.title}</h1>
        </div>
      </div>

      <SafeBoundary label="句型">
        <div className="mode-badge mode-preview">📖 预习模式</div>
        <p className="lead">点击 🔊 听整句，再跟读。括号里的内容可以替换练习。</p>

        <div className="lesson-switcher" style={mcStyle}>
          {lessons.map((l, i) => (
            <button
              key={l.id}
              type="button"
              className={'lesson-pill' + (i === lessonIdx ? ' active' : '')}
              onClick={() => setLessonIdx(i)}
            >
              <span className="lp-num">L{l.id}</span>
              <span>{l.title}</span>
            </button>
          ))}
        </div>

        {lesson && (
          <div className="lesson-current" style={mcStyle}>
            <div className="lesson-current-num">{lesson.id}</div>
            <div>
              <span className="lesson-current-title">Lesson {lesson.id}: {lesson.title}</span>
              {lesson.titleZh && <span className="lesson-current-zh">{lesson.titleZh}</span>}
            </div>
          </div>
        )}

        <div className="sent-list">
          {sentences.map((s, i) => (
            <div key={i} className="sent-card" style={mcStyle}>
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
          <div className="role-demo" style={mcStyle}>
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
