import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEngUnit } from '@/data/eng3a'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'
import SafeBoundary from '@/components/SafeBoundary'

export default function Eng3aUnit() {
  const { unitId = '' } = useParams()
  const unit = getEngUnit(unitId)
  const recite = useCourseStore((s) => s.eng3aRecite)
  const quiz = useCourseStore((s) => s.eng3aQuiz)

  const mcStyle = moduleThemeVars(unit?.theme ?? { color: '#2563eb', colorSoft: '#dbeafe' })

  const stats = useMemo(() => {
    if (!unit) return { read: 0, quizzed: 0 }
    const read = unit.lessons.filter((l) => (recite[l.slug]?.length ?? 0) > 0).length
    const quizzed = unit.lessons.filter((l) => quiz[l.slug]).length
    return { read, quizzed }
  }, [unit, recite, quiz])

  if (!unit) {
    return (
      <div className="empty">
        <p>没有找到这个单元。</p>
        <Link to="/eng3a" className="btn">返回英语课程</Link>
      </div>
    )
  }

  return (
    <div className="page en3-unit" style={mcStyle}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{unit.emoji}</span>
        <div>
          <div className="page-kicker">{unit.title}</div>
          <h1 className="page-title">{unit.titleZh}</h1>
        </div>
      </div>

      {unit.cover && (
        <img className="en3-cover" src={unit.cover} alt={unit.titleZh} loading="lazy" />
      )}

      <div className="cn-unit-stat" style={mcStyle}>
        <span>📖 {unit.lessons.length} 课</span>
        <span>✅ 已读 {stats.read}</span>
        <span>📝 已测 {stats.quizzed}</span>
      </div>

      <SafeBoundary label="课程列表">
        <div className="cn-lesson-list">
          {unit.lessons.map((l) => {
            const read = (recite[l.slug]?.length ?? 0) > 0
            const q = quiz[l.slug]
            return (
              <Link
                key={l.slug}
                to={`/eng3a/${unit.slug}/${l.slug}`}
                className="cn-lesson-card"
                style={{ '--mc': unit.theme.color, '--mc-soft': unit.theme.colorSoft } as React.CSSProperties}
              >
                <span className="cn-lesson-emoji">{l.emoji}</span>
                <div className="cn-lesson-body">
                  <div className="cn-lesson-title">
                    第 {l.id} 课 · {l.title}
                    {l.topic && <span className="cn-lesson-topic"> {l.topic}</span>}
                  </div>
                  <div className="cn-lesson-tags">
                    {l.words && <span className="cn-tag">词汇</span>}
                    {l.dialogs && <span className="cn-tag">句型</span>}
                    {(l.chant || l.letters) && <span className="cn-tag">歌谣/字母</span>}
                    <span className="cn-tag">自测</span>
                  </div>
                </div>
                <div className="cn-lesson-status">
                  {read && <span className="cn-done">✅读</span>}
                  {q && <span className="cn-done">📝测</span>}
                  <span className="cn-lesson-arrow">›</span>
                </div>
              </Link>
            )
          })}
        </div>
      </SafeBoundary>

      {unit.gallery.length > 0 && (
        <div className="en3-gallery">
          <div className="en3-gallery-title">🖼️ 本课插图（来自原版教材）</div>
          <div className="en3-gallery-grid">
            {unit.gallery.map((src, i) => (
              <img key={i} src={src} alt={`${unit.titleZh} 插图 ${i + 1}`} loading="lazy" />
            ))}
          </div>
        </div>
      )}

      <div className="page-nav">
        <Link to="/eng3a" className="back-link">← 英语课程</Link>
      </div>
    </div>
  )
}
