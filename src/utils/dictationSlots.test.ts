// dictationSlots 单测：钉住「一字一盒」的判定口径。
//
// 这些规则决定「判对判错 / 哪个格子变红 / 还差几个字母 / 撇号要不要写」，
// 是 UI 一眼看不出、改坏了也没人报错的那种逻辑，因此逐条断言。
import { describe, expect, it } from 'vitest'
import {
  buildDictationSlots,
  firstMistakeIndex,
  isSpellingCorrect,
  normalizeSpelling,
  spellingLetters,
  type DictationSlot,
} from './dictationSlots'

const states = (slots: DictationSlot[]) => slots.map((s) => s.state)
const chars = (slots: DictationSlot[]) => slots.map((s) => s.ch)

describe('比对口径', () => {
  it('normalizeSpelling：去空白 + 小写', () => {
    expect(normalizeSpelling('  Cat ')).toBe('cat')
  })

  it('spellingLetters：只留字母，撇号与空格不算孩子要写的内容', () => {
    expect(spellingLetters("let's")).toBe('lets')
    expect(spellingLetters("don't")).toBe('dont')
    expect(spellingLetters('Ms Smart')).toBe('mssmart')
  })

  it('isSpellingCorrect：忽略大小写与撇号，但不接受空输入/多写/少写', () => {
    expect(isSpellingCorrect('cat', 'CAT')).toBe(true)
    expect(isSpellingCorrect('cat', ' cat ')).toBe(true)
    expect(isSpellingCorrect("let's", 'lets')).toBe(true)
    expect(isSpellingCorrect("let's", "let’s")).toBe(true) // 弯撇号同样忽略
    expect(isSpellingCorrect('cat', '')).toBe(false)
    expect(isSpellingCorrect('cat', 'cats')).toBe(false)
    expect(isSpellingCorrect('cat', 'ca')).toBe(false)
  })
})

describe('buildDictationSlots · idle', () => {
  it('空输入：按答案长度铺格，只有第一格带光标', () => {
    const slots = buildDictationSlots('cat', '', 'idle')
    expect(chars(slots)).toEqual(['', '', ''])
    expect(states(slots)).toEqual(['empty', 'empty', 'empty'])
    expect(slots.map((s) => !!s.caret)).toEqual([true, false, false])
  })

  it('输入一半：已打字母为 filled，光标落在下一个空格上', () => {
    const slots = buildDictationSlots('cat', 'ca', 'idle')
    expect(chars(slots)).toEqual(['c', 'a', ''])
    expect(states(slots)).toEqual(['filled', 'filled', 'empty'])
    expect(slots[2].caret).toBe(true)
  })

  it('多打字：格子跟着长出来，不丢字符、不越界', () => {
    const slots = buildDictationSlots('cat', 'cats', 'idle')
    expect(chars(slots)).toEqual(['c', 'a', 't', 's', ''])
    expect(slots[4].caret).toBe(true)
  })

  it('带空格的词（Ms Smart）：空格是装饰格，不占可写格、也不吃孩子的字母', () => {
    const slots = buildDictationSlots('Ms Smart', '', 'idle')
    expect(slots.filter((s) => s.state !== 'punct')).toHaveLength(7)
    const space = slots.find((s) => s.state === 'punct')
    expect(space?.ch).toBe(' ')
    // 孩子按字母顺序写，中间不需要打空格
    expect(isSpellingCorrect('Ms Smart', 'mssmart')).toBe(true)
    expect(states(buildDictationSlots('Ms Smart', 'mssmart', 'correct')).filter((s) => s === 'ok')).toHaveLength(7)
  })

  it('带撇号的词：撇号是固定装饰格，不占孩子输入位', () => {
    const partial = buildDictationSlots("let's", 'let', 'idle')
    // l e t + 撇号格 + 待写格（只差 s）
    expect(chars(partial)).toEqual(['l', 'e', 't', "'", ''])
    expect(states(partial)).toEqual(['filled', 'filled', 'filled', 'punct', 'empty'])

    const typed = buildDictationSlots("let's", 'lets', 'idle')
    expect(chars(typed)).toEqual(['l', 'e', 't', "'", 's'])
    expect(states(typed)).toEqual(['filled', 'filled', 'filled', 'punct', 'filled'])
  })
})

describe('buildDictationSlots · correct', () => {
  it('全对：每格 ok，且不再留光标格', () => {
    const slots = buildDictationSlots('cat', 'cat', 'correct')
    expect(states(slots)).toEqual(['ok', 'ok', 'ok'])
    expect(slots.some((s) => s.caret)).toBe(false)
  })
})

describe('buildDictationSlots · wrong', () => {
  it('逐格判色：对的绿、错的红，孩子能直接看到第几个字母错', () => {
    const slots = buildDictationSlots('cat', 'cut', 'wrong')
    expect(states(slots).slice(0, 3)).toEqual(['ok', 'bad', 'ok'])
    expect(chars(slots).slice(0, 3)).toEqual(['c', 'u', 't'])
  })

  it('漏写：剩余字母补成 missing 虚线格（不是普通空格）', () => {
    const slots = buildDictationSlots('cat', 'c', 'wrong')
    expect(states(slots)).toEqual(['ok', 'missing', 'missing'])
    expect(slots.filter((s) => s.state === 'missing')).toHaveLength(2)
  })

  it('中间写错 + 少写：错的红、后面漏的补虚线（不把错位算成漏写）', () => {
    const slots = buildDictationSlots('cat', 'ct', 'wrong')
    expect(states(slots)).toEqual(['ok', 'bad', 'missing'])
  })

  it('多打字：多出来的格子判红，不会挤掉漏写提示', () => {
    const slots = buildDictationSlots('cat', 'cats', 'wrong')
    expect(states(slots)).toEqual(['ok', 'ok', 'ok', 'bad'])
  })

  it('带撇号的词：漏写只补字母格，撇号格保持装饰态', () => {
    const slots = buildDictationSlots("let's", 'let', 'wrong')
    expect(chars(slots)).toEqual(['l', 'e', 't', "'", ''])
    expect(states(slots)).toEqual(['ok', 'ok', 'ok', 'punct', 'missing'])
  })
})

describe('buildDictationSlots · revealed', () => {
  it('揭晓：直接铺出完整答案，撇号仍是装饰格', () => {
    const slots = buildDictationSlots("let's", 'zzz', 'revealed')
    expect(chars(slots)).toEqual(['l', 'e', 't', "'", 's'])
    expect(states(slots)).toEqual(['ok', 'ok', 'ok', 'punct', 'ok'])
  })
})

describe('firstMistakeIndex · 「第 n 个字母」提示', () => {
  it('第一个不一致的位置（1 基）', () => {
    expect(firstMistakeIndex('cat', 'cam')).toBe(3)
    expect(firstMistakeIndex('cat', 'ct')).toBe(2)
  })

  it('全都对但没写完 → 指向下一个空格', () => {
    expect(firstMistakeIndex('cat', 'ca')).toBe(3)
    expect(firstMistakeIndex('cat', '')).toBe(1)
  })

  it('已写完且全对 → -1（无需提示）；多打字 → 指向多出来的那个', () => {
    expect(firstMistakeIndex('cat', 'cat')).toBe(-1)
    expect(firstMistakeIndex('cat', 'cats')).toBe(4)
  })

  it('带撇号的词按字母比对，撇号不占位', () => {
    expect(firstMistakeIndex("let's", 'let')).toBe(4)
    expect(firstMistakeIndex("let's", 'lets')).toBe(-1)
  })
})
