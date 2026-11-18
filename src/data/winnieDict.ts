// Winnie the Witch 绘本专属词汇表 —— 补齐 BOOK_WORD_ZH 未覆盖的词。
//
// 与 frogDict.ts 同理：Winnie 的 20 正文页 506 词次里有 60 词次（20 个词形）
// 查不到中文（主角 Winnie/Wilbur 各 18/19 次），点词只会显示「这句的意思」。
// 这里给出逐词释义，由 bookDict.ts 以「只补缺失键」方式合并，绝不覆盖既有词条。
//
// 出题安全：已验证这些词与 Starlight 课本原文（bookQuiz 唯一出题来源）无重叠。
// pinkandwhite / redandwhite 来自 "pink-and-white" / "red-and-white" —— TappableWords
// 按空白切词后 wordBase 去掉连字符得到，故作为整词收录。

export const WINNIE_DICT: Record<string, string> = {
  blankets: '毯子（复数）',
  carpet: '地毯',
  carpets: '地毯（复数）',
  cushions: '垫子（复数）',
  decided: '决定了',
  furious: '暴怒的',
  gleaming: '闪亮的',
  miserable: '难受的',
  pinkandwhite: '粉白相间的',
  purring: '打呼噜的',
  redandwhite: '红白相间的',
  ridiculous: '滑稽的',
  roof: '屋顶',
  rosebush: '玫瑰丛',
  sheets: '床单（复数）',
  somersaults: '跟头（复数）',
  whiskers: '胡须',
  wilbur: '威尔伯（黑猫的名字）',
  winnie: '温妮（女巫的名字）',
  witch: '女巫',
}
