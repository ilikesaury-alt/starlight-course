// phonics 工具单测：守住「音素格子 / 金字塔 / 拼读提示」的轻量切分口径。
// 这些是听写模块「自然拼读桥接」的底层契约，规则一改就要在这里对账。
import { describe, expect, it } from 'vitest'
import { isShortWord, phonemeBoxes, phonicsHint, spellingPyramid } from './phonics'

describe('phonemeBoxes · 音素格子切分', () => {
  it('CVC 短词按字母逐格', () => {
    expect(phonemeBoxes('cat')).toEqual(['c', 'a', 't'])
    expect(phonemeBoxes('dog')).toEqual(['d', 'o', 'g'])
  })

  it('digraph 两字母合一格', () => {
    expect(phonemeBoxes('ship')).toEqual(['sh', 'i', 'p'])
    expect(phonemeBoxes('chick')).toEqual(['ch', 'i', 'ck'])
    expect(phonemeBoxes('this')).toEqual(['th', 'i', 's'])
  })

  it('魔术 e：末位 silent e 并入前一格', () => {
    expect(phonemeBoxes('cake')).toEqual(['c', 'a', 'ke'])
    expect(phonemeBoxes('name')).toEqual(['n', 'a', 'me'])
  })

  it('空串 / 非字母被清理', () => {
    expect(phonemeBoxes('')).toEqual([])
    expect(phonemeBoxes('c-at!')).toEqual(['c', 'a', 't'])
  })
})

describe('spellingPyramid · 金字塔拼写阶梯', () => {
  it('逐字母展开', () => {
    expect(spellingPyramid('cat')).toEqual(['c', 'ca', 'cat'])
  })
  it('空串返回空', () => {
    expect(spellingPyramid('')).toEqual([])
  })
})

describe('phonicsHint · 拼读提示文本', () => {
  it('大写并用分隔符连接', () => {
    expect(phonicsHint('cat')).toBe('C · A · T')
    expect(phonicsHint('ship')).toBe('SH · I · P')
  })
})

describe('isShortWord · 短词判定', () => {
  it('<=4 字母视为短词', () => {
    expect(isShortWord('cat')).toBe(true)
    expect(isShortWord('cake')).toBe(true)
    expect(isShortWord('water')).toBe(false)
  })
})
