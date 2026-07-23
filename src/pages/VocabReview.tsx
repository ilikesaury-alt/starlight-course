import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { getModule } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'

export default function VocabReview() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const [lessonIdx, setLessonIdx] = useState(0)
  const [idx, setIdx] = useState(0)
  const [showZh, setShowZh] = useState(false)

  const masteredWords = useCourseStore((s) => s.masteredWords)
  const markMastered = useCourseStore((s) => s.markMastered)
  const unmarkMastered = useCourseStore((s) => s.unmarkMastered)

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/review" className="btn">返回复习列表</Link>
      </div>
    )
  }

  const mcStyle = { '--mc': mod.color, '--mc-soft': mod.colorSoft } as React.CSSProperties
  const lessons = mod.lessons ?? []
  const lesson = lessons[lessonIdx]
  const words = lesson?.words ?? []
  const w = words[idx]
  const isMastered = w ? masteredWords.includes(w.en) : false

  const selectLesson = (i: number) => {
    setLessonIdx(i)
    setIdx(0)
    setShowZh(false)
  }
  const prev = () => { setIdx((i) => (i - 1 + words.length) % words.length); setShowZh(false) }
  const next = () => { setIdx((i) => (i + 1) % words.length); setShowZh(false) }

  return (
    <div className="page vocab-review">
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · 单词复习</div>
          <h1 className="page-title">{mod.title}</h1>
        </div>
      </div>

      <SafeBoundary label="单词复习">
        <div className="mode-badge mode-review">🔁 复习模式 · 先想想再看中文</div>

        <div className="lesson-switcher" style={mcStyle}>
          {lessons.map((l, i) => (
            <button
              key={l.id}
              type="button"
              className={'lesson-pill' + (i === lessonIdx ? ' active' : '')}
              onClick={() => selectLesson(i)}
            >
              <span className="lp-num">L{l.id}</span>
              <span>{l.title}</span>
            </button>
          ))}
        </div>

        {lesson && (
          <div className="lesson-current" style={mcStyle}>
            <div className="lesson-current-num">{lesson.id}</div>
            <div>
              <span className="lesson-current-title">Lesson {lesson.id}: {lesson.title}</span>
              {lesson.titleZh && <span className="lesson-current-zh">{lesson.titleZh}</span>}
            </div>
          </div>
        )}

        {words.length === 0 ? (
          <div className="empty">
            <p>这一课还没有单词内容。</p>
          </div>
        ) : (
          <>
            <div className="flashcard" style={mcStyle}>
              <div className="fc-emoji">{w.emoji}</div>
              <div className="fc-word-row">
                <span className="fc-word">{w.en}</span>
                <SpeakButton text={w.en} label={w.en} />
                <SpeakButton text={w.en} label={`${w.en} 慢速`} slow />
              </div>
              {w.ipa && <div className="fc-ipa">{w.ipa}</div>}
              {showZh ? (
                <div className="fc-zh" onClick={() => setShowZh(false)} title="点击隐藏中文">
                  {w.zh}
                </div>
              ) : (
                <button type="button" className="fc-reveal" onClick={() => setShowZh(true)}>
                  👀 显示中文
                </button>
              )}

              <div className="mastery-row">
                {isMastered ? (
                  <button
                    type="button"
                    className="mastery-btn unfamiliar"
                    onClick={() => unmarkMastered(w.en)}
                  >
                    😅 标记为生疏
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mastery-btn mastered"
                    onClick={() => markMastered(w.en)}
                  >
                    ✅ 已掌握
                  </button>
                )}
              </div>
            </div>

            <div className="fc-progress">
              {idx + 1} / {words.length} · 已掌握 {masteredWords.filter((mw) => words.some((ww) => ww.en === mw)).length}
            </div>
            <div className="fc-dots">
              {words.map((ww, i) => (
                <button
                  key={ww.en}
                  type="button"
                  className={'fc-dot' + (i === idx ? ' on' : '') + (masteredWords.includes(ww.en) ? ' mastered' : '')}
                  onClick={() => { setIdx(i); setShowZh(false) }}
                  aria-label={`第 ${i + 1} 个单词`}
                />
              ))}
            </div>

            <div className="fc-controls">
              <button type="button" className="btn btn-soft" onClick={prev}>← 上一个</button>
              <button type="button" className="btn" onClick={next}>下一个 →</button>
            </div>
          </>
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/review/${unitId}`} className="back-link">← 复习菜单</Link>
        <Link to={`/review/${unitId}/quiz`} className="btn">去听力测验 →</Link>
      </div>
    </div>
  )
}
