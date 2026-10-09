// @vitest-environment jsdom
/**
 * speakService 单测：守住「慢设备上 Kokoro 不挡道」的链路顺序。
 *
 * 回归现场（2026-10 手机实测）：Kokoro 已就绪但手机 GPU 上一个单词要 5~6s、
 * 整句 20~60s。它身为兜底链第一级，把整条链卡在生成上几十秒 —— 表现就是
 * 「单词能发音、句子总是失败」，而云端同样的句子 2~3 秒就播完了。
 *
 * 对策的断言：
 *   - 快设备：Kokoro 仍是第一级（优先自然嗓音）；
 *   - 慢设备：云 TTS 先上，2~3 秒出声；Kokoro 退到云之后当离线备份；
 *   - 慢设备 + 云端全军覆没（离线）：Kokoro 仍有出场机会，且排在原生合成器之前。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// mock 用 vi.hoisted 固定引用：loadService() 会 resetModules，
// 直接 import 拿到的会是重置后的新实例，断言就全落空了。
const h = vi.hoisted(() => ({
  kokoroSlow: false,
  kokoroResult: { status: 'failed' as 'failed' | 'success' },
  cloudResult: { status: 'success' as 'success' | 'failed' },
  kokoroSpeak: vi.fn(),
  youdaoResilient: vi.fn(),
  webSpeechSpeak: vi.fn(),
}))

vi.mock('./engine/kokoro', () => ({
  speakWithKokoro: h.kokoroSpeak.mockImplementation(() => Promise.resolve(h.kokoroResult)),
  isKokoroEnabled: () => true,
  isKokoroReady: () => true,
  isKokoroSlow: () => h.kokoroSlow,
  isWebGPUSupported: () => true,
  warmupKokoro: vi.fn(),
}))
vi.mock('./engine/youdao', () => ({
  playYoudaoResilient: h.youdaoResilient.mockImplementation(() => Promise.resolve(h.cloudResult)),
}))
vi.mock('./engine/webSpeech', () => ({
  speakWithWebSpeech: h.webSpeechSpeak.mockImplementation(() => Promise.resolve({ status: 'failed' })),
}))
vi.mock('./engine/edgeTts', () => ({
  speakWithEdgeTts: vi.fn(() => Promise.resolve({ status: 'failed' })),
  isEdgeBrowser: () => false,
  isEdgeTtsEnabled: () => false,
  isEdgeReady: () => false,
  warmupEdgeTts: vi.fn(),
}))
vi.mock('./engine/engineTrace', () => ({
  traceEngine: vi.fn(),
  traceNote: vi.fn(),
}))
vi.mock('./audioUnlock', () => ({ unlockAudio: vi.fn() }))

async function loadService() {
  vi.resetModules()
  return import('./speakService')
}

/** 点一次发音，等整条链跑完（onEnd 一定会在请求预算内回调） */
function speakAndWait(speakText: (t: string, o: { onEnd?: () => void }) => void, text: string) {
  return new Promise<void>((resolve) => speakText(text, { onEnd: resolve }))
}

beforeEach(() => {
  vi.clearAllMocks()
  h.kokoroSlow = false
  h.kokoroResult = { status: 'failed' }
  h.cloudResult = { status: 'success' }
})

describe('speakService · Kokoro 与云 TTS 的链路顺序', () => {
  it('快设备：Kokoro 仍是第一级，出声后不再麻烦云端', async () => {
    h.kokoroResult = { status: 'success' }
    const { speakText } = await loadService()
    await speakAndWait(speakText, 'I have a doll.')

    expect(h.kokoroSpeak).toHaveBeenCalledTimes(1)
    expect(h.youdaoResilient).not.toHaveBeenCalled()
  })

  it('慢设备：云 TTS 先上并成功时，Kokoro 一次都不跑（不让孩子干等）', async () => {
    h.kokoroSlow = true
    const { speakText } = await loadService()
    await speakAndWait(speakText, 'I have a doll.')

    expect(h.youdaoResilient).toHaveBeenCalledTimes(1)
    expect(h.kokoroSpeak).not.toHaveBeenCalled()
  })

  it('慢设备 + 云端全军覆没：Kokoro 作为离线备份出场，且排在原生合成器之前', async () => {
    h.kokoroSlow = true
    h.cloudResult = { status: 'failed' }
    const { speakText } = await loadService()
    await speakAndWait(speakText, 'I have a doll.')

    expect(h.youdaoResilient).toHaveBeenCalledTimes(1)
    expect(h.kokoroSpeak).toHaveBeenCalledTimes(1)
    expect(h.webSpeechSpeak).toHaveBeenCalledTimes(1)
    // 顺序：云端 → Kokoro 备份 → 原生合成器
    expect(h.youdaoResilient.mock.invocationCallOrder[0]).toBeLessThan(
      h.kokoroSpeak.mock.invocationCallOrder[0],
    )
    expect(h.kokoroSpeak.mock.invocationCallOrder[0]).toBeLessThan(
      h.webSpeechSpeak.mock.invocationCallOrder[0],
    )
  })

  it('慢设备的 Kokoro 备份用放宽的预算（断网时等得起，但不是无限）', async () => {
    h.kokoroSlow = true
    h.cloudResult = { status: 'failed' }
    const { speakText } = await loadService()
    await speakAndWait(speakText, 'I have a doll.')

    expect(h.kokoroSpeak).toHaveBeenCalledWith(
      'I have a doll.',
      expect.objectContaining({ budgetMs: 30000 }),
    )
  })
})
