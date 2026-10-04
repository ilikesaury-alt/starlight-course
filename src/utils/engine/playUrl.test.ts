// @vitest-environment jsdom
/**
 * playUrl 单测：守住「有响应但没声音」这一类最难排查的失败。
 *
 * 背景：实测有道 dictvoice 在无法合成时会回一段**固定的空白音频**
 * （HTTP 200 + 约 48ms 静音 mp3，不同文本字节完全相同）。
 * 旧实现把 `onended` 一律当 success，于是兜底链停在静音上、WebSpeech 再也不出声，
 * 对外表现就是「点了完全没声音」且毫无报错。
 *
 * 约定：
 *   - 时长短于 200ms → failed（让链路继续降级）；
 *   - duration 未知（NaN）或流式（Infinity）→ 放行，不误杀；
 *   - 正常音频仍然 success。
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('./engineTrace', () => ({
  traceNote: vi.fn(),
}))

/** 可控的假 audio 元素：jsdom 不实现媒体播放，这里手动驱动事件 */
class FakeAudio {
  preload = ''
  playbackRate = 1
  src = ''
  paused = true
  duration = NaN
  onerror: null | (() => void) = null
  onended: null | (() => void) = null
  onplaying: null | (() => void) = null
  private listeners: Record<string, Array<() => void>> = {}

  addEventListener(type: string, fn: () => void) {
    ;(this.listeners[type] ||= []).push(fn)
  }
  removeEventListener() {}
  load() {}
  pause() {
    this.paused = true
  }
  play() {
    this.paused = false
    return Promise.resolve()
  }
  fire(type: string) {
    for (const fn of this.listeners[type] ?? []) fn()
  }
}

let inst: FakeAudio

beforeEach(() => {
  vi.resetModules()
  inst = new FakeAudio()
  vi.stubGlobal(
    'Audio',
    function AudioStub() {
      return inst
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function loadPlayUrl() {
  const mod = await import('./playUrl')
  return mod.playUrl
}

describe('playUrl · 空白音频判定', () => {
  it('48ms 空白片段判 failed，让兜底链继续降级', async () => {
    const playUrl = await loadPlayUrl()
    const p = playUrl('https://dict.youdao.com/dictvoice?audio=%E7%8C%AB&type=2')

    inst.duration = 0.048
    inst.fire('loadedmetadata')

    expect(await p).toEqual({ status: 'failed' })
  })

  it('空白片段即使正常 ended 也不算成功', async () => {
    const playUrl = await loadPlayUrl()
    const p = playUrl('blob:blank')

    inst.duration = 0.048
    inst.fire('loadedmetadata')
    inst.onended?.()

    expect(await p).toEqual({ status: 'failed' })
  })

  it('正常单词音频判 success', async () => {
    const playUrl = await loadPlayUrl()
    const p = playUrl('https://dict.youdao.com/dictvoice?audio=cat&type=1')

    inst.duration = 0.336 // 实测 cat ≈ 336ms
    inst.fire('loadedmetadata')
    inst.onended?.()

    expect(await p).toEqual({ status: 'success' })
  })

  it('流式音频 duration=Infinity 不误判为空白', async () => {
    const playUrl = await loadPlayUrl()
    const p = playUrl('blob:stream')

    inst.duration = Infinity
    inst.fire('loadedmetadata')
    inst.onended?.()

    expect(await p).toEqual({ status: 'success' })
  })

  it('duration 未知（NaN）不误判为空白', async () => {
    const playUrl = await loadPlayUrl()
    const p = playUrl('blob:unknown')

    inst.duration = NaN
    inst.fire('loadedmetadata')
    inst.onended?.()

    expect(await p).toEqual({ status: 'success' })
  })

  it('代次失效时立即 aborted，不碰媒体元素', async () => {
    const playUrl = await loadPlayUrl()
    const out = await playUrl('blob:x', { guard: () => false })
    expect(out).toEqual({ status: 'aborted' })
  })
})
