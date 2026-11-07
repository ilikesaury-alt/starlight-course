// 阅读模块系列数据门面回归测试（src/data/readingSeries.ts）。
//
// 守两件事：
//   ① 两册共用同一套页面，但数据源必须**按册分开** —— 第一册的 Unit 1 不能
//      显示预备级的短文；预备级的 96 课一篇都不能少。
//   ② 第一册只有 27 课写了短文，阅读页只列这些课，不能摆 69 张「读一读」死链。

import { describe, it, expect } from 'vitest'
import {
  READING_PATHS,
  readingHeroWords,
  readingLessonsOf,
  readingStoryCount,
  type ReadingSource,
} from './readingSeries'
import { modules } from './starlight'
import { getReadingPassage } from './reading/index'
import { modules1, getReadingPassage1 } from './starlight1'

const starter: ReadingSource = { level: 'starlight', mods: modules, passageOf: getReadingPassage }
const book1: ReadingSource = { level: 'starlight1', mods: modules1, passageOf: getReadingPassage1 }

describe('阅读系列 · 两册数据源分离', () => {
  it('路由各指各的，且与主课目录页不同', () => {
    expect(READING_PATHS.starlight).toBe('/reading')
    expect(READING_PATHS.starlight1).toBe('/reading1')
    expect(new Set(Object.values(READING_PATHS)).size).toBe(2)
  })

  it('预备级：12 单元 × 8 课 = 96 篇，一篇不少', () => {
    expect(starter.mods).toHaveLength(12)
    expect(readingStoryCount(starter)).toBe(96)
    for (const m of starter.mods) {
      expect(readingLessonsOf(starter, m), `预备级 M${m.id}`).toHaveLength(8)
    }
  })

  it('第一册：9 单元 96 课全有短文且都不是死链', () => {
    expect(book1.mods).toHaveLength(9)
    let total = 0
    for (const m of book1.mods) {
      const lessons = readingLessonsOf(book1, m)
      expect(lessons.length, `第一册 M${m.id} 一篇都没有`).toBeGreaterThan(0)
      // 补齐后阅读页课课都有卡片，不能再滤掉任何一课
      expect(lessons.length, `第一册 M${m.id} 漏了课`).toBe(m.lessons.length)
      for (const l of lessons) {
        expect(getReadingPassage1(m.id, l.id), `第一册 ${m.id}-${l.id} 是死链`).toBeDefined()
      }
      total += lessons.length
    }
    expect(total).toBe(readingStoryCount(book1))
    expect(total).toBe(96)
    expect(total).toBe(book1.mods.reduce((n, m) => n + m.lessons.length, 0))
  })

  it('同一「单元-课」号在两册指向不同内容，门面不会串书', () => {
    // 1-1：两册现在都有短文（第一册 96 篇已补齐），但必须是两篇不同的故事
    expect(getReadingPassage(1, 1)).toBeDefined()
    expect(getReadingPassage1(1, 1)).toBeDefined()
    expect(getReadingPassage(1, 1)!.title).not.toBe(getReadingPassage1(1, 1)!.title)
    // 1-4：两册都有，但必须是两篇不同的故事
    const a = getReadingPassage(1, 4)
    const b = getReadingPassage1(1, 4)
    expect(a).toBeDefined()
    expect(b).toBeDefined()
    expect(a!.title).not.toBe(b!.title)
  })
})

describe('阅读系列 · 首屏宝藏词', () => {
  it('预备级沿用固定示例词，全部是 Unit 1 真实课本词', () => {
    const words = readingHeroWords({ ...starter, heroWords: ['hello', 'friend', 'name', 'color', 'good'] })
    const unit1 = new Set(modules[0].lessons.flatMap((l) => l.words.map((w) => w.en.toLowerCase())))
    expect(words).toHaveLength(5)
    for (const w of words) expect(unit1.has(w.toLowerCase())).toBe(true)
  })

  it('第一册自动派生 5 个词，全部是**第一册** Unit 1 真实课本词', () => {
    const words = readingHeroWords(book1)
    const unit1 = new Set(modules1[0].lessons.flatMap((l) => l.words.map((w) => w.en.toLowerCase())))
    expect(words).toHaveLength(5)
    for (const w of words) {
      expect(w).not.toContain(' ') // 不摆 'trash can' 这类词组
      expect(unit1.has(w.toLowerCase())).toBe(true)
    }
    // 不能还是预备级那组词（换册了就该换例子）
    expect(words).not.toContain('hello')
  })
})
