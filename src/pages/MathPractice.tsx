// ============================================================
//  应用题专项练习页 /math
//  ------------------------------------------------------------
//  对齐陈老师的「审题三步法」（2026-11-18 家长沟通）：
//    圈（关系词）→ 划（数字+单位）→ 说（求什么）
//  练习流程 = 标记 → 说 → 算 → 得数，共 4 步（用户定）。
//
//  标记步的判定（用户定，宽松）：**漏圈/漏划才算错**；点到普通词只
//  提醒不扣 —— 重点是养成「动手读题」的动作，不是考眼力。做完后关系
//  词自动圈上、数字自动划上，让孩子看到"标准答案长什么样"。
//
//  借鉴 GitHub 同类项目（prashantkul/help-math：每一步正确就给奖励，
//  而非只看最终答案；greamses/Word-Problems 的标注思路收窄成「只圈
//  骨头词」，避免「所有文字都要圈」的繁琐——用户实测踩过）。
//
//  计算另有《计算小能手》在练，这里**只做应用题**（用户明确要求去掉计算）。
//  self-contained：不接 SRS / store 版本号；星数用统一口径 quizStars，
//  只在本页结算卡展示，不写全局星星。错题存 localStorage（mathWrong.ts）。
// ============================================================
import { useMemo, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Check, X, Lightbulb, Printer } from 'lucide-react'
import {
  TOPIC_LABEL,
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
type Step = 'mark' | 'ask' | 'first' | 'answer'
const STEP_LABELS = ['① 标记', '② 求什么', '③ 先算什么', '④ 得数'] as const

export default function MathPractice() {
  const [seed, setSeed] = useState(() => Date.now())
  const [retrainIds, setRetrainIds] = useState<string[] | null>(null)
  const [cursor, setCursor] = useState(0)
  const [step, setStep] = useState<Step>('mark')
  const [stepCorrect, setStepCorrect] = useState(false)
  const [stepDone, setStepDone] = useState(false)
  /** 标记步：孩子点过的 segment 下标（不分圈/划，交互上自动按词性给样式） */
  const [marked, setMarked] = useState<number[]>([])
  const [picked, setPicked] = useState<number | null>(null)
  const [input, setInput] = useState('')
  /** 本轮每步是否答对（结算星数用） */
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
    setStep('mark')
    setStepDone(false)
    setMarked([])
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
    setStep('mark')
    setStepDone(false)
    setMarked([])
    setPicked(null)
    setInput('')
    setResults([])
    setFinished(false)
  }

  const recordStep = (isCorrect: boolean, stepName: Step, given: string, answer: string) => {
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

  /** 第一步「标记」：宽松判定 —— 该圈的都圈了、该划的都划了就过；
   *  多点的普通词只提醒。判定后所有 rel/num 自动亮出标准样式。 */
  const submitMark = (problem: WordProblem) => {
    if (stepDone) return
    const targets = problem.segments
      .map((seg, i) => (seg.k ? i : -1))
      .filter((i) => i >= 0)
    const missed = targets.filter((i) => !marked.includes(i)).length
    const extra = marked.filter((i) => !problem.segments[i].k).length
    const ok = missed === 0
    setStepDone(true)
    setStepCorrect(ok)
    recordStep(ok, 'mark', extra > 0 ? `多标 ${extra} 处` : `漏标 ${missed} 处`, `${targets.length} 处全标到`)
  }

  /** 第二步 / 第三步：选了一个选项后判定 */
  const submitChoice = (problem: WordProblem, which: 'ask' | 'first') => {
    if (stepDone || picked === null) return
    const options = which === 'ask' ? problem.ask.options : problem.first.options
    const ok = options[picked].correct
    const answerLabel = options.find((o) => o.correct)!.label
    setStepDone(true)
    setStepCorrect(ok)
    recordStep(ok, which, options[picked].label, answerLabel)
  }

  /** 第四步：填得数 */
  const submitAnswer = (problem: WordProblem) => {
    if (stepDone) return
    const given = input.trim()
    const ok = given !== '' && Number(given) === problem.answer
    setStepDone(true)
    setStepCorrect(ok)
    recordStep(ok, 'answer', given, String(problem.answer))
  }

  /** 进入下一步，或最后一题结算 */
  const next = () => {
    // 每一步切换都要把「判定态」清干净：stepCorrect 是上一步的结论，
    // 不清会带进下一步（曾出现下一步一进来就显示成「已答对」的样子）。
    if (step === 'mark') {
      setStep('ask')
      setStepDone(false)
      setStepCorrect(false)
      setMarked([])
      setPicked(null)
    } else if (step === 'ask') {
      setStep('first')
      setStepDone(false)
      setStepCorrect(false)
      setPicked(null)
    } else if (step === 'first') {
      setStep('answer')
      setStepDone(false)
      setStepCorrect(false)
      setInput('')
    } else if (cursor + 1 < totalQuestions) {
      setCursor((i) => i + 1)
      setStep('mark')
      setStepDone(false)
      setStepCorrect(false)
      setMarked([])
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
        <p className="mp-sub">审题三步法：圈关系词 → 划数字 → 说求什么，笔到了脑子才到</p>
        <button type="button" className="mp-print-btn" onClick={() => window.print()}>
          <Printer size={16} aria-hidden="true" /> 打印本轮（纸笔检验）
        </button>
      </header>

      {/* ---------- 打印专用空白试卷（屏幕隐藏，@media print 才出现）----------
          用于每周一次的「纸质迁移检验」：看孩子在纸上还会不会主动圈画、列式。
          只输出题干纯文本 + 空白横线，不输出 topic 标签 / 选项 / 分步算式 /
          答案 / 解析 —— 打印出来必须自己读题、圈画、列式，才叫迁移检验。
          整轮 5 题一次性输出（屏幕上只渲染当前题，所以另起一段 DOM）。 */}
      <section className="mp-print-sheet" aria-hidden="true">
        <div className="ps-head">
          <h1>应用题审题练习 · 纸质检验</h1>
          <p className="ps-meta">姓名：________________　　日期：________________</p>
          <p className="ps-tip">读题时圈出关系词、给数字划线，再把分步算式写在横线上，最后写出得数。</p>
        </div>
        {questions.map((p, i) => (
          <div className="ps-problem" key={p.id}>
            <div className="ps-no">第 {i + 1} 题</div>
            <p className="ps-stem">{p.text}</p>
            <div className="ps-lines">
              <div className="ps-line" />
              <div className="ps-line" />
              <div className="ps-line" />
            </div>
            <p className="ps-answer">得数：________________</p>
          </div>
        ))}
      </section>

      {/* ---------- 结算卡 ---------- */}
      {finished ? (
        <section className="mp-result" data-testid="math-result">
          <div className="mp-result-emoji" aria-hidden="true">{stars === 5 ? '🏆' : stars >= 3 ? '🎉' : '💪'}</div>
          <h2 className="mp-result-title">做完啦！</h2>
          <div className="mp-stars" aria-label={`获得 ${stars} 颗星`}>
            {'★'.repeat(stars)}<span className="mp-stars-off">{'★'.repeat(5 - stars)}</span>
          </div>
          <p className="mp-result-sub">四步里答对 {correctSteps} / {totalSteps} 步</p>
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

          {/* 四步指示器 */}
          <div className="mp-stepper" aria-label="审题四步">
            {(['mark', 'ask', 'first', 'answer'] as Step[]).map((sname, i) => {
              const result = results[cursor * 4 + i]
              return (
                <span
                  key={sname}
                  className={`mp-step-chip ${step === sname ? 'is-current' : ''} ${
                    result === true ? 'is-done-ok' : result === false ? 'is-done-no' : ''
                  }`}
                >
                  {STEP_LABELS[i]}
                </span>
              )
            })}
          </div>

          {/* ---------- 题干卡：四步全程可见（孩子在①步的圈画保留在题上，
              像"已经动过笔的试卷"，②③④步随时回看题意）---------- */}
          <div className="mp-stem-card">
            <span className="mp-topic-chip" data-testid="topic-chip">{TOPIC_LABEL[q.topic]}</span>
            <div className={`mp-stem-markable ${step === 'mark' ? '' : 'is-locked'}`} data-testid="problem-text">
              {q.segments.map((seg, i) => {
                const hit = marked.includes(i)
                // 标记步判定后：标对的显示标准标注；**失败时漏标的用红色标出来**，
                // 否则孩子看不出到底漏了哪个（红圈=关系词，红下划线=数字）。
                const isMissed = step === 'mark' && stepDone && !stepCorrect && !!seg.k && !hit
                const showStandard = step === 'mark' && stepDone && stepCorrect && !!seg.k
                const isExtra = step === 'mark' && stepDone && hit && !seg.k
                return (
                  <button
                    key={i}
                    type="button"
                    className={`mp-seg ${seg.k === 'rel' ? 'mp-seg--rel' : ''} ${seg.k === 'num' ? 'mp-seg--num' : ''} ${
                      hit ? 'is-marked' : ''
                    } ${showStandard ? 'is-standard' : ''} ${isMissed ? 'is-missed' : ''} ${isExtra ? 'is-extra' : ''}`}
                    aria-pressed={hit}
                    disabled={step !== 'mark' || stepDone}
                    onClick={() => setMarked((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]))}
                  >
                    {seg.t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ---------- 第一步：标记（圈关系词 + 划数字）---------- */}
          {step === 'mark' && (
            <div className="mp-step-panel" data-testid="mark-step">
              <h2 className="mp-step-prompt">动手读题：圈出关系词，给数字划线</h2>
              <p className="mp-step-hint">
                「一共、还剩、比…多、比…少、几倍、每、至少」是题目的骨头 —— 点一下圈起来；
                数字和单位点一下划上横线。笔到了，脑子才到。
              </p>
              {!stepDone ? (
                <button type="button" className="mp-btn" onClick={() => submitMark(q)}>标好了，读题完成</button>
              ) : (
                <>
                  <div className={`mp-feedback ${stepCorrect ? 'is-ok' : 'is-no'}`} role="status">
                    <span className="mp-fb-line">
                      {stepCorrect
                        ? <><Check size={18} aria-hidden="true" /> 关系词都圈到、数字都划到，读题这一步满分！</>
                        : <><X size={18} aria-hidden="true" /> 漏掉的用红色标出来了 —— 红圈是要圈的关系词，红下划线是要划的数字</>}
                    </span>
                  </div>
                  <button type="button" className="mp-btn" onClick={next}>下一步</button>
                </>
              )}
            </div>
          )}

          {/* ---------- 第二步：这道题要我找什么 ---------- */}
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
            />
          )}

          {/* ---------- 第三步：先算什么 ---------- */}
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
              // 只给第一步算式做提示 —— 第二步算式含最终答案，此时还不能露。
              explain={stepDone ? q.steps[0] : undefined}
            />
          )}

          {/* ---------- 第四步：得数 ---------- */}
          {step === 'answer' && (
            <div className="mp-step-panel" data-testid="answer-step">
              <h2 className="mp-step-prompt">算出得数</h2>
              <div className="mp-steps-recap">
                {/* 只把「第一步算式」当脚手架；第二步算式含最终答案，答完才展示，
                    否则孩子直接抄最后一行的数（实测 bug）。 */}
                {(stepDone ? q.steps : q.steps.slice(0, 1)).map((s, i) => (
                  <div key={i} className="mp-step-line">{s}</div>
                ))}
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

/** 第二步/第三步共用的选项面板：点选 → 提交 → 即时反馈 → 下一步 */
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
