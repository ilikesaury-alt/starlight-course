// @vitest-environment jsdom
// 每日节律（v10）的 store 行为 + v9→v10 迁移
//
// 最要紧的两条：
//   ① 老用户（v9）升级上来不能丢进度，同时补出 lessonDoneOn / readingDoneOn
//   ② 「标记完成」必须刷今日戳 —— 哪怕这门课昨天已经学过（重做也算今天做了）

import { describe, it, expect, beforeEach } from 'vitest'
import { useCourseStore } from './useCourseStore'
import { dayStamp } from '@/data/srs'

const KEY = 'starlight-course'

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
})

describe('markLessonToday / markReadingToday', () => {
  it('写入今天的日期戳', () => {
    const today = dayStamp()
    useCourseStore.getState().markLessonToday()
    expect(useCourseStore.getState().lessonDoneOn).toBe(today)

    useCourseStore.getState().markReadingToday()
    expect(useCourseStore.getState().readingDoneOn).toBe(today)
  })

  it('初始为 0（从未做过）', () => {
    const s = useCourseStore.getState()
    expect(s.lessonDoneOn).toBe(0)
    expect(s.readingDoneOn).toBe(0)
  })
})

describe('完成动作顺带刷今日戳（重做旧课也算今天做了）', () => {
  it('markChineseDone 会刷 lessonDoneOn', () => {
    useCourseStore.getState().markChineseDone('cn-1')
    expect(useCourseStore.getState().lessonDoneOn).toBe(dayStamp())
  })

  it('已学过的课再标记一次，仍刷新今日戳（不能因短路而漏记）', () => {
    const store = useCourseStore.getState()
    store.markChineseDone('cn-1')
    // 模拟「昨天学完、今天重做」：手工把戳改回昨天
    useCourseStore.setState({ lessonDoneOn: dayStamp() - 1 })
    expect(useCourseStore.getState().lessonDoneOn).toBe(dayStamp() - 1)

    useCourseStore.getState().markChineseDone('cn-1') // 同一个 slug，已完成
    // 累积集合没变（仍是 1 条），但今日戳必须被刷回来
    expect(useCourseStore.getState().completedChinese).toEqual(['cn-1'])
    expect(useCourseStore.getState().lessonDoneOn).toBe(dayStamp())
  })

  it('markEng3aDone / markLessonDone / markPreviewDone 都刷今日戳', () => {
    const s = useCourseStore.getState()

    useCourseStore.setState({ lessonDoneOn: 0 })
    s.markEng3aDone('en-1')
    expect(useCourseStore.getState().lessonDoneOn).toBe(dayStamp())

    useCourseStore.setState({ lessonDoneOn: 0 })
    s.markLessonDone('unit-x', 1, 5)
    expect(useCourseStore.getState().lessonDoneOn).toBe(dayStamp())

    useCourseStore.setState({ lessonDoneOn: 0 })
    s.markPreviewDone('unit-y', [1, 2])
    expect(useCourseStore.getState().lessonDoneOn).toBe(dayStamp())
  })
})

describe('resetAll 清掉每日节律', () => {
  it('重置后今日戳归零（不该还留着「今天已完成」）', () => {
    const store = useCourseStore.getState()
    store.markLessonToday()
    store.markReadingToday()
    expect(useCourseStore.getState().lessonDoneOn).toBe(dayStamp())

    useCourseStore.getState().resetAll()

    expect(useCourseStore.getState().lessonDoneOn).toBe(0)
    expect(useCourseStore.getState().readingDoneOn).toBe(0)
  })
})

describe('v9 → v10 迁移（老用户升级不能丢进度）', () => {
  it('v9 数据补出每日节律字段，且进度一条不少', async () => {
    const v9 = {
      state: {
        profile: { id: 'main', name: '小明', avatar: '🐼', createdAt: 20000 },
        wrongWords: [{ en: 'apple', zh: '苹果', emoji: '🍎', from: 'u1', module: 'starlight' }],
        totalStars: 88,
        completedPreviews: [],
        completedQuizzes: [],
        lessonCompleted: { u1: [1, 2] },
        completedStories: [],
        srsCards: {},
        starlightExtensions: {},
        extensionRound: {},
        reciteCheckins: {},
        chineseQuiz: {},
        eng3aRecite: {},
        eng3aQuiz: {},
        completedChinese: ['cn-a'],
        completedEng3a: [],
        // 注意：没有 lessonDoneOn / readingDoneOn
      },
      version: 9,
    }
    localStorage.setItem(KEY, JSON.stringify(v9))

    await useCourseStore.persist.rehydrate()

    const s = useCourseStore.getState()
    // 新增字段补 0
    expect(s.lessonDoneOn).toBe(0)
    expect(s.readingDoneOn).toBe(0)
    // 老进度一条不少
    expect(s.totalStars).toBe(88)
    expect(s.profile.name).toBe('小明')
    expect(s.lessonCompleted.u1).toEqual([1, 2])
    expect(s.completedChinese).toEqual(['cn-a'])
    expect(s.wrongWords).toHaveLength(1)
  })
})

describe('同版本但字段残缺（migrate 不会跑，靠 onRehydrateStorage 兜底）', () => {
  it('v10 数据缺 lessonDoneOn 时收敛成 0，不产生 NaN', async () => {
    const broken = {
      state: {
        profile: { id: 'main', name: '', avatar: '🐣', createdAt: 1 },
        wrongWords: [],
        totalStars: 3,
        completedPreviews: [],
        completedQuizzes: [],
        lessonCompleted: {},
        completedStories: [],
        srsCards: {},
        starlightExtensions: {},
        extensionRound: {},
        reciteCheckins: {},
        chineseQuiz: {},
        eng3aRecite: {},
        eng3aQuiz: {},
        completedChinese: [],
        completedEng3a: [],
        // 缺 lessonDoneOn / readingDoneOn
      },
      version: 10,
    }
    localStorage.setItem(KEY, JSON.stringify(broken))

    await useCourseStore.persist.rehydrate()

    const s = useCourseStore.getState()
    expect(s.lessonDoneOn).toBe(0)
    expect(s.readingDoneOn).toBe(0)
    expect(Number.isNaN(s.lessonDoneOn)).toBe(false)
  })

  it('字段是 NaN 这类脏值时也收敛成 0', async () => {
    const dirty = {
      state: {
        profile: { id: 'main', name: '', avatar: '🐣', createdAt: 1 },
        wrongWords: [],
        totalStars: 0,
        completedPreviews: [],
        completedQuizzes: [],
        lessonCompleted: {},
        completedStories: [],
        srsCards: {},
        starlightExtensions: {},
        extensionRound: {},
        reciteCheckins: {},
        chineseQuiz: {},
        eng3aRecite: {},
        eng3aQuiz: {},
        completedChinese: [],
        completedEng3a: [],
        lessonDoneOn: 'oops',
        readingDoneOn: null,
      },
      version: 10,
    }
    localStorage.setItem(KEY, JSON.stringify(dirty))

    await useCourseStore.persist.rehydrate()

    expect(useCourseStore.getState().lessonDoneOn).toBe(0)
    expect(useCourseStore.getState().readingDoneOn).toBe(0)
  })
})

describe('持久化', () => {
  it('lessonDoneOn / readingDoneOn 被写进 localStorage', async () => {
    useCourseStore.getState().markLessonToday()
    await new Promise((r) => setTimeout(r, 0))

    const raw = JSON.parse(localStorage.getItem(KEY)!)
    expect(raw.state.lessonDoneOn).toBe(dayStamp())
  })
})