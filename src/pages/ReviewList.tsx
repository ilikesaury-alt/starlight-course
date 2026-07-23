import { Link } from 'react-router-dom'
import { modules } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'

export default function ReviewList() {
  const masteredWords = useCourseStore((s) => s.masteredWords)

  return (
    <div className="page review-list">
      <div className="page-head" style={{ '--mc': '#9be564', '--mc-soft': '#ecfccb' } as React.CSSProperties}>
        <span className="page-emoji">🔁</span>
        <div>
          <div className="page-kicker">课后复习</div>
          <h1 className="page-title">复习巩固 · 越练越熟</h1>
        </div>
      </div>

      <p className="lead">上完课后复习单词、做听力测验，错题自动进入错题本。</p>

      <div className="module-grid">
        {modules.map((m) => {
          const allWords = m.lessons.flatMap((l) => l.words)
          const masteredCount = allWords.filter((w) =>
            masteredWords.includes(w.en)
          ).length
          const total = allWords.length
          return (
            <Link
              key={m.id}
              to={`/review/${m.slug}`}
              className="module-card"
              style={{ '--mc': m.color, '--mc-soft': m.colorSoft } as React.CSSProperties}
            >
              <div className="module-emoji">{m.emoji}</div>
              <div className="module-info">
                <div className="module-num">Module {m.id}</div>
                <div className="module-title">{m.title}</div>
                <div className="module-zh">
                  {m.titleZh} · 掌握 {masteredCount}/{total}
                </div>
              </div>
              <div className="module-lessons-badge">{m.lessons.length} 课</div>
              <div className="module-arrow">›</div>
            </Link>
          )
        })}
      </div>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
        <Link to="/wrong" className="btn btn-soft">📋 错题本</Link>
      </div>
    </div>
  )
}
