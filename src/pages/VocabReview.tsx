import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { getModule } from '../data/starlight'
import { getModuleMeta, moduleThemeOf, type ModuleId } from '../data/modules'
import { useCourseStore } from '../store/useCourseStore'
import { speakText } from '../utils/speak'
import { countMastered } from '../utils/words'
import { moduleThemeVars } from '../utils/theme'

type ReviewWordRow = { en: string; zh: string; emoji?: string; ipa?: string }

export default function VocabReview() {
  const { moduleId = '', itemId = '' } = useParams()
  const meta = getModuleMeta(moduleId)
  const isUnit = meta?.kind === 'unit'
  const [lessonIdx, setLessonIdx] = useState(0)
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [recalled, setRecalled] = useState(false)

  const masteredWords = useCourseStore((s) => s.masteredWords)
  const markMastered = useCourseStore((s) => s.markMastered)
  const unmarkMastered = useCourseStore((s) => s.unmarkMastered)
  const recordReview = useCourseStore((s) => s.recordReview)
  const seedCard = useCourseStore((s) => s.seedCard)

  // 根据模块类型取单词：Starlight 按 lesson 分组，故事类用扁平词表
  const lessons: { id: number | string; title: string; titleZh?: string; words: ReviewWordRow[] }[] = isUnit
    ? (getModule(itemId)?.lessons ?? []).map((l) => ({
        id: l.id,
        title: l.title,
        titleZh: l.titleZh,
        words: l.words as ReviewWordRow[],
      }))
    : [{ id: 1, title: '全部单词', titleZh: '', words: (meta?.getWords(itemId) ?? []) as ReviewWordRow[] }]

  // 切换单词时自动发音
  useEffect(() => {
    const wd = lessons[lessonIdx]?.words?.[idx]
    if (wd) speakText(wd.en)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, itemId, lessonIdx, idx])

  if (!meta) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/review" className="btn">返回复习列表</Link>
      </div>
    )
  }

  const mcStyle = moduleThemeVars(moduleThemeOf(moduleId))
  const lessonsList = lessons
  const lesson = lessonsList[lessonIdx]
  const words = lesson?.words ?? []
  const w = words[idx]

  const selectLesson = (i: number) => {
    setLessonIdx(i)
    setIdx(0)
    setAnswered(false)
    setRecalled(false)
  }
  const prev = () => { setIdx((i) => (i - 1 + words.length) % words.length); setAnswered(false); setRecalled(false) }
  const next = () => { setIdx((i) => (i + 1) % words.length); setAnswered(false); setRecalled(false) }

  // 先做主动回忆,再揭晓中文并据此计入 SRS(信号来自真实提取,而非主观自评)
  const handleRecall = (ok: boolean) => {
    if (!w) return
    setRecalled(ok)
    setAnswered(true)
    if (ok) {
      markMastered(w.en)
      seedCard(w.en, moduleId as ModuleId)
      recordReview(w.en, true, moduleId as ModuleId)
    } else {
      unmarkMastered(w.en)
      recordReview(w.en, false, moduleId as ModuleId)
    }
  }

  return (
    <div className="page vocab-review" style={mcStyle}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{isUnit ? '📚' : '📖'}</span>
        <div>
          <div className="page-kicker">
            {meta.label} · {isUnit ? `Unit ${itemId}` : '单词复习'}
          </div>
          <h1 className="page-title">{isUnit ? (getModule(itemId)?.title ?? '单词复习') : meta.labelZh}</h1>
        </div>
      </div>

      <SafeBoundary label="单词复习">
        <div className="mode-badge mode-review">🔁 复习模式 · 先想想再看中文</div>

        {isUnit && (
          <div className="lesson-switcher" style={mcStyle}>
            {lessonsList.map((l, i) => (
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
        )}

        {lesson && isUnit && (
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
                <button type="button" className="fc-word" onClick={() => speakText(w.en)}>{w.en}</button>
                <SpeakButton text={w.en} label={w.en} />
                <SpeakButton text={w.en} label={`${w.en} 慢速`} slow />
              </div>
              {w.ipa && <div className="fc-ipa">{w.ipa}</div>}
              {!answered ? (
                <div className="recall-actions">
                  <button type="button" className="recall-btn yes" onClick={() => handleRecall(true)}>
                    💡 想起来了
                  </button>
                  <button type="button" className="recall-btn no" onClick={() => handleRecall(false)}>
                    🤔 没想起来
                  </button>
                </div>
              ) : (
                <>
                  <div className="fc-zh">{w.zh}</div>
                  <div className={'recall-feedback ' + (recalled ? 'ok' : 'miss')}>
                    {recalled ? '厉害，记住了！👍' : '看看中文，下次加油 💪'}
                  </div>
                </>
              )}
            </div>

            <div className="fc-progress">
              {idx + 1} / {words.length} · 已掌握 {countMastered(words, masteredWords)}
            </div>
            <div className="fc-dots">
              {words.map((ww, i) => (
                <button
                  key={ww.en}
                  type="button"
                  className={'fc-dot' + (i === idx ? ' on' : '') + (masteredWords.includes(ww.en) ? ' mastered' : '')}
                  onClick={() => { setIdx(i); setAnswered(false); setRecalled(false) }}
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
        <Link to={`/review/${moduleId}/${itemId}`} className="back-link">← 复习菜单</Link>
        {isUnit && (
          <Link to={`/review/${moduleId}/${itemId}/quiz`} className="btn">去听力测验 →</Link>
        )}
      </div>
    </div>
  )
}
