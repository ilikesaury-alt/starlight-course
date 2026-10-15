// 全局「记忆状态着色」开关：SRS 三色（熟=绿 / 模糊=黄 / 未知=灰）是否给单词上色。
//
// 为什么默认关：Lute v3（本品类事实标准）把「按词状态高亮」做成**默认开但可一键关**
// （设置项 + 阅读中热键 h），而我们把三色底常驻在每个词上，导致一句英文被渲染成
// 一串彩色方块，孩子看不出「这是一句话」——这是阅读体验烂的最大单点成因。
// 现在默认关（句子干净），需要的家长/孩子点「🧠 记忆状态」打开。
//
// 与慢速开关一样：纯内存态、不持久化，刷新回到默认（关）。

import { useSyncExternalStore } from 'react'

let on = false
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export function getMemoryState(): boolean {
  return on
}

export function setMemoryState(v: boolean): void {
  if (v === on) return
  on = v
  emit()
}

/** 切换并返回切换后的值（供按钮直接渲染文案） */
export function toggleMemoryState(): boolean {
  setMemoryState(!on)
  return on
}

function subscribe(l: () => void): () => void {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

/** React 绑定：任意组件都能读到当前开关。 */
export function useMemoryState(): boolean {
  return useSyncExternalStore(subscribe, getMemoryState, getMemoryState)
}
