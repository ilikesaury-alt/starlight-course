/**
 * 微软 Edge 神经语音引擎（浏览器原生 WebSocket 实现，零 CDN 依赖）。
 *
 * 为什么自己实现而不沿用 CDN 上的 edge-tts-universal：
 *   - 那个库还在发 **v1 版 DRM 令牌**（`Sec-MS-GEC-Version=1-x`），微软自 2026-10
 *     起已全面拒绝（403）。实测：同一环境、同一浏览器，v1 必 403，v2 立刻 101。
 *   - 依赖 CDN 意味着首屏多一次外部请求 + 版本不可控，且它只服务中文。
 *
 * 本引擎的取舍（全部来自 2026-11-02 实测，不是推测）：
 *   1. **服务端校验 User-Agent 里的 `Edg/`**（消融实验：Edge UA=101；Chrome UA=403；
 *      无 UA=403；Origin / Cookie / Client Hints 全都无关）。网页 JS **无法**改
 *      User-Agent（浏览器受禁头），因此：
 *        - 在 **Edge 浏览器**里 → 网页 WebSocket 直连可用（本引擎主路径）；
 *        - 在 **Chrome/Firefox** 里 → 必然 403，调用方应直接跳过本引擎；
 *        - 在 **Electron 桌面壳**里 → 壳用 `webContents.setUserAgent()` 注入 Edge UA
 *          后，渲染进程里的网页 WebSocket 同样可用。
 *   2. DRM 令牌必须是 **v2 格式** `<16 hex>-<64 hex>`，配 `Sec-MS-GEC-Version=2-…`
 *      （算法见 `msGecV2.ts`，有 Edge 真实抓包向量做逐字节校验）。
 *   3. 服务端**不校验 Origin**：普通网页 Origin 即可，不必伪装成扩展。
 *
 * 实测性能（国内网络，真实 Chromium）：
 *   握手 0.8~1.6s，首个音频字节 1.0~1.7s，整句合成完 1.2~2.4s。
 *   产出 48kbps / 24kHz MP3（百度同源只有 24kbps）。
 */

import { PlayOutcome } from './types'
import { playUrl } from './playUrl'
import { generateSecMsGecV2, SEC_MS_GEC_VERSION, TRUSTED_CLIENT_TOKEN } from './msGecV2'

const WSS_URL = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1'

/** 少儿友好的音色（微软神经音色，48kbps） */
const VOICES: Record<'en' | 'zh', { id: string; lang: string }> = {
  // Ana：清晰、语调平稳，适合幼儿跟读；Aria/Emma 音色更活泼
  en: { id: 'en-US-AnaNeural', lang: 'en-US' },
  zh: { id: 'zh-CN-XiaoxiaoNeural', lang: 'zh-CN' },
}

const STORAGE_KEY = 'starlight.edgeneural.enabled'

/** 连接 + 合成总超时（毫秒）。实测 2s 内完成，超时即回落，绝不挂起按钮动画。 */
const SYNTH_TIMEOUT = 12000
/** 音频负载下限（字节）：低于此值视为「没拿到真实语音」（对照：单词约 8KB） */
const MIN_AUDIO_BYTES = 2000

function readEnabledFlag(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === null ? true : v === '1' || v === 'true'
  } catch {
    return true
  }
}

const state = { enabled: readEnabledFlag() }

/** 读取启用开关（默认开启） */
export function isEdgeNeuralEnabled(): boolean {
  return state.enabled
}

/** 设置启用开关并持久化 */
export function setEdgeNeuralEnabled(enabled: boolean): void {
  state.enabled = enabled
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
  } catch {
    /* ignore */
  }
}

/**
 * 当前浏览器是否可能通过服务端校验。
 *
 * 判据是 UA 里带 `Edg/`（Edge）。这不是「白名单」而是**服务端实际校验的字段**，
 * 所以判断必须严格 —— 误判会让每次朗读都白等一次 403。
 */
export function canUseEdgeNeural(): boolean {
  if (!state.enabled) return false
  return isEdgeUserAgent(readUserAgent())
}

/**
 * UA 是否是 Edge（服务端认的就是 `Edg/` 这个标识）。
 *
 * 抽成纯函数有两个好处：
 *   1. 单测可以直接断言它，**不必依赖运行环境有没有 `navigator` 全局**
 *      （vitest 默认 node 环境；Node < 21 就没有 `navigator`，测试会直接 ReferenceError）；
 *   2. 判据集中在一处，将来微软改判据（比如换成 `Edg-A`）只改这一行。
 */
export function isEdgeUserAgent(ua: string | undefined | null): boolean {
  return !!ua && /Edg\//.test(ua)
}

/** 安全地读当前 UA：没有 navigator（node 环境 / SSR）时返回空串 */
function readUserAgent(): string {
  try {
    return typeof navigator === 'undefined' ? '' : navigator.userAgent || ''
  } catch {
    return ''
  }
}

/** 生成 SSML（微软协议要求 voice + prosody 包住正文） */
export function buildSsml(text: string, lang: 'en' | 'zh', rate: string, pitch = '+0Hz'): string {
  const { id, lang: ssmlLang } = VOICES[lang]
  // 转义 XML 特殊字符，否则 SSML 解析失败 → 服务端直接断连（无音频）
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
  return (
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${ssmlLang}'>` +
    `<voice name='${id}'><prosody rate='${rate}' pitch='${pitch}'>${escaped}</prosody></voice></speak>`
  )
}

/** 协议消息头：`X-Timestamp` + `Path` + `Content-Type` */
function buildMessageHeader(path: string, contentType: string, requestId: string): string {
  const ts = new Date().toISOString()
  return (
    `X-Timestamp:${ts}\r\n` +
    (requestId ? `X-RequestId:${requestId}\r\n` : '') +
    `Content-Type:${contentType}\r\n` +
    `Path:${path}\r\n\r\n`
  )
}

/** 语音配置消息（输出 48kbps / 24kHz 单声道 MP3，开启句边界元数据） */
function buildConfigMessage(): string {
  return (
    buildMessageHeader('speech.config', 'application/json; charset=utf-8', '') +
    JSON.stringify({
      context: {
        synthesis: {
          audio: {
            // 开启句边界：服务端会在音频流里附带每句的起止时间，
            // 分段朗读据此推进「当前句」高亮（否则只能整段盲播）。
            metadataoptions: { sentenceBoundaryEnabled: 'true', wordBoundaryEnabled: 'false' },
            outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
          },
        },
      },
    })
  )
}

/** 解析服务端下发的句边界元数据（文本帧里的 JSON） */
export interface SentenceBoundary {
  /** 句子在音频里的起点（毫秒） */
  offsetMs: number
  /** 句子的时长（毫秒） */
  durationMs: number
}

/** 从一条文本帧里解析句边界（服务端格式：`{"Path":"audio","AudioOffset":…,"Duration":…}`） */
export function parseSentenceBoundary(text: string): SentenceBoundary | null {
  if (!/Path":"audio/.test(text)) return null
  // 形如： {"Path":"audio","AudioOffset":1000000,"Duration":2500000}  （单位：100 纳秒 tick）
  const offset = text.match(/"AudioOffset"\s*:\s*(\d+)/)
  const duration = text.match(/"Duration"\s*:\s*(\d+)/)
  if (!offset) return null
  const toMs = (ticks: string) => Number(ticks) / 10000 // 100ns tick → ms
  return {
    offsetMs: toMs(offset[1]),
    durationMs: duration ? toMs(duration[1]) : 0,
  }
}

/** SSML 消息（正文） */
function buildSsmlMessage(text: string, lang: 'en' | 'zh', rate: string): string {
  const requestId = randomHex(32)
  return buildMessageHeader('ssml', 'application/ssml+xml', requestId) + buildSsml(text, lang, rate)
}

function randomHex(len: number): string {
  const bytes = new Uint8Array(Math.ceil(len / 2))
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes)
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, len)
}

/**
 * 从微软私有音频帧里切出 MP3 负载。
 *
 * 帧结构（实测抓包）：
 *   [0x00 0x80] + [2 字节 MP3 同步字] + <ascii 元数据头> + <MP3 数据>
 * 元数据头以 `Path:audio\r\n` 结尾。之前踩过的坑：直接把整帧当 MP3 会多出
 * 前导 0x00 字节，播放器解码直接失败（听起来「点了没声音」）。
 */
export function extractMp3Payload(frame: Uint8Array): Uint8Array {
  const marker = new TextEncoder().encode('Path:audio\r\n')
  outer: for (let i = 0; i + marker.length <= frame.length; i++) {
    for (let j = 0; j < marker.length; j++) {
      if (frame[i + j] !== marker[j]) continue outer
    }
    return frame.subarray(i + marker.length)
  }
  // 没有标记：剥掉 4 字节头（00 80 + 2 字节同步字）
  return frame.length > 4 ? frame.subarray(4) : new Uint8Array(0)
}

export interface EdgeNeuralOptions {
  /** 慢速朗读（幼儿跟读） */
  slow?: boolean
  /** 代次守卫：返回 false 时放弃本次播放并回落 */
  guard?: () => boolean
  /** 创建出 audio 元素时回调，便于上层接管取消逻辑 */
  onAudio?: (el: HTMLAudioElement) => void
}

/**
 * 合成并播放文本。
 * @returns success=已发声；failed=应回落到下一层；aborted=代次失效
 */
export async function speakWithEdgeNeural(
  text: string,
  lang: 'en' | 'zh',
  opts: EdgeNeuralOptions = {},
): Promise<PlayOutcome> {
  if (!state.enabled) return { status: 'failed' }
  if (!canUseEdgeNeural()) return { status: 'failed' }
  if (!text.trim()) return { status: 'failed' }

  const rate = opts.slow ? '-30%' : '+0%'

  try {
    const mp3 = await synthesizeMp3(text, lang, rate, opts.guard)
    if (!mp3) return { status: 'failed' }
    if (opts.guard && !opts.guard()) return { status: 'aborted' }
    if (mp3.byteLength < MIN_AUDIO_BYTES) {
      console.warn('[edge-neural] 音频过小，判为失败：', mp3.byteLength)
      return { status: 'failed' }
    }
    const blob = new Blob([mp3], { type: 'audio/mpeg' })
    const url = URL.createObjectURL(blob)
    return await playUrl(url, {
      guard: opts.guard,
      onAudio: opts.onAudio,
      hardCapMs: 120000,
    })
  } catch (e) {
    console.warn('[edge-neural] 合成失败，回落下一级：', e)
    return { status: 'failed' }
  }
}

/**
 * 走微软 WSS 协议合成 MP3。
 *
 * 返回 Blob 的字节数组；失败（403 / 超时 / 断连 / 无音频）返回 null。
 */
function synthesizeMp3(
  text: string,
  lang: 'en' | 'zh',
  rate: string,
  guard?: () => boolean,
): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    let settled = false
    let ws: WebSocket | null = null
    let timer: ReturnType<typeof setTimeout> | null = null
    let guardTimer: ReturnType<typeof setInterval> | null = null
    const chunks: Uint8Array[] = []
    let totalBytes = 0
    /** 正在做 Blob→ArrayBuffer 转换的帧数：turn.end 到达时要等它们都完成 */
    let pendingFrames = 0
    /** 服务端已宣布合成结束（等待剩余音频帧转换完毕） */
    let turnEnded = false

    const concat = (): Uint8Array => {
      const out = new Uint8Array(totalBytes)
      let at = 0
      for (const c of chunks) {
        out.set(c, at)
        at += c.byteLength
      }
      return out
    }

    const finish = (result: Uint8Array | null) => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      if (guardTimer) clearInterval(guardTimer)
      try {
        ws?.close()
      } catch {
        /* ignore */
      }
      resolve(result)
    }

    /** turn.end 到达：等所有在途的音频帧转换完，再决定成败 */
    const finishAfterPending = () => {
      turnEnded = true
      if (pendingFrames > 0) return // 等最后一帧转换完再收尾
      if (totalBytes === 0) finish(null)
      else finish(concat())
    }

    try {
      const connId = randomHex(32)
      const url =
        `${WSS_URL}?TrustedClientToken=${encodeURIComponent(TRUSTED_CLIENT_TOKEN)}` +
        `&Sec-MS-GEC=${encodeURIComponent(generateSecMsGecV2())}` +
        `&Sec-MS-GEC-Version=${encodeURIComponent(SEC_MS_GEC_VERSION)}` +
        `&ConnectionId=${connId}`
      ws = new WebSocket(url)
    } catch {
      resolve(null)
      return
    }

    timer = setTimeout(() => finish(null), SYNTH_TIMEOUT)

    ws.onopen = () => {
      try {
        ws?.send(buildConfigMessage())
        ws?.send(buildSsmlMessage(text, lang, rate))
      } catch {
        finish(null)
      }
    }

    ws.onmessage = (ev: MessageEvent) => {
      if (typeof ev.data === 'string') {
        // 文本帧是协议元数据；turn.end 表示合成结束
        if (/Path:turn\.end/.test(ev.data)) finishAfterPending()
        return
      }
      // 二进制帧 = 音频。
      //
      // ⚠️ 浏览器 WebSocket 的二进制帧默认是 **Blob**（不是 ArrayBuffer）——
      // 直接 `new Uint8Array(ev.data)` 会得到空数组，表现为「一直拿不到音频」。
      // 故必须分情况处理：Blob → await arrayBuffer()；ArrayBuffer → 直接用。
      pendingFrames++
      void (async () => {
        try {
          let frame: Uint8Array
          if (typeof Blob !== 'undefined' && ev.data instanceof Blob) {
            frame = new Uint8Array(await ev.data.arrayBuffer())
          } else if (ev.data instanceof ArrayBuffer) {
            frame = new Uint8Array(ev.data)
          } else if (ArrayBuffer.isView(ev.data)) {
            frame = new Uint8Array(ev.data.buffer, ev.data.byteOffset, ev.data.byteLength)
          } else {
            return
          }
          const mp3 = extractMp3Payload(frame)
          if (mp3.byteLength) {
            chunks.push(mp3)
            totalBytes += mp3.byteLength
          }
        } catch {
          /* 单帧解析失败不影响其余帧 */
        } finally {
          pendingFrames--
          // 服务端已宣布结束、且在途帧都处理完了 → 收尾
          if (turnEnded && pendingFrames === 0) {
            if (totalBytes === 0) finish(null)
            else finish(concat())
          }
        }
      })()
    }

    ws.onerror = () => finish(null)
    ws.onclose = () => {
      // 服务端提前关闭（403 会在 onerror 前触发，这里兜底）
      if (!settled) {
        if (totalBytes > 0) finish(concat())
        else finish(null)
      }
    }

    // 代次守卫：请求期间用户点了别的内容就放弃（避免过期音频盖在新的朗读上）
    if (guard) {
      guardTimer = setInterval(() => {
        if (!guard()) finish(null)
      }, 200)
    }
  })
}
