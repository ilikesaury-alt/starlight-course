// 故事类模块主题色（轻量常量）：与故事数据分离,
// 让 modules.ts 注册表不必为取主题色而引入大体积词表数据。

export const FG_THEME = {
  color: '#16a34a',
  colorSoft: '#dcfce7',
} as const

export const RG_THEME = {
  color: '#7c3aed',
  colorSoft: '#ede9fe',
} as const

/** 绘本桥梁书馆（/books）：琥珀橙，区别于阅读靛蓝、FG 绿、RG 紫。 */
export const BOOK_WALL_THEME = {
  color: '#d97706',
  colorSoft: '#fef3c7',
} as const
