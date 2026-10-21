// ============================================================
//  听写练习（Dictation）纯逻辑工具
//  ------------------------------------------------------------
//  只做数据加工，不碰 React / store / 发音，便于单测：
//    - buildDictationPool：把若干单元/剧本的词汇成练习池（按小写去重 + 长度过滤）
//    - normalizeDictationWord：错题本词 → 练习词（补齐 emoji）
//    - pickDistractors / buildChoices：三选一模式的干扰项与选项
//    - shuffle：可注入随机源的洗牌（测试可复现）
//
//  干扰项设计要点（对应「像但不等于」）：
//    三选一若给出毫不相干的词，孩子一眼就能排除，练不到"音→形"。
//    故干扰项从「字母池」合成，并与原词保持相近长度与相似首/尾，制造真实的混淆。
// ============================================================

export type LengthFilter = 'all' | 'short' | 'long'

export interface DictationWord {
  en: string
  zh: string
  emoji?: string
  /** 来源（单元/剧本名），回灌错题本时写入 from */
  from?: string
}

/** 供注入的随机源（0..1），默认 Math.random；测试传固定种子以复现。 */
export type Rng = () => number

const clean = (s: string) => s.replace(/[^a-zA-Z]/g, '')

/** 洗牌（Fisher–Yates），不修改原数组。 */
export function shuffle<T>(list: readonly T[], rng: Rng = Math.random): T[] {
  const out = list.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** 长度过滤：short = <=4 字母，long = >4 字母。 */
function matchLength(word: string, filter: LengthFilter): boolean {
  const len = clean(word).length
  if (len === 0) return false
  if (filter === 'short') return len <= 4
  if (filter === 'long') return len > 4
  return true
}

/**
 * 汇成练习池：按 itemId 取词 → 小写去重 → 长度过滤。
 * getWords 由调用方注入（实际传 eng3aMeta.getWords），此处不直接依赖数据层。
 */
export function buildDictationPool(
  itemIds: readonly string[],
  getWords: (itemId: string) => readonly DictationWord[],
  filter: LengthFilter = 'all',
): DictationWord[] {
  const seen = new Set<string>()
  const out: DictationWord[] = []
  for (const id of itemIds) {
    for (const w of getWords(id)) {
      const en = (w.en ?? '').trim()
      const key = en.toLowerCase()
      if (!key || seen.has(key)) continue
      if (!matchLength(en, filter)) continue
      seen.add(key)
      out.push({ ...w, en })
    }
  }
  return out
}

/** 错题本词（可能缺 emoji）→ 练习词。 */
export function normalizeDictationWord(w: {
  en: string
  zh?: string
  emoji?: string
  from?: string
}): DictationWord {
  return {
    en: (w.en ?? '').trim(),
    zh: w.zh ?? '',
    emoji: w.emoji || '🔤',
    from: w.from,
  }
}

/**
 * 生成与正确词「像但不等于」的干扰项。
 *
 * 关键设计（对抗审查修过）：早期用随机字母串生成干扰项，结果是 `xqz` 这种
 * 一眼可排除的乱码——三选一就失去训练价值（孩子不需要会拼也能选对）。
 * 现在改为对原词做**小变形**，让干扰项真的「像这个词但拼错了」：
 *   - 换一个元音（cake → ceke / ciku）
 *   - 换一个辅音（ship → shib）
 *   - 双写/拆单一个字母（book → bok / boook）
 *   - 相邻字母换位（this → thsi）
 *   - 魔术 e 漏掉或多一个 e（cake → cak / cakee）
 * 这类干扰项才真正考「音→形」的细节，而不是考「哪个长得像英文单词」。
 */
export function pickDistractors(word: string, count: number, rng: Rng = Math.random): string[] {
  const base = clean(word).toLowerCase()
  if (!base || count <= 0) return []

  const VOWELS = 'aeiou'
  const CONSONANTS = 'bcdfghjklmnpqrstvwxyz'
  const mutants = new Set<string>()

  const mutate = (fn: (chars: string[]) => string[] | null) => {
    const chars = base.split('')
    const out = fn(chars)
    if (!out) return
    const s = out.join('')
    if (s && s !== base && clean(s) === s) mutants.add(s)
  }

  // 1) 换一个元音（只改一处，保持长度与轮廓）
  for (let i = 0; i < base.length; i++) {
    if (!VOWELS.includes(base[i])) continue
    const others = VOWELS.replace(base[i], '')
    mutate((c) => {
      c[i] = others[Math.floor(rng() * others.length)]
      return c
    })
  }

  // 2) 换一个辅音（首字母不动，避免变成完全另一个词的首音）
  for (let i = 1; i < base.length; i++) {
    if (!CONSONANTS.includes(base[i])) continue
    const others = CONSONANTS.replace(base[i], '')
    mutate((c) => {
      c[i] = others[Math.floor(rng() * others.length)]
      return c
    })
  }

  // 3) 双写某个字母（book → boook）
  for (let i = 0; i < base.length; i++) {
    mutate((c) => {
      c.splice(i, 0, c[i])
      return c
    })
  }

  // 4) 删掉一个字母（book → bok）；至少保留 2 个字母
  if (base.length > 2) {
    for (let i = 0; i < base.length; i++) {
      mutate((c) => {
        c.splice(i, 1)
        return c
      })
    }
  }

  // 5) 相邻换位（this → thsi）
  for (let i = 0; i < base.length - 1; i++) {
    if (base[i] === base[i + 1]) continue
    mutate((c) => {
      ;[c[i], c[i + 1]] = [c[i + 1], c[i]]
      return c
    })
  }

  // 6) 魔术 e：末尾 e 增删（cake → cak / cakee）
  if (base.endsWith('e')) mutate((c) => c.slice(0, -1))
  else if (base.length > 2) mutate((c) => [...c, 'e'])

  const pool = shuffle([...mutants], rng)
  return pool.slice(0, count)
}

export interface Choice {
  text: string
  correct: boolean
}

/** 三选一：正确答案 + (count-1) 个干扰项，一起洗牌。 */
export function buildChoices(word: string, count = 3, rng: Rng = Math.random): Choice[] {
  const correct = (word ?? '').trim()
  if (!correct) return []
  const distractors = pickDistractors(correct, Math.max(0, count - 1), rng)
  const all: Choice[] = [
    { text: correct, correct: true },
    ...distractors.map((text) => ({ text, correct: false })),
  ]
  return shuffle(all, rng)
}
