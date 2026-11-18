// 青蛙与蟾蜍 → 阅读模块适配层（零 UI，纯函数）。
//
// 层级：4 本子书 = 4 个「单元」，故事 = 课（4 本 × 5 故事 = 20 课，全部收录）。
//
// ⚠️ 稳定引用：passageOf 按 `${unitId}-${lessonId}` 缓存，否则 ReadingZone 的
//    useEffect([passage]) 会 cancelSpeech() 掐断朗读（RG/FG/Winnie 踩过的坑）。
// ⚠️ 查词：用全局 lookupZh，不另造专属词典、不并入 BOOK_WORD_ZH。

import { FROG_BOOKS, FROG_VOCAB, frogStats } from './frogAndToad'
import type { ReadingPassage } from './reading/index'
import type { ReadingModule, ReadingSource, ReadingLesson } from './readingSeries'
import { FROG_THEME } from './story-themes'

/** 一个故事 → 一个阅读页。 */
export function frogPassage(bookId: number, storyId: string): ReadingPassage | undefined {
  const book = FROG_BOOKS.find((b) => b.id === bookId)
  const story = book?.stories.find((s) => s.id === storyId)
  if (!story || story.sentences.length === 0) return undefined
  return {
    title: story.title,
    titleZh: story.titleZh,
    paragraphs: [story.sentences],
  }
}

/** 4 本书 → 4 个阅读单元；课 = 故事。 */
const frogModules: ReadingModule[] = FROG_BOOKS.map((book) => ({
  id: book.id,
  slug: `frog-book-${book.id}`,
  title: book.title,
  titleZh: book.titleZh,
  emoji: book.emoji,
  color: FROG_THEME.color,
  colorSoft: FROG_THEME.colorSoft,
  lessons: book.stories.map(
    (s, i): ReadingLesson => ({
      id: i + 1,
      title: s.title,
      titleZh: s.titleZh,
      words: s.words,
    }),
  ),
}))

/**
 * (书号, 课序号) → 阅读页。按 key 缓存，返回稳定引用（见文件头）。
 * lessonId 是故事在该书里的序号（1 起），与 frogModules 的 lessons 对齐。
 */
const PASSAGE_CACHE = new Map<string, ReadingPassage | undefined>()

export function frogPassageOf(bookId: number, lessonId: number): ReadingPassage | undefined {
  const key = `${bookId}-${lessonId}`
  if (PASSAGE_CACHE.has(key)) return PASSAGE_CACHE.get(key)
  const book = FROG_BOOKS.find((b) => b.id === bookId)
  const story = book?.stories[lessonId - 1]
  const passage = story ? frogPassage(bookId, story.id) : undefined
  PASSAGE_CACHE.set(key, passage)
  return passage
}

/** 首屏宝藏词示例：第一本书里真实词表的前 5 个 */
export const frogHeroWords: string[] = FROG_VOCAB.slice(0, 5).map((w) => w.en)

/** 静态规模数字（供书馆/进度页/测试） */
export const frogReadingStats = frogStats

/** 喂给 ReadingBook 的完整数据源（自定义书：没有 level、没有系列切换条）。 */
export const FROG_READING_SOURCE: ReadingSource = {
  mods: frogModules,
  passageOf: frogPassageOf,
  heroWords: frogHeroWords,
}
