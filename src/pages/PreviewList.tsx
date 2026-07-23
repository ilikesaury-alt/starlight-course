import { Link } from 'react-router-dom'
import { modules } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'

export default function PreviewList() {
  const completedPreviews = useCourseStore((s) => s.completedPreviews)

  return (
    <div className="page preview-list">
      <div className="page-head" style={{ '--mc': '#5bc0eb' } as React.CSSProperties}>
        <span className="page-emoji">📖</span>
        <div>
          <div className="page-kicker">课前预习</div>
          <h1 className="page-title">预习导学 · 先学一步</h1>
        </div>
      </div>

      <p className="lead">上课前先看学习目标、听单词发音、读句型，上菲教课时更有自信！</p>

      <div className="module-grid">
        {modules.map((m) => {
          const done = completedPreviews.includes(m.slug)
          return (
            <Link
              key={m.id}
              to={`/preview/${m.slug}`}
              className="module-card"
              style={{ '--mc': m.color } as React.CSSProperties}
            >
              <div className="module-emoji">{m.emoji}</div>
              <div className="module-info">
                <div className="module-num">
                  Module {m.id} {done && '✅'}
                </div>
                <div className="module-title">{m.title}</div>
                <div className="module-zh">{m.titleZh}</div>
              </div>
              <div className="module-arrow">›</div>
            </Link>
          )
        })}
      </div>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
