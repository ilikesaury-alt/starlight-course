// Leitner 5 盒式记忆调度算法
// 基于艾宾浩斯遗忘曲线,通过递增间隔减缓遗忘。
// 算法:答对升一盒、答错归零,盒号决定下次复习间隔。

// 各盒对应的下次复习间隔(天)。box 0 = 当天/短期重练。
export const BOX_INTERVALS = [0, 1, 2, 4, 7, 14, 30] as const
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
}

/** 把 Date 折算为 UTC 整天的天数戳,避免时区漂移 */
export function dayStamp(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  return Math.floor(d.getTime() / 86_400_000)
}

/** 计算下一次复习的卡片状态 */
export function scheduleNext(
  card: Pick<SrsCard, 'box' | 'streak' | 'reviews'>,
  correct: boolean,
  today: number = dayStamp()
): Pick<SrsCard, 'box' | 'nextReview' | 'lastReview' | 'streak' | 'reviews'> {
  if (correct) {
    const newBox = Math.min(card.box + 1, MAX_BOX)
    const interval = BOX_INTERVALS[newBox]
    return {
      box: newBox,
      nextReview: today + interval,
      lastReview: today,
      streak: card.streak + 1,
      reviews: card.reviews + 1,
    }
  }
  // 答错:归零,10 分钟内再练(用 today 表示当天到期)
  return {
    box: 0,
    nextReview: today,
    lastReview: today,
    streak: 0,
    reviews: card.reviews + 1,
  }
}

/** 创建新卡(从未学过的词) */
export function createNewCard(en: string, today: number = dayStamp()): SrsCard {
  return {
    en,
    box: 0,
    nextReview: today, // 新词立即进入复习池
    lastReview: today,
    streak: 0,
    reviews: 0,
  }
}

/** 卡片是否到期(需要今天复习) */
export function isDue(card: Pick<SrsCard, 'nextReview'>, today: number = dayStamp()): boolean {
  return card.nextReview <= today
}

/**
 * 排序到期卡片:最紧迫的排前面。
 * 优先级:过期越久越优先 → box 越低越优先 → 最近没复习的优先
 */
export function sortDueCards<T extends Pick<SrsCard, 'box' | 'nextReview' | 'lastReview'>>(
  cards: T[],
  today: number = dayStamp()
): T[] {
  return [...cards].sort((a, b) => {
    // 过期越久(box 低的卡更可能被遗忘)优先
    const overdueA = today - a.nextReview
    const overdueB = today - b.nextReview
    if (overdueA !== overdueB) return overdueB - overdueA
    // box 低的优先(更不熟)
    if (a.box !== b.box) return a.box - b.box
    // 最近复习时间早的优先
    return a.lastReview - b.lastReview
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
