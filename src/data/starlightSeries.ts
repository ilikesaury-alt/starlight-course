// Starlight 系列「册次元信息」—— 预备级(Starter)与第一册(Book 1)的定义。
//
// ⚠️ 这个文件**刻意不 import 任何教材数据**。
// 它被首页、系列切换条、单元图形等全局位置引用；一旦在这里 import 教材数据，
// 等于把两册课程数据（约 1MB 源码）拖进首屏 chunk —— 实测光这一处就 +227KB。
// 需要数据的入口在 starlightSeriesData.ts（只有课程页才加载）。

/** 系列中的一册 */
export type StarlightLevel = 'starlight' | 'starlight1'

/** 一册的元信息（目录页标题 / 路由 / 教材名 / 进度口径） */
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
  /** 单元数 / 总课数 —— 进度页分母。由 starlightSeries.test.ts 拿真实课表钉死 */
  unitCount: number
  lessonCount: number
}

export const STARLIGHT_LEVELS: Record<StarlightLevel, StarlightLevelMeta> = {
  starlight: {
    id: 'starlight',
    labelZh: '预备级',
    bookTitle: 'Oxford Starlight Starter',
    path: '/starlight',
    pageTitle: 'Starlight 主课',
    unitCount: 12,
    lessonCount: 96,
  },
  starlight1: {
    id: 'starlight1',
    labelZh: '第一册',
    bookTitle: 'Oxford Starlight 1',
    path: '/starlight1',
    pageTitle: 'Starlight 主课 · 第一册',
    unitCount: 9,
    lessonCount: 96,
  },
}

/** 系列顺序（系列切换条按这个顺序排） */
export const STARLIGHT_LEVEL_ORDER: StarlightLevel[] = ['starlight', 'starlight1']

/**
 * 单元 slug → 所属册。store 的 lessonCompleted / completedQuizzes 都以**单元 slug**为键，
 * 两册的 slug 全局唯一，所以这里能零数据地把进度按册拆开 —— 进度页不必 import 两册
 * 教材数据（那会把 1MB 源码拖进一个统计页）。
 *
 * ⚠️ 名单由 starlightSeries.test.ts 拿真实 modules / modules1 逐个钉死，
 *    加单元漏改这里会立刻测试红。故意不放教材数据：本文件被首页等全局位置引用。
 */
export const STARLIGHT_UNIT_SLUGS: Record<StarlightLevel, readonly string[]> = {
  starlight: [
    'hello', 'animals', 'food', 'toys', 'opposites', 'body',
    'home', 'food-groups', 'my-day', 'birthday', 'places', 'transport',
  ],
  starlight1: [
    'monty-the-artist', 'lola-the-doctor', 'monty-the-clown', 'lola-the-pilot',
    'monty-the-farmer', 'lola-the-pirate', 'monty-the-magician', 'lola-the-athlete',
    'monty-the-diver',
  ],
}

const SLUG_TO_LEVEL: ReadonlyMap<string, StarlightLevel> = new Map(
  STARLIGHT_LEVEL_ORDER.flatMap((level) =>
    STARLIGHT_UNIT_SLUGS[level].map((slug) => [slug, level] as const),
  ),
)

/** 查某个单元 slug 属于哪一册；不属于系列（或旧数据里的野 slug）返回 undefined */
export function levelOfUnitSlug(slug: string): StarlightLevel | undefined {
  return SLUG_TO_LEVEL.get(slug)
}

/** 把「slug → 已完成课 id 列表」按册汇总已完成课数。
 *  认不出的 slug 不计入任何一册（旧数据 / 别的模块串进来的键不该虚增进度）。 */
export function countLessonsByLevel(
  lessonCompleted: Record<string, number[]>,
): Record<StarlightLevel, number> {
  const out: Record<StarlightLevel, number> = { starlight: 0, starlight1: 0 }
  for (const [slug, ids] of Object.entries(lessonCompleted)) {
    const level = levelOfUnitSlug(slug)
    if (level) out[level] += ids.length
  }
  return out
}

/** 按册统计已完成单元测验数（completedQuizzes 存的是单元 slug） */
export function countQuizzesByLevel(
  completedQuizzes: string[],
): Record<StarlightLevel, number> {
  const out: Record<StarlightLevel, number> = { starlight: 0, starlight1: 0 }
  for (const slug of completedQuizzes) {
    const level = levelOfUnitSlug(slug)
    if (level) out[level] += 1
  }
  return out
}

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
