// 单元测验：每单元 5 题综合测验(颜色/单词/句型混合),独立于单课闯关。
// 原本只作为单课闯关题量不足时的兜底,现提升为独立入口,常驻 LessonList 顶部。

import { useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import Breadcrumb from '@/components/Breadcrumb'
import QuizEngine, { type QuizItem } from '@/components/QuizEngine'
import { getModule, STARLIGHT_THEME } from '@/data/starlight'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

export default function UnitQuiz() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const mcStyle = moduleThemeVars(STARLIGHT_THEME)
  const seedCards = useCourseStore((s) => s.seedCards)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addStars = useCourseStore((s) => s.addStars)
  const markQuizDone = useCourseStore((s) => s.markQuizDone)
  const markLessonDone = useCourseStore((s) => s.markLessonDone)
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  // 一场测验内同词只结算一次 SRS
  const reviewedRef = useRef<Set<string>>(new Set())

  // 全单元词表:en -> 词信息,用于错题释义
  const unitWordByEn = useMemo(() => {
    const m = new Map<string, { en: string; zh: string; emoji?: string }>()
    if (mod) {
      for (const l of mod.lessons) {
        for (const w of l.words) {
          const k = w.en.toLowerCase()
          if (!m.has(k)) m.set(k, w)
        }
      }
    }
    return m
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
        <Link to="/preview" className="btn">返回预习列表</Link>
      </div>
    )
  }

  return (
    <div className="page lesson-preview" style={mcStyle}>
      <Breadcrumb
        items={[
          { label: '🏠', to: '/' },
          { label: 'Starlight 预习', to: '/preview' },
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
          onPick={({ en, correct }) => {
            seedCards([en], 'starlight')
            if (reviewedRef.current.has(en)) return
            reviewedRef.current.add(en)
            recordReview(en, correct, 'starlight')
          }}
          onRestart={() => {
            reviewedRef.current = new Set()
          }}
          onFinish={(correct, total, wrongEns) => {
            const allRight = correct === total && total > 0
            addStars(allRight ? correct + 5 : correct)
            markQuizDone(mod.slug)
            // 单元测验全对 ⇒ 本单元第 6 课(Quiz 课)记为完成
            if (allRight) markLessonDone(mod.slug, 6)
            reviewedRef.current = new Set()
            wrongEns.forEach((en) => {
              const w = unitWordByEn.get(en.toLowerCase())
              addWrongWord({
                en: w?.en ?? en,
                zh: w?.zh ?? '',
                emoji: w?.emoji ?? mod.emoji,
                from: `${mod.title} · 单元测验`,
                module: 'starlight',
              })
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
