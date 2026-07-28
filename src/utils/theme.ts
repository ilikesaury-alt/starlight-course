import type { CSSProperties } from 'react'

export interface ModuleTheme {
  color: string
  colorSoft: string
}

// 把单一模块主题色拓展为一整套与 --brand 家族一致的设计令牌。
// 在模块页面根节点应用后，页内所有引用 --brand* / --mc* 的颜色
// （按钮、徽标、卡片高亮、阴影光晕、tab、语音按钮等）都会随主题变化，
// 实现“模块内所有颜色都基于该模块主题色拓展”。
//
// 派生规则（现代 CSS color-mix，全平台浏览器均已支持）：
//   --brand / --mc        主色（直接取主题色）
//   --brand-2             主色 + 白，用于渐变浅端
//   --brand-soft / --mc-soft  浅色底（直接取主题柔色）
//   --brand-deep          主色 + 黑，用于浅底上的深字
//   --brand-tint          主色 + 白（更淡），用于大块浅底
//   --brand-rgb           主色的 RGB 通道，用于 rgba 光晕（阴影 / 语音脉冲）
export function moduleThemeVars(theme: ModuleTheme): CSSProperties {
  const c = theme.color
  return {
    '--brand': c,
    '--brand-2': `color-mix(in srgb, ${c} 72%, white)`,
    '--brand-soft': theme.colorSoft,
    '--brand-deep': `color-mix(in srgb, ${c} 68%, black)`,
    '--brand-tint': `color-mix(in srgb, ${c} 12%, white)`,
    '--brand-rgb': hexToRgb(c),
    '--mc': c,
    '--mc-soft': theme.colorSoft,
  } as CSSProperties
}

// #rrggbb / #rgb -> "r, g, b"，供 rgba(var(--brand-rgb), a) 使用
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}
