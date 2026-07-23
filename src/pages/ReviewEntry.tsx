import { Link, useParams } from 'react-router-dom'
import { getModule } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'

export default function ReviewEntry() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const masteredWords = useCourseStore((s) => s.masteredWords)
  const completedQuizzes = useCourseStore((s) => s.completedQuizzes)

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/review" className="btn">返回复习列表</Link>
      </div>
    )
  }

  // 汇总所有 lesson 的单词用于统计掌握情况
  const allWords = mod.lessons.flatMap((l) => l.words)
  const masteredCount = allWords.filter((w) =>
    masteredWords.includes(w.en)
  ).length
  const total = allWords.length
  const quizDone = completedQuizzes.includes(unitId)

  const features = [
    { to: 'vocab', emoji: '🎴', name: '单词复习', desc: `${mod.lessons.length} 课 · 掌握 ${masteredCount}/${total}` },
    { to: 'quiz', emoji: '🎯', name: '听力测验', desc: `${mod.quiz.length} 道题${quizDone ? ' · 已完成 ✅' : ''}` },
  ]

  return (
    <div className="page review-entry">
      <div className="unit-banner" style={{ '--mc': mod.color } as React.CSSProperties}>
        <span className="unit-emoji">{mod.emoji}</span>
        <div>
          <div className="unit-num">Module {mod.id} · 复习</div>
          <h1 className="unit-title">{mod.title}</h1>
          <div className="unit-zh">{mod.titleZh}</div>
        </div>
      </div>

      <div className="feature-grid">
        {features.map((f) => (
          <Link key={f.to} to={`/review/${unitId}/${f.to}`} className="feature-card">
            <div className="feature-emoji">{f.emoji}</div>
            <div className="feature-body">
              <div className="feature-name">{f.name}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
            <div className="feature-arrow">›</div>
          </Link>
        ))}
      </div>

      <div className="page-nav">
        <Link to="/review" className="back-link">← 复习列表</Link>
        <Link to="/wrong" className="btn btn-soft">📋 错题本</Link>
      </div>
    </div>
  )
}
