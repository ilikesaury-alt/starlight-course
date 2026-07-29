import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SafeBoundary from '../components/SafeBoundary'
import { getModule, STARLIGHT_THEME } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'
import { moduleThemeVars } from '../utils/theme'

export default function LessonList() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const markPreviewDone = useCourseStore((s) => s.markPreviewDone)
  const completed = useCourseStore((s) => s.completedPreviews.includes(unitId))
  const [showGuide, setShowGuide] = useState(false)

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/preview" className="btn">返回预习列表</Link>
      </div>
    )
  }

  const mcStyle = moduleThemeVars(STARLIGHT_THEME)

  return (
    <div className="page lesson-list" style={mcStyle}>
      <div className="unit-banner" style={mcStyle}>
        <span className="unit-emoji">{mod.emoji}</span>
        <div>
          <div className="unit-num">Module {mod.id} · 预习</div>
          <h1 className="unit-title">{mod.title}</h1>
          <div className="unit-zh">{mod.titleZh}</div>
        </div>
      </div>

      <SafeBoundary label="课程列表">
        <button
          type="button"
          className="btn btn-soft btn-sm"
          style={{ marginTop: '14px' }}
          onClick={() => setShowGuide((v) => !v)}
        >
          {showGuide ? '收起单元导学 ▲' : '📋 单元导学（目标 & 家长贴士）▼'}
        </button>

        {showGuide && (
          <div style={{ marginTop: '10px', display: 'grid', gap: '10px' }}>
            <section className="card">
              <h2 className="card-title">🎯 本课学习目标</h2>
              <ul className="goal-list">
                {mod.preview.goals.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
            <section className="card tip-card">
              <h2 className="card-title">💡 预习小贴士（给家长）</h2>
              <p className="tip-text">{mod.preview.tip}</p>
            </section>
          </div>
        )}

        <h2 className="section-title">📚 本单元 {mod.lessons.length} 课</h2>
        <div className="lessons-overview" style={mcStyle}>
          {mod.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/preview/${unitId}/${lesson.id}`}
              className="lesson-row lesson-link"
              style={mcStyle}
            >
              <div className="lesson-row-num">{lesson.id}</div>
              <div className="lesson-row-title">
                Lesson {lesson.id}: {lesson.title}
                {lesson.titleZh && <span className="lr-zh">{lesson.titleZh}</span>}
              </div>
              <div className="lesson-row-count">{lesson.words.length} 词 · {lesson.sentences.length} 句</div>
              <span className="module-arrow">›</span>
            </Link>
          ))}
        </div>

        {!completed && (
          <div style={{ textAlign: 'center', marginTop: '22px' }}>
            <button
              type="button"
              className="btn btn-sun btn-lg"
              onClick={() => markPreviewDone(unitId)}
            >
              ✅ 标记本单元预习完成
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
        <Link to="/smart" className="btn">去复习 →</Link>
      </div>
    </div>
  )
}
