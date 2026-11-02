import { describe, expect, it } from 'vitest'
import { parseSentenceBoundary } from './edgeNeural'

describe('edgeNeural 的句边界解析', () => {
  it('解析服务端下发的句边界（100 纳秒 tick → 毫秒）', () => {
    const meta = '{"Path":"audio","AudioOffset":1000000,"Duration":2500000}'
    const b = parseSentenceBoundary(meta)
    expect(b).not.toBeNull()
    expect(b!.offsetMs).toBe(100)
    expect(b!.durationMs).toBe(250)
  })

  it('没有 AudioOffset 时返回 null', () => {
    expect(parseSentenceBoundary('{"Path":"turn.end"}')).toBeNull()
  })

  it('非 audio 路径的元数据返回 null', () => {
    expect(parseSentenceBoundary('{"Path":"turn.start","serviceTag":"x"}')).toBeNull()
  })
})

describe('分段朗读的时间轴构造', () => {
  /**
   * 与 segmentedSpeak 内一致：按各句「估算时长权重」分配**整段实际时长**。
   * 不再为每句单独发请求去量时长（少 N 次网络往返，更快也更稳）。
   */
  function buildTimeline(weights: number[], mergedDurationMs: number) {
    const sum = weights.reduce((a, b) => a + b, 0) || 1
    const out: { startMs: number; endMs: number }[] = []
    let acc = 0
    for (const w of weights) {
      const dur = (w / sum) * mergedDurationMs
      out.push({ startMs: acc, endMs: acc + dur })
      acc += dur
    }
    return out
  }

  it('时间轴严格落在整段音频时长内（最后一句正好到末尾）', () => {
    const weights = [2900, 3400, 2400, 2900, 3600]
    const merged = 9864 // 实测：合并请求的音频总时长（比逐段总长短约 30%）
    const tl = buildTimeline(weights, merged)
    expect(tl[tl.length - 1].endMs).toBeCloseTo(merged, 5)
  })

  it('时间窗首尾相接、无空洞无重叠', () => {
    const tl = buildTimeline([1000, 2000, 1500], 4500)
    for (let i = 1; i < tl.length; i++) {
      expect(tl[i].startMs).toBeCloseTo(tl[i - 1].endMs, 5)
    }
  })

  it('按权重分配：长句占的时间窗更长', () => {
    const tl = buildTimeline([1000, 3000], 4000)
    expect(tl[0].endMs - tl[0].startMs).toBeCloseTo(1000, 5)
    expect(tl[1].endMs - tl[1].startMs).toBeCloseTo(3000, 5)
  })
})
