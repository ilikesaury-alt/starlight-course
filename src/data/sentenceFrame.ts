// 句子框架卡（C）：从「整句输出」倒推的可填空句型。
// 覆盖 12 个单元共 26 个框架（Unit4 玩具单元为首批试点，含 4 个）。
// 卡片播种后与单词卡共用同一个复习池（SrsCard.kind='sentence' 区分）。
// 数据完整性（空位数/答案下标/单元课号/中文提示与选项对齐）由 sentenceFrame.test.ts 把住。

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
 * 覆盖 12 个单元，每单元 2 个（Unit4 玩具单元试点时为 4 个）。
 *
 * 设计约束：
 *   · pattern 必须是该课真实出现的句型（对照 lessons.ts 的 sentences）；
 *   · 正确答案取自该课词表，干扰项同属该单元，避免跨单元的无效干扰；
 *   · zhOptions 与 options 同长同序，逐词写整句中文（换词时中文提示跟着变）；
 *   · 一个单元只取 2 个框架（共 26 个）——复习队列每场约 6 席句型卡，
 *     卡片总数过多只会拉长每张卡轮转周期，不会提高单次训练量。
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
    pattern: 'This is a ___.',
    blanks: [
      {
        options: ['princess', 'robot', 'doll', 'teacher'],
        answer: 0,
        zhOptions: ['这是一位公主。', '这是一个机器人。', '这是一个洋娃娃。', '这是一位老师。'],
      },
    ],
    zh: '这是位公主。',
    hint: '介绍你最喜欢的角色',
    unitSlug: 'toys',
    lessonId: 4,
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
    id: 'u5l4-rabbit',
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
    lessonId: 4,
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
]

/** 取某课的全部框架卡 */
export function framesOfLesson(unitSlug: string, lessonId: number): SentenceFrame[] {
  return STARLIGHT_FRAMES.filter((f) => f.unitSlug === unitSlug && f.lessonId === lessonId)
}
