// 课文点读数据生成脚本（T5.1）
//
// 用法：node scripts/extract-passage.mjs [unitLesson ...]
//   例：node scripts/extract-passage.mjs 1-1 4-1
//   不传参数则处理脚本顶部 DEFAULT_LESSONS。
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
const INSTRUCTION = /^(listen|read the (words|sentence)|look|act|sing|point|match|draw|colour|color|circle|trace|clap|stand|sit|open|close|write|ask|answer|do a role-play|let's|tick|use|help|be a |english only|class rules|helping hands|say hello|welcome)/i
const NOISE = /^(\d+\s*)?(unit \d+( lesson \d*)?|\d+[a-z]?)$/i
/** 教材页眉「Unit N Lesson N」：行尾页码会被下面的清理抹掉，末位数字可能缺失 */
const HEADER = /^unit\s+\d+\s+lesson/i
/** 单词表（小标题 / 读词页）：只是一个个词，不算课文 */
const VOCAB_ONLY = /^[a-z' ]+$/i

/**
 * 从一页 OCR 文本里挑出课文句子：
 * 逐行去掉页码与行尾页码残留，再按「短句 + 含英文字母 + 非指令 + 非单词表」筛出对话原句。
 * OCR 会把一个句子按印刷行断开（如 "Hello," / "monster!"），这里再按标点合并回整句。
 */
function linesOf(page) {
  const out = []
  for (const raw of String(page).split('\n')) {
    // 去行首页码与行尾残留页码（'Hello, how are you?5'）
    const line = raw.replace(/^\s*\d+\s*/, '').replace(/\s*\d+\s*$/, '').trim()
    if (!line) continue
    if (NOISE.test(line)) continue
    if (HEADER.test(line)) continue
    if (!/[a-zA-Z]/.test(line)) continue
    if (INSTRUCTION.test(line)) continue
    if (line.length > 80) continue // 长行是说明文字
    if (VOCAB_ONLY.test(line)) continue // 纯单词行 = 词表，不是课文
    // 同一页内：上一行未以句末标点结尾时，当前行是它的续行，拼回去
    const prev = out[out.length - 1]
    if (prev && !/[.!?…]$/.test(prev)) {
      out[out.length - 1] = `${prev} ${line}`.trim()
      continue
    }
    out.push(line)
  }
  return out
}

/** 抽取一课的课文：连续去重 + 保留出现顺序 */
function passageOf(lesson) {
  const seen = new Set()
  const out = []
  for (const page of lesson.pages ?? []) {
    for (const line of linesOf(page)) {
      const key = line.toLowerCase()
      // 同一课里反复出现的儿歌/口号只保留第一次
      if (seen.has(key)) continue
      seen.add(key)
      out.push(line)
    }
  }
  return out
}

const [, , ...args] = process.argv
const keys = args.length > 0 ? args : DEFAULT_LESSONS

let data
try {
  data = JSON.parse(readFileSync(SRC, 'utf8'))
} catch (err) {
  console.error(`读取 ${SRC} 失败：${err.message}`)
  process.exit(1)
}

const entries = []
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
  entries.push({ key, title: lesson.title, lines })
  console.log(`${key} 《${lesson.title}》→ ${lines.length} 句`)
  for (const line of lines.slice(0, 6)) console.log(`   ${line}`)
  if (lines.length > 6) console.log(`   …`)
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
// 重新生成：node scripts/extract-passage.mjs ${keys.join(' ')}

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
