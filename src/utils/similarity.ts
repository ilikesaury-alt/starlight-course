// 跟读相似度评分：比较「孩子说出的整句」与「原句」。
// 面向儿童口语，刻意宽松：冠词容错、缩写展开、词内拼写模糊、多余虚词忽略。
// 只用于判断「像不像 / 过了没有」，分数不直接展示给孩子（见 SentenceReader）。

const ARTICLES = new Set(['a', 'an', 'the'])
/** 口语里常被省略的虚词：识别结果多出来不该扣分 */
const FILLERS = new Set(['um', 'uh', 'er', 'ah', 'the', 'a'])

const CONTRACTIONS: Record<string, string> = {
  "i'm": 'i am',
  "you're": 'you are',
  "he's": 'he is',
  "she's": 'she is',
  "it's": 'it is',
  "we're": 'we are',
  "they're": 'they are',
  "that's": 'that is',
  "what's": 'what is',
  "let's": 'let us',
  "don't": 'do not',
  "doesn't": 'does not',
  "didn't": 'did did not',
  "can't": 'can not',
  "won't": 'will not',
  "isn't": 'is not',
  "aren't": 'are not',
  "i'll": 'i will',
  "i've": 'i have',
}

/** 可选同义容错：儿童换个说法也算对 */
const SYNONYMS: Record<string, string[]> = {
  toy: ['thing', 'play'],
  toys: ['things'],
  want: ['like', 'need'],
  have: ['has', 'got'],
  here: ['this'],
  that: ['this'],
}

/** 归一化：小写、去首尾标点（保留句内 a/apostrophe） */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 归一化 + 缩写展开 + 去冠词 → 词元数组 */
export function tokenize(text: string): string[] {
  return tokenizeWithForms(text).map((t) => t.token)
}

export interface Token {
  /** 归一化后的比对用词元（无冠词、缩写已展开） */
  token: string
  /** 原句里对应的原始词形（提示孩子时用，更贴近他看到的句子） */
  raw: string
}

/** 与 tokenize 同步，但额外保留每个词元的原文词形。
 *  缩写展开会让一个原词产生多个词元（如 i'm → i am），它们共用同一个 raw。 */
export function tokenizeWithForms(text: string): Token[] {
  const out: Token[] = []
  for (const raw of normalize(text).split(' ')) {
    if (!raw) continue
    const expanded = CONTRACTIONS[raw] ?? raw
    for (const w of expanded.split(' ')) {
      if (!w) continue
      if (ARTICLES.has(w)) continue // 冠词容错：a/an/the 直接不计
      out.push({ token: w, raw })
    }
  }
  return out
}

/** 编辑距离（滚动数组实现，句子很短，无需优化） */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  let prev = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
    prev = cur
  }
  return prev[n]
}

/** 两个词的相似度 0..1：完全相等 1；词内模糊按 1 - 编辑距离归一化 */
function wordSimilarity(ref: string, hyp: string): number {
  if (ref === hyp) return 1
  const maxLen = Math.max(ref.length, hyp.length)
  if (maxLen === 0) return 1
  const dist = levenshtein(ref, hyp)
  return Math.max(0, 1 - dist / maxLen)
}

/** 一个参考词是否被某个识别词覆盖：同词 / 同义 / 编辑距离 ≥ 0.7 */
function matches(ref: string, hyp: string, fuzzy: number): boolean {
  if (ref === hyp) return true
  const syns = SYNONYMS[ref]
  if (syns && syns.includes(hyp)) return true
  if (SYNONYMS[hyp]?.includes(ref)) return true
  // 短词(<4 字母)不启用拼写模糊，避免 "a" 类误判
  if (ref.length < 4 || hyp.length < 4) return false
  return wordSimilarity(ref, hyp) >= fuzzy
}

export interface SimilarityResult {
  /** 0..1 综合相似度 */
  score: number
  /** 原句里没被说到的词（用于高亮提示，仍保留冠词原文） */
  missing: string[]
  /** 识别结果里多余的有效词（忽略冠词与口头禅） */
  extra: string[]
}

export interface ScoreOptions {
  /** 达标阈值，默认 0.6 */
  threshold?: number
  /** 词内模糊阈值，默认 0.7 */
  fuzzy?: number
}

/**
 * 句级评分：词级覆盖为主导（占 85%），词内模糊匹配按相似度打折（占 15%）。
 * 返回 score / matched / missing / extra。
 */
export function scoreSentence(
  ref: string,
  hyp: string,
  opts: ScoreOptions = {}
): SimilarityResult & { passed: boolean } {
  const threshold = opts.threshold ?? 0.6
  const fuzzy = opts.fuzzy ?? 0.7

  const refItems = tokenizeWithForms(ref)
  const hypTokens = tokenize(hyp)

  const missing: string[] = []
  const usedHyp = new Set<number>()
  let coverage = 0
  let fuzzyCredit = 0

  refItems.forEach((item) => {
    const rt = item.token
    let hit = -1
    for (let j = 0; j < hypTokens.length; j++) {
      if (usedHyp.has(j)) continue
      if (rt === hypTokens[j]) { hit = j; break }
    }
    if (hit >= 0) {
      // 完全命中也给满分信用，否则「一句不差」只能拿 0.85
      fuzzyCredit += 1
    } else {
      for (let j = 0; j < hypTokens.length; j++) {
        if (usedHyp.has(j)) continue
        const sim = wordSimilarity(rt, hypTokens[j])
        if (sim >= fuzzy) { hit = j; fuzzyCredit += sim; break }
        if (matches(rt, hypTokens[j], fuzzy)) { hit = j; fuzzyCredit += 0.8; break }
      }
    }
    if (hit >= 0) {
      usedHyp.add(hit)
      coverage += 1
    } else {
      // missing 用原句词形，提示语更贴近孩子看到的原句
      missing.push(item.raw)
    }
  })

  const total = refItems.length
  const extra = hypTokens.filter((t, j) => !usedHyp.has(j) && !FILLERS.has(t))

  // 覆盖率主导：说对大部分词就算过（先求整句再求准确）
  const coverageRate = total === 0 ? 0 : coverage / total
  const fuzzyRate = coverage === 0 ? 0 : fuzzyCredit / total
  const extraPenalty = total === 0 ? 0 : Math.min(0.2, (extra.length / total) * 0.2)
  const rawScore = Math.max(0, Math.min(1, coverageRate * 0.85 + fuzzyRate * 0.15 - extraPenalty))

  // 短句容错不足：漏掉任何实义词都不算过关（如「I have a」没说 doll），
  // 阈值只用于覆盖度评分，缺词是硬门槛 —— 跟读的目标是把整句说出来。
  const passed = missing.length === 0 && rawScore >= threshold
  const score = passed ? Math.max(rawScore, threshold) : rawScore

  return { score, missing, extra, passed }
}
