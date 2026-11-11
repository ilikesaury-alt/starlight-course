// 首页册次偏好的 React 绑定：`const [level, setLevel] = useHomeLevel()`。
//
// 用 useSyncExternalStore 而不是 useState：首页有两处读者（册次切换条 +
// 「今日任务」），任一处写入都要让另一处立刻跟上。localStorage 是同页静默的，
// 靠 data/homeLevel.ts 的订阅广播补上这一环。
//
// 订阅源仍是 localStorage，不进 Zustand —— 册次是视图偏好，不是学习进度，
// 不该参与 persist 版本号，也不该混进进度统计。

import { useSyncExternalStore } from 'react'
import {
  readHomeLevel,
  subscribeHomeLevel,
  writeHomeLevel,
} from '@/data/homeLevel'
import type { StarlightLevel } from '@/data/starlightSeries'

// 服务端快照（本项目无 SSR，仅满足 useSyncExternalStore 的签名要求）
const serverSnapshot = (): StarlightLevel => 'starlight'

export function useHomeLevel(): readonly [StarlightLevel, (level: StarlightLevel) => void] {
  const level = useSyncExternalStore(subscribeHomeLevel, readHomeLevel, serverSnapshot)
  return [level, writeHomeLevel] as const
}
