// @vitest-environment jsdom
// 每日计划（方案 C：混合封顶）的配额与完成判据测试
//
// 这里是产品判断的核心，所以钉得细：
//   · 上限必须是「够得着」而不是「做得完全部」
//   · 做满今天的量就算完成（不能要求清空全部到期）
//   · 超出的部分要如实报出来，不能假装不存在

import { describe, it, expect } from 'vitest'
import { dayStamp } from './srs'
import {
  DAILY_REVIEW_CAP,
  countReviewedToday,
  dailyProgress,
  dailyQuota,
  isToday,
  reviewQuota,
} from './dailyPlan'

describe('reviewQuota —— 混合封顶的核心', () => {
  it('到期少于上限：全部排进今天，无溢出', () => {
    const q = reviewQuota(12, 40)
    expect(q.reviewCount).toBe(12)
    expect(q.reviewDue).toBe(12)
    expect(q.reviewOverflow).toBe(0)
  })

  it('到期超过上限：截断到上限，并如实报出溢出', () => {
    const q = reviewQuota(100, 40)
    expect(q.reviewCount).toBe(40)
    expect(q.reviewDue).toBe(100)
    expect(q.reviewOverflow).toBe(60)
  })

  it('刚好等于上限：不溢出不截断', () => {
    const q = reviewQuota(40, 40)
    expect(q.reviewCount).toBe(40)
    expect(q.reviewOverflow).toBe(0)
  })

  it('没有到期：全 0', () => {
    const q = reviewQuota(0, 40)
    expect(q.reviewCount).toBe(0)
    expect(q.reviewDue).toBe(0)
  })

  it('非法输入收敛到 0（不产生 NaN —— NaN 会让比较永远 false 且成为脏数据）', () => {
    expect(reviewQuota(NaN, 40).reviewCount).toBe(0)
    expect(reviewQuota(-5, 40).reviewCount).toBe(0)
    expect(reviewQuota(10, NaN).reviewCount).toBe(0)
    expect(Number.isNaN(reviewQuota(NaN, 40).reviewCount)).toBe(false)
  })

  it('默认上限是 40（6~9 岁 5~8 分钟的专注量）', () => {
    expect(DAILY_REVIEW_CAP).toBe(40)
    expect(reviewQuota(999).reviewCount).toBe(40)
  })
})

describe('dailyQuota —— 三项配额的组合', () => {
  it('默认各排 1 节新课 + 1 篇阅读', () => {
    const q = dailyQuota({ reviewDue: 10 })
    expect(q.reviewCount).toBe(10)
    expect(q.lessonCount).toBe(1)
    expect(q.readingCount).toBe(1)
  })

  it('新课学完时可以没有新课（不算失败）', () => {
    const q = dailyQuota({ reviewDue: 10, hasLesson: false })
    expect(q.lessonCount).toBe(0)
  })
})

describe('dailyProgress —— 完成判据', () => {
  const base = { reviewedToday: 0, reviewDue: 0, lessonDone: false, readingDone: false }

  it('三件事都做了才算全部完成', () => {
    expect(dailyProgress({ ...base }).allDone).toBe(false)
    expect(
      dailyProgress({ reviewedToday: 5, reviewDue: 5, lessonDone: true, readingDone: true }).allDone
    ).toBe(true)
  })

  it('做满今天排的量就算复习完成（不要求清空全部到期）', () => {
    // 到期 100，上限 40 → 做完 40 就是完成
    const p = dailyProgress({
      reviewedToday: 40,
      reviewDue: 100,
      lessonDone: true,
      readingDone: true,
    })
    expect(p.reviewDone).toBe(true)
    expect(p.allDone).toBe(true)
  })

  it('到期 100 只做 39：还没完成（差一张就是差一张）', () => {
    const p = dailyProgress({
      reviewedToday: 39,
      reviewDue: 100,
      lessonDone: true,
      readingDone: true,
    })
    expect(p.reviewDone).toBe(false)
    expect(p.allDone).toBe(false)
  })

  it('没有到期卡时，复习项自动算完成（无事可做 = 做完）', () => {
    const p = dailyProgress({ reviewedToday: 0, reviewDue: 0, lessonDone: true, readingDone: true })
    expect(p.reviewDone).toBe(true)
    expect(p.allDone).toBe(true)
  })

  it('做多了也不会倒扣（超过上限仍算完成）', () => {
    const p = dailyProgress({
      reviewedToday: 120,
      reviewDue: 100,
      lessonDone: true,
      readingDone: true,
    })
    expect(p.reviewDone).toBe(true)
  })
})

describe('countReviewedToday —— 今天复习了几张', () => {
  const today = dayStamp()

  it('只数 lastReview === 今天的卡', () => {
    const cards = [
      { lastReview: today },
      { lastReview: today },
      { lastReview: today - 1 },
      { lastReview: 0 },
      {},
    ]
    expect(countReviewedToday(cards, today)).toBe(2)
  })

  it('空集合返回 0', () => {
    expect(countReviewedToday([], today)).toBe(0)
  })

  it('明天再看今天复习的卡，不会被算成「明天复习过」', () => {
    const cards = [{ lastReview: today }]
    expect(countReviewedToday(cards, today + 1)).toBe(0)
  })
})

describe('isToday —— 日期戳比对', () => {
  it('同一天为 true，别的天为 false', () => {
    const today = dayStamp()
    expect(isToday(today, today)).toBe(true)
    expect(isToday(today - 1, today)).toBe(false)
    expect(isToday(0, today)).toBe(false)
  })

  it('undefined 不崩，返回 false（未初始化的字段）', () => {
    expect(isToday(undefined)).toBe(false)
  })
})

describe('跨天行为 —— 昨天的完成不能算今天的', () => {
  it('昨天完成新课，今天应显示未完成', () => {
    const today = dayStamp()
    const yesterday = today - 1

    const yesterdayProgress = dailyProgress({
      reviewedToday: 0,
      reviewDue: 0,
      lessonDone: isToday(yesterday, today), // 昨天 → false
      readingDone: false,
    })
    expect(yesterdayProgress.lessonDone).toBe(false)
    expect(yesterdayProgress.allDone).toBe(false)
  })
})