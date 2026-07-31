import { Link } from 'react-router-dom'
import { modules, STARLIGHT_THEME } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'
import { moduleThemeVars } from '../utils/theme'
import Breadcrumb from '@/components/Breadcrumb'

export default function PreviewList() {
  const completedPreviews = useCourseStore((s) => s.completedPreviews)
  const mcStyle = moduleThemeVars(STARLIGHT_THEME)

  return (
    <div className="page preview-list" style={mcStyle}>
      <Breadcrumb items={[{ label: '🏠', to: '/' }, { label: 'Starlight 预习', to: '/preview' }]} />
      <div className="page-head" style={mcStyle}>
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
              style={{ '--mc': m.color, '--mc-soft': m.colorSoft } as React.CSSProperties}
            >
              <div className="module-emoji">{m.emoji}</div>
              <div className="module-info">
                <div className="module-num">
                  Module {m.id} {done && '✅'}
                </div>
                <div className="module-title">{m.title}</div>
                <div className="module-zh">{m.titleZh}</div>
              </div>
              <div className="module-lessons-badge">{m.lessons.length} 课</div>
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
