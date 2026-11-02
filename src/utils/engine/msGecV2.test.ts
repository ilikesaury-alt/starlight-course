import { describe, expect, it } from 'vitest'
import { generateSecMsGecV2, SEC_MS_GEC_VERSION, TRUSTED_CLIENT_TOKEN } from './msGecV2'

describe('msGecV2（微软 Sec-MS-GEC v2 令牌）', () => {
  it('黄金测试向量：与 PR #492 抓包的真实 Edge 155 令牌逐字节一致', () => {
    // 锚定 2026-10-13T10:40:00Z 起的 5 分钟窗口（PR #492 的验证用例）
    expect(generateSecMsGecV2(1791888000)).toBe(
      '492D7694A183A45E-56E821F95D4579C5B7C7E33DC7303FF379EC36D510213555BBBB9EB17EF15876',
    )
  })

  it('输出格式：<16 hex CS64>-<64 hex SHA256>', () => {
    const token = generateSecMsGecV2(1791888000)
    expect(token).toMatch(/^[0-9A-F]{16}-[0-9A-F]{64}$/)
  })

  it('同一 5 分钟窗口内的时间戳产生相同令牌，跨窗口不同', () => {
    const a = generateSecMsGecV2(1791888000)
    const b = generateSecMsGecV2(1791888000 + 299)
    const c = generateSecMsGecV2(1791888000 + 300)
    expect(a).toBe(b)
    expect(a).not.toBe(c)
  })

  it('当前时间生成的令牌格式正确（服务端对窗口边缘有容忍）', () => {
    expect(generateSecMsGecV2()).toMatch(/^[0-9A-F]{16}-[0-9A-F]{64}$/)
  })

  it('常量与 edge-tts 上游一致', () => {
    expect(TRUSTED_CLIENT_TOKEN).toBe('6A5AA1D4EAFF4E9FB37E23D68491D6F4')
    expect(SEC_MS_GEC_VERSION).toMatch(/^2-/)
  })
})
