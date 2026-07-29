import { Link, useParams } from 'react-router-dom'
import { getModuleMeta, moduleThemeOf } from '../data/modules'
import { getModule } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'
import { countMastered } from '../utils/words'
import { moduleThemeVars } from '../utils/theme'

export default function ReviewEntry() {
  const { moduleId = '', itemId = '' } = useParams()
  const meta = getModuleMeta(moduleId)
  const item = meta?.items.find((i) => i.id === itemId)
  const masteredWords = useCourseStore((s) => s.masteredWords)
  const completedQuizzes = useCourseStore((s) => s.completedQuizzes)

  if (!meta || !item) {
    return (
      <div className="empty">
        <p>没有找到这个复习项。</p>
        <Link to="/review" className="btn">返回复习列表</Link>
      </div>
    )
  }

  const mcStyle = moduleThemeVars(moduleThemeOf(moduleId))

  // 汇总该复习项的单词用于统计掌握情况
  const allWords = meta.getWords(item.id)
  const masteredCount = countMastered(allWords, masteredWords)
  const total = allWords.length

  // Starlight 单元额外有听力测验；故事类复用其「闯关」练习
  const features: { to: string; emoji: string; name: string; desc: string }[] = [
    { to: 'vocab', emoji: '🎴', name: '单词复习', desc: `掌握 ${masteredCount}/${total}` },
  ]
  if (meta.kind === 'unit') {
    const mod = getModule(item.id)
    features.push({
      to: 'quiz',
      emoji: '🎯',
      name: '听力测验',
      desc: `共 ${mod?.quiz.length ?? 0} 道题${completedQuizzes.includes(item.id) ? ' · 已完成 ✅' : ''}`,
    })
  } else {
    features.push({
      to: '',
      emoji: '🚀',
      name: '闯关练习',
      desc: '回到故事做闯关',
    })
  }

  return (
    <div className="page review-entry" style={mcStyle}>
      <div className="unit-banner" style={mcStyle}>
        <span className="unit-emoji">{item.emoji || '📖'}</span>
        <div>
          <div className="unit-num">{meta.label} · 复习</div>
          <h1 className="unit-title">
            {meta.kind === 'unit' ? `Unit ${item.id}` : item.title}
          </h1>
          <div className="unit-zh">{meta.kind === 'unit' ? item.titleZh : meta.labelZh}</div>
        </div>
      </div>

      <div className="mode-badge mode-review">🔁 复习模式 · 课后巩固一遍</div>

      <div className="feature-grid">
        {features.map((f) => {
          const to =
            f.to === ''
              ? `/${moduleId}/${item.id}` // 故事类闯关：跳回故事页
              : `/review/${moduleId}/${item.id}/${f.to}`
          return (
            <Link key={f.name} to={to} className="feature-card" style={mcStyle}>
              <div className="feature-step">{f.emoji}</div>
              <div className="feature-body">
                <div className="feature-name">{f.name}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
              <div className="feature-arrow">›</div>
            </Link>
          )
        })}
      </div>

      <div className="page-nav">
        <Link to={`/review/${moduleId}`} className="back-link">← 复习列表</Link>
        <Link to="/wrong" className="btn btn-soft">📋 错题本</Link>
      </div>
    </div>
  )
}
