// 课文整句中文：点读区每一句下面要给整句翻译（点单词时也要同时显示整句中文）。
//
// 数据源优先级（先出现的赢）：
//   1. 课本原文 starlight-book 的 textZh —— 人工翻译，质量最高；
//   2. 本课 / 本单元句子表（lessons）的 en→zh —— 同样是人工翻译；
//   3. 都查不到时退回逐词词典拼接的粗释义（与 BookTextView 的 autoZh 同一套做法），
//      保证任何一句都有中文提示，只是可能不通顺。
//
// 匹配要跨数据源对齐：课本里是弯引号 What’s、 passage 里是 What's，
// 结尾标点 / 大小写 / 空白也常不一致，所以统一走 normLine 归一化。

import { lookupZh, wordBase } from './bookDict'

/** 归一化句子，用于跨数据源匹配（弯直引号、大小写、空白、结尾标点） */
export function normLine(s: string): string {
  return s
    // 弯引号 / 撇号 → 直引号（What’s → what's）
    .replace(/[\u2018\u2019\u201B\u02BC]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    // 去掉结尾标点（What do you have? → what do you have）
    .replace(/[.!?…。！？、,，:：;；]+$/, '')
    .trim()
}

/** 一组 (en, zh) 数据源，zh 可能缺失 */
export interface LineZhSource {
  en: string
  zh?: string
}

/**
 * 建立「归一化英文 → 中文」索引；先出现的数据源优先，后出现的不覆盖。
 * 入参按优先级从高到低传（课本 textZh → 本课句子 → 本单元句子）。
 */
export function buildLineZhIndex(sources: Array<Iterable<LineZhSource>>): Map<string, string> {
  const idx = new Map<string, string>()
  for (const src of sources) {
    for (const item of src) {
      const zh = item.zh?.trim()
      if (!zh) continue
      const key = normLine(item.en)
      if (key && !idx.has(key)) idx.set(key, zh)
    }
  }
  return idx
}

/**
 * 取整句中文：查索引 → 查不到就逐词词典拼接（粗略释义）→ 再没有返回 ''。
 * 返回值带 `auto` 标记，调用方可据此弱化样式。
 */
export function lineZhOf(index: Map<string, string>, line: string): { zh: string; auto: boolean } {
  const hit = index.get(normLine(line))
  if (hit) return { zh: hit, auto: false }
  const gloss = line
    .split(/\s+/)
    .map((tk) => lookupZh(wordBase(tk)))
    .filter(Boolean)
    .join(' ')
  return { zh: gloss, auto: true }
}
