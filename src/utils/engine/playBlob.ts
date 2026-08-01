/**
 * 共享：播放一个 blob: URL 音频，并确保 Promise 一定会结束。
 *
 * 设计动机：浏览器对 blob 音频的 `ended` 事件偶发不触发（尤其是 WebGPU 合成的
 * webm/opus 流），若把「动画结束 / done() 回调」完全押在 ended 上，按钮会永久停在
 * 「播放中」。本函数通过兜底定时器保证 resolve。
 *
 * ⚠️ 关键修复（「播一半就停」根因）：
 *   旧实现会在「时长 + 余量」处提前 finish 并 `URL.revokeObjectURL`。但 Edge TTS 等
 *   流式音频的 duration 常被浏览器低估（或报 Infinity/0），于是定时器在音频尚未播完
 *   时吊销正在播放的 blob → 声音戛然而止。
 *   新实现：
 *     - 软兜底（duration+余量）**只复位按钮动画，绝不 revoke**，让音频继续播到自然结束；
 *     - 真正的 revoke 仅发生在 `ended` / `onerror` 或绝对兜底（HARD_CAP）时。
 *   这样无论 duration 是否被低估，都不会中途掐断。
 */

export interface PlayBlobOptions {
  /** 播放前的守卫（如代次校验）；返回 false 时放弃本次播放，视为失败 */
  guard?: () => boolean
  /** 引擎创建出 audio 元素时回调，便于上层接管取消逻辑（cancelSpeech） */
  onAudio?: (el: HTMLAudioElement) => void
}

/** 绝对兜底上限：仅在 loadedmetadata 始终不触发、ended 也丢失时才依赖它，给足余量覆盖长文本 */
const HARD_CAP_MS = 90000

export function playAudioBlob(url: string, opts: PlayBlobOptions = {}): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const el = new Audio(url)
    opts.onAudio?.(el)

    let resolved = false
    let revoked = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const revoke = () => {
      if (revoked) return
      revoked = true
      // 先暂停再吊销：避免「revoke 正在播放的 blob」导致声音戛然而止
      try {
        el.pause()
      } catch {
        /* ignore */
      }
      try {
        URL.revokeObjectURL(url)
      } catch {
        /* ignore */
      }
    }
    // 仅复位 Promise（按钮动画），不吊销 URL —— 让音频继续播到自然结束
    const resolveOnce = (ok: boolean) => {
      if (resolved) return
      resolved = true
      resolve(ok)
    }

    el.onended = () => {
      resolveOnce(true)
      revoke()
    }
    el.onerror = () => {
      resolveOnce(false)
      revoke()
    }

    // 代次守卫：播放前若已变更（用户快速连点），放弃本次播放
    if (opts.guard && !opts.guard()) {
      revoke()
      resolveOnce(false)
      return
    }

    void el.play().catch(() => {
      resolveOnce(false)
      revoke()
    })

    // 软兜底：用「duration + 余量」仅复位按钮动画。
    // 若 duration 可靠且≥真实时长，onended 会先于它触发（已 revoke，此处 resolve 幂等）；
    // 若 duration 被低估（<真实时长），此处提前复位按钮，但音频继续播放，
    // 直到真实 onended 触发才 revoke —— 绝不中途掐断。
    el.addEventListener(
      'loadedmetadata',
      () => {
        const d = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0
        const soft = (d > 0 ? d : 45) * 1000 + 1500
        timers.push(setTimeout(() => resolveOnce(true), soft))
      },
      { once: true },
    )

    // 绝对兜底：仅在 ended 始终不触发时才依赖它（复位 + revoke），覆盖长文本朗读
    timers.push(setTimeout(() => {
      resolveOnce(true)
      revoke()
    }, HARD_CAP_MS))
  })
}
