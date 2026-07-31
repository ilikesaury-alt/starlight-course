import { test, expect } from '@playwright/test'

/**
 * 智能复习（SmartReview）与错题本（WrongBook）E2E。
 *
 * 关键交互顺序（务必遵守）：
 * - SmartReview 的「记得/忘了」按钮在翻面前 disabled；必须先点「翻面」(fc-reveal) 才能作答。
 * - 复习队列依赖 SRS：新种子词 nextReview=today 立即到期。
 *   因此真实路径是「先访问预习页 /#/preview/hello/1 触发 seed，再进 /#/smart」，
 *   这样队列稳定非空，可测完整复习闭环。
 * - 答「忘了」会自动加入错题本；错题本「掌握」按钮移除错题；「清空全部」走 window.confirm。
 * - 每个 test 在独立 storage context 中运行（Playwright 默认），互不污染。
 */

// 先去预习页播种 starlight 单词，再进入智能复习
async function seedAndOpenReview(page: import('@playwright/test').Page) {
  await page.goto('/#/preview/hello/1')
  await expect(page.getByRole('heading', { name: /Say Hello/ })).toBeVisible()
  await page.goto('/#/smart')
}

test.describe('智能复习与错题本', () => {
  test('空状态：无到期单词时显示鼓励文案', async ({ page }) => {
    // 干净 context，未播种 → 队列空
    await page.goto('/#/smart')
    await expect(page.getByText('今天没有需要复习的单词')).toBeVisible()
    await expect(page.getByRole('link', { name: /去预习/ })).toBeVisible()
  })

  test('复习闭环：翻面→记得，全部答对进入完成页', async ({ page }) => {
    await seedAndOpenReview(page)

    // 进入有卡片的分支：显示「第 X / N 张」与翻面按钮
    await expect(page.getByText(/第 1 \/ \d+ 张/)).toBeVisible()

    // 循环：翻面 → 记得，直到完成页出现
    for (let i = 0; i < 12; i++) {
      if (await page.getByText('本次复习完成').isVisible().catch(() => false)) break
      const reveal = page.getByRole('button', { name: /翻面/ })
      if (await reveal.isVisible().catch(() => false)) await reveal.click()
      const right = page.getByRole('button', { name: /记得/ })
      await expect(right).toBeEnabled()
      await right.click()
    }

    await expect(page.getByText('本次复习完成')).toBeVisible()
    await expect(page.getByText(/全部记住啦/)).toBeVisible()
    await expect(page.getByText(/答对 \d+ \/ \d+ 题/)).toBeVisible()
  })

  test('答错会进入错题本，点「掌握」可移除', async ({ page }) => {
    await seedAndOpenReview(page)
    await expect(page.getByText(/第 1 \/ \d+ 张/)).toBeVisible()

    // 第一题翻面后答「忘了」→ 立即加入错题本
    const reveal = page.getByRole('button', { name: /翻面/ })
    await reveal.click()
    await page.getByRole('button', { name: /忘了/ }).click()

    // 直接进错题本验证（不继续复习，避免该词后续被「记得」移除导致偶发）
    await page.goto('/#/wrong')
    await expect(page.getByText('把错的练对')).toBeVisible()
    const before = await page.locator('.wrong-item').count()
    expect(before).toBeGreaterThan(0)

    // 点第一条的「掌握」→ 错题减少
    await page.getByRole('button', { name: '掌握' }).first().click()
    await expect
      .poll(async () => (await page.locator('.wrong-item').count()) < before)
      .toBeTruthy()
  })

  test('错题本「清空全部」经确认后清空', async ({ page }) => {
    // 监听并自动接受原生 confirm 对话框
    page.on('dialog', (d) => d.accept())

    await seedAndOpenReview(page)
    await expect(page.getByText(/第 1 \/ \d+ 张/)).toBeVisible()

    // 第一题翻面后答「忘了」制造一条错题
    const reveal = page.getByRole('button', { name: /翻面/ })
    await reveal.click()
    await page.getByRole('button', { name: /忘了/ }).click()

    // 直接进错题本验证（不继续复习，避免该词后续被「记得」移除导致偶发）
    await page.goto('/#/wrong')
    // 等待错题本列表渲染完成，避免 count 在 SPA 渲染前偶发拿到 0
    await expect(page.getByText('把错的练对')).toBeVisible()
    const wrongCount = await page.locator('.wrong-item').count()
    expect(wrongCount).toBeGreaterThan(0)

    await page.getByRole('button', { name: /清空全部/ }).click()
    // 清空后回到空状态
    await expect(page.getByText('错题本是空的')).toBeVisible()
  })
})
