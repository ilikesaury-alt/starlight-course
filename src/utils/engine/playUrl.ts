/**
 * 统一 URL 音频播放器：负责一个 URL（网络 / blob）从创建元素到播放结束的完整生命周期。
 *
 * 设计动机（解决「间歇性失效」的播放层根因）：
 *   - 明确「加载 → 解码 → 播放」阶段：等待 canplay 数据，加载超时判失败，交由上层回退；
 *   - 识别自动播放策略（NotAllowedError → blocked），让上层「解锁音频后重试本引擎」，
 *     而不是盲目降级到可能同样被拦截的下一层；
 *   - 软兜底（duration + 余量）只复位播放状态，绝不 revoke 正在播放的 blob，
 *     避免「播到一半被掐断」（Edge TTS 等流式音频 duration 常被低估）；
 *   - 真正的 revoke 只发生在 ended / error / 取消 / 绝对兜底（HARD_CAP）时；
 *   - Promise 一定结束（ended 缺失、duration 不可靠都不会卡死按钮动画）。
 */

import { PlayOutcome } from './types'

export interface PlayUrlOptions {
  /** 播放前的守卫（如代次校验）；返回 false 时放弃本次播放（aborted） */
  guard?: () => boolean
  /** 创建出 audio 元素时回调，便于上层接管取消逻辑 */
  onAudio?: (el: HTMLAudioElement) => void
  /** 播放速率（慢速 0.6 / 正常 1） */
  playbackRate?: number
  /** 加载/解码超时（毫秒），超时仍未开始播放则判定失败 */
  loadTimeout?: number
  /** 绝对兜底上限：仅当 loadedmetadata 始终不触发、ended 也丢失时才依赖它 */
  hardCapMs?: number
}

const DEFAULT_LOAD_TIMEOUT = 10000
const DEFAULT_HARD_CAP = 90000

export function playUrl(url: string, opts: PlayUrlOptions = {}): Promise<PlayOutcome> {
  return new Promise<PlayOutcome>((resolve) => {
    const guard = opts.guard ?? (() => true)
    const loadTimeout = opts.loadTimeout ?? DEFAULT_LOAD_TIMEOUT
    const hardCapMs = opts.hardCapMs ?? DEFAULT_HARD_CAP

    let settled = false
    const settle = (o: PlayOutcome) => {
      if (settled) return
      settled = true
      resolve(o)
    }

    const el = new Audio()
    el.preload = 'auto'
    if (opts.playbackRate && opts.playbackRate > 0) el.playbackRate = opts.playbackRate
    try {
      opts.onAudio?.(el)
    } catch {
      /* ignore */
    }

    if (!guard()) {
      settle({ status: 'aborted' })
      return
    }

    let started = false
    let revoked = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const clearTimers = () => {
      for (const t of timers) clearTimeout(t)
    }
    // 先暂停再吊销：避免「revoke 正在播放的 blob」导致声音戛然而止
    const revoke = () => {
      if (revoked) return
      revoked = true
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

    // 加载/解码超时：始终无法开始播放（网络慢 / 媒体格式不支持）则判失败
    timers.push(
      setTimeout(() => {
        if (!settled && !started) {
          try {
            el.pause()
          } catch {
            /* ignore */
          }
          settle({ status: 'failed' })
        }
      }, loadTimeout),
    )

    el.onerror = () => {
      clearTimers()
      revoke()
      settle({ status: 'failed' })
    }
    el.onended = () => {
      clearTimers()
      revoke()
      settle({ status: 'success' })
    }
    el.onplaying = () => {
      started = true
    }

    // 软兜底：仅复位播放状态（resolve success），不吊销 URL —— 音频继续播到自然结束，
    // 真实 onended 到来时再 revoke。duration 不可靠（Infinity/0）用 45s 保守兜底。
    el.addEventListener(
      'loadedmetadata',
      () => {
        const d = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0
        const soft = (d > 0 ? d : 45) * 1000 + 1500
        timers.push(
          setTimeout(() => {
            if (!settled) settle({ status: 'success' })
          }, soft),
        )
      },
      { once: true },
    )

    // 绝对兜底：仅在 ended 始终不触发时才依赖它（复位 + revoke），覆盖超长朗读
    timers.push(
      setTimeout(() => {
        clearTimers()
        revoke()
        settle({ status: 'success' })
      }, hardCapMs),
    )

    el.src = url
    el.load()

    try {
      const p = el.play()
      if (p && typeof p.catch === 'function') {
        p.then(() => {
          started = true
        }).catch((err: unknown) => {
          if (settled) return
          const name =
            err instanceof DOMException ? err.name : String((err as { name?: string })?.name ?? '')
          if (name === 'NotAllowedError') {
            // 自动播放策略拦截：返回 blocked，上层解锁音频后重试本引擎
            clearTimers()
            revoke()
            settle({ status: 'blocked' })
          } else if (name === 'AbortError') {
            // 被本层或新会话取消（pause/load 打断）→ aborted，停止整条链
            clearTimers()
            revoke()
            settle({ status: 'aborted' })
          } else {
            clearTimers()
            revoke()
            settle({ status: 'failed' })
          }
        })
      }
    } catch {
      clearTimers()
      revoke()
      settle({ status: 'failed' })
    }
  })
}
