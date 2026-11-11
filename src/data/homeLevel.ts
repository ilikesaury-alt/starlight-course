// Starlight 首页册次偏好的读写 —— 单独成文件，避免组件文件里导出非组件
// 触发 react-refresh/only-export-components（HMR 会整页刷新）。
//
// 状态放在 localStorage（不放 Zustand）：册次只是「这次打开想看哪本」的视图偏好，
// 不是学习进度，不参与 persist 版本号，也不该混进进度统计。
//
// ⚠️ 首页有**两处**要读它：册次切换条（CourseEntries）和「今日任务」（TodayTasks）。
// 两处必须同步换册，否则会出现「上面切到第一册、下面任务还推预备级」的自相矛盾。
// 所以这里额外提供 subscribe：localStorage 本身没有同页变更通知
// （`storage` 事件只在**别的**标签页触发），得自己在写入时广播。

import type { StarlightLevel } from '@/data/starlightSeries'

export const HOME_LEVEL_KEY = 'starlight-home-level'

export function readHomeLevel(): StarlightLevel {
  try {
    const saved = localStorage.getItem(HOME_LEVEL_KEY)
    if (saved === 'starlight' || saved === 'starlight1') return saved
  } catch {
    // 隐私模式 / localStorage 被禁用：回落预备级，不让首页崩
  }
  return 'starlight'
}

const listeners = new Set<() => void>()

export function writeHomeLevel(level: StarlightLevel): void {
  try {
    localStorage.setItem(HOME_LEVEL_KEY, level)
  } catch {
    // 同上，视图偏好写不进去也不影响使用
  }
  // 写不进去也要通知：本次会话内两处 UI 仍应保持一致。
  for (const fn of listeners) fn()
}

/** 订阅册次变更（同页写入 + 跨标签页 storage 事件都算）。返回取消订阅函数。 */
export function subscribeHomeLevel(onChange: () => void): () => void {
  listeners.add(onChange)
  let onStorage: ((e: StorageEvent) => void) | undefined
  try {
    onStorage = (e: StorageEvent) => {
      if (e.key === HOME_LEVEL_KEY) onChange()
    }
    window.addEventListener('storage', onStorage)
  } catch {
    // 无 window（极端环境）就只靠同页通知
  }
  return () => {
    listeners.delete(onChange)
    if (onStorage) {
      try {
        window.removeEventListener('storage', onStorage)
      } catch {
        // ignore
      }
    }
  }
}
