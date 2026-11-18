// 📚 绘本桥梁书馆（/books）—— 所有 IP 分级读物的统一书架入口。
//
// 为什么要有这一页：首页阅读区恒定 2 卡（教材配套 + 书馆），新增书单只加
// `bookWall.ts` 的一条数据、首页与其它代码零改动（AGENTS.md「绘本桥梁书馆」）。
//
// 本页是**纯目录**：不做 SRS、不做测验、不持久化进度。卡片只有两种：
//   · available=true  → <Link> 跳到已有阅读模块（/flyguy、/rocketgirl…）
//   · available=false → 灰态 <div>「准备中」，不可点，不误导
//
// 骨架抄 StarlightHome：搜索框 `.rg-search` + `.module-grid` 栅格 + 空态；
// 筛选 chips 复用 `.filter-chips`/`.chip` 的类名与交互形态。

import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/Breadcrumb'
import { moduleThemeVars } from '@/utils/theme'
import { BOOK_WALL_THEME } from '@/data/story-themes'
import {
  BOOK_SERIES,
  LEXILE_BANDS,
  bandOf,
  bookWallStats,
  type BookSeries,
  type LexileBand,
} from '@/data/bookWall'

type StatusFilter = 'all' | 'available' | 'preparing'

const STATUS_CHIPS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'available', label: '可以读' },
  { id: 'preparing', label: '准备中' },
]

/** 读得到的书才显示蓝思；准备中的书不显示章/集数（还没有内容） */
function metaOf(s: BookSeries): string {
  return `${s.lexileMin}–${s.lexileMax}L · ${s.grade}`
}

export default function BookWall() {
  const [query, setQuery] = useState('')
  const [band, setBand] = useState<LexileBand>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const mcStyle = moduleThemeVars(BOOK_WALL_THEME)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = BOOK_SERIES.filter((s) => {
      if (band !== 'all' && bandOf(s) !== band) return false
      if (status === 'available' && !s.available) return false
      if (status === 'preparing' && s.available) return false
      if (!q) return true
      return (
        s.titleEn.toLowerCase().includes(q) ||
        s.titleZh.includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.themes.some((t) => t.includes(q))
      )
    })
    // 可读的排最前，其余按蓝思下界从易到难 —— 排序在渲染时做，
    // 将来新加书随便插在 bookWall.ts 哪个位置都行（数据文件顺序不构成契约）。
    return matched.sort(
      (a, b) =>
        Number(b.available) - Number(a.available) || a.lexileMin - b.lexileMin,
    )
  }, [query, band, status])

  return (
    <div className="page book-wall" style={mcStyle}>
      <Breadcrumb items={[{ label: '🏠', to: '/' }, { label: '绘本桥梁书馆' }]} />

      <section className="hero bw-hero">
        <h1 className="rm-hero-title">📚 绘本桥梁书馆</h1>
        <p className="bw-sub">
          从桥梁书到初级章节书，按蓝思值从易到难排好队 —— 共 <b>{bookWallStats.total}</b> 套，
          现在 <b>{bookWallStats.available}</b> 套可以读。读完一套，再挑下一套。
        </p>
      </section>

      <div className="rg-search-wrap">
        <input
          className="rg-search"
          type="search"
          placeholder="搜书名、作者或主题，例如 侦探、女孩、magic…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="搜索书单"
        />
      </div>

      <div className="bw-filters">
        <div className="filter-chips" role="group" aria-label="按难度筛选">
          {LEXILE_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={'chip' + (band === b.id ? ' active' : '')}
              aria-pressed={band === b.id}
              onClick={() => setBand(b.id)}
              title={b.note}
            >
              {b.label} <span className="bw-chip-note">{b.note}</span>
            </button>
          ))}
        </div>
        <div className="filter-chips" role="group" aria-label="按状态筛选">
          {STATUS_CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={'chip' + (status === c.id ? ' active' : '')}
              aria-pressed={status === c.id}
              onClick={() => setStatus(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <h2 className="section-title">
        书单 <span className="bw-count">{filtered.length} 套</span>
      </h2>

      <div className="module-grid bw-grid">
        {filtered.map((s) => {
          const style = { '--mc': s.color, '--mc-soft': s.colorSoft } as CSSProperties
          const inner = (
            <>
              <span className="module-emoji" aria-hidden="true">{s.emoji}</span>
              <span className="module-info">
                <span className="bw-title-en">{s.titleEn}</span>
                <span className="module-zh">{s.titleZh} · {s.author}</span>
                <span className="bw-meta">{metaOf(s)}</span>
                <span className="bw-themes">
                  {s.themes.map((t) => <span key={t} className="bw-theme">{t}</span>)}
                </span>
              </span>
              {s.available ? (
                <span className="module-arrow" aria-hidden="true">›</span>
              ) : (
                <span className="bw-soon">准备中</span>
              )}
            </>
          )
          return s.available ? (
            <Link
              key={s.slug}
              to={s.linkTo!}
              className="module-card bw-card"
              data-testid={`bw-series-${s.slug}`}
              style={style}
            >
              {inner}
            </Link>
          ) : (
            <div
              key={s.slug}
              className="module-card bw-card bw-card--soon"
              data-testid={`bw-series-${s.slug}`}
              style={style}
              aria-disabled="true"
            >
              {inner}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="rg-empty">
            <p>🔎 没有找到这样的书，换个词或筛选试试。</p>
          </div>
        )}
      </div>

      <p className="bw-footnote">
        书单里的书大多是受版权保护的出版物。这里只做选书与入口导航，正文需要借阅原版；
        已经能读的几套，是把自有实体书按「合理使用」少量展示，不内置整本书。
      </p>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
