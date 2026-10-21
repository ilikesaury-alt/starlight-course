// ============================================================
//  听写练习页 /dictation
//  ------------------------------------------------------------
//  独立入口（用户选 B）：内容只从 eng3a（三年级上册英语）来。
//  流程：选范围 → 选模式 → 逐词听写（DictationPlayer）→ 会话报告。
//
//  为什么单独一页而不是塞进课内 Tab：
//    孩子的痛点是「听写不会写」，需要一条最短闭环——进来就能听、就能写，
//    不必先选单元再选课再翻 Tab。取词、反馈、回灌都复用既有基础设施：
//      · 取词：MODULES.eng3a.items / getWords（单元重点词 + 补充词 + 剧本词）
//      · 错词：addWrongWord(module='eng3a') → /wrong 错题本
//      · 复习：recordReview(en, correct, 'eng3a') → /smart 智能复习
//      · 发音：SpeakButton / speakText 既有英文兜底链
//      · 星规：quizStars
//  不新增任何持久化字段，避免 localStorage(version 8) 迁移风险。
// ============================================================
import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import DictationPlayer from '@/components/DictationPlayer'
import { MODULES } from '@/data/modules'
import { ENG3A_THEME } from '@/data/eng3a'
import { moduleThemeVars } from '@/utils/theme'
import { useCourseStore } from '@/store/useCourseStore'
import { quizStars } from '@/utils/stars'
import {
  buildDictationPool,
  normalizeDictationWord,
  shuffle,
  type DictationWord,
  type LengthFilter,
} from '@/utils/dictation'

type Mode = 'spell' | 'choice'
type Phase = 'setup' | 'play' | 'report'

const WORDS_PER_ROUND = 10

const mcStyle = moduleThemeVars(ENG3A_THEME)

export default function DictationPage() {
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addStars = useCourseStore((s) => s.addStars)
  const getWrongWords = useCourseStore((s) => s.getWrongWords)

  const [phase, setPhase] = useState<Phase>('setup')
  const [mode, setMode] = useState<Mode>('spell')
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>('all')
  const [wrongOnly, setWrongOnly] = useState(false)
  /** 选中的单元/剧本 slug；空集合表示"全部单元" */
  const [selected, setSelected] = useState<string[]>([])

  const [round, setRound] = useState<DictationWord[]>([])
  const [cursor, setCursor] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [missed, setMissed] = useState<DictationWord[]>([])
  /** 报告页星数：在进入 report 时**一次性**结算，绝不在渲染里调 addStars
   *  （对抗审查发现：earnStars() 若直接写在 JSX，React 每次重渲染都会重复加星） */
  const [stars, setStars] = useState(0)
  /** 每次回到设置页递增，作为 wrongWords 的重算触发（错题本可能刚被本会话写入） */
  const [setupEpoch, setSetupEpoch] = useState(0)
  // 当前连对：只用于统计最长连对，不参与渲染，故用 ref 避免多余重渲染
  const streakRef = useRef(0)
  /** 答对数镜像：onAdvance 可能被 DictationPlayer 的 setTimeout 捕获（闭包快照），
   *  末尾词结算时读 state 会读到上一轮的值 → 星数/正确率算错。用 ref 避开。 */
  const correctRef = useRef(0)

  const eng3aItems = MODULES.eng3a.items

  const wrongWords = useMemo(() => {
    return getWrongWords('eng3a').map((w) =>
      normalizeDictationWord({ en: w.en, zh: w.zh, emoji: w.emoji, from: w.from }),
    )
    // getWrongWords 是 store 读方法（非订阅式），用 setupEpoch 显式触发重算：
    // 每轮练习会写入新错词，回到设置页时必须重新取，否则「只练错题本」是过期快照。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupEpoch])

  /** 根据当前选择算出本轮词池（不含洗牌） */
  const computePool = (): DictationWord[] => {
    if (wrongOnly) {
      return wrongWords.filter((w) => {
        const len = w.en.replace(/[^a-zA-Z]/g, '').length
        if (lengthFilter === 'short') return len <= 4
        if (lengthFilter === 'long') return len > 4
        return true
      })
    }
    const ids = selected.length ? selected : eng3aItems.map((i) => i.id)
    return buildDictationPool(ids, MODULES.eng3a.getWords, lengthFilter)
  }

  const toggleUnit = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const start = () => {
    const pool = computePool()
    if (pool.length === 0) return
    const picked = shuffle(pool).slice(0, WORDS_PER_ROUND)
    setRound(picked)
    setCursor(0)
    setCorrectCount(0)
    correctRef.current = 0
    setMaxStreak(0)
    streakRef.current = 0
    setMissed([])
    setStars(0)
    setPhase('play')
  }

  const handleSettled = ({ correct }: { correct: boolean }) => {
    const w = round[cursor]
    if (!w) return
    // 回灌：每词都记 SRS；错词再进错题本
    recordReview(w.en, correct, 'eng3a')
    if (correct) {
      setCorrectCount((n) => n + 1)
      correctRef.current += 1
      streakRef.current += 1
      setMaxStreak((m) => Math.max(m, streakRef.current))
    } else {
      streakRef.current = 0
      setMissed((prev) => (prev.some((x) => x.en === w.en) ? prev : [...prev, w]))
      addWrongWord({
        en: w.en,
        zh: w.zh,
        emoji: w.emoji || '🔤',
        from: w.from ?? '听写练习',
        module: 'eng3a',
      })
    }
  }

  const handleAdvance = () => {
    if (cursor + 1 >= round.length) {
      // 进入报告页：只在这里结算一次星数（不在渲染期调 addStars）
      const earned = quizStars(correctRef.current, round.length)
      setStars(earned)
      addStars(earned)
      setPhase('report')
      return
    }
    setCursor((n) => n + 1)
  }

  const backToSetup = () => {
    setPhase('setup')
    setRound([])
    setCursor(0)
    setSetupEpoch((n) => n + 1)
  }

  const current = round[cursor]
  const previewCount = phase === 'setup' ? computePool().length : round.length

  return (
    <div className="page dictation-page" style={mcStyle}>
      <div className="page-head">
        <span className="page-emoji">✍️</span>
        <div>
          <div className="page-kicker">听写练习</div>
          <h1 className="page-title">听一听，写出来</h1>
        </div>
      </div>

      <SafeBoundary label="听写练习">
        {/* ---------------- 设置阶段 ---------------- */}
        {phase === 'setup' && (
          <>
            <p className="lead">
              三年级上册英语单词，听音写词。写错也别怕，会教你<b>把声音拆成字母</b>。
            </p>

            <section className="dt-setup-block">
              <div className="dt-setup-title">🎚️ 练习模式</div>
              <div className="dt-seg">
                <button
                  type="button"
                  className={`dt-seg-btn${mode === 'spell' ? ' active' : ''}`}
                  onClick={() => setMode('spell')}
                >
                  ✍️ 听音写词
                </button>
                <button
                  type="button"
                  className={`dt-seg-btn${mode === 'choice' ? ' active' : ''}`}
                  onClick={() => setMode('choice')}
                >
                  🔍 三选一
                </button>
              </div>
              <p className="dt-setup-hint">
                {mode === 'spell'
                  ? '听发音，把单词完整写出来（核心训练，推荐）。'
                  : '听发音，从三个拼法里选出正确的那个（起步更轻松）。'}
              </p>
            </section>

            <section className="dt-setup-block">
              <div className="dt-setup-title">📚 选范围</div>
              <label className="dt-check-row">
                <input
                  type="checkbox"
                  checked={wrongOnly}
                  onChange={(e) => setWrongOnly(e.target.checked)}
                />
                <span>
                  只练错题本里的词
                  {wrongWords.length > 0 && <b className="dt-count">（{wrongWords.length}）</b>}
                </span>
              </label>

              {!wrongOnly && (
                <>
                  <div className="dt-chips">
                    <button
                      type="button"
                      className={`chip${selected.length === 0 ? ' active' : ''}`}
                      onClick={() => setSelected([])}
                    >
                      全部单元
                    </button>
                    {eng3aItems.map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        className={`chip${selected.includes(it.id) ? ' active' : ''}`}
                        onClick={() => toggleUnit(it.id)}
                      >
                        {it.emoji} {it.titleZh || it.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section className="dt-setup-block">
              <div className="dt-setup-title">📏 词的长短</div>
              <div className="dt-seg">
                {(
                  [
                    ['all', '全部'],
                    ['short', '短词（≤4 字母）'],
                    ['long', '长词'],
                  ] as [LengthFilter, string][]
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    className={`dt-seg-btn${lengthFilter === val ? ' active' : ''}`}
                    onClick={() => setLengthFilter(val)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="dt-setup-hint">
                先从短词开始，把「声音→字母」练熟，再挑战长词，容易建立信心。
              </p>
            </section>

            <div className="dt-start-row">
              <button
                type="button"
                className="btn btn--lg"
                onClick={start}
                disabled={previewCount === 0}
              >
                🚀 开始听写（{Math.min(previewCount, WORDS_PER_ROUND)} 个）
              </button>
              {previewCount === 0 && (
                <p className="dt-empty-tip">
                  {wrongOnly
                    ? '错题本里还没有英语错词，先去学几课吧～'
                    : '这个范围没有词，换一个试试？'}
                </p>
              )}
            </div>

            <div className="dt-foot-links">
              <Link to="/eng3a" className="back-link">📘 去学三年级英语</Link>
              <Link to="/wrong" className="back-link">📋 看错题本</Link>
            </div>
          </>
        )}

        {/* ---------------- 练习阶段 ---------------- */}
        {phase === 'play' && current && (
          <DictationPlayer
            key={`${current.en}-${cursor}`}
            word={current}
            index={cursor}
            total={round.length}
            mode={mode}
            onSettled={handleSettled}
            onAdvance={handleAdvance}
          />
        )}

        {/* ---------------- 报告阶段 ---------------- */}
        {phase === 'report' && (
          <div className="dt-report">
            <div className="dt-report-emoji">{correctCount === round.length ? '🏆' : '🌟'}</div>
            <h2 className="dt-report-title">这一轮完成啦！</h2>
            <div className="dt-report-stats">
              <div className="dt-stat">
                <span className="dt-stat-num">
                  {round.length > 0 ? Math.round((correctCount / round.length) * 100) : 0}%
                </span>
                <span className="dt-stat-label">正确率</span>
              </div>
              <div className="dt-stat">
                <span className="dt-stat-num">
                  {correctCount}/{round.length}
                </span>
                <span className="dt-stat-label">答对</span>
              </div>
              <div className="dt-stat">
                <span className="dt-stat-num">{maxStreak}</span>
                <span className="dt-stat-label">最长连对</span>
              </div>
            </div>

            <div className="dt-stars" aria-label="获得星数">
              {'⭐'.repeat(stars)}
            </div>

            {missed.length > 0 ? (
              <section className="dt-missed">
                <div className="dt-setup-title">📌 这些还要多练（{missed.length}）</div>
                <div className="dt-missed-list">
                  {missed.map((w) => (
                    <span className="dt-missed-chip" key={w.en}>
                      <b>{w.en}</b>
                      {w.zh && <span className="dt-missed-zh">{w.zh}</span>}
                    </span>
                  ))}
                </div>
                <p className="dt-setup-hint">
                  已放进错题本，也可以选「只练错题本」再来一轮。
                </p>
              </section>
            ) : (
              <p className="dt-perfect">全部拼对了，太厉害了！🎉</p>
            )}

            <div className="dt-report-actions">
              <button type="button" className="btn" onClick={start}>
                🔁 再来一轮
              </button>
              <button type="button" className="btn btn--soft" onClick={backToSetup}>
                🎚️ 换个范围
              </button>
              <Link to="/wrong" className="btn btn--soft">📋 错题本</Link>
              <Link to="/smart" className="btn btn--soft">🧠 智能复习</Link>
            </div>
          </div>
        )}
      </SafeBoundary>

      {phase !== 'play' && (
        <div className="page-nav">
          <Link to="/" className="back-link">← 返回首页</Link>
        </div>
      )}
    </div>
  )
}
