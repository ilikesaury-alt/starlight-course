// Fly Guy → 阅读模块适配层（零 UI，纯函数）。
//
// 为什么单独一层：`flyguy.ts` 的 Story 是「闯关形态」的数据（22 本故事 +
// 每本 8 词 + 章节化绘本原文），而阅读模块需要 `ReadingModule[]`
//（单元 → 课 → 词表）+ `ReadingPassage`。两者语义不同，这里做**只读适配**，
// 不改 flyguy.ts 的导出形状，也不把原文塞进 READING_PASSAGES
//（那会污染 readingPassage.test.ts 的零超纲口径）。
//
// Fly Guy 2026-11-17 起整个并入阅读模块（对齐 Rocket Girl 的重做）：
//   22 本书 = 22 个「单元」；
//   课 = 有 bookText 的书按**章**拆（15 本，共 58 章），无 bookText 的书
//   收 1 节「这一本的例句」课（8 个词条的绘本原句/学法句型，≤10 句，同 RG 口径）。
//
// 文案必须诚实：
//   · bookText 来自用户提供的实体书（01.Hi!.Fly.Guy-vx-mmdacha.txt 等），
//     是真实原文 → 课标题可以写「绘本原文」；
//   · 无原文的书只有词条例句 → 写「这一本的例句」，不冒充原文。
//
// 原文仅作合理使用展示，不内置整本受版权保护的书（与 flyguy.ts 头部注释一致）。

import { flyGuyStories } from './flyguy'
import type { Story } from './story-types'
import type { Word } from './starlight'
import type { ReadingPassage, ReadingSentence } from './reading/index'
import type { ReadingModule, ReadingSource, ReadingLesson } from './readingSeries'
import { FG_THEME } from './story-themes'

/** 无绘本原文的书：例句课最多几句。与 RG（10 句）同口径，避免整篇朗读超时。 */
export const FG_SENTENCES_PER_PASSAGE = 10

/** 书名形如 `Hi! Fly Guy · 你好，小蝇怪` → 按中点拆成英文名与中文名。 */
function splitBookTitle(title: string): { en: string; zh: string } {
  const i = title.indexOf(' · ')
  if (i < 0) return { en: title, zh: '' }
  return { en: title.slice(0, i).trim(), zh: title.slice(i + 3).trim() }
}

/**
 * 一本书的词表（用于阅读器高亮「这本书的词」）。
 * 每本固定 8 个词条，多为单 token；多词短语（如 `pet show`）TappableWords
 * 按单 token 查永远命中不了，剔除；词条都有人工中文，不需要 lookupZh 兜底。
 */
export function fgReadingVocab(story: Story): Word[] {
  const seen = new Set<string>()
  const out: Word[] = []
  for (const w of story.words) {
    const en = w.en.toLowerCase().trim()
    if (!en || /\s/.test(en) || !/^[a-z]+$/.test(en) || seen.has(en)) continue
    seen.add(en)
    out.push({ en, zh: w.zh, emoji: w.emoji || '🐝' })
  }
  return out
}

/** 一章的句子：pages 逐页成句（每页本身就是一句或一组短句，来自真实原文分页）。 */
function chapterSentences(chapter: NonNullable<Story['bookText']>[number]): ReadingSentence[] {
  const lines: ReadingSentence[] = []
  for (const p of chapter.pages) {
    const en = p.text.trim()
    if (!en) continue
    lines.push({ en, zh: (p.textZh || '').trim() })
  }
  return lines
}

/** 无原文的书：词条的绘本原句优先、学法句型兜底，同集内去重、保序。 */
function wordSentences(story: Story): ReadingSentence[] {
  const seen = new Set<string>()
  const lines: ReadingSentence[] = []
  for (const w of story.words) {
    const en = (w.bookSentence || w.sentence || '').trim()
    if (!en) continue
    const key = en.toLowerCase().replace(/\s+/g, ' ')
    if (seen.has(key)) continue
    seen.add(key)
    lines.push({ en, zh: (w.bookSentenceZh || w.sentenceZh || '').trim() })
  }
  return lines
}

/** 一章 → 一个阅读页；章节名为标题（`Chapter 1` 等）。 */
export function fgChapterPassage(story: Story, chapterIndex: number): ReadingPassage | undefined {
  const chapter = story.bookText?.[chapterIndex]
  if (!chapter) return undefined
  const lines = chapterSentences(chapter)
  if (lines.length === 0) return undefined
  return {
    title: chapter.chapter || `Chapter ${chapterIndex + 1}`,
    titleZh: '绘本原文',
    paragraphs: [lines],
  }
}

/** 无原文的书 → 一个例句阅读页（最多 10 句）。 */
export function fgSentencePassage(story: Story): ReadingPassage | undefined {
  const lines = wordSentences(story).slice(0, FG_SENTENCES_PER_PASSAGE)
  if (lines.length === 0) return undefined
  return {
    title: splitBookTitle(story.title).en,
    titleZh: '这一本的例句',
    paragraphs: [lines],
  }
}

// ---------- 22 本书 → 22 个阅读单元 ----------

/** 一本书的课列表：有原文按章拆课，无原文收 1 节例句课。词表 = 这本书的词。 */
function lessonsOf(story: Story, vocab: Word[]): ReadingLesson[] {
  if (story.bookText && story.bookText.length > 0) {
    return story.bookText.map((c, i) => ({
      id: i + 1,
      title: c.chapter || `Chapter ${i + 1}`,
      titleZh: '绘本原文',
      words: vocab,
    }))
  }
  return [{ id: 1, title: 'Sample Sentences', titleZh: '这一本的例句', words: vocab }]
}

/** unitId = 书序号（1..22，与 fg-N slug 对齐），lessonId = 章序号。 */
const fgModules: ReadingModule[] = flyGuyStories.map((story, i) => {
  const { en, zh } = splitBookTitle(story.title)
  const vocab = fgReadingVocab(story)
  return {
    id: i + 1,
    slug: `fg-book-${i + 1}`,
    title: en,
    titleZh: zh,
    emoji: story.emoji,
    color: FG_THEME.color,
    colorSoft: FG_THEME.colorSoft,
    lessons: lessonsOf(story, vocab),
  }
})

/**
 * (书号, 章号) → 阅读页。
 *
 * ⚠️ **必须返回稳定引用**（与 rgPassageOf 同因）：ReadingZone 有
 * `useEffect([passage])`，引用一变就 `cancelSpeech()` 掐断正在播的朗读。
 * ReadingBook 每次渲染都会调 `passageOf`（`readingLessonsOf` 还会为
 * 全部课各调一次），若这里每次现算新对象，孩子点「慢速 / 记忆 / 中文」
 * 或 SRS 一更新，整篇朗读就断了。故按 key 缓存一次。
 */
const PASSAGE_CACHE = new Map<string, ReadingPassage | undefined>()

export function fgPassageOf(bookId: number, lessonId: number): ReadingPassage | undefined {
  const key = `${bookId}-${lessonId}`
  if (PASSAGE_CACHE.has(key)) return PASSAGE_CACHE.get(key)
  const story = flyGuyStories[bookId - 1]
  let passage: ReadingPassage | undefined
  if (!story) {
    passage = undefined
  } else if (story.bookText && story.bookText.length > 0) {
    passage = fgChapterPassage(story, lessonId - 1)
  } else {
    passage = lessonId === 1 ? fgSentencePassage(story) : undefined
  }
  PASSAGE_CACHE.set(key, passage)
  return passage
}

/** 首屏宝藏词示例：第一本里真实可点、有中文的前 5 个单词。 */
export const fgHeroWords: string[] = (() => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const w of fgReadingVocab(flyGuyStories[0])) {
    if (seen.has(w.en)) continue
    seen.add(w.en)
    out.push(w.en)
    if (out.length === 5) return out
  }
  return out
})()

/** 喂给 ReadingBook 的完整数据源（自定义书：没有 level、没有系列切换条）。 */
export const FG_READING_SOURCE: ReadingSource = {
  mods: fgModules,
  passageOf: fgPassageOf,
  heroWords: fgHeroWords,
}

/** 首页/进度页的静态规模数字：22 本、58 章、457 页原文、15 本有原文。 */
export const fgReadingStats = {
  books: flyGuyStories.length,
  chapters: flyGuyStories.reduce((a, s) => a + (s.bookText?.length ?? 0), 0),
  withBookText: flyGuyStories.filter((s) => (s.bookText?.length ?? 0) > 0).length,
}
