import { Link } from 'react-router-dom'
import { modules } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'

export default function Progress() {
  const totalStars = useCourseStore((s) => s.totalStars)
  const masteredWords = useCourseStore((s) => s.masteredWords)
  const wrongWords = useCourseStore((s) => s.wrongWords)
  const completedPreviews = useCourseStore((s) => s.completedPreviews)
  const completedQuizzes = useCourseStore((s) => s.completedQuizzes)
  const resetAll = useCourseStore((s) => s.resetAll)

  const totalWords = modules.reduce((sum, m) => sum + m.words.length, 0)

  const stats = [
    { emoji: '⭐', value: totalStars, label: '累计星星' },
    { emoji: '✅', value: masteredWords.length, label: `已掌握单词 / ${totalWords}` },
    { emoji: '📋', value: wrongWords.length, label: '错题本' },
    { emoji: '📖', value: completedPreviews.length, label: `已预习 / ${modules.length}` },
  ]

  return (
    <div className="page progress">
      <div className="page-head" style={{ '--mc': '#fbbf24' } as React.CSSProperties}>
        <span className="page-emoji">📊</span>
        <div>
          <div className="page-kicker">学习进度</div>
          <h1 className="page-title">我的成长记录</h1>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-emoji">{s.emoji}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="section-title">各模块进度</h2>
      <div className="unit-progress-grid">
        {modules.map((m) => {
          const previewDone = completedPreviews.includes(m.slug)
          const quizDone = completedQuizzes.includes(m.slug)
          const masteredCount = m.words.filter((w) =>
            masteredWords.includes(w.en)
          ).length
          return (
            <div key={m.id} className="unit-progress-card">
              <div className="unit-progress-emoji">{m.emoji}</div>
              <div className="unit-progress-name">{m.title}</div>
              <div className={'unit-progress-status' + (previewDone ? ' done' : '')}>
                {previewDone ? '✅ 预习' : '⬜ 预习'} · {quizDone ? '✅ 测验' : '⬜ 测验'}
              </div>
              <div className="unit-progress-status">
                单词 {masteredCount}/{m.words.length}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          type="button"
          className="btn btn-soft"
          onClick={() => {
            if (confirm('确定重置所有进度吗？此操作不可撤销。')) resetAll()
          }}
        >
          🔄 重置全部数据
        </button>
      </div>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
        <Link to="/review" className="btn">去复习 →</Link>
      </div>
    </div>
  )
}
