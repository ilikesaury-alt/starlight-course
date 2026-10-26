// ============================================================
//  自然拼读（Phonics）辅助：音素 → 字母 的轻量桥接
//  ------------------------------------------------------------
//  定位：孩子两年听力启蒙，但"音→形"的反向编码（拼写）缺练。
//  本文件不追求语言学精确，只做"把声音段对应到字母段"的可视化拆分，
//  配合听写页的「音素格子 / 金字塔拼写」提示，补上自然拼读这座桥。
//
//  ⭐ 拆分口径对齐《字母积木》(Alphablocks / BBC CBeebies) 的教学分级，
//     让孩子在动画里建立的概念，在 app 里能对得上号：
//
//       L1-2  单字母    → 一个字母一个音          cat   → c / a / t
//       L3    字母小队  → 两三个字母合成一个音    ship  → sh / i / p
//                                                 eight → eigh / t
//       L4    手拉手    → 辅音簇，各发各的音      stand → st / a / nd
//       L5    魔法E     → e 是不发音的"魔法积木"，自己没声音，
//                          但让前面的元音发长音    cake  → c / a / k / e(魔法E)
//       特别篇 双写      → ll / ss / ff 两个一样的字母合成一个音
//                                                 ball  → b / a / ll
//
//  与旧版（2026-10 前）的四处关键差异 —— 旧口径和动画是**对不上**的：
//
//   1. 魔法E 的 e 曾经被"吞进前一格"（cake → c/a/ke）。动画里 E 是**一块独立积木**，
//      飞过去"魔法"前面的元音，孩子要看到 e 单独出现才知道它在干嘛。
//      旧版还自相矛盾：cake 吞 e、blue 却留 e。
//   2. 双写辅音（ll/ss/tt/ff…）被拆成两格。旧版注释写的是"按一个音处理"，
//      代码却给了两格 —— 注释与实现不一致。动画 S1E17「Hill」专门教 LL/SS/FF。
//   3. 字母小队清单不全：旧版只有 15 个（th sh ch ph wh ck ng qu ee oo oa ai ea ou ow），
//      动画教的 ar/or/er/ir/ur/ay/ie/ue/ui/au/aw/ew/oy/igh 全缺，
//      于是 father → f/a/th/e/r、bird → b/i/r/d。
//   4. 完全没有"手拉手"概念：stand → s/t/a/n/d，看不出 st、nd 是手拉手的一组。
//
//  实现策略：**规则优先 + 例外兜底**。
//    规则覆盖上面五类；英语不规则词（welcome / picture / orange / umbrella…）
//    规则判不了，走 OVERRIDES 人工校对表，并在测试里钉住。
//    不引入发音词典（成本高），定位仍是"教学提示"，不声称严格音素学。
// ============================================================

/** 拆分片段的类别 —— 与动画的教学概念一一对应 */
export type SegmentKind =
  /** L1-2 单字母：一个字母一个音 */
  | 'letter'
  /** L3 字母小队：两个/三个字母合成一个音 */
  | 'team'
  /** L4 手拉手：辅音簇，每个字母各发各的音 */
  | 'blend'
  /** 特别篇 双写：两个一样的字母合成一个音（ll / ss / ff…） */
  | 'double'
  /** L5 被魔法E 变成长音的元音 */
  | 'magic-vowel'
  /** L5 魔法E 本身：单独成格，自己不发音 */
  | 'magic-e'
  /** 不发音的字母（know 的 k、write 的 w、the 的 e…） */
  | 'silent'

export interface PhonicsSegment {
  /** 字母片段。**所有片段拼起来 === 原词的字母序列**（e2e 与人工校对都依赖这条） */
  text: string
  kind: SegmentKind
  /** 给孩子看的中文标签（= 动画里的概念名） */
  label: string
  /** 这个片段占几个音（魔法E / 不发音字母 = 0） */
  sounds: number
}

const VOWELS = 'aeiou'
const isVowel = (c: string) => VOWELS.includes(c)

/** 类别 → 中文标签（与动画说法对齐） */
const KIND_LABEL: Record<SegmentKind, string> = {
  letter: '字母',
  team: '字母小队',
  blend: '手拉手',
  double: '双写',
  'magic-vowel': '长音元音',
  'magic-e': '魔法E',
  silent: '不发音',
}

// ---- L3 字母小队：合成**一个**音 ----
/** 四个字母的队伍（eigh 是唯一常见的四字母队） */
const TEAMS4 = ['eigh']
/** 三个字母的队伍 */
const TEAMS3 = ['igh', 'air', 'ear', 'ore', 'our', 'ure', 'eau', 'tch']
/** 两个字母的队伍 */
const TEAMS2 = [
  // 辅音小队
  'ch', 'sh', 'th', 'ng', 'ph', 'wh', 'ck', 'qu',
  // 元音小队
  'ai', 'ay', 'ea', 'ee', 'ey', 'ie', 'oa', 'oo', 'ue', 'ui', 'ow', 'oi', 'oy', 'au', 'aw', 'ew',
  // r 控制元音（动画当"字母小队"教）
  'ar', 'er', 'ir', 'or', 'ur',
  // ou：four / house / our 都是 ou + r
  'ou',
]

// ---- L4 手拉手：辅音簇，**每个字母各发各的音** ----
const BLENDS3 = ['str', 'spr', 'spl', 'scr', 'squ', 'thr']
const BLENDS2 = [
  'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr',
  'sc', 'sk', 'sm', 'sn', 'sp', 'st', 'sw', 'tw',
  // 词尾手拉手
  'nd', 'nk', 'mp', 'ft', 'pt', 'ct', 'ld', 'lf', 'lt', 'nt',
]

// ---- 特别篇 双写：两个一样的字母合成一个音 ----
const DOUBLES2 = ['ll', 'ss', 'tt', 'ff', 'pp', 'nn', 'mm', 'rr', 'gg', 'bb', 'dd', 'zz', 'cc']

/**
 * 词尾固定成一小队的：结尾的 e 属于队伍，不可能是魔法E。
 *   nge → /ndʒ/（orange）  ere → /ɪə/ /eə/（here/there/where）  ye → /aɪ/（bye）
 */
const FINAL_TEAMS = ['nge', 'ere', 'ye']

/**
 * 结尾是「元音 + e」但元音发**短音**的词：e 不发音，也就没魔法。
 * come / have / love / one …
 *
 * 为什么用**词表**而不是「后缀规则」：后缀匹配会误伤。
 *   "stone" 结尾也是 "one"，但 o 是长音 /oʊ/（stone ≠ st+un+短音 one）；
 *   "whose" 结尾也是 "ose"，但 o 是长音 /uː/。
 * 这类词规则判不了，只能人工列出来；列错的风险由测试钉住。
 */
const SHORT_VOWEL_E = new Set([
  'one', 'come', 'some', 'none', 'done', 'gone', 'become',
  'someone', 'anyone', 'everyone',
  'love', 'have', 'give', 'live', 'move', 'above',
])

/** 开头不发音的字母对 */
const SILENT_START: [string, string][] = [
  ['kn', 'k'], // know
  ['wr', 'w'], // write
]

/**
 * 人工校对表：规则判不了的不规则词。
 * 键 = 小写单词，值 = 片段（text, kind）序列。
 * 每一条都要求 text 拼起来 === 单词本身（测试会钉住）。
 */
const OVERRIDES: Record<string, [string, SegmentKind][]> = {
  // welcome = /ˈwelkəm/：结尾 e 不发音，也**没有**把 o 变长音
  welcome: [['w', 'letter'], ['e', 'letter'], ['l', 'letter'], ['c', 'letter'], ['o', 'letter'], ['m', 'letter'], ['e', 'silent']],
  // picture = /ˈpɪktʃə(r)/：ur 是小队，结尾 e 不发音
  picture: [['p', 'letter'], ['i', 'letter'], ['c', 'letter'], ['t', 'letter'], ['ur', 'team'], ['e', 'silent']],
  // people = /ˈpiːpəl/：eo 是小队（/iː/），结尾 e 不发音
  people: [['p', 'letter'], ['eo', 'team'], ['pl', 'blend'], ['e', 'silent']],
  // umbrella = /ʌmˈbrelə/：e 不发音，ll 是一个音
  umbrella: [['u', 'letter'], ['m', 'letter'], ['br', 'blend'], ['e', 'silent'], ['ll', 'double'], ['a', 'letter']],
  // clothes = /kləʊðz/：o 被"隔着 th 的 e"变长音（split digraph）
  clothes: [['cl', 'blend'], ['o', 'magic-vowel'], ['th', 'team'], ['e', 'magic-e'], ['s', 'letter']],
  // their = /ðeə/：air 去掉 a 后是 ir，e 不发音
  their: [['th', 'team'], ['e', 'silent'], ['ir', 'team']],
  // every- 开头：ev 的第二个 e 不发音（every / everyone / everybody / everywhere）
  // ⚠️ 规则会把 every 切错成 ev + er(字母小队)，所以这四个必须人工定
  every: [['e', 'letter'], ['v', 'letter'], ['e', 'silent'], ['r', 'letter'], ['y', 'letter']],
  everyone: [['e', 'letter'], ['v', 'letter'], ['e', 'silent'], ['r', 'letter'], ['y', 'letter'], ['o', 'letter'], ['n', 'letter'], ['e', 'silent']],
  everybody: [['e', 'letter'], ['v', 'letter'], ['e', 'silent'], ['r', 'letter'], ['y', 'letter'], ['b', 'letter'], ['o', 'letter'], ['d', 'letter'], ['y', 'letter']],
  everywhere: [['e', 'letter'], ['v', 'letter'], ['e', 'silent'], ['r', 'letter'], ['y', 'letter'], ['wh', 'team'], ['ere', 'team']],
}

function makeSegment(text: string, kind: SegmentKind): PhonicsSegment {
  const sounds = kind === 'magic-e' || kind === 'silent' ? 0 : kind === 'blend' ? text.length : 1
  return { text, kind, label: KIND_LABEL[kind], sounds }
}

/** 结尾是否构成固定小队（'nge' / 'ere' / 'ye'） */
function matchFinalTeam(w: string): string | null {
  for (const suffix of FINAL_TEAMS) {
    if (w.length > suffix.length && w.endsWith(suffix)) return suffix
  }
  return null
}

/**
 * 判定结尾的 e 是不是「魔法E」，返回**被变成长音的元音下标**；不是则返回 -1。
 *
 * 三种词形都要照顾到：
 *   cake  C-V-C-e → 元音在下标 n-3
 *   write C-C-V-e → 元音在下标 n-3（w-r-i-t-e 里 i 在 n-3）
 *   blue  V-e    → 元音在下标 n-2（ue 是"u + 魔法E"）
 * 排除的情况：
 *   - 前面还有元音 → 是元音小队（ou_e / ea_e），不是魔法E（house / please）
 *   - 元音+r 是 r 控制队伍 → 队伍 + 不发音的 e（share / there）
 *   - 词尾是固定小队 → 早在 matchFinalTeam 拦掉
 */
function magicEVowelIndex(w: string): number {
  const n = w.length
  if (n < 3) return -1
  if (w[n - 1] !== 'e') return -1

  const before = w[n - 2]
  if (isVowel(before)) {
    // V-e 结尾：ee / oe / ie / ye 是字母小队；ue 可能是"u + 魔法E"（blue / true）
    if (before === 'u' && !isVowel(w[n - 3])) return n - 2
    return -1
  }

  if (!isVowel(w[n - 3])) return -1
  // 前面还有元音 → 元音小队（ou_e / ea_e），不是魔法E
  if (n >= 4 && isVowel(w[n - 4])) return -1
  // r 控制元音（ar/er/ir/or/ur）→ 队伍 + 不发音的 e
  if (['ar', 'er', 'ir', 'or', 'ur'].includes(w.slice(n - 3, n - 1))) return -1
  return n - 3
}

/**
 * 核心扫描：把一段字母切成片段。
 * @param core     要扫描的字母段
 * @param offset   core[0] 在**原词**中的下标（silent-start 递归时会偏移）
 * @param magicIdx 被魔法E 变长音的元音在**原词**中的下标（没有则 -1）
 */
function scanCore(core: string, offset: number, magicIdx: number): PhonicsSegment[] {
  const out: PhonicsSegment[] = []

  // 开头不发音的字母对：know / write
  if (out.length === 0) {
    for (const [pair, silentChar] of SILENT_START) {
      if (core.startsWith(pair)) {
        out.push(makeSegment(silentChar, 'silent'))
        out.push(...scanCore(core.slice(1), offset + 1, magicIdx))
        return out
      }
    }
  }

  let i = 0
  while (i < core.length) {
    const segStart = offset + i

    const t4 = core.slice(i, i + 4)
    if (TEAMS4.includes(t4)) {
      out.push(makeSegment(t4, 'team'))
      i += 4
      continue
    }

    const t3 = core.slice(i, i + 3)
    if (TEAMS3.includes(t3)) {
      out.push(makeSegment(t3, 'team'))
      i += 3
      continue
    }

    const b3 = core.slice(i, i + 3)
    if (BLENDS3.includes(b3)) {
      out.push(makeSegment(b3, 'blend'))
      i += 3
      continue
    }

    const t2 = core.slice(i, i + 2)
    if (TEAMS2.includes(t2)) {
      out.push(makeSegment(t2, 'team'))
      i += 2
      continue
    }

    const b2 = core.slice(i, i + 2)
    // 'sch' 里的 ch 是小队（school），不能被 'sc' 手拉手吃掉
    if (!(b2 === 'sc' && core[i + 2] === 'h') && BLENDS2.includes(b2)) {
      out.push(makeSegment(b2, 'blend'))
      i += 2
      continue
    }

    const d2 = core.slice(i, i + 2)
    if (DOUBLES2.includes(d2)) {
      out.push(makeSegment(d2, 'double'))
      i += 2
      continue
    }

    // 单字母
    let kind: SegmentKind = 'letter'
    if (segStart === magicIdx) kind = 'magic-vowel'
    out.push(makeSegment(core[i], kind))
    i += 1
  }
  return out
}

/**
 * 把单词切成「音素格子」对应的字母片段（Elkonin 音盒可视化）。
 * 口径见文件头：L1-2 单字母 / L3 字母小队 / L4 手拉手 / 双写 / L5 魔法E。
 *
 * 多词词条（'pencil case' / 'next to'）按**空格分段**后再逐词切，
 * 避免跨词边界误判（'next to' 的 't t' 会被错当成双写 tt）。
 */
export function phonemeSegments(word: string): PhonicsSegment[] {
  const raw = word.toLowerCase().replace(/[^a-z ]/g, '').trim()
  if (!raw) return []

  if (raw.includes(' ')) {
    // 多词：逐词切，词与词之间不产生任何片段
    const out: PhonicsSegment[] = []
    for (const part of raw.split(/\s+/)) {
      if (!part) continue
      out.push(...phonemeSegments(part))
    }
    return out
  }

  const w = raw
  if (!w) return []

  const override = OVERRIDES[w]
  if (override) {
    return override.map(([text, kind]) => makeSegment(text, kind))
  }

  // 结尾是固定小队（nge / ere / ye）：e 属于队伍，不是魔法E
  const finalTeam = matchFinalTeam(w)
  if (finalTeam) {
    const core = w.slice(0, w.length - finalTeam.length)
    return [...scanCore(core, 0, -1), makeSegment(finalTeam, 'team')]
  }

  // 结尾是「元音 + e」但元音发短音（come / have / one / anyone …）：e 不发音
  if (w.endsWith('e') && SHORT_VOWEL_E.has(w)) {
    const segs = scanCore(w, 0, -1)
    return markTrailingSilentE(segs)
  }

  // 结尾的 e 是魔法E：e 单独成格，前面的元音标成长音
  if (w.endsWith('e')) {
    const magicIdx = magicEVowelIndex(w)
    if (magicIdx >= 0) {
      const core = w.slice(0, -1)
      return [...scanCore(core, 0, magicIdx), makeSegment('e', 'magic-e')]
    }
    // 不发声的 e（the / she / me …）
    const segs = scanCore(w, 0, -1)
    return markTrailingSilentE(segs)
  }

  return scanCore(w, 0, -1)
}

/**
 * 把末尾那个单独的 'e' 标成「不发音」。
 * 注意要的是**单独一格**的 e：see 的 'ee' 是字母小队（/iː/），不能标成不发音。
 */
function markTrailingSilentE(segs: PhonicsSegment[]): PhonicsSegment[] {
  const last = segs[segs.length - 1]
  if (last && last.text === 'e' && last.kind === 'letter') {
    return [...segs.slice(0, -1), makeSegment('e', 'silent')]
  }
  return segs
}

/** 只要字母片段（兼容旧调用方）。拼接结果 === 原词字母序列。 */
export function phonemeBoxes(word: string): string[] {
  return phonemeSegments(word).map((s) => s.text)
}

/** 金字塔拼写阶梯：c / ca / cat（逐步展开一阶，作为记不住拼写时的提示梯）。 */
export function spellingPyramid(word: string): string[] {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return []
  const steps: string[] = []
  for (let n = 1; n <= w.length; n++) steps.push(w.slice(0, n))
  return steps
}

/** 本词是否适合做「音素格子」练习（短词优先，建立信心）。 */
export function isShortWord(word: string, max = 4): boolean {
  const w = word.replace(/[^a-z]/gi, '')
  return w.length <= max
}

/** 给一个不会拼的词的「拼读提示阶梯」文本，供反馈区展示。 */
export function phonicsHint(word: string): string {
  const segs = phonemeSegments(word)
  if (segs.length === 0) return ''
  return segs.map((s) => s.text.toUpperCase()).join(' · ')
}
