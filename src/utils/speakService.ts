/**
 * 统一语音播放服务（单例）：所有发音入口（SpeakButton / FcWord / 页面自动朗读 / 测验 /
 * 朗读全文）都收敛到这里，保证「点击一次、至多发声一次、状态必有结束」。
 *
 * 架构（解决旧 speak.ts 的间歇性失效根因）：
 *   - 会话 + 代次：每次 speak 递增 sessionId；所有异步回调 / 引擎 / 兜底都通过
 *     guard 校验代次，任何迟到的旧回调自动失效 —— 彻底消除并发抢占与「多个按钮
 *     动画同时卡在播放中」。
 *   - 有界兜底链：每个引擎至多尝试一次（blocked 解锁后重试一次），链按顺序推进，
 *     永不递归、永不死循环（旧实现 youdao→native→youdao→… 会无界递归）。
 *   - 引擎结果区分 blocked / failed：blocked 走「解锁音频 + 重试本引擎」，
 *     failed 才降级到下一层；aborted 立即终止整条链。
 *   - 请求级硬预算：任何情况下都会在预算内复位 onEnd（不取消可能仍在播放的音频，
 *     让其自然结束），按钮动画绝不永久卡在「播放中」。
 *   - 每次调用先 unlockAudio()：把异步 play() 放进用户手势的激活窗口内，规避
 *     浏览器自动播放策略的间歇性拦截。
 *
 * 对外保持兼容 API：speakText / cancelSpeech（speak.ts 只做 re-export）。
 */

import { PlayOutcome } from './engine/types'
import { playYoudaoAudio, playYoudaoChunked } from './engine/youdao'
import { speakWithWebSpeech } from './engine/webSpeech'
import { speakWithKokoro, isKokoroEnabled, isKokoroReady, warmupKokoro } from './engine/kokoro'
import {
  speakWithEdgeTts,
  isEdgeBrowser,
  isEdgeTtsEnabled,
  isEdgeReady,
  warmupEdgeTts,
} from './engine/edgeTts'
import { unlockAudio } from './audioUnlock'

export interface SpeakOptions {
  /** slower rate for kids (0.6) */
  slow?: boolean
  /** override rate; defaults to 0.9 (or 0.6 when slow) */
  rate?: number
  /** 'en' (default) or 'zh' */
  lang?: 'en' | 'zh'
  onStart?: () => void
  onEnd?: () => void
}

// ---------- 会话状态（模块级单例）----------
let sessionId = 0
let activeAudio: HTMLAudioElement | null = null
let activeEnd: (() => void) | null = null

function stopAudioEl(el: HTMLAudioElement | null) {
  if (!el) return
  try {
    el.pause()
    el.removeAttribute('src')
    el.load()
  } catch {
    /* ignore */
  }
}

// 仅当原生合成器确实在播/排队时才 cancel，避免「连续 cancel+speak」触发 Chrome 假死
function stopNativeSynth() {
  try {
    const s = window.speechSynthesis
    if (s && (s.speaking || s.pending)) s.cancel()
  } catch {
    /* ignore */
  }
}

/**
 * 立即停止任何正在进行的朗读（复位动画 + 停音频 + 失效代次）。
 * 组件卸载 / 切换路由 / 新按钮点击前都会调用。
 */
export function cancelSpeech() {
  sessionId++
  const cb = activeEnd
  activeEnd = null
  stopAudioEl(activeAudio)
  activeAudio = null
  stopNativeSynth()
  if (cb) {
    try {
      cb()
    } catch {
      /* ignore */
    }
  }
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/** 顺序执行兜底链：每个引擎至多一次（blocked 解锁后重试一次），永不递归 */
async function runChain(
  chain: Array<() => Promise<PlayOutcome>>,
  guard: () => boolean,
  done: () => void,
): Promise<void> {
  for (let i = 0; i < chain.length; i++) {
    if (!guard()) {
      done()
      return
    }
    const attempt = chain[i]
    let out: PlayOutcome
    try {
      out = await attempt()
    } catch {
      out = { status: 'failed' }
    }
    if (!guard()) {
      done()
      return
    }
    if (out.status === 'success' || out.status === 'aborted') {
      done()
      return
    }
    if (out.status === 'blocked') {
      // 自动播放被拦截：解锁音频后重试本引擎一次；仍失败则降级到下一层
      unlockAudio()
      await delay(250)
      if (!guard()) {
        done()
        return
      }
      try {
        out = await attempt()
      } catch {
        out = { status: 'failed' }
      }
      if (!guard()) {
        done()
        return
      }
      if (out.status === 'success' || out.status === 'aborted') {
        done()
        return
      }
    }
    // failed / blocked（重试后仍失败）→ 下一层
  }
  done()
}

export function speakText(text: string, opts: SpeakOptions = {}) {
  if (!text || !text.trim()) {
    // 空文本：立即开始并结束，避免按钮动画卡在「播放中」
    try {
      opts.onStart?.()
      opts.onEnd?.()
    } catch {
      /* ignore */
    }
    return
  }

  // 每次发音都尝试解锁音频，把后续异步 play() 放进用户手势激活窗口内
  unlockAudio()

  const slow = !!opts.slow
  const rate = opts.rate ?? (slow ? 0.6 : 0.9)
  const lang = opts.lang ?? 'en'
  const sid = ++sessionId

  // 强制结束上一个发声会话：复位其动画、停掉其音频/合成器
  if (activeEnd) {
    const cb = activeEnd
    activeEnd = null
    try {
      cb()
    } catch {
      /* ignore */
    }
  }
  stopAudioEl(activeAudio)
  activeAudio = null
  stopNativeSynth()

  try {
    opts.onStart?.()
  } catch {
    /* ignore */
  }

  let finished = false
  let budgetTimer: ReturnType<typeof setTimeout> | null = null
  const done = () => {
    if (finished) return
    finished = true
    activeEnd = null
    if (budgetTimer) {
      clearTimeout(budgetTimer)
      budgetTimer = null
    }
    try {
      opts.onEnd?.()
    } catch {
      /* ignore */
    }
  }
  activeEnd = done

  const guard = () => sid === sessionId
  // 接管引擎创建出的 audio 元素；仅在仍为本会话时更新引用，避免旧引擎迟到音频覆盖新会话
  const onAudio = (el: HTMLAudioElement) => {
    if (guard()) activeAudio = el
  }

  // ---- 构建有界兜底链（优先级从高到低，互不递归）----
  const chain: Array<() => Promise<PlayOutcome>> = []
  const zh = lang === 'zh'

  if (zh) {
    // 中文：Edge TTS（仅 Edge 且已预热）→ 有道（长文本分片）→ WebSpeech
    if (isEdgeTtsEnabled() && isEdgeBrowser()) {
      if (isEdgeReady()) {
        chain.push(() => speakWithEdgeTts(text, { slow, guard, onAudio }))
      } else {
        warmupEdgeTts() // 模块尚未预热：后台预热，首次点击仍走有道保证跟手
      }
    }
    if (text.length > 30) {
      chain.push(() => playYoudaoChunked(text, rate, guard, onAudio))
    } else {
      chain.push(() => playYoudaoAudio(text, 'zh', { rate: slow ? 0.6 : 1, guard, onAudio }))
    }
  } else {
    // 英文：Kokoro（仅当模型已就绪）→ 有道 → WebSpeech
    if (isKokoroEnabled()) {
      if (isKokoroReady()) {
        chain.push(() => speakWithKokoro(text, { slow, guard, onAudio }))
      } else {
        warmupKokoro()
      }
    }
    chain.push(() => playYoudaoAudio(text, 'en', { rate: slow ? 0.6 : 1, guard, onAudio }))
  }
  chain.push(() => speakWithWebSpeech(text, { lang, rate, guard }))

  // 请求级硬预算：无论如何都会复位 UI（不取消音频，让其自然结束）
  const budgetMs = Math.max(15000, Math.min(120000, text.length * (slow ? 350 : 250) + 12000))
  budgetTimer = setTimeout(() => done(), budgetMs)

  void runChain(chain, guard, done)
}
