import { describe, expect, it } from 'vitest'
import { buildSsml, extractMp3Payload, canUseEdgeNeural } from './edgeNeural'
import { buildBaiduTtsUrl, BAIDU_DEFAULT_SPD, BAIDU_SLOW_SPD } from './baidu'

describe('edgeNeural（微软神经语音引擎）', () => {
  it('SSML 转义 XML 特殊字符（否则服务端解析失败 → 断连无音频）', () => {
    const ssml = buildSsml('Tom & Jerry <3 "hi"', 'en', '+0%')
    expect(ssml).toContain('&amp;')
    expect(ssml).toContain('&lt;')
    expect(ssml).not.toMatch(/<3/)
    expect(ssml).toContain("voice name='en-US-AnaNeural'")
  })

  it('SSML 按语言切换音色与 lang 属性', () => {
    expect(buildSsml('你好', 'zh', '+0%')).toContain("voice name='zh-CN-XiaoxiaoNeural'")
    expect(buildSsml('你好', 'zh', '+0%')).toContain("xml:lang='zh-CN'")
  })

  it('慢速用源端慢速（rate=-30%），而不是播放端慢放', () => {
    expect(buildSsml('hello', 'en', '-30%')).toContain("rate='-30%'")
  })

  it('从微软私有音频帧里切出 MP3：跳过 00 80 + 同步字 + ascii 元数据头', () => {
    const head = new Uint8Array([0x00, 0x80, 0x58, 0x2d])
    const meta = new TextEncoder().encode('X-RequestId:abc\r\nContent-Type:audio/mpeg\r\nPath:audio\r\n')
    const mp3 = new Uint8Array([0xff, 0xf3, 0x64, 0xc4, 0x00, 0x00])
    const frame = new Uint8Array([...head, ...meta, ...mp3])
    const out = extractMp3Payload(frame)
    expect(Array.from(out)).toEqual([0xff, 0xf3, 0x64, 0xc4, 0x00, 0x00])
  })

  it('无标记的帧：剥掉 4 字节头', () => {
    const frame = new Uint8Array([0x00, 0x80, 0x58, 0x2d, 0xff, 0xf3])
    expect(Array.from(extractMp3Payload(frame))).toEqual([0xff, 0xf3])
  })

  it('canUseEdgeNeural：只有 UA 带 Edg/ 才为真（服务端按 UA 校验）', () => {
    const orig = navigator.userAgent
    const set = (ua: string) =>
      Object.defineProperty(globalThis.navigator, 'userAgent', { value: ua, configurable: true })
    try {
      set('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.4283.45')
      expect(canUseEdgeNeural()).toBe(true)
      set('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/155.0.0.0 Safari/537.36')
      expect(canUseEdgeNeural()).toBe(false)
    } finally {
      set(orig)
    }
  })
})

describe('baidu（云 TTS 语速档位）', () => {
  it('默认用慢速档 spd=2（实测比 spd=5 慢约 30%，更适合幼儿）', () => {
    expect(BAIDU_DEFAULT_SPD).toBe(2)
    expect(BAIDU_SLOW_SPD).toBe(1)
    expect(buildBaiduTtsUrl('hello', 'en')).toContain('spd=2')
  })

  it('显式指定档位时按指定值拼 URL', () => {
    expect(buildBaiduTtsUrl('hello', 'en', 1)).toContain('spd=1')
    expect(buildBaiduTtsUrl('你好', 'zh', 2)).toContain('lan=zh')
  })

  it('文本做 URL 编码', () => {
    expect(buildBaiduTtsUrl('a b&c', 'en')).toContain('text=a%20b%26c')
  })
})
