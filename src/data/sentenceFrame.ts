// 句子框架卡（C）：从「整句输出」倒推的可填空句型。
// 首批试点 Unit 4（玩具单元）3–4 个框架，验证后再批量补 12 单元。
// 卡片播种后与单词卡共用同一个复习池（SrsCard.kind='sentence' 区分）。

import { getModule } from './starlight'
import type { Word } from './starlight'

export interface SentenceFrameBlank {
  /** 该空的正确候选（本课词表内），其余为干扰项 */
  options: string[]
  /** 正确答案在 options 中的下标 */
  answer: number
}

export interface SentenceFrame {
  /** 唯一 key */
  id: string
  /** 句型骨架，空位用 ___ 表示 */
  pattern: string
  blanks: SentenceFrameBlank[]
  /** 中文提示 */
  zh: string
  /** 给孩子的操作提示 */
  hint?: string
  /** 所属单元 slug */
  unitSlug: string
  /** 所属课号 */
  lessonId: number
}

/** 句型里的空位数 */
export function countBlanks(pattern: string): number {
  return pattern.split('___').length - 1
}

/** 稳定散列：同一 pattern 永远得到同一 key（句子卡 en 用它，避免与单词卡撞键） */
export function hashPattern(pattern: string): string {
  let h = 2166136261
  for (let i = 0; i < pattern.length; i++) {
    h ^= pattern.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(36)
}

/** 句子卡的 key（与单词卡 en 空间隔离） */
export function frameCardKey(f: SentenceFrame): string {
  return `frame:${hashPattern(f.pattern)}`
}

/** 用某组选择填空，得到完整句子（供跟读评分）
 *  pattern 被 ___ 切成 seg0 ___ seg1 ___ seg2，空内填词应插在「前一段之后、后一段之前」，
 *  即 seg0 + word0 + seg1 + word1 + seg2（不是 seg0 + seg1 + word…）。 */
export function fillFrame(f: SentenceFrame, picks: number[]): string {
  return f.pattern
    .split('___')
    .map((seg, idx) => {
      if (idx === 0) return seg
      const blank = f.blanks[idx - 1]
      if (!blank) return `${seg}___`
      const pick = picks[idx - 1] ?? blank.answer
      return `${blank.options[pick] ?? blank.options[blank.answer]}${seg}`
    })
    .join('')
}

export const STARLIGHT_FRAMES: SentenceFrame[] = [
  {
    id: 'u4l1-own',
    pattern: 'I have a ___.',
    blanks: [{ options: ['doll', 'blocks', 'puzzle', 'bus'], answer: 0 }],
    zh: '我有一个洋娃娃。',
    hint: '先听示范，再说出整句',
    unitSlug: 'toys',
    lessonId: 1,
  },
  {
    id: 'u4l2-want',
    pattern: 'I want a ___.',
    blanks: [{ options: ['car', 'train', 'spoon', 'book'], answer: 0 }],
    zh: '我想要一辆小汽车。',
    hint: '换一个玩具，句子还一样',
    unitSlug: 'toys',
    lessonId: 2,
  },
  {
    id: 'u4l2-which',
    pattern: 'Which toy do you want?',
    blanks: [],
    zh: '你想要哪个玩具？',
    hint: '整句问答，不用填空',
    unitSlug: 'toys',
    lessonId: 2,
  },
  {
    id: 'u4l4-this-is',
    pattern: 'This is a ___.',
    blanks: [{ options: ['princess', 'robot', 'doll', 'teacher'], answer: 0 }],
    zh: '这是位公主。',
    hint: '介绍你最喜欢的角色',
    unitSlug: 'toys',
    lessonId: 4,
  },
]

/** 取某课的全部框架卡 */
export function framesOfLesson(unitSlug: string, lessonId: number): SentenceFrame[] {
  return STARLIGHT_FRAMES.filter((f) => f.unitSlug === unitSlug && f.lessonId === lessonId)
}

/** 取某单元全部框架卡 */
export function framesOfUnit(unitSlug: string): SentenceFrame[] {
  return STARLIGHT_FRAMES.filter((f) => f.unitSlug === unitSlug)
}

/**
 * 填空候选池：本课 words.en + 同单元现场拓展词。
 * 拓展词来自 store 传入的 Record（保持 data 层无 store 依赖）。
 */
export function buildBlankCandidates(
  unitSlug: string,
  lessonId: number,
  extensions: Record<string, Word[]> = {}
): string[] {
  const mod = getModule(unitSlug)
  if (!mod) return []
  const lesson = mod.lessons.find((l) => l.id === lessonId)
  const out: string[] = []
  const push = (en: string) => {
    const k = en.trim().toLowerCase()
    if (k && !out.some((x) => x.toLowerCase() === k)) out.push(en.trim())
  }
  for (const w of lesson?.words ?? []) push(w.en)
  for (const key of Object.keys(extensions)) {
    // key 形如 `${unitId}-${lessonId}`，只取本单元的拓展词
    if (!key.startsWith(`${mod.id}-`)) continue
    for (const w of extensions[key] ?? []) push(w.en)
  }
  return out
}
