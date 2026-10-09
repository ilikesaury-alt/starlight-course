// @vitest-environment jsdom
/**
 * kokoro 单测：守住「慢设备上 Kokoro 绝不拖死整条发音链」。
 *
 * 背景（2026-10-09 手机实测）：手机 WebGPU 上 Kokoro 生成一个单词要 5~6s、
 * 整句 20~60s。Kokoro 又是兜底链第一级，孩子点「听示范」后整条链都卡在
 * 生成上，几十秒没声音 —— 表现为「单词能发音、句子总是失败」，而这本该是
 * 云端 2~3 秒就完成的事。对策：
 *   - 生成预算（按词数放宽）：超时判 failed，链路降级到云 TTS；
 *   - 生成成功但过慢：本会话标记慢设备，speakService 把 Kokoro 降到云 TTS
 *     之后，只当「断网时的离线备份」。
 *
 * 这里只测纯函数部分（不碰真的 80MB 模型加载）。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

/** 结构满足 KokoroAudio 的假音频（只为通过类型，不走播放） */
function fakeAudio() {
  return {
    sampling_rate: 24000,
    audio: new Float32Array(1),
    toBlob: () => new Blob(),
  }
}

async function load() {
  vi.resetModules()
  return import('./kokoro')
}

beforeEach(() => {
  vi.useRealTimers()
})

const CANONICAL = 'https://huggingface.co/'
const MIRROR = 'https://hf-mirror.com/'

describe('kokoro · WASM 后端', () => {
  it('预算比 WebGPU 宽（CPU 推理慢一个数量级），但仍有上限', async () => {
    const { wasmBudgetMs, generateBudgetMs } = await load()
    expect(wasmBudgetMs('hello')).toBe(16_000) // 12s 基础 + 4s/词
    expect(wasmBudgetMs('I have a doll.')).toBe(28_000) // 4 词
    // 封顶：再长也不能无限等，否则按钮会一直卡在播放中
    expect(wasmBudgetMs('one two three four five six seven eight nine ten')).toBe(45_000)
    // WASM 必须比 WebGPU 宽，否则在没独显的机器上永远超时 → 永远退回难听的云 TTS
    expect(wasmBudgetMs('hello')).toBeGreaterThan(generateBudgetMs('hello'))
  })

  it('WASM 慢（约 7~9s/词）：必须判慢设备退回云 TTS，绝不能让每次点击都死等', async () => {
    // 曾经的错误：给 WASM 开 30s 免判慢的特例，结果每个词都老实等 9 秒。
    // CPU 推理必然超阈值，自动降级才是这里想要的行为。
    const { generateWithinBudget, isKokoroSlow } = await load()
    vi.useFakeTimers()
    const p = generateWithinBudget(
      'great',
      () => new Promise((res) => setTimeout(() => res(fakeAudio()), 8_000)),
      45_000,
      'wasm',
    )
    await vi.advanceTimersByTimeAsync(8_000)
    const { audio } = await p
    expect(audio).not.toBeNull() // 这次照常播
    expect(isKokoroSlow()).toBe(true) // 但之后退到云 TTS 之后
  }, 15000)
})

describe('kokoro · 默认开关', () => {
  it('默认关闭：英文走「有道→WebSpeech」，1~3 秒出声（2026-10-09 实测后反转）', async () => {
    localStorage.clear()
    const { isKokoroEnabled } = await load()
    // 实测：大量机器 WebGPU 无适配器 → 只能退 CPU → 每词 7~9s，幼儿点读不可接受
    expect(isKokoroEnabled()).toBe(false)
  })

  it('显式设为 1 时开启（留作将来驱动更新后的入口）', async () => {
    localStorage.clear()
    localStorage.setItem('starlight.kokoro.enabled', '1')
    const { isKokoroEnabled } = await load()
    expect(isKokoroEnabled()).toBe(true)
  })

  it('显式设为 0 时关闭（默认值本身也算开启，故要单独断言）', async () => {
    localStorage.clear()
    localStorage.setItem('starlight.kokoro.enabled', '0')
    const { isKokoroEnabled } = await load()
    expect(isKokoroEnabled()).toBe(false)
  })
})

describe('kokoro · 模型源选择', () => {  it('默认直连优先，但两个源都会试（坏源不能是死路）', async () => {
    localStorage.clear()
    const { modelHostOrder } = await load()
    const order = modelHostOrder()
    expect(order[0]).toBe(CANONICAL)
    expect(order).toContain(MIRROR)
  })

  it('上次成功的源排到最前，避免每次都从不通的源开始耗时间', async () => {
    localStorage.clear()
    localStorage.setItem('starlight.kokoro.host', MIRROR)
    const { modelHostOrder } = await load()
    const order = modelHostOrder()
    expect(order[0]).toBe(MIRROR)
    expect(order).toContain(CANONICAL)
  })

  it('缓存里是垃圾值时按默认顺序走，不崩', async () => {
    localStorage.clear()
    localStorage.setItem('starlight.kokoro.host', 'https://evil.example/')
    const { modelHostOrder } = await load()
    expect(modelHostOrder()[0]).toBe(CANONICAL)
  })
})

describe('kokoro · 加载状态', () => {
  it('初始为 idle（未开始加载）', async () => {
    localStorage.clear()
    const { getKokoroModelState } = await load()
    expect(getKokoroModelState()).toEqual({ phase: 'idle' })
  })

  it('关闭开关后回到 idle，便于重新开启时干净重来', async () => {
    localStorage.clear()
    const { setKokoroEnabled, getKokoroModelState, isKokoroEnabled } = await load()
    setKokoroEnabled(true)
    setKokoroEnabled(false)
    expect(getKokoroModelState().phase).toBe('idle')
    setKokoroEnabled(true)
    expect(isKokoroEnabled()).toBe(true)
  })
})

describe('kokoro · 生成预算', () => {
  it('预算随词数放宽并有上限', async () => {
    const { generateBudgetMs } = await load()
    expect(generateBudgetMs('hello')).toBe(8000) // 单词：6s 基础 + 2s/词
    expect(generateBudgetMs('I have a doll.')).toBe(14000)
    expect(generateBudgetMs('one two three four five six seven eight')).toBe(20000) // 封顶
    expect(generateBudgetMs('   多  空格  单词   ')).toBe(12000) // 3 个词
  })
})

describe('kokoro · 慢设备判定', () => {
  it('快速生成：正常返回音频，不标记慢设备', async () => {
    const { generateWithinBudget, isKokoroSlow } = await load()
    const { audio } = await generateWithinBudget('hello', () => Promise.resolve(fakeAudio()))
    expect(audio).not.toBeNull()
    expect(isKokoroSlow()).toBe(false)
  })

  it('生成超过预算：返回 null 并标记慢设备（链路据此降级到云 TTS）', async () => {
    const { generateWithinBudget, isKokoroSlow } = await load()
    vi.useFakeTimers()
    const p = generateWithinBudget(
      'a very long sentence that never finishes generating',
      () => new Promise(() => {}), // 永不 resolve —— 模拟手机 GPU 上的长句
    )
    await vi.advanceTimersByTimeAsync(20000) // 长句预算 20s（封顶值）
    const { audio } = await p
    expect(audio).toBeNull()
    expect(isKokoroSlow()).toBe(true)
  }, 15000)

  it('放宽预算（离线备份）仍是有界的：到点一样判超时', async () => {
    const { generateWithinBudget } = await load()
    vi.useFakeTimers()
    const p = generateWithinBudget('hello', () => new Promise(() => {}), 30000)
    await vi.advanceTimersByTimeAsync(29999)
    // 29999ms 时还没到点：Promise 仍未 settle（await 它会挂死，这里只探状态）
    const raced = Promise.race([p.then(() => 'settled'), Promise.resolve('pending')])
    expect(await raced).toBe('pending')
    await vi.advanceTimersByTimeAsync(2)
    const { audio } = await p
    expect(audio).toBeNull()
  }, 15000)

  it('生成成功但过慢：照常返回音频，但标记慢设备（下次先走云 TTS）', async () => {
    const { generateWithinBudget, isKokoroSlow } = await load()
    vi.useFakeTimers()
    // 单词预算 8s；生成在 6s 才完成（手机实测一个单词 5~6s）
    const p = generateWithinBudget('great', () => new Promise((res) => setTimeout(() => res(fakeAudio()), 6000)))
    await vi.advanceTimersByTimeAsync(6000)
    const { audio } = await p
    expect(audio).not.toBeNull() // 音频已在手，这次照常播
    expect(isKokoroSlow()).toBe(true) // 但记住这台设备慢
  }, 15000)

  it('超时后迟到的失败被吞掉，不漏成 unhandledRejection', async () => {
    const { generateWithinBudget } = await load()
    vi.useFakeTimers()
    const p = generateWithinBudget(
      'hello',
      () => new Promise((_, rej) => setTimeout(() => rej(new Error('late failure')), 5000)),
      1000,
    )
    await vi.advanceTimersByTimeAsync(6000)
    const { audio } = await p
    expect(audio).toBeNull()
    // 若没被吞掉，unhandledRejection 会被 vitest 判为用例失败
  }, 15000)
})
