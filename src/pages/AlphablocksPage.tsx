// ============================================================
//  字母积木练习页 /alphablocks
//  ------------------------------------------------------------
//  给刚看完《字母积木》(Alphablocks) 动画的孩子做的"练稳固"入口。
//  动画是输入，这里是输出 —— 用动画里出现过的词、动画里的教学概念
//  （字母小队 / 手拉手 / 双写 / 魔法E），把看过的东西练成会的。
//
//  两种玩法：
//    A. 听音搭积木 —— 播放整词发音，孩子按"声音段"把积木一块块点上去。
//       每块积木 = phonemeSegments 的一个片段，块上的标签就是动画概念
//       （字母小队 / 手拉手 / 双写 / 魔法E），和画面里积木合体的样子对得上。
//    B. 看词拆积木 —— 显示完整单词，孩子把它拆成正确的积木块
//       （从候选块里挑），练"这词里有几个音、哪些字母合体了"。
//
//  词源：src/data/alphablocks.ts（按动画五级手维护，词都出自动画各集）。
//  拆分：src/data/phonics.ts 的 phonemeSegments（上一提交对齐过动画口径）。
//  星数：复用 quizStars 星规；错词回灌错题本（module='alphablocks'）。
//  发音：SpeakButton 既有兜底链，不在此自造音频逻辑。
// ============================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import SpeakButton from '@/components/SpeakButton'
import { useCourseStore } from '@/store/useCourseStore'
import { quizStars } from '@/utils/stars'
import { shuffle } from '@/utils/dictation'
import { phonemeSegments } from '@/data/phonics'
import {
  BLOCK_DOUBLE_WORDS,
  BLOCK_LEVELS,
  BLOCK_WORDS,
  blockLevelMeta,
  type BlockLevel,
  type BlockWord,
} from '@/data/alphablocks'

type Mode = 'build' | 'split'
type Phase = 'setup' | 'play' | 'report'

const WORDS_PER_ROUND = 8

/** 搭积木的干扰块：同级别的其他块 + 诱错块（长得像但不对） */
function decoyBlocks(answer: string, level: BlockLevel): string[] {
  const answerTexts = new Set(phonemeSegments(answer).map((s) => s.text))
  // 干扰块来自同级词库的其他片段，保证"像动画里的积木"但不是这个词的
  const pool = new Set<string>()
  for (const w of BLOCK_WORDS[level]) {
    for (const s of phonemeSegments(w.en)) {
      if (!answerTexts.has(s.text)) pool.add(s.text)
    }
  }
  return shuffle([...pool]).slice(0, 4)
}

export default function AlphablocksPage() {
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addStars = useCourseStore((s) => s.addStars)

  const [phase, setPhase] = useState<Phase>('setup')
  const [level, setLevel] = useState<BlockLevel>('red')
  const [withDoubles, setWithDoubles] = useState(false)
  const [mode, setMode] = useState<Mode>('build')

  const [round, setRound] = useState<BlockWord[]>([])
  const [cursor, setCursor] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [missed, setMissed] = useState<BlockWord[]>([])
  const [stars, setStars] = useState(0)

  // ---- 本轮练习的交互状态（换词重置） ----
  const [placed, setPlaced] = useState<string[]>([])
  /** 已被用掉的候选块下标（防重复文本时被反复点击，也用来置灰） */
  const [usedPoolIdx, setUsedPoolIdx] = useState<Set<number>>(new Set())
  const [wrongFlash, setWrongFlash] = useState(false)
  const [solved, setSolved] = useState(false)
  const settledRef = useRef(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const meta = blockLevelMeta(level)
  const current = round[cursor]

  const start = () => {
    const pool = shuffle(blockWordsOfLocal(level, withDoubles))
    const picked = pool.slice(0, WORDS_PER_ROUND)
    setRound(picked)
    setCursor(0)
    setCorrectCount(0)
    setMissed([])
    setStars(0)
    resetWordState()
    setPhase('play')
  }

  const backToSetup = () => {
    setPhase('setup')
    setRound([])
    setCursor(0)
  }

  const resetWordState = () => {
    setPlaced([])
    setUsedPoolIdx(new Set())
    setWrongFlash(false)
    setSolved(false)
    settledRef.current = false
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }

  // 换词时重置交互状态
  useEffect(() => {
    resetWordState()
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [cursor, phase])

  const answerBlocks = useMemo(
    () => (current ? phonemeSegments(current.en) : []),
    [current],
  )
  const decoys = useMemo(
    () => (current ? decoyBlocks(current.en, level) : []),
    // wordKey 变化才算新干扰块
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.en, level],
  )

  /**
   * 候选积木堆的展示顺序：正确答案块 + 干扰块**混在一起真随机**，
   * 且此题内固定不变（换词才重新打乱）。
   *
   * ⚠️ 必须是真洗牌：早期版本这里写着 shuffleStable 却直接 return list，
   * 于是正确块总按答案顺序排在最前面 —— 孩子从左往右依次点就对了，
   * 根本不用听音也不用判断，练习完全失效。
   */
  const poolBlocks = useMemo(
    () =>
      current
        ? shuffle([...answerBlocks.map((s) => s.text), ...decoys])
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.en, level, decoys.length],
  )

  const settle = (correct: boolean) => {
    if (settledRef.current || !current) return
    settledRef.current = true
    recordReview(current.en, correct, 'alphablocks')
    if (correct) {
      setCorrectCount((n) => n + 1)
    } else {
      setMissed((prev) => (prev.some((x) => x.en === current.en) ? prev : [...prev, current]))
      addWrongWord({
        en: current.en,
        zh: current.zh,
        emoji: current.emoji || '🧱',
        from: `字母积木·${meta.zh}`,
        module: 'alphablocks',
      })
    }
  }

  const handleAdvance = () => {
    if (cursor + 1 >= round.length) {
      const earned = quizStars(correctCount, round.length)
      setStars(earned)
      addStars(earned)
      setPhase('report')
      return
    }
    setCursor((n) => n + 1)
  }

  /**
   * 点了一块积木。
   * @param text     块上的字母文本
   * @param poolIdx  它在候选堆里的下标
   *
   * ⚠️ 不能只靠 text 判定对错：有些词本身就有**重复的块**
   * （tight = t|igh|t、nine = n|i|n|e），若只比文本，
   * 孩子把第 3 位的 t 先点上去也会被当成对 —— 顺序就练不到了。
   * 所以按「候选块下标 → 它代表答案里的第几块」来判。
   */
  const placeBlock = (text: string, poolIdx: number) => {
    if (solved) return
    const needed = answerBlocks[placed.length]
    // 该块是否就是「下一个该搭的」：文本相同，且它尚未被用过
    const isCorrect = !!needed && needed.text === text && !usedPoolIdx.has(poolIdx)

    if (isCorrect) {
      setUsedPoolIdx((prev) => new Set(prev).add(poolIdx))
      const next = [...placed, text]
      setPlaced(next)
      if (next.length === answerBlocks.length) {
        setSolved(true)
        settle(true)
        advanceTimer.current = setTimeout(handleAdvance, 1600)
      }
    } else {
      setWrongFlash(true)
      settle(false)
      setTimeout(() => setWrongFlash(false), 700)
    }
  }

  const blockWordsOfLocal = (lv: BlockLevel, doubles: boolean): BlockWord[] => {
    const base = BLOCK_WORDS[lv] ?? []
    return doubles ? [...base, ...BLOCK_DOUBLE_WORDS] : base
  }

  const solvedAll = placed.join('') === (current?.en.toLowerCase().replace(/[^a-z]/g, '') ?? '')

  return (
    <div className="page alphablocks-page" style={{ '--ab-color': meta.color, '--ab-soft': meta.colorSoft } as React.CSSProperties}>
      <div className="page-head">
        <span className="page-emoji">🧱</span>
        <div>
          <div className="page-kicker">Alphablocks</div>
          <h1 className="page-title">字母积木</h1>
        </div>
      </div>

      <SafeBoundary label="字母积木">
        {/* ---------------- 选级别 ---------------- */}
        {phase === 'setup' && (
          <>
            <p className="lead">
              刚看完《字母积木》？来把动画里的词<b>亲手搭出来</b>！
              和动画一样：<b>字母小队</b>合体一个音、<b>手拉手</b>各发各的、<b>魔法E</b> 不出声但有大能量。
            </p>

            <section className="ab-setup-block">
              <div className="ab-setup-title">🎬 动画看到哪一级了？</div>
              <div className="ab-levels">
                {BLOCK_LEVELS.map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    className={`ab-level${level === l.key ? ' active' : ''}`}
                    style={{ '--lv': l.color, '--lv-soft': l.colorSoft } as React.CSSProperties}
                    onClick={() => setLevel(l.key)}
                    aria-pressed={level === l.key}
                  >
                    <span className="ab-level-dot" aria-hidden="true" />
                    <span className="ab-level-text">
                      <b>{l.zh}</b>
                      <span className="ab-level-teach">{l.teach}</span>
                    </span>
                    <span className="ab-level-count">{(BLOCK_WORDS[l.key] ?? []).length} 词</span>
                  </button>
                ))}
              </div>
              <label className="ab-check-row">
                <input
                  type="checkbox"
                  checked={withDoubles}
                  onChange={(e) => setWithDoubles(e.target.checked)}
                />
                <span>加入「双写」特别篇的词（hill / egg / kiss …）</span>
              </label>
            </section>

            <section className="ab-setup-block">
              <div className="ab-setup-title">🧩 选玩法</div>
              <div className="ab-modes">
                {(
                  [
                    ['build', '🔊', '听音搭积木', '听发音，把积木一块块搭出这个词', '推荐'],
                    ['split', '👀', '看词拆积木', '看整词，把积木拆成正确的几块', ''],
                  ] as [Mode, string, string, string, string][]
                ).map(([val, emoji, title, desc, tag]) => (
                  <button
                    key={val}
                    type="button"
                    className={`ab-mode${mode === val ? ' active' : ''}`}
                    onClick={() => setMode(val)}
                    aria-pressed={mode === val}
                    aria-label={`${emoji} ${title}`}
                  >
                    <span className="ab-mode-emoji" aria-hidden="true">{emoji}</span>
                    <span className="ab-mode-text">
                      <span className="ab-mode-title">
                        {title}
                        {tag && <b className="ab-mode-tag">{tag}</b>}
                      </span>
                      <span className="ab-mode-desc">{desc}</span>
                    </span>
                    <span className="ab-mode-check" aria-hidden="true">✓</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="ab-start-row">
              <button type="button" className="btn btn--lg ab-start-btn" onClick={start}>
                🚀 开始练习（{WORDS_PER_ROUND} 个词）
              </button>
            </div>

            <div className="ab-foot-links">
              <Link to="/dictation" className="back-link">✍️ 去听写练习</Link>
            </div>
          </>
        )}

        {/* ---------------- 练习 ---------------- */}
        {phase === 'play' && current && (
          <div className="ab-player">
            <div className="ab-progress-row">
              <span className="ab-progress-text">
                第 {cursor + 1} / {round.length} 个
              </span>
              <button type="button" className="ab-exit" onClick={backToSetup}>✕ 退出</button>
            </div>

            <div className="ab-word-card">
              <div className="ab-word-emoji" aria-hidden="true">{current.emoji}</div>
              <SpeakButton text={current.en} label={current.en} autoPlay />
              {mode === 'split' && (
                <div className="ab-word-full">{current.en}</div>
              )}
              {solved && <div className="ab-word-zh">{current.zh}</div>}
            </div>

            {/* ---- 搭好的积木槽 ---- */}
            <div className="ab-slots" aria-label="搭好的积木">
              {answerBlocks.map((seg, i) => {
                const got = placed[i]
                const isNext = i === placed.length && !solved
                return (
                  <span
                    key={i}
                    className={`ab-slot${got ? ' filled' : ''}${isNext ? ' next' : ''}${solved ? ' ok' : ''} ab-k-${got ? kindOf(got) : ''}`}
                  >
                    {got ?? (isNext ? '?' : '')}
                    {got && i === placed.length - 1 && solvedAll && (
                      <span className="ab-slot-tag">{labelOf(got)}</span>
                    )}
                  </span>
                )
              })}
            </div>

            {/* ---- 概念提示（搭完才给，别提前泄底） ---- */}
            {solved && (
              <p className="ab-hint" role="status">
                {answerBlocks.map((s, i) => (
                  <span key={i} className={`ab-hint-seg ab-k-${s.kind}`}>
                    {s.text}
                    {s.kind !== 'letter' && <i>{s.label}</i>}
                  </span>
                ))}
              </p>
            )}

            {wrongFlash && (
              <p className="ab-wrong" role="alert">这块不对，再听听这个词～</p>
            )}

            {/* ---- 候选积木堆 ---- */}
            {!solved && (
              <div className="ab-pool" aria-label="积木堆">
                {poolBlocks.map((text, i) => {
                  const used = usedPoolIdx.has(i)
                  return (
                    <button
                      key={`${text}-${i}`}
                      type="button"
                      className={`ab-block ab-k-${kindOf(text)}${used ? ' used' : ''}`}
                      disabled={used}
                      onClick={() => placeBlock(text, i)}
                    >
                      {text}
                    </button>
                  )
                })}
              </div>
            )}

            {solved && (
              <button type="button" className="btn btn--lg ab-next-btn" onClick={handleAdvance}>
                下一个 →
              </button>
            )}
          </div>
        )}

        {/* ---------------- 报告 ---------------- */}
        {phase === 'report' && (
          <div className="ab-report">
            <div className="ab-report-emoji">{correctCount === round.length ? '🏆' : '🌟'}</div>
            <h2 className="ab-report-title">这一轮搭完啦！</h2>
            <div className="ab-report-stats">
              <div className="ab-stat">
                <span className="ab-stat-num">{correctCount}/{round.length}</span>
                <span className="ab-stat-label">搭对</span>
              </div>
              <div className="ab-stat">
                <span className="ab-stat-num">{missed.length}</span>
                <span className="ab-stat-label">要再练</span>
              </div>
            </div>
            <div className="ab-stars" aria-label="获得星数">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`ab-star${i < stars ? ' is-on' : ''}`}>⭐</span>
              ))}
            </div>
            {missed.length > 0 ? (
              <section className="ab-missed">
                <div className="ab-setup-title">📌 这些积木再多搭几次（{missed.length}）</div>
                <div className="ab-missed-list">
                  {missed.map((w) => (
                    <span className="ab-missed-chip" key={w.en}>
                      <b>{w.en}</b>{w.zh && <span>{w.zh}</span>}
                    </span>
                  ))}
                </div>
                <p className="ab-setup-hint">已放进错题本，去「智能复习」还能遇到它们。</p>
              </section>
            ) : (
              <p className="ab-perfect">全部搭对，太厉害了！🎉</p>
            )}
            <div className="ab-report-actions">
              <button type="button" className="btn btn--lg ab-start-btn" onClick={start}>🔁 再来一轮</button>
              <button type="button" className="btn btn--soft" onClick={backToSetup}>🎚️ 换个级别</button>
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

/** 片段文本 → 类别（用于积木配色；候选拆掉后按匹配片段取） */
function kindOf(text: string): string {
  return phonemeSegments(text)[0]?.kind ?? 'letter'
}

function labelOf(text: string): string {
  const s = phonemeSegments(text)[0]
  return s && s.kind !== 'letter' ? s.label : ''
}
