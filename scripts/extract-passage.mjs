// 课文点读数据生成脚本（T5.1）
//
// 用法：
//   node scripts/extract-passage.mjs 1-1 4-1        # 只处理指定课，写入数据文件
//   node scripts/extract-passage.mjs --all          # 处理全部 96 课，写入数据文件
//   node scripts/extract-passage.mjs --all --dry-run # 只输出抽样与噪音报告，不写文件
//   node scripts/extract-passage.mjs --report        # 抽样报告（不写文件）
// 不传参数则处理脚本顶部 DEFAULT_LESSONS。
//
// 数据来源：src/data/starlight0_extracted.json（教材 PDF 逐页 OCR 文本）。
// 原文提取是「已有数据的再利用」：starlight-book.ts 已按课清洗过一遍对话原句，
// 本脚本做同样的清洗但输出成整段 passage，供点读（TappableText）按词切分使用。
//
// 输出：src/data/starlight-passage.ts（生成文件，请勿手改）

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src/data/starlight0_extracted.json')
const OUT = join(ROOT, 'src/data/starlight-passage.ts')

/** 试点课：1-1（打招呼）与 4-1（玩具），验证后再批量补 */
const DEFAULT_LESSONS = ['1-1', '4-1']

/** 教材指令行 / 页眉页脚：不是课文，不要 */
const INSTRUCTION = /^(listen|read the (words|sentence)|look|act|sing|point|match|draw|colour|color|circle|trace|clap|stand|sit|open|close|write|ask|answer|do a role-play|let's|tick|use|help|be a |english only|class rules|helping hands|say hello|welcome|finish and|finish!|put your|connect|write the|check your)/i
const NOISE = /^(\d+\s*)?(unit \d+( lesson \d*)?|\d+[a-z]?)$/i
/** 教材页眉「Unit N Lesson N」：行尾页码会被下面的清理抹掉，末位数字可能缺失 */
const HEADER = /^unit\s+\d+\s+lesson/i
/** 单词表（小标题 / 读词页）：只是一个个词，不算课文
 *  限定为单词，避免误杀换行句子的前半句（见下方续行注释） */
const VOCAB_ONLY = /^[a-z' ]+$/i
/** 出版社内封的营销/免责文字：出现在每个单元的 Quiz 页 */
const PROMO =
  /quiz will be given|allow your child|complete the quiz|participate actively|please let your child|for parents|teacher will|copyright|all rights reserved/i
/** 教师指导语（漏过 INSTRUCTION 的部分） */
const GUIDANCE =
  /^(find the missing|read and find|keep eye contact|colour the|color the|write your|look at the|tick the|cut out|paste |circle the|draw a|listen and repeat|point to|hold up|place |group |move |make a|do it again|ask your|chant with me|stand up|sit down|wave |clap )/i
/** OCR 排版残留：带圈数字①②③ */
const ARTIFACT_CIRCLED = /[①-⑳⓪❶-❿]/
/** OCR 胶连的界面文字：StartFinish / Start!Finish!
 *  必须大小写敏感：写成 [A-Z]{4,}[a-z] 再加 /i 会退化成「任意4个字母+1个字母」，
 *  会把 Hello / Good morning 之类正文全部误杀。 */
const ARTIFACT_GLUE = /[A-Z]{4,}[a-z]/
/** 独立的界面词（大小写不敏感） */
const ARTIFACT_WORD = /\b(Start|Finish|Page|Answer)!/
const ARTIFACT = (line) =>
  ARTIFACT_CIRCLED.test(line) || ARTIFACT_GLUE.test(line) || ARTIFACT_WORD.test(line)

/** 比较用归一化：去标点与空白、转小写（用于去重与判重） */
function norm(s) {
  return String(s).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
}

/**
 * 从一页 OCR 文本里挑出课文句子：
 * 逐行去掉页码与行尾页码残留，再按「短句 + 含英文字母 + 非指令 + 非单词表」筛出对话原句。
 * OCR 会把一个句子按印刷行断开（如 "Hello," / "monster!"），这里再按标点合并回整句。
 */
/** 活动小标题：没句末标点，会被续行合并粘进句子。遇到它要断开并丢弃没收尾的前半句 */
const ACTIVITY =
  /^(look,? ?listen and say|listen and say|look and say|say and act|say and do|say and repeat|sing a song|chant|tips|read and find|i say,? you |warm ?up|draw and|listen and repeat|act it out|do a role-play|let'?s count|read the words)/i

/**
 * 从一页 OCR 文本里重建课文行。
 *
 * 三段式，顺序不能调换：
 *   ① 归一化 + 丢纯页码/页眉/非英文行
 *   ② 按印刷换行合并续行（重建完整句）
 *   ③ 才判内容规则（指令/营销/词表/排版残留/长度）
 *
 * ②必须在③之前：内容规则是按整句匹配的，若先跑③，被拦下的半句会留下
 * 孤儿碎片。例如营销文案在页面上是换行的
 *   "A quiz will be given to your child by the teacher every "  ← 无句末标点
 *   "month;"
 * 先跑 PROMO 会拦掉前半句，"month;" 就成了孤立的一行。
 * 同理 "What number" / "is missing?" 会被 VOCAB_ONLY 拦成 "is missing?"。
 */
function linesOf(page) {
  // ① 归一化
  const stage1 = []
  for (const raw of String(page).split('\n')) {
    // 归一化。注意弯撇号 ’→'：教材 OCR 输出的是弯撇号，而 INSTRUCTION / ACTIVITY /
    // VOCAB_ONLY 等规则里写的是直角撇号，不统一会让 "Let’s count." 这类行全部漏网。
    const line = raw
      .replace(/[’‘`]/g, "'")
      .replace(/^\s*\d+\s*/, '')
      .replace(/\s*\d+\s*$/, '')
      .replace(/！/g, '!').replace(/？/g, '?').replace(/，/g, ',')
      .trim()
    if (!line) continue
    if (NOISE.test(line)) continue
    if (HEADER.test(line)) continue
    if (!/[a-zA-Z]/.test(line)) continue // 纯中文/符号行
    stage1.push(line)
  }

  // ② 合并续行
  //    边界原则：凡是会被 stage③ 判定为「非课文」的行，都不能参与粘接。
  //    否则它在合并后才轮到被过滤，行首已粘上别的词，锚定 ^ 的规则就拦不住了
  //    （如 "doll" + "Read the words." → "doll Read the words." 逃过 INSTRUCTION）。
  //    PROMO 例外：营销文案本身跨印刷行且关键词被拆开，必须先合并才能整体识别。
  const isBoundary = (l) => ACTIVITY.test(l) || INSTRUCTION.test(l) || GUIDANCE.test(l)
  const stage2 = []
  for (const line of stage1) {
    const prev = stage2[stage2.length - 1]
    if (isBoundary(line)) {
      // 硬边界：它前面的残句（"one" / "doll" / "Tips"）不是课文，丢弃
      if (prev != null && !/[.!?…]$/.test(prev)) stage2.pop()
      continue
    }
    if (prev != null && !/[.!?…]$/.test(prev)) {
      stage2[stage2.length - 1] = `${prev} ${line}`.trim()
      continue
    }
    stage2.push(line)
  }

  // ③ 内容规则（此时每行都是完整句）
  return stage2.filter((line) => {
    if (INSTRUCTION.test(line)) return false
    if (PROMO.test(line)) return false // 出版社营销/免责文字
    if (GUIDANCE.test(line)) return false // 教师指导语
    if (ACTIVITY.test(line)) return false
    if (line.length > 80) return false // 长行是说明文字
    if (ARTIFACT(line)) return false // 排版残留
    if (VOCAB_ONLY.test(line)) return false // 纯单词行 = 词表
    return true
  })
}

/** 抽取一课的课文：去重 + 去小节标题 + 保留出现顺序 */
function passageOf(lesson) {
  const seen = new Set()
  const titleKey = norm(lesson.title)
  const out = []
  for (const page of lesson.pages ?? []) {
    for (const line of linesOf(page)) {
      // 去重键忽略大小写与标点：教材里 'It's Loud!' 与 'It's loud.' 是同一句
      const key = norm(line)
      if (seen.has(key)) continue
      seen.add(key)
      // 与课名重复的是小节标题（页面头部已展示），点读时冗余
      if (key && key === titleKey) continue
      out.push(line)
    }
  }
  return out
}

// ---------- 参数解析 ----------
const argv = process.argv.slice(2)
const DRY = argv.includes('--dry-run') || argv.includes('--report')
const ALL = argv.includes('--all')
const explicit = argv.filter((a) => !a.startsWith('--'))

/** 全部 96 课：unit1..12 × lesson1..8 */
function allKeys() {
  const out = []
  for (let u = 1; u <= 12; u++) for (let l = 1; l <= 8; l++) out.push(`${u}-${l}`)
  return out
}

const keys = ALL ? allKeys() : explicit.length > 0 ? explicit : DEFAULT_LESSONS

let data
try {
  data = JSON.parse(readFileSync(SRC, 'utf8'))
} catch (err) {
  console.error(`读取 ${SRC} 失败：${err.message}`)
  process.exit(1)
}

// ---------- 噪音体检 ----------
// 第一轮用的粗指标（noverb/short/numeric）大部分是误报：儿童教材里
// “Hello!” “I'm Leo.” “What does 2 plus 3 equal?” 都是完全合格且重要的点读内容。
// 真正要拦的只有两类：(1) OCR 排版残留（带圈数字、粘连的界面文字）；
// (2) 与课名重复的小节标题。以下指标按此收敛。
const FLAGS = {
  // OCR 排版残留：带圈数字①②③、胶连的界面文字（StartFinish）、孤立符号块
  artifact: (line) => /[①-⑳⓪❶-❿]/.test(line) || /[A-Z]{4,}[a-z]/.test(line) || /\b(Start|Finish|Page|Answer)\b/.test(line),
  // 小节标题与课名重复（页面头部已展示，点读时是冗余）
  title: (line, title) => norm(line) === norm(String(title)),
  // 非英文正文字符（排除教材合法的弯引号与省略号）
  nonEn: (line) => /[^\x00-\x7F’' ….,!?'-]/.test(line),
  // 指令残留（已由 INSTRUCTION 过滤，这里兜底看漏网的）
  instr: (line) => INSTRUCTION.test(line),
}

/** 收集一行命中的噪音类别。FLAGS 里都是正则 .test() 判定，不会抛异常，无需 try/catch 包裹。 */
function flagsOf(line, title) {
  const hits = []
  for (const [name, fn] of Object.entries(FLAGS)) {
    if (fn(line, title)) hits.push(name)
  }
  return hits
}

const entries = []
const noiseByFlag = Object.create(null)
const noiseSamples = Object.create(null)

for (const key of keys) {
  const [u, l] = key.split('-').map(Number)
  const unit = data[`unit${u}`]
  const lesson = unit?.lessons?.[`lesson${l}`]
  if (!lesson) {
    console.error(`skip ${key}: 找不到该课`)
    continue
  }
  const lines = passageOf(lesson)
  if (lines.length === 0) {
    console.error(`skip ${key}: 未提取到正文`)
    continue
  }
  for (const line of lines) {
    for (const f of flagsOf(line, lesson.title)) {
      noiseByFlag[f] = (noiseByFlag[f] ?? 0) + 1
      const bucket = (noiseSamples[f] ??= new Set())
      if (bucket.size < 12) bucket.add(`${key}  ${line}`)
    }
  }
  entries.push({ key, title: lesson.title, lines })
}

// ---------- 抽样报告（不写数据文件） ----------
if (DRY) {
  const total = entries.reduce((n, e) => n + e.lines.length, 0)
  console.log(`\n=== 覆盖 ===`)
  console.log(`课数 ${entries.length} / 目标 ${keys.length}；总句数 ${total}`)
  const counts = entries.map((e) => e.lines.length).sort((a, b) => a - b)
  const median = counts[Math.floor(counts.length / 2)] ?? 0
  console.log(`每课句数：min ${counts[0]} / 中位 ${median} / max ${counts[counts.length - 1]}`)
  const emptyish = entries.filter((e) => e.lines.length <= 2)
  console.log(`句数 <=2 的课（疑似抽不出正文）：${emptyish.length} 课 → ${emptyish.map((e) => e.key).join(' ')}`)

  console.log(`\n=== 噪音类别命中（可重叠） ===`)
  for (const [f, n] of Object.entries(noiseByFlag).sort((a, b) => b[1] - a[1])) {
    console.log(`${f.padEnd(9)} ${n}`)
  }
  for (const [f, set] of Object.entries(noiseSamples)) {
    console.log(`\n--- ${f} 样例 ---`)
    for (const s of set) console.log(`  ${s}`)
  }

  console.log(`\n=== 逐课抽样（每课前 3 句） ===`)
  for (const e of entries) {
    console.log(`${e.key.padEnd(5)} ${e.lines.slice(0, 3).join(' / ')}`)
  }
  console.log(`\n（--dry-run：未写入 ${OUT}）`)
  process.exit(0)
}

if (entries.length === 0) {
  console.error('没有可写出的课文，终止')
  process.exit(1)
}

const body = entries
  .map(
    (e) =>
      `  '${e.key}': {\n` +
      `    title: ${JSON.stringify(e.title)},\n` +
      `    lines: [\n${e.lines.map((l) => `      ${JSON.stringify(l)},`).join('\n')}\n    ],\n` +
      `  },`
  )
  .join('\n')

writeFileSync(
  OUT,
  `// Starlight 课文点读数据（生成文件，请勿手改）
// 由 scripts/extract-passage.mjs 从 src/data/starlight0_extracted.json 提取。
// 重新生成全部 96 课：node scripts/extract-passage.mjs --all
// 回退到试点两课：node scripts/extract-passage.mjs 1-1 4-1

export interface Passage {
  title: string
  lines: string[]
}

/** key 形如 '1-1'（单元号-课号） */
export const STARLIGHT_PASSAGE: Record<string, Passage> = {
${body}
}

export function getPassage(unit: number | string, lesson: number | string): Passage | undefined {
  return STARLIGHT_PASSAGE[\`\${unit}-\${lesson}\`]
}
`,
  'utf8'
)

console.log(`\n已写入 ${OUT}`)
