#!/usr/bin/env node
// 第一册外教对话自检器（不依赖 vitest / vite server —— 多个 Agent 并行补写时可安全并发跑）
//
// 用法：
//   node scripts/check-dialogue1.mjs            # 校验全部 96 课
//   node scripts/check-dialogue1.mjs 3          # 只校验 Unit 3
//   node scripts/check-dialogue1.mjs 3 --stats  # 额外打印每课轮次
//   node scripts/check-dialogue1.mjs 3 --brief  # 打印该单元写作简报（每课词表 + 句型 + 课本原文）
//
// 校验口径与 src/data/starlight1/dialogue1.test.ts **完全一致**：
// 两边都调 dialogue1.ts 的 validateDialogue1()，不会漂移。
// 用 esbuild 把 TS 现场打成 ESM 再 import，进程间互不干扰。
//
// ❌ 不要改 dialogue1.test.ts —— 单测仍是 CI 的唯一权威口径。

import { build } from 'esbuild'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const OUT = mkdtempSync(join(tmpdir(), 'dialogue1-check-'))

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

const { LESSON_DIALOGUE1, allDialogueKeys1, validateDialogue1, TURNS_MIN, TURNS_MAX } =
  await loadTs('src/data/starlight1/dialogue1.ts')
const { STARLIGHT_BOOK1 } = await loadTs('src/data/starlight1/book.ts')
const { lessonsByUnit1 } = await loadTs('src/data/starlight1/lessons.ts')

const args = process.argv.slice(2)
const unitArg = args.find((a) => /^\d+$/.test(a))
const wantStats = args.includes('--stats')
const wantBrief = args.includes('--brief')
const ONLY_UNIT = unitArg ? Number(unitArg) : null

const ALL_KEYS = allDialogueKeys1()
const keys = ONLY_UNIT ? ALL_KEYS.filter((k) => Number(k.split('-')[0]) === ONLY_UNIT) : ALL_KEYS

// ---------- --brief：写作简报 ----------
// 子 Agent 补写时最需要：① 本课词表（覆盖 ≥60%）② 本课句型（课堂要练的话）
// ③ 课本原文（故事素材）。程序化生成，省得翻大文件。
if (wantBrief) {
  const unit = ONLY_UNIT ?? 1
  console.log(`# Starlight 1 · Unit ${unit} 外教对话写作简报`)
  console.log(`# 每课 ${TURNS_MIN}~${TURNS_MAX} 轮，T = 外教 / S = 孩子；每轮都要 en + zh；note 可选（教学提示）`)
  console.log('# 结构：热身 → 带新词 → 练句型 → 玩游戏 → 闭环复述\n')
  for (const lesson of lessonsByUnit1[unit] ?? []) {
    const key = `${unit}-${lesson.id}`
    console.log(`## ${key} ${lesson.title} / ${lesson.titleZh}`)
    console.log(`本课词表（**至少 60% 要在对话里出现**，多词词条按空格拆）：`)
    console.log(`  ${lesson.words.map((w) => `${w.en}(${w.zh})`).join('  ')}`)
    console.log(`本课句型（课堂要练的目标句）：`)
    for (const s of lesson.sentences) console.log(`  - ${s.en}  // ${s.zh}`)
    const bk = STARLIGHT_BOOK1[key]
    if (bk) {
      console.log(`课本原文（故事素材）：`)
      for (const sec of bk.sections) {
        for (const pg of sec.pages) if (pg.text?.trim()) console.log(`  - ${pg.text.replace(/\n/g, ' / ')}`)
      }
    }
    console.log('')
  }
  console.log(`# 校验：node scripts/check-dialogue1.mjs ${unit} --stats`)
  rmSync(OUT, { recursive: true, force: true })
  process.exit(0)
}

let failCount = 0
const problems = []
for (const key of keys) {
  const [u, l] = key.split('-').map(Number)
  const errs = validateDialogue1(LESSON_DIALOGUE1[key], u, l)
  if (errs.length) {
    failCount++
    problems.push(`${key}: ${errs.join('；')}`)
  } else if (wantStats) {
    const d = LESSON_DIALOGUE1[key]
    const t = d.turns.filter((x) => x.speaker === 'T').length
    const s = d.turns.filter((x) => x.speaker === 'S').length
    console.log(`✅ ${key}  ${d.turns.length} 轮 (T${t}/S${s})  《${d.title}》`)
  }
}
const extra = Object.keys(LESSON_DIALOGUE1).filter((k) => !ALL_KEYS.includes(k))
if (extra.length) {
  failCount++
  problems.push(`多余 key: ${extra.join(', ')}`)
}
rmSync(OUT, { recursive: true, force: true })

if (problems.length) {
  console.log(`\n❌ ${failCount} 课有问题${ONLY_UNIT ? `（Unit ${ONLY_UNIT}）` : ''}：`)
  for (const pr of problems) console.log('  · ' + pr)
  process.exit(1)
}
console.log(`✅ ${keys.length} 课全部通过${ONLY_UNIT ? `（Unit ${ONLY_UNIT}）` : ''}（加 --stats 看每课明细）`)
