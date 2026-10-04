// @vitest-environment jsdom
/**
 * youdao 单测：守住「整段失败 → 分片 → 原生兜底」这条有界降级链。
 *
 * 背景：实测 dict.youdao.com 对整句约一半返回 HTTP 500，中文更是几乎只回
 * 同一段 48ms 空白音频。所以有道不能当唯一指望，必须能自己降级、并且在
 * 连续拿不到有效音频时熔断，避免每次点击都白等一串必然失败的请求。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./playUrl', () => ({ playUrl: vi.fn() }))
vi.mock('./webSpeech', () => ({ speakWithWebSpeech: vi.fn() }))
vi.mock('./engineTrace', () => ({ traceNote: vi.fn() }))

const OK = { status: 'success' } as const
const FAIL = { status: 'failed' } as const
const ABORT = { status: 'aborted' } as const

/** 每次加载都是全新模块实例 —— 熔断状态是模块级的，必须隔离 */
async function load() {
  vi.resetModules()
  const mod = await import('./youdao')
  const { playUrl } = await import('./playUrl')
  const { speakWithWebSpeech } = await import('./webSpeech')
  return {
    ...mod,
    playUrl: vi.mocked(playUrl),
    speakWithWebSpeech: vi.mocked(speakWithWebSpeech),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('chunkByPunct', () => {
  it('英文按逗号/句号切分', async () => {
    const { chunkByPunct } = await load()
    expect(chunkByPunct('Good morning, teacher.')).toEqual(['Good morning,', 'teacher.'])
  })

  it('中文按句读切分', async () => {
    const { chunkByPunct } = await load()
    expect(chunkByPunct('我喜欢猫。小狗在桌子下面。')).toEqual(['我喜欢猫。', '小狗在桌子下面。'])
  })

  it('超长无标点片段按 max 硬切', async () => {
    const { chunkByPunct } = await load()
    expect(chunkByPunct('a'.repeat(60))).toEqual(['a'.repeat(26), 'a'.repeat(26), 'a'.repeat(8)])
  })

  it('空文本兜底为原文，绝不返回空数组', async () => {
    const { chunkByPunct } = await load()
    expect(chunkByPunct('   ')).toEqual(['   '])
  })
})

describe('playYoudaoResilient', () => {
  it('短文本只请求一次', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(OK)
    const out = await m.playYoudaoResilient('cat', 'en', 1, () => true)
    expect(out).toEqual(OK)
    expect(m.playUrl).toHaveBeenCalledTimes(1)
  })

  it('英文长句整段失败后按标点分片重试', async () => {
    const m = await load()
    // 整段失败 → 两片都成功
    m.playUrl.mockResolvedValueOnce(FAIL).mockResolvedValue(OK)
    const out = await m.playYoudaoResilient('Look at the big cat and the small dog.', 'en', 1, () => true)
    expect(out).toEqual(OK)
    // 整段 1 次 + 分片 2 片
    expect(m.playUrl).toHaveBeenCalledTimes(3)
    expect(m.speakWithWebSpeech).not.toHaveBeenCalled()
  })

  it('整段成功时不分片（保住整句语调）', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(OK)
    const out = await m.playYoudaoResilient('Look at the big cat and the small dog.', 'en', 1, () => true)
    expect(out).toEqual(OK)
    expect(m.playUrl).toHaveBeenCalledTimes(1)
  })

  it('整段与分片都失败时交给原生合成器兜底并返回 success', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    const out = await m.playYoudaoResilient('Look at the big cat and the small dog.', 'en', 1, () => true)
    // 兜底成功 → 链路不中断，按钮不会卡在播放中
    expect(out).toEqual(OK)
    expect(m.speakWithWebSpeech).toHaveBeenCalledTimes(1)
  })

  it('原生兜底收到的是「本片 + 剩余」全文，不丢内容', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    const text = 'Look at the big cat and the small dog.'
    await m.playYoudaoResilient(text, 'en', 1, () => true)
    const handed = m.speakWithWebSpeech.mock.calls[0]?.[0] as string
    expect(handed.replace(/\s/g, '')).toBe(text.replace(/\s/g, ''))
  })

  it('中文空白音频（判 failed）在短文本上直接失败，交给上层降级', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL) // 空白音频现在被判 failed
    const out = await m.playYoudaoResilient('今天天气很好', 'zh', 1, () => true)
    // 短文本只请求一次；失败即返回 failed，由 speakService 继续降到 WebSpeech
    expect(out).toEqual(FAIL)
    expect(m.playUrl).toHaveBeenCalledTimes(1)
  })

  it('中文长句全是空白音频时，内部降级到原生合成器', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    const out = await m.playYoudaoResilient('今天天气非常好，我们一起去公园里散步吧，看看那些美丽的花。', 'zh', 1, () => true)
    expect(out).toEqual(OK)
    expect(m.speakWithWebSpeech).toHaveBeenCalled()
  })

  it('代次失效立即 aborted，不再请求', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(OK)
    const out = await m.playYoudaoResilient('Look at the big cat and the small dog.', 'en', 1, () => false)
    expect(out).toEqual(ABORT)
  })

  it('连续拿不到有效音频后熔断，短文本也直接跳过有道', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    for (let i = 0; i < 3; i++) await m.playYoudaoResilient('cat', 'en', 1, () => true)

    expect(m.isYoudaoBypassed()).toBe(true)

    m.playUrl.mockClear()
    const out = await m.playYoudaoResilient('dog', 'en', 1, () => true)
    // 直接判失败，让上层继续降到 WebSpeech（而不是再白等一次网络）
    expect(out).toEqual(FAIL)
    expect(m.playUrl).not.toHaveBeenCalled()
  })

  it('熔断期间长句直接判失败，不做无谓的分片请求', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    for (let i = 0; i < 3; i++) await m.playYoudaoResilient('cat', 'en', 1, () => true)

    m.playUrl.mockClear()
    const out = await m.playYoudaoResilient('Look at the big cat and the small dog.', 'en', 1, () => true)
    expect(out).toEqual(FAIL)
    expect(m.playUrl).not.toHaveBeenCalled()
    expect(m.speakWithWebSpeech).not.toHaveBeenCalled()
  })

  it('成功一次即清零计数，不误触熔断', async () => {
    const m = await load()
    m.playUrl.mockResolvedValueOnce(FAIL).mockResolvedValue(FAIL).mockResolvedValue(OK)
    await m.playYoudaoResilient('cat', 'en', 1, () => true) // 1 strike
    await m.playYoudaoResilient('dog', 'en', 1, () => true) // 2 strikes
    expect(m.isYoudaoBypassed()).toBe(false)
    await m.playYoudaoResilient('bird', 'en', 1, () => true) // 成功 → 清零
    expect(m.isYoudaoBypassed()).toBe(false)
  })
})
