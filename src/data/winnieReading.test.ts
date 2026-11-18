// Winnie the Witch 阅读适配层的回归测试。
// 钉死：
//  ① 20 个正文页（27 页里剔除纯插画/版权页），页码连续且>0；
//  ② 每句 en/zh 非空，英文无中文标点，咒语拼写正确（校对过 OCR）；
//  ③ 词表全单 token、有中文/emoji；
//  ④ passageOf 按页码返回稳定引用（ReadingZone useEffect 会 cancelSpeech）；
//  ⑤ 不污染两册 Starlight 阅读短文（仍 96/96）。

import { describe, expect, it } from 'vitest'
import { WINNIE_PAGES, WINNIE_VOCAB } from './winnie'
import {
  WINNIE_READING_SOURCE,
  winnieHeroWords,
  winniePassage,
  winniePassageOf,
  winnieStats,
} from './winnieReading'
import { READING_PASSAGES } from './reading'
import { READING_PASSAGES1 } from './starlight1/reading'

describe('Winnie 绘本数据', () => {
  it('20 个正文页，页码升序且无纯插画页（4/6/11/18）', () => {
    expect(WINNIE_PAGES).toHaveLength(20)
    const pages = WINNIE_PAGES.map((p) => p.page)
    expect(pages).toEqual([...pages].sort((a, b) => a - b))
    for (const n of [4, 6, 11, 18]) expect(pages).not.toContain(n)
    expect(winnieStats.pages).toBe(20)
  })

  it('每页都有句子，每句 en/zh 非空，英文无中文标点', () => {
    for (const p of WINNIE_PAGES) {
      expect(p.sentences.length, `page ${p.page} 无句`).toBeGreaterThan(0)
      const seen = new Set<string>()
      for (const s of p.sentences) {
        expect(s.en.trim(), `page ${p.page} 空英文`).toBeTruthy()
        expect(s.zh.trim(), `page ${p.page} 空中文: ${s.en}`).toBeTruthy()
        expect(s.en, `page ${p.page} 含中文标点`).not.toMatch(/[\u3000-\u303f\uff00-\uffef]/)
        const k = s.en.toLowerCase().replace(/\s+/g, ' ')
        expect(seen.has(k), `page ${p.page} 重复句: ${s.en}`).toBe(false)
        seen.add(k)
      }
    }
  })

  it('咒语拼写是 ABRACADABRA（OCR 误识别的 ABRAGADABRA 已修）', () => {
    const all = WINNIE_PAGES.flatMap((p) => p.sentences.map((s) => s.en)).join(' ')
    expect(all).toContain('ABRACADABRA')
    expect(all).not.toContain('ABRAGADABRA')
  })

  it('OCR 常见识别错误已修：closed / anyway / climbed', () => {
    const all = WINNIE_PAGES.flatMap((p) => p.sentences.map((s) => s.en)).join(' ')
    expect(all).toContain('closed his eyes')
    expect(all).not.toMatch(/\bdosed\b/)
    expect(all).toContain('anyway')
    expect(all).not.toContain('angway')
    expect(all).toContain('climbed')
    expect(all).not.toContain('dlimbed')
  })

  it('词表全单 token、有中文和 emoji，全局去重', () => {
    const seen = new Set<string>()
    for (const w of WINNIE_VOCAB) {
      expect(w.en).toMatch(/^[a-z]+$/)
      expect(w.zh).toBeTruthy()
      expect(w.emoji).toBeTruthy()
      expect(seen.has(w.en)).toBe(false)
      seen.add(w.en)
    }
    expect(WINNIE_VOCAB.length).toBeGreaterThan(30)
  })
})

describe('Winnie 阅读适配层', () => {
  it('1 个单元（这本书），20 课（正文页），无死链', () => {
    expect(WINNIE_READING_SOURCE.mods).toHaveLength(1)
    const mod = WINNIE_READING_SOURCE.mods[0]
    expect(mod.lessons).toHaveLength(20)
    for (const l of mod.lessons) {
      expect(WINNIE_READING_SOURCE.passageOf(mod.id, l.id), `${l.id} 是死链`).toBeDefined()
    }
  })

  it('passageOf 按页码返回稳定引用（缓存）', () => {
    expect(winniePassageOf(1, 3)).toBe(winniePassageOf(1, 3))
    for (const l of WINNIE_READING_SOURCE.mods[0].lessons) {
      expect(WINNIE_READING_SOURCE.passageOf(1, l.id)).toBe(
        WINNIE_READING_SOURCE.passageOf(1, l.id),
      )
    }
  })

  it('原文课标题写「绘本原文」；越界页码返回 undefined', () => {
    const p = winniePassage(3)!
    expect(p.title).toBe('Page 3')
    expect(p.titleZh).toBe('绘本原文')
    expect(winniePassage(4)).toBeUndefined() // 纯插画页
    expect(winniePassageOf(1, 99)).toBeUndefined() // 没有这一页
    expect(winniePassageOf(1, 99)).toBe(winniePassageOf(1, 99)) // undefined 也缓存，稳定
  })

  it('首屏宝藏词是书里真实出现过的词，共 5 个', () => {
    expect(winnieHeroWords).toHaveLength(5)
    const bookWords = new Set(WINNIE_VOCAB.map((w) => w.en))
    for (const w of winnieHeroWords) expect(bookWords.has(w)).toBe(true)
  })

  it('自定义书：没有 level；两册 Starlight 短文未被污染，仍 96/96', () => {
    expect(WINNIE_READING_SOURCE.level).toBeUndefined()
    expect(Object.keys(READING_PASSAGES)).toHaveLength(96)
    expect(Object.keys(READING_PASSAGES1)).toHaveLength(96)
  })
})
