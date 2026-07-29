import { describe, it, expect } from 'vitest'
import {
  dayStamp,
  scheduleNext,
  createNewCard,
  isDue,
  sortDueCards,
  boxLabel,
  boxEmoji,
  BOX_INTERVALS,
  MAX_BOX,
} from './srs'

describe('dayStamp', () => {
  it('同一本地日历日返回相同天戳', () => {
    const a = dayStamp(new Date(2026, 6, 29, 1, 0, 0)) // 本地 7/29 01:00
    const b = dayStamp(new Date(2026, 6, 29, 23, 59, 59)) // 本地 7/29 23:59
    expect(a).toBe(b)
  })
  it('跨本地日天戳 +1', () => {
    const a = dayStamp(new Date(2026, 6, 29, 12, 0, 0))
    const b = dayStamp(new Date(2026, 6, 30, 12, 0, 0))
    expect(b - a).toBe(1)
  })
})

describe('scheduleNext', () => {
  it('答对：升一盒、势头+1、次数+1、下次复习 = 今天 + 间隔', () => {
    const today = 1000
    const r = scheduleNext({ box: 2, streak: 1, reviews: 3 }, true, today)
    expect(r.box).toBe(3)
    expect(r.streak).toBe(2)
    expect(r.reviews).toBe(4)
    expect(r.nextReview).toBe(today + BOX_INTERVALS[3])
    expect(r.lastReview).toBe(today)
  })
  it('答对：盒号封顶于 MAX_BOX', () => {
    const r = scheduleNext({ box: MAX_BOX, streak: 5, reviews: 9 }, true, 1000)
    expect(r.box).toBe(MAX_BOX)
    expect(r.nextReview).toBe(1000 + BOX_INTERVALS[MAX_BOX])
  })
  it('答错：归零盒、势头清零、当天到期、次数仍+1', () => {
    const today = 1000
    const r = scheduleNext({ box: 4, streak: 3, reviews: 5 }, false, today)
    expect(r.box).toBe(0)
    expect(r.streak).toBe(0)
    expect(r.nextReview).toBe(today)
    expect(r.lastReview).toBe(today)
    expect(r.reviews).toBe(6)
  })
})

describe('createNewCard', () => {
  it('新词从盒 0 起步、当天到期、归属单模块', () => {
    const today = 500
    const c = createNewCard('apple', 'starlight', today)
    expect(c.box).toBe(0)
    expect(c.nextReview).toBe(today)
    expect(c.modules).toEqual(['starlight'])
    expect(c.reviews).toBe(0)
    expect(c.streak).toBe(0)
  })
})

describe('isDue', () => {
  it('nextReview <= today 视为到期', () => {
    expect(isDue({ nextReview: 100 }, 100)).toBe(true)
    expect(isDue({ nextReview: 99 }, 100)).toBe(true)
  })
  it('nextReview > today 视为未到期', () => {
    expect(isDue({ nextReview: 101 }, 100)).toBe(false)
  })
})

describe('sortDueCards', () => {
  it('过期最久优先，其次盒号低优先', () => {
    const today = 100
    const cards = [
      { box: 5, nextReview: 90, lastReview: 80 },
      { box: 1, nextReview: 90, lastReview: 80 },
      { box: 0, nextReview: 95, lastReview: 80 },
    ]
    const sorted = sortDueCards(cards, today)
    expect(sorted[0].box).toBe(1) // 最逾期(90)中盒号最低
    expect(sorted[1].box).toBe(5) // 最逾期(90)中盒号较高
    expect(sorted[2].box).toBe(0) // 逾期较轻(95)
  })
  it('不修改原数组(纯函数)', () => {
    const today = 100
    const cards = [
      { box: 0, nextReview: 90, lastReview: 80 },
      { box: 0, nextReview: 50, lastReview: 80 },
    ]
    const copy = [...cards]
    sortDueCards(cards, today)
    expect(cards).toEqual(copy)
  })
})

describe('boxLabel / boxEmoji', () => {
  it('越界时钳制到最高级', () => {
    expect(boxLabel(99)).toBe('大师')
    expect(boxEmoji(99)).toBe('🏆')
  })
  it('盒 0 为初始级', () => {
    expect(boxLabel(0)).toBe('刚学')
    expect(boxEmoji(0)).toBe('🌱')
  })
})
