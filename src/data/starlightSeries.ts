// Starlight 系列「册次元信息」—— 预备级(Starter)与第一册(Book 1)的定义。
//
// ⚠️ 这个文件**刻意不 import 任何教材数据**。
// 它被首页、系列切换条、单元图形等全局位置引用；一旦在这里 import 教材数据，
// 等于把两册课程数据（约 1MB 源码）拖进首屏 chunk —— 实测光这一处就 +227KB。
// 需要数据的入口在 starlightSeriesData.ts（只有课程页才加载）。

/** 系列中的一册 */
export type StarlightLevel = 'starlight' | 'starlight1'

/** 一册的元信息（目录页标题 / 路由 / 教材名） */
export interface StarlightLevelMeta {
  id: StarlightLevel
  /** 该册的中文别称，如「预备级」「第一册」 */
  labelZh: string
  /** 教材英文名 */
  bookTitle: string
  /** 该册目录页路由 */
  path: string
  /** 目录页主标题 */
  pageTitle: string
}

export const STARLIGHT_LEVELS: Record<StarlightLevel, StarlightLevelMeta> = {
  starlight: {
    id: 'starlight',
    labelZh: '预备级',
    bookTitle: 'Oxford Starlight Starter',
    path: '/starlight',
    pageTitle: 'Starlight 主课',
  },
  starlight1: {
    id: 'starlight1',
    labelZh: '第一册',
    bookTitle: 'Oxford Starlight 1',
    path: '/starlight1',
    pageTitle: 'Starlight 主课 · 第一册',
  },
}

/** 系列顺序（系列切换条按这个顺序排） */
export const STARLIGHT_LEVEL_ORDER: StarlightLevel[] = ['starlight', 'starlight1']

/** 解析拓展词 key → 所属册 / 单元号 / 课号。
 *
 *  key 格式两册不同：预备级 `${单元}-${课}`（历史数据，格式不能动），
 *  第一册 `s1-${单元}-${课}`。直接 split 取第一段当单元号会把第一册的
 *  「s1-3-2」读成单元号 0。 */
export function parseSeriesLessonKey(
  key: string,
): { level: StarlightLevel; unitId: number; lessonId: number } | undefined {
  const parts = key.split('-')
  const isLevel1 = parts[0] === 's1'
  const unitId = Number(isLevel1 ? parts[1] : parts[0])
  const lessonId = Number(isLevel1 ? parts[2] : parts[1])
  if (!Number.isFinite(unitId) || !Number.isFinite(lessonId)) return undefined
  return { level: isLevel1 ? 'starlight1' : 'starlight', unitId, lessonId }
}
