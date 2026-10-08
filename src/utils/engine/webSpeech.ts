/**
 * Web Speech API 兜底引擎（原生 speechSynthesis）。
 *
 * 本模块专门处理 Chrome 著名的「假死」问题：
 * 连续 speak/cancel 数次后，合成器进入既不触发 onend/onerror、speaking/pending 也
 * 卡在 false 的死状态，表现为「点几个字就彻底静音」。
 *
 * 对策（有界、带冷却，绝不无限自愈）：
 *   1. 绝不 cancel 轰炸：仅在确有发声/排队时才 cancel（新会话切换时由 speakService 处理）；
 *   2. 静默检测：speak 后 1.2s 内既未 onstart 也未在播 → 判定疑似假死；
 *   3. 有界自愈：cancel + resume + 重新 speak，最多 2 次；仍假死则标记 30s 冷却期，
 *      期间直接判定失败，交由上层回退，避免每次点击都在死引擎上浪费 2.5s；
 *   4. 整体 deadline：任何情况下 Promise 都会在 budgetMs 内结束，绝不卡死按钮动画。
 *
 * 注意：speechSynthesis 本身不受自动播放策略限制（Chrome），因此在「有道被拦截」时
 * 通常是有效的兜底；iOS 上它同样静默无回调，此时靠 deadline 兜底复位。
 */

import { PlayOutcome } from './types'
import { traceNote } from './engineTrace'

// ---------- 嗓音预载（Chrome 首次 getVoices() 常为空，需等 voiceschanged）----------
let voices: SpeechSynthesisVoice[] = []
/** 嗓音列表是否曾经成功加载过（空列表 ≠ 没有嗓音，可能只是还没加载完） */
let voicesLoaded = false

function loadVoices() {
  try {
    const vs = window.speechSynthesis?.getVoices?.() ?? []
    if (vs.length) {
      voices = vs
      voicesLoaded = true
    }
  } catch {
    /* ignore */
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices()
  try {
    window.speechSynthesis.onvoiceschanged = loadVoices
  } catch {
    /* ignore */
  }
}

function pickVoice(kind: 'en' | 'zh'): SpeechSynthesisVoice | undefined {
  return candidateVoices(kind)[0]
}

/**
 * 给可用嗓音排序：**本地嗓音优先**，其次语言精确匹配。
 *
 * 关键现场：Chrome 会把远端 Google 嗓音（localService=false）一起列进来，
 * 国内网络下对它 speak() 往往既不 onstart 也不 onerror —— 引擎看起来「在播」，
 * 实际一个字都没出来，整句静音。所以永远先试本地嗓音；本级无回调触发自愈时
 * 会换下一个候选（见 runWebSpeech 的 voiceIdx），不会反复卡在同一个坏嗓音上。
 */
function candidateVoices(kind: 'en' | 'zh'): SpeechSynthesisVoice[] {
  if (!voices.length) return []
  const exact = kind === 'zh' ? 'zh-CN' : 'en-US'
  const prefix = kind === 'zh' ? 'zh' : 'en'
  const ranked: { score: number; v: SpeechSynthesisVoice }[] = []
  for (const v of voices) {
    const lang = (v.lang ?? '').toLowerCase()
    let score = -1
    if (v.lang === exact) score = 2
    else if (lang.startsWith(prefix)) score = 1
    if (score < 0) continue
    // 本地引擎不依赖网络，国内环境下可靠性压倒「语言更精确的远端嗓音」
    if (v.localService) score += 2
    ranked.push({ score, v })
  }
  ranked.sort((a, b) => b.score - a.score)
  return ranked.map((r) => r.v)
}

/**
 * 嗓音列表尚未加载完时，最多等 VOICE_WAIT_MS 让 voiceschanged 补上。
 *
 * 重要：首次进页面时 getVoices() 经常是空数组，**不能**据此判定「系统没语音包」，
 * 否则会把正常设备也判失败。故只在「已成功加载过、且确实没有匹配嗓音」时才算缺失。
 *
 * 取值 2000ms：安卓 Chrome 首次调用会同步拉起系统 TTS 引擎，
 * voiceschanged 常在 1~3s 后才触发（实测安卓机型偏慢）。原 800ms 太短，
 * 会把「还没加载完」误判成「系统没语音包」。
 */
const VOICE_WAIT_MS = 2000

function waitVoices(): Promise<void> {
  if (voicesLoaded || typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve()
  }
  return new Promise<void>((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(timer)
      try {
        window.speechSynthesis.removeEventListener('voiceschanged', onChange)
      } catch {
        /* ignore */
      }
      resolve()
    }
    const onChange = () => {
      loadVoices()
      if (voicesLoaded) finish()
    }
    const timer = setTimeout(finish, VOICE_WAIT_MS)
    try {
      window.speechSynthesis.addEventListener('voiceschanged', onChange)
    } catch {
      /* ignore */
    }
  })
}

// ---------- 引擎状态 ----------
// 假死冷却期：到该时间点之前不再尝试原生合成器，避免在死引擎上反复空转
let nativeDeadUntil = 0

export interface WebSpeechOptions {
  lang?: 'en' | 'zh'
  rate?: number
  /** 代次守卫；返回 false 时放弃本次播放（aborted） */
  guard?: () => boolean
  /** 整体预算（毫秒）：任何情况下都会在该时长内结束 */
  budgetMs?: number
  /**
   * 「兜底链最后一级」标记。
   *
   * Kokoro / 有道都拿不到时，原生合成器是**唯一**还能出声的引擎。此时若沿用
   * 假死冷却期直接判 failed，就会出现「前一句还好好的，这一句之后整段静默」——
   * 冷却期内每次点击都直接失败，而此时已经没有下一级可降级了。
   * 故最后一级必须无视冷却、每次都真试一次（有界，绝不死循环）。
   */
  lastResort?: boolean
}

const DEFAULT_BUDGET_MS = 20000
/**
 * 假死冷却期。
 *
 * 原为 30s —— 那意味着引擎一旦假死，接下来半分钟内**所有**发音都被硬判失败；
 * 在「有道大面积 500 + 无 Kokoro」的设备上（多数手机都是），这就是持续性静音。
 * 冷却的本意只是「别在死引擎上反复空转」，不该成为静音的理由，故压到 3s。
 */
const DEAD_COOLDOWN_MS = 3000
const MAX_RECOVERIES = 2
/** 已确认系统缺对应语音包时的压缩预算：早点失败，别让用户干等 */
const MISS_VOICE_BUDGET_MS = 6000

/**
 * 先探一次本地嗓音，再决定本级的预算。
 *
 * 已确认「系统没有对应语音包」时，Chrome/Edge 会转去连 Google 在线 TTS ——
 * 国内不通就静默无回调（既不 onstart 也不 onerror），白等满额预算毫无意义。
 * 故此时把预算压到 MISS_VOICE_BUDGET_MS，并打日志 + 记进诊断流，让失败快速暴露。
 * 反之，「嗓音列表还没加载完」（首次进页面 getVoices() 常为空）不算缺失，
 * 等 VOICE_WAIT_MS 后按正常预算走，避免误杀正常设备。
 */
async function resolveBudgetMs(text: string, opts: WebSpeechOptions): Promise<number> {
  const base = opts.budgetMs ?? Math.max(DEFAULT_BUDGET_MS, Math.min(120000, text.length * 500 + 10000))
  await waitVoices()
  const kind = opts.lang === 'zh' ? 'zh' : 'en'
  if (pickVoice(kind)) return base
  const reason = voicesLoaded
    ? `系统没有 ${kind} 语音包（已加载 ${voices.length} 个嗓音，可用: ${voices
        .map((v) => v.lang)
        .slice(0, 6)
        .join('/')}）`
    : '嗓音列表未就绪（voiceschanged 未触发）'
  console.warn(`[webSpeech] ${reason}`)
  traceNote('webspeech', reason, text)
  return voicesLoaded ? Math.min(base, MISS_VOICE_BUDGET_MS) : base
}

export async function speakWithWebSpeech(
  text: string,
  opts: WebSpeechOptions = {},
): Promise<PlayOutcome> {
  const startedAt = Date.now()
  const budgetMs = await resolveBudgetMs(text, opts)
  return runWebSpeech(text, opts, budgetMs, startedAt)
}

/**
 * 「引擎压根不存在」时，最多等这么久再判失败。
 *
 * 现场（安卓自带浏览器）面板显示 webspeech ❌ 失败 4ms —— 4ms 意味着
 * 它在第一次访问 window.speechSynthesis 时就放弃，而此时引擎可能只是
 * 尚未初始化完成。给它一个有界的等待窗口，避免「白点一次」。
 */
const ENGINE_WAIT_MS = 2500

function runWebSpeech(
  text: string,
  opts: WebSpeechOptions,
  budgetMs: number,
  startedAt: number = Date.now(),
): Promise<PlayOutcome> {
  return new Promise<PlayOutcome>((resolve) => {
    const synth =
      typeof window !== 'undefined'
        ? ((window.speechSynthesis as SpeechSynthesis | undefined) ?? null)
        : null
    if (!synth || typeof synth.speak !== 'function' || typeof synth.cancel !== 'function') {
      // 兜底链最后一级遇到「引擎不存在」：不能 4ms 就放弃。
      // 部分安卓浏览器首次进页面时 speechSynthesis 尚未就绪（甚至整个对象缺失），
      // 稍后就绪 —— 现场截图里正是「❌ 失败 4ms」，等于白点一次。
      // 这里有界地等一小会儿再判失败（不阻塞 UI：有自己的超时兜底）。
      const waited = Date.now() - startedAt
      if (waited < ENGINE_WAIT_MS) {
        setTimeout(() => {
          void runWebSpeech(text, opts, budgetMs, startedAt).then(resolve)
        }, 400)
        return
      }
      traceNote('webspeech', '此浏览器没有可用的 speechSynthesis（设备未装系统 TTS 引擎）', text)
      resolve({ status: 'failed' })
      return
    }
    // 冷却期只用于「省掉在死引擎上的空转」。作为兜底链最后一级时必须无视它：
    // 此时没有下一级，硬判 failed 就等于彻底静音。
    if (!opts.lastResort && Date.now() < nativeDeadUntil) {
      resolve({ status: 'failed' })
      return
    }

    let settled = false
    let spoken = false
    let recovering = false
    let attempts = 0
    const settle = (o: PlayOutcome) => {
      if (settled) return
      settled = true
      resolve(o)
    }
    const guardOk = () => (opts.guard ? opts.guard() : true)

    if (!guardOk()) {
      settle({ status: 'aborted' })
      return
    }

    // 嗓音已在 resolveBudgetMs 里等过 voiceschanged；这里按优先级取候选，
    // 自愈重试时换下一个 —— 避免一直卡在同一个「远端/坏」嗓音上反复空转
    const candidates = candidateVoices(opts.lang === 'zh' ? 'zh' : 'en')
    let voiceIdx = 0

    const makeUtter = (): SpeechSynthesisUtterance => {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = opts.lang === 'zh' ? 'zh-CN' : 'en-US'
      u.rate = opts.rate ?? 0.9
      u.pitch = 1
      const v = candidates[voiceIdx]
      if (v) u.voice = v
      return u
    }

    // 预算在探测嗓音后已定（见 resolveBudgetMs），deadline 从此刻起算
    const deadline = Date.now() + budgetMs

    // 给单个 utterance 挂上统一的事件处理
    const attach = (u: SpeechSynthesisUtterance): SpeechSynthesisUtterance => {
      u.onstart = () => {
        spoken = true
      }
      u.onend = () => settle({ status: 'success' })
      u.onerror = () => {
        if (spoken) {
          // 已播过（如被新会话 cancel 打断）视为成功
          settle({ status: 'success' })
        } else {
          // 未开始即报错：可能是瞬时故障，交给 check 走有界自愈
          window.setTimeout(check, 200)
        }
      }
      return u
    }

    const check = () => {
      if (settled) return
      if (!guardOk()) {
        settle({ status: 'aborted' })
        return
      }
      if (Date.now() > deadline) {
        // 即便音频仍在播，也复位（软兜底语义：不取消音频，让其自然结束）
        settle({ status: 'success' })
        return
      }
      if (spoken) {
        // 已开播，只是 onend 偶发不触发：继续等待，直到 deadline 复位
        window.setTimeout(check, 200)
        return
      }
      if (synth.speaking || synth.pending) {
        // 引擎确实在排队/发声，只是 onstart 尚未触发：继续等待
        window.setTimeout(check, 200)
        return
      }
      // 什么都没发生 → 疑似假死。有界自愈。
      if (recovering) return // 自愈尝试进行中，交由自愈后的 check 决定
      attempts++
      if (attempts > MAX_RECOVERIES) {
        nativeDeadUntil = Date.now() + DEAD_COOLDOWN_MS
        settle({ status: 'failed' })
        return
      }
      recovering = true
      try {
        synth.cancel()
      } catch {
        /* ignore */
      }
      // 沉默即换嗓音：上一个候选没出声，下一个很可能就是本地可用的那个
      if (candidates.length > 1) voiceIdx = (voiceIdx + 1) % candidates.length
      window.setTimeout(() => {
        recovering = false
        if (settled) return
        if (!guardOk()) {
          settle({ status: 'aborted' })
          return
        }
        try {
          if (synth.paused) synth.resume()
        } catch {
          /* ignore */
        }
        try {
          synth.speak(attach(makeUtter()))
        } catch {
          settle({ status: 'failed' })
          return
        }
        window.setTimeout(check, 1200)
      }, 120)
    }

    // 干净起步：仅当上一会话把引擎留在 busy 状态时才 cancel（避免 cancel 轰炸）
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

    try {
      synth.speak(attach(makeUtter()))
    } catch {
      settle({ status: 'failed' })
      return
    }

    window.setTimeout(check, 1200)
  })
}
