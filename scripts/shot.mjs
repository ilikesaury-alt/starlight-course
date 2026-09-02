// 通用 UI 截图工具（开发期本地使用，不进构建产物）
// 用法: node scripts/shot.mjs <url> <css选择器> <输出文件> [视口宽] [视口高]
// 例:   node scripts/shot.mjs "http://localhost:4173/#/eng3a/u1/u1-1" ".en3-words" docs/shots/eng3a-words.png 430 900
import { chromium } from '@playwright/test'

const [url, selector, out, w = '430', h = '900'] = process.argv.slice(2)
if (!url || !selector || !out) {
  console.error('usage: node scripts/shot.mjs <url> <selector> <out.png> [width] [height]')
  process.exit(1)
}

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 2,
})
// headless 下无 speechSynthesis，stub 掉避免页面报错
await page.addInitScript(() => {
  window.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [] }
})
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const el = await page.$(selector)
if (!el) {
  console.error(`selector not found: ${selector}`)
  await browser.close()
  process.exit(1)
}
await el.screenshot({ path: out })
console.log(`saved -> ${out}`)
await browser.close()
