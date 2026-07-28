import { Link } from 'react-router-dom'
import { modules, STARLIGHT_THEME } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'
import { moduleThemeVars } from '../utils/theme'

export default function ReviewList() {
  const masteredWords = useCourseStore((s) => s.masteredWords)
  const todayDue = useCourseStore((s) => s.getTodayDueCount())
  const mcStyle = moduleThemeVars(STARLIGHT_THEME)

  return (
    <div className="page review-list" style={mcStyle}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">🔁</span>
        <div>
          <div className="page-kicker">课后复习</div>
          <h1 className="page-title">复习巩固 · 越练越熟</h1>
        </div>
      </div>

      <p className="lead">上完课后复习单词、做听力测验，错题自动进入错题本。</p>

      <Link to="/smart" className={'smart-list-entry' + (todayDue > 0 ? ' has-due' : '')}>
        <span className="smart-list-emoji">🎯</span>
        <div className="smart-list-body">
          <div className="smart-list-title">智能复习 · 科学编排</div>
          <div className="smart-list-sub">
            {todayDue > 0
              ? <>今天有 <b>{todayDue}</b> 个单词到期，跟着节奏练就好</>
              : <>暂无到期单词，去看看新内容吧</>}
          </div>
        </div>
        {todayDue > 0 && <span className="smart-list-badge">{todayDue}</span>}
        <span className="smart-list-arrow">›</span>
      </Link>

      <h2 className="section-title">📚 按单元自主复习</h2>

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
