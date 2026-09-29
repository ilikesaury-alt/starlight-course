// 记忆强度分档：把 SRS 盒号映射成「熟 / 模糊 / 未知」三档，用于课文点读着色。
// 独立成文件而非挂在组件上：react-refresh 要求组件文件只导出组件。

/** 盒号 → 着色档位：>=4 熟，2..3 模糊，其余未知 */
export function boxLevel(box: number | undefined): 'known' | 'vague' | 'unknown' {
  if (box == null) return 'unknown'
  if (box >= 4) return 'known'
  if (box >= 2) return 'vague'
  return 'unknown'
}
