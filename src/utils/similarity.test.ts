import { describe, it, expect } from 'vitest'
import { normalize, tokenize, scoreSentence } from './similarity'

describe('normalize / tokenize', () => {
  it('归一化：小写、去标点、压空白', () => {
    expect(normalize('  Hello,   World!  ')).toBe('hello world')
    expect(normalize('I’m good.')).toBe("i'm good")
  })
  it('tokenize 去冠词并展开缩写', () => {
    expect(tokenize('the doll')).toEqual(['doll'])
    expect(tokenize('a doll')).toEqual(['doll'])
    expect(tokenize('an apple')).toEqual(['apple'])
    expect(tokenize("I'm good")).toEqual(['i', 'am', 'good'])
    expect(tokenize("What's this?")).toEqual(['what', 'is', 'this'])
  })
})

describe('scoreSentence', () => {
  it('完全一致 → 满分达标', () => {
    const r = scoreSentence('I have a doll.', 'I have a doll')
    expect(r.score).toBe(1)
    expect(r.passed).toBe(true)
    expect(r.missing).toEqual([])
  })

  it('冠词容错：漏掉 a/the 也算过', () => {
    const r = scoreSentence('This is a doll.', 'this is doll')
    expect(r.passed).toBe(true)
  })

  it('缩写展开容错：识别成 i am 也算命中', () => {
    const r = scoreSentence("I'm good.", 'i am good')
    expect(r.passed).toBe(true)
    expect(r.missing).toEqual([])
  })

  it('缺失词返回 missing（用原文词形）', () => {
    const r = scoreSentence('I have a doll.', 'i have a')
    expect(r.missing).toContain('doll')
    expect(r.passed).toBe(false)
  })

  it('词内拼写模糊兜底（≥0.7）', () => {
    const r = scoreSentence('I have a puzzle.', 'i have a puzle')
    expect(r.passed).toBe(true)
  })

  it('短词不启用模糊匹配，避免误判', () => {
    const r = scoreSentence('I see a cat.', 'i see a car')
    expect(r.missing.length).toBeGreaterThan(0)
  })

  it('多余实义词计入 extra 但不致命；口头禅忽略', () => {
    const r = scoreSentence('I have a doll.', 'um i have a doll')
    expect(r.extra).toEqual([])
    expect(r.passed).toBe(true)
    const extra = scoreSentence('I have a doll.', 'i have a big doll')
    expect(extra.extra).toContain('big')
  })

  it('空识别结果 → 0 分不达标', () => {
    const r = scoreSentence('I have a doll.', '')
    expect(r.score).toBe(0)
    expect(r.passed).toBe(false)
  })

  it('阈值可调（严格档）', () => {
    const r = scoreSentence('I have a doll.', 'i have a puzzel', { threshold: 0.95 })
    expect(r.passed).toBe(false)
  })

  it('完全不相干的句子不达标', () => {
    const r = scoreSentence('I have a doll.', 'the weather is sunny today')
    expect(r.passed).toBe(false)
  })

  it('同义容错：want/like 互相接受', () => {
    const r = scoreSentence('I want a car.', 'i like a car')
    expect(r.passed).toBe(true)
  })
})
