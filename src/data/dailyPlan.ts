// 每日计划（P1「每日节律」的判据层）。
//
// 产品口径（2026-11-16 Lichun 定，方案 C **混合封顶**）：
//   今日任务 = min(到期复习卡数, 上限) + 1 节新课 + 1 篇阅读
//
// 为什么是混合封顶，而不是「固定条数」或「完全跟 SRS 浮动」：
// - 固定条数（每天 3 件）在 SRS 到期 40 张的那天严重失真 —— 「复习」这一件事
//   就被压成 1 行，孩子以为做一下就算完了。
// - 完全跟 SRS 浮动会在到期 40 张那天给出一个做不完的清单 ——
//   孩子看到「今天 40 个单词」会直接放弃，这是最糟的结果。
// - 封顶取中间：**够得着**（看得见终点）又**不失真**（做不完的部分如实说明
//   「还有 N 个没排进今天」，而不是假装不存在）。
//
// ⚠️ 本模块**只做纯计算**，不碰 store、不碰 React、不碰 DOM：
// 阈值与配额是产品判断的核心，必须能被单测直接钉住。

import { dayStamp } from './srs'

/**
 * 每日复习卡上限。
 *
 * 40 张 ≈ 6~9 岁孩子 5~8 分钟的专注量（实测一份单卡约 8~12 秒）。
 * 超过这个量，正确率会明显下滑、情绪也会崩 —— 所以宁可在 40 截断，
 * 把「还有多少没排进今天」如实告诉孩子，也不给一个做不完的清单。
 */
export const DAILY_REVIEW_CAP = 40

/** 今日计划的三段配额 */
export interface DailyQuota {
  /** 实际排进今天的复习卡数 = min(到期, 上限) */
  reviewCount: number
  /** 到期总数（可能大于 reviewCount） */
  reviewDue: number
  /** 因超过上限而没排进今天的数量 */
  reviewOverflow: number
  /** 今天排了几节新课（0 或 1） */
  lessonCount: number
  /** 今天排了几篇阅读（0 或 1） */
  readingCount: number
}

/** 算今天的复习配额（纯函数） */
export function reviewQuota(due: number, cap: number = DAILY_REVIEW_CAP): {
  reviewCount: number
  reviewDue: number
  reviewOverflow: number
} {
  const safeDue = Number.isFinite(due) && due > 0 ? Math.floor(due) : 0
  const safeCap = Number.isFinite(cap) && cap > 0 ? Math.floor(cap) : 0
  const reviewCount = Math.min(safeDue, safeCap)
  return {
    reviewCount,
    reviewDue: safeDue,
    reviewOverflow: Math.max(0, safeDue - reviewCount),
  }
}

/** 组装今日完整配额 */
export function dailyQuota(args: {
  reviewDue: number
  hasLesson?: boolean
  hasReading?: boolean
  cap?: number
}): DailyQuota {
  const q = reviewQuota(args.reviewDue, args.cap)
  return {
    ...q,
    lessonCount: args.hasLesson === false ? 0 : 1,
    readingCount: args.hasReading === false ? 0 : 1,
  }
}

// ---- 「今天做完了」的判定 ----
//
// 三种任务的「完成」证据来源不同，必须分别算，不能混成一个布尔：
//   ① 复习：今天真的复习过（SRS 卡的 lastReview === 今天）
//   ② 新课：今天完成了一节课（store.todayLessons 里记着今天的日期）
//   ③ 阅读：今天读过一篇（同上）
//
// ⚠️ 「今天」必须用 dayStamp（本地日历日 → UTC 天戳），与 SRS 的到期判定同源。
// 换成 Date.now() 相减会在跨零点、时区、夏令时上出错。

export interface DailyProgress {
  /** 今天复习过的卡片数 */
  reviewedToday: number
  /** 今天到期的卡片总数（用于显示进度 x/y） */
  reviewDue: number
  /** 复习是否达标：到期的都复习了，或达到今日上限 */
  reviewDone: boolean
  /** 今天完成了新课吗 */
  lessonDone: boolean
  /** 今天读了阅读吗 */
  readingDone: boolean
  /** 三项是否全部完成 */
  allDone: boolean
}

/**
 * 判定今日进度。
 *
 * @param reviewedToday 今天复习过的卡片数（由调用方从 SRS 卡片的 lastReview 数出来）
 * @param reviewDue     今天到期总数
 * @param cap           每日复习上限
 */
export function dailyProgress(args: {
  reviewedToday: number
  reviewDue: number
  lessonDone: boolean
  readingDone: boolean
  cap?: number
}): DailyProgress {
  const cap = args.cap ?? DAILY_REVIEW_CAP
  const reviewed = Math.max(0, Math.floor(args.reviewedToday || 0))
  const due = Math.max(0, Math.floor(args.reviewDue || 0))
  const target = Math.min(due, cap)

  // 复习达标的口径：**做满今天排的量**即可，不要求清空全部到期。
  // 到期 100 张而今天只排 40 张时，做完 40 就是「今天完成了」——
  // 否则孩子永远看不到完成态，封顶也就失去了意义。
  const reviewDone = reviewed >= target

  return {
    reviewedToday: reviewed,
    reviewDue: due,
    reviewDone,
    lessonDone: args.lessonDone,
    readingDone: args.readingDone,
    allDone: reviewDone && args.lessonDone && args.readingDone,
  }
}

/** 某条日期戳是不是今天（本地日历日口径） */
export function isToday(stamp: number | undefined, today: number = dayStamp()): boolean {
  return typeof stamp === 'number' && stamp === today
}

/**
 * 数出「今天复习过几张卡」。
 *
 * 为什么用 `lastReview === 今天` 而不是新加一个计数器：
 * SRS 卡片本来就带 `lastReview`（每次 recordReview 都会写），
 * 它就是「今天复习过」的权威证据 —— 再存一份计数反而会有两套口径打架的风险
 * （计数器漏加一次，进度就永久偏了；而 lastReview 是卡片的本职字段）。
 *
 * ⚠️ 传入的 cards 只需有 lastReview 字段（便于单测传轻量对象）。
 */
export function countReviewedToday(
  cards: Iterable<{ lastReview?: number }>,
  today: number = dayStamp()
): number {
  let n = 0
  for (const c of cards) {
    if (c.lastReview === today) n += 1
  }
  return n
}
