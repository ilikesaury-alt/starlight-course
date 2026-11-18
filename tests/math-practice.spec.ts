import { test, expect, type Page } from '@playwright/test'
import { WORD_PROBLEMS } from '../src/data/mathPractice'

/**
 * 应用题专项练习（/math）端到端测试。
 *
 * 覆盖：
 *   M1 首页「专项练习」入口可见、href=/math、点击进入（文案为「应用题 · 读题三步走」）
 *   M2 不再有「计算专项 / 错因复盘」Tab（用户要求去掉计算）
 *   M3 三步问：求什么 → 先算什么 → 得数，每步即时反馈；全答对得 5 星
 *   M4 做错的题进 localStorage，结算后可「重练做错的题」
 */

const MATH = '#/math'

/** 从题干文字找到对应题目数据（题面来自同一数据源，稳定） */
function problemOf(text: string) {
  const p = WORD_PROBLEMS.find((w) => w.text === text.trim())
  if (!p) throw new Error(`找不到题目：${text}`)
  return p
}

async function gotoMath(page: Page) {
  await page.goto(MATH)
  await expect(page.locator('.math-practice')).toBeVisible()
}

/** 答完当前题的三步（按数据里的正确选项点） */
async function answerCurrentProblem(page: Page, correct: boolean) {
  const text = (await page.locator('[data-testid="problem-text"]').textContent())!.trim()
  const p = problemOf(text)

  // 第一步：求什么
  const askIdx = p.ask.options.findIndex((o) => o.correct)
  await page.locator('[data-testid="choice-step"] .mp-choice').nth(correct ? askIdx : (askIdx + 1) % 3).click()
  await page.getByRole('button', { name: '确定' }).click()
  await expect(page.locator('[data-testid="choice-step"] .mp-feedback')).toBeVisible()
  await page.getByRole('button', { name: '下一步' }).click()

  // 第二步：先算什么
  const firstIdx = p.first.options.findIndex((o) => o.correct)
  await page.locator('[data-testid="choice-step"] .mp-choice').nth(correct ? firstIdx : (firstIdx + 1) % 3).click()
  await page.getByRole('button', { name: '确定' }).click()
  await expect(page.locator('[data-testid="choice-step"] .mp-feedback')).toBeVisible()
  await page.getByRole('button', { name: '下一步' }).click()

  // 第三步：得数
  await expect(page.locator('[data-testid="answer-step"]')).toBeVisible()
  await page.locator('[data-testid="answer-input"]').fill(String(correct ? p.answer : p.answer + 1))
  await page.getByRole('button', { name: '确定' }).click()
  await expect(page.locator('[data-testid="answer-step"] .mp-feedback')).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('M1/M2 入口与结构', () => {
  test('M1 首页有专项练习卡片（应用题文案），点击进入 /math', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('a.ma-home-entry')
    await expect(card).toBeVisible()
    await expect(card).toContainText('专项练习')
    await expect(card).toContainText('应用题')
    await expect(card).toHaveAttribute('href', '#/math')
    await card.click()
    await expect(page).toHaveURL(/#\/math/)
    await expect(page.getByRole('heading', { name: '应用题专项练习' })).toBeVisible()
  })

  test('M2 没有计算专项 / 错因复盘 Tab', async ({ page }) => {
    await gotoMath(page)
    await expect(page.getByText('计算专项')).toHaveCount(0)
    await expect(page.getByText('错因复盘')).toHaveCount(0)
    // 三步指示器都在
    await expect(page.locator('.mp-step-chip')).toHaveCount(3)
  })
})

test.describe('M3 三步问', () => {
  test('全答对 → 结算 5 星', async ({ page }) => {
    await gotoMath(page)
    // 本轮 5 题全答对
    for (let i = 0; i < 5; i++) {
      await answerCurrentProblem(page, true)
      const btn = page.getByRole('button', { name: i === 4 ? '看结果' : '下一题' })
      await btn.click()
    }
    await expect(page.locator('[data-testid="math-result"]')).toBeVisible()
    await expect(page.locator('.mp-stars')).toHaveAttribute('aria-label', '获得 5 颗星')
  })
})

test.describe('M4 错题与重练', () => {
  test('做错第一步 → 进 localStorage → 结算出现「重练做错的题」', async ({ page }) => {
    await gotoMath(page)
    for (let i = 0; i < 5; i++) {
      await answerCurrentProblem(page, false)
      await page.getByRole('button', { name: i === 4 ? '看结果' : '下一题' }).click()
    }
    await expect(page.locator('[data-testid="math-result"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /重练做错的题/ })).toBeVisible()

    const stored = await page.evaluate(() => localStorage.getItem('starlight-math-wrong'))
    expect(stored).toBeTruthy()
    expect(JSON.parse(stored!).length).toBeGreaterThan(0)

    // 点重练 → 回到第一题
    await page.getByRole('button', { name: /重练做错的题/ }).click()
    await expect(page.locator('[data-testid="problem-text"]')).toBeVisible()
    await expect(page.locator('.mp-progress')).toContainText('第 1 /')
  })
})
