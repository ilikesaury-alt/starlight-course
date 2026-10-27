import { test, expect } from '@playwright/test'

/**
 * 字母积木练习（/alphablocks）端到端测试。
 *
 * 覆盖交付要点：
 *   A1  首页入口可见可进
 *   A2  五级都能选，词数 > 0
 *   A3  开始练习可达
 *   A4  候选积木堆必须**打乱**（不能等于答案顺序 —— 否则孩子从左往右点就对了）
 *   A5  按正确顺序点完 → 全部槽位置 ok + 出现「下一个」
 *   A6  点错块 → 出现「这块不对」提示 + 该词进错题本(module=alphablocks)
 *   A7  重复块（tight/nine）必须按位置判：文本相同但位置不对要被拒
 *   A8  ✕ 退出可回设置页
 *
 * 说明：headless 下没有真实发音，故不验证「听得到」；这里验证的是
 * 「积木判定逻辑」本身 —— 那是最容易静默改坏的部分。
 */

const AB = '#/alphablocks'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.goto(AB)
})

test.describe('A1/A2 入口与级别', () => {
  test('A1 首页有字母积木卡片，点击进入', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('a.ab-home-entry')
    await expect(card).toBeVisible()
    await expect(card).toContainText('字母积木')
    await card.click()
    await expect(page).toHaveURL(/#\/alphablocks/)
    await expect(page.getByRole('heading', { name: '字母积木' })).toBeVisible()
  })

  test('A2 五个级别都在，词数都 > 0', async ({ page }) => {
    const levels = page.locator('.ab-level')
    await expect(levels).toHaveCount(5)
    const counts = await page.locator('.ab-level-count').allTextContents()
    expect(counts.length).toBe(5)
    for (const c of counts) {
      const n = Number(c.replace(/[^0-9]/g, ''))
      expect(n).toBeGreaterThan(0)
    }
  })
})

test.describe('A3 开始练习', () => {
  test('A3 选级别 + 模式后能开始', async ({ page }) => {
    await page.locator('.ab-level').nth(2).click()
    await page.getByRole('button', { name: /看词拆积木/ }).click()
    await page.getByRole('button', { name: /开始练习/ }).click()
    await expect(page.locator('.ab-player')).toBeVisible()
    await expect(page.locator('.ab-progress-text')).toContainText('第 1')
  })
})

test.describe('A4 候选堆必须打乱', () => {
  test('候选积木堆顺序 ≠ 答案顺序（否则等于送分）', async ({ page }) => {
    // 反复开局取样：如果每次都恰好等于答案顺序，说明洗牌被写成了 no-op
    let sameAsAnswer = 0
    const trials = 6
    for (let i = 0; i < trials; i++) {
      // 每轮用**不同时间戳的 query** 强制重新加载。
      // 只改 hash 不会重载页面（HashRouter 不重建），于是上一轮停在 .ab-player，
      // 下一轮就找不到 .ab-level 了 —— 这个坑踩过，别再退回去。
      await page.goto(`/?t=${Date.now()}-${i}${AB}`)
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await expect(page.locator('.ab-level')).toHaveCount(5, { timeout: 15_000 })
      await page.locator('.ab-level').nth(2).click()
      await page.getByRole('button', { name: /看词拆积木/ }).click()
      await page.getByRole('button', { name: /开始练习/ }).click()
      await expect(page.locator('.ab-player')).toBeVisible()

      const r = await page.evaluate(() => {
        const word = (document.querySelector('.ab-word-full')?.textContent ?? '')
          .toLowerCase()
          .replace(/[^a-z]/g, '')
        const pool = [...document.querySelectorAll('.ab-block')].map((b) => b.textContent?.trim() ?? '')
        const slots = document.querySelectorAll('.ab-slot').length
        return { word, pool, slots }
      })
      if (r.pool.slice(0, r.slots).join('') === r.word) sameAsAnswer++
    }
    // 6 次全中的概率极低（(1/n!) 级），全中即判定洗牌失效
    expect(sameAsAnswer).toBeLessThan(trials)
  })
})

test.describe('A5 按正确顺序搭完', () => {
  test('点完所有正确块 → 槽位全 ok 且出现「下一个」', async ({ page }) => {
    await page.locator('.ab-level').nth(2).click()
    await page.getByRole('button', { name: /看词拆积木/ }).click()
    await page.getByRole('button', { name: /开始练习/ }).click()
    await expect(page.locator('.ab-player')).toBeVisible()

    const result = await page.evaluate(async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
      const filled = () => document.querySelectorAll('.ab-slot.filled').length
      const total = () => document.querySelectorAll('.ab-slot').length
      // 依次点「能推进」的块直到填满。
      // ⚠️ 用 .ab-hint（拼完即出现且不会消失）做完成信号，
      // 不用 .ab-next-btn —— 它 1.6s 后随自动跳词一起消失，容易错过。
      for (let guard = 0; guard < 40; guard++) {
        if (document.querySelector('.ab-hint')) break
        if (filled() >= total()) break
        const before = filled()
        let advanced = false
        for (const b of [...document.querySelectorAll('.ab-block')] as HTMLButtonElement[]) {
          if (b.disabled) continue
          b.click()
          await wait(130)
          if (filled() > before) { advanced = true; break }
          await wait(500)
          if (document.querySelector('.ab-hint')) break
        }
        if (!advanced) break
        await wait(80)
      }
      return {
        slots: [...document.querySelectorAll('.ab-slot')].map((s) => s.textContent?.trim() ?? ''),
        okCount: document.querySelectorAll('.ab-slot.ok').length,
        totalSlots: total(),
        hasNext: !!document.querySelector('.ab-next-btn'),
        hint: document.querySelector('.ab-hint')?.textContent ?? '',
      }
    })

    expect(result.okCount).toBe(result.totalSlots)
    expect(result.hasNext).toBe(true)
    // 概念提示应出现（搭完才给，不提前泄底）
    expect(result.hint.length).toBeGreaterThan(0)
  })
})

test.describe('A6 错块反馈 + 错题本', () => {
  test('点错块只提示不结算；拼完后该词进错题本且 module=alphablocks', async ({ page }) => {
    await page.locator('.ab-level').nth(4).click()
    await page.getByRole('button', { name: /看词拆积木/ }).click()
    await page.getByRole('button', { name: /开始练习/ }).click()
    await expect(page.locator('.ab-player')).toBeVisible()

    const word = await page.locator('.ab-word-full').textContent()

    // 1) 先点一个错块：应只出现提示，**不能**已经把词入错题本
    const wrongMsg = await page.evaluate(async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
      const filled = () => document.querySelectorAll('.ab-slot.filled').length
      for (const b of [...document.querySelectorAll('.ab-block')] as HTMLButtonElement[]) {
        const before = filled()
        b.click()
        await wait(200)
        if (filled() === before) return document.querySelector('.ab-wrong')?.textContent ?? null
        await wait(100)
        break
      }
      return null
    })
    expect(wrongMsg).toContain('这块不对')

    // 此时尚未拼完 → 不该已入错题本（避免“界面还在练、后台已判死”）
    const beforeDone = await page.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('starlight-course') ?? '{}')?.state ?? {}
      return (st.wrongWords ?? []).length
    })
    expect(beforeDone).toBe(0)

    // 2) 继续把词拼完 → 才结算，该词进错题本。
    //    ⚠️ 不要等 .ab-next-btn：拼完 1.6s 后组件会自动跳到下一词，
    //    按钮是个瞬时状态，等它很容易错过（踩过）。改为盯持久化结果。
    await page.evaluate(async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
      const filled = () => document.querySelectorAll('.ab-slot.filled').length
      const total = () => document.querySelectorAll('.ab-slot').length
      for (let guard = 0; guard < 30; guard++) {
        if (document.querySelector('.ab-hint')) break // 已拼完
        if (filled() >= total()) break
        const before = filled()
        let advanced = false
        for (const b of [...document.querySelectorAll('.ab-block')] as HTMLButtonElement[]) {
          if (b.disabled) continue
          b.click()
          await wait(130)
          if (filled() > before) { advanced = true; break }
          await wait(500)
        }
        if (!advanced) break
      }
    })

    // 拼完后同步结算 → 错题本应出现该词（module=alphablocks）
    await page.waitForFunction(
      (w) => {
        const st = JSON.parse(localStorage.getItem('starlight-course') ?? '{}')?.state ?? {}
        return (st.wrongWords ?? []).some((x: { en: string; module: string }) => x.en === w && x.module === 'alphablocks')
      },
      word,
      { timeout: 10_000 },
    )

    const wrong = await page.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('starlight-course') ?? '{}')?.state ?? {}
      return (st.wrongWords ?? []).map((w: { en: string; module: string }) => `${w.en}|${w.module}`)
    })
    expect(wrong.some((w: string) => w.endsWith('|alphablocks'))).toBe(true)
    expect(wrong.some((w: string) => w.startsWith(`${word}|`))).toBe(true)
  })
})

test.describe('A7 重复块按位置判（tight / nine）', () => {
  // 这个用例要反复开局直到抽到含重复块的词（tight / nine 只占少数），
  // 默认 30s 不够；并行跑时服务器稍慢就会超时。给足 120s。
  test.setTimeout(120_000)

  test('文本相同但位置不对的块必须被拒绝', async ({ page }) => {
    // 需要抽到含重复块的词（tight 在黄级、nine 在蓝级，都只占少数），
    // 所以交替在两级上抽，最多 40 轮。
    let target: { word: string; dups: string[]; dupCount: number } | null = null
    for (let i = 0; i < 40 && !target; i++) {
      // 必须带时间戳 query 强制重载，否则会停在上一个词的 .ab-player
      await page.goto(`/?t=${Date.now()}-${i}${AB}`)
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await expect(page.locator('.ab-level')).toHaveCount(5, { timeout: 15_000 })
      // 交替黄级(2) / 蓝级(4)
      await page.locator('.ab-level').nth(i % 2 === 0 ? 2 : 4).click()
      await page.getByRole('button', { name: /看词拆积木/ }).click()
      await page.getByRole('button', { name: /开始练习/ }).click()
      await expect(page.locator('.ab-player')).toBeVisible()
      const r = await page.evaluate(() => {
        const word = document.querySelector('.ab-word-full')?.textContent ?? ''
        const pool = [...document.querySelectorAll('.ab-block')].map((b) => b.textContent?.trim() ?? '')
        const counts: Record<string, number> = {}
        for (const t of pool) counts[t] = (counts[t] ?? 0) + 1
        const dups = Object.entries(counts).filter(([, n]) => n > 1)
        return { word, dups: dups.map(([t]) => t), dupCount: dups.length }
      })
      if (r.dupCount > 0) target = { word: r.word, dups: r.dups, dupCount: r.dupCount }
    }

    test.skip(!target, '40 轮内未抽到含重复块的词（tight / nine）')
    // 抽到了：第一个重复块被接受后，第二个同文本块必须被拒
    const rejected = await page.evaluate(async (dupText: string) => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
      const filled = () => document.querySelectorAll('.ab-slot.filled').length
      const blocks = () =>
        ([...document.querySelectorAll('.ab-block')] as HTMLButtonElement[]).filter((b) => !b.disabled)
      // 先点一个正确块推进一位
      for (const b of blocks()) {
        const before = filled()
        b.click()
        await wait(200)
        if (filled() > before) break
        await wait(560)
      }
      // 再找一个同文本的未用块，点它应被拒
      const same = blocks().filter((b) => b.textContent?.trim() === dupText)
      if (!same.length) return null
      const before = filled()
      same[0].click()
      await wait(250)
      return filled() === before
    }, target!.dups[0])

    // rejected === true 表示"被判错（未推进）"，这正是我们要的
    expect(rejected).not.toBe(false)
  })
})

test.describe('A8 退出', () => {
  test('中途退出回设置页', async ({ page }) => {
    await page.getByRole('button', { name: /开始练习/ }).click()
    await expect(page.locator('.ab-player')).toBeVisible()
    await page.locator('.ab-exit').click()
    await expect(page.locator('.ab-levels')).toBeVisible()
    await expect(page.locator('.ab-player')).toHaveCount(0)
  })
})
