import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { getModule } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'

type Tab = 'vocab' | 'patterns' | 'dialogue'

const SPEAKERS = ['🧒 小星', '👧 小月']

export default function LessonPreview() {
  const { unitId = '', lessonId = '' } = useParams()
  const mod = getModule(unitId)
  const seedCards = useCourseStore((s) => s.seedCards)
  const [tab, setTab] = useState<Tab>('vocab')

  const lessons = mod?.lessons ?? []
  const lessonIdx = lessons.findIndex((l) => String(l.id) === lessonId)
  const lesson = lessonIdx >= 0 ? lessons[lessonIdx] : lessons[0]

  const words = lesson?.words ?? []
  const sentences = lesson?.sentences ?? []

  // 进入某课时,把该课的单词批量种子化进 SRS 调度池
  useEffect(() => {
    if (words.length === 0) return
    seedCards(words.map((w) => w.en))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, mod?.slug])

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/preview" className="btn">返回预习列表</Link>
      </div>
    )
  }

  const mcStyle = { '--mc': mod.color, '--mc-soft': mod.colorSoft } as React.CSSProperties
  const prevLesson = lessons[lessonIdx - 1]
  const nextLesson = lessons[lessonIdx + 1]

  return (
    <div className="page lesson-preview">
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · Lesson {lesson?.id}</div>
          <h1 className="page-title">{lesson?.title}{lesson?.titleZh ? ` · ${lesson.titleZh}` : ''}</h1>
        </div>
      </div>

      <SafeBoundary label="课前预习">
        <div className="mode-badge mode-preview">📖 预习模式</div>

        <div className="tab-bar" style={mcStyle}>
          <button
            type="button"
            className={'tab-btn' + (tab === 'vocab' ? ' active' : '')}
            onClick={() => setTab('vocab')}
          >
            🎴 单词
          </button>
          <button
            type="button"
            className={'tab-btn' + (tab === 'patterns' ? ' active' : '')}
            onClick={() => setTab('patterns')}
          >
            💬 句型
          </button>
          <button
            type="button"
            className={'tab-btn' + (tab === 'dialogue' ? ' active' : '')}
            onClick={() => setTab('dialogue')}
          >
            🎭 对话
          </button>
        </div>

        {tab === 'vocab' && <VocabTab words={words} mcStyle={mcStyle} />}
        {tab === 'patterns' && <PatternsTab sentences={sentences} mcStyle={mcStyle} />}
        {tab === 'dialogue' && <DialogueTab sentences={sentences} mcStyle={mcStyle} />}
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/preview/${unitId}`} className="back-link">← 课程列表</Link>
        <div className="lesson-nav">
          {prevLesson && (
            <Link to={`/preview/${unitId}/${prevLesson.id}`} className="btn btn-soft">← 上一课</Link>
          )}
          {nextLesson && (
            <Link to={`/preview/${unitId}/${nextLesson.id}`} className="btn">下一课 →</Link>
          )}
        </div>
      </div>
    </div>
  )
}

function VocabTab({ words, mcStyle }: { words: { en: string; zh: string; emoji: string; ipa?: string }[]; mcStyle: React.CSSProperties }) {
  const [idx, setIdx] = useState(0)
  const [showZh, setShowZh] = useState(true)
  useEffect(() => { setIdx(0); setShowZh(true) }, [words])

  if (words.length === 0) {
    return <div className="empty"><p>这一课还没有单词内容。</p></div>
  }

  const w = words[idx]
  const prev = () => setIdx((i) => (i - 1 + words.length) % words.length)
  const next = () => setIdx((i) => (i + 1) % words.length)

  return (
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

      <div className="fc-progress">{idx + 1} / {words.length}</div>
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
  )
}

function PatternsTab({ sentences, mcStyle }: { sentences: { en: string; zh: string; hint?: string }[]; mcStyle: React.CSSProperties }) {
  if (sentences.length === 0) {
    return <div className="empty"><p>这一课还没有句型内容。</p></div>
  }
  return (
    <>
      <p className="lead">点击 🔊 听整句，再跟读。括号里的内容可以替换练习。</p>
      <div className="sent-list">
        {sentences.map((s, i) => (
          <div key={i} className="sent-card" style={mcStyle}>
            <div className="sent-en-row">
              <span className="sent-en">{s.en}</span>
              <SpeakButton text={s.en} label={s.en} />
              <SpeakButton text={s.en} label={`${s.en} 慢速`} slow />
            </div>
            <div className="sent-zh">{s.zh}</div>
            {s.hint && <div className="sent-hint">💡 {s.hint}</div>}
          </div>
        ))}
      </div>

      <section className="card role-card">
        <h2 className="card-title">🎭 角色扮演</h2>
        <p className="role-text">
          家长和孩子轮流读句子，一方读问句，一方读答句。例如：
        </p>
        <div className="role-demo" style={mcStyle}>
          {sentences.slice(0, 2).map((s, i) => (
            <div key={i}>
              <b>{i === 0 ? '家长' : '孩子'}：</b>{s.en} <SpeakButton text={s.en} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function DialogueTab({ sentences, mcStyle }: { sentences: { en: string; zh: string }[]; mcStyle: React.CSSProperties }) {
  if (sentences.length === 0) {
    return <div className="empty"><p>这一课还没有对话内容。</p></div>
  }
  const lines = sentences.map((s, i) => ({
    ...s,
    side: i % 2 === 0 ? ('left' as const) : ('right' as const),
    speaker: SPEAKERS[i % 2],
  }))
  return (
    <>
      <p className="lead">跟着对话练习说英语，点击 🔊 听一句读一句，和家长轮流扮演小星和小月。</p>
      <div className="dialogue-list" style={{ ...mcStyle, display: 'flex', flexDirection: 'column' }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={`dialogue-bubble ${l.side}`}>
              <div className="dialogue-speaker">{l.speaker}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{l.en}</span>
                <SpeakButton text={l.en} label={l.en} />
              </div>
              <div className="dialogue-zh">{l.zh}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
