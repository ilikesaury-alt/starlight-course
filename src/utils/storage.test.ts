// @vitest-environment jsdom
// 数据落盘适配层测试（vitest + jsdom）
//
// ⚠️ 必须 jsdom：store 的 persist 需要 localStorage 才挂 API（同 backup.test.ts）。
//
// 这里不碰真实 Electron —— 用一个假的 window.starlightStore 模拟 preload，
// 把「读文件 / 写文件」替换成内存变量，从而验证：
//   · 首次运行把 localStorage 进度种进文件（不丢进度）
//   · 文件存在时以文件为准
//   · 文件坏掉时保留现有进度、不崩
//   · store 变更会（防抖后）写回文件

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useCourseStore } from '@/store/useCourseStore'
import { parseBackup, pickPersisted, storeVersion } from './backup'
import { attachFileStore, dataFilePath, hasFileStore, hydrateFromFile } from './storage'

/** 假的 preload bridge：用内存变量代替磁盘 */
function installFakeBridge(initial: string | null = null) {
  const box = { content: initial, writes: 0 }
  ;(window as unknown as Record<string, unknown>).starlightStore = {
    read: async () => box.content,
    write: async (json: string) => {
      box.content = json
      box.writes += 1
      return { ok: true }
    },
    path: async () => 'C:/fake/userData/starlight-data.json',
  }
  return box
}

const removeBridge = () => {
  delete (window as unknown as Record<string, unknown>).starlightStore
}

/** 把一份「磁盘数据文件」内容按当前格式造出来 */
function makeFileContent(state: Record<string, unknown>): string {
  return JSON.stringify({ state, version: storeVersion() })
}

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
})

afterEach(() => {
  removeBridge()
})

describe('hasFileStore —— 能力探测', () => {
  it('没有 bridge 时为 false（网页版）', () => {
    expect(hasFileStore()).toBe(false)
  })

  it('有 bridge 时为 true（桌面版）', () => {
    installFakeBridge()
    expect(hasFileStore()).toBe(true)
  })
})

describe('hydrateFromFile —— 首次运行：把 localStorage 进度种进文件', () => {
  it('文件不存在时写出当前进度，且进度不丢', async () => {
    const box = installFakeBridge(null)
    useCourseStore.getState().addStars(55)
    useCourseStore.getState().markChineseDone('cn-x')

    const path = await hydrateFromFile()

    expect(box.writes).toBe(1)
    expect(path).toBe('C:/fake/userData/starlight-data.json')
    // 种下去的内容里必须有刚才的进度
    const written = JSON.parse(box.content!)
    expect(written.state.totalStars).toBe(55)
    expect(written.state.completedChinese).toEqual(['cn-x'])
    // store 本身不受影响
    expect(useCourseStore.getState().totalStars).toBe(55)
  })
})

describe('hydrateFromFile —— 文件存在时以文件为准', () => {
  it('读出文件内容并覆盖 store', async () => {
    installFakeBridge(
      makeFileContent({
        totalStars: 900,
        wrongWords: [],
        completedChinese: ['from-file'],
      })
    )
    useCourseStore.getState().addStars(1) // 内存里先有个小值

    await hydrateFromFile()

    expect(useCourseStore.getState().totalStars).toBe(900)
    expect(useCourseStore.getState().completedChinese).toEqual(['from-file'])
  })

  it('旧版本文件能通过迁移链恢复', async () => {
    // v1 形状：只有 masteredWords
    installFakeBridge(
      JSON.stringify({ state: { totalStars: 7, masteredWords: ['dog'], wrongWords: [] }, version: 1 })
    )

    await hydrateFromFile()

    const cards = useCourseStore.getState().srsCards
    expect(Object.keys(cards)).toContain('dog')
    expect(useCourseStore.getState().totalStars).toBe(7)
  })
})

describe('hydrateFromFile —— 坏文件不崩、不丢现有进度', () => {
  it('文件内容不是合法 JSON 时保留现有进度', async () => {
    installFakeBridge('{{{ not json')
    useCourseStore.getState().addStars(33)

    const path = await hydrateFromFile()

    // 没被覆盖，也没抛
    expect(useCourseStore.getState().totalStars).toBe(33)
    expect(path).toBe('C:/fake/userData/starlight-data.json')
  })

  it('文件是合法 JSON 但没有学习数据时保留现有进度', async () => {
    installFakeBridge(JSON.stringify({ hello: 'world' }))
    useCourseStore.getState().addStars(12)

    await hydrateFromFile()

    expect(useCourseStore.getState().totalStars).toBe(12)
  })

  it('bridge 抛错时不阻塞启动', async () => {
    ;(window as unknown as Record<string, unknown>).starlightStore = {
      read: async () => {
        throw new Error('boom')
      },
      write: async () => ({ ok: true }),
      path: async () => 'C:/x.json',
    }

    await expect(hydrateFromFile()).resolves.toBeNull()
  })
})

describe('hydrateFromFile —— 网页版是空操作', () => {
  it('没有 bridge 时返回 null，store 不变', async () => {
    useCourseStore.getState().addStars(4)
    await expect(hydrateFromFile()).resolves.toBeNull()
    expect(useCourseStore.getState().totalStars).toBe(4)
  })
})

describe('attachFileStore —— 变更写回文件', () => {
  it('store 变更后（防抖到期）写入文件', async () => {
    vi.useFakeTimers()
    try {
      const box = installFakeBridge(makeFileContent({ totalStars: 0 }))
      const stop = attachFileStore()

      useCourseStore.getState().addStars(9)
      expect(box.writes).toBe(0) // 还在防抖窗口里

      await vi.advanceTimersByTimeAsync(500)

      expect(box.writes).toBeGreaterThan(0)
      const written = JSON.parse(box.content!)
      expect(written.state.totalStars).toBe(9)
      stop()
    } finally {
      vi.useRealTimers()
    }
  })

  it('短时间内多次变更只写一次（防抖生效）', async () => {
    vi.useFakeTimers()
    try {
      const box = installFakeBridge(makeFileContent({ totalStars: 0 }))
      const stop = attachFileStore()

      // addStars 是累加：1+2+3 = 6（防抖要保证的是「只写一次」，值无所谓）
      useCourseStore.getState().addStars(1)
      useCourseStore.getState().addStars(2)
      useCourseStore.getState().addStars(3)
      await vi.advanceTimersByTimeAsync(500)

      expect(box.writes).toBe(1)
      expect(JSON.parse(box.content!).state.totalStars).toBe(6)
      stop()
    } finally {
      vi.useRealTimers()
    }
  })

  it('网页版 attach 是空操作，不报错', () => {
    expect(() => attachFileStore()).not.toThrow()
  })
})

describe('dataFilePath', () => {
  it('桌面版返回路径，网页版返回 null', async () => {
    expect(await dataFilePath()).toBeNull()
    installFakeBridge(null)
    expect(await dataFilePath()).toBe('C:/fake/userData/starlight-data.json')
  })
})

describe('与备份模块的一致性', () => {
  it('写进文件的内容能被 parseBackup 原样读回', async () => {
    const box = installFakeBridge(null)
    useCourseStore.getState().addStars(21)
    await hydrateFromFile() // 触发首次写入

    const res = await parseBackup(box.content!)
    expect(res.ok).toBe(true)
    expect(res.data?.totalStars).toBe(21)
    expect(Object.keys(res.data!).sort()).toEqual(Object.keys(pickPersisted()).sort())
  })
})
