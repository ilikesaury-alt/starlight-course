/**
 * 共享：播放一个 blob: URL 音频，并确保 Promise 一定会结束。
 *
 * 设计动机：浏览器对 blob 音频的 `ended` 事件偶发不触发（尤其是 WebGPU 合成的
 * webm/opus 流），若把「动画结束 / done() 回调」完全押在 ended 上，按钮会永久停在
 * 「播放中」。本函数通过三重保险保证 resolve：
 *   1. 已知 duration 时立即布防「时长 + 余量」兜底定时器；
 *   2. 未知 duration 时，在 play() 之前注册 loadedmetadata（能捕获提前触发的 metadata）；
 *   3. 绝对兜底定时器（上限 ~20s），即使上述两路都失效也不会永久挂起。
 *
 * @returns true=成功播放到结束；false=失败或被守卫放弃（上层应回落到兜底链）
 */

export interface PlayBlobOptions {
  /** 播放前的守卫（如代次校验）；返回 false 时放弃本次播放，视为失败 */
  guard?: () => boolean
  /** 引擎创建出 audio 元素时回调，便于上层接管取消逻辑（cancelSpeech） */
  onAudio?: (el: HTMLAudioElement) => void
}

/** 绝对兜底上限：即使 ended 与 duration 兜底都失效，也不会永久挂起 */
const HARD_CAP_MS = 20000

export function playAudioBlob(url: string, opts: PlayBlobOptions = {}): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const el = new Audio(url)
    opts.onAudio?.(el)

    let settled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const cleanup = () => {
      timers.forEach(clearTimeout)
      try {
        URL.revokeObjectURL(url)
      } catch {
        /* ignore */
      }
    }
    const finish = (ok: boolean) => {
      if (settled) return
      settled = true
      cleanup()
      resolve(ok)
    }

    el.onended = () => finish(true)
    el.onerror = () => finish(false)

    // 代次守卫：播放前若已变更（用户快速连点），放弃本次播放
    if (opts.guard && !opts.guard()) {
      cleanup()
      resolve(false)
      return
    }

    void el.play().catch(() => finish(false))

    // 时长兜底：不依赖 loadedmetadata 事件顺序 ——
    // 若 duration 已可直接读取则立即布防；否则在 play 之前注册事件（能捕获提前触发的 metadata）
    const armDurationCap = () => {
      const dur = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 6
      timers.push(setTimeout(() => finish(true), dur * 1000 + 1500))
    }
    if (Number.isFinite(el.duration) && el.duration > 0) {
      armDurationCap()
    } else {
      el.addEventListener('loadedmetadata', armDurationCap, { once: true })
    }

    // 绝对兜底：极端情况下 ended 与 duration 兜底都失效，保证 ~20s 内必然结束，
    // 避免上层按钮动画永久停在「播放中」。
    timers.push(setTimeout(() => finish(true), HARD_CAP_MS))
  })
}
