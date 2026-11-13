// 阅读模块系列数据门面 —— /reading（预备级）与 /reading1（第一册）共用同一套页面。
//
// ⚠️ 刻意**零运行时数据依赖**：本文件被两个路由页与共享组件引用，只放
//    · 路由/主题等常量
//    · 以「数据源」为入参的纯函数（readingLessonsOf / readingHeroWords）
//   两册教材各自由各自的路由页静态 import，Vite 会把它们拆成两个懒加载 chunk：
//   /reading 只带预备级数据，/reading1 只带第一册数据，互不拖累。
//   若在这里 import 任何一册的数据，两册会一起被塞进两个 chunk。
//
// 一条铁律：两册单元号都从 1 开始，跨册一律按 level 分发，绝不按裸单元号取。
// 两册现在都是 96 课篇篇有短文。readingLessonsOf 仍保留「滤掉没有短文的课」：
// 万一以后某册新增一课却还没配短文，页面不会出现点开是空态的死链卡片。

import type { Word } from './starlight'
import type { ReadingPassage } from './reading/index'
import type { StarlightLevel } from './starlightSeries'

// ReadingBook 只依赖「一组单元 → 每单元若干课 → 每课词表」这个结构。
// 刻意不复用 starlight.ts 的 Module/Lesson：那里还带 preview / quiz / sentences，
// 而 Rocket Girl 的「单元」是故事弧、「课」是一集故事，根本没有这些东西。
// Module[] 在结构上可以原样传给 ReadingModule[]，Starlight 两个路由页零改动。
export interface ReadingLesson {
  id: number
  title: string
  titleZh: string
  words: Word[]
}

export interface ReadingModule {
  id: number
  slug: string
  title: string
  titleZh: string
  emoji: string
  color: string
  colorSoft: string
  lessons: ReadingLesson[]
}

/** 阅读模块的册次路由（与 STARLIGHT_LEVELS[].path 不同：那是主课目录页） */
export const READING_PATHS: Record<StarlightLevel, string> = {
  starlight: '/reading',
  starlight1: '/reading1',
}

/** 阅读模块专属主题色（靛蓝）：区别于主课暖橙、Rocket Girl 紫、英语蓝、听写青绿。 */
export const READING_THEME = { color: '#6366f1', colorSoft: '#eef2ff' } as const

/** 一册的阅读数据源，由各路由页构造后喂给共享组件。
 *  `level` 是 Starlight 册次；Rocket Girl 这类「自定义书」不填 ——
 *  它没有系列切换条，也不该被当成第三册（见 ReadingBook 的 custom 分支）。 */
export interface ReadingSource {
  level?: StarlightLevel
  mods: ReadingModule[]
  passageOf: (unitId: number, lessonId: number) => ReadingPassage | undefined
  /** 首屏宝藏词示例；不传则自动从该册 Unit 1 的真实课本词里取 */
  heroWords?: string[]
}

/** 该册里真正有短文的课。
 *  预备级 = 全部 96 课（数据完整，行为与改造前逐字节一致）；
 *  第一册 = 已写好的 27 课。阅读页只列这些课，杜绝「读一读」点了是空态的死链。 */
export function readingLessonsOf(src: ReadingSource, m: ReadingModule): ReadingLesson[] {
  return m.lessons.filter((l) => !!src.passageOf(m.id, l.id))
}

/** 首屏宝藏词示例：从该册 Unit 1 的真实课本词里取前 5 个单词。
 *  不写死词表 —— 母题说「只用了你学过的词」，举的例子必须真是**那一册**学过的词，
 *  换册还写预备级的 hello/friend 就穿帮了。跳过 'trash can' 这类词组。 */
export function readingHeroWords(src: ReadingSource): string[] {
  // 预备级沿用改造前就写死的示例词，保证 /reading 首屏逐字节不变（e2e 契约）
  if (src.heroWords) return src.heroWords
  const first = src.mods[0]
  const seen = new Set<string>()
  const out: string[] = []
  for (const l of first?.lessons ?? []) {
    for (const w of l.words) {
      const en = w.en.trim()
      if (!en || en.includes(' ') || seen.has(en.toLowerCase())) continue
      seen.add(en.toLowerCase())
      out.push(en)
      if (out.length === 5) return out
    }
  }
  return out
}

/** 该册收录的短文总数（首屏「共 N 篇」） */
export function readingStoryCount(src: ReadingSource): number {
  return src.mods.reduce((n, m) => n + readingLessonsOf(src, m).length, 0)
}
