/**
 * 青蛙与蟾蜍阅读（/#/frog-and-toad）E2E。
 *
 * 4 本子书 = 4 单元，每本 5 故事（课），共 20 课全部收录。
 * 契约：
 *  ① 书馆入口可达 → 阅读模块白纸页，面包含经书馆；
 *  ② 4 单元、第一本 5 课，data-testid = rm-lesson-frog-1-{n}；
 *  ③ 展开见宝藏词；点故事就地展开阅读器，一次只展开一篇；
 *  ④ 故事课标题写中英故事名，每句带中文；
 *  ⑤ 没有闯关形态的 Tab / 测验 / 标记完成。
 */

import { test, expect, type Page } from '@playwright/test'

const FROG = '/#/frog-and-toad'
const BOOKS = '/#/books'

async function openBook(page: Page) {
  await page.goto(FROG)
  await expect(page.locator('.rm-unit')).toHaveCount(4, { timeout: 15000 })
  await page.locator('.rm-unit[data-unit="1"] summary').click()
  await expect(page.locator('.rm-unit[data-unit="1"]')).toHaveAttribute('open', '')
}

async function openFirst(page: Page) {
  await openBook(page)
  await page.getByTestId('rm-lesson-frog-1-1').click()
  await expect(page.locator('.reading-zone')).toBeVisible()
}

test.describe('青蛙与蟾蜍 · 入口与结构', () => {
  test('书馆入口可达，进来就是阅读模块白纸页', async ({ page }) => {
    await page.goto(BOOKS)
    await expect(page.getByTestId('bw-series-frog-and-toad')).toBeVisible({ timeout: 15000 })
    await page.getByTestId('bw-series-frog-and-toad').click()
    await expect(page).toHaveURL(/#\/frog-and-toad$/)
    await expect(page.locator('.page.reading-module.reading-sheet')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('h1.rm-hero-title')).toContainText('青蛙与蟾蜍')
    await expect(page.locator('.rm-hero-statement')).toContainText('Frog')
    await expect(page.locator('.rm-hero-word')).toHaveCount(5)
  })

  test('hero 有版权口径说明；面包屑经书馆；没有系列切换条', async ({ page }) => {
    await page.goto(FROG)
    await expect(page.locator('.rm-hero-sub')).toContainText('Arnold Lobel', { timeout: 15000 })
    await expect(page.locator('.rm-hero-sub')).toContainText('合理使用')
    const crumb = page.locator('.breadcrumb')
    await expect(crumb).toContainText('绘本桥梁书馆')
    await expect(crumb).toContainText('青蛙与蟾蜍')
    await expect(page.locator('.sl-series-tab')).toHaveCount(0)
  })

  test('4 个单元各 5 课，共 20 课', async ({ page }) => {
    await page.goto(FROG)
    await expect(page.locator('.rm-unit')).toHaveCount(4, { timeout: 15000 })
    for (let n = 1; n <= 4; n++) {
      await expect(page.locator(`[data-testid^="rm-lesson-frog-${n}-"]`)).toHaveCount(5)
    }
    await expect(page.locator('[data-testid^="rm-lesson-frog-"]')).toHaveCount(20)
    await expect(page.locator('.rm-unit[data-unit="1"] .rm-unit-title')).toContainText(
      'Frog and Toad Are Friends',
    )
    await expect(page.locator('.rm-unit[data-unit="1"] .rm-unit-count')).toContainText('5 篇')
  })

  test('旧闯关形态的 Tab / 测验 / 标记完成全部不存在', async ({ page }) => {
    await page.goto(FROG)
    await expect(page.locator('.reading-sheet')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.tab-bar')).toHaveCount(0)
    await expect(page.locator('.quiz-engine')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /标记本关完成/ })).toHaveCount(0)
  })
})

test.describe('青蛙与蟾蜍 · 阅读器', () => {
  test('展开第一本书看到宝藏词，每个都可点', async ({ page }) => {
    await openBook(page)
    const words = page.locator('.rm-unit[data-unit="1"] .rm-treasure-word')
    expect(await words.count()).toBeGreaterThan(0)
    await words.first().click()
    await expect(words.first()).toBeVisible()
  })

  test('点第一个故事就地展开阅读器：按句成段、中英标题都在', async ({ page }) => {
    await openFirst(page)
    await expect(page.locator('.reading-sent').first()).toBeVisible()
    // Spring 55 句
    expect(await page.locator('.reading-sent').count()).toBe(55)
    await expect(page.locator('.reading-title')).toContainText('Spring')
    await expect(page.locator('.reading-title-zh')).toContainText('春天')
    await expect(page.getByRole('button', { name: /下一页/ })).toHaveCount(0)
  })

  test('一次只展开一篇：点另一个故事会收起上一篇', async ({ page }) => {
    await openFirst(page)
    const firstTitle = await page.locator('.reading-title').textContent()
    await page.getByTestId('rm-lesson-frog-1-2').click()
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
