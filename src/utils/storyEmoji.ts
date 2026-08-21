// 故事类模块（Fly Guy / Rocket Girl 等）共享的 emoji 选择机制。
// 规则表由各数据文件自行维护（内容不同是合理的），匹配逻辑统一在这里。

export interface EmojiRule {
  test: RegExp
  emoji: string
}

/**
 * 创建一个 emoji 选择器：按规则顺序对文本做正则匹配，命中即返回对应 emoji；
 * 全部未命中时，若 fallback 为数组则按 idx 轮询取值（用于故事标题），
 * 若为字符串则直接返回（配合空串占位可在外层再兜底，用于单词）。
 */
export function makeEmojiPicker(
  rules: readonly EmojiRule[],
  fallback: string | readonly string[]
): (text: string, idx?: number) => string {
  return (text, idx = 0) => {
    for (const { test, emoji } of rules) {
      if (test.test(text)) return emoji
    }
    if (Array.isArray(fallback)) return fallback[idx % fallback.length]
    return fallback
  }
}
