/**
 * 绘本桥梁书馆（/#/books）E2E。
 *
 * 书馆是纯目录：14 套书（用户书单 13 套 + 已有 RG），可读 4 套、准备中 10 套。
 * 契约：
 *  ① 首页阅读区恒定 2 卡，新书馆卡可达；
 *  ② 14 张 tile 齐全，可读卡是 <a>、准备中是灰态 <div>（不可点）；
 *  ③ 搜索 / 难度 chip / 状态 chip 过滤正常；
 *  ④ 点可读卡分别进 /flyguy、/rocketgirl、/winnie、/frog-and-toad；
 *  ⑤ 书馆是「加书只改数据」的目录：页面本身不承载正文。
 */

import { test, expect } from '@playwright/test'

const BOOKS = '/#/books'

test.describe('绘本桥梁书馆 · 入口与结构', () => {
  test('首页阅读区恰好 2 卡，书馆卡可达', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hall-reading .hall-card')).toHaveCount(2, { timeout: 15000 })
    // 教材配套阅读卡是重契约，仍在
    await expect(page.locator('.rd-home-entry')).toBeVisible()
    const entry = page.locator('.bw-home-entry')
    await expect(entry).toBeVisible()
    await expect(entry).toContainText('绘本桥梁书馆')
    await expect(entry).toHaveAttribute('href', /#\/books$/)
    await expect(entry).toContainText('14 套书 · 4 套可读')
    await entry.click()

    await expect(page).toHaveURL(/#\/books$/)
    await expect(page.locator('.page.book-wall')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('h1.rm-hero-title')).toContainText('绘本桥梁书馆')
  })

  test('14 张书卡齐全：4 张可读 <a> + 10 张准备中 <div>', async ({ page }) => {
    await page.goto(BOOKS)
    await expect(page.locator('[data-testid^="bw-series-"]')).toHaveCount(14, { timeout: 15000 })
    await expect(page.locator('a[data-testid^="bw-series-"]')).toHaveCount(4)
    await expect(page.locator('div[data-testid^="bw-series-"]')).toHaveCount(10)
    // 可读四套的路由
    await expect(page.getByTestId('bw-series-fly-guy')).toHaveAttribute('href', /#\/flyguy$/)
    await expect(page.getByTestId('bw-series-rocket-girl')).toHaveAttribute(
      'href',
      /#\/rocketgirl$/,
    )
    await expect(page.getByTestId('bw-series-winnie-the-witch')).toHaveAttribute('href', /#\/winnie$/)
    await expect(page.getByTestId('bw-series-frog-and-toad')).toHaveAttribute('href', /#\/frog-and-toad$/)
    // 准备中的灰卡不可点
    const soon = page.getByTestId('bw-series-mercy-watson')
    await expect(soon).toContainText('准备中')
    await expect(soon.locator('xpath=self::div')).toHaveCount(1)
    await expect(soon).toHaveAttribute('aria-disabled', 'true')
  })

  test('可读书排在最前（按蓝思升序），其余按蓝思从易到难', async ({ page }) => {
    await page.goto(BOOKS)
    await expect(page.locator('[data-testid^="bw-series-"]')).toHaveCount(14, { timeout: 15000 })
    const slugs = await page
      .locator('[data-testid^="bw-series-"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')))
    expect(slugs.slice(0, 4)).toEqual([
      'bw-series-fly-guy',
      'bw-series-winnie-the-witch',
      'bw-series-rocket-girl',
      'bw-series-frog-and-toad',
    ])
    expect(slugs[4]).toBe('bw-series-nate-the-great') // 230L 起步，最易
  })
})

test.describe('绘本桥梁书馆 · 筛选与跳转', () => {
  test('搜索按中文名/作者过滤', async ({ page }) => {
    await page.goto(BOOKS)
    await expect(page.locator('[data-testid^="bw-series-"]')).toHaveCount(14, { timeout: 15000 })
    await page.getByLabel('搜索书单').fill('侦探')
    await expect(page.locator('[data-testid^="bw-series-"]')).toHaveCount(1)
    await expect(page.getByTestId('bw-series-nate-the-great')).toBeVisible()

    await page.getByLabel('搜索书单').fill('DiCamillo')
    await expect(page.locator('[data-testid^="bw-series-"]')).toHaveCount(1)
    await expect(page.getByTestId('bw-series-mercy-watson')).toBeVisible()
  })

  test('难度 chip 过滤：起步档只显示 400L 以下的书', async ({ page }) => {
    await page.goto(BOOKS)
    await expect(page.locator('[data-testid^="bw-series-"]')).toHaveCount(14, { timeout: 15000 })
    await page.getByRole('group', { name: '按难度筛选' }).getByRole('button', { name: /起步/ }).click()
    const count = await page.locator('[data-testid^="bw-series-"]').count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThan(14)
    // 起步档不应出现 550L+ 的挑战书
    await expect(page.getByTestId('bw-series-kung-pow-chicken')).toHaveCount(0)
  })

  test('状态 chip 过滤：只看可以读，恰好 4 张', async ({ page }) => {
    await page.goto(BOOKS)
    await expect(page.locator('[data-testid^="bw-series-"]')).toHaveCount(14, { timeout: 15000 })
    await page.getByRole('group', { name: '按状态筛选' }).getByRole('button', { name: '可以读' }).click()
    await expect(page.locator('[data-testid^="bw-series-"]')).toHaveCount(4)
    await page.getByRole('group', { name: '按状态筛选' }).getByRole('button', { name: '准备中' }).click()
    await expect(page.locator('[data-testid^="bw-series-"]')).toHaveCount(10)
  })

  test('点可读书卡进入对应阅读模块', async ({ page }) => {
    await page.goto(BOOKS)
    await expect(page.getByTestId('bw-series-fly-guy')).toBeVisible({ timeout: 15000 })
    await page.getByTestId('bw-series-fly-guy').click()
    await expect(page).toHaveURL(/#\/flyguy$/)
    await expect(page.locator('.reading-sheet')).toBeVisible({ timeout: 15000 })

    await page.goto(BOOKS)
    await expect(page.getByTestId('bw-series-rocket-girl')).toBeVisible({ timeout: 15000 })
    await page.getByTestId('bw-series-rocket-girl').click()
    await expect(page).toHaveURL(/#\/rocketgirl$/)
    await expect(page.locator('.reading-sheet')).toBeVisible({ timeout: 15000 })

    await page.goto(BOOKS)
    await expect(page.getByTestId('bw-series-winnie-the-witch')).toBeVisible({ timeout: 15000 })
    await page.getByTestId('bw-series-winnie-the-witch').click()
    await expect(page).toHaveURL(/#\/winnie$/)
    await expect(page.locator('.reading-sheet')).toBeVisible({ timeout: 15000 })

    await page.goto(BOOKS)
    await expect(page.getByTestId('bw-series-frog-and-toad')).toBeVisible({ timeout: 15000 })
    await page.getByTestId('bw-series-frog-and-toad').click()
    await expect(page).toHaveURL(/#\/frog-and-toad$/)
    await expect(page.locator('.reading-sheet')).toBeVisible({ timeout: 15000 })
  })
})
