// 第一册（Starlight 1）阅读短文数据完整性 —— 与预备级 readingPassage.test.ts 同口径。
//
// 为什么单独一份：预备级的校验器读 READING_PASSAGES（level-0，12 单元 / 96 课），
// 词表真源 baseVocab.ts 也绑死 lessonsByUnit（预备级）。第一册是另一套数据
// （9 单元 / 96 课，词汇量大得多，且短文要用到教材角色名与课本原文词），
// 必须用 src/data/starlight1/readingVocab1.ts 的专属允许域。
//
// 口径八条与 level-0 一一对应：96 课全覆盖、篇幅 70~100 词 / 8~12 句 / 1~3 段、
// 零超纲、本课词 100% 出现、标题中英文、每句有中文、英文句不混中文标点、同篇无重复句。
// 唯一的校验实现放在 readingVocab1.ts 的 validateReadingPassage1()，
// scripts/check-reading1.mjs 也调它，生成与单测不会漂移。
//
// 聚合报错：多单元并行改写时，第一篇坏短文就短路的话，别的 Agent 看不到自己
// 还剩什么问题，只能反复重跑。一次列全。

import { describe, it, expect } from 'vitest'
import { READING_PASSAGES1 } from './reading'
import {
  allReadingKeys1,
  validateReadingPassage1,
  passageSentences,
  tokenizeReading,
} from './readingVocab1'

const ALL_KEYS = allReadingKeys1()
const ONLY_UNIT = process.env.READING1_UNIT ? Number(process.env.READING1_UNIT) : null
const checkedKeys = ONLY_UNIT
  ? ALL_KEYS.filter((k) => Number(k.split('-')[0]) === ONLY_UNIT)
  : ALL_KEYS

function expectNoProblems(problems: string[]) {
  const tail = problems.length > 80 ? `\n…共 ${problems.length} 条` : ''
  expect(problems, `\n${problems.slice(0, 80).join('\n')}${tail}`).toEqual([])
}

describe('第一册阅读短文 · 数据完整性（同预备级口径）', () => {
  it('课程数 = 96，每一课都有短文，不多不少', () => {
    const problems: string[] = []
    expect(ALL_KEYS).toHaveLength(96)
    for (const key of checkedKeys) {
      if (!READING_PASSAGES1[key]) problems.push(`${key}: 缺少短文`)
    }
    const extra = Object.keys(READING_PASSAGES1).filter((k) => !ALL_KEYS.includes(k))
    for (const k of extra) problems.push(`多余 key（不是真实课号）: ${k}`)
    expectNoProblems(problems)
  })

  it('逐篇八条不变量（篇幅/零超纲/本课词/中文/标点/重复句/标题）', () => {
    const problems: string[] = []
    for (const key of checkedKeys) {
      const [u, l] = key.split('-').map(Number)
      const errs = validateReadingPassage1(READING_PASSAGES1[key], u, l)
      for (const e of errs) problems.push(`${key}: ${e}`)
    }
    expectNoProblems(problems)
  })

  it('每篇都能被 passageSentences 展平且词数可计（结构没塌）', () => {
    for (const key of checkedKeys) {
      const p = READING_PASSAGES1[key]
      if (!p) continue
      const sents = passageSentences(p)
      expect(sents.length, `${key} 展平后没有句子`).toBeGreaterThan(0)
      expect(tokenizeReading(sents[0].en).length, `${key} 首句切词为空`).toBeGreaterThan(0)
    }
  })
})
