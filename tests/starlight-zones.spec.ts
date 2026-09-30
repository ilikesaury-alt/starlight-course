import { test, expect } from '@playwright/test'
import { STARLIGHT_PASSAGE } from '../src/data/starlight-passage'

/**
 * M0 拓展词 / M1+M2 跟读降级 / M3 句型框架 / M5 课文点读 的 E2E。
 *
 * 关键前提：
 * - 跟读全程自动判定，没有「家长确认」：识别不可用只留常驻说明；权限被拒 / 听不清
 *   自动重听用完才给「跳过这句」。headless Chromium 两条分支都稳定可复现。
 * - 拓展词与 SRS 状态存在 localStorage，每个用例独立 context，互不污染。
 * - 课文点读只在试点课（1-1 / 4-1）有提取出的 passage。
 */

const LESSON = '/#/preview/hello/1' // Unit 1 Lesson 1（Say Hello）

/**
 * 在页面里装/卸一个假的 SpeechRecognition。
 * tests/** 不在任何 tsconfig project 内（`npm run check` 覆盖不到），
 * 所以这里必须自己声明 window 上的厂商前缀属性，否则类型错误会被门禁静默放过。
 * 传函数定义而非值：addInitScript 会在页面上下文里重新求值。
 */
function withStt(page: import('@playwright/test').Page, fn: () => void) {
  return page.addInitScript(`(${fn.toString()})()`)
}

test.describe('E 课堂拓展词', () => {
  test('录词 → 持久化 → 删除生效', async ({ page }) => {
    await page.goto(LESSON)
    await expect(page.getByRole('heading', { name: /Say Hello/ })).toBeVisible()

    // 初始为空
    await expect(page.getByText(/E 课堂拓展词（0）/)).toBeVisible()

    // ➕ 加词 → 录 broccoli
    await page.getByRole('button', { name: /加词/ }).click()
    await page.getByPlaceholder('例如 broccoli').fill('broccoli')
    await page.getByRole('button', { name: '保存' }).click()

    // 出现在列表里，带「拓展」角标
    await expect(page.locator('.ext-item', { hasText: 'broccoli' })).toBeVisible()
    await expect(page.locator('.ext-badge').first()).toHaveText('拓展')

    // 退出重进仍在（persist 生效）
    await page.goto('/#/starlight')
    await page.goto(LESSON)
    await expect(page.locator('.ext-item', { hasText: 'broccoli' })).toBeVisible()

    // 删除生效
    await page.getByRole('button', { name: '删除 broccoli' }).click()
    await expect(page.locator('.ext-item', { hasText: 'broccoli' })).toHaveCount(0)
  })

  test('空英文被拒绝，重复词被拒绝', async ({ page }) => {
    await page.goto(LESSON)

    // 空提交 → 报错提示
    await page.getByRole('button', { name: /加词/ }).click()
    await page.getByRole('button', { name: '保存' }).click()
    await expect(page.getByText('请先输入英文单词')).toBeVisible()
    await page.getByRole('button', { name: '取消' }).click()

    // 录入一次后，重复提交被拒
    await page.getByRole('button', { name: /加词/ }).click()
    await page.getByPlaceholder('例如 broccoli').fill('broccoli')
    await page.getByRole('button', { name: '保存' }).click()
    await page.getByRole('button', { name: /加词/ }).click()
    await page.getByPlaceholder('例如 broccoli').fill('Broccoli')
    await page.getByRole('button', { name: '保存' }).click()
    await expect(page.getByText('这一课已经加过这个单词啦')).toBeVisible()
  })

  test('录入的拓展词进入复习队列（带来源标记）', async ({ page }) => {
    await page.goto(LESSON)
    await page.getByRole('button', { name: /加词/ }).click()
    await page.getByPlaceholder('例如 broccoli').fill('broccoli')
    await page.getByRole('button', { name: '保存' }).click()

    const card = await page.evaluate(() => {
      const raw = localStorage.getItem('starlight-course')
      if (!raw) return null
      return JSON.parse(raw).state.srsCards.broccoli ?? null
    })
    expect(card).not.toBeNull()
    expect(card.source).toBe('extension')

    // 删除后卡片同步移出复习池
    await page.getByRole('button', { name: '删除 broccoli' }).click()
    const after = await page.evaluate(() => {
      const raw = localStorage.getItem('starlight-course')
      if (!raw) return null
      return JSON.parse(raw).state.srsCards.broccoli ?? null
    })
    expect(after).toBeNull()
  })
})

test.describe('跟读区（降级闭环）', () => {
  test('不支持语音识别时只给常驻说明，不假装能打分', async ({ page }) => {
    // Chromium 本身有 webkitSpeechRecognition，这里主动抹掉以稳定复现降级分支
    await withStt(page, () => {
      delete (window as unknown as Record<string, unknown>).SpeechRecognition
      delete (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    })
    await page.goto(LESSON)
    await page.getByRole('button', { name: /跟读/ }).click()

    await expect(page.locator('.sr-sentence')).toBeVisible()
    await expect(page.getByText(/不支持语音识别/)).toBeVisible()

    // 没有任何「替孩子判对」的出口：无家长确认、无跳过、无结果面板
    await expect(page.getByRole('button', { name: /家长确认/ })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /跳过这句/ })).toHaveCount(0)
    await expect(page.locator('.sr-result')).toHaveCount(0)
  })

  test('识别权限被拒 → 给提示 + 跳过这句，不崩溃也不找家长', async ({ page }) => {
    // 模拟存在识别 API 但一启动就报 not-allowed（权限拒绝）
    await withStt(page, () => {
      class Denied {
        lang = ''
        continuous = false
        interimResults = false
        maxAlternatives = 3
        onresult: ((e: unknown) => void) | null = null
        onend: (() => void) | null = null
        onerror: ((e: unknown) => void) | null = null
        start() {
          setTimeout(() => this.onerror?.({ error: 'not-allowed' }), 0)
        }
        stop() {}
        abort() {}
      }
      const w = window as unknown as Record<string, unknown>
      w.SpeechRecognition = Denied
      w.webkitSpeechRecognition = Denied
    })
    await page.goto(LESSON)
    await page.getByRole('button', { name: /跟读/ }).click()
    await page.getByRole('button', { name: /我来读/ }).click()

    // 录音阶段横幅先出现（开麦要等示范播完，兜底上限 6s）
    await expect(page.locator('.sr-stage-text')).toHaveText(/先听一遍示范/)
    // 终态提示：不找家长，重试指向麦克风按钮，另有「跳过这句」
    await expect(page.getByText(/麦克风还没打开/)).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: /我来读/ })).toBeEnabled()

    await page.getByRole('button', { name: /跳过这句/ }).click()
    // 面板收起，且不假装读对
    await expect(page.getByRole('button', { name: /跳过这句/ })).toHaveCount(0)
    await expect(page.getByText(/太棒了/)).toHaveCount(0)
    await expect(page.locator('.sr-result')).toHaveCount(0)
  })

  test('可逐句切换', async ({ page }) => {
    await page.goto(LESSON)
    await page.getByRole('button', { name: /跟读/ }).click()
    const first = await page.locator('.sr-sentence').textContent()
    await page.getByRole('button', { name: /下一句/ }).click()
    await expect(page.locator('.sr-sentence')).not.toHaveText(first ?? '')
  })
})

test.describe('句型框架区', () => {
  test('Unit4 试点课可填空并说出整句', async ({ page }) => {
    await page.goto('/#/preview/toys/1') // Unit 4 Lesson 1（My Toys）
    await expect(page.getByRole('heading', { name: /My Toys/ })).toBeVisible()
    await page.getByRole('button', { name: /句型/ }).click()

    await expect(page.locator('.sfc-pattern').first()).toContainText('I have a')
    // 未选词时「说出整句」禁用
    await expect(page.getByRole('button', { name: /说出整句/ })).toBeDisabled()
    // 选词后可点
    await page.locator('.sfc-opt', { hasText: 'doll' }).first().click()
    await expect(page.locator('.sfc-pattern').first()).toContainText('I have a doll')
    await expect(page.getByRole('button', { name: /说出整句/ })).toBeEnabled()
  })
})

test.describe('课文点读', () => {
  test('点词弹释义，按记忆强度着色', async ({ page }) => {
    await page.goto(LESSON)
    await page.getByRole('button', { name: /课本原文/ }).click()

    // 试点课渲染 TappableText
    const words = page.locator('.tt-word')
    await expect(words.first()).toBeVisible()
    expect(await words.count()).toBeGreaterThan(0)

    // 点一个词 → 弹释义
    await page.locator('.tt-word', { hasText: 'how' }).first().click()
    await expect(page.locator('.tt-pop')).toBeVisible()
    await expect(page.locator('.tt-pop-word')).toHaveText('how')

    // 三档着色都在
    await expect(page.locator('.tt-legend .tt-word--known')).toBeVisible()
    await expect(page.locator('.tt-legend .tt-word--vague')).toBeVisible()
    await expect(page.locator('.tt-legend .tt-word--unknown')).toBeVisible()
  })

  test('扩量后非试点课也渲染点读视图', async ({ page }) => {
    // passage 已从试点 2 课扩到全部 96 课，toys/5 不再走 BookTextView 回落
    await page.goto('/#/preview/toys/5')
    await page.getByRole('button', { name: /课本原文/ }).click()
    await expect(page.locator('.passage-zone')).toBeVisible()
    await expect(page.locator('.tt-word').first()).toBeVisible()
  })

  test('全 96 课都有 passage 数据（覆盖度回归）', () => {
    // 直接在 Node 侧 import 生成的数据文件。
    // 不要写成 page.evaluate(() => import('/src/data/...'))：那是 Vite dev server 的
    // 专有 URL 路径，生产构建里不存在；且 tests/** 不在 tsconfig 内，类型错误不会被拦。
    const missing: string[] = []
    for (let u = 1; u <= 12; u++) {
      for (let l = 1; l <= 8; l++) {
        const p = STARLIGHT_PASSAGE[`${u}-${l}`]
        if (!p || p.lines.length === 0) missing.push(`${u}-${l}`)
      }
    }
    expect(missing).toEqual([])
  })
})
