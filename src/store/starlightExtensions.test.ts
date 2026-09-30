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

describe('每课上限 EXT_LIMIT', () => {
  it('手动录入到 5 个后第 6 个被拒', () => {
    const store = useCourseStore.getState()
    for (let i = 1; i <= 5; i++) {
      expect(store.addExtensionWord(KEY, { en: `w${i}`, zh: '', emoji: '' })).toBe(true)
    }
    expect(store.addExtensionWord(KEY, { en: 'w6', zh: '', emoji: '' })).toBe(false)
    expect(useCourseStore.getState().starlightExtensions[KEY]).toHaveLength(5)
  })

  it('手动录入的词不带 auto 标记（换一批不会替换掉它）', () => {
    useCourseStore.getState().addExtensionWord(KEY, { en: 'hand-made', zh: '手作', emoji: '✋' })
    expect(useCourseStore.getState().starlightExtensions[KEY][0].auto).toBeUndefined()
  })
})

describe('fillExtensionWords（自动填充 / 换一批）', () => {
  const cands = (n: number): Word[] =>
    Array.from({ length: n }, (_, i) => ({ en: `w${i}`, zh: `词${i}`, emoji: '🌟' }))

  it('候选超过上限也只写 5 个，且都带 auto 标记 + 播种 extension 卡', () => {
    const added = useCourseStore.getState().fillExtensionWords(KEY, cands(8), 1)
    expect(added).toBe(5)

    const s = useCourseStore.getState()
    expect(s.starlightExtensions[KEY]).toHaveLength(5)
    expect(s.starlightExtensions[KEY].every((x) => x.auto === true)).toBe(true)
    expect(s.srsCards.w0.source).toBe('extension')
    expect(s.extensionRound[KEY]).toBe(1)
  })

  it('换一批：只替换自动词，手动录入的词原样保留', () => {
    const store = useCourseStore.getState()
    store.addExtensionWord(KEY, { en: 'hand-made', zh: '手作', emoji: '✋' })
    store.fillExtensionWords(KEY, cands(5), 1) // 上限 5 → 自动词只能进 4 个

    const first = useCourseStore.getState().starlightExtensions[KEY]
    expect(first).toHaveLength(5)
    expect(first.filter((x) => x.auto)).toHaveLength(4)

    useCourseStore.getState().fillExtensionWords(KEY, cands(5).map((w) => ({ ...w, en: `n-${w.en}` })), 2)
    const second = useCourseStore.getState().starlightExtensions[KEY]
    expect(second).toHaveLength(5)
    expect(second.some((x) => x.en === 'hand-made')).toBe(true) // 手动词留着
    expect(second.some((x) => x.en === 'w0')).toBe(false) // 上一批自动词被换掉
    expect(second.filter((x) => x.en.startsWith('n-'))).toHaveLength(4)
    expect(useCourseStore.getState().extensionRound[KEY]).toBe(2)
  })

  it('换掉的自动词卡片出复习池，教材同形词的卡片保留', () => {
    const store = useCourseStore.getState()
    store.seedCard('broccoli', 'starlight') // 教材词，source=lesson
    store.fillExtensionWords(KEY, [
      { en: 'broccoli', zh: '西兰花', emoji: '🥦' },
      { en: 'turnip', zh: '芜菁', emoji: '🥬' },
    ], 1)
    store.fillExtensionWords(KEY, [{ en: 'beet', zh: '甜菜', emoji: '🫒' }], 2)
    const s = useCourseStore.getState()
    expect(s.srsCards.broccoli).toBeDefined() // 同形教材卡不能被换走
    expect(s.srsCards.turnip).toBeUndefined() // 被换掉的自动词卡片出池
    expect(s.srsCards.beet.source).toBe('extension') // 新一批正常播种
    expect(s.starlightExtensions[KEY].map((x) => x.en)).toEqual(['beet'])
  })

  it('候选为空时也记录轮次，避免空列表被反复自动填充', () => {
    useCourseStore.getState().fillExtensionWords(KEY, [], 1)
    expect(useCourseStore.getState().extensionRound[KEY]).toBe(1)
    expect(useCourseStore.getState().starlightExtensions[KEY]).toBeUndefined()
  })

  it('候选里有空 en / 重复 en 时跳过，不占用名额', () => {
    const added = useCourseStore.getState().fillExtensionWords(
      KEY,
      [{ en: '   ', zh: '', emoji: '' }, { en: 'AA', zh: '', emoji: '' }, { en: 'aa', zh: '', emoji: '' }],
      1
    )
    expect(added).toBe(1)
    expect(useCourseStore.getState().starlightExtensions[KEY]).toHaveLength(1)
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

  it('v7 数据迁移补 extensionRound，已填过的课不会被重新自动填', async () => {
    localStorage.setItem(
      'starlight-course',
      JSON.stringify({ state: { wrongWords: [], totalStars: 1, srsCards: {} }, version: 7 })
    )
    await useCourseStore.persist.rehydrate()
    expect(useCourseStore.getState().extensionRound).toEqual({})
  })

  it('extensionRound 持久化：换批轮次重载后仍在', async () => {
    useCourseStore.getState().fillExtensionWords(KEY, [{ en: 'kiwi', zh: '猕猴桃', emoji: '🥝' }], 3)
    await useCourseStore.persist.rehydrate()
    expect(useCourseStore.getState().extensionRound[KEY]).toBe(3)
    expect(useCourseStore.getState().starlightExtensions[KEY][0].auto).toBe(true)
  })
})
