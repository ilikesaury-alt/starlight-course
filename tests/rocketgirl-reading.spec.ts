/**
 * Rocket Girl 阅读（/#/rocketgirl）E2E。
 *
 * Rocket Girl 已**整体**并入阅读模块：/rocketgirl 现在渲染的就是 ReadingBook
 * 那套白纸页 + hero + 通栏故事弧目录 + 就地展开的 ReadingZone。
 *
 * 契约：
 *  ① 首页入口可达，页面是 .reading-sheet，面包屑写「Rocket Girl 阅读」；
 *  ② 27 条故事弧 × 4 集 = 108 条，data-testid 为 rm-lesson-rg-*；
 *  ③ 展开一条弧见宝藏词；点一条就地展开阅读器（≤10 句），一次只展开一篇；
 *  ④ 点词弹层有中文，不出现「词典里还没这个词」；
 *  ⑤ 旧 RG 的 Tab / 测验 / 标记本关完成 / 搜索框 / 绘本馆全部消失；
 *  ⑥ /reading 的系列切换条仍恰好 2 项（并入不能破坏旧契约）。
 */

import { test, expect, type Page } from '@playwright/test'

const RG = '/#/rocketgirl'
const READING = '/#/reading'
const ARC_COUNT = 27
const STORY_COUNT = 108

/** 展开某条故事弧（单元默认全收起，子元素不可点） */
async function expandArc(page: Page, arcId: number) {
  const arc = page.locator(`.rm-unit[data-unit="${arcId}"]`)
  await arc.locator('summary').click()
  await expect(arc).toHaveAttribute('open', '')
  return arc
}

/** 进入 RG 页并展开第 1 条弧、点开第 1 集 */
async function openFirst(page: Page) {
  await page.goto(RG)
  await expect(page.locator('.rm-unit')).toHaveCount(ARC_COUNT, { timeout: 15000 })
  await expandArc(page, 1)
  await page.getByTestId('rm-lesson-rg-1-1').click()
  await expect(page.locator('.reading-zone')).toBeVisible()
}

test.describe('Rocket Girl 阅读 · 入口与结构', () => {
  test('首页入口可达，进来就是阅读模块的白纸页', async ({ page }) => {
    await page.goto('/')
    const entry = page.locator('.rg-home-entry')
    await expect(entry).toBeVisible({ timeout: 15000 })
    await expect(entry).toContainText('Rocket Girl 阅读')
    await expect(entry).toHaveAttribute('href', /#\/rocketgirl$/)
    await entry.click()

    await expect(page).toHaveURL(/#\/rocketgirl$/)
    await expect(page.locator('.page.reading-module.reading-sheet')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('h1.rm-hero-title')).toContainText('Rocket Girl 阅读')
    // 母题是大字陈述句 + 可点的宝藏词示例
    await expect(page.locator('.rm-hero-statement')).toContainText('Roxy')
    await expect(page.locator('.rm-hero-word')).toHaveCount(5)
  })

  test('面包屑是 🏠 › Rocket Girl 阅读；没有系列切换条', async ({ page }) => {
    await page.goto(RG)
    const crumb = page.locator('.breadcrumb')
    await expect(crumb).toBeVisible({ timeout: 15000 })
    await expect(crumb).toContainText('🏠')
    await expect(crumb).toContainText('Rocket Girl 阅读')
    await expect(page.locator('.sl-series-tab')).toHaveCount(0)
  })

  test('27 条故事弧，每条 4 集，共 108 条课', async ({ page }) => {
    await page.goto(RG)
    await expect(page.locator('.rm-unit')).toHaveCount(ARC_COUNT, { timeout: 15000 })
    for (let arc = 1; arc <= ARC_COUNT; arc++) {
      await expect(page.locator(`[data-testid^="rm-lesson-rg-${arc}-"]`)).toHaveCount(4)
    }
    await expect(page.locator('[data-testid^="rm-lesson-rg-"]')).toHaveCount(STORY_COUNT)
    // 目录语义是故事弧，不是 Starlight 的 Module N
    await expect(page.locator('.rm-unit[data-unit="1"] .rm-unit-title')).toContainText(
      'Rocket Girl and the Aliens',
    )
    await expect(page.locator('.rm-unit[data-unit="1"] .rm-unit-title')).not.toContainText('Module')
  })

  test('旧 RG 的 Tab / 测验 / 标记完成 / 搜索 / 绘本馆全部消失', async ({ page }) => {
    await page.goto(RG)
    await expect(page.locator('.reading-sheet')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.tab-bar')).toHaveCount(0)
    await expect(page.locator('.tab-btn')).toHaveCount(0)
    await expect(page.locator('.quiz-engine')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /标记本关完成|本关已完成/ })).toHaveCount(0)
    await expect(page.locator('.rg-search')).toHaveCount(0)
    await expect(page.locator('.rg-books')).toHaveCount(0)
    await expect(page.locator('.rg-card')).toHaveCount(0)
    await expect(page.locator('.rg-progress-pill')).toHaveCount(0)
  })

  test('旧的单集路由重定向回阅读目录（书签不白屏）', async ({ page }) => {
    await page.goto('/#/rocketgirl/rg-1')
    await expect(page).toHaveURL(/#\/rocketgirl$/)
    await expect(page.locator('.reading-sheet')).toBeVisible({ timeout: 15000 })
  })
})

test.describe('Rocket Girl 阅读 · 目录与阅读器', () => {
  test('展开一条弧看到这一组的宝藏词，每个都可点', async ({ page }) => {
    await page.goto(RG)
    const arc = await expandArc(page, 1)
    const words = arc.locator('.rm-treasure-word')
    expect(await words.count()).toBeGreaterThan(0)
    await expect(arc.locator('.rm-unit-treasure')).toContainText(String(await words.count()))
    await words.first().click()
    await expect(words.first()).toBeVisible()
  })

  test('点一条就地展开阅读器：≤10 句、中英文标题都在', async ({ page }) => {
    await openFirst(page)
    await expect(page.locator('.reading-sent').first()).toBeVisible()
    expect(await page.locator('.reading-sent').count()).toBeLessThanOrEqual(10)
    await expect(page.locator('.reading-title')).toBeVisible()
    await expect(page.locator('.reading-title-zh')).toBeVisible()
    await expect(page.locator('.reading-title-zh')).toContainText('例句')
    // 不是旧的分页器
    await expect(page.getByRole('button', { name: /下一页/ })).toHaveCount(0)
  })

  test('一次只展开一篇：点另一集会收起上一篇', async ({ page }) => {
    await openFirst(page)
    const firstTitle = await page.locator('.reading-title').textContent()

    await expandArc(page, 2)
    await page.getByTestId('rm-lesson-rg-2-1').click()
    await expect(page.locator('.reading-zone')).toHaveCount(1)
    const secondTitle = await page.locator('.reading-title').textContent()
    expect(secondTitle).not.toBe(firstTitle)
  })

  test('点词弹层有中文，不出现「词典里还没这个词」', async ({ page }) => {
    await openFirst(page)
    // 挑一个词级查不到的词（title 退化成「点击听发音」），靠整句中文兜住
    const word = page.locator('.reading-zone .tt-word[title="点击听发音"]').first()
    await expect(word).toBeVisible()
    await word.click()
    const pop = page.locator('.reading-zone .tt-pop')
    await expect(pop).toBeVisible()
    await expect(pop.locator('.tt-pop-zh')).not.toContainText('词典里还没这个词')
    await expect(pop.locator('.tt-pop-zh')).not.toBeEmpty()
  })

  test('显示中文后译文排在英文下方；阅读器开关是软按钮', async ({ page }) => {
    await openFirst(page)
    await page.getByTestId('reading-zh-toggle').click()
    await expect(page.locator('.reading-zone.is-zh')).toBeVisible()
    expect(await page.locator('.reading-zh').count()).toBeGreaterThan(0)
    await expect(page.getByTestId('reading-play-all')).toHaveClass(/btn--soft/)
    await expect(page.getByTestId('reading-zh-toggle')).toHaveClass(/btn--soft/)
  })
})

test.describe('并入边界', () => {
  test('/reading 的系列切换条仍恰好 2 项，指向预备级 / 第一册', async ({ page }) => {
    await page.goto(READING)
    const tabs = page.locator('.sl-series-tab')
    await expect(tabs).toHaveCount(2, { timeout: 15000 })
    await expect(tabs.nth(0)).toHaveAttribute('href', /reading$/)
    await expect(tabs.nth(1)).toHaveAttribute('href', /reading1$/)
  })
})
