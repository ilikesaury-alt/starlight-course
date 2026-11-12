// 逐词词典（src/utils/bookDict.ts）的覆盖率回归。
//
// 起因（2026-11-12）：家长反馈「阅读时点单词经常提示查不到」。
// 系统性扫下来，手写词典对**阅读短文**的覆盖并不完整：
//   预备级 8629 词次里缺 455（5.3%），第一册 7814 词次里缺 1112（14.2%）。
// 补完 287 个词形后两册都是 0%。
//
// 这个测试的意义不是「词典有这些词」，而是**锁住覆盖率**：
// 以后改短文（docs/reading-passage-style.md 允许改写）或加新课，一旦引入
// 词典没有的词，这条测试立刻红 —— 否则孩子点到那个词只会看到
// 「（词典里还没这个词）」，而代码层面不会有任何信号。

import { describe, expect, it } from 'vitest'
import { lookupZh, wordBase, cleanForSpeak } from './bookDict'
import { READING_PASSAGES } from '@/data/reading'
import { READING_PASSAGES1 } from '@/data/starlight1/reading'

/** 扫一本短文，返回查不到词典的词形 → 出现次数 */
function missingWords(passages: { paragraphs: { en: string }[][] }[]) {
  const miss = new Map<string, number>()
  for (const p of passages) {
    for (const sent of p.paragraphs.flat()) {
      for (const token of sent.en.split(/\s+/)) {
        const base = wordBase(token)
        if (!base) continue
        if (!lookupZh(base)) miss.set(base, (miss.get(base) ?? 0) + 1)
      }
    }
  }
  return miss
}

describe('阅读短文点词覆盖率', () => {
  it('预备级 96 篇：每个词都能查到中文', () => {
    const miss = missingWords(Object.values(READING_PASSAGES))
    expect([...miss.keys()].sort()).toEqual([])
  })

  it('第一册 96 篇：每个词都能查到中文', () => {
    const miss = missingWords(Object.values(READING_PASSAGES1))
    expect([...miss.keys()].sort()).toEqual([])
  })
})

describe('lookupZh 查词规则', () => {
  it('精确命中', () => {
    expect(lookupZh('cat')).toBe('猫')
  })

  it('常见词尾回退到词根（-s / -ed / -ing / -er / -est / -ly）', () => {
    // 用**词典里只有词根**的词来验回退：dog / walk 没有 dogs / walked 词条，
    // 能查到就说明 -s / -ed 回退真的生效了。
    // （别拿 cat / help / look 来测 —— 它们的变形词条本来就在词典里，
    //   测出来的是「精确命中」而不是回退，等于没测。）
    // 回退返回的是**词根**的释义（不是变形后的释义窗口），这是 lookupZh 的设计：
    // 宁可给「走」也不要给空，孩子能看懂 90%，比「词典里还没这个词」好得多。
    expect(lookupZh('dogs')).toBe('狗')
    expect(lookupZh('walks')).toBeTruthy()
    expect(lookupZh('walked')).toBeTruthy()
  })

  it('不规则变化靠单列词条兜住（goes / cries / tries 不能靠去词尾）', () => {
    // -es 回退只会得到 goe/cri/tri，全都不在词典里 → 必须单列
    expect(lookupZh('goes')).toBeTruthy()
    expect(lookupZh('cries')).toBeTruthy()
    expect(lookupZh('tries')).toBeTruthy()
  })

  it('查不到返回 undefined（调用方据此显示「还没这个词」）', () => {
    expect(lookupZh('zzzznotaword')).toBeUndefined()
    expect(lookupZh('')).toBeUndefined()
  })
})

describe('wordBase / cleanForSpeak', () => {
  it('wordBase 小写并去掉所有非字母字符', () => {
    expect(wordBase("Mia's")).toBe('mias')
    expect(wordBase('“Hello!”')).toBe('hello')
    expect(wordBase('3')).toBe('')
  })

  it('cleanForSpeak 只去首尾标点，保留词内撇号（don\'t 要能正常朗读）', () => {
    expect(cleanForSpeak('“Hello!”')).toBe('Hello')
    expect(cleanForSpeak("don't")).toBe("don't")
    expect(cleanForSpeak('(cat)')).toBe('cat')
  })
})
