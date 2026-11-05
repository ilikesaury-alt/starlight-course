// Starlight 系列门面回归测试。
//
// 守的是一类**静默**错误：两册教材的单元号都从 1 开始（预备级 1–12、第一册 1–9），
// slug 不冲突但单元号重复。只要有一处「按裸单元号取数据」漏改，
// 第一册的 Unit 1 就会显示预备级 Unit 1 的课文/句型卡/拓展词 ——
// 页面不报错、不白屏，只是读的是另一本书，孩子和家长很难当场发现。
//
// 所以这里逐条钉死「按册分发」这件事。
//
// 元信息（starlightSeries.ts，零数据依赖）与数据门面（starlightSeriesData.ts，
// 带两册教材数据）分开也是被测的一部分：元信息文件必须保持不 import 教材数据，
// 否则首页首屏 chunk 会被顶大。

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { STARLIGHT_LEVELS, STARLIGHT_LEVEL_ORDER, parseSeriesLessonKey } from './starlightSeries'
import {
  SERIES_MODULES,
  getSeriesModule,
  moduleByUnitId,
  modulesOfLevel,
  quizLessonIdOf,
  seriesBook,
  seriesFrames,
  seriesLessonKey,
  seriesReading,
  unitCountOfLevel,
} from './starlightSeriesData'
import { getLessonBook } from './starlight-book'
import { framesOfLesson } from './sentenceFrame'
import { STARLIGHT_BOOK1 } from './starlight1'

describe('Starlight 系列门面', () => {
  it('两册的单元 slug 全局唯一（slug 是跨册唯一主键）', () => {
    const slugs = SERIES_MODULES.map((m) => m.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('两册的单元号确实重叠 —— 这正是必须按册分发的原因', () => {
    const starter = modulesOfLevel('starlight')
    const level1 = modulesOfLevel('starlight1')
    const overlap = starter.filter((s) => level1.some((o) => o.id === s.id))
    // 重叠是事实，不是 bug：门面的存在意义就是让这些同号单元互不串数据
    expect(overlap.length).toBeGreaterThan(0)
  })

  it('第一册单元取到的是第一册的课文，不是同号的预备级课文', () => {
    const m1 = moduleByUnitId('starlight1', 1)!
    expect(m1).toBeDefined()
    const mine = seriesBook(m1, 1)
    const starterSame = getLessonBook(1, 1)
    expect(mine).toBeDefined()
    // 同号不同书：不能是同一份数据
    expect(mine).not.toBe(starterSame)
    expect(mine!.title).not.toBe(starterSame?.title)
  })

  it('第一册单元取到的是第一册的句型卡，不是同号的预备级句型卡', () => {
    const m = moduleByUnitId('starlight1', 3)!
    const frames = seriesFrames(m, 5)
    expect(frames.length).toBeGreaterThan(0)
    // 句型卡的 unitSlug 必须是第一册这一册自己的 slug
    for (const f of frames) expect(f.unitSlug).toBe(m.slug)
    // 同号的预备级单元取不到第一册的卡
    expect(framesOfLesson(m.slug, 5)).toHaveLength(0)
  })

  it('第一册每个单元的每一课都有课本原文', () => {
    for (const m of modulesOfLevel('starlight1')) {
      for (const l of m.lessons) {
        expect(seriesBook(m, l.id), `第一册 M${m.id} L${l.id} 缺课文`).toBeDefined()
      }
    }
  })

  it('第一册的阅读短文也按册取（与预备级不同源）', () => {
    const m = moduleByUnitId('starlight1', 3)!
    const passage = seriesReading(m, 3)
    expect(passage).toBeDefined()
    expect(passage!.titleZh).toBeTruthy()
  })

  it('拓展词 key 跨册不撞，且两册格式都能被解析回来', () => {
    const starter = moduleByUnitId('starlight', 1)!
    const level1 = moduleByUnitId('starlight1', 1)!
    const k0 = seriesLessonKey(starter, 3)
    const k1 = seriesLessonKey(level1, 3)
    expect(k0).not.toBe(k1)
    expect(parseSeriesLessonKey(k0)).toEqual({ level: 'starlight', unitId: 1, lessonId: 3 })
    expect(parseSeriesLessonKey(k1)).toEqual({ level: 'starlight1', unitId: 1, lessonId: 3 })
    expect(parseSeriesLessonKey('s1-3-2')).toEqual({ level: 'starlight1', unitId: 3, lessonId: 2 })
  })

  it('单元测验记完成用的课号落在该单元真实课号范围内', () => {
    for (const m of SERIES_MODULES) {
      const id = quizLessonIdOf(m)
      expect(m.lessons.some((l) => l.id === id), `${m.slug} 的测验课号 ${id} 不存在`).toBe(true)
    }
  })

  it('每册的单元数与目录页口径一致', () => {
    for (const level of STARLIGHT_LEVEL_ORDER) {
      expect(unitCountOfLevel(level)).toBe(modulesOfLevel(level).length)
      expect(STARLIGHT_LEVELS[level].path).toMatch(/^\/starlight/)
    }
  })

  it('第一册课本原文表的每个键都指向真实存在的单元与课', () => {
    for (const key of Object.keys(STARLIGHT_BOOK1)) {
      const m = /^(\d+)-(\d+)$/.exec(key)
      expect(m, `第一册课文键 ${key} 不是「单元号-课号」格式`).not.toBeNull()
      const [, unitId, lessonId] = m!
      const mod = moduleByUnitId('starlight1', Number(unitId))
      expect(mod, `第一册课文键 ${key} 指向不存在的单元`).toBeDefined()
      expect(
        mod!.lessons.some((l) => l.id === Number(lessonId)),
        `第一册课文键 ${key} 指向不存在的课`,
      ).toBe(true)
    }
  })
})

describe('Starlight 系列门面 · 单元查询', () => {
  it('getSeriesModule 能跨册命中', () => {
    const m = getSeriesModule('monty-the-clown')
    expect(m?.level).toBe('starlight1')
    expect(getSeriesModule('hello')?.level).toBe('starlight')
    expect(getSeriesModule('不存在的单元')).toBeUndefined()
  })
})

describe('Starlight 系列门面 · 首屏 chunk 守卫', () => {
  // 元信息文件被首页、系列切换条等全局位置引用。一旦它 import 了教材数据，
  // 两册课程数据（约 1MB 源码）就会进首屏 chunk —— 实测光这一处 +227KB。
  // 这条断言把「元信息文件保持零数据依赖」钉死，别让后人顺手加个 import。
  it('starlightSeries.ts 不 import 任何教材数据', () => {
    const src = readFileSync(fileURLToPath(new URL('./starlightSeries.ts', import.meta.url)), 'utf8')
    expect(src).not.toMatch(/from '\.\/starlight1'/)
    expect(src).not.toMatch(/from '\.\/starlight'/)
    expect(src).not.toMatch(/from '\.\/starlight-book'/)
    expect(src).not.toMatch(/from '\.\/sentenceFrame'/)
  })

  it('store 不再 import 教材数据（store 被几乎每个页面引用）', () => {
    const src = readFileSync(
      fileURLToPath(new URL('../store/useCourseStore.ts', import.meta.url)),
      'utf8',
    )
    expect(src).not.toMatch(/from '\.\.\/data\/starlightSeriesData'/)
    expect(src).not.toMatch(/from '\.\.\/data\/starlight1'/)
  })
})
