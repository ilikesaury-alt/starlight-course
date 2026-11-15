// @vitest-environment jsdom
// 备份 / 恢复测试（vitest + jsdom）
//
// ⚠️ 必须是 jsdom 环境：store 的 persist 中间件在**没有 localStorage 的环境里不会
//    挂上 `persist` API**（node 环境下 useCourseStore.persist 是 undefined），
//    而备份模块的字段清单正是从 persist.partialize 读的。缺了这行，
//    整个文件会以 "Cannot read properties of undefined (reading 'getOptions')" 全红。

import { describe, it, expect, beforeEach } from 'vitest'
import { useCourseStore } from '@/store/useCourseStore'
import {
  BACKUP_KIND,
  BACKUP_SCHEMA,
  applyBackup,
  backupFileName,
  buildBackup,
  buildCurrentBackup,
  parseBackup,
  pickPersisted,
  storeVersion,
  summarize,
} from './backup'

// 备份的价值全在「恢复得回来」。这里钉的是往返一致性，不是内部实现。
// 特别注意：项目 tsconfig 是 strict:false，判别联合不会按 ok 收窄，
// 所以断言里一律先 expect(res.ok) 再取字段。

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
})

describe('pickPersisted —— 字段清单与 store 的 partialize 同源', () => {
  it('包含 store 全部持久化字段，且不含任何函数（actions）', () => {
    const data = pickPersisted()
    expect(Object.keys(data).length).toBeGreaterThan(0)
    for (const v of Object.values(data)) {
      expect(typeof v).not.toBe('function')
    }
  })

  it('核心字段都在（少一个就意味着备份会丢数据）', () => {
    const data = pickPersisted()
    for (const key of [
      'wrongWords',
      'totalStars',
      'completedPreviews',
      'completedQuizzes',
      'lessonCompleted',
      'completedStories',
      'srsCards',
      'starlightExtensions',
      'extensionRound',
      'reciteCheckins',
      'chineseQuiz',
      'eng3aRecite',
      'eng3aQuiz',
      'completedChinese',
      'completedEng3a',
    ]) {
      expect(data).toHaveProperty(key)
    }
  })

  it('partialize 与 pickPersisted 返回同一批字段名', () => {
    const partialize = useCourseStore.persist.getOptions().partialize
    expect(typeof partialize).toBe('function')
    const fromPartialize = partialize!(useCourseStore.getState() as never) as Record<string, unknown>
    expect(Object.keys(fromPartialize).sort()).toEqual(Object.keys(pickPersisted()).sort())
  })
})

describe('buildBackup —— 备份信封', () => {
  it('带 kind / schema / storeVersion / exportedAt', () => {
    const file = buildBackup({ totalStars: 3 }, new Date('2026-11-15T12:00:00.000Z'))
    expect(file.kind).toBe(BACKUP_KIND)
    expect(file.schema).toBe(BACKUP_SCHEMA)
    expect(file.storeVersion).toBe(storeVersion())
    expect(file.exportedAt).toBe('2026-11-15T12:00:00.000Z')
    expect(file.data).toEqual({ totalStars: 3 })
  })

  it('文件名带本地日期', () => {
    const name = backupFileName(new Date(2026, 10, 15)) // 本地 2026-11-15
    expect(name).toBe('starlight-学习数据-2026-11-15.json')
  })

  it('从 store 当前状态组装备份，字段与 partialize 一致', () => {
    const file = buildCurrentBackup()
    expect(Object.keys(file.data).sort()).toEqual(Object.keys(pickPersisted()).sort())
  })
})

describe('summarize —— 摘要如实反映数据量', () => {
  it('统计星星 / 卡片 / 错题 / 课数', () => {
    const s = summarize({
      totalStars: 42,
      wrongWords: [{ en: 'a' }, { en: 'b' }],
      srsCards: { a: {}, b: {}, c: {} },
      lessonCompleted: { u1: [1, 2, 3], u2: [1] },
      completedChinese: ['c1'],
      completedEng3a: [],
      completedPreviews: ['u1'],
      completedStories: [],
    })
    expect(s.stars).toBe(42)
    expect(s.wrongWords).toBe(2)
    expect(s.srsCards).toBe(3)
    expect(s.lessonsDone).toBe(4)
    expect(s.chineseDone).toBe(1)
    expect(s.eng3aDone).toBe(0)
  })

  it('空数据不炸', () => {
    const s = summarize({})
    expect(s.stars).toBe(0)
    expect(s.srsCards).toBe(0)
    expect(s.lessonsDone).toBe(0)
  })
})

describe('parseBackup —— 往返一致性（最关键的一条）', () => {
  it('导出 → 解析 → 写回，进度完全还原', async () => {
    const store = useCourseStore.getState()
    store.addStars(17)
    store.addWrongWord({ en: 'cat', zh: '猫', emoji: '🐱', from: 'u1', module: 'starlight' })
    store.seedCard('cat', 'starlight')
    store.markChineseDone('cn-1')

    const before = pickPersisted()
    const file = buildCurrentBackup()
    const text = JSON.stringify(file)

    // 清空，模拟「卸载重装」
    useCourseStore.getState().resetAll()
    expect(pickPersisted().totalStars).toBe(0)

    const res = await parseBackup(text)
    expect(res.ok).toBe(true)
    expect(res.data).toBeTruthy()
    applyBackup(res.data!)

    const after = pickPersisted()
    expect(after.totalStars).toBe(17)
    expect((after.wrongWords as unknown[]).length).toBe(1)
    expect(Object.keys(after.srsCards as object)).toContain('cat')
    expect(after.completedChinese).toEqual(['cn-1'])
    // 逐字段比对：任何一个字段丢了，这条都会红
    for (const key of Object.keys(before)) {
      expect(after[key]).toEqual(before[key])
    }
  })

  it('接受 zustand persist 原始落盘格式（{ state, version }）', async () => {
    const res = await parseBackup(
      JSON.stringify({
        state: { totalStars: 9, wrongWords: [], completedChinese: [] },
        version: storeVersion(),
      })
    )
    expect(res.ok).toBe(true)
    expect(res.data?.totalStars).toBe(9)
  })

  it('旧版本备份会被标记 migratedFrom，且数据仍能通过迁移链', async () => {
    const res = await parseBackup(
      JSON.stringify({
        kind: BACKUP_KIND,
        schema: BACKUP_SCHEMA,
        storeVersion: 1,
        exportedAt: '2026-01-01T00:00:00.000Z',
        // v1 时代的形状：只有 masteredWords，没有 srsCards / fsrs
        data: { totalStars: 5, masteredWords: ['dog'], wrongWords: [] },
      })
    )
    expect(res.ok).toBe(true)
    expect(res.migratedFrom).toBe(1)
    // 迁移链把 masteredWords 升级成了 SRS 卡片
    expect(Object.keys(res.data?.srsCards as object)).toContain('dog')
  })
})

describe('parseBackup —— 坏输入必须被人话挡住', () => {
  it('非 JSON', async () => {
    const res = await parseBackup('not json at all {{{')
    expect(res.ok).toBe(false)
    expect(res.error).toContain('JSON')
  })

  it('认不出的结构（既非备份信封也非 persist 格式）', async () => {
    const res = await parseBackup(JSON.stringify({ hello: 'world' }))
    expect(res.ok).toBe(false)
    expect(res.error).toBeTruthy()
  })

  it('字段类型不对：数组字段给了字符串', async () => {
    const res = await parseBackup(
      JSON.stringify({ kind: BACKUP_KIND, storeVersion: storeVersion(), data: { wrongWords: 'oops' } })
    )
    expect(res.ok).toBe(false)
    expect(res.error).toContain('wrongWords')
  })

  it('空数据', async () => {
    const res = await parseBackup(JSON.stringify({ kind: BACKUP_KIND, data: {} }))
    expect(res.ok).toBe(false)
  })

  it('负数字段被夹到 0（不写脏数据进 store）', async () => {
    const res = await parseBackup(
      JSON.stringify({ kind: BACKUP_KIND, data: { totalStars: -5, wrongWords: [] } })
    )
    expect(res.ok).toBe(true)
    expect(res.data?.totalStars).toBe(0)
  })
})

describe('applyBackup —— 不冲掉 actions', () => {
  it('写入后 store 的方法仍然可用', () => {
    applyBackup({ totalStars: 1 })
    const store = useCourseStore.getState()
    expect(typeof store.addStars).toBe('function')
    store.addStars(2)
    expect(useCourseStore.getState().totalStars).toBe(3)
  })
})
