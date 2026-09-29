// FSRS 内核（ts-fsrs）：替代 Leitner 盒式调度。
// 存储仍以 dayStamp 为单位（本地日历日），调用边界与 Date 互转。
// Leitner → FSRS 的字段估算走 migrateFromLeitner，旧进度不丢。

import { fsrs, generatorParameters, Rating, State, createEmptyCard } from 'ts-fsrs'
import type { Card } from 'ts-fsrs'

/**
 * Leitner 盒号对应的复习间隔（天）。在此定义（而非从 srs.ts 导入）以避免
 * srs.ts ↔ fsrsScheduler.ts 的循环依赖；srs.ts 再从此处转出该常量。
 */
export const BOX_INTERVALS = [0, 1, 2, 4, 7, 14, 30] as const

/** 调度器：目标记忆保持率 0.9，最长间隔 100 年（儿童课程够用），关掉随机抖动（可复现） */
export const scheduler = fsrs(
  generatorParameters({
    request_retention: 0.9,
    maximum_interval: 36500,
    enable_fuzz: false,
  })
)

/** Leitner 盒号 → 估算记忆稳定度（天）。新卡/生词从半天稳起步，逐盒递增。 */
export const BOX_STABILITY = [0, 0.5, 1, 2.5, 5, 8, 14, 30] as const

export type SrsState = 'New' | 'Learning' | 'Review' | 'Relearning'

/** FSRS 卡片（字段名沿用 ts-fsrs 的 Card） */
export interface FsrsCard {
  /** 到期日（dayStamp） */
  due: number
  /** 记忆稳定度（天） */
  stability: number
  /** 难度 1..10 */
  difficulty: number
  /** 距上次复习的天数 */
  elapsed_days: number
  /** 本次调度间隔（天） */
  scheduled_days: number
  /** 复习次数 */
  reps: number
  /** 遗忘次数 */
  lapses: number
  /** 学习/重学步进位置 */
  learning_steps: number
  /** 状态 0=New 1=Learning 2=Review 3=Relearning */
  state: number
  /** 上次复习日（dayStamp，0 = 从未复习） */
  lastReview: number
}

/** dayStamp → Date（正午 12:00，避开时区/夏令时切日） */
export function toDate(dayStamp: number): Date {
  return new Date(dayStamp * 86_400_000 + 43_200_000)
}

/** Date → dayStamp */
export function toDayStamp(d: Date): number {
  return Math.floor(d.getTime() / 86_400_000)
}

/** 新卡：立即到期（今天） */
export function createFsrsCard(today: number): FsrsCard {
  const c: Card = createEmptyCard(toDate(today))
  return fromCard(c, today)
}

function fromCard(c: Card, today: number): FsrsCard {
  return {
    due: toDayStamp(c.due),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    reps: c.reps,
    lapses: c.lapses,
    learning_steps: c.learning_steps,
    state: c.state,
    lastReview: c.last_review ? toDayStamp(c.last_review) : today,
  }
}

function toCard(c: FsrsCard): Card {
  return {
    due: toDate(c.due),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    reps: c.reps,
    lapses: c.lapses,
    learning_steps: c.learning_steps,
    state: c.state as Card['state'],
    last_review: toDate(c.lastReview),
  }
}

/**
 * 记一次复习结果：答对=Good，答错=Again。
 * 答错回到当天到期（步进是分钟级，折算到 dayStamp 后即今天）。
 */
export function gradeFsrsCard(card: FsrsCard, correct: boolean, today: number): FsrsCard {
  const now = toDate(today)
  const res = scheduler.next(toCard(card), now, correct ? Rating.Good : Rating.Again)
  const next = fromCard(res.card, today)
  // 学习步进内的分钟级 due 折算回当天：确保「没达标当天再练」
  if (!correct) next.due = today
  return next
}

/**
 * Leitner → FSRS 迁移：按盒号估稳定度，due 直接沿用旧 nextReview（进度不丢）。
 */
export function migrateFromLeitner(
  box: number,
  nextReview: number,
  lapses0 = 0
): FsrsCard {
  const b = clampBox(box)
  const stability = BOX_STABILITY[b]
  const interval = BOX_INTERVALS[b]
  const reps = Math.max(1, b + 1)
  return {
    due: nextReview,
    stability,
    // 盒号越低＝记得越差 → 难度越高
    difficulty: Math.max(1, Math.min(10, 10 - b)),
    elapsed_days: interval,
    scheduled_days: interval,
    reps,
    lapses: lapses0,
    learning_steps: 0,
    state: b === 0 ? State.Learning : State.Review,
    lastReview: Math.max(0, nextReview - interval),
  }
}

/**
 * 盒号钳制到旧 UI 的合法范围 0..MAX_BOX。
 * BOX_STABILITY 比 BOX_INTERVALS 多一档（多出 30 天那档），但 UI 只有 7 档标签，
 * 因此稳定度反推时必须钳制，否则 boxLabel/boxEmoji 会落到越界分支。
 */
export const MAX_BOX = BOX_INTERVALS.length - 1

export function clampBox(box: number): number {
  return Math.max(0, Math.min(Math.round(box), MAX_BOX))
}

/** 由 FSRS 状态+稳定度反推 Leitner 盒号（供旧 UI 的 boxLabel / boxEmoji / 着色沿用） */
export function deriveBox(card: FsrsCard): number {
  if (card.state === State.New) return 0
  if (card.state === State.Learning || card.state === State.Relearning) {
    // 学习阶段：稳定度超过 1 天就算跨过一盒
    return card.stability >= 1 ? 1 : 0
  }
  // Review：取第一个 ≥ 该稳定度的盒子（BOX_STABILITY 单调递增），再钳制到合法范围
  for (let b = BOX_STABILITY.length - 1; b >= 1; b--) {
    if (card.stability >= BOX_STABILITY[b]) return clampBox(b)
  }
  return 1
}

/** 状态可读标签 */
export function stateLabel(card: FsrsCard): SrsState {
  const map: Record<number, SrsState> = {
    [State.New]: 'New',
    [State.Learning]: 'Learning',
    [State.Review]: 'Review',
    [State.Relearning]: 'Relearning',
  }
  return map[card.state] ?? 'New'
}
