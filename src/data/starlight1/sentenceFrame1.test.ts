// 第一册（Starlight 1）句型框架卡数据完整性 —— 与预备级 sentenceFrame.test.ts 同口径。
//
// 为什么单独一份：预备级的校验器读 STARLIGHT_FRAMES（level-0），
// 第一册的卡是另一套数据（STARLIGHT_FRAMES1，按 uN_frames 分散聚合）。
// 两册单元号都从 1 开始，混在一张表里查会串书。
//
// 最硬的一条沿用预备级：「填上正确答案拼出的句子，必须是该课真实学过的句子」
// —— 这是句型卡版的「零超纲」：孩子填空练的就是课本里那一句，不是编出来的句子。
// 另外钉死聚合层不返回重复卡（FRAMES_BY_UNIT1 / framesOfLesson1Series 曾各算一份）。
//
// 所有断言都**聚合报错**：多单元并行补卡时，第一张坏卡就短路的话，
// 别的单元看不到自己还剩什么问题，只能反复重跑。

import { describe, it, expect } from 'vitest'
import {
  STARLIGHT_FRAMES1,
  FRAMES_BY_UNIT1,
  framesOfLesson1Series,
  modules1,
} from './index'
import { countBlanks, fillFrame, frameCardKey } from '../sentenceFrame'

const ALL_SLUGS = modules1.map((m) => m.slug)
const norm = (s: string) => s.toLowerCase().replace(/[.!?]+$/, '').trim()

/** 一次列全所有违规（最多 80 条，避免刷屏） */
function expectNoProblems(problems: string[]) {
  const tail = problems.length > 80 ? `\n…共 ${problems.length} 条` : ''
  expect(problems, `\n${problems.slice(0, 80).join('\n')}${tail}`).toEqual([])
}

describe('STARLIGHT_FRAMES1 · 数据完整性（同预备级口径）', () => {
  // 一条大校验把所有「逐卡」不变量收集完再断言，输出按 unitSlug 排序，
  // 每个 Agent 能在同一份失败信息里找到自己单元的全部问题。
  it('逐卡不变量：id/key 唯一、slug 与课号有效、单空、选项、中文、零超纲', () => {
    const problems: string[] = []
    const seenIds = new Set<string>()
    const seenKeys = new Set<string>()

    for (const f of STARLIGHT_FRAMES1) {
      const tag = `${f.unitSlug}/L${f.lessonId} ${f.id}`

      if (seenIds.has(f.id)) problems.push(`${tag}: id 重复`)
      seenIds.add(f.id)
      const key = frameCardKey(f)
      if (seenKeys.has(key)) problems.push(`${tag}: cardKey 重复`)
      seenKeys.add(key)

      if (!ALL_SLUGS.includes(f.unitSlug)) {
        problems.push(`${tag}: unitSlug 不存在`)
        continue
      }
      const mod = modules1.find((m) => m.slug === f.unitSlug)!
      const lesson = mod.lessons.find((l) => l.id === f.lessonId)
      if (!lesson) {
        problems.push(`${tag}: 课号不存在`)
        continue
      }

      if (countBlanks(f.pattern) !== f.blanks.length) problems.push(`${tag}: ___ 个数(${countBlanks(f.pattern)}) ≠ blanks(${f.blanks.length})`)
      if (f.blanks.length > 1) problems.push(`${tag}: 多空(${f.blanks.length})，frameZh 组合不出中文`)
      // 零空位卡是合法的，与预备级一致（预备级有 3 张整句跟读卡，见 sentenceFrame.ts）：
      // 全是「A or B?」选择题的课没法挖空，就让孩子读整句。frameZh / fillFrame 都支持。
      // 只要求「拼出的句子 ∈ 本课句型表」，零空卡即 pattern 本身必须是原句。

      const b = f.blanks[0]
      if (b) {
        if (b.options.length < 3) problems.push(`${tag}: 选项只有 ${b.options.length} 个（需 ≥3）`)
        if (b.answer < 0 || b.answer >= b.options.length) problems.push(`${tag}: answer=${b.answer} 越界`)
        const opts = b.options.map((o) => o.toLowerCase().trim())
        if (new Set(opts).size !== opts.length) problems.push(`${tag}: 选项重复`)
        const ans = (b.options[b.answer] ?? '').toLowerCase().trim()
        if (b.options.some((o, i) => i !== b.answer && o.toLowerCase().trim() === ans)) {
          problems.push(`${tag}: 干扰项与正确答案同形`)
        }
        if (b.zhOptions.length !== b.options.length) problems.push(`${tag}: zhOptions(${b.zhOptions.length}) ≠ options(${b.options.length})`)
        if (b.zhOptions.some((z) => !z.trim())) problems.push(`${tag}: 有空的 zhOptions`)
        if (new Set(b.zhOptions.map((z) => z.trim())).size !== b.zhOptions.length) problems.push(`${tag}: zhOptions 重复`)
        if (b.zhOptions[b.answer] !== f.zh) problems.push(`${tag}: zh 与 zhOptions[answer] 不一致`)
      }
      if (!f.zh.trim()) problems.push(`${tag}: zh 为空`)

      // 核心：句型卡版的「零超纲」——填空练的就是课本那一句
      const said = lesson.sentences.map((s) => norm(s.en))
      const filled = norm(fillFrame(f, []))
      if (!said.includes(filled)) {
        problems.push(`${tag}: 拼出 "${fillFrame(f, [])}"，不在本课句型表 [${lesson.sentences.map((s) => s.en).join(' / ')}]`)
      }
    }
    expectNoProblems(problems)
  })
})

describe('STARLIGHT_FRAMES1 · 覆盖与聚合', () => {
  it('全部 96 课每课至少 1 张卡，且不超过 5 张', () => {
    // 上限沿用 level-0「单课练习量有限」的意图，但放宽到 5：
    // 第一册的 Language Focus 课（L5/L6）本来就是按 3~5 张卡写的，
    // 删卡属于改内容、不在「补齐缺卡」范围内。数据完整性靠上面那些不变量卡。
    const problems: string[] = []
    for (const m of modules1) {
      for (const l of m.lessons) {
        const n = framesOfLesson1Series(m.slug, l.id).length
        if (n === 0) problems.push(`${m.slug}/L${l.id}: 没有句型卡`)
        if (n > 5) problems.push(`${m.slug}/L${l.id}: 有 ${n} 张卡（上限 5）`)
      }
    }
    expectNoProblems(problems)
  })

  it('FRAMES_BY_UNIT1 每个桶只装本单元的卡（不串单元、不重复）', () => {
    const problems: string[] = []
    for (const [unitId, bucket] of Object.entries(FRAMES_BY_UNIT1)) {
      const u = Number(unitId)
      const mod = modules1.find((m) => m.id === u)
      if (!mod) {
        problems.push(`桶 ${unitId}: 没有对应单元`)
        continue
      }
      for (const f of bucket) {
        if (f.unitSlug !== mod.slug) problems.push(`桶 ${unitId}: 混进 ${f.unitSlug} 的卡 ${f.id}`)
      }
    }
    const flat = Object.values(FRAMES_BY_UNIT1).flat()
    if (flat.length !== STARLIGHT_FRAMES1.length) {
      problems.push(`分桶总表 ${flat.length} 条 ≠ 摊平总表 ${STARLIGHT_FRAMES1.length} 条`)
    }
    if (new Set(flat.map((f) => f.id)).size !== flat.length) problems.push('分桶总表里有重复 id')
    expectNoProblems(problems)
  })

  it('framesOfLesson1Series 不返回重复卡', () => {
    const problems: string[] = []
    for (const m of modules1) {
      for (const l of m.lessons) {
        const fs = framesOfLesson1Series(m.slug, l.id)
        if (new Set(fs.map((f) => f.id)).size !== fs.length) problems.push(`${m.slug}/L${l.id}: 返回重复卡`)
      }
    }
    expectNoProblems(problems)
  })
})
