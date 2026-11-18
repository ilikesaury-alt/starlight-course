import { test, expect, type Page } from '@playwright/test'

/**
 * 数学专项练习（/math）端到端测试。
 *
 * 覆盖陈老师反馈的三点 + 首页入口：
 *   M1 首页「专项练习」入口可见、href=/math、点击进入
 *   M2 三个模式 Tab 都在
 *   M3 计算题：答对 → 反馈 + 答对数增加；答错 → 显示正确答案 + 进错因复盘
 *   M4 读题·圈关键词：点选关键词 → 判定反馈 → 第二步答案
 *   M5 结算卡出现星星，错题刷新后仍在（localStorage 持久化）
 */

const MATH = '#/math'

/** 从题干算式算出期望答案（中文运算符 → JS 运算符） */
function answerOf(stem: string): number {
  const expr = stem
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/=.*$/, '')
  return Function(`"use strict";return (${expr})`)() as number
}

async function gotoMath(page: Page) {
  await page.goto(MATH)
  await expect(page.locator('.math-practice')).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('M1/M2 入口与模式', () => {
  test('M1 首页有专项练习卡片，点击进入 /math', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('a.ma-home-entry')
    await expect(card).toBeVisible()
    await expect(card).toContainText('专项练习')
    await expect(card).toHaveAttribute('href', '#/math')
    await card.click()
    await expect(page).toHaveURL(/#\/math/)
    await expect(page.getByRole('heading', { name: /专项练习/ })).toBeVisible()
  })

  test('M2 三个模式 Tab 都在', async ({ page }) => {
    await gotoMath(page)
    const tabs = page.locator('.mp-tab')
    await expect(tabs).toHaveCount(3)
    await expect(tabs.nth(0)).toContainText('计算专项')
    await expect(tabs.nth(1)).toContainText('读题·圈关键词')
    await expect(tabs.nth(2)).toContainText('错因复盘')
  })
})

test.describe('M3 计算题', () => {
  test('答对 → 显示「答对啦」且答对数 +1', async ({ page }) => {
    await gotoMath(page)
    const stem = (await page.locator('[data-testid="calc-stem"]').textContent())!.trim()
    const answer = answerOf(stem)
    await page.locator('[data-testid="calc-input"]').fill(String(answer))
    await page.getByRole('button', { name: '确定' }).click()
    await expect(page.locator('.mp-feedback')).toContainText('答对啦')
    await expect(page.locator('.mp-progress')).toContainText('答对 1')
  })

  test('答错 → 显示正确答案，并进入错因复盘', async ({ page }) => {
    await gotoMath(page)
    const stem = (await page.locator('[data-testid="calc-stem"]').textContent())!.trim()
    const answer = answerOf(stem)
    await page.locator('[data-testid="calc-input"]').fill(String(answer + 1))
    await page.getByRole('button', { name: '确定' }).click()
    await expect(page.locator('.mp-feedback')).toContainText('正确答案')

    await page.locator('.mp-tab').nth(2).click()
    await expect(page.locator('.mp-cause-card').first()).toBeVisible()
  })
})

test.describe('M4 读题·圈关键词', () => {
  test('第一步点选关键词有反馈，第二步能填答案', async ({ page }) => {
    await gotoMath(page)
    await page.locator('.mp-tab').nth(1).click()
    await expect(page.locator('[data-testid="keyword-question"]')).toBeVisible()
    const words = page.locator('[data-testid="keyword-words"] .mp-word')
    await words.first().click()
    await page.getByRole('button', { name: '圈好了，下一步' }).click()
    await expect(page.locator('.mp-feedback')).toBeVisible()
    // 进入第二步
    await page.getByRole('button', { name: '去做题' }).click()
    await expect(page.locator('[data-testid="keyword-input"]')).toBeVisible()
  })
})

test.describe('M5 结算与持久化', () => {
  test('做完一组计算题出现星星，错题刷新后仍在', async ({ page }) => {
    await gotoMath(page)
    // 全部故意答错，跑完 10 题
    for (let i = 0; i < 10; i++) {
      await page.locator('[data-testid="calc-input"]').fill('0')
      await page.getByRole('button', { name: '确定' }).click()
      const next = page.getByRole('button', { name: i === 9 ? '看结果' : '下一题' })
      await next.click()
    }
    await expect(page.locator('[data-testid="math-result"]')).toBeVisible()
    await expect(page.locator('.mp-stars')).toBeVisible()

    // 刷新后错题还在（localStorage）。刷新仍停在 #/math 这个 hash 路由上。
    await page.reload()
    await expect(page.locator('.math-practice')).toBeVisible()
    await page.locator('.mp-tab').nth(2).click()
    await expect(page.locator('.mp-tab').nth(2)).toContainText(/[1-9]/)
  })
})
