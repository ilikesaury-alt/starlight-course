// ============================================================
//  听写单轮播放器 DictationPlayer
//  ------------------------------------------------------------
//  一个词 = 一轮：听 → 写（或三选一）→ 反馈 → （错则）音素格子/金字塔提示。
//
//  反馈规则（两试一揭）：
//    第 1 次错 → 红 + 拼读线索（可重听 / 看音素格子），仍可改；
//    第 2 次错 → 揭晓正确拼写 + 音素拆分布局；
//    对 → 绿 + 鼓励「自动进下一词」（由父组件控制推进）。
//
//  自然拼读桥接（本模块核心差异化，补孩子缺失的 phonics）：
//    - 音素格子（Elkonin box）：按音素切分逐格展示，可逐格朗读；
//    - 金字塔拼写：c / ca / cat 逐阶展开，作为记不住时的提示梯。
//
//  发音一律走既有 SpeakButton / speakText（英文兜底链），不在此自造音频逻辑。
// ============================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import SpeakButton from './SpeakButton'
import { phonemeBoxes, spellingPyramid } from '@/data/phonics'
import { buildChoices, type Choice } from '@/utils/dictation'
import type { DictationWord } from '@/utils/dictation'

const ADVANCE_DELAY_MS = 1100
const RETRY_COOLDOWN_MS = 500
const MAX_ATTEMPTS = 2

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

export interface DictationAttemptResult {
  correct: boolean
}

interface DictationPlayerProps {
  word: DictationWord
  index: number
  total: number
  mode: 'spell' | 'choice'
  /** 每答完一词的回调（父组件负责记分、回灌错题本/SRS、推进） */
  onSettled: (r: DictationAttemptResult) => void
  /** 答对后自动推进（延迟由本组件控制） */
  onAdvance: () => void
}

export default function DictationPlayer({
  word,
  index,
  total,
  mode,
  onSettled,
  onAdvance,
}: DictationPlayerProps) {
  const answer = word.en
  const [input, setInput] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'revealed'>('idle')
  const [locked, setLocked] = useState(false)
  const [showBoxes, setShowBoxes] = useState(false)
  const [pyramidStep, setPyramidStep] = useState(0)
  const settledRef = useRef(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const wordKey = `${word.en}|${index}`

  const boxes = useMemo(() => phonemeBoxes(answer), [answer])
  const pyramid = useMemo(() => spellingPyramid(answer), [answer])

  // 三选一选项：按 wordKey 稳定生成（同一词不会因重渲染变选项）
  const choices = useMemo<Choice[]>(
    () => (mode === 'choice' ? buildChoices(answer, 3) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wordKey, mode],
  )

  // 换词：重置本轮所有状态
  useEffect(() => {
    settledRef.current = false
    setInput('')
    setAttempts(0)
    setStatus('idle')
    setLocked(false)
    setShowBoxes(false)
    setPyramidStep(0)
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
    if (mode === 'spell') {
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [wordKey, mode])

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  const settle = (correct: boolean) => {
    if (settledRef.current) return
    settledRef.current = true
    onSettled({ correct })
  }

  // 两试一揭的计分口径（对齐验收标准 5）：
  //   · 第一次就写对 → 计对
  //   · 第一次错（计错、进错题本），第二次改对 → 仍计错（学习效果看「见过提示后能否写对」，
  //     首次能否独立写对才是真实掌握度）；但UI给鼓励文案，不让孩子受挫。
  //   · 第二次也错 → 揭晓答案，计错
  // 因此 settle(false) 只在首次错时调用一次（settledRef 去重），后续对/错不再重复计分。
  const handleCorrect = () => {
    setStatus('correct')
    setLocked(true)
    settle(true)
    advanceTimer.current = setTimeout(() => onAdvance(), ADVANCE_DELAY_MS)
  }

  const normalize = (s: string) => s.trim().toLowerCase()

  const submit = () => {
    if (locked || status === 'correct' || status === 'revealed') return
    const typed = normalize(input)
    if (!typed) return

    const isRight = typed === normalize(answer)
    if (isRight) {
      handleCorrect()
      return
    }

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    settle(false)

    if (nextAttempts >= MAX_ATTEMPTS) {
      // 第二次错：揭晓答案
      setStatus('revealed')
      setLocked(true)
      setShowBoxes(true)
      return
    }

    // 第一次错：给线索，允许再试
    setStatus('wrong')
    setShowBoxes(true)
    setLocked(true)
    setTimeout(() => {
      setLocked(false)
      inputRef.current?.focus()
    }, RETRY_COOLDOWN_MS)
  }

  const pickChoice = (c: Choice) => {
    if (locked || status === 'correct' || status === 'revealed') return
    if (c.correct) {
      handleCorrect()
      return
    }
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    settle(false)
    setStatus(nextAttempts >= MAX_ATTEMPTS ? 'revealed' : 'wrong')
    if (nextAttempts >= MAX_ATTEMPTS) setLocked(true)
  }

  const retry = () => {
    setInput('')
    setStatus('idle')
    setLocked(false)
    inputRef.current?.focus()
  }
  const appendChar = (ch: string) => {
    if (locked || status === 'correct' || status === 'revealed') return
    setInput((s) => (s + ch).slice(0, 24))
    inputRef.current?.focus()
  }

  const statusClass =
    status === 'correct'
      ? 'is-correct'
      : status === 'wrong'
        ? 'is-wrong'
        : status === 'revealed'
          ? 'is-revealed'
          : ''

  return (
    <div className={`dt-player ${statusClass}`}>
      {/* 进度 + 听音 */}
      <div className="dt-top">
        <div className="dt-progress">
          第 <b>{index + 1}</b> / {total} 个
        </div>
        <div className="dt-listen">
          <SpeakButton text={answer} label={answer} />
          <SpeakButton text={answer} label={`${answer} 慢速`} slow />
        </div>
      </div>

      <p className="dt-lead">
        {mode === 'spell'
          ? '🎧 听一听，把单词写出来。'
          : '🎧 听一听，选出拼得对的那个。'}
      </p>

      {/* 中文提示（帮助理解是哪个词，但不泄露拼写） */}
      {word.zh && (
        <div className="dt-mean">
          <span className="dt-mean-emoji">{word.emoji || '🔤'}</span>
          <span className="dt-mean-zh">{word.zh}</span>
        </div>
      )}

      {/* ---------- 作答区 ---------- */}
      {mode === 'spell' ? (
        <div className="dt-spell">
          <input
            ref={inputRef}
            className="dt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
            placeholder="在这里写下听到的单词"
            aria-label="写下听到的单词"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={locked || status === 'correct' || status === 'revealed'}
          />
          <button
            type="button"
            className="btn dt-check"
            onClick={submit}
            disabled={locked || !input.trim() || status === 'correct' || status === 'revealed'}
          >
            ✅ 检查
          </button>

          {/* 屏幕字母盘：移动端 / 触屏友好；不影响键盘输入 */}
          <div className="dt-keyboard" role="group" aria-label="字母盘">
            {ALPHABET.map((ch) => (
              <button
                key={ch}
                type="button"
                className="dt-key"
                onClick={() => appendChar(ch)}
                disabled={locked || status === 'correct' || status === 'revealed'}
              >
                {ch}
              </button>
            ))}
            <button
              type="button"
              className="dt-key dt-key-del"
              onClick={() => setInput((s) => s.slice(0, -1))}
              disabled={locked || status === 'correct' || status === 'revealed'}
              aria-label="删除一个字母"
            >
              ⌫
            </button>
          </div>
        </div>
      ) : (
        <div className="dt-choices">
          {choices.map((c, i) => {
            const picked =
              status === 'correct' && c.correct
            const missedWrong = status === 'revealed' && c.correct
            return (
              <button
                key={i}
                type="button"
                className={`dt-choice${picked || missedWrong ? ' is-answer' : ''}`}
                onClick={() => pickChoice(c)}
                disabled={locked || status === 'correct' || status === 'revealed'}
              >
                {c.text}
              </button>
            )
          })}
        </div>
      )}

      {/* ---------- 反馈 ---------- */}
      {status === 'correct' && (
        <div className="dt-feedback ok" role="status" aria-live="polite">
          🎉 太棒了！拼得完全正确！
        </div>
      )}
      {status === 'wrong' && (
        <div className="dt-feedback warn" role="status" aria-live="polite">
          🤔 差一点点～ 看看下面的音素格子，再试一次！
          <button type="button" className="dt-retry" onClick={retry}>
            再试一次
          </button>
        </div>
      )}
      {status === 'revealed' && (
        <div className="dt-feedback bad" role="status" aria-live="polite">
          <div>
            ✍️ 正确答案是：<b className="dt-answer">{answer}</b>
          </div>
          <div className="dt-reveal-hint">记住它的声音和字母，下次就会啦！</div>
          <button type="button" className="dt-retry" onClick={onAdvance}>
            下一个 →
          </button>
        </div>
      )}

      {/* ---------- 自然拼读桥接：音素格子 + 金字塔 ---------- */}
      {(showBoxes || status === 'wrong' || status === 'revealed') && (
        <section className="dt-phonics">
          <div className="dt-phonics-title">🔤 把声音拆成字母（自然拼读）</div>
          <div className="dt-boxes" aria-label="音素格子">
            {boxes.map((b, i) => (
              <span className="dt-box" key={i}>
                <span className="dt-box-text">{b}</span>
                <SpeakButton text={b} label={b} />
              </span>
            ))}
          </div>
          <div className="dt-phonics-title">🪜 一个字母一个字母拼</div>
          <div className="dt-pyramid">
            {pyramid.map((step, i) => (
              <div
                key={i}
                className={`dt-pyramid-step${i <= pyramidStep ? ' is-on' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
          {pyramidStep < pyramid.length - 1 && (
            <button
              type="button"
              className="dt-pyramid-next"
              onClick={() => setPyramidStep((n) => Math.min(n + 1, pyramid.length - 1))}
            >
              多给一个字母 ▸
            </button>
          )}
        </section>
      )}

      {/* 首次错后主动给"看音素格子"的入口，避免一上来就泄底 */}
      {status === 'idle' && !showBoxes && (
        <button type="button" className="dt-hint-btn" onClick={() => setShowBoxes(true)}>
          💡 我拼不出来，给点提示
        </button>
      )}
    </div>
  )
}
