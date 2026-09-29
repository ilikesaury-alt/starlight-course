// 逐句跟读编排：TTS 播原句 → 麦克风识别 → 相似度评分 → 达标记 SRS。
// 识别不可用 / 离线 / 无麦克风时走 confirmByParent()「家长确认」降级，流程不中断。

import { useCallback, useState } from 'react'
import { speakText } from '@/utils/speak'
import { useSpeechRecognition, type SttErrorCode } from './useSpeechRecognition'
import { scoreSentence, type SimilarityResult } from '@/utils/similarity'

export type ReaderStatus = 'idle' | 'playing' | 'listening' | 'scored'

export interface Scored extends SimilarityResult {
  /** 是否达标（score >= threshold）*/
  passed: boolean
  /** 孩子实际说出的内容（家长确认时为空） */
  heard: string
  /** 家长确认通过（跳过识别）*/
  byParent: boolean
}

interface Options {
  /** 原句 */
  reference: string
  /** 达标回调：true=达标 */
  onPass?: (ok: boolean) => void
  /** 达标阈值 */
  threshold?: number
}

export function useSentenceReader({ reference, onPass, threshold = 0.6 }: Options) {
  const [status, setStatus] = useState<ReaderStatus>('idle')
  const [result, setResult] = useState<Scored | null>(null)
  const [errorCode, setErrorCode] = useState<SttErrorCode | null>(null)

  const finish = useCallback(
    (r: Scored, passed: boolean) => {
      setResult(r)
      setStatus('scored')
      onPass?.(passed)
    },
    [onPass]
  )

  const stt = useSpeechRecognition({
    lang: 'en-US',
    onResult: (text) => {
      const scored = scoreSentence(reference, text, { threshold })
      finish({ ...scored, heard: text, byParent: false }, scored.passed)
    },
    onEmpty: () => setErrorCode('no-speech'),
    onError: (code) => setErrorCode(code),
  })
  // 取出稳定的 start/stop：依赖整个 stt 对象会让下游 useCallback 每次渲染都变，
  // 进而让「换句重置」等 effect 反复触发。
  const { start: startStt, stop: stopStt, supported } = stt

  /** 先播原句示范，再进入录音 */
  const start = useCallback(() => {
    setResult(null)
    setErrorCode(null)
    setStatus('playing')
    let settled = false
    const goListening = () => {
      if (settled) return
      settled = true
      setStatus('listening')
      startStt()
    }
    // TTS 播完（或播失败）后再开麦；兜底 1.8s 防止引擎未回调 onEnd 卡在 playing
    speakText(reference, { onEnd: goListening })
    setTimeout(goListening, 1800)
  }, [reference, startStt])

  /** 停止录音（重新听示范）*/
  const reset = useCallback(() => {
    stopStt()
    setStatus('idle')
    setResult(null)
    setErrorCode(null)
  }, [stopStt])

  /** 降级路径：家长确认孩子读对了，直接记对 */
  const confirmByParent = useCallback(() => {
    stopStt()
    finish({ score: 1, missing: [], extra: [], passed: true, heard: '', byParent: true }, true)
  }, [finish, stopStt])

  return {
    status,
    result,
    errorCode,
    supported,
    /** 识别不可用或出错时展示降级提示 */
    degraded: !supported || errorCode != null,
    start,
    reset,
    confirmByParent,
  }
}
