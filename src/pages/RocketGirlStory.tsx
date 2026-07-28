import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import SafeBoundary from '@/components/SafeBoundary'
import { getStory, rocketGirlStories, type RGWord, RG_THEME } from '@/data/rocketgirl'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { moduleThemeVars } from '@/utils/theme'

type Tab = 'vocab' | 'sentences' | 'quiz'

const mcStyle = { '--mc': RG_THEME.color, '--mc-soft': RG_THEME.colorSoft } as React.CSSProperties

interface QuizItem {
  q: string
  options: string[]
  answer: number
  explain: string
  speakText: string
  emoji?: string
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// 从本故事单词生成闯关题(每词 1 题,最多 12 题)
function buildQuiz(storyWords: RGWord[]): QuizItem[] {
  const allPool = rocketGirlStories.flatMap((s) => s.words)
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

export default function RocketGirlStory() {
  const { slug = '' } = useParams()
  const story = getStory(slug)

  const seedCards = useCourseStore((s) => s.seedCards)
  const addStars = useCourseStore((s) => s.addStars)
  const markPreviewDone = useCourseStore((s) => s.markPreviewDone)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addWrongWord = useCourseStore((s) => s.addWrongWord)

  const [tab, setTab] = useState<Tab>('vocab')
  const words = story?.words ?? []

  // 进入故事:把单词种子化进 SRS 调度池
  useEffect(() => {
    if (words.length === 0) return
    seedCards(words.map((w) => w.en))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.slug])

  if (!story) {
    return (
      <div className="empty">
        <p>没有找到这个 Rocket Girl 故事。</p>
        <Link to="/rocketgirl" className="btn">返回故事列表</Link>
      </div>
    )
  }

  const quiz = useMemo(() => buildQuiz(words), [story.slug])

  const storyIdx = rocketGirlStories.findIndex((s) => s.slug === story.slug)
  const prevStory = storyIdx > 0 ? rocketGirlStories[storyIdx - 1] : null
  const nextStory = storyIdx >= 0 && storyIdx < rocketGirlStories.length - 1 ? rocketGirlStories[storyIdx + 1] : null

  return (
    <div className="page lesson-preview" style={moduleThemeVars(RG_THEME)}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{story.emoji}</span>
        <div>
          <div className="page-kicker">Rocket Girl · 第 {story.id} 关</div>
          <h1 className="page-title">{story.title}</h1>
        </div>
      </div>

      <SafeBoundary label="Rocket Girl 学习">
        <div className="mode-badge mode-preview">🚀 Rocket Girl 主题课</div>

        <div className="tab-bar" style={mcStyle}>
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

        {tab === 'vocab' && <VocabTab words={words} />}
        {tab === 'sentences' && <SentencesTab words={words} />}
        {tab === 'quiz' && (
          <QuizTab
            quiz={quiz}
            storyTitle={story.title}
            onFinish={(correct, total, wrongEns) => {
              const stars = correct === total ? correct + 5 : correct
              addStars(stars)
              markPreviewDone(story.slug)
              wrongEns.forEach((en) => {
                const w = words.find((x) => x.en === en)
                if (w) addWrongWord({ en: w.en, zh: w.zh, emoji: w.emoji ?? '🚀', from: story.title })
              })
            }}
            onPick={(en, correct) => {
              seedCards([en])
              recordReview(en, correct)
            }}
          />
        )}
      </SafeBoundary>

      <div className="page-nav">
        <div className="lesson-nav">
          {prevStory && (
            <Link to={`/rocketgirl/${prevStory.slug}`} className="btn btn-soft">← 上一关</Link>
          )}
          <Link to="/rocketgirl" className="btn">🚀 故事列表</Link>
          {nextStory && (
            <Link to={`/rocketgirl/${nextStory.slug}`} className="btn">下一关 →</Link>
          )}
        </div>
      </div>
    </div>
  )
}

function VocabTab({ words }: { words: RGWord[] }) {
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
      <div className="flashcard" style={mcStyle}>
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

      <div className="word-list-mini" style={mcStyle}>
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

function SentencesTab({ words }: { words: RGWord[] }) {
  const withSent = words.filter((w) => w.sentence)
  if (withSent.length === 0) return <div className="empty"><p>这一关还没有例句。</p></div>
  return (
    <>
      <p className="lead">点击例句里高亮的单词，可以单独听发音。</p>
      <div className="sent-list">
        {withSent.map((s, i) => {
          const tokens = s.sentence!.split(/\s+/).filter(Boolean)
          return (
            <div key={i} className="sent-card" style={mcStyle}>
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

// 去掉句末标点,避免 TTS 把 "." 也读出来
function cleanForSpeak(tok: string): string {
  return tok.replace(/[.,!?;:]"'`]+$/g, '').trim() || tok
}

function QuizTab({
  quiz,
  storyTitle,
  onFinish,
  onPick,
}: {
  quiz: QuizItem[]
  storyTitle: string
  onFinish: (correct: number, total: number, wrongEns: string[]) => void
  onPick: (en: string, correct: boolean) => void
}) {
  const [idx, setIdx] = useState(0)
  const [states, setStates] = useState<{ picked: number | null; answered: boolean }[]>([])
  const [done, setDone] = useState(false)
  const submittedRef = useRef(false)

  const cur = quiz[idx]
  const curState = states[idx]
  const isAnswered = !!curState?.answered
  const isCorrect = isAnswered && curState.picked === cur.answer

  useEffect(() => {
    if (!done || submittedRef.current) return
    submittedRef.current = true
    let correct = 0
    const wrongEns: string[] = []
    quiz.forEach((q, i) => {
      const st = states[i]
      if (st?.answered && st.picked === q.answer) correct++
      else if (st?.answered) wrongEns.push(q.speakText)
    })
    onFinish(correct, quiz.length, wrongEns)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  if (quiz.length === 0) return <div className="empty"><p>这一关还没有测验题。</p></div>

  const pick = (i: number) => {
    if (isAnswered) return
    setStates((prev) => {
      const copy = [...prev]
      copy[idx] = { picked: i, answered: true }
      return copy
    })
    const correct = i === cur.answer
    onPick(cur.speakText, correct)
    speakText(cur.options[i])
  }

  const goNext = () => {
    if (idx + 1 >= quiz.length) setDone(true)
    else setIdx((i) => i + 1)
  }

  const restart = () => {
    setIdx(0)
    setStates([])
    setDone(false)
    submittedRef.current = false
  }

  let correct = 0
  states.forEach((s, i) => {
    if (s.answered && s.picked === quiz[i].answer) correct++
  })

  return (
    <div className="listening-quiz" style={mcStyle}>
      <div className="mode-badge mode-review">🎯 闯关测验 · 听一听选一选</div>
      {done ? (
        <div className="result-card">
          <div className="result-emoji">{correct === quiz.length ? '🌟' : correct >= quiz.length / 2 ? '👍' : '💪'}</div>
          <h2 className="result-title">闯关完成！</h2>
          <div className="result-score">
            答对 <b>{correct}</b> / {quiz.length} 题
          </div>
          <div className="result-bar">
            <div className="result-bar-fill" style={{ width: `${(correct / quiz.length) * 100}%` }} />
          </div>
          <p className="result-tip">
            {correct === quiz.length
              ? `太棒了！全对！+5 额外星星 🎉`
              : '错题已加入错题本，再练练一定行！'}
          </p>
          <div className="result-actions">
            <button type="button" className="btn btn-sun" onClick={restart}>🔁 再做一次</button>
            <Link to="/wrong" className="btn btn-soft">📋 看错题本</Link>
            <Link to="/rocketgirl" className="btn btn-soft">🚀 返回故事列表</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="quiz-meta">
            <span>第 {idx + 1} / {quiz.length} 题</span>
            <span>已答对 {correct} 题</span>
          </div>
          <div className="quiz-progress">
            <div className="quiz-progress-fill" style={{ width: `${(idx / quiz.length) * 100}%` }} />
          </div>
          <div className="quiz-q" style={mcStyle}>
            <div className="quiz-q-row">
              <span>{cur.emoji ? `${cur.emoji} ` : ''}{cur.q}</span>
              <SpeakButton text={cur.speakText} label="听发音" />
            </div>
            <div className="quiz-opts">
              {cur.options.map((opt, i) => {
                let cls = 'quiz-opt'
                if (isAnswered) {
                  if (i === cur.answer) cls += ' correct'
                  else if (i === curState.picked) cls += ' wrong'
                }
                return (
                  <div key={i} className={cls} onClick={() => !isAnswered && pick(i)}>
                    <span className="quiz-opt-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                    <span onClick={(e) => e.stopPropagation()}>
                      <SpeakButton text={opt} label={opt} />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          {isAnswered && (
            <div className={'explain ' + (isCorrect ? 'ok' : 'no')}>
              <div className="explain-head">
                {isCorrect ? '✅ 答对了！' : `❌ 正确答案是 ${String.fromCharCode(65 + cur.answer)}`}
              </div>
              <div className="explain-body">{cur.explain}</div>
            </div>
          )}
          <div className="quiz-controls">
            {isAnswered && (
              <button type="button" className={'btn ' + (isCorrect ? 'btn-sun' : '')} onClick={goNext}>
                {idx + 1 >= quiz.length ? '查看结果 🏁' : '下一题 →'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
