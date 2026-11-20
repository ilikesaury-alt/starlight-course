// ============================================================
//  读词训练页 /read —— 补"听得懂 → 看得懂"那座桥
//  ------------------------------------------------------------
//  两个 Tab，两条互补的认词路径：
//    Tab 1 拼一拼（decoding）：看规则新词 → 自己拼读 → 才揭晓拆解 + 标准发音
//           → 自评读对没有。练的是"形 → 音"的解码（阅读的引擎）。
//    Tab 2 快速认（sightwords）：高频不规则词限时闪现 → 整体认读 → 翻面看意思
//           → 穿插形近辨认。练的是"整体词形识别"。
//
//  ⚠️ 两条路不能混：规则词走拼读、不规则词走整体认。
//     把 the 拿去拼、把 fan 当图记，都是错的策略。
//
//  复用：quizStars 星规 / recordReview + addWrongWord 回灌 SRS 与错题本 /
//        shuffle 洗牌 / SpeakButton 发音兜底链 / moduleThemeVars 主题。
//  不升 store version：'decoding' | 'sightwords' 只是 ModuleId 的练习型取值。
// ============================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import SpeakButton from '@/components/SpeakButton'
import { useCourseStore } from '@/store/useCourseStore'
import { quizStars } from '@/utils/stars'
import { shuffle } from '@/utils/dictation'
import { moduleThemeVars } from '@/utils/theme'
import {
  DECODE_GROUPS,
  decodeGroupMeta,
  decodeSegments,
  decodeWordsOf,
  type DecodeGroup,
  type DecodeWord,
} from '@/data/decoding'
import {
  SIGHT_LEVELS,
  lookalikes,
  sightWordsOf,
  type SightLevel,
  type SightWord,
} from '@/data/sightWords'

type Phase = 'setup' | 'play' | 'report'

const RW_THEME = { color: '#0d9488', colorSoft: '#ccfbf1' } as const
const DECODE_PER_ROUND = 8
const SIGHT_PER_ROUND = 12
/** 高频词闪现时长（ms）：1.2s 一到就翻面，逼整体认读而不是逐字母拼 */
const FLASH_MS = 1200

export default function ReadWordsPage() {
  const [tab, setTab] = useState<'decode' | 'sight'>('decode')
  return (
    <div className="page readwords-page" style={moduleThemeVars(RW_THEME)}>
      <div className="page-head">
        <span className="page-emoji">🔤</span>
        <div>
          <div className="page-kicker">Reading bridge</div>
          <h1 className="page-title">读词训练</h1>
        </div>
      </div>

      <div className="rw-tabs" role="tablist" aria-label="读词训练方式">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'decode'}
          className={'rw-tab' + (tab === 'decode' ? ' active' : '')}
          onClick={() => setTab('decode')}
        >
          <span aria-hidden="true">🔤</span>
          <b>拼一拼</b>
          <small>看到新词，自己读出来</small>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'sight'}
          className={'rw-tab' + (tab === 'sight' ? ' active' : '')}
          onClick={() => setTab('sight')}
        >
          <span aria-hidden="true">⚡</span>
          <b>快速认</b>
          <small>一眼认出拼不对的词</small>
        </button>
      </div>

      <SafeBoundary label="读词训练">
        {tab === 'decode' ? <DecodeTab /> : <SightTab />}
      </SafeBoundary>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
        <Link to="/alphablocks" className="back-link">字母积木 →</Link>
      </div>
    </div>
  )
}

// ==================== Tab 1 · 拼一拼 ====================
function DecodeTab() {
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addStars = useCourseStore((s) => s.addStars)

  const [phase, setPhase] = useState<Phase>('setup')
  const [group, setGroup] = useState<DecodeGroup>('short')
  const [round, setRound] = useState<DecodeWord[]>([])
  const [cursor, setCursor] = useState(0)
  /** 揭晓开关：念头没翻面之前，只给词形 —— 给了拆解就等于报答案 */
  const [revealed, setRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const correctRef = useRef(0)
  const [missed, setMissed] = useState<DecodeWord[]>([])
  const [stars, setStars] = useState(0)

  const current = round[cursor]
  const meta = decodeGroupMeta(group)
  const segs = useMemo(() => (current ? decodeSegments(current.en) : []), [current])

  const start = () => {
    setRound(shuffle([...decodeWordsOf(group)]).slice(0, DECODE_PER_ROUND))
    setCursor(0)
    setCorrectCount(0)
    correctRef.current = 0
    setMissed([])
    setStars(0)
    setRevealed(false)
    setPhase('play')
  }

  const backToSetup = () => {
    setPhase('setup')
    setRound([])
    setCursor(0)
    setRevealed(false)
  }

  /** 自评：孩子读完后点「读对了 / 没读对」，记一次 SRS + 错词回灌 */
  const answer = (ok: boolean) => {
    if (!current) return
    recordReview(current.en, ok, 'decoding')
    if (ok) {
      setCorrectCount((n) => n + 1)
      correctRef.current += 1
    } else {
      setMissed((prev) => (prev.some((x) => x.en === current.en) ? prev : [...prev, current]))
      addWrongWord({
        en: current.en,
        zh: current.zh,
        emoji: current.emoji,
        from: `读词·${meta.zh}`,
        module: 'decoding',
      })
    }
    if (cursor + 1 >= round.length) {
      const earned = quizStars(correctRef.current, round.length)
      setStars(earned)
      addStars(earned)
      setPhase('report')
    } else {
      setCursor((n) => n + 1)
      setRevealed(false)
    }
  }

  return (
    <div className="rw-body">
      {phase === 'setup' && (
        <>
          <p className="lead">
            看一个没学过的词，<b>先自己试着读出来</b>，再点开看拆得对不对。
            读得出来，以后见到新词也不怕。
          </p>
          <div className="rw-setup-title">想练哪一种？</div>
          <div className="rw-groups">
            {DECODE_GROUPS.map((g) => (
              <button
                key={g.key}
                type="button"
                className={'rw-group' + (group === g.key ? ' active' : '')}
                style={{ '--gc': g.color, '--gc-soft': g.colorSoft } as React.CSSProperties}
                onClick={() => setGroup(g.key)}
                aria-pressed={group === g.key}
              >
                <b>{g.zh}</b>
                <span>{g.teach}</span>
                <small>{decodeWordsOf(g.key).length} 个词</small>
              </button>
            ))}
          </div>
          <div className="rw-start-row">
            <button type="button" className="btn btn--lg" onClick={start}>
              开始拼读（{Math.min(decodeWordsOf(group).length, DECODE_PER_ROUND)} 个词）
            </button>
          </div>
        </>
      )}

      {phase === 'play' && current && (
        <div className="rw-player" style={{ '--gc': meta.color, '--gc-soft': meta.colorSoft } as React.CSSProperties}>
          <div className="rw-progress-row">
            <span>第 {cursor + 1} / {round.length} 个 · {meta.zh}</span>
            <button type="button" className="rw-exit" onClick={backToSetup}>退出</button>
          </div>

          <div className="rw-word-card">
            <div className="rw-word">{current.en}</div>
            <SpeakButton text={current.en} label={current.en} />
          </div>

          {!revealed ? (
            <>
              <p className="rw-lead">先在心里拼一拼、大声读出来，再看对不对～</p>
              <button type="button" className="btn btn--lg rw-reveal" onClick={() => setRevealed(true)}>
                👀 看拆解
              </button>
            </>
          ) : (
            <>
              <div className="rw-segs" aria-label="这个词的拆解">
                {segs.map((s, i) => (
                  <span key={i} className={`rw-seg rw-k-${s.kind}`}>
                    <b>{s.text}</b>
                    {s.kind !== 'letter' && <i>{s.label}</i>}
                  </span>
                ))}
              </div>
              <div className="rw-answer-row">
                <span className="rw-word-emoji" aria-hidden="true">{current.emoji}</span>
                <span className="rw-word-zh">{current.zh}</span>
              </div>
              <p className="rw-lead">刚才你自己读出来了吗？</p>
              <div className="rw-answer-btns">
                <button type="button" className="btn rw-got" onClick={() => answer(true)}>✅ 我读对了</button>
                <button type="button" className="btn rw-miss" onClick={() => answer(false)}>🔁 还没读对</button>
              </div>
            </>
          )}
        </div>
      )}

      {phase === 'report' && (
        <div className="rw-report">
          <h2 className="rw-report-title">这一轮读完啦！</h2>
          <div className="rw-report-stats">
            <div className="rw-stat"><span className="rw-stat-num">{correctCount}/{round.length}</span><span>读对</span></div>
            <div className="rw-stat"><span className="rw-stat-num">{missed.length}</span><span>要再练</span></div>
          </div>
          <div className="rw-stars" aria-label="获得星数">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={'rw-star' + (i < stars ? ' is-on' : '')}>⭐</span>
            ))}
          </div>
          {missed.length > 0 && (
            <section className="rw-missed">
              <div className="rw-setup-title">这些再多读几次（{missed.length}）</div>
              <div className="rw-missed-list">
                {missed.map((w) => <span className="rw-missed-chip" key={w.en}><b>{w.en}</b> {w.zh}</span>)}
              </div>
              <p className="rw-setup-hint">已经放进错题本，智能复习里还能再遇到。</p>
            </section>
          )}
          <div className="rw-report-actions">
            <button type="button" className="btn btn--lg" onClick={start}>🔁 再来一轮</button>
            <button type="button" className="btn btn--soft" onClick={backToSetup}>换个级别</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== Tab 2 · 快速认 ====================
/**
 * 一轮的条目：闪卡 + 穿插的形近辨认。
 * 闪卡自评（认识/不认识）；形近题客观判（选对/选错）——两者都按一题计。
 */
type SightItem =
  | { kind: 'flash'; key: string; word: SightWord }
  | { kind: 'pick'; key: string; word: SightWord; options: string[] }

function buildSightRound(level: SightLevel): SightItem[] {
  const picked = shuffle([...sightWordsOf(level)]).slice(0, SIGHT_PER_ROUND)
  const items: SightItem[] = []
  picked.forEach((word, i) => {
    // 每 4 张闪卡穿插 1 道形近辨认（第 3、7、11 张后）
    if (i > 0 && i % 4 === 3) {
      const near = lookalikes(word.en, 2)
      if (near.length === 2) {
        items.push({
          kind: 'pick',
          key: `pick-${word.en}`,
          word,
          // 干扰项需有中文可展示；从词表里反查，查不到就用形近词本身
          options: shuffle([word.en, ...near]),
        })
      }
    }
    items.push({ kind: 'flash', key: `flash-${word.en}`, word })
  })
  return items
}

function SightTab() {
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addStars = useCourseStore((s) => s.addStars)

  const [phase, setPhase] = useState<Phase>('setup')
  const [level, setLevel] = useState<SightLevel>('start')
  const [round, setRound] = useState<SightItem[]>([])
  const [cursor, setCursor] = useState(0)
  /** 闪卡是否已翻面（自动 1.2s 或孩子主动点「认识」立刻翻） */
  const [flipped, setFlipped] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const correctRef = useRef(0)
  const [missed, setMissed] = useState<SightWord[]>([])
  const [stars, setStars] = useState(0)
  /** 形近题当前选择（下标） */
  const [picked, setPicked] = useState<number | null>(null)

  const current = round[cursor]
  const meta = SIGHT_LEVELS.find((l) => l.key === level) ?? SIGHT_LEVELS[0]

  // 闪卡自动翻面计时：仅在 flash 且未翻面时挂，换条目前清掉（防止迟到 timer 翻错卡）
  useEffect(() => {
    if (phase !== 'play' || !current || current.kind !== 'flash' || flipped) return
    const t = window.setTimeout(() => setFlipped(true), FLASH_MS)
    return () => window.clearTimeout(t)
  }, [current, flipped, phase])

  // 换条目重置翻面/选择状态
  useEffect(() => {
    setFlipped(false)
    setPicked(null)
  }, [cursor, phase])

  const start = () => {
    setRound(buildSightRound(level))
    setCursor(0)
    setCorrectCount(0)
    correctRef.current = 0
    setMissed([])
    setStars(0)
    setFlipped(false)
    setPicked(null)
    setPhase('play')
  }

  const backToSetup = () => {
    setPhase('setup')
    setRound([])
    setCursor(0)
    setFlipped(false)
    setPicked(null)
  }

  const markMissed = (w: SightWord) => {
    setMissed((prev) => (prev.some((x) => x.en === w.en) ? prev : [...prev, w]))
    addWrongWord({
      en: w.en,
      zh: w.zh,
      emoji: '⚡',
      from: `读词·快速认（${meta.zh}）`,
      module: 'sightwords',
    })
  }

  const advance = () => {
    if (cursor + 1 >= round.length) {
      const earned = quizStars(correctRef.current, round.length)
      setStars(earned)
      addStars(earned)
      setPhase('report')
    } else {
      setCursor((n) => n + 1)
    }
  }

  const answerFlash = (ok: boolean) => {
    if (!current || current.kind !== 'flash') return
    recordReview(current.word.en, ok, 'sightwords')
    if (ok) {
      setCorrectCount((n) => n + 1)
      correctRef.current += 1
    } else {
      markMissed(current.word)
    }
    advance()
  }

  const answerPick = (idx: number) => {
    if (!current || current.kind !== 'pick' || picked !== null) return
    setPicked(idx)
    const ok = current.options[idx] === current.word.en
    recordReview(current.word.en, ok, 'sightwords')
    if (ok) {
      setCorrectCount((n) => n + 1)
      correctRef.current += 1
    } else {
      markMissed(current.word)
    }
    window.setTimeout(advance, 700)
  }

  return (
    <div className="rw-body" style={{ '--gc': meta.color, '--gc-soft': meta.colorSoft } as React.CSSProperties}>
      {phase === 'setup' && (
        <>
          <p className="lead">
            有些词<b>拼不对、但天天见</b>（像 the / said）。别一个字母一个字母拼 ——
            看一眼就认出来，才算学会。
          </p>
          <div className="rw-setup-title">从哪一级开始？</div>
          <div className="rw-groups">
            {SIGHT_LEVELS.map((l) => (
              <button
                key={l.key}
                type="button"
                className={'rw-group' + (level === l.key ? ' active' : '')}
                style={{ '--gc': l.color, '--gc-soft': l.colorSoft } as React.CSSProperties}
                onClick={() => setLevel(l.key)}
                aria-pressed={level === l.key}
              >
                <b>{l.zh}</b>
                <span>{l.desc}</span>
                <small>{sightWordsOf(l.key).length} 个词</small>
              </button>
            ))}
          </div>
          <div className="rw-start-row">
            <button type="button" className="btn btn--lg" onClick={start}>
              开始快速认（{SIGHT_PER_ROUND} 张卡）
            </button>
          </div>
        </>
      )}

      {phase === 'play' && current && (
        <div className="rw-player">
          <div className="rw-progress-row">
            <span>第 {cursor + 1} / {round.length} 张 · {meta.zh}</span>
            <button type="button" className="rw-exit" onClick={backToSetup}>退出</button>
          </div>

          {current.kind === 'flash' ? (
            <div className="rw-flash">
              {!flipped ? (
                <button type="button" className="rw-flash-card" onClick={() => setFlipped(true)}>
                  <span className="rw-flash-word">{current.word.en}</span>
                  <span className="rw-flash-hint">看一眼，在心里说出来</span>
                </button>
              ) : (
                <div className="rw-flash-face rw-flash--known">
                  <div className="rw-flash-word">{current.word.en}</div>
                  <div className="rw-flash-zh">{current.word.zh}</div>
                  <p className="rw-lead">刚才一眼就认出来了吗？</p>
                  <div className="rw-answer-btns">
                    <button type="button" className="btn rw-got" onClick={() => answerFlash(true)}>👍 认识</button>
                    <button type="button" className="btn rw-miss" onClick={() => answerFlash(false)}>🤔 不认识</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rw-pick">
              <div className="rw-pick-q">哪个是 <b>{current.word.en}</b>？</div>
              <div className="rw-pick-zh">（{current.word.zh}）</div>
              <div className="rw-pick-options">
                {current.options.map((opt, i) => (
                  <button
                    key={`${opt}-${i}`}
                    type="button"
                    className={
                      'rw-pick-opt' +
                      (picked !== null && opt === current.word.en ? ' ok' : '') +
                      (picked === i && opt !== current.word.en ? ' bad' : '')
                    }
                    onClick={() => answerPick(i)}
                    disabled={picked !== null}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'report' && (
        <div className="rw-report">
          <h2 className="rw-report-title">这一轮认完啦！</h2>
          <div className="rw-report-stats">
            <div className="rw-stat"><span className="rw-stat-num">{correctCount}/{round.length}</span><span>认出</span></div>
            <div className="rw-stat"><span className="rw-stat-num">{missed.length}</span><span>要再练</span></div>
          </div>
          <div className="rw-stars" aria-label="获得星数">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={'rw-star' + (i < stars ? ' is-on' : '')}>⭐</span>
            ))}
          </div>
          {missed.length > 0 && (
            <section className="rw-missed">
              <div className="rw-setup-title">这些再多看几眼（{missed.length}）</div>
              <div className="rw-missed-list">
                {missed.map((w) => <span className="rw-missed-chip" key={w.en}><b>{w.en}</b> {w.zh}</span>)}
              </div>
              <p className="rw-setup-hint">已经放进错题本，智能复习里还能再遇到。</p>
            </section>
          )}
          <div className="rw-report-actions">
            <button type="button" className="btn btn--lg" onClick={start}>🔁 再来一轮</button>
            <button type="button" className="btn btn--soft" onClick={backToSetup}>换个级别</button>
          </div>
        </div>
      )}
    </div>
  )
}
