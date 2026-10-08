// @vitest-environment jsdom
/**
 * baidu 单测：守住百度云 TTS 的 URL 构造与「先百度还是先有道」的排序规则。
 *
 * 这台引擎是「句子没声」的解药：有道整句几乎必 500、失败设备又常常 en 语音包为 0，
 * 于是整句彻底静音；百度实测整句 8/8 返回真实音频。两条硬约束必须一直成立：
 *   1. 请求必须**不带 Referer**（见 `index.html` 的 no-referrer meta，这里测不了，
 *      但 URL 的参数/编码必须正确，否则百度会直接回空音频）；
 *   2. 单词仍走有道（更快更稳），只有整句 / 中文才让百度打头。
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('./playUrl', () => ({ playUrl: vi.fn() }))

async function load() {
  vi.resetModules()
  const mod = await import('./baidu')
  const { playUrl } = await import('./playUrl')
  return { ...mod, playUrl: vi.mocked(playUrl) }
}

describe('buildBaiduTtsUrl', () => {
  it('英文用 lan=en，文本正确编码', async () => {
    const { buildBaiduTtsUrl } = await load()
    const url = buildBaiduTtsUrl('I can eat.', 'en')
    expect(url).toContain('lan=en')
    expect(url).toContain('text=I%20can%20eat.')
    expect(url).toContain('source=web')
  })

  it('中文用 lan=zh，中文字符按 UTF-8 百分号编码', async () => {
    const { buildBaiduTtsUrl } = await load()
    const url = buildBaiduTtsUrl('今天天气很好', 'zh')
    expect(url).toContain('lan=zh')
    expect(url).toContain(`text=${encodeURIComponent('今天天气很好')}`)
    // 裸中文一旦不编码，URL 会被服务端解析成别的参数 → 回空音频
    expect(url).not.toContain('今天')
  })
})

describe('preferBaiduFirst', () => {
  it('英文单词 / 短语先有道（130ms 比百度 480ms 跟手）', async () => {
    const { preferBaiduFirst } = await load()
    expect(preferBaiduFirst('cat', 'en')).toBe(false)
    expect(preferBaiduFirst('yellow bus', 'en')).toBe(false)
    expect(preferBaiduFirst('elephant', 'en')).toBe(false)
    expect(preferBaiduFirst('', 'en')).toBe(false)
  })

  it('英文整句先百度（≥3 词 / 含标点 / 超过 14 字符）', async () => {
    const { preferBaiduFirst } = await load()
    expect(preferBaiduFirst('I can eat.', 'en')).toBe(true) // 3 词 + 句号
    expect(preferBaiduFirst('This is my head', 'en')).toBe(true) // 4 词
    expect(preferBaiduFirst('Hi, Tom', 'en')).toBe(true) // 逗号
    expect(preferBaiduFirst('supercalifragilistic', 'en')).toBe(true) // 单词但超长
  })

  it('中文恒先百度（有道中文几乎只回同一段 48ms 空白音频）', async () => {
    const { preferBaiduFirst } = await load()
    expect(preferBaiduFirst('猫', 'zh')).toBe(true)
    expect(preferBaiduFirst('今天天气很好', 'zh')).toBe(true)
  })
})

describe('playBaiduAudio', () => {
  it('走统一播放器，并把空白音频诊断记在 baidu 名下', async () => {
    const { playBaiduAudio, playUrl } = await load()
    playUrl.mockResolvedValue({ status: 'success' })
    const onAudio = vi.fn()
    const out = await playBaiduAudio('I can eat.', 'en', { rate: 0.6, onAudio })
    expect(out).toEqual({ status: 'success' })
    expect(playUrl).toHaveBeenCalledTimes(1)
    const [url, opts] = playUrl.mock.calls[0] as [string, Record<string, unknown>]
    expect(url).toContain('fanyi.baidu.com/gettts')
    expect(opts.engineName).toBe('baidu')
    expect(opts.playbackRate).toBe(0.6)
    expect(opts.onAudio).toBe(onAudio)
    // 百度整段偏慢，但绝不能白等到天荒地老
    expect(opts.loadTimeout).toBe(5000)
  })
})
