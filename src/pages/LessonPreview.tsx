// Starlight 单课学习页：五区布局
//   🎴 单词区 —— 逐词翻卡 + 本课词表 + ➕ E 课堂拓展词（录入 / 删除）
//   🗣️ 跟读区 —— 逐句跟读：播原句 → 孩子跟读 → 逐词高亮 → 达标入 SRS（没听清自动重听，识别不了孩子自己重读或跳过）
//   🧩 句型区 —— 句子框架卡：填空 + 说出整句
//   📖 课文区 —— 教材 PDF 提取的真实课文（逐词可点、可听、带中文），顶部先给本课重点句型
//   🎯 闯关   —— 从课本原文挖空生成选词填空，题量不足时用本课单词与单元测验补足
// 三个逻辑模块共用 BookTextView / bookQuiz / bookDict，逻辑不在页面里重复实现。

import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import Flashcard from '@/components/Flashcard'
import SafeBoundary from '@/components/SafeBoundary'
import QuizEngine, { type QuizItem } from '@/components/QuizEngine'
import BookTextView from '@/components/BookTextView'
import TappableText, { PassageLegend } from '@/components/TappableText'
import Breadcrumb from '@/components/Breadcrumb'
import ExtensionWordEntry from '@/components/ExtensionWordEntry'
import SentenceReader from '@/components/SentenceReader'
import SentenceFrameCard from '@/components/SentenceFrameCard'
import { EXT_LIMIT, lessonTopicZh, suggestExtensions, type ExtWord } from '@/data/extensionTopics'
import { getModule, STARLIGHT_THEME, type Sentence, type Word } from '@/data/starlight'
import { getLessonBook } from '@/data/starlight-book'
import { getPassage } from '@/data/starlight-passage'
import { framesOfLesson, frameCardKey } from '@/data/sentenceFrame'
import { useCourseStore } from '@/store/useCourseStore'
import { useSettleQuiz } from '@/hooks/useSettleQuiz'
import { speakText } from '@/utils/speak'
import { buildLineZhIndex, lineZhOf } from '@/utils/passageZh'
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
  const [showExtEntry, setShowExtEntry] = useState(false)
  const [sentIdx, setSentIdx] = useState(0)
  // 点「上一句 / 下一句」后，新一句挂载时自动播一遍示范
  const [sentAutoPlay, setSentAutoPlay] = useState(false)
  // 离开跟读区就收起自动播，避免切回来时莫名出声
  useEffect(() => {
    if (tab !== 'speak') setSentAutoPlay(false)
  }, [tab])
  const seedSentenceFrames = useCourseStore((s) => s.seedSentenceFrames)
  const starlightExtensions = useCourseStore((s) => s.starlightExtensions)
  const addExtensionWord = useCourseStore((s) => s.addExtensionWord)
  const removeExtensionWord = useCourseStore((s) => s.removeExtensionWord)
  const extensionRound = useCourseStore((s) => s.extensionRound)
  const fillExtensionWords = useCourseStore((s) => s.fillExtensionWords)
  // 统一结算编排:加星 + 错题入本 + SRS 记录(同词去重)
  const { recordPick, restart, settle } = useSettleQuiz({
    module: 'starlight',
    from: mod ? `${mod.title} · Lesson ${lessonId}` : `Lesson ${lessonId}`,
    fallbackEmoji: mod?.emoji,
  })

  const lessons = mod?.lessons ?? []
  const lessonIdx = lessons.findIndex((l) => String(l.id) === lessonId)
  const lesson = lessonIdx >= 0 ? lessons[lessonIdx] : null

  const words = useMemo(() => lesson?.words ?? [], [lesson])
  const sentences = lesson?.sentences ?? []
  // 课本原文：按「单元号-课号」取，教材 PDF 每课一份
  const book = mod && lesson ? getLessonBook(mod.id, lesson.id) : undefined
  // 包一层 useMemo：否则每次渲染都是新数组，下游 lineZhIndex / quizItems 的依赖会跟着抖
  const chapters = useMemo(() => book?.sections ?? [], [book])
  // 拓展词 key 与课本原文保持同一套「单元号-课号」命名
  const lessonKey = `${mod?.id ?? 0}-${lesson?.id ?? 0}`
  // useMemo：空数组不能每次渲染都造新的，否则下面自动填充 effect 的依赖会一直抖
  const extensions = useMemo(
    () => starlightExtensions[lessonKey] ?? [],
    [starlightExtensions, lessonKey]
  )
  const round = extensionRound[lessonKey] ?? 0
  const [fillHint, setFillHint] = useState('')
  // 切课时清掉上一课的填充提示
  useEffect(() => { setFillHint('') }, [lessonKey])
  // 首次进这一课且拓展词是空的 → 按本课主题自动补一批。
  // 只填一次：extensionRound 记住轮次，之后即使被删空也不会反复填回（想再填点「✨ 自动填充」）。
  useEffect(() => {
    if (!lesson) return
    if (round > 0) return
    if (extensions.length > 0) return
    fillExtensionWords(lessonKey, suggestExtensions({ lessonKey, lessonWords: words, existing: [] }), 1)
  }, [lesson, lessonKey, words, extensions, round, fillExtensionWords])
  // ✨ 自动填充 / 🔄 换一批：换一批只替换带「自动」标记的词，手动录入的词原样保留
  const handleAutoFill = () => {
    const manual = extensions.filter((x) => !x.auto)
    const next = suggestExtensions({
      lessonKey,
      lessonWords: words,
      existing: manual,
      round: round + 1,
    })
    if (next.length === 0) {
      setFillHint('这一课相关的词都填过了，剩下的可以自己 ➕ 加词。')
      return
    }
    setFillHint('')
    fillExtensionWords(lessonKey, next, round + 1)
  }
  const frames = mod && lesson ? framesOfLesson(mod.slug, lesson.id) : []
  // 课文点读（D）：试点课有提取出的 passage，其余课回落到 BookTextView
  const passage = mod && lesson ? getPassage(mod.id, lesson.id) : undefined
  // 点读区整句中文索引：课本 textZh（人工翻译） > 本单元句子表；都查不到时逐词拼粗释义
  const lineZhIndex = useMemo(
    () =>
      buildLineZhIndex([
        chapters.flatMap((ch) => ch.pages.map((p) => ({ en: p.text, zh: p.textZh }))),
        mod.lessons.flatMap((l) => l.sentences.map((s) => ({ en: s.en, zh: s.zh }))),
      ]),
    [chapters, mod]
  )

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
  const hasBook = chapters.length > 0
  // 课级完成状态：仅由「闯关全对」自动标记（手动标记按钮已移除，防小孩误点）
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
              topic={lessonTopicZh(lessonKey)}
              round={round}
              hint={fillHint}
              onRemove={(en) => removeExtensionWord(lessonKey, en)}
              onOpenEntry={() => setShowExtEntry(true)}
              onAutoFill={handleAutoFill}
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
                <span className="sent-hint">读得好会点亮星星，读不准可以再试，没听清会自动再听一次</span>
              </p>
              <div className="speak-nav">
                <button type="button" className="btn btn-soft" disabled={sentIdx === 0}
                  onClick={() => { setSentAutoPlay(true); setSentIdx((i) => Math.max(0, i - 1)) }}>← 上一句</button>
                <span className="speak-count">{sentIdx + 1} / {sentences.length}</span>
                <button type="button" className="btn btn-soft" disabled={sentIdx >= sentences.length - 1}
                  onClick={() => { setSentAutoPlay(true); setSentIdx((i) => Math.min(sentences.length - 1, i + 1)) }}>下一句 →</button>
              </div>
              <SentenceReader
                key={`${lessonKey}-${sentIdx}`}
                sentence={sentences[sentIdx].en}
                zh={sentences[sentIdx].zh}
                onPass={() => {
                  seedCards([sentences[sentIdx].en], 'starlight')
                  recordReview(sentences[sentIdx].en, true, 'starlight')
                }}
                autoPlay={sentAutoPlay}
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
                    recordReview(frameCardKey(f), true, 'starlight')
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
                {passage.lines.map((line, i) => {
                  const { zh, auto } = lineZhOf(lineZhIndex, line)
                  return (
                    <TappableText
                      key={i}
                      text={line}
                      textZh={zh}
                      textZhAuto={auto}
                      vocab={words}
                      boxOf={(en) => srsCards[en]?.box}
                    />
                  )
                })}
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
      </div>

      {/* 课级完成：只展示状态，不再提供手动标记（闯关全对会自动标记） */}
      {lessonDone && (
        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <p style={{ color: 'var(--ok)', fontWeight: 600 }}>✅ 本课已完成学习</p>
        </div>
      )}
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

// E 课堂拓展词区：✨ 自动填充 / 🔄 换一批 + ➕ 加词 + 列表（带角标）+ 删除。
// 每课上限 EXT_LIMIT（5）个：满了禁用「➕ 加词」，但只要还有自动填的词就能「换一批」。
// 数据存在 store 的 starlightExtensions，教材 lessons.ts 不受影响。
function ExtensionSection({
  words,
  topic,
  round,
  hint,
  onRemove,
  onOpenEntry,
  onAutoFill,
}: {
  words: ExtWord[]
  /** 本课主题名（如「颜色」），没有配主题时不显示 */
  topic?: string
  /** 当前填充轮次（0 = 还没自动填充过） */
  round: number
  /** 填充失败/无候选时的提示文案 */
  hint?: string
  onRemove: (en: string) => void
  onOpenEntry: () => void
  onAutoFill: () => void
}) {
  const full = words.length >= EXT_LIMIT
  // 满 5 个仍可换一批（换掉的是自动词）；只有 5 个全是手动录入时才没得换
  const canAutoFill = !full || words.some((w) => w.auto)
  return (
    <section className="ext-zone">
      <div className="ext-zone-head">
        <span className="ext-title">
          ➕ E 课堂拓展词（{words.length}/{EXT_LIMIT}）
          {topic && <em className="ext-topic">主题：{topic}</em>}
        </span>
        <span className="ext-actions">
          <button
            type="button"
            className="btn btn-soft"
            disabled={!canAutoFill}
            onClick={onAutoFill}
            title={canAutoFill ? '按本课主题补一批拓展词' : '全是手动录入的词，没有可替换的'}
          >
            {words.length === 0 ? '✨ 自动填充' : '🔄 换一批'}
          </button>
          <button
            type="button"
            className="btn btn-soft"
            disabled={full}
            onClick={onOpenEntry}
            title={full ? `本课拓展词已达上限 ${EXT_LIMIT} 个` : '手动录入一个拓展词'}
          >
            ➕ 加词
          </button>
        </span>
      </div>
      {hint && <p className="ext-hint">{hint}</p>}
      {words.length === 0 ? (
        <p className="ext-empty">
          {round === 0
            ? '点「✨ 自动填充」按本课主题补 5 个拓展词；老师课上临时教的词也可以 ➕ 录进来。'
            : '这一课的拓展词已清空，可再点「✨ 自动填充」重新补一批。'}
        </p>
      ) : (
        <div className="ext-list">
          {words.map((w) => (
            <div key={w.en} className="ext-item">
              <span className="ext-emoji">{w.emoji || '📝'}</span>
              <span className="ext-en">{w.en}</span>
              {w.zh && <span className="ext-zh">{w.zh}</span>}
              <span className="ext-badge">{w.auto ? '自动' : '拓展'}</span>
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
