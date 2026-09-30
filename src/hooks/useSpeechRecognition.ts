// 原生 Web Speech Recognition 封装（Chrome / Edge 桌面版）
// 纯前端、零后端：不支持时用 supported=false 让上层走「孩子自己重试 / 跳过」降级。
// 隐私：语音由浏览器/系统识别服务处理，本仓库不上传音频（FR-C0.1）。
// 终态结果连同引擎给的备选候选一起上交（onResult(text, alternatives)），
// 由上层挑最像原句的那个 —— 自动判定只看第一候选会误判。

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
  /** 识别完成（拿到最终文本 + 引擎备选候选）*/
  onResult?: (text: string, alternatives?: string[]) => void
  /** 识别结束但没说话 */
  onEmpty?: () => void
  /** 出错（含浏览器不支持时的 'unsupported'）*/
  onError?: (code: SttErrorCode) => void
  /** 中间结果（边说边出字），用来给「正在听」做实时反馈 */
  onInterim?: (text: string) => void
}

/** 识别结果里的一条终态文本；索引访问取第 k 个候选 */
interface SttResultItem {
  isFinal: boolean
  length: number
  [k: number]: { transcript?: string } | boolean | number | undefined
}

/** 第 k 个候选的文本（非对象值统一兜成空串） */
function altTranscript(item: SttResultItem, k: number): string {
  const v = item[k]
  return v && typeof v === 'object' ? String(v.transcript ?? '') : ''
}

/** 原生 SpeechRecognition 事件的结构化子集（只取我们用到的字段） */
interface SttResultEvent {
  resultIndex: number
  results: ArrayLike<SttResultItem>
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
  onInterim,
}: Options = {}) {
  const [listening, setListening] = useState(false)
  const supported = isSttSupported()
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  // 会话号：每次 start/stop 递增。旧实例 abort 后迟到的 onend/onerror 只要发现
  // 自己的会话号已过期就直接丢弃 —— 否则会把「我们主动打断」误报成 no-speech，
  // 让新一轮识别刚开麦就被判失败（表现为「始终听不清」）。
  const sessionRef = useRef(0)
  // 回调放 ref：避免因父组件重建回调而重建识别实例
  const cbs = useRef({ onResult, onEmpty, onError, onInterim })
  cbs.current = { onResult, onEmpty, onError, onInterim }

  const stop = useCallback(() => {
    sessionRef.current++
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
    recRef.current = null
    const sid = ++sessionRef.current
    /** 本实例是否仍是「当前会话」：过期实例的回调一律丢弃 */
    const live = () => sid === sessionRef.current

    const rec = new Ctor()
    rec.lang = lang
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 3

    let finalText = ''
    const alts: string[] = []
    rec.onresult = (e: SttResultEvent) => {
      if (!live()) return
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) {
          const first = altTranscript(r, 0)
          finalText += first
          // 引擎常把最贴的那句排到 2/3 位（口音、背景音），一并上交让评分挑最好的
          for (let k = 1; k < r.length; k++) {
            const alt = altTranscript(r, k).trim()
            if (alt && alt !== first && !alts.includes(alt)) alts.push(alt)
          }
        } else {
          interim = altTranscript(r, 0)
        }
      }
      if (interim.trim()) cbs.current.onInterim?.(interim.trim())
    }
    rec.onerror = (e: SttErrorEvent) => {
      if (!live()) return
      const code = String(e?.error ?? 'unknown') as SttErrorCode
      sessionRef.current++ // 关闭本实例：后续 onend 不再回调
      recRef.current = null
      setListening(false)
      cbs.current.onError?.(code)
    }
    rec.onend = () => {
      if (!live()) return
      sessionRef.current++
      recRef.current = null
      setListening(false)
      const text = finalText.trim()
      if (text) cbs.current.onResult?.(text, alts)
      else cbs.current.onEmpty?.()
    }

    recRef.current = rec
    setListening(true)
    try {
      rec.start()
    } catch (err) {
      // 重复 start() 等同步异常同样降级为错误回调，不抛出打断 UI
      console.warn('[STT] start 失败', err)
      sessionRef.current++
      recRef.current = null
      setListening(false)
      cbs.current.onError?.('unknown')
    }
  }, [lang])

  useEffect(() => stop, [stop])

  return { supported, listening, start, stop }
}
