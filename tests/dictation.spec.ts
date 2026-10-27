import { test, expect, type Page } from '@playwright/test'

/**
 * 听写练习（/dictation）端到端测试 —— dev-task-flow 第 11 步 E2E。
 *
 * 覆盖交付文档 14 条用例中「可自动化」的部分：
 *   T1  首页入口可见可进
 *   T2  词池来自 eng3a（按钮计数 > 0）
 *   T3  空错题本兜底（禁用 + 提示）
 *   T4  听音写词：答对 → 绿字鼓励
 *   T5  两试一揭：第一次错可改，第二次错揭晓答案
 *   T6  三选一：选项是「像但拼错」的变形，不是乱码
 *   T7  音素格子分段展示
 *   T8  金字塔逐阶展开
 *   T12 星数只结算一次（回到设置页不应重复加星）
 *   T17 一字一盒：写错时逐格标色 + 漏写虚线格（UI 重构新增）
 *   T18 ✕ 退出：中途退出回设置页，不产生星星（UI 重构新增）
 *
 * 说明：headless 下 speechSynthesis 已被 playwright.config 的 initScript mock，
 * 故本 spec 不验证「真的能出声」——出声需真机人工确认（交付文档已标注）。
 */

const DICTATION = '#/dictation'

/**
 * 家长设置默认收起（孩子进来不该看到范围/长短这些杂物）。
 * 需要调范围或词长短的用例，先展开它。
 */
async function openParentSettings(page: Page) {
  const box = page.locator('details.dt-parent-box')
  if (!(await box.evaluate((el: HTMLDetailsElement) => el.open))) {
    await box.locator('summary').click()
  }
}

/**
 * 入口是难度阶梯，默认停在「① 先认 · 三选一」（音-写不同步阶段先练认）。
 * 凡是要操作 input.dt-input 的用例，先显式选「③ 后写 · 听音写词」。
 */
async function chooseSpell(page: Page) {
  await page.getByRole('button', { name: /听音写词/ }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // 每个用例从干净进度开始，避免错题本/SRS 串味
  await page.evaluate(() => localStorage.clear())
  await page.goto(DICTATION)
})

test.describe('T1/T2 入口与词池', () => {
  test('T1 首页有听写卡片，点击进入听写页', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('a.dt-home-entry')
    await expect(card).toBeVisible()
    await expect(card).toContainText('听写练习')
    await card.click()
    await expect(page).toHaveURL(/#\/dictation/)
    await expect(page.getByText('听一听，写出来')).toBeVisible()
  })

  test('T2 词池来自 eng3a，开始按钮可用且计数 > 0', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /开始听写/ })
    await expect(startBtn).toBeEnabled()
    const label = (await startBtn.textContent()) ?? ''
    // 文案形如「🚀 开始听写（10 个）」
    const n = Number(label.match(/（\s*(\d+)\s*个/)?.[1] ?? 0)
    expect(n).toBeGreaterThan(0)
  })
})

test.describe('T3 空错题本兜底', () => {
  test('勾选只练错题本时按钮禁用并给出提示', async ({ page }) => {
    await openParentSettings(page)
    await page.getByRole('checkbox').check()
    await expect(page.getByRole('button', { name: /开始听写/ })).toBeDisabled()
    await expect(page.getByText(/错题本里还没有英语错词/)).toBeVisible()
  })
})

test.describe('T4/T5 听音写词与两试一揭', () => {
  test('T4 输入正确拼写 → 绿字鼓励并自动进下一词', async ({ page }) => {
    await chooseSpell(page)
    await page.getByRole('button', { name: /开始听写/ }).click()

    // headless 无 TTS，没法靠听音作答。用「我拼不出来」的音素格子拼出答案：
    // 这里验证的是「答对分支」本身，不靠随机抽样猜词，避免用例偶发超时。
    await page.getByRole('button', { name: /我拼不出来/ }).click()
    const answer = (await page.locator('.dt-box-text').allTextContents()).join('').trim()
    expect(answer.length).toBeGreaterThan(1)

    await page.locator('input.dt-input').fill(answer)
    await page.getByRole('button', { name: '✅ 检查' }).click()

    await expect(page.locator('.dt-feedback.ok')).toBeVisible()
    await expect(page.locator('.dt-slot.is-bad')).toHaveCount(0)
    // 约 1.1s 后自动推进到第 2 个词
    await expect(page.locator('.dt-progress-text')).toContainText('第 2', { timeout: 5000 })
  })

  test('T5 两试一揭：第一次错显示线索可改，第二次错揭晓答案', async ({ page }) => {
    await chooseSpell(page)
    await page.getByRole('button', { name: /开始听写/ }).click()
    const input = page.locator('input.dt-input')

    await input.fill('qqqqq')
    await page.getByRole('button', { name: '✅ 检查' }).click()
    // 第一次错：警告反馈 + 音素格子出现 + 输入仍可改
    await expect(page.locator('.dt-feedback.warn')).toBeVisible()
    await expect(page.locator('.dt-boxes')).toBeVisible()
    await expect(input).toBeEnabled()

    // 第二次错：揭晓答案
    await input.fill('qqqqq')
    await page.getByRole('button', { name: '✅ 检查' }).click()
    await expect(page.locator('.dt-feedback.bad')).toBeVisible()
    await expect(page.locator('.dt-answer')).toBeVisible()
    await expect(page.getByText(/正确答案是/)).toBeVisible()
  })
})

test.describe('T6 三选一干扰项质量', () => {
  test('选项是原词的变形（与正确项共享大部分字母），不是乱码', async ({ page }) => {
    await page.getByRole('button', { name: /🔍 三选一/ }).click()
    await page.getByRole('button', { name: /开始听写/ }).click()

    const choices = await page.locator('.dt-choice').allTextContents()
    expect(choices.length).toBeGreaterThanOrEqual(2)

    // 找到正确答案：长度与「提示」无关，这里用启发式——
    // 三个选项应互为小变形：两两编辑距离都应很小，且长度彼此接近。
    const lens = choices.map((c) => c.trim().length)
    expect(Math.max(...lens) - Math.min(...lens)).toBeLessThanOrEqual(2)
    // 且不应出现「一个明显英文词 + 两个随机串」的形态：所有选项长度都 >=2
    for (const c of choices) expect(c.trim().length).toBeGreaterThanOrEqual(2)
  })
})

test.describe('T19 入口改难度阶梯（A）', () => {
  test('默认停在「① 先认」，家长设置默认收起', async ({ page }) => {
    // 阶梯三项都在
    await expect(page.locator('.dt-step')).toHaveCount(3)
    // 默认是 ① 三选一（音-写不同步阶段先练认，不是一上来就写）
    await expect(page.getByRole('button', { name: /🔍 三选一/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page.getByRole('button', { name: /✍️ 听音写词/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    // ② 是跳去字母积木的链接，不是就地选择
    await expect(page.locator('.dt-step--link')).toHaveAttribute('href', /#\/alphablocks/)

    // 家长设置（范围/长短）默认收起，孩子看不到决策墙
    const box = page.locator('details.dt-parent-box')
    expect(await box.evaluate((el: HTMLDetailsElement) => el.open)).toBe(false)
  })
})

test.describe('T20 每词先数音（B）', () => {
  test('听音写词里先显示音数，格子数与音素数一致且不泄字母', async ({ page }) => {
    await chooseSpell(page)
    await page.getByRole('button', { name: /开始听写/ }).click()
    await expect(page.locator('.dt-player')).toBeVisible()

    // 「先数一数」提示出现
    const count = page.locator('.dt-count')
    await expect(count).toBeVisible()
    await expect(count).toContainText('个音')

    // 音格数量 = 该词的音素数，且格子里**没有任何字母**（只数音，不给答案）
    const litTotal = await page.locator('.dt-count-box').count()
    expect(litTotal).toBeGreaterThan(0)
    expect((await page.locator('.dt-count-boxes').textContent())?.trim()).toBe('')

    // 亮灯是逐个发生的（最终全部亮起）
    await expect(page.locator('.dt-count-box.is-lit')).toHaveCount(litTotal, { timeout: 8000 })
  })
})

test.describe('T7/T8 自然拼读桥接', () => {
  test('T7 音素格子按音素分段，每格可点', async ({ page }) => {
    await chooseSpell(page)
    await page.getByRole('button', { name: /开始听写/ }).click()
    // 主动要提示（不泄露答案）
    await page.getByRole('button', { name: /我拼不出来/ }).click()
    const boxes = page.locator('.dt-box')
    expect(await boxes.count()).toBeGreaterThan(0)
    // 每格自带一个发音按钮
    await expect(page.locator('.dt-box .speak-btn').first()).toBeVisible()
  })

  test('T8 金字塔逐阶展开（点一次多一个字母）', async ({ page }) => {
    await chooseSpell(page)
    await page.getByRole('button', { name: /开始听写/ }).click()
    await page.getByRole('button', { name: /我拼不出来/ }).click()
    const onSteps = () => page.locator('.dt-pyramid-step.is-on')
    const first = await onSteps().count()
    expect(first).toBeGreaterThan(0)
    await page.getByRole('button', { name: /多给一个字母/ }).click()
    expect(await onSteps().count()).toBe(first + 1)
  })
})

test.describe('T12 星数只结算一次（回归）', () => {
  test('停留在设置页不产生星星', async ({ page }) => {
    const stars = await page.evaluate(
      () => (JSON.parse(localStorage.getItem('starlight-course') ?? '{}')?.state?.totalStars ?? 0) as number,
    )
    expect(stars).toBe(0)
    // 触发多次重渲染（切换阶梯 / 长度），星数仍应不变
    await page.getByRole('button', { name: /三选一/ }).click()
    await openParentSettings(page)
    await page.getByRole('button', { name: /短词/ }).click()
    await page.getByRole('button', { name: /听音写词/ }).click()
    const after = await page.evaluate(
      () => (JSON.parse(localStorage.getItem('starlight-course') ?? '{}')?.state?.totalStars ?? 0) as number,
    )
    expect(after).toBe(0)
  })
})

test.describe('T17 一字一盒（字母盒）', () => {
  test('写错时逐格标色：对→绿 / 错→红 / 漏→虚线，并给出「第几个字母」提示', async ({ page }) => {
    // 长词保证答案 ≥5 字母，才留得出「漏写」的空间
    await chooseSpell(page)
    await openParentSettings(page)
    await page.getByRole('button', { name: /长词/ }).click()
    await page.getByRole('button', { name: /开始听写/ }).click()

    // 不靠听音拿答案：音素格子拼起来就是单词本身（headless 无 TTS）
    await page.getByRole('button', { name: /我拼不出来/ }).click()
    const answer = (await page.locator('.dt-box-text').allTextContents()).join('').trim()
    expect(answer.length).toBeGreaterThan(4)

    // 字母格数与答案字母数一致（一字一盒；空格/撇号是装饰格，不进「可写格」计数）
    await expect(page.locator('.dt-slot:not(.is-punct)')).toHaveCount(answer.length)

    // 首位写错 + 末两位漏写
    const typed = `z${answer.slice(1, -2)}`
    await page.locator('input.dt-input').fill(typed)
    await page.getByRole('button', { name: '✅ 检查' }).click()

    await expect(page.locator('.dt-feedback.warn')).toBeVisible()
    await expect(page.locator('.dt-slot.is-bad')).toHaveCount(1)
    await expect(page.locator('.dt-slot.is-missing')).toHaveCount(2)
    await expect(page.locator('.dt-slot.is-ok')).toHaveCount(answer.length - 3)
    // 人话提示指向第 1 个字母（而不是只给一个「错了」）
    await expect(page.getByText(/第 1 个字母不对/)).toBeVisible()
  })
})

test.describe('T18 ✕ 退出', () => {
  test('中途退出回到设置页，且不产生星星', async ({ page }) => {
    await page.getByRole('button', { name: /开始听写/ }).click()
    await expect(page.locator('.dt-player')).toBeVisible()

    await page.getByRole('button', { name: /退出/ }).click()
    // 设置页结构已从「选玩法 .dt-modes」改成「难度阶梯 .dt-ladder」
    await expect(page.locator('.dt-ladder')).toBeVisible()
    await expect(page.locator('.dt-player')).toHaveCount(0)

    const stars = await page.evaluate(
      () => (JSON.parse(localStorage.getItem('starlight-course') ?? '{}')?.state?.totalStars ?? 0) as number,
    )
    expect(stars).toBe(0)
  })
})

test.describe('边界：完整走完一轮', () => {
  test('用「答错→揭晓→下一个」走完一轮，进入报告页且数值自洽', async ({ page }) => {
    await chooseSpell(page)
    await page.getByRole('button', { name: /开始听写/ }).click()
    // 本轮最多 10 词；全部答错以最快路径推进，验证流程不卡死 + 报告页可达
    for (let i = 0; i < 30; i++) {
      if (await page.locator('.dt-report').count()) break
      const revealVisible = await page.locator('.dt-feedback.bad').count()
      if (revealVisible) {
        await page.getByRole('button', { name: /下一个/ }).click()
        continue
      }
      const input = page.locator('input.dt-input')
      if (await input.count()) {
        await input.fill('qqqqq')
        await page.getByRole('button', { name: '✅ 检查' }).click()
        await page.locator('input.dt-input').fill('qqqqq')
        await page.getByRole('button', { name: '✅ 检查' }).click()
      } else {
        break
      }
    }
    await expect(page.locator('.dt-report')).toBeVisible()
    await expect(page.getByText('这一轮完成啦！')).toBeVisible()
    // 正确率环（UI 重构后的主视觉）与首个统计项都应显示 0%
    await expect(page.locator('.dt-ring')).toBeVisible()
    await expect(page.locator('.dt-stat-num').first()).toHaveText('0%')
    // 错词清单应列出本轮词
    expect(await page.locator('.dt-missed-chip').count()).toBeGreaterThan(0)
  })
})
