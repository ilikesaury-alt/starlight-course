import { describe, it, expect } from 'vitest'
import { lessonsByUnit1 } from './lessons'
import { STARLIGHT_BOOK1 } from './book'
import { STARLIGHT_FRAMES1 } from './sentenceFrames'
import { READING_PASSAGES1 } from './reading'
import { EXT_TOPICS1 } from './extensions'
import { modules1, READINGS_BY_UNIT1 } from './index'
import type { ExtTopic } from './shared'
import { u2_ext } from './u2'
import { u3_ext } from './u3'
import { u4_ext } from './u4'
import { u5_ext } from './u5'
import { u6_ext } from './u6'
import { u7_ext } from './u7'
import { u8_ext } from './u8'
import { u9_ext } from './u9'

// Unit 1 没有独立文件，数据内联在聚合文件里；此处用聚合结果回推校验。
const unitExts: Record<number, Record<string, ExtTopic>> = {
  2: u2_ext,
  3: u3_ext,
  4: u4_ext,
  5: u5_ext,
  6: u6_ext,
  7: u7_ext,
  8: u8_ext,
  9: u9_ext,
}

describe('Level 1 数据完整性', () => {
  it('覆盖全部 9 个单元', () => {
    const keys = Object.keys(lessonsByUnit1).map(Number).sort((a, b) => a - b)
    expect(keys).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('每单元课程数符合预期，且总数 96', () => {
    const expected: Record<number, number> = { 1: 10, 2: 11, 3: 11, 4: 11, 5: 9, 6: 13, 7: 9, 8: 11, 9: 11 }
    let total = 0
    for (const [u, n] of Object.entries(expected)) {
      const arr = lessonsByUnit1[Number(u)]
      expect(arr.length, `unit ${u}`).toBe(n)
      total += arr.length
    }
    expect(total).toBe(96)
  })

  it('book 条目数与课程数一致', () => {
    const bookCount = Object.keys(STARLIGHT_BOOK1).length
    const lessonCount = Object.values(lessonsByUnit1).reduce((s, a) => s + a.length, 0)
    expect(bookCount).toBe(lessonCount)
    for (const k of Object.keys(STARLIGHT_BOOK1)) {
      expect(k).toMatch(/^\d+-\d+$/)
    }
  })

  it('拓展主题无跨单元键冲突（聚合后个数 = 各单元之和 + Unit1 的 4）', () => {
    const perUnitSum = Object.values(unitExts).reduce((s, r) => s + Object.keys(r).length, 0)
    // Unit 1 内联，含 4 个主题
    expect(Object.keys(EXT_TOPICS1).length).toBe(perUnitSum + 4)
  })

  it('逐单元检测 ext 键是否跨单元重复', () => {
    const seen = new Map<string, number[]>()
    for (const [u, r] of Object.entries(unitExts)) {
      for (const k of Object.keys(r)) {
        const prev = seen.get(k) ?? []
        prev.push(Number(u))
        seen.set(k, prev)
      }
    }
    const collisions = [...seen.entries()].filter(([, us]) => us.length > 1)
    expect(collisions, JSON.stringify(collisions)).toEqual([])
  })

  it('句型卡 id 全局唯一，空位数与 blanks 数一致，zhOptions 与 options 等长', () => {
    const ids = new Set<string>()
    for (const f of STARLIGHT_FRAMES1) {
      expect(ids.has(f.id), `重复 frame id: ${f.id}`).toBe(false)
      ids.add(f.id)
      expect(f.pattern.split('___').length - 1, `frame ${f.id} 空位数`).toBe(f.blanks.length)
      for (const b of f.blanks) {
        expect(b.zhOptions.length, `frame ${f.id} zhOptions 长度`).toBe(b.options.length)
        expect(b.answer, `frame ${f.id} answer 越界`).toBeGreaterThanOrEqual(0)
        expect(b.answer, `frame ${f.id} answer 越界`).toBeLessThan(b.options.length)
      }
    }
  })

  it('reading 键格式正确', () => {
    for (const k of Object.keys(READING_PASSAGES1)) {
      expect(k).toMatch(/^\d+-\d+$/)
    }
  })

  // 每篇短文的键必须落在一个**真实存在**的「单元-课」上，且归在正确的单元桶里。
  // 回归：Unit 1 的桶曾直接摊平了 u2–u9 的短文，混进 '2-3' 这类别单元的键，
  // 任何遍历桶的逻辑都会读到别的单元去。
  it('按单元聚合的短文桶：键都指向本单元真实存在的一课', () => {
    for (const [unitId, bucket] of Object.entries(READINGS_BY_UNIT1)) {
      const u = Number(unitId)
      const mod = modules1.find((m) => m.id === u)
      expect(mod, `桶 ${unitId} 没有对应单元`).toBeDefined()
      for (const key of Object.keys(bucket)) {
        expect(key, `桶 ${unitId} 混进了别单元的键 ${key}`).toMatch(new RegExp(`^${u}-\\d+$`))
        const lessonId = Number(key.split('-')[1])
        expect(
          mod!.lessons.some((l) => l.id === lessonId),
          `${key} 指向不存在的课`,
        ).toBe(true)
      }
    }
  })

  it('第一册短文总数与按单元聚合表一致（没有重复计/漏计）', () => {
    const perUnit = Object.values(READINGS_BY_UNIT1).reduce((n, r) => n + Object.keys(r).length, 0)
    expect(perUnit).toBe(Object.keys(READING_PASSAGES1).length)
  })

  it('modules1 含 9 个单元，id 1~9', () => {
    expect(modules1.length).toBe(9)
    const ids = modules1.map((m) => m.id).sort((a, b) => a - b)
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    for (const m of modules1) {
      expect(m.lessons.length).toBeGreaterThan(0)
      expect(m.quiz.length).toBe(5)
    }
  })
})
