// 青蛙与蟾蜍阅读适配层的回归测试。
// 钉死：
//  ① 4 本子书 = 4 单元，每本 5 故事 = 20 课；
//  ② 20 故事共 953 句，每句 en/zh 非空，英文无中文标点、无 OCR 残留；
//  ③ 词表全单 token、有中文/emoji；
//  ④ passageOf 按书号+课号返回稳定引用（ReadingZone useEffect 会 cancelSpeech）；
//  ⑤ 不污染两册 Starlight 阅读短文（仍 96/96）。
//  ⑥ 词典覆盖：20 故事每个词形都能查到中文（点词不出「这句的意思」兜底）。

import { describe, expect, it } from 'vitest'
import { FROG_BOOKS, FROG_VOCAB, frogStats } from './frogAndToad'
import {
  FROG_READING_SOURCE,
  frogHeroWords,
  frogPassage,
  frogPassageOf,
  frogReadingStats,
} from './frogAndToadReading'
import { READING_PASSAGES } from './reading'
import { READING_PASSAGES1 } from './starlight1/reading'
import { lookupZh, wordBase } from '@/utils/bookDict'
import { FROG_DICT } from './frogDict'

describe('青蛙与蟾蜍数据', () => {
  it('4 本子书，每本 5 故事，共 20 课', () => {
    expect(FROG_BOOKS).toHaveLength(4)
    expect(frogStats.books).toBe(4)
    expect(frogStats.booksReady).toBe(4)
    expect(FROG_BOOKS[0].title).toBe('Frog and Toad Are Friends')
    for (const b of FROG_BOOKS) {
      expect(b.stories, `${b.title} 应 5 故事`).toHaveLength(5)
    }
    expect(frogStats.stories).toBe(20)
    expect(frogReadingStats).toBe(frogStats)
  })

  it('20 故事共 953 句，每句 en/zh 非空、英文无中文标点、无 OCR 残留', () => {
    let total = 0
    for (const book of FROG_BOOKS) {
      for (const s of book.stories) {
        for (const line of s.sentences) {
          total++
          expect(line.en.trim(), `${s.title} 空英文`).toBeTruthy()
          expect(line.zh.trim(), `${s.title} 空中文: ${line.en}`).toBeTruthy()
          expect(line.en, `${s.title} 含中文标点`).not.toMatch(/[\u3000-\u303f\uff00-\uffef]/)
          // OCR 噪声：孤立的 T 误识为 I（句首/引号后 "T will / 'T am）
          expect(line.en, `${s.title} 残留 T 误识`).not.toMatch(/\bT (will|am|cannot|have|think|do|is)\b/)
        }
      }
    }
    expect(total).toBe(953)
    expect(frogStats.sentences).toBe(953)
  })

  it('四本书的故事标题齐全且顺序正确', () => {
    expect(FROG_BOOKS.map((b) => b.stories.map((s) => s.title))).toEqual([
      ['Spring', 'The Story', 'A Lost Button', 'A Swim', 'The Letter'],
      ['A List', 'The Garden', 'Cookies', 'Dragons and Giants', 'The Dream'],
      ['Down the Hill', 'The Corner', 'Ice Cream', 'The Surprise', 'Christmas Eve'],
      ['Tomorrow', 'The Kite', 'Shivers', 'The Hat', 'Alone'],
    ])
  })

  it('词表全单 token、有中文和 emoji，全局去重', () => {
    const seen = new Set<string>()
    for (const w of FROG_VOCAB) {
      expect(w.en).toMatch(/^[a-z]+$/)
      expect(w.zh).toBeTruthy()
      expect(w.emoji).toBeTruthy()
      expect(seen.has(w.en)).toBe(false)
      seen.add(w.en)
    }
    expect(FROG_VOCAB.length).toBeGreaterThan(30)
  })
})

describe('青蛙与蟾蜍阅读适配层', () => {
  it('4 单元各 5 课，共 20 课，无死链', () => {
    expect(FROG_READING_SOURCE.mods).toHaveLength(4)
    for (const m of FROG_READING_SOURCE.mods) {
      expect(m.lessons, `${m.title} 课数`).toHaveLength(5)
      for (const l of m.lessons) {
        expect(FROG_READING_SOURCE.passageOf(m.id, l.id), `${m.id}-${l.id} 是死链`).toBeDefined()
      }
    }
  })

  it('passageOf 返回稳定引用（缓存）', () => {
    expect(frogPassageOf(1, 1)).toBe(frogPassageOf(1, 1))
    for (const l of FROG_READING_SOURCE.mods[0].lessons) {
      expect(FROG_READING_SOURCE.passageOf(1, l.id)).toBe(
        FROG_READING_SOURCE.passageOf(1, l.id),
      )
    }
  })

  it('按书号+故事标题取页；越界返回 undefined 且稳定', () => {
    const p = frogPassage(1, 'spring')!
    expect(p.title).toBe('Spring')
    expect(p.titleZh).toBe('春天')
    // 同名故事分属不同书：spring 只属于第 1 本
    expect(frogPassage(2, 'spring')).toBeUndefined()
    expect(frogPassage(2, 'a-list')).toBeDefined()
    expect(frogPassage(1, 'nope')).toBeUndefined()
    expect(frogPassageOf(1, 99)).toBeUndefined()
    expect(frogPassageOf(9, 1)).toBeUndefined()
    expect(frogPassageOf(1, 99)).toBe(frogPassageOf(1, 99)) // undefined 也缓存
  })

  it('首屏宝藏词是第一本书真实出现过的词，共 5 个', () => {
    expect(frogHeroWords).toHaveLength(5)
    const book1Words = new Set(FROG_BOOKS[0].stories.flatMap((s) => s.words.map((w) => w.en)))
    for (const w of frogHeroWords) expect(book1Words.has(w)).toBe(true)
  })

  it('自定义书：没有 level；两册 Starlight 短文未被污染，仍 96/96', () => {
    expect(FROG_READING_SOURCE.level).toBeUndefined()
    expect(Object.keys(READING_PASSAGES)).toHaveLength(96)
    expect(Object.keys(READING_PASSAGES1)).toHaveLength(96)
  })
})

describe('词典覆盖（点词必出释义）', () => {
  it('FROG_DICT 自身合法：key 全小写单 token，value 非空', () => {
    expect(Object.keys(FROG_DICT).length).toBeGreaterThan(200)
    for (const [en, zh] of Object.entries(FROG_DICT)) {
      expect(en).toMatch(/^[a-z]+$/)
      expect(zh.trim()).toBeTruthy()
    }
  })

  it('20 故事每个词形都能在词典查到中文（覆盖率 100%）', () => {
    let total = 0
    const miss: string[] = []
    for (const b of FROG_BOOKS) {
      for (const s of b.stories) {
        for (const line of s.sentences) {
          for (const tk of line.en.split(/\s+/)) {
            const base = wordBase(tk)
            if (!base) continue
            total++
            if (!lookupZh(base)) miss.push(`${base}（${s.title}）`)
          }
        }
      }
    }
    expect(total).toBeGreaterThan(7000)
    expect(miss, `查不到的词：${miss.slice(0, 20).join(', ')}`).toHaveLength(0)
  })

  it('主角词与高频词有中文释义（toad / button / woods / porch）', () => {
    for (const w of ['toad', 'button', 'woods', 'porch', 'spring']) {
      expect(lookupZh(w), `${w} 无释义`).toBeTruthy()
    }
  })
})
