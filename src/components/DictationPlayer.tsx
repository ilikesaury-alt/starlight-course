// ============================================================
//  听写单轮播放器 DictationPlayer
//  ------------------------------------------------------------
//  一个词 = 一轮：听 → 写（或三选一）→ 反馈 → （错则）音素格子/金字塔提示。
//
//  反馈规则（两试一揭，计分口径与验收标准 5 保持一致）：
//    第 1 次错 → **逐格标出写错的是哪个字母** + 拼读线索（可重听 / 看音素格子），仍可改；
//    第 2 次错 → 揭晓正确拼写 + 音素拆分布局；
//    对 → 全绿 + 鼓励「自动进下一词」（由父组件控制推进）。
//
//  ⭐ 2026-10 交互重构（对齐儿童拼写类应用通行做法：一字一盒 + 字母托盘）：
//    · 答案区从「一个长文本框」改成「一字一盒」：孩子写错时**直接看到是第几个字母错**，
//      而不是只收到一个「错了」；漏写的字母用虚线空格补出来，一眼知道还差几个。
//    · 听音升级为页面唯一主操作：大圆按钮 + 换词自动播一遍，孩子不用再找小喇叭。
//    · 物理键盘与屏幕字母托盘都能输入：真输入框 input.dt-input 以 opacity:0
//      覆盖在字母盒上（Playwright 判定可见、可直接 fill），视觉上只看到字母盒。
//    · 反馈从「一句灰字」改成「图标 + 标题 + 说明 + 明确动作」的横幅。
//    · 提示（音素格子 / 金字塔）收进一张卡；idle 时不泄底，只给一个「给点提示」入口。
//
//  判定规则（判对判错 / 哪个格子红 / 还差几个）全部在 @/utils/dictationSlots，
//  组件只负责渲染与交互；那里有单测钉住，改规则请先改那边的测试。
//
//  兼容约束（tests/dictation.spec.ts 依赖，勿改）：
//    input.dt-input / '✅ 检查' / '我拼不出来' / '多给一个字母' / '下一个'
//    .dt-feedback.ok|warn|bad / .dt-answer / .dt-boxes / .dt-box
//    .dt-pyramid-step.is-on / .dt-choice
//
//  发音一律走既有 SpeakButton / speakText（英文兜底链），不在此自造音频逻辑。
// ============================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import SpeakButton from './SpeakButton'
import { phonemeSegments, spellingPyramid } from '@/data/phonics'
import { buildChoices, type Choice } from '@/utils/dictation'
import type { DictationWord } from '@/utils/dictation'
import {
  buildDictationSlots,
  firstMistakeIndex,
  isSpellingCorrect,
  spellingLetters,
} from '@/utils/dictationSlots'

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
  /** 本轮已答对数（只用于进度条上的鼓励，不参与计分） */
  correctCount: number
  /** 每答完一词的回调（父组件负责记分、回灌错题本/SRS、推进） */
  onSettled: (r: DictationAttemptResult) => void
  /** 答对后自动推进（延迟由本组件控制） */
  onAdvance: () => void
  /** 中止本轮回到设置页（逃生口，避免孩子被卡在一轮里） */
  onExit: () => void
}

export default function DictationPlayer({
  word,
  index,
  total,
  mode,
  correctCount,
  onSettled,
  onAdvance,
  onExit,
}: DictationPlayerProps) {
  const answer = word.en
  const [input, setInput] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'revealed'>('idle')
  const [locked, setLocked] = useState(false)
  const [showBoxes, setShowBoxes] = useState(false)
  const [pyramidStep, setPyramidStep] = useState(0)
  /** 三选一里孩子点错的那一项，用于把它标红（而不是只标绿正确项） */
  const [pickedIdx, setPickedIdx] = useState<number | null>(null)
  const settledRef = useRef(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const wordKey = `${word.en}|${index}`

  const boxes = useMemo(() => phonemeSegments(answer), [answer])
  const pyramid = useMemo(() => spellingPyramid(answer), [answer])
  /** 答案的纯字母序列（与 phonemeBoxes 一致地剔掉非字母，长度即字母数） */
  const answerLetters = useMemo(() => spellingLetters(answer).split(''), [answer])
  /** 已打的字母数（撇号等符号不计入：孩子只写字母） */
  const typedLetterCount = useMemo(() => spellingLetters(input).length, [input])

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
    setPickedIdx(null)
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

  const submit = () => {
    if (locked || status === 'correct' || status === 'revealed') return
    if (!input.trim()) return

    // 按「纯字母」比对：let's / don't 这类带撇词，孩子只写字母也算对
    // （撇号由字母盒以固定装饰格展示，不需要他额外打出来）。
    if (isSpellingCorrect(answer, input)) {
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

  const pickChoice = (c: Choice, i: number) => {
    if (locked || status === 'correct' || status === 'revealed') return
    if (c.correct) {
      setPickedIdx(i)
      handleCorrect()
      return
    }
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    settle(false)
    setPickedIdx(i)
    setStatus(nextAttempts >= MAX_ATTEMPTS ? 'revealed' : 'wrong')
    if (nextAttempts >= MAX_ATTEMPTS) setLocked(true)
  }

  const retry = () => {
    setInput('')
    setStatus('idle')
    setPickedIdx(null)
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

  // ---------- 字母盒（一字一盒） ----------
  // 规则全在 @/utils/dictationSlots（有单测）：组件只把结果铺成 span。
  // idle/correct：按已打内容铺字母格；wrong：逐格对答案判色 + 漏写字母补虚线格；
  // revealed：直接铺出正确答案（孩子要照着记住，而不是继续盯着自己打错的那串）。
  const slots = useMemo(() => buildDictationSlots(answer, input, status), [answer, input, status])

  /** 第一个写错/漏写的位置（1 基，用于「第 n 个字母」的人话提示）；-1 表示无需提示 */
  const firstMistake = useMemo(
    () => (status === 'wrong' ? firstMistakeIndex(answer, input) : -1),
    [answer, input, status],
  )

  return (
    <div className={`dt-player ${statusClass}`}>
      {/* 进度 + 逃生口 */}
      <div className="dt-top">
        <div className="dt-progress">
          <span className="dt-progress-text">
            第 <b>{index + 1}</b> / {total} 个
          </span>
          <span className="dt-progress-track" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={`dt-pip${i < index ? ' is-done' : ''}${i === index ? ' is-now' : ''}`}
              />
            ))}
          </span>
        </div>
        <div className="dt-top-right">
          {correctCount > 0 && (
            <span className="dt-score-pill" aria-label={`已答对 ${correctCount} 个`}>
              ✅ {correctCount}
            </span>
          )}
          <button type="button" className="dt-exit" onClick={onExit}>
            ✕ 退出
          </button>
        </div>
      </div>

      {/* ---------- 听音：本页唯一主操作 ---------- */}
      <div className="dt-listen">
        <span className="dt-listen-main">
          <SpeakButton text={answer} label={answer} autoPlay />
        </span>
        <div className="dt-listen-side">
          <div className="dt-listen-title">🎧 听一听这个词</div>
          <SpeakButton text={answer} label={`${answer} 慢速`} slow />
          <span className="dt-listen-slow">慢速</span>
        </div>
      </div>

      <p className="dt-lead">
        {mode === 'spell'
          ? '把听到的字母，一个一个写进方格里。'
          : '听一听，选出拼得对的那个。'}
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
          {/* 字母盒：视觉答案区；真输入框透明覆盖其上，物理键盘/屏幕托盘都能输入 */}
          <div className="dt-slots">
            {slots.map((s, i) => (
              <span
                key={i}
                className={`dt-slot is-${s.state}${s.caret ? ' is-caret' : ''}`}
                aria-hidden="true"
              >
                {s.ch}
              </span>
            ))}
            <input
              ref={inputRef}
              className="dt-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
              placeholder=""
              aria-label="写下听到的单词"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={locked || status === 'correct' || status === 'revealed'}
            />
          </div>

          {/* 逐格反馈：说清楚「第几个字母」要改，而不是只给一个红脸 */}
          {status === 'wrong' && firstMistake > 0 && (
            <p className="dt-slot-hint">
              {firstMistake <= typedLetterCount
                ? `第 ${firstMistake} 个字母不对，改一下试试～`
                : `还差 ${answerLetters.length - typedLetterCount} 个字母没写`}
            </p>
          )}

          {/* 屏幕字母盘：移动端 / 触屏友好；不影响键盘输入 */}
          <div className="dt-tray" role="group" aria-label="字母盘">
            <div className="dt-tray-title">⌨️ 点字母拼写</div>
            <div className="dt-keyboard">
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

          <button
            type="button"
            className="btn btn--block dt-check"
            onClick={submit}
            disabled={locked || !input.trim() || status === 'correct' || status === 'revealed'}
          >
            ✅ 检查
          </button>
        </div>
      ) : (
        <div className="dt-choices">
          {choices.map((c, i) => {
            const isAnswer = c.correct
            const pickedWrong = pickedIdx === i && !c.correct && status !== 'correct'
            return (
              <button
                key={i}
                type="button"
                className={`dt-choice${isAnswer && (status === 'correct' || status === 'revealed') ? ' is-answer' : ''}${pickedWrong ? ' is-picked-wrong' : ''}`}
                onClick={() => pickChoice(c, i)}
                disabled={locked || status === 'correct' || status === 'revealed'}
              >
                <span className="dt-choice-letter">{String.fromCharCode(65 + i)}</span>
                <span className="dt-choice-text">{c.text}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ---------- 反馈 ---------- */}
      {status === 'correct' && (
        <div className="dt-feedback ok" role="status" aria-live="polite">
          <span className="dt-fb-icon" aria-hidden="true">🎉</span>
          <div className="dt-fb-body">
            <div className="dt-fb-title">太棒了，拼得完全正确！</div>
            <div className="dt-fb-text">一个字母都没错，准备下一个词啦。</div>
          </div>
        </div>
      )}
      {status === 'wrong' && (
        <div className="dt-feedback warn" role="status" aria-live="polite">
          <span className="dt-fb-icon" aria-hidden="true">🤔</span>
          <div className="dt-fb-body">
            <div className="dt-fb-title">差一点点，再试一次！</div>
            <div className="dt-fb-text">
              看看下面哪个格子是红的，把它改过来。也可以点 🔊 再听一遍。
            </div>
            <button type="button" className="dt-retry" onClick={retry}>
              ✏️ 清空重写
            </button>
          </div>
        </div>
      )}
      {status === 'revealed' && (
        <div className="dt-feedback bad" role="status" aria-live="polite">
          <span className="dt-fb-icon" aria-hidden="true">💡</span>
          <div className="dt-fb-body">
            <div className="dt-fb-title">
              正确答案是：<b className="dt-answer">{answer}</b>
            </div>
            <div className="dt-reveal-hint">
              跟着下面的拼读卡读两遍，下次就能自己写出来。
            </div>
            <button type="button" className="dt-retry" onClick={onAdvance}>
              下一个 →
            </button>
          </div>
        </div>
      )}

      {/* ---------- 自然拼读桥接：音素格子 + 金字塔 ---------- */}
      {(showBoxes || status === 'wrong' || status === 'revealed') && (
        <section className="dt-phonics">
          <div className="dt-phonics-title">🔤 把声音拆成字母（自然拼读）</div>
          <p className="dt-phonics-legend">
            和《字母积木》一样：<b>字母小队</b>合成一个音，<b>手拉手</b>各发各的音，
            <b>魔法E</b>自己不出声、但让前面的元音发长音。
          </p>
          <div className="dt-boxes" aria-label="音素格子">
            {boxes.map((b, i) => (
              <span className={`dt-box dt-box--${b.kind}`} key={i}>
                <span className="dt-box-num" aria-hidden="true">{i + 1}</span>
                <span className="dt-box-text">{b.text}</span>
                {/* 魔法E / 不发音字母：点一下读的是"字母名"，对孩子没用 —— 不给喇叭 */}
                {b.kind !== 'magic-e' && b.kind !== 'silent' && (
                  <SpeakButton text={b.text} label={b.text} />
                )}
                <span className="dt-box-tag" aria-hidden="true">
                  {b.kind === 'letter' ? '' : b.label}
                </span>
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
