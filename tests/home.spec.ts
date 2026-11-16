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

  test.describe('Starlight 册次切换', () => {
    test('默认预备级；切到第一册后主课与阅读入口一起换册', async ({ page }) => {
      await page.goto('/')
      const starter = page.locator('.sl-level-opt[data-level="starlight"]')
      const book1 = page.locator('.sl-level-opt[data-level="starlight1"]')
      await expect(starter).toHaveAttribute('aria-pressed', 'true', { timeout: 15000 })
      await expect(book1).toHaveAttribute('aria-pressed', 'false')

      const sl = page.locator('.sl-home-entry')
      const rd = page.locator('.rd-home-entry')
      await expect(sl).toHaveAttribute('href', /#\/starlight$/)
      await expect(rd).toHaveAttribute('href', /#\/reading$/)

      await book1.click()
      await expect(book1).toHaveAttribute('aria-pressed', 'true')
      await expect(sl).toHaveAttribute('href', /#\/starlight1$/)
      await expect(rd).toHaveAttribute('href', /#\/reading1$/)
      await expect(sl).toContainText('第一册')
      await expect(rd).toContainText('第一册')

      // 点阅读卡真的进第一册阅读，不是只换了文案
      await rd.click()
      await expect(page).toHaveURL(/#\/reading1$/)
    })

    test('偏好刷新后保留；第一册阅读直达链始终可进 /reading1', async ({ page }) => {
      await page.goto('/')
      const direct = page.locator('.rd1-home-entry')
      await expect(direct).toBeVisible({ timeout: 15000 })
      await expect(direct).toContainText('阅读小故事')
      await expect(direct).toHaveAttribute('href', /#\/reading1$/)

      await page.locator('.sl-level-opt[data-level="starlight1"]').click()
      // 已选第一册时主阅读卡本身就是 /reading1，直达链收起来避免重复
      await expect(page.locator('.rd-home-entry')).toHaveAttribute('href', /#\/reading1$/)

      await page.reload()
      await expect(page.locator('.sl-level-opt[data-level="starlight1"]')).toHaveAttribute(
        'aria-pressed',
        'true',
        { timeout: 15000 },
      )
      await expect(page.locator('.sl-home-entry')).toHaveAttribute('href', /#\/starlight1$/)
    })

    // 回归：原来「今日任务」两册各推一条 Starlight，又只取前 2 条 →
    // 两条 Starlight 占满，语文/英语/绘本永远轮不上。
    // 现在：只推当前册一条，且每个模块各占一行、全部可见。
    test('今日任务跟着册次走，且每个模块都露出来（不再只显示 2 条）', async ({ page }) => {
      await page.goto('/')
      const rows = page.locator('.today-row')
      const modules = page.locator('.today-row .today-module')

      // 预备级视图
      await expect(page.locator('.sl-level-opt[data-level="starlight"]')).toHaveAttribute(
        'aria-pressed',
        'true',
        { timeout: 15000 },
      )
      // 5 个模块各一行：Starlight / 语文 / 英语 / Fly Guy / Rocket Girl
      // （后两个由动态 import 补齐，故给宽超时）
      await expect(rows).toHaveCount(5, { timeout: 15000 })
      // ⚠️ 用精确文本匹配：hasText 是子串匹配，'Starlight' 会连 'Starlight 1' 一起命中
      await expect(modules.filter({ hasText: /^Starlight ·/ })).toHaveCount(1)
      await expect(modules.filter({ hasText: /^Starlight 1 ·/ })).toHaveCount(0)
      for (const name of ['语文', '英语', 'Fly Guy', 'Rocket Girl']) {
        await expect(modules.filter({ hasText: name })).toHaveCount(1)
      }

      // 切到第一册：任务当场换册，不用刷新；行数不变（仍是一册一条）
      await page.locator('.sl-level-opt[data-level="starlight1"]').click()
      await expect(modules.filter({ hasText: /^Starlight 1 ·/ })).toHaveCount(1, {
        timeout: 15000,
      })
      await expect(modules.filter({ hasText: /^Starlight ·/ })).toHaveCount(0)
      await expect(rows).toHaveCount(5)

      // 第一册那条真的链到第一册的课，不是预备级的
      const book1Row = page.locator('.today-row', { hasText: 'Starlight 1' })
      await expect(book1Row).toHaveAttribute('href', /#\/preview\/monty-the-artist\/\d+$/)
    })
  })
})

test.describe('孩子 / 家长模式（C 方案：完全分开的入口）', () => {
  /**
   * 产品口径（2026-11-16 定）：默认孩子模式，家长模式从顶栏角落的小锁进入。
   * 最要紧的一条是 —— 孩子模式下破坏性操作**根本不在 DOM 里**，
   * 不是「藏起来」：藏起来的按钮仍能被 Tab 聚焦、被脚本点到。
   */
  test('默认孩子模式：看不到备份与重置，且它们不在 DOM 中', async ({ page }) => {
    await page.goto('/#/progress')

    await expect(page.locator('.app')).toHaveAttribute('data-mode', 'kid')

    // 档案卡还在（孩子看得到自己的头像和名字），但没有「改」入口
    await expect(page.locator('.profile-card')).toBeVisible()
    await expect(page.locator('.pc-edit-btn')).toHaveCount(0)

    // 破坏性操作整块不渲染
    await expect(page.locator('.backup-panel')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /重置全部数据/ })).toHaveCount(0)

    // 不只是 CSS 隐藏：HTML 里连文本都没有
    const html = await page.locator('body').innerHTML()
    expect(html).not.toContain('重置全部数据')
    expect(html).not.toContain('导出备份')
  })

  test('从角落小锁进入家长模式：备份 / 重置 / 改档案全部出现', async ({ page }) => {
    await page.goto('/#/progress')

    await page.locator('.mode-toggle').click()

    await expect(page.locator('.app')).toHaveAttribute('data-mode', 'parent')
    await expect(page.locator('.backup-panel')).toBeVisible()
    await expect(page.getByRole('button', { name: /重置全部数据/ })).toBeVisible()
    await expect(page.locator('.pc-edit-btn')).toBeVisible()

    // 开关自己也要明确表达「当前在家长模式、怎么回去」
    await expect(page.locator('.mode-toggle-text')).toHaveText('退出家长')
    await expect(page.locator('.mode-toggle')).toHaveAttribute('aria-pressed', 'true')
  })

  test('模式会被记住；切回孩子模式后破坏性操作重新消失', async ({ page }) => {
    await page.goto('/#/progress')
    await page.locator('.mode-toggle').click()
    await expect(page.locator('.app')).toHaveAttribute('data-mode', 'parent')

    // 刷新后仍是家长模式（家长做完设置不该被踢回孩子界面）
    await page.reload()
    await expect(page.locator('.app')).toHaveAttribute('data-mode', 'parent')
    await expect(page.locator('.backup-panel')).toBeVisible()

    // 切回孩子模式
    await page.locator('.mode-toggle').click()
    await expect(page.locator('.app')).toHaveAttribute('data-mode', 'kid')
    await expect(page.locator('.backup-panel')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /重置全部数据/ })).toHaveCount(0)

    // 再刷新一次，确认孩子的选择也记住了
    await page.reload()
    await expect(page.locator('.app')).toHaveAttribute('data-mode', 'kid')
  })

  test('家长模式开关在主导航之外，不挤占孩子的四个入口', async ({ page }) => {
    await page.goto('/')
    // 主导航仍是四项（首页/课程/字母/进度），家长开关不在其中
    const nav = page.locator('.app-nav')
    await expect(nav.locator('a')).toHaveCount(4)
    await expect(nav.getByRole('button')).toHaveCount(0)
    // 开关独立存在
    await expect(page.locator('.mode-toggle')).toBeVisible()
  })
})

test.describe('孩子档案', () => {
  /**
   * 档案的 e2e 契约有两面，两面都要钉：
   *  ① 未设置时首页标题保持原样（上面的用例已覆盖，别改坏它）；
   *  ② 设置后就该叫孩子的名字 —— 这是这个功能存在的理由。
   */
  test('未设置昵称时首页标题不变；设置后改写为孩子的名字', async ({ page }) => {
    await page.goto('/')

    // ① 未设置：原样
    await expect(page.getByRole('heading', { name: '课前预习 · 课后复习' })).toBeVisible()

    // ② 在进度页设置昵称与头像（改档案是家长操作，先进家长模式）
    await page.goto('/#/progress')
    await page.locator('.mode-toggle').click()
    await expect(page.locator('.profile-card')).toBeVisible()
    await page.locator('.pc-edit-btn').click()

    await page.locator('#pc-name-input').fill('小明')
    await page.locator('.pc-avatar-opt').nth(2).click()
    await page.getByRole('button', { name: '保存' }).click()

    // 就地回显，不跳页
    await expect(page.locator('.pc-name')).toHaveText('小明')
    await expect(page.locator('.pc-edit-btn')).toHaveText('改')

    // ③ 回首页：标题换成孩子的名字
    await page.goto('/')
    await expect(page.locator('.hero-title')).toContainText('小明')
    await expect(page.locator('.hero-title')).toContainText('今天学点什么')
  })

  test('刷新后昵称仍在（持久化生效）', async ({ page }) => {
    await page.goto('/#/progress')
    await page.locator('.mode-toggle').click()
    await page.locator('.pc-edit-btn').click()
    await page.locator('#pc-name-input').fill('小红')
    await page.getByRole('button', { name: '保存' }).click()

    await page.reload()

    await expect(page.locator('.pc-name')).toHaveText('小红')
  })
})
