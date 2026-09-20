import { test, expect } from '@playwright/test'

/**
 * 三年级上册英语（外研版 2024 新课标）E2E 冒烟。
 * 应用使用 HashRouter：
 *   板块首页 = `#/eng3a`
 *   单元     = `#/eng3a/:unitId`      （w0 = Welcome，u1–u6 = Unit 1–6）
 *   关卡     = `#/eng3a/:unitId/:lessonId`
 *   小剧场   = `#/eng3a/play` · `#/eng3a/play/:playId`
 *
 * 覆盖本次重设计：五关学习路径（认单词/说句子/唱起来/长知识/闯关测）、
 * 单词翻卡互动、句子连线互动、知识小卡、附录剧本角色朗读。
 */

test.describe('英语课程（外研版 2024 重设计）', () => {
  test('板块首页：标题 + 三板块导航 + 五关路径 + 7 个单元卡', async ({ page }) => {
    await page.goto('/#/eng3a')
    await expect(page.locator('.hero-title')).toHaveText('三年级上册英语')
    await expect(page.locator('.en3-board')).toHaveCount(3)
    await expect(page.locator('.en3-path-step')).toHaveCount(5)
    // Welcome + Unit 1–6
    await expect(page.locator('.module-card')).toHaveCount(7)
    await expect(page.locator('.en3-play-mini')).toHaveCount(4) // 3 出小戏 + 「全部剧本」
    await expect(page.locator('body')).toContainText('英语小剧场')
    await expect(page.locator('body')).toContainText('Welcome to school')
  })

  test('单元页：Welcome 单元铺开五关，路径条圆点一一对应', async ({ page }) => {
    await page.goto('/#/eng3a/w0')
    await expect(page.locator('.cn-lesson-card')).toHaveCount(5)
    await expect(page.locator('.en3-pathbar-dot')).toHaveCount(5)
    const body = page.locator('body')
    for (const stage of ['认单词', '说句子', '唱起来', '长知识', '闯关测']) {
      await expect(body).toContainText(stage)
    }
  })

  test('导航链路：首页 → 单元 → 认单词关的知识点', async ({ page }) => {
    await page.goto('/#/eng3a')
    await page.locator('.module-card').first().click()
    await expect(page.locator('.cn-lesson-list')).toBeVisible()
    await page.locator('.cn-lesson-card').first().click()
    await expect(page.locator('.cn-knowledge')).toBeVisible()
    await expect(page.locator('.en3-stage-banner')).toBeVisible()
  })

  test('认单词关：翻卡认读 —— 点卡翻面 / 全部翻开 / 补充词表', async ({ page }) => {
    await page.goto('/#/eng3a/w0/w0-1')
    const cards = page.locator('.en3-flip-card')
    // 首次访问该路由时 Vite 需按需编译整条模块图（含 91KB 的 eng3a 数据），
    // 冷启动可能超过默认 5s，这里给足余量。
    await expect(cards).toHaveCount(14, { timeout: 20_000 })
    await expect(page.locator('.en3-more-chip')).toHaveCount(12)

    // 单张翻面
    await cards.first().click()
    await expect(page.locator('.en3-flip-card.open')).toHaveCount(1)

    // 全部翻开 / 全部盖上
    await page.locator('.en3-flip-all').click()
    await expect(page.locator('.en3-flip-card.open')).toHaveCount(14)
    await page.locator('.en3-flip-all').click()
    await expect(page.locator('.en3-flip-card.open')).toHaveCount(0)
  })

  test('说句子关：句型对话 + 句子连线互动', async ({ page }) => {
    await page.goto('/#/eng3a/u2/u2-2')
    // 4 组配对 × 左右两列
    await expect(page.locator('.en3-match-item')).toHaveCount(8)
    // 点左侧英文应高亮选中
    await page.locator('.en3-match-col').first().locator('.en3-match-item').first().click()
    await expect(page.locator('.en3-match-item.picked')).toHaveCount(1)
  })

  test('长知识关：颜色混合知识小卡', async ({ page }) => {
    await page.goto('/#/eng3a/u3/u3-4')
    await expect(page.locator('.en3-explore-card')).toHaveCount(5)
    const body = page.locator('body')
    await expect(body).toContainText('yellow + blue = green')
    await expect(body).toContainText('red + yellow + blue = black')
  })

  test('小剧场：剧本列表 + 角色朗读筛选', async ({ page }) => {
    await page.goto('/#/eng3a/play')
    await expect(page.locator('.en3-play-card')).toHaveCount(3)
    await expect(page.locator('body')).toContainText('花木兰')

    // 进剧本：全部 + 5 个角色
    await page.locator('.en3-play-card', { hasText: '花木兰' }).click()
    await expect(page.locator('.en3-role-chip')).toHaveCount(6)
    await expect(page.locator('.en3-script-line')).toHaveCount(16)

    // 选「木兰」角色后只剩木兰的台词
    await page.locator('.en3-role-chip').filter({ hasText: 'Mulan' }).first().click()
    const mulanCount = await page.locator('.en3-script-line').count()
    expect(mulanCount).toBeGreaterThan(0)
    expect(mulanCount).toBeLessThan(16)
  })

  test('小剧场路由不与单元路由冲突（play 不会被当成单元 id）', async ({ page }) => {
    await page.goto('/#/eng3a/play')
    await expect(page.locator('.en3-play-list')).toBeVisible()
    await expect(page.locator('.hero-title, .page-title').first()).toHaveText('英语小剧场')
  })

  // 回归：HashRouter 下 `href="#units"` 会把 hash 换成 #units，路由解析成 /units
  // → 无匹配路由 → 白屏。「课文同步」必须走页面内滚动，不能改 hash。
  test('「课文同步」原地滚动到单元地图，不改 hash、不白屏', async ({ page }) => {
    await page.goto('/#/eng3a')
    const unitHeading = page.locator('#units')
    await expect(unitHeading).toBeAttached({ timeout: 20_000 })

    await page.locator('.en3-board', { hasText: '课文同步' }).click()

    // 关键断言：hash 仍然停在 #/eng3a，页面内容还在（不是白屏）
    expect(new URL(page.url()).hash).toBe('#/eng3a')
    await expect(unitHeading).toBeInViewport()
    await expect(page.locator('.module-card')).toHaveCount(7)
    await expect(page.locator('.hero-title')).toBeAttached()
  })
})

test.describe('路由兜底', () => {
  test('未知路径显示兜底页而不是白屏', async ({ page }) => {
    // 这条就是当初的真实症状：HashRouter 下点 `href="#units"` 会把 hash 换成 #units，
    // 路径变成 /units —— 不匹配任何路由，整页白屏。
    await page.goto('/#/units')
    await expect(page.locator('.en3-notfound-path')).toHaveText('/units')
    await expect(page.locator('body')).toContainText('这一页走丢了')

    await page.locator('a.back-link', { hasText: '回首页' }).click()
    await expect(page.locator('.hero-title')).toBeVisible()
  })

  test('深链 id 写错也有兜底文案（不会静默白屏）', async ({ page }) => {
    // 单段 -> 单元页接住
    await page.goto('/#/eng3a/u9')
    await expect(page.locator('body')).toContainText('没有找到这个单元')
    await expect(page.locator('a.btn', { hasText: '返回英语课程' })).toBeVisible()

    // 双段 -> 课页接住
    await page.goto('/#/eng3a/u9/u9-9')
    await expect(page.locator('body')).toContainText('没有找到这一课')
    await expect(page.locator('a.btn', { hasText: '返回英语课程' })).toBeVisible()
  })
})
