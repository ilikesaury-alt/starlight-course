#!/usr/bin/env node
// 阅读短文自检器（不依赖 vitest / vite server —— 12 个 Agent 并行改写时可安全并发跑）
//
// 用法：
//   node scripts/check-reading.mjs            # 校验全部 96 课
//   node scripts/check-reading.mjs 3          # 只校验 Unit 3
//   node scripts/check-reading.mjs 3 --stats  # 额外打印每篇的词数/句数/段数明细
//
// 校验口径与 src/data/readingPassage.test.ts **完全一致**（同一个 baseVocab 真源），
// 之所以再写一份：vitest 会起 vite server，多个进程同时跑会争抢 node_modules/.vite 缓存
// 导致假失败；本脚本只用 esbuild 把 TS 现场打成 ESM 再 import，进程间互不干扰。
//
// ❌ 不要改 src/data/readingPassage.test.ts —— 单测仍是 CI 的唯一权威口径。

import { build } from 'esbuild'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const OUT = mkdtempSync(join(tmpdir(), 'reading-check-'))

/** 把 TS 现场打成 ESM 并 import */
async function loadTs(entry) {
  const outfile = join(OUT, entry.replace(/[\\/]/g, '_') + '.mjs')
  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    outfile,
    alias: { '@': join(ROOT, 'src') },
    logLevel: 'silent',
  })
  return import(pathToFileURL(outfile).href)
}

const { READING_PASSAGES, passageSentences } = await loadTs('src/data/reading/index.ts')
const { allowedWordsFor, allReadingKeys, tokenizeReading, isAllowedWord } =
  await loadTs('src/data/reading/baseVocab.ts')
const { lessonsByUnit } = await loadTs('src/data/lessons.ts')

const args = process.argv.slice(2)
const unitArg = args.find((a) => /^\d+$/.test(a))
const wantStats = args.includes('--stats')
const wantBrief = args.includes('--brief')
const ONLY_UNIT = unitArg ? Number(unitArg) : null

const ALL_KEYS = allReadingKeys()
const keys = ONLY_UNIT ? ALL_KEYS.filter((k) => Number(k.split('-')[0]) === ONLY_UNIT) : ALL_KEYS

// ---------- --brief：打印该单元的写作简报 ----------
// 子 Agent 改写时最需要的两样东西：① 本课词表（必须 100% 出现）② 该单元允许词表（零超纲）。
// 在这里程序化生成，省得每个 Agent 去翻 1450 行的 lessons.ts。
if (wantBrief) {
  const unit = ONLY_UNIT ?? 1
  const allowed = [...allowedWordsFor(unit, 1)].sort()
  console.log(`# Unit ${unit} 写作简报`)
  console.log(`# 允许词表（${allowed.length} 个，短文里只能出现这些词的词形）：`)
  console.log(allowed.join(' '))
  console.log('')
  console.log(`# 本单元每课词表（**每课每个词都必须在该课短文里出现**，多词词条按空格拆、每部分都要出现）：`)
  for (const lesson of lessonsByUnit[unit] ?? []) {
    console.log(`\n## ${unit}-${lesson.id} ${lesson.title} / ${lesson.titleZh}`)
    console.log(
      `本课词表：${lesson.words.map((w) => `${w.en}(${w.zh})`).join('  ')}`,
    )
    console.log(`本课句型（可借鉴语气）：`)
    for (const s of lesson.sentences) console.log(`  - ${s.en}  // ${s.zh}`)
  }
  console.log('')
  console.log(`# 校验命令：node scripts/check-reading.mjs ${unit} --stats`)
  process.exit(0)
}

let failCount = 0
const problems = []

for (const key of keys) {
  const p = READING_PASSAGES[key]
  const [u, l] = key.split('-').map(Number)
  const errs = []
  if (!p) {
    errs.push(`缺少 ${key} 的阅读短文`)
    problems.push(`${key}: ${errs.join('；')}`)
    failCount++
    continue
  }

  const sents = passageSentences(p)
  const wordCount = sents.reduce((n, s) => n + tokenizeReading(s.en).length, 0)

  // 篇幅
  if (wordCount < 70 || wordCount > 100) errs.push(`词数 ${wordCount} 不在 70~100`)
  if (sents.length < 8 || sents.length > 12) errs.push(`句数 ${sents.length} 不在 8~12`)
  if (p.paragraphs.length < 1 || p.paragraphs.length > 3) errs.push(`段数 ${p.paragraphs.length} 不在 1~3`)
  p.paragraphs.forEach((para, pi) => {
    if (para.length === 0) errs.push(`第 ${pi + 1} 段是空的`)
  })

  // 零超纲
  const allowed = allowedWordsFor(u, l)
  const out = []
  for (const s of sents) for (const tok of tokenizeReading(s.en)) if (!isAllowedWord(tok, allowed)) out.push(tok)
  if (out.length) errs.push(`超纲词: ${[...new Set(out)].join(', ')}`)

  // 本课词表 100%
  const lessonWords = lessonsByUnit[u]?.find((x) => x.id === l)?.words ?? []
  const fullText = sents.map((s) => s.en.toLowerCase()).join(' ')
  const missing = lessonWords
    .map((w) => w.en.toLowerCase())
    .filter((w) => !w.split(' ').every((part) => fullText.includes(part)))
  if (missing.length) errs.push(`本课词未出现: ${missing.join(', ')}`)

  // 中文 / 标点 / 重复句
  const cnPunct = /[\u3000-\u303f\uff00-\uffef]/
  for (const s of sents) {
    if (!s.en?.trim()) errs.push('有空英文句')
    if (!s.zh?.trim()) errs.push(`句「${s.en}」缺中文`)
    if (cnPunct.test(s.en)) errs.push(`英文句混入中文标点: ${s.en}`)
  }
  const seen = new Set()
  for (const s of sents) {
    const norm = s.en.toLowerCase().trim().replace(/\s+/g, ' ')
    if (seen.has(norm)) errs.push(`重复句: ${s.en}`)
    seen.add(norm)
  }

  if (errs.length) {
    failCount++
    problems.push(`${key}: ${errs.join('；')}`)
  } else if (wantStats) {
    console.log(`✅ ${key}  ${wordCount} 词 / ${sents.length} 句 / ${p.paragraphs.length} 段  《${p.title}》`)
  }
}

// 多出来的 key（不是真实课号）
const extra = Object.keys(READING_PASSAGES).filter((k) => !ALL_KEYS.includes(k))
if (extra.length) {
  failCount++
  problems.push(`多余 key: ${extra.join(', ')}`)
}

rmSync(OUT, { recursive: true, force: true })

if (problems.length) {
  console.log(`\n❌ ${failCount} 篇有问题${ONLY_UNIT ? `（Unit ${ONLY_UNIT}）` : ''}：`)
  for (const pr of problems) console.log('  · ' + pr)
  process.exit(1)
}
console.log(
  `✅ ${keys.length} 篇全部通过${ONLY_UNIT ? `（Unit ${ONLY_UNIT}）` : ''}` +
  (wantStats ? '' : '（加 --stats 看每篇明细）'),
)
