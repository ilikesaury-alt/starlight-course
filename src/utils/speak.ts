/**
 * Universal pronunciation helper.
 *
 * Three-level fallback strategy:
 *   1. 有道词典 TTS API (audio element) — 可靠，作为主方案
 *   2. native window.speechSynthesis — 有道失败时兜底
 *   3. silent failure
 */

export interface SpeakOptions {
  /** slower rate for kids (0.6) */
  slow?: boolean
  /** override rate; defaults to 0.9 (or 0.6 when slow) */
  rate?: number
  onStart?: () => void
  onEnd?: () => void
}

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
    try { cb() } catch { /* ignore */ }
  }
}

export function speakText(text: string, opts: SpeakOptions = {}) {
  if (!text?.trim()) return

  const slow = !!opts.slow
  const rate = opts.rate ?? (slow ? 0.6 : 0.9)

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

  // 取消上一次播放
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
  try {
    window.speechSynthesis?.cancel()
  } catch {
    /* ignore */
  }

  // 递增代次，旧回调检测到代次不匹配时自动跳过
  const gen = ++generation

  // Level 1: 有道词典 TTS
  const youdao = (onComplete?: () => void) => {
    try {
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=1`
      const audio = new Audio(url)
      audio.playbackRate = slow ? 0.6 : 1
      currentAudio = audio

      let settled = false
      const onSuccess = () => {
        if (!settled && gen === generation) {
          settled = true
          if (currentAudio === audio) currentAudio = null
          done()
        }
      }
      const onFail = () => {
        if (!settled && gen === generation) {
          settled = true
          if (currentAudio === audio) currentAudio = null
          onComplete?.()
        }
      }

      audio.onended = onSuccess
      audio.onerror = onFail

      // 5s 超时：有道服务器挂起时降级到 speechSynthesis
      const timer = setTimeout(() => {
        if (!settled) {
          try {
            audio.pause()
            audio.removeAttribute('src')
            audio.load()
          } catch {
            /* ignore */
          }
          onFail()
        }
      }, 5000)

      audio.addEventListener('ended', () => clearTimeout(timer), { once: true })
      audio.addEventListener('error', () => clearTimeout(timer), { once: true })

      void audio.play().catch(() => {
        if (!settled) {
          onFail()
        }
      })
    } catch {
      onComplete?.()
    }
  }

  // Level 2: speechSynthesis 兜底
  const nativeSpeak = () => {
    if (gen !== generation) return

    const synth = window.speechSynthesis
    if (!synth || typeof synth.cancel !== 'function') {
      done()
      return
    }

    try {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'en-US'
      utter.rate = rate
      utter.pitch = 1
      let settled = false
      const settle = () => {
        if (!settled && gen === generation) {
          settled = true
          done()
        }
      }
      utter.onend = settle
      utter.onerror = settle
      synth.speak(utter)
      // Chrome/iOS 可能静默吞掉 speak()，800ms 内无回调则放弃
      setTimeout(() => { if (!settled) settle() }, 800)
    } catch {
      done()
    }
  }

  // 将 done 加入池中，供下次调用时通知
  pendingEnds.push(markDone)

  // 先尝试有道，失败后降级到 speechSynthesis
  youdao(() => nativeSpeak())
}
