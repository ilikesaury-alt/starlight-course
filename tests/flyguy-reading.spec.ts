/**
 * Fly Guy 阅读（/#/flyguy）E2E。
 *
 * Fly Guy 已**整体**并入阅读模块（2026-11-17，对齐 Rocket Girl 的重做）：
 * /flyguy 现在渲染的就是 ReadingBook 那套白纸页 + hero + 通栏书单 +
 * 就地展开的 ReadingZone。
 *
 * 契约：
 *  ① 首页入口可达，页面是 .reading-sheet，hero 有版权口径说明；
 *  ② 22 本书，15 本有原文的按章拆课（共 58 章）、7 本只有 1 节例句课，
 *     data-testid 为 rm-lesson-fg-*；
 *  ③ 展开一本书见宝藏词；点一课就地展开阅读器，一次只展开一篇；
 *  ④ 原文课标题写「绘本原文」、例句课写「这一本的例句」（文案诚实）；
 *  ⑤ 旧闯关形态的 Tab / 测验 / 标记完成 / 搜索 / 绘本馆全部消失；
 *  ⑥ 旧的单本路由重定向回书架。
 */

import { test, expect, type Page } from '@playwright/test'

const FG = '/#/flyguy'
const BOOK_COUNT = 22

/** 展开某本书（单元默认全收起，子元素不可点） */
async function expandBook(page: Page, bookId: number) {
  const book = page.locator(`.rm-unit[data-unit="${bookId}"]`)
  await book.locator('summary').click()
  await expect(book).toHaveAttribute('open', '')
  return book
}

/** 进入 FG 页并展开第 1 本、点开第 1 章 */
async function openFirst(page: Page) {
  await page.goto(FG)
  await expect(page.locator('.rm-unit')).toHaveCount(BOOK_COUNT, { timeout: 15000 })
  await expandBook(page, 1)
  await page.getByTestId('rm-lesson-fg-1-1').click()
  await expect(page.locator('.reading-zone')).toBeVisible()
}

test.describe('Fly Guy 阅读 · 入口与结构', () => {
  test('书馆入口可达，进来就是阅读模块的白纸页', async ({ page }) => {
    // 首页阅读区已收敛为 2 卡：书单统一走「绘本桥梁书馆」
    await page.goto('/')
    const hall = page.locator('.bw-home-entry')
    await expect(hall).toBeVisible({ timeout: 15000 })
    await hall.click()
    await expect(page).toHaveURL(/#\/books$/)
    const entry = page.getByTestId('bw-series-fly-guy')
    await expect(entry).toBeVisible({ timeout: 15000 })
    await expect(entry).toContainText('Fly Guy')
    await expect(entry).toHaveAttribute('href', /#\/flyguy$/)
    await entry.click()

    await expect(page).toHaveURL(/#\/flyguy$/)
    await expect(page.locator('.page.reading-module.reading-sheet')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('h1.rm-hero-title')).toContainText('Fly Guy 绘本')
    await expect(page.locator('.rm-hero-statement')).toContainText('Buzz')
    await expect(page.locator('.rm-hero-word')).toHaveCount(5)
  })

  test('hero 有版权口径说明；面包屑是 🏠 › Fly Guy 绘本；没有系列切换条', async ({ page }) => {
    await page.goto(FG)
    await expect(page.locator('.rm-hero-sub')).toContainText('Tedd Arnold', { timeout: 15000 })
    await expect(page.locator('.rm-hero-sub')).toContainText('合理使用')
    const crumb = page.locator('.breadcrumb')
    await expect(crumb).toBeVisible()
    await expect(crumb).toContainText('🏠')
    await expect(crumb).toContainText('Fly Guy 绘本')
    await expect(page.locator('.sl-series-tab')).toHaveCount(0)
  })

  test('22 本书，原文书按章拆课', async ({ page }) => {
    await page.goto(FG)
    await expect(page.locator('.rm-unit')).toHaveCount(BOOK_COUNT, { timeout: 15000 })
    // 书 1（Hi! Fly Guy）有 3 章
    await expect(page.locator('[data-testid^="rm-lesson-fg-1-"]')).toHaveCount(3)
    // 书 1 是「绘本原文」课
    await expect(page.locator('.rm-unit[data-unit="1"] .rm-lesson-zh').first()).toContainText(
      '绘本原文',
    )
    // 目录语义是一本书，不是 Starlight 的 Module N
    await expect(page.locator('.rm-unit[data-unit="1"] .rm-unit-title')).toContainText('Hi! Fly Guy')
    await expect(page.locator('.rm-unit[data-unit="1"] .rm-unit-title')).not.toContainText('Module')
  })

  test('无原文的书只有 1 节例句课（A Pet for Fly Guy = 第 13 本）', async ({ page }) => {
    await page.goto(FG)
    await expect(page.locator('[data-testid^="rm-lesson-fg-13-"]')).toHaveCount(1, {
      timeout: 15000,
    })
    await expect(page.locator('.rm-unit[data-unit="13"] .rm-lesson-zh')).toContainText('例句')
    await expect(page.locator('.rm-unit[data-unit="13"] .rm-lesson-zh')).not.toContainText('绘本原文')
  })

  test('旧闯关形态的 Tab / 测验 / 标记完成 / 搜索 / 绘本馆全部消失', async ({ page }) => {
    await page.goto(FG)
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

  test('旧的单本路由重定向回书架（书签不白屏）', async ({ page }) => {
    await page.goto('/#/flyguy/fg-1')
    await expect(page).toHaveURL(/#\/flyguy$/)
    await expect(page.locator('.reading-sheet')).toBeVisible({ timeout: 15000 })
  })
})

test.describe('Fly Guy 阅读 · 目录与阅读器', () => {
  test('展开一本书看到这一本的宝藏词，每个都可点', async ({ page }) => {
    await page.goto(FG)
    const book = await expandBook(page, 1)
    const words = book.locator('.rm-treasure-word')
    expect(await words.count()).toBeGreaterThan(0)
    await expect(book.locator('.rm-unit-treasure')).toContainText(String(await words.count()))
    await words.first().click()
    await expect(words.first()).toBeVisible()
  })

  test('点一章就地展开阅读器：真实原文按页成句、中英文标题都在', async ({ page }) => {
    await openFirst(page)
    await expect(page.locator('.reading-sent').first()).toBeVisible()
    // Hi! Fly Guy Chapter 1 = 8 页 → 8 句
    expect(await page.locator('.reading-sent').count()).toBe(8)
    await expect(page.locator('.reading-title')).toContainText('Chapter 1')
    await expect(page.locator('.reading-title-zh')).toContainText('绘本原文')
    // 不是旧的分页器
    await expect(page.getByRole('button', { name: /下一页/ })).toHaveCount(0)
  })

  test('一次只展开一篇：同一本书里点另一章会收起上一篇', async ({ page }) => {
    await openFirst(page)
    const firstTitle = await page.locator('.reading-title').textContent()

    // 书 1 在 openFirst 里已展开 —— 不能再点 summary（那会收起整本书），
    // 直接点第 2 章即可。
    await page.getByTestId('rm-lesson-fg-1-2').click()
    await expect(page.locator('.reading-zone')).toHaveCount(1)
    const secondTitle = await page.locator('.reading-title').textContent()
    expect(secondTitle).not.toBe(firstTitle)
  })

  test('点词弹层有中文，不出现「词典里还没这个词」', async ({ page }) => {
    await openFirst(page)
    // Fly Guy 的词典来自绘本语料本身，章节文本几乎全命中 —— 断言改为
    // 「点第一个词弹出中文释义」，兜底文案不出现即可。
    const word = page.locator('.reading-zone .tt-word').first()
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
