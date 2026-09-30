import { test, expect } from '@playwright/test'

/**
 * 语音诊断面板（?debug=audio）的 E2E。
 *
 * 背景：语音是三级兜底链（Kokoro → 有道 → WebSpeech），「点了没声音」时
 * 光看按钮毫无信息。这条用例守住诊断面板的两个基本承诺：
 *   1. 默认（不带参数）不渲染任何 DOM，不打扰小朋友；
 *   2. 带 ?debug=audio 时，面板给出环境快照 + 每级引擎的尝试结果。
 *
 * headless Chromium 里没有真实音频设备，有道网络音频会 failed/blocked，
 * 正好用来验证「失败也能被记录并展示」。
 */

const LESSON = '/?debug=audio#/preview/hello/1'

test.describe('语音诊断面板', () => {
  test('默认不挂载面板', async ({ page }) => {
    await page.goto('/#/preview/hello/1')
    await expect(page.getByRole('heading', { name: /Say Hello/ })).toBeVisible()
    await expect(page.getByText('🔊 语音诊断')).toHaveCount(0)
  })

  test('?debug=audio 时展示环境快照与引擎事件', async ({ page }) => {
    await page.goto(LESSON)
    const panel = page.getByText('🔊 语音诊断')
    await expect(panel).toBeVisible()

    // 环境快照：WebGPU / Kokoro / 语音包数量
    await expect(page.getByText(/WebGPU/)).toBeVisible()
    await expect(page.getByText(/语音包 en/)).toBeVisible()

    // 点一个发音按钮，面板应记录到本次请求走过的引擎
    await page.getByRole('button', { name: /^播放 / }).first().click()
    await expect(page.getByText('youdao').first()).toBeVisible({ timeout: 15000 })

    // 事件行带结果标记与耗时
    await expect(page.getByText(/失败|出声|被拦截|已取消/).first()).toBeVisible()
  })

  test('localStorage 开关同样能挂载面板', async ({ page }) => {
    await page.goto('/#/preview/hello/1')
    await page.evaluate(() => localStorage.setItem('starlight.debug.audio', '1'))
    await page.reload()
    await expect(page.getByText('🔊 语音诊断')).toBeVisible()
  })
})
