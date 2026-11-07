// 第一册（Starlight 1）阅读短文「零超纲」词表允许域 + 校验口径。
//
// 与 level-0 的 src/data/reading/baseVocab.ts 复用同一套 BASE_WORDS / NAMES /
// tokenizeReading / isAllowedWord（切词与词形回退只留一份实现，避免两处漂移）。
//
// 第一册比预备级多两点，都仍在「零超纲 = 孩子学过的词」框架内：
//  1. 教材角色名 / 口语词（Monty / Lola / Mr. Gnome / Pippa / hurray…）——
//     这些词出现在课本原文里、不在课词表，短文复述故事必须用；显式收口成
//     BOOK1_EXTRA_WORDS，与 level-0 的 NAMES 白名单同理，避免 96 篇各自发明名字。
//  2. 课本原文 token（STARLIGHT_BOOK1 里该单元的课文）——第一册短文是「把课本
//     阅读课的故事讲完」，教材原文里的词就是本课学过的，按单元并入允许域。
//
// 口径：allowedWordsFor1(u,l) = BASE_WORDS ∪ NAMES ∪ BOOK1_EXTRA_WORDS
//       ∪ 本单元全部课词表 ∪ 本课词表 ∪ 本单元课本原文 token。
// 内容生成（子 Agent 用 --brief）与校验（readingPassage1.test.ts /
// scripts/check-reading1.mjs）都从这里取，不要在别处再实现一份。

import {
  BASE_WORDS,
  NAMES,
  tokenizeReading,
  isAllowedWord,
} from '../reading/baseVocab'
import { lessonsByUnit1 } from './lessons'
import { STARLIGHT_BOOK1 } from './book'
import { passageSentences, type ReadingPassage } from '../reading/index'

export { BASE_WORDS, NAMES, tokenizeReading, isAllowedWord, passageSentences }
export type { ReadingPassage }

/** 第一册教材角色名 / 专名 / 口语词（课本原文出现，非课词表词）。
 *  显式收口：与 level-0 的 NAMES 同理，防止短文里出现没学过的自造词。 */
export const BOOK1_EXTRA_WORDS: readonly string[] = [
  // 贯穿全书的两个主角与课本人物
  'monty', 'lola', 'mr', 'mrs', 'ms', 'gnome', 'sammy', 'daisy', 'billy',
  'pippa', 'mickey', 'pia', 'ruby', 'bam', 'pete', 'mo', 'paul', 'sol', 'jane',
  'lou', 'miho', 'sato', 'sonic', 'alex', 'secret', 'agent', 'gingerbread',
  'abracadabra', 'polar', 'sphinx', 'nile', 'teacher',
  // 课本故事里的常见叙述词（教材原文出现）
  'week', 'later', 'alone', 'hurray', 'another', 'suddenly', 'amazing',
  'special', 'indian', 'brr', 'phew', 'aha', 'eek', 'cannot', 'shoot',
  'twins', 'onto', 'history', 'classroom', 'city', 'message', 'grade',
  'sports', 'uniform', 'team', 'stadium', 'salad', 'sends', 'picks', 'pick',
  'lots', 'worry', 'noise', 'ra',
]

/** 本单元全部课词表（后一课可复用前一课的词） */
function unitWordsOf1(unitId: number): Set<string> {
  const out = new Set<string>()
  for (const lesson of lessonsByUnit1[unitId] ?? []) {
    for (const w of lesson.words) {
      for (const part of w.en.toLowerCase().split(' ')) out.add(part)
    }
  }
  return out
}

/** 本单元课本原文（book.ts）里的全部 token；课本讲过的词都算学过。
 *  只取该单元，避免把别的单元还没学到的词提前放进来。 */
function unitBookTokensOf1(unitId: number): Set<string> {
  const out = new Set<string>()
  for (const [key, bk] of Object.entries(STARLIGHT_BOOK1)) {
    if (!key.startsWith(`${unitId}-`)) continue
    for (const sec of bk.sections) {
      for (const pg of sec.pages) {
        for (const t of tokenizeReading(pg.text)) out.add(t)
      }
    }
  }
  return out
}

/**
 * 某一课短文允许出现的全部词。
 * @param unitId 单元号（1~9）
 * @param lessonId 课号（1~13，各单元不等）
 */
export function allowedWordsFor1(unitId: number, lessonId: number): Set<string> {
  const out = new Set<string>([...BASE_WORDS, ...NAMES, ...BOOK1_EXTRA_WORDS])
  for (const w of unitWordsOf1(unitId)) out.add(w)
  for (const w of lessonsByUnit1[unitId]?.find((l) => l.id === lessonId)?.words ?? []) {
    for (const part of w.en.toLowerCase().split(' ')) out.add(part)
  }
  for (const t of unitBookTokensOf1(unitId)) out.add(t)
  return out
}

/** 96 课的 key 全集，用作「短文是否课课都有」的判定基准 */
export function allReadingKeys1(): string[] {
  const keys: string[] = []
  for (const [unitId, lessons] of Object.entries(lessonsByUnit1)) {
    for (const lesson of lessons) keys.push(`${unitId}-${lesson.id}`)
  }
  return keys
}

/**
 * 单篇短文的完整校验（生成与单测共用的唯一口径），返回问题列表（空 = 通过）。
 * 与 level-0 的 readingPassage.test.ts 八条不变量一一对应：
 *   篇幅 70~100 词 / 8~12 句 / 1~3 段、零超纲、本课词 100% 出现、
 *   每句有中文、英文句不混中文标点、同篇无重复句、标题中英文齐全。
 */
export function validateReadingPassage1(
  p: ReadingPassage | undefined,
  unitId: number,
  lessonId: number,
): string[] {
  const errs: string[] = []
  if (!p) return ['缺少短文']
  const sents = passageSentences(p)
  const wordCount = sents.reduce((n, s) => n + tokenizeReading(s.en).length, 0)

  if (wordCount < 70 || wordCount > 100) errs.push(`词数 ${wordCount} 不在 70~100`)
  if (sents.length < 8 || sents.length > 12) errs.push(`句数 ${sents.length} 不在 8~12`)
  if (p.paragraphs.length < 1 || p.paragraphs.length > 3) errs.push(`段数 ${p.paragraphs.length} 不在 1~3`)
  p.paragraphs.forEach((para, pi) => {
    if (para.length === 0) errs.push(`第 ${pi + 1} 段是空的`)
  })

  // 标题
  if (!p.title?.trim()) errs.push('缺英文标题')
  if (!p.titleZh?.trim()) errs.push('缺中文标题')

  // 零超纲
  const allowed = allowedWordsFor1(unitId, lessonId)
  const oov = new Set<string>()
  for (const s of sents) {
    for (const t of tokenizeReading(s.en)) {
      if (!isAllowedWord(t, allowed)) oov.add(t)
    }
  }
  if (oov.size) errs.push(`超纲词: ${[...oov].join(', ')}`)

  // 本课词表 100% 出现（多词词条按空格拆，每部分都要出现）
  const fullText = sents.map((s) => s.en.toLowerCase()).join(' ')
  const missing = (lessonsByUnit1[unitId]?.find((l) => l.id === lessonId)?.words ?? [])
    .map((w) => w.en.toLowerCase())
    .filter((w) => !w.split(' ').every((part) => fullText.includes(part)))
  if (missing.length) errs.push(`本课词未出现: ${missing.join(', ')}`)

  // 中文 / 标点 / 重复句
  const cnPunct = /[\u3000-\u303f\uff00-\uffef]/
  const seen = new Set<string>()
  for (const s of sents) {
    if (!s.en?.trim()) errs.push('有空英文句')
    if (!s.zh?.trim()) errs.push(`句「${s.en}」缺中文`)
    if (cnPunct.test(s.en)) errs.push(`英文句混入中文标点: ${s.en}`)
    const norm = s.en.toLowerCase().trim().replace(/\s+/g, ' ')
    if (seen.has(norm)) errs.push(`重复句: ${s.en}`)
    seen.add(norm)
  }
  return errs
}
