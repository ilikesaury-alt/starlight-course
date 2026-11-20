// ============================================================
//  高频词（sight words）词表 —— Dolch 词表选词，按本土孩子难度重排三级
//  ------------------------------------------------------------
//  为什么单独一份、且**不进 phonics**：
//    the / said / was 这类词不规则，拼读规则套上去必然读错。
//    它们只能靠「整体词形识别」自动化（orthographic mapping），
//    训练方式和规则词相反 —— 要限时、要整体闪现，不能逐字母拼。
//    和 src/data/decoding.ts（规则词解码）构成阅读的两条腿。
//
//  分级：start / next / up 三档，每档 26 词，共 78 词。
//  选词来自 Dolch pre-primer / primer / grade 1，但按"国内三年级
//  上册实际会碰到"的顺序重排（例如 of/from/been 这类后期功能词
//  放到 up 级），不照搬 Dolch 原封分级。
//
//  ⚠️ 维护约定：
//    1. 只收"看一眼就该认得"的功能词 / 极短实词，不收需要拼读的长词；
//    2. zh 用孩子听得懂的口语，不写词典释义；
//    3. 不给 emoji —— 给了等于用图报答案，整体认读就失效了。
// ============================================================

export type SightLevel = 'start' | 'next' | 'up'

export interface SightWord {
  en: string
  zh: string
}

export interface SightLevelMeta {
  key: SightLevel
  zh: string
  en: string
  desc: string
  color: string
  colorSoft: string
}

export const SIGHT_LEVELS: SightLevelMeta[] = [
  {
    key: 'start',
    zh: '起步',
    en: 'Start',
    desc: '最短、最常见的 26 个词',
    color: '#0891b2',
    colorSoft: '#cffafe',
  },
  {
    key: 'next',
    zh: '进阶',
    en: 'Next',
    desc: '句子里天天见的 26 个词',
    color: '#7c3aed',
    colorSoft: '#ede9fe',
  },
  {
    key: 'up',
    zh: '提高',
    en: 'Up',
    desc: '读小故事会碰到的 26 个词',
    color: '#db2777',
    colorSoft: '#fce7f3',
  },
]

export const SIGHT_WORDS: Record<SightLevel, SightWord[]> = {
  start: [
    { en: 'the', zh: '这个；那个' },
    { en: 'a', zh: '一个' },
    { en: 'and', zh: '和；并且' },
    { en: 'to', zh: '到；向' },
    { en: 'I', zh: '我' },
    { en: 'in', zh: '在…里面' },
    { en: 'is', zh: '是' },
    { en: 'it', zh: '它' },
    { en: 'you', zh: '你；你们' },
    { en: 'we', zh: '我们' },
    { en: 'on', zh: '在…上面' },
    { en: 'at', zh: '在（某处、某时）' },
    { en: 'of', zh: '…的' },
    { en: 'my', zh: '我的' },
    { en: 'me', zh: '我（被说的那个我）' },
    { en: 'no', zh: '不；没有' },
    { en: 'so', zh: '这么；所以' },
    { en: 'up', zh: '向上' },
    { en: 'go', zh: '去' },
    { en: 'see', zh: '看见' },
    { en: 'can', zh: '能；会' },
    { en: 'get', zh: '得到' },
    { en: 'little', zh: '小的' },
    { en: 'down', zh: '向下' },
    { en: 'big', zh: '大的' },
    { en: 'come', zh: '来' },
  ],
  next: [
    { en: 'he', zh: '他' },
    { en: 'she', zh: '她' },
    { en: 'was', zh: '是（以前是）' },
    { en: 'are', zh: '是' },
    { en: 'for', zh: '为了；给' },
    { en: 'this', zh: '这个' },
    { en: 'that', zh: '那个' },
    { en: 'with', zh: '和…一起' },
    { en: 'they', zh: '他们' },
    { en: 'have', zh: '有' },
    { en: 'but', zh: '但是' },
    { en: 'not', zh: '不' },
    { en: 'what', zh: '什么' },
    { en: 'all', zh: '全部' },
    { en: 'one', zh: '一' },
    { en: 'two', zh: '二' },
    { en: 'three', zh: '三' },
    { en: 'look', zh: '看' },
    { en: 'said', zh: '说（say 的过去式）' },
    { en: 'where', zh: '在哪里' },
    { en: 'here', zh: '这里' },
    { en: 'there', zh: '那里' },
    { en: 'out', zh: '出去' },
    { en: 'now', zh: '现在' },
    { en: 'your', zh: '你的' },
    { en: 'good', zh: '好的' },
  ],
  up: [
    { en: 'from', zh: '从' },
    { en: 'be', zh: '是（原形）' },
    { en: 'been', zh: '曾经是' },
    { en: 'which', zh: '哪一个' },
    { en: 'would', zh: '将会；愿意' },
    { en: 'who', zh: '谁' },
    { en: 'will', zh: '将要' },
    { en: 'more', zh: '更多' },
    { en: 'if', zh: '如果' },
    { en: 'had', zh: '有（have 的过去式）' },
    { en: 'her', zh: '她的' },
    { en: 'him', zh: '他（宾格）' },
    { en: 'his', zh: '他的' },
    { en: 'how', zh: '怎样' },
    { en: 'when', zh: '什么时候' },
    { en: 'then', zh: '然后' },
    { en: 'them', zh: '他们（宾格）' },
    { en: 'these', zh: '这些' },
    { en: 'into', zh: '进入' },
    { en: 'could', zh: '能够（can 的过去式）' },
    { en: 'every', zh: '每一个' },
    { en: 'over', zh: '在…上方；结束' },
    { en: 'just', zh: '刚刚；仅仅' },
    { en: 'old', zh: '老的；旧的' },
    { en: 'some', zh: '一些' },
    { en: 'thank', zh: '感谢' },
  ],
}

/** 取某级词表（返回原引用，调用方自己 shuffle 时记得 spread） */
export function sightWordsOf(level: SightLevel): SightWord[] {
  return SIGHT_WORDS[level] ?? []
}

/** 全部高频词的英文集合（去重后），供测试查重/排版校验 */
export function allSightWords(): string[] {
  return [...new Set(Object.values(SIGHT_WORDS).flat().map((w) => w.en.toLowerCase()))]
}

/** 两串之间的编辑距离（Levenshtein），只用于挑形近词，不追求性能 */
function editDistance(a: string, b: string): number {
  const m = a.length
  const n = b.length
  let prev = Array.from({ length: n + 1 }, (_, i) => i)
  let cur = new Array<number>(n + 1)
  for (let i = 1; i <= m; i++) {
    cur[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
    }
    ;[prev, cur] = [cur, prev]
  }
  return prev[n]
}

/**
 * 形近词干扰项：从**全部三级**里挑和 target 长得最像的 n 个。
 *   the → he / she（只差一两个字母，最容易被孩子看串）
 *
 * ⚠️ 用全级而不是本级：`the` 本级里没有比 `he` 更近的词，
 *    只在 start 里找会挑出一堆 unrelated 的词。
 * ⚠️ 排除长度差 > 1：a / little 这种放一起不是"形近"，是"送分"。
 */
export function lookalikes(target: string, n = 2): string[] {
  const t = target.toLowerCase()
  const pool = allSightWords().filter(
    (w) => w !== t && Math.abs(w.length - t.length) <= 1,
  )
  return pool
    .map((w) => ({ w, d: editDistance(t, w) }))
    .filter((x) => x.d >= 1 && x.d <= 2)
    .sort((a, b) => a.d - b.d || a.w.localeCompare(b.w))
    .slice(0, n)
    .map((x) => x.w)
}
