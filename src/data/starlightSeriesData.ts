// Starlight 系列数据门面 —— 预备级(Starter)与第一册(Book 1)共用同一套页面。
//
// 为什么要有这一层：两册教材的单元号都从 1 开始（预备级 1–12、第一册 1–9），
// slug 不冲突，但「单元号」会撞。页面里凡是「按单元号取数据」的地方 ——
// 课文 getLessonBook、句型卡 framesOfLesson、拓展词主题 LESSON_TOPICS、
// 单元图形 UnitGlyph —— 若直接用 mod.id，第一册的 Unit 1 会静默拿到
// 预备级 Unit 1 的课文与句型卡（内容不报错，只是读的是另一本书）。
//
// 这里把这类入口统一收口、按 level 分发，页面只认 series* 这一层。
//
// ⚠️ 本文件 import 了两册的教材数据，**只能被课程页（路由级 chunk）引用**。
//    首页/全局位置要用的册次元信息在 starlightSeries.ts（零数据依赖）。
//
// Level 0（预备级）：src/data/starlight.ts / starlight-book.ts / sentenceFrame.ts / reading/
// Level 1（第一册）：src/data/starlight1/
//
// 一条铁律：跨册的数据一律按 slug 或 level 分发，绝不按裸单元号取。

import {
  modules as modulesStarter,
  STARLIGHT_THEME,
  type Lesson,
  type Module,
  type Word,
} from './starlight'
import {
  modules1,
  STARLIGHT_BOOK1,
  getReadingPassage1Series,
  framesOfLesson1Series,
  EXT_TOPICS1,
} from './starlight1'
import { getLessonBook, type LessonBook } from './starlight-book'
import { getPassage } from './starlight-passage'
import { getLessonDialogue } from './lessonDialogue'
import { framesOfLesson, type SentenceFrame } from './sentenceFrame'
import { getReadingPassage, type ReadingPassage } from './reading/index'
import {
  lessonTopicZh,
  suggestExtensions,
  suggestExtensionsWith,
  type ExtWord,
  type Topic,
} from './extensionTopics'
import type { StarlightLevel } from './starlightSeries'

export { STARLIGHT_THEME }
export { STARLIGHT_LEVELS, STARLIGHT_LEVEL_ORDER, parseSeriesLessonKey } from './starlightSeries'
export type { StarlightLevel, StarlightLevelMeta } from './starlightSeries'

/** 带上所属册次的单元（Module 是 level-0 与 level-1 共用的同一套类型） */
export interface SeriesModule extends Module {
  level: StarlightLevel
}

/** 两册的全部单元。slug 全局唯一，可直接当主键用。 */
export const SERIES_MODULES: SeriesModule[] = [
  ...modulesStarter.map((m): SeriesModule => ({ ...m, level: 'starlight' })),
  ...modules1.map((m): SeriesModule => ({ ...m, level: 'starlight1' })),
]

export function getSeriesModule(slug: string): SeriesModule | undefined {
  return SERIES_MODULES.find((m) => m.slug === slug)
}

export function modulesOfLevel(level: StarlightLevel): SeriesModule[] {
  return SERIES_MODULES.filter((m) => m.level === level)
}

/** 该册的单元数（页面上「Module x / N」的 N） */
export function unitCountOfLevel(level: StarlightLevel): number {
  return modulesOfLevel(level).length
}

// ---------------------------------------------------------------------------
// 按册分发的数据入口
// ---------------------------------------------------------------------------

/** 课本原文：预备级走 starlight-book，第一册走 starlight1/book（键形同为 `${单元}-${课}`） */
export function seriesBook(mod: SeriesModule, lessonId: number): LessonBook | undefined {
  return mod.level === 'starlight1'
    ? STARLIGHT_BOOK1[`${mod.id}-${lessonId}`]
    : getLessonBook(mod.id, lessonId)
}

/**
 * 句型框架卡：第一册的卡 unitSlug/lessonId 与预备级同构，按 slug 过滤即可。
 * ⚠️ 第一册 Unit 2–9 的卡在各自的 uN.ts 里（u2_frames…），聚合在
 *    starlight1/index.ts 的 FRAMES_BY_UNIT1 —— 之前只接了 Unit 1，
 *    等于 u2–u9 已经抽出来的那几十张卡白放着。
 */
export function seriesFrames(mod: SeriesModule, lessonId: number): SentenceFrame[] {
  return mod.level === 'starlight1'
    ? framesOfLesson1Series(mod.slug, lessonId)
    : framesOfLesson(mod.slug, lessonId)
}

/**
 * 单元阅读短文（/reading 用）。
 * ⚠️ 同上：第一册 Unit 2–9 的短文在 uN_reading 里，聚合在 READINGS_BY_UNIT1。
 */
export function seriesReading(mod: SeriesModule, lessonId: number): ReadingPassage | undefined {
  return mod.level === 'starlight1'
    ? getReadingPassage1Series(mod.id, lessonId)
    : getReadingPassage(mod.id, lessonId)
}

/** 外教↔孩子的课文对话轮次（只有预备级抽过 dialogue，第一册暂无） */
export function seriesDialogue(
  mod: SeriesModule,
  lessonId: number,
): ReturnType<typeof getLessonDialogue> {
  return mod.level === 'starlight1' ? undefined : getLessonDialogue(mod.id, lessonId)
}

/** 课文点读轮次（只有预备级有 passage，第一册回落到课本原文） */
export function seriesPassage(
  mod: SeriesModule,
  lessonId: number,
): ReturnType<typeof getPassage> {
  return mod.level === 'starlight1' ? undefined : getPassage(mod.id, lessonId)
}

// ---------------------------------------------------------------------------
// 拓展词（E 课堂）——两册的词库与主题映射各自独立
// ---------------------------------------------------------------------------

/** 第一册各单元的拓展主题键（对应 starlight1/extensions.ts 的 EXT_TOPICS1） */
const LESSON_TOPICS_1: Record<number, string[]> = {
  1: ['classroom', 'school-things', 'shapes', 'art'],
  2: ['body-parts', 'doctor', 'feelings', 'japan'],
  3: ['circus', 'emotions', 'toys'],
  4: ['transport', 'geography', 'india', 'weather'],
  5: ['farm', 'farm-animals', 'crops-food', 'nature'],
  6: ['pirate-sea', 'treasure', 'madagascar', 'history'],
  7: ['magic', 'performance', 'costume', 'math'],
  8: ['sports', 'p-e', 'usa', 'athletics'],
  9: ['sea-ocean', 'diving', 'music', 'soccer'],
}

/** 拓展词在 store 里的 key。
 *
 *  预备级保持 `${单元}-${课}` 原样 —— 历史数据已写进 localStorage，改键名会
 *  丢掉家长手动录过的词。第一册加 `s1-` 前缀：两册单元号都从 1 开始，
 *  不加前缀的话「第一册 Unit 1 第 3 课」会读到「预备级 Unit 1 第 3 课」的拓展词。 */
export function seriesLessonKey(mod: SeriesModule, lessonId: number): string {
  return mod.level === 'starlight1' ? `s1-${mod.id}-${lessonId}` : `${mod.id}-${lessonId}`
}

/** 本课主题名（拓展词区的「主题：xxx」提示） */
export function seriesLessonTopicZh(mod: SeriesModule, lessonId: number): string | undefined {
  if (mod.level === 'starlight1') {
    const key = LESSON_TOPICS_1[mod.id]?.[0]
    return key ? EXT_TOPICS1[key]?.zh : undefined
  }
  return lessonTopicZh(`${mod.id}-${lessonId}`)
}

export interface SeriesSuggestInput {
  mod: SeriesModule
  lessonId: number
  /** 本课课内词 —— 拓展词必须是教材之外的词 */
  lessonWords: Word[]
  /** 本课已有的拓展词（换一批时只传手动录入的，自动词会被整体替换） */
  existing: Word[]
  /** 第几轮（1 起） */
  round?: number
  limit?: number
}

/** 按本课主题挑拓展词：两册各用自己的词库与主题映射 */
export function seriesSuggestExtensions(input: SeriesSuggestInput): ExtWord[] {
  const { mod, lessonId, lessonWords, existing, round, limit } = input
  if (mod.level === 'starlight1') {
    return suggestExtensionsWith(
      EXT_TOPICS1 as Record<string, Topic>,
      LESSON_TOPICS_1[mod.id] ?? [],
      { lessonKey: seriesLessonKey(mod, lessonId), lessonWords, existing, round, limit },
    )
  }
  return suggestExtensions({
    lessonKey: seriesLessonKey(mod, lessonId),
    lessonWords,
    existing,
    round,
    limit,
  })
}

/** 该册里「单元号 → 单元」；注意必须带 level，单元号在两册之间是重复的 */
export function moduleByUnitId(level: StarlightLevel, unitId: number): SeriesModule | undefined {
  return modulesOfLevel(level).find((m) => m.id === unitId)
}

// ---------------------------------------------------------------------------
// 进度相关的单元级口径
// ---------------------------------------------------------------------------

/** 该册全部课的 id（用于「共 N 课」这类统计） */
export function lessonsOfLevel(level: StarlightLevel): Lesson[] {
  return modulesOfLevel(level).flatMap((m) => m.lessons)
}

/** 单元测验全对时记为完成的「测验课」课号。
 *  预备级固定是第 6 课（Quiz 课）；第一册每单元课数不同，取最后一课（多为 Practice）。 */
export function quizLessonIdOf(mod: SeriesModule): number {
  if (mod.level === 'starlight') return 6
  return mod.lessons[mod.lessons.length - 1]?.id ?? 0
}
