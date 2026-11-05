import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SafeBoundary from '../components/SafeBoundary'
import ConfirmDialog from '../components/ConfirmDialog'
import { STARLIGHT_THEME } from '../data/starlight'
import { STARLIGHT_LEVELS } from '../data/starlightSeries'
import { getSeriesModule, unitCountOfLevel } from '../data/starlightSeriesData'
import { useCourseStore } from '../store/useCourseStore'
import { moduleThemeVars } from '../utils/theme'
import Breadcrumb from '@/components/Breadcrumb'
import LessonStarMap from '@/components/LessonStarMap'
import UnitGlyph from '@/components/UnitGlyph'

export default function LessonList() {
  const { unitId = '' } = useParams()
  const mod = getSeriesModule(unitId)
  const markPreviewDone = useCourseStore((s) => s.markPreviewDone)
  const markLessonDone = useCourseStore((s) => s.markLessonDone)
  const completed = useCourseStore((s) => s.completedPreviews.includes(unitId))
  const lessonCompleted = useCourseStore((s) => s.lessonCompleted)
  // 导学默认收起：首屏先让 8 课表露出来（app-screens.md §2.2 everything the brief names）
  const [showGuide, setShowGuide] = useState(false)
  const [showUnitDone, setShowUnitDone] = useState(false)

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/starlight" className="btn">返回主课</Link>
      </div>
    )
  }

  const mcStyle = moduleThemeVars(STARLIGHT_THEME)
  const levelMeta = STARLIGHT_LEVELS[mod.level]

  return (
    <div className="page lesson-list starlight-sheet" style={mcStyle}>
      <Breadcrumb items={[{ label: '🏠', to: '/' }, { label: levelMeta.pageTitle, to: levelMeta.path }, { label: mod.title }]} />
      <div className="unit-banner" style={mcStyle}>
        <span className="unit-emoji">
          <UnitGlyph
            unitId={mod.id}
            level={mod.level}
            fallback={mod.emoji}
            color={mod.color}
            soft={mod.colorSoft}
            size={34}
          />
        </span>
        <div>
          <div className="unit-num">Module {mod.id} · 预习</div>
          <h1 className="unit-title">{mod.title}</h1>
          <div className="unit-zh">{mod.titleZh}</div>
          <p className="sl-sub">
            Module {mod.id} · {mod.titleZh} · {mod.lessons.length} 课 · 每课 5 词 5 句
          </p>
        </div>
      </div>

      {/* 本单元的格子：目录本身就是导航，格子状态由完成记录派生 */}
      <LessonStarMap unitSlug={unitId} />

      <SafeBoundary label="课程列表">
        <button
          type="button"
          className="btn btn--soft btn--sm"
          style={{ marginTop: '14px' }}
          onClick={() => setShowGuide((v) => !v)}
        >
          {showGuide ? '收起单元导学 ▲' : '📋 单元导学（目标 & 家长贴士）▼'}
        </button>

        {showGuide && (
          <div style={{ marginTop: '10px', display: 'grid', gap: '10px' }}>
            <section className="card">
              <h2 className="card-title">🎯 本课学习目标</h2>
              <ul className="goal-list">
                {mod.preview.goals.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
            <section className="card tip-card">
              <h2 className="card-title">💡 预习小贴士（给家长）</h2>
              <p className="tip-text">{mod.preview.tip}</p>
            </section>
          </div>
        )}

        <h2 className="section-title">📚 这一单元的课程</h2>
        {/* 进度不在这里另算一份：星图头已是唯一进度真源（app-screens.md §2.1 一事实一变量） */}
        <div className="lesson-quiz-entry" style={mcStyle}>
          <Link to={`/preview/${unitId}/quiz`} className="lesson-quiz-card">
            <span className="lesson-quiz-emoji">🏁</span>
            <div className="lesson-quiz-body">
              <div className="lesson-quiz-title">单元测验</div>
              <div className="lesson-quiz-sub">{mod.quiz.length} 题综合检验 · 学完本单元挑战一下</div>
            </div>
            <span className="module-arrow">›</span>
          </Link>
        </div>
        <div className="lessons-overview" style={mcStyle}>
          {mod.lessons.map((lesson) => {
            const done = (lessonCompleted[unitId] ?? []).includes(lesson.id)
            return (
              <Link
                key={lesson.id}
                to={`/preview/${unitId}/${lesson.id}`}
                className="lesson-row lesson-link"
                style={mcStyle}
              >
                <div className="lesson-row-num">{done ? '✅' : lesson.id}</div>
                <div className="lesson-row-title">
                  Lesson {lesson.id}: {lesson.title}
                  {lesson.titleZh && <span className="lr-zh">{lesson.titleZh}</span>}
                </div>
                <div className="lesson-row-count">{lesson.words.length} 词 · {lesson.sentences.length} 句</div>
                <span className="module-arrow">›</span>
              </Link>
            )
          })}
        </div>

        {!completed && (
          <div style={{ textAlign: 'center', marginTop: '22px' }}>
            <button
              type="button"
              className="btn btn--sun btn--lg"
              onClick={() => setShowUnitDone(true)}
            >
              ✅ 标记本单元预习完成
            </button>
          </div>
        )}
        {completed && (
          <p style={{ textAlign: 'center', marginTop: '18px', color: 'var(--ok)', fontWeight: 600 }}>
            ✅ 已完成预习，可以去复习啦！
          </p>
        )}

        <ConfirmDialog
          open={showUnitDone}
          emoji="🏁"
          title="整个单元都学完了吗？"
          message={`标记后本单元全部 ${mod.lessons.length} 课都会记为完成，可以去复习啦。`}
          confirmText="都学完了"
          cancelText="再检查一下"
          onConfirm={() => {
            // 手动标记单元完成 ⇒ 同步标记全部课时完成,两种粒度保持一致
            mod.lessons.forEach((l) => markLessonDone(unitId, l.id, mod.lessons.length))
            markPreviewDone(unitId, mod.lessons.map((l) => l.id))
            setShowUnitDone(false)
          }}
          onCancel={() => setShowUnitDone(false)}
        />
      </SafeBoundary>

      <div className="sl-page-foot">
        <span className="sl-page-num">Module {mod.id} / {unitCountOfLevel(mod.level)} · {mod.lessons.length} 课</span>
        <Link to={levelMeta.path} className="back-link">← 主课目录</Link>
      </div>
    </div>
  )
}
