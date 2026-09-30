// @vitest-environment jsdom
// 跟读组件的降级闭环测试：识别失败全程自动 —— 先自动重听，重试用完只留「跳过这句」。
// 任何路径都不出现「家长确认」，失败路径也绝不假装读对（onPass 不被触发）。

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

/** 装一个每次都报错的假识别器，返回 start 调用次数 */
function stubFailingRecognition(code: string) {
  let starts = 0
  class Fake {
    lang = ''
    continuous = false
    interimResults = false
    maxAlternatives = 3
    onresult: ((e: unknown) => void) | null = null
    onerror: ((e: { error?: string }) => void) | null = null
    onend: (() => void) | null = null
    start() {
      starts++
      this.onerror?.({ error: code })
      this.onend?.()
    }
    stop() {}
    abort() {}
  }
  ;(window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = Fake
  return () => starts
}

/** 点「我来读」并分段推进定时器；给了 stop 条件就一到条件立刻停，
 *  避免一口气把后面的自动重试也推进去（否则拿不到「第 1 次」这个中间态） */
function startListening(stop?: () => boolean) {
  vi.useFakeTimers()
  fireEvent.click(screen.getByRole('button', { name: /我来读/ }))
  for (let i = 0; i < 60; i++) {
    act(() => {
      vi.advanceTimersByTime(200)
    })
    if (stop?.()) return
  }
}

describe('SentenceReader 降级闭环', () => {
  it('supported=false 时只给常驻说明（没有可跳过的失败态），且没有「家长确认」', () => {
    render(<SentenceReader sentence="I have a doll." zh="我有一个洋娃娃。" />)
    expect(screen.getByText(/不支持语音识别/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /跳过这句/ })).toBeNull()
    expect(screen.queryByRole('button', { name: /家长确认/ })).toBeNull()
  })

  it('终态失败点「跳过这句」→ 面板收起，且不触发达标回调（不假装读对）', () => {
    stubFailingRecognition('not-allowed')
    const onPass = vi.fn()
    render(<SentenceReader sentence="I have a doll." onPass={onPass} />)
    startListening()
    expect(screen.getByRole('button', { name: /跳过这句/ })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /跳过这句/ }))
    expect(screen.queryByRole('button', { name: /跳过这句/ })).toBeNull()
    expect(onPass).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('普通麦克风按钮始终可用（未进入 listening 前可点）', () => {
    render(<SentenceReader sentence="I have a doll." />)
    expect(screen.getByRole('button', { name: /我来读/ })).toBeTruthy()
  })
})

describe('SentenceReader 识别成功路径', () => {
  it('识别到完整句子 → 达标 + onPass 触发，且不展示分数', () => {
    stubRecognition('I have a doll')
    const onPass = vi.fn()
    render(<SentenceReader sentence="I have a doll." onPass={onPass} />)
    startListening()
    expect(onPass).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/太棒了/)).toBeTruthy()
    // 儿童 UX：不暴露相似度分数
    expect(screen.queryByText(/%/)).toBeNull()
    vi.useRealTimers()
  })

  it('识别不完整 → 不达标，展示「再试一次」', () => {
    stubRecognition('i have')
    const onPass = vi.fn()
    render(<SentenceReader sentence="I have a doll." onPass={onPass} />)
    startListening()
    expect(screen.getByRole('button', { name: /再试一次/ })).toBeTruthy()
    expect(onPass).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})

describe('SentenceReader 录音阶段动画与实时反馈', () => {
  /** 装一个静默的假识别器：只开麦、不回报（模拟孩子还没开口），返回开麦/被打断次数 */
  function stubSilentRecognition() {
    let starts = 0
    let aborts = 0
    class Fake {
      lang = ''
      continuous = false
      interimResults = false
      maxAlternatives = 3
      onresult: ((e: unknown) => void) | null = null
      onerror: ((e: unknown) => void) | null = null
      onend: (() => void) | null = null
      start() {
        starts++
      }
      stop() {}
      abort() {
        aborts++
      }
    }
    ;(window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = Fake
    return { starts: () => starts, aborts: () => aborts }
  }

  /** 装一个先吐中间结果、再停住的假识别器（证明麦克风在收音） */
  function stubInterimRecognition(text: string) {
    class Fake {
      lang = ''
      continuous = false
      interimResults = true
      maxAlternatives = 3
      onresult: ((e: unknown) => void) | null = null
      onerror: ((e: unknown) => void) | null = null
      onend: (() => void) | null = null
      start() {
        this.onresult?.({
          resultIndex: 0,
          results: Object.assign([{ isFinal: false, 0: { transcript: text } }], { length: 1 }),
        })
      }
      stop() {}
      abort() {}
    }
    ;(window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = Fake
  }

  it('点「我来读」→ 先出「先听一遍示范」，开麦后出「轮到你读啦」', () => {
    vi.useFakeTimers()
    stubSilentRecognition()
    render(<SentenceReader sentence="I have a doll." />)
    fireEvent.click(screen.getByRole('button', { name: /我来读/ }))
    expect(screen.getByText(/先听一遍示范/)).toBeTruthy()
    act(() => {
      vi.advanceTimersByTime(6200)
    })
    expect(screen.getByText(/轮到你读啦/)).toBeTruthy()
    expect(screen.queryByText(/先听一遍示范/)).toBeNull()
    vi.useRealTimers()
  })

  it('在听时显示识别中间结果（麦克风有没有收音一目了然）', () => {
    vi.useFakeTimers()
    stubInterimRecognition('Hello')
    render(<SentenceReader sentence="I have a doll." />)
    fireEvent.click(screen.getByRole('button', { name: /我来读/ }))
    act(() => {
      vi.advanceTimersByTime(6200)
    })
    expect(screen.getByText(/我听到：Hello/)).toBeTruthy()
    vi.useRealTimers()
  })

  it('示范没播完就换句 → 旧的开麦定时器被清掉，不会在新句子上偷偷开麦', () => {
    vi.useFakeTimers()
    const starts = stubFailingRecognition('no-speech')
    const { rerender } = render(<SentenceReader sentence="I have a doll." />)
    fireEvent.click(screen.getByRole('button', { name: /我来读/ }))
    // 示范还在放就切下一句：reset() 必须顺手清掉 phaseTimer
    rerender(<SentenceReader sentence="Hello! How are you?" />)
    act(() => {
      vi.advanceTimersByTime(7000)
    })
    expect(starts()).toBe(0)
    expect(screen.queryByRole('button', { name: /在听你说/ })).toBeNull()
    vi.useRealTimers()
  })

  it('在听时点「⏹ 停一下」→ 手动取消：停麦、回到「我来读」、不弹报错也不偷开新麦', () => {
    vi.useFakeTimers()
    const rec = stubSilentRecognition()
    render(<SentenceReader sentence="I have a doll." />)
    fireEvent.click(screen.getByRole('button', { name: /我来读/ }))
    act(() => {
      vi.advanceTimersByTime(6200)
    })
    expect(screen.getByText(/轮到你读啦/)).toBeTruthy()
    expect(rec.starts()).toBe(1)

    fireEvent.click(screen.getByRole('button', { name: /停一下/ }))
    // 回到待机：横幅收起、按钮恢复可点、没有降级报错面板
    expect(screen.queryByText(/轮到你读啦/)).toBeNull()
    expect(screen.getByRole('button', { name: /我来读/ })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /跳过这句/ })).toBeNull()
    expect(screen.queryByRole('button', { name: /停一下/ })).toBeNull()
    expect(rec.aborts()).toBe(1) // STT 真被停掉了
    // 迟到的兜底定时器 / 示范回调不能再偷偷开麦
    act(() => {
      vi.advanceTimersByTime(8000)
    })
    expect(rec.starts()).toBe(1)
    vi.useRealTimers()
  })

  it('示范还没播完点「⏹ 停一下」→ 横幅收起，且不再开麦', () => {
    vi.useFakeTimers()
    const rec = stubSilentRecognition()
    render(<SentenceReader sentence="I have a doll." />)
    fireEvent.click(screen.getByRole('button', { name: /我来读/ }))
    expect(screen.getByText(/先听一遍示范/)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /停一下/ }))
    expect(screen.queryByText(/先听一遍示范/)).toBeNull()
    expect(screen.queryByRole('button', { name: /停一下/ })).toBeNull()
    act(() => {
      vi.advanceTimersByTime(9000)
    })
    expect(rec.starts()).toBe(0)
    vi.useRealTimers()
  })
})

describe('SentenceReader 自动重听（替代家长确认）', () => {
  it('no-speech → 自动重听，用完才交给孩子（跳过），全程无家长确认', () => {
    const starts = stubFailingRecognition('no-speech')
    const onPass = vi.fn()
    render(<SentenceReader sentence="I have a doll." onPass={onPass} />)

    startListening(() => starts() >= 1) // 一开麦就停，避免把自动重试也推进来
    expect(starts()).toBe(1)
    expect(screen.getByText(/我再听一次/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /跳过这句/ })).toBeNull()

    act(() => {
      vi.advanceTimersByTime(900)
    }) // 自动重听 → 第 2 次失败
    expect(starts()).toBe(2)
    act(() => {
      vi.advanceTimersByTime(900)
    }) // 自动重听 → 第 3 次失败（重试用完）
    expect(starts()).toBe(3)

    // 终态：给「跳过这句」，麦克风按钮回到可点的「我来读」
    expect(screen.getByRole('button', { name: /跳过这句/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /我来读/ })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /家长确认/ })).toBeNull()
    expect(onPass).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('not-allowed（麦克风没权限）不自动重听，直接给「跳过这句」', () => {
    const starts = stubFailingRecognition('not-allowed')
    render(<SentenceReader sentence="I have a doll." />)

    startListening()
    expect(starts()).toBe(1)
    expect(screen.getByRole('button', { name: /跳过这句/ })).toBeTruthy()
    expect(screen.getByText(/麦克风还没打开/)).toBeTruthy()
    vi.useRealTimers()
  })
})
