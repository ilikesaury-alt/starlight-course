// Starlight 单课学习页：与 Fly Guy / Rocket Girl 的故事页保持同一套三标签结构
//   🎴 单词卡 —— 逐词翻卡 + 本课词表
//   📖 课本原文 —— 教材 PDF 提取的真实课文（逐词可点、可听、带中文），顶部先给本课重点句型
//   🎯 闯关 —— 从课本原文挖空生成选词填空，题量不足时用本课单词与单元测验补足
// 三个标签共用 BookTextView / bookQuiz / bookDict，逻辑不在页面里重复实现。

import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import FcWord from '@/components/FcWord'
import SafeBoundary from '@/components/SafeBoundary'
import QuizEngine, { type QuizItem } from '@/components/QuizEngine'
import BookTextView from '@/components/BookTextView'
import Breadcrumb from '@/components/Breadcrumb'
import { getModule, STARLIGHT_THEME, type Sentence, type Word } from '@/data/starlight'
import { getLessonBook } from '@/data/starlight-book'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { moduleThemeVars } from '@/utils/theme'
import { buildClozeQuiz, buildWordQuiz } from '@/utils/bookQuiz'

type Tab = 'vocab' | 'book' | 'quiz'

export default function LessonPreview() {
  const { unitId = '', lessonId = '' } = useParams()
  const mod = getModule(unitId)
  const seedCards = useCourseStore((s) => s.seedCards)
  const addStars = useCourseStore((s) => s.addStars)
  const markQuizDone = useCourseStore((s) => s.markQuizDone)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const [tab, setTab] = useState<Tab>('vocab')

  const lessons = mod?.lessons ?? []
  const lessonIdx = lessons.findIndex((l) => String(l.id) === lessonId)
  const lesson = lessonIdx >= 0 ? lessons[lessonIdx] : null

  const words = lesson?.words ?? []
  const sentences = lesson?.sentences ?? []
  // 课本原文：按「单元号-课号」取，教材 PDF 每课一份
  const book = mod && lesson ? getLessonBook(mod.id, lesson.id) : undefined
  const chapters = book?.sections ?? []

  // 闯关题：课本原文选词填空优先，不足 6 题时用本课单词词义题补足，再不够就用单元测验
  const quizItems = useMemo<QuizItem[]>(() => {
    const cloze = chapters.length > 0
      ? buildClozeQuiz(chapters, {
          vocab: words,
          limit: 8,
          source: `Lesson ${lesson?.id} 《${lesson?.title ?? ''}》`,
          emoji: mod?.emoji ?? '📖',
        })
      : []
    const items = [...cloze]
    if (items.length < 6 && words.length > 0) {
      items.push(...buildWordQuiz(words, lessons.flatMap((l) => l.words), 6 - items.length))
    }
    if (items.length < 4) {
      items.push(
        ...(mod?.quiz ?? []).slice(0, 4 - items.length).map((q) => ({
          q: q.q,
          options: q.options,
          answer: q.answer,
          explain: q.explain,
          speakText: q.options[q.answer] ?? q.q,
        }))
      )
    }
    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod?.slug, lesson?.id])

  // 进入某课时,把该课的单词和句型批量种子化进 SRS 调度池
  useEffect(() => {
    if (words.length === 0 && sentences.length === 0) return
    seedCards([...words.map((w) => w.en), ...sentences.map((s) => s.en)], 'starlight')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, mod?.slug])

  // 换课时回到第一个标签，避免停留在上一课的闯关结果页
  useEffect(() => { setTab('vocab') }, [lessonId, unitId])

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/preview" className="btn">返回预习列表</Link>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="empty">
        <p>没有找到 Lesson {lessonId}。</p>
        <Link to={`/preview/${unitId}`} className="btn">返回课程列表</Link>
      </div>
    )
  }

  const mcStyle = moduleThemeVars(STARLIGHT_THEME)
  const prevLesson = lessons[lessonIdx - 1]
  const nextLesson = lessons[lessonIdx + 1]
  const hasBook = chapters.length > 0

  return (
    <div className="page lesson-preview" style={mcStyle}>
      <Breadcrumb
        items={[
          { label: '🏠', to: '/' },
          { label: 'Starlight 预习', to: '/preview' },
          { label: mod.title, to: `/preview/${unitId}` },
          { label: `Lesson ${lesson.id}` },
        ]}
      />
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · Lesson {lesson.id}</div>
          <h1 className="page-title">{lesson.title}{lesson.titleZh ? ` · ${lesson.titleZh}` : ''}</h1>
        </div>
      </div>

      <SafeBoundary label="课前预习">
        <div className="mode-badge mode-preview">📖 Starlight 课前预习</div>

        <div className="tab-bar" style={mcStyle}>
          <button
            type="button"
            className={'tab-btn' + (tab === 'vocab' ? ' active' : '')}
            onClick={() => setTab('vocab')}
          >
            🎴 单词卡
          </button>
          <button
            type="button"
            className={'tab-btn' + (tab === 'book' ? ' active' : '')}
            onClick={() => setTab('book')}
          >
            📖 课本原文
          </button>
          <button
            type="button"
            className={'tab-btn' + (tab === 'quiz' ? ' active' : '')}
            onClick={() => setTab('quiz')}
          >
            🎯 闯关
          </button>
        </div>

        {tab === 'vocab' && <VocabTab words={words} mcStyle={mcStyle} />}
        {tab === 'book' && (
          <>
            <PatternStrip sentences={sentences} mcStyle={mcStyle} />
            {hasBook ? (
              <BookTextView
                chapters={chapters}
                mc={mcStyle}
                lead={
                  <>
                    下面是这一课教材上的真实课文，按课堂活动顺序排好了。
                    <span className="sent-hint">点单词听发音、鼠标悬停看词义，点 🔊 听整句</span>
                  </>
                }
              />
            ) : (
              <div className="empty"><p>这一课暂时没有课本原文。</p></div>
            )}
          </>
        )}
        {tab === 'quiz' && (
          <QuizEngine
            quiz={quizItems}
            mcStyle={mcStyle}
            badgeText={hasBook ? '📖 课文选词填空 · 读原文选一选' : '🎯 闯关测验 · 听一听选一选'}
            resultTitle="闯关完成！"
            resultLinks={
              <>
                <Link to="/wrong" className="btn btn-soft">📋 看错题本</Link>
                <Link to={`/preview/${unitId}`} className="btn btn-soft">← 课程列表</Link>
                <Link to="/smart" className="btn btn-soft">🧠 去复习</Link>
              </>
            }
            onPick={({ en, correct }) => {
              seedCards([en], 'starlight')
              recordReview(en, correct, 'starlight')
            }}
            onFinish={(correct, total, wrongEns) => {
              addStars(correct === total ? correct + 5 : correct)
              markQuizDone(mod.slug)
              wrongEns.forEach((en) => {
                const w = words.find((x) => x.en.toLowerCase() === en.toLowerCase())
                addWrongWord({
                  en: w?.en ?? en,
                  zh: w?.zh ?? '',
                  emoji: w?.emoji ?? mod.emoji,
                  from: `${mod.title} · Lesson ${lesson.id}`,
                  module: 'starlight',
                })
              })
            }}
          />
        )}
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

function VocabTab({ words, mcStyle }: { words: Word[]; mcStyle: React.CSSProperties }) {
  const [idx, setIdx] = useState(0)
  const [showZh, setShowZh] = useState(true)
  useEffect(() => { setIdx(0); setShowZh(true) }, [words])

  // 切换单词（上一个/下一个/点圆点/进入单词卡）时自动发音
  useEffect(() => {
    const cur = words[idx]
    if (cur) speakText(cur.en)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, words])

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
          <FcWord text={w.en} lang="en" />
        </div>
        <div className="fc-audio">
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

// 本课重点句型：放在课本原文上方，先看 5 个核心句，再读整篇课文。
function PatternStrip({ sentences, mcStyle }: { sentences: Sentence[]; mcStyle: React.CSSProperties }) {
  const [open, setOpen] = useState(true)
  if (sentences.length === 0) return null
  return (
    <section className="pattern-strip" style={mcStyle}>
      <button type="button" className="pattern-strip-head" onClick={() => setOpen((v) => !v)}>
        <span>💬 本课重点句型（{sentences.length}）</span>
        <span className="pattern-strip-toggle">{open ? '收起 ▲' : '展开 ▼'}</span>
      </button>
      {open && (
        <div className="pattern-strip-body">
          {sentences.map((s, i) => (
            <div key={i} className="pattern-item">
              <div className="pattern-en-row">
                <span className="pattern-en">{s.en}</span>
                <SpeakButton text={s.en} label={s.en} />
                <SpeakButton text={s.en} label={`${s.en} 慢速`} slow />
              </div>
              <div className="pattern-zh">{s.zh}</div>
              {s.hint && <div className="pattern-hint">💡 {s.hint}</div>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
