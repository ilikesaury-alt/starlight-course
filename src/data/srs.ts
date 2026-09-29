// Leitner 盒式记忆调度算法(7 档:box 0..6)
// 基于艾宾浩斯遗忘曲线,通过递增间隔减缓遗忘。
// 算法:答对升一盒、答错归零,盒号决定下次复习间隔。

import type { ModuleId } from './modules'
import type { SentenceFrame } from './sentenceFrame'
import { createFsrsCard, gradeFsrsCard, migrateFromLeitner, deriveBox, BOX_STABILITY, type FsrsCard } from './fsrsScheduler'

// 各盒对应的下次复习间隔(天)。box 0 = 当天/短期重练。
// 实际值由 fsrsScheduler 定义（避开循环依赖），此处转出保持既有导入方不变。
export { BOX_INTERVALS } from './fsrsScheduler'
import { BOX_INTERVALS } from './fsrsScheduler'
export const MAX_BOX = BOX_INTERVALS.length - 1

/** 一张卡片的记忆状态。key 通常为单词 en。 */
export interface SrsCard {
  en: string
  /** 记忆强度等级 0..MAX_BOX,数字越大越熟练 */
  box: number
  /** 下次到期时间戳(天,以 UTC 整天计) */
  nextReview: number
  /** 上次复习时间戳(天) */
  lastReview: number
  /** 连续答对次数,用于展示势头 */
  streak: number
  /** 总复习次数 */
  reviews: number
  /** 该词出现过的模块（用于按模块筛选复习），记忆进度跨模块共享 */
  modules: ModuleId[]
  /** 卡片来源:lesson = 教材课内词(播完删除也不清理),extension = E 课堂现场拓展词
   *  (删除拓展词时据此把卡片一并清出复习池)。旧数据缺省按 lesson 处理。 */
  source?: 'lesson' | 'extension'
  /** 卡片种类：word = 单词卡（默认）,sentence = 句子框架卡。缺省按 word 处理。 */
  kind?: 'word' | 'sentence'
  /** kind==='sentence' 时携带的框架定义（单词卡无此字段） */
  frame?: SentenceFrame
  /** FSRS 调度状态（M4 内核）。旧 Leitner 数据迁移后写入；缺失时按 Leitner 字段现算。 */
  fsrs?: FsrsCard
}

/** 把 Date 折算为「本地日历日」的天数戳:取本地年月日,按 UTC 零点解释后除以一天毫秒数。
 *  同一本地日历日返回相同值(复习调度以本地日为单位,避免跨时区 UTC 零点割裂一天)。 */
export function dayStamp(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  return Math.floor(d.getTime() / 86_400_000)
}

/** 创建新卡(从未学过的词) */
export function createNewCard(
  en: string,
  module: ModuleId,
  today: number = dayStamp(),
  source: 'lesson' | 'extension' = 'lesson'
): SrsCard {
  return {
    en,
    box: 0,
    nextReview: today, // 新词立即进入复习池
    lastReview: today,
    streak: 0,
    reviews: 0,
    modules: [module],
    source,
    fsrs: createFsrsCard(today),
  }
}

/**
 * 记一次复习结果（FSRS 内核）。
 * 答对 → Good，间隔随稳定度递增；答错 → Again，回到当天到期且 lapses+1。
 * 同一次调用顺带刷新派生兼容字段（box/reviews/streak/nextReview），旧 UI 不必改。
 */
export function scheduleNext(
  card: Pick<SrsCard, 'box' | 'streak' | 'reviews' | 'fsrs'>,
  correct: boolean,
  today: number = dayStamp()
): Pick<SrsCard, 'box' | 'nextReview' | 'lastReview' | 'streak' | 'reviews' | 'fsrs'> {
  const base = card.fsrs ?? migrateFromLeitner(card.box, today)
  const next = gradeFsrsCard(base, correct, today)
  return {
    fsrs: next,
    box: deriveBox(next),
    nextReview: next.due,
    lastReview: next.lastReview,
    streak: correct ? card.streak + 1 : 0,
    reviews: card.reviews + 1,
  }
}

/**
 * 卡片的到期日（dayStamp）。
 *
 * FSRS 的 `fsrs.due` 是唯一真值来源；旧 v6 数据（迁移后已补 fsrs，但字段未重算）
 * 或尚未迁移的卡片回退到 Leitner 的 `nextReview`。
 *
 * `isDue` 与 `sortDueCards` 都必须经由此函数：此前前者读 fsrs.due、后者读
 * nextReview，两者一旦不一致就会出现「判定到期却被排到最后」或反之的卡片。
 */
export function dueOf(card: Pick<SrsCard, 'nextReview' | 'fsrs'>): number {
  return card.fsrs?.due ?? card.nextReview
}

/** 上次复习日（dayStamp）；无 fsrs 时回退到 Leitner 字段 */
function lastReviewOf(card: Pick<SrsCard, 'lastReview' | 'fsrs'>): number {
  return card.fsrs?.lastReview ?? card.lastReview
}

/** 卡片是否到期(需要今天复习)：与 sortDueCards 同源（均走 dueOf） */
export function isDue(
  card: Pick<SrsCard, 'nextReview' | 'fsrs'>,
  today: number = dayStamp()
): boolean {
  return dueOf(card) <= today
}

/**
 * 排序到期卡片:最紧迫的排前面。
 * 优先级:逾期越久越优先 → 稳定度越低越优先(越不熟越靠前) → 上次复习早的优先。
 *
 * 到期日与上次复习日均经 dueOf / lastReviewOf 读取，与 isDue 同源；
 * 不稳定时读 `stability`，无 fsrs 时回退到派生的 `box`（box 本身由 stability 导出）。
 */
export function sortDueCards<
  T extends Pick<SrsCard, 'box' | 'nextReview' | 'lastReview' | 'fsrs'>
>(cards: T[], today: number = dayStamp()): T[] {
  // 稳定度回退顺序：fsrs.stability → 由 box 导出的粗粒档（与旧行为一致）
  const strengthOf = (c: T) => c.fsrs?.stability ?? BOX_STABILITY[c.box] ?? 0
  return [...cards].sort((a, b) => {
    // 逾期越久越优先
    const overdueA = today - dueOf(a)
    const overdueB = today - dueOf(b)
    if (overdueA !== overdueB) return overdueB - overdueA
    // 越不熟（稳定度越低）越优先
    const sa = strengthOf(a)
    const sb = strengthOf(b)
    if (sa !== sb) return sa - sb
    // 上次复习时间早的优先
    return lastReviewOf(a) - lastReviewOf(b)
  })
}

/** 盒号 → 可读中文标签(共 7 项,对应 box 0..6) */
export function boxLabel(box: number): string {
  const labels = ['刚学', '初识', '熟悉', '掌握', '熟练', '精通', '大师']
  return labels[Math.min(box, labels.length - 1)]
}

/** 盒号 → emoji 视觉强度(共 7 项,对应 box 0..6) */
export function boxEmoji(box: number): string {
  const emojis = ['🌱', '🌿', '☘️', '🌳', '🌴', '⭐', '🏆']
  return emojis[Math.min(box, emojis.length - 1)]
}
