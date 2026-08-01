/**
 * Universal pronunciation helper.
 *
 * 渐进增强回退链（优先级从高到低）：
 *   - 英文：Kokoro-82M 神经网络 TTS (WebGPU) → 有道 → WebSpeech（见 engine/kokoro.ts）
 *   - 中文：Edge TTS (云端, 仅 Microsoft Edge) → 有道 → WebSpeech（见 engine/edgeTts.ts）
 *   - 任何一层失败都静默回落到下一层，保证「一定能出声」
 *
 * 稳定性增强：
 *   - 预载 speechSynthesis 的 voices 并监听 voiceschanged，避免 getVoices 为空时静默
 *   - speak 前若 synthesis 处于 paused 则 resume()，并显式指定 en-US / zh-CN voice
 *   - 有道仅在「2.5s 内从未开始播放」时才降级，不打断正在朗读的句子
 *   - 兜底 native speak 若静默无回调（Chrome 假死），自动复位按钮以便重试
 *   - Kokoro 仅在「模型已就绪」时优先使用；未就绪则走原有链路并后台预热，避免首屏卡顿
 *   - Edge TTS 仅在 Microsoft Edge 浏览器生效；非 Edge（如 Chrome）直接走有道，无额外延迟
 */

export interface SpeakOptions {
  /** slower rate for kids (0.6) */
  slow?: boolean
  /** override rate; defaults to 0.9 (or 0.6 when slow) */
  rate?: number
  /** 'en' (default) uses English voice + Youdao type=1; 'zh' uses Chinese voice + Youdao type=2 */
  lang?: 'en' | 'zh'
  onStart?: () => void
  onEnd?: () => void
}

// 神经网络 TTS 引擎（WebGPU，英文）；失败/未启用时由下方回退链无缝接管
import { speakWithKokoro, isKokoroReady, isKokoroEnabled, warmupKokoro } from './engine/kokoro'
// 云端中文 TTS 引擎（仅 Microsoft Edge）；非 Edge 时由下方回退链无缝接管
import { speakWithEdgeTts, isEdgeBrowser, isEdgeTtsEnabled, warmupEdgeTts, isEdgeReady } from './engine/edgeTts'

// ---------- Web Speech API 语音预载 ----------
let voices: SpeechSynthesisVoice[] = []

function loadVoices() {
  try {
    const vs = window.speechSynthesis?.getVoices?.() ?? []
    if (vs.length) voices = vs
  } catch {
    /* ignore */
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices()
  // Chrome 首次 getVoices() 常为空，需等 voiceschanged 事件再取一次
  window.speechSynthesis.onvoiceschanged = loadVoices
}

/** 选一个英文嗓音（优先 en-US），没有则返回 undefined 用浏览器默认 */
function pickVoice(): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined
  return (
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('en')) ||
    undefined
  )
}

/** 选一个中文嗓音（优先 zh-CN），供中文课文/古诗朗读使用 */
function pickZhVoice(): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined
  return (
    voices.find((v) => v.lang === 'zh-CN') ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('zh')) ||
    undefined
  )
}

// ---------- 播放状态管理 ----------
/** 上一次播放的 Audio 引用，用于取消重叠播放 */
let currentAudio: HTMLAudioElement | null = null
/** 递增代次，使旧回调自动失效 */
let generation = 0
/** 所有待结的 onEnd 回调，新调用时全部通知 */
const pendingEnds: Array<() => void> = []

/** 通知所有旧的 onEnd 回调并清空池 */
function flushPendingEnds() {
  const cbs = pendingEnds.splice(0)
  for (const cb of cbs) {
    try {
      cb()
    } catch {
      /* ignore */
    }
  }
}

export function speakText(text: string, opts: SpeakOptions = {}) {
  if (!text?.trim()) return

  const slow = !!opts.slow
  const rate = opts.rate ?? (slow ? 0.6 : 0.9)
  const lang = opts.lang ?? 'en'

  // 先通知所有旧回调，确保上一个按钮的动画停止
  flushPendingEnds()

  opts.onStart?.()

  let finished = false
  const done = () => {
    if (!finished) {
      finished = true
      // 从池中移除自身（防止 flush 时重复调用）
      const i = pendingEnds.indexOf(markDone)
      if (i !== -1) pendingEnds.splice(i, 1)
      opts.onEnd?.()
    }
  }
  const markDone = done

  // 取消上一次播放（有道 / Kokoro 音频）
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.removeAttribute('src')
      currentAudio.load()
    } catch {
      /* ignore */
    }
    currentAudio = null
  }
  // 仅当原生合成器确实在播 / 排队时才 cancel，避免「每次点击都 cancel」的轰炸。
  // 这正是 Chrome speechSynthesis 说出几个就永久失声（假死）的根因之一：
  // 连续的 cancel()+speak() 会把引擎拖入既不 onend 也不报错、speaking/pending 卡 false 的死状态。
  try {
    const s = window.speechSynthesis
    if (s && typeof s.cancel === 'function' && (s.speaking || s.pending)) s.cancel()
  } catch {
    /* ignore */
  }

  // 递增代次，旧回调检测到代次不匹配时自动跳过
  const gen = ++generation

  // Level 1: 有道词典 TTS（英文 type=1，中文 type=2）
  const youdao = (onComplete?: () => void) => {
    try {
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=${lang === 'zh' ? 2 : 1}`
      const audio = new Audio(url)
      audio.playbackRate = slow ? 0.6 : 1
      currentAudio = audio

      let settled = false
      let started = false // 是否真正开始播放（用于区分"卡住"与"正在播"）
      let playCapTimer: ReturnType<typeof setTimeout> | null = null

      const onSuccess = () => {
        if (playCapTimer) clearTimeout(playCapTimer)
        // 音频成功播完即复位本按钮动画；不再受 gen 限制（done 仅复位本按钮自身，
        // 不会误伤正在播放的其它按钮），避免上一句已播完但动画卡在「播放中」。
        if (!settled) {
          settled = true
          if (currentAudio === audio) currentAudio = null
          done()
        }
      }
      const onFail = () => {
        if (playCapTimer) clearTimeout(playCapTimer)
        if (!settled && gen === generation) {
          settled = true
          if (currentAudio === audio) currentAudio = null
          onComplete?.()
        }
      }

      audio.onplaying = () => {
        started = true
        // 已开始播放但 ended 迟迟不触发时的兜底收尾：
        // 依音频时长 + 余量强制 onSuccess，避免按钮动画永久停在「播放中」。
        const dur = Number.isFinite(audio.duration) ? audio.duration : 12
        playCapTimer = setTimeout(() => {
          if (!settled) onSuccess()
        }, dur * 1000 + 1200)
      }
      // 进度结束检测：跨域有道音频的 ended 偶发不触发，依据 timeupdate 判定已播完，
      // 比单纯依赖 ended 更可靠，确保动画及时复位。
      audio.ontimeupdate = () => {
        const d = audio.duration
        if (Number.isFinite(d) && d > 0 && audio.currentTime >= d - 0.12) onSuccess()
      }
      audio.onended = onSuccess
      audio.onerror = onFail

      // 仅当「2.5s 内从未开始播放」才判定为卡住并降级；
      // 已经开播的句子绝不打断（长句也能播完）
      const timer = setTimeout(() => {
        if (!settled && !started) {
          try {
            audio.pause()
            audio.removeAttribute('src')
            audio.load()
          } catch {
            /* ignore */
          }
          onFail()
        }
      }, 2500)

      audio.addEventListener('ended', () => clearTimeout(timer), { once: true })
      audio.addEventListener('error', () => clearTimeout(timer), { once: true })

      void audio.play().catch(() => {
        if (!settled) onFail()
      })
    } catch {
      onComplete?.()
    }
  }

  // Level 2: speechSynthesis 兜底（Web Speech API）
  // 关键健壮性修复：Chrome 在连续 speak / cancel 数次后，合成器会「假死」——
  // speak() 后既无 onend 也无 onerror，synth.speaking / synth.pending 也卡在 false，
  // 表现为「点几个就不发音」。对策：
  //   1) 仅在确有发声 / 排队时才 cancel，避免 cancel 轰炸触发假死；
  //   2) 1.2s 静默检测：若没真正在播且未结束，cancel + 重新 speak 一次（自愈）；
  //   3) 若仍假死，最后再退回有道音频一次并复位按钮，杜绝永久静音。
  const playNative = (allowYoudaoFallback: boolean) => {
    if (gen !== generation) return

    const synth = window.speechSynthesis
    if (!synth || typeof synth.cancel !== 'function') {
      if (allowYoudaoFallback) youdao()
      else done()
      return
    }

    let settled = false
    const onSettle = () => {
      if (!settled) {
        settled = true
        done()
      }
    }

    const makeUtter = (): SpeechSynthesisUtterance => {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang === 'zh' ? 'zh-CN' : 'en-US'
      u.rate = rate
      u.pitch = 1
      const v = lang === 'zh' ? pickZhVoice() : pickVoice()
      if (v) u.voice = v
      u.onend = onSettle
      u.onerror = onSettle
      return u
    }

    // 仅在队列忙时清队（避免 cancel 轰炸）
    try {
      if (synth.speaking || synth.pending) synth.cancel()
    } catch {
      /* ignore */
    }
    try {
      if (synth.paused) synth.resume()
    } catch {
      /* ignore */
    }

    synth.speak(makeUtter())

    // 自愈：1.2s 后若既无 onend 也未在播（卡死），cancel + 重说一次
    setTimeout(() => {
      if (settled || gen !== generation) return
      if (!synth.speaking && !synth.pending) {
        try {
          synth.cancel()
        } catch {
          /* ignore */
        }
        try {
          synth.speak(makeUtter())
        } catch {
          /* ignore */
        }
        // 再给 1.2s 判定：重说仍未发声 → 彻底假死
        setTimeout(() => {
          if (settled || gen !== generation) return
          if (!synth.speaking && !synth.pending) {
            if (allowYoudaoFallback) youdao() // 最后退回有道音频（不再回 native，避免死循环）
            onSettle() // 始终复位按钮，避免 ⏸ 永久卡死
          }
        }, 1200)
      }
    }, 1200)
  }

  // 将 done 加入池中，供下次调用时通知
  pendingEnds.push(markDone)

  // ---- Level 0a: 中文走 Edge TTS（云端，仅 Microsoft Edge 可用）----
  // 仅在 Edge 浏览器生效；非 Edge（如 Chrome）直接走下方原有链路，无额外延迟。
  // 失败或代次变更则无缝回落到原有「有道 → WebSpeech」链路。
  if (lang === 'zh' && isEdgeTtsEnabled() && isEdgeBrowser()) {
    if (!isEdgeReady()) {
      // 模块尚未预热：先 youdao 即时出声（保证跟手），后台预热 Edge 供下次点击使用
      warmupEdgeTts()
      youdao(() => playNative(true))
      return
    }
    let settled = false
    const fallbackToLegacy = () => {
      if (!settled && gen === generation && !finished) {
        settled = true
        // 先停掉引擎可能仍在播放的音频，避免与兜底链路叠加出声
        if (currentAudio) {
          try {
            currentAudio.pause()
            currentAudio.removeAttribute('src')
            currentAudio.load()
          } catch {
            /* ignore */
          }
          currentAudio = null
        }
        youdao(() => playNative(true))
      }
    }
    // 整体超时兜底：模型/合成/播放任一环节挂起时，强制回落并结束动画，
    // 避免按钮动画永久停在「播放中」。
    const engineTimer = setTimeout(fallbackToLegacy, 30000)
    speakWithEdgeTts(text, {
      slow,
      guard: () => gen === generation,
      onAudio: (el) => {
        // 接管 Edge TTS 的 audio 元素，使其可由 cancelSpeech / 下次点击取消
        currentAudio = el
        el.addEventListener(
          'ended',
          () => {
            if (currentAudio === el) currentAudio = null
          },
          { once: true }
        )
      },
    })
      .then((ok) => {
        clearTimeout(engineTimer)
        if (ok) {
          // 播放成功（含音频已自然结束）即复位本按钮动画；
          // 即便用户中途点了其它的字使 gen 变化，本按钮也应结束，
          // 否则会出现「多个按钮动画同时停在播放中」。done 仅复位本按钮自身。
          if (!finished) {
            finished = true
            done()
          }
        } else {
          fallbackToLegacy()
        }
      })
      .catch(() => fallbackToLegacy())
    return
  }

  // ---- Level 0b: Kokoro 神经网络 TTS（WebGPU，仅英文首选）----
  // 仅当模型已就绪（已预热）时优先使用，避免首屏模型下载卡顿；
  // 失败或代次变更则无缝回落到原有「有道 → WebSpeech」链路。
  if (lang === 'en' && isKokoroEnabled() && isKokoroReady()) {
    let settled = false
    const fallbackToLegacy = () => {
      if (!settled && gen === generation && !finished) {
        settled = true
        // 先停掉引擎可能仍在播放的音频，避免与兜底链路叠加出声
        if (currentAudio) {
          try {
            currentAudio.pause()
            currentAudio.removeAttribute('src')
            currentAudio.load()
          } catch {
            /* ignore */
          }
          currentAudio = null
        }
        youdao(() => playNative(true))
      }
    }
    // 整体超时兜底：模型/生成/播放任一环节挂起时，强制回落并结束动画，
    // 避免按钮动画永久停在「播放中」。
    const engineTimer = setTimeout(fallbackToLegacy, 30000)
    speakWithKokoro(text, {
      slow,
      guard: () => gen === generation,
      onAudio: (el) => {
        // 接管 Kokoro 的 audio 元素，使其可由 cancelSpeech / 下次点击取消
        currentAudio = el
        el.addEventListener(
          'ended',
          () => {
            if (currentAudio === el) currentAudio = null
          },
          { once: true }
        )
      },
    })
      .then((ok) => {
        clearTimeout(engineTimer)
        if (ok) {
          // 播放成功（含音频已自然结束）即复位本按钮动画；
          // 即便用户中途点了其它的字使 gen 变化，本按钮也应结束，
          // 否则会出现「多个按钮动画同时停在播放中」。done 仅复位本按钮自身。
          if (!finished) {
            finished = true
            done()
          }
        } else {
          fallbackToLegacy()
        }
      })
      .catch(() => fallbackToLegacy())
    return
  }

  // ---- 未走 Kokoro：走原有链路，并在后台预热 Kokoro（仅英文）----
  if (lang === 'en') warmupKokoro()
  youdao(() => playNative(true))
}

/**
 * 立即停止任何正在进行的朗读。
 * 组件卸载（离开页面/切换路由）时调用，避免语音残留。
 */
export function cancelSpeech() {
  // 复位所有在播按钮的动画状态
  flushPendingEnds()
  // 终止有道音频
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.removeAttribute('src')
      currentAudio.load()
    } catch {
      /* ignore */
    }
    currentAudio = null
  }
  // 终止原生语音合成
  try {
    window.speechSynthesis?.cancel()
  } catch {
    /* ignore */
  }
  // 代次失效，任何旧回调都不再生效
  generation++
}
