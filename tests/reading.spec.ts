import { test, expect, type Page } from '@playwright/test'
import { READING_PASSAGES } from '../src/data/reading'
import { modules } from '../src/data/starlight'

/**
 * 📚 阅读模块（/#/reading）E2E。
 *
 * 这批用例是从 starlight-zones.spec.ts 的「📚 阅读短文区」整段迁移过来的：
 * 阅读从「LessonPreview 的第 5 个 Tab」提升为独立模块后，入口从「点 Tab」
 * 变成「首页宫格 → 展开单元 → 点某一课」，断言的 UI 契约本身不变。
 *
 * 刻意不验证「真的出声」：发声链路（云 TTS / WebSpeech）在 headless 里既不稳定
 * 也要联网，验了只会变成假绿。这里只验证「点了进入朗读态、再点会停」这条 UI 契约。
 */

const HOME = '/#/'
const READING = '/#/reading'

/** 展开某单元的折叠容器（单元默认全收起，子元素不可点） */
async function expandUnit(page: Page, unitId: number) {
  const unit = page.locator(`.rm-unit[data-unit="${unitId}"]`)
  await unit.locator('summary').click()
  await expect(unit).toHaveAttribute('open', '')
  return unit
}

/** 首页入口 → 阅读页 → 展开单元 → 点开某课（key 形如 '1-1'） */
async function openLesson(page: Page, key: string) {
  const [unitId] = key.split('-').map(Number)
  await page.goto(READING)
  await expandUnit(page, unitId)
  await page.getByTestId(`rm-lesson-${key}`).click()
  await expect(page.locator('.reading-zone')).toHaveCount(1)
}

test.describe('阅读模块 · 入口与结构', () => {
  test('首页有「阅读小故事」入口，点了进入 /reading', async ({ page }) => {
    await page.goto(HOME)
    const entry = page.locator('.rd-home-entry')
    await expect(entry).toBeVisible()
    await expect(entry).toContainText('阅读小故事')

    await entry.click()
    await expect(page).toHaveURL(/#\/reading$/)
    await expect(page.getByRole('heading', { name: '阅读小故事' })).toBeVisible()
  })

  test('12 个单元全部列出；每个单元都是 8 课，展开 Unit 1 后可见', async ({ page }) => {
    await page.goto(READING)
    // 时光放宽：这是本文件第一个碰懒加载页的用例，CI 单 worker 下要先等
    // Vite 把 ReadingPage 的 chunk 编译完（冷启动实测 9s 量级），
    // 默认 5s 断言窗口会在机器忙时假红。断言本身不变。
    await expect(page.locator('.rm-unit')).toHaveCount(12, { timeout: 15000 })

    // 逐个单元校对课数：只验 Unit 1 会漏掉「某个单元被写成 7 课」这类错排
    for (let u = 1; u <= 12; u++) {
      await expect(page.locator(`[data-testid^="rm-lesson-${u}-"]`)).toHaveCount(8)
    }

    const unit1 = await expandUnit(page, 1)
    // Unit 1 的 8 课卡片都在这一个容器里
    await expect(unit1.locator('[data-testid^="rm-lesson-1-"]')).toHaveCount(8, { timeout: 15000 })
  })

  test('默认不预渲染任何阅读器（96 篇不一次性铺开）', async ({ page }) => {
    await page.goto(READING)
    await expect(page.locator('.reading-zone')).toHaveCount(0)
  })
})

test.describe('阅读模块 · 打开短文', () => {
  test('点课卡片就地展开短文：按段落渲染、标题中英文都在', async ({ page }) => {
    await openLesson(page, '1-1')

    await expect(page.locator('.reading-zone')).toBeVisible()
    await expect(page.locator('.reading-para').first()).toBeVisible()
    // 8~12 句、1~3 段是数据不变量，这里只确认渲染出真实句子而不是空壳
    expect(await page.locator('.reading-sent').count()).toBeGreaterThanOrEqual(8)
    expect(await page.locator('.reading-para').count()).toBeGreaterThanOrEqual(1)
    await expect(page.locator('.reading-title')).toBeVisible()
    await expect(page.locator('.reading-title-zh')).toBeVisible()
  })

  test('本课词有高亮标记', async ({ page }) => {
    await openLesson(page, '1-1')
    // 1-1 的词表：hello / good / great / name / friend，短文里必然出现
    await expect(page.locator('.reading-zone .tt-word--mark').first()).toBeVisible()
    expect(await page.locator('.reading-zone .tt-word--mark').count()).toBeGreaterThanOrEqual(5)
  })

  test('点单词弹释义', async ({ page }) => {
    await openLesson(page, '1-1')
    await page.locator('.reading-zone .tt-word', { hasText: 'hello' }).first().click()
    await expect(page.locator('.reading-zone .tt-pop')).toBeVisible()
  })

  test('一次只展开一篇：点另一课会收起上一篇', async ({ page }) => {
    await openLesson(page, '1-1')
    const firstTitle = await page.locator('.reading-title').textContent()

    await page.getByTestId('rm-lesson-1-2').click()
    await expect(page.locator('.reading-zone')).toHaveCount(1)
    const secondTitle = await page.locator('.reading-title').textContent()
    expect(secondTitle).not.toBe(firstTitle)
    expect(secondTitle).toContain('Good Morning')
  })

  test('再点同一课会收起（阅读器卸载、朗读链断开）', async ({ page }) => {
    await openLesson(page, '1-1')
    await page.getByTestId('reading-play-all').click()
    await page.getByTestId('rm-lesson-1-1').click()
    await expect(page.locator('.reading-zone')).toHaveCount(0)
  })

  // 审查抓到的 P1：折叠单元是原生 <details>，收起只隐藏子树、不卸载。
  // 若不在收起时清 openKey，朗读会继续跑，而 ⏸ 停止朗读按钮已随内容隐入折叠区，
  // 屏幕上看不到任何能停的地方。
  test('听整篇过程中收起单元 → 阅读器卸载，朗读链断开', async ({ page }) => {
    await openLesson(page, '1-1')
    await page.getByTestId('reading-play-all').click()
    await expect(page.locator('.reading-zone')).toHaveClass(/is-playing/)

    // 点单元 summary 收起
    await page.locator('.rm-unit[data-unit="1"] summary').click()
    await expect(page.locator('.rm-unit[data-unit="1"]')).not.toHaveAttribute('open', '')
    await expect(page.locator('.reading-zone')).toHaveCount(0)

    // 再展开时回到「课都没打开」的干净态，不自动接着念
    await page.locator('.rm-unit[data-unit="1"] summary').click()
    await expect(page.locator('.reading-zone')).toHaveCount(0)
  })
})

test.describe('阅读模块 · 阅读器交互', () => {
  test('中文对照默认关，开关可切换', async ({ page }) => {
    await openLesson(page, '1-1')
    const toggle = page.getByTestId('reading-zh-toggle')
    await expect(page.locator('.reading-zh')).toHaveCount(0)
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await toggle.click()
    await expect(page.locator('.reading-zh').first()).toBeVisible()
    // 逐句都有中文：句子数与译文行数一一对应
    await expect(page.locator('.reading-zh')).toHaveCount(await page.locator('.reading-sent').count())
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await toggle.click()
    await expect(page.locator('.reading-zh')).toHaveCount(0)
  })

  // 回归：.reading-sent 一度是横向 flex，导致「显示中文」时译文被排到英文右侧、
  // 和正文挤在一起。这里用几何关系钉死「中文必须在英文下方且左对齐」。
  test('显示中文时译文排在英文下方，不跟正文挤在一起', async ({ page }) => {
    await openLesson(page, '1-1')
    await page.getByTestId('reading-zh-toggle').click()

    const geo = await page.evaluate(() => {
      const sent = document.querySelector('.reading-sent')!
      const row = sent.querySelector('.reading-sent-row')!
      const zh = sent.querySelector('.reading-zh')!
      const r = row.getBoundingClientRect()
      const z = zh.getBoundingClientRect()
      return { enBottom: r.bottom, zhTop: z.top, enLeft: r.left, zhLeft: z.left }
    })

    // 译文顶部不高于英文底部（容 2px 抗锯齿/子像素误差）
    expect(geo.zhTop).toBeGreaterThanOrEqual(geo.enBottom - 2)
    // 译文与英文左对齐，不是被挤到右边
    expect(Math.abs(geo.zhLeft - geo.enLeft)).toBeLessThan(6)
  })

  test('「听整篇」进入朗读态，再点停止', async ({ page }) => {
    await openLesson(page, '1-1')
    const btn = page.getByTestId('reading-play-all')
    await expect(btn).toHaveText(/听整篇/)

    await btn.click()
    // onStart 是同步回调，所以这一步不依赖音频真的出来
    await expect(btn).toHaveText(/停止朗读/)

    await btn.click()
    await expect(btn).toHaveText(/听整篇/)
  })

  // 逐句朗读：每句右侧一个独立小喇叭，点一下只读这一句。
  // force: true 是因为上一句点击会触发 scrollIntoView，Playwright 的动作性检查
  // 会与滚动竞态；真实用户的点击不存在这个问题。
  test('逐句朗读：每句一个小喇叭，点一下读这句、再点一下停', async ({ page }) => {
    await openLesson(page, '1-1')
    const sayBtns = page.locator('.reading-say')
    const sentCount = await page.locator('.reading-sent').count()
    // 句子数与喇叭数一一对应
    await expect(sayBtns).toHaveCount(sentCount)

    await sayBtns.first().click()
    await expect(sayBtns.first()).toHaveAttribute('data-busy', '1')
    await expect(sayBtns.nth(1)).toHaveAttribute('data-busy', '0')

    await sayBtns.first().click({ force: true })
    await expect(sayBtns.first()).toHaveAttribute('data-busy', '0')
  })

  test('朗读时非当前句淡化（focus dimming），停后恢复', async ({ page }) => {    await openLesson(page, '1-1')
    await expect(page.locator('.reading-zone')).not.toHaveClass(/is-playing/)

    await page.locator('.reading-say').first().click()
    await expect(page.locator('.reading-zone')).toHaveClass(/is-playing/)

    await page.locator('.reading-say').first().click({ force: true })
    await expect(page.locator('.reading-zone')).not.toHaveClass(/is-playing/)
  })

  // 回归（审查 B #3，既有缺陷、非本模块引入，但阅读器现在只在这里用）：
  // 整篇连读中点某一句小喇叭时，旧实现靠 speakText「内部抢占」——可它实际是
  // 先同步触发上一句的 done()，链式 onEnd 立刻 playFrom(i+1) 新建会话，
  // 外层再回来把 activeEnd 覆盖成自己的 done 且 sid 已过期（guard 全失败）。
  // 结果：孩子点的那句不读，反而跳到下一句。修法 = 单击前先显式断链。
  test('整篇连读中点某一句：读的是被点的那一句（不被连读吞掉）', async ({ page }) => {
    await openLesson(page, '1-1')
    await page.getByTestId('reading-play-all').click()
    await expect(page.locator('.reading-zone')).toHaveClass(/is-playing/)

    // 选中间一句（避开连读当前句，差异才看得出来）
    const target = page.locator('.reading-say').nth(4)
    await target.click({ force: true })
    await expect(target).toHaveAttribute('data-busy', '1')

    // 只有被点的那一句在播，其它句子不能抢着报忙
    await expect(page.locator('.reading-say[data-busy="1"]')).toHaveCount(1)
  })

  // SRS 三色记忆状态默认不染色（否则一句英文被渲染成一串彩色方块），改成显式开关。
  test('记忆状态默认关闭，句子无彩色底；打开后才按 SRS 三色着色', async ({ page }) => {
    await openLesson(page, '1-1')
    const firstWord = page.locator('.reading-zone .tt-word').first()
    await expect(firstWord).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    await page.getByTestId('memory-toggle').click()
    await expect(firstWord).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    await page.getByTestId('memory-toggle').click()
    await expect(firstWord).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  })

  test('点词与整句共用同一套语速（全局慢速开关）', async ({ page }) => {
    await openLesson(page, '1-1')
    const slowBtn = page.getByTestId('slow-toggle')
    await expect(slowBtn).toHaveAttribute('aria-pressed', 'false')
    await slowBtn.click()
    await expect(slowBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(slowBtn).toHaveText(/慢速中/)
  })
})

test.describe('阅读模块 · 数据覆盖度回归', () => {
  test('全 96 课都有阅读短文', () => {
    const missing: string[] = []
    for (let u = 1; u <= 12; u++) {
      for (let l = 1; l <= 8; l++) {
        const p = READING_PASSAGES[`${u}-${l}`]
        if (!p || p.paragraphs.length === 0) missing.push(`${u}-${l}`)
      }
    }
    expect(missing).toEqual([])
  })

  test('页面上的课卡片数 = 课表课数（96），无漏排', async ({ page }) => {
    await page.goto(READING)
    const expected = modules.reduce((n, m) => n + m.lessons.length, 0)
    await expect(page.locator('[data-testid^="rm-lesson-"]')).toHaveCount(expected, { timeout: 15000 })
  })
})