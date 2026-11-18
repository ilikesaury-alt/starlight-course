import { test, expect, type Page } from '@playwright/test'
import { WORD_PROBLEMS } from '../src/data/mathPractice'

/**
 * 应用题专项练习（/math）端到端测试 —— 审题三步法（陈老师 2026-11-18）。
 *
 * 覆盖：
 *   M1 首页「专项练习」入口可见（应用题文案）、点击进入
 *   M2 四步指示器（标记 → 求什么 → 先算什么 → 得数）
 *   M3 标记步：点关系词/数字 → 宽松判定（漏标才算错、多标提醒不扣）
 *   M4 全流程四步答对 → 5 星；错题进 localStorage → 可重练
 */

const MATH = '#/math'

function problemOf(text: string) {
  const p = WORD_PROBLEMS.find((w) => w.text === text.trim())
  if (!p) throw new Error(`找不到题目：${text}`)
  return p
}

async function gotoMath(page: Page) {
  await page.goto(MATH)
  await expect(page.locator('.math-practice')).toBeVisible()
}

/** 第①步「标记」：correct=true 时把所有 rel/num 都点到 */
async function doMarkStep(page: Page, p: ReturnType<typeof problemOf>, correct: boolean) {
  await expect(page.locator('[data-testid="mark-step"]')).toBeVisible()
  const segs = page.locator('[data-testid="problem-text"] .mp-seg')
  const count = await segs.count()
  if (correct) {
    for (let i = 0; i < count; i++) {
      const cls = await segs.nth(i).getAttribute('class')
      if (cls?.includes('mp-seg--rel') || cls?.includes('mp-seg--num')) {
        await segs.nth(i).click()
      }
    }
  } else {
    // 故意只点第一个普通词（漏掉所有目标）
    for (let i = 0; i < count; i++) {
      const cls = await segs.nth(i).getAttribute('class')
      if (!cls?.includes('mp-seg--rel') && !cls?.includes('mp-seg--num')) {
        await segs.nth(i).click()
        break
      }
    }
  }
  await page.getByRole('button', { name: '标好了，读题完成' }).click()
  await expect(page.locator('[data-testid="mark-step"] .mp-feedback')).toBeVisible()
}

/** 完整答完一道题的四步 */
async function answerCurrentProblem(page: Page, correct: boolean) {
  const text = (await page.locator('[data-testid="problem-text"]').textContent())!.trim()
  const p = problemOf(text)

  await doMarkStep(page, p, correct)
  await page.getByRole('button', { name: '下一步' }).click()

  // ② 求什么
  const askIdx = p.ask.options.findIndex((o) => o.correct)
  await page.locator('[data-testid="choice-step"] .mp-choice').nth(correct ? askIdx : (askIdx + 1) % 3).click()
  await page.getByRole('button', { name: '确定' }).click()
  await expect(page.locator('[data-testid="choice-step"] .mp-feedback')).toBeVisible()
  await page.getByRole('button', { name: '下一步' }).click()

  // ③ 先算什么
  const firstIdx = p.first.options.findIndex((o) => o.correct)
  await page.locator('[data-testid="choice-step"] .mp-choice').nth(correct ? firstIdx : (firstIdx + 1) % 3).click()
  await page.getByRole('button', { name: '确定' }).click()
  await expect(page.locator('[data-testid="choice-step"] .mp-feedback')).toBeVisible()
  await page.getByRole('button', { name: '下一步' }).click()

  // ④ 得数
  await expect(page.locator('[data-testid="answer-step"]')).toBeVisible()
  await page.locator('[data-testid="answer-input"]').fill(String(correct ? p.answer : p.answer + 1))
  await page.getByRole('button', { name: '确定' }).click()
  await expect(page.locator('[data-testid="answer-step"] .mp-feedback')).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

/** 正确答完 ①②③，停在第四步「得数」但**尚未作答** */
async function advanceToAnswer(page: Page) {
  const text = (await page.locator('[data-testid="problem-text"]').textContent())!.trim()
  const p = problemOf(text)
  await doMarkStep(page, p, true)
  await page.getByRole('button', { name: '下一步' }).click()
  const askIdx = p.ask.options.findIndex((o) => o.correct)
  await page.locator('[data-testid="choice-step"] .mp-choice').nth(askIdx).click()
  await page.getByRole('button', { name: '确定' }).click()
  await page.getByRole('button', { name: '下一步' }).click()
  const firstIdx = p.first.options.findIndex((o) => o.correct)
  await page.locator('[data-testid="choice-step"] .mp-choice').nth(firstIdx).click()
  await page.getByRole('button', { name: '确定' }).click()
  await page.getByRole('button', { name: '下一步' }).click()
  await expect(page.locator('[data-testid="answer-step"]')).toBeVisible()
  return p
}

test.describe('M1/M2 入口与结构', () => {
  test('M1 首页有专项练习卡片（应用题文案），点击进入 /math', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('a.ma-home-entry')
    await expect(card).toBeVisible()
    await expect(card).toContainText('专项练习')
    await expect(card).toContainText('应用题')
    await card.click()
    await expect(page).toHaveURL(/#\/math/)
    await expect(page.getByRole('heading', { name: '应用题专项练习' })).toBeVisible()
  })

  test('M2 四步指示器都在：标记 / 求什么 / 先算什么 / 得数', async ({ page }) => {
    await gotoMath(page)
    const chips = page.locator('.mp-step-chip')
    await expect(chips).toHaveCount(4)
    await expect(chips.nth(0)).toContainText('标记')
    await expect(chips.nth(1)).toContainText('求什么')
    await expect(chips.nth(2)).toContainText('先算什么')
    await expect(chips.nth(3)).toContainText('得数')
    // 题型标签在题干卡顶部（不混进题干文本，避免 e2e 题干匹配被污染）
    await expect(page.locator('[data-testid="topic-chip"]')).toBeVisible()
  })
})

test.describe('M3 标记步（审题三步法）', () => {
  test('漏标 → 判错且漏掉的目标用红色标出', async ({ page }) => {
    await gotoMath(page)
    const text = (await page.locator('[data-testid="problem-text"]').textContent())!.trim()
    const p = problemOf(text)

    // 故意漏标 → 判错
    await doMarkStep(page, p, false)
    await expect(page.locator('[data-testid="mark-step"] .mp-feedback')).toContainText('漏掉')
    // 漏掉的每个目标都带 is-missed（红色提示），一个不少
    const missedCount = await page.locator('[data-testid="problem-text"] .mp-seg.is-missed').count()
    expect(missedCount).toBe(p.segments.filter((s) => s.k).length)
  })

  test('多标普通词不扣：仍显示「满分」通过（宽松判定）', async ({ page }) => {
    await gotoMath(page)
    const segs = page.locator('[data-testid="problem-text"] .mp-seg')
    const count = await segs.count()
    // 点所有目标 + 第一个普通词（多标）
    let clickedPlain = false
    for (let i = 0; i < count; i++) {
      const cls = (await segs.nth(i).getAttribute('class')) ?? ''
      if (cls.includes('mp-seg--rel') || cls.includes('mp-seg--num')) {
        await segs.nth(i).click()
      } else if (!clickedPlain) {
        await segs.nth(i).click()
        clickedPlain = true
      }
    }
    await page.getByRole('button', { name: '标好了，读题完成' }).click()
    await expect(page.locator('[data-testid="mark-step"] .mp-feedback')).toContainText('满分')
  })
})

test.describe('M4 全流程与错题', () => {
  test('5 题四步全对 → 结算 5 星', async ({ page }) => {
    await gotoMath(page)
    for (let i = 0; i < 5; i++) {
      await answerCurrentProblem(page, true)
      await page.getByRole('button', { name: i === 4 ? '看结果' : '下一题' }).click()
    }
    await expect(page.locator('[data-testid="math-result"]')).toBeVisible()
    await expect(page.locator('.mp-stars')).toHaveAttribute('aria-label', '获得 5 颗星')
  })

  test('做错 → 进 localStorage → 结算出现「重练做错的题」', async ({ page }) => {
    await gotoMath(page)
    for (let i = 0; i < 5; i++) {
      await answerCurrentProblem(page, false)
      await page.getByRole('button', { name: i === 4 ? '看结果' : '下一题' }).click()
    }
    await expect(page.locator('[data-testid="math-result"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /重练做错的题/ })).toBeVisible()
    const stored = await page.evaluate(() => localStorage.getItem('starlight-math-wrong'))
    expect(JSON.parse(stored!).length).toBeGreaterThan(0)

    await page.getByRole('button', { name: /重练做错的题/ }).click()
    await expect(page.locator('[data-testid="mark-step"]')).toBeVisible()
    await expect(page.locator('.mp-progress')).toContainText('第 1 /')
  })
})

test.describe('M5 不提前泄露答案', () => {
  test('点下一步后，下一步一进来不显示反馈', async ({ page }) => {
    await gotoMath(page)
    const text = (await page.locator('[data-testid="problem-text"]').textContent())!.trim()
    await doMarkStep(page, problemOf(text), true)
    await page.getByRole('button', { name: '下一步' }).click()
    await expect(page.locator('[data-testid="choice-step"]')).toBeVisible()
    // 还没选就出现反馈 = 把上一步的判定态带进了新一步（bug）
    await expect(page.locator('.mp-feedback')).toHaveCount(0)
  })

  test('得数步未作答前不显示最终答案，答完才展示完整算式', async ({ page }) => {
    await gotoMath(page)
    const p = await advanceToAnswer(page)
    // 未作答：脚手架只给第一步算式，最终答案不能出现
    const recap = (await page.locator('.mp-steps-recap').textContent()) ?? ''
    expect(recap).not.toMatch(new RegExp(`(?<!\\d)${p.answer}(?!\\d)`))
    // 作答后才出现完整两步（含最终答案）
    await page.locator('[data-testid="answer-input"]').fill(String(p.answer))
    await page.getByRole('button', { name: '确定' }).click()
    await expect(page.locator('.mp-steps-recap')).toContainText(String(p.answer))
  })
})
