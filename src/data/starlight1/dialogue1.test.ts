// 第一册（Starlight 1）外教课堂对话数据完整性。
//
// 为什么单独一份：预备级的 LESSON_DIALOGUE（level-0）与 level-0 lessonsByUnit 绑定，
// 第一册是另一套数据（dialogue1.ts / dialogue/uN.ts），两册单元号都从 1 开始，
// 混在一张表里查会串书。校验口径放在 dialogue1.ts 的 validateDialogue1()，
// scripts/check-dialogue1.mjs 也调它，生成与单测不会漂移。
//
// 聚合报错：多单元并行补写时，第一篇坏对话就短路的话，别的 Agent 看不到自己
// 还剩什么问题，只能反复重跑。一次列全。

import { describe, it, expect } from 'vitest'
import { LESSON_DIALOGUE1, getLessonDialogue1, allDialogueKeys1, validateDialogue1 } from './dialogue1'

const ALL_KEYS = allDialogueKeys1()
const ONLY_UNIT = process.env.DIALOGUE1_UNIT ? Number(process.env.DIALOGUE1_UNIT) : null
const checkedKeys = ONLY_UNIT
  ? ALL_KEYS.filter((k) => Number(k.split('-')[0]) === ONLY_UNIT)
  : ALL_KEYS

function expectNoProblems(problems: string[]) {
  const tail = problems.length > 80 ? `\n…共 ${problems.length} 条` : ''
  expect(problems, `\n${problems.slice(0, 80).join('\n')}${tail}`).toEqual([])
}

describe('第一册外教对话 · 数据完整性', () => {
  it('课程数 = 96，每一课都有对话，不多不少', () => {
    const problems: string[] = []
    expect(ALL_KEYS).toHaveLength(96)
    for (const key of checkedKeys) {
      if (!LESSON_DIALOGUE1[key]) problems.push(`${key}: 缺少对话`)
    }
    const extra = Object.keys(LESSON_DIALOGUE1).filter((k) => !ALL_KEYS.includes(k))
    for (const k of extra) problems.push(`多余 key（不是真实课号）: ${k}`)
    expectNoProblems(problems)
  })

  it('逐课口径：轮次 10~15、T/S 都有、每轮英文+中文、无中文标点、无重复台词、本课词覆盖 ≥60%', () => {
    const problems: string[] = []
    for (const key of checkedKeys) {
      const [u, l] = key.split('-').map(Number)
      const errs = validateDialogue1(LESSON_DIALOGUE1[key], u, l)
      for (const e of errs) problems.push(`${key}: ${e}`)
    }
    expectNoProblems(problems)
  })

  it('getter 与总表一致（不串书）', () => {
    for (const key of checkedKeys) {
      const [u, l] = key.split('-').map(Number)
      expect(getLessonDialogue1(u, l), `${key} getter 取不到`).toBe(LESSON_DIALOGUE1[key])
    }
  })
})
