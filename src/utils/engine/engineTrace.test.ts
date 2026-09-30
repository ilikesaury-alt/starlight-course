// @vitest-environment jsdom
/**
 * engineTrace 单测：诊断链路的行为约定。
 *
 * 关键约定（诊断不能给主链路添负担，也不能误伤正常设备）：
 *   - 默认（未开 ?debug=audio）不记事件流，但仍然维护「最后一次成功」；
 *   - 开了诊断后事件按环形上限覆盖，订阅者能收到变更通知；
 *   - isAudioDebug 识别 search 与 HashRouter 的 hash query。
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  clearTrace,
  getLastSuccess,
  getTrace,
  isAudioDebug,
  subscribeTrace,
  traceEngine,
  traceNote,
} from './engineTrace'

// kokoro 模块在 trace 里被 import（isWebGPUSupported），这里做最小替身
vi.mock('./kokoro', () => ({ isWebGPUSupported: () => false }))

function setLocation(href: string) {
  window.history.replaceState({}, '', href)
}

describe('engineTrace', () => {
  beforeEach(() => {
    localStorage.clear()
    clearTrace()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('默认不开诊断时不记录事件流，但记住最后一次成功', () => {
    setLocation('/app/')
    traceEngine('youdao', 'success', 120, 'apple')
    expect(getTrace()).toHaveLength(0)
    expect(getLastSuccess()).toMatchObject({ engine: 'youdao', text: 'apple' })

    // 失败的事件不留痕，但也不能把「上次成功」抹掉
    traceEngine('webspeech', 'failed', 900, 'banana')
    expect(getTrace()).toHaveLength(0)
    expect(getLastSuccess()?.engine).toBe('youdao')
  })

  it('开诊断后记录事件流并通知订阅者', () => {
    setLocation('/app/?debug=audio')
    expect(isAudioDebug()).toBe(true)

    const fn = vi.fn()
    const off = subscribeTrace(fn)

    traceEngine('youdao', 'blocked', 30, 'cat')
    traceNote('kokoro', '模型加载失败：timeout')
    expect(getTrace()).toHaveLength(2)
    expect(getTrace()[1]).toMatchObject({ engine: 'kokoro', status: 'note' })
    expect(fn).toHaveBeenCalled()

    off()
    const before = fn.mock.calls.length
    traceEngine('webspeech', 'success', 10, 'dog')
    expect(fn.mock.calls.length).toBe(before)
  })

  it('识别 HashRouter 里的 hash query', () => {
    setLocation('/app/#/starlight?debug=audio')
    expect(isAudioDebug()).toBe(true)
    traceEngine('youdao', 'failed', 5, 'egg')
    expect(getTrace()).toHaveLength(1)
  })

  it('localStorage 开关同样生效', () => {
    setLocation('/app/')
    expect(isAudioDebug()).toBe(false)
    localStorage.setItem('starlight.debug.audio', '1')
    expect(isAudioDebug()).toBe(true)
  })

  it('clearTrace 清空事件流与最后成功记录', () => {
    setLocation('/app/?debug=audio')
    traceEngine('youdao', 'success', 10, 'fish')
    expect(getLastSuccess()).not.toBeNull()
    clearTrace()
    expect(getTrace()).toHaveLength(0)
    expect(getLastSuccess()).toBeNull()
  })
})
