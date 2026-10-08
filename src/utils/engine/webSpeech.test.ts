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

  // 回归：现场截图里安卓自带浏览器显示「webspeech ❌ 失败 4ms」。
  // 4ms = 第一次访问 speechSynthesis 就放弃。若引擎只是「尚未就绪」，
  // 白点一次毫无意义；故必须有界地等一会儿。
  it('引擎尚未就绪时不会 4ms 就放弃，而是有界等待后再判失败', async () => {
    const noSynth = {} as unknown as SpeechSynthesis
    vi.stubGlobal('speechSynthesis', noSynth)

    vi.resetModules()
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        lang = ''
        rate = 1
        pitch = 1
        voice: SpeechSynthesisVoice | null = null
        onstart: (() => void) | null = null
        onend: (() => void) | null = null
        onerror: (() => void) | null = null
        constructor(public text: string) {}
      },
    )
    const { speakWithWebSpeech } = await import('./webSpeech')

    const t0 = Date.now()
    const out = await speakWithWebSpeech('hello there.', { lang: 'en', guard: () => true })
    const elapsed = Date.now() - t0

    expect(out).toEqual({ status: 'failed' })
    // 关键：不是立刻（~0ms），而是真的等过一个有界窗口
    expect(elapsed).toBeGreaterThan(1000)
    expect(elapsed).toBeLessThan(6000)
  }, 20000)

  it('引擎在等待窗口内就绪时能正常出声', async () => {
    let synth: ReturnType<typeof makeSynth> | null = null
    vi.stubGlobal('speechSynthesis', {} as unknown as SpeechSynthesis)

    vi.resetModules()
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        lang = ''
        rate = 1
        pitch = 1
        voice: SpeechSynthesisVoice | null = null
        onstart: (() => void) | null = null
        onend: (() => void) | null = null
        onerror: (() => void) | null = null
        constructor(public text: string) {}
      },
    )
    const { speakWithWebSpeech } = await import('./webSpeech')

    // 250ms 后引擎才出现 —— 早于 ENGINE_WAIT_MS(2.5s)
    setTimeout(() => {
      synth = makeSynth({ voices: [VOICE_EN] })
      vi.stubGlobal('speechSynthesis', synth)
    }, 250)

    const out = await speakWithWebSpeech('hello there.', { lang: 'en', guard: () => true })
    expect(out).toEqual({ status: 'success' })
  }, 20000)

  // 语音包排序：Chrome 会把远端 Google 嗓音（localService=false）一起列出来，
  // 国内网络下对它 speak() 常常既不 onstart 也不 onerror —— 整句静音。
  it('本地嗓音优先于远端嗓音', async () => {
    const remote = { lang: 'en-US', name: 'Google US English', localService: false } as SpeechSynthesisVoice
    const local = { lang: 'en-US', name: 'Microsoft Zira Desktop', localService: true } as SpeechSynthesisVoice
    const synth = makeSynth({ voices: [remote, local] })
    const { speakWithWebSpeech } = await load(synth)

    const out = await speakWithWebSpeech('hello there.', {
      lang: 'en',
      guard: () => true,
      budgetMs: 2000,
      lastResort: true,
    })
    expect(out.status).toBe('success')
    expect(synth.speak.mock.calls[0]?.[0].voice).toBe(local)
  })

  it('首选嗓音不出声时，自愈会换下一个嗓音而不是反复卡在它上面', async () => {
    const remote = { lang: 'en-US', name: 'Google US English', localService: false } as SpeechSynthesisVoice
    const local = { lang: 'en-US', name: 'Microsoft Zira Desktop', localService: true } as SpeechSynthesisVoice
    // 引擎假死：接了 utterance 但毫无动静 → 必然走自愈
    const dead = makeSynth({ dead: true, voices: [remote, local] })
    const { speakWithWebSpeech } = await load(dead)

    const out = await speakWithWebSpeech('hello there.', {
      lang: 'en',
      guard: () => true,
      budgetMs: 6000,
      lastResort: true,
    })
    expect(out.status).toBe('failed')
    const used = dead.speak.mock.calls.map((c) => c[0].voice)
    expect(used.length).toBeGreaterThan(1)
    expect(used[0]).toBe(local) // 排序后本地嗓音先上
    expect(used[1]).toBe(remote) // 没出声 → 下一轮换另一个候选
  }, 20000)

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
