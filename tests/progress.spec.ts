import { test, expect } from '@playwright/test'

/**
 * /progress 学习进度 E2E —— 系列化之后的回归闸。
 *
 * store 用 zustand persist 把进度写进 localStorage('starlight-course')，
 * lessonCompleted / completedQuizzes 以单元 slug 为键，两册混在同一张表里。
 * 回归：早期进度页把两册一起 reduce、分母却写死 96，孩子学了第一册任意一课
 * 预备级就会显示「已学 97/96 课」。这里用真实持久化数据把这条钉死。
 */

const PROGRESS = '/#/progress'

// 这个 spec 是 /progress 的**首个**访问者：Vite 冷启动要按需编译 Progress 的
// lazy chunk（实测本机 7~18s），并行跑三个用例时还会互相抢编译资源。
// 默认 30s test timeout 会在骨架屏阶段就假红，故整组放宽。
test.describe.configure({ timeout: 120_000 })

/** store 的 partialize 全字段默认值 —— 注入残缺 state 会让 hydrate 后的
 *  selector（如 getTodayDueCount 读 srsCards）拿到 undefined。 */
const EMPTY_STATE = {
  wrongWords: [],
  totalStars: 0,
  completedPreviews: [],
  completedQuizzes: [],
  lessonCompleted: {},
  completedStories: [],
  srsCards: {},
  starlightExtensions: {},
  extensionRound: {},
  reciteCheckins: {},
  chineseQuiz: {},
  eng3aRecite: {},
  eng3aQuiz: {},
  completedChinese: [],
  completedEng3a: [],
}

/** 注入一份完整持久化状态，再让页面重新水合（zustand persist version = 8） */
async function seedProgress(
  page: import('@playwright/test').Page,
  state: Record<string, unknown>,
) {
  const payload = { state: { ...EMPTY_STATE, ...state }, version: 8 }
  await page.addInitScript((s) => {
    localStorage.setItem('starlight-course', JSON.stringify(s))
  }, payload)
}

/** 等骨架屏退场、进度行渲染出来（冷启动编译窗口单独放宽） */
async function waitRows(page: import('@playwright/test').Page) {
  await expect(page.locator('.module-progress-row')).toHaveCount(6, { timeout: 45_000 })
}

test.describe('学习进度 · 两册分开统计', () => {
  test('进度页列出预备级与第一册两行，空数据都是 0/96', async ({ page }) => {
    await seedProgress(page, {})
    await page.goto(PROGRESS)
    await waitRows(page)

    const rows = page.locator('.module-progress-row')
    const starter = rows.filter({ hasText: '预备级' })
    const book1 = rows.filter({ hasText: '第一册' })
    await expect(starter).toHaveCount(1)
    await expect(book1).toHaveCount(1)
    await expect(starter.locator('.mp-status')).toContainText('0/96')
    await expect(book1.locator('.mp-status')).toContainText('0/96')
  })

  test('回归：只学第一册的课，预备级不会显示 N>96、进度条不溢出', async ({ page }) => {
    await seedProgress(page, {
      lessonCompleted: {
        'monty-the-artist': [1, 2, 3],
        'lola-the-pirate': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      },
      completedQuizzes: ['monty-the-artist', 'lola-the-pirate'],
    })
    await page.goto(PROGRESS)
    await waitRows(page)

    const rows = page.locator('.module-progress-row')
    const starter = rows.filter({ hasText: '预备级' })
    const book1 = rows.filter({ hasText: '第一册' })

    // 预备级纹丝不动 —— 这正是原来会显示「已学 16/96」→ 溢出/串账的地方
    await expect(starter.locator('.mp-status')).toContainText('0/96')
    await expect(starter.locator('.mp-status')).not.toContainText('已闯关')
    // 第一册 3 + 13 = 16 课、2 关
    await expect(book1.locator('.mp-status')).toContainText('16/96')
    await expect(book1.locator('.mp-status')).toContainText('已闯关 2 关')

    // 进度条宽度都在容器内（旧实现两册合并后也不会溢出，但这里两行都要守住）
    for (const r of [starter, book1]) {
      const pct = await r.locator('.mp-bar-fill').evaluate((el) => parseFloat((el as HTMLElement).style.width))
      expect(pct).toBeGreaterThanOrEqual(0)
      expect(pct).toBeLessThanOrEqual(100)
    }
  })

  test('两册都学时各算各的，链接指到各自的目录页', async ({ page }) => {
    await seedProgress(page, {
      lessonCompleted: { hello: [1, 2, 3], 'monty-the-clown': [1, 2] },
      completedQuizzes: ['hello'],
    })
    await page.goto(PROGRESS)
    await waitRows(page)

    const starter = page.locator('.module-progress-row').filter({ hasText: '预备级' })
    const book1 = page.locator('.module-progress-row').filter({ hasText: '第一册' })
    await expect(starter).toHaveCount(1, { timeout: 15000 })
    await expect(starter.locator('.mp-status')).toContainText('3/96')
    await expect(starter.locator('.mp-status')).toContainText('已闯关 1 关')
    await expect(book1.locator('.mp-status')).toContainText('2/96')

    await expect(starter).toHaveAttribute('href', /#\/starlight$/)
    await expect(book1).toHaveAttribute('href', /#\/starlight1$/)

    // 点第一册那行真的能进第一册目录
    await book1.click()
    await expect(page).toHaveURL(/#\/starlight1$/, { timeout: 30_000 })
    await expect(page.locator('.module-card')).toHaveCount(9, { timeout: 45_000 })
  })
})
