import { Link } from 'react-router-dom'
import { STARLIGHT_THEME } from '../data/starlight'
import { MODULE_LIST, moduleThemeOf } from '../data/modules'
import { useCourseStore } from '../store/useCourseStore'
import { countMastered } from '../utils/words'
import { moduleThemeVars } from '../utils/theme'

export default function ReviewList() {
  const masteredWords = useCourseStore((s) => s.masteredWords)
  const todayDue = useCourseStore((s) => s.getTodayDueCount())
  const getTodayDueCount = useCourseStore((s) => s.getTodayDueCount)
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

      <h2 className="section-title">🧩 选择复习模块</h2>

      <div className="module-grid">
        {MODULE_LIST.map((m) => {
          const due = getTodayDueCount(m.id)
          const allWords = m.items.flatMap((it) => m.getWords(it.id))
          const masteredCount = countMastered(allWords, masteredWords)
          const total = allWords.length
          return (
            <Link
              key={m.id}
              to={`/review/${m.id}`}
              className="module-card"
              style={moduleThemeVars(moduleThemeOf(m.id))}
            >
              <div className="module-emoji">{m.kind === 'unit' ? '📚' : '📖'}</div>
              <div className="module-info">
                <div className="module-num">{m.label}</div>
                <div className="module-title">{m.labelZh}</div>
                <div className="module-zh">
                  {m.kind === 'unit' ? '按单元复习' : '按故事复习'} · 掌握 {masteredCount}/{total}
                </div>
              </div>
              {due > 0 && <div className="module-lessons-badge module-due">{due} 到期</div>}
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
