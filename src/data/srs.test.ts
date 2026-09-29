import { describe, it, expect } from 'vitest'
import { State } from 'ts-fsrs'
import {
  dayStamp,
  scheduleNext,
  createNewCard,
  isDue,
  dueOf,
  sortDueCards,
  boxLabel,
  boxEmoji,
  BOX_INTERVALS,
  MAX_BOX,
} from './srs'
import {
  migrateFromLeitner,
  deriveBox,
  BOX_STABILITY,
} from './fsrsScheduler'

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

describe('scheduleNext（FSRS 内核）', () => {
  it('连续答对：间隔逐次递增（Good 拉长稳定度）', () => {
    const today = 1000
    let card = createNewCard('apple', 'starlight', today)
    const gaps: number[] = []
    let day = today
    for (let i = 0; i < 5; i++) {
      const r = scheduleNext(card, true, day)
      gaps.push(r.nextReview - day)
      day = r.nextReview
      card = { ...card, ...r }
    }
    // 相邻两次的间隔不下降（学习步进逐步走出后间隔单调不减）
    for (let i = 1; i < gaps.length; i++) {
      expect(gaps[i]).toBeGreaterThanOrEqual(gaps[i - 1])
    }
    expect(gaps[gaps.length - 1]).toBeGreaterThan(0)
  })

  it('答对：势头+1、次数+1、派生 nextReview 与 fsrs.due 一致', () => {
    const today = 1000
    const c = createNewCard('apple', 'starlight', today)
    const r = scheduleNext(c, true, today)
    expect(r.streak).toBe(2 - 1)
    expect(r.reviews).toBe(1)
    expect(r.nextReview).toBe(r.fsrs!.due)
    expect(r.box).toBe(deriveBox(r.fsrs!))
  })

  it('答错：当天到期、势头清零、lapses+1、进入 Relearning', () => {
    const today = 1000
    // FSRS 只在「已毕业（Review）的卡」上计 lapses：先把卡推到 Review
    let card = createNewCard('apple', 'starlight', today)
    let day = today
    for (let i = 0; i < 4; i++) {
      const r = scheduleNext(card, true, day)
      day = r.nextReview
      card = { ...card, ...r }
    }
    expect(card.fsrs!.state).toBe(State.Review)

    const r = scheduleNext(card, false, day)
    expect(r.nextReview).toBe(day) // 答错回到当天
    expect(r.streak).toBe(0)
    expect(r.reviews).toBe(card.reviews + 1)
    expect(r.fsrs!.lapses).toBe(1)
  })

  it('答错卡在 Learning 阶段时不计 lapses（FSRS 语义：仅 Review 卡计遗忘）', () => {
    const today = 1000
    const c = createNewCard('apple', 'starlight', today)
    const r = scheduleNext(c, false, today)
    expect(r.nextReview).toBe(today)
    expect(r.fsrs!.lapses).toBe(0)
  })

  it('盒号封顶于 MAX_BOX（派生兼容字段不越界）', () => {
    const c = createNewCard('apple', 'starlight', 1000)
    const r = scheduleNext(c, true, 1000)
    expect(r.box).toBeLessThanOrEqual(MAX_BOX)
  })
})

describe('migrateFromLeitner', () => {
  it('字段完整、due 沿用旧 nextReview（进度不丢）', () => {
    const nextReview = 1234
    const f = migrateFromLeitner(3, nextReview)
    expect(f.due).toBe(nextReview)
    expect(f.stability).toBe(BOX_STABILITY[3])
    expect(f.difficulty).toBeGreaterThanOrEqual(1)
    expect(f.difficulty).toBeLessThanOrEqual(10)
    expect(f.reps).toBeGreaterThan(0)
    expect(f.lastReview).toBe(nextReview - BOX_INTERVALS[3])
  })

  it('盒 0 → Learning，高盒 → Review；盒号钳制在范围内', () => {
    expect(migrateFromLeitner(0, 100).state).toBe(State.Learning)
    expect(migrateFromLeitner(6, 100).state).toBe(State.Review)
    expect(deriveBox(migrateFromLeitner(99, 100))).toBeLessThanOrEqual(MAX_BOX)
    expect(deriveBox(migrateFromLeitner(-5, 100))).toBeGreaterThanOrEqual(0)
  })

  it('lapses 参数被保留', () => {
    expect(migrateFromLeitner(2, 100, 5).lapses).toBe(5)
  })
})

describe('deriveBox', () => {
  it('稳定度越高盒号越高，且与 fsrs 字段自洽', () => {
    const low = migrateFromLeitner(1, 100)
    const high = migrateFromLeitner(5, 100)
    expect(deriveBox(low)).toBeLessThan(deriveBox(high))
    expect(deriveBox({ ...low, state: State.New })).toBe(0)
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
    expect(c.source).toBe('lesson')
    expect(c.fsrs!.due).toBe(today)
  })
  it('拓展词卡带 source=extension（删除时据此清理）', () => {
    const c = createNewCard('broccoli', 'starlight', 500, 'extension')
    expect(c.source).toBe('extension')
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
  it('以 fsrs.due 为准（与 sortDueCards 同源）', () => {
    const today = 100
    // fsrs.due 已到期，但派生的 nextReview 还没到：判定必须跟随 fsrs
    expect(isDue({ nextReview: 200, fsrs: { ...migrateFromLeitner(3, 50) } }, today)).toBe(true)
    // 反过来：nextReview 已过期但 fsrs.due 未到，不算到期
    expect(isDue({ nextReview: 50, fsrs: { ...migrateFromLeitner(3, 200) } }, today)).toBe(false)
  })
})

describe('dueOf 单一真值来源', () => {
  it('有 fsrs 时取 fsrs.due，否则回退 nextReview', () => {
    expect(dueOf({ nextReview: 1, fsrs: { ...migrateFromLeitner(2, 9) } })).toBe(9)
    expect(dueOf({ nextReview: 7 })).toBe(7)
  })

  it('回归：isDue 与 sortDueCards 对同一张冲突卡结论一致', () => {
    const today = 100
    // 刻意制造分歧：fsrs.due 远早于 nextReview
    const conflicted = {
      box: 1,
      nextReview: 500,   // 派生字段说「没到期」
      lastReview: 100,
      fsrs: { ...migrateFromLeitner(4, 20) }, // FSRS 说「早已到期」
    }
    const other = { box: 3, nextReview: 99, lastReview: 100 }

    // isDue 依据 fsrs → 冲突卡到期
    expect(isDue(conflicted, today)).toBe(true)
    // 排序也必须依据 fsrs：冲突卡逾期 80 天，应排在未逾期的 other 之前
    const sorted = sortDueCards([other, conflicted], today)
    expect(sorted[0]).toBe(conflicted)
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
