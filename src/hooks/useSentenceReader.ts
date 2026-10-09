// 逐句跟读编排：TTS 播原句 → 麦克风识别 → 多候选相似度评分 → 达标记 SRS。
//
// 全程自动判定，不设「家长确认」：
//   · 没听清 / 网络抖动 / 中途打断 → 自动重听（最多 MAX_AUTO_RETRY 次），孩子无感；
//   · 引擎给了多个候选 → 逐个评分取最像原句的那次（口音、背景音下更稳）；
//   · 仍然失败 / 麦克风没权限 / 浏览器不支持 → 状态回「我来读」并给「跳过这句」，
//     由孩子自己重试或跳过 —— 既不打断流程，也不假装读对。

import { useCallback, useEffect, useRef, useState } from 'react'
import { speakText, cancelSpeech } from '@/utils/speak'
import { useSpeechRecognition, type SttErrorCode } from './useSpeechRecognition'
import { scoreSentence, type SimilarityResult } from '@/utils/similarity'

export type ReaderStatus = 'idle' | 'playing' | 'listening' | 'scored'

export interface Scored extends SimilarityResult {
  /** 达标阈值：score >= threshold */
  passed: boolean
  /** 实际用来评分的识别文本（多候选时取最贴的那句） */
  heard: string
}

interface Options {
  /** 原句 */
  reference: string
  /** 达标回调：true=达标 */
  onPass?: (ok: boolean) => void
  /** 达标阈值 */
  threshold?: number
}

/** 重听一次大概率就好，不打扰孩子 */
const TRANSIENT = new Set<SttErrorCode>(['no-speech', 'aborted', 'network'])
/** 自动重试上限：用完就交回给孩子（再读一次 / 跳过），不无限转圈 */
const MAX_AUTO_RETRY = 2
/** 重试间隔：等上一轮识别彻底收尾，避免新旧实例互相 abort */
const RETRY_DELAY = 800
/** 「在听你说」至少展示这么久：不让状态一闪而过（孩子还没看清就报错了） */
const MIN_LISTEN_MS = 1500
/**
 * 等示范播完的上限：正常云端链路 3~4s 内回调 onEnd，这里只兜「迟迟不回调」。
 * 原 6s 是按旧链路（有道整段 5s 超时）定的；现在整链含百度整句/分片，
 * 慢网下 10s 才出声是常态，6s 会把还能救的示范掐掉。到点会取消未播完的
 * 示范再开麦（见 start()），不会把迟到音频盖在孩子跟读上。
 */
const PHASE_TIMEOUT_MS = 12000

export function useSentenceReader({ reference, onPass, threshold = 0.6 }: Options) {
  const [status, setStatus] = useState<ReaderStatus>('idle')
  const [result, setResult] = useState<Scored | null>(null)
  const [errorCode, setErrorCode] = useState<SttErrorCode | null>(null)
  /** 正在自动重听（给「没听清，我再听一次…」提示） */
  const [retrying, setRetrying] = useState(false)
  /** 识别中间结果：边说边出字，证明「麦克风真的在听」 */
  const [interim, setInterim] = useState('')

  const attemptsRef = useRef(0)
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** 「等示范播完再开麦」的兜底定时器：切句 / 重置时必须清掉，
   *  否则旧定时器会在新句子上凭空开麦（表现为没点按钮却在听） */
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** 运行代次：start() 自增、reset()/卸载时作废。
   *  示范的 onEnd 由播放服务持有、可能迟到几秒才回调 —— 那时句子早换了、
   *  组件早卸了，必须挡住它，否则会给作废的会话偷偷开麦（也会污染计数） */
  const runRef = useRef(0)
  /** 进入 listening 的时刻：用来保证「在听你说」这段动画至少展示 MIN_LISTEN_MS */
  const listenStartRef = useRef(0)
  // 失败处理要在 useSpeechRecognition 之后才能拿到 start，回调经 ref 转发避免时序/闭包问题
  const failRef = useRef<(code: SttErrorCode) => void>(() => {})

  const clearRetry = useCallback(() => {
    if (retryTimer.current) {
      clearTimeout(retryTimer.current)
      retryTimer.current = null
    }
    if (phaseTimer.current) {
      clearTimeout(phaseTimer.current)
      phaseTimer.current = null
    }
  }, [])

  const finish = useCallback(
    (r: Scored, passed: boolean) => {
      setResult(r)
      setInterim('')
      setStatus('scored')
      onPass?.(passed)
    },
    [onPass]
  )

  const stt = useSpeechRecognition({
    lang: 'en-US',
    onResult: (text, alternatives = []) => {
      // 自动判定的核心：每个候选都打分，取最像原句的那个结果
      let bestHeard = text
      let best = scoreSentence(reference, text, { threshold })
      for (const alt of alternatives) {
        const r = scoreSentence(reference, alt, { threshold })
        if (r.score > best.score) {
          best = r
          bestHeard = alt
        }
      }
      finish({ ...best, passed: best.passed, heard: bestHeard }, best.passed)
    },
    onEmpty: () => failRef.current('no-speech'),
    onError: (code) => failRef.current(code),
    onInterim: (text) => setInterim(text),
  })
  // 取出稳定的 start/stop：依赖整个 stt 对象会让下游 useCallback 每次渲染都变，
  // 进而让「换句重置」等 effect 反复触发。
  const { start: startStt, stop: stopStt, supported } = stt

  /** 识别失败：可恢复的先自动重听；到头了才落回终态交给孩子 */
  const handleFail = useCallback(
    (code: SttErrorCode) => {
      setInterim('')
      if (TRANSIENT.has(code) && attemptsRef.current < MAX_AUTO_RETRY) {
        attemptsRef.current += 1
        setRetrying(true)
        setErrorCode(null)
        clearRetry()
        retryTimer.current = setTimeout(() => {
          retryTimer.current = null
          setRetrying(false)
          startStt()
        }, RETRY_DELAY)
        return
      }
      // 终态：状态回 idle，麦克风按钮恢复「我来读」，绝不卡在「在听你说…」。
      // 「没听清」还要等 listening 至少展示满 MIN_LISTEN_MS 再报，否则动画一闪而过，
      // 孩子只看到「始终听不清」、看不到正在听的状态。
      const settle = () => {
        retryTimer.current = null
        setRetrying(false)
        setStatus('idle')
        setErrorCode(code)
      }
      clearRetry()
      const elapsed = Date.now() - listenStartRef.current
      const wait = code === 'no-speech' ? Math.max(0, MIN_LISTEN_MS - elapsed) : 0
      if (wait > 0) retryTimer.current = setTimeout(settle, wait)
      else settle()
    },
    [startStt, clearRetry]
  )
  failRef.current = handleFail

  /** 先播原句示范，再进入录音 */
  const start = useCallback(() => {
    clearRetry()
    attemptsRef.current = 0
    setRetrying(false)
    setResult(null)
    setErrorCode(null)
    setInterim('')
    setStatus('playing')
    const run = ++runRef.current
    let settled = false
    const goListening = () => {
      if (runRef.current !== run || settled) return
      settled = true
      phaseTimer.current = null
      listenStartRef.current = Date.now()
      setStatus('listening')
      startStt()
    }
    // 等示范真正播完再开麦：麦一开就不该再有外放（既避免干扰识别，
    // 也让孩子「听完 → 再读」的节奏固定。
    speakText(reference, { onEnd: goListening })
    // 超时保险：示范链最迟也会在 speakService 的请求预算内回调 onEnd，
    // 但慢网 / 云端全挂时可能拖到几十秒 —— 到点就停掉还没播完的示范直接开麦，
    // 绝不让流程卡在一声不响的等待上（不停就直接开麦的话，迟到的示范声
    // 还会盖在孩子跟读上）。
    phaseTimer.current = setTimeout(() => {
      cancelSpeech()
      goListening()
    }, PHASE_TIMEOUT_MS)
  }, [reference, startStt, clearRetry])

  /** 停止录音（重新听示范）：同时作废迟到的示范回调，不让它再开麦 */
  const reset = useCallback(() => {
    runRef.current++
    clearRetry()
    attemptsRef.current = 0
    setRetrying(false)
    setInterim('')
    stopStt()
    setStatus('idle')
    setResult(null)
    setErrorCode(null)
  }, [stopStt, clearRetry])

  /** 孩子自己跳过这一句：只清状态、不记 SRS（不再找家长代答） */
  const skip = reset

  /** 手动取消：停示范音频 + 停录音 + 回到「我来读」，不报错、不记 SRS。
   *  顺序要紧：先 reset 作废运行代次，再停音频 —— 这样 TTS 迟到的 onEnd 也开不了麦 */
  const cancel = useCallback(() => {
    reset()
    cancelSpeech()
  }, [reset])

  // 卸载时清掉自动重听/开麦定时器，并作废迟到的示范回调（不让它给已卸载的卡片开麦）
  useEffect(() => {
    const run = runRef // 只捕获 ref 本身：cleanup 要作废的是「当时的最新代次」
    return () => {
      run.current++
      clearRetry()
    }
  }, [clearRetry])

  return {
    status,
    result,
    errorCode,
    supported,
    /** 正在自动重听（UI 显示「我再听一次…」，不弹降级面板） */
    retrying,
    /** 边说边识别到的中间文字（证明麦克风在听，空串表示还没有） */
    interim,
    /** 识别不可用或终态出错时展示降级提示 */
    degraded: !supported || errorCode != null,
    start,
    reset,
    skip,
    /** 手动取消当前录音 / 示范（⏹ 停一下） */
    cancel,
  }
}
