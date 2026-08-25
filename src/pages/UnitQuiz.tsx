// 单元测验：每单元 5 题综合测验(颜色/单词/句型混合),独立于单课闯关。
// 原本只作为单课闯关题量不足时的兜底,现提升为独立入口,常驻 LessonList 顶部。

import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import Breadcrumb from '@/components/Breadcrumb'
import QuizEngine, { type QuizItem } from '@/components/QuizEngine'
import { getModule, STARLIGHT_THEME } from '@/data/starlight'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'
import { useSettleQuiz } from '@/hooks/useSettleQuiz'

export default function UnitQuiz() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const mcStyle = moduleThemeVars(STARLIGHT_THEME)
  const markQuizDone = useCourseStore((s) => s.markQuizDone)
  const markLessonDone = useCourseStore((s) => s.markLessonDone)

  // 加星/错题入本/SRS 记录统一走共享结算编排(同词去重、词表释义兜底)
  const { recordPick, restart, settle } = useSettleQuiz({
    module: 'starlight',
    from: `${mod?.title ?? ''} · 单元测验`,
    fallbackEmoji: mod?.emoji,
  })

  // 全单元词表,用于错题释义(settle 的 words 来源)
  const unitWords = useMemo(() => {
    if (!mod) return []
    const seen = new Set<string>()
    const words: { en: string; zh: string; emoji?: string }[] = []
    for (const l of mod.lessons) {
      for (const w of l.words) {
        const k = w.en.toLowerCase()
        if (!seen.has(k)) {
          seen.add(k)
          words.push(w)
        }
      }
    }
    return words
  }, [mod])

  const quiz = useMemo<QuizItem[]>(() => {
    if (!mod) return []
    return (mod.quiz ?? []).map((q) => ({
      q: q.q,
      options: q.options,
      answer: q.answer,
      explain: q.explain,
      speakText: q.options[q.answer] ?? q.q,
      emoji: mod.emoji,
    }))
  }, [mod])

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/starlight" className="btn">返回主课</Link>
      </div>
    )
  }

  return (
    <div className="page lesson-preview" style={mcStyle}>
      <Breadcrumb
        items={[
          { label: '🏠', to: '/' },
          { label: 'Starlight 主课', to: '/starlight' },
          { label: mod.title, to: `/preview/${unitId}` },
          { label: '单元测验' },
        ]}
      />
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">🏁</span>
        <div>
          <div className="page-kicker">Module {mod.id} · 单元测验</div>
          <h1 className="page-title">{mod.title} 综合测验</h1>
        </div>
      </div>

      <SafeBoundary label="单元测验">
        <QuizEngine
          quiz={quiz}
          mcStyle={mcStyle}
          badgeText="🏁 单元测验 · 本单元综合检验"
          resultTitle="单元测验完成！"
          resultLinks={
            <>
              <Link to="/wrong" className="btn btn-soft">📋 看错题本</Link>
              <Link to={`/preview/${unitId}`} className="btn btn-soft">← 课程列表</Link>
              <Link to="/smart" className="btn btn-soft">🧠 去复习</Link>
            </>
          }
          onPick={({ en, correct }) => recordPick(en, correct)}
          onRestart={restart}
          onFinish={(correct, total, wrongEns) => {
            settle(correct, total, wrongEns, unitWords, () => {
              markQuizDone(mod.slug)
              // 单元测验全对 ⇒ 本单元第 6 课(Quiz 课)记为完成
              if (correct === total && total > 0) markLessonDone(mod.slug, 6)
            })
          }}
        />
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/preview/${unitId}`} className="back-link">← 课程列表</Link>
      </div>
    </div>
  )
}
