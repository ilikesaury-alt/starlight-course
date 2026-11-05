// 12 个单元主题的 code-drawn 图形（tasteskill imagery.md §2 优先级 4 / §8）。
//
// 为什么不用 emoji：emoji 是系统字体里的通用符号，谁装都长一个样；这里是
// 「牛津 Starlight 的这一单元」，图形应该画**这个单元教的东西**——挥手的手、
// 餐盘、侧视的小巴士——而不是一个泛指的黄色星星。
//
// 图形语言（一套，不混风格）：
//   · 24×24 网格，方角无框，flat filled shapes，**只用填充色、不用描边**
//   · 主体用满色（要看得见），浅色只作细节层次
//   · 每个图形 2–3 层细节（主体 + 一个可辨认的配件）
//   · 用该单元自己的教材色（--mc 满色 + --mc-soft 浅底）
//   · 同一个颜色家族贯穿 12 张图，一眼看出是同一套
//
// 这些是「画」的，不是「剪贴画」：每个形状都对应教材里真实出现的东西。
//
// ⚠️ 本文件只导出 UnitGlyph 一个组件（react-refresh 要求组件文件只导出组件）。

import type { StarlightLevel } from '@/data/starlightSeries'

interface GlyphProps {
  /** 满色（单元主色） */
  color: string
  /** 浅底色（单元柔色），作细节层次 */
  soft: string
  /** 图形尺寸（px） */
  size?: number
  className?: string
}

type Glyph = (p: GlyphProps) => JSX.Element

/** 统一的画布：24×24。主体用满色（要看得见），浅色只作细节层次 */
function Canvas({ color, size = 24, className, children }: Omit<GlyphProps, 'soft'> & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill={color}>{children}</g>
    </svg>
  )
}

// ---- 1. Hello! 打招呼与颜色：一只挥起来的手 + 两个色点 ----
const Hello: Glyph = (p) => (
  <Canvas {...p}>
    <path d="M9 13V5.6a1.3 1.3 0 0 1 2.6 0V12" />
    <path d="M11.6 12V4.4a1.3 1.3 0 0 1 2.6 0V12" />
    <path d="M14.2 12.4V6.2a1.3 1.3 0 0 1 2.6 0V13" />
    <path d="M16.8 13.2l.9-1.6a1.3 1.3 0 0 1 2.2 1.4l-1.6 5a5 5 0 0 1-4.6 3.1h-2.6a4.4 4.4 0 0 1-4-2.6L4 13.2a1.3 1.3 0 0 1 2.3-1.1L8 15.4V13" />
    <circle cx="4.5" cy="4" r="2.2" fill={p.soft} />
    <circle cx="20" cy="7" r="1.6" fill={p.soft} opacity="0.55" />
  </Canvas>
)

// ---- 2. Animals 动物：一只侧脸的小猫 + 尾巴 ----
const Animals: Glyph = (p) => (
  <Canvas {...p}>
    <path d="M4 6.5 4.6 2l3.6 2.6A8.6 8.6 0 0 1 12 4c5 0 9 3.6 9 8s-4 8-9 8-9-3.6-9-8c0-1.9.7-3.6 1.9-5L4 6.5Z" />
    <circle cx="9" cy="11" r="1.2" fill={p.soft} />
    <circle cx="15" cy="11" r="1.2" fill={p.soft} />
    <path d="M12 14.4c1 1.2 2.2 1.2 3.2 0" stroke={p.color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M21 15c2.5.6 3.6 2.6 3 5.4" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" />
  </Canvas>
)

// ---- 3. Food & Drinks 食物与饮料：一个苹果 + 一杯（带吸管） ----
const FoodDrinks: Glyph = (p) => (
  <Canvas {...p}>
    <path d="M9.2 7.4c.5-1.6 1.8-2.4 3.6-2.4.9 0 1.5.2 1.9.6-.9 1.4-2.5 2-4.4 2" fill={p.soft} opacity="0.5" />
    <path d="M4.6 9.6h9.2c0 4.5-2.1 7.6-4.6 7.6s-4.6-3.1-4.6-7.6Z" />
    <path d="M9.2 7.6V5.6" stroke={p.color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M16.4 10.4h4.2l-.7 6.4h-2.8Z" fill={p.soft} opacity="0.8" />
    <path d="M18 10.4V7.2" stroke={p.color} strokeWidth="1.4" strokeLinecap="round" />
  </Canvas>
)

// ---- 4. Toys & Fun 玩具与乐趣：一只小熊 + 星星 ----
const Toys: Glyph = (p) => (
  <Canvas {...p}>
    <circle cx="6.2" cy="6.4" r="2.6" />
    <circle cx="17.8" cy="6.4" r="2.6" />
    <circle cx="12" cy="13" r="7" />
    <circle cx="9.4" cy="11.4" r="1.2" fill={p.soft} />
    <circle cx="14.6" cy="11.4" r="1.2" fill={p.soft} />
    <ellipse cx="12" cy="14.6" rx="1.8" ry="1.2" fill={p.soft} />
    <path d="m20.4 3 .9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9.9-2Z" fill={p.soft} />
  </Canvas>
)

// ---- 5. Opposites 反义词：两支相对的箭头 ----
const Opposites: Glyph = (p) => (
  <Canvas {...p}>
    <path d="M4 8.4h13V5l4 4.2-4 4.2v-3.4H4Z" fill={p.soft} />
    <path d="M20 15.6H7v3.4L3 14.8l4-4.2v3.4h13Z" />
    <circle cx="12" cy="12" r="1.6" fill={p.soft} />
  </Canvas>
)

// ---- 6. My Body 我的身体：一个正面的小人 ----
const MyBody: Glyph = (p) => (
  <Canvas {...p}>
    <circle cx="12" cy="5.4" r="3.2" />
    <path d="M8.2 9.6h7.6c.9 0 1.6.7 1.6 1.6v5.2c0 .9-.7 1.6-1.6 1.6h-1.8v4.4h-4V18H8.2c-.9 0-1.6-.7-1.6-1.6v-5.2c0-.9.7-1.6 1.6-1.6Z" />
    <circle cx="12" cy="14.4" r="1.6" fill={p.soft} opacity="0.55" />
    <path d="M4.4 12.6H8M16 12.6h3.6" stroke={p.color} strokeWidth="2.2" strokeLinecap="round" />
  </Canvas>
)

// ---- 7. My Home 我的家：一栋房子 + 屋顶 ----
const MyHome: Glyph = (p) => (
  <Canvas {...p}>
    <path d="M12 2.6 3 9.4v2h18v-2L12 2.6Z" fill={p.soft} />
    <path d="M5 11.4h14V21H5Z" />
    <path d="M10.4 21v-5.4h3.2V21" fill={p.soft} opacity="0.6" />
    <rect x="6.6" y="13.4" width="2.8" height="2.8" fill={p.soft} opacity="0.6" />
    <rect x="14.6" y="13.4" width="2.8" height="2.8" fill={p.soft} opacity="0.6" />
  </Canvas>
)

// ---- 8. Food Groups 食物分类：分成四格的餐盘，每格一样食物 ----
const FoodGroups: Glyph = (p) => (
  <Canvas {...p}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 2.8v18.4M2.8 12h18.4" stroke={p.color} strokeWidth="1.1" />
    {/* 左上：苹果 */}
    <circle cx="7.4" cy="7.6" r="2.5" fill={p.soft} opacity="0.9" />
    {/* 右上：面包 */}
    <ellipse cx="16.8" cy="7.6" rx="2.7" ry="1.8" fill={p.soft} opacity="0.5" />
    {/* 左下：胡萝卜 */}
    <path d="M4.8 19.2c.5-2.2 1.7-3.4 3.3-3.4 1.1 0 1.9.4 2.3 1L4.8 19.2Z" fill={p.soft} opacity="0.6" />
    {/* 右下：牛奶 */}
    <path d="M15.6 14.6h3.2v5.2h-3.2Z" fill={p.soft} opacity="0.75" />
    <path d="M15.6 13.2h3.2v1.4h-3.2Z" fill={p.soft} opacity="0.45" />
  </Canvas>
)

// ---- 9. My Day 我的一天：钟面 + 日出 ----
const MyDay: Glyph = (p) => (
  <Canvas {...p}>
    <circle cx="12" cy="13.4" r="8.4" />
    <path d="M12 8.4v5l3.4 2" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="13.4" r="1.2" fill={p.soft} />
    <path d="M3 5.6h4.4M5.2 3.4v4.4" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17.6 3.4h3.4M19.3 1.7v3.4" stroke={p.color} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
  </Canvas>
)

// ---- 10. Birthday 生日派对：蛋糕 + 蜡烛 ----
const Birthday: Glyph = (p) => (
  <Canvas {...p}>
    <path d="M5 12h14v8.4H5Z" />
    <path d="M3.6 12c0-1.4 1.2-2.4 2.4-2.4 1.3 0 2.4 1 2.4 2.4 0-1.4 1.1-2.4 2.4-2.4s2.4 1 2.4 2.4c0-1.4 1.1-2.4 2.4-2.4 1.3 0 2.4 1 2.4 2.4 0-1.4 1.1-2.4 2.4-2.4s2.4 1 2.4 2.4H3.6Z" />
    <rect x="11.2" y="6.2" width="1.6" height="4.4" fill={p.soft} />
    <path d="M12 2.4c1.2 1.3 1.2 2.4 0 3.2-1.2-1-1.2-2 0-3.2Z" fill={p.soft} />
  </Canvas>
)

// ---- 11. Places 去哪里玩：沙滩 + 太阳 + 遮阳伞 ----
const Places: Glyph = (p) => (
  <Canvas {...p}>
    <circle cx="18.6" cy="5.4" r="3.1" fill={p.soft} opacity="0.55" />
    {/* 沙地 */}
    <path d="M2.6 20.8h18.8" stroke={p.color} strokeWidth="2" strokeLinecap="round" />
    {/* 海浪 */}
    <path d="M3.6 17.4c1.3-1.4 2.7-1.4 4 0 1.3 1.4 2.7 1.4 4 0" stroke={p.color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* 遮阳伞：伞面 + 杆 */}
    <path d="M4.6 14.8c0-3.1 2.1-5.6 4.9-5.6s4.9 2.5 4.9 5.6H4.6Z" fill={p.soft} opacity="0.5" />
    <path d="M9.5 14.8v6" stroke={p.color} strokeWidth="1.6" strokeLinecap="round" />
  </Canvas>
)

// ---- 12. Transport 交通出行：侧视的小巴士 + 路线牌 ----
const Transport: Glyph = (p) => (
  <Canvas {...p}>
    <path d="M3 6.6h12.4c1.6 0 2.8 1.2 2.8 2.8v6.2H3V6.6Z" />
    <path d="M18.2 9.4h1.6c.6 0 1.2.5 1.2 1.2v5h-2.8V9.4Z" fill={p.soft} opacity="0.6" />
    <rect x="5" y="8.4" width="3.4" height="3" rx="0.6" fill={p.soft} opacity="0.55" />
    <rect x="9.8" y="8.4" width="3.4" height="3" rx="0.6" fill={p.soft} opacity="0.55" />
    <circle cx="7" cy="16.8" r="2.2" fill={p.soft} />
    <circle cx="16.4" cy="16.8" r="2.2" fill={p.soft} />
    <rect x="4.4" y="3" width="6" height="2.4" rx="1" fill={p.soft} opacity="0.45" />
  </Canvas>
)

/** 单元 id → 图形。id 与 src/data/starlight.ts 的 Module.id 一致。 */
const UNIT_GLYPHS: Record<number, Glyph> = {
  1: Hello,
  2: Animals,
  3: FoodDrinks,
  4: Toys,
  5: Opposites,
  6: MyBody,
  7: MyHome,
  8: FoodGroups,
  9: MyDay,
  10: Birthday,
  11: Places,
  12: Transport,
}

interface Props {
  /** 单元 id（src/data/starlight.ts 的 Module.id） */
  unitId: number
  /** 兜底 emoji（没有对应图形时用） */
  fallback: string
  /** 满色（单元主色） */
  color: string
  /** 浅底色（单元柔色），作细节层次 */
  soft: string
  size?: number
  className?: string
  /**
   * 所属册次。图形是按**预备级**的 12 个单元画的，而第一册的单元号同样从 1 开始，
   * 直接查表会让第一册 Unit 1 显示预备级的「挥手」—— 换一本书却看到另一本的图形。
   * 第一册暂未画图形，退回该单元自己的 emoji。
   */
  level?: StarlightLevel
}

export default function UnitGlyph({
  unitId,
  fallback,
  color,
  soft,
  size = 26,
  className,
  level = 'starlight',
}: Props) {
  const Glyph = level === 'starlight' ? UNIT_GLYPHS[unitId] : undefined
  if (!Glyph) {
    return (
      <span className={className} aria-hidden="true">
        {fallback}
      </span>
    )
  }
  return <Glyph color={color} soft={soft} size={size} className={className} />
}
