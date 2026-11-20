import { test, expect } from '@playwright/test'

/**
 * 读词训练（/read）端到端测试。
 *
 * 覆盖交付要点：
 *   R1  首页入口可见可进（新卡 .rw-home-entry，不动既有锚点）
 *   R2  两个 Tab 可切换
 *   R3  拼一拼：揭晓前**不显示**拆解（给了等于报答案，练习失效）
 *   R4  拼一拼：点「看拆解」后才出音素块，可自评进入下一词
 *   R5  快速认：闪卡 1.2s 自动翻面出中文
 *   R6  快速认：点「不认识」→ 错词进错题本（module=sightwords）
 */

const READ = '#/read'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.goto(READ)
})

test.describe('R1/R2 入口与 Tab', () => {
  test('R1 首页有读词训练卡，点击进 /read', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('a.rw-home-entry')
    await expect(card).toBeVisible()
    await expect(card).toContainText('读词训练')
    await card.click()
    await expect(page).toHaveURL(/#\/read/)
    await expect(page.getByRole('heading', { name: '读词训练' })).toBeVisible()
  })

  test('R2 两个 Tab 可切换', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /拼一拼/ })).toHaveAttribute('aria-selected', 'true')
    await page.getByRole('tab', { name: /快速认/ }).click()
    await expect(page.getByRole('tab', { name: /快速认/ })).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('.rw-groups .rw-group')).toHaveCount(3)
  })
})

test.describe('R3/R4 拼一拼的揭晓顺序', () => {
  test('R3 揭晓前只有词形，看不到拆解块', async ({ page }) => {
    await page.getByRole('button', { name: /开始拼读/ }).click()
    await expect(page.locator('.rw-word')).toBeVisible()
    await expect(page.locator('.rw-seg')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /看拆解/ })).toBeVisible()
  })

  test('R4 点看拆解后出现音素块与自评按钮', async ({ page }) => {
    await page.getByRole('button', { name: /开始拼读/ }).click()
    const word = (await page.locator('.rw-word').textContent()) ?? ''
    await page.getByRole('button', { name: /看拆解/ }).click()
    await expect(page.locator('.rw-seg').first()).toBeVisible()
    const segText = (await page.locator('.rw-seg b').allTextContents()).join('')
    // 片段拼起来必须回到原词（phonics 的核心不变量，这里从 UI 层再钉一次）
    expect(segText.toLowerCase()).toBe(word.toLowerCase())
    await expect(page.getByRole('button', { name: /我读对了/ })).toBeVisible()

    const before = await page.locator('.rw-progress-row span').textContent()
    await page.getByRole('button', { name: /我读对了/ }).click()
    const after = await page.locator('.rw-progress-row span').textContent()
    expect(after).not.toBe(before)
  })
})

test.describe('R5/R6 快速认', () => {
  test('R5 闪卡 1.2s 后自动翻面出中文和自评按钮', async ({ page }) => {
    await page.getByRole('tab', { name: /快速认/ }).click()
    await page.getByRole('button', { name: /开始快速认/ }).click()
    await expect(page.locator('.rw-flash-card')).toBeVisible()
    await expect(page.locator('.rw-flash-zh')).toHaveCount(0)
    // 限时翻面：等超过 FLASH_MS(1200ms)
    await expect(page.locator('.rw-flash-zh').first()).toBeVisible({ timeout: 4000 })
    // 精确匹配：「/认识/」会同时命中「不认识」，用完整名
    await expect(page.getByRole('button', { name: '👍 认识' })).toBeVisible()
    await expect(page.getByRole('button', { name: '🤔 不认识' })).toBeVisible()
  })

  test('R6 点「不认识」→ 错词进错题本', async ({ page }) => {
    await page.getByRole('tab', { name: /快速认/ }).click()
    await page.getByRole('button', { name: /开始快速认/ }).click()
    await expect(page.locator('.rw-flash-zh').first()).toBeVisible({ timeout: 4000 })
    const word = ((await page.locator('.rw-flash-face .rw-flash-word').textContent()) ?? '').trim()
    await page.getByRole('button', { name: /不认识/ }).click()

    const wrong = await page.evaluate(() => {
      const raw = localStorage.getItem('starlight-course') || ''
      return raw
    })
    expect(wrong.length).toBeGreaterThan(0)
    expect(wrong).toContain('sightwords')
    expect(wrong.toLowerCase()).toContain(word.toLowerCase())
  })
})
