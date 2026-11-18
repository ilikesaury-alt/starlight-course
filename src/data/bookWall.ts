// 绘本桥梁书馆（/books）的目录数据 —— 书单唯一真源。
//
// 设计约定（AGENTS.md「绘本桥梁书馆」小节）：
//   · 这里只放**轻量元数据**（中英书名 / 作者 / 蓝思 / 主题 / 入口），零大数据依赖、
//     零 SRS 注册 —— 书馆是纯目录页，点卡片跳到已有阅读模块。
//   · 上架一本新书 = 把对应条目的 `available` 改成 true 并填 `linkTo`，
//     **首页与其它代码零改动**（首页只显示 bookWallStats 的静态数字）。
//   · 蓝思区间按用户书单原样展示。联网核实发现 5 套的实际蓝思与书单有出入
//     （Frog and Toad / Junie B. Jones / Nate the Great / Curious George /
//     Ricky Ricotta），差异只在 docs 说明，UI 不擅自改用户给的数。
//
// 来源：用户提供的 13 套桥梁书书单 + app 已有的 Rocket Girl（第 14 套）。
// 作者/主题：联网核实（Scholastic / Random House / Simon & Schuster 等出版社页）。

export interface BookSeries {
  slug: string
  titleEn: string
  titleZh: string
  emoji: string
  author: string
  /** 蓝思下界（含），取自用户书单 */
  lexileMin: number
  /** 蓝思上界（含），取自用户书单 */
  lexileMax: number
  /** 适合年级，如 'K–2' / '1–3' */
  grade: string
  /** 主题标签（中文），用于筛选与展示 */
  themes: string[]
  /** true = 已有可读内容，可点进 linkTo；false = 准备中灰卡 */
  available: boolean
  /** 可读模块的路由（available=true 时必填） */
  linkTo?: string
  color: string
  colorSoft: string
}

/** 琥珀橙主色；各书用不同柔和色区分，避免 14 张卡一片同色 */
const C = {
  amber: ['#d97706', '#fef3c7'],
  green: ['#16a34a', '#dcfce7'],
  violet: ['#7c3aed', '#ede9fe'],
  sky: ['#0284c7', '#e0f2fe'],
  rose: ['#e11d48', '#ffe4e6'],
  teal: ['#0d9488', '#ccfbf1'],
  indigo: ['#4f46e5', '#e0e7ff'],
  orange: ['#ea580c', '#ffedd5'],
  emerald: ['#059669', '#d1fae5'],
  fuchsia: ['#c026d3', '#fae8ff'],
  blue: ['#2563eb', '#dbeafe'],
  lime: ['#65a30d', '#ecfccb'],
  cyan: ['#0891b2', '#cffafe'],
  stone: ['#57534e', '#f5f5f4'],
} as const

/** 14 套书：13 套用户书单 + app 已有的 Rocket Girl。 */
export const BOOK_SERIES: BookSeries[] = [
  // ---- 可读（2 套）----
  {
    slug: 'fly-guy',
    titleEn: 'Fly Guy',
    titleZh: '苍蝇小子',
    emoji: '🐝',
    author: 'Tedd Arnold',
    lexileMin: 270,
    lexileMax: 470,
    grade: 'K–2',
    themes: ['昆虫', '校园', '幽默'],
    available: true,
    linkTo: '/flyguy',
    color: C.green[0],
    colorSoft: C.green[1],
  },
  {
    slug: 'rocket-girl',
    titleEn: 'Rocket Girl',
    titleZh: '火箭女孩',
    emoji: '🚀',
    author: 'Rebecca Elliott',
    lexileMin: 370,
    lexileMax: 560,
    grade: '1–3',
    themes: ['冒险', '太空', '校园'],
    available: true,
    linkTo: '/rocketgirl',
    color: C.violet[0],
    colorSoft: C.violet[1],
  },

  // ---- 准备中（12 套，按蓝思下界从易到难）----
  {
    slug: 'nate-the-great',
    titleEn: 'Nate the Great',
    titleZh: '大侦探内特',
    emoji: '🕵️',
    author: 'Marjorie Weinman Sharmat',
    lexileMin: 230,
    lexileMax: 570,
    grade: '1–4',
    themes: ['侦探', '推理', '狗狗'],
    available: false,
    color: C.stone[0],
    colorSoft: C.stone[1],
  },
  {
    slug: 'junie-b-jones',
    titleEn: 'Junie B. Jones',
    titleZh: '朱尼·琼斯',
    emoji: '🎒',
    author: 'Barbara Park',
    lexileMin: 250,
    lexileMax: 420,
    grade: '1–3',
    themes: ['校园', '家庭', '幽默'],
    available: false,
    color: C.rose[0],
    colorSoft: C.rose[1],
  },
  {
    slug: 'winnie-the-witch',
    titleEn: 'Winnie the Witch',
    titleZh: '女巫温妮',
    emoji: '🧙',
    author: 'Valerie Thomas',
    lexileMin: 330,
    lexileMax: 560,
    grade: '2–3',
    themes: ['魔法', '动物', '幽默'],
    available: false,
    color: C.fuchsia[0],
    colorSoft: C.fuchsia[1],
  },
  {
    slug: 'henry-and-mudge',
    titleEn: 'Henry and Mudge',
    titleZh: '亨利和马吉',
    emoji: '🐕',
    author: 'Cynthia Rylant',
    lexileMin: 370,
    lexileMax: 600,
    grade: 'K–2',
    themes: ['宠物', '家庭', '四季'],
    available: false,
    color: C.orange[0],
    colorSoft: C.orange[1],
  },
  {
    slug: 'owl-diaries',
    titleEn: 'Owl Diaries',
    titleZh: '猫头鹰日记',
    emoji: '🦉',
    author: 'Rebecca Elliott',
    lexileMin: 370,
    lexileMax: 560,
    grade: '1–3',
    themes: ['猫头鹰', '校园', '友谊'],
    available: false,
    color: C.sky[0],
    colorSoft: C.sky[1],
  },
  {
    slug: 'frog-and-toad',
    titleEn: 'Frog and Toad',
    titleZh: '青蛙与蟾蜍',
    emoji: '🐸',
    author: 'Arnold Lobel',
    lexileMin: 400,
    lexileMax: 490,
    grade: 'K–2',
    themes: ['友谊', '情感', '自然'],
    available: false,
    color: C.emerald[0],
    colorSoft: C.emerald[1],
  },
  {
    slug: 'mercy-watson',
    titleEn: 'Mercy Watson',
    titleZh: '小猪梅西',
    emoji: '🐷',
    author: 'Kate DiCamillo',
    lexileMin: 450,
    lexileMax: 550,
    grade: 'K–3',
    themes: ['小猪', '食物', '邻居'],
    available: false,
    color: C.rose[0],
    colorSoft: C.rose[1],
  },
  {
    slug: 'press-start',
    titleEn: 'Press Start!',
    titleZh: '方块兔',
    emoji: '🎮',
    author: 'Thomas Flintham',
    lexileMin: 450,
    lexileMax: 550,
    grade: '1–3',
    themes: ['电子游戏', '超级英雄', '兔子'],
    available: false,
    color: C.indigo[0],
    colorSoft: C.indigo[1],
  },
  {
    slug: 'monkey-me',
    titleEn: 'Monkey Me',
    titleZh: '猴子男孩',
    emoji: '🐵',
    author: 'Timothy Knapman',
    lexileMin: 490,
    lexileMax: 510,
    grade: '1–3',
    themes: ['猴子', '科学馆', '调皮'],
    available: false,
    color: C.amber[0],
    colorSoft: C.amber[1],
  },
  {
    slug: 'curious-george',
    titleEn: 'Curious George',
    titleZh: '好奇猴',
    emoji: '🐒',
    author: 'H. A. Rey & Margret Rey',
    lexileMin: 470,
    lexileMax: 580,
    grade: 'K–3',
    themes: ['猴子', '好奇心', '生活'],
    available: false,
    color: C.cyan[0],
    colorSoft: C.cyan[1],
  },
  {
    slug: 'kung-pow-chicken',
    titleEn: 'Kung Pow Chicken',
    titleZh: '宫保鸡丁',
    emoji: '🐔',
    author: 'Cyndi Marko',
    lexileMin: 550,
    lexileMax: 580,
    grade: '1–3',
    themes: ['超级英雄', '小鸡', '搞笑'],
    available: false,
    color: C.lime[0],
    colorSoft: C.lime[1],
  },
  {
    slug: 'mighty-robot',
    titleEn: "Ricky Ricotta's Mighty Robot",
    titleZh: '威猛机器人',
    emoji: '🤖',
    author: 'Dav Pilkey',
    lexileMin: 450,
    lexileMax: 640,
    grade: '1–3',
    themes: ['机器人', '友谊', '冒险'],
    available: false,
    color: C.blue[0],
    colorSoft: C.blue[1],
  },
]

/** 首页书馆卡用的静态规模数字（不 import 任何大数据模块） */
export const bookWallStats = {
  total: BOOK_SERIES.length,
  available: BOOK_SERIES.filter((s) => s.available).length,
}

/**
 * 难度档：按用户书单的蓝思区间下界分档。
 * 一本书跨多档时归到**下界所在档**（书单区间就是它的定位）。
 */
export type LexileBand = 'all' | 'start' | 'grow' | 'challenge'

export const LEXILE_BANDS: { id: LexileBand; label: string; note: string }[] = [
  { id: 'all', label: '全部', note: '所有难度' },
  { id: 'start', label: '起步', note: '230–400L' },
  { id: 'grow', label: '进阶', note: '400–550L' },
  { id: 'challenge', label: '挑战', note: '550L+' },
]

export function bandOf(series: BookSeries): Exclude<LexileBand, 'all'> {
  if (series.lexileMin < 400) return 'start'
  if (series.lexileMin < 550) return 'grow'
  return 'challenge'
}
