// 泛型故事页：Fly Guy 与 Rocket Girl 共用同一套「单词卡 / 例句 / 闯关」交互。
// 两个模块的差异（主题色、文案、emoji、底部导航布局）全部通过 props 注入，
// 页面本身不重复实现任何逻辑。新增故事类模块 = 在 data 层注册 + 写一个 ~15 行薄壳。

import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import Flashcard from '@/components/Flashcard'
import SafeBoundary from '@/components/SafeBoundary'
import ConfirmDialog from '@/components/ConfirmDialog'
import QuizEngine from '@/components/QuizEngine'
import BookTextView from '@/components/BookTextView'
import { useCourseStore } from '@/store/useCourseStore'
import { useSettleQuiz } from '@/hooks/useSettleQuiz'
import { speakText } from '@/utils/speak'
import { moduleThemeVars } from '@/utils/theme'
import { cleanForSpeak } from '@/utils/bookDict'
import { buildClozeQuiz, buildWordQuiz } from '@/utils/bookQuiz'
import { isPassed } from '@/utils/stars'
import type { ModuleId } from '@/data/modules'
import type { Story, StoryWord } from '@/data/story-types'

interface StoryPageProps {
  moduleId: ModuleId
  theme: { color: string; colorSoft: string }
  stories: Story[]
  getStory: (slug: string) => Story | undefined
  basePath: string
  label: string
  moduleEmoji: string
}

type Tab = 'vocab' | 'sentences' | 'quiz'

export default function StoryPage({
  moduleId,
  theme,
  stories,
  getStory,
  basePath,
  label,
  moduleEmoji,
}: StoryPageProps) {
  const { slug = '' } = useParams()
  const story = getStory(slug)

  const seedCards = useCourseStore((s) => s.seedCards)
  const markStoryDone = useCourseStore((s) => s.markStoryDone)
  const completedStories = useCourseStore((s) => s.completedStories)
  // 统一结算编排:加星(quizStars 星规) + 错题全量入本 + SRS 记录(同词去重),
  // 与 Starlight 主课闯关保持同一套激励与错题漏斗
  const { recordPick, restart, settle } = useSettleQuiz({
    module: moduleId,
    from: story?.title ?? slug,
    fallbackEmoji: moduleEmoji,
  })
  const storyDone = story ? completedStories.includes(story.slug) : false

  const [tab, setTab] = useState<Tab>('vocab')
  const [showStoryDone, setShowStoryDone] = useState(false)
  // useMemo 保证引用稳定,供下方 quiz useMemo 依赖
  const words = useMemo(() => story?.words ?? [], [story])

  // 进入故事:把单词种子化进 SRS 调度池
  useEffect(() => {
    if (words.length === 0) return
    seedCards(words.map((w) => w.en), moduleId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.slug])

  // 出题:有绘本原文用挖空题,否则用词义题(必须在 early return 之前调用,保证 hooks 顺序稳定)
  const quiz = useMemo(
    () => (story && story.bookText && story.bookText.length > 0
      ? buildClozeQuiz(story.bookText, { vocab: words, source: `《${story.title}》`, emoji: story.emoji })
      : buildWordQuiz(words, stories.flatMap((s) => s.words))),
    [story, stories, words]
  )

  if (!story) {
    return (
      <div className="empty">
        <p>没有找到这个 {label} 故事。</p>
        <Link to={basePath} className="btn">返回故事列表</Link>
      </div>
    )
  }

  const quizBadge = story.bookText && story.bookText.length > 0
    ? '📖 绘本选词填空 · 读原文选一选'
    : '🎯 闯关测验 · 听一听选一选'

  const storyIdx = stories.findIndex((s) => s.slug === story.slug)
  const prevStory = storyIdx > 0 ? stories[storyIdx - 1] : null
  const nextStory = storyIdx >= 0 && storyIdx < stories.length - 1 ? stories[storyIdx + 1] : null

  const mc = { '--mc': theme.color, '--mc-soft': theme.colorSoft } as React.CSSProperties

  const resultLinks = (
    <>
      <Link to="/wrong" className="btn btn-soft">📋 看错题本</Link>
      <Link to="/smart" className="btn btn-soft">🧠 去复习</Link>
      <Link to={basePath} className="btn btn-soft">{moduleEmoji} 返回故事列表</Link>
    </>
  )

  return (
    <div className="page lesson-preview" style={moduleThemeVars(theme)}>
      <div className="page-head" style={mc}>
        <span className="page-emoji">{story.emoji}</span>
        <div>
          <div className="page-kicker">{label} · 第 {story.id} 关</div>
          <h1 className="page-title">{story.title}</h1>
        </div>
      </div>

      <SafeBoundary label={`${label} 学习`}>
        <div className="mode-badge mode-preview">{moduleEmoji} {label} 主题课</div>

        <div className="tab-bar" style={mc}>
          <button type="button" className={'tab-btn' + (tab === 'vocab' ? ' active' : '')} onClick={() => setTab('vocab')}>
            🎴 单词卡
          </button>
          <button type="button" className={'tab-btn' + (tab === 'sentences' ? ' active' : '')} onClick={() => setTab('sentences')}>
            {story.bookText ? '📖 绘本原文' : '💬 例句'}
          </button>
          <button type="button" className={'tab-btn' + (tab === 'quiz' ? ' active' : '')} onClick={() => setTab('quiz')}>
            🎯 闯关
          </button>
        </div>

        {tab === 'vocab' && <VocabTab words={words} mc={mc} />}
        {tab === 'sentences' && <SentencesTab story={story} words={words} mc={mc} />}
        {tab === 'quiz' && (
          <QuizEngine
            quiz={quiz}
            mcStyle={mc}
            badgeText={quizBadge}
            resultTitle="闯关完成！"
            resultLinks={resultLinks}
            onPick={({ en, correct }) => recordPick(en, correct)}
            onRestart={restart}
            onFinish={(correct, total, wrongEns) => {
              settle(correct, total, wrongEns, words, () => {
                // 统一完成判定:≥80% 自动通关(与主课闯关/自学课自测同一口径)
                if (isPassed(correct, total)) markStoryDone(story.slug)
              })
            }}
          />
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to={basePath} className="back-link">← 故事列表</Link>
        <div className="lesson-nav">
          {prevStory && (
            <Link to={`${basePath}/${prevStory.slug}`} className="btn btn-soft">← 上一关</Link>
          )}
          {nextStory && (
            <Link to={`${basePath}/${nextStory.slug}`} className="btn">下一关 →</Link>
          )}
        </div>
      </div>

      {/* 关卡完成:闯关 ≥80% 自动标记,或手动点「本关完成」(与主课同一套完成语义) */}
      <div style={{ textAlign: 'center', marginTop: '18px' }}>
        {storyDone ? (
          <p style={{ color: 'var(--ok)', fontWeight: 600 }}>✅ 本关已完成学习</p>
        ) : (
          <button type="button" className="btn btn-soft" onClick={() => setShowStoryDone(true)}>
            ✅ 标记本关完成
          </button>
        )}
      </div>
      <ConfirmDialog
        open={showStoryDone}
        emoji="✅"
        title="学完这一关了吗？"
        message="标记后这一关就算通关啦，可以在故事列表里看到进度。"
        confirmText="完成啦"
        cancelText="再学一会儿"
        onConfirm={() => {
          markStoryDone(story.slug)
          setShowStoryDone(false)
        }}
        onCancel={() => setShowStoryDone(false)}
      />
    </div>
  )
}

function VocabTab({ words, mc }: { words: StoryWord[]; mc: React.CSSProperties }) {
  const [idx, setIdx] = useState(0)
  const [showZh, setShowZh] = useState(true)
  // 首卡/首次进入不自动发音(等用户点击),与 LessonPreview 单词卡行为对齐
  const firstSpeakRef = useRef(true)
  useEffect(() => { setIdx(0); setShowZh(true) }, [words])

  useEffect(() => {
    if (firstSpeakRef.current) {
      firstSpeakRef.current = false
      return
    }
    const cur = words[idx]
    if (cur) speakText(cur.en)
  }, [idx, words])

  if (words.length === 0) return <div className="empty"><p>这一关还没有单词。</p></div>

  const w = words[idx]
  const prev = () => setIdx((i) => (i - 1 + words.length) % words.length)
  const next = () => setIdx((i) => (i + 1) % words.length)

  return (
    <>
      <Flashcard
        emoji={w.emoji}
        en={w.en}
        zh={w.zh}
        showZh={showZh}
        onToggleZh={() => setShowZh((v) => !v)}
        mcStyle={mc}
        extra={
          w.sentence && (
            <div className="rg-sentence">
              <span className="rg-sentence-en">“{w.sentence}”</span>
              <span onClick={(e) => e.stopPropagation()}>
                <SpeakButton text={w.sentence} label="听例句" />
              </span>
              {w.sentenceZh && <span className="rg-sentence-zh">{w.sentenceZh}</span>}
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

      <div className="word-list-mini" style={mc}>
        {words.map((ww, i) => (
          <div
            key={ww.en}
            className={'word-chip' + (i === idx ? ' on' : '')}
            onClick={() => setIdx(i)}
          >
            <span>{ww.emoji ?? '✨'}</span>
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

function SentencesTab({ story, words, mc }: { story: Story; words: StoryWord[]; mc: React.CSSProperties }) {
  const bookText = story.bookText
  // 绘本原文优先:按章节 / 页码顺序整段展示,不按单词列句
  if (bookText && bookText.length > 0) {
    return (
      <BookTextView
        chapters={bookText}
        mc={mc}
        lead={
          <>
            这是绘本的真实原文，按书里的章节顺序读一遍吧。
            <span className="sent-hint">点单词听发音，鼠标悬停看中文意思</span>
          </>
        }
      />
    )
  }
  // 回退:无绘本原文的故事,仍按单词展示(学法句型 / 绘本原句)
  const withSent = words.filter((w) => w.sentence || w.bookSentence)
  if (withSent.length === 0) return <div className="empty"><p>这一关还没有例句。</p></div>
  return (
    <>
      <p className="lead">
        点击句子里高亮的单词，可以单独听发音。
        <span className="sent-hint">📖 绘本原句 取自绘本真实文字</span>
      </p>
      <div className="sent-list">
        {withSent.map((s, i) => {
          const isBook = !!s.bookSentence
          const text = s.bookSentence ?? s.sentence!
          const textZh = s.bookSentenceZh ?? s.sentenceZh
          const tokens = text.split(/\s+/).filter(Boolean)
          return (
            <div key={i} className="sent-card" style={mc}>
              <div className="sent-en-row">
                <span className="sent-en">
                  <b>{s.en}</b> · {s.zh}
                </span>
                <SpeakButton text={text} label={isBook ? '听绘本原句' : '听例句'} />
              </div>
              <div className="book-sentence">
                <div className="book-sentence-head">
                  <span className={'book-sentence-tag' + (isBook ? '' : ' book-sentence-tag--fallback')}>
                    {isBook ? '📖 绘本原句' : '例句'}
                  </span>
                </div>
                <div className="sent-zh sent-example">
                  “
                  {tokens.map((tk, j) => (
                    <span
                      key={j}
                      className="rg-word-inline"
                      onClick={() => speakText(cleanForSpeak(tk))}
                      title="点单词听发音"
                    >
                      {tk}
                    </span>
                  ))}
                  ”
                </div>
                {textZh && <div className="rg-sentence-zh">（{textZh}）</div>}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
