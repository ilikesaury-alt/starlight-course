// 复习队列编排：保证句子框架卡（kind='sentence'）不被单词卡淹没。
//
// 问题背景：sortDueCards 按「逾期越久越优先」排序，而刚播种的卡片 overdue=0，
// 会排在所有已复习过的卡片之后。单词卡有 96 课的量（数百张），句子框架卡只有几张，
// 于是句子卡几乎永远进不了取前 N 的队列——T3.5 写了但到不了。
//
// 这里不改 getDueCards 的语义（它仍是「按到期排序取前 N」），
// 只在复习页做一次配额编排：给句子卡留出固定席位。

/** 句子卡在队列里至少占的比例（有句子卡时至少 1 张） */
export const SENTENCE_SHARE = 0.3

interface MaybeKinded {
  kind?: 'word' | 'sentence'
}

/**
 * 按配额截断到期卡片：先给句子卡留席，其余给单词卡，各自保持原有到期顺序。
 * - 卡片总数不超过 limit 时原样返回
 * - 没有句子卡时退化为纯截断（行为与原来一致）
 */
export function mixReviewQueue<T extends MaybeKinded>(cards: T[], limit: number): T[] {
  if (limit <= 0) return []
  if (cards.length <= limit) return cards

  const sentences = cards.filter((c) => c.kind === 'sentence')
  if (sentences.length === 0) return cards.slice(0, limit)

  const words = cards.filter((c) => c.kind !== 'sentence')
  // 句子卡席位：按比例分配，但至少 1 张（否则永远排不到）
  const sentenceQuota = Math.min(sentences.length, Math.max(1, Math.ceil(limit * SENTENCE_SHARE)))
  const wordQuota = Math.max(0, limit - sentenceQuota)

  // 单词卡不足 wordQuota 时，空出的席位回流给句子卡，
  // 否则「全是句子卡」时会只返回 sentenceQuota 张，远小于 limit。
  const usedWords = Math.min(words.length, wordQuota)
  const usedSentences = Math.min(sentences.length, limit - usedWords)

  return [...words.slice(0, usedWords), ...sentences.slice(0, usedSentences)]
}
