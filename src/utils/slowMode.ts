// 全局「慢速朗读」开关：全区共用一个开关，替代「每句/每词一个慢速按钮」。
//
// 设计依据见 docs/lesson-detail-ui-research.md §2.2 —— TouchRead.js 的设计原则 1：
//   「Same text, same pronunciation profile」句级朗读与词级朗读必须共用同一套
//   voice / rate / pitch，不要让孩子在「正常 🔊」和「慢速 🐢🔊」两个同形按钮之间猜。
// 原实现在重点句型每句 2 个喇叭、外教对话每轮 2 个，一个 Tab 里 37 个发音按钮，
// 真正该点的「点词听发音」被同形按钮包围，误触率极高。
//
// 纯内存态、不持久化：刷新/换设备回到正常速度，避免家长忘记关着慢速。

import { useSyncExternalStore } from 'react'

let slow = false
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export function getSlowMode(): boolean {
  return slow
}

export function setSlowMode(v: boolean): void {
  if (v === slow) return
  slow = v
  emit()
}

/** 切换并返回切换后的值（供按钮直接渲染文案） */
export function toggleSlowMode(): boolean {
  setSlowMode(!slow)
  return slow
}

function subscribe(l: () => void): () => void {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

/**
 * React 绑定：任意组件都能读到当前慢速开关。
 * 句级朗读（ReadingZone / 气泡）与词级点读（TappableWords）共用这一个值，
 * 保证「同一句话，点词听和整句听的语速一致」。
 */
export function useSlowMode(): boolean {
  return useSyncExternalStore(subscribe, getSlowMode, getSlowMode)
}
