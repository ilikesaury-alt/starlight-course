// 阅读短文数据完整性（src/data/reading/）
//
// 96 段短文是**内容资产**：写错了不会报错，只会在孩子面前变成「读不懂」或
// 「根本没学过这个词」。所以把生成时最容易被违反的口径全部用测试钉死：
//
//   1. 96 课全覆盖，不多不少
//   2. 每篇 70~100 词 / 8~12 句 / 1~3 段
//   3. 零超纲：每个词都落在 allowedWordsFor(unit, lesson)（含词形回退）
//   4. 本课词表 100% 出现 —— 否则短文会跟本课脱钩，退化成泛读
//   5. 每句有中文；英文句里不许混中文标点；同篇不许有完全重复的句子
//
// 并行生成时可用环境变量只校验单个单元：
//   PowerShell: $env:READING_UNIT='3'; npx vitest run src/data/readingPassage.test.ts
//   bash:       READING_UNIT=3 npx vitest run src/data/readingPassage.test.ts

import { describe, it, expect } from 'vitest'
import { READING_PASSAGES, passageSentences } from './reading'
import { allowedWordsFor, allReadingKeys, tokenizeReading, isAllowedWord } from './reading/baseVocab'
import { lessonsByUnit } from './lessons'

const ALL_KEYS = allReadingKeys()
/** 只校验某个单元（生成时自验用）；不设则全量校验 */
const ONLY_UNIT = process.env.READING_UNIT ? Number(process.env.READING_UNIT) : null
const checkedKeys = ONLY_UNIT ? ALL_KEYS.filter((k) => Number(k.split('-')[0]) === ONLY_UNIT) : ALL_KEYS

function splitKey(key: string): [number, number] {
  const [u, l] = key.split('-').map(Number)
  return [u, l]
}

describe('阅读短文数据完整性', () => {
  it(`课程数 = 96（${ONLY_UNIT ? `仅校验 Unit ${ONLY_UNIT}` : '全量'}）`, () => {
    expect(ALL_KEYS).toHaveLength(96)
  })

  it('每一课都有短文，不多不少', () => {
    for (const key of checkedKeys) {
      expect(READING_PASSAGES[key], `缺少 ${key} 的阅读短文`).toBeDefined()
    }
    const extra = Object.keys(READING_PASSAGES).filter((k) => !ALL_KEYS.includes(k))
    expect(extra, `这些 key 不是真实课号：${extra.join(', ')}`).toEqual([])
  })

  it('标题非空（中英文都要）', () => {
    for (const key of checkedKeys) {
      const p = READING_PASSAGES[key]
      expect(p?.title?.trim(), `${key} 缺英文标题`).toBeTruthy()
      expect(p?.titleZh?.trim(), `${key} 缺中文标题`).toBeTruthy()
    }
  })

  it('篇幅：70~100 词 / 8~12 句 / 1~3 段', () => {
    for (const key of checkedKeys) {
      const p = READING_PASSAGES[key]
      if (!p) continue
      const sents = passageSentences(p)
      const wordCount = sents.reduce((n, s) => n + tokenizeReading(s.en).length, 0)
      expect(wordCount, `${key} 词数 ${wordCount} 不在 70~100`).toBeGreaterThanOrEqual(70)
      expect(wordCount, `${key} 词数 ${wordCount} 不在 70~100`).toBeLessThanOrEqual(100)
      expect(sents.length, `${key} 句数 ${sents.length} 不在 8~12`).toBeGreaterThanOrEqual(8)
      expect(sents.length, `${key} 句数 ${sents.length} 不在 8~12`).toBeLessThanOrEqual(12)
      expect(p.paragraphs.length, `${key} 段数 ${p.paragraphs.length} 不在 1~3`).toBeGreaterThanOrEqual(1)
      expect(p.paragraphs.length, `${key} 段数 ${p.paragraphs.length} 不在 1~3`).toBeLessThanOrEqual(3)
      // 段落里不能有空段
      for (const [pi, para] of p.paragraphs.entries()) {
        expect(para.length, `${key} 第 ${pi + 1} 段是空的`).toBeGreaterThan(0)
      }
    }
  })

  it('零超纲：所有词都在「基线 ∪ 本单元词表 ∪ 本课词表 ∪ 人名」内', () => {
    for (const key of checkedKeys) {
      const p = READING_PASSAGES[key]
      if (!p) continue
      const [u, l] = splitKey(key)
      const allowed = allowedWordsFor(u, l)
      const out: string[] = []
      for (const s of passageSentences(p)) {
        for (const tok of tokenizeReading(s.en)) {
          if (!isAllowedWord(tok, allowed)) out.push(tok)
        }
      }
      expect(
        [...new Set(out)],
        `${key} 出现超纲词（允许词表口径见 reading/baseVocab.ts）`
      ).toEqual([])
    }
  })

  it('本课词表 100% 出现在短文里', () => {
    for (const key of checkedKeys) {
      const p = READING_PASSAGES[key]
      if (!p) continue
      const [u, l] = splitKey(key)
      const lessonWords = lessonsByUnit[u]?.find((x) => x.id === l)?.words ?? []
      const fullText = passageSentences(p).map((s) => s.en.toLowerCase()).join(' ')
      // 复合词（如 gummy bear）按空格拆分后，要求每个组成词都出现在短文里
      const missing = lessonWords
        .map((w) => w.en.toLowerCase())
        .filter((w) => !w.split(' ').every((part) => fullText.includes(part)))
      expect(missing, `${key} 本课词未出现在短文里`).toEqual([])
    }
  })

  it('每句都有中文；英文句里不混中文标点', () => {
    const cnPunct = /[\u3000-\u303f\uff00-\uffef]/
    for (const key of checkedKeys) {
      const p = READING_PASSAGES[key]
      if (!p) continue
      for (const s of passageSentences(p)) {
        expect(s.en?.trim(), `${key} 有空英文句`).toBeTruthy()
        expect(s.zh?.trim(), `${key} 句「${s.en}」缺中文`).toBeTruthy()
        expect(cnPunct.test(s.en), `${key} 英文句混入了中文标点/字符：${s.en}`).toBe(false)
      }
    }
  })

  it('同一篇里没有完全重复的句子', () => {
    for (const key of checkedKeys) {
      const p = READING_PASSAGES[key]
      if (!p) continue
      const seen = new Set<string>()
      const dup: string[] = []
      for (const s of passageSentences(p)) {
        const norm = s.en.toLowerCase().trim().replace(/\s+/g, ' ')
        if (seen.has(norm)) dup.push(s.en)
        seen.add(norm)
      }
      expect(dup, `${key} 短文里有重复句`).toEqual([])
    }
  })
})