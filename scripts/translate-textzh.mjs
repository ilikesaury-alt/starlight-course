#!/usr/bin/env node
/**
 * Starlight 课本原文 textZh 补全脚本（构建期一次性工具,不进入运行时）。
 *
 * 背景：src/data/starlight-book.ts 由 scripts_sl_build.py 从教材 PDF 生成,
 * 1872 句原文里约一半缺 textZh(整句中译),运行时退化成逐词词典拼凑,译文生硬。
 *
 * 本脚本：扫描缺 textZh 的句子 → 调 MyMemory 免费翻译 API(en→zh-CN) → 回填生成新文件。
 * 幂等可重跑：已翻译的自动跳过；API 每日匿名额度(~5000 词)用尽时优雅停止,下次再跑续填。
 *
 * 用法：node scripts/translate-textzh.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FILE = path.join(ROOT, 'src/data/starlight-book.ts')
const CONCURRENCY = 4 // 并行请求数(礼貌限速)
const TIMEOUT_MS = 12000
const MAX_LEN = 80 // 只翻译短句(教材短句),长歌词/指令行跳过,避免翻译跑偏

const src = readFileSync(FILE, 'utf8')
// 匹配单行 page 对象:{ page: N, text: '...'(, textZh: '...')? }
const ENTRY_RE = /\{ page: (\d+), text: '([^']*)'(?:, textZh: '([^']*)')? \}/g

const entries = []
for (const m of src.matchAll(ENTRY_RE)) {
  entries.push({ index: m.index, raw: m[0], page: m[1], text: m[2], zh: m[3] ?? null })
}
const missing = entries.filter((e) => !e.zh && e.text.trim().length > 0 && e.text.length <= MAX_LEN)
const have = entries.length - missing.length
console.log(`总句子 ${entries.length} | 已有译文 ${have} | 待翻译 ${missing.length}`)

function escapeTs(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ')
}

async function translateOne(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en%7Czh-CN`
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
      const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0' } })
      clearTimeout(t)
      if (!res.ok) return { text, zh: null, err: `HTTP ${res.status}` }
      const j = await res.json()
      const tr = j?.responseData?.translatedText
      if (!tr) {
        // 匿名额度用尽:MyMemory 返回 403 或 quota 提示
        const msg = (j?.responseStatus ?? '') + ' ' + (j?.responseDetails ?? '')
        return { text, zh: null, err: msg.includes('QUOTA') || j?.responseStatus === 403 ? 'QUOTA' : msg }
      }
      return { text, zh: tr, err: null }
    } catch (e) {
      if (attempt === 2) return { text, zh: null, err: String(e?.message ?? e) }
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)))
    }
  }
}

async function run() {
  const results = new Map()
  const quotaHit = { v: false }
  let qi = 0
  async function worker() {
    while (true) {
      if (quotaHit.v) return
      const i = qi++
      if (i >= missing.length) return
      const e = missing[i]
      const r = await translateOne(e.text)
      if (r.err === 'QUOTA') {
        quotaHit.v = true
        console.log(`[${i + 1}/${missing.length}] 匿名额度用尽,停止(已译 ${results.size} 句,重跑可续)`)
        return
      }
      if (r.zh) {
        results.set(e.text, r.zh)
        if (i % 20 === 0) console.log(`[${i + 1}/${missing.length}] ✓ ${e.text} -> ${r.zh}`)
      } else {
        console.log(`[${i + 1}/${missing.length}] ✗ 失败: ${e.text} (${r.err})`)
      }
      // 礼貌限速:并发 CONCURRENCY 个 worker,每个请求间隔 ~250ms
      await new Promise((r) => setTimeout(r, 250))
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  console.log(`翻译完成 ${results.size} 句,开始回填...`)
  let out = src
  let filled = 0
  // 倒序替换,避免 index 位移
  for (const e of [...entries].reverse()) {
    if (e.zh) continue
    const zh = results.get(e.text)
    if (!zh) continue
    const newRaw = e.raw.replace(/ \}$/, `, textZh: '${escapeTs(zh)}' }`)
    out = out.slice(0, e.index) + newRaw + out.slice(e.index + e.raw.length)
    filled++
  }
  writeFileSync(FILE, out, 'utf8')
  console.log(`回填完成:新增 ${filled} 句 textZh;文件已写入 ${FILE}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
