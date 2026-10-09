// 句子框架卡（C）：从「整句输出」倒推的可填空句型。
// 覆盖全部 96 课（每课 1~2 个，共 98 个；Unit4 玩具单元与 Unit5 L3 为试点余量）。
// 卡片播种后与单词卡共用同一个复习池（SrsCard.kind='sentence' 区分）。
// 数据完整性（空位数/答案下标/单元课号/中文提示与选项对齐/每课覆盖）由 sentenceFrame.test.ts 把住。

export interface SentenceFrameBlank {
  /** 该空的正确候选（本课词表内），其余为干扰项 */
  options: string[]
  /** 正确答案在 options 中的下标 */
  answer: number
  /**
   * 每个候选对应的**整句**中文，与 options 等长、同序。
   * 换词时中文提示要跟着变（选 mouth 就显示「我有一张嘴。」而不是答案句「我有一个鼻子。」）。
   * 必须给整句而不是词对位的片段：中文语序 / 量词与英文选项不是一一对位
   * （Good night = 晚安，不是「晚好」；I have a mouth = 我有一张嘴，不是「我有一个嘴」），
   * 做模板替换会拼出病句，所以整句取用（见 frameZh）。
   */
  zhOptions: string[]
}

export interface SentenceFrame {
  /** 唯一 key */
  id: string
  /** 句型骨架，空位用 ___ 表示 */
  pattern: string
  blanks: SentenceFrameBlank[]
  /** 中文提示（= 全部取正确答案时的句子；未填空 / 智能复习揭晓时用它） */
  zh: string
  /** 给孩子的操作提示 */
  hint?: string
  /** 所属单元 slug */
  unitSlug: string
  /** 所属课号 */
  lessonId: number
}

/** 句型里的空位数 */
export function countBlanks(pattern: string): number {
  return pattern.split('___').length - 1
}

/**
 * 句子卡的 key（与单词卡 en 空间隔离）。
 *
 * 用框架自身的 id 而非 pattern 的散列：多个单元会共用同一句型
 * （如 Unit2 的 "This is a ___." 与 Unit4 的 "This is a ___."），
 * 若以 pattern 为键，它们会塔成同一张卡，后播种的覆盖先播种的，
 * 卡片归属单元与中文提示都变得不确定。id 在数据完整性测试中保证全局唯一。
 */
export function frameCardKey(f: SentenceFrame): string {
  return `frame:${f.id}`
}

/** 用某组选择填空，得到完整句子（供跟读评分）
 *  pattern 被 ___ 切成 seg0 ___ seg1 ___ seg2，空内填词应插在「前一段之后、后一段之前」，
 *  即 seg0 + word0 + seg1 + word1 + seg2（不是 seg0 + seg1 + word…）。 */
export function fillFrame(f: SentenceFrame, picks: number[]): string {
  return f.pattern
    .split('___')
    .map((seg, idx) => {
      if (idx === 0) return seg
      const blank = f.blanks[idx - 1]
      if (!blank) return `${seg}___`
      const pick = picks[idx - 1] ?? blank.answer
      return `${blank.options[pick] ?? blank.options[blank.answer]}${seg}`
    })
    .join('')
}

/**
 * 当前选择对应的中文提示：换词时中文跟着换。
 * 未填 / 下标越界时回退到答案句 f.zh（与 fillFrame 的英文默认态保持一致）。
 *
 * zhOptions 给的是整句（见 SentenceFrameBlank.zhOptions 注释），因此只能整句取用，
 * 现有 26 个框架都是单空（数据测试把住 blanks.length <= 1）；多空需要组合语义时再扩展。
 */
export function frameZh(f: SentenceFrame, picks: number[]): string {
  const b = f.blanks[0]
  if (!b) return f.zh
  const p = picks[0]
  if (p == null || p < 0 || p >= b.options.length) return f.zh
  return b.zhOptions[p] || f.zh
}

/**
 * 句型框架卡（C）：从「整句输出」倒推的可填空句型。
 * 覆盖 12 个单元全部 96 课，每课至少 1 个（共 98 个）。
 *
 * 为什么从「每单元 2 个」扩到「每课 1 个」：原试点只给每单元挑 2 课挂卡，
 * 其余课点开「🧩 句型」只有一句「这一课还没有句型框架卡。」——孩子学到那课
 * 就没有句型练习可做。扩量后每课点开都有内容，且复习池不会因此膨胀：
 * 框架卡是在**打开某一课时**才播种进复习池的（见 LessonPreview 的
 * seedSentenceFrames effect）， pool 里只有孩子真正学过的课的卡，
 * 没学过的课不会提前占用复习席位。
 *
 * 设计约束：
 *   · pattern 必须是该课真实出现的句型（对照 lessons.ts 的 sentences）；
 *   · 正确答案取自该课词表，干扰项同属该单元，避免跨单元的无效干扰；
 *   · zhOptions 与 options 同长同序，逐词写整句中文（换词时中文提示跟着变）；
 *   · 只有 1 个空位（frameZh 只支持单空，zhOptions 给的是整句）；
 *     少数课全是 "A or B?" 二选一句型（无法只空一侧），用零空位框架让孩子整句跟读。
 */
export const STARLIGHT_FRAMES: SentenceFrame[] = [
  // === Unit 1 Hello! ===
  {
    id: 'u1l1-state',
    pattern: "I'm ___.",
    blanks: [
      {
        options: ['good', 'great', 'fine', 'sad'],
        answer: 0,
        zhOptions: ['我很好。', '我很棒。', '我还不错。', '我很难过。'],
      },
    ],
    zh: '我很好。',
    hint: '别人问 How are you?，你怎么回答？',
    unitSlug: 'hello',
    lessonId: 1,
  },
  {
    id: 'u1l2-greeting',
    pattern: 'Good ___.',
    blanks: [
      {
        options: ['morning', 'afternoon', 'evening', 'night'],
        answer: 0,
        zhOptions: ['早上好。', '下午好。', '晚上好。', '晚安。'],
      },
    ],
    zh: '早上好。',
    hint: '一天里有三个时段',
    unitSlug: 'hello',
    lessonId: 2,
  },

  // === Unit 1 其余课（每课 1 个，保证点开「句型」就有内容） ===
  {
    id: 'u1l3-mirror',
    pattern: 'Look at the ___.',
    blanks: [
      {
        options: ['mirror', 'boy', 'girl'],
        answer: 0,
        zhOptions: ['看镜子。', '看那个男孩。', '看那个女孩。'],
      },
    ],
    zh: '看镜子。',
    hint: '指着一样东西，说出它的名字',
    unitSlug: 'hello',
    lessonId: 3,
  },
  {
    id: 'u1l4-red',
    pattern: "It's ___.",
    blanks: [
      {
        options: ['red', 'yellow', 'blue', 'green'],
        answer: 0,
        zhOptions: ['是红色的。', '是黄色的。', '是蓝色的。', '是绿色的。'],
      },
    ],
    zh: '是红色的。',
    hint: '指着一样东西，说出它的颜色',
    unitSlug: 'hello',
    lessonId: 4,
  },
  {
    id: 'u1l5-mix',
    pattern: 'Blue and yellow make ___.',
    blanks: [
      {
        options: ['green', 'orange', 'purple', 'red'],
        answer: 0,
        zhOptions: [
          '蓝色加黄色变成绿色。',
          '蓝色加黄色变成橙色。',
          '蓝色加黄色变成紫色。',
          '蓝色加黄色变成红色。',
        ],
      },
    ],
    zh: '蓝色加黄色变成绿色。',
    hint: '两种颜色混在一起，会变成什么？',
    unitSlug: 'hello',
    lessonId: 5,
  },
  {
    id: 'u1l6-name',
    pattern: "What's your ___?",
    blanks: [
      {
        options: ['name', 'color', 'number'],
        answer: 0,
        zhOptions: ['你叫什么名字？', '它是什么颜色？', '它是几号？'],
      },
    ],
    zh: '你叫什么名字？',
    hint: '问问新朋友的名字',
    unitSlug: 'hello',
    lessonId: 6,
  },
  {
    id: 'u1l7-missing',
    pattern: '___ is missing.',
    blanks: [
      {
        options: ['Five', 'Three', 'Two', 'Four'],
        answer: 0,
        zhOptions: ['五不见了。', '三不见了。', '二不见了。', '四不见了。'],
      },
    ],
    zh: '五不见了。',
    hint: '看看哪个数字不见了',
    unitSlug: 'hello',
    lessonId: 7,
  },
  {
    id: 'u1l8-after',
    pattern: '___ comes after it.',
    blanks: [
      {
        options: ['3', '5', '7', '10'],
        answer: 0,
        zhOptions: ['3在它后面。', '5在它后面。', '7在它后面。', '10在它后面。'],
      },
    ],
    zh: '3在它后面。',
    hint: '排好顺序，说说谁排在后面',
    unitSlug: 'hello',
    lessonId: 8,
  },

  // === Unit 2 Animals ===
  {
    id: 'u2l2-this',
    pattern: 'This is a ___.',
    blanks: [
      {
        options: ['cow', 'pig', 'duck', 'elephant'],
        answer: 0,
        zhOptions: ['这是一头牛。', '这是一头猪。', '这是一只鸭子。', '这是一头大象。'],
      },
    ],
    zh: '这是一头牛。',
    unitSlug: 'animals',
    lessonId: 2,
  },
  {
    id: 'u2l3-see',
    pattern: 'I see a ___.',
    blanks: [
      {
        options: ['panda', 'tiger', 'monkey', 'lion'],
        answer: 0,
        zhOptions: ['我看见一只熊猫。', '我看见一只老虎。', '我看见一只猴子。', '我看见一只狮子。'],
      },
    ],
    zh: '我看见一只熊猫。',
    unitSlug: 'animals',
    lessonId: 3,
  },

  // === Unit 2 其余课 ===
  {
    id: 'u2l1-like',
    pattern: 'I like the ___.',
    blanks: [
      {
        options: ['cat', 'dog', 'rabbit', 'hamster'],
        answer: 0,
        zhOptions: ['我喜欢猫。', '我喜欢狗。', '我喜欢兔子。', '我喜欢仓鼠。'],
      },
    ],
    zh: '我喜欢猫。',
    hint: '说说你喜欢哪个宠物',
    unitSlug: 'animals',
    lessonId: 1,
  },
  {
    id: 'u2l4-turtle',
    pattern: 'This is a ___.',
    blanks: [
      {
        options: ['turtle', 'fish', 'dolphin', 'seahorse'],
        answer: 0,
        zhOptions: ['这是一只海龟。', '这是一条鱼。', '这是一只海豚。', '这是一匹海马。'],
      },
    ],
    zh: '这是一只海龟。',
    hint: '海洋里有什么动物？',
    unitSlug: 'animals',
    lessonId: 4,
  },
  {
    id: 'u2l5-bugs',
    pattern: 'I see 3 ___.',
    blanks: [
      {
        options: ['butterflies', 'bees', 'spiders', 'caterpillars'],
        answer: 0,
        zhOptions: ['我看到3只蝴蝶。', '我看到3只蜜蜂。', '我看到3只蜘蛛。', '我看到3条毛毛虫。'],
      },
    ],
    zh: '我看到3只蝴蝶。',
    hint: '先数一数，再说出整句',
    unitSlug: 'animals',
    lessonId: 5,
  },
  {
    id: 'u2l6-ocean',
    pattern: 'What animals can you see in the ___?',
    blanks: [
      {
        options: ['ocean', 'zoo', 'farm'],
        answer: 0,
        zhOptions: [
          '你能在海洋里看到什么动物？',
          '你能在动物园里看到什么动物？',
          '你能在农场里看到什么动物？',
        ],
      },
    ],
    zh: '你能在海洋里看到什么动物？',
    unitSlug: 'animals',
    lessonId: 6,
  },
  {
    id: 'u2l7-plus',
    pattern: '4 plus 4 equals ___.',
    blanks: [
      {
        options: ['8', '6', '5', '10'],
        answer: 0,
        zhOptions: ['4加4等于8。', '4加4等于6。', '4加4等于5。', '4加4等于10。'],
      },
    ],
    zh: '4加4等于8。',
    hint: '算一算，再把整句读出来',
    unitSlug: 'animals',
    lessonId: 7,
  },
  {
    id: 'u2l8-next',
    pattern: 'The ___ comes next.',
    blanks: [
      {
        options: ['cat', 'dog', 'rabbit', 'pig'],
        answer: 0,
        zhOptions: ['下一个是猫。', '下一个是狗。', '下一个是兔子。', '下一个是猪。'],
      },
    ],
    zh: '下一个是猫。',
    hint: '找出规律，说说下一个是谁',
    unitSlug: 'animals',
    lessonId: 8,
  },

  // === Unit 3 Food & Drinks ===
  {
    id: 'u3l1-fruit',
    pattern: "It's an ___.",
    blanks: [
      {
        options: ['apple', 'orange', 'banana', 'pear'],
        answer: 0,
        zhOptions: ['这是一个苹果。', '这是一个橘子。', '这是一根香蕉。', '这是一个梨。'],
      },
    ],
    zh: '这是一个苹果。',
    unitSlug: 'food',
    lessonId: 1,
  },
  {
    id: 'u3l3-drink',
    pattern: 'This is ___.',
    blanks: [
      {
        options: ['milk', 'water', 'juice', 'tea'],
        answer: 0,
        zhOptions: ['这是牛奶。', '这是水。', '这是果汁。', '这是茶。'],
      },
    ],
    zh: '这是牛奶。',
    unitSlug: 'food',
    lessonId: 3,
  },

  // === Unit 3 其余课 ===
  {
    id: 'u3l2-banana',
    pattern: "It's a yellow ___.",
    blanks: [
      {
        options: ['banana', 'cherry', 'orange', 'strawberry'],
        answer: 0,
        zhOptions: ['它是一根黄香蕉。', '它是一颗黄樱桃。', '它是一个黄橙子。', '它是一颗黄草莓。'],
      },
    ],
    zh: '它是一根黄香蕉。',
    hint: '说出水果的名字和颜色',
    unitSlug: 'food',
    lessonId: 2,
  },
  {
    id: 'u3l4-broccoli',
    pattern: 'I want ___.',
    blanks: [
      {
        options: ['broccoli', 'potatoes', 'tomatoes', 'celery'],
        answer: 0,
        zhOptions: ['我要西兰花。', '我要土豆。', '我要番茄。', '我要芹菜。'],
      },
    ],
    zh: '我要西兰花。',
    hint: '买菜的时候说「我要……」',
    unitSlug: 'food',
    lessonId: 4,
  },
  {
    id: 'u3l5-carrots',
    pattern: 'I like ___.',
    blanks: [
      {
        options: ['carrots', 'cucumbers', 'lettuce', 'beans'],
        answer: 0,
        zhOptions: ['我喜欢胡萝卜。', '我喜欢黄瓜。', '我喜欢生菜。', '我喜欢豆子。'],
      },
    ],
    zh: '我喜欢胡萝卜。',
    hint: '说说你喜欢哪种蔬菜',
    unitSlug: 'food',
    lessonId: 5,
  },
  {
    id: 'u3l6-fruit',
    pattern: 'What ___ do you like?',
    blanks: [
      {
        options: ['fruit', 'vegetable', 'drink', 'color'],
        answer: 0,
        zhOptions: ['你喜欢什么水果？', '你喜欢什么蔬菜？', '你喜欢什么饮料？', '你喜欢什么颜色？'],
      },
    ],
    zh: '你喜欢什么水果？',
    unitSlug: 'food',
    lessonId: 6,
  },
  {
    id: 'u3l7-want',
    pattern: 'What do you ___?',
    blanks: [
      {
        options: ['want', 'like', 'eat', 'see'],
        answer: 0,
        zhOptions: ['你想要什么？', '你喜欢什么？', '你想吃什么？', '你想看到什么？'],
      },
    ],
    zh: '你想要什么？',
    hint: '问小朋友想吃什么零食',
    unitSlug: 'food',
    lessonId: 7,
  },
  {
    id: 'u3l8-these',
    pattern: 'Do you want ___?',
    blanks: [
      {
        options: ['these', 'those', 'popcorn', 'candy'],
        answer: 0,
        zhOptions: ['你想要这些吗？', '你想要那些吗？', '你想要爆米花吗？', '你想要糖果吗？'],
      },
    ],
    zh: '你想要这些吗？',
    unitSlug: 'food',
    lessonId: 8,
  },

  // === Unit 4 Toys & Fun（试点，4 个） ===
  {
    id: 'u4l1-own',
    pattern: 'I have a ___.',
    blanks: [
      {
        options: ['doll', 'blocks', 'puzzle', 'bus'],
        answer: 0,
        zhOptions: ['我有一个洋娃娃。', '我有一套积木。', '我有一个拼图。', '我有一辆公交车。'],
      },
    ],
    zh: '我有一个洋娃娃。',
    hint: '先听示范，再说出整句',
    unitSlug: 'toys',
    lessonId: 1,
  },
  {
    id: 'u4l2-want',
    pattern: 'I want a ___.',
    blanks: [
      {
        options: ['car', 'train', 'spoon', 'book'],
        answer: 0,
        zhOptions: ['我想要一辆小汽车。', '我想要一列火车。', '我想要一把勺子。', '我想要一本书。'],
      },
    ],
    zh: '我想要一辆小汽车。',
    hint: '换一个玩具，句子还一样',
    unitSlug: 'toys',
    lessonId: 2,
  },
  {
    id: 'u4l2-which',
    pattern: 'Which toy do you want?',
    blanks: [],
    zh: '你想要哪个玩具？',
    hint: '整句问答，不用填空',
    unitSlug: 'toys',
    lessonId: 2,
  },
  {
    id: 'u4l4-this-is',
    pattern: 'This is ___.',
    blanks: [
      {
        options: ['Spiderman', 'Superman', 'princess', 'robot'],
        answer: 0,
        zhOptions: ['这是蜘蛛侠。', '这是超人。', '这是一位公主。', '这是一个机器人。'],
      },
    ],
    zh: '这是蜘蛛侠。',
    hint: '介绍你最喜欢的角色',
    unitSlug: 'toys',
    lessonId: 4,
  },

  // === Unit 4 其余课 ===
  {
    id: 'u4l3-sorry',
    pattern: "I'm ___.",
    blanks: [
      {
        options: ['sorry', 'okay', 'happy', 'sad'],
        answer: 0,
        zhOptions: ['对不起。', '没关系。', '我很开心。', '我很难过。'],
      },
    ],
    zh: '对不起。',
    hint: '不小心碰到别人时说什么？',
    unitSlug: 'toys',
    lessonId: 3,
  },
  {
    id: 'u4l5-piano',
    pattern: "It's a ___.",
    blanks: [
      {
        options: ['piano', 'violin', 'guitar', 'flute'],
        answer: 0,
        zhOptions: ['这是一架钢琴。', '这是一把小提琴。', '这是一把吉他。', '这是一支长笛。'],
      },
    ],
    zh: '这是一架钢琴。',
    hint: '听听声音，说出乐器的名字',
    unitSlug: 'toys',
    lessonId: 5,
  },
  {
    id: 'u4l6-have',
    pattern: 'What toys do you ___?',
    blanks: [
      {
        options: ['have', 'want', 'see', 'like'],
        answer: 0,
        zhOptions: ['你有什么玩具？', '你想要什么玩具？', '你看到什么玩具？', '你喜欢什么玩具？'],
      },
    ],
    zh: '你有什么玩具？',
    unitSlug: 'toys',
    lessonId: 6,
  },
  {
    id: 'u4l7-play',
    pattern: 'I can play the ___.',
    blanks: [
      {
        options: ['guitar', 'violin', 'flute', 'piano'],
        answer: 0,
        zhOptions: ['我会弹吉他。', '我会拉小提琴。', '我会吹长笛。', '我会弹钢琴。'],
      },
    ],
    zh: '我会弹吉他。',
    hint: '表演时间，说说你会什么乐器',
    unitSlug: 'toys',
    lessonId: 7,
  },
  {
    id: 'u4l8-takeaway',
    pattern: '5 take away 2 is ___.',
    blanks: [
      {
        options: ['3', '7', '4', '6'],
        answer: 0,
        zhOptions: ['5减去2等于3。', '5减去2等于7。', '5减去2等于4。', '5减去2等于6。'],
      },
    ],
    zh: '5减去2等于3。',
    hint: '算一算，再把剩下的读出来',
    unitSlug: 'toys',
    lessonId: 8,
  },

  // === Unit 5 Opposites ===
  {
    id: 'u5l1-size',
    pattern: "It's ___.",
    blanks: [
      {
        options: ['big', 'small', 'long', 'tall'],
        answer: 0,
        zhOptions: ['它很大。', '它很小。', '它很长。', '它很高。'],
      },
    ],
    zh: '它很大。',
    unitSlug: 'opposites',
    lessonId: 1,
  },
  {
    // 挂在 L3：'The rabbit is fast.' 是 Unit5 L3 Running Race 的句子，
    // 试点期误挂到 L4（Is It Good），会让 L4 出现本课没学过的句型。
    id: 'u5l3-rabbit',
    pattern: 'The rabbit is ___.',
    blanks: [
      {
        options: ['fast', 'slow', 'loud', 'quiet'],
        answer: 0,
        zhOptions: ['兔子很快。', '兔子很慢。', '兔子很吵。', '兔子很安静。'],
      },
    ],
    zh: '兔子很快。',
    unitSlug: 'opposites',
    lessonId: 3,
  },

  // === Unit 5 其余课 ===
  {
    id: 'u5l2-quiet',
    pattern: "It's ___.",
    blanks: [
      {
        options: ['quiet', 'loud', 'big', 'small'],
        answer: 0,
        zhOptions: ['很安静。', '很大声。', '很大。', '很小。'],
      },
    ],
    zh: '很安静。',
    hint: '图书馆里要安安静静的',
    unitSlug: 'opposites',
    lessonId: 2,
  },
  {
    id: 'u5l3-slow',
    pattern: 'The ___ is slow.',
    blanks: [
      {
        options: ['turtle', 'rabbit', 'cat', 'dog'],
        answer: 0,
        zhOptions: ['乌龟很慢。', '兔子很慢。', '猫很慢。', '狗很慢。'],
      },
    ],
    zh: '乌龟很慢。',
    hint: '龟兔赛跑里谁慢吞吞？',
    unitSlug: 'opposites',
    lessonId: 3,
  },
  {
    // 本课全是 "Is it A or B?" 二选一句型，只空一侧会拼出「它是好还是大？」这类怪句，
    // 因此用零空位框架：孩子看着整句直接跟读（同 u4l2-which / u5l6-or）。
    id: 'u5l4-or',
    pattern: 'Is it good or bad?',
    blanks: [],
    zh: '它是好还是坏？',
    hint: '二选一，整句说出来',
    unitSlug: 'opposites',
    lessonId: 4,
  },
  {
    id: 'u5l5-thin',
    pattern: "It's a ___ cat.",
    blanks: [
      {
        options: ['thin', 'fat', 'big', 'small'],
        answer: 0,
        zhOptions: ['这是一只瘦猫。', '这是一只胖猫。', '这是一只大猫。', '这是一只小猫。'],
      },
    ],
    zh: '这是一只瘦猫。',
    hint: '比比哪只猫瘦、哪只猫胖',
    unitSlug: 'opposites',
    lessonId: 5,
  },
  {
    // 本课全是 "Is it A or B?" 二选一句型，只空一侧会拼出「它是快还是小？」这类怪句，
    // 因此用零空位框架：孩子看着整句直接跟读（同 u4l2-which）。
    id: 'u5l6-or',
    pattern: 'Is it big or small?',
    blanks: [],
    zh: '它是大还是小？',
    hint: '二选一，整句说出来',
    unitSlug: 'opposites',
    lessonId: 6,
  },
  {
    id: 'u5l7-happy',
    pattern: "I'm ___.",
    blanks: [
      {
        options: ['happy', 'sad', 'fine', 'good'],
        answer: 0,
        zhOptions: ['我很开心。', '我很难过。', '我还不错。', '我很好。'],
      },
    ],
    zh: '我很开心。',
    hint: '今天你是什么心情？',
    unitSlug: 'opposites',
    lessonId: 7,
  },
  {
    id: 'u5l8-cold',
    pattern: "It's ___.",
    blanks: [
      {
        options: ['cold', 'hot', 'big', 'small'],
        answer: 0,
        zhOptions: ['很冷。', '很热。', '很大。', '很小。'],
      },
    ],
    zh: '很冷。',
    hint: '雪人是什么感觉的？',
    unitSlug: 'opposites',
    lessonId: 8,
  },

  // === Unit 6 My Body ===
  {
    id: 'u6l1-face',
    pattern: 'I have a ___.',
    blanks: [
      {
        options: ['nose', 'mouth', 'ear', 'eye'],
        answer: 0,
        zhOptions: ['我有一个鼻子。', '我有一张嘴。', '我有一只耳朵。', '我有一只眼睛。'],
      },
    ],
    zh: '我有一个鼻子。',
    unitSlug: 'body',
    lessonId: 1,
  },
  {
    id: 'u6l4-can',
    pattern: 'I can ___.',
    blanks: [
      {
        options: ['run', 'walk', 'jump', 'swim'],
        answer: 0,
        zhOptions: ['我能跑。', '我能走。', '我能跳。', '我能游泳。'],
      },
    ],
    zh: '我能跑。',
    unitSlug: 'body',
    lessonId: 4,
  },

  // === Unit 6 其余课 ===
  {
    id: 'u6l2-can-sing',
    pattern: 'I can ___.',
    blanks: [
      {
        options: ['sing', 'eat', 'drink', 'smell'],
        answer: 0,
        zhOptions: ['我会唱歌。', '我会吃。', '我会喝。', '我会闻。'],
      },
    ],
    zh: '我会唱歌。',
    hint: '嘴巴能做什么？',
    unitSlug: 'body',
    lessonId: 2,
  },
  {
    id: 'u6l3-touch',
    pattern: 'Touch your ___!',
    blanks: [
      {
        options: ['feet', 'hands', 'arms', 'legs'],
        answer: 0,
        zhOptions: ['摸摸你的脚！', '摸摸你的手！', '摸摸你的胳膊！', '摸摸你的腿！'],
      },
    ],
    zh: '摸摸你的脚！',
    hint: '听到就做，边做边说',
    unitSlug: 'body',
    lessonId: 3,
  },
  {
    id: 'u6l5-draw',
    pattern: 'I can ___.',
    blanks: [
      {
        options: ['draw', 'paint', 'write', 'read'],
        answer: 0,
        zhOptions: ['我会画画。', '我会涂色画画。', '我会写字。', '我会读书。'],
      },
    ],
    zh: '我会画画。',
    hint: '小手会变什么魔法？',
    unitSlug: 'body',
    lessonId: 5,
  },
  {
    id: 'u6l6-what',
    pattern: 'What can you ___?',
    blanks: [
      {
        options: ['do', 'eat', 'see', 'play'],
        answer: 0,
        zhOptions: ['你会做什么？', '你会吃什么？', '你会看到什么？', '你会玩什么？'],
      },
    ],
    zh: '你会做什么？',
    unitSlug: 'body',
    lessonId: 6,
  },
  {
    id: 'u6l7-dance',
    pattern: "Let's ___.",
    blanks: [
      {
        options: ['dance', 'bend', 'spin', 'sing'],
        answer: 0,
        zhOptions: ['我们跳舞吧。', '我们弯一弯。', '我们转一转。', '我们唱歌吧。'],
      },
    ],
    zh: '我们跳舞吧。',
    hint: '跟着音乐做动作，说出整句',
    unitSlug: 'body',
    lessonId: 7,
  },
  {
    id: 'u6l8-eyes',
    pattern: 'I have two ___.',
    blanks: [
      {
        options: ['eyes', 'hands', 'feet', 'ears'],
        answer: 0,
        zhOptions: ['我有两只眼睛。', '我有两只手。', '我有两只脚。', '我有两只耳朵。'],
      },
    ],
    zh: '我有两只眼睛。',
    hint: '指着自己说一说',
    unitSlug: 'body',
    lessonId: 8,
  },

  // === Unit 7 My Home ===
  {
    id: 'u7l1-bedroom',
    pattern: 'There is a ___.',
    blanks: [
      {
        options: ['bed', 'pillow', 'picture', 'window'],
        answer: 0,
        zhOptions: ['有一张床。', '有一个枕头。', '有一幅画。', '有一扇窗户。'],
      },
    ],
    zh: '有一张床。',
    unitSlug: 'home',
    lessonId: 1,
  },
  {
    id: 'u7l2-living',
    pattern: 'There is a ___.',
    blanks: [
      {
        options: ['sofa', 'clock', 'table', 'lamp'],
        answer: 0,
        zhOptions: ['有一个沙发。', '有一个钟。', '有一张桌子。', '有一盏台灯。'],
      },
    ],
    zh: '有一个沙发。',
    unitSlug: 'home',
    lessonId: 2,
  },

  // === Unit 7 其余课 ===
  {
    id: 'u7l3-tub',
    pattern: 'Is there a ___?',
    blanks: [
      {
        options: ['tub', 'sink', 'toilet', 'mirror'],
        answer: 0,
        zhOptions: ['有浴缸吗？', '有洗手池吗？', '有马桶吗？', '有镜子吗？'],
      },
    ],
    zh: '有浴缸吗？',
    hint: '浴室里会有什么？',
    unitSlug: 'home',
    lessonId: 3,
  },
  {
    id: 'u7l4-shovel',
    pattern: 'There is a ___.',
    blanks: [
      {
        options: ['shovel', 'table', 'clock', 'lamp'],
        answer: 0,
        zhOptions: ['有一把铲子。', '有一张桌子。', '有一个时钟。', '有一盏台灯。'],
      },
    ],
    zh: '有一把铲子。',
    hint: '花园里会放什么？',
    unitSlug: 'home',
    lessonId: 4,
  },
  {
    id: 'u7l5-stove',
    pattern: 'There is a ___.',
    blanks: [
      {
        options: ['stove', 'knife', 'pan', 'cupboard'],
        answer: 0,
        zhOptions: ['有一个炉子。', '有一把刀。', '有一个平底锅。', '有一个橱柜。'],
      },
    ],
    zh: '有一个炉子。',
    hint: '厨房里有什么？',
    unitSlug: 'home',
    lessonId: 5,
  },
  {
    id: 'u7l6-room',
    pattern: 'What is there in the ___?',
    blanks: [
      {
        options: ['bedroom', 'kitchen', 'bathroom', 'garden'],
        answer: 0,
        zhOptions: ['卧室里有什么？', '厨房里有什么？', '浴室里有什么？', '花园里有什么？'],
      },
    ],
    zh: '卧室里有什么？',
    unitSlug: 'home',
    lessonId: 6,
  },
  {
    id: 'u7l7-book',
    pattern: 'There is a red ___.',
    blanks: [
      {
        options: ['book', 'desk', 'lamp', 'bookshelf'],
        answer: 0,
        zhOptions: ['有一本红色的书。', '有一张红色的书桌。', '有一盏红色的台灯。', '有一个红色的书架。'],
      },
    ],
    zh: '有一本红色的书。',
    hint: '书房里有什么？',
    unitSlug: 'home',
    lessonId: 7,
  },
  {
    id: 'u7l8-tv',
    pattern: 'There is a TV in the ___.',
    blanks: [
      {
        options: ['living room', 'bedroom', 'kitchen', 'bathroom'],
        answer: 0,
        zhOptions: [
          '客厅里有一台电视。',
          '卧室里有一台电视。',
          '厨房里有一台电视。',
          '浴室里有一台电视。',
        ],
      },
    ],
    zh: '客厅里有一台电视。',
    hint: '东西在哪一个房间？',
    unitSlug: 'home',
    lessonId: 8,
  },

  // === Unit 8 Food Groups ===
  {
    id: 'u8l1-fruit',
    pattern: "I'd like ___.",
    blanks: [
      {
        options: ['kiwifruit', 'pineapples', 'apples', 'bananas'],
        answer: 0,
        zhOptions: ['我想要猕猴桃。', '我想要一些菠萝。', '我想要一些苹果。', '我想要一些香蕉。'],
      },
    ],
    zh: '我想要猕猴桃。',
    unitSlug: 'food-groups',
    lessonId: 1,
  },
  {
    id: 'u8l2-veg',
    pattern: 'I want ___.',
    blanks: [
      {
        options: ['cauliflowers', 'pumpkins', 'carrots', 'beans'],
        answer: 0,
        zhOptions: ['我想要花椰菜。', '我想要一些南瓜。', '我想要一些胡萝卜。', '我想要一些豆角。'],
      },
    ],
    zh: '我想要花椰菜。',
    unitSlug: 'food-groups',
    lessonId: 2,
  },

  // === Unit 8 其余课 ===
  {
    id: 'u8l3-crab',
    pattern: "I'd like a ___.",
    blanks: [
      {
        options: ['crab', 'squid', 'oyster', 'shrimp'],
        answer: 0,
        zhOptions: ['我想要一只螃蟹。', '我想要一只鱿鱼。', '我想要一只牡蛎。', '我想要一只虾。'],
      },
    ],
    zh: '我想要一只螃蟹。',
    hint: '点餐时说「我想要……」',
    unitSlug: 'food-groups',
    lessonId: 3,
  },
  {
    id: 'u8l4-choco',
    pattern: 'I want ___.',
    blanks: [
      {
        options: ['chocolate', 'raisins', 'nori', 'cookies'],
        answer: 0,
        zhOptions: ['我想要巧克力。', '我想要葡萄干。', '我想要海苔。', '我想要饼干。'],
      },
    ],
    zh: '我想要巧克力。',
    hint: '想吃哪种零食？',
    unitSlug: 'food-groups',
    lessonId: 4,
  },
  {
    id: 'u8l5-chinese',
    pattern: 'Do you like ___?',
    blanks: [
      {
        options: ['Chinese food', 'dumplings', 'noodles', 'rice'],
        answer: 0,
        zhOptions: ['你喜欢中国食物吗？', '你喜欢饺子吗？', '你喜欢面条吗？', '你喜欢米饭吗？'],
      },
    ],
    zh: '你喜欢中国食物吗？',
    unitSlug: 'food-groups',
    lessonId: 5,
  },
  {
    id: 'u8l6-like',
    pattern: 'What do you ___?',
    blanks: [
      {
        options: ['want', 'like', 'eat', 'see'],
        answer: 0,
        zhOptions: ['你想要什么？', '你喜欢什么？', '你想吃什么？', '你想看到什么？'],
      },
    ],
    zh: '你想要什么？',
    unitSlug: 'food-groups',
    lessonId: 6,
  },
  {
    id: 'u8l7-fish',
    pattern: 'I want some ___.',
    blanks: [
      {
        options: ['fish', 'beef', 'pork', 'chicken'],
        answer: 0,
        zhOptions: ['我想要一些鱼肉。', '我想要一些牛肉。', '我想要一些猪肉。', '我想要一些鸡肉。'],
      },
    ],
    zh: '我想要一些鱼肉。',
    hint: '想吃哪种肉？',
    unitSlug: 'food-groups',
    lessonId: 7,
  },
  {
    id: 'u8l8-meat',
    pattern: 'I want some ___ and vegetables.',
    blanks: [
      {
        options: ['meat', 'fruit', 'seafood', 'rice'],
        answer: 0,
        zhOptions: [
          '我想要一些肉和蔬菜。',
          '我想要一些水果和蔬菜。',
          '我想要一些海鲜和蔬菜。',
          '我想要一些米饭和蔬菜。',
        ],
      },
    ],
    zh: '我想要一些肉和蔬菜。',
    hint: '两种都要，说出整句',
    unitSlug: 'food-groups',
    lessonId: 8,
  },

  // === Unit 9 My Day ===
  {
    id: 'u9l2-breakfast',
    pattern: 'I like ___ for breakfast.',
    blanks: [
      {
        options: ['bread', 'eggs', 'porridge', 'milk'],
        answer: 0,
        zhOptions: ['我喜欢早餐吃面包。', '我喜欢早餐吃鸡蛋。', '我喜欢早餐喝粥。', '我喜欢早餐喝牛奶。'],
      },
    ],
    zh: '我喜欢早餐吃面包。',
    unitSlug: 'my-day',
    lessonId: 2,
  },
  {
    id: 'u9l7-bed',
    pattern: "It's time to ___.",
    blanks: [
      {
        options: ['take a shower', 'read a book', 'go to bed', 'have fun'],
        answer: 0,
        zhOptions: ['该去洗澡了。', '该看书了。', '该睡觉了。', '该去玩了。'],
      },
    ],
    zh: '该去洗澡了。',
    unitSlug: 'my-day',
    lessonId: 7,
  },

  // === Unit 9 其余课 ===
  {
    id: 'u9l1-comb',
    pattern: 'It is a ___.',
    blanks: [
      {
        options: ['comb', 'towel', 'toothbrush', 'toothpaste'],
        answer: 0,
        zhOptions: ['它是一把梳子。', '它是一条毛巾。', '它是一支牙刷。', '它是一管牙膏。'],
      },
    ],
    zh: '它是一把梳子。',
    hint: '早上洗漱用什么？',
    unitSlug: 'my-day',
    lessonId: 1,
  },
  {
    id: 'u9l3-crayons',
    pattern: 'There are some ___.',
    blanks: [
      {
        options: ['crayons', 'pencils', 'erasers', 'glue sticks'],
        answer: 0,
        zhOptions: ['有一些蜡笔。', '有一些铅笔。', '有一些橡皮。', '有一些固体胶。'],
      },
    ],
    zh: '有一些蜡笔。',
    hint: '书包里装了什么文具？',
    unitSlug: 'my-day',
    lessonId: 3,
  },
  {
    id: 'u9l4-slide',
    pattern: 'This is a ___.',
    blanks: [
      {
        options: ['slide', 'swing', 'seesaw', 'playground'],
        answer: 0,
        zhOptions: ['这是一个滑梯。', '这是一个秋千。', '这是一个跷跷板。', '这是一个操场。'],
      },
    ],
    zh: '这是一个滑梯。',
    hint: '操场上有什么？',
    unitSlug: 'my-day',
    lessonId: 4,
  },
  {
    id: 'u9l5-cake',
    pattern: 'I like ___ and lollipops.',
    blanks: [
      {
        options: ['cake', 'yogurt', 'donuts', 'candy'],
        answer: 0,
        zhOptions: [
          '我喜欢蛋糕和棒棒糖。',
          '我喜欢酸奶和棒棒糖。',
          '我喜欢甜甜圈和棒棒糖。',
          '我喜欢糖果和棒棒糖。',
        ],
      },
    ],
    zh: '我喜欢蛋糕和棒棒糖。',
    hint: '点心时间想吃什么？',
    unitSlug: 'my-day',
    lessonId: 5,
  },
  {
    id: 'u9l6-bag',
    pattern: "What's in your ___?",
    blanks: [
      {
        options: ['schoolbag', 'bedroom', 'kitchen', 'bathroom'],
        answer: 0,
        zhOptions: ['你的书包里有什么？', '你的卧室里有什么？', '你的厨房里有什么？', '你的浴室里有什么？'],
      },
    ],
    zh: '你的书包里有什么？',
    unitSlug: 'my-day',
    lessonId: 6,
  },
  {
    id: 'u9l8-play',
    pattern: "It's time to ___.",
    blanks: [
      {
        options: ['play', 'get up', 'brush my teeth', 'have breakfast'],
        answer: 0,
        zhOptions: ['该玩耍了。', '该起床了。', '该刷牙了。', '该吃早餐了。'],
      },
    ],
    zh: '该玩耍了。',
    hint: '什么时候做什么事？',
    unitSlug: 'my-day',
    lessonId: 8,
  },

  // === Unit 10 Birthday ===
  {
    id: 'u10l1-need',
    pattern: 'I need some ___.',
    blanks: [
      {
        options: ['balloons', 'ribbons', 'hats', 'candles'],
        answer: 0,
        zhOptions: ['我需要一些气球。', '我需要一些彩带。', '我需要一些帽子。', '我需要一些蜡烛。'],
      },
    ],
    zh: '我需要一些气球。',
    unitSlug: 'birthday',
    lessonId: 1,
  },
  {
    id: 'u10l2-friend',
    pattern: 'He is my ___.',
    blanks: [
      {
        options: ['friend', 'boy', 'girl', 'dad'],
        answer: 0,
        zhOptions: ['他是我的朋友。', '他是一个男孩。', '他是一个女孩。', '他是我的爸爸。'],
      },
    ],
    zh: '他是我的朋友。',
    unitSlug: 'birthday',
    lessonId: 2,
  },

  // === Unit 10 其余课 ===
  {
    id: 'u10l3-skates',
    pattern: 'Here are ___ for you.',
    blanks: [
      {
        options: ['ice skates', 'gloves', 'gifts', 'hats'],
        answer: 0,
        zhOptions: ['这是给你的冰鞋。', '这是给你的手套。', '这是给你的礼物。', '这是给你的帽子。'],
      },
    ],
    zh: '这是给你的冰鞋。',
    hint: '拆礼物时说「这是给你的……」',
    unitSlug: 'birthday',
    lessonId: 3,
  },
  {
    id: 'u10l4-hugs',
    pattern: 'She ___ me.',
    blanks: [
      {
        options: ['hugs', 'kisses', 'loves'],
        answer: 0,
        zhOptions: ['她拥抱我。', '她亲吻我。', '她爱我。'],
      },
    ],
    zh: '她拥抱我。',
    hint: '她怎么表达爱？',
    unitSlug: 'birthday',
    lessonId: 4,
  },
  {
    id: 'u10l5-wish',
    pattern: "Let's ___.",
    blanks: [
      {
        options: ['make a wish', 'sing a birthday song', 'blow out the candles', 'clean up'],
        answer: 0,
        zhOptions: [
          '我们来许个愿吧。',
          '我们来唱生日歌吧。',
          '我们来吹蜡烛吧。',
          '我们来打扫吧。',
        ],
      },
    ],
    zh: '我们来许个愿吧。',
    hint: '过生日时要做什么？',
    unitSlug: 'birthday',
    lessonId: 5,
  },
  {
    id: 'u10l6-gift',
    pattern: 'Here is a ___ for you.',
    blanks: [
      {
        options: ['gift', 'balloon', 'friend', 'hug'],
        answer: 0,
        zhOptions: ['这是给你的礼物。', '这是给你的气球。', '这是给你的朋友。', '这是给你的拥抱。'],
      },
    ],
    zh: '这是给你的礼物。',
    unitSlug: 'birthday',
    lessonId: 6,
  },
  {
    id: 'u10l7-dolls',
    pattern: 'Put away the ___.',
    blanks: [
      {
        options: ['dolls', 'blocks', 'toys', 'books'],
        answer: 0,
        zhOptions: ['把洋娃娃收好。', '把积木收好。', '把玩具收好。', '把书收好。'],
      },
    ],
    zh: '把洋娃娃收好。',
    hint: '玩完了把玩具收好',
    unitSlug: 'birthday',
    lessonId: 7,
  },
  {
    id: 'u10l8-gifts',
    pattern: 'I get many ___.',
    blanks: [
      {
        options: ['gifts', 'candles', 'balloons', 'cards'],
        answer: 0,
        zhOptions: ['我收到许多礼物。', '我收到许多蜡烛。', '我收到许多气球。', '我收到许多卡片。'],
      },
    ],
    zh: '我收到许多礼物。',
    hint: '生日那天你收到了什么？',
    unitSlug: 'birthday',
    lessonId: 8,
  },

  // === Unit 11 Places ===
  {
    id: 'u11l1-go',
    pattern: 'I want to go to the ___.',
    blanks: [
      {
        options: ['zoo', 'beach', 'park', 'shop'],
        answer: 0,
        zhOptions: ['我想去动物园。', '我想去海滩。', '我想去公园。', '我想去商店。'],
      },
    ],
    zh: '我想去动物园。',
    unitSlug: 'places',
    lessonId: 1,
  },
  {
    id: 'u11l2-zoo',
    pattern: 'I see ___ in the zoo.',
    blanks: [
      {
        options: ['elephants', 'giraffes', 'zebras', 'lions'],
        answer: 0,
        zhOptions: ['我在动物园看见大象。', '我在动物园看见长颈鹿。', '我在动物园看见斑马。', '我在动物园看见狮子。'],
      },
    ],
    zh: '我在动物园看见大象。',
    unitSlug: 'places',
    lessonId: 2,
  },

  // === Unit 11 其余课 ===
  {
    id: 'u11l3-shark',
    pattern: 'I see a ___ in the water.',
    blanks: [
      {
        options: ['shark', 'octopus', 'jellyfish', 'sea lion'],
        answer: 0,
        zhOptions: [
          '我在水里看到鲨鱼。',
          '我在水里看到章鱼。',
          '我在水里看到水母。',
          '我在水里看到海狮。',
        ],
      },
    ],
    zh: '我在水里看到鲨鱼。',
    hint: '水里有什么动物？',
    unitSlug: 'places',
    lessonId: 3,
  },
  {
    id: 'u11l4-starfish',
    pattern: 'I see some ___ on the beach.',
    blanks: [
      {
        options: ['starfish', 'shells', 'sand'],
        answer: 0,
        zhOptions: [
          '我在海滩上看到一些海星。',
          '我在海滩上看到一些贝壳。',
          '我在海滩上看到沙子。',
        ],
      },
    ],
    zh: '我在海滩上看到一些海星。',
    hint: '海滩上有什么？',
    unitSlug: 'places',
    lessonId: 4,
  },
  {
    id: 'u11l5-foot',
    pattern: 'I like playing ___.',
    blanks: [
      {
        options: ['football', 'basketball', 'table tennis', 'the piano'],
        answer: 0,
        zhOptions: ['我喜欢踢足球。', '我喜欢打篮球。', '我喜欢打乒乓球。', '我喜欢弹钢琴。'],
      },
    ],
    zh: '我喜欢踢足球。',
    hint: '你喜欢玩什么球？',
    unitSlug: 'places',
    lessonId: 5,
  },
  {
    id: 'u11l6-putaway',
    pattern: "It's time to ___.",
    blanks: [
      {
        options: ['put away the blocks', 'go home', 'have lunch', 'go to bed'],
        answer: 0,
        zhOptions: ['该把积木收好了。', '该回家了。', '该吃午饭了。', '该睡觉了。'],
      },
    ],
    zh: '该把积木收好了。',
    unitSlug: 'places',
    lessonId: 6,
  },
  {
    id: 'u11l7-bumper',
    pattern: 'I like to ride the ___.',
    blanks: [
      {
        options: ['bumper cars', 'Ferris wheel', 'merry-go-round', 'bus'],
        answer: 0,
        zhOptions: ['我喜欢坐碰碰车。', '我喜欢坐摩天轮。', '我喜欢坐旋转木马。', '我喜欢坐公交车。'],
      },
    ],
    zh: '我喜欢坐碰碰车。',
    hint: '游乐园里喜欢玩什么？',
    unitSlug: 'places',
    lessonId: 7,
  },
  {
    id: 'u11l8-elephants',
    pattern: 'I see ___ in the zoo.',
    blanks: [
      {
        options: ['elephants', 'sharks', 'monkeys', 'pandas'],
        answer: 0,
        zhOptions: [
          '我在动物园看到大象。',
          '我在动物园看到鲨鱼。',
          '我在动物园看到猴子。',
          '我在动物园看到熊猫。',
        ],
      },
    ],
    zh: '我在动物园看到大象。',
    unitSlug: 'places',
    lessonId: 8,
  },

  // === Unit 12 Transport ===
  {
    id: 'u12l3-school',
    pattern: 'I go to school by ___.',
    blanks: [
      {
        options: ['bus', 'bike', 'car', 'train'],
        answer: 0,
        zhOptions: ['我坐公交车上学。', '我骑自行车上学。', '我坐小汽车上学。', '我坐火车上学。'],
      },
    ],
    zh: '我坐公交车上学。',
    unitSlug: 'transport',
    lessonId: 3,
  },
  {
    id: 'u12l4-red',
    pattern: 'The red says ___.',
    blanks: [
      {
        options: ['stop', 'go', 'wait', 'look'],
        answer: 0,
        zhOptions: ['红灯说停。', '红灯说走。', '红灯说等。', '红灯说看。'],
      },
    ],
    zh: '红灯说停。',
    unitSlug: 'transport',
    lessonId: 4,
  },

  // === Unit 12 其余课 ===
  {
    id: 'u12l1-school',
    pattern: 'I see a ___.',
    blanks: [
      {
        options: ['school', 'park', 'hospital', 'shop'],
        answer: 0,
        zhOptions: ['我看到一所学校。', '我看到一个公园。', '我看到一家医院。', '我看到一家商店。'],
      },
    ],
    zh: '我看到一所学校。',
    hint: '在路上你看到了什么？',
    unitSlug: 'transport',
    lessonId: 1,
  },
  {
    id: 'u12l2-supermarket',
    pattern: 'I see a ___.',
    blanks: [
      {
        options: ['supermarket', 'bakery', 'barbershop', 'fire station'],
        answer: 0,
        zhOptions: ['我看到一家超市。', '我看到一家面包店。', '我看到一家理发店。', '我看到一个消防站。'],
      },
    ],
    zh: '我看到一家超市。',
    hint: '这条街上有什么店？',
    unitSlug: 'transport',
    lessonId: 2,
  },
  {
    id: 'u12l5-right',
    pattern: 'Turn ___!',
    blanks: [
      {
        options: ['right', 'left', 'around'],
        answer: 0,
        zhOptions: ['向右转！', '向左转！', '转个圈！'],
      },
    ],
    zh: '向右转！',
    hint: '跟着指令做动作',
    unitSlug: 'transport',
    lessonId: 5,
  },
  {
    id: 'u12l6-police',
    pattern: 'There is a ___ on my street.',
    blanks: [
      {
        options: ['police station', 'fire station', 'supermarket', 'hospital'],
        answer: 0,
        zhOptions: [
          '我的街上有一个警察局。',
          '我的街上有一个消防站。',
          '我的街上有一家超市。',
          '我的街上有一家医院。',
        ],
      },
    ],
    zh: '我的街上有一个警察局。',
    hint: '你家街上有什么？',
    unitSlug: 'transport',
    lessonId: 6,
  },
  {
    id: 'u12l7-firetruck',
    pattern: 'This is a ___.',
    blanks: [
      {
        options: ['fire truck', 'police car', 'ambulance', 'bus'],
        answer: 0,
        zhOptions: ['这是一辆消防车。', '这是一辆警车。', '这是一辆救护车。', '这是一辆公交车。'],
      },
    ],
    zh: '这是一辆消防车。',
    hint: '听到警笛声要让一让',
    unitSlug: 'transport',
    lessonId: 7,
  },
  {
    id: 'u12l8-vehicles',
    pattern: 'They are ___.',
    blanks: [
      {
        options: ['vehicles', 'buildings', 'animals', 'toys'],
        answer: 0,
        zhOptions: ['它们是车辆。', '它们是建筑物。', '它们是动物。', '它们是玩具。'],
      },
    ],
    zh: '它们是车辆。',
    hint: '它们是一类的吗？',
    unitSlug: 'transport',
    lessonId: 8,
  },
]

/** 取某课的全部框架卡 */
export function framesOfLesson(unitSlug: string, lessonId: number): SentenceFrame[] {
  return STARLIGHT_FRAMES.filter((f) => f.unitSlug === unitSlug && f.lessonId === lessonId)
}
