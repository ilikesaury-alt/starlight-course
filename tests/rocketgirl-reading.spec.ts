/**
 * Rocket Girl 并入阅读模块 —— E2E 回归。
 *
 * 契约：
 *  ① 首页有跨系列入口，点了能到 Rocket Girl；
 *  ② 关卡页「例句」Tab 渲染的是阅读模块那套 ReadingZone；
 *  ③ 点词弹层有中文（家长报的「单词不在字典中」）；
 *  ④ 中文开关 / 逐句朗读按钮 / 分页都在；
 *  ⑤ 切 Tab 后阅读器卸载，不在别的 Tab 里继续念；
 *  ⑥ /reading 的系列切换条仍恰好 2 项（并入不能破坏旧契约）。
 */

import { test, expect } from '@playwright/test'

const RG_STORY = '/#/rocketgirl/rg-1'

test.describe('Rocket Girl · 例句阅读', () => {
  test('首页跨系列入口可达，进到关卡页', async ({ page }) => {
    await page.goto('/')
    const entry = page.locator('.rg-reading-entry')
    await expect(entry).toBeVisible({ timeout: 15000 })
    await expect(entry).toContainText('Rocket Girl')
    await expect(entry).toHaveAttribute('href', /#\/rocketgirl$/)
    await entry.click()
    await expect(page).toHaveURL(/#\/rocketgirl$/)
  })

  test('例句 Tab 复用 ReadingZone，不是旧的逐词 span 列表', async ({ page }) => {
    await page.goto(RG_STORY)
    await page.locator('.tab-btn', { hasText: '例句' }).click()

    await expect(page.locator('.reading-zone')).toBeVisible({ timeout: 15000 })
    expect(await page.locator('.reading-sent').count()).toBeGreaterThan(0)
    // 每页 ≤10 句（防云 TTS 长文本超时）
    expect(await page.locator('.reading-sent').count()).toBeLessThanOrEqual(10)
    // 旧的例句卡片列表不再出现
    await expect(page.locator('.sent-card')).toHaveCount(0)

    await expect(page.getByTestId('reading-play-all')).toBeVisible()
    await expect(page.getByTestId('reading-zh-toggle')).toBeVisible()
  })

  test('点词弹层有中文，不出现「词典里还没这个词」', async ({ page }) => {
    await page.goto(RG_STORY)
    await page.locator('.tab-btn', { hasText: '例句' }).click()
    await expect(page.locator('.reading-zone')).toBeVisible({ timeout: 15000 })

    // 刻意挑一个「词级查不到」的词（title 退化成「点击听发音」）：
    // 这正是家长报的场景，必须靠整句中文兜住，不能出现「词典里还没这个词」。
    const word = page.locator('.tt-word[title="点击听发音"]').first()
    await expect(word).toBeVisible()
    await word.click()
    const pop = page.locator('.tt-pop')
    await expect(pop).toBeVisible()
    await expect(pop.locator('.tt-pop-zh')).not.toContainText('词典里还没这个词')
    await expect(pop.locator('.tt-pop-zh')).not.toBeEmpty()
  })

  test('显示中文后译文排在英文下方；切 Tab 后阅读器卸载', async ({ page }) => {
    await page.goto(RG_STORY)
    await page.locator('.tab-btn', { hasText: '例句' }).click()
    await expect(page.locator('.reading-zone')).toBeVisible({ timeout: 15000 })

    await page.getByTestId('reading-zh-toggle').click()
    await expect(page.locator('.reading-zone.is-zh')).toBeVisible()
    expect(await page.locator('.reading-zh').count()).toBeGreaterThan(0)

    await page.locator('.tab-btn', { hasText: '单词卡' }).click()
    await expect(page.locator('.reading-zone')).toHaveCount(0)
  })

  test('例句分页可翻页，翻页后仍只有一个阅读器', async ({ page }) => {
    await page.goto(RG_STORY)
    await page.locator('.tab-btn', { hasText: '例句' }).click()
    await expect(page.locator('.reading-zone')).toBeVisible({ timeout: 15000 })

    const next = page.getByRole('button', { name: /下一页/ })
    if (await next.isEnabled()) {
      await next.click()
      await expect(page.locator('.reading-zone')).toHaveCount(1)
      await expect(page.locator('.rg-page-num')).toContainText('第 2 /')
    }
  })

  test('108 关通关能力没丢：标记本关完成按钮仍在', async ({ page }) => {
    await page.goto(RG_STORY)
    await expect(page.getByRole('button', { name: /标记本关完成|本关已完成/ })).toBeVisible()
    await expect(page.locator('.tab-btn')).toHaveCount(3)
  })

  test('并入不破坏 /reading 的系列切换条（仍恰好 2 项）', async ({ page }) => {
    await page.goto('/#/reading')
    const tabs = page.locator('.sl-series-tab')
    await expect(tabs).toHaveCount(2, { timeout: 15000 })
    await expect(tabs.nth(0)).toHaveAttribute('href', /reading$/)
    await expect(tabs.nth(1)).toHaveAttribute('href', /reading1$/)
  })
})
