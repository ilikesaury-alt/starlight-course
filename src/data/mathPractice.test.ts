// 应用题数据的不变量：题干分词拼接 === 原文、每题都有可圈的关系词和可划的
// 数字（审题三步法的载体）、每步恰有一个正确选项、分步末步结果 = answer、
// 第一步算式不含最终答案（防「得数」步提前泄露）。这些检查保护「题目自相
// 矛盾 / 答案算错」这类最难肉眼发现的错误。
import { describe, it, expect } from 'vitest'
import { TOPIC_LABEL, WORD_PROBLEMS, wordProblemRound } from './mathPractice'

describe('应用题数据', () => {
  it('题量 ≥ 50（含经典提优题型），id 唯一', () => {
    expect(WORD_PROBLEMS.length).toBeGreaterThanOrEqual(50)
    expect(new Set(WORD_PROBLEMS.map((p) => p.id)).size).toBe(WORD_PROBLEMS.length)
  })

  it('每题的 topic 合法，且所有板块都有题', () => {
    for (const p of WORD_PROBLEMS) {
      expect(TOPIC_LABEL[p.topic], `${p.id} topic ${p.topic}`).toBeTruthy()
    }
    const topics = new Set(WORD_PROBLEMS.map((p) => p.topic))
    expect(topics.size).toBe(Object.keys(TOPIC_LABEL).length)
  })

  it('segments 拼接 === text（题干渲染不失真）', () => {
    for (const p of WORD_PROBLEMS) {
      expect(p.segments.map((s) => s.t).join(''), `${p.id} 拼接`).toBe(p.text)
    }
  })

  it('每题至少 1 个关系词（圈）+ 1 个数字（划）—— 审题三步法的载体', () => {
    for (const p of WORD_PROBLEMS) {
      expect(p.segments.some((s) => s.k === 'rel'), `${p.id} 应有可圈关系词`).toBe(true)
      expect(p.segments.some((s) => s.k === 'num'), `${p.id} 应有可划数字`).toBe(true)
      // 可标记的目标不超过 6 处：标记步要轻，不能回到「所有文字都要圈」
      expect(p.segments.filter((s) => s.k).length, `${p.id} 标记点数量`).toBeLessThanOrEqual(6)
    }
  })

  it('第一步 / 第二步各有且仅有一个正确选项', () => {
    for (const p of WORD_PROBLEMS) {
      expect(p.ask.options.filter((o) => o.correct).length, `${p.id} ask 正确项`).toBe(1)
      expect(p.first.options.filter((o) => o.correct).length, `${p.id} first 正确项`).toBe(1)
      // 选项文案不得重复（重复会让孩子无从选起 / e2e 定位歧义）
      expect(new Set(p.ask.options.map((o) => o.label)).size).toBe(p.ask.options.length)
      expect(new Set(p.first.options.map((o) => o.label)).size).toBe(p.first.options.length)
    }
  })

  it('正确项不固定在 A：按题号打散到多个位置（防「闭眼选 A」）', () => {
    // 2026-11-18 用户实测：原来 30 题 × 2 步共 60 组选项，正确项全在 index 0。
    // q() 现在按 id 确定性洗牌，这里钉死打散效果，别再有人「简化」回全 0。
    for (const which of ['ask', 'first'] as const) {
      const positions = WORD_PROBLEMS.map((p) => p[which].options.findIndex((o) => o.correct))
      expect(positions.every((i) => i >= 0), `${which} 每题都要有正确项`).toBe(true)
      expect(new Set(positions).size, `${which} 正确项应散布在 A/B/C`).toBeGreaterThanOrEqual(3)
      expect(
        positions.filter((i) => i === 0).length / positions.length,
        `${which} 不能总是 A`,
      ).toBeLessThan(0.6)
    }
    // 标记选项仍按原顺序（A/B/C 字母标签由渲染层按 index 生成）
    for (const p of WORD_PROBLEMS) {
      expect(p.ask.options.length).toBe(3)
      expect(p.first.options.length).toBe(3)
    }
  })

  it('同一题的选项顺序稳定：同 seed 两次抽题，选项逐项一致', () => {
    const a = wordProblemRound(5, 42)
    const b = wordProblemRound(5, 42)
    expect(
      a.map((p) => [p.ask.options.map((o) => o.label), p.first.options.map((o) => o.label)]),
    ).toEqual(
      b.map((p) => [p.ask.options.map((o) => o.label), p.first.options.map((o) => o.label)]),
    )
  })

  it('分步算式 ≥2 步，末步结果 === answer', () => {
    for (const p of WORD_PROBLEMS) {
      expect(p.steps.length, `${p.id} 分步`).toBeGreaterThanOrEqual(2)
      const last = p.steps[p.steps.length - 1]
      const nums = last.match(/\d+/g)
      expect(nums && nums.length > 0, `${p.id} 末步应有数字`).toBeTruthy()
      expect(Number(nums![nums!.length - 1]), `${p.id} 末步结果`).toBe(p.answer)
    }
  })

  it('第一步算式不含最终答案（得数步只能展示它，防提前泄露）', () => {
    // 页面在「得数」步未作答时只显示 steps[0] 当脚手架；若它本身含答案就等于给答案。
    for (const p of WORD_PROBLEMS) {
      const nums = (p.steps[0].match(/\d+/g) ?? []).map(Number)
      expect(nums, `${p.id} 第一步算式不该含答案 ${p.answer}`).not.toContain(p.answer)
    }
  })

  it('题干 / 提示 / 解析都非空，且题干是中文', () => {
    for (const p of WORD_PROBLEMS) {
      expect(p.text.length).toBeGreaterThan(5)
      expect(p.ask.prompt.length).toBeGreaterThan(0)
      expect(p.first.prompt.length).toBeGreaterThan(0)
      expect(p.explain.length).toBeGreaterThan(0)
      expect(/[\u4e00-\u9fa5]/.test(p.text)).toBe(true)
    }
  })
})

describe('出题', () => {
  it('给定 seed 可复现', () => {
    const a = wordProblemRound(5, 12345).map((p) => p.id)
    const b = wordProblemRound(5, 12345).map((p) => p.id)
    expect(a).toEqual(b)
  })

  it('不超量；不重复', () => {
    const list = wordProblemRound(5, 999)
    expect(list.length).toBeLessThanOrEqual(5)
    expect(new Set(list.map((p) => p.id)).size).toBe(list.length)
  })

  it('按板块轮转：每轮 5 题至少覆盖 4 个不同板块（不会一整轮同类题）', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const topics = new Set(wordProblemRound(5, seed).map((p) => p.topic))
      expect(topics.size, `seed=${seed} 板块覆盖`).toBeGreaterThanOrEqual(4)
    }
  })

  it('指定 ids 时只取这些题（重练错题），忽略 count', () => {
    const ids = [WORD_PROBLEMS[2].id, WORD_PROBLEMS[7].id]
    const list = wordProblemRound(2, 1, ids)
    expect(list.map((p) => p.id).sort()).toEqual(ids.sort())
  })
})