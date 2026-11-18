// 数学专项题目数据的不变量：答案必须算对、生成可复现、读题关键词下标合法。
// 这些检查保护「出题算错答案」这类最难靠肉眼发现的错误。
import { describe, it, expect } from 'vitest'
import {
  CAUSE_LABEL,
  KEYWORD_QUESTIONS,
  generateCalcRound,
  keywordRound,
  makeCalcQuestions,
  makeKeywordQuestions,
  type CalcCause,
} from './mathPractice'

describe('计算题生成', () => {
  it('给定 seed 完全可复现', () => {
    const a = generateCalcRound(10, 12345)
    const b = generateCalcRound(10, 12345)
    expect(a.map((q) => q.stem)).toEqual(b.map((q) => q.stem))
    expect(a.map((q) => q.answer)).toEqual(b.map((q) => q.answer))
  })

  it('题干里的算式与答案一致（用 Function 独立验算，防手滑写错答案）', () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (const q of generateCalcRound(10, seed)) {
        const expr = q.stem
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/−/g, '-')
          .replace(/=.*$/, '')
        const value = Function(`"use strict";return (${expr})`)() as number
        expect(value, `${q.stem} 算得 ${value}，但答案是 ${q.answer}`).toBe(q.answer)
      }
    }
  })

  it('默认混合覆盖至少 6 种错因', () => {
    const causes = new Set(generateCalcRound(30, 999).map((q) => q.cause))
    expect(causes.size).toBeGreaterThanOrEqual(6)
  })

  it('指定 causeFilter 时只出该类，每题都带合法错因标签', () => {
    const causes = Object.keys(CAUSE_LABEL) as CalcCause[]
    for (const cause of causes) {
      const round = generateCalcRound(5, 7, cause)
      expect(round.length).toBe(5)
      for (const q of round) {
        expect(q.cause).toBe(cause)
        expect(CAUSE_LABEL[q.cause]).toBeTruthy()
      }
    }
  })

  it('id 唯一，makeCalcQuestions 包成判别联合', () => {
    const list = makeCalcQuestions(10, 42)
    expect(new Set(list.map((p) => p.q.id)).size).toBe(10)
    expect(list.every((p) => p.kind === 'calc')).toBe(true)
  })
})

describe('读题·圈关键词', () => {
  it('每题 segments 拼起来 === text', () => {
    for (const q of KEYWORD_QUESTIONS) {
      expect(q.segments.join(''), `${q.id} 拼接应等于题干`).toBe(q.text)
    }
  })

  it('keyIdx 全部合法（不越界、不重复），分步与答案齐全', () => {
    for (const q of KEYWORD_QUESTIONS) {
      const uniq = new Set(q.keyIdx)
      expect(uniq.size).toBe(q.keyIdx.length)
      for (const i of q.keyIdx) {
        expect(i).toBeGreaterThanOrEqual(0)
        expect(i).toBeLessThan(q.segments.length)
      }
      expect(q.steps.length).toBeGreaterThanOrEqual(2)
      expect(q.answer).toBeGreaterThan(0)
      expect(q.explain.length).toBeGreaterThan(0)
    }
  })

  it('第二步算式的最后结果 === answer', () => {
    for (const q of KEYWORD_QUESTIONS) {
      const last = q.steps[q.steps.length - 1]
      const nums = last.match(/\d+/g)
      expect(nums && nums.length > 0, `${q.id} 末步应有数字`).toBeTruthy()
      expect(Number(nums![nums!.length - 1]), `${q.id} 末步结果`).toBe(q.answer)
    }
  })

  it('keywordRound 可复现且不越界', () => {
    const a = keywordRound(5, 77).map((q) => q.id)
    const b = keywordRound(5, 77).map((q) => q.id)
    expect(a).toEqual(b)
    expect(a.length).toBeLessThanOrEqual(KEYWORD_QUESTIONS.length)
    expect(makeKeywordQuestions(5, 77).every((p) => p.kind === 'keyword')).toBe(true)
  })
})
