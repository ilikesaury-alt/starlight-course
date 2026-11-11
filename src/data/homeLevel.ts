// Starlight 首页册次偏好的读写 —— 单独成文件，避免组件文件里导出非组件
// 触发 react-refresh/only-export-components（HMR 会整页刷新）。
//
// 状态放在 localStorage（不放 Zustand）：册次只是「这次打开想看哪本」的视图偏好，
// 不是学习进度，不参与 persist 版本号，也不该混进进度统计。

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

export function writeHomeLevel(level: StarlightLevel): void {
  try {
    localStorage.setItem(HOME_LEVEL_KEY, level)
  } catch {
    // 同上，视图偏好写不进去也不影响使用
  }
}
