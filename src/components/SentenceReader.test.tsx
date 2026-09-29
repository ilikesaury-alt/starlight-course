// @vitest-environment jsdom
// 跟读组件的降级闭环测试（T1.4 / T2.5）：
// 浏览器不支持 SpeechRecognition 时，必须渲染「家长确认」按钮，
// 点击后照样记对（onPass 被调用），流程不中断、不崩溃。

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, act } from '@testing-library/react'
import SentenceReader from './SentenceReader'

// 不设这个，act() 里的 setState 不会提交，断言看不到渲染结果
beforeAll(() => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(cleanup)

// jsdom 里默认没有 SpeechRecognition（等价于 Firefox / 降级环境）
afterEach(() => {
  delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition
  delete (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
})

describe('SentenceReader 降级闭环', () => {
  it('supported=false 时渲染「家长确认」按钮', () => {
    render(<SentenceReader sentence="I have a doll." zh="我有一个洋娃娃。" />)
    expect(screen.getByRole('button', { name: /家长确认/ })).toBeTruthy()
    expect(screen.getByText(/不支持语音识别/)).toBeTruthy()
  })

  it('点击「家长确认」→ 调用 onPass(true 语义)：达标回调被触发', () => {
    const onPass = vi.fn()
    render(<SentenceReader sentence="I have a doll." onPass={onPass} />)
    const btn = screen.getByRole('button', { name: /家长确认/ })
    fireEvent.click(btn)
    expect(onPass).toHaveBeenCalledTimes(1)
    // 达标后展示正反馈，不展示分数
    expect(screen.getByText(/太棒了/)).toBeTruthy()
  })

  it('达标不暴露相似度分数（儿童 UX）', () => {
    render(<SentenceReader sentence="I have a doll." onPass={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /家长确认/ }))
    expect(screen.queryByText(/%/)).toBeNull()
  })

  it('普通麦克风按钮始终可用（未进入 listening 前可点）', () => {
    render(<SentenceReader sentence="I have a doll." />)
    expect(screen.getByRole('button', { name: /我来读/ })).toBeTruthy()
  })
})

describe('SentenceReader 识别成功路径', () => {
  /** 装一个假的 SpeechRecognition：start() 立刻回报最终文本 */
  function stubRecognition(transcript: string) {
    class Fake {
      lang = ''
      continuous = false
      interimResults = false
      maxAlternatives = 1
      onresult: ((e: unknown) => void) | null = null
      onerror: ((e: unknown) => void) | null = null
      onend: (() => void) | null = null
      start() {
        this.onresult?.({
          resultIndex: 0,
          results: Object.assign([{ isFinal: true, 0: { transcript } }], { length: 1 }),
        })
        this.onend?.()
      }
      stop() {}
      abort() {}
    }
    ;(window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = Fake
  }

  it('识别到完整句子 → 达标 + onPass 触发', () => {
    vi.useFakeTimers()
    stubRecognition('I have a doll')
    const onPass = vi.fn()
    render(<SentenceReader sentence="I have a doll." onPass={onPass} />)
    // 没有降级提示（识别可用）
    expect(screen.queryByRole('button', { name: /家长确认/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /我来读/ }))
    // jsdom 里 TTS 不会回调 onEnd，靠 hook 的 1.8s 兜底定时器开麦
    act(() => { vi.advanceTimersByTime(2000) })
    expect(onPass).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('识别不完整 → 不达标，展示「再试一次」', () => {
    vi.useFakeTimers()
    stubRecognition('i have')
    const onPass = vi.fn()
    render(<SentenceReader sentence="I have a doll." onPass={onPass} />)
    fireEvent.click(screen.getByRole('button', { name: /我来读/ }))
    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByRole('button', { name: /再试一次/ })).toBeTruthy()
    expect(onPass).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
