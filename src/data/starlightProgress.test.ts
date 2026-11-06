// 进度页「按册统计」的回归测试。
//
// 守的是系列化之后的一个真 bug：store 的 lessonCompleted / completedQuizzes
// 以**单元 slug** 为键，两册的记录混在同一张表里。进度页早期直接
// Object.values(...).reduce 求总、分母却写死 96，于是孩子只要学了第一册
// 任意一课，预备级就显示「已学 97/96 课」、进度条溢出。
//
// 这里分两层钉死：
//   ① slug 名单 / 分母必须与真实课表一致（加单元漏改名单立刻红）
//   ② 两册完成记录互不串、野 slug 不虚增、测验数按册分
import { describe, it, expect } from 'vitest'
import {
  STARLIGHT_LEVELS,
  STARLIGHT_LEVEL_ORDER,
  STARLIGHT_UNIT_SLUGS,
  levelOfUnitSlug,
  countLessonsByLevel,
  countQuizzesByLevel,
} from './starlightSeries'
import { modules } from './starlight'
import { modules1 } from './starlight1'

describe('Starlight 册次元信息 · 与真实课表对齐', () => {
  it('slug 名单逐册与真实课表一致（无遗漏、无多余）', () => {
    expect([...STARLIGHT_UNIT_SLUGS.starlight]).toEqual(modules.map((m) => m.slug))
    expect([...STARLIGHT_UNIT_SLUGS.starlight1]).toEqual(modules1.map((m) => m.slug))
  })

  it('两册 slug 全局唯一（否则无法按 slug 判册）', () => {
    const all = STARLIGHT_LEVEL_ORDER.flatMap((l) => [...STARLIGHT_UNIT_SLUGS[l]])
    expect(new Set(all).size).toBe(all.length)
  })

  it('unitCount / lessonCount 与真实课表一致（进度页分母不能写死）', () => {
    for (const level of STARLIGHT_LEVEL_ORDER) {
      const mods = level === 'starlight' ? modules : modules1
      expect(STARLIGHT_LEVELS[level].unitCount, `${level} 单元数`).toBe(mods.length)
      expect(STARLIGHT_LEVELS[level].lessonCount, `${level} 课数`).toBe(
        mods.reduce((n, m) => n + m.lessons.length, 0),
      )
    }
  })

  it('levelOfUnitSlug 两册各自命中，野 slug 返回 undefined', () => {
    expect(levelOfUnitSlug('hello')).toBe('starlight')
    expect(levelOfUnitSlug('transport')).toBe('starlight')
    expect(levelOfUnitSlug('monty-the-artist')).toBe('starlight1')
    expect(levelOfUnitSlug('monty-the-diver')).toBe('starlight1')
    expect(levelOfUnitSlug('unit-1')).toBeUndefined()
    expect(levelOfUnitSlug('')).toBeUndefined()
  })
})

describe('按册汇总完成记录', () => {
  it('两册互不串：第一册的课只算进第一册', () => {
    const result = countLessonsByLevel({
      hello: [1, 2, 3],                  // 预备级 3 课
      'monty-the-artist': [1, 2],        // 第一册 2 课
      'lola-the-pirate': [1, 2, 3, 4],  // 第一册 4 课
    })
    expect(result).toEqual({ starlight: 3, starlight1: 6 })
  })

  it('野 slug / 别的模块串进来的键不计入任何一册', () => {
    const result = countLessonsByLevel({
      hello: [1, 2],
      'random-legacy-key': [1, 2, 3, 4, 5],
      'eng3a-u1': [1, 2, 3],
    })
    expect(result).toEqual({ starlight: 2, starlight1: 0 })
  })

  it('空记录两册都是 0', () => {
    expect(countLessonsByLevel({})).toEqual({ starlight: 0, starlight1: 0 })
    expect(countQuizzesByLevel([])).toEqual({ starlight: 0, starlight1: 0 })
  })

  it('单元测验按册统计，且只数一次', () => {
    expect(
      countQuizzesByLevel(['hello', 'animals', 'monty-the-artist', 'unknown-unit']),
    ).toEqual({ starlight: 2, starlight1: 1 })
  })

  it('回归：学了第一册一整册，预备级的完成数纹丝不动', () => {
    const starterBefore = countLessonsByLevel({ hello: [1, 2] }).starlight
    const mixed = {
      hello: [1, 2],
      ...Object.fromEntries(modules1.map((m) => [m.slug, m.lessons.map((l) => l.id)])),
    }
    const after = countLessonsByLevel(mixed)
    expect(after.starlight).toBe(starterBefore)
    expect(after.starlight1).toBe(96)
    // 两册各自都不超自己的分母
    expect(after.starlight).toBeLessThanOrEqual(STARLIGHT_LEVELS.starlight.lessonCount)
    expect(after.starlight1).toBeLessThanOrEqual(STARLIGHT_LEVELS.starlight1.lessonCount)
  })
})
