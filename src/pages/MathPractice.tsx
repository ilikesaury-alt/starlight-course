// ============================================================
//  应用题专项练习页 /math
//  ------------------------------------------------------------
//  针对陈老师反馈的「读题习惯差 / 不圈关键词」。计算另有《计算小能手》
//  在练，这里**只做应用题**（用户 2026-11-18 明确要求去掉计算）。
//
//  交互借鉴 GitHub 同类项目（prashantkul/help-math：把应用题拆成
//  micro-step、每一步正确就给奖励，而非只看最终答案）：
//    ① 这题求什么？   —— 读懂问题
//    ② 先算什么？     —— 理清步骤
//    ③ 算出得数       —— 填最终答案
//  每一步都即时反馈，做错的那一步记进 localStorage（mathWrong.ts），
//  结算后可「重练做错的题」。
//
//  为什么不用「把所有文字都圈上才算全对」：用户实测太繁琐（圈词等于
//  圈大半道题），8 岁的孩子会烦。三步问保留了「读懂题」的内核，交互更轻。
//
//  self-contained：不接 SRS / store 版本号；星数用统一口径 quizStars，
//  只在本页结算卡展示，不写全局星星。
// ============================================================
import { useMemo, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Check, X, Lightbulb, BookOpen } from 'lucide-react'
import {
  WORD_PROBLEMS,
  wordProblemRound,
  type WordProblem,
} from '@/data/mathPractice'
import {
  getMathWrongSnapshot,
  recordMathWrong,
  subscribeMathWrong,
} from '@/data/mathWrong'
import { quizStars } from '@/utils/stars'

const ROUND_SIZE = 5
type Step = 'ask' | 'first' | 'answer'

export default function MathPractice() {
  const [seed, setSeed] = useState(() => Date.now())
  const [retrainIds, setRetrainIds] = useState<string[] | null>(null)
  const [cursor, setCursor] = useState(0)
  const [step, setStep] = useState<Step>('ask')
  const [stepCorrect, setStepCorrect] = useState(false)
  const [stepDone, setStepDone] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [input, setInput] = useState('')
  /** 本轮每一步是否答对（用于结算星数：总步数里答对的比例） */
  const [results, setResults] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const wrong = useSyncExternalStore(subscribeMathWrong, getMathWrongSnapshot, getMathWrongSnapshot)

  const questions = useMemo(
    () => wordProblemRound(ROUND_SIZE, seed, retrainIds ?? undefined),
    [seed, retrainIds],
  )
  const totalQuestions = questions.length
  const q = questions[cursor]

  const wrongIds = useMemo(
    () => Array.from(new Set(wrong.map((w) => w.id))),
    [wrong],
  )

  const resetForNewRound = () => {
    setSeed(Date.now())
    setRetrainIds(null)
    setCursor(0)
    setStep('ask')
    setStepDone(false)
    setPicked(null)
    setInput('')
    setResults([])
    setFinished(false)
  }

  const startRetrain = () => {
    const ids = wrongIds.filter((id) => WORD_PROBLEMS.some((p) => p.id === id))
    if (!ids.length) return
    setSeed(Date.now())
    setRetrainIds(ids)
    setCursor(0)
    setStep('ask')
    setStepDone(false)
    setPicked(null)
    setInput('')
    setResults([])
    setFinished(false)
  }

  const recordStep = (isCorrect: boolean, stepName: 'ask' | 'first' | 'answer', given: string, answer: string) => {
    setResults((r) => [...r, isCorrect])
    if (!isCorrect && q) {
      recordMathWrong({
        id: q.id,
        stem: q.text,
        given,
        answer,
        step: stepName,
        at: Date.now(),
      })
    }
  }

  /** 第一步 / 第二步：选了一个选项后判定 */
  const submitChoice = (problem: WordProblem, which: 'ask' | 'first') => {
    if (stepDone || picked === null) return
    const options = which === 'ask' ? problem.ask.options : problem.first.options
    const ok = options[picked].correct
    const answerLabel = options.find((o) => o.correct)!.label
    setStepDone(true)
    setStepCorrect(ok)
    recordStep(ok, which, options[picked].label, answerLabel)
  }

  /** 第三步：填得数 */
  const submitAnswer = (problem: WordProblem) => {
    if (stepDone) return
    const given = input.trim()
    const ok = given !== '' && Number(given) === problem.answer
    setStepDone(true)
    setStepCorrect(ok)
    recordStep(ok, 'answer', given, String(problem.answer))
  }

  /** 进入下一步，或本页最后一题结算 */
  const next = () => {
    if (step === 'ask') {
      setStep('first')
      setStepDone(false)
      setPicked(null)
    } else if (step === 'first') {
      setStep('answer')
      setStepDone(false)
      setInput('')
    } else if (cursor + 1 < totalQuestions) {
      setCursor((i) => i + 1)
      setStep('ask')
      setStepDone(false)
      setPicked(null)
      setInput('')
    } else {
      setFinished(true)
    }
  }

  const correctSteps = results.filter(Boolean).length
  const totalSteps = results.length
  const stars = finished ? quizStars(correctSteps, totalSteps) : 0

  return (
    <div className="math-practice mp-sheet">
      <header className="mp-head">
        <Link to="/" className="mp-back">
          <ArrowLeft size={18} aria-hidden="true" /> 返回首页
        </Link>
        <h1 className="mp-title">应用题专项练习</h1>
        <p className="mp-sub">读题三步走：先弄懂问什么，再想先算什么，最后算出得数</p>
      </header>

      {/* ---------- 结算卡 ---------- */}
      {finished ? (
        <section className="mp-result" data-testid="math-result">
          <div className="mp-result-emoji" aria-hidden="true">{stars === 5 ? '🏆' : stars >= 3 ? '🎉' : '💪'}</div>
          <h2 className="mp-result-title">做完啦！</h2>
          <div className="mp-stars" aria-label={`获得 ${stars} 颗星`}>
            {'★'.repeat(stars)}<span className="mp-stars-off">{'★'.repeat(5 - stars)}</span>
          </div>
          <p className="mp-result-sub">三步里答对 {correctSteps} / {totalSteps} 步</p>
          <div className="mp-result-actions">
            <button type="button" className="mp-btn" onClick={resetForNewRound}>
              <RotateCcw size={16} aria-hidden="true" /> 再来一组
            </button>
            {wrongIds.length > 0 && (
              <button type="button" className="mp-btn mp-btn--ghost" onClick={startRetrain}>
                重练做错的题（{wrongIds.length}）
              </button>
            )}
          </div>
        </section>
      ) : !q ? (
        <section className="mp-empty">
          <p>这一组没有题目。</p>
          <button type="button" className="mp-btn" onClick={resetForNewRound}>从头再来</button>
        </section>
      ) : (
        <section className="mp-quiz">
          <div className="mp-progress">
            <span>第 {cursor + 1} / {totalQuestions} 题</span>
            <span className="mp-progress-track">
              <span className="mp-progress-fill" style={{ width: `${((cursor + 1) / totalQuestions) * 100}%` }} />
            </span>
            {wrongIds.length > 0 && (
              <button type="button" className="mp-link" onClick={startRetrain}>重练错题</button>
            )}
          </div>

          {/* 题干：整段展示，一步一个焦点；字号大、行距宽，照顾阅读 */}
          <div className="mp-stem-card">
            <span className="mp-stem-tag"><BookOpen size={14} aria-hidden="true" /> 读题</span>
            <p className="mp-stem-text" data-testid="problem-text">{q.text}</p>
          </div>

          {/* 三步指示器 */}
          <div className="mp-stepper" aria-label="解题三步">
            {(['ask', 'first', 'answer'] as Step[]).map((s, i) => {
              const result = results[cursor * 3 + i]
              return (
                <span
                  key={s}
                  className={`mp-step-chip ${step === s ? 'is-current' : ''} ${
                    result === true ? 'is-done-ok' : result === false ? 'is-done-no' : ''
                  }`}
                >
                  {['① 求什么', '② 先算什么', '③ 得数'][i]}
                </span>
              )
            })}
          </div>

          {/* ---------- 第一步：求什么 ---------- */}
          {step === 'ask' && (
            <StepChoices
              prompt={q.ask.prompt}
              options={q.ask.options.map((o) => o.label)}
              picked={picked}
              stepDone={stepDone}
              stepCorrect={stepCorrect}
              correctLabel={q.ask.options.find((o) => o.correct)!.label}
              onPick={setPicked}
              onSubmit={() => submitChoice(q, 'ask')}
              onNext={next}
              explain={stepDone ? q.explain : undefined}
            />
          )}

          {/* ---------- 第二步：先算什么 ---------- */}
          {step === 'first' && (
            <StepChoices
              prompt={q.first.prompt}
              options={q.first.options.map((o) => o.label)}
              picked={picked}
              stepDone={stepDone}
              stepCorrect={stepCorrect}
              correctLabel={q.first.options.find((o) => o.correct)!.label}
              onPick={setPicked}
              onSubmit={() => submitChoice(q, 'first')}
              onNext={next}
              explain={stepDone ? q.steps.join('　→　') : undefined}
            />
          )}

          {/* ---------- 第三步：得数 ---------- */}
          {step === 'answer' && (
            <div className="mp-step-panel" data-testid="answer-step">
              <h2 className="mp-step-prompt">算出得数</h2>
              <div className="mp-steps-recap">
                {q.steps.map((s, i) => <div key={i} className="mp-step-line">{s}</div>)}
              </div>
              <div className="mp-answer-row">
                <input
                  className="mp-input"
                  data-testid="answer-input"
                  inputMode="numeric"
                  type="text"
                  value={input}
                  disabled={stepDone}
                  placeholder="得数"
                  aria-label="得数"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') submitAnswer(q) }}
                />
                {!stepDone ? (
                  <button type="button" className="mp-btn" onClick={() => submitAnswer(q)}>确定</button>
                ) : (
                  <button type="button" className="mp-btn" onClick={next}>
                    {cursor + 1 >= totalQuestions ? '看结果' : '下一题'}
                  </button>
                )}
              </div>
              {stepDone && (
                <div className={`mp-feedback ${stepCorrect ? 'is-ok' : 'is-no'}`} role="status">
                  <span className="mp-fb-line">
                    {stepCorrect ? <><Check size={18} aria-hidden="true" /> 答对啦！</> : <><X size={18} aria-hidden="true" /> 正确答案：{q.answer}</>}
                  </span>
                  {!stepCorrect && (
                    <span className="mp-explain"><Lightbulb size={16} aria-hidden="true" /> {q.explain}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

/** 第一步/第二步共用的选项面板：点选 → 提交 → 即时反馈 → 下一步 */
function StepChoices({
  prompt,
  options,
  picked,
  stepDone,
  stepCorrect,
  correctLabel,
  onPick,
  onSubmit,
  onNext,
  explain,
}: {
  prompt: string
  options: string[]
  picked: number | null
  stepDone: boolean
  stepCorrect: boolean
  correctLabel: string
  onPick: (i: number) => void
  onSubmit: () => void
  onNext: () => void
  explain?: string
}) {
  return (
    <div className="mp-step-panel" data-testid="choice-step">
      <h2 className="mp-step-prompt">{prompt}</h2>
      <div className="mp-choice-list">
        {options.map((label, i) => (
          <button
            key={i}
            type="button"
            className={`mp-choice ${picked === i ? 'is-picked' : ''} ${
              stepDone && label === correctLabel ? 'is-correct' : ''
            } ${stepDone && picked === i && !stepCorrect ? 'is-wrong' : ''}`}
            aria-pressed={picked === i}
            disabled={stepDone}
            onClick={() => onPick(i)}
          >
            <span className="mp-choice-mark">{String.fromCharCode(65 + i)}</span>
            <span className="mp-choice-label">{label}</span>
          </button>
        ))}
      </div>
      {!stepDone ? (
        <button type="button" className="mp-btn" disabled={picked === null} onClick={onSubmit}>确定</button>
      ) : (
        <>
          <div className={`mp-feedback ${stepCorrect ? 'is-ok' : 'is-no'}`} role="status">
            <span className="mp-fb-line">
              {stepCorrect ? <><Check size={18} aria-hidden="true" /> 答对啦！</> : <><X size={18} aria-hidden="true" /> 应该是：{correctLabel}</>}
            </span>
            {explain && <span className="mp-explain"><Lightbulb size={16} aria-hidden="true" /> {explain}</span>}
          </div>
          <button type="button" className="mp-btn" onClick={onNext}>下一步</button>
        </>
      )}
    </div>
  )
}

// 保留导出，单测/调试可直接取全量题面
export { WORD_PROBLEMS }
