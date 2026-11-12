// Rocket Girl → 阅读器适配层的回归测试。
//
// 钉死四件事：
//  ① 108 关每关都能产出例句页，且每页句子数有上界（防云 TTS 长文本超时）；
//  ② 同关内重复例句去重、每句都有中文；
//  ③ 词表归一化：多词短语 / 带括号噪声被剔除，否则 TappableWords 永不命中高亮；
//  ④ 查词链覆盖率 ≥ 95%，且**不污染全局词典**（BOOK_WORD_ZH 大小不变）。

import { describe, expect, it } from 'vitest'
import { rocketGirlStories } from './rocketgirl'
import {
  SENTENCES_PER_PAGE,
  RG_GLOSS_SIZE,
  lookupRgZh,
  rgReadingVocab,
  rgStoryPages,
} from './rocketgirlReading'
import { BOOK_WORD_ZH, lookupZh, wordBase } from '@/utils/bookDict'
import { READING_PASSAGES } from './reading'
import { READING_PASSAGES1 } from './starlight1/reading'

describe('rgStoryPages', () => {
  it('108 关每关都产出非空例句页', () => {
    expect(rocketGirlStories).toHaveLength(108)
    for (const s of rocketGirlStories) {
      const pages = rgStoryPages(s)
      expect(pages.length, `${s.slug} 应至少 1 页`).toBeGreaterThan(0)
      for (const p of pages) {
        expect(p.title).toBeTruthy()
        expect(p.titleZh).toBeTruthy()
        expect(p.paragraphs.length).toBeGreaterThan(0)
      }
    }
  })

  it('每页 ≤ SENTENCES_PER_PAGE 句（避免「听整篇」合成超长音频超时）', () => {
    for (const s of rocketGirlStories) {
      for (const p of rgStoryPages(s)) {
        const n = p.paragraphs.flat().length
        expect(n, `${s.slug} 某页 ${n} 句`).toBeLessThanOrEqual(SENTENCES_PER_PAGE)
        expect(n).toBeGreaterThan(0)
      }
    }
  })

  it('每句都有英文和中文，且同页无完全重复句', () => {
    for (const s of rocketGirlStories) {
      for (const p of rgStoryPages(s)) {
        const lines = p.paragraphs.flat()
        const seen = new Set<string>()
        for (const l of lines) {
          expect(l.en.trim(), `${s.slug} 空英文`).toBeTruthy()
          expect(l.zh.trim(), `${s.slug} 空中文: ${l.en}`).toBeTruthy()
          const k = l.en.toLowerCase().replace(/\s+/g, ' ')
          expect(seen.has(k), `${s.slug} 重复句: ${l.en}`).toBe(false)
          seen.add(k)
        }
      }
    }
  })

  it('标题明确说「例句」，不冒充绘本原文 / 小故事', () => {
    for (const s of rocketGirlStories) {
      for (const p of rgStoryPages(s)) {
        expect(p.titleZh).toContain('例句')
        expect(p.titleZh).not.toContain('绘本原文')
        expect(p.titleZh).not.toContain('小故事')
      }
    }
  })
})

describe('rgReadingVocab', () => {
  it('每关都有词，且全是单 token（多词短语 / 括号噪声已剔除）', () => {
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

  it('同关内按 token 去重', () => {
    for (const s of rocketGirlStories) {
      const ens = rgReadingVocab(s).map((w) => w.en)
      expect(new Set(ens).size).toBe(ens.length)
    }
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
      for (const p of rgStoryPages(s)) {
        for (const l of p.paragraphs.flat()) {
          for (const t of l.en.split(/\s+/)) {
            const b = wordBase(t)
            if (!b) continue
            total++
            if (!lookupRgZh(b)) miss++
          }
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
})
