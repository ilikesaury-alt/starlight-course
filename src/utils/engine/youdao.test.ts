// @vitest-environment jsdom
/**
 * youdao 单测：守住「整段（百度/有道按序）→ 分片 → 原生兜底」这条有界降级链。
 *
 * 背景：实测 dict.youdao.com 对整句约一半返回 HTTP 500，中文更是几乎只回
 * 同一段 48ms 空白音频。所以有道不能当唯一指望 —— 2026-10 起整句/中文改由
 * 百度云 TTS 打头（`baidu.ts`），本文件里百度用 mock 注入，便于分别断言两台引擎。
 * 无论谁出声，都必须能降级、并且在连续拿不到有效音频时熔断，
 * 避免每次点击都白等一串必然失败的请求。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./playUrl', () => ({ playUrl: vi.fn() }))
vi.mock('./webSpeech', () => ({ speakWithWebSpeech: vi.fn() }))
vi.mock('./engineTrace', () => ({ traceNote: vi.fn() }))
// 只替换 playBaiduAudio：preferBaiduFirst 必须是真实实现，否则排序规则就没测到
vi.mock('./baidu', async () => {
  const actual = await vi.importActual<typeof import('./baidu')>('./baidu')
  return { ...actual, playBaiduAudio: vi.fn() }
})

const OK = { status: 'success' } as const
const FAIL = { status: 'failed' } as const
const ABORT = { status: 'aborted' } as const
const OK_BAIDU = { status: 'success', via: 'baidu' } as const
const OK_NATIVE = { status: 'success', via: 'webspeech' } as const

/** 每次加载都是全新模块实例 —— 熔断状态是模块级的，必须隔离 */
async function load() {
  vi.resetModules()
  const mod = await import('./youdao')
  const { playUrl } = await import('./playUrl')
  const { speakWithWebSpeech } = await import('./webSpeech')
  const { playBaiduAudio } = await import('./baidu')
  const baidu = vi.mocked(playBaiduAudio)
  // 默认：百度这一级不可用，测试按需覆盖
  baidu.mockResolvedValue(FAIL)
  return {
    ...mod,
    playUrl: vi.mocked(playUrl),
    speakWithWebSpeech: vi.mocked(speakWithWebSpeech),
    baidu,
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

  it('超长英文片段在词边界断开，不把单词劈成两半', async () => {
    const { chunkByPunct } = await load()
    // 旧实现按固定下标切 → `…and th` + `e small dog.`，既念不顺也更容易撞 500
    expect(chunkByPunct('Look at the big cat and the small dog.')).toEqual([
      'Look at the big cat and',
      'the small dog.',
    ])
  })

  it('空文本兜底为原文，绝不返回空数组', async () => {
    const { chunkByPunct } = await load()
    expect(chunkByPunct('   ')).toEqual(['   '])
  })
})

describe('splitByWords', () => {
  it('无标点英文短句切成 2 词小片', async () => {
    const { splitByWords } = await load()
    expect(splitByWords('I can eat.')).toEqual(['I can', 'eat.'])
    expect(splitByWords('This is my head')).toEqual(['This is', 'my head'])
  })

  it('单词与无空格文本原样返回（中文不受影响）', async () => {
    const { splitByWords } = await load()
    expect(splitByWords('cat')).toEqual(['cat'])
    expect(splitByWords('今天天气很好')).toEqual(['今天天气很好'])
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

  // 回归：安卓慢网实测「单词 1.6s 响、整句撞满 8s 超时」。
  // 早先按长度跳过短句分片，导致「Mom, it's a dog!」超时后直接放弃 —— 三级引擎
  // 全废（Kokoro 拉不到权重、该浏览器无 TTS 嗓音）＝彻底静音。
  it('短句整段超时后仍会分片重试（安卓慢网回归）', async () => {
    const m = await load()
    // 整段失败 → 两片都成功
    m.playUrl.mockResolvedValueOnce(FAIL).mockResolvedValue(OK)
    const out = await m.playYoudaoResilient("Mom, it's a dog!", 'en', 1, () => true)
    expect(out).toEqual(OK)
    expect(m.playUrl.mock.calls.length).toBeGreaterThan(1)
  })

  // 关键回归（2026-10 实测）：dict.youdao.com 对整句几乎必回 HTTP 500，
  // 而 `I can eat.` 这类没有逗号的短句在 chunkByPunct 下只有 1 片 ——
  // 旧代码「只有一片 → 直接放弃」，于是单词有声、整句全静音。
  it('无标点整句失败后仍按词分片，不因「只有一片」放弃有道', async () => {
    const m = await load()
    // 整段 500 → 两个 2 词小片都成功
    m.playUrl.mockResolvedValueOnce(FAIL).mockResolvedValue(OK)
    const out = await m.playYoudaoResilient('I can eat.', 'en', 1, () => true)
    expect(out).toEqual(OK)
    expect(m.playUrl.mock.calls.length).toBeGreaterThan(1)
    expect(m.speakWithWebSpeech).not.toHaveBeenCalled()
  })

  it('整段与分片都失败时，无标点整句也交给原生合成器（不静默放弃）', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    const out = await m.playYoudaoResilient('This is my head', 'en', 1, () => true)
    // 借道原生合成器出声 → 面板按 via 记成 webspeech，而不是算在有道头上
    expect(out).toEqual(OK_NATIVE)
    expect(m.speakWithWebSpeech).toHaveBeenCalledTimes(1)
    expect(m.speakWithWebSpeech.mock.calls[0]?.[0]).toBe('This is my head')
  })

  it('熔断按「整次调用」计数：一句里多个分片失败不会一次打满', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    // 每句都是「整段失败 + 2 个分片重试耗尽」，但只该记 1 次
    await m.playYoudaoResilient('I can eat.', 'en', 1, () => true)
    expect(m.isYoudaoBypassed()).toBe(false)
    await m.playYoudaoResilient('This is my head', 'en', 1, () => true)
    expect(m.isYoudaoBypassed()).toBe(false)
    await m.playYoudaoResilient('Touch your toes', 'en', 1, () => true)
    expect(m.isYoudaoBypassed()).toBe(true)
  }, 30000)

  it('整段用较短超时，好早点转入分片', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(OK)
    await m.playYoudaoResilient('hello', 'en', 1, () => true)
    // playUrl 的第三个参数即 opts，含我们传入的 loadTimeout
    const opts = m.playUrl.mock.calls[0]?.[1] as { loadTimeout?: number }
    expect(opts.loadTimeout).toBe(5000)
  })

  it('拆不开的单词失败时如实返回 failed，不做无谓分片', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    const out = await m.playYoudaoResilient('cat', 'en', 1, () => true)
    expect(out).toEqual(FAIL)
    expect(m.playUrl).toHaveBeenCalledTimes(1)
    expect(m.speakWithWebSpeech).not.toHaveBeenCalled()
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
    expect(out).toEqual(OK_NATIVE)
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
    expect(out).toEqual(OK_NATIVE)
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
    // 有道被跳过（百度照常试一次，仍失败）→ 如实返回 failed，让上层继续降到 WebSpeech
    expect(out).toEqual(FAIL)
    expect(m.playUrl).not.toHaveBeenCalled()
  })

  it('熔断期只跳过有道：长句仍由百度继续试，不是把整级云 TTS 判死', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    for (let i = 0; i < 3; i++) await m.playYoudaoResilient('cat', 'en', 1, () => true)

    m.playUrl.mockClear()
    m.baidu.mockClear()
    const out = await m.playYoudaoResilient('Look at the big cat and the small dog.', 'en', 1, () => true)
    expect(m.isYoudaoBypassed()).toBe(true)
    // 有道一台请求都不发
    expect(m.playUrl).not.toHaveBeenCalled()
    // 百度照常（整段 + 分片）
    expect(m.baidu.mock.calls.length).toBeGreaterThan(0)
    // 百度这次也被 mock 成失败 → 最后仍有原生合成器兜底，绝不静默
    expect(out).toEqual(OK_NATIVE)
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

/**
 * 「句子没声」回归（2026-10）：有道整句几乎必 500，失败设备 en 语音包常为 0，
 * 于是单词有声、整句静音。现在整句/中文由百度打头，单词仍先走有道。
 */
describe('整句先百度', () => {
  it('整句由百度一次出声，有道与原生都不必出场', async () => {
    const m = await load()
    m.baidu.mockResolvedValue(OK_BAIDU)
    m.playUrl.mockResolvedValue(FAIL)
    const out = await m.playYoudaoResilient('I can eat.', 'en', 1, () => true)
    expect(out).toEqual(OK_BAIDU)
    expect(m.baidu).toHaveBeenCalledTimes(1)
    expect(m.playUrl).not.toHaveBeenCalled()
    expect(m.speakWithWebSpeech).not.toHaveBeenCalled()
  })

  it('百度整段挂了才轮到有道；有道出声时结果不带 via', async () => {
    const m = await load()
    m.baidu.mockResolvedValue(FAIL)
    m.playUrl.mockResolvedValue(OK)
    const out = await m.playYoudaoResilient('I can eat.', 'en', 1, () => true)
    expect(out).toEqual(OK)
    expect(m.playUrl).toHaveBeenCalledTimes(1)
    expect(m.speakWithWebSpeech).not.toHaveBeenCalled()
  })

  it('单词仍先有道：有道一击命中就不惊动百度', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(OK)
    const out = await m.playYoudaoResilient('cat', 'en', 1, () => true)
    expect(out).toEqual(OK)
    expect(m.baidu).not.toHaveBeenCalled()
  })

  it('有道熔断后整句仍能由百度出声（熔断只废一台引擎，不废整级）', async () => {
    const m = await load()
    m.playUrl.mockResolvedValue(FAIL)
    for (let i = 0; i < 3; i++) await m.playYoudaoResilient('cat', 'en', 1, () => true)
    expect(m.isYoudaoBypassed()).toBe(true)

    m.playUrl.mockClear()
    m.baidu.mockResolvedValue(OK_BAIDU)
    const out = await m.playYoudaoResilient('I can eat.', 'en', 1, () => true)
    expect(out).toEqual(OK_BAIDU)
    expect(m.playUrl).not.toHaveBeenCalled()
  })

  it('中文恒先百度（有道中文只回空白音频，试了也是白试）', async () => {
    const m = await load()
    m.baidu.mockResolvedValue(OK_BAIDU)
    const out = await m.playYoudaoResilient('今天天气很好', 'zh', 1, () => true)
    expect(out).toEqual(OK_BAIDU)
    expect(m.baidu).toHaveBeenCalledTimes(1)
    expect(m.playUrl).not.toHaveBeenCalled()
  })
})
