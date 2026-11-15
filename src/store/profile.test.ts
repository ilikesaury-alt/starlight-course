// @vitest-environment jsdom
// 孩子档案（v9 新增）+ v8→v9 迁移测试
//
// ⚠️ 必须 jsdom：persist 需要 localStorage。
//
// 这里最要紧的是**迁移**：老用户机器上躺着 v8 的 localStorage，
// 升级到 v9 后那些星星/卡片/完成记录一条都不能少，同时补出 profile。

import { describe, it, expect, beforeEach } from 'vitest'
import { useCourseStore, PROFILE_AVATARS, defaultProfile } from './useCourseStore'

const KEY = 'starlight-course'

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
  // resetAll 保留 profile，测试之间要显式还原成未初始化
  useCourseStore.setState({ profile: defaultProfile() })
})

describe('defaultProfile', () => {
  it('未设置时 name 为空串（不是假名字），id 稳定为 main', () => {
    const p = defaultProfile()
    expect(p.id).toBe('main')
    expect(p.name).toBe('')
    expect(PROFILE_AVATARS).toContain(p.avatar)
    expect(typeof p.createdAt).toBe('number')
  })
})

describe('updateProfile', () => {
  it('设置昵称与头像', () => {
    useCourseStore.getState().updateProfile({ name: '小明', avatar: '🐼' })
    const p = useCourseStore.getState().profile
    expect(p.name).toBe('小明')
    expect(p.avatar).toBe('🐼')
  })

  it('只合并传入字段，不动其它', () => {
    const before = useCourseStore.getState().profile
    useCourseStore.getState().updateProfile({ name: '小红' })
    const after = useCourseStore.getState().profile
    expect(after.name).toBe('小红')
    expect(after.avatar).toBe(before.avatar) // 没传就不改
    expect(after.id).toBe('main')
    expect(after.createdAt).toBe(before.createdAt)
  })

  it('昵称去首尾空白并截断到 12 字', () => {
    useCourseStore.getState().updateProfile({ name: '   小 明   ' })
    expect(useCourseStore.getState().profile.name).toBe('小 明')

    useCourseStore.getState().updateProfile({ name: '一'.repeat(30) })
    expect(useCourseStore.getState().profile.name).toHaveLength(12)
  })

  it('纯空格昵称收敛为空串（等价于未设置）', () => {
    useCourseStore.getState().updateProfile({ name: '    ' })
    expect(useCourseStore.getState().profile.name).toBe('')
  })
})

describe('resetAll 保留档案', () => {
  it('重置学习数据后昵称与头像还在', () => {
    const store = useCourseStore.getState()
    store.updateProfile({ name: '小明', avatar: '🦊' })
    store.addStars(99)
    store.markChineseDone('cn-1')

    useCourseStore.getState().resetAll()

    const after = useCourseStore.getState()
    expect(after.profile.name).toBe('小明')
    expect(after.profile.avatar).toBe('🦊')
    // 学习数据确实清了
    expect(after.totalStars).toBe(0)
    expect(after.completedChinese).toEqual([])
  })
})

describe('v8 → v9 迁移（老用户升级不能丢进度）', () => {
  it('v8 数据补出 profile，且学习数据一条不少', async () => {
    // 造一份 v8 的真实形状（没有 profile 字段）
    const v8 = {
      state: {
        wrongWords: [
          { en: 'apple', zh: '苹果', emoji: '🍎', from: 'u1', module: 'starlight' },
        ],
        totalStars: 128,
        completedPreviews: ['unit-1'],
        completedQuizzes: [],
        lessonCompleted: { 'unit-1': [1, 2, 3] },
        completedStories: [],
        srsCards: {
          apple: {
            en: 'apple',
            box: 2,
            nextReview: 99999,
            lastReview: 0,
            streak: 1,
            reviews: 1,
            modules: ['starlight'],
            fsrs: {},
          },
        },
        starlightExtensions: {},
        extensionRound: {},
        reciteCheckins: {},
        chineseQuiz: {},
        eng3aRecite: {},
        eng3aQuiz: {},
        completedChinese: ['cn-1'],
        completedEng3a: [],
      },
      version: 8,
    }
    localStorage.setItem(KEY, JSON.stringify(v8))

    // 触发重新水合：persist 会读出 v8 并跑 migrate
    await useCourseStore.persist.rehydrate()

    const s = useCourseStore.getState()

    // 1) 补出了 profile，且是「未设置昵称」状态（不是假名字）
    expect(s.profile).toBeTruthy()
    expect(s.profile.id).toBe('main')
    expect(s.profile.name).toBe('')
    expect(PROFILE_AVATARS).toContain(s.profile.avatar)

    // 2) 老进度一条不少
    expect(s.totalStars).toBe(128)
    expect(s.wrongWords).toHaveLength(1)
    expect(s.wrongWords[0].en).toBe('apple')
    expect(Object.keys(s.srsCards)).toContain('apple')
    expect(s.lessonCompleted['unit-1']).toEqual([1, 2, 3])
    expect(s.completedChinese).toEqual(['cn-1'])
  })

  it('v9 数据里已有的 profile 会被保留（不覆盖成默认值）', async () => {
    const v9 = {
      state: {
        profile: { id: 'main', name: '小明', avatar: '🐼', createdAt: 20000 },
        totalStars: 5,
        wrongWords: [],
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
      },
      version: 9,
    }
    localStorage.setItem(KEY, JSON.stringify(v9))

    await useCourseStore.persist.rehydrate()

    const p = useCourseStore.getState().profile
    expect(p.name).toBe('小明')
    expect(p.avatar).toBe('🐼')
    expect(p.createdAt).toBe(20000)
  })

  it('profile 残缺时逐字段兜底，不整块丢弃', async () => {
    const broken = {
      state: {
        profile: { name: '小明' }, // 缺 id / avatar / createdAt
        totalStars: 3,
        wrongWords: [],
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
      },
      version: 9,
    }
    localStorage.setItem(KEY, JSON.stringify(broken))

    await useCourseStore.persist.rehydrate()

    const p = useCourseStore.getState().profile
    expect(p.name).toBe('小明') // 有效字段保住
    expect(p.id).toBe('main') // 缺失字段补默认
    expect(PROFILE_AVATARS).toContain(p.avatar)
    expect(typeof p.createdAt).toBe('number')
  })
})

describe('profile 进入持久化与备份', () => {
  it('profile 被写进 localStorage', async () => {
    useCourseStore.getState().updateProfile({ name: '小华', avatar: '🦄' })
    // persist 写盘是同步的（localStorage），等一个微任务即可
    await new Promise((r) => setTimeout(r, 0))

    const raw = JSON.parse(localStorage.getItem(KEY)!)
    expect(raw.state.profile).toEqual(
      expect.objectContaining({ name: '小华', avatar: '🦄' })
    )
  })
})
