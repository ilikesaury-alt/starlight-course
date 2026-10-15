import { test, expect } from '@playwright/test'
import { STARLIGHT_PASSAGE } from '../src/data/starlight-passage'
import { READING_PASSAGES } from '../src/data/reading'

/**
 * M0 拓展词 / M1+M2 跟读降级 / M3 句型框架 / M5 课文点读 / 📚 阅读短文 的 E2E。
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

/**
 * 拓展词区现在有两类来源：进课自动填充的（角标「自动」）与手动录入的（角标「拓展」）。
 * 本组用例验证的是**手动录入**路径，而进课时会先自动填 5 个词、占满上限让「➕ 加词」
 * 变灰，故先逐个删空（删空后不会自动回填，这本身也是被测行为之一）。
 */
async function clearAutoFilled(page: import('@playwright/test').Page) {
  // 自动填充在 effect 里异步发生，先等它真的落地再删（否则会误判成「没有词」而直接返回）
  await expect(page.locator('.ext-item').first()).toBeVisible({ timeout: 15000 })
  let n = await page.locator('.ext-item').count()
  while (n > 0) {
    await page.locator('.ext-item button[aria-label^="删除"]').first().click()
    await expect(page.locator('.ext-item')).toHaveCount(n - 1)
    n -= 1
  }
  await expect(page.getByText(/E 课堂拓展词（0\/5）/)).toBeVisible()
}

test.describe('E 课堂拓展词', () => {
  test('录词 → 持久化 → 删除生效', async ({ page }) => {
    await page.goto(LESSON)
    await expect(page.getByRole('heading', { name: /Say Hello/ })).toBeVisible()
    await clearAutoFilled(page)

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
    await clearAutoFilled(page)

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
    await clearAutoFilled(page)
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

test.describe('拓展词自动填充', () => {
  test('进课自动填 5 个、换一批只换自动词、手动词不被顶掉', async ({ page }) => {
    await page.goto(LESSON)
    await expect(page.getByRole('heading', { name: /Say Hello/ })).toBeVisible()

    // 自动填充：满额 5 个、角标「自动」、显示主题
    await expect(page.getByText(/E 课堂拓展词（5\/5）/)).toBeVisible()
    await expect(page.locator('.ext-item')).toHaveCount(5)
    await expect(page.locator('.ext-badge', { hasText: '自动' })).toHaveCount(5)
    await expect(page.locator('.ext-topic')).toBeVisible()
    // 满额时手动加词禁用，但「换一批」仍可用（换掉的是自动词）
    await expect(page.getByRole('button', { name: /加词/ })).toBeDisabled()
    await expect(page.getByRole('button', { name: /换一批/ })).toBeEnabled()

    const before = await page.locator('.ext-en').allTextContents()

    // 换一批：仍是 5 个自动词，但内容真的变了
    await page.getByRole('button', { name: /换一批/ }).click()
    await expect(page.locator('.ext-item')).toHaveCount(5)
    const after = await page.locator('.ext-en').allTextContents()
    expect(after).not.toEqual(before)

    // 删空后不会自动回填（轮次标记记住了「已经填过」）
    await clearAutoFilled(page)
    await page.waitForTimeout(600)
    await expect(page.locator('.ext-item')).toHaveCount(0)
  })

  test('手动词在换一批后依然保留', async ({ page }) => {
    await page.goto(LESSON)
    await expect(page.getByText(/E 课堂拓展词（5\/5）/)).toBeVisible()

    // 删到只剩 4 个位子，再手录一个（总数 5，占满上限）
    const del = page.locator('.ext-item button[aria-label^="删除"]')
    await del.first().click()
    await expect(page.locator('.ext-item')).toHaveCount(4)
    await page.getByRole('button', { name: /加词/ }).click()
    await page.getByPlaceholder('例如 broccoli').fill('broccoli')
    await page.getByRole('button', { name: '保存' }).click()
    await expect(page.locator('.ext-item', { hasText: 'broccoli' })).toBeVisible()

    // 换一批：只替换 4 个自动词，手录的 broccoli 不动
    await page.getByRole('button', { name: /换一批/ }).click()
    await expect(page.locator('.ext-item')).toHaveCount(5)
    await expect(page.locator('.ext-item', { hasText: 'broccoli' })).toBeVisible()
    await expect(page.locator('.ext-badge', { hasText: '拓展' })).toHaveCount(1)
  })
})

test.describe('Tab 栏', () => {
  test('「🗣️ 跟读」Tab 已隐藏，只剩六个标签', async ({ page }) => {
    await page.goto(LESSON)
    // 隐藏是 SHOW_SPEAK_TAB=false：只收入口，跟读相关代码与组件原样保留
    await expect(page.getByRole('button', { name: /跟读/ })).toHaveCount(0)
    await expect(page.locator('.tab-btn')).toHaveCount(6)
    // 「📖 课本原文」已拆成「🎭 外教对话」+「📖 课文」，不再三重堆叠（见 docs/lesson-detail-ui-research.md）
    for (const name of [/单词卡/, /句型/, /外教对话/, /课文/, /闯关/, /阅读/]) {
      await expect(page.getByRole('button', { name })).toBeVisible()
    }
    // 旧 Tab 名「课本原文」已不存在（已改名为「课文」，外教对话拆成独立 Tab）
    await expect(page.getByRole('button', { name: /课本原文/ })).toHaveCount(0)
  })
})

// 「🗣️ 跟读」Tab 已按需求隐藏（LessonPreview 的 SHOW_SPEAK_TAB=false），
// 这三个降级闭环用例的入口（tab 按钮）随之消失，故整组跳过。
// 恢复 Tab 时把 describe.skip 改回 describe 即可，用例本身无需改动。
// SentenceReader 自身的降级闭环仍由 src/components/SentenceReader.test.tsx 覆盖。
test.describe.skip('跟读区（降级闭环）', () => {
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
  test('扩量后：任意一课点开「句型」都有框架卡，不再出现空态', async ({ page }) => {
    // 回归：扩量前 12 个单元只挂 26 张卡（每单元挑 2 课），
    // 其余 70 课点开「🧩 句型」只有一句「这一课还没有句型框架卡。」
    for (const lesson of ['/#/preview/hello/3', '/#/preview/animals/8', '/#/preview/food/6', '/#/preview/transport/2']) {
      await page.goto(lesson)
      // 作用域限定在 tab-bar：分区卡标题栏也是按钮（如「🧩 句型框架卡」），全局匹配会歧义
      await page.locator('.tab-bar').getByRole('button', { name: /句型/ }).click()
      await expect(page.locator('.sfc-card').first()).toBeVisible()
      await expect(page.getByText('这一课还没有句型框架卡。')).toHaveCount(0)
      // 未选词时「说出整句」禁用，选词后可点（框架卡主流程仍然活着）
      const sayBtn = page.getByRole('button', { name: /说出整句/ })
      await expect(sayBtn).toBeDisabled()
      await page.locator('.sfc-opt').first().click()
      await expect(sayBtn).toBeEnabled()
    }
  })

  test('Unit4 试点课可填空并说出整句', async ({ page }) => {
    await page.goto('/#/preview/toys/1') // Unit 4 Lesson 1（My Toys）
    await expect(page.getByRole('heading', { name: /My Toys/ })).toBeVisible()
    await page.locator('.tab-bar').getByRole('button', { name: /句型/ }).click()

    await expect(page.locator('.sfc-pattern').first()).toContainText('I have a')
    // 未选词时「说出整句」禁用
    await expect(page.getByRole('button', { name: /说出整句/ })).toBeDisabled()
    // 选词后可点
    await page.locator('.sfc-opt', { hasText: 'doll' }).first().click()
    await expect(page.locator('.sfc-pattern').first()).toContainText('I have a doll')
    await expect(page.getByRole('button', { name: /说出整句/ })).toBeEnabled()
  })
})

/**
 * 🎭 外教课堂对话区：2026-10-10 从「课本原文」Tab 里拆出来独立成 Tab。
 * 原来它和「重点句型」「课文原文」挤在同一个 Tab，同一批句子被展示三遍，
 * 单 Tab 高达 12,440px（≈14 屏手机）。
 */
test.describe('🎭 外教课堂对话', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LESSON)
    await page.locator('.tab-bar').getByRole('button', { name: /外教对话/ }).click()
  })

  test('按说话人渲染对话气泡', async ({ page }) => {
    await expect(page.locator('.dialogue-bubble').first()).toBeVisible()
    await expect(page.locator('.dialogue-bubble.left').first()).toBeVisible()
    await expect(page.locator('.dialogue-bubble.right').first()).toBeVisible()
    // 1-1 共 12 轮
    await expect(page.locator('.dialogue-bubble')).toHaveCount(12)
  })

  test('中文默认收起，点开关才展开（不再常驻稀释英文）', async ({ page }) => {
    await expect(page.locator('.dialogue-zh')).toHaveCount(0)
    const toggle = page.getByTestId('dialogue-zh-toggle')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(await page.locator('.dialogue-zh').count()).toBeGreaterThan(0)

    await toggle.click()
    await expect(page.locator('.dialogue-zh')).toHaveCount(0)
  })

  test('每轮只剩一个朗读按钮（慢速改为全局开关，不再每轮两个喇叭）', async ({ page }) => {
    // 12 轮 × 1 个「朗读整句」
    await expect(page.locator('.dialogue-foot .speak-btn')).toHaveCount(12)
    // 没有任何 per-turn 慢速按钮（全局慢速开关在 PlayTools 里，是另一回事）
    await expect(page.locator('.dialogue-foot').getByRole('button', { name: /慢速/ })).toHaveCount(0)
  })
})

test.describe('课文点读', () => {
  test('点词弹释义，按记忆强度着色', async ({ page }) => {
    await page.goto(LESSON)
    await page.locator('.tab-bar').getByRole('button', { name: /课文/ }).click()

    // 试点课渲染点读气泡（作用域限定在 passage-zone，
    // 外教对话区也有 tt-word，全局匹配会点到剧本台词上）
    const words = page.locator('.passage-zone .tt-word')
    await expect(words.first()).toBeVisible()
    expect(await words.count()).toBeGreaterThan(0)

    // 点一个词 → 弹释义
    await page.locator('.passage-zone .tt-word', { hasText: 'how' }).first().click()
    await expect(page.locator('.passage-zone .tt-pop')).toBeVisible()
    await expect(page.locator('.passage-zone .tt-pop-word')).toHaveText('how')

    // 三档着色都在
    await expect(page.locator('.tt-legend .tt-word--known')).toBeVisible()
    await expect(page.locator('.tt-legend .tt-word--vague')).toBeVisible()
    await expect(page.locator('.tt-legend .tt-word--unknown')).toBeVisible()
  })

  test('扩量后非试点课也渲染点读视图', async ({ page }) => {
    // passage 已从试点 2 课扩到全部 96 课，toys/5 不再走 BookTextView 回落
    await page.goto('/#/preview/toys/5')
    await page.locator('.tab-bar').getByRole('button', { name: /课文/ }).click()
    await expect(page.locator('.passage-zone')).toBeVisible()
    await expect(page.locator('.passage-zone .tt-word').first()).toBeVisible()
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

/**
 * 📚 阅读短文区：每课一段连贯短文（点词读 + 本课词高亮 + 逐句朗读 + 中文开关）。
 *
 * 这里刻意**不验证「真的出声了」**：发声链路（云 TTS / WebSpeech）在 headless 里既不稳定
 * 也要联网，验了只会变成假绿。验的是「点了会进入朗读态、再点会停」这条 UI 契约。
 */
test.describe('📚 阅读短文区', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LESSON)
    await page.locator('.tab-bar').getByRole('button', { name: /阅读/ }).click()
  })

  test('打开后按段落渲染短文，标题中英文都在', async ({ page }) => {
    await expect(page.locator('.reading-zone')).toBeVisible()
    await expect(page.locator('.reading-para').first()).toBeVisible()
    // 8~12 句、1~3 段是数据不变量，这里只确认渲染出了真实句子而不是空壳
    expect(await page.locator('.reading-sent').count()).toBeGreaterThanOrEqual(8)
    expect(await page.locator('.reading-para').count()).toBeGreaterThanOrEqual(1)
    await expect(page.locator('.reading-title')).toBeVisible()
    await expect(page.locator('.reading-title-zh')).toBeVisible()
  })

  test('本课词有高亮标记', async ({ page }) => {
    // 1-1 的词表：hello / good / great / name / friend，短文里必然出现
    await expect(page.locator('.reading-zone .tt-word--mark').first()).toBeVisible()
    expect(await page.locator('.reading-zone .tt-word--mark').count()).toBeGreaterThanOrEqual(5)
  })

  test('点单词弹释义', async ({ page }) => {
    await page.locator('.reading-zone .tt-word', { hasText: 'hello' }).first().click()
    await expect(page.locator('.reading-zone .tt-pop')).toBeVisible()
  })

  test('中文对照默认关，开关可切换', async ({ page }) => {
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
    const btn = page.getByTestId('reading-play-all')
    await expect(btn).toHaveText(/听整篇/)

    await btn.click()
    // onStart 是同步回调，所以这一步不依赖音频真的出来
    await expect(btn).toHaveText(/停止朗读/)

    await btn.click()
    await expect(btn).toHaveText(/听整篇/)
  })

  // 2026-10-10 逐句朗读：每句右侧一个独立小喇叭，点一下只读这一句。
  // force: true 是因为上一句点击会触发 scrollIntoView，Playwright 的动作性检查
  // 会与滚动竞态；真实用户的点击不存在这个问题（el.click() 已验证）。
  test('逐句朗读：每句一个小喇叭，点一下读这句、再点一下停', async ({ page }) => {
    const sayBtns = page.locator('.reading-say')
    const sentCount = await page.locator('.reading-sent').count()
    // 句子数与喇叭数一一对应：没有「整篇一个按钮」也没有重复按钮
    await expect(sayBtns).toHaveCount(sentCount)

    // 点第 1 句 → 只有它在「播放中」
    await sayBtns.first().click()
    await expect(sayBtns.first()).toHaveAttribute('data-busy', '1')
    await expect(sayBtns.nth(1)).toHaveAttribute('data-busy', '0')

    // 再点同一句 → 停
    await sayBtns.first().click({ force: true })
    await expect(sayBtns.first()).toHaveAttribute('data-busy', '0')
  })

  test('朗读时非当前句淡化（focus dimming），停后恢复', async ({ page }) => {
    // 不朗读时全部句子不透明，孩子可以正常整篇扫读
    await expect(page.locator('.reading-zone')).not.toHaveClass(/is-playing/)

    await page.locator('.reading-say').first().click()
    await expect(page.locator('.reading-zone')).toHaveClass(/is-playing/)

    // 停掉后淡化撤销
    await page.locator('.reading-say').first().click({ force: true })
    await expect(page.locator('.reading-zone')).not.toHaveClass(/is-playing/)
  })

  // 2026-10-10：SRS 三色记忆状态默认不染色（否则一句英文被渲染成一串彩色方块，
  // 孩子看不出「这是一句话」——阅读体验烂的最大单点成因）。改成显式开关。
  test('记忆状态默认关闭，句子无彩色底；打开后才按 SRS 三色着色', async ({ page }) => {
    const firstWord = page.locator('.reading-zone .tt-word').first()
    // 默认透明底：句子读起来像一句话
    await expect(firstWord).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    await page.getByTestId('memory-toggle').click()
    // 打开后至少有一部分词被染上三色之一（1-1 首词多为「未知」灰）
    await expect(firstWord).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    // 再点关闭 → 恢复透明
    await page.getByTestId('memory-toggle').click()
    await expect(firstWord).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  })

  test('点词与整句共用同一套语速（全局慢速开关）', async ({ page }) => {
    const slowBtn = page.getByTestId('slow-toggle')
    await expect(slowBtn).toHaveAttribute('aria-pressed', 'false')
    // 慢速是全局一个开关，不是每句一个按钮
    await slowBtn.click()
    await expect(slowBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(slowBtn).toHaveText(/慢速中/)
    // 开关跨区共享：切到课文区仍是慢速中
    await page.locator('.tab-bar').getByRole('button', { name: /课文/ }).click()
    await expect(page.getByTestId('slow-toggle')).toHaveAttribute('aria-pressed', 'true')
  })

  test('切走 Tab 会卸载阅读区（朗读串行链随之断开）', async ({ page }) => {
    await page.getByTestId('reading-play-all').click()
    await page.locator('.tab-bar').getByRole('button', { name: /闯关/ }).click()
    await expect(page.locator('.reading-zone')).toHaveCount(0)
  })

  test('全 96 课都有阅读短文（覆盖度回归）', () => {
    const missing: string[] = []
    for (let u = 1; u <= 12; u++) {
      for (let l = 1; l <= 8; l++) {
        const p = READING_PASSAGES[`${u}-${l}`]
        if (!p || p.paragraphs.length === 0) missing.push(`${u}-${l}`)
      }
    }
    expect(missing).toEqual([])
  })
})
