// 阅读区视觉实测：截「默认散文模式」和「显示中文」两张图。
// 用法：node scripts/shot-reading.mjs
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const LESSON = 'http://localhost:5173/#/preview/hello/1'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 460, height: 1000 }, deviceScaleFactor: 2 })

await page.goto(LESSON, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

// 打开「阅读」Tab
const tab = page.locator('.tab-bar').getByRole('button', { name: /阅读/ })
await tab.click()
await page.waitForTimeout(700)

mkdirSync('.cache', { recursive: true })
await page.screenshot({ path: '.cache/reading-prose.png', fullPage: true })

// 打开中文对照 → 逐句双语模式
await page.getByTestId('reading-zh-toggle').click()
await page.waitForTimeout(500)
await page.screenshot({ path: '.cache/reading-zh.png', fullPage: true })

// 关键几何契约自检（与 e2e 断言同口径）
const geo = await page.evaluate(() => {
  const sent = document.querySelector('.reading-sent')
  const row = sent.querySelector('.reading-sent-row')
  const zh = sent.querySelector('.reading-zh')
  const title = document.querySelector('.reading-title')
  const body = document.querySelector('.reading-body')
  const r = row.getBoundingClientRect()
  const z = zh.getBoundingClientRect()
  const t = title.getBoundingClientRect()
  const b = body.getBoundingClientRect()
  return {
    zhBelowEn: z.top >= r.bottom - 2,
    zhLeftDelta: Math.abs(z.left - r.left),
    sentCount: document.querySelectorAll('.reading-sent').length,
    zhCount: document.querySelectorAll('.reading-zh').length,
    sayCount: document.querySelectorAll('.reading-say').length,
    titleCenterOffset: Math.abs(t.left + t.width / 2 - (b.left + b.width / 2)),
    proseLines: new Set(
      [...document.querySelectorAll('.reading-para:first-of-type .reading-sent')].map((s) =>
        Math.round(s.getBoundingClientRect().top),
      ),
    ).size,
    proseSentences: document.querySelectorAll('.reading-para:first-of-type .reading-sent').length,
  }
})
console.log(JSON.stringify(geo, null, 2))

await browser.close()
console.log('saved .cache/reading-prose.png & .cache/reading-zh.png')
