// 数学专项 · 错题的本地读写 —— 单独成文件，避免组件文件里导出非组件
// 触发 react-refresh/only-export-components（HMR 会整页刷新）。
//
// 和 homeLevel.ts 同一套模式：localStorage（不放 Zustand），不参与 persist
// 版本号，写时同页广播（storage 事件只在别的标签页触发）。
// 只记「最近一次做错」的快照：键 = 题目的稳定 id，重复做错覆盖、不累积。

import type { CalcCause } from '@/data/mathPractice'

export const MATH_WRONG_KEY = 'starlight-math-wrong'

export interface MathWrongItem {
  id: string
  /** 题干（计算题是算式，读题圈关键词题是完整题干） */
  stem: string
  /** 用户答案 */
  given: string
  /** 正确答案 */
  answer: string
  /** 错因（读题题记为 'reading'） */
  cause: CalcCause | 'reading'
  /** 记录时间 */
  at: number
}

export function readMathWrong(): MathWrongItem[] {
  try {
    const raw = localStorage.getItem(MATH_WRONG_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as MathWrongItem[]) : []
  } catch {
    // 隐私模式 / 数据损坏：当空，不让页面崩
    return []
  }
}

const listeners = new Set<() => void>()

// useSyncExternalStore 的 getSnapshot 必须返回**稳定引用**：每次现读 localStorage
// 会 new 一个新数组，React 18 会判定快照一直在变 → 无限重渲染。
// 因此这里缓存一份，只有写入 / 跨标签页 storage 事件才换引用。
let snapshot: MathWrongItem[] | null = null

function snapshotRef(): MathWrongItem[] {
  if (snapshot === null) snapshot = readMathWrong()
  return snapshot
}

/** 给 useSyncExternalStore 用的稳定快照。 */
export function getMathWrongSnapshot(): MathWrongItem[] {
  return snapshotRef()
}

/** 合并写入：同 id 覆盖（保留最近一次），最多留 100 条，按时间倒序。 */
export function writeMathWrong(items: MathWrongItem[]): void {
  const next = items
    .slice()
    .sort((a, b) => b.at - a.at)
    .slice(0, 100)
  snapshot = next
  try {
    localStorage.setItem(MATH_WRONG_KEY, JSON.stringify(next))
  } catch {
    // 写不进去也不影响本次会话的显示
  }
  for (const fn of listeners) fn()
}

/** 记录一条错题（同 id 覆盖）。 */
export function recordMathWrong(item: MathWrongItem): void {
  const existing = readMathWrong().filter((w) => w.id !== item.id)
  writeMathWrong([item, ...existing])
}

/** 清空错题。 */
export function clearMathWrong(): void {
  writeMathWrong([])
}

/** 订阅错题变更（同页写入 + 跨标签页 storage 事件都算）。返回取消订阅函数。 */
export function subscribeMathWrong(onChange: () => void): () => void {
  listeners.add(onChange)
  let onStorage: ((e: StorageEvent) => void) | undefined
  try {
    onStorage = (e: StorageEvent) => {
      if (e.key === MATH_WRONG_KEY) {
        // 别的标签页改了数据：丢弃缓存，下次 getSnapshot 重读
        snapshot = null
        onChange()
      }
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
