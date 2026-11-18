// Winnie the Witch → 阅读模块适配层（零 UI，纯函数）。
//
// 与 Fly Guy 同一套模式：书 → ReadingSource，页 → 课。
//   这本绘本只有 1 本，所以只有 1 个「单元」，20 个正文页 = 20 课
//   （原书 27 页，纯插画页 4/6/11/18 与版权页不收录）。
//   课标题 = `第 N 页`，titleZh =「绘本原文」（真实原文，OCR 校对过）。
//
// ⚠️ 稳定引用：passageOf 按页码缓存，否则 ReadingZone 的 useEffect([passage])
//    会在点「慢速/中文/SRS 更新」时 cancelSpeech() 掐断朗读（RG/FG 踩过的坑）。
// ⚠️ 查词：用全局 lookupZh（BOOK_WORD_ZH 含大量绘本高频词，覆盖充分），
//    不另造专属词典、不并入 BOOK_WORD_ZH（避免改变 bookQuiz 出题分布）。

import { WINNIE_PAGES, WINNIE_VOCAB } from './winnie'
import { lookupZh } from '@/utils/bookDict'
import { WINNIE_THEME } from './story-themes'
import type { ReadingPassage } from './reading/index'
import type { ReadingModule, ReadingSource, ReadingLesson } from './readingSeries'

/** 一页 → 一个阅读页。 */
export function winniePassage(page: number): ReadingPassage | undefined {
  const p = WINNIE_PAGES.find((x) => x.page === page)
  if (!p || p.sentences.length === 0) return undefined
  return {
    title: `Page ${p.page}`,
    titleZh: '绘本原文',
    paragraphs: [p.sentences],
  }
}

/** 单元 = 这本书；课 = 正文页。每课词表 = 该页关键词（去重后中文兜底）。 */
const lessons: ReadingLesson[] = WINNIE_PAGES.map((p) => ({
  id: p.page,
  title: `Page ${p.page}`,
  titleZh: '绘本原文',
  words: p.words.map((w) => ({
    en: w.en,
    zh: w.zh || lookupZh(w.en) || '🐈 温妮的词',
    emoji: w.emoji || '🧙',
  })),
}))

const winnieModule: ReadingModule = {
  id: 1,
  slug: 'winnie-book',
  title: 'Winnie the Witch',
  titleZh: '女巫温妮',
  emoji: '🧙',
  color: WINNIE_THEME.color,
  colorSoft: WINNIE_THEME.colorSoft,
  lessons,
}

/**
 * (书号, 页码) → 阅读页。只有 1 个单元，unitId 恒为 1。
 * 按页码缓存，返回稳定引用（见文件头）。
 */
const PASSAGE_CACHE = new Map<number, ReadingPassage | undefined>()

export function winniePassageOf(_unitId: number, page: number): ReadingPassage | undefined {
  const key = page
  if (PASSAGE_CACHE.has(key)) return PASSAGE_CACHE.get(key)
  const passage = winniePassage(page)
  PASSAGE_CACHE.set(key, passage)
  return passage
}

/** 首屏宝藏词示例：全书真实词表的前 5 个。 */
export const winnieHeroWords: string[] = WINNIE_VOCAB.slice(0, 5).map((w) => w.en)

/** 静态规模数字（书馆/进度页可显示） */
export const winnieStats = {
  books: 1,
  pages: WINNIE_PAGES.length,
  words: WINNIE_VOCAB.length,
  sentences: WINNIE_PAGES.reduce((a, p) => a + p.sentences.length, 0),
}

/** 喂给 ReadingBook 的完整数据源（自定义书：没有 level、没有系列切换条）。 */
export const WINNIE_READING_SOURCE: ReadingSource = {
  mods: [winnieModule],
  passageOf: winniePassageOf,
  heroWords: winnieHeroWords,
}
