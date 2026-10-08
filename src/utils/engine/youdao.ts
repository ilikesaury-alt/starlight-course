/**
 * 有道词典 + 百度翻译两台网络 TTS 的编排入口（英文 type=1，中文 type=2）。
 *
 * 实测行为（dict.youdao.com）：
 *   - 单词、短语：稳定返回真实音频；
 *   - 整句：约一半返回 HTTP 500（`returned null audio`）；
 *   - 中文：几乎所有「成功」响应都是**同一段 48ms 空白音频**（不同文本返回的字节完全相同），
 *     即「HTTP 200 但根本没有声音」。
 *
 * 实测行为（fanyi.baidu.com/gettts，见 `baidu.ts`）：
 *   - 整句 8/8、中文 3/3 都是真实音频 —— 正好补上有道「句子必挂」的短板；
 *   - 但带非百度 Referer 会被反爬拦成 0 字节，依赖 `index.html` 的 no-referrer meta。
 *
 * 故本编排的策略（有界、绝不递归）：
 *   0. 整段请求**按引擎顺序**各试一次：整句先百度（有道整句几乎必 500，
 *      百度一次就给自然整句），单词/短语先有道（130ms 更跟手）；中文恒先百度；
 *   1. 整段全失败才**分片**：先按标点切，切不开（`I can eat.` 这类无逗号短句）
 *      再**按词**切成 2 词小片 —— 「只有一片」绝不等于放弃；
 *   2. 每片按同一顺序试两台引擎，重试之间退避（500 里相当一部分是瞬时限流）；
 *      某片重试耗尽 → 「本片 + 剩余」整体交给原生合成器（原生无长度上限），
 *      绝不二次截断；
 *   3. 连续**整次调用**都拿不到有效音频时**熔断有道**一段时间，之后直接跳过有道
 *      （百度、原生仍在），避免每句都白等一串必然失败的请求（按调用计数，
 *      一句里的多个分片失败不会把熔断一次打满）。
 *
 * ⚠️ 本函数可能「借道」其他引擎出声，返回结果带 `via`，诊断面板据此记对引擎名。
 */

import { PlayOutcome } from './types'
import { playUrl } from './playUrl'
import { speakWithWebSpeech } from './webSpeech'
import { traceNote } from './engineTrace'
import { playBaiduAudio, preferBaiduFirst } from './baidu'

export interface YoudaoOptions {
  /** 播放速率（慢速 0.6 / 正常 1） */
  rate?: number
  /** 代次守卫 */
  guard?: () => boolean
  /** 创建出 audio 元素时回调，便于上层接管取消逻辑 */
  onAudio?: (el: HTMLAudioElement) => void
  /** 加载超时（毫秒）；整段用较短的值好早点转入分片，分片用较长值 */
  loadTimeout?: number
}

export function playYoudaoAudio(
  text: string,
  lang: 'en' | 'zh',
  opts: YoudaoOptions = {},
): Promise<PlayOutcome> {
  const type = lang === 'zh' ? 2 : 1
  const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=${type}`
  return playUrl(url, {
    guard: opts.guard,
    onAudio: opts.onAudio,
    playbackRate: opts.rate ?? 1,
    loadTimeout: opts.loadTimeout ?? 8000,
    hardCapMs: 120000,
    // 空白音频的诊断要记在有道名下
    engineName: 'youdao',
  })
}

/**
 * 整段请求的加载超时。
 *
 * 实测（安卓 5G 慢网）：单词 1.6s 就响，整句却要撞满 8s 超时。
 * 整段失败后还有分片这招可打，所以整段不必死等 —— 早点判失败早点分片，
 * 整体等待反而更短。
 */
const WHOLE_LOAD_TIMEOUT = 5000

/** 分片的最大字符数：短于此的片段有道基本都能给出真实音频 */
const CHUNK_MAX = 26

/**
 * 「标点切不开」时按词再切一刀的目标：≤2 词 / ≤14 字符。
 *
 * 实测 dict.youdao.com（2026-10）整句基本必 500：`I can eat.` / `This is my head`
 * / `Touch your toes and nose` 连续请求全部 HTTP 500，而 2 词片段成功率高得多
 * （同批整句 4/20 命中，切到 2~3 词片段后 17/25）。所以「只有一片」不能等于放弃。
 */
const WORD_CHUNK_MAX_CHARS = 14
const WORD_CHUNK_MAX_WORDS = 2

/** 分片重试之间的退避：有道的 500 相当一部分是瞬时限流，紧挨着重试大概率还是 500 */
const RETRY_BACKOFF_MS = 300

/**
 * 超长片段按 max 字符硬切：**优先在词边界断开**。
 *
 * 原实现按固定下标切，英文句子会被劈成 `…and th` + `e small dog.` ——
 * 两个片段既念不顺，也更容易撞上有道的 500。没有空格（中文）时退回按字符切。
 */
function hardSplit(t: string, max: number): string[] {
  if (t.length <= max) return [t]
  const out: string[] = []
  let rest = t
  while (rest.length > max) {
    const at = rest.lastIndexOf(' ', max)
    const cut = at > 0 ? at : max
    out.push(rest.slice(0, cut).trim())
    rest = rest.slice(cut).trim()
  }
  if (rest) out.push(rest)
  return out
}

/**
 * 按标点断句，过长句再按 max 字符硬切；返回若干短片段。
 *
 * 标点表同时覆盖中英文（`。！？!?；;，,、` + 换行），英文句子也能按逗号分片。
 */
export function chunkByPunct(text: string, max = CHUNK_MAX): string[] {
  const raw = text.match(/[^。！？!?；;，,、\n]+[。！？!?；;，,、]?|\n+/g) ?? [text]
  const out: string[] = []
  for (const s of raw) {
    const t = s.trim()
    if (!t) continue
    out.push(...hardSplit(t, max))
  }
  return out.length ? out : [text]
}

/**
 * 按词切成 ≤maxWords 词 / ≤maxChars 字符的小片（英文专用，中文没有空格会原样返回）。
 *
 * 只在「标点切完仍只有一片」的最后机会调用 —— 那条路径原先等于直接放弃有道，
 * 表现就是「单词有声、整句静音」：单词命中率高，整句几乎必 500。
 */
export function splitByWords(
  text: string,
  maxChars = WORD_CHUNK_MAX_CHARS,
  maxWords = WORD_CHUNK_MAX_WORDS,
): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length <= 1) return [text]
  const out: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    const tooLong = next.length > maxChars
    const tooManyWords = cur ? cur.split(' ').length >= maxWords : false
    if (cur && (tooLong || tooManyWords)) {
      out.push(cur)
      cur = w
    } else {
      cur = next
    }
  }
  if (cur) out.push(cur)
  return out.length > 1 ? out : [text]
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// ---------- 熔断：连续拿不到有效音频时暂时跳过有道 ----------
/** 连续多少次**整次调用**都拿不到有效音频后熔断（按调用计数，不按分片计数） */
const BREAKER_THRESHOLD = 3
/** 熔断持续时长（毫秒） */
const BREAKER_COOLDOWN_MS = 60_000
let strikes = 0
let breakerUntil = 0

/** 两台网络云 TTS 的引擎名（编排顺序由 `preferBaiduFirst` 决定） */
type CloudEngine = 'youdao' | 'baidu'

/**
 * 试一次「整段」请求。
 *
 * 整段用较短的超时（`WHOLE_LOAD_TIMEOUT`）：慢网实测「单词 1.6s 响、整句撞满 8s 超时」，
 * 早点判失败才轮得到下一台引擎 / 分片。
 */
function playWhole(
  eng: CloudEngine,
  text: string,
  lang: 'en' | 'zh',
  rate: number,
  guard: () => boolean,
  onAudio?: (el: HTMLAudioElement) => void,
): Promise<PlayOutcome> {
  return eng === 'youdao'
    ? playYoudaoAudio(text, lang, { rate, guard, onAudio, loadTimeout: WHOLE_LOAD_TIMEOUT })
    : playBaiduAudio(text, lang, { rate, guard, onAudio, loadTimeout: WHOLE_LOAD_TIMEOUT })
}

/** 当前是否处于熔断期（应跳过**有道**，但百度 / 原生合成器仍可用） */
export function isYoudaoBypassed(): boolean {
  return Date.now() < breakerUntil
}

function onStrike(text: string): void {
  strikes += 1
  if (strikes < BREAKER_THRESHOLD) return
  breakerUntil = Date.now() + BREAKER_COOLDOWN_MS
  strikes = 0
  traceNote(
    'youdao',
    `连续 ${BREAKER_THRESHOLD} 次拿不到有效音频，${BREAKER_COOLDOWN_MS / 1000} 秒内跳过有道（改走百度 / 原生合成器）`,
    text,
  )
}

function onHit(): void {
  strikes = 0
}

/**
 * 云端健壮播放入口：整段（按序双引擎）→ 分片（同序双引擎）→ 原生合成器兜底。
 *
 * 无论中间经历多少次降级，本函数**一定**返回一个结果，绝不递归、绝不抛错。
 * 借道别的引擎出声时返回结果带 `via`（百度 / 原生合成器），诊断面板据此记对引擎名；
 * 省略 `via` 即代表本级（有道）自己出的声。
 * @param rate 播放速率（慢速 0.6 / 正常 1）
 */
export async function playYoudaoResilient(
  text: string,
  lang: 'en' | 'zh',
  rate: number,
  guard: () => boolean,
  onAudio?: (el: HTMLAudioElement) => void,
): Promise<PlayOutcome> {
  if (!guard()) return { status: 'aborted' }

  // 整句先百度、单词先有道（中文恒先百度）；整段与分片共用同一顺序
  const order: CloudEngine[] = preferBaiduFirst(text, lang) ? ['baidu', 'youdao'] : ['youdao', 'baidu']
  /** 有道熔断期只跳过有道，百度照常（否则断的是一台引擎，却把整级云 TTS 判死） */
  const youdaoAllowed = () => !isYoudaoBypassed()
  /** 成功出口：借道时带上 via，走本级有道则省略（面板按链路步骤名记） */
  const ok = (via?: CloudEngine | 'webspeech'): PlayOutcome =>
    via && via !== 'youdao' ? { status: 'success', via } : { status: 'success' }

  // ---- 1) 整段：按序各试一次（慢网实测整句极易撞满超时，所以用较短超时）----
  let lastStatus: 'failed' | 'blocked' = 'failed'
  let triedWhole = false
  for (const eng of order) {
    if (eng === 'youdao' && !youdaoAllowed()) continue
    triedWhole = true
    const out = await playWhole(eng, text, lang, rate, guard, onAudio)
    if (out.status === 'success') {
      if (eng === 'youdao') onHit()
      return ok(eng)
    }
    if (out.status === 'aborted') return out
    // 最后一次尝试的状态决定「要不要让上层解锁音频后重试」
    lastStatus = out.status === 'blocked' ? 'blocked' : 'failed'
  }
  if (!triedWhole) return { status: 'failed' }

  // ---- 2) 分片：先按标点切，切不开再按词切 ----
  // 关键回归：从前「只有一片」就等于放弃，而整句请求几乎必 500 ——
  // 于是单词有声、整句全静音，只剩那台设备的原生合成器可指望。
  let chunks = chunkByPunct(text, CHUNK_MAX)
  if (chunks.length <= 1) {
    chunks = splitByWords(text, WORD_CHUNK_MAX_CHARS, WORD_CHUNK_MAX_WORDS)
  }
  if (chunks.length <= 1) {
    // 真的拆不开（单个单词/无空格中文）：分片没有意义，如实返回失败让上层降级
    onStrike(text)
    return { status: lastStatus }
  }
  traceNote(
    order[0],
    `整段发音失败，改为分片播放（${chunks.length} 片）`,
    text,
  )

  // 本次调用只要有一片是**有道**出过真声音，就不记熔断（有道本身是通的）
  let anyYoudaoHit = false
  let lastVia: CloudEngine | 'webspeech' = order[0]
  for (let i = 0; i < chunks.length; i++) {
    if (!guard()) return { status: 'aborted' }

    const piece = chunks[i]
    let hit: CloudEngine | null = null
    for (const eng of order) {
      if (eng === 'youdao' && !youdaoAllowed()) continue
      // 分片很短：有道重试 3 次（500 里相当一部分是瞬时限流，退避后再试）；
      // 百度重试 2 次（它整段都挂的话，分片多半也白搭，别拖太久）
      const attempts = eng === 'youdao' ? 3 : 2
      for (let a = 0; a < attempts && !hit; a++) {
        if (!guard()) return { status: 'aborted' }
        if (a > 0) await delay(RETRY_BACKOFF_MS * a)
        const out =
          eng === 'youdao'
            ? await playYoudaoAudio(piece, lang, { rate, guard, onAudio })
            : await playBaiduAudio(piece, lang, { rate, guard, onAudio })
        if (out.status === 'success') {
          hit = eng
          if (eng === 'youdao') anyYoudaoHit = true
          break
        }
        if (out.status === 'aborted') return { status: 'aborted' }
        // blocked（自动播放被拦截）也走同一退避：下一轮 a>0 会先等一会再试
      }
      if (hit) break
    }

    if (!hit) {
      // 重试耗尽：把「本片 + 剩余」整体交给原生合成器兜底（原生无长度上限）
      await speakWithWebSpeech(chunks.slice(i).join(' '), { lang, rate, guard, lastResort: true })
      if (anyYoudaoHit) onHit()
      else onStrike(text)
      return { status: 'success', via: 'webspeech' }
    }
    lastVia = hit
  }
  // 全部分片都出声 → 本次云端确实可用，清零熔断计数
  if (anyYoudaoHit) onHit()
  return ok(lastVia)
}
