// @vitest-environment jsdom
// 「孩子 / 家长」模式读写测试
//
// 这个开关的价值全在「默认值」和「孩子看不到破坏性按钮」两件事上，
// 所以测试重点：默认必须是孩子模式、写读一致、订阅广播生效。

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  VIEW_MODE_KEY,
  readViewMode,
  subscribeViewMode,
  writeViewMode,
} from './viewMode'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('readViewMode —— 默认值是最重要的产品决定', () => {
  it('从未设置时返回 kid（孩子模式）', () => {
    expect(readViewMode()).toBe('kid')
  })

  it('localStorage 被禁用 / 抛错时也回落 kid，不崩', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    expect(readViewMode()).toBe('kid')
  })

  it('存了非法值时不认，回落 kid', () => {
    localStorage.setItem(VIEW_MODE_KEY, 'admin')
    expect(readViewMode()).toBe('kid')
  })
})

describe('writeViewMode / readViewMode', () => {
  it('写入 parent 后能读回', () => {
    writeViewMode('parent')
    expect(readViewMode()).toBe('parent')
  })

  it('写入 kid 后能读回（从家长切回孩子）', () => {
    writeViewMode('parent')
    writeViewMode('kid')
    expect(readViewMode()).toBe('kid')
  })

  it('写入失败仍要广播（本次会话两处 UI 必须一致）', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    const spy = vi.fn()
    const stop = subscribeViewMode(spy)

    expect(() => writeViewMode('parent')).not.toThrow()
    expect(spy).toHaveBeenCalled()

    stop()
  })
})

describe('subscribeViewMode —— 同页写入要通知到所有读者', () => {
  it('写入时通知订阅者', () => {
    const spy = vi.fn()
    const stop = subscribeViewMode(spy)

    writeViewMode('parent')
    expect(spy).toHaveBeenCalledTimes(1)

    writeViewMode('kid')
    expect(spy).toHaveBeenCalledTimes(2)

    stop()
  })

  it('取消订阅后不再通知', () => {
    const spy = vi.fn()
    const stop = subscribeViewMode(spy)
    stop()

    writeViewMode('parent')
    expect(spy).not.toHaveBeenCalled()
  })

  it('多个订阅者都收到（顶栏开关 + 进度页区块）', () => {
    const a = vi.fn()
    const b = vi.fn()
    const stopA = subscribeViewMode(a)
    const stopB = subscribeViewMode(b)

    writeViewMode('parent')

    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)

    stopA()
    stopB()
  })

  it('跨标签页 storage 事件也能触发', () => {
    const spy = vi.fn()
    const stop = subscribeViewMode(spy)

    window.dispatchEvent(
      new StorageEvent('storage', { key: VIEW_MODE_KEY, newValue: 'parent' })
    )
    expect(spy).toHaveBeenCalledTimes(1)

    // 无关的 key 不该触发
    window.dispatchEvent(
      new StorageEvent('storage', { key: 'something-else', newValue: 'x' })
    )
    expect(spy).toHaveBeenCalledTimes(1)

    stop()
  })
})