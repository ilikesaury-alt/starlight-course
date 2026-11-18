// Winnie the Witch 绘本阅读数据（整本按页读）
// 内容来源：用户自有正版绘本《Winnie the Witch》（Valerie Thomas 著 / Korky Paul 绘，
// HarperCollins 出版）。用户提供的 PDF 是 27 页全页扫描，无文本层，
// 经 OCR 提取 + 对照原图人工校对（修正 ABRAGADABRA→ABRACADABRA、dosed→closed、
// angway→anyway、Wibur→Wilbur、dlimbed→climbed、agan→again 等识别错误）+ 逐句中文翻译。
//
// ⚠️ 版权口径：与 Fly Guy 一致 —— 这是用户自有实体书，仅作合理使用展示，
//   不内置整本书。这里只放文字（逐句 en/zh），不含扫描图片。
//   原 PDF / EPUB 不进版本控制（见 .gitignore）。
//
// 结构：每页 = 一节「绘本原文」课（page = 原书页码）；纯插画页（4/6/11/18）
//   无正文，不收录。每句 { en, zh } 都必须有中文（ReadingZone 的 sentenceZh 兜底）。

import type { ReadingSentence } from './reading/index'
import type { Word } from './starlight'

export interface WinniePage {
  /** 原书页码（1 起），也是阅读器里的 lessonId */
  page: number
  sentences: ReadingSentence[]
  /** 这一页的关键词，用于点读高亮（单 token，可被 TappableWords 命中） */
  words: Word[]
}

export const WINNIE_PAGES: WinniePage[] = [
  {
    page: 3,
    sentences: [
      { en: 'Winnie the Witch lived in a black house in the forest.', zh: '女巫温妮住在森林里的一座黑房子里。' },
      { en: 'The house was black on the outside and black on the inside.', zh: '这座房子外面是黑的，里面也是黑的。' },
      { en: 'The carpets were black.', zh: '地毯是黑的。' },
      { en: 'The chairs were black.', zh: '椅子是黑的。' },
      { en: 'The bed was black, and it had black sheets and black blankets.', zh: '床是黑的，上面铺着黑色的床单和黑色的毯子。' },
      { en: 'Even the bathtub was black.', zh: '连浴缸都是黑的。' },
    ],
    words: [
      { en: 'black', zh: '黑色的', emoji: '⬛' },
      { en: 'house', zh: '房子', emoji: '🏠' },
      { en: 'forest', zh: '森林', emoji: '🌲' },
      { en: 'carpet', zh: '地毯', emoji: '🟫' },
      { en: 'bathtub', zh: '浴缸', emoji: '🛁' },
    ],
  },
  {
    page: 5,
    sentences: [
      { en: 'Winnie lived in her black house with her cat, Wilbur.', zh: '温妮和她的猫威尔伯一起住在黑房子里。' },
      { en: 'He was black too.', zh: '他也是黑的。' },
      { en: 'And that is how the trouble began.', zh: '麻烦就是从这儿开始的。' },
    ],
    words: [
      { en: 'cat', zh: '猫', emoji: '🐱' },
      { en: 'black', zh: '黑色的', emoji: '⬛' },
      { en: 'trouble', zh: '麻烦', emoji: '😵' },
      { en: 'began', zh: '开始（begin 的过去式）', emoji: '▶️' },
    ],
  },
  {
    page: 7,
    sentences: [
      { en: 'When Wilbur sat on a chair with his eyes open, Winnie could see him.', zh: '威尔伯睁着眼睛坐在椅子上时，温妮能看见他。' },
      { en: 'She could see his eyes, anyway.', zh: '不管怎样，她至少能看见他的眼睛。' },
    ],
    words: [
      { en: 'chair', zh: '椅子', emoji: '🪑' },
      { en: 'eyes', zh: '眼睛', emoji: '👀' },
      { en: 'open', zh: '睁开的', emoji: '👁️' },
      { en: 'see', zh: '看见', emoji: '👀' },
    ],
  },
  {
    page: 8,
    sentences: [
      { en: 'But when Wilbur closed his eyes and went to sleep, Winnie could not see him at all.', zh: '可是威尔伯闭上眼睛睡着以后，温妮就完全看不见他了。' },
      { en: 'So she sat on him.', zh: '结果她一屁股坐在了他身上。' },
    ],
    words: [
      { en: 'closed', zh: '闭上的', emoji: '😌' },
      { en: 'sleep', zh: '睡觉', emoji: '😴' },
      { en: 'sat', zh: '坐（sit 的过去式）', emoji: '🪑' },
    ],
  },
  {
    page: 9,
    sentences: [
      { en: 'When Wilbur sat on the carpet with his eyes open, Winnie could see him.', zh: '威尔伯睁着眼睛坐在地毯上时，温妮能看见他。' },
      { en: 'She could see his eyes, anyway.', zh: '不管怎样，她至少能看见他的眼睛。' },
    ],
    words: [
      { en: 'carpet', zh: '地毯', emoji: '🟫' },
      { en: 'eyes', zh: '眼睛', emoji: '👀' },
      { en: 'open', zh: '睁开的', emoji: '👁️' },
    ],
  },
  {
    page: 10,
    sentences: [
      { en: 'But when Wilbur closed his eyes and went to sleep, Winnie could not see him at all.', zh: '可是威尔伯闭上眼睛睡着以后，温妮就完全看不见他了。' },
      { en: 'So she tripped over him.', zh: '结果她被他绊了一跤。' },
    ],
    words: [
      { en: 'closed', zh: '闭上的', emoji: '😌' },
      { en: 'sleep', zh: '睡觉', emoji: '😴' },
      { en: 'tripped', zh: '绊倒', emoji: '🤸' },
    ],
  },
  {
    page: 12,
    sentences: [
      { en: 'One day, after a nasty fall, Winnie decided something had to be done.', zh: '有一天，重重地摔了一跤之后，温妮决定得做点什么了。' },
      { en: 'She picked up her magic wand, waved it once, and — ABRACADABRA!', zh: '她拿起魔杖，挥了一下，——阿布拉卡达布拉！' },
      { en: 'Wilbur was a black cat no longer.', zh: '威尔伯不再是一只黑猫了。' },
      { en: 'He was bright green!', zh: '他变成了亮绿色！' },
    ],
    words: [
      { en: 'magic', zh: '魔法', emoji: '✨' },
      { en: 'wand', zh: '魔杖', emoji: '📿' },
      { en: 'waved', zh: '挥动', emoji: '👋' },
      { en: 'green', zh: '绿色的', emoji: '🟢' },
      { en: 'fall', zh: '摔倒', emoji: '🤕' },
    ],
  },
  {
    page: 13,
    sentences: [
      { en: 'Now, when Wilbur slept on a chair, Winnie could see him.', zh: '现在，威尔伯睡在椅子上时，温妮能看见他。' },
      { en: 'When Wilbur slept on the floor, Winnie could see him.', zh: '威尔伯睡在地板上时，温妮也能看见他。' },
    ],
    words: [
      { en: 'slept', zh: '睡觉（sleep 的过去式）', emoji: '😴' },
      { en: 'chair', zh: '椅子', emoji: '🪑' },
      { en: 'floor', zh: '地板', emoji: '🟫' },
    ],
  },
  {
    page: 14,
    sentences: [
      { en: 'And she could see him when he slept on the bed.', zh: '他睡在床上时，她也能看见他。' },
      { en: 'But Wilbur was not allowed to sleep on the bed ...', zh: '可是威尔伯不许睡在床上……' },
    ],
    words: [
      { en: 'bed', zh: '床', emoji: '🛏️' },
      { en: 'allowed', zh: '被允许', emoji: '✅' },
      { en: 'slept', zh: '睡觉', emoji: '😴' },
    ],
  },
  {
    page: 15,
    sentences: [
      { en: 'So Winnie put him outside, outside in the grass.', zh: '于是温妮把他放到了外面，放到外面的草地上。' },
      { en: 'Winnie came hurrying outside, tripped over Wilbur, turned three somersaults, and fell into a rosebush.', zh: '温妮匆匆跑到外面，被威尔伯绊了一跤，翻了三个跟头，一头栽进了玫瑰丛里。' },
    ],
    words: [
      { en: 'outside', zh: '外面', emoji: '🌳' },
      { en: 'grass', zh: '草地', emoji: '🌿' },
      { en: 'rosebush', zh: '玫瑰丛', emoji: '🌹' },
      { en: 'fell', zh: '跌倒（fall 的过去式）', emoji: '🤕' },
    ],
  },
  {
    page: 16,
    sentences: [
      { en: "When Wilbur sat outside in the grass, Winnie could not see him, even when his eyes were wide open.", zh: '威尔伯坐在外面的草地上时，温妮看不见他，就算他把眼睛睁得大大的也看不见。' },
    ],
    words: [
      { en: 'outside', zh: '外面', emoji: '🌳' },
      { en: 'grass', zh: '草地', emoji: '🌿' },
      { en: 'wide', zh: '大大地', emoji: '📏' },
      { en: 'eyes', zh: '眼睛', emoji: '👀' },
    ],
  },
  {
    page: 17,
    sentences: [
      { en: 'This time, Winnie was furious.', zh: '这一回，温妮生气极了。' },
      { en: 'She picked up her magic wand, waved it five times, and ...', zh: '她拿起魔杖，挥了五下，然后……' },
    ],
    words: [
      { en: 'furious', zh: '暴怒的', emoji: '😤' },
      { en: 'wand', zh: '魔杖', emoji: '📿' },
      { en: 'waved', zh: '挥动', emoji: '👋' },
      { en: 'five', zh: '五', emoji: '5️⃣' },
    ],
  },
  {
    page: 19,
    sentences: [
      { en: 'ABRACADABRA!', zh: '阿布拉卡达布拉！' },
      { en: 'Wilbur had a red head, a yellow body, a pink tail, blue whiskers, and four purple legs.', zh: '威尔伯有着红红的头、黄黄的身体、粉红色的尾巴、蓝色的胡须，还有四条紫色的腿。' },
      { en: 'But his eyes were still green.', zh: '可是他的眼睛还是绿色的。' },
      { en: 'Now Winnie could see Wilbur when he sat on a chair, when he lay on the carpet, when he crawled into the grass ...', zh: '现在温妮能看见威尔伯了——他坐在椅子上时、趴在地毯上时、爬进草丛里时……' },
    ],
    words: [
      { en: 'red', zh: '红色的', emoji: '🔴' },
      { en: 'yellow', zh: '黄色的', emoji: '🟡' },
      { en: 'pink', zh: '粉色的', emoji: '🌸' },
      { en: 'blue', zh: '蓝色的', emoji: '🔵' },
      { en: 'purple', zh: '紫色的', emoji: '🟣' },
      { en: 'tail', zh: '尾巴', emoji: '🐾' },
    ],
  },
  {
    page: 20,
    sentences: [
      { en: 'And even when he climbed to the top of the tallest tree.', zh: '甚至他爬到最高的树顶上时，也能看见。' },
    ],
    words: [
      { en: 'climbed', zh: '爬', emoji: '🧗' },
      { en: 'top', zh: '顶端', emoji: '🔝' },
      { en: 'tallest', zh: '最高的', emoji: '📏' },
      { en: 'tree', zh: '树', emoji: '🌳' },
    ],
  },
  {
    page: 21,
    sentences: [
      { en: 'Wilbur climbed to the top of the tallest tree to hide.', zh: '威尔伯爬到最高的树顶上躲起来。' },
      { en: 'He looked ridiculous and he knew it.', zh: '他看上去滑稽极了，他自己也知道。' },
      { en: 'Even the birds laughed at him.', zh: '连小鸟都笑话他。' },
    ],
    words: [
      { en: 'hide', zh: '躲藏', emoji: '🙈' },
      { en: 'ridiculous', zh: '滑稽的', emoji: '🤪' },
      { en: 'birds', zh: '小鸟', emoji: '🐦' },
      { en: 'laughed', zh: '笑', emoji: '😂' },
    ],
  },
  {
    page: 22,
    sentences: [
      { en: 'Next morning, Wilbur was still up the tree.', zh: '第二天早上，威尔伯还在树上。' },
      { en: 'Winnie was worried.', zh: '温妮很担心。' },
      { en: 'She loved Wilbur and hated for him to be miserable.', zh: '她爱威尔伯，不忍心看他这么难受。' },
      { en: 'Wilbur was miserable.', zh: '威尔伯很难受。' },
      { en: 'He stayed at the top of the tree all day and all night.', zh: '他整天整夜待在树顶上。' },
    ],
    words: [
      { en: 'morning', zh: '早上', emoji: '🌅' },
      { en: 'worried', zh: '担心的', emoji: '😟' },
      { en: 'miserable', zh: '难受的', emoji: '😢' },
      { en: 'loved', zh: '爱', emoji: '❤️' },
      { en: 'night', zh: '夜晚', emoji: '🌙' },
    ],
  },
  {
    page: 23,
    sentences: [
      { en: 'Then Winnie had an idea.', zh: '后来，温妮想到了一个主意。' },
      { en: 'She waved her magic wand and ABRACADABRA!', zh: '她挥动魔杖，阿布拉卡达布拉！' },
      { en: 'Wilbur was a black cat once more.', zh: '威尔伯又变回了一只黑猫。' },
      { en: 'He came down from the tree, purring.', zh: '他打着呼噜从树上下来了。' },
    ],
    words: [
      { en: 'idea', zh: '主意', emoji: '💡' },
      { en: 'wand', zh: '魔杖', emoji: '📿' },
      { en: 'black', zh: '黑色的', emoji: '⬛' },
      { en: 'purring', zh: '打呼噜', emoji: '😸' },
    ],
  },
  {
    page: 24,
    sentences: [
      { en: 'Then Winnie waved her wand again, and again, and again.', zh: '然后温妮又挥了一下魔杖，再挥一下，再挥一下。' },
      { en: 'ABRACADABRA!', zh: '阿布拉卡达布拉！' },
    ],
    words: [
      { en: 'waved', zh: '挥动', emoji: '👋' },
      { en: 'wand', zh: '魔杖', emoji: '📿' },
      { en: 'again', zh: '再一次', emoji: '🔁' },
    ],
  },
  {
    page: 25,
    sentences: [
      { en: 'Now, instead of a black house, she had a yellow house with a red roof and a red door.', zh: '现在，她不再住黑房子了，而是一座黄色的房子，红屋顶、红门。' },
      { en: 'The chairs were white with red-and-white cushions.', zh: '椅子是白色的，配着红白相间的垫子。' },
      { en: 'The carpet was green with pink roses.', zh: '地毯是绿色的，上面绣着粉红色的玫瑰。' },
    ],
    words: [
      { en: 'yellow', zh: '黄色的', emoji: '🟡' },
      { en: 'roof', zh: '屋顶', emoji: '🏠' },
      { en: 'door', zh: '门', emoji: '🚪' },
      { en: 'white', zh: '白色的', emoji: '⚪' },
      { en: 'roses', zh: '玫瑰', emoji: '🌹' },
    ],
  },
  {
    page: 26,
    sentences: [
      { en: 'The bed was blue, with pink-and-white sheets and pink blankets.', zh: '床是蓝色的，配着粉白相间的床单和粉红色的毯子。' },
      { en: 'The bathtub was a gleaming white.', zh: '浴缸是闪亮的白色。' },
      { en: 'And now Winnie can see Wilbur no matter where he sits.', zh: '现在不管威尔伯坐在哪儿，温妮都能看见他了。' },
    ],
    words: [
      { en: 'blue', zh: '蓝色的', emoji: '🔵' },
      { en: 'bed', zh: '床', emoji: '🛏️' },
      { en: 'sheets', zh: '床单', emoji: '🛏️' },
      { en: 'blankets', zh: '毯子', emoji: '🧣' },
      { en: 'bathtub', zh: '浴缸', emoji: '🛁' },
    ],
  },
]

/** 整本书的词汇表（去重），供首页「宝藏词」示例与适配层查词用 */
export const WINNIE_VOCAB: Word[] = (() => {
  const seen = new Set<string>()
  const out: Word[] = []
  for (const p of WINNIE_PAGES) {
    for (const w of p.words) {
      if (seen.has(w.en)) continue
      seen.add(w.en)
      out.push(w)
    }
  }
  return out
})()
