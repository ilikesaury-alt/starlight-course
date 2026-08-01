/**
 * 全局唯一发声者 + 安全定时器 —— 所有发音入口的统一控制。
 *
 * 动机：项目里既有标准 <SpeakButton>，也有自定义「点词朗读」按钮（fc-word）和
 * 页面自动朗读（useEffect）。它们以前各自独立管理动画状态，互不协调，导致：
 *   - 多个按钮的 ⏸ 动画同时卡住（关掉一个，另一个还在播）；
 *   - 自动朗读抢占了 currentAudio，干扰手动按钮的动画闭合。
 *
 * 本模块把所有发音入口收敛到同一套逻辑：
 *   1. 全局唯一发声者：任意按钮开始发音时，强制结束上一个仍在播放的动画 + 音频；
 *   2. 每个按钮自带硬安全定时器（中文 12s / 英文 18s），无论如何超时必复位，
 *      杜绝动画永久停在「播放中」；
 *   3. stopSelf 同时 cancelSpeech() 停掉可能仍在播放的音频。
 *
 * 由于 done()/onEnd 只复位「本按钮自身」（闭包隔离，不会误伤别的按钮），
 * 因此去掉代次守卫是安全的——见 speak.ts 的成功路径。
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { speakText, cancelSpeech } from './speak'

// ---------- 全局唯一发声者注册表 ----------
type StopFn = () => void
let activeStop: StopFn | null = null

/** 开始一个新的发声者：强制结束上一个仍在播放的（动画 + 音频）。 */
export function stopOtherSpeakers(self: StopFn) {
  if (activeStop && activeStop !== self) {
    try {
      activeStop()
    } catch {
      /* ignore */
    }
  }
  activeStop = self
}

/** 当前发声者结束/卸载时，清空全局引用（仅当仍是自己）。 */
export function clearSpeaker(self: StopFn) {
  if (activeStop === self) activeStop = null
}

// ---------- 发音动画 hook ----------
export interface UseAnimatedSpeakOptions {
  slow?: boolean
  lang?: 'en' | 'zh'
}

/**
 * 统一的「带动画发音」hook：返回 { playing, speak }。
 * - playing：是否正在播放（用于 ⏸/🔊 切换）；
 * - speak：点击时调用，会自动强制结束上一个发声者、挂安全定时器；
 * 适用于 SpeakButton 与自定义 fc-word 等任何播放入口。
 */
export function useAnimatedSpeak(
  text: string,
  opts: UseAnimatedSpeakOptions = {}
) {
  const [playing, setPlaying] = useState(false)
  const activeRef = useRef(false)
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMounted = useRef(true)
  // 本按钮的「强制停止」函数引用，供其它按钮在点击时调用，从而即时复位旧动画
  const stopSelfRef = useRef<() => void>(() => {})

  const clearSafety = () => {
    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current)
      safetyTimer.current = null
    }
  }

  // 强制结束本按钮：复位动画、停掉可能仍在播放的音频、清空全局引用
  const stopSelf = useCallback(() => {
    clearSafety()
    activeRef.current = false
    setPlaying(false)
    clearSpeaker(stopSelfRef.current)
    // 停止本按钮可能仍在播放的音频（全局唯一发声者，避免旧音频与新音频叠加）
    cancelSpeech()
  }, [])

  // 仅复位本按钮动画（绝不取消音频）：专供「安全网超时」使用。
  // 长段落/全文朗读远超 12~18s，若超时贸然 cancelSpeech 会把正在播放的音频掐断，
  // 表现为「播到一半停」（如中文长段落播到『有汉族的』附近被 12s 上限腰斩）。
  // 故这里只把 ⏸ 复位成 🔊；保留全局发声者引用，以便用户下一次点击仍能 cancel 掉
  // 这段可能仍在播放的音频，避免与新音频叠加出声。
  const resetSelfAnim = useCallback(() => {
    clearSafety()
    activeRef.current = false
    setPlaying(false)
  }, [])

  // 注册 / 注销本按钮的强制停止函数
  useEffect(() => {
    isMounted.current = true
    stopSelfRef.current = stopSelf
    return () => {
      isMounted.current = false
      clearSpeaker(stopSelfRef.current)
    }
  }, [stopSelf])

  const speak = useCallback(() => {
    // 强制结束上一个发声者（全局唯一），让旧按钮的 ⏸ 立刻变回 🔊
    stopOtherSpeakers(stopSelfRef.current)

    activeRef.current = true
    setPlaying(true)
    speakText(text, {
      slow: opts.slow,
      lang: opts.lang,
      onStart: () => {
        activeRef.current = true
        setPlaying(true)
      },
      onEnd: () => {
        clearSafety()
        activeRef.current = false
        setPlaying(false)
        clearSpeaker(stopSelfRef.current)
      },
    })
    // 安全网：极长朗读（段落/全文）可能远超 12~18s，硬超时若贸然 cancelSpeech
    // 会把正在播放的长音频掐断（表现为「播到一半停」）；故超时只复位按钮动画
    // （resetSelfAnim，不取消音频）。超时上限按文本长度估算，保证正常长朗读期间
    // 不会误触发，仅作极端兜底——真正卡死时靠用户下一次点击 stopSelf 取消音频。
    clearSafety()
    const estMs = text.length * (opts.slow ? 900 : 550)
    const capMs = Math.max(opts.lang === 'zh' ? 12000 : 18000, estMs + 6000)
    safetyTimer.current = setTimeout(() => {
      if (isMounted.current) resetSelfAnim()
    }, capMs)
  }, [text, opts.slow, opts.lang, stopSelf])

  // 离开页面 / 组件卸载时，若本按钮正在发声则立即停止，避免语音残留。
  useEffect(
    () => () => {
      clearSafety()
      clearSpeaker(stopSelfRef.current)
      if (activeRef.current) cancelSpeech()
    },
    []
  )

  return { playing, speak }
}
