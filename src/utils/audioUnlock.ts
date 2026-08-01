/**
 * 音频自动播放解锁。
 *
 * 浏览器（尤其 iOS Safari / Android Chrome）要求：带声音的媒体必须在用户手势中
 * 触发播放，异步 play()（例如 Kokoro/Edge TTS 合成完成后、或有道网络音频加载后）
 * 极容易被自动播放策略拦截 → 表现为「前几次能响、模型就绪后反而哑火」等间歇性静音。
 *
 * 本模块在页面首次用户交互（pointerdown/touchstart/keydown/click）时：
 *   1. 创建/恢复一个持久 AudioContext（标准解锁手段）；
 *   2. 播放一个静音 WAV 预热媒体管线（iOS 的 HTMLAudioElement 解锁技巧）。
 * 此后会话内的异步 play() 均不再被拦截。speakService 每次发音前也会再调用一次
 * unlockAudio() 作兜底，保证「第一次点击就出声」。
 */

let ctx: AudioContext | null = null

/** 创建/恢复持久 AudioContext（幂等，可在每次点击时调用） */
export function unlockAudio(): void {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    if (!ctx) ctx = new AC()
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
  } catch {
    /* ignore */
  }
}

/** 运行时生成一小段静音 WAV（10ms）的 blob URL，用于解锁媒体管线 */
function makeSilentWavUrl(): string {
  try {
    const sampleRate = 8000
    const frames = 80 // 10ms @ 8kHz
    const dataLen = frames * 2
    const buf = new ArrayBuffer(44 + dataLen)
    const v = new DataView(buf)
    const put = (off: number, s: string) => {
      for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i))
    }
    put(0, 'RIFF')
    v.setUint32(4, 36 + dataLen, true)
    put(8, 'WAVE')
    put(12, 'fmt ')
    v.setUint32(16, 16, true)
    v.setUint16(20, 1, true) // PCM
    v.setUint16(22, 1, true) // mono
    v.setUint32(24, sampleRate, true)
    v.setUint32(28, sampleRate * 2, true)
    v.setUint16(32, 2, true)
    v.setUint16(34, 16, true)
    put(36, 'data')
    v.setUint32(40, dataLen, true)
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }))
  } catch {
    return ''
  }
}

/** 在用户手势中同步播放一段静音音频，解锁媒体管线（静音/零音量，绝不发声） */
function touchSilentAudio(): void {
  const url = makeSilentWavUrl()
  if (!url) return
  try {
    const a = new Audio(url)
    a.volume = 0
    a.muted = true
    const cleanup = () => {
      try {
        URL.revokeObjectURL(url)
      } catch {
        /* ignore */
      }
    }
    a.addEventListener('ended', cleanup, { once: true })
    a.addEventListener('error', cleanup, { once: true })
    const p = a.play()
    if (p && typeof p.catch === 'function') p.catch(cleanup)
  } catch {
    try {
      URL.revokeObjectURL(url)
    } catch {
      /* ignore */
    }
  }
}

/** 挂载全局解锁监听：首次用户交互时解锁，之后自动移除（一次性） */
export function installAudioUnlock(): void {
  if (typeof window === 'undefined') return
  const events = ['pointerdown', 'touchstart', 'touchend', 'keydown', 'click']
  const handler = () => {
    unlockAudio()
    touchSilentAudio()
    for (const ev of events) window.removeEventListener(ev, handler)
  }
  for (const ev of events) window.addEventListener(ev, handler, { passive: true })
}
