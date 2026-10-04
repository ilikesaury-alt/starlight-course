// @vitest-environment jsdom
/**
 * webSpeech 单测：守住「原生合成器作为最后一级时，绝不出现持续性静音」。
 *
 * 背景：Chrome 的 speechSynthesis 在连续 speak/cancel 后会假死（既不 onstart
 * 也不 onerror，speaking/pending 也为 false）。旧实现一旦判定假死就设 30s 冷却，
 * 冷却期内每次点击直接 failed —— 而原生合成器当时已经是兜底链**最后一级**，
 * 没有下一级可降级，于是表现为「前一句还能响，之后整段没声音」。
 *
 * 约定：
 *   - lastResort（兜底链最后一级）：无视冷却，每次都真试一次；
 *   - 非 lastResort：冷却期内快速失败，避免在死引擎上空转；
 *   - 缺语音包 / 代次失效 / 不支持等既有行为不变。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

/** 可编程的假 speechSynthesis：能模拟「 speak 之后毫无动静」的假死状态 */
function makeSynth(opts: { dead?: boolean; voices?: SpeechSynthesisVoice[] } = {}) {
  const state = {
    speaking: false,
    pending: false,
    paused: false,
    speakCalls: 0,
  }
  const synth = {
    get speaking() {
      return state.speaking
    },
    get pending() {
      return state.pending
    },
    get paused() {
      return state.paused
    },
    speak: vi.fn((u: SpeechSynthesisUtterance) => {
      state.speakCalls += 1
      if (opts.dead) {
        // 假死：接了 utterance，但既不 onstart 也不 onend，状态也不变
        return
      }
      state.speaking = true
      setTimeout(() => {
        state.speaking = false
        // onend 的事件负载在本测试里无关紧要，补齐类型即可
        u.onend?.({ type: 'end', utterance: u } as unknown as SpeechSynthesisEvent)
      }, 10)
    }),
    cancel: vi.fn(() => {
      state.speaking = false
      state.pending = false
    }),
    resume: vi.fn(() => {
      state.paused = false
    }),
    pause: vi.fn(),
    getVoices: vi.fn(() => opts.voices ?? []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    _state: state,
  }
  return synth
}

const VOICE_EN = { lang: 'en-US', name: 'Test EN', localService: true } as SpeechSynthesisVoice

async function load(synth: ReturnType<typeof makeSynth>) {
  vi.resetModules()
  vi.stubGlobal('speechSynthesis', synth)
  vi.stubGlobal('SpeechSynthesisUtterance', class {
    lang = ''
    rate = 1
    pitch = 1
    voice: SpeechSynthesisVoice | null = null
    onstart: (() => void) | null = null
    onend: (() => void) | null = null
    onerror: (() => void) | null = null
    constructor(public text: string) {}
  })
  const mod = await import('./webSpeech')
  return mod
}

beforeEach(() => {
  vi.useRealTimers()
})

describe('webSpeech · 假死冷却不再造成静音', () => {
  it('lastResort：引擎假死并被判死之后，下一句仍会真的尝试发声', async () => {
    const dead = makeSynth({ dead: true, voices: [VOICE_EN] })
    const { speakWithWebSpeech } = await load(dead)

    // 预算要够走完 3 轮「假死自愈」，引擎才会被标记为死亡（进入冷却期）
    const opts = { lang: 'en' as const, guard: () => true, budgetMs: 6000, lastResort: true }

    const first = await speakWithWebSpeech('first sentence.', opts)
    expect(first.status).toBe('failed') // 确实假死、无语音产出
    const afterFirst = dead._state.speakCalls
    expect(afterFirst).toBeGreaterThan(1) // 自愈确实重试过

    // 关键断言：紧接着的第二句**仍然**触发了 speak，而不是被冷却期直接拒绝
    await speakWithWebSpeech('second sentence.', opts)
    expect(dead._state.speakCalls).toBeGreaterThan(afterFirst)
  }, 20000)

  it('非 lastResort：冷却期内快速失败，不在死引擎上空转', async () => {
    const dead = makeSynth({ dead: true, voices: [VOICE_EN] })
    const { speakWithWebSpeech } = await load(dead)

    const opts = { lang: 'en' as const, guard: () => true, budgetMs: 6000 }
    const first = await speakWithWebSpeech('warm up.', opts)
    expect(first.status).toBe('failed') // 自愈耗尽 → 引擎被判死，进入冷却
    const before = dead._state.speakCalls

    // 仍在冷却期内 → 直接 failed，且不再发起新的 speak
    const out = await speakWithWebSpeech('should be skipped.', opts)
    expect(out).toEqual({ status: 'failed' })
    expect(dead._state.speakCalls).toBe(before)
  }, 20000)

  it('引擎正常时 lastResort 也照常成功', async () => {
    const ok = makeSynth({ voices: [VOICE_EN] })
    const { speakWithWebSpeech } = await load(ok)
    const out = await speakWithWebSpeech('hello there.', {
      lang: 'en',
      guard: () => true,
      budgetMs: 2000,
      lastResort: true,
    })
    expect(out).toEqual({ status: 'success' })
  })

  it('代次失效仍立即 aborted', async () => {
    const ok = makeSynth({ voices: [VOICE_EN] })
    const { speakWithWebSpeech } = await load(ok)
    const out = await speakWithWebSpeech('hello.', {
      lang: 'en',
      guard: () => false,
      lastResort: true,
    })
    expect(out).toEqual({ status: 'aborted' })
  })

  it('系统确实没有对应语音包时仍快速失败（不被 lastResort 拖成满额等待）', async () => {
    // 嗓音列表「已加载」但里面只有英文 —— 模拟装了英文语音包、没装中文的环境
    const onlyEn = makeSynth({ dead: true, voices: [VOICE_EN] })
    const { speakWithWebSpeech } = await load(onlyEn)
    const out = await speakWithWebSpeech('今天天气很好。', {
      lang: 'zh',
      guard: () => true,
      budgetMs: 60000, // 若不压缩预算，这里会白等一分钟
      lastResort: true,
    })
    // 预算被压到 MISS_VOICE_BUDGET_MS(6s) → 有界快速失败，而不是等满 60s
    expect(out.status).toBe('failed')
  }, 20000)
})
