/**
 * Kokoro-82M 神经网络 TTS 引擎（浏览器端 WebGPU）。
 *
 * 作为 `speak.ts` 回退链的最优选，提供 TTS-Arena 榜首的自然度发音。
 * 运行时从 HuggingFace CDN 懒加载 ~80MB ONNX 模型；首次需联网，
 * 之后由浏览器/Service Worker 缓存（契合项目 PWA 离线优先特性）。
 *
 * 设计要点：
 *   - 仅对英文内容启用（Kokoro 英文自然度最佳；中文/古诗由现有有道链路处理）。
 *   - 模型单例懒加载；warmup 在首次点击时后台触发，避免首屏卡顿。
 *   - 任何失败（无 WebGPU / 加载超时 / 推理异常）都向上返回 false，
 *     由 `speak.ts` 无缝回落到原有「有道 → WebSpeech」兜底。
 *   - 提供启用开关（localStorage），便于在弱机/特殊环境下一键关闭。
 */

// 运行时的 kokoro-js 通过动态 import 引入（代码分割，不进入主包）。
// 此处仅用最小接口描述，避免对具体类型声明的强依赖。
interface KokoroAudio {
  /** 生成结果采样率（通常 24000Hz） */
  sampling_rate: number
  /** 生成结果 Float32 PCM 数据 */
  audio: Float32Array
  /** 浏览器环境：转为可播放的 Blob（wav 容器） */
  toBlob(): Blob
}
interface KokoroTTSInstance {
  generate(text: string, options: { voice: string; speed?: number }): Promise<KokoroAudio>
}
interface KokoroModule {
  KokoroTTS: {
    from_pretrained(modelId: string, options: { dtype: string; device: string }): Promise<KokoroTTSInstance>
  }
}

// 官方 ONNX 模型仓库（含 q8 量化权重）
const MODEL_ID = 'onnx-community/kokoro-82m-v1.0-onnx'
// 量化权重：体积/显存更小，Windows + Chrome(WebGPU) 性能充足且自然度几乎无损
const DTYPE = 'q8'
// 儿童友好美音 voicepack：af_heart 温柔自然，适合少儿跟读
const DEFAULT_VOICE = 'af_heart'

// 运行时从 CDN 按需加载 kokoro-js（含其 onnxruntime-web 依赖），
// 不进入构建依赖，避免打包体积膨胀；首次点击时懒加载并由浏览器/SW 缓存。
// 可改为自托管路径以完全离线（需同时自托管 onnxruntime-web 的 wasm）。
// 如需锁定版本，把末尾改为具体版本号，例如 kokoro-js@1.2.1
const KOKORO_CDN = 'https://esm.sh/kokoro-js'

const STORAGE_KEY = 'starlight.kokoro.enabled'

// ---------- 模块级单例与状态 ----------
let ttsInstance: KokoroTTSInstance | null = null
let loadingPromise: Promise<KokoroTTSInstance> | null = null
let unsupported = false
let featureEnabled = readEnabledFlag()

function readEnabledFlag(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === null) return true // 默认开启
    return v === '1' || v === 'true'
  } catch {
    return true
  }
}

/** 检测当前环境是否支持 WebGPU（Windows + Chrome 113+ 通常支持） */
export function isWebGPUSupported(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator
}

/** 模型是否已加载就绪（可用于决定是否优先走 Kokoro） */
export function isKokoroReady(): boolean {
  return ttsInstance !== null
}

/** 读取启用开关（默认开启） */
export function isKokoroEnabled(): boolean {
  return featureEnabled
}

/** 设置启用开关并持久化；关闭后 speak.ts 会直接走原有链路 */
export function setKokoroEnabled(enabled: boolean): void {
  featureEnabled = enabled
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
  } catch {
    /* ignore */
  }
  // 关闭时放弃已加载的模型与预热，回收显存
  if (!enabled) {
    ttsInstance = null
    loadingPromise = null
    unsupported = false
  }
}

async function loadModel(): Promise<KokoroTTSInstance> {
  if (ttsInstance) return ttsInstance
  if (loadingPromise) return loadingPromise
  if (unsupported) throw new Error('kokoro-unsupported')

  if (!isWebGPUSupported()) {
    unsupported = true
    throw new Error('webgpu-unsupported')
  }

  loadingPromise = (async () => {
    // 运行时从 CDN 拉取 ESM 构建（@vite-ignore：构建期不分析、不打包此 URL）
    const mod = (await import(/* @vite-ignore */ KOKORO_CDN)) as unknown as KokoroModule
    const tts = await mod.KokoroTTS.from_pretrained(MODEL_ID, {
      dtype: DTYPE,
      device: 'webgpu',
    })
    ttsInstance = tts
    return tts
  })()

  try {
    return await loadingPromise
  } catch (e) {
    // 加载失败：标记不支持，后续直接回落，避免反复重试
    loadingPromise = null
    unsupported = true
    throw e
  }
}

/** 后台预热模型（首次点击时调用，fire-and-forget） */
export function warmupKokoro(): void {
  if (!featureEnabled || ttsInstance || loadingPromise || unsupported) return
  if (!isWebGPUSupported()) {
    unsupported = true
    return
  }
  loadModel().catch(() => {
    /* 预热失败静默回落 */
  })
}

export interface KokoroSpeakOptions {
  slow?: boolean
  /** 引擎内部创建出 audio 元素时回调，便于 speak.ts 接管取消逻辑 */
  onAudio?: (el: HTMLAudioElement) => void
  /** 播放前的守卫（如代次校验）；返回 false 时放弃本次播放并回落 */
  guard?: () => boolean
}

/**
 * 用 Kokoro 合成并播放文本。
 * @returns 是否成功播放（false 表示应回落到原有链路）
 */
export async function speakWithKokoro(text: string, opts: KokoroSpeakOptions = {}): Promise<boolean> {
  if (!featureEnabled) return false
  try {
    const tts = await loadModel()
    const audio = await tts.generate(text, {
      voice: DEFAULT_VOICE,
      speed: opts.slow ? 0.6 : 1.0,
    })
    const blob = audio.toBlob()
    const url = URL.createObjectURL(blob)
    try {
      await new Promise<void>((resolve, reject) => {
        const el = new Audio(url)
        opts.onAudio?.(el)
        let settledPlay = false
        let fallbackTimer: ReturnType<typeof setTimeout> | null = null
        const onPlayEnd = () => {
          if (settledPlay) return
          settledPlay = true
          if (fallbackTimer) clearTimeout(fallbackTimer)
          URL.revokeObjectURL(url)
          resolve()
        }
        const onPlayError = () => {
          if (settledPlay) return
          settledPlay = true
          if (fallbackTimer) clearTimeout(fallbackTimer)
          URL.revokeObjectURL(url)
          reject(new Error('play-failed'))
        }
        el.onended = onPlayEnd
        el.onerror = onPlayError
        // 播放前守卫：代次已变更（用户快速连点）则放弃本次播放
        if (opts.guard && !opts.guard()) {
          URL.revokeObjectURL(url)
          reject(new Error('aborted'))
          return
        }
        void el.play().catch(onPlayError)
        // 兜底：部分浏览器/解码路径对 blob 音频偶发不触发 ended，
        // 依据音频时长 + 余量设置硬超时，确保 Promise 一定会结束，
        // 从而 speak.ts 的 done()（动画复位）必然被调用。
        el.addEventListener(
          'loadedmetadata',
          () => {
            const dur = Number.isFinite(el.duration) ? el.duration : 5
            fallbackTimer = setTimeout(onPlayEnd, dur * 1000 + 2000)
          },
          { once: true }
        )
      })
      return true
    } catch {
      URL.revokeObjectURL(url)
      return false
    }
  } catch (e) {
    console.warn('[kokoro] speak failed, falling back:', e)
    return false
  }
}
