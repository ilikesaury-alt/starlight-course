// 「孩子 / 家长模式」的 React 绑定：`const [mode, setMode] = useViewMode()`。
//
// 与 useHomeLevel 同构：用 useSyncExternalStore 而不是 useState ——
// 顶栏的模式开关、进度页的家长区块、孩子页面的条件渲染都读同一个来源，
// 任一处写入都要让其余立刻跟上（localStorage 同页静默，靠 viewMode.ts 的广播补上）。

import { useSyncExternalStore } from 'react'
import { readViewMode, subscribeViewMode, writeViewMode, type ViewMode } from '@/data/viewMode'

// 服务端快照（本项目无 SSR，仅满足 useSyncExternalStore 的签名要求）。
// 与 readViewMode 的默认值保持一致：孩子模式。
const serverSnapshot = (): ViewMode => 'kid'

export function useViewMode(): readonly [ViewMode, (mode: ViewMode) => void] {
  const mode = useSyncExternalStore(subscribeViewMode, readViewMode, serverSnapshot)
  return [mode, writeViewMode] as const
}

/** 只读便捷版：绝大多数地方只需要「现在是谁在看」 */
export function useIsParent(): boolean {
  return useViewMode()[0] === 'parent'
}