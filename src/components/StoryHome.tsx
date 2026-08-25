// 故事类模块(Fly Guy / Rocket Girl)首页的共享骨架。
// 两类页面原本约 95% 逐行相同(搜索过滤、进度 pill、关卡卡片、书单折叠区),
// 差异(数据源、主题色、文案、跳转前缀、书单条目)全部通过 props 注入。

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Story } from '@/data/story-types'
import type { ModuleTheme } from '@/utils/theme'
import { moduleThemeVars } from '@/utils/theme'
import { useCourseStore } from '@/store/useCourseStore'

export interface StoryBookEntry {
  /** 列表 key / 悬浮提示 */
  key: string
  title: string
}

interface StoryHomeProps {
  theme: ModuleTheme
  heroEmoji: string
  heroTitle: string
  heroSub: React.ReactNode
  heroTags: string[]
  searchPlaceholder: string
  /** 关卡跳转前缀,如 '/flyguy' */
  basePath: string
  stories: Story[]
  booksTitle: string
  booksSummary: string
  booksNote: React.ReactNode
  bookIcon: string
  books: StoryBookEntry[]
}

export default function StoryHome({
  theme,
  heroEmoji,
  heroTitle,
  heroSub,
  heroTags,
  searchPlaceholder,
  basePath,
  stories,
  booksTitle,
  booksSummary,
  booksNote,
  bookIcon,
  books,
}: StoryHomeProps) {
  const [query, setQuery] = useState('')
  const completed = useCourseStore((s) => s.completedStories)
  const doneCount = useMemo(
    () => stories.filter((s) => completed.includes(s.slug)).length,
    [completed, stories],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return stories
    return stories.filter(
      (s) => s.title.toLowerCase().includes(q) || s.words.some((w) => w.en.toLowerCase().includes(q) || w.zh.includes(q)),
    )
  }, [query, stories])

  return (
    <div className="home" style={moduleThemeVars(theme)}>
      <section className="hero" style={moduleThemeVars(theme)}>
        <div className="hero-emoji">{heroEmoji}</div>
        <h1 className="hero-title">{heroTitle}</h1>
        <p className="hero-sub">{heroSub}</p>
        <div className="hero-tags">
          {heroTags.map((t) => (
            <span key={t} className="hero-tag">{t}</span>
          ))}
        </div>
      </section>

      <div className="rg-progress-pill" style={moduleThemeVars(theme)}>
        🏆 已通关 <b>{doneCount}</b> / {stories.length} 个故事
      </div>

      <div className="rg-search-wrap">
        <input
          className="rg-search"
          type="search"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <h2 className="section-title">📚 故事关卡</h2>
      <div className="module-grid">
        {filtered.map((s) => {
          const done = completed.includes(s.slug)
          return (
            <Link
              key={s.slug}
              to={`${basePath}/${s.slug}`}
              className="module-card rg-card"
              style={moduleThemeVars(theme)}
            >
              <div className="module-emoji">{s.emoji}</div>
              <div className="module-info">
                <div className="module-num">第 {s.id} 关</div>
                <div className="module-title rg-title">{s.title}</div>
                <div className="module-zh">{s.words.length} 个单词</div>
              </div>
              <div className="module-lessons-badge">{done ? '✓ 已学' : '去学 →'}</div>
              <div className="module-arrow">›</div>
            </Link>
          )
        })}
        {filtered.length === 0 && <p className="rg-empty">没找到匹配的故事，换个关键词试试～</p>}
      </div>

      <h2 className="section-title">{booksTitle}</h2>
      <details className="rg-books">
        <summary style={moduleThemeVars(theme)}>{booksSummary}（点击展开）</summary>
        <p className="rg-books-note">{booksNote}</p>
        <div className="rg-books-grid">
          {books.map((b) => (
            <div key={b.key} className="rg-book-chip" title={b.key}>
              <span>{bookIcon}</span>
              <span className="rg-book-title">{b.title}</span>
            </div>
          ))}
        </div>
      </details>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
