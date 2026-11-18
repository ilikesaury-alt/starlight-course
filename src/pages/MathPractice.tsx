// ============================================================
//  数学专项练习页 /math
//  ------------------------------------------------------------
//  针对陈老师反馈的三点薄弱项（北师大三上）：
//    ① 计算出错多   → 「计算专项」连线/填空，按错因即时解析
//    ② 读题习惯差   → 「读题·圈关键词」两步应用题
//    ③ 圈关键词没落实 → 题干分词点选，圈对才算读懂题
//  外加「错因复盘」：把做错的题按错因分组重练。
//
//  为什么自包含、不接 SRS：
//    这是英语学习工作台里新加的数学专项，进度/错题单独存 localStorage
//    （mathWrong.ts），不进 Zustand、不升 persist 版本号，零迁移风险。
//    星数只在本会话结算卡展示，用统一口径 quizStars（不写全局星星）。
// ============================================================
import { useMemo, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Check, X, Lightbulb } from 'lucide-react'
import {
  CAUSE_LABEL,
  generateCalcRound,
  keywordRound,
  type CalcCause,
  type CalcQuestion,
  type KeywordQuestion,
} from '@/data/mathPractice'
import {
  clearMathWrong,
  getMathWrongSnapshot,
  recordMathWrong,
  subscribeMathWrong,
  type MathWrongItem,
} from '@/data/mathWrong'
import { quizStars } from '@/utils/stars'

type Mode = 'calc' | 'keyword' | 'review'

const MODE_LABEL: Record<Mode, string> = {
  calc: '计算专项',
  keyword: '读题·圈关键词',
  review: '错因复盘',
}

const CALC_COUNT = 10
const KEYWORD_COUNT = 5

export default function MathPractice() {
  const [mode, setMode] = useState<Mode>('calc')
  const [seed, setSeed] = useState(() => Date.now())
  const [cursor, setCursor] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  // 计算题：输入框答案 + 是否已提交（即时反馈）
  const [input, setInput] = useState('')
  const [answered, setAnswered] = useState(false)
  const [isRight, setIsRight] = useState(false)

  // 读题题：分两步——先圈关键词，再填最终答案
  const [kwStep, setKwStep] = useState<1 | 2>(1)
  const [picked, setPicked] = useState<number[]>([])
  const [kwChecked, setKwChecked] = useState(false)
  const [kwOk, setKwOk] = useState(false)

  const wrong = useSyncExternalStore(subscribeMathWrong, getMathWrongSnapshot, getMathWrongSnapshot)

  const calcQuestions = useMemo(
    () => generateCalcRound(CALC_COUNT, seed),
    [seed],
  )
  const keywordQuestions = useMemo(
    () => keywordRound(KEYWORD_COUNT, seed),
    [seed],
  )

  // —— 错因复盘：按 cause 分组 ——
  const byCause = useMemo(() => {
    const groups = new Map<CalcCause | 'reading', MathWrongItem[]>()
    for (const w of wrong) {
      const list = groups.get(w.cause) ?? []
      list.push(w)
      groups.set(w.cause, list)
    }
    return Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [wrong])

  const [reviewCause, setReviewCause] = useState<CalcCause | 'reading' | null>(null)
  // 复盘题**直接从错题记录重建**：错题 id 里带的是「当时那一轮」的 seed，
  // 用当前 seed 重新生成再按 id 过滤永远匹配不上（复盘会是空的）。
  // 好在 wrong item 已存了 stem / answer / cause，足够还原成可练的题。
  const reviewQuestions: CalcQuestion[] = useMemo(
    () =>
      wrong
        .filter((w) => w.cause === reviewCause && reviewCause !== 'reading')
        .map((w) => ({
          id: w.id,
          stem: w.stem,
          answer: Number(w.answer),
          cause: w.cause as CalcCause,
          explain: `这题你之前做错过，正确答案 ${w.answer}。再算一遍，注意${CAUSE_LABEL[w.cause as CalcCause]}。`,
        })),
    [reviewCause, wrong],
  )

  // 同一轮题里，读题题按 id 直接取（不重新洗牌，保证点选判定与展示一致）
  const kwList = keywordQuestions

  const start = (nextMode: Mode) => {
    setMode(nextMode)
    setSeed(Date.now())
    setCursor(0)
    setCorrect(0)
    setFinished(false)
    setInput('')
    setAnswered(false)
    setIsRight(false)
    setKwStep(1)
    setPicked([])
    setKwChecked(false)
    setKwOk(false)
    setReviewCause(null)
  }

  const advance = () => {
    if (cursor + 1 >= currentTotal()) {
      setFinished(true)
    } else {
      setCursor((i) => i + 1)
      setInput('')
      setAnswered(false)
      setIsRight(false)
      setKwStep(1)
      setPicked([])
      setKwChecked(false)
      setKwOk(false)
    }
  }

  const currentTotal = () =>
    mode === 'calc' ? calcQuestions.length : mode === 'keyword' ? kwList.length : reviewQuestions.length

  // —— 计算题提交 ——
  const submitCalc = (q: CalcQuestion) => {
    if (answered) return
    const given = input.trim()
    const ok = given !== '' && Number(given) === q.answer
    setAnswered(true)
    setIsRight(ok)
    if (ok) setCorrect((c) => c + 1)
    if (!ok) {
      recordMathWrong({
        id: q.id,
        stem: q.stem,
        given,
        answer: String(q.answer),
        cause: q.cause,
        at: Date.now(),
      })
    }
  }

  // —— 读题题：圈关键词判定 ——
  const togglePick = (idx: number) => {
    if (kwChecked) return
    setPicked((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    )
  }

  const submitKeywords = (q: KeywordQuestion) => {
    if (kwChecked) return
    const ok =
      picked.length === q.keyIdx.length && q.keyIdx.every((i) => picked.includes(i))
    setKwChecked(true)
    setKwOk(ok)
    if (!ok) {
      recordMathWrong({
        id: q.id,
        stem: q.text,
        given: picked.length ? `选了 ${picked.length} 处` : '没圈',
        answer: `应圈 ${q.keyIdx.length} 处`,
        cause: 'reading',
        at: Date.now(),
      })
    }
  }

  // —— 读题题：第二步答案判定 ——
  const submitKeywordAnswer = (q: KeywordQuestion) => {
    if (answered) return
    const given = input.trim()
    const ok = given !== '' && Number(given) === q.answer
    setAnswered(true)
    setIsRight(ok)
    if (ok) setCorrect((c) => c + 1)
    if (!ok) {
      // 关键词已单独记过一次；这里只更新为「答案也错」的快照
      recordMathWrong({
        id: `${q.id}-ans`,
        stem: `${q.text}（求答案）`,
        given,
        answer: String(q.answer),
        cause: 'reading',
        at: Date.now(),
      })
    }
  }

  const total = currentTotal()
  const progress = total > 0 ? Math.min(cursor + 1, total) : 0
  const stars = finished ? quizStars(correct, total) : 0

  return (
    <div className="math-practice mp-sheet">
      <header className="mp-head">
        <Link to="/" className="mp-back">
          <ArrowLeft size={18} aria-hidden="true" /> 返回首页
        </Link>
        <h1 className="mp-title">🧮 专项练习</h1>
        <p className="mp-sub">针对计算、读题、圈关键词——每天练一点，稳稳地进步</p>
      </header>

      <nav className="mp-tabs" aria-label="练习模式">
        {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={`mp-tab ${mode === m ? 'is-active' : ''}`}
            aria-current={mode === m ? 'page' : undefined}
            onClick={() => start(m)}
          >
            {MODE_LABEL[m]}
            {m === 'review' && wrong.length > 0 && (
              <span className="mp-tab-count">{wrong.length}</span>
            )}
          </button>
        ))}
      </nav>

      {/* ---------- 错因复盘：选错因进入重练 ---------- */}
      {mode === 'review' && !finished && !reviewCause && (
        <section className="mp-review">
          {wrong.length === 0 ? (
            <div className="mp-empty">
              <span className="mp-empty-emoji" aria-hidden="true">🎉</span>
              <p>还没有错题记录，继续保持！</p>
              <p className="mp-empty-hint">计算和读题做错时，会自动收进这里。</p>
              <button type="button" className="mp-btn" onClick={() => start('calc')}>
                去做计算专项
              </button>
            </div>
          ) : (
            <>
              <div className="mp-review-head">
                <h2 className="mp-review-title">按错因分组重练</h2>
                <button type="button" className="mp-link" onClick={() => { clearMathWrong(); setSeed(Date.now()) }}>
                  清空错题
                </button>
              </div>
              <div className="mp-cause-grid">
                {byCause.map(([cause, items]) => (
                  <button
                    key={cause}
                    type="button"
                    className="mp-cause-card"
                    onClick={() => {
                      setReviewCause(cause)
                      setCursor(0)
                      setCorrect(0)
                      setFinished(false)
                      setInput('')
                      setAnswered(false)
                      setIsRight(false)
                    }}
                  >
                    <span className="mp-cause-name">
                      {cause === 'reading' ? '读题 / 圈关键词' : CAUSE_LABEL[cause]}
                    </span>
                    <span className="mp-cause-count">{items.length} 题</span>
                  </button>
                ))}
              </div>
              {reviewCause === 'reading' && <p className="mp-note">读题错题建议在「读题·圈关键词」里重练，那里会带着题干一起看。</p>}
            </>
          )}
        </section>
      )}

      {/* ---------- 错因复盘：读题类跳回圈关键词模式 ---------- */}
      {mode === 'review' && reviewCause === 'reading' && !finished && (
        <section className="mp-review">
          <p className="mp-note">读题错题会按「读题·圈关键词」的方式重练。</p>
          <button type="button" className="mp-btn" onClick={() => start('keyword')}>
            去读题·圈关键词
          </button>
        </section>
      )}

      {/* ---------- 计算题 / 复盘计算题 ---------- */}
      {(mode === 'calc' || (mode === 'review' && reviewCause && reviewCause !== 'reading')) && !finished && (() => {
        const list = mode === 'calc' ? calcQuestions : reviewQuestions
        const q = list[cursor]
        if (!q) {
          return (
            <div className="mp-empty">
              <p>这一类暂时没有错题了。</p>
              <button type="button" className="mp-btn" onClick={() => start('review')}>返回错因复盘</button>
            </div>
          )
        }
        return (
          <section className="mp-quiz">
            <div className="mp-progress">
              <span>第 {cursor + 1} / {list.length} 题</span>
              <span className="mp-progress-track">
                <span className="mp-progress-fill" style={{ width: `${(progress / list.length) * 100}%` }} />
              </span>
              <span>答对 {correct}</span>
            </div>
            <div className="mp-question" data-testid="calc-question">
              <span className="mp-q-tag">{CAUSE_LABEL[q.cause]}</span>
              <div className="mp-stem" data-testid="calc-stem">{q.stem}</div>
              <div className="mp-answer-row">
                <input
                  className="mp-input"
                  data-testid="calc-input"
                  inputMode="numeric"
                  type="text"
                  value={input}
                  disabled={answered}
                  placeholder="填得数"
                  aria-label="得数"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') submitCalc(q) }}
                />
                {!answered ? (
                  <button type="button" className="mp-btn" onClick={() => submitCalc(q)}>确定</button>
                ) : (
                  <button type="button" className="mp-btn" onClick={() => advance()}>
                    {cursor + 1 >= list.length ? '看结果' : '下一题'}
                  </button>
                )}
              </div>
              {answered && (
                <div className={`mp-feedback ${isRight ? 'is-ok' : 'is-no'}`} role="status">
                  {isRight ? (
                    <span className="mp-fb-line"><Check size={18} aria-hidden="true" /> 答对啦！</span>
                  ) : (
                    <span className="mp-fb-line"><X size={18} aria-hidden="true" /> 正确答案：{q.answer}</span>
                  )}
                  <span className="mp-explain"><Lightbulb size={16} aria-hidden="true" /> {q.explain}</span>
                </div>
              )}
            </div>
          </section>
        )
      })()}

      {/* ---------- 读题·圈关键词 ---------- */}
      {mode === 'keyword' && !finished && (() => {
        const q = kwList[cursor]
        if (!q) return null
        return (
          <section className="mp-quiz">
            <div className="mp-progress">
              <span>第 {cursor + 1} / {kwList.length} 题</span>
              <span className="mp-progress-track">
                <span className="mp-progress-fill" style={{ width: `${(progress / kwList.length) * 100}%` }} />
              </span>
              <span>答对 {correct}</span>
            </div>
            <div className="mp-question mp-keyword" data-testid="keyword-question">
              <h2 className="mp-kw-step">
                {kwStep === 1 ? '第一步：读题，圈出关键词' : '第二步：算出答案'}
              </h2>
              <p className="mp-kw-hint">
                {kwStep === 1
                  ? '出声读一遍，把数字、单位、「一共 / 还剩 / 比…多 / 每」和问题点出来。'
                  : '把两步算式写在心里，填最后的得数。'}
              </p>
              <div className="mp-wordwall" data-testid="keyword-words">
                {q.segments.map((seg, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`mp-word ${picked.includes(i) ? 'is-picked' : ''} ${
                      kwChecked && q.keyIdx.includes(i) ? 'is-key' : ''
                    } ${kwChecked && picked.includes(i) && !q.keyIdx.includes(i) ? 'is-wrong-pick' : ''}`}
                    aria-pressed={picked.includes(i)}
                    disabled={kwChecked || kwStep === 2}
                    onClick={() => togglePick(i)}
                  >
                    {seg}
                  </button>
                ))}
              </div>
              {kwStep === 1 && !kwChecked && (
                <button type="button" className="mp-btn" onClick={() => submitKeywords(q)}>圈好了，下一步</button>
              )}
              {kwStep === 1 && kwChecked && (
                <div className={`mp-feedback ${kwOk ? 'is-ok' : 'is-no'}`} role="status">
                  <span className="mp-fb-line">
                    {kwOk ? <><Check size={18} aria-hidden="true" /> 关键词都圈对啦！</> : <><X size={18} aria-hidden="true" /> 再看一看该圈哪些</>}
                  </span>
                  <span className="mp-explain"><Lightbulb size={16} aria-hidden="true" /> {q.explain}</span>
                  <button
                    type="button"
                    className="mp-btn mp-btn--small"
                    onClick={() => { setKwStep(2); setInput(''); setAnswered(false); setIsRight(false) }}
                  >
                    去做题
                  </button>
                </div>
              )}
              {kwStep === 2 && (
                <>
                  <div className="mp-steps">
                    {q.steps.map((s, i) => <div key={i} className="mp-step">{s}</div>)}
                  </div>
                  <div className="mp-answer-row">
                    <input
                      className="mp-input"
                      data-testid="keyword-input"
                      inputMode="numeric"
                      type="text"
                      value={input}
                      disabled={answered}
                      placeholder="最后的得数"
                      aria-label="得数"
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') submitKeywordAnswer(q) }}
                    />
                    {!answered ? (
                      <button type="button" className="mp-btn" onClick={() => submitKeywordAnswer(q)}>确定</button>
                    ) : (
                      <button type="button" className="mp-btn" onClick={() => advance()}>
                        {cursor + 1 >= kwList.length ? '看结果' : '下一题'}
                      </button>
                    )}
                  </div>
                  {answered && (
                    <div className={`mp-feedback ${isRight ? 'is-ok' : 'is-no'}`} role="status">
                      {isRight ? (
                        <span className="mp-fb-line"><Check size={18} aria-hidden="true" /> 答对啦！</span>
                      ) : (
                        <span className="mp-fb-line"><X size={18} aria-hidden="true" /> 正确答案：{q.answer}</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        )
      })()}

      {/* ---------- 结算 ---------- */}
      {finished && (
        <section className="mp-result" data-testid="math-result">
          <div className="mp-result-emoji" aria-hidden="true">{stars === 5 ? '🏆' : stars >= 3 ? '🎉' : '💪'}</div>
          <h2 className="mp-result-title">{MODE_LABEL[mode]}完成！</h2>
          <div className="mp-stars" aria-label={`获得 ${stars} 颗星`}>
            {'★'.repeat(stars)}<span className="mp-stars-off">{'★'.repeat(5 - stars)}</span>
          </div>
          <p className="mp-result-sub">答对 {correct} / {total} 题</p>
          <div className="mp-result-actions">
            <button type="button" className="mp-btn" onClick={() => start(mode)}>
              <RotateCcw size={16} aria-hidden="true" /> 再来一组
            </button>
            <button type="button" className="mp-btn mp-btn--ghost" onClick={() => start('review')}>看错因复盘</button>
          </div>
        </section>
      )}
    </div>
  )
}
