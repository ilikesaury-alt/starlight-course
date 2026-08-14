// 基于「原文」生成闯关题：从真实句子里挖掉一个关键词，让孩子从选项中选词补全。
// Fly Guy 的绘本原文与 Starlight 的课本原文共用这套逻辑。

import type { QuizItem } from '@/components/QuizEngine'
import type { BookTextChapter } from '@/data/story-types'
import { BOOK_WORD_ZH, lookupZh, wordBase } from './bookDict'

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

/** 仅替换首个词边界命中的单词（保留原大小写与相邻标点），用于把原句中的目标词挖空。 */
function replaceFirstWord(text: string, base: string, sub: string): string {
  const re = new RegExp(`\\b${base}\\b`, 'i')
  return text.replace(re, sub)
}

/** 收集原文中所有「命中词典」的单词，用作填空题干扰项池。 */
function textWordPool(chapters: BookTextChapter[]): string[] {
  const set = new Set<string>()
  for (const ch of chapters) {
    for (const p of ch.pages) {
      for (const tk of p.text.split(/\s+/)) {
        const b = wordBase(tk)
        if (b.length >= 3 && (BOOK_WORD_ZH[b] || lookupZh(b))) set.add(b)
      }
    }
  }
  return [...set]
}

export interface BookQuizOptions {
  /** 本课/本书的重点词，优先被挖空 */
  vocab?: { en: string; zh?: string }[]
  /** 题目上限 */
  limit?: number
  /** 出处名称，用于解析文案 */
  source?: string
  emoji?: string
}

export function buildClozeQuiz(chapters: BookTextChapter[], opts: BookQuizOptions = {}): QuizItem[] {
  const { vocab = [], limit = 10, source = '原文', emoji = '📖' } = opts
  const vocabBases = new Set(vocab.map((w) => wordBase(w.en)))
  const pool = textWordPool(chapters)
  const items: QuizItem[] = []
  const used = new Set<string>()

  for (const ch of chapters) {
    for (const p of ch.pages) {
      if (items.length >= limit) break
      const toks = p.text.split(/\s+/).filter(Boolean)
      // 太短的句子挖空后没有语境，跳过
      if (toks.length < 3) continue
      const cands = toks.filter((tk) => {
        const b = wordBase(tk)
        return b.length >= 3 && (vocabBases.has(b) || BOOK_WORD_ZH[b] || lookupZh(b))
      })
      if (cands.length === 0) continue
      // 优先挖「本课重点词」，更能巩固学习目标
      const target = cands.find((tk) => vocabBases.has(wordBase(tk))) ?? cands[0]
      const tb = wordBase(target)
      if (used.has(tb)) continue
      used.add(tb)

      let distractPool = vocab.map((w) => w.en).filter((e) => wordBase(e) !== tb)
      if (distractPool.length < 3) distractPool = pool.filter((w) => w !== tb)
      if (distractPool.length < 3) continue
      const distract = shuffle(distractPool).slice(0, 3)
      const options = shuffle([target, ...distract])
      const answer = options.findIndex((o) => wordBase(o) === tb)
      if (answer < 0) continue

      items.push({
        q: '从下面选一个词，填到横线里',
        cloze: { prompt: replaceFirstWord(p.text, tb, '＿＿＿'), full: p.text },
        options,
        answer,
        explain: `${source}原文：“${p.text}” —— 横线处应填 “${target}”。`,
        speakText: tb,
        emoji,
      })
    }
    if (items.length >= limit) break
  }
  return items
}

/**
 * 听力题：听英文发音选中文意思(核心听说训练,排在闯关最前面)。
 * 自动朗读 prompt,选项为中文释义;干扰项取词形/词义均不同的词。
 */
export function buildListeningQuiz(
  words: { en: string; zh: string; emoji?: string }[],
  allPool: { en: string; zh: string; emoji?: string }[],
  limit = 4
): QuizItem[] {
  const questions: QuizItem[] = []
  const n = Math.min(words.length, limit)
  for (let i = 0; i < n; i++) {
    const target = words[i]
    // 干扰项：排除与目标词同词形或同中文的词,避免选项重复/混淆
    let distractPool = words.filter(
      (w) => w.en !== target.en && w.zh !== target.zh
    )
    if (distractPool.length < 3) {
      distractPool = allPool.filter(
        (w) => w.en !== target.en && w.zh !== target.zh
      )
    }
    if (distractPool.length < 3) continue
    const distract = shuffle(distractPool).slice(0, 3)
    const options = shuffle([target, ...distract])
    const answer = options.findIndex((o) => o.en === target.en)
    questions.push({
      q: '🔊 听发音，选出正确的意思',
      options: options.map((o) => o.zh),
      answer,
      explain: `${target.en} 意思是“${target.zh}”。`,
      speakText: target.en,
      emoji: target.emoji,
      listen: true,
    })
  }
  return questions
}

/** 词义选择题：哪个是「中文」？—— 原文题目不够时用来补足。 */
export function buildWordQuiz(
  words: { en: string; zh: string; emoji?: string }[],
  allPool: { en: string; zh: string; emoji?: string }[],
  limit = 12
): QuizItem[] {
  const questions: QuizItem[] = []
  const n = Math.min(words.length, limit)
  for (let i = 0; i < n; i++) {
    const target = words[i]
    let distractPool = words.filter((w) => w.en !== target.en)
    if (distractPool.length < 3) distractPool = allPool.filter((w) => w.en !== target.en)
    if (distractPool.length < 3) continue
    const distract = shuffle(distractPool).slice(0, 3)
    const options = shuffle([target, ...distract])
    const answer = options.findIndex((o) => o.en === target.en)
    questions.push({
      q: `哪个是“${target.zh}”？`,
      options: options.map((o) => o.en),
      answer,
      explain: `${target.en} 意思是“${target.zh}”。`,
      speakText: target.en,
      emoji: target.emoji,
    })
  }
  return questions
}
