// 通用测验引擎：被故事页（FlyGuy/RocketGirl）与 Starlight 听力测验共用。
// 只负责「选项卡 UI + 进度/正误状态机 + 结果卡」的渲染与交互，
// 具体的出题逻辑（buildQuiz）、选词后的 SRS 记录（onPick）、完成后的副作用（onFinish）
// 全部由调用方注入，保证各模块行为可独立定制、互不干扰。

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SpeakButton from './SpeakButton'
import { speakText } from '@/utils/speak'

export interface QuizItem {
  q: string
  options: string[]
  answer: number
  explain: string
  speakText: string
  emoji?: string
  /** Starlight 听力测验专用：标注该题来自第几课 */
  lessonId?: number
}

export interface QuizPickInfo {
  /** 本题正确词的 en（= speakText） */
  en: string
  /** 用户实际点击的选项 en */
  picked: string
  correct: boolean
}

interface QuizEngineProps {
  quiz: QuizItem[]
  mcStyle: React.CSSProperties
  /** 测验区标题徽标，默认「闯关测验」；Starlight 听力测验传「复习测验」 */
  badgeText?: string
  resultTitle: string
  /** 结果卡里「再做一次」之外的链接（看错题本 / 返回等） */
  resultLinks: React.ReactNode
  onPick: (info: QuizPickInfo) => void
  onFinish: (correct: number, total: number, wrongEns: string[]) => void
  /** 题目上方额外渲染（如 Starlight 的「Lesson N」标签） */
  renderQuestionExtra?: (item: QuizItem) => React.ReactNode
}

export default function QuizEngine({
  quiz,
  mcStyle,
  badgeText = '🎯 闯关测验 · 听一听选一选',
  resultTitle,
  resultLinks,
  onPick,
  onFinish,
  renderQuestionExtra,
}: QuizEngineProps) {
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
    onPick({ en: cur.speakText, picked: cur.options[i], correct })
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
      <div className="mode-badge mode-review">{badgeText}</div>
      {done ? (
        <div className="result-card">
          <div className="result-emoji">{correct === quiz.length ? '🌟' : correct >= quiz.length / 2 ? '👍' : '💪'}</div>
          <h2 className="result-title">{resultTitle}</h2>
          <div className="result-score">
            答对 <b>{correct}</b> / {quiz.length} 题
          </div>
          <div className="result-bar">
            <div className="result-bar-fill" style={{ width: `${(correct / quiz.length) * 100}%` }} />
          </div>
          <p className="result-tip">
            {correct === quiz.length
              ? '太棒了！全对！+5 额外星星 🎉'
              : '错题已加入错题本，再练练一定行！'}
          </p>
          <div className="result-actions">
            <button type="button" className="btn btn-sun" onClick={restart}>🔁 再做一次</button>
            {resultLinks}
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
            {renderQuestionExtra ? renderQuestionExtra(cur) : null}
            <div className="quiz-q-row">
              <span>{cur.emoji ? `${cur.emoji} ` : ''}{cur.q}</span>
              <SpeakButton text={cur.speakText ?? cur.q} label="听发音" />
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
