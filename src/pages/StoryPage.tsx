// 泛型故事页：Fly Guy 与 Rocket Girl 共用同一套「单词卡 / 例句 / 闯关」交互。
// 两个模块的差异（主题色、文案、emoji、底部导航布局）全部通过 props 注入，
// 页面本身不重复实现任何逻辑。新增故事类模块 = 在 data 层注册 + 写一个 ~15 行薄壳。

import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import SafeBoundary from '@/components/SafeBoundary'
import QuizEngine, { type QuizItem } from '@/components/QuizEngine'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { moduleThemeVars } from '@/utils/theme'
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

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// 从本故事单词生成闯关题(每词 1 题,最多 12 题)
function buildQuiz(storyWords: StoryWord[], allPool: StoryWord[]): QuizItem[] {
  const questions: QuizItem[] = []
  const limit = Math.min(storyWords.length, 12)
  for (let i = 0; i < limit; i++) {
    const target = storyWords[i]
    let distractPool = storyWords.filter((w) => w.en !== target.en)
    if (distractPool.length < 3) {
      distractPool = allPool.filter((w) => w.en !== target.en)
    }
    const distract = shuffle(distractPool).slice(0, 3)
    const options = shuffle([target, ...distract])
    const answer = options.findIndex((o) => o.en === target.en)
    questions.push({
      q: `哪个是"${target.zh}"？`,
      options: options.map((o) => o.en),
      answer,
      explain: `${target.en} 意思是"${target.zh}"。`,
      speakText: target.en,
      emoji: target.emoji,
    })
  }
  return questions
}

// 去掉句末标点,避免 TTS 把 "." 也读出来
function cleanForSpeak(tok: string): string {
  return tok.replace(/[.,!?;:]"'`]+$/g, '').trim() || tok
}

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
  const addStars = useCourseStore((s) => s.addStars)
  const markStoryDone = useCourseStore((s) => s.markStoryDone)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addWrongWord = useCourseStore((s) => s.addWrongWord)

  const [tab, setTab] = useState<Tab>('vocab')
  const words = story?.words ?? []

  // 进入故事:把单词种子化进 SRS 调度池
  useEffect(() => {
    if (words.length === 0) return
    seedCards(words.map((w) => w.en), moduleId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.slug])

  if (!story) {
    return (
      <div className="empty">
        <p>没有找到这个 {label} 故事。</p>
        <Link to={basePath} className="btn">返回故事列表</Link>
      </div>
    )
  }

  const quiz = useMemo(
    () => buildQuiz(words, stories.flatMap((s) => s.words)),
    [story.slug]
  )

  const storyIdx = stories.findIndex((s) => s.slug === story.slug)
  const prevStory = storyIdx > 0 ? stories[storyIdx - 1] : null
  const nextStory = storyIdx >= 0 && storyIdx < stories.length - 1 ? stories[storyIdx + 1] : null

  const mc = { '--mc': theme.color, '--mc-soft': theme.colorSoft } as React.CSSProperties

  const resultLinks = (
    <>
      <Link to="/wrong" className="btn btn-soft">📋 看错题本</Link>
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
            💬 例句
          </button>
          <button type="button" className={'tab-btn' + (tab === 'quiz' ? ' active' : '')} onClick={() => setTab('quiz')}>
            🎯 闯关
          </button>
        </div>

        {tab === 'vocab' && <VocabTab words={words} mc={mc} />}
        {tab === 'sentences' && <SentencesTab words={words} mc={mc} />}
        {tab === 'quiz' && (
          <QuizEngine
            quiz={quiz}
            mcStyle={mc}
            resultTitle="闯关完成！"
            resultLinks={resultLinks}
            onPick={({ en, correct }) => {
              seedCards([en], moduleId)
              recordReview(en, correct, moduleId)
            }}
            onFinish={(correct, total, wrongEns) => {
              const stars = correct === total ? correct + 5 : correct
              addStars(stars)
              markStoryDone(story.slug)
              wrongEns.forEach((en) => {
                const w = words.find((x) => x.en === en)
                if (w) addWrongWord({ en: w.en, zh: w.zh, emoji: w.emoji ?? moduleEmoji, from: story.title, module: moduleId })
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
    </div>
  )
}

function VocabTab({ words, mc }: { words: StoryWord[]; mc: React.CSSProperties }) {
  const [idx, setIdx] = useState(0)
  const [showZh, setShowZh] = useState(true)
  useEffect(() => { setIdx(0); setShowZh(true) }, [words])

  useEffect(() => {
    const cur = words[idx]
    if (cur) speakText(cur.en)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, words])

  if (words.length === 0) return <div className="empty"><p>这一关还没有单词。</p></div>

  const w = words[idx]
  const prev = () => setIdx((i) => (i - 1 + words.length) % words.length)
  const next = () => setIdx((i) => (i + 1) % words.length)

  return (
    <>
      <div className="flashcard" style={mc}>
        <div className="fc-emoji">{w.emoji ?? '✨'}</div>
        <div className="fc-word-row">
          <button type="button" className="fc-word" onClick={() => speakText(w.en)}>{w.en}</button>
          <SpeakButton text={w.en} label={w.en} />
          <SpeakButton text={w.en} label={`${w.en} 慢速`} slow />
        </div>
        {showZh ? (
          <div className="fc-zh" onClick={() => setShowZh(false)} title="点击隐藏中文">
            {w.zh}
          </div>
        ) : (
          <button type="button" className="fc-reveal" onClick={() => setShowZh(true)}>
            👀 显示中文
          </button>
        )}
        {w.sentence && (
          <div className="rg-sentence">
            <span className="rg-sentence-en">“{w.sentence}”</span>
            <span onClick={(e) => e.stopPropagation()}>
              <SpeakButton text={w.sentence} label="听例句" />
            </span>
            {w.sentenceZh && <span className="rg-sentence-zh">{w.sentenceZh}</span>}
          </div>
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

function SentencesTab({ words, mc }: { words: StoryWord[]; mc: React.CSSProperties }) {
  const withSent = words.filter((w) => w.sentence)
  if (withSent.length === 0) return <div className="empty"><p>这一关还没有例句。</p></div>
  return (
    <>
      <p className="lead">点击例句里高亮的单词，可以单独听发音。</p>
      <div className="sent-list">
        {withSent.map((s, i) => {
          const tokens = s.sentence!.split(/\s+/).filter(Boolean)
          return (
            <div key={i} className="sent-card" style={mc}>
              <div className="sent-en-row">
                <span className="sent-en">
                  <b>{s.en}</b> · {s.zh}
                </span>
                <SpeakButton text={s.sentence!} label="听例句" />
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
              {s.sentenceZh && <div className="rg-sentence-zh">（{s.sentenceZh}）</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}
