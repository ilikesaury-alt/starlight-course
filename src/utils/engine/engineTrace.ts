/**
 * 发音链路追踪（诊断用，默认零开销的惰性记录）。
 *
 * 动机：「点了没声音」在兜底链（Kokoro → 有道/百度 → WebSpeech）里极难定位 ——
 * 表面看都是同一个按钮，真实原因可能是模型没就绪 / 有道被自动播放拦截 /
 * 系统没装对应语音包。这里把每次发音请求的**每一级引擎尝试**记下来，
 * 配合 `?debug=audio` 面板一眼看出到底命中了哪一级、为什么前面几级掉了。
 *
 * 设计约束（不能为了诊断给主链路添负担）：
 *   - 未开启诊断（默认）时只保留「最后一次成功」这一条常量级状态，不记事件流；
 *   - 开启后记录最近 MAX_EVENTS 条，环形覆盖，内存有硬上限；
 *   - 纯内存，不写 localStorage、不发网络请求，纯展示用。
 */

import { isWebGPUSupported } from './kokoro'

/**
 * 会话级粘性开关：HashRouter 在 SPA 内跳转时会重写整个 hash，
 * 把 hash 里的 `?debug=audio` 丢掉，导致面板在路由变化后消失。
 * 因此首屏命中一次就粘住整个页面会话（刷新/关标签页即失效，不污染 localStorage）。
 */
let stickyAudioDebug = false
try {
  if (typeof window !== 'undefined') {
    const hashQuery = window.location.hash.split('?')[1]
    const q = hashQuery ? `${window.location.search}&?${hashQuery}` : window.location.search
    if (/[?&]debug=audio(&|$)/.test(q)) stickyAudioDebug = true
  }
} catch {
  /* 初始化失败不影响发音主链路 */
}

export type EngineName = 'kokoro' | 'edge-tts' | 'youdao' | 'baidu' | 'webspeech'

export type EngineStatus = 'success' | 'failed' | 'blocked' | 'aborted' | 'note'

export interface TraceEvent {
  /** 单调递增序号，作为 React key */
  id: number
  /** 事件时间戳（Date.now） */
  at: number
  /** 引擎名 */
  engine: EngineName
  /** 结果：success=出声了；failed=这级没work；blocked=被自动播放策略拦；note=提示信息 */
  status: EngineStatus
  /** 本级耗时（毫秒）；note 事件为 0 */
  ms: number
  /** 被朗读的文本（截断，避免面板过长） */
  text: string
  /** 补充说明（如「系统无 en 语音包」） */
  note?: string
}

/** 最近一次「真正出声」的引擎 —— 没开诊断时也维护（只有一条，零成本） */
export interface LastSuccess {
  engine: EngineName
  text: string
  at: number
}

const MAX_EVENTS = 60
const MAX_TEXT = 24

let events: TraceEvent[] = []
let lastSuccess: LastSuccess | null = null
let seq = 0
const listeners = new Set<() => void>()

/** 诊断开关：URL 带 ?debug=audio（HashRouter 下 hash 里的 query 同样识别），或本地存储 */
export function isAudioDebug(): boolean {
  if (stickyAudioDebug) return true
  if (typeof window === 'undefined') return false
  try {
    // search 本身带前导 '?'，直接与 hash 里的 query 拼起来整体匹配 /[?&]debug=audio/
    const hashQuery = window.location.hash.split('?')[1]
    const q = hashQuery ? `${window.location.search}&?${hashQuery}` : window.location.search
    if (/[?&]debug=audio(&|$)/.test(q)) return true
    return localStorage.getItem('starlight.debug.audio') === '1'
  } catch {
    return false
  }
}

function emit() {
  for (const fn of listeners) {
    try {
      fn()
    } catch {
      /* 订阅者出错不能影响发音主链路 */
    }
  }
}

/**
 * 记录一次引擎尝试结果。
 * @param engine 引擎名
 * @param status 结果
 * @param ms 本级耗时（毫秒）
 * @param text 被朗读的文本
 * @param note 补充说明
 */
export function traceEngine(
  engine: EngineName,
  status: EngineStatus,
  ms: number,
  text = '',
  note?: string,
): void {
  if (status === 'success') {
    lastSuccess = { engine, text: text.slice(0, MAX_TEXT), at: Date.now() }
  }
  if (!isAudioDebug()) {
    // 未开诊断：只留「最后一次成功」，事件流不记（省内存 + 省渲染）
    if (status === 'success') emit()
    return
  }
  seq += 1
  events = [
    ...events,
    { id: seq, at: Date.now(), engine, status, ms: Math.round(ms), text: text.slice(0, MAX_TEXT), note },
  ]
  if (events.length > MAX_EVENTS) events = events.slice(-MAX_EVENTS)
  emit()
}

/** 记录一条纯提示（如「模型加载失败」「系统缺语音包」），不进事件流语义上的尝试 */
export function traceNote(engine: EngineName, note: string, text = ''): void {
  traceEngine(engine, 'note', 0, text, note)
}

/** 最近一次成功出声的引擎（无则 null） */
export function getLastSuccess(): LastSuccess | null {
  return lastSuccess
}

/** 事件流快照（仅诊断开启时有内容） */
export function getTrace(): TraceEvent[] {
  return events
}

/** 订阅变更，返回取消订阅函数 */
export function subscribeTrace(fn: () => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** 清空事件流与最后成功记录 */
export function clearTrace(): void {
  events = []
  lastSuccess = null
  emit()
}

/** 环境快照：面板顶部展示，用于判断「这台机器到底缺什么」 */
export interface AudioEnvSnapshot {
  webgpu: boolean
  kokoroEnabled: boolean
  kokoroReady: boolean
  voiceTotal: number
  voiceEn: number
  voiceZh: number
}

/** 读取环境快照（voices 现场取，避免与 webSpeech 内部状态不同步） */
export function readAudioEnv(kokoro: { enabled: boolean; ready: boolean }): AudioEnvSnapshot {
  let vs: SpeechSynthesisVoice[] = []
  try {
    vs = window.speechSynthesis?.getVoices?.() ?? []
  } catch {
    vs = []
  }
  const count = (p: string) => vs.filter((v) => v.lang?.toLowerCase().startsWith(p)).length
  return {
    webgpu: isWebGPUSupported(),
    kokoroEnabled: kokoro.enabled,
    kokoroReady: kokoro.ready,
    voiceTotal: vs.length,
    voiceEn: count('en'),
    voiceZh: count('zh'),
  }
}
