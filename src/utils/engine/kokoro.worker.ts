/**
 * Kokoro 推理 Worker —— 把 ONNX 推理从主线程挪走。
 *
 * 为什么必须有这个文件（2026-10-09 实测）：
 *   WASM 后端的 onnxruntime-web 在**主线程**同步执行。实测点一个单词
 *   「Hello,」把主线程**冻结 5957ms**（基线最大延迟仅 111ms），连带后果是
 *   「页面很卡」+「等几秒才发音」+「喇叭的 ⏸ 动画完全不出现」——
 *   最后一条尤其误导：`setPlaying(true)` 确实执行了，但**重绘也要主线程**，
 *   线程被冻住就一帧都画不出来，看着像动画逻辑坏了。
 *
 * 搬进 Worker 后：主线程只负责收发消息，动画立刻正常、页面不再卡，
 * 音质一点不变（同一份权重、同一个后端）。
 *
 * 注意：这里只用单线程 WASM（不碰 SharedArrayBuffer），所以**不需要**
 * COOP/COEP 跨源隔离头，GitHub Pages 部署无需任何额外配置。
 */

export type WorkerRequest =
  | { type: 'load'; host: string; dtype: string }
  | { type: 'generate'; id: number; text: string; voice: string; speed: number }

/** 主线程 → Worker 的进度消息 */
export type WorkerProgress =
  | { type: 'progress'; status: 'progress' | 'done' | 'ready'; loaded?: number; total?: number }
  | { type: 'loaded'; device: string }
  | { type: 'audio'; id: number; buffer: ArrayBuffer; sampling_rate: number; ms: number }
  | { type: 'error'; id?: number; error: string }

const KOKORO_CDN = 'https://esm.sh/kokoro-js'
const MODEL_ID = 'onnx-community/kokoro-82m-v1.0-onnx'

/** kokoro-js 的最小形状（无本地类型声明，按实测导出约定） */
interface KokoroInstance {
  generate(text: string, options: { voice: string; speed?: number }): Promise<{
    sampling_rate: number
    audio: Float32Array
    toBlob(): Blob
  }>
}
interface KokoroModule {
  env: { remoteHost: string }
  KokoroTTS: {
    from_pretrained(
      modelId: string,
      options: { dtype: string; device: string; progress_callback?: (p: unknown) => void },
    ): Promise<KokoroInstance>
  }
}

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<WorkerRequest>) => void) | null
  postMessage: (m: WorkerProgress) => void
}

let tts: KokoroInstance | null = null
let loading: Promise<KokoroInstance> | null = null
let activeDevice = 'wasm'
/** 主线程 load 消息里指定的源与量化档位；generate 复用，绝不自己另选一个源 */
let currentHost = 'https://huggingface.co/'
let currentDtype = 'q8'

async function load(host: string, dtype: string): Promise<KokoroInstance> {
  if (tts) return tts
  if (loading) return loading
  loading = (async () => {
    const mod = (await import(/* @vite-ignore */ KOKORO_CDN)) as unknown as KokoroModule
    // 必须在 from_pretrained 之前赋值：它只在构造请求 URL 时读一次
    mod.env.remoteHost = host
    const instance = await mod.KokoroTTS.from_pretrained(MODEL_ID, {
      dtype,
      device: activeDevice,
      progress_callback: (p: unknown) => {
        const q = p as { status?: string; loaded?: number; total?: number }
        if (q?.status === 'progress' || q?.status === 'done' || q?.status === 'ready') {
          ctx.postMessage({
            type: 'progress',
            status: q.status as 'progress' | 'done' | 'ready',
            loaded: q.loaded,
            total: q.total,
          })
        }
      },
    })
    tts = instance
    return instance
  })()
  try {
    return await loading
  } catch (e) {
    // 释放，允许换源/换设备后重试（主线程会决定是否再试下一个组合）
    loading = null
    throw e
  }
}

ctx.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data
  if (msg.type === 'load') {
    activeDevice = 'wasm'
    currentHost = msg.host
    currentDtype = msg.dtype
    load(msg.host, msg.dtype)
      .then(() => ctx.postMessage({ type: 'loaded', device: activeDevice }))
      .catch((err: unknown) =>
        ctx.postMessage({ type: 'error', error: err instanceof Error ? err.message : String(err) }),
      )
    return
  }

  if (msg.type === 'generate') {
    const startedAt = Date.now()
    // 复用主线程已选定的源/档位（模型没加载过时会用同一组参数补加载）
    load(currentHost, currentDtype)
      .then((instance) => instance.generate(msg.text, { voice: msg.voice, speed: msg.speed }))
      .then(async (audio) => {
        const blob = audio.toBlob()
        const buffer = await blob.arrayBuffer()
        ctx.postMessage({
          type: 'audio',
          id: msg.id,
          buffer,
          sampling_rate: audio.sampling_rate,
          ms: Date.now() - startedAt,
        })
      })
      .catch((err: unknown) =>
        ctx.postMessage({
          type: 'error',
          id: msg.id,
          error: err instanceof Error ? err.message : String(err),
        }),
      )
  }
}
