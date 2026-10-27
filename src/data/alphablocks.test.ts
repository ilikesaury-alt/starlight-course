// alphablocks 词库单测：守住「积木练习」的词库契约。
// 规则一改就要在这里对账 —— 特别是「每个词都能被 phonemeSegments 拆出有教学价值的结构」。
import { describe, expect, it } from 'vitest'
import { phonemeSegments } from './phonics'
import {
  BLOCK_DOUBLE_WORDS,
  BLOCK_LEVELS,
  BLOCK_LEVEL_KEYS,
  BLOCK_WORDS,
  blockLevelMeta,
  blockWordsOf,
} from './alphablocks'

describe('BLOCK_WORDS · 词库完整性', () => {
  it('五个级别都有词', () => {
    for (const key of BLOCK_LEVEL_KEYS) {
      expect((BLOCK_WORDS[key] ?? []).length, `级别 ${key} 应有词`).toBeGreaterThan(0)
    }
  })

  it('每个词都有 en / zh / emoji，zh 是日常说法', () => {
    const all = blockWordsOf('red').concat(blockWordsOf('yellow'))
    for (const w of all) {
      expect(w.en.length).toBeGreaterThan(0)
      expect(w.zh.length).toBeGreaterThan(0)
      expect(w.emoji.length).toBeGreaterThan(0)
    }
  })

  it('正课词库内部无重复', () => {
    const seen = new Set<string>()
    const dups: string[] = []
    for (const key of BLOCK_LEVEL_KEYS) {
      for (const w of BLOCK_WORDS[key] ?? []) {
        if (seen.has(w.en)) dups.push(w.en)
        seen.add(w.en)
      }
    }
    expect(dups).toEqual([])
  })

  it('特别篇的词不与正课重复（避免一轮里抽到同一个词两次）', () => {
    const seen = new Set<string>()
    for (const key of BLOCK_LEVEL_KEYS) {
      for (const w of BLOCK_WORDS[key] ?? []) seen.add(w.en)
    }
    const dups = BLOCK_DOUBLE_WORDS.filter((w) => seen.has(w.en))
    expect(dups).toEqual([])
  })

  it('所有词只含英文字母（无撇号/空格，积木块才能一块块点）', () => {
    const all = blockWordsOf('red', true)
    for (const w of all) {
      expect(w.en).toMatch(/^[a-z]+$/)
    }
  })
})

describe('BLOCK_WORDS · 词都能被 phonemeSegments 正确切分', () => {
  it('字母守恒：所有片段拼起来 === 原词', () => {
    const all = blockWordsOf('red', true)
    for (const w of all) {
      const segs = phonemeSegments(w.en)
      expect(segs.map((s) => s.text).join(''), w.en).toBe(w.en)
    }
  })

  it('级别词库与该级别的教学点匹配（别把字母小队的词放进红级）', () => {
    // 红级教单字母：多数词应全部逐字母
    const red = blockWordsOf('red')
    const pure = red.filter((w) => phonemeSegments(w.en).every((s) => s.kind === 'letter'))
    expect(pure.length / red.length).toBeGreaterThan(0.6)
    // 黄级教字母小队：每个词都应至少含一个 team
    for (const w of blockWordsOf('yellow')) {
      const kinds = phonemeSegments(w.en).map((s) => s.kind)
      expect(kinds, `${w.en} 应含字母小队`).toContain('team')
    }
    // 绿级教手拉手：每个词都应至少含一个 blend
    for (const w of blockWordsOf('green')) {
      const kinds = phonemeSegments(w.en).map((s) => s.kind)
      expect(kinds, `${w.en} 应含手拉手`).toContain('blend')
    }
    // 蓝级教魔法E：多数词应含 magic-e
    const blue = blockWordsOf('blue')
    const withMagic = blue.filter((w) => phonemeSegments(w.en).some((s) => s.kind === 'magic-e'))
    expect(withMagic.length / blue.length).toBeGreaterThan(0.6)
  })

  it('特别篇教双写：每个词都含一个 double', () => {
    for (const w of BLOCK_DOUBLE_WORDS) {
      const kinds = phonemeSegments(w.en).map((s) => s.kind)
      expect(kinds, `${w.en} 应含双写`).toContain('double')
    }
  })
})

describe('BLOCK_LEVELS · 级别元信息', () => {
  it('五个级别颜色互不相同（红橙黄绿蓝）', () => {
    const colors = BLOCK_LEVELS.map((l) => l.color)
    expect(new Set(colors).size).toBe(BLOCK_LEVELS.length)
  })

  it('每个级别都有概念名与教学说明', () => {
    for (const l of BLOCK_LEVELS) {
      expect(l.concept.length).toBeGreaterThan(0)
      expect(l.teach.length).toBeGreaterThan(0)
    }
  })
})

describe('blockLevelMeta · 取元信息', () => {
  it('按 key 取', () => {
    expect(blockLevelMeta('yellow').zh).toContain('黄')
  })
  it('未知 key 兜底返回第一级', () => {
    expect(blockLevelMeta('nope' as never).key).toBe('red')
  })
})

describe('blockWordsOf · 取词', () => {
  it('默认不含特别篇', () => {
    const base = blockWordsOf('red')
    expect(base.some((w) => w.en === 'hill')).toBe(false)
  })
  it('withDoubles 时包含特别篇', () => {
    const withD = blockWordsOf('red', true)
    expect(withD.some((w) => w.en === 'hill')).toBe(true)
  })
})
