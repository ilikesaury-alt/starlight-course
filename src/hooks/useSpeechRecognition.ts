// 原生 Web Speech Recognition 封装（Chrome / Edge 桌面版）
// 纯前端、零后端：不支持时用 supported=false 让上层走「家长确认」降级。
// 隐私：语音由浏览器/系统识别服务处理，本仓库不上传音频（FR-C0.1）。

import { useCallback, useEffect, useRef, useState } from 'react'

export type SttErrorCode =
  | 'no-speech'
  | 'not-allowed'
  | 'network'
  | 'audio-capture'
  | 'aborted'
  | 'unknown'

interface Options {
  lang?: string
  /** 识别完成（拿到最终文本）*/
  onResult?: (text: string) => void
  /** 识别结束但没说话 */
  onEmpty?: () => void
  /** 出错（含浏览器不支持时的 'unsupported'）*/
  onError?: (code: SttErrorCode) => void
}

/** 原生 SpeechRecognition 事件的结构化子集（只取我们用到的字段） */
interface SttResultEvent {
  resultIndex: number
  results: ArrayLike<{
    isFinal: boolean
    0?: { transcript?: string }
  }>
}
interface SttErrorEvent {
  error?: string
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: SttResultEvent) => void) | null
  onerror: ((e: SttErrorEvent) => void) | null
  onend: (() => void) | null
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | undefined {
  if (typeof window === 'undefined') return undefined
  // SAFETY: 浏览器把 SpeechRecognition 挂在 window 的厂商前缀位置上，
  // TS lib 不声明这两个属性，只能在此处断言；字段类型与上面
  // SpeechRecognitionLike 对齐，真实对象行为由浏览器保证。
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

/** 环境是否具备语音识别能力（Chrome / Edge 有，Firefox 无） */
export function isSttSupported(): boolean {
  return getRecognitionCtor() != null
}

/** abort() 在部分浏览器会抛（实例已结束 / 权限未授予），这里统一吞掉并留日志 */
function abortQuietly(rec: SpeechRecognitionLike | null): void {
  if (!rec) return
  try {
    rec.abort()
  } catch (err) {
    console.warn('[STT] abort 失败（实例已结束或权限未授予）', err)
  }
}

/**
 * 单次（continuous=false）识别：start() → 结果/错误/结束 三种终态各回调一次。
 * 组件卸载时自动 abort()，避免切页后麦克风还在跑。
 */
export function useSpeechRecognition({
  lang = 'en-US',
  onResult,
  onEmpty,
  onError,
}: Options = {}) {
  const [listening, setListening] = useState(false)
  const supported = isSttSupported()
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  const doneRef = useRef(false)
  // 回调放 ref：避免因父组件重建回调而重建识别实例
  const cbs = useRef({ onResult, onEmpty, onError })
  cbs.current = { onResult, onEmpty, onError }

  const stop = useCallback(() => {
    abortQuietly(recRef.current)
    recRef.current = null
    setListening(false)
  }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) {
      cbs.current.onError?.('unknown')
      return
    }
    abortQuietly(recRef.current)
    const rec = new Ctor()
    rec.lang = lang
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 3
    doneRef.current = false

    let finalText = ''
    rec.onresult = (e: SttResultEvent) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalText += String(r[0]?.transcript ?? '')
      }
    }
    rec.onerror = (e: SttErrorEvent) => {
      if (doneRef.current) return
      doneRef.current = true
      const code = String(e?.error ?? 'unknown') as SttErrorCode
      cbs.current.onError?.(code)
      stop()
    }
    rec.onend = () => {
      if (doneRef.current) return
      doneRef.current = true
      const text = finalText.trim()
      if (text) cbs.current.onResult?.(text)
      else cbs.current.onEmpty?.()
      stop()
    }

    recRef.current = rec
    setListening(true)
    try {
      rec.start()
    } catch (err) {
      // 重复 start() 等同步异常同样降级为错误回调，不抛出打断 UI
      console.warn('[STT] start 失败', err)
      doneRef.current = true
      cbs.current.onError?.('unknown')
      stop()
    }
  }, [lang, stop])

  useEffect(() => stop, [stop])

  return { supported, listening, start, stop }
}
