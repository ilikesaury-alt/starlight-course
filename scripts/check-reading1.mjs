#!/usr/bin/env node
// 第一册阅读短文自检器（不依赖 vitest / vite server —— 多个 Agent 并行改写时可安全并发跑）
//
// 用法：
//   node scripts/check-reading1.mjs            # 校验全部 96 课
//   node scripts/check-reading1.mjs 3          # 只校验 Unit 3
//   node scripts/check-reading1.mjs 3 --stats  # 额外打印每篇词数/句数/段数
//   node scripts/check-reading1.mjs 3 --brief  # 打印该单元写作简报（每课词表 + 允许词表 + 课本原文）
//
// 校验口径与 src/data/starlight1/readingPassage1.test.ts **完全一致**：
// 两边都调 readingVocab1.ts 的 validateReadingPassage1()，不会漂移。
// 用 esbuild 把 TS 现场打成 ESM 再 import，进程间互不干扰。
//
// ❌ 不要改 readingPassage1.test.ts —— 单测仍是 CI 的唯一权威口径。

import { build } from 'esbuild'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const OUT = mkdtempSync(join(tmpdir(), 'reading1-check-'))

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

const { READING_PASSAGES1 } = await loadTs('src/data/starlight1/reading.ts')
const vocab = await loadTs('src/data/starlight1/readingVocab1.ts')
const { STARLIGHT_BOOK1 } = await loadTs('src/data/starlight1/book.ts')
const { lessonsByUnit1 } = await loadTs('src/data/starlight1/lessons.ts')
const { validateReadingPassage1, allReadingKeys1, allowedWordsFor1, passageSentences, tokenizeReading } = vocab

const args = process.argv.slice(2)
const unitArg = args.find((a) => /^\d+$/.test(a))
const wantStats = args.includes('--stats')
const wantBrief = args.includes('--brief')
const ONLY_UNIT = unitArg ? Number(unitArg) : null

const ALL_KEYS = allReadingKeys1()
const keys = ONLY_UNIT ? ALL_KEYS.filter((k) => Number(k.split('-')[0]) === ONLY_UNIT) : ALL_KEYS

// ---------- --brief：写作简报 ----------
// 子 Agent 改写时最需要：① 本课词表（必须 100% 出现）② 该课允许词表（零超纲）
// ③ 课本原文（故事素材，保证讲的是这一课的事）。程序化生成，省得翻大文件。
if (wantBrief) {
  const unit = ONLY_UNIT ?? 1
  console.log(`# Starlight 1 · Unit ${unit} 阅读短文写作简报`)
  for (const lesson of lessonsByUnit1[unit] ?? []) {
    const key = `${unit}-${lesson.id}`
    console.log(`\n## ${key} ${lesson.title} / ${lesson.titleZh}`)
    console.log(`本课词表（**每个词都要在短文里出现**，多词词条按空格拆、每部分都要出现）：`)
    console.log(`  ${lesson.words.map((w) => `${w.en}(${w.zh})`).join('  ')}`)
    console.log(`本课句型（可借鉴语气，别照抄成清单）：`)
    for (const s of lesson.sentences) console.log(`  - ${s.en}  // ${s.zh}`)
    const bk = STARLIGHT_BOOK1[key]
    if (bk) {
      console.log(`课本原文（故事素材）：`)
      for (const sec of bk.sections) {
        for (const pg of sec.pages) if (pg.text?.trim()) console.log(`  - ${pg.text.replace(/\n/g, ' / ')}`)
      }
    }
    const allowed = [...allowedWordsFor1(unit, lesson.id)].sort()
    console.log(`允许词表(${allowed.length})：${allowed.join(' ')}`)
  }
  console.log(`\n# 校验：node scripts/check-reading1.mjs ${unit} --stats`)
  rmSync(OUT, { recursive: true, force: true })
  process.exit(0)
}

let failCount = 0
const problems = []
for (const key of keys) {
  const [u, l] = key.split('-').map(Number)
  const errs = validateReadingPassage1(READING_PASSAGES1[key], u, l)
  if (errs.length) {
    failCount++
    problems.push(`${key}: ${errs.join('；')}`)
  } else if (wantStats) {
    const p = READING_PASSAGES1[key]
    const sents = passageSentences(p)
    const wc = sents.reduce((n, s) => n + tokenizeReading(s.en).length, 0)
    console.log(`✅ ${key}  ${wc} 词 / ${sents.length} 句 / ${p.paragraphs.length} 段  《${p.title}》`)
  }
}
const extra = Object.keys(READING_PASSAGES1).filter((k) => !ALL_KEYS.includes(k))
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
console.log(`✅ ${keys.length} 篇全部通过${ONLY_UNIT ? `（Unit ${ONLY_UNIT}）` : ''}（加 --stats 看每篇明细）`)
