import { test, expect } from '@playwright/test'

/**
 * 针对 starlight-course 的端到端冒烟测试。
 * 应用使用 HashRouter：首页 = `/`，课程中心 = `#/courses`，主课 = `#/starlight`。
 */

test.describe('首页与导航', () => {
  test('首页正常加载，展示品牌与课程入口', async ({ page }) => {
    await page.goto('/')

    // 顶部品牌名
    await expect(page.getByText('Starlight 学习伙伴')).toBeVisible()

    // 主标题
    await expect(page.getByRole('heading', { name: '课前预习 · 课后复习' })).toBeVisible()

    // 课程入口宫格里的「Starlight 主课」入口可见（首页与课程中心共用 CourseEntries）
    await expect(page.getByText('Starlight 主课').first()).toBeVisible()

    // 底部导航存在
    await expect(page.getByRole('link', { name: /课程/ })).toBeVisible()
  })

  test('通过底部导航进入课程中心', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /课程/ }).click()
    // HashRouter：URL 变为 #/courses
    await expect(page).toHaveURL(/#\/courses$/)

    // 课程中心标题
    await expect(
      page.getByRole('heading', { name: '选一本，开始学吧' }),
    ).toBeVisible()
  })

  test('点击 Starlight 主课入口跳转到主课页', async ({ page }) => {
    await page.goto('/')

    // 首页点「Starlight 主课」
    await page.getByText('Starlight 主课').first().click()
    await expect(page).toHaveURL(/#\/starlight/)

    // 主课页至少渲染出页面标题（StarlightHome 顶部 heading）
    await expect(
      page.getByRole('heading', { name: /Starlight|预备级|单元/ }).first(),
    ).toBeVisible()
  })

  test('字母表快捷入口可达', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /字母表/ }).first().click()
    await expect(page).toHaveURL(/#\/alphabet/)
    // 字母页标题为「26 个字母」（见 AlphabetPage.tsx），而非「字母表」三字
    await expect(
      page.getByRole('heading', { name: '26 个字母' }),
    ).toBeVisible()
  })

  // 回归：字体栈若把 CJK 字体排在拉丁字体之前，U+2019（’）会按全角渲染（16px），
  // 使 "Let's" 显示成 "Let' s"。这里断言撇号宽度不是全角。
  test('英文撇号 U+2019 不占全角宽度', async ({ page }) => {
    await page.goto('/')

    const widths = await page.evaluate(() => {
      const cs = getComputedStyle(document.body)
      const s = document.createElement('span')
      s.style.cssText = `position:absolute;visibility:hidden;font:${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      document.body.appendChild(s)
      const probe = (t: string) => {
        s.textContent = t
        return s.getBoundingClientRect().width
      }
      const res = { ascii: probe("'"), typographic: probe('\u2019') }
      s.remove()
      return res
    })

    // 全角约 16px；拉丁字体约 4.6px。放宽到 12 以免不同平台字体差异导致抖动。
    expect(widths.typographic).toBeLessThan(12)
  })
})
