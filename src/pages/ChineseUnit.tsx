import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getUnit } from '@/data/chinese'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'
import SafeBoundary from '@/components/SafeBoundary'

export default function ChineseUnit() {
  const { unitId = '' } = useParams()
  const unit = getUnit(unitId)
  const reciteCheckins = useCourseStore((s) => s.reciteCheckins)
  const chineseQuiz = useCourseStore((s) => s.chineseQuiz)
  const completed = useCourseStore((s) => s.completedChinese)

  const mcStyle = moduleThemeVars(unit?.theme ?? { color: '#dc2626', colorSoft: '#fee2e2' })

  const stats = useMemo(() => {
    if (!unit) return { recited: 0, quizzed: 0, done: 0 }
    const recited = unit.lessons.filter((l) => (reciteCheckins[l.slug]?.length ?? 0) > 0).length
    const quizzed = unit.lessons.filter((l) => chineseQuiz[l.slug]).length
    const done = unit.lessons.filter((l) => completed.includes(l.slug)).length
    return { recited, quizzed, done }
  }, [unit, reciteCheckins, chineseQuiz, completed])

  if (!unit) {
    return (
      <div className="empty">
        <p>没有找到这个单元。</p>
        <Link to="/chinese" className="btn">返回语文课程</Link>
      </div>
    )
  }

  return (
    <div className="page cn-unit" style={mcStyle}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{unit.emoji}</span>
        <div>
          <div className="page-kicker">{unit.title}</div>
          <h1 className="page-title">{unit.titleZh}</h1>
        </div>
      </div>

      <div className="cn-unit-stat" style={mcStyle}>
        <span>📖 {unit.lessons.length} 课</span>
        <span>🎓 已学完 {stats.done}</span>
        <span>✅ 已背 {stats.recited}</span>
        <span>📝 已测 {stats.quizzed}</span>
      </div>

      <SafeBoundary label="课程列表">
        <div className="cn-lesson-list">
          {unit.lessons.map((l) => {
            const recited = (reciteCheckins[l.slug]?.length ?? 0) > 0
            const quiz = chineseQuiz[l.slug]
            return (
              <Link
                key={l.slug}
                to={`/chinese/${unit.slug}/${l.slug}`}
                className="cn-lesson-card"
                style={{ '--mc': unit.theme.color, '--mc-soft': unit.theme.colorSoft } as React.CSSProperties}
              >
                <span className="cn-lesson-emoji">{l.emoji}</span>
                <div className="cn-lesson-body">
                  <div className="cn-lesson-title">{l.title}</div>
                  <div className="cn-lesson-tags">
                    {l.poems && <span className="cn-tag">古诗词</span>}
                    {l.passages && <span className="cn-tag">课文</span>}
                    {l.hanzi && <span className="cn-tag">生字</span>}
                    {l.idioms && <span className="cn-tag">日积月累</span>}
                  </div>
                </div>
                <div className="cn-lesson-status">
                  {completed.includes(l.slug) && <span className="cn-done">🎓学</span>}
                  {recited && <span className="cn-done">✅背</span>}
                  {quiz && <span className="cn-done">📝测</span>}
                  <span className="cn-lesson-arrow">›</span>
                </div>
              </Link>
            )
          })}
        </div>
      </SafeBoundary>

      <div className="page-nav">
        <Link to="/chinese" className="back-link">← 语文课程</Link>
      </div>
    </div>
  )
}
