// 应用题数据的不变量：每步恰有一个正确选项、分步算式末步结果 = answer、
// 出题可复现。这些检查保护「题目自相矛盾 / 答案算错」这类最难肉眼发现的错误。
import { describe, it, expect } from 'vitest'
import { WORD_PROBLEMS, wordProblemRound } from './mathPractice'

describe('应用题数据', () => {
  it('题量充足，id 唯一', () => {
    expect(WORD_PROBLEMS.length).toBeGreaterThanOrEqual(10)
    expect(new Set(WORD_PROBLEMS.map((p) => p.id)).size).toBe(WORD_PROBLEMS.length)
  })

  it('第一步 / 第二步各有且仅有一个正确选项', () => {
    for (const p of WORD_PROBLEMS) {
      expect(p.ask.options.filter((o) => o.correct).length, `${p.id} ask 正确项`).toBe(1)
      expect(p.first.options.filter((o) => o.correct).length, `${p.id} first 正确项`).toBe(1)
      expect(p.ask.options.length).toBeGreaterThanOrEqual(2)
      expect(p.first.options.length).toBeGreaterThanOrEqual(2)
      // 选项文案不得重复（重复会让孩子无从选起 / e2e 定位歧义）
      expect(new Set(p.ask.options.map((o) => o.label)).size).toBe(p.ask.options.length)
      expect(new Set(p.first.options.map((o) => o.label)).size).toBe(p.first.options.length)
    }
  })

  it('分步算式两步齐全，末步结果 === answer', () => {
    for (const p of WORD_PROBLEMS) {
      expect(p.steps.length, `${p.id} 分步`).toBeGreaterThanOrEqual(2)
      const last = p.steps[p.steps.length - 1]
      const nums = last.match(/\d+/g)
      expect(nums && nums.length > 0, `${p.id} 末步应有数字`).toBeTruthy()
      expect(Number(nums![nums!.length - 1]), `${p.id} 末步结果`).toBe(p.answer)
    }
  })

  it('题干 / 提示 / 解析都非空，且题干是中文', () => {
    for (const p of WORD_PROBLEMS) {
      expect(p.text.length).toBeGreaterThan(5)
      expect(p.ask.prompt.length).toBeGreaterThan(0)
      expect(p.first.prompt.length).toBeGreaterThan(0)
      expect(p.explain.length).toBeGreaterThan(0)
      expect(/[\u4e00-\u9fa5]/.test(p.text)).toBe(true)
    }
  })
})

describe('出题', () => {
  it('给定 seed 可复现', () => {
    const a = wordProblemRound(5, 12345).map((p) => p.id)
    const b = wordProblemRound(5, 12345).map((p) => p.id)
    expect(a).toEqual(b)
  })

  it('不超量；不重复', () => {
    const list = wordProblemRound(5, 999)
    expect(list.length).toBeLessThanOrEqual(5)
    expect(new Set(list.map((p) => p.id)).size).toBe(list.length)
  })

  it('指定 ids 时只取这些题（重练错题），忽略 count', () => {
    const ids = [WORD_PROBLEMS[2].id, WORD_PROBLEMS[7].id]
    const list = wordProblemRound(2, 1, ids)
    expect(list.map((p) => p.id).sort()).toEqual(ids.sort())
  })
})
