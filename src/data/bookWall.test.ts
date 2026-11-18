// 绘本桥梁书馆目录数据的回归测试。
// 钉死「书单是唯一真源」的几条不变量：
//  ① 数量与 slug 唯一（13 套用户书单 + RG = 14）；
//  ② 元数据字段齐全、蓝思区间合法（min ≤ max、为正数）；
//  ③ available=true 必有 linkTo，available=false 必无 linkTo（灰卡不可误导）；
//  ④ 难度分档覆盖全部书、边界正确；
//  ⑤ 可读的恰好是 Fly Guy / Rocket Girl 两套。

import { describe, expect, it } from 'vitest'
import {
  BOOK_SERIES,
  LEXILE_BANDS,
  bandOf,
  bookWallStats,
} from './bookWall'

describe('书馆目录数据', () => {
  it('14 套书（用户 13 套 + 已有 RG），slug 唯一', () => {
    expect(BOOK_SERIES).toHaveLength(14)
    const slugs = BOOK_SERIES.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('每套元数据字段齐全，蓝思区间合法（min ≤ max）', () => {
    for (const s of BOOK_SERIES) {
      expect(s.titleEn.trim(), `${s.slug} 无英文名`).toBeTruthy()
      expect(s.titleZh.trim(), `${s.slug} 无中文名`).toBeTruthy()
      expect(s.author.trim(), `${s.slug} 无作者`).toBeTruthy()
      expect(s.emoji, `${s.slug} 无 emoji`).toBeTruthy()
      expect(s.themes.length, `${s.slug} 无主题`).toBeGreaterThan(0)
      expect(s.lexileMin, `${s.slug} 蓝思下界`).toBeGreaterThan(0)
      expect(s.lexileMax, `${s.slug} 蓝思上界`).toBeGreaterThanOrEqual(s.lexileMin)
      expect(s.grade.trim(), `${s.slug} 无年级`).toBeTruthy()
      // 颜色对（满色 + 柔色）齐全，卡片主题用得上
      expect(s.color).toMatch(/^#/)
      expect(s.colorSoft).toMatch(/^#/)
    }
  })

  it('可读 2 套（Fly Guy / Rocket Girl）必有路由；准备中 12 套必无路由', () => {
    const available = BOOK_SERIES.filter((s) => s.available)
    expect(available).toHaveLength(2)
    expect(available.map((s) => s.slug).sort()).toEqual(['fly-guy', 'rocket-girl'])
    for (const s of available) {
      expect(s.linkTo, `${s.slug} 缺 linkTo`).toBeTruthy()
      expect(s.linkTo).toMatch(/^\//)
    }
    for (const s of BOOK_SERIES.filter((x) => !x.available)) {
      expect(s.linkTo, `${s.slug} 是准备中却给了路由（会误导成可点）`).toBeUndefined()
    }
    expect(bookWallStats).toEqual({ total: 14, available: 2 })
  })

  it('难度分档：每套都落在 起步/进阶/挑战 之一，边界正确', () => {
    const bandIds = LEXILE_BANDS.filter((b) => b.id !== 'all').map((b) => b.id)
    expect(bandIds).toEqual(['start', 'grow', 'challenge'])
    for (const s of BOOK_SERIES) {
      expect(bandIds).toContain(bandOf(s))
    }
    // 边界：399→起步、400→进阶、549→进阶、550→挑战
    const at = (n: number) => bandOf({ ...BOOK_SERIES[0], lexileMin: n, lexileMax: n })
    expect(at(399)).toBe('start')
    expect(at(400)).toBe('grow')
    expect(at(549)).toBe('grow')
    expect(at(550)).toBe('challenge')
  })

  it('书单可被正确排序：可读优先、其余按蓝思下界升序（页面承诺「从易到难」，与数据文件顺序无关）', () => {
    const sorted = [...BOOK_SERIES].sort(
      (a, b) => Number(b.available) - Number(a.available) || a.lexileMin - b.lexileMin,
    )
    expect(sorted[0].slug).toBe('fly-guy')
    expect(sorted[1].slug).toBe('rocket-girl')
    const rest = sorted.slice(2).map((s) => s.lexileMin)
    expect([...rest].sort((a, b) => a - b)).toEqual(rest)
  })
})
