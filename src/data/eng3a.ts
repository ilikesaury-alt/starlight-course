// ============================================================
//  三年级上册英语（外研版 / 新标准 2024）课程数据
//  ------------------------------------------------------------
//  内容来源：src/data/三上英语教材/primary_english_3a_curriculum.json
//  （《义务教育教科书·英语（三年级上册）》外研版 2024 版新课标，
//    含 7 个教学单元 + 3 篇附录剧本，主编 孙有中）
//
//  板块架构（v2，2026-09 重构）：
//    A. 课文同步  /eng3a              7 个单元（Welcome + Unit 1–6）
//    B. 英语小剧场 /eng3a/play         3 篇附录剧本（角色朗读）
//    C. 复习巩固  /smart · /wrong      按模块 eng3a 过滤（复用现有）
//
//  单元内固定「五关学习路径」（ENG_STAGES 为唯一真源）：
//    1 认单词 Words   —— 翻卡认读，点卡翻面 + 发音
//    2 说句子 Talk    —— 对话跟读 + 句子连线
//    3 唱起来 Sing    —— 歌谣朗读 + 字母认读
//    4 长知识 Explore —— 文化 / 科学 / 构词 / 语法小卡
//    5 闯关测 Quiz    —— 选择题自测（复用统一星规）
//
//  词汇覆盖：每单元 core_vocabulary 全量收录 —— 重点词（带 emoji + 例句）
//  进 words 关卡，其余功能词（the / to / and 等）进 moreWords 补充词表，
//  既保证「覆盖教材全部词汇」，又不给三年级孩子造成认知负担。
//
//  英文朗读默认 lang='en'（SpeakButton 默认即英文），无需显式传 lang。
// ============================================================
import type { ModuleTheme } from '@/utils/theme'
import type { QuizQuestion } from './quiz-types'

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

/** 拓展知识小卡（文化 / 科学 / 构词 / 语法） */
export interface EngExploreCard {
  emoji: string
  title: string
  /** 英文关键词或等式，如 "yellow + blue = green"（可发音） */
  en?: string
  /** 中文讲解 */
  zh: string
  /** 补充要点（逐条） */
  bullets?: string[]
}

/** 对照提示：语法缩写 / 同义称谓 / 构词拆分，统一为 from → to */
export interface EngTip {
  from: string
  to: string
  zh?: string
}

/** 综合练习题(与语文自测共用 QuizQuestion 结构) */
export type EngExercise = QuizQuestion

/** 五关学习路径的关卡标识 */
export type EngStage = 'words' | 'talk' | 'sing' | 'explore' | 'quiz'

export interface EngLesson {
  id: number
  slug: string
  /** 所属关卡（决定在单元页的路径位置与图标） */
  stage: EngStage
  title: string
  emoji: string
  /** 英文小标题，如 Greetings */
  topic?: string
  words?: EngWord[]
  /** 补充词表：教材词汇表中余下的功能词，紧凑展示（不带例句） */
  moreWords?: EngWord[]
  dialogs?: EngDialog[]
  chant?: EngChant
  /** 本单元涉及的字母（Aa / Bb …），在「唱起来」关卡展示 */
  letters?: string[]
  explore?: EngExploreCard[]
  tips?: EngTip[]
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
  /** 单元的「一句话主题」，展示在单元页顶部 */
  bigIdea?: string
  lessons: EngLesson[]
}

/** 附录剧本（英语小剧场） */
export interface EngPlayLine {
  /** 说话角色；缺省表示旁白/舞台提示 */
  speaker?: string
  en: string
  zh: string
  /** 舞台提示（英文原文中的括号内容），单独弱化展示 */
  stage?: string
}

export interface EngPlay {
  slug: string
  emoji: string
  title: string
  titleZh: string
  theme: ModuleTheme
  /** 角色表 */
  characters: string[]
  /** 角色中文名对照 */
  charactersZh: Record<string, string>
  /** 剧本重点词 */
  words: EngWord[]
  lines: EngPlayLine[]
  /** 故事告诉我们的道理 */
  moral: string
}

/** 课程主题色（蓝）——各单元再取不同亮色，制造单元网格的色彩层次 */
export const ENG3A_THEME: ModuleTheme = { color: '#2563eb', colorSoft: '#dbeafe' }

// ===================== 教材元信息 =====================
export const eng3aBook = {
  title: '义务教育教科书 英语（三年级上册）',
  publisher: '外语教学与研究出版社',
  edition: '2024 版新课标',
  characters: [
    { en: 'Daming', zh: '大明', emoji: '👦' },
    { en: 'Lingling', zh: '玲玲', emoji: '👧' },
    { en: 'Sam', zh: '萨姆', emoji: '🧒' },
    { en: 'Amy', zh: '埃米', emoji: '👧' },
    { en: 'Bobo', zh: '波波', emoji: '🐦' },
    { en: 'Ms Smart', zh: '斯玛特女士', emoji: '👩‍🏫' },
    { en: 'Ms Olivia', zh: '奥利维亚女士', emoji: '👩‍🏫' },
    { en: 'Lucky', zh: '幸运（小狗）', emoji: '🐶' },
  ],
  countries: ['the UK', 'the US'],
}

// ===================== 五关学习路径（唯一真源）=====================
export interface EngStageMeta {
  key: EngStage
  emoji: string
  label: string
  en: string
  /** 关卡说明（给孩子看的一句话） */
  desc: string
  /** 该关卡的互动形式 */
  interact: string
}

export const ENG_STAGES: EngStageMeta[] = [
  {
    key: 'words',
    emoji: '🔤',
    label: '认单词',
    en: 'Words',
    desc: '先认这一单元的新词，点卡片翻面看意思',
    interact: '翻卡认读 + 逐个发音',
  },
  {
    key: 'talk',
    emoji: '💬',
    label: '说句子',
    en: 'Talk',
    desc: '把新词放进句子里，跟着说一遍',
    interact: '对话跟读 + 句子连线',
  },
  {
    key: 'sing',
    emoji: '🎵',
    label: '唱起来',
    en: 'Sing',
    desc: '唱歌谣、认字母，读得溜才记得住',
    interact: '歌谣朗读 + 字母发音',
  },
  {
    key: 'explore',
    emoji: '🧪',
    label: '长知识',
    en: 'Explore',
    desc: '看看英语背后的文化和科学小知识',
    interact: '知识小卡（可发音）',
  },
  {
    key: 'quiz',
    emoji: '✏️',
    label: '闯关测',
    en: 'Quiz',
    desc: '闯关看掌握了几分，错题会自动进错题本',
    interact: '选择题自测 + 星星奖励',
  },
]

export const STAGE_MAP: Record<EngStage, EngStageMeta> = ENG_STAGES.reduce(
  (acc, s) => {
    acc[s.key] = s
    return acc
  },
  {} as Record<EngStage, EngStageMeta>,
)

export function stageOf(lesson: EngLesson): EngStageMeta {
  return STAGE_MAP[lesson.stage]
}

// ============================ 数据 ============================
export const eng3aUnits: EngUnit[] = [
  // ============================== 开学第一课 Welcome ==============================
  {
    id: 0,
    slug: 'w0',
    title: 'Welcome',
    titleZh: 'Welcome to school',
    emoji: '🎈',
    theme: { color: '#f59e0b', colorSoft: '#fef3c7' },
    cover: img('u1_01.jpg'),
    gallery: [img('u1_02.jpg'), img('u1_04.jpg')],
    bigIdea: '开学第一课：用英语打招呼、说出自己的名字，听懂老师的课堂指令。',
    lessons: [
      {
        id: 1,
        slug: 'w0-1',
        stage: 'words',
        title: '打招呼',
        topic: 'Greetings',
        emoji: '👋',
        words: [
          { en: 'hi', zh: '嗨；你好', emoji: '🖐️', sentence: 'Hi! I’m Lingling.', sentenceZh: '嗨！我是玲玲。' },
          { en: 'hello', zh: '你好', emoji: '👋', sentence: 'Hello. My name is Amy!', sentenceZh: '你好。我的名字是埃米！' },
          { en: 'goodbye', zh: '再见', emoji: '👋', sentence: 'Goodbye, Bobo. Have a nice day!', sentenceZh: '再见，波波。祝你今天愉快！' },
          { en: 'good', zh: '好的；良好的', emoji: '✅', sentence: 'Good morning!', sentenceZh: '早上好！' },
          { en: 'morning', zh: '早晨，上午', emoji: '🌅', sentence: 'Good morning, Ms Smart!', sentenceZh: '早上好，斯玛特女士！' },
          { en: 'name', zh: '名字', emoji: '🏷️', sentence: 'What’s your name?', sentenceZh: '你叫什么名字？' },
          { en: 'I', zh: '我', emoji: '🙋', sentence: 'I’m Sam.', sentenceZh: '我是萨姆。' },
          { en: 'my', zh: '我的', emoji: '🤚', sentence: 'My name is Amy.', sentenceZh: '我的名字是埃米。' },
          { en: 'your', zh: '你的；你们的', emoji: '👉', sentence: 'What’s your name?', sentenceZh: '你叫什么名字？' },
          { en: 'what', zh: '什么', emoji: '❓' },
          { en: 'nice', zh: '好的；令人愉快的', emoji: '😊', sentence: 'Have a nice day!', sentenceZh: '祝你今天愉快！' },
          { en: 'day', zh: '一天；白天', emoji: '📅' },
          { en: 'Ms', zh: '女士（不区分婚否）', emoji: '👩‍🏫', sentence: 'Good morning, Ms Smart!', sentenceZh: '早上好，斯玛特女士！' },
          { en: 'book', zh: '书', emoji: '📖', sentence: 'Open your book.', sentenceZh: '打开你的书。' },
        ],
        moreWords: [
          { en: 'be', zh: '是（am / is / are 的原形）' },
          { en: 'have', zh: '有' },
          { en: 'a', zh: '一个' },
          { en: 'stand', zh: '站' },
          { en: 'sit', zh: '坐' },
          { en: 'open', zh: '打开' },
          { en: 'close', zh: '合上；关上' },
          { en: 'point', zh: '指' },
          { en: 'say', zh: '说' },
          { en: 'read', zh: '读；阅读' },
          { en: 'listen', zh: '听' },
          { en: 'write', zh: '写' },
        ],
        exercise: [
          { q: '“Hello!” 的中文是？', key: 'hello', keyZh: '你好', options: ['你好', '再见', '谢谢'], answer: 0, explain: 'Hello! = 你好！' },
          { q: '“Good morning!” 是见面什么时候说的？', key: 'good morning', keyZh: '早上好', options: ['早上', '晚上', '睡觉前'], answer: 0, explain: 'morning = 早晨，所以 Good morning! = 早上好！' },
        ],
      },
      {
        id: 2,
        slug: 'w0-2',
        stage: 'talk',
        title: '说出我的名字',
        topic: 'My name is …',
        emoji: '🪪',
        dialogs: [
          { speaker: 'Bobo', en: 'Hi! I’m Lingling. What’s your name?', zh: '嗨！我是玲玲。你叫什么名字？' },
          { speaker: 'Amy', en: 'Hello. My name is Amy!', zh: '你好。我的名字是埃米！' },
          { speaker: 'Sam', en: 'I’m Sam.', zh: '我是萨姆。' },
          { speaker: 'Bobo', en: 'I’m Bobo. Goodbye, everyone!', zh: '我是波波。大家再见！' },
          { speaker: 'Amy', en: 'Goodbye, Bobo. Have a nice day!', zh: '再见，波波。祝你今天愉快！' },
          { speaker: 'Ms Smart', en: 'Good morning! I’m Ms Smart.', zh: '早上好！我是斯玛特女士。' },
        ],
        exercise: [
          { q: '“What’s your name?” 是想知道什么？', key: 'What’s your name?', keyZh: '你叫什么名字？', options: ['对方的名字', '对方的年龄', '对方住在哪里'], answer: 0, explain: 'name = 名字。' },
          { q: '别人问你名字，下面哪句回答最合适？', key: 'My name is Amy.', keyZh: '我的名字是埃米。', options: ['My name is Amy.', 'Good morning!', 'Goodbye!'], answer: 0, explain: '介绍自己用 My name is … 或 I’m …' },
        ],
      },
      {
        id: 3,
        slug: 'w0-3',
        stage: 'sing',
        title: '歌谣：你好歌',
        topic: 'Hello Song',
        emoji: '🎵',
        chant: {
          title: 'Hello Song',
          lines: ['Hello, hello, what’s your name?', 'Hello, hello, what’s your name?', 'My name is Amy, my name is Sam,', 'Nice to see you, have a nice day!'],
          zh: '《你好歌》：两人一组，互相问名字、互相问好，唱两遍就记住了。',
        },
        exercise: [
          { q: '歌谣里问名字的是哪一句？', key: 'What’s your name?', keyZh: '你叫什么名字？', options: ['What’s your name?', 'Have a nice day!', 'Goodbye!'], answer: 0, explain: 'what’s your name = 你叫什么名字。' },
          { q: '“have a nice day” 是什么意思？', key: 'Have a nice day!', keyZh: '祝你今天愉快！', options: ['祝你今天愉快！', '我有一个名字', '早上好'], answer: 0, explain: 'nice = 令人愉快的。' },
        ],
      },
      {
        id: 4,
        slug: 'w0-4',
        stage: 'explore',
        title: '课堂指令与课本朋友',
        topic: 'Classroom English',
        emoji: '🧪',
        explore: [
          {
            emoji: '🏫',
            title: '听懂老师的英语指令',
            en: 'stand up / sit down',
            zh: '开学最先要听懂的不是单词，是老师的指令。听懂这 9 句，上课就不慌了。',
            bullets: [
              'stand up 起立 · sit down 坐下',
              'open your book 打开书 · close your book 合上书',
              'point! 指一指 · say! 说一说',
              'read! 读一读 · listen! 听一听 · write! 写一写',
            ],
          },
          {
            emoji: '👋',
            title: '打招呼三件套',
            en: 'Hello! · Hi! · Good morning!',
            zh: 'Hi 比 Hello 更随意，熟人之间用得多；Good morning 只在上午用，中午以后就不说了。',
            bullets: ['早上见面：Good morning!', '随时可用：Hello! / Hi!', '离开时：Goodbye! / Bye!'],
          },
          {
            emoji: '🧑‍🤝‍🧑',
            title: '课本里的朋友',
            en: 'Daming · Lingling · Sam · Amy · Bobo',
            zh: '这一册书里的主角，接下来每个单元都会见到他们。',
            bullets: [
              'Ms Smart、Ms Olivia 是老师 —— Ms 读作 /mɪz/，意思是「女士」',
              'Bobo 是只小鸟，Lucky 是只小狗',
              '他们有的来自 the UK（英国），有的来自 the US（美国）',
            ],
          },
        ],
        tips: [
          { from: 'I’m', to: 'I am', zh: '我是（英语说话快，两个词会粘在一起）' },
        ],
        exercise: [
          { q: '老师说 “Stand up!”，我们要做什么？', key: 'stand up', keyZh: '起立', options: ['起立', '坐下', '打开书'], answer: 0, explain: 'stand = 站，up = 起来。' },
          { q: '“Close your book.” 意思是？', key: 'close your book', keyZh: '合上你的书', options: ['合上你的书', '打开你的书', '读你的书'], answer: 0, explain: 'close = 合上；open 才是打开。' },
        ],
      },
      {
        id: 5,
        slug: 'w0-5',
        stage: 'quiz',
        title: '闯关测',
        topic: 'Unit Quiz',
        emoji: '🏁',
        exercise: [
          { q: '“Goodbye!” 是什么意思？', key: 'goodbye', keyZh: '再见', options: ['早上好', '再见', '你好'], answer: 1, explain: 'Goodbye! = 再见！' },
          { q: '“Ms” 是什么意思？', key: 'Ms', keyZh: '女士', options: ['女士', '先生', '老师'], answer: 0, explain: 'Ms = 女士，不区分已婚未婚。' },
          { q: '“Have a nice day!” 意思是？', key: 'Have a nice day!', keyZh: '祝你今天愉快！', options: ['祝你今天愉快！', '今天几号？', '我有一个好名字'], answer: 0, explain: 'nice = 令人愉快的；day = 一天。' },
          { q: '“Open your book.” 是让我们做什么？', key: 'open your book', keyZh: '打开你的书', options: ['合上书', '打开书', '把书收起来'], answer: 1, explain: 'open = 打开。' },
          { q: '介绍自己，下面哪句对？', key: 'I’m Sam.', keyZh: '我是萨姆。', options: ['I’m Sam.', 'Your name is Sam.', 'Goodbye, Sam.'], answer: 0, explain: "介绍自己用 I'm …；your 是「你的」，说的是别人。" },
          { q: '早上见到老师，应该说？', key: 'Good morning!', keyZh: '早上好！', options: ['Goodbye!', 'Good morning!', 'Ms Smart!'], answer: 1, explain: 'morning = 早晨。' },
        ],
      },
    ],
  },

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
    bigIdea: '交新朋友：问好、介绍自己几岁、说说自己从哪里来。',
    lessons: [
      {
        id: 1,
        slug: 'u1-1',
        stage: 'words',
        title: '新朋友',
        topic: 'New friends',
        emoji: '🤝',
        words: [
          { en: 'friend', zh: '朋友', emoji: '👫', sentence: 'Let’s be friends!', sentenceZh: '我们做朋友吧！' },
          { en: 'meet', zh: '认识，结识', emoji: '🤝', sentence: 'Nice to meet you.', sentenceZh: '很高兴认识你。' },
          { en: 'play', zh: '玩，玩耍', emoji: '🎮', sentence: 'Let’s play together!', sentenceZh: '我们一起玩吧！' },
          { en: 'happy', zh: '高兴的，快乐的', emoji: '😊', sentence: 'Let’s have a happy day!', sentenceZh: '让我们度过快乐的一天！' },
          { en: 'new', zh: '新的', emoji: '🆕', sentence: 'I have a new friend.', sentenceZh: '我有一个新朋友。' },
          { en: 'welcome', zh: '欢迎', emoji: '🎉', sentence: 'Welcome to our school!', sentenceZh: '欢迎来到我们学校！' },
          { en: 'everyone', zh: '每个人，大家', emoji: '👥', sentence: 'Hi, everyone!', sentenceZh: '大家好！' },
          { en: 'nine', zh: '九', emoji: '9️⃣', sentence: 'I’m nine.', sentenceZh: '我九岁。' },
          { en: 'twin', zh: '双胞胎之一', emoji: '👯', sentence: 'We’re twins!', sentenceZh: '我们是双胞胎！' },
          { en: 'she', zh: '她', emoji: '👧', sentence: 'She’s Amy.', sentenceZh: '她是埃米。' },
          { en: 'he', zh: '他', emoji: '👦', sentence: 'He’s Daming.', sentenceZh: '他是大明。' },
          { en: 'we', zh: '我们', emoji: '🤝', sentence: 'We are friends!', sentenceZh: '我们是朋友！' },
          { en: 'they', zh: '他们', emoji: '👥' },
          { en: 'help', zh: '帮助，帮忙', emoji: '🆘', sentence: 'Let me help you.', sentenceZh: '让我帮你。' },
          { en: 'here', zh: '这里，给（递东西时）', emoji: '🤲', sentence: 'Here you are.', sentenceZh: '给你。' },
          { en: 'thank', zh: '感谢', emoji: '🙏', sentence: 'Thank you!', sentenceZh: '谢谢你！' },
          { en: 'together', zh: '一起，一块儿', emoji: '👫', sentence: 'Come and play together!', sentenceZh: '来一起玩吧！' },
          { en: 'great', zh: '极棒的，极好的', emoji: '🌟', sentence: 'Great!', sentenceZh: '太棒了！' },
          { en: 'song', zh: '歌曲', emoji: '🎵', sentence: 'Let’s sing a song.', sentenceZh: '我们唱首歌吧。' },
          { en: 'sing', zh: '唱（歌）', emoji: '🎤', sentence: 'Let’s sing now!', sentenceZh: '我们现在就唱吧！' },
          { en: 'know', zh: '知道，认识', emoji: '💡', sentence: 'I know!', sentenceZh: '我知道！' },
          { en: 'everybody', zh: '每个人，大家', emoji: '👨‍👩‍👧‍👦', sentence: 'Everybody, sing with me!', sentenceZh: '大家一起跟我唱！' },
          { en: 'dear', zh: '亲爱的', emoji: '💖', sentence: 'Dear friends, let’s play!', sentenceZh: '亲爱的朋友们，我们一起玩吧！' },
          { en: 'our', zh: '我们的', emoji: '🏫', sentence: 'Our friends are here.', sentenceZh: '我们的朋友在这里。' },
        ],
        moreWords: [
          { en: 'let’s', zh: '让我们……（let us 的缩写）' },
          { en: 'to', zh: '到；向' },
          { en: 'you', zh: '你；你们' },
          { en: 'do', zh: '做' },
          { en: 'from', zh: '来自' },
          { en: 'the', zh: '这个；那个（定冠词）' },
          { en: 'too', zh: '也' },
          { en: 'come', zh: '来' },
          { en: 'and', zh: '和；并且' },
          { en: 'oh', zh: '哦（表示惊讶）' },
          { en: 'no', zh: '不；不是' },
          { en: 'OK', zh: '好的，行' },
          { en: 'now', zh: '现在' },
          { en: 'with', zh: '和……一起' },
          { en: 'me', zh: '我（宾格）' },
        ],
        exercise: [
          { q: '“friend” 是什么意思？', key: 'friend', keyZh: '朋友', options: ['朋友', '老师', '家庭'], answer: 0, explain: 'friend = 朋友。' },
          { q: '“Nice to meet you.” 是什么意思？', key: 'Nice to meet you.', keyZh: '很高兴认识你。', options: ['很高兴认识你。', '你好吗？', '再见。'], answer: 0, explain: 'meet = 认识、结识。' },
        ],
      },
      {
        id: 2,
        slug: 'u1-2',
        stage: 'talk',
        title: '自我介绍',
        topic: 'Nice to meet you',
        emoji: '💬',
        dialogs: [
          { speaker: 'Sam', en: 'Hello! Hello! Nice to meet you.', zh: '你好！你好！很高兴认识你。' },
          { speaker: 'Sam', en: 'Hi, everyone! I’m Sam. I’m nine.', zh: '大家好！我是萨姆。我九岁。' },
          { speaker: 'Amy', en: 'She’s Amy. She’s nine, too.', zh: '她是埃米。她也九岁。' },
          { speaker: 'Amy', en: 'We’re from the UK. We’re twins!', zh: '我们来自英国。我们是双胞胎！' },
          { speaker: 'Lingling', en: 'Hi, Sam. Hi, Amy. I’m Lingling. He’s Daming.', zh: '嗨，萨姆。嗨，埃米。我是玲玲。他是大明。' },
          { speaker: 'Daming', en: 'Come and play! We are friends!', zh: '来一起玩吧！我们是朋友！' },
          { speaker: 'Lingling', en: 'Here you are. Thank you.', zh: '给你。谢谢你。' },
          { en: 'Let’s be friends! Let’s play. Let’s have a happy day!', zh: '我们做朋友吧！一起玩吧。让我们度过快乐的一天！' },
        ],
        exercise: [
          { q: '“She’s nine, too.” 里的 too 是什么意思？', key: 'too', keyZh: '也', options: ['也', '太', '两个'], answer: 0, explain: 'too = 也；放句末。' },
          { q: '“We’re from the UK.” 是说我们来自哪里？', key: 'from the UK', keyZh: '来自英国', options: ['英国', '美国', '中国'], answer: 0, explain: 'from = 来自；the UK = 英国。' },
        ],
      },
      {
        id: 3,
        slug: 'u1-3',
        stage: 'sing',
        title: '歌谣与字母 Aa–Dd',
        topic: 'Friend Song',
        emoji: '🎵',
        chant: {
          title: 'Friends Song',
          lines: ['Hello, hello, nice to meet you,', 'Let’s be friends and play together.', 'I’m nine, she’s nine, we’re twins,',
            'Happy, happy, every day!'],
          zh: '《朋友歌》：第一遍慢慢念，第二遍边拍手边念。',
        },
        letters: ['Aa', 'Bb', 'Cc', 'Dd'],
        exercise: [
          { q: '字母 “Cc” 后面的一个字母是？', key: 'Dd', keyZh: '字母 Dd', options: ['Bb', 'Dd', 'Aa'], answer: 1, explain: '字母顺序是 Aa Bb Cc Dd。' },
          { q: '“sing” 是什么意思？', key: 'sing', keyZh: '唱（歌）', options: ['唱（歌）', '听', '读'], answer: 0, explain: 'sing = 唱歌；song = 歌曲。' },
        ],
      },
      {
        id: 4,
        slug: 'u1-4',
        stage: 'explore',
        title: '缩写、年龄和家乡',
        topic: 'I’m = I am',
        emoji: '🧪',
        explore: [
          {
            emoji: '🔗',
            title: '缩写小魔法',
            en: 'I’m = I am',
            zh: '英语说起来很快，两个词常常「粘」成一个 —— 中间那个小撇号 ’ 就代表省掉的字母。',
            bullets: ['I’m = I am 我是', 'She’s = She is 她是', 'He’s = He is 他是', 'We’re = We are 我们是'],
          },
          {
            emoji: '🎂',
            title: '说说我几岁',
            en: 'I’m nine.',
            zh: '说自己几岁，用「I’m + 数字」；说别人几岁，把 I 换成 She / He 就行。',
            bullets: ['I’m nine. 我九岁。', 'She’s nine, too. 她也九岁。', 'He’s ten. 他十岁。'],
          },
          {
            emoji: '🌍',
            title: '我们来自哪里',
            en: 'We’re from the UK.',
            zh: '用「be + from」说来自哪个地方；国家名前常带 the。',
            bullets: ['the UK 英国 · the US 美国', 'China 中国（前面不加 the）', 'Sam 和 Amy 是 twins 双胞胎'],
          },
        ],
        tips: [
          { from: 'I’m', to: 'I am' },
          { from: 'She’s', to: 'She is' },
          { from: 'He’s', to: 'He is' },
          { from: 'We’re', to: 'We are' },
        ],
        exercise: [
          { q: '“I’m” 是哪两个词缩写来的？', key: 'I’m = I am', keyZh: '我是', options: ['I am', 'I is', 'I are'], answer: 0, explain: 'I 后面永远跟 am。' },
          { q: '“We’re” 是哪两个词缩写来的？', key: 'We’re = We are', keyZh: '我们是', options: ['We are', 'We am', 'We is'], answer: 0, explain: 'we 后面用 are。' },
        ],
      },
      {
        id: 5,
        slug: 'u1-5',
        stage: 'quiz',
        title: '闯关测',
        topic: 'Unit Quiz',
        emoji: '🏁',
        exercise: [
          { q: '“Let’s be friends!” 意思是？', key: 'Let’s be friends!', keyZh: '我们做朋友吧！', options: ['我们做朋友吧！', '我们唱歌吧。', '再见。'], answer: 0, explain: 'friend = 朋友。' },
          { q: '别人说 “Nice to meet you.”，可以怎么回？', key: 'Nice to meet you, too.', keyZh: '我也很高兴认识你。', options: ['Nice to meet you, too.', 'Goodbye.', 'I’m nine.'], answer: 0, explain: '加上 too（也），回以同样的问候。' },
          { q: '“He’s Daming.” 里的 He’s 指谁？', key: 'He’s', keyZh: '他是', options: ['他', '她', '他们'], answer: 0, explain: 'he = 他；she = 她。' },
          { q: '“We’re from the US.” 意思是？', key: 'We’re from the US.', keyZh: '我们来自美国。', options: ['我们来自美国。', '我们是美国人吗？', '他们来自美国。'], answer: 0, explain: 'from = 来自；the US = 美国。' },
          { q: '“together” 是什么意思？', key: 'together', keyZh: '一起', options: ['一起', '分开', '快乐'], answer: 0, explain: 'together = 一起。' },
          { q: '“Thank you!” 的中文是？', key: 'Thank you!', keyZh: '谢谢你！', options: ['谢谢你！', '你好！', '没关系。'], answer: 0, explain: 'thank you = 谢谢你。' },
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
    bigIdea: '认识学习用品：这是什么？那是你的吗？—— 还要学会爱护自己的文具。',
    lessons: [
      {
        id: 1,
        slug: 'u2-1',
        stage: 'words',
        title: '学习用品',
        topic: 'School things',
        emoji: '🎒',
        words: [
          { en: 'school', zh: '学校', emoji: '🏫', sentence: 'Pack my bag for school.', sentenceZh: '把我的书包收拾好去学校。' },
          { en: 'thing', zh: '东西，物品', emoji: '📦', sentence: 'Take care of your school things!', sentenceZh: '照看好你的学习用品！' },
          { en: 'schoolbag', zh: '书包', emoji: '🎒', sentence: 'It’s my schoolbag.', sentenceZh: '它是我的书包。' },
          { en: 'bag', zh: '袋；包', emoji: '🛍️', sentence: 'Pack my bag.', sentenceZh: '收拾我的包。' },
          { en: 'pen', zh: '钢笔', emoji: '🖊️', sentence: 'It’s a pen.', sentenceZh: '它是一支钢笔。' },
          { en: 'pencil', zh: '铅笔', emoji: '✏️', sentence: 'No, it isn’t. It’s a pencil.', sentenceZh: '不，不是。它是一支铅笔。' },
          { en: 'pencil case', zh: '笔袋；铅笔盒', emoji: '📐', sentence: 'Open your pencil case.', sentenceZh: '打开你的笔袋。' },
          { en: 'ruler', zh: '尺子，直尺', emoji: '📏', sentence: 'Is this your ruler?', sentenceZh: '这是你的尺子吗？' },
          { en: 'eraser', zh: '橡皮', emoji: '🧽', sentence: 'It’s my eraser.', sentenceZh: '它是我的橡皮。' },
          { en: 'guess', zh: '猜，猜测', emoji: '❓', sentence: 'Guess!', sentenceZh: '猜一猜！' },
          { en: 'find', zh: '发现，找到', emoji: '🔍', sentence: 'I can’t find my pen.', sentenceZh: '我找不到我的钢笔了。' },
          { en: 'kid', zh: '小孩，儿童', emoji: '🧒', sentence: 'Bye, kids!', sentenceZh: '孩子们，再见！' },
          { en: 'please', zh: '请', emoji: '🙏', sentence: 'A pen, please.', sentenceZh: '请给我一支钢笔。' },
          { en: 'look', zh: '看，瞧', emoji: '👀', sentence: 'Look at your schoolbag!', sentenceZh: '看看你的书包！' },
          { en: 'back', zh: '回到原处', emoji: '↩️', sentence: 'Come back!', sentenceZh: '回来！' },
          { en: 'there', zh: '在那里', emoji: '📍', sentence: 'It’s there.', sentenceZh: '它在那里。' },
          { en: 'pack', zh: '把……装进（包、箱）', emoji: '🧳', sentence: 'Pack my bag for school.', sentenceZh: '把我的东西装进书包去学校。' },
        ],
        moreWords: [
          { en: 'for', zh: '为了；给' },
          { en: 'this', zh: '这，这个' },
          { en: 'that', zh: '那，那个' },
          { en: 'in', zh: '在……里' },
          { en: 'it', zh: '它' },
          { en: 'not', zh: '不，不是' },
          { en: 'yes', zh: '是，对' },
          { en: 'bye', zh: '再见，拜拜' },
        ],
        exercise: [
          { q: '“schoolbag” 是？', key: 'schoolbag', keyZh: '书包', options: ['书包', '钢笔', '尺子'], answer: 0, explain: 'school = 学校；bag = 包。' },
          { q: '“eraser” 意思是？', key: 'eraser', keyZh: '橡皮', options: ['橡皮', '铅笔', '书包'], answer: 0, explain: 'eraser = 橡皮。' },
        ],
      },
      {
        id: 2,
        slug: 'u2-2',
        stage: 'talk',
        title: '这是什么',
        topic: 'What’s this?',
        emoji: '🔍',
        dialogs: [
          { speaker: 'Amy', en: 'What’s this? — It’s my schoolbag.', zh: '这是什么？—— 它是我的书包。' },
          { speaker: 'Tom', en: 'What’s this? — It’s a book.', zh: '这是什么？—— 它是一本书。' },
          { speaker: 'Amy', en: 'Is it a pen, too? — No, it isn’t. It’s a pencil.', zh: '它也是钢笔吗？—— 不，不是。它是一支铅笔。' },
          { speaker: 'Amy', en: 'What’s that, Tom? — It’s you, Amy!', zh: '那是什么，汤姆？—— 是你呀，埃米！' },
          { speaker: 'Yoyo', en: 'Is this your pen, Yoyo? — Yes, it is. Thank you.', zh: '这是你的钢笔吗，悠悠？—— 是的。谢谢你。' },
          { speaker: 'Lulu', en: 'Is this your ruler, Lulu? — No, it isn’t. It’s my eraser.', zh: '这是你的尺子吗，露露？—— 不，不是。它是我的橡皮。' },
          { en: 'Look at your schoolbag! Take care of your school things!', zh: '看看你的书包！照看好你的学习用品！' },
        ],
        exercise: [
          { q: '“What’s that?” 问的是？', key: 'What’s that?', keyZh: '那是什么？', options: ['那是什么？', '这是什么？', '它在哪里？'], answer: 0, explain: 'that = 那，那个（离得远）；this = 这，这个（离得近）。' },
          { q: '“Is it a pen, too?” 的否定回答是？', key: 'No, it isn’t.', keyZh: '不，不是。', options: ['No, it isn’t.', 'Yes, it is.', 'No, it is.'], answer: 0, explain: 'Is it…? 的否定回答是 No, it isn’t.' },
        ],
      },
      {
        id: 3,
        slug: 'u2-3',
        stage: 'sing',
        title: '歌谣与字母 Ee–Jj',
        topic: 'School Things Song',
        emoji: '🎵',
        chant: {
          title: 'School Things Song',
          lines: ['Pen, pencil, pencil case,', 'Ruler, eraser, book and bag,', 'Schoolbag, schoolbag, on my back,', 'All my school things in a pack!'],
          zh: '《文具歌》：边念边指着桌上的文具，念到哪个就指哪个。',
        },
        letters: ['Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj'],
        exercise: [
          { q: '字母表里 “Ff” 前面是哪个字母？', key: 'Ee', keyZh: '字母 Ee', options: ['Ee', 'Gg', 'Hh'], answer: 0, explain: '顺序是 Ee Ff Gg — Ff 前面是 Ee。' },
          { q: '“ruler” 是？', key: 'ruler', keyZh: '尺子', options: ['尺子', '书', '笔袋'], answer: 0, explain: 'ruler = 尺子。' },
        ],
      },
      {
        id: 4,
        slug: 'u2-4',
        stage: 'explore',
        title: '羽毛笔、毛笔和爱护文具',
        topic: 'Quills & brushes',
        emoji: '🧪',
        explore: [
          {
            emoji: '🪶',
            title: '以前的笔：羽毛笔',
            en: 'quill',
            zh: '古代欧洲人用大鸟的羽毛蘸墨水写字，叫 quill（羽毛笔）。写一会儿就要再蘸一次墨水，比现在的圆珠笔麻烦多了。',
            bullets: ['quill 羽毛笔', '要蘸墨水才能写', '现在的 pen 里自带墨水，方便多了'],
          },
          {
            emoji: '🖌️',
            title: '中国的笔：毛笔',
            en: 'brush',
            zh: '中国人用 brush（毛笔）蘸墨写字画画，笔尖软软的，能写出粗细变化，这是中国书法的工具。',
            bullets: ['brush 毛笔；刷子', '蘸墨汁书写', '和羽毛笔一样，都要「蘸」'],
          },
          {
            emoji: '🛡️',
            title: '爱护我的学习用品',
            en: 'Take care of your school things!',
            zh: '东西用完放回原位，第二天就不用满书包找啦。找不到东西时可以说 I can’t find my pen.',
            bullets: ['写完字盖上笔帽', '橡皮不要切成小块', '放学先收拾书包再玩'],
          },
        ],
        tips: [
          { from: 'this', to: '这，这个', zh: '离自己近的东西' },
          { from: 'that', to: '那，那个', zh: '离自己远的东西' },
        ],
        exercise: [
          { q: '“quill” 是什么？', key: 'quill', keyZh: '羽毛笔', options: ['羽毛笔', '毛笔', '铅笔'], answer: 0, explain: 'quill 是用鸟羽毛做的笔。' },
          { q: '“brush” 在课文里指？', key: 'brush', keyZh: '毛笔', options: ['毛笔', '橡皮', '尺子'], answer: 0, explain: 'brush 这里是「毛笔」，也可以指刷子。' },
        ],
      },
      {
        id: 5,
        slug: 'u2-5',
        stage: 'quiz',
        title: '闯关测',
        topic: 'Unit Quiz',
        emoji: '🏁',
        exercise: [
          { q: '“This is my pencil case.” 意思是？', key: 'pencil case', keyZh: '笔袋；铅笔盒', options: ['这是我的笔袋。', '这是我的书包。', '这是你的铅笔。'], answer: 0, explain: 'pencil case = 笔袋。' },
          { q: '“Is it a book?” 的肯定回答是？', key: 'Yes, it is.', keyZh: '是的，它是。', options: ['Yes, it is.', 'No, it isn’t.', 'Yes, it isn’t.'], answer: 0, explain: 'Is it…? 的肯定回答是 Yes, it is.' },
          { q: '“lost and found” 常出现在学校的什么地方？', options: ['失物招领处', '操场', '教室'], answer: 0, explain: 'lost = 丢的，found = 找到的 —— 丢了东西去那里找。' },
          { q: '“please” 是什么意思？', key: 'please', keyZh: '请', options: ['请', '谢谢', '再见'], answer: 0, explain: 'please = 请，是礼貌用语。' },
          { q: '“Take care of your school things!” 意思是？', key: 'take care of', keyZh: '照看，照料', options: ['照看好你的学习用品！', '把学习用品收起来！', '你的学习用品在哪里？'], answer: 0, explain: 'take care of = 照看、照料。' },
          { q: '“guess” 是什么意思？', key: 'guess', keyZh: '猜', options: ['猜', '找', '看'], answer: 0, explain: 'guess = 猜。' },
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
    bigIdea: '认识颜色、学会问「它是什么颜色」，还要动手试试三种颜色能调出多少种新颜色。',
    lessons: [
      {
        id: 1,
        slug: 'u3-1',
        stage: 'words',
        title: '颜色',
        topic: 'Colours',
        emoji: '🌈',
        words: [
          { en: 'red', zh: '红色（的）', emoji: '🔴', sentence: 'It’s red!', sentenceZh: '它是红色的！' },
          { en: 'yellow', zh: '黄色（的）', emoji: '🟡', sentence: 'Yellow and blue is green.', sentenceZh: '黄色加蓝色是绿色。' },
          { en: 'blue', zh: '蓝色（的）', emoji: '🔵', sentence: 'It’s blue!', sentenceZh: '它是蓝色的！' },
          { en: 'green', zh: '绿色（的）', emoji: '🟢', sentence: 'Red, pink, green and yellow!', sentenceZh: '红色、粉色、绿色和黄色！' },
          { en: 'orange', zh: '橙色（的）；橙子', emoji: '🟠', sentence: 'Orange and purple!', sentenceZh: '橙色和紫色！' },
          { en: 'purple', zh: '紫色（的）', emoji: '🟣', sentence: 'Red and blue is purple.', sentenceZh: '红色加蓝色是紫色。' },
          { en: 'pink', zh: '粉红色（的）', emoji: '🌸', sentence: 'A pink balloon!', sentenceZh: '一只粉色的气球！' },
          { en: 'black', zh: '黑色（的）', emoji: '⚫', sentence: 'Red, yellow and blue is black.', sentenceZh: '红、黄、蓝三色加在一起是黑色。' },
          { en: 'colour', zh: '颜色', emoji: '🎨', sentence: 'What colour is it?', sentenceZh: '它是什么颜色？' },
          { en: 'colourful', zh: '颜色鲜艳的；色彩丰富的', emoji: '🌈', sentence: 'It’s a colourful world!', sentenceZh: '这是一个色彩缤纷的世界！' },
          { en: 'world', zh: '世界', emoji: '🌍', sentence: 'It’s a colourful world!', sentenceZh: '这是一个色彩缤纷的世界！' },
          { en: 'rainbow', zh: '彩虹', emoji: '🌈', sentence: 'I can see a rainbow.', sentenceZh: '我能看见一道彩虹。' },
          { en: 'balloon', zh: '气球', emoji: '🎈', sentence: 'I want a balloon!', sentenceZh: '我想要一只气球！' },
          { en: 'umbrella', zh: '伞；雨伞', emoji: '☂️', sentence: 'Look at our umbrellas!', sentenceZh: '看我们的雨伞！' },
          { en: 'clothes', zh: '衣服', emoji: '👕', sentence: 'Look at our clothes!', sentenceZh: '看我们的衣服！' },
          { en: 'picture', zh: '画，图画', emoji: '🖼️', sentence: 'This is a colourful picture.', sentenceZh: '这是一幅色彩缤纷的画。' },
          { en: 'paint', zh: '画，作画；颜料', emoji: '🖌️', sentence: 'Everyone, let’s come and paint!', sentenceZh: '大家快来一起画画吧！' },
          { en: 'see', zh: '看见，看到', emoji: '👀', sentence: 'I can see a colourful picture.', sentenceZh: '我能看见一幅色彩缤纷的画。' },
          { en: 'want', zh: '想要', emoji: '🙏', sentence: 'I want a balloon!', sentenceZh: '我想要一只气球！' },
          { en: 'can', zh: '能，会', emoji: '✅', sentence: 'Can you guess?', sentenceZh: '你能猜到吗？' },
          { en: 'hooray', zh: '好哇（欢呼声）', emoji: '🎉', sentence: 'Hooray!', sentenceZh: '好哇！' },
        ],
        moreWords: [
          { en: 'right', zh: '正确的，对的' },
          { en: 'first', zh: '第一的；首先' },
          { en: 'magical', zh: '美妙的；有魔力的' },
          { en: 'fun', zh: '有趣的，逗乐的' },
          { en: 'so', zh: '这么，如此' },
          { en: 'many', zh: '许多；大量' },
          { en: 'today', zh: '今天' },
        ],
        exercise: [
          { q: '“red” 是？', key: 'red', keyZh: '红色', options: ['红色', '蓝色', '绿色'], answer: 0, explain: 'red = 红色。' },
          { q: '“What colour is it?” 意思是？', key: 'What colour is it?', keyZh: '它是什么颜色？', options: ['它是什么颜色？', '它是一只狗。', '这是什么？'], answer: 0, explain: 'colour = 颜色。' },
        ],
      },
      {
        id: 2,
        slug: 'u3-2',
        stage: 'talk',
        title: '它是什么颜色',
        topic: 'What colour is it?',
        emoji: '🎨',
        dialogs: [
          { speaker: 'A', en: 'What colour is it? Can you guess?', zh: '它是什么颜色？你能猜到吗？' },
          { speaker: 'B', en: 'It’s blue! / It’s red!', zh: '它是蓝色的！／它是红色的！' },
          { speaker: 'A', en: 'What colour is F?', zh: '字母 F 是什么颜色？' },
          { speaker: 'B', en: 'It’s red!', zh: '它是红色的！' },
          { en: 'Look at our umbrellas, look at our clothes.', zh: '看我们的雨伞，看我们的衣服。' },
          { en: 'Wow, so many colours!', zh: '哇，这么多颜色！' },
          { speaker: 'Ms Olivia', en: 'Today is National Day. Everyone, let’s come and paint!', zh: '今天是国庆节。大家快来一起画画吧！' },
          { en: 'This is a colourful picture for the happy National Day!', zh: '这是一幅献给快乐国庆节的色彩缤纷的画！' },
        ],
        exercise: [
          { q: '“What colour is the balloon?” 是问气球的什么？', key: 'What colour', keyZh: '什么颜色', options: ['颜色', '大小', '数量'], answer: 0, explain: 'what colour = 什么颜色。' },
          { q: '“so many colours” 意思是？', key: 'so many', keyZh: '这么多', options: ['这么多颜色', '只有一种颜色', '什么颜色'], answer: 0, explain: 'so = 这么；many = 许多。' },
        ],
      },
      {
        id: 3,
        slug: 'u3-3',
        stage: 'sing',
        title: '歌谣与字母 Kk–Pp',
        topic: 'Colour Song',
        emoji: '🎵',
        chant: {
          title: 'Colour Song',
          lines: ['Red, pink, green and yellow,', 'Orange, blue and purple,', 'Colours, colours, everywhere,', 'A colourful world, hooray!'],
          zh: '《颜色歌》：念到哪个颜色，就从彩笔盒里找出那支笔举起来。',
        },
        letters: ['Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp'],
        exercise: [
          { q: '字母表里 “Nn” 后面是哪个字母？', key: 'Oo', keyZh: '字母 Oo', options: ['Mm', 'Oo', 'Pp'], answer: 1, explain: '顺序是 Mm Nn Oo Pp。' },
          { q: '“rainbow” 是？', key: 'rainbow', keyZh: '彩虹', options: ['彩虹', '气球', '雨伞'], answer: 0, explain: 'rain = 雨，bow = 弓 —— 雨后天上的彩虹。' },
        ],
      },
      {
        id: 4,
        slug: 'u3-4',
        stage: 'explore',
        title: '颜色的小魔法',
        topic: 'Colour mixing',
        emoji: '🧪',
        explore: [
          {
            emoji: '🟡',
            title: '黄色 + 蓝色 = 绿色',
            en: 'yellow + blue = green',
            zh: '拿两支彩笔叠着涂一涂，就会看见新颜色 —— 这就是「调色」。',
            bullets: ['yellow + blue = green', '黄和蓝调出绿'],
          },
          {
            emoji: '🔴',
            title: '红色 + 蓝色 = 紫色',
            en: 'red + blue = purple',
            zh: '红色的多，紫色就偏红；蓝色的多，紫色就偏蓝。',
            bullets: ['red + blue = purple', '红和蓝调出紫'],
          },
          {
            emoji: '🟠',
            title: '黄色 + 红色 = 橙色',
            en: 'yellow + red = orange',
            zh: '橘子和这橙色的名字一模一样 —— 英语里 orange 既是「橙色」也是「橙子」。',
            bullets: ['yellow + red = orange', 'orange 一词两义：橙色 / 橙子'],
          },
          {
            emoji: '⚫',
            title: '三种颜色一起 = 黑色',
            en: 'red + yellow + blue = black',
            zh: '三原色全混在一起会变黑。平时画画涂太多颜色，也会越涂越脏、越涂越黑，就是这个道理。',
            bullets: ['red + yellow + blue = black', '三原色 = 红、黄、蓝'],
          },
          {
            emoji: '🇨🇳',
            title: '国庆节的中国红',
            en: 'National Day',
            zh: '课文里的孩子用各种颜色画了一幅画，庆祝国庆节（National Day）。中国红就是 red。',
            bullets: ['National Day 国庆节', 'flag 国旗', 'paint a picture 画一幅画'],
          },
        ],
        tips: [
          { from: 'colour', to: '颜色', zh: '英式拼法 colour，美式写作 color' },
        ],
        exercise: [
          { q: '黄色加蓝色会变成什么颜色？', key: 'yellow + blue = green', keyZh: '黄 + 蓝 = 绿', options: ['绿色', '紫色', '橙色'], answer: 0, explain: 'yellow + blue = green。' },
          { q: '红色加蓝色会变成什么颜色？', key: 'red + blue = purple', keyZh: '红 + 蓝 = 紫', options: ['紫色', '绿色', '黑色'], answer: 0, explain: 'red + blue = purple。' },
        ],
      },
      {
        id: 5,
        slug: 'u3-5',
        stage: 'quiz',
        title: '闯关测',
        topic: 'Unit Quiz',
        emoji: '🏁',
        exercise: [
          { q: '“It’s blue.” 意思是？', key: 'It’s blue.', keyZh: '它是蓝色的。', options: ['它是蓝色的。', '它是红色的。', '它是一本书。'], answer: 0, explain: 'blue = 蓝色。' },
          { q: '“colourful” 是什么意思？', key: 'colourful', keyZh: '色彩丰富的', options: ['色彩丰富的', '圆圆的', '很大的'], answer: 0, explain: 'colour + ful = 充满颜色的。' },
          { q: '“I want a balloon!” 意思是？', key: 'balloon', keyZh: '气球', options: ['我想要一只气球！', '我有一只气球。', '气球在哪里？'], answer: 0, explain: 'want = 想要；balloon = 气球。' },
          { q: '“umbrella” 是？', key: 'umbrella', keyZh: '雨伞', options: ['雨伞', '衣服', '彩虹'], answer: 0, explain: 'umbrella = 雨伞。' },
          { q: '“I can see a black dog.” 意思是？', key: 'I can see a black dog.', keyZh: '我能看见一只黑色的狗。', options: ['我能看见一只黑色的狗。', '我想要一只黑色的狗。', '它是一只狗。'], answer: 0, explain: 'can = 能；see = 看见。' },
          { q: '“paint” 是什么意思？', key: 'paint', keyZh: '画，作画', options: ['画（作画）', '看见', '想要'], answer: 0, explain: 'paint = 画／涂色。' },
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
    bigIdea: '会数 1–12、会用 How many 提问，还会发现中国结和自然界里的数字。',
    lessons: [
      {
        id: 1,
        slug: 'u4-1',
        stage: 'words',
        title: '数字 1–12',
        topic: 'Numbers 1–12',
        emoji: '🔢',
        words: [
          { en: 'one', zh: '一', emoji: '1️⃣', sentence: 'Only one rope!', sentenceZh: '只有一根绳子！' },
          { en: 'two', zh: '二', emoji: '2️⃣', sentence: 'One, two, three!', sentenceZh: '一、二、三！' },
          { en: 'three', zh: '三', emoji: '3️⃣', sentence: 'Three pencils.', sentenceZh: '三支铅笔。' },
          { en: 'four', zh: '四', emoji: '4️⃣', sentence: 'Four baby birds.', sentenceZh: '四只小鸟。' },
          { en: 'five', zh: '五', emoji: '5️⃣' },
          { en: 'six', zh: '六', emoji: '6️⃣', sentence: 'Guess! How many ropes? Six?', sentenceZh: '猜一猜！多少根绳子？六根？' },
          { en: 'seven', zh: '七', emoji: '7️⃣', sentence: 'An octopus has seven? No, eight!', sentenceZh: '章鱼有七条？不对，八条！' },
          { en: 'eight', zh: '八', emoji: '8️⃣', sentence: 'A ladybird has eight spots.', sentenceZh: '瓢虫有八个斑点。' },
          { en: 'nine', zh: '九', emoji: '9️⃣' },
          { en: 'ten', zh: '十', emoji: '🔟' },
          { en: 'eleven', zh: '十一', emoji: '1️⃣1️⃣', sentence: 'Oh, no! Only eleven eggs.', sentenceZh: '哦，不！只有十一个蛋。' },
          { en: 'twelve', zh: '十二', emoji: '1️⃣2️⃣', sentence: 'Twelve eggs. Twelve babies.', sentenceZh: '十二个蛋。十二只鸟宝宝。' },
          { en: 'number', zh: '数，数字', emoji: '🔢', sentence: 'Numbers are all around.', sentenceZh: '数字就在我们身边。' },
          { en: 'count', zh: '数数', emoji: '🧮', sentence: 'Let me count.', sentenceZh: '让我数一数。' },
          { en: 'how', zh: '多少；怎样', emoji: '❓', sentence: 'How many birds can you see?', sentenceZh: '你能看见多少只鸟？' },
          { en: 'bird', zh: '鸟', emoji: '🐦', sentence: 'How many birds can you see?', sentenceZh: '你能看见多少只鸟？' },
          { en: 'beautiful', zh: '美丽的', emoji: '🌸', sentence: 'A beautiful Chinese knot!', sentenceZh: '一个美丽的中国结！' },
          { en: 'baby', zh: '幼崽；雏鸟；婴儿', emoji: '🐤', sentence: 'Twelve babies!', sentenceZh: '十二只鸟宝宝！' },
          { en: 'egg', zh: '蛋', emoji: '🥚', sentence: 'How many eggs?', sentenceZh: '有多少个蛋？' },
          { en: 'hungry', zh: '饥饿的', emoji: '😋', sentence: 'Er, I’m hungry.', sentenceZh: '呃，我饿了。' },
        ],
        moreWords: [
          { en: 'rope', zh: '绳，绳子' },
          { en: 'who', zh: '谁，什么人' },
          { en: 'make', zh: '制作，做' },
          { en: 'only', zh: '仅仅，只' },
          { en: 'amazing', zh: '令人惊讶的' },
          { en: 'show', zh: '给……看' },
          { en: 'cheep', zh: '吱吱（小鸟的叫声）' },
          { en: 'around', zh: '环绕；在……周围' },
        ],
        exercise: [
          { q: '“seven” 是？', key: 'seven', keyZh: '七', options: ['七', '六', '八'], answer: 0, explain: 'seven = 七。' },
          { q: '“twelve” 是？', key: 'twelve', keyZh: '十二', options: ['十二', '十一', '十'], answer: 0, explain: 'twelve = 十二。' },
        ],
      },
      {
        id: 2,
        slug: 'u4-2',
        stage: 'talk',
        title: '数一数',
        topic: 'How many?',
        emoji: '🐦',
        dialogs: [
          { speaker: 'A', en: 'How many birds can you see?', zh: '你能看见多少只鸟？' },
          { speaker: 'B', en: 'One, two, three!', zh: '一、二、三！' },
          { speaker: 'A', en: 'How many pencils? — Three.', zh: '有多少支铅笔？—— 三支。' },
          { speaker: 'A', en: 'How many erasers? — One.', zh: '有多少块橡皮？—— 一块。' },
          { speaker: 'A', en: 'Guess! How many ropes? Six? Twelve?', zh: '猜一猜！多少根绳子？六根？十二根？' },
          { speaker: 'B', en: 'Ha ha, no. Look! Only one rope!', zh: '哈哈，不对。看！只有一根绳子！' },
          { speaker: 'A', en: 'This is a Chinese knot.', zh: '这是一个中国结。' },
          { speaker: 'B', en: 'Twelve eggs. Twelve babies. Er, I’m hungry.', zh: '十二个蛋。十二只鸟宝宝。呃，我饿了。' },
        ],
        exercise: [
          { q: '“How many?” 是什么意思？', key: 'How many?', keyZh: '多少？', options: ['多少？', '什么颜色？', '你叫什么名字？'], answer: 0, explain: 'how many = 多少（问数量）。' },
          { q: '“Let me count.” 意思是？', key: 'count', keyZh: '数数', options: ['让我数一数。', '让我看看。', '让我猜一猜。'], answer: 0, explain: 'count = 数数。' },
        ],
      },
      {
        id: 3,
        slug: 'u4-3',
        stage: 'sing',
        title: '歌谣与字母 Qq–Vv',
        topic: 'Counting Song',
        emoji: '🎵',
        chant: {
          title: 'Counting Song',
          lines: ['One, two, buckle my shoe,', 'Three, four, shut the door,', 'Five, six, pick up sticks,', 'Seven, eight, count to eight!'],
          zh: '《数数歌》：边唱边扳手指头，唱到 eight 就停下。',
        },
        letters: ['Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv'],
        exercise: [
          { q: '字母表里 “Tt” 后面是哪个字母？', key: 'Uu', keyZh: '字母 Uu', options: ['Ss', 'Uu', 'Vv'], answer: 1, explain: '顺序是 Ss Tt Uu Vv。' },
          { q: '“count” 是什么意思？', key: 'count', keyZh: '数数', options: ['数数', '数字', '多少'], answer: 0, explain: 'count = 数数；number = 数字。' },
        ],
      },
      {
        id: 4,
        slug: 'u4-4',
        stage: 'explore',
        title: '中国结与大自然里的数字',
        topic: 'Chinese knot & numbers in nature',
        emoji: '🧪',
        explore: [
          {
            emoji: '🧵',
            title: '一根绳子编出的中国结',
            en: 'Chinese knot',
            zh: '中国结看着盘根错节，其实常常只用一根绳子（only one rope）编成 —— 所以猜「六根还是十二根」的时候，答案往往是一根。',
            bullets: ['Chinese knot 中国结', 'only one rope 只有一根绳子', 'beautiful 美丽的'],
          },
          {
            emoji: '❄️',
            title: '雪花：六',
            en: 'six',
            zh: '雪花从天上飘下来，每一片都长着六个瓣，从来没有两片一模一样。',
            bullets: ['雪花 6 个瓣', 'six = 六'],
          },
          {
            emoji: '🐞',
            title: '瓢虫：八',
            en: 'eight',
            zh: '背上点点的数量能认瓢虫：七星瓢虫、八星瓢虫……点点越多，越要小心别碰。',
            bullets: ['瓢虫背上 8 个点', 'eight = 八'],
          },
          {
            emoji: '🐙',
            title: '章鱼：八条腕足',
            en: 'eight',
            zh: '很多人以为章鱼是「七」条腿，其实章鱼有 8 条腕足。会喷墨、会变色，是海里最聪明的动物之一。',
            bullets: ['章鱼 8 条腕足', 'numbers are all around 数字就在身边'],
          },
        ],
        tips: [
          { from: 'How many + 复数', to: 'How many birds?', zh: '问数量时，名词要用复数（birds、pencils）' },
        ],
        exercise: [
          { q: '课文里的中国结是用几根绳子编的？', key: 'only one rope', keyZh: '只有一根绳子', options: ['一根', '六根', '十二根'], answer: 0, explain: '只有一根绳子：only one rope。' },
          { q: '课文里的 “Chinese knot” 是什么？', key: 'Chinese knot', keyZh: '中国结', options: ['中国结', '小鸟', '绳子'], answer: 0, explain: 'Chinese knot = 中国结。' },
        ],
      },
      {
        id: 5,
        slug: 'u4-5',
        stage: 'quiz',
        title: '闯关测',
        topic: 'Unit Quiz',
        emoji: '🏁',
        exercise: [
          { q: '“How many eggs?” 问的是？', key: 'How many eggs?', keyZh: '多少个蛋？', options: ['多少个蛋？', '什么颜色？', '你几岁？'], answer: 0, explain: 'egg = 蛋；how many 问数量。' },
          { q: '“eleven” 是几？', key: 'eleven', keyZh: '十一', options: ['十一', '十二', '十'], answer: 0, explain: 'eleven = 十一；twelve = 十二。' },
          { q: '“hungry” 意思是？', key: 'hungry', keyZh: '饥饿的', options: ['饥饿的', '美丽的', '惊讶的'], answer: 0, explain: 'hungry = 饿的。' },
          { q: '“baby” 在课文里指？', key: 'baby', keyZh: '幼崽；雏鸟', options: ['雏鸟', '蛋', '鸟窝'], answer: 0, explain: 'baby = 小宝宝，这里指小鸟宝宝。' },
          { q: '“beautiful” 是什么意思？', key: 'beautiful', keyZh: '美丽的', options: ['美丽的', '饥饿的', '仅仅'], answer: 0, explain: 'beautiful = 美丽的。' },
          { q: '“Numbers are all around.” 意思是？', key: 'Numbers are all around.', keyZh: '数字就在我们身边。', options: ['数字就在我们身边。', '数字很大。', '我看见了数字。'], answer: 0, explain: 'all around = 处处、到处。' },
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
    bigIdea: '介绍自己的家人，学会用 where 问「在哪里」，也懂得家人之间互相帮忙。',
    lessons: [
      {
        id: 1,
        slug: 'u5-1',
        stage: 'words',
        title: '家庭成员',
        topic: 'Family members',
        emoji: '👪',
        words: [
          { en: 'family', zh: '家庭；家人', emoji: '👨‍👩‍👧‍👦', sentence: 'This is my family.', sentenceZh: '这是我的家庭。' },
          { en: 'dad', zh: '爸爸（口语）', emoji: '👨', sentence: 'Dad, this is my grandpa.', sentenceZh: '爸爸，这是我的爷爷。' },
          { en: 'mum', zh: '妈妈（口语）', emoji: '👩', sentence: 'Mum, where’s Susu?', sentenceZh: '妈妈，苏苏在哪里？' },
          { en: 'brother', zh: '哥哥；弟弟', emoji: '👦', sentence: 'Dad, mum, brother, sister and me.', sentenceZh: '爸爸、妈妈、哥哥、姐姐和我。' },
          { en: 'sister', zh: '姐姐；妹妹', emoji: '👧', sentence: 'I’m Jiajia. This is my sister.', sentenceZh: '我是佳佳。这是我的妹妹。' },
          { en: 'grandpa', zh: '爷爷；外公（口语）', emoji: '👴', sentence: 'This is my grandpa.', sentenceZh: '这是我的爷爷。' },
          { en: 'grandma', zh: '奶奶；外婆（口语）', emoji: '👵', sentence: 'That is my grandma!', sentenceZh: '那是我的奶奶！' },
          { en: 'daddy', zh: '爸爸（昵称，更亲昵）', emoji: '🧔', sentence: 'Come on, Daddy!', sentenceZh: '快来，爸爸！' },
          { en: 'mummy', zh: '妈妈（昵称，更亲昵）', emoji: '👩‍🍼', sentence: 'Come on, Mummy!', sentenceZh: '快来，妈妈！' },
          { en: 'photo', zh: '照片，相片', emoji: '📷', sentence: 'Let’s take a photo together.', sentenceZh: '我们一起拍张照片吧。' },
          { en: 'story', zh: '故事', emoji: '📖', sentence: 'This is a family story.', sentenceZh: '这是一个家庭故事。' },
          { en: 'cap', zh: '帽子（带帽檐的）', emoji: '🧢', sentence: 'Oh, no! The cap!', sentenceZh: '哦，不！帽子！' },
          { en: 'dog', zh: '狗', emoji: '🐶', sentence: 'Where’s the dog?', sentenceZh: '狗在哪里？' },
          { en: 'box', zh: '盒；箱', emoji: '📦', sentence: 'It’s in the orange box!', sentenceZh: '它在橙色盒子里！' },
          { en: 'where', zh: '在哪里', emoji: '❓', sentence: 'Where’s the dog?', sentenceZh: '狗在哪里？' },
          { en: 'love', zh: '爱，关爱', emoji: '❤️', sentence: 'I love my family.', sentenceZh: '我爱我的家人。' },
          { en: 'worry', zh: '担心', emoji: '😟', sentence: 'Don’t worry! We can help!', sentenceZh: '别担心！我们可以帮忙！' },
        ],
        moreWords: [
          { en: 'father', zh: '父亲（正式说法）' },
          { en: 'mother', zh: '母亲（正式说法）' },
          { en: 'grandfather', zh: '祖父；外祖父' },
          { en: 'grandmother', zh: '祖母；外祖母' },
          { en: 'but', zh: '但是，然而' },
          { en: 'people', zh: '人；人们' },
          { en: 'on', zh: '在……上面' },
        ],
        exercise: [
          { q: '“father” 是？', key: 'father', keyZh: '父亲', options: ['爸爸（父亲）', '妈妈', '哥哥'], answer: 0, explain: 'father 是「父亲」的正式说法，口语里常说 dad。' },
          { q: '“grandma” 是？', key: 'grandma', keyZh: '奶奶；外婆', options: ['奶奶；外婆', '爷爷', '姐姐'], answer: 0, explain: 'grandma = 奶奶／外婆。' },
        ],
      },
      {
        id: 2,
        slug: 'u5-2',
        stage: 'talk',
        title: '介绍我的家人',
        topic: 'This is my …',
        emoji: '💬',
        dialogs: [
          { speaker: 'A', en: 'Dad, mum, brother, sister, grandpa, grandma and me. This is my family.', zh: '爸爸、妈妈、哥哥、姐姐、爷爷、奶奶和我。这是我的家。' },
          { speaker: 'Sam', en: 'Sam, this is my dad. This is my grandpa.', zh: '萨姆，这是我爸爸。这是我爷爷。' },
          { speaker: 'A', en: 'That is my grandma! — But who is that?', zh: '那是我奶奶！—— 但那是谁呢？' },
          { speaker: 'B', en: 'Oh, this is my grandma.', zh: '哦，这是我奶奶。' },
          { speaker: 'Jiajia', en: 'I’m Jiajia. This is my sister.', zh: '我是佳佳。这是我的妹妹。' },
          { speaker: 'A', en: 'Oh, no! The cap! Come back, Lucky!', zh: '哦，不！帽子！回来，幸运！' },
          { speaker: 'B', en: 'Don’t worry! We can help!', zh: '别担心！我们可以帮忙！' },
          { speaker: 'A', en: 'Come on, Daddy! Come on, Mummy! Let’s take a photo together.', zh: '快来，爸爸！快来，妈妈！我们一起拍张照片吧。' },
          { speaker: 'B', en: 'Oh, where’s the dog? — It’s in the orange box!', zh: '哦，狗在哪里？—— 它在橙色盒子里！' },
          { en: 'This is my family photo. I love my family.', zh: '这是我的全家福。我爱我的家人。' },
        ],
        exercise: [
          { q: '“He’s my brother.” 意思是？', key: 'He’s my brother.', keyZh: '他是我的哥哥（弟弟）。', options: ['他是我的哥哥（弟弟）。', '她是我的姐姐（妹妹）。', '这是我的哥哥（弟弟）。'], answer: 0, explain: 'He = 他。' },
          { q: '“Where’s the dog?” 是在问什么？', key: 'Where’s the dog?', keyZh: '狗在哪里？', options: ['狗在哪里', '狗是什么颜色', '这是谁的狗'], answer: 0, explain: 'where = 在哪里。' },
        ],
      },
      {
        id: 3,
        slug: 'u5-3',
        stage: 'sing',
        title: '歌谣与字母 Ww–Zz',
        topic: 'Family Song',
        emoji: '🎵',
        chant: {
          title: 'Family Song',
          lines: ['Father, mother, brother, sister,', 'Grandpa, grandma, and me,', 'We are a happy family,', 'Happy, happy family!'],
          zh: '《家庭歌》：唱到哪个家人，就指着全家福上的那个人。',
        },
        letters: ['Ww', 'Xx', 'Yy', 'Zz'],
        exercise: [
          { q: '字母表的最后一个字母是？', key: 'Zz', keyZh: '字母 Zz', options: ['Zz', 'Yy', 'Xx'], answer: 0, explain: '26 个字母的最后一个是 Zz。' },
          { q: '“family” 是什么意思？', key: 'family', keyZh: '家庭；家人', options: ['家庭；家人', '朋友', '照片'], answer: 0, explain: 'family = 家庭、家人。' },
        ],
      },
      {
        id: 4,
        slug: 'u5-4',
        stage: 'explore',
        title: '家人的说法与找一找',
        topic: 'Family words',
        emoji: '🧪',
        explore: [
          {
            emoji: '👨',
            title: '爸爸的两种说法',
            en: 'dad = father',
            zh: '同一个家人，英语有两套说法：正式的用在书面，口语的用在日常说话。',
            bullets: ['dad 爸爸（口语） = father 父亲（正式）', 'daddy 是更亲昵的叫法，小小孩爱用'],
          },
          {
            emoji: '👩',
            title: '妈妈的两种说法',
            en: 'mum = mother',
            zh: '英式英语写 mum，美式英语写 mom —— 意思都是「妈妈」。',
            bullets: ['mum 妈妈（口语） = mother 母亲（正式）', 'mummy 更亲昵', '美式写法：mom'],
          },
          {
            emoji: '👴',
            title: '爷爷奶奶、外公外婆',
            en: 'grandpa = grandfather',
            zh: '英语里 grandpa 不区分是爸爸的父母还是妈妈的父母，一个词全包了。',
            bullets: ['grandpa 爷爷／外公 = grandfather', 'grandma 奶奶／外婆 = grandmother', 'grand- 表示「隔一辈」'],
          },
          {
            emoji: '🔍',
            title: '用 where 找一找',
            en: 'Where’s the dog? — It’s in the orange box!',
            zh: '找不到东西时，问 Where’s …? 回答时用 in / on / under 说出位置。',
            bullets: ['Where’s the dog? 狗在哪里？', 'It’s in the box. 它在盒子里。', 'It’s on the box. 它在盒子上。'],
          },
        ],
        tips: [
          { from: 'dad', to: 'father' },
          { from: 'mum', to: 'mother' },
          { from: 'grandpa', to: 'grandfather' },
          { from: 'grandma', to: 'grandmother' },
        ],
        exercise: [
          { q: '“dad” 的正式说法是？', key: 'dad = father', keyZh: '爸爸 / 父亲', options: ['father', 'brother', 'grandpa'], answer: 0, explain: 'dad 是口语，father 是正式说法。' },
          { q: '“grandma” 指的是？', key: 'grandma', keyZh: '奶奶；外婆', options: ['奶奶；外婆', '姐姐；妹妹', '妈妈'], answer: 0, explain: 'grand- 表示隔一辈，grandma 就是奶奶或外婆。' },
        ],
      },
      {
        id: 5,
        slug: 'u5-5',
        stage: 'quiz',
        title: '闯关测',
        topic: 'Unit Quiz',
        emoji: '🏁',
        exercise: [
          { q: '“This is my mother.” 意思是？', key: 'This is my mother.', keyZh: '这是我的妈妈。', options: ['这是我的妈妈。', '这是我的爸爸。', '我爱我的妈妈。'], answer: 0, explain: 'mother = 妈妈。' },
          { q: '“She’s my sister.” 里的 She 指？', key: 'She’s my sister.', keyZh: '她是我的姐姐（妹妹）。', options: ['她', '他', '它'], answer: 0, explain: 'she = 她。' },
          { q: '“Don’t worry!” 意思是？', key: 'Don’t worry!', keyZh: '别担心！', options: ['别担心！', '快点！', '我爱你！'], answer: 0, explain: "don't = 不要；worry = 担心。" },
          { q: '“photo” 是？', key: 'photo', keyZh: '照片', options: ['照片', '故事', '帽子'], answer: 0, explain: 'photo = 照片。' },
          { q: '“I love my family.” 意思是？', key: 'I love my family.', keyZh: '我爱我的家人。', options: ['我爱我的家人。', '这是我的家。', '我家有几个人？'], answer: 0, explain: 'love = 爱。' },
          { q: '“Come on!” 在这里的意思是？', key: 'come on', keyZh: '快点；加油', options: ['快点；加油', '别担心', '回来'], answer: 0, explain: 'come on = 快点／加油。' },
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
    bigIdea: '认识家里的房间、家具和位置，学会用 in / on / under 说清楚东西在哪里。',
    lessons: [
      {
        id: 1,
        slug: 'u6-1',
        stage: 'words',
        title: '我的房间',
        topic: 'Rooms',
        emoji: '🏠',
        words: [
          { en: 'home', zh: '家', emoji: '🏠', sentence: 'This is my home.', sentenceZh: '这是我的家。' },
          { en: 'sweet', zh: '甜蜜的；温馨的', emoji: '🍬', sentence: 'This is our sweet home!', sentenceZh: '这是我们温馨的家！' },
          { en: 'room', zh: '房间', emoji: '🚪', sentence: 'A bedroom and a living room.', sentenceZh: '一间卧室和一间客厅。' },
          { en: 'living room', zh: '客厅', emoji: '🛋️', sentence: 'She’s in the living room.', sentenceZh: '她在客厅里。' },
          { en: 'bedroom', zh: '卧室', emoji: '🛏️', sentence: 'She’s under the bed in the bedroom.', sentenceZh: '她在卧室的床下面。' },
          { en: 'bathroom', zh: '浴室，卫生间', emoji: '🚿', sentence: 'Who is in the bathroom?', sentenceZh: '谁在浴室里？' },
          { en: 'kitchen', zh: '厨房', emoji: '🍳', sentence: 'Dad’s in the kitchen.', sentenceZh: '爸爸在厨房里。' },
          { en: 'dining room', zh: '餐厅', emoji: '🍽️', sentence: 'Who is in the dining room?', sentenceZh: '谁在餐厅里？' },
          { en: 'door', zh: '门', emoji: '🚪', sentence: 'Open the door.', sentenceZh: '把门打开。' },
          { en: 'table', zh: '桌子', emoji: '🪑', sentence: 'It’s under the table.', sentenceZh: '它在桌子下面。' },
          { en: 'chair', zh: '椅子', emoji: '💺', sentence: 'On the chair, I think.', sentenceZh: '我想是在椅子上。' },
          { en: 'bed', zh: '床', emoji: '🛏️', sentence: 'She’s under the bed.', sentenceZh: '她在床下面。' },
          { en: 'toy', zh: '玩具', emoji: '🧸', sentence: 'Put the toy on the bed.', sentenceZh: '把玩具放在床上。' },
          { en: 'cat', zh: '猫', emoji: '🐱', sentence: 'The black cat is on the table.', sentenceZh: '那只黑猫在桌子上。' },
          { en: 'ball', zh: '球', emoji: '⚽', sentence: 'Where is the ball?', sentenceZh: '球在哪里？' },
          { en: 'apple', zh: '苹果', emoji: '🍎', sentence: 'Look at the apple!', sentenceZh: '看那个苹果！' },
          { en: 'share', zh: '共用；分享', emoji: '🤝', sentence: 'Let’s make a new home there and share it!', sentenceZh: '我们在那里建个新家，一起分享吧！' },
          { en: 'put', zh: '放', emoji: '📥', sentence: 'Put your book on the table.', sentenceZh: '把你的书放在桌子上。' },
          { en: 'like', zh: '喜欢', emoji: '💖', sentence: 'She loves the sun.', sentenceZh: '她喜欢阳光。' },
          { en: 'game', zh: '游戏', emoji: '🎮', sentence: 'Let’s play a game!', sentenceZh: '我们玩个游戏吧！' },
        ],
        moreWords: [
          { en: 'think', zh: '想，认为' },
          { en: 'under', zh: '在……下面' },
          { en: 'on', zh: '在……上面' },
          { en: 'their', zh: '他们的' },
          { en: 'cooking', zh: '做饭，烹饪' },
          { en: 'sun', zh: '太阳' },
          { en: 'run', zh: '跑' },
          { en: 'lucky', zh: '幸运的' },
          { en: 'all', zh: '全部，所有' },
          { en: 'everywhere', zh: '在各个地方；处处' },
          { en: 'miaow', zh: '喵（猫叫声）' },
        ],
        exercise: [
          { q: '“living room” 是？', key: 'living room', keyZh: '客厅', options: ['客厅', '卧室', '厨房'], answer: 0, explain: 'living room = 客厅。' },
          { q: '“bedroom” 是？', key: 'bedroom', keyZh: '卧室', options: ['卧室', '浴室', '餐厅'], answer: 0, explain: 'bed = 床；bedroom = 卧室。' },
        ],
      },
      {
        id: 2,
        slug: 'u6-2',
        stage: 'talk',
        title: '在哪里',
        topic: 'Where is it?',
        emoji: '🔍',
        dialogs: [
          { speaker: 'A', en: 'Dad, where’s Susu? — She’s in the living room. On the chair, I think.', zh: '爸爸，苏苏在哪里？—— 她在客厅。我想是在椅子上。' },
          { speaker: 'A', en: 'Mum, where’s Susu? — Look in the bedroom. She’s under the bed.', zh: '妈妈，苏苏在哪里？—— 去卧室看看。她在床下面。' },
          { speaker: 'B', en: 'Susu is in the box with four little babies!', zh: '苏苏在箱子里，还有四只小宝宝！' },
          { speaker: 'A', en: 'Where is the ball? — It’s under the table.', zh: '球在哪里？—— 它在桌子下面。' },
          { en: 'The black cat is on the table.', zh: '那只黑猫在桌子上。' },
          { speaker: 'A', en: 'Who are you? You are in my bedroom!', zh: '你是谁？你在我的卧室里！' },
          { speaker: 'B', en: 'No, you’re in my living room!', zh: '不，你是在我的客厅里！' },
          { speaker: 'A', en: 'This is our sweet home!', zh: '这是我们温馨的家！' },
        ],
        exercise: [
          { q: '“under the chair” 意思是？', key: 'under the chair', keyZh: '在椅子下面', options: ['在椅子下面', '在椅子上面', '椅子'], answer: 0, explain: 'under = 在……下面。' },
          { q: '“on the table” 意思是？', key: 'on the table', keyZh: '在桌子上', options: ['在桌子上', '在桌子下面', '在桌子里'], answer: 0, explain: 'on = 在……上面。' },
        ],
      },
      {
        id: 3,
        slug: 'u6-3',
        stage: 'sing',
        title: '歌谣：温馨的家',
        topic: 'Home Song',
        emoji: '🎵',
        chant: {
          title: 'Home Song',
          lines: ['Dad’s in the kitchen, cooking is fun,', 'Mum’s in the living room, she loves the sun,', 'Susu’s in the bedroom, under the bed,', 'This is our sweet home, all in my head!'],
          zh: '《家之歌》：一边唱一边想 —— 你家谁在哪个房间？',
        },
        exercise: [
          { q: '歌谣里爸爸在哪个房间？', key: 'kitchen', keyZh: '厨房', options: ['厨房', '客厅', '卧室'], answer: 0, explain: 'Dad’s in the kitchen. 爸爸在厨房。' },
          { q: '歌谣里妈妈在哪个房间？', key: 'living room', keyZh: '客厅', options: ['客厅', '浴室', '餐厅'], answer: 0, explain: 'Mum’s in the living room. 妈妈在客厅。' },
        ],
      },
      {
        id: 4,
        slug: 'u6-4',
        stage: 'explore',
        title: '两个词拼出一个新词',
        topic: 'bed + room = bedroom',
        emoji: '🧪',
        explore: [
          {
            emoji: '🧩',
            title: '英语也会「拼字」',
            en: 'bedroom = bed + room',
            zh: '英语里很多长词是短的词拼起来的，就像乐高积木 —— 认识两块，就认识一整块。',
            bullets: ['bed 床 + room 房间 = bedroom 卧室', 'bath 洗澡 + room 房间 = bathroom 浴室', 'living room = living 生活的 + room 房间 = 客厅'],
          },
          {
            emoji: '🏠',
            title: '一个家的五个房间',
            en: 'living room · bedroom · bathroom · kitchen · dining room',
            zh: '中式房子和英式房子的房间名不完全一样：dining room（餐厅）在英语国家通常是单独一间。',
            bullets: ['living room 客厅 —— 看电视、聊天', 'bedroom 卧室 —— 睡觉', 'bathroom 浴室 —— 洗澡、刷牙', 'kitchen 厨房 —— 做饭', 'dining room 餐厅 —— 吃饭'],
          },
          {
            emoji: '🤝',
            title: '一起分享的家',
            en: 'Let’s make a new home there and share it!',
            zh: '课文里的小动物找到苹果，决定一起建个新家、一起分享。分享让家更 sweet（温馨）。',
            bullets: ['share 分享 —— 一人一半，两个人都开心', 'sweet home 温馨的家', 'This is our sweet home!'],
          },
        ],
        tips: [
          { from: 'bed + room', to: 'bedroom', zh: '卧室' },
          { from: 'bath + room', to: 'bathroom', zh: '浴室' },
        ],
        exercise: [
          { q: '“bedroom” 是哪两个词拼起来的？', key: 'bedroom = bed + room', keyZh: 'bed + room = 卧室', options: ['bed + room', 'bath + room', 'bed + ball'], answer: 0, explain: 'bed 床 + room 房间 = bedroom 卧室。' },
          { q: '“bathroom” 是哪两个词拼起来的？', key: 'bathroom = bath + room', keyZh: 'bath + room = 浴室', options: ['bath + room', 'bed + room', 'bag + room'], answer: 0, explain: 'bath 洗澡 + room 房间 = bathroom 浴室。' },
        ],
      },
      {
        id: 5,
        slug: 'u6-5',
        stage: 'quiz',
        title: '闯关测',
        topic: 'Unit Quiz',
        emoji: '🏁',
        exercise: [
          { q: '“bathroom” 是？', key: 'bathroom', keyZh: '浴室，卫生间', options: ['浴室，卫生间', '厨房', '客厅'], answer: 0, explain: 'bath + room = bathroom 浴室。' },
          { q: '“Where’s the cat?” 问的是？', key: 'Where’s the cat?', keyZh: '猫在哪里？', options: ['猫在哪里？', '猫是什么颜色？', '这是猫吗？'], answer: 0, explain: 'where = 在哪里。' },
          { q: '“table” 是？', key: 'table', keyZh: '桌子', options: ['桌子', '床', '球'], answer: 0, explain: 'table = 桌子。' },
          { q: '“share” 意思是？', key: 'share', keyZh: '共用；分享', options: ['共用；分享', '放', '喜欢'], answer: 0, explain: 'share = 分享。' },
          { q: '“I like my home.” 意思是？', key: 'I like my home.', keyZh: '我喜欢我的家。', options: ['我喜欢我的家。', '这是我的家。', '我的家在哪里？'], answer: 0, explain: 'like = 喜欢。' },
          { q: '“under” 是？', key: 'under', keyZh: '在……下面', options: ['在……下面', '在……上面', '全部'], answer: 0, explain: 'under = 在……下面。' },
        ],
      },
    ],
  },
]
// ============================ 英语小剧场（附录剧本）============================
// 内容取自教材附录 three plays：角色表、重点词、逐句台词（含中文与舞台提示）。
export const eng3aPlays: EngPlay[] = [
  {
    slug: 'play-true-friends',
    emoji: '🦌',
    title: 'True friends',
    titleZh: '真正的朋友',
    theme: { color: '#16a34a', colorSoft: '#dcfce7' },
    characters: ['Mouse', 'Deer', 'Rabbit', 'Hunter'],
    charactersZh: { Mouse: '老鼠', Deer: '小鹿', Rabbit: '兔子', Hunter: '猎人' },
    words: [
      { en: 'true', zh: '真正的', emoji: '💚' },
      { en: 'mouse', zh: '老鼠', emoji: '🐭' },
      { en: 'deer', zh: '鹿', emoji: '🦌' },
      { en: 'rabbit', zh: '兔子', emoji: '🐰' },
      { en: 'hunter', zh: '猎人', emoji: '🏹' },
      { en: 'get', zh: '抓住；得到', emoji: '✊' },
      { en: 'run after', zh: '追赶', emoji: '🏃' },
      { en: 'get out', zh: '逃出来；出来', emoji: '🚪' },
      { en: 'each other', zh: '互相，彼此', emoji: '🤝' },
      { en: 'friend', zh: '朋友', emoji: '👫' },
    ],
    lines: [
      { speaker: 'Mouse', en: 'Hello! I am Mouse.', zh: '你好！我是老鼠。' },
      { speaker: 'Deer', en: 'Hello! I am Deer. He is Rabbit.', zh: '你好！我是小鹿。他是兔子。' },
      { speaker: 'Rabbit', en: 'We’re friends. Let’s play together!', zh: '我们是朋友。我们一起玩吧！' },
      { speaker: 'Mouse', en: 'Great!', zh: '太棒了！' },
      { speaker: 'Deer', en: 'Hunter! Run, friends!', zh: '猎人来了！快跑，朋友们！' },
      {
        speaker: 'Deer & Mouse',
        en: 'Oh, no. Let’s help Rabbit! We are friends.',
        zh: '哦，不。我们去救兔子！我们是朋友。',
        stage: 'The hunter gets Rabbit.',
      },
      { speaker: 'Hunter', en: 'Ha ha! A deer!', zh: '哈哈！一只鹿！', stage: 'Hunter runs after Deer.' },
      {
        speaker: 'Rabbit',
        en: 'Great! I’m out. Let’s run!',
        zh: '太好了！我逃出来了。我们快跑！',
        stage: 'Mouse helps Rabbit to get out.',
      },
      { speaker: 'Rabbit', en: 'Thank you, friends!', zh: '谢谢你们，朋友们！' },
      { speaker: 'Deer & Mouse', en: 'Friends help each other.', zh: '朋友之间要互相帮助。' },
    ],
    moral: '朋友之间互相帮助 —— Friends help each other.',
  },
  {
    slug: 'play-mulan',
    emoji: '🌸',
    title: 'Mulan',
    titleZh: '花木兰',
    theme: { color: '#db2777', colorSoft: '#fce7f3' },
    characters: ['Mulan', 'Dad', 'Mum', 'Brother', 'Soldiers'],
    charactersZh: { Mulan: '木兰', Dad: '爸爸', Mum: '妈妈', Brother: '弟弟', Soldiers: '士兵们' },
    words: [
      { en: 'worried', zh: '担心的', emoji: '😟' },
      { en: 'must', zh: '必须', emoji: '❗' },
      { en: 'join', zh: '参加，加入', emoji: '🤝' },
      { en: 'army', zh: '军队', emoji: '🛡️' },
      { en: 'need', zh: '需要', emoji: '🙏' },
      { en: 'idea', zh: '主意，想法', emoji: '💡' },
      { en: 'ready', zh: '准备好的', emoji: '✅' },
      { en: 'country', zh: '国家', emoji: '🇨🇳' },
      { en: 'girl', zh: '女孩', emoji: '👧' },
      { en: 'soldier', zh: '士兵', emoji: '💂' },
      { en: 'miss', zh: '想念', emoji: '💭' },
      { en: 'well', zh: '好吧（表示让步）', emoji: '😌' },
    ],
    lines: [
      {
        speaker: 'Mulan',
        en: 'I am Mulan. I have a happy family. This is my dad. This is my mum. That’s my little brother.',
        zh: '我是木兰。我有一个幸福的家庭。这是我爸爸。这是我妈妈。那是我的弟弟。',
      },
      { speaker: 'Mulan', en: 'Dad, you are worried. Why?', zh: '爸爸，你在担心。为什么？' },
      { speaker: 'Dad', en: 'I must join the army.', zh: '我必须去参军。' },
      { speaker: 'Mulan', en: 'But our family needs you. My brother is only five. I have an idea.', zh: '可是我们家需要你。弟弟才五岁。我有个主意。' },
      { speaker: 'Mulan', en: 'Dad, Mum, look! I’m ready.', zh: '爸爸、妈妈，看！我准备好了。' },
      { speaker: 'Mum', en: 'No, don’t go!', zh: '不，别去！' },
      { speaker: 'Mulan', en: 'Please let me go. For our family, and for our country.', zh: '请让我去吧。为了我们的家，也为了我们的国家。' },
      { speaker: 'Dad', en: 'Well… OK. Take care, my girl.', zh: '好吧……保重，我的孩子。' },
      { speaker: 'Brother', en: 'Bye-bye, dear sister.', zh: '再见，亲爱的姐姐。' },
      { speaker: 'Mulan', en: 'Great! I can go home now. Let’s go, brother!', zh: '太好了！我现在可以回家了。我们走吧！', stage: 'After 12 years.' },
      { speaker: 'Mulan’s family', en: 'Mulan, you’re back! We missed you so much!', zh: '木兰，你回来了！我们好想你！' },
      { speaker: 'Mulan', en: 'I missed you, too!', zh: '我也好想你们！' },
      { speaker: 'Soldier 1', en: 'Who’s that?', zh: '那是谁？' },
      { speaker: 'Soldier 2', en: 'Mulan, are you a girl?', zh: '木兰，你是女孩吗？' },
      { speaker: 'Mulan', en: 'Yes!', zh: '是的！' },
      { speaker: 'Soldiers', en: 'Wow! You are a great girl, for your family and for the country!', zh: '哇！你真是了不起，为了家人，也为了国家！' },
    ],
    moral: '为了家人和国家勇敢担当 —— For our family and for our country.',
  },
  {
    slug: 'play-goldilocks',
    emoji: '🐻',
    title: 'Goldilocks and the three bears',
    titleZh: '金发姑娘和三只熊',
    theme: { color: '#b45309', colorSoft: '#fef3c7' },
    characters: ['Goldilocks', 'Papa Bear', 'Mama Bear', 'Baby Bear'],
    charactersZh: {
      Goldilocks: '金发姑娘',
      'Papa Bear': '熊爸爸',
      'Mama Bear': '熊妈妈',
      'Baby Bear': '熊宝宝',
    },
    words: [
      { en: 'bear', zh: '熊', emoji: '🐻' },
      { en: 'anyone', zh: '任何人；有人', emoji: '🙋' },
      { en: 'house', zh: '房子', emoji: '🏠' },
      { en: 'into', zh: '进入……里面', emoji: '➡️' },
      { en: 'next to', zh: '在……旁边', emoji: '↔️' },
      { en: 'window', zh: '窗户', emoji: '🪟' },
      { en: 'bowl', zh: '碗', emoji: '🥣' },
      { en: 'upstairs', zh: '楼上', emoji: '⬆️' },
      { en: 'enter', zh: '进入', emoji: '🚪' },
      { en: 'wake up', zh: '醒来', emoji: '⏰' },
      { en: 'sorry', zh: '抱歉，对不起', emoji: '🙇' },
      { en: 'again', zh: '再一次', emoji: '🔁' },
    ],
    lines: [
      { speaker: 'Goldilocks', en: 'Hello! Anyone home? Your door is open.', zh: '有人在家吗？你们的门开着。' },
      {
        speaker: 'Goldilocks',
        en: 'This is a nice living room. Two big chairs and one small chair are next to the window.',
        zh: '这间客厅真好。两把大椅子和一把小椅子在窗户旁边。',
      },
      {
        speaker: 'Goldilocks',
        en: 'It’s the kitchen. Two big bowls and one small bowl are on the table.',
        zh: '这是厨房。两个大碗和一个小碗在桌子上。',
      },
      { speaker: 'Goldilocks', en: 'Oh, two big beds and one small bed. I’m in the bedroom.', zh: '哦，两张床和一张小床。我在卧室里。' },
      { speaker: 'Papa Bear', en: 'The door is open. Who is in our house?', zh: '门开着。谁在我们的房子里？' },
      { speaker: 'Mama Bear', en: 'Let’s see.', zh: '我们去看看。' },
      { speaker: 'Baby Bear', en: 'Who is in my bed?', zh: '谁在我的床上？' },
      {
        speaker: 'Goldilocks',
        en: 'I’m sorry!',
        zh: '对不起！',
        stage: 'Goldilocks wakes up.',
      },
      { speaker: 'The Bears', en: 'It’s OK. But don’t do this again.', zh: '没关系。但是不要再这样做了。' },
      { speaker: 'Goldilocks', en: 'OK.', zh: '好的。' },
    ],
    moral: '不能随便进别人家、动别人的东西 —— Don’t do this again.',
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
  if (!unitSlug || !lessonSlug) return undefined
  const unitIdx = eng3aUnits.findIndex((u) => u.slug === unitSlug)
  if (unitIdx < 0) return undefined
  const unit = eng3aUnits[unitIdx]
  const lessonIdx = unit.lessons.findIndex((l) => l.slug === lessonSlug)
  if (lessonIdx < 0) return undefined
  return { unit, lesson: unit.lessons[lessonIdx], unitIdx, lessonIdx }
}

export function getEngPlay(slug: string | undefined): EngPlay | undefined {
  if (!slug) return undefined
  return eng3aPlays.find((p) => p.slug === slug)
}

/** 取某单元的复习取词 key 前缀（供复习系统 / WrongBook 展示来源） */
export function engLessonLabel(unitSlug: string, lessonSlug: string): string {
  const u = getEngUnit(unitSlug)
  const l = u?.lessons.find((x) => x.slug === lessonSlug)
  return u && l ? `${u.title} · ${l.title}` : lessonSlug
}

/** 某单元的全部单词（重点词 + 补充词，按 en 去重） */
export function collectEngUnitWords(unitSlug: string): EngWord[] {
  const u = getEngUnit(unitSlug)
  if (!u) return []
  const seen = new Set<string>()
  const out: EngWord[] = []
  for (const lesson of u.lessons) {
    for (const w of [...(lesson.words ?? []), ...(lesson.moreWords ?? [])]) {
      const k = w.en.toLowerCase()
      if (seen.has(k)) continue
      seen.add(k)
      out.push(w)
    }
  }
  return out
}

/** 某剧本的全部重点词 */
export function collectEngPlayWords(slug: string): EngWord[] {
  return getEngPlay(slug)?.words ?? []
}

/** 某单元的「关卡完成度」：每一关是否完成由页面传入的判定函数决定 */
export function unitStageLessons(unit: EngUnit): EngLesson[] {
  return ENG_STAGES.map((s) => unit.lessons.find((l) => l.stage === s.key)).filter(
    (l): l is EngLesson => !!l,
  )
}

// ============================ 统计 ============================
/** 全部课文课数（用于首页进度分母，含闯关测） */
export const totalEngLessons = eng3aUnits.reduce((a, u) => a + u.lessons.length, 0)

/** 课文重点词数量（带例句的核心词） */
export const eng3aKeyWordCount = eng3aUnits.reduce(
  (a, u) => a + u.lessons.reduce((b, l) => b + (l.words?.length ?? 0), 0),
  0,
)

/** 补充词数量（教材词汇表余下的功能词） */
export const eng3aMoreWordCount = eng3aUnits.reduce(
  (a, u) => a + u.lessons.reduce((b, l) => b + (l.moreWords?.length ?? 0), 0),
  0,
)

/** 课文词汇总量（重点词 + 补充词，已按单元去重） */
export const eng3aWordCount = eng3aUnits.reduce((a, u) => a + collectEngUnitWords(u.slug).length, 0)

/** 剧本重点词总量 */
export const eng3aPlayWordCount = eng3aPlays.reduce((a, p) => a + p.words.length, 0)

/** 剧本台词总行数 */
export const eng3aPlayLineCount = eng3aPlays.reduce((a, p) => a + p.lines.length, 0)

/** 教材全部单元数（Welcome + Unit 1–6） */
export const eng3aUnitCount = eng3aUnits.length
