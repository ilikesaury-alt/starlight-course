// ============================================================
//  数学专项练习 · 题目数据（北师大三年级上册）
//  ------------------------------------------------------------
//  针对陈老师反馈的三点薄弱项：① 计算出错多 ② 读题不细 ③ 不圈关键词。
//
//  设计口径：
//  · 计算题**由代码算出答案**（不手写答案），避免出题时算错；用带种子的
//    伪随机数生成，给定 seed 结果完全可复现 —— e2e / 单测能拿固定数据。
//  · 每题带 cause（错因标签），供「错因复盘」按类重练。
//  · 读题圈关键词题手工编写（需要严谨的中文题干与关键词切分），
//    题干按 segments 逐块渲染，keyIdx 指向应圈的块（数字+单位、关系词、问题）。
//
//  本项目是英语学习工作台，这里**不接入 SRS / store / ModuleId**，
//  错题单独存 localStorage（见 mathWrong.ts），不升 persist 版本号。
// ============================================================

// ---------- 错因 ----------
export type CalcCause =
  | 'carry' // 进位忘加 1
  | 'borrow' // 退位忘借 1
  | 'times' // 乘法口诀不熟
  | 'align' // 竖式数位没对齐
  | 'divide' // 除法试商
  | 'sign' // 看错 + / −、运算顺序
  | 'bracket' // 有括号先算括号

export const CAUSE_LABEL: Record<CalcCause, string> = {
  carry: '进位忘加 1',
  borrow: '退位忘借 1',
  times: '乘法口诀不熟',
  align: '数位没对齐',
  divide: '除法试商',
  sign: '符号 / 顺序看错',
  bracket: '括号先算',
}

export interface CalcQuestion {
  id: string
  stem: string
  answer: number
  cause: CalcCause
  explain: string
}

export interface KeywordQuestion {
  id: string
  /** 完整题干（segments 依次拼接，读题第二步展示用） */
  text: string
  /** 可点击的题干分块 */
  segments: string[]
  /** 应圈出的分块下标（数字、单位、关系词、问题） */
  keyIdx: number[]
  /** 分步算式 */
  steps: string[]
  answer: number
  explain: string
}

/** 一轮里的一道题（判别联合用 kind 区分，两种题型交互不同） */
export type PracticeQuestion =
  | { kind: 'calc'; q: CalcQuestion }
  | { kind: 'keyword'; q: KeywordQuestion }

// ---------- 带种子的伪随机（mulberry32）----------
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ri = (rnd: () => number, min: number, max: number) =>
  Math.floor(rnd() * (max - min + 1)) + min

// ---------- 各类生成函数：答案一律用代码算 ----------

function addCarry(rnd: () => number): CalcQuestion {
  let a = 0
  let b = 0
  // 个位相加满十，必然要进位
  do {
    a = ri(rnd, 100, 899)
    b = ri(rnd, 100, 899)
  } while (a % 10 + (b % 10) < 10)
  return {
    id: '',
    stem: `${a} + ${b} =`,
    answer: a + b,
    cause: 'carry',
    explain: `个位 ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)} 满十，向十位进 1，别忘加上去。`,
  }
}

function subBorrow(rnd: () => number): CalcQuestion {
  let a = 0
  let b = 0
  // 个位不够减，必然要借位
  do {
    a = ri(rnd, 200, 900)
    b = ri(rnd, 100, a - 1)
  } while (a % 10 >= b % 10)
  return {
    id: '',
    stem: `${a} − ${b} =`,
    answer: a - b,
    cause: 'borrow',
    explain: `个位 ${a % 10} 减 ${b % 10} 不够，向十位借 1 当 10；十位被借走 1 要记得减掉。`,
  }
}

function timesTable(rnd: () => number): CalcQuestion {
  // 重点练 6、7、8、9 的口诀
  const a = ri(rnd, 6, 9)
  const b = ri(rnd, 2, 9)
  return {
    id: '',
    stem: `${a} × ${b} =`,
    answer: a * b,
    cause: 'times',
    explain: `乘法口诀要背熟：${b} × ${a} 和 ${a} × ${b} 得数一样，都是 ${a * b}。${a} × ${b} = ${a * b}。`,
  }
}

function mulByOneDigit(rnd: () => number): CalcQuestion {
  const a = ri(rnd, 23, 289)
  const b = ri(rnd, 2, 9)
  return {
    id: '',
    stem: `${a} × ${b} =`,
    answer: a * b,
    cause: 'align',
    explain: `列竖式：用 ${b} 依次去乘 ${a} 的每一位，从个位乘起，数位要对齐，满几十就向前一位进几。`,
  }
}

function divideByOneDigit(rnd: () => number): CalcQuestion {
  const b = ri(rnd, 2, 9)
  const q = ri(rnd, 12, 99)
  const a = b * q
  return {
    id: '',
    stem: `${a} ÷ ${b} =`,
    answer: q,
    cause: 'divide',
    explain: `想乘法算除法：${b} × ( ) = ${a}，因为 ${b} × ${q} = ${a}，所以商是 ${q}。`,
  }
}

function mixed(rnd: () => number, cause: CalcCause): CalcQuestion {
  const a = ri(rnd, 10, 60)
  const b = ri(rnd, 2, 9)
  const c = ri(rnd, 2, 9)
  // bracket 必须是带括号那一种；sign 是没有括号的混合运算（先乘除后加减）。
  // 不能随机选 kind 再给 cause —— 否则 causeFilter 指定 'sign' 时可能返回 'bracket'，
  // 单测钉死「按 causeFilter 出题必须只出该类」。
  const kind = cause === 'bracket' ? 1 : rnd() < 0.5 ? 0 : 2
  if (kind === 0) {
    return {
      id: '',
      stem: `${a} + ${b} × ${c} =`,
      answer: a + b * c,
      cause,
      explain: `先算乘法 ${b} × ${c} = ${b * c}，再算加法 ${a} + ${b * c} = ${a + b * c}。先乘除、后加减。`,
    }
  }
  if (kind === 1) {
    return {
      id: '',
      stem: `(${a} + ${b}) × ${c} =`,
      answer: (a + b) * c,
      cause,
      explain: `有括号先算括号里：${a} + ${b} = ${a + b}，再乘 ${c} = ${(a + b) * c}。`,
    }
  }
  return {
    id: '',
    stem: `${a} × ${b} − ${c} =`,
    answer: a * b - c,
    cause,
    explain: `先算乘法 ${a} × ${b} = ${a * b}，再减 ${c} = ${a * b - c}。先乘除、后加减。`,
  }
}

const GENERATORS: Record<CalcCause, (rnd: () => number) => CalcQuestion> = {
  carry: addCarry,
  borrow: subBorrow,
  times: timesTable,
  align: mulByOneDigit,
  divide: divideByOneDigit,
  sign: (rnd) => mixed(rnd, 'sign'),
  bracket: (rnd) => mixed(rnd, 'bracket'),
}

const MIXED_CAUSES: CalcCause[] = [
  'carry',
  'borrow',
  'times',
  'align',
  'divide',
  'sign',
  'bracket',
]

/**
 * 生成一组计算题。给定 seed + count + causeFilter，结果完全可复现。
 * causeFilter 为空时七类轮流出题（覆盖教材重点）；指定时只出该类（错因复盘重练用）。
 */
export function generateCalcRound(
  count = 10,
  seed: number = Date.now(),
  causeFilter?: CalcCause,
): CalcQuestion[] {
  const rnd = mulberry32(seed)
  const causes = causeFilter ? [causeFilter] : MIXED_CAUSES
  const out: CalcQuestion[] = []
  for (let i = 0; i < count; i++) {
    const cause = causes[i % causes.length]
    const q = GENERATORS[cause](rnd)
    q.id = `calc-${seed}-${i}`
    out.push(q)
  }
  return out
}

// ---------- 读题 + 圈关键词（手工编写的两步应用题）----------

export const KEYWORD_QUESTIONS: KeywordQuestion[] = [
  {
    id: 'kw-1',
    text: '图书室有故事书345本，科技书比故事书少128本。两种书一共多少本？',
    segments: ['图书室有故事书', '345', '本', '，', '科技书比故事书少', '128', '本', '。', '两种书一共多少', '本', '？'],
    keyIdx: [1, 2, 4, 5, 6, 8, 9],
    steps: ['科技书：345 − 128 = 217（本）', '一共：217 + 345 = 562（本）'],
    answer: 562,
    explain: '圈出「345」「128」「比…少」「一共」，就知道先算科技书有多少，再算两种书合起来。',
  },
  {
    id: 'kw-2',
    text: '小明有248张卡片，小红的卡片是小明的3倍。两人一共有多少张卡片？',
    segments: ['小明有', '248', '张卡片', '，', '小红的卡片是小明的', '3', '倍', '。', '两人一共有多少', '张卡片', '？'],
    keyIdx: [1, 2, 4, 5, 6, 8, 9],
    steps: ['小红：248 × 3 = 744（张）', '一共：248 + 744 = 992（张）'],
    answer: 992,
    explain: '圈出「248」「3倍」「一共」，先算小红的卡片，别把「小红的」直接加上去。',
  },
  {
    id: 'kw-3',
    text: '商店运来苹果156千克，运来的梨比苹果多78千克。苹果和梨一共多少千克？',
    segments: ['商店运来苹果', '156', '千克', '，', '运来的梨比苹果多', '78', '千克', '。', '苹果和梨一共多少', '千克', '？'],
    keyIdx: [1, 2, 4, 5, 6, 8, 9],
    steps: ['梨：156 + 78 = 234（千克）', '一共：156 + 234 = 390（千克）'],
    answer: 390,
    explain: '「比…多」用加法先算出梨，再加苹果，别只看一个数就列式。',
  },
  {
    id: 'kw-4',
    text: '三(1)班有学生42人，三(2)班比三(1)班少5人。两个班一共有多少人？',
    segments: ['三(1)班有学生', '42', '人', '，', '三(2)班比三(1)班少', '5', '人', '。', '两个班一共有多少', '人', '？'],
    keyIdx: [1, 2, 4, 5, 6, 8, 9],
    steps: ['三(2)班：42 − 5 = 37（人）', '一共：42 + 37 = 79（人）'],
    answer: 79,
    explain: '「比…少」先算出三(2)班人数，再求两个班合起来。',
  },
  {
    id: 'kw-5',
    text: '一本书有135页，小华每天读18页，读了5天。还剩多少页没读？',
    segments: ['一本书有', '135', '页', '，', '小华每天读', '18', '页', '，', '读了', '5', '天', '。', '还剩多少', '页', '没读', '？'],
    keyIdx: [1, 2, 4, 5, 6, 8, 9, 10, 12, 13],
    steps: ['已读：18 × 5 = 90（页）', '还剩：135 − 90 = 45（页）'],
    answer: 45,
    explain: '圈出「每天18页」「5天」「还剩」，先算已读多少页，再用总页数减掉。',
  },
  {
    id: 'kw-6',
    text: '每盒彩笔有12支，学校买了8盒，发给同学30支。还剩多少支？',
    segments: ['每盒彩笔有', '12', '支', '，', '学校买了', '8', '盒', '，', '发给同学', '30', '支', '。', '还剩多少', '支', '？'],
    keyIdx: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13],
    steps: ['一共：12 × 8 = 96（支）', '还剩：96 − 30 = 66（支）'],
    answer: 66,
    explain: '「每盒12支」是线索，先乘出总数，再减掉发出去的。',
  },
  {
    id: 'kw-7',
    text: '一辆小车限坐4人，有37人去春游，至少需要多少辆小车？',
    segments: ['一辆小车限坐', '4', '人', '，', '有', '37', '人去春游', '，', '至少需要多少辆', '小车', '？'],
    keyIdx: [0, 1, 2, 4, 5, 6, 8, 9],
    steps: ['37 ÷ 4 = 9（辆）……1（人）', '剩下1人也要一辆：9 + 1 = 10（辆）'],
    answer: 10,
    explain: '圈出「限坐4人」「37人」「至少」，除不尽时剩下的人也要再坐一辆。',
  },
  {
    id: 'kw-8',
    text: '果园里有梨树216棵，桃树的棵数是梨树的2倍。两种树一共多少棵？',
    segments: ['果园里有梨树', '216', '棵', '，', '桃树的棵数是梨树的', '2', '倍', '。', '两种树一共多少', '棵', '？'],
    keyIdx: [1, 2, 4, 5, 6, 8, 9],
    steps: ['桃树：216 × 2 = 432（棵）', '一共：216 + 432 = 648（棵）'],
    answer: 648,
    explain: '「2倍」先算出桃树，再和梨树相加。',
  },
  {
    id: 'kw-9',
    text: '学校买来5盒彩笔，每盒24支，用去38支。还剩多少支？',
    segments: ['学校买来', '5', '盒彩笔', '，', '每盒', '24', '支', '，', '用去', '38', '支', '。', '还剩多少', '支', '？'],
    keyIdx: [1, 2, 4, 5, 6, 8, 9, 10, 12, 13],
    steps: ['一共：24 × 5 = 120（支）', '还剩：120 − 38 = 82（支）'],
    answer: 82,
    explain: '「每盒24支」×「5盒」先算总数，再减用去的。',
  },
  {
    id: 'kw-10',
    text: '妈妈带了500元，买了一件128元的上衣和一双95元的鞋。还剩多少元？',
    segments: ['妈妈带了', '500', '元', '，', '买了一件', '128', '元的上衣', '和一双', '95', '元的鞋', '。', '还剩多少', '元', '？'],
    keyIdx: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12],
    steps: ['花掉：128 + 95 = 223（元）', '还剩：500 − 223 = 277（元）'],
    answer: 277,
    explain: '先算两样东西一共花多少，再用带的钱减掉。',
  },
  {
    id: 'kw-11',
    text: '每行站16人，站了6行。其中有女生52人，男生有多少人？',
    segments: ['每行站', '16', '人', '，', '站了', '6', '行', '。', '其中有女生', '52', '人', '，', '男生有多少', '人', '？'],
    keyIdx: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13],
    steps: ['总人数：16 × 6 = 96（人）', '男生：96 − 52 = 44（人）'],
    answer: 44,
    explain: '先算出一共有多少人，再减去女生人数就是男生。',
  },
  {
    id: 'kw-12',
    text: '第一天读了48页，第二天读的是第一天的2倍。两天一共读了多少页？',
    segments: ['第一天读了', '48', '页', '，', '第二天读的是第一天的', '2', '倍', '。', '两天一共读了多少', '页', '？'],
    keyIdx: [1, 2, 4, 5, 6, 8, 9],
    steps: ['第二天：48 × 2 = 96（页）', '一共：48 + 96 = 144（页）'],
    answer: 144,
    explain: '「2倍」先算第二天，再把两天加起来。',
  },
]

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 从 hand-authored 题库里抽一组读题圈关键词题（给定 seed 可复现） */
export function keywordRound(count = 5, seed: number = Date.now()): KeywordQuestion[] {
  return shuffle(KEYWORD_QUESTIONS, mulberry32(seed)).slice(0, Math.min(count, KEYWORD_QUESTIONS.length))
}

// ---------- 组装成统一题目 ----------
export function makeCalcQuestions(count = 10, seed?: number, causeFilter?: CalcCause): PracticeQuestion[] {
  return generateCalcRound(count, seed, causeFilter).map((q) => ({ kind: 'calc' as const, q }))
}

export function makeKeywordQuestions(count = 5, seed?: number): PracticeQuestion[] {
  return keywordRound(count, seed).map((q) => ({ kind: 'keyword' as const, q }))
}
