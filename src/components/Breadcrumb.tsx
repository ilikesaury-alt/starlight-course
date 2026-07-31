import { Link } from 'react-router-dom'

export type Crumb = { label: string; to?: string }

// 轻量面包屑：🏠 › 模块 › 单元。
// 最后一项为当前页（不可点），其余可点跳转，降低多层页面的迷失感。
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label="面包屑导航">
      {items.map((it, i) => {
        const isLast = i === items.length - 1
        return (
          <span className="bc-item" key={i}>
            {it.to && !isLast ? (
              <Link to={it.to} className="bc-link">{it.label}</Link>
            ) : (
              <span className={'bc-text' + (isLast ? ' bc-current' : '')}>{it.label}</span>
            )}
            {!isLast && <span className="bc-sep">›</span>}
          </span>
        )
      })}
    </nav>
  )
}
