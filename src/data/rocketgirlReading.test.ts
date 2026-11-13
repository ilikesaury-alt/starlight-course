// Rocket Girl → 阅读模块适配层的回归测试。
//
// 钉死五件事：
//  ① 108 集故事按标题里的故事弧分成 27 组、每组 4 集（标题冒号前的共同前缀）；
//  ② 每集都能产出一个阅读页，≤ 10 句、不分页，且每句都有中文；
//  ③ 词表归一化：多词短语 / 带括号噪声被剔除，否则 TappableWords 永不命中高亮；
//  ④ 标题文案诚实：说「例句」，不冒充「绘本原文 / 小故事」；
//  ⑤ 查词链覆盖率 ≥ 95%，且**不污染全局词典**（BOOK_WORD_ZH 大小不变）。

import { describe, expect, it } from 'vitest'
import { rocketGirlStories } from './rocketgirl'
import {
  RG_GLOSS_SIZE,
  RG_READING_SOURCE,
  RG_SENTENCES_PER_PASSAGE,
  lookupRgZh,
  rgArcCount,
  rgArcs,
  rgHeroWords,
  rgPassage,
  rgPassageOf,
  rgReadingVocab,
  rgStoryCount,
} from './rocketgirlReading'
import { BOOK_WORD_ZH, lookupZh, wordBase } from '@/utils/bookDict'
import { READING_PASSAGES } from './reading'
import { READING_PASSAGES1 } from './starlight1/reading'

describe('故事弧分组', () => {
  it('108 集 → 27 条弧 × 4 集，顺序稳定', () => {
    expect(rgStoryCount).toBe(108)
    expect(rgArcCount).toBe(27)
    expect(rgArcs).toHaveLength(27)
    expect(rgArcs[0].name).toBe('Rocket Girl and the Aliens')
    expect(rgArcs[26].name).toBe('Rocket Girl vs. the Villains')
    for (const arc of rgArcs) {
      expect(arc.stories, `${arc.name} 不是 4 集`).toHaveLength(4)
      expect(arc.emoji).toBeTruthy()
    }
  })

  it('弧名 = 标题冒号前去掉结尾序号（不把「1:」当名字的一部分）', () => {
    for (const arc of rgArcs) {
      expect(arc.name).not.toMatch(/\s\d+$/)
      expect(arc.name.startsWith('Rocket Girl')).toBe(true)
    }
  })

  it('每个单元 = 一条弧，每单元 4 课；没有死链', () => {
    expect(RG_READING_SOURCE.mods).toHaveLength(27)
    for (const m of RG_READING_SOURCE.mods) {
      expect(m.lessons, `${m.title} 课数不对`).toHaveLength(4)
      for (const l of m.lessons) {
        expect(RG_READING_SOURCE.passageOf(m.id, l.id), `${m.id}-${l.id} 是死链`).toBeDefined()
      }
    }
  })
})

describe('rgPassage', () => {
  it('108 集每集都产出非空阅读页，且 ≤ 10 句（不再分页）', () => {
    for (const s of rocketGirlStories) {
      const p = rgPassage(s)
      expect(p, `${s.slug} 没有阅读页`).toBeDefined()
      expect(p!.paragraphs).toHaveLength(1)
      const n = p!.paragraphs.flat().length
      expect(n, `${s.slug} 有 ${n} 句`).toBeGreaterThan(0)
      expect(n).toBeLessThanOrEqual(RG_SENTENCES_PER_PASSAGE)
    }
  })

  it('每句都有英文和中文，且同篇无完全重复句', () => {
    for (const s of rocketGirlStories) {
      const lines = rgPassage(s)!.paragraphs.flat()
      const seen = new Set<string>()
      for (const l of lines) {
        expect(l.en.trim(), `${s.slug} 空英文`).toBeTruthy()
        expect(l.zh.trim(), `${s.slug} 空中文: ${l.en}`).toBeTruthy()
        const k = l.en.toLowerCase().replace(/\s+/g, ' ')
        expect(seen.has(k), `${s.slug} 重复句: ${l.en}`).toBe(false)
        seen.add(k)
      }
    }
  })

  it('句点前的空格被清掉，且「School.」与「School .」算同一句（不重复念）', () => {
    // 真实数据：rg-1 里同一句有两种写法，只按空白折叠去重会漏。
    for (const s of rocketGirlStories) {
      for (const l of rgPassage(s)!.paragraphs.flat()) {
        expect(l.en, `${s.slug} 标点前有空格`).not.toMatch(/\s[.,!?;:]/)
      }
    }
    const rg1 = rgPassage(rocketGirlStories[0])!.paragraphs.flat()
    const school = rg1.filter((l) => /Elementary School/.test(l.en))
    expect(school, '同一句不该出现两遍').toHaveLength(1)
  })

  it('标题明确说「例句」，不冒充绘本原文 / 小故事', () => {
    for (const s of rocketGirlStories) {
      const p = rgPassage(s)!
      expect(p.title).toBe(s.title)
      expect(p.titleZh).toContain('例句')
      expect(p.titleZh).not.toContain('绘本原文')
      expect(p.titleZh).not.toContain('小故事')
    }
  })
})

describe('rgReadingVocab', () => {
  it('每集都有词，且全是单 token（多词短语 / 括号噪声已剔除）', () => {
    for (const s of rocketGirlStories) {
      const vocab = rgReadingVocab(s)
      expect(vocab.length, `${s.slug} 无词`).toBeGreaterThan(0)
      for (const w of vocab) {
        expect(w.en).toMatch(/^[a-z]+$/)
        expect(w.zh).toBeTruthy()
        expect(w.emoji).toBeTruthy()
      }
    }
  })

  it('同集内按 token 去重', () => {
    for (const s of rocketGirlStories) {
      const ens = rgReadingVocab(s).map((w) => w.en)
      expect(new Set(ens).size).toBe(ens.length)
    }
  })

  it('首屏宝藏词示例是第一条弧真实出现过的词', () => {
    expect(rgHeroWords).toHaveLength(5)
    const arc1 = new Set(rgArcs[0].stories.flatMap((s) => rgReadingVocab(s).map((w) => w.en)))
    for (const w of rgHeroWords) expect(arc1.has(w)).toBe(true)
  })
})

describe('lookupRgZh', () => {
  it('命中全局词典', () => {
    expect(lookupRgZh('cat')).toBe('猫')
  })

  it('命中 RG 自动词表（课本词典里没有的词）', () => {
    expect(lookupZh('metro')).toBeUndefined()
    expect(lookupRgZh('metro')).toBeTruthy()
  })

  it('词形回退：bounced → bounce、cries → cry', () => {
    expect(lookupRgZh('bounced')).toBeTruthy()
    expect(lookupRgZh('cries')).toBeTruthy()
  })

  it('查不到返回 undefined（调用方显示整句中文兜底）', () => {
    expect(lookupRgZh('zzzznotaword')).toBeUndefined()
    expect(lookupRgZh('')).toBeUndefined()
  })

  it('查词链覆盖 RG 例句词次 ≥ 95%', () => {
    let total = 0
    let miss = 0
    for (const s of rocketGirlStories) {
      for (const l of rgPassage(s)!.paragraphs.flat()) {
        for (const t of l.en.split(/\s+/)) {
          const b = wordBase(t)
          if (!b) continue
          total++
          if (!lookupRgZh(b)) miss++
        }
      }
    }
    const rate = (total - miss) / total
    expect(rate, `覆盖率 ${(rate * 100).toFixed(1)}%`).toBeGreaterThanOrEqual(0.95)
  })
})

describe('并入阅读模块的边界', () => {
  it('RG 词表是独立文件，没有倒进全局 BOOK_WORD_ZH', () => {
    // 全局词典仍只有补阅读短文后的规模；RG 专属词表单独计数。
    // 这条防的是「图省事把 1067 个 RG 词倒进全局」——那会改变 bookQuiz 的
    // 挖空候选分布，悄悄改变 Fly Guy / Starlight 的出题。
    expect(Object.keys(BOOK_WORD_ZH).length).toBeLessThan(2000)
    expect(RG_GLOSS_SIZE).toBeGreaterThan(1000)
  })

  it('两册 Starlight 阅读短文数据未被 RG 污染，仍是 96/96', () => {
    expect(Object.keys(READING_PASSAGES)).toHaveLength(96)
    expect(Object.keys(READING_PASSAGES1)).toHaveLength(96)
  })

  it('rgPassageOf 返回稳定引用（ReadingZone 的 useEffect([passage]) 会 cancelSpeech）', () => {
    // ReadingBook 每次渲染都调 passageOf；若每次新建对象，孩子点「慢速/中文」
    // 或 SRS 更新时朗读会被掐断。Starlight 返回静态 map 引用，RG 现算的必须缓存。
    expect(rgPassageOf(1, 1)).toBe(rgPassageOf(1, 1))
    for (const m of RG_READING_SOURCE.mods) {
      for (const l of m.lessons) {
        expect(RG_READING_SOURCE.passageOf(m.id, l.id)).toBe(
          RG_READING_SOURCE.passageOf(m.id, l.id),
        )
      }
    }
  })

  it('rgPassageOf 按弧号 + 集号取页，越界返回 undefined', () => {
    expect(rgPassageOf(1, 1)?.title).toBe(rocketGirlStories[0].title)
    expect(rgPassageOf(1, 5)).toBeUndefined()
    expect(rgPassageOf(99, 1)).toBeUndefined()
  })
})
