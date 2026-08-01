/**
 * 微软 Edge TTS（云端，免费、免密钥）中文增强引擎。
 *
 * 仅在 **Microsoft Edge** 浏览器可用：微软自 2025 年底要求 WebSocket 携带 Edge 专属头，
 * Chrome/Firefox/Safari 前端无法设置该头，连接会失败 —— 此时由 speak.ts 自动回落到原有「有道 → WebSpeech」。
 * 英文仍由 Kokoro(WebGPU) 处理，本模块只负责中文，互不影响。
 *
 * 设计要点（与 kokoro.ts 一致）：
 *   - 运行时从 CDN（esm.sh）动态导入 edge-tts-universal/browser，不进入构建依赖。
 *   - 失败（非 Edge 浏览器 / 网络异常 / 超时 / 代次变更）一律返回 false，无缝回落。
 *   - 提供启用开关（localStorage），便于一键关闭。
 *   - 含连接超时护栏，避免在非 Edge 环境意外挂起。
 */

// 统一 URL 播放器（保证 Promise 一定结束，区分 blocked/failed）
import { playUrl } from './playUrl'
import { PlayOutcome } from './types'

// 运行时从 CDN 按需加载（浏览器专用子入口，零依赖、纯 Web API）。
// 如需锁定版本，把末尾改为具体版本号，例如 edge-tts-universal@1.4.0/browser
const EDGE_TTS_CDN = 'https://esm.sh/edge-tts-universal/browser'

// 标准普通话、自然度高的少儿友好女声
const ZH_VOICE = 'zh-CN-XiaoxiaoNeural'
// 备选男声：zh-CN-YunxiNeural / zh-CN-YunyangNeural

const STORAGE_KEY = 'starlight.edgetts.enabled'

// 连接超时（毫秒）：超时即回落，避免在非 Edge/弱网环境挂起
const CONNECT_TIMEOUT = 5000

const featureEnabled = readEnabledFlag()
let unsupported = false

// ---- 模块缓存：避免每次发音都重新从 CDN 动态 import（造成点击后卡顿）----
type EdgeTtsCtor = new (
  text: string,
  voice: string,
  options?: Record<string, unknown>
) => { synthesize: () => Promise<{ audio: Blob }> }
let ctorPromise: Promise<EdgeTtsCtor> | null = null
let edgeModuleLoaded = false

function readEnabledFlag(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === null) return true // 默认开启
    return v === '1' || v === 'true'
  } catch {
    return true
  }
}

/** 判断当前是否为 Microsoft Edge 浏览器（UA 含 "Edg/"，区别于 Chrome 的 "Chrome/"） */
export function isEdgeBrowser(): boolean {
  return typeof navigator !== 'undefined' && /Edg\//.test(navigator.userAgent)
}

/** 读取启用开关（默认开启） */
export function isEdgeTtsEnabled(): boolean {
  return state.enabled
}

/** 设置启用开关并持久化 */
export function setEdgeTtsEnabled(enabled: boolean): void {
  // featureEnabled 是 const 引用，这里用闭包持有的最新值
  state.enabled = enabled
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
  } catch {
    /* ignore */
  }
  if (!enabled) unsupported = false
}

// featureEnabled 在模块加载时确定，运行时开关通过 state 覆盖
const state: { enabled: boolean } = { enabled: featureEnabled }

interface EdgeTtsModule {
  EdgeTTS?: unknown
  UniversalEdgeTTS?: unknown
  default?: { EdgeTTS?: unknown; UniversalEdgeTTS?: unknown }
}

async function loadCtor(): Promise<EdgeTtsCtor> {
  if (unsupported) throw new Error('edge-tts-unsupported')
  if (!isEdgeBrowser()) {
    unsupported = true
    throw new Error('not-edge-browser')
  }
  // 缓存模块加载 Promise：首次加载后复用，避免每次点击都重新从 CDN import 造成卡顿
  if (!ctorPromise) {
    ctorPromise = (async () => {
      const mod = (await import(/* @vite-ignore */ EDGE_TTS_CDN)) as unknown as EdgeTtsModule
      const Ctor = (mod.EdgeTTS || mod.UniversalEdgeTTS || mod.default?.EdgeTTS || mod.default?.UniversalEdgeTTS) as
        | EdgeTtsCtor
        | undefined
      if (!Ctor) throw new Error('edge-tts-ctor-not-found')
      edgeModuleLoaded = true
      return Ctor
    })()
  }
  return ctorPromise
}

/**
 * 预热：提前从 CDN 拉取 Edge TTS 模块（仅 Edge 浏览器、且启用时）。
 * 应在中文页面挂载时调用，使首次点击即低延迟、跟手。幂等。
 */
export function warmupEdgeTts(): void {
  if (!state.enabled || unsupported) return
  if (!isEdgeBrowser()) {
    unsupported = true
    return
  }
  // 触发模块加载（缓存到 ctorPromise）；失败静默，下次点击仍走兜底链
  loadCtor().catch(() => {})
}

/** 同步判断 Edge TTS 模块是否已就绪（可低延迟出声）；未就绪时调用方应走 youdao 兜底以保证跟手 */
export function isEdgeReady(): boolean {
  return edgeModuleLoaded
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('edge-tts-timeout')), ms)
    p.then(
      (v) => {
        clearTimeout(t)
        resolve(v)
      },
      (e) => {
        clearTimeout(t)
        reject(e)
      }
    )
  })
}

export interface EdgeTtsSpeakOptions {
  slow?: boolean
  /** 引擎内部创建出 audio 元素时回调，便于 speak.ts 接管取消逻辑 */
  onAudio?: (el: HTMLAudioElement) => void
  /** 播放前的守卫（如代次校验）；返回 false 时放弃本次播放并回落 */
  guard?: () => boolean
}

/**
 * 用 Edge TTS 合成并播放中文文本。
 * @returns 播放结果：success 表示已发声；failed 表示应回落到下一层；
 *          aborted 表示代次已失效（用户已发起新的播放）。
 */
export async function speakWithEdgeTts(text: string, opts: EdgeTtsSpeakOptions = {}): Promise<PlayOutcome> {
  if (!state.enabled) return { status: 'failed' }
  try {
    const Ctor = await loadCtor()
    if (opts.guard && !opts.guard()) return { status: 'aborted' }
    const rate = opts.slow ? '-30%' : '+0%'
    const tts = new Ctor(text, ZH_VOICE, { rate, volume: '+0%', pitch: '+0Hz' })
    const result = await withTimeout(tts.synthesize(), CONNECT_TIMEOUT)
    if (opts.guard && !opts.guard()) return { status: 'aborted' }
    const audio = result?.audio
    if (!(audio instanceof Blob)) throw new Error('edge-tts-no-blob')
    const url = URL.createObjectURL(audio)
    // 用统一播放器：保证 Promise 一定结束（ended 缺失也不卡死动画）。
    return await playUrl(url, {
      guard: opts.guard,
      onAudio: opts.onAudio,
      hardCapMs: 120000,
    })
  } catch (e) {
    console.warn('[edge-tts] speak failed, falling back:', e)
    return { status: 'failed' }
  }
}
