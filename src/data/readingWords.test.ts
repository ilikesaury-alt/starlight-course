import { describe, it, expect } from 'vitest'
import {
  DECODE_GROUPS,
  DECODE_WORDS,
  GROUP_REQUIRED_KIND,
  decodeSegments,
} from './decoding'
import {
  SIGHT_LEVELS,
  sightWordsOf,
  allSightWords,
  lookalikes,
} from './sightWords'
import { BLOCK_WORDS } from './alphablocks'

describe('解码词库：每组必须真的体现该组教学点', () => {
  for (const g of DECODE_GROUPS) {
    it(`${g.zh} 组每个词都拆出 ${GROUP_REQUIRED_KIND[g.key]} 且片段拼回原词`, () => {
      const words = DECODE_WORDS[g.key]
      expect(words.length).toBeGreaterThan(0)
      for (const w of words) {
        const segs = decodeSegments(w.en)
        expect(
          segs.map((s) => s.kind).includes(GROUP_REQUIRED_KIND[g.key]),
          `${w.en} 应含 ${GROUP_REQUIRED_KIND[g.key]}，实际 ${segs.map((s) => s.kind).join('/')}`,
        ).toBe(true)
        expect(segs.map((s) => s.text).join('')).toBe(w.en.toLowerCase().replace(/[^a-z]/g, ''))
        expect(w.zh.length).toBeGreaterThan(0)
        expect(w.emoji.length).toBeGreaterThan(0)
      }
    })
  }

  it('解码词不与字母积木词库重合（否则孩子靠背发音蒙对，不是真解码）', () => {
    const ab = new Set(
      Object.values(BLOCK_WORDS).flat().map((w) => w.en.toLowerCase()),
    )
    for (const list of Object.values(DECODE_WORDS)) {
      for (const w of list) {
        expect(ab.has(w.en.toLowerCase()), `${w.en} 不能出现在字母积木词库里`).toBe(false)
      }
    }
  })
})

describe('高频词表', () => {
  it('三级各 26 词，全局无重复、中文非空', () => {
    const all: string[] = []
    for (const lv of SIGHT_LEVELS) {
      const list = sightWordsOf(lv.key)
      expect(list.length).toBe(26)
      for (const w of list) {
        expect(w.zh.length).toBeGreaterThan(0)
        all.push(w.en.toLowerCase())
      }
    }
    expect(new Set(all).size).toBe(all.length)
    expect(allSightWords()).toHaveLength(all.length)
  })

  it('high-frequency 功能词都在表内（the/a/and/is/was/said）', () => {
    const set = new Set(allSightWords())
    for (const w of ['the', 'a', 'and', 'is', 'was', 'said', 'you', 'with']) {
      expect(set.has(w), `缺高频词 ${w}`).toBe(true)
    }
  })

  it('形近词干扰项：排除自身、长度差 ≤1、真的长得像', () => {
    const near = lookalikes('the', 2)
    expect(near).toContain('he')
    expect(near).not.toContain('the')
    for (const n of near) expect(Math.abs(n.length - 3)).toBeLessThanOrEqual(1)
  })

  it('看起来该按整体认读、不能拼读的词不给出 emoji（靠词形认，不靠图）', () => {
    // 数据结构层面：SightWord 根本没有 emoji 字段，防止后来有人"顺手加个图"
    for (const lv of SIGHT_LEVELS) {
      for (const w of sightWordsOf(lv.key)) {
        expect('emoji' in w).toBe(false)
      }
    }
  })
})
