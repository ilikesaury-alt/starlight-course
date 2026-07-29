import { Link, useParams, Navigate } from 'react-router-dom'
import { getModuleMeta, moduleThemeOf } from '../data/modules'
import { getModule } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'
import { moduleThemeVars } from '../utils/theme'

// 某模块的复习主页：列出该模块下的复习项（Starlight = 单元，故事类 = 故事）。
// 旧书签 /review/:unitSlug（单段，无模块前缀）会被重定向到 /review/starlight/:unitSlug。
export default function ModuleReviewHome() {
  const { moduleId = '' } = useParams()

  // 兼容旧路由：单段且是 Starlight 单元 slug → 重定向到带模块前缀的新路由
  if (!getModuleMeta(moduleId) && getModule(moduleId)) {
    return <Navigate to={`/review/starlight/${moduleId}`} replace />
  }

  const meta = getModuleMeta(moduleId)
  const masteredWords = useCourseStore((s) => s.masteredWords)
  const completedQuizzes = useCourseStore((s) => s.completedQuizzes)

  if (!meta) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/review" className="btn">返回复习列表</Link>
      </div>
    )
  }

  const mcStyle = moduleThemeVars(moduleThemeOf(moduleId))

  return (
    <div className="page review-entry" style={mcStyle}>
      <div className="unit-banner" style={mcStyle}>
        <span className="unit-emoji">{meta.kind === 'unit' ? '📚' : '📖'}</span>
        <div>
          <div className="unit-num">{meta.label} · 复习</div>
          <h1 className="unit-title">{meta.labelZh}</h1>
          <div className="unit-zh">选择下方{meta.kind === 'unit' ? '单元' : '故事'}进行课后巩固</div>
        </div>
      </div>

      <div className="mode-badge mode-review">🔁 复习模式 · 哪里不熟练哪里</div>

      <div className="feature-grid">
        {meta.items.map((item) => {
          const words = meta.getWords(item.id)
          const total = words.length
          const masteredCount = words.filter((w) => masteredWords.includes(w.en)).length
          const quizDone = meta.kind === 'unit' && completedQuizzes.includes(item.id)
          return (
            <Link
              key={item.id}
              to={`/review/${moduleId}/${item.id}`}
              className="feature-card"
              style={mcStyle}
            >
              <div className="feature-step">{item.emoji}</div>
              <div className="feature-body">
                <div className="feature-name">
                  {meta.kind === 'unit' ? `Unit ${item.id}` : item.title}
                  {quizDone && <span className="feature-done"> · 已完成 ✅</span>}
                </div>
                <div className="feature-desc">
                  {meta.kind === 'unit' ? item.titleZh : ''} · 掌握 {masteredCount}/{total}
                </div>
              </div>
              <div className="feature-arrow">›</div>
            </Link>
          )
        })}
      </div>

      <div className="page-nav">
        <Link to="/review" className="back-link">← 复习列表</Link>
        <Link to="/wrong" className="btn btn-soft">📋 错题本</Link>
      </div>
    </div>
  )
}
