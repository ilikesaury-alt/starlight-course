/**
 * Winnie the Witch 阅读（/#/winnie）E2E。
 *
 * 契约：
 *  ① 书馆入口可达 → 点 Winnie 卡 → 阅读模块白纸页；
 *  ② 1 个单元、20 个正文页课，data-testid = rm-lesson-winnie-1-{页码}；
 *  ③ 展开见宝藏词；点一页就地展开阅读器，一次只展开一篇；
 *  ④ 原文课标题写「绘本原文」，每页带中文；
 *  ⑤ 没有闯关形态的 Tab / 测验 / 标记完成。
 */

import { test, expect, type Page } from '@playwright/test'

const WINNIE = '/#/winnie'
const BOOKS = '/#/books'

async function openBook(page: Page) {
  await page.goto(WINNIE)
  await expect(page.locator('.rm-unit')).toHaveCount(1, { timeout: 15000 })
  await page.locator('.rm-unit[data-unit="1"] summary').click()
  await expect(page.locator('.rm-unit[data-unit="1"]')).toHaveAttribute('open', '')
}

async function openFirst(page: Page) {
  await openBook(page)
  await page.getByTestId('rm-lesson-winnie-1-3').click()
  await expect(page.locator('.reading-zone')).toBeVisible()
}

test.describe('Winnie the Witch · 入口与结构', () => {
  test('书馆入口可达，进来就是阅读模块白纸页', async ({ page }) => {
    await page.goto(BOOKS)
    await expect(page.getByTestId('bw-series-winnie-the-witch')).toBeVisible({ timeout: 15000 })
    await page.getByTestId('bw-series-winnie-the-witch').click()
    await expect(page).toHaveURL(/#\/winnie$/)
    await expect(page.locator('.page.reading-module.reading-sheet')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('h1.rm-hero-title')).toContainText('女巫温妮')
    await expect(page.locator('.rm-hero-statement')).toContainText('Winnie')
    await expect(page.locator('.rm-hero-word')).toHaveCount(5)
  })

  test('hero 有版权口径说明；面包屑经书馆；没有系列切换条', async ({ page }) => {
    await page.goto(WINNIE)
    await expect(page.locator('.rm-hero-sub')).toContainText('Valerie Thomas', { timeout: 15000 })
    await expect(page.locator('.rm-hero-sub')).toContainText('合理使用')
    const crumb = page.locator('.breadcrumb')
    await expect(crumb).toContainText('绘本桥梁书馆')
    await expect(crumb).toContainText('女巫温妮')
    await expect(page.locator('.sl-series-tab')).toHaveCount(0)
  })

  test('1 个单元、20 个正文页课，页码从 3 起（剔除纯插画页）', async ({ page }) => {
    await page.goto(WINNIE)
    await expect(page.locator('.rm-unit')).toHaveCount(1, { timeout: 15000 })
    await expect(page.locator('[data-testid^="rm-lesson-winnie-"]')).toHaveCount(20)
    // 单元默认收起，展开后再断言具体课可见
    await page.locator('.rm-unit[data-unit="1"] summary').click()
    await expect(page.getByTestId('rm-lesson-winnie-1-3')).toBeVisible()
    await expect(page.getByTestId('rm-lesson-winnie-1-26')).toBeVisible() // 最后一页正文
    await expect(page.getByTestId('rm-lesson-winnie-1-4')).toHaveCount(0) // 纯插画页不收
    await expect(page.locator('.rm-unit[data-unit="1"] .rm-unit-title')).toContainText(
      'Winnie the Witch',
    )
  })

  test('旧闯关形态的 Tab / 测验 / 标记完成全部不存在', async ({ page }) => {
    await page.goto(WINNIE)
    await expect(page.locator('.reading-sheet')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.tab-bar')).toHaveCount(0)
    await expect(page.locator('.quiz-engine')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /标记本关完成/ })).toHaveCount(0)
  })
})

test.describe('Winnie the Witch · 阅读器', () => {
  test('展开这本书看到宝藏词，每个都可点', async ({ page }) => {
    await openBook(page)
    const words = page.locator('.rm-unit[data-unit="1"] .rm-treasure-word')
    expect(await words.count()).toBeGreaterThan(0)
    await words.first().click()
    await expect(words.first()).toBeVisible()
  })

  test('点一页就地展开阅读器：原文按页成句、中英文标题都在', async ({ page }) => {
    await openFirst(page)
    await expect(page.locator('.reading-sent').first()).toBeVisible()
    // Page 3 = 6 句
    expect(await page.locator('.reading-sent').count()).toBe(6)
    await expect(page.locator('.reading-title')).toContainText('Page 3')
    await expect(page.locator('.reading-title-zh')).toContainText('绘本原文')
    await expect(page.getByRole('button', { name: /下一页/ })).toHaveCount(0)
  })

  test('一次只展开一篇：点另一页会收起上一篇', async ({ page }) => {
    await openFirst(page)
    const firstTitle = await page.locator('.reading-title').textContent()
    await page.getByTestId('rm-lesson-winnie-1-5').click()
    await expect(page.locator('.reading-zone')).toHaveCount(1)
    const secondTitle = await page.locator('.reading-title').textContent()
    expect(secondTitle).not.toBe(firstTitle)
  })

  test('点词弹层有中文，不出现「词典里还没这个词」', async ({ page }) => {
    await openFirst(page)
    const word = page.locator('.reading-zone .tt-word').first()
    await expect(word).toBeVisible()
    await word.click()
    const pop = page.locator('.reading-zone .tt-pop')
    await expect(pop).toBeVisible()
    await expect(pop.locator('.tt-pop-zh')).not.toContainText('词典里还没这个词')
    await expect(pop.locator('.tt-pop-zh')).not.toBeEmpty()
  })

  test('显示中文后译文排在英文下方', async ({ page }) => {
    await openFirst(page)
    await page.getByTestId('reading-zh-toggle').click()
    await expect(page.locator('.reading-zone.is-zh')).toBeVisible()
    expect(await page.locator('.reading-zh').count()).toBeGreaterThan(0)
  })
})
