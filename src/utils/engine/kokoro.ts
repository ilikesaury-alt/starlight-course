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
  /**
   * 生成结果 Float32 PCM 数据。
   *
   * ⚠️ **从不被读取** —— 下游只用 `toBlob()` 拿 wav 去播放。故设为可选：
   * Worker 路径只把 wav 字节传回主线程（跨线程再传一遍 PCM 没有意义，
   * `toBlob()` 产出的已经是 wav 了）。保留它只为匹配 kokoro-js 的形状。
   */
  audio?: Float32Array
  /** 浏览器环境：转为可播放的 Blob（wav 容器） */
  toBlob(): Blob
}
interface KokoroTTSInstance {
  generate(text: string, options: { voice: string; speed?: number }): Promise<KokoroAudio>
}

/** transformers.js 的下载进度回调载荷 */
interface ModelProgress {
  status?: 'initiate' | 'download' | 'progress' | 'done' | 'ready'
  file?: string
  loaded?: number
  total?: number
}
interface KokoroModule {
  /**
   * transformers.js 的全局配置 —— kokoro-js 原样再导出。
   *
   * `remoteHost` 决定权重从哪个源拉，**必须在 `from_pretrained` 之前赋值**才生效
   * （它只是构造请求 URL 时读的一个常量）。这是让国内网络也能加载模型的关键旋钮。
   */
  env: { remoteHost: string }
  KokoroTTS: {
    from_pretrained(
      modelId: string,
      options: { dtype: string; device: string; progress_callback?: (p: ModelProgress) => void },
    ): Promise<KokoroTTSInstance>
  }
}

// 统一 URL 播放器（保证 Promise 一定结束，区分 blocked/failed）
import { playUrl } from './playUrl'
import { PlayOutcome } from './types'
import { traceNote } from './engineTrace'
import type { WorkerProgress } from './kokoro.worker'

// 官方 ONNX 模型仓库（含 q8 量化权重）
const MODEL_ID = 'onnx-community/kokoro-82m-v1.0-onnx'
// 量化权重：体积/显存更小，Windows + Chrome(WebGPU) 性能充足且自然度几乎无损
const DTYPE = 'q8'
// 儿童友好美音 voicepack：af_heart 温柔自然，适合少儿跟读
const DEFAULT_VOICE = 'af_heart'

// ---------- 模型源：Kokoro 能不能用，全看这一段 ----------
/**
 * 权重只有 huggingface 与 hf-mirror 两个源，而**国内直连 huggingface.co 经常连不上**：
 * 实测 connect 直接 20s 超时；侥幸连上时只有 0.47 MB/s（q8 权重 86MB ⇒ 要 3 分钟），
 * 于是模型在孩子点单词的那几秒里永远「未就绪」，所有发音都掉到又慢又难听的
 * 云 TTS / WebSpeech —— 表现就是「第一个词等下去还能响，之后怎么点都不出声」。
 *
 * 镜像 hf-mirror.com 实测 1.78 MB/s 且稳定（307→302→200，fetch 会自动跟随）。
 *
 * transformers.js 用 `env.remoteHost` 决定从哪拉权重，所以只要在 `from_pretrained`
 * 之前把它指向可用源即可，**kokoro-js / transformers 的其余逻辑一行都不用改**。
 */
const HOST_CANONICAL = 'https://huggingface.co/'
const HOST_MIRROR = 'https://hf-mirror.com/'
/** 下载停滞多久判该源不可用（放弃它，换下一个源重试） */
const STALL_TIMEOUT_MS = 30_000
/** 源选择的缓存键：成功过的源下次先用，不必每次都从最可能不通的那个开始 */
const HOST_CACHE_KEY = 'starlight.kokoro.host'


// 运行时从 CDN 按需加载 kokoro-js（含其 onnxruntime-web 依赖），
// 不进入构建依赖，避免打包体积膨胀；首次点击时懒加载并由浏览器/SW 缓存。
// 可改为自托管路径以完全离线（需同时自托管 onnxruntime-web 的 wasm）。
// 如需锁定版本，把末尾改为具体版本号，例如 kokoro-js@1.2.1
const KOKORO_CDN = 'https://esm.sh/kokoro-js'

const STORAGE_KEY = 'starlight.kokoro.enabled'

// ---------- 模块级单例与状态 ----------
let ttsInstance: KokoroTTSInstance | null = null
let loadingPromise: Promise<KokoroTTSInstance> | null = null
/** 设备根本不支持 WebGPU —— 永久性，判了就不用再试 */
let unsupported = false
/** 上次加载失败的时间戳：网络抖动不该让 Kokoro 整场会话都废掉，退避后允许重试 */
let lastFailureAt = 0
let featureEnabled = readEnabledFlag()

/**
 * 推理后端。
 *
 * `webgpu` 快但**不是到处都有**：实测不少机器（老 Intel 核显驱动、无 Vulkan、
 * 远程桌面 / 虚拟机）里 `navigator.gpu` 存在但 `requestAdapter()` 返回 null，
 * onnxruntime 直接抛 "Failed to get GPU adapter"。这类机器上原来的实现等于
 * 「Kokoro 永远不可用」，而 Kokoro 的自然度正是这条发音链最值钱的地方。
 *
 * `wasm`（onnxruntime-web 的 WASM 后端）纯 CPU、任何浏览器都能跑，慢一些但
 * 音质一模一样 —— 拿速度换覆盖率，让「都用 Kokoro 发音」在没独显的机器上也成立。
 */
export type KokoroDevice = 'webgpu' | 'wasm'

/** 模型加载状态（供诊断面板展示；纯内存，零渲染成本） */
export type KokoroModelState =
  | { phase: 'idle' }
  /** 已开始向某个源发起加载，等首字节（此时还看不出快慢） */
  | { phase: 'connecting'; host: string; device: KokoroDevice }
  | { phase: 'downloading'; host: string; device: KokoroDevice; loaded: number; total: number }
  | { phase: 'ready'; host: string; device: KokoroDevice }
  | { phase: 'failed'; reason: string }

let modelState: KokoroModelState = { phase: 'idle' }
let activeHost = ''
let activeDevice: KokoroDevice = 'webgpu'
let progressLoaded = 0
let progressTotal = 0
let lastProgressAt = 0

/** 当前模型加载状态（诊断面板用） */
export function getKokoroModelState(): KokoroModelState {
  return modelState
}

function setModelState(s: KokoroModelState) {
  modelState = s
}

function readEnabledFlag(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    // 默认**关闭**：英文走「有道(同步) → WebSpeech」稳定链路，1~3 秒出声。
    //
    // 为什么不给默认开（2026-10-09 实测后反转的判断）：
    //   1. Kokoro 的快建立在 WebGPU 上，而 WebGPU 远比想象中少：实测不少机器
    //      （老 Intel 核显 2016 驱动、无 vulkan-1.dll、远程桌面 / 虚拟机）里
    //      `navigator.gpu` 存在而 `requestAdapter()` 返回 null —— 只能退 CPU；
    //   2. CPU 上跑 82M 参数模型，实测**每个单词 7~9 秒**。对幼儿点读是不能接受的
    //      延迟（他会在第一个词出声前点掉五六个），而且再叠加首次 88MB 下载；
    //   3. 早期版本默认开过，代价就是「前几次能响、模型就绪后反而哑火」
    //      （见 fa71ee6：异步推理失败后回退跨域音频，被自动播放策略拦成静音）。
    //
    // 想要神经音色时在控制台执行 localStorage.setItem('starlight.kokoro.enabled','1')
    // 再刷新即可开启 —— 此时上面那些可靠性措施（模型源回退 / 适配器探测 /
    // 加载超时与重试 / Worker 推理不冻界面）都在，可以正常用。
    // 反过来设 '0' 可强制关掉（Kokoro 偶发推理中途失败回退跨域音频时会被拦成静音）。
    if (v === null) return false
    return v === '1' || v === 'true'
  } catch {
    return false
  }
}

/** 检测当前环境是否支持 WebGPU（Windows + Chrome 113+ 通常支持） */
export function isWebGPUSupported(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator
}

/** `navigator.gpu` 存在 ≠ 真拿得到 GPU 适配器。null = 还没探过 */
let webgpuAdapterOk: boolean | null = null

/**
 * WebGPU 是否**真的**能用（真去要一次适配器）。
 *
 * `'gpu' in navigator` 只说明「有这个 API」，不代表能拿到适配器：驱动被拉黑、
 * 远程桌面、虚拟机、自动化浏览器里，`navigator.gpu` 存在而 `requestAdapter()`
 * 返回 null。若只看前者，就会在**下载完 86MB 之后**才抛
 * "Failed to get GPU adapter" —— 白等一场，而且面板还显示「WebGPU ✅」误导排查。
 * 故下载权重前先真探一次，探不到就直接判定不可用。
 */
export async function probeWebGPUAdapter(): Promise<boolean> {
  if (webgpuAdapterOk !== null) return webgpuAdapterOk
  try {
    const gpu = (navigator as unknown as { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
    if (!gpu) {
      webgpuAdapterOk = false
      return false
    }
    webgpuAdapterOk = !!(await gpu.requestAdapter())
  } catch {
    webgpuAdapterOk = false
  }
  return webgpuAdapterOk
}

/** 已探明的 WebGPU 适配器可用性（null = 未知/还没探） */
export function isWebGPUAdapterOk(): boolean | null {
  return webgpuAdapterOk
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
    lastFailureAt = 0
    // 终止 worker：否则它会一直持有 86MB 权重与一条消息端口
    try {
      wasmWorker?.terminate()
    } catch {
      /* ignore */
    }
    wasmWorker = null
    workerPending.clear()
    workerLoadResolve = null
    workerLoadReject = null
    setModelState({ phase: 'idle' })
  }
}

/**
 * 某个源是否「值得再试」—— 只看它此前有没有成功过，不做延迟探测。
 * （探测延迟会误判：见 modelHostOrder 的注释）
 */
function readCachedHost(): string | null {
  try {
    const v = localStorage.getItem(HOST_CACHE_KEY)
    return v === HOST_CANONICAL || v === HOST_MIRROR ? v : null
  } catch {
    return null
  }
}

function cacheHost(host: string) {
  try {
    localStorage.setItem(HOST_CACHE_KEY, host)
  } catch {
    /* ignore */
  }
}

/**
 * 选出本机的模型源。
 *
 * ⚠️ 这里**故意不按「探测延迟」选源**：实测直连源对一个 44 字节的 config.json 要
 * 2.4~2.6s 才回（超过任何合理探测阈值），但真正拉 86MB 权重时却有 1.6 MB/s ——
 * 小文件响应慢根本不代表大文件吞吐差。按延迟选会把好源误判成坏源，反而去撞更慢的。
 *
 * 所以改为**按顺序真刀真枪地试**：记住上次成功的源优先，其余按序尝试，由
 * 「停滞看门狗」判定某个源是否可用（见 withStallWatchdog）。成功的源记下来，
 * 下次直接先用。
 */
export function modelHostOrder(): string[] {
  const cached = readCachedHost()
  if (cached === HOST_MIRROR) return [HOST_MIRROR, HOST_CANONICAL]
  return [HOST_CANONICAL, HOST_MIRROR]
}


/** 下载进度回调：既更新面板状态，也作为「是否卡死」的活性信号 */
function onModelProgress(p: ModelProgress) {
  if (p?.status === 'progress' || p?.status === 'done' || p?.status === 'ready') {
    if (typeof p.loaded === 'number') progressLoaded = p.loaded
    if (typeof p.total === 'number' && p.total > 0) progressTotal = p.total
    lastProgressAt = Date.now()
    setModelState({
      phase: 'downloading',
      host: activeHost,
      device: activeDevice,
      loaded: progressLoaded,
      total: progressTotal,
    })
  }
}

/**
 * 给下载套一个「停滞看门狗」。
 *
 * 为什么需要：86MB 在慢网上要几分钟，而 fetch/onnxruntime 不会因为卡住而 reject ——
 * 原实现里 `loadingPromise` 会永远挂着，`warmupKokoro()` 每次都因它非空而早退，
 * 于是模型**整个会话都停在「未就绪」**，且不报任何错（正是现场看到的现象）。
 * 这里用「N 秒没有任何字节进展」判死当前源，好让上层换源/重试。
 */
function withStallWatchdog<T>(p: Promise<T>, timeoutMs = STALL_TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setInterval(() => {
      if (Date.now() - lastProgressAt > timeoutMs) {
        reject(new Error(`下载停滞超过 ${Math.round(timeoutMs / 1000)}s`))
      }
    }, 2000)
    p.then(
      (v) => {
        clearInterval(timer)
        resolve(v)
      },
      (e) => {
        clearInterval(timer)
        reject(e)
      },
    )
  })
}

/**
 * WASM 推理 Worker 的单例句柄（见 `kokoro.worker.ts`）。
 *
 * 只有 WASM 后端需要它：onnxruntime-web 在主线程是**同步**跑的，实测一个单词
 * 冻结主线程 5957ms（基线 111ms）—— 页面卡死、发音要等、连喇叭的 ⏸ 动画都画不出来
 * （动画逻辑没坏，是重绘要主线程，而线程被冻住了）。
 * WebGPU 的推理本身就在 GPU/异步队列上，不阻塞 UI，故仍留在主线程。
 */
let wasmWorker: Worker | null = null
/** 每次 generate 的自增 id，用于把 worker 回包对应回发起方 */
let generateSeq = 0

function ensureWorker(): Worker {
  if (wasmWorker) return wasmWorker
  const w = new Worker(new URL('./kokoro.worker.ts', import.meta.url), { type: 'module' })
  w.onmessage = (e: MessageEvent<WorkerProgress>) => handleWorkerMessage(e.data)
  w.onerror = () => {
    // worker 自身崩了（少见）：释放句柄，让下一次 load 能重建
    wasmWorker = null
  }
  wasmWorker = w
  return w
}

/** worker → 主线程：进度 / 加载完成 / 音频 / 错误 */
function handleWorkerMessage(m: WorkerProgress) {
  switch (m.type) {
    case 'progress':
      if (m.status === 'progress' || m.status === 'done' || m.status === 'ready') onModelProgress(m)
      break
    case 'loaded':
      workerLoadResolve?.()
      workerLoadResolve = null
      workerLoadReject = null
      break
    case 'audio': {
      const p = workerPending.get(m.id)
      workerPending.delete(m.id)
      p?.resolve({
        sampling_rate: m.sampling_rate,
        // 直接给 wav 字节：主线程只需 makeObjectURL 交给 playUrl
        toBlob: () => new Blob([m.buffer], { type: 'audio/wav' }),
      })
      break
    }
    case 'error': {
      const reason = new Error(m.error)
      if (typeof m.id === 'number') {
        workerPending.get(m.id)?.reject(reason)
        workerPending.delete(m.id)
      } else {
        workerLoadReject?.(reason)
      }
      workerLoadResolve = null
      workerLoadReject = null
      break
    }
  }
}

interface WorkerPending {
  resolve: (a: KokoroAudio) => void
  reject: (e: unknown) => void
}
const workerPending = new Map<number, WorkerPending>()
let workerLoadResolve: (() => void) | null = null
let workerLoadReject: ((e: unknown) => void) | null = null

/** 让 worker 加载模型（进度由 onModelProgress 统一记账） */
function loadViaWorker(host: string): Promise<void> {
  const w = ensureWorker()
  return new Promise<void>((resolve, reject) => {
    workerLoadResolve = resolve
    workerLoadReject = reject
    activeHost = host
    activeDevice = 'wasm'
    progressLoaded = 0
    progressTotal = 0
    lastProgressAt = Date.now()
    setModelState({ phase: 'connecting', host, device: 'wasm' })
    w.postMessage({ type: 'load', host, dtype: DTYPE })
  })
}

/** 让 worker 合成一句话（推理在 worker 线程，主线程不阻塞） */
function generateViaWorker(
  text: string,
  voice: string,
  speed: number,
): Promise<KokoroAudio> {
  const w = ensureWorker()
  const id = ++generateSeq
  return new Promise<KokoroAudio>((resolve, reject) => {
    workerPending.set(id, { resolve, reject })
    w.postMessage({ type: 'generate', id, text, voice, speed })
  })
}

/** 从指定源 + 指定后端加载模型 */
async function loadFromHost(host: string, device: KokoroDevice): Promise<KokoroTTSInstance> {
  // WASM 一律走 Worker：主线程绝不能被同步推理冻住
  if (device === 'wasm') {
    await loadViaWorker(host)
    // 用一个薄壳满足 KokoroTTSInstance 的形状；实际 generate 走 worker 消息
    return {
      generate: (text, options) =>
        generateViaWorker(text, options.voice, options.speed ?? 1),
    }
  }

  // 运行时从 CDN 拉取 ESM 构建（@vite-ignore：构建期不分析、不打包此 URL）
  // SAFETY: kokoro-js 无本地类型声明（不进构建依赖），CDN 返回的模块形状由上面
  // 的 KokoroModule 接口约定；实际只用 KokoroTTS.from_pretrained，拿不到即抛错回落。
  const mod = (await import(/* @vite-ignore */ KOKORO_CDN)) as unknown as KokoroModule
  // 关键：remoteHost 必须在 from_pretrained 之前赋值（它只在构造 URL 时读一次）
  mod.env.remoteHost = host
  activeHost = host
  activeDevice = device
  progressLoaded = 0
  progressTotal = 0
  lastProgressAt = Date.now()
  setModelState({ phase: 'connecting', host, device })
  return mod.KokoroTTS.from_pretrained(MODEL_ID, {
    dtype: DTYPE,
    device,
    progress_callback: onModelProgress,
  })
}

async function loadModel(): Promise<KokoroTTSInstance> {
  if (ttsInstance) return ttsInstance
  if (loadingPromise) return loadingPromise
  if (unsupported) throw new Error('kokoro-unsupported')

  if (!isWebGPUSupported()) {
    unsupported = true
    throw new Error('webgpu-unsupported')
  }

  // 真去要一次 GPU 适配器再决定后端：navigator.gpu 存在但拿不到适配器的环境
  // （驱动拉黑/远程桌面/虚拟机，很常见）如果直接上 webgpu，会在下载完 86MB 之后
  // 才抛 "Failed to get GPU adapter" —— 白下几十兆还白等。探测只要几毫秒。
  const hasAdapter = await probeWebGPUAdapter()
  // 有适配器：webgpu 优先（快一个数量级），失败再退 wasm；
  // 没适配器：直接上 wasm，别浪费一次 86MB 去换一个必然失败的后端。
  const devices: KokoroDevice[] = hasAdapter ? ['webgpu', 'wasm'] : ['wasm']

  loadingPromise = (async () => {
    // 按顺序逐个「源 × 后端」真试（不按探测延迟挑源，理由见 modelHostOrder）：
    // 上次成功的源排最前，其余兜底；换源/换后端都由「停滞看门狗」与异常触发。
    // 两个源都试过仍失败才判失败，且**不永久禁用**，退避后允许下次点击再试。
    const hosts = modelHostOrder()
    let lastErr: unknown = null
    for (const device of devices) {
      for (const host of hosts) {
        try {
          const tts = await withStallWatchdog(loadFromHost(host, device))
          ttsInstance = tts
          activeDevice = device
          cacheHost(host)
          setModelState({ phase: 'ready', host, device })
          if (!hasAdapter) {
            traceNote('kokoro', '此设备无 WebGPU 适配器，已改用 WASM 后端跑 Kokoro（慢一些，音质相同）')
          }
          return tts
        } catch (e) {
          lastErr = e
          // 该源失败：清掉「成功过」的记录，下次从头再试（它可能只是临时抽风）
          try {
            localStorage.removeItem(HOST_CACHE_KEY)
          } catch {
            /* ignore */
          }
        }
      }
    }
    throw lastErr ?? new Error('kokoro-load-failed')
  })()

  try {
    return await loadingPromise
  } catch (e) {
    // 加载失败：释放 loadingPromise，让后续调用能重试（而不是整场会话卡在「未就绪」）
    loadingPromise = null
    lastFailureAt = Date.now()
    const reason = e instanceof Error ? e.message : String(e)
    setModelState({ phase: 'failed', reason })
    // 记进诊断流，?debug=audio 面板可直接看到，不必翻控制台。
    console.warn('[kokoro] 模型加载失败，本次会话回落到有道/WebSpeech:', reason)
    traceNote('kokoro', `模型加载失败：${reason}（已回落到有道）`)
    throw e
  }
}

/**
 * 失败后的重试退避：网络抖动/临时断网不该让 Kokoro 整场会话都废掉，
 * 但也别在每次点击时都重试一遍 86MB 下载。
 */
const RETRY_BACKOFF_MS = 60_000

/** 后台预热模型（fire-and-forget）。可在首屏就调用，不必等用户点第一个词 */
export function warmupKokoro(): void {
  if (!featureEnabled || ttsInstance || loadingPromise || unsupported) return
  if (!isWebGPUSupported()) {
    unsupported = true
    setModelState({ phase: 'failed', reason: '此设备不支持 WebGPU' })
    return
  }
  if (lastFailureAt && Date.now() - lastFailureAt < RETRY_BACKOFF_MS) return // 退避中
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
  /** 生成预算（毫秒）：默认按文本长度推算；作为「云 TTS 失败后的离线备份」时放宽 */
  budgetMs?: number
}

// ---------- 慢设备自适应 ----------
/**
 * 生成预算：超过即判 failed，让链路降级到 2~3 秒就能出声的云 TTS。
 *
 * 手机实测（WebGPU + kokoro-82M-q8）：一个单词就要 5~6s，整句 20~60s。
 * 不设预算的话，孩子点「听示范」要盯着按钮干等半分钟 —— 体验上就是
 * 「句子总是失败」，而云端同样的句子 2~3 秒就播完了。
 * 预算随词数放宽：桌面 GPU 上整句通常 <1s，不会被误伤。
 */
const GENERATE_BUDGET_BASE_MS = 6000
const GENERATE_BUDGET_PER_WORD_MS = 2000
const GENERATE_BUDGET_MAX_MS = 20000

/** 按词数推算生成预算（导出便于单测） */
export function generateBudgetMs(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.min(
    GENERATE_BUDGET_MAX_MS,
    GENERATE_BUDGET_BASE_MS + words * GENERATE_BUDGET_PER_WORD_MS,
  )
}

/**
 * WASM（纯 CPU）后端的生成预算。
 *
 * 同样按词数放宽，但基数与每词成本都高得多，且封顶放到 45s：
 * 没有 WebGPU 适配器的机器上这是**唯一**能拿到好音色的路，宁可等也不能
 * 因为预算太紧而次次判失败、于是永远退回难听的云 TTS。
 */
const WASM_BUDGET_BASE_MS = 12_000
const WASM_BUDGET_PER_WORD_MS = 4_000
const WASM_BUDGET_MAX_MS = 45_000

export function wasmBudgetMs(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.min(WASM_BUDGET_MAX_MS, WASM_BUDGET_BASE_MS + words * WASM_BUDGET_PER_WORD_MS)
}

/**
 * 生成成功但慢于该值 → 本会话标记为慢设备（这次照常播，之后退到云 TTS 之后）。
 * 取 5s：桌面 GPU 上整句生成远小于此（含首次着色器编译），不会误判；
 * 手机上单词就要 6s，必然触发。
 *
 * ⚠️ 这条对 **WASM 同样适用，且是必需的**：CPU 上实测每个单词 7~9 秒，必然超阈值
 * → 第一次慢就把 Kokoro 降到云 TTS 之后，后续点击回到 1~3 秒。
 * 之前这里给 WASM 开了 30s 的 Special Case「免判慢」，等于让每次点击都老实等 9 秒，
 * 是个错误的判断（已撤销）。自动降级是这里想要的行为：慢了就该用快的那条路。
 */
const SLOW_GENERATE_MS = 5000

/** 本会话是否已判定「Kokoro 在这台设备上太慢」（链路应把它降到云 TTS 之后） */
let slowDevice = false

export function isKokoroSlow(): boolean {
  return slowDevice
}

/** 记一次慢设备判定（首次触发时写诊断流，之后静默） */
function markKokoroSlow(note: string, text: string): void {
  if (slowDevice) return
  slowDevice = true
  traceNote('kokoro', note, text)
}

/**
 * 带预算的生成：超时返回 `{ audio: null }`，调用方据此判 failed。
 *
 * 顺带完成慢设备判定（本函数是唯一的生成入口）：
 *   - 超时 → 直接判慢（预算按词数放宽过，打不住就是设备跑不动）；
 *   - 成功但慢于 `SLOW_GENERATE_MS` → 也判慢（这次照常播，之后退到云 TTS 之后）。
 *
 * 超时后**不取消**底层生成（kokoro-js 没有取消接口）—— 迟到的结果直接丢弃，
 * 音频从未被播放，不会造成「示范声突然插进来」。生成 Promise 必须接住
 * 迟到 rejection，否则 race 判超时之后它会变成 unhandledRejection。
 */
export async function generateWithinBudget(
  text: string,
  generate: (t: string) => Promise<KokoroAudio>,
  budgetMs?: number,
  device: KokoroDevice = 'webgpu',
): Promise<{ audio: KokoroAudio | null; ms: number }> {
  const startedAt = Date.now()
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), budgetMs ?? generateBudgetMs(text))
  })
  try {
    // catch(null)：超时后迟到的失败也吞掉，绝不漏成 unhandledRejection
    const audio = await Promise.race([generate(text).catch(() => null), timeout])
    const ms = Date.now() - startedAt
    if (!audio) markKokoroSlow(`生成超过 ${(budgetMs ?? generateBudgetMs(text))}ms 预算，本会话起退到云 TTS 之后`, text)
    else if (ms > SLOW_GENERATE_MS) {
      const how = device === 'wasm' ? '（CPU/WASM 后端，实测每词 7~9s）' : ''
      markKokoroSlow(`生成耗时 ${ms}ms 过慢${how}，本会话起退到云 TTS 之后`, text)
    }
    return { audio, ms }
  } finally {
    if (timer) clearTimeout(timer)
  }
}

/**
 * 用 Kokoro 合成并播放文本。
 *
 * 慢设备自适应（2026-10-09，手机实测一个单词就要 5~6s）：`generateWithinBudget`
 * 超时判 failed、过慢标记慢设备；`speakService` 据此把 Kokoro 降到云 TTS 之后，
 * 只当离线备份用。
 *
 * @returns 播放结果：success 表示已发声；failed 表示应回落到下一层；
 *          aborted 表示代次已失效（用户已发起新的播放）。
 */
export async function speakWithKokoro(text: string, opts: KokoroSpeakOptions = {}): Promise<PlayOutcome> {
  if (!featureEnabled) return { status: 'failed' }
  try {
    const tts = await loadModel()
    if (opts.guard && !opts.guard()) return { status: 'aborted' }
    const { audio } = await generateWithinBudget(
      text,
      (t) => tts.generate(t, { voice: DEFAULT_VOICE, speed: opts.slow ? 0.6 : 1.0 }),
      // WASM 是纯 CPU 推理，比 WebGPU 慢一个数量级，套用 GPU 的预算会次次超时
      opts.budgetMs ?? (activeDevice === 'wasm' ? wasmBudgetMs(text) : undefined),
      activeDevice,
    )
    if (!audio) return { status: 'failed' }
    if (opts.guard && !opts.guard()) return { status: 'aborted' }
    const blob = audio.toBlob()
    const url = URL.createObjectURL(blob)
    return await playUrl(url, {
      guard: opts.guard,
      onAudio: opts.onAudio,
      hardCapMs: 120000,
    })
  } catch (e) {
    console.warn('[kokoro] speak failed, falling back:', e)
    return { status: 'failed' }
  }
}
