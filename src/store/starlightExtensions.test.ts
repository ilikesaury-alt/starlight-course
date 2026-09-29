// @vitest-environment jsdom
// 拓展词录入/删除 + 句子框架卡播种的 store 行为测试（vitest + jsdom）
// store 用 localStorage 持久化，这里每次先 reset 保证用例互不污染。

import { beforeEach, describe, expect, it } from 'vitest'
import { useCourseStore } from './useCourseStore'
import { STARLIGHT_FRAMES, frameCardKey } from '../data/sentenceFrame'
import type { Word } from '../data/starlight'

const KEY = '1-1'

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
})

describe('addExtensionWord', () => {
  const broccoli: Word = { en: 'broccoli', zh: '西兰花', emoji: '🥦' }

  it('录入后写入本课拓展词并带「拓展」来源标记', () => {
    const store = useCourseStore.getState()
    expect(store.addExtensionWord(KEY, broccoli)).toBe(true)

    const list = useCourseStore.getState().starlightExtensions[KEY]
    expect(list).toHaveLength(1)
    expect(list[0].en).toBe('broccoli')
    // 自动播种进复习池，且标记为 extension 来源
    const card = useCourseStore.getState().srsCards.broccoli
    expect(card).toBeDefined()
    expect(card.source).toBe('extension')
    expect(card.modules).toContain('starlight')
  })

  it('en 为空时拒绝', () => {
    const store = useCourseStore.getState()
    expect(store.addExtensionWord(KEY, { en: '   ', zh: '', emoji: '' })).toBe(false)
    expect(useCourseStore.getState().starlightExtensions[KEY]).toBeUndefined()
  })

  it('同课重复 en 拒绝（大小写不敏感）', () => {
    const store = useCourseStore.getState()
    expect(store.addExtensionWord(KEY, broccoli)).toBe(true)
    expect(store.addExtensionWord(KEY, { en: 'Broccoli', zh: '', emoji: '' })).toBe(false)
    expect(useCourseStore.getState().starlightExtensions[KEY]).toHaveLength(1)
  })

  it('不同课可录同一个词', () => {
    const store = useCourseStore.getState()
    expect(store.addExtensionWord('1-1', broccoli)).toBe(true)
    expect(store.addExtensionWord('1-2', broccoli)).toBe(true)
    expect(useCourseStore.getState().starlightExtensions['1-2']).toHaveLength(1)
  })

  it('emoji 缺省补 📝', () => {
    useCourseStore.getState().addExtensionWord(KEY, { en: 'kiwi', zh: '', emoji: '' })
    expect(useCourseStore.getState().starlightExtensions[KEY][0].emoji).toBe('📝')
  })
})

describe('removeExtensionWord', () => {
  it('删除拓展词并同步移出复习池的 srsCards', () => {
    const store = useCourseStore.getState()
    store.addExtensionWord(KEY, { en: 'broccoli', zh: '', emoji: '' })
    expect(useCourseStore.getState().srsCards.broccoli).toBeDefined()

    useCourseStore.getState().removeExtensionWord(KEY, 'broccoli')
    expect(useCourseStore.getState().starlightExtensions[KEY]).toBeUndefined()
    expect(useCourseStore.getState().srsCards.broccoli).toBeUndefined()
  })

  it('删除教材课内词时保留卡片（source=lesson）', () => {
    const store = useCourseStore.getState()
    store.seedCard('hello', 'starlight') // 教材词，source=lesson
    store.addExtensionWord(KEY, { en: 'hello', zh: '', emoji: '' })
    useCourseStore.getState().removeExtensionWord(KEY, 'hello')
    expect(useCourseStore.getState().srsCards.hello).toBeDefined()
  })

  it('删掉最后一个词时清理 key，避免残留空数组', () => {
    const store = useCourseStore.getState()
    store.addExtensionWord(KEY, { en: 'kiwi', zh: '', emoji: '' })
    useCourseStore.getState().removeExtensionWord(KEY, 'kiwi')
    expect(KEY in useCourseStore.getState().starlightExtensions).toBe(false)
  })
})

describe('seedSentenceFrames', () => {
  it('框架卡以 kind=sentence 播种，键与单词卡隔离', () => {
    useCourseStore.getState().seedCards(['doll'], 'starlight')
    useCourseStore.getState().seedSentenceFrames(STARLIGHT_FRAMES, 'starlight')

    const cards = useCourseStore.getState().srsCards
    const key = frameCardKey(STARLIGHT_FRAMES[0])
    expect(cards[key]).toBeDefined()
    expect(cards[key].kind).toBe('sentence')
    expect(cards[key].frame?.pattern).toBe(STARLIGHT_FRAMES[0].pattern)
    // 单词卡不受影响
    expect(cards.doll.kind).toBeUndefined()
  })

  it('重复播种幂等：只归模块，不重复建卡', () => {
    useCourseStore.getState().seedSentenceFrames(STARLIGHT_FRAMES, 'starlight')
    const before = Object.keys(useCourseStore.getState().srsCards).length
    useCourseStore.getState().seedSentenceFrames(STARLIGHT_FRAMES, 'starlight')
    expect(Object.keys(useCourseStore.getState().srsCards)).toHaveLength(before)
  })

  it('key 由帧 id 决定：不同帧即使 pattern 相同也不合并为一张卡', () => {
    // 旧实现以 pattern 的散列为 key，导致 Unit2/Unit4 同为 "This is a ___." 的两个框架
    // 塔成同一张卡。此处固定新契约：id 才是键的来源。
    const a = frameCardKey({ ...STARLIGHT_FRAMES[0], id: 'other' })
    const b = frameCardKey(STARLIGHT_FRAMES[0])
    expect(a).not.toBe(b)
    // 同一帧则稳定
    expect(frameCardKey(STARLIGHT_FRAMES[0])).toBe(b)
  })
})

describe('持久化（persist）', () => {
  it('starlightExtensions 写入 localStorage，重载后仍在', async () => {
    useCourseStore.getState().addExtensionWord(KEY, { en: 'broccoli', zh: '西兰花', emoji: '🥦' })
    await useCourseStore.persist.rehydrate()
    expect(useCourseStore.getState().starlightExtensions[KEY][0].en).toBe('broccoli')
  })

  it('旧 v6 数据（无 starlightExtensions）迁移后补空对象，不抛错', async () => {
    localStorage.setItem(
      'starlight-course',
      JSON.stringify({ state: { wrongWords: [], totalStars: 3, srsCards: {} }, version: 6 })
    )
    await useCourseStore.persist.rehydrate()
    expect(useCourseStore.getState().starlightExtensions).toEqual({})
    expect(useCourseStore.getState().totalStars).toBe(3)
  })
})
