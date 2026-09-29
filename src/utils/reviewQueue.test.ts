// 复习队列配额的单测（纯函数）
// 关键回归：句子框架卡不能被单词卡淹没——这正是 T3.5「写了但到不了」的根因。
// 用真实的 SrsCard 构造，保证测试形状与实际调用方（getDueCards）一致。

import { describe, it, expect } from 'vitest'
import { mixReviewQueue, SENTENCE_SHARE } from './reviewQueue'
import type { SrsCard } from '@/data/srs'

/** 造一张单词卡；omitKind 模拟 v6 旧卡（无 kind 字段） */
function wordCard(en: string, omitKind = false): SrsCard {
  const base = {
    en,
    box: 0,
    nextReview: 100,
    lastReview: 100,
    streak: 0,
    reviews: 0,
    modules: ['starlight'] as SrsCard['modules'],
  }
  return omitKind ? base : { ...base, kind: 'word' as const }
}

function sentenceCard(en: string): SrsCard {
  return { ...wordCard(en), kind: 'sentence' as const }
}

const words = (n: number) => Array.from({ length: n }, (_, i) => wordCard(`w${i}`))

describe('mixReviewQueue', () => {
  it('卡片总数不足 limit 时原样返回（保持顺序）', () => {
    const cards = words(3)
    expect(mixReviewQueue(cards, 20)).toEqual(cards)
  })

  it('没有句子卡时退化为纯截断', () => {
    const cards = words(50)
    const q = mixReviewQueue(cards, 20)
    expect(q).toHaveLength(20)
    expect(q).toEqual(cards.slice(0, 20))
  })

  it('句子卡被挤出队列时能救回来（核心回归）', () => {
    // 100 张单词卡在前，句子卡排末尾（模拟逾期排序把它压到最后）
    const cards = [...words(100), sentenceCard('frame:abc')]
    const q = mixReviewQueue(cards, 20)
    expect(q.some((c) => c.kind === 'sentence')).toBe(true)
  })

  it('句子卡席位按 SENTENCE_SHARE 分配', () => {
    const cards = [
      ...words(100),
      ...Array.from({ length: 50 }, (_, i) => sentenceCard(`f${i}`)),
    ]
    const q = mixReviewQueue(cards, 20)
    expect(q.filter((c) => c.kind === 'sentence')).toHaveLength(Math.ceil(20 * SENTENCE_SHARE))
    expect(q).toHaveLength(20)
  })

  it('句子卡不足配额时不会硬凑，剩余席位给单词卡', () => {
    const cards = [...words(100), sentenceCard('f0')]
    const q = mixReviewQueue(cards, 20)
    expect(q.filter((c) => c.kind === 'sentence')).toHaveLength(1)
    expect(q.filter((c) => c.kind === 'word')).toHaveLength(19)
  })

  it('limit<=0 返回空数组', () => {
    expect(mixReviewQueue(words(10), 0)).toEqual([])
    expect(mixReviewQueue(words(10), -1)).toEqual([])
  })

  it('不修改入参数组', () => {
    const cards = [...words(30), sentenceCard('f0')]
    const copy = [...cards]
    mixReviewQueue(cards, 20)
    expect(cards).toEqual(copy)
  })

  it('缺 kind 字段的 v6 旧卡按单词卡处理，不占句子卡席位', () => {
    const cards: SrsCard[] = [...words(30), wordCard('legacy', true), sentenceCard('f0')]
    const q = mixReviewQueue(cards, 20)
    expect(q).toHaveLength(20)
    expect(q.filter((c) => c.kind === 'sentence')).toHaveLength(1)
    // 旧卡没被误判成句子卡
    expect(q.filter((c) => c.en === 'legacy' && c.kind === 'sentence')).toHaveLength(0)
  })

  it('全部是句子卡时正常截断', () => {
    const cards = Array.from({ length: 30 }, (_, i) => sentenceCard(`f${i}`))
    expect(mixReviewQueue(cards, 20)).toHaveLength(20)
  })
})
