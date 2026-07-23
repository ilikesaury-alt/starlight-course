import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { getModule } from '../data/starlight'

export default function VocabPreview() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const [lessonIdx, setLessonIdx] = useState(0)
  const [idx, setIdx] = useState(0)
  const [showZh, setShowZh] = useState(true)

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/preview" className="btn">返回预习列表</Link>
      </div>
    )
  }

  const mcStyle = { '--mc': mod.color, '--mc-soft': mod.colorSoft } as React.CSSProperties
  const lessons = mod.lessons ?? []
  const lesson = lessons[lessonIdx]
  const words = lesson?.words ?? []
  const w = words[idx]
  const prev = () => { setIdx((i) => (i - 1 + words.length) % words.length) }
  const next = () => { setIdx((i) => (i + 1) % words.length) }

  const selectLesson = (i: number) => {
    setLessonIdx(i)
    setIdx(0)
  }

  return (
    <div className="page vocab-preview">
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · 单词卡</div>
          <h1 className="page-title">{mod.title}</h1>
        </div>
      </div>

      <SafeBoundary label="单词卡">
        <div className="mode-badge mode-preview">📖 预习模式</div>

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
            </div>

            <div className="fc-progress">
              {idx + 1} / {words.length}
            </div>
            <div className="fc-dots">
              {words.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={'fc-dot' + (i === idx ? ' on' : '')}
                  onClick={() => setIdx(i)}
                  aria-label={`第 ${i + 1} 个单词`}
                />
              ))}
            </div>

            <div className="fc-controls">
              <button type="button" className="btn btn-soft" onClick={prev}>← 上一个</button>
              <button type="button" className="btn" onClick={next}>下一个 →</button>
            </div>

            <div className="word-list-mini" style={mcStyle}>
              {words.map((ww, i) => (
                <div
                  key={ww.en}
                  className={'word-chip' + (i === idx ? ' on' : '')}
                  onClick={() => setIdx(i)}
                >
                  <span>{ww.emoji}</span>
                  <span>{ww.en}</span>
                  <span onClick={(e) => e.stopPropagation()}>
                    <SpeakButton text={ww.en} label={ww.en} />
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/preview/${unitId}`} className="back-link">← 预习导学</Link>
        <Link to={`/preview/${unitId}/patterns`} className="btn">下一步：句型练习 →</Link>
      </div>
    </div>
  )
}
