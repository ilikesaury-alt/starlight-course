import { test, expect } from '@playwright/test'

/**
 * 课程中心 / 单词卡相关 E2E。
 * 应用使用 HashRouter：Starlight 主课 = `#/starlight`，单词卡 = `#/preview/hello/1`（真实存在）。
 */

test.describe('Starlight 主课与单词卡', () => {
  test('主课页搜索可按单元名/单词过滤', async ({ page }) => {
    await page.goto('/#/starlight')

    await expect(page.getByRole('heading', { name: 'Starlight 主课' })).toBeVisible()
    // 默认渲染全部单元，含 Hello! 与 Animals
    await expect(page.getByText('Hello!').first()).toBeVisible()
    await expect(page.getByText('Animals').first()).toBeVisible()

    const search = page.getByPlaceholder(/搜单元名或单词/)
    await search.fill('hello')
    // 过滤后只保留匹配单元：Hello! 可见，Animals 消失
    await expect(page.getByText('Hello!').first()).toBeVisible()
    await expect(page.getByText('Animals')).toHaveCount(0)

    // 清空恢复全部
    await search.fill('')
    await expect(page.getByText('Animals').first()).toBeVisible()
  })

  test('单词卡：默认显示中文、可翻到下一个', async ({ page }) => {
    await page.goto('/#/preview/hello/1')

    // 第一课标题 "Say Hello · 说你好"
    await expect(page.getByRole('heading', { name: /Say Hello/ })).toBeVisible()
    // 默认显示中文（首词 hello → 你好）
    await expect(page.locator('.flashcard').getByText('你好')).toBeVisible()
    // 进度 1 / 5
    await expect(page.locator('.fc-progress')).toHaveText('1 / 5')

    // 点「下一个」翻到第二个词 good（好的）
    await page.getByRole('button', { name: /下一个/ }).click()
    await expect(page.locator('.fc-progress')).toHaveText('2 / 5')
    await expect(page.locator('.flashcard').getByText('好的')).toBeVisible()
  })

  test('课本原文 tab 可查看重点句型', async ({ page }) => {
    await page.goto('/#/preview/hello/1')

    // 三标签结构:句型在「课本原文」tab 顶部的重点句型条中
    await page.getByRole('button', { name: /课本原文/ }).click()
    // 第一课首句
    await expect(page.getByText('Hello! How are you?').first()).toBeVisible()
  })

  test('单词卡底部单词列表点击可跳转对应词', async ({ page }) => {
    await page.goto('/#/preview/hello/1')

    // 底部 word-chip 列表存在 5 个词
    await expect(page.locator('.word-list-mini .word-chip')).toHaveCount(5)
    // 点第 3 个词（索引 2 → name），进度变为 3 / 5
    await page.locator('.word-list-mini .word-chip').nth(2).click()
    await expect(page.locator('.fc-progress')).toHaveText('3 / 5')
  })
})
