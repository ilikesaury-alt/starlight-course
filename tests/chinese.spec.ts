import { test, expect } from '@playwright/test'

/**
 * 语文课程（三年级上册·人教版 2026 版）E2E 冒烟。
 * 应用使用 HashRouter：语文首页 = `#/chinese`，单元 = `#/chinese/:unitId`，
 * 课文 = `#/chinese/:unitId/:lessonId`。
 * 覆盖本次重设计：首页单元卡、导航链路、古诗渲染、附录三表（词语/识字）、
 * 课型 kind 徽标与 hint 提示卡。
 */

test.describe('语文课程（2026 人教版重设计）', () => {
  test('语文首页加载：英雄标题 + 9 个单元卡', async ({ page }) => {
    await page.goto('/#/chinese')
    await expect(page.locator('.hero-title')).toHaveText('三年级上册语文')
    await expect(page.locator('.module-card')).toHaveCount(9)
  })

  test('导航链路：首页 → 单元 → 课文知识点', async ({ page }) => {
    await page.goto('/#/chinese')
    await page.locator('.module-card').first().click()
    await expect(page.locator('.cn-lesson-list')).toBeVisible()
    await page.locator('.cn-lesson-card').first().click()
    await expect(page.locator('.cn-knowledge')).toBeVisible()
  })

  test('古诗课渲染：诗题 + 作者朝代', async ({ page }) => {
    await page.goto('/#/chinese/u2/u2-1')
    await expect(page.locator('.cn-poem').first()).toBeVisible()
    await expect(page.locator('.cn-poem-meta').first()).toBeVisible()
  })

  test('附录 · 词语表渲染为可点读词卡 + 提示卡', async ({ page }) => {
    await page.goto('/#/chinese/appendix/a-ciyu')
    await expect(page.locator('.cn-words')).toBeVisible()
    await expect(page.locator('.cn-word').first()).toBeVisible()
    await expect(page.locator('.cn-kind-badge')).toContainText('附录')
    await expect(page.locator('.cn-hint')).toBeVisible()
  })

  test('附录 · 识字表渲染为生字卡', async ({ page }) => {
    await page.goto('/#/chinese/appendix/a-shizi')
    await expect(page.locator('.cn-hanzi-card').first()).toBeVisible()
    await expect(page.locator('.cn-kind-badge')).toContainText('附录')
  })

  test('口语交际课显示 kind 徽标', async ({ page }) => {
    await page.goto('/#/chinese/u1/u1-4')
    await expect(page.locator('.cn-kind-badge')).toContainText('口语交际')
  })
})
