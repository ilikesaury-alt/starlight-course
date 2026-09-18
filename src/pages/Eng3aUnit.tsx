// 单元页：把本单元的五关按「学习路径」顺序铺开，
// 每关显示关卡序号、关卡名、互动形式与完成状态 —— 孩子按顺序点下去就行。

import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import { getEngUnit, stageOf, ENG_STAGES, ENG3A_THEME } from '@/data/eng3a'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

export default function Eng3aUnit() {
  const { unitId = '' } = useParams()
  const unit = getEngUnit(unitId)
  const recite = useCourseStore((s) => s.eng3aRecite)
  const quiz = useCourseStore((s) => s.eng3aQuiz)
  const completed = useCourseStore((s) => s.completedEng3a)

  const mcStyle = moduleThemeVars(unit?.theme ?? ENG3A_THEME)

  const stats = useMemo(() => {
    if (!unit) return { read: 0, quizzed: 0, done: 0 }
    const read = unit.lessons.filter((l) => (recite[l.slug]?.length ?? 0) > 0).length
    const quizzed = unit.lessons.filter((l) => quiz[l.slug]).length
    const done = unit.lessons.filter((l) => completed.includes(l.slug)).length
    return { read, quizzed, done }
  }, [unit, recite, quiz, completed])

  if (!unit) {
    return (
      <div className="empty">
        <p>没有找到这个单元。</p>
        <Link to="/eng3a" className="btn">返回英语课程</Link>
      </div>
    )
  }

  // 按 ENG_STAGES 的路径顺序排列本单元的关卡（数据里缺哪一关就自然少一行）
  const stageIndex = (stage: string) => {
    const i = ENG_STAGES.findIndex((s) => s.key === stage)
    return i < 0 ? ENG_STAGES.length : i
  }
  const ordered = unit.lessons
    .slice()
    .sort((a, b) => stageIndex(a.stage) - stageIndex(b.stage))
    .map((lesson) => ({ stage: stageOf(lesson), lesson }))

  return (
    <div className="page en3-unit" style={mcStyle}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{unit.emoji}</span>
        <div>
          <div className="page-kicker">{unit.title}</div>
          <h1 className="page-title">{unit.titleZh}</h1>
        </div>
      </div>

      {unit.bigIdea && <p className="lead">🎯 {unit.bigIdea}</p>}

      {unit.cover && <img className="en3-cover" src={unit.cover} alt={unit.titleZh} loading="lazy" />}

      <div className="cn-unit-stat" style={mcStyle}>
        <span>🛤️ {ordered.length} 关</span>
        <span>🎓 已学完 {stats.done}</span>
        <span>✅ 已读 {stats.read}</span>
        <span>📝 已测 {stats.quizzed}</span>
      </div>

      {/* 路径概览：五关串成一条线 */}
      <div className="en3-pathbar" style={mcStyle}>
        {ordered.map(({ stage, lesson }, i) => {
          const isDone = completed.includes(lesson.slug)
          return (
            <div key={stage.key} className="en3-pathbar-cell">
              <Link
                to={`/eng3a/${unit.slug}/${lesson.slug}`}
                className={'en3-pathbar-dot' + (isDone ? ' done' : '')}
              >
                {stage.emoji}
              </Link>
              <span className="en3-pathbar-label">{stage.label}</span>
              {i < ordered.length - 1 && <span className="en3-pathbar-line" aria-hidden="true" />}
            </div>
          )
        })}
      </div>

      <SafeBoundary label="关卡列表">
        <div className="cn-lesson-list">
          {ordered.map(({ stage, lesson: l }, i) => {
            const read = (recite[l.slug]?.length ?? 0) > 0
            const q = quiz[l.slug]
            const isDone = completed.includes(l.slug)
            return (
              <Link
                key={l.slug}
                to={`/eng3a/${unit.slug}/${l.slug}`}
                className="cn-lesson-card"
                style={{ '--mc': unit.theme.color, '--mc-soft': unit.theme.colorSoft } as React.CSSProperties}
              >
                <span className="cn-lesson-emoji">
                  <span className="en3-stage-idx">{i + 1}</span>
                  {l.emoji}
                </span>
                <div className="cn-lesson-body">
                  <div className="cn-lesson-title">
                    <span className="en3-stage-name">
                      {stage.emoji} {stage.label}
                    </span>
                    · {l.title}
                  </div>
                  <div className="en3-stage-desc">{stage.desc}</div>
                  <div className="cn-lesson-tags">
                    {l.words && <span className="cn-tag">词汇 {l.words.length}</span>}
                    {l.moreWords && <span className="cn-tag">补充词 {l.moreWords.length}</span>}
                    {l.dialogs && <span className="cn-tag">句型 {l.dialogs.length}</span>}
                    {l.chant && <span className="cn-tag">歌谣</span>}
                    {l.letters && <span className="cn-tag">字母 {l.letters.length}</span>}
                    {l.explore && <span className="cn-tag">知识卡 {l.explore.length}</span>}
                    {l.exercise.length > 0 && <span className="cn-tag">自测 {l.exercise.length} 题</span>}
                  </div>
                </div>
                <div className="cn-lesson-status">
                  {isDone && <span className="cn-done">🎓学</span>}
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
          <div className="en3-gallery-title">🖼️ 本单元插图（来自原版教材）</div>
          <div className="en3-gallery-grid">
            {unit.gallery.map((src, i) => (
              <img key={i} src={src} alt={`${unit.titleZh} 插图 ${i + 1}`} loading="lazy" />
            ))}
          </div>
        </div>
      )}

      <div className="page-nav">
        <Link to="/eng3a" className="back-link">← 英语课程</Link>
        <div className="lesson-nav">
          <Link to="/eng3a/play" className="btn btn-soft">🎭 去小剧场</Link>
        </div>
      </div>
    </div>
  )
}
