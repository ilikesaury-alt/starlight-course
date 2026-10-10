// 统一分区卡片：每个学习区（单词 / 句型 / 外教对话 / 课本原文 / 测验）都套一层，
// 顶部是同款标题栏（可整区收起），边界清晰、视觉统一。
// 样式走 .zone-card / .zone-card-head / .zone-card-body（见 _study.scss）。

import { useState } from 'react'

interface Props {
  /** 标题栏文案，如「🎭 外教课堂对话」 */
  title: string
  /** 标题栏右侧补充说明（收起时也会显示） */
  side?: string
  children: React.ReactNode
  /** 模块主题色变量（--mc / --mc-soft / --mc-deep） */
  mcStyle?: React.CSSProperties
  /** 附加类名，如 passage-zone（给 E2E 选择器用） */
  className?: string
  /** 内容区附加类名 */
  bodyClass?: string
  /** 是否可收起；默认 true */
  collapsible?: boolean
}

export default function ZoneCard({
  title,
  side,
  children,
  mcStyle,
  className = '',
  bodyClass = '',
  collapsible = true,
}: Props) {
  const [open, setOpen] = useState(true)
  return (
    <section className={`zone-card ${className}`.trim()} style={mcStyle}>
      {collapsible ? (
        <button type="button" className="zone-card-head" onClick={() => setOpen((v) => !v)}>
          <span className="zone-card-title">{title}</span>
          <span className="zone-card-side">{open ? '收起 ▲' : (side ? `${side} · 展开 ▼` : '展开 ▼')}</span>
        </button>
      ) : (
        <div className="zone-card-head">
          <span className="zone-card-title">{title}</span>
          {side && <span className="zone-card-side">{side}</span>}
        </div>
      )}
      {open && <div className={`zone-card-body ${bodyClass}`.trim()}>{children}</div>}
    </section>
  )
}
