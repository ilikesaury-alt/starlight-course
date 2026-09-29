// Starlight 单课学习页：五区布局
//   🎴 单词区 —— 逐词翻卡 + 本课词表 + ➕ E 课堂拓展词（录入 / 删除）
//   🗣️ 跟读区 —— 逐句跟读：播原句 → 孩子跟读 → 逐词高亮 → 达标入 SRS（识别不可用时家长确认降级）
//   🧩 句型区 —— 句子框架卡：填空 + 说出整句
//   📖 课文区 —— 教材 PDF 提取的真实课文（逐词可点、可听、带中文），顶部先给本课重点句型
//   🎯 闯关   —— 从课本原文挖空生成选词填空，题量不足时用本课单词与单元测验补足
// 三个逻辑模块共用 BookTextView / bookQuiz / bookDict，逻辑不在页面里重复实现。

import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import Flashcard from '@/components/Flashcard'
import SafeBoundary from '@/components/SafeBoundary'
import ConfirmDialog from '@/components/ConfirmDialog'
import QuizEngine, { type QuizItem } from '@/components/QuizEngine'
import BookTextView from '@/components/BookTextView'
import TappableText, { PassageLegend } from '@/components/TappableText'
import Breadcrumb from '@/components/Breadcrumb'
import ExtensionWordEntry from '@/components/ExtensionWordEntry'
import SentenceReader from '@/components/SentenceReader'
import SentenceFrameCard from '@/components/SentenceFrameCard'
import { getModule, STARLIGHT_THEME, type Sentence, type Word } from '@/data/starlight'
import { getLessonBook } from '@/data/starlight-book'
import { getPassage } from '@/data/starlight-passage'
import { framesOfLesson, hashPattern } from '@/data/sentenceFrame'
import { useCourseStore } from '@/store/useCourseStore'
import { useSettleQuiz } from '@/hooks/useSettleQuiz'
import { speakText } from '@/utils/speak'
import { moduleThemeVars } from '@/utils/theme'
import { buildClozeQuiz, buildListeningQuiz, buildWordQuiz } from '@/utils/bookQuiz'

type Tab = 'vocab' | 'speak' | 'frame' | 'book' | 'quiz'

export default function LessonPreview() {
  const { unitId = '', lessonId = '' } = useParams()
  const mod = getModule(unitId)
  const seedCards = useCourseStore((s) => s.seedCards)
  const recordReview = useCourseStore((s) => s.recordReview)
  const markQuizDone = useCourseStore((s) => s.markQuizDone)
  const markLessonDone = useCourseStore((s) => s.markLessonDone)
  const lessonCompleted = useCourseStore((s) => s.lessonCompleted)
  const srsCards = useCourseStore((s) => s.srsCards)
  const [tab, setTab] = useState<Tab>('vocab')
  const [showLessonDone, setShowLessonDone] = useState(false)
  const [showExtEntry, setShowExtEntry] = useState(false)
  const [sentIdx, setSentIdx] = useState(0)
  const seedSentenceFrames = useCourseStore((s) => s.seedSentenceFrames)
  const starlightExtensions = useCourseStore((s) => s.starlightExtensions)
  const addExtensionWord = useCourseStore((s) => s.addExtensionWord)
  const removeExtensionWord = useCourseStore((s) => s.removeExtensionWord)
  // 统一结算编排:加星 + 错题入本 + SRS 记录(同词去重)
  const { recordPick, restart, settle } = useSettleQuiz({
    module: 'starlight',
    from: mod ? `${mod.title} · Lesson ${lessonId}` : `Lesson ${lessonId}`,
    fallbackEmoji: mod?.emoji,
  })

  const lessons = mod?.lessons ?? []
  const lessonIdx = lessons.findIndex((l) => String(l.id) === lessonId)
  const lesson = lessonIdx >= 0 ? lessons[lessonIdx] : null

  const words = lesson?.words ?? []
  const sentences = lesson?.sentences ?? []
  // 课本原文：按「单元号-课号」取，教材 PDF 每课一份
  const book = mod && lesson ? getLessonBook(mod.id, lesson.id) : undefined
  const chapters = book?.sections ?? []
  // 拓展词 key 与课本原文保持同一套「单元号-课号」命名
  const lessonKey = `${mod?.id ?? 0}-${lesson?.id ?? 0}`
  const extensions = starlightExtensions[lessonKey] ?? []
  const frames = mod && lesson ? framesOfLesson(mod.slug, lesson.id) : []
  // 课文点读（D）：试点课有提取出的 passage，其余课回落到 BookTextView
  const passage = mod && lesson ? getPassage(mod.id, lesson.id) : undefined

  // 闯关题：听力题优先(听说核心)→ 课本原文选词填空 → 词义题/单元测验补足
  const quizItems = useMemo<QuizItem[]>(() => {
    // ① 听力题：本课单词自动朗读选中文,最多 4 题
    const listen = words.length > 0
      ? buildListeningQuiz(words, lessons.flatMap((l) => l.words), 4)
      : []
    // ② 选词填空：从真实课文挖空
    const cloze = chapters.length > 0
      ? buildClozeQuiz(chapters, {
          vocab: words,
          limit: 8,
          source: `Lesson ${lesson?.id} 《${lesson?.title ?? ''}》`,
          emoji: mod?.emoji ?? '📖',
        })
      : []
    const items = [...listen, ...cloze]
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

  // 本课句型框架卡播种进同一个复习池（kind='sentence'，与单词卡隔离）
  useEffect(() => {
    if (frames.length === 0) return
    seedSentenceFrames(frames, 'starlight')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, mod?.slug])

  // 换课时回到第一个标签，避免停留在上一课的闯关结果页
  useEffect(() => { setTab('vocab'); setSentIdx(0) }, [lessonId, unitId])

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/starlight" className="btn">返回主课</Link>
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
  // 课级完成状态:闯关全对自动标记,或手动点「本课完成」
  const lessonDone = lessonCompleted[mod.slug]?.includes(lesson.id) ?? false

  return (
    <div className="page lesson-preview" style={mcStyle}>
      <Breadcrumb
        items={[
          { label: '🏠', to: '/' },
          { label: 'Starlight 主课', to: '/starlight' },
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
            className={'tab-btn' + (tab === 'speak' ? ' active' : '')}
            onClick={() => setTab('speak')}
          >
            🗣️ 跟读
          </button>
          <button
            type="button"
            className={'tab-btn' + (tab === 'frame' ? ' active' : '')}
            onClick={() => setTab('frame')}
          >
            🧩 句型
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

        {tab === 'vocab' && (
          <>
            <VocabTab words={words} mcStyle={mcStyle} />
            <ExtensionSection
              words={extensions}
              onRemove={(en) => removeExtensionWord(lessonKey, en)}
              onOpenEntry={() => setShowExtEntry(true)}
            />
          </>
        )}
        {tab === 'speak' && (
          sentences.length === 0 ? (
            <div className="empty"><p>这一课还没有跟读句子。</p></div>
          ) : (
            <div className="speak-zone" style={mcStyle}>
              <p className="lead">
                先听一遍示范，再跟着读一遍。
                <span className="sent-hint">读得好会点亮星星，读不准可以再试，识别不了请家长帮忙确认</span>
              </p>
              <div className="speak-nav">
                <button type="button" className="btn btn-soft" disabled={sentIdx === 0}
                  onClick={() => setSentIdx((i) => Math.max(0, i - 1))}>← 上一句</button>
                <span className="speak-count">{sentIdx + 1} / {sentences.length}</span>
                <button type="button" className="btn btn-soft" disabled={sentIdx >= sentences.length - 1}
                  onClick={() => setSentIdx((i) => Math.min(sentences.length - 1, i + 1))}>下一句 →</button>
              </div>
              <SentenceReader
                key={`${lessonKey}-${sentIdx}`}
                sentence={sentences[sentIdx].en}
                zh={sentences[sentIdx].zh}
                onPass={() => {
                  seedCards([sentences[sentIdx].en], 'starlight')
                  recordReview(sentences[sentIdx].en, true, 'starlight')
                }}
              />
            </div>
          )
        )}
        {tab === 'frame' && (
          frames.length === 0 ? (
            <div className="empty"><p>这一课还没有句型框架卡。</p></div>
          ) : (
            <div className="frame-zone" style={mcStyle}>
              <p className="lead">
                先把句子补完整，再用整句说出来。
                <span className="sent-hint">框架卡会进复习池，到期时在智能复习里练</span>
              </p>
              {frames.map((f) => (
                <SentenceFrameCard
                  key={f.id}
                  frame={f}
                  onPass={() => {
                    seedSentenceFrames([f], 'starlight')
                    recordReview(`frame:${hashPattern(f.pattern)}`, true, 'starlight')
                  }}
                />
              ))}
            </div>
          )
        )}
        {tab === 'book' && (
          <>
            <PatternStrip sentences={sentences} mcStyle={mcStyle} />
            {passage ? (
              <section className="passage-zone" style={mcStyle}>
                <p className="lead">
                  点任意单词听发音、看词义，点的词会按记忆强度着色。
                  <span className="sent-hint">🟩 熟 · 🟨 模糊 · ⬜ 未知</span>
                </p>
                {passage.lines.map((line, i) => (
                  <TappableText
                    key={i}
                    text={line}
                    vocab={words}
                    boxOf={(en) => srsCards[en]?.box}
                  />
                ))}
                <PassageLegend />
              </section>
            ) : hasBook ? (
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
            onPick={({ en, correct }) => recordPick(en, correct)}
            onRestart={restart}
            onFinish={(correct, total, wrongEns) => {
              settle(correct, total, wrongEns, words, () => {
                markQuizDone(mod.slug)
                // 闯关全对 ⇒ 自动标记本课完成
                if (correct === total && total > 0) markLessonDone(mod.slug, lesson.id)
              })
            }}
          />
        )}
      </SafeBoundary>

      <ExtensionWordEntry
        open={showExtEntry}
        existing={extensions.map((w) => w.en)}
        onSubmit={(w) => addExtensionWord(lessonKey, w)}
        onCancel={() => setShowExtEntry(false)}
      />
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

      {/* 课级完成:手动标记(闯关全对也会自动标记) */}
      <div style={{ textAlign: 'center', marginTop: '18px' }}>
        {lessonDone ? (
          <p style={{ color: 'var(--ok)', fontWeight: 600 }}>✅ 本课已完成学习</p>
        ) : (
          <button
            type="button"
            className="btn btn-soft"
            onClick={() => setShowLessonDone(true)}
          >
            ✅ 标记本课完成
          </button>
        )}
      </div>
      <ConfirmDialog
        open={showLessonDone}
        emoji="✅"
        title="学完这一课了吗？"
        message="标记后这一课就算完成啦，可以在课程列表里看到进度。"
        confirmText="完成啦"
        cancelText="再学一会儿"
        onConfirm={() => {
          markLessonDone(mod.slug, lesson.id)
          setShowLessonDone(false)
        }}
        onCancel={() => setShowLessonDone(false)}
      />
    </div>
  )
}

function VocabTab({ words, mcStyle }: { words: Word[]; mcStyle: React.CSSProperties }) {
  const [idx, setIdx] = useState(0)
  const [showZh, setShowZh] = useState(true)
  const [selfChecked, setSelfChecked] = useState<Set<string>>(new Set())
  const seedCards = useCourseStore((s) => s.seedCards)
  const recordReview = useCourseStore((s) => s.recordReview)
  // 首卡/首次进入不自动发音(等用户点击),避免挂载即响;仅「切换单词」时发音
  const firstSpeakRef = useRef(true)
  useEffect(() => { setIdx(0); setShowZh(true); setSelfChecked(new Set()) }, [words])

  // 自评:翻面看到中文后,点「会了/不会」把记忆反馈写回 SRS,
  // 让预习从被动翻卡升级为主动回忆(与智能复习同一调度池)
  const selfAssess = (en: string, know: boolean) => {
    seedCards([en], 'starlight')
    recordReview(en, know, 'starlight')
    setSelfChecked((s) => new Set(s).add(en))
  }

  // 切换单词（上一个/下一个/点圆点/进入单词卡）时自动发音;首卡不自动读
  useEffect(() => {
    if (firstSpeakRef.current) {
      firstSpeakRef.current = false
      return
    }
    const cur = words[idx]
    if (cur) speakText(cur.en)
  }, [idx, words])

  if (words.length === 0) {
    return <div className="empty"><p>这一课还没有单词内容。</p></div>
  }

  const w = words[idx]
  const prev = () => setIdx((i) => (i - 1 + words.length) % words.length)
  const next = () => setIdx((i) => (i + 1) % words.length)

  return (
    <>
      <Flashcard
        emoji={w.emoji}
        en={w.en}
        zh={w.zh}
        ipa={w.ipa}
        showZh={showZh}
        onToggleZh={() => setShowZh((v) => !v)}
        mcStyle={mcStyle}
        footer={
          selfChecked.has(w.en) ? (
            <p className="fc-self-done">⭐ 已记录，继续加油！</p>
          ) : (
            <div className="fc-self-check">
              <button
                type="button"
                className="btn btn-soft"
                onClick={() => selfAssess(w.en, false)}
              >
                😅 还不会
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => selfAssess(w.en, true)}
              >
                ✅ 我会了
              </button>
            </div>
          )
        }
      />

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

// E 课堂拓展词区：➕ 加词 + 列表（带「拓展」角标）+ 删除。
// 数据存在 store 的 starlightExtensions，教材 lessons.ts 不受影响。
function ExtensionSection({
  words,
  onRemove,
  onOpenEntry,
}: {
  words: Word[]
  onRemove: (en: string) => void
  onOpenEntry: () => void
}) {
  return (
    <section className="ext-zone">
      <div className="ext-zone-head">
        <span>➕ E 课堂拓展词（{words.length}）</span>
        <button type="button" className="btn btn-soft" onClick={onOpenEntry}>
          ➕ 加词
        </button>
      </div>
      {words.length === 0 ? (
        <p className="ext-empty">老师课上临时教的词，录进来就会自动进复习队列。</p>
      ) : (
        <div className="ext-list">
          {words.map((w) => (
            <div key={w.en} className="ext-item">
              <span className="ext-emoji">{w.emoji || '📝'}</span>
              <span className="ext-en">{w.en}</span>
              {w.zh && <span className="ext-zh">{w.zh}</span>}
              <span className="ext-badge">拓展</span>
              <span onClick={(e) => e.stopPropagation()}>
                <SpeakButton text={w.en} label={w.en} />
              </span>
              <button
                type="button"
                className="ext-del"
                aria-label={`删除 ${w.en}`}
                title="删除这个拓展词"
                onClick={() => onRemove(w.en)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
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
