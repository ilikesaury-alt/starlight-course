// Fly Guy → 阅读模块适配层的回归测试。
//
// 钉死六件事：
//  ① 22 本书 = 22 个单元；15 本有原文的按章拆课，7 本只有 1 节例句课；
//  ② 每课都能产出阅读页，且每句都有英文和中文；
//  ③ 原文章数与句数与 flyguy.ts 的 bookText 一致（457 页一句不少）；
//  ④ 标题文案诚实：原文课说「绘本原文」、例句课说「这一本的例句」，各不冒充；
//  ⑤ 词表全是单 token、有中文（TappableWords 才能命中高亮）；
//  ⑥ passageOf 返回稳定引用（ReadingZone 的 useEffect([passage]) 会 cancelSpeech）。

import { describe, expect, it } from 'vitest'
import { flyGuyStories } from './flyguy'
import { READING_PASSAGES } from './reading'
import { READING_PASSAGES1 } from './starlight1/reading'
import {
  FG_READING_SOURCE,
  FG_SENTENCES_PER_PASSAGE,
  fgChapterPassage,
  fgHeroWords,
  fgPassageOf,
  fgReadingStats,
  fgReadingVocab,
  fgSentencePassage,
} from './flyguyReading'

describe('书 → 单元映射', () => {
  it('22 本书 → 22 个单元，slug 与书序号对齐', () => {
    expect(fgReadingStats.books).toBe(22)
    expect(FG_READING_SOURCE.mods).toHaveLength(22)
    for (let i = 0; i < 22; i++) {
      expect(FG_READING_SOURCE.mods[i].slug).toBe(`fg-book-${i + 1}`)
    }
  })

  it('15 本有原文的书按章拆课（共 58 章），7 本无原文的书收 1 节例句课', () => {
    expect(fgReadingStats.withBookText).toBe(15)
    expect(fgReadingStats.chapters).toBe(58)
    for (let i = 0; i < flyGuyStories.length; i++) {
      const m = FG_READING_SOURCE.mods[i]
      const story = flyGuyStories[i]
      const wantLessons = (story.bookText?.length ?? 0) > 0 ? story.bookText!.length : 1
      expect(m.lessons, `${m.title} 课数不对`).toHaveLength(wantLessons)
      expect(wantLessons, `第 ${i + 1} 本课数`).toBeGreaterThan(0)
    }
  })

  it('课标题：原文章印章节名，例句课叫 Sample Sentences', () => {
    const book1 = FG_READING_SOURCE.mods[0]
    expect(book1.lessons[0].title).toBe('Chapter 1')
    for (const l of book1.lessons) expect(l.titleZh).toBe('绘本原文')
    const petIdx = flyGuyStories.findIndex((s) => s.title.startsWith('A Pet for Fly Guy'))
    const pet = FG_READING_SOURCE.mods[petIdx]
    expect(pet.lessons).toHaveLength(1)
    expect(pet.lessons[0].title).toBe('Sample Sentences')
    expect(pet.lessons[0].titleZh).toBe('这一本的例句')
  })

  it('单元标题按「 · 」拆中英：英文是书名、中文非空', () => {
    expect(FG_READING_SOURCE.mods[0].title).toBe('Hi! Fly Guy')
    expect(FG_READING_SOURCE.mods[0].titleZh).toBe('你好，小蝇怪')
    for (const m of FG_READING_SOURCE.mods) {
      expect(m.title.trim()).toBeTruthy()
      expect(m.titleZh.trim()).toBeTruthy()
      expect(m.title).not.toContain(' · ')
    }
  })
})

describe('fgPassageOf', () => {
  it('每本书每一课都是死链可点的：页面非空', () => {
    for (const m of FG_READING_SOURCE.mods) {
      for (const l of m.lessons) {
        expect(FG_READING_SOURCE.passageOf(m.id, l.id), `${m.title} ${l.id} 是死链`).toBeDefined()
      }
    }
  })

  it('原文章的句数 = 该章 pages 数（一句不少、一句不多）', () => {
    for (const story of flyGuyStories) {
      story.bookText?.forEach((c, ci) => {
        const p = fgChapterPassage(story, ci)!
        expect(p.titleZh).toBe('绘本原文')
        expect(p.paragraphs[0], `${story.title} ${c.chapter}`).toHaveLength(c.pages.length)
      })
    }
  })

  it('例句课 ≤ 10 句、每句都有英文和中文、同篇无重复句', () => {
    for (const story of flyGuyStories) {
      if ((story.bookText?.length ?? 0) > 0) continue
      const p = fgSentencePassage(story)!
      const lines = p.paragraphs.flat()
      expect(lines.length, `${story.title} 句数`).toBeGreaterThan(0)
      expect(lines.length).toBeLessThanOrEqual(FG_SENTENCES_PER_PASSAGE)
      const seen = new Set<string>()
      for (const l of lines) {
        expect(l.en.trim()).toBeTruthy()
        expect(l.zh.trim(), `${story.title} 空中文: ${l.en}`).toBeTruthy()
        const k = l.en.toLowerCase().replace(/\s+/g, ' ')
        expect(seen.has(k), `${story.title} 重复句: ${l.en}`).toBe(false)
        seen.add(k)
      }
    }
  })

  it('全库 22 本书 78 课每句都有英文和中文（含原文章）', () => {
    let lessons = 0
    for (const m of FG_READING_SOURCE.mods) {
      for (const l of m.lessons) {
        lessons++
        const lines = FG_READING_SOURCE.passageOf(m.id, l.id)!.paragraphs.flat()
        expect(lines.length, `${m.title} ${l.id} 空篇`).toBeGreaterThan(0)
        for (const line of lines) {
          expect(line.en.trim()).toBeTruthy()
          expect(line.zh.trim(), `${m.title} ${l.id} 空中文: ${line.en}`).toBeTruthy()
          // 英文句不带中文标点（与 readingPassage.test.ts 同一条纪律）
          expect(line.en).not.toMatch(/[\u3000-\u303f\uff00-\uffef]/)
        }
      }
    }
    expect(lessons).toBe(58 + 7)
  })

  it('返回稳定引用（.toBe()），越界返回 undefined', () => {
    expect(fgPassageOf(1, 1)).toBe(fgPassageOf(1, 1))
    for (const m of FG_READING_SOURCE.mods) {
      for (const l of m.lessons) {
        expect(FG_READING_SOURCE.passageOf(m.id, l.id)).toBe(
          FG_READING_SOURCE.passageOf(m.id, l.id),
        )
      }
    }
    expect(fgPassageOf(1, 99)).toBeUndefined() // 书 1 只有 3 章
    expect(fgPassageOf(99, 1)).toBeUndefined()
    expect(fgPassageOf(0, 1)).toBeUndefined() // bookId 从 1 起
  })

  it('原文书不接受例句课（lessonId 超出章数即 undefined）', () => {
    // Hi! Fly Guy 有 3 章：lessonId=4 不该回落到例句页
    expect(fgPassageOf(1, 4)).toBeUndefined()
    expect(fgPassageOf(1, 4)).toBe(fgPassageOf(1, 4)) // undefined 也缓存，稳定
  })
})

describe('fgReadingVocab', () => {
  it('每本都有词，且全是单 token、有中文、有 emoji', () => {
    for (const story of flyGuyStories) {
      const vocab = fgReadingVocab(story)
      expect(vocab.length, `${story.title} 无词`).toBeGreaterThan(0)
      for (const w of vocab) {
        expect(w.en).toMatch(/^[a-z]+$/)
        expect(w.zh).toBeTruthy()
        expect(w.emoji).toBeTruthy()
      }
    }
  })

  it('同本内按 token 去重', () => {
    for (const story of flyGuyStories) {
      const ens = fgReadingVocab(story).map((w) => w.en)
      expect(new Set(ens).size).toBe(ens.length)
    }
  })

  it('首屏宝藏词示例是第一本真实出现过的词，共 5 个', () => {
    expect(fgHeroWords).toHaveLength(5)
    const book1 = new Set(fgReadingVocab(flyGuyStories[0]).map((w) => w.en))
    for (const w of fgHeroWords) expect(book1.has(w)).toBe(true)
  })
})

describe('与两册 Starlight 的边界', () => {
  it('两册阅读短文数据未被 FG 污染，仍是 96/96', () => {
    expect(Object.keys(READING_PASSAGES)).toHaveLength(96)
    expect(Object.keys(READING_PASSAGES1)).toHaveLength(96)
  })

  it('FG 是自定义书：没有 level（不渲染系列切换条）', () => {
    expect(FG_READING_SOURCE.level).toBeUndefined()
  })
})
