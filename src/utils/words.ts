/** 带 en 字段的最小单词结构（故事/课程/复习词共用） */
export interface HasEn {
  en: string
}

/**
 * 统计某词表中「已掌握」的数量。
 * 各页面原先都把这段代码（`words.filter(w => masteredWords.includes(w.en)).length`）
 * 散落多处，统一到此处，避免口径漂移与复制。
 */
export function countMastered(words: HasEn[], masteredWords: string[]): number {
  return words.filter((w) => masteredWords.includes(w.en)).length
}
