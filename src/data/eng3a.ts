// ============================================================
//  三年级上册英语（外研版 / 新标准 2024）课程数据
//  ------------------------------------------------------------
//  内容提取自《新外研版 三年级英语上册【高清教材】》PDF（主编 孙有中）：
//    · 教材自带文字层，单元结构、词汇（附中文释义）、句型、歌谣均从 PDF 提取；
//    · 单元页码范围经目录(TOC)与正文核对：U1≈p5-17, U2≈p18-29, U3≈p30-41,
//      U4≈p42-53, U5≈p54-65, U6≈p66-80；
//    · 词汇表依据书末 “Words and expressions” 附录（p86-92）逐单元整理；
//    · 课文插图按单元从 PDF 抽取并降采样，存于 ./eng3a/img/，经 import.meta.glob 引入。
//  本册采用“赛车闯关”式单元结构：Get ready → Start up → Speed up →
//  Fuel up → Hit it big；课程按“词汇 / 句型 / 歌谣与字母 / 综合练习”四课组织，
//  更贴合小学生听说启蒙，并复用应用的「知识点 / 跟读练习 / 自测」三 Tab。
//  英文朗读默认 lang='en'（SpeakButton 默认即英文），无需显式传 lang。
// ============================================================
import type { ModuleTheme } from '@/utils/theme'

// ---- 教材插图：Vite 在构建期按 glob 静态分析并套用 base 路径（GitHub Pages 友好）----
const imgMap = import.meta.glob('./eng3a/img/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const img = (file: string) => imgMap[`./eng3a/img/${file}`] ?? ''

// ============================ 类型 ============================
export interface EngWord {
  en: string
  zh: string
  emoji?: string
  /** 例句（英文） */
  sentence?: string
  /** 例句中文 */
  sentenceZh?: string
}

export interface EngDialog {
  /** 说话人，可省略（独白/ chant 行） */
  speaker?: string
  en: string
  zh?: string
}

export interface EngChant {
  title?: string
  lines: string[]
  /** 演唱/朗读提示 */
  zh?: string
}

export interface EngExercise {
  q: string
  options: string[]
  answer: number
  explain?: string
  /** 错题关联的记忆卡 key(考的词/句);缺省时该题错题不入错题本 */
  key?: string
  /** 记忆卡中文释义;缺省时用正确选项文本 */
  keyZh?: string
}

export interface EngLesson {
  id: number
  slug: string
  title: string
  emoji: string
  /** 英文小标题，如 Greetings */
  topic?: string
  words?: EngWord[]
  dialogs?: EngDialog[]
  chant?: EngChant
  /** 本单元涉及的字母（Aa / Bb …），在“歌谣与字母”课展示 */
  letters?: string[]
  exercise: EngExercise[]
}

export interface EngUnit {
  id: number
  slug: string
  title: string
  titleZh: string
  emoji: string
  theme: ModuleTheme
  /** 单元封面图（教材插图） */
  cover: string
  /** 单元插图画廊（教材插图） */
  gallery: string[]
  lessons: EngLesson[]
}

/** 课程主题色（蓝）——各单元再取不同亮色，制造单元网格的色彩层次 */
export const ENG3A_THEME: ModuleTheme = { color: '#2563eb', colorSoft: '#dbeafe' }

// ============================ 数据 ============================
export const eng3aUnits: EngUnit[] = [
  // ============================== 第一单元 ==============================
  {
    id: 1,
    slug: 'u1',
    title: 'Unit 1',
    titleZh: 'Let’s be friends!',
    emoji: '🤝',
    theme: { color: '#2563eb', colorSoft: '#dbeafe' },
    cover: img('u1_08.jpg'),
    gallery: [img('u1_07.jpg'), img('u1_05.jpg'), img('u1_04.jpg'), img('u1_02.jpg'), img('u1_01.jpg')],
    lessons: [
      {
        id: 1,
        slug: 'u1-1',
        title: '打招呼',
        topic: 'Greetings',
        emoji: '👋',
        words: [
          { en: 'hello', zh: '你好', emoji: '👋', sentence: 'Hello!', sentenceZh: '你好！' },
          { en: 'hi', zh: '嘿，你好', emoji: '🖐️' },
          { en: 'goodbye', zh: '再见', emoji: '👋', sentence: 'Goodbye!', sentenceZh: '再见！' },
          { en: 'good', zh: '好的', emoji: '✅' },
          { en: 'morning', zh: '早晨，上午', emoji: '🌅', sentence: 'Good morning!', sentenceZh: '早上好！' },
          { en: 'Ms', zh: '女士', emoji: '👩', sentence: 'Good morning, Ms Smart!', sentenceZh: '早上好，斯玛特女士！' },
          { en: 'book', zh: '书', emoji: '📖', sentence: 'Open your book.', sentenceZh: '打开你的书。' },
          { en: 'stand up', zh: '起立', emoji: '🧍', sentence: 'Stand up!', sentenceZh: '起立！' },
          { en: 'sit down', zh: '坐下', emoji: '🪑', sentence: 'Sit down!', sentenceZh: '坐下！' },
          { en: 'open', zh: '打开', emoji: '📖' },
          { en: 'close', zh: '合上', emoji: '📕' },
          { en: 'point', zh: '指', emoji: '👉' },
          { en: 'say', zh: '说', emoji: '💬' },
          { en: 'read', zh: '阅读', emoji: '📖' },
          { en: 'listen', zh: '听', emoji: '👂' },
          { en: 'write', zh: '写', emoji: '✍️' },
        ],
        exercise: [
          { q: '“Hello!” 的中文是？', key: 'Hello!', options: ['你好', '再见', '谢谢'], answer: 0, explain: 'Hello! = 你好！' },
          { q: '“Goodbye!” 是什么意思？', key: 'Goodbye!', options: ['早上好', '再见', '你好'], answer: 1, explain: 'Goodbye! = 再见！' },
          { q: '“Stand up!” 是让我们做什么？', key: 'Stand up!', options: ['起立', '坐下', '打开书'], answer: 0, explain: 'Stand up! = 起立！' },
          { q: '“Open your book.” 意思是？', key: 'Open your book.', options: ['合上书', '打开你的书', '读书'], answer: 1, explain: 'Open = 打开；book = 书。' },
        ],
      },
      {
        id: 2,
        slug: 'u1-2',
        title: '名字',
        topic: 'Names',
        emoji: '🪪',
        words: [
          { en: 'I', zh: '我', emoji: '🙋', sentence: "I'm Sam.", sentenceZh: '我是萨姆。' },
          { en: 'my', zh: '我的', emoji: '🤚' },
          { en: 'your', zh: '你的；你们的', emoji: '🤚' },
          { en: 'name', zh: '名字', emoji: '🏷️', sentence: "What's your name?", sentenceZh: '你叫什么名字？' },
          { en: 'what', zh: '什么', emoji: '❓' },
          { en: 'meet', zh: '认识，结识', emoji: '🤝', sentence: 'Nice to meet you.', sentenceZh: '很高兴认识你。' },
          { en: 'friend', zh: '朋友', emoji: '👫', sentence: "Let's be friends!", sentenceZh: '我们做朋友吧！' },
          { en: 'you', zh: '你；你们', emoji: '🙂' },
          { en: 'we', zh: '我们', emoji: '🤝' },
          { en: 'they', zh: '他们', emoji: '👥' },
          { en: 'she', zh: '她', emoji: '👧' },
          { en: 'he', zh: '他', emoji: '👦' },
          { en: 'new', zh: '新的', emoji: '🆕' },
          { en: 'happy', zh: '高兴的，快乐的', emoji: '😊' },
          { en: 'play', zh: '玩，玩耍', emoji: '🎮' },
        ],
        dialogs: [
          { speaker: 'A', en: "Hello! What's your name?", zh: '你好！你叫什么名字？' },
          { speaker: 'B', en: 'My name is Lingling.', zh: '我的名字是玲玲。' },
          { speaker: 'A', en: 'Nice to meet you.', zh: '很高兴认识你。' },
          { speaker: 'B', en: 'Nice to meet you, too.', zh: '我也很高兴认识你。' },
          { en: "Let's be friends!", zh: '我们做朋友吧！' },
        ],
        exercise: [
          { q: '“What’s your name?” 意思是？', key: 'What’s your name?', options: ['你叫什么名字？', '你好吗？', '再见'], answer: 0, explain: 'name = 名字；问对方姓名。' },
          { q: '“I’m Lingling.” 意思是？', key: 'I’m Lingling.', options: ['我是玲玲。', '你是玲玲。', '我的名字'], answer: 0, explain: "I'm = I am = 我是。" },
          { q: '别人说 “Nice to meet you.”，怎么回？', key: 'Nice to meet you.', options: ['Nice to meet you, too.', 'Goodbye.', 'Thank you.'], answer: 0, explain: 'too = 也，回以同样的问候。' },
        ],
      },
      {
        id: 3,
        slug: 'u1-3',
        title: '问候',
        topic: 'How are you?',
        emoji: '😊',
        dialogs: [
          { speaker: 'A', en: 'How are you?', zh: '你好吗？' },
          { speaker: 'B', en: 'I’m fine, thank you.', zh: '我很好，谢谢。' },
          { speaker: 'A', en: 'Good morning, Ms Smart!', zh: '早上好，斯玛特女士！' },
          { speaker: 'B', en: 'Good morning!', zh: '早上好！' },
        ],
        words: [
          { en: 'welcome', zh: '欢迎', emoji: '👋', sentence: 'Welcome to school!', sentenceZh: '欢迎来到学校！' },
          { en: 'thank', zh: '感谢', emoji: '🙏', sentence: 'Thank you!', sentenceZh: '谢谢你！' },
          { en: 'here you are', zh: '给你', emoji: '🤲' },
          { en: 'help', zh: '帮助，帮忙', emoji: '🆘', sentence: 'Let me help you.', sentenceZh: '让我帮你。' },
          { en: 'together', zh: '一起，一块儿', emoji: '🤝', sentence: "Let's play together.", sentenceZh: '我们一起玩吧。' },
          { en: 'great', zh: '极棒的，极好的', emoji: '🌟', sentence: 'Great!', sentenceZh: '太棒了！' },
          { en: 'song', zh: '歌曲', emoji: '🎵', sentence: "Let's sing a song.", sentenceZh: '我们唱首歌吧。' },
        ],
        chant: {
          title: 'Hello Song',
          lines: ['Hello, hello! How are you?', 'I’m fine, thank you,', 'I’m fine, thank you,', 'And how are you?'],
          zh: '《你好歌》：用熟悉的小调互相问候，唱两遍。',
        },
        letters: ['Aa', 'Bb', 'Cc', 'Dd'],
        exercise: [
          { q: '“How are you?” 怎么回答？', key: 'How are you?', options: ['I’m fine, thank you.', "I'm Sam.", 'Goodbye.'], answer: 0, explain: 'fine = 很好。' },
          { q: '“Thank you!” 中文是？', key: 'Thank you!', options: ['谢谢你！', '你好！', '没关系'], answer: 0, explain: 'thank you = 谢谢你。' },
          { q: '下面哪个是字母 “Cc”？', key: 'Cc', options: ['Cc', 'Bb', 'Dd'], answer: 0, explain: 'Cc 在 Bb 与 Dd 之间。' },
        ],
      },
      {
        id: 4,
        slug: 'u1-4',
        title: '综合练习',
        topic: 'Practice',
        emoji: '✏️',
        exercise: [
          { q: '“Let’s be friends!” 意思是？', key: 'Let’s be friends!', options: ['我们做朋友吧！', '我们唱歌吧。', '再见'], answer: 0, explain: 'friend = 朋友。' },
          { q: '“Ms” 指的是？', key: 'Ms', options: ['女士', '先生', '老师'], answer: 0, explain: 'Ms = 女士（不区分婚否）。' },
          { q: '“together” 意思是？', key: 'together', options: ['一起', '分开', '快乐'], answer: 0, explain: 'together = 一起。' },
          { q: '“sing” 是？', key: 'sing', options: ['唱', '听', '读'], answer: 0, explain: 'sing = 唱（歌）。' },
        ],
      },
    ],
  },

  // ============================== 第二单元 ==============================
  {
    id: 2,
    slug: 'u2',
    title: 'Unit 2',
    titleZh: 'My school things',
    emoji: '🎒',
    theme: { color: '#0d9488', colorSoft: '#ccfbf1' },
    cover: img('u2_11.jpg'),
    gallery: [img('u2_02.jpg'), img('u2_01.jpg'), img('u2_06.jpg'), img('u2_03.jpg'), img('u2_07.jpg')],
    lessons: [
      {
        id: 1,
        slug: 'u2-1',
        title: '学习用品',
        topic: 'School things',
        emoji: '🎒',
        words: [
          { en: 'school', zh: '学校', emoji: '🏫' },
          { en: 'schoolbag', zh: '书包', emoji: '🎒', sentence: "It's a schoolbag.", sentenceZh: '它是一个书包。' },
          { en: 'bag', zh: '袋；包', emoji: '🛍️' },
          { en: 'pen', zh: '钢笔', emoji: '🖊️' },
          { en: 'pencil', zh: '铅笔', emoji: '✏️' },
          { en: 'pencil case', zh: '笔袋；铅笔盒', emoji: '📦' },
          { en: 'ruler', zh: '尺子，直尺', emoji: '📏' },
          { en: 'eraser', zh: '橡皮', emoji: '🧽' },
          { en: 'book', zh: '书', emoji: '📕' },
          { en: 'this', zh: '这，这个', emoji: '👈', sentence: "What's this?", sentenceZh: '这是什么？' },
          { en: 'that', zh: '那，那个', emoji: '👉', sentence: "What's that?", sentenceZh: '那是什么？' },
          { en: 'it', zh: '它', emoji: '📦' },
          { en: 'in', zh: '在……里', emoji: '📥' },
          { en: 'for', zh: '为了', emoji: '➡️' },
          { en: 'thing', zh: '东西', emoji: '📦' },
        ],
        exercise: [
          { q: '“schoolbag” 是？', key: 'schoolbag', options: ['书包', '钢笔', '尺子'], answer: 0, explain: 'school = 学校；bag = 包。' },
          { q: '“eraser” 意思是？', key: 'eraser', options: ['橡皮', '铅笔', '书包'], answer: 0, explain: 'eraser = 橡皮。' },
          { q: '“ruler” 是？', key: 'ruler', options: ['尺子', '书', '笔袋'], answer: 0, explain: 'ruler = 尺子。' },
          { q: '“What’s this?” 意思是？', key: 'What’s this?', options: ['这是什么？', '那是什么？', '它是书包'], answer: 0, explain: 'this = 这，这个。' },
        ],
      },
      {
        id: 2,
        slug: 'u2-2',
        title: '询问物品',
        topic: 'What’s this?',
        emoji: '🔍',
        dialogs: [
          { speaker: 'A', en: "What's this?", zh: '这是什么？' },
          { speaker: 'B', en: "It's a pencil.", zh: '它是一支铅笔。' },
          { speaker: 'A', en: "What's that?", zh: '那是什么？' },
          { speaker: 'B', en: "It's a schoolbag.", zh: '它是一个书包。' },
          { speaker: 'A', en: 'Is it a book?', zh: '它是一本书吗？' },
          { speaker: 'B', en: 'Yes, it is. / No, it isn’t.', zh: '是的。/ 不，不是。' },
          { en: 'Open your pencil case.', zh: '打开你的笔袋。' },
          { en: 'Put your pen in your schoolbag.', zh: '把你的钢笔放进书包里。' },
        ],
        letters: ['Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj'],
        exercise: [
          { q: '“What’s that?” 问的是？', key: 'What’s that?', options: ['那是什么？', '这是什么？', '它在哪里'], answer: 0, explain: 'that = 那，那个。' },
          { q: '“It’s a pencil.” 意思是？', key: 'It’s a pencil.', options: ['它是一支铅笔。', '它是一本书。', '它是尺子。'], answer: 0, explain: 'pencil = 铅笔。' },
          { q: '“Yes, it is.” 是对哪句的回答？', key: 'Yes, it is.', options: ['Is it a book?', "What's this?", 'Thank you.'], answer: 0, explain: 'Yes, it is. 回答 Is it…? 一般疑问句。' },
        ],
      },
      {
        id: 3,
        slug: 'u2-3',
        title: '失物招领',
        topic: 'Lost and found',
        emoji: '📦',
        words: [
          { en: 'lost and found', zh: '失物招领', emoji: '🔎' },
          { en: 'find', zh: '发现，找到', emoji: '🔍' },
          { en: 'guess', zh: '猜，猜测', emoji: '❓' },
          { en: 'look', zh: '看，瞧', emoji: '👀', sentence: 'Look at your book.', sentenceZh: '看你的书。' },
          { en: 'please', zh: '请', emoji: '🙏' },
          { en: 'thank', zh: '感谢', emoji: '🙏', sentence: 'Thank you!', sentenceZh: '谢谢你！' },
          { en: 'back', zh: '回到原处', emoji: '↩️', sentence: 'Come back!', sentenceZh: '回来！' },
          { en: 'take care of', zh: '照看，照料', emoji: '🛡️' },
          { en: 'there', zh: '在那里', emoji: '📍' },
          { en: 'kid', zh: '小孩，儿童', emoji: '🧒' },
          { en: 'bye', zh: '再见，拜拜', emoji: '👋' },
        ],
        chant: {
          title: 'Pen and Pencil',
          lines: ['Pen, pencil, pencil case,', 'Ruler, eraser, book and bag,', 'Schoolbag, schoolbag, on my back,', 'All my school things in a pack!'],
          zh: '《文具歌》：边拍手边念，复习本课单词。',
        },
        exercise: [
          { q: '“lost and found” 是？', key: 'lost and found', options: ['失物招领', '书包', '铅笔盒'], answer: 0, explain: 'lost = 丢失；found = 找到。' },
          { q: '“Look at your book.” 意思是？', key: 'Look at your book.', options: ['看你的书。', '打开书。', '合上书。'], answer: 0, explain: 'look at = 看……。' },
          { q: '“come back” 意思是？', key: 'come back', options: ['回来', '照看', '猜一猜'], answer: 0, explain: 'back = 回到原处。' },
        ],
      },
      {
        id: 4,
        slug: 'u2-4',
        title: '综合练习',
        topic: 'Practice',
        emoji: '✏️',
        exercise: [
          { q: '“please” 意思是？', key: 'please', options: ['请', '谢谢', '再见'], answer: 0, explain: 'please = 请，礼貌用语。' },
          { q: '“guess” 是？', key: 'guess', options: ['猜', '找', '看'], answer: 0, explain: 'guess = 猜。' },
          { q: '“take care of” 意思是？', key: 'take care of', options: ['照看，照料', '回来', '失物招领'], answer: 0, explain: 'take care of = 照看/照料某人某物。' },
        ],
      },
    ],
  },

  // ============================== 第三单元 ==============================
  {
    id: 3,
    slug: 'u3',
    title: 'Unit 3',
    titleZh: 'It’s a colourful world!',
    emoji: '🌈',
    theme: { color: '#db2777', colorSoft: '#fce7f3' },
    cover: img('u3_03.jpg'),
    gallery: [img('u3_01.jpg'), img('u3_02.jpg'), img('u3_00.jpg'), img('u3_04.jpg'), img('u3_05.jpg')],
    lessons: [
      {
        id: 1,
        slug: 'u3-1',
        title: '颜色',
        topic: 'Colours',
        emoji: '🌈',
        words: [
          { en: 'red', zh: '红色（的）', emoji: '🔴' },
          { en: 'blue', zh: '蓝色（的）', emoji: '🔵' },
          { en: 'yellow', zh: '黄色（的）', emoji: '🟡' },
          { en: 'green', zh: '绿色（的）', emoji: '🟢' },
          { en: 'pink', zh: '粉红色（的）', emoji: '🌸' },
          { en: 'orange', zh: '橙色（的）', emoji: '🟠' },
          { en: 'purple', zh: '紫色（的）', emoji: '🟣' },
          { en: 'black', zh: '黑色（的）', emoji: '⚫' },
          { en: 'colour', zh: '颜色', emoji: '🎨', sentence: 'What colour is it?', sentenceZh: '它是什么颜色？' },
          { en: 'world', zh: '世界', emoji: '🌍' },
          { en: 'colourful', zh: '颜色鲜艳的；色彩丰富的', emoji: '🌈' },
          { en: 'rainbow', zh: '彩虹', emoji: '🌈' },
          { en: 'balloon', zh: '气球', emoji: '🎈' },
          { en: 'umbrella', zh: '伞；雨伞', emoji: '☂️' },
          { en: 'clothes', zh: '衣服', emoji: '👕' },
        ],
        exercise: [
          { q: '“red” 是？', key: 'red', options: ['红色', '蓝色', '绿色'], answer: 0, explain: 'red = 红色。' },
          { q: '“What colour is it?” 意思是？', key: 'What colour is it?', options: ['它是什么颜色？', '它是一只狗。', '这是什么？'], answer: 0, explain: 'colour = 颜色。' },
          { q: '“rainbow” 是？', key: 'rainbow', options: ['彩虹', '气球', '雨伞'], answer: 0, explain: 'rainbow = 彩虹。' },
        ],
      },
      {
        id: 2,
        slug: 'u3-2',
        title: '描述颜色',
        topic: 'It’s red',
        emoji: '🎨',
        dialogs: [
          { speaker: 'A', en: 'What colour is it?', zh: '它是什么颜色？' },
          { speaker: 'B', en: 'It’s red.', zh: '它是红色的。' },
          { speaker: 'A', en: 'What colour is the balloon?', zh: '气球是什么颜色？' },
          { speaker: 'B', en: 'It’s blue.', zh: '它是蓝色的。' },
          { en: 'It’s a black dog.', zh: '它是一只黑色的狗。' },
          { en: 'I can see a colourful rainbow.', zh: '我能看见一道彩虹。' },
          { en: 'Wow, so many colours!', zh: '哇，这么多颜色！' },
        ],
        letters: ['Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp'],
        exercise: [
          { q: '“It’s blue.” 意思是？', key: 'It’s blue.', options: ['它是蓝色的。', '它是红色的。', '它是书。'], answer: 0, explain: 'blue = 蓝色。' },
          { q: '“black” 是？', key: 'black', options: ['黑色', '白色', '紫色'], answer: 0, explain: 'black = 黑色。' },
          { q: '“colourful” 意思是？', key: 'colourful', options: ['色彩丰富的', '圆的', '大的'], answer: 0, explain: 'colourful = 色彩丰富的。' },
        ],
      },
      {
        id: 3,
        slug: 'u3-3',
        title: '画画',
        topic: 'Paint a picture',
        emoji: '🖍️',
        words: [
          { en: 'picture', zh: '画，图画', emoji: '🖼️' },
          { en: 'paint', zh: '画，作画', emoji: '🖌️' },
          { en: 'see', zh: '看见，看到', emoji: '👀' },
          { en: 'can', zh: '能，会', emoji: '✅' },
          { en: 'want', zh: '想要', emoji: '🙏' },
          { en: 'today', zh: '今天', emoji: '📅' },
          { en: 'first', zh: '第一的；首先', emoji: '🥇' },
          { en: 'magical', zh: '美妙的；有魔力的', emoji: '✨' },
          { en: 'fun', zh: '有趣的，逗乐的', emoji: '😄' },
          { en: 'right', zh: '正确的，对的', emoji: '✅' },
          { en: 'so', zh: '这么，如此', emoji: '😮' },
          { en: 'many', zh: '许多；大量', emoji: '🔢' },
        ],
        chant: {
          title: 'Colour Song',
          lines: ['Red, yellow, blue and green,', 'Orange, purple, black and pink,', 'Colours, colours, everywhere,', 'A colourful world, let’s sing!'],
          zh: '《颜色歌》：把学过的颜色都唱出来。',
        },
        exercise: [
          { q: '“paint” 是？', key: 'paint', options: ['画（作画）', '看见', '想要'], answer: 0, explain: 'paint = 画/涂色。' },
          { q: '“I can see a dog.” 意思是？', key: 'I can see a dog.', options: ['我能看见一只狗。', '我想要一只狗。', '它是狗。'], answer: 0, explain: 'see = 看见。' },
          { q: '“so many” 意思是？', key: 'so many', options: ['这么多', '首先', '正确的'], answer: 0, explain: 'so = 这么；many = 许多。' },
        ],
      },
      {
        id: 4,
        slug: 'u3-4',
        title: '综合练习',
        topic: 'Practice',
        emoji: '✏️',
        exercise: [
          { q: '“umbrella” 是？', key: 'umbrella', options: ['雨伞', '衣服', '彩虹'], answer: 0, explain: 'umbrella = 雨伞。' },
          { q: '“It’s a black dog.” 意思是？', key: 'It’s a black dog.', options: ['它是一只黑色的狗。', '它是一把蓝色的伞。', '它是图画。'], answer: 0, explain: 'black = 黑色；dog = 狗。' },
          { q: '“today” 是？', key: 'today', options: ['今天', '首先', '许多'], answer: 0, explain: 'today = 今天。' },
        ],
      },
    ],
  },

  // ============================== 第四单元 ==============================
  {
    id: 4,
    slug: 'u4',
    title: 'Unit 4',
    titleZh: 'Fun with numbers',
    emoji: '🔢',
    theme: { color: '#0ea5e9', colorSoft: '#e0f2fe' },
    cover: img('u4_05.jpg'),
    gallery: [img('u4_03.jpg'), img('u4_01.jpg'), img('u4_09.jpg'), img('u4_08.jpg'), img('u4_00.jpg')],
    lessons: [
      {
        id: 1,
        slug: 'u4-1',
        title: '数字',
        topic: 'Numbers 1–12',
        emoji: '🔢',
        words: [
          { en: 'one', zh: '一', emoji: '1️⃣' },
          { en: 'two', zh: '二', emoji: '2️⃣' },
          { en: 'three', zh: '三', emoji: '3️⃣' },
          { en: 'four', zh: '四', emoji: '4️⃣' },
          { en: 'five', zh: '五', emoji: '5️⃣' },
          { en: 'six', zh: '六', emoji: '6️⃣' },
          { en: 'seven', zh: '七', emoji: '7️⃣' },
          { en: 'eight', zh: '八', emoji: '8️⃣' },
          { en: 'nine', zh: '九', emoji: '9️⃣' },
          { en: 'ten', zh: '十', emoji: '🔟' },
          { en: 'eleven', zh: '十一', emoji: '🔢' },
          { en: 'twelve', zh: '十二', emoji: '🔢' },
          { en: 'number', zh: '数，数字', emoji: '🔢' },
          { en: 'count', zh: '数数', emoji: '🔢' },
          { en: 'how', zh: '多少；怎样', emoji: '❓' },
        ],
        exercise: [
          { q: '“seven” 是？', key: 'seven', options: ['七', '六', '八'], answer: 0, explain: 'seven = 七。' },
          { q: '“twelve” 是？', key: 'twelve', options: ['十二', '十一', '十'], answer: 0, explain: 'twelve = 十二。' },
          { q: '“How many?” 意思是？', key: 'How many?', options: ['多少？', '什么颜色？', '你叫什么名字？'], answer: 0, explain: 'how many = 多少。' },
        ],
      },
      {
        id: 2,
        slug: 'u4-2',
        title: '数一数',
        topic: 'How many?',
        emoji: '🐦',
        dialogs: [
          { speaker: 'A', en: 'How many birds?', zh: '多少只鸟？' },
          { speaker: 'B', en: 'One, two, three … nine!', zh: '一、二、三……九只！' },
          { speaker: 'A', en: 'How old are you?', zh: '你几岁了？' },
          { speaker: 'B', en: 'I’m nine.', zh: '我九岁。' },
          { en: 'Let’s count!', zh: '我们数一数吧！' },
          { speaker: 'A', en: 'What’s your number?', zh: '你的数字是几？' },
          { speaker: 'B', en: 'Number nine.', zh: '数字九。' },
        ],
        letters: ['Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv'],
        exercise: [
          { q: '“How old are you?” 意思是？', key: 'How old are you?', options: ['你几岁了？', '多少只？', '你叫什么名字？'], answer: 0, explain: 'how old = 多大年龄。' },
          { q: '“I’m nine.” 意思是？', key: 'I’m nine.', options: ['我九岁。', '我是九。', '数字九。'], answer: 0, explain: "I'm = I am。" },
          { q: '“count” 是？', key: 'count', options: ['数数', '数字', '多少'], answer: 0, explain: 'count = 数数。' },
        ],
      },
      {
        id: 3,
        slug: 'u4-3',
        title: '中国结与小鸟',
        topic: 'Chinese knot & baby birds',
        emoji: '🧵',
        words: [
          { en: 'Chinese knot', zh: '中国结', emoji: '🧶' },
          { en: 'beautiful', zh: '美丽的', emoji: '🌸' },
          { en: 'make', zh: '制作', emoji: '🛠️' },
          { en: 'show', zh: '给……看', emoji: '👉' },
          { en: 'baby', zh: '幼崽；雏鸟', emoji: '🐤' },
          { en: 'egg', zh: '蛋', emoji: '🥚' },
          { en: 'hungry', zh: '饥饿的', emoji: '😋' },
          { en: 'around', zh: '环绕，在……周围', emoji: '🔄' },
          { en: 'bird', zh: '鸟', emoji: '🐦' },
          { en: 'only', zh: '仅仅', emoji: '1️⃣' },
          { en: 'amazing', zh: '令人惊讶的', emoji: '😲' },
          { en: 'who', zh: '谁，什么人', emoji: '❓' },
          { en: 'rope', zh: '绳', emoji: '🪢' },
          { en: 'cheep', zh: '吱吱（或唧唧）的叫声', emoji: '🐤' },
        ],
        chant: {
          title: 'Counting Song',
          lines: ['One, two, buckle my shoe,', 'Three, four, shut the door,', 'Five, six, pick up sticks,', 'Seven, eight, count to eight!'],
          zh: '《数数歌》：边唱边数到八。',
        },
        exercise: [
          { q: '“Chinese knot” 是？', key: 'Chinese knot', options: ['中国结', '小鸟', '绳子'], answer: 0, explain: '中国结是传统手工艺品。' },
          { q: '“hungry” 意思是？', key: 'hungry', options: ['饥饿的', '美丽的', '惊讶的'], answer: 0, explain: 'hungry = 饿。' },
          { q: '“baby” 是？', key: 'baby', options: ['幼崽；雏鸟', '蛋', '鸟'], answer: 0, explain: 'baby = 小宝宝/雏鸟。' },
        ],
      },
      {
        id: 4,
        slug: 'u4-4',
        title: '综合练习',
        topic: 'Practice',
        emoji: '✏️',
        exercise: [
          { q: '“beautiful” 是？', key: 'beautiful', options: ['美丽的', '饥饿的', '仅仅'], answer: 0, explain: 'beautiful = 美丽的。' },
          { q: '“How many eggs?” 问的是？', key: 'How many eggs?', options: ['多少个蛋？', '什么颜色？', '你几岁？'], answer: 0, explain: 'egg = 蛋。' },
          { q: '“amazing” 意思是？', key: 'amazing', options: ['令人惊讶的', '环绕', '制作'], answer: 0, explain: 'amazing = 令人惊叹的。' },
        ],
      },
    ],
  },

  // ============================== 第五单元 ==============================
  {
    id: 5,
    slug: 'u5',
    title: 'Unit 5',
    titleZh: 'We’re family',
    emoji: '👨‍👩‍👧‍👦',
    theme: { color: '#4f46e5', colorSoft: '#e0e7ff' },
    cover: img('u5_09.jpg'),
    gallery: [img('u5_00.jpg'), img('u5_01.jpg'), img('u5_08.jpg'), img('u5_07.jpg'), img('u5_05.jpg')],
    lessons: [
      {
        id: 1,
        slug: 'u5-1',
        title: '家庭成员',
        topic: 'Family members',
        emoji: '👪',
        words: [
          { en: 'family', zh: '家庭；家人', emoji: '👨‍👩‍👧‍👦' },
          { en: 'father', zh: '爸爸', emoji: '👨', sentence: 'This is my father.', sentenceZh: '这是我的爸爸。' },
          { en: 'mother', zh: '妈妈', emoji: '👩' },
          { en: 'grandpa', zh: '祖父；外祖父', emoji: '👴' },
          { en: 'grandma', zh: '祖母；外祖母', emoji: '👵' },
          { en: 'brother', zh: '哥哥；弟弟', emoji: '👦' },
          { en: 'sister', zh: '姐姐；妹妹', emoji: '👧' },
          { en: 'people', zh: '人；人们', emoji: '👥' },
          { en: 'this', zh: '这，这个', emoji: '👈' },
          { en: 'my', zh: '我的', emoji: '🤚' },
        ],
        exercise: [
          { q: '“father” 是？', key: 'father', options: ['爸爸', '妈妈', '哥哥'], answer: 0, explain: 'father = 爸爸（= dad）。' },
          { q: '“grandma” 是？', key: 'grandma', options: ['祖母；外祖母', '祖父', '姐姐'], answer: 0, explain: 'grandma = 奶奶/外婆。' },
          { q: '“This is my mother.” 意思是？', key: 'This is my mother.', options: ['这是我的妈妈。', '这是我的爸爸。', '我的妈妈。'], answer: 0, explain: 'mother = 妈妈。' },
        ],
      },
      {
        id: 2,
        slug: 'u5-2',
        title: '介绍家人',
        topic: 'This is my …',
        emoji: '💬',
        dialogs: [
          { en: 'This is my father.', zh: '这是我的爸爸。' },
          { en: 'This is my mother.', zh: '这是我的妈妈。' },
          { en: 'He’s my brother.', zh: '他是我的弟弟。' },
          { en: 'She’s my sister.', zh: '她是我的妹妹。' },
          { en: 'I love my family.', zh: '我爱我的家人。' },
          { en: 'We’re family!', zh: '我们是一家人！' },
        ],
        letters: ['Ww', 'Xx', 'Yy', 'Zz'],
        exercise: [
          { q: '“He’s my brother.” 意思是？', key: 'He’s my brother.', options: ['他是我的弟弟。', '她是我的妹妹。', '这是我的弟弟。'], answer: 0, explain: 'He = 他。' },
          { q: '“She’s my sister.” 中的 She 指？', key: 'She’s my sister.', options: ['她', '他', '它'], answer: 0, explain: 'She = 她。' },
          { q: '“We’re family!” 意思是？', key: 'We’re family!', options: ['我们是一家人！', '这是我的家。', '我爱家人。'], answer: 0, explain: "We're = We are。" },
        ],
      },
      {
        id: 3,
        slug: 'u5-3',
        title: '照片与故事',
        topic: 'Photo & story',
        emoji: '📸',
        words: [
          { en: 'photo', zh: '照片，相片', emoji: '📷' },
          { en: 'story', zh: '故事', emoji: '📖' },
          { en: 'cap', zh: '帽子', emoji: '🧢' },
          { en: 'dog', zh: '狗', emoji: '🐶' },
          { en: 'box', zh: '盒；箱', emoji: '📦' },
          { en: 'on', zh: '在……上面', emoji: '⬆️', sentence: 'on the box', sentenceZh: '在盒子上' },
          { en: 'where', zh: '在哪里', emoji: '❓', sentence: 'Where’s the dog?', sentenceZh: '狗在哪里？' },
          { en: 'love', zh: '爱，关爱', emoji: '❤️' },
          { en: 'but', zh: '但是，然而', emoji: '😕' },
          { en: 'worry', zh: '担心', emoji: '😟', sentence: 'Don’t worry.', sentenceZh: '别担心。' },
          { en: 'come on', zh: '快点；加油', emoji: '➡️' },
          { en: 'daddy', zh: '爸爸', emoji: '👨' },
          { en: 'mummy', zh: '妈妈', emoji: '👩' },
        ],
        chant: {
          title: 'Family Song',
          lines: ['Father, mother, brother, sister,', 'Grandpa, grandma, and me,', 'We are a happy family,', 'Happy, happy family!'],
          zh: '《家庭歌》：唱出家庭成员。',
        },
        exercise: [
          { q: '“photo” 是？', key: 'photo', options: ['照片', '故事', '帽子'], answer: 0, explain: 'photo = 照片。' },
          { q: '“Where’s the dog?” 意思是？', key: 'Where’s the dog?', options: ['狗在哪里？', '狗是什么？', '这是狗。'], answer: 0, explain: 'where = 在哪里。' },
          { q: '“Don’t worry.” 意思是？', key: 'Don’t worry.', options: ['别担心。', '快点。', '我爱你。'], answer: 0, explain: "don't = 不要；worry = 担心。" },
        ],
      },
      {
        id: 4,
        slug: 'u5-4',
        title: '综合练习',
        topic: 'Practice',
        emoji: '✏️',
        exercise: [
          { q: '“love” 是？', key: 'love', options: ['爱，关爱', '担心', '故事'], answer: 0, explain: 'love = 爱。' },
          { q: '“on the box” 意思是？', key: 'on the box', options: ['在盒子上', '在盒子里面', '盒子'], answer: 0, explain: 'on = 在……上面。' },
          { q: '“come on” 意思是？', key: 'come on', options: ['快点；加油', '别担心', '照片'], answer: 0, explain: 'come on = 快点/加油。' },
        ],
      },
    ],
  },

  // ============================== 第六单元 ==============================
  {
    id: 6,
    slug: 'u6',
    title: 'Unit 6',
    titleZh: 'My sweet home',
    emoji: '🏠',
    theme: { color: '#0891b2', colorSoft: '#cffafe' },
    cover: img('u6_07.jpg'),
    gallery: [img('u6_01.jpg'), img('u6_04.jpg'), img('u6_05.jpg'), img('u6_06.jpg'), img('u6_09.jpg')],
    lessons: [
      {
        id: 1,
        slug: 'u6-1',
        title: '房间',
        topic: 'Rooms',
        emoji: '🏠',
        words: [
          { en: 'home', zh: '家', emoji: '🏠' },
          { en: 'room', zh: '房间', emoji: '🚪' },
          { en: 'living room', zh: '客厅', emoji: '🛋️' },
          { en: 'bedroom', zh: '卧室', emoji: '🛏️' },
          { en: 'bathroom', zh: '浴室，卫生间', emoji: '🚿' },
          { en: 'kitchen', zh: '厨房', emoji: '🍳' },
          { en: 'dining room', zh: '餐厅', emoji: '🍽️' },
          { en: 'door', zh: '门', emoji: '🚪' },
          { en: 'chair', zh: '椅子', emoji: '🪑' },
          { en: 'bed', zh: '床', emoji: '🛏️' },
        ],
        exercise: [
          { q: '“living room” 是？', key: 'living room', options: ['客厅', '卧室', '厨房'], answer: 0, explain: 'living room = 客厅。' },
          { q: '“bedroom” 是？', key: 'bedroom', options: ['卧室', '浴室', '餐厅'], answer: 0, explain: 'bed = 床；bedroom = 卧室。' },
          { q: '“bathroom” 是？', key: 'bathroom', options: ['浴室，卫生间', '厨房', '客厅'], answer: 0, explain: 'bath = 洗澡；bathroom = 浴室。' },
        ],
      },
      {
        id: 2,
        slug: 'u6-2',
        title: '家具与位置',
        topic: 'Furniture & where',
        emoji: '🪑',
        words: [
          { en: 'table', zh: '桌子', emoji: '🪑' },
          { en: 'chair', zh: '椅子', emoji: '🪑' },
          { en: 'bed', zh: '床', emoji: '🛏️' },
          { en: 'toy', zh: '玩具', emoji: '🧸' },
          { en: 'cat', zh: '猫', emoji: '🐱' },
          { en: 'ball', zh: '球', emoji: '⚽' },
          { en: 'under', zh: '在……下面', emoji: '⬇️', sentence: 'under the chair', sentenceZh: '在椅子下面' },
          { en: 'on', zh: '在……上面', emoji: '⬆️' },
          { en: 'where', zh: '在哪里', emoji: '❓', sentence: 'Where’s the cat?', sentenceZh: '猫在哪里？' },
          { en: 'think', zh: '想，认为', emoji: '💭' },
          { en: 'their', zh: '他们的', emoji: '🔗' },
          { en: 'big', zh: '大的', emoji: '🔈' },
          { en: 'little', zh: '小的', emoji: '🔉' },
        ],
        dialogs: [
          { speaker: 'A', en: 'Where’s the cat?', zh: '猫在哪里？' },
          { speaker: 'B', en: 'It’s under the chair.', zh: '它在椅子下面。' },
          { speaker: 'A', en: 'Where’s the ball?', zh: '球在哪里？' },
          { speaker: 'B', en: 'It’s on the table.', zh: '它在桌子上面。' },
        ],
        exercise: [
          { q: '“under the chair” 意思是？', key: 'under the chair', options: ['在椅子下面', '在椅子上面', '椅子'], answer: 0, explain: 'under = 在……下面。' },
          { q: '“Where’s the cat?” 问的是？', key: 'Where’s the cat?', options: ['猫在哪里？', '猫是什么？', '这是猫。'], answer: 0, explain: 'where = 在哪里。' },
          { q: '“table” 是？', key: 'table', options: ['桌子', '床', '球'], answer: 0, explain: 'table = 桌子。' },
        ],
      },
      {
        id: 3,
        slug: 'u6-3',
        title: '在家里',
        topic: 'At home',
        emoji: '🍎',
        words: [
          { en: 'apple', zh: '苹果', emoji: '🍎' },
          { en: 'share', zh: '共用；分享', emoji: '🤝', sentence: 'Let’s share!', sentenceZh: '我们一起分享吧！' },
          { en: 'put', zh: '放', emoji: '📥', sentence: 'Put the toy on the bed.', sentenceZh: '把玩具放在床上。' },
          { en: 'cooking', zh: '做饭', emoji: '🍳' },
          { en: 'sun', zh: '太阳', emoji: '☀️' },
          { en: 'like', zh: '喜欢', emoji: '💖', sentence: 'I like my home.', sentenceZh: '我喜欢我的家。' },
          { en: 'run', zh: '跑', emoji: '🏃' },
          { en: 'lucky', zh: '幸运的', emoji: '🍀' },
          { en: 'sweet', zh: '甜蜜的', emoji: '🍬' },
          { en: 'game', zh: '游戏', emoji: '🎮' },
          { en: 'all', zh: '全部，所有', emoji: '🌐', sentence: 'all around', sentenceZh: '处处，到处' },
          { en: 'everywhere', zh: '在各个地方；处处', emoji: '🌐' },
          { en: 'miaow', zh: '咪，喵（猫叫声）', emoji: '🐱' },
        ],
        chant: {
          title: 'Home Song',
          lines: ['This is my sweet home,', 'Living room, bedroom, kitchen too,', 'Bathroom, dining room, all for you,', 'I love my sweet home, do you?'],
          zh: '《家之歌》：唱出家里的各个房间。',
        },
        exercise: [
          { q: '“share” 意思是？', key: 'share', options: ['共用；分享', '放', '喜欢'], answer: 0, explain: 'share = 分享。' },
          { q: '“under” 是？', key: 'under', options: ['在……下面', '在……上面', '全部'], answer: 0, explain: 'under = 在……下面。' },
          { q: '“I like my home.” 意思是？', key: 'I like my home.', options: ['我喜欢我的家。', '这是我的家。', '我的家。'], answer: 0, explain: 'like = 喜欢。' },
        ],
      },
      {
        id: 4,
        slug: 'u6-4',
        title: '综合练习',
        topic: 'Practice',
        emoji: '✏️',
        exercise: [
          { q: '“lucky” 是？', key: 'lucky', options: ['幸运的', '甜蜜的', '到处'], answer: 0, explain: 'lucky = 幸运的。' },
          { q: '“all around” 意思是？', key: 'all around', options: ['处处，到处', '全部', '游戏'], answer: 0, explain: 'all around = 处处/到处。' },
          { q: '“cooking” 是？', key: 'cooking', options: ['做饭', '跑', '太阳'], answer: 0, explain: 'cook = 烹饪；cooking = 做饭。' },
        ],
      },
    ],
  },
]

// ============================ 辅助函数 ============================
export function getEngUnit(slug: string | undefined): EngUnit | undefined {
  if (!slug) return undefined
  return eng3aUnits.find((u) => u.slug === slug)
}

export function getEngLesson(
  unitSlug: string | undefined,
  lessonSlug: string | undefined,
): { unit: EngUnit; lesson: EngLesson; unitIdx: number; lessonIdx: number } | undefined {
  const unitIdx = eng3aUnits.findIndex((u) => u.slug === unitSlug)
  if (unitIdx < 0) return undefined
  const unit = eng3aUnits[unitIdx]
  const lessonIdx = unit.lessons.findIndex((l) => l.slug === lessonSlug)
  if (lessonIdx < 0) return undefined
  return { unit, lesson: unit.lessons[lessonIdx], unitIdx, lessonIdx }
}

export const totalEngLessons = eng3aUnits.reduce((a, u) => a + u.lessons.length, 0)

export const eng3aWordCount = eng3aUnits.reduce(
  (a, u) => a + u.lessons.reduce((b, l) => b + (l.words?.length ?? 0), 0),
  0,
)
