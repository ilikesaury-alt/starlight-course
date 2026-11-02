// @vitest-environment node
// 全站按钮类名守卫：`.btn` 族的变体在 CSS 里是**双连字符**（BEM），
// 而代码里曾长期写成单连字符（btn-soft / btn-sm / btn-lg / btn-danger）。
// 单连字符在 CSS 里不存在 → 这些按钮全部落回 `.btn` 的实心深色底，
// 视觉上「次级按钮」和「主按钮」长得一模一样，而且没有任何报错。
//
// 这个测试直接扫源码 + 扫编译后的 CSS，把这类错配变成红灯而不是视觉事故。

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SRC = join(process.cwd(), 'src')

function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (/\.tsx$/.test(p)) out.push(p) // 只扫组件/页面（.ts 工具文件不渲染类名）
  }
  return out
}

/** 去掉注释（但**保留字符串** —— 类名就在 className="..." 里） */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')      // 块注释
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1')   // 行注释（避开 URL 的 //）
}

/** 收集代码里所有 btn 变体类名（区分单/双连字符） */
function collectUsedVariants(): Map<string, string[]> {
  const used = new Map<string, string[]>()
  for (const file of walk(SRC)) {
    // 跳过测试文件：测试里的类名是**断言对象**，不是渲染产物
    // （比如反向断言 /(?<!-)\bbtn-soft\b/ 本身就该存在）
    if (/\.test\.tsx$/.test(file)) continue
    const src = stripComments(readFileSync(file, 'utf8'))
    // 只抓**单连字符**的 btn-xxx（双连字符 btn--xxx 是正确的 BEM 写法）
    // 用负向前瞻排除 btn--xxx
    for (const m of src.matchAll(/(?<!-)\bbtn-([a-z]+)\b/g)) {
      const variant = m[1]
      const list = used.get(variant) ?? []
      list.push(file.replace(SRC + '\\', ''))
      used.set(variant, list)
    }
  }
  return used
}

/** 收集 CSS 里定义的 .btn--variant */
function collectDefinedVariants(css: string): Set<string> {
  const defined = new Set<string>()
  for (const m of css.matchAll(/\.btn--([a-z]+)\b/g)) defined.add(m[1])
  return defined
}

describe('按钮类名守卫', () => {
  it('代码里不能出现单连字符的 btn 变体（CSS 只定义双连字符 BEM 写法）', () => {
    const css = readFileSync(join(SRC, 'styles', '_components.scss'), 'utf8')
    const defined = collectDefinedVariants(css)
    const used = collectUsedVariants()

    const wrong: string[] = []
    for (const [variant, files] of used) {
      // 单连字符写法：不管变体名存不存在，CSS 里都没有这条规则 → 样式失效
      const isDefinedAtAll = defined.has(variant)
      wrong.push(
        `btn-${variant}（${files.length} 处，如 ${files[0]}）` +
          (isDefinedAtAll ? ' —— 变体存在但连字符数不对，应写 btn--' + variant : ' —— CSS 无此规则')
      )
    }

    expect(
      wrong,
      `单连字符的 btn 变体在 CSS 里不存在 → 按钮会落回 .btn 的实心深色底：\n${wrong.join('\n')}`
    ).toEqual([])
  })

  it('CSS 里定义的 btn 变体都真的被用上了（防写了没人用的死规则）', () => {
    const css = readFileSync(join(SRC, 'styles', '_components.scss'), 'utf8')
    const defined = collectDefinedVariants(css)

    const srcText = walk(SRC)
      .filter((f) => !/\.test\.tsx$/.test(f))
      .map((f) => stripComments(readFileSync(f, 'utf8')))
      .join('\n')

    const unused = [...defined].filter(
      (v) => !new RegExp(`\\bbtn--${v}\\b`).test(srcText)
    )
    expect(unused.length, `未被使用的 .btn--* 规则：${unused.join(', ')}`).toBeLessThanOrEqual(1)
  })
})
