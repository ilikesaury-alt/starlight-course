// 句子框架数据完整性（src/data/sentenceFrame.ts）
//
// STARLIGHT_FRAMES 是 98 条**手写**数据（覆盖全部 96 课，每课 1~2 个）：
// 单元 slug、课号、空位数、answer 下标任一处笔误都不会报错，
// 只会在孩子面前表现为「点不动的按钮」或「填错答案」，
// 所以用测试把住不变量。

import { describe, it, expect } from 'vitest'
import {
  STARLIGHT_FRAMES,
  framesOfLesson,
  countBlanks,
  fillFrame,
  frameZh,
  frameCardKey,
} from './sentenceFrame'
import { modules } from './starlight'

/** 12 个单元的 slug，与 data/modules.ts 的注册表一致 */
const ALL_SLUGS = modules.map((m) => m.slug)

describe('STARLIGHT_FRAMES 数据完整性', () => {
  it('id 全局唯一', () => {
    const ids = STARLIGHT_FRAMES.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('卡片 key 全局唯一（同一 pattern 不会产生两张卡）', () => {
    const keys = STARLIGHT_FRAMES.map(frameCardKey)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('每个单元 slug 都真实存在', () => {
    for (const f of STARLIGHT_FRAMES) {
      expect(ALL_SLUGS, `${f.id} 的 unitSlug=${f.unitSlug}`).toContain(f.unitSlug)
    }
  })

  it('每条框架都挂在真实存在的课上（unitSlug + lessonId 有效）', () => {
    for (const f of STARLIGHT_FRAMES) {
      const mod = modules.find((m) => m.slug === f.unitSlug)
      expect(mod, `${f.id} 找不到模块 ${f.unitSlug}`).toBeDefined()
      const lesson = mod!.lessons.find((l) => l.id === f.lessonId)
      expect(lesson, `${f.id} 在 ${f.unitSlug} 找不到 Lesson ${f.lessonId}`).toBeDefined()
    }
  })

  it('pattern 的 ___ 个数必须等于 blanks 长度', () => {
    for (const f of STARLIGHT_FRAMES) {
      expect(countBlanks(f.pattern), `${f.id} pattern 与 blanks 不匹配`).toBe(f.blanks.length)
    }
  })

  it('每个空位：答案下标在范围内、选项至少 3 个、选项不重复', () => {
    for (const f of STARLIGHT_FRAMES) {
      for (const [bi, b] of f.blanks.entries()) {
        expect(b.options.length, `${f.id} 第 ${bi} 空选项过少（少于 3 则区分度不足）`).toBeGreaterThanOrEqual(3)
        expect(b.answer, `${f.id} 第 ${bi} 空 answer 越界`).toBeGreaterThanOrEqual(0)
        expect(b.answer, `${f.id} 第 ${bi} 空 answer 越界`).toBeLessThan(b.options.length)
        const norm = b.options.map((o) => o.toLowerCase().trim())
        expect(new Set(norm).size, `${f.id} 第 ${bi} 空有重复选项`).toBe(norm.length)
      }
    }
  })

  it('干扰项不能与正确答案同形（否则出现两个「对」答案）', () => {
    for (const f of STARLIGHT_FRAMES) {
      for (const [bi, b] of f.blanks.entries()) {
        const answer = b.options[b.answer].toLowerCase().trim()
        const dup = b.options.filter(
          (o, oi) => oi !== b.answer && o.toLowerCase().trim() === answer
        )
        expect(dup, `${f.id} 第 ${bi} 空存在与正确答案同形的干扰项`).toEqual([])
      }
    }
  })

  it('中文提示非空', () => {
    for (const f of STARLIGHT_FRAMES) {
      expect(f.zh.trim().length, `${f.id} 缺中文提示`).toBeGreaterThan(0)
    }
  })

  it('每个空位都有与 options 等长的整句中文（换词时中文提示要跟着变）', () => {
    for (const f of STARLIGHT_FRAMES) {
      for (const [bi, b] of f.blanks.entries()) {
        expect(b.zhOptions, `${f.id} 第 ${bi} 空缺 zhOptions`).toBeDefined()
        expect(b.zhOptions.length, `${f.id} 第 ${bi} 空 zhOptions 与 options 不等长`).toBe(b.options.length)
        b.zhOptions.forEach((z, zi) => {
          expect(z.trim().length, `${f.id} 第 ${bi} 空 zhOptions[${zi}] 为空`).toBeGreaterThan(0)
        })
        const uniq = new Set(b.zhOptions.map((z) => z.trim()))
        expect(uniq.size, `${f.id} 第 ${bi} 空 zhOptions 有重复（换词后看不出变化）`).toBe(b.zhOptions.length)
      }
    }
  })

  it('frameZh 只支持单空框架（zhOptions 给的是整句，多空无法组合）', () => {
    for (const f of STARLIGHT_FRAMES) {
      expect(f.blanks.length, `${f.id} 有 ${f.blanks.length} 个空，需先扩展 frameZh`).toBeLessThanOrEqual(1)
    }
  })

  it('zh 与正确答案那句中文一致（答案句不能被写串行）', () => {
    for (const f of STARLIGHT_FRAMES) {
      const b = f.blanks[0]
      if (!b) continue
      expect(b.zhOptions[b.answer], `${f.id} 的 zh 与 zhOptions[${b.answer}] 不一致`).toBe(f.zh)
    }
  })

  // 设计约束「pattern 必须是该课真实出现的句型」的机器化：
  // 用正确答案填空后拼出的句子，必须能在该课 sentences 里原文找到。
  // 比较时忽略大小写与句末标点——教材里 'Good morning!' 带感叹号，
  // 而框架卡按陈述句排版成 'Good ___.'，这不是内容错误。
  it('填上正确答案拼出的句子，确实是该课学过的句子', () => {
    const norm = (s: string) => s.toLowerCase().replace(/[.!?]+$/, '').trim()
    for (const f of STARLIGHT_FRAMES) {
      const mod = modules.find((m) => m.slug === f.unitSlug)!
      const lesson = mod.lessons.find((l) => l.id === f.lessonId)!
      const said = lesson.sentences.map((s) => norm(s.en))
      expect(said, `${f.id}（${f.unitSlug}/L${f.lessonId}）拼出的句子不在本课句型表里`).toContain(
        norm(fillFrame(f, []))
      )
    }
  })
})

describe('framesOfLesson', () => {
  it('按 单元slug + 课号 精确命中', () => {
    const got = framesOfLesson('toys', 1)
    expect(got.map((f) => f.id)).toEqual(['u4l1-own'])
    // 不存在的单元 slug / 课号 → 空（unitSlug 写错不会静默落到别的课上）
    expect(framesOfLesson('no-such-unit', 1)).toEqual([])
    expect(framesOfLesson('toys', 9)).toEqual([])
    expect(framesOfLesson('hello', 1).map((f) => f.id)).toEqual(['u1l1-state'])
  })

  it('12 个单元全部有框架覆盖', () => {
    const covered = new Set(STARLIGHT_FRAMES.map((f) => f.unitSlug))
    for (const slug of ALL_SLUGS) {
      expect(covered.has(slug), `单元 ${slug} 没有框架卡`).toBe(true)
    }
  })

  // 回归：曾是「每单元只挑 2 课挂卡」，其余课点开「🧩 句型」只有一句
  // 「这一课还没有句型框架卡。」——孩子学到那课就没有句型练习可做。
  it('全部 96 课每课至少有 1 张框架卡（不允许再出现空句型区）', () => {
    const missing: string[] = []
    for (const m of modules) {
      for (const l of m.lessons) {
        const got = framesOfLesson(m.slug, l.id)
        if (got.length === 0) missing.push(`${m.slug}/L${l.id}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('没有课的框架卡超过 2 张（单课练习量有限，多了只是拖慢轮转）', () => {
    for (const m of modules) {
      for (const l of m.lessons) {
        const n = framesOfLesson(m.slug, l.id).length
        expect(n, `${m.slug}/L${l.id} 有 ${n} 张框架卡`).toBeLessThanOrEqual(2)
      }
    }
  })
})

describe('fillFrame', () => {
  const toy = STARLIGHT_FRAMES.find((f) => f.id === 'u4l1-own')!

  it('填空词插在两段之间，而不是段尾', () => {
    // 曾经的 bug：'I have a ___.' 渲染成 'I have a .doll'
    expect(fillFrame(toy, [0])).toBe('I have a doll.')
  })

  it('越界下标回退到正确答案', () => {
    expect(fillFrame(toy, [99])).toBe('I have a doll.')
  })

  it('零空位框架原样返回', () => {
    const noBlank = STARLIGHT_FRAMES.find((f) => f.blanks.length === 0)!
    expect(fillFrame(noBlank, [])).toBe(noBlank.pattern)
  })

  it('多词选项不破坏拼接', () => {
    const shower = STARLIGHT_FRAMES.find((f) => f.id === 'u9l7-bed')!
    expect(fillFrame(shower, [0])).toBe("It's time to take a shower.")
  })
})

describe('frameZh（中文提示随换词变）', () => {
  const body = STARLIGHT_FRAMES.find((f) => f.id === 'u6l1-face')!

  it('选不同候选，中文整句跟着换', () => {
    expect(frameZh(body, [0])).toBe('我有一个鼻子。')
    // 曾经的 bug：选了 mouth 还显示答案句「我有一个鼻子。」
    expect(frameZh(body, [1])).toBe('我有一张嘴。')
    expect(frameZh(body, [3])).toBe('我有一只眼睛。')
  })

  it('未选 / 越界回退到答案句（与 fillFrame 的英文默认态一致）', () => {
    expect(frameZh(body, [-1])).toBe(body.zh)
    expect(frameZh(body, [99])).toBe(body.zh)
    expect(frameZh(body, [])).toBe(body.zh)
  })

  it('零空位框架原样返回中文提示', () => {
    const noBlank = STARLIGHT_FRAMES.find((f) => f.blanks.length === 0)!
    expect(frameZh(noBlank, [])).toBe(noBlank.zh)
  })
})

describe('frameCardKey', () => {
  it('同一 pattern 在不同单元得到不同 key（否则会塔成同一张卡）', () => {
    // Unit4 与 Unit6 都有 "I have a ___."，若以 pattern 为键会冲突
    const u4 = STARLIGHT_FRAMES.find((f) => f.id === 'u4l1-own')!
    const u6 = STARLIGHT_FRAMES.find((f) => f.id === 'u6l1-face')!
    expect(u4.pattern).toBe(u6.pattern)
    expect(frameCardKey(u4)).not.toBe(frameCardKey(u6))
  })

  it('key 稳定且带 frame: 前缀（与单词卡空间隔离）', () => {
    const toy = STARLIGHT_FRAMES.find((f) => f.id === 'u4l1-own')!
    expect(frameCardKey(toy)).toBe('frame:u4l1-own')
    expect(frameCardKey(toy)).toBe(frameCardKey(toy))
  })
})
