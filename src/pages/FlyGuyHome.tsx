import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  flyGuyStories,
  flyGuyBooks,
  flyGuyStoryCount,
  flyGuyWordCount,
  FG_THEME,
} from '@/data/flyguy'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

const mcStyle = { '--mc': FG_THEME.color, '--mc-soft': FG_THEME.colorSoft } as React.CSSProperties

export default function FlyGuyHome() {
  const [query, setQuery] = useState('')
  const completed = useCourseStore((s) => s.completedStories)
  const doneCount = useMemo(
    () => flyGuyStories.filter((s) => completed.includes(s.slug)).length,
    [completed],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return flyGuyStories
    return flyGuyStories.filter(
      (s) => s.title.toLowerCase().includes(q) || s.words.some((w) => w.en.toLowerCase().includes(q) || w.zh.includes(q)),
    )
  }, [query])

  return (
    <div className="home" style={moduleThemeVars(FG_THEME)}>
      <section className="hero" style={mcStyle}>
        <div className="hero-emoji">🐝</div>
        <h1 className="hero-title">Fly Guy 英语闯关</h1>
        <p className="hero-sub">
          跟着小男孩 <b>Buzz</b> 和他最爱的小宠物苍蝇 <b>Fly Guy</b> 读绘本学英语！<br />
          每本一个主题，边读边记 <b>{flyGuyWordCount}</b> 个单词，
          共 <b>{flyGuyStoryCount}</b> 个故事关卡。
        </p>
        <div className="hero-tags">
          <span className="hero-tag">📖 读绘本</span>
          <span className="hero-tag">🎴 记单词</span>
          <span className="hero-tag">🎯 闯关测</span>
          <span className="hero-tag">⭐ 得星星</span>
        </div>
      </section>

      <div className="rg-progress-pill" style={mcStyle}>
        🏆 已通关 <b>{doneCount}</b> / {flyGuyStoryCount} 个故事
      </div>

      <div className="rg-search-wrap">
        <input
          className="rg-search"
          type="search"
          placeholder="🔍 搜故事名或单词，例如 fly、super、pet…"
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
              to={`/flyguy/${s.slug}`}
              className="module-card rg-card"
              style={{ '--mc': FG_THEME.color, '--mc-soft': FG_THEME.colorSoft } as React.CSSProperties}
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

      <h2 className="section-title">📖 真实书单（Fly Guy 系列）</h2>
      <details className="rg-books">
        <summary style={mcStyle}>
          📚 共 {flyGuyBooks.length} 本 Fly Guy 绘本（点击展开）
        </summary>
        <p className="rg-books-note">
          书目来自 Tedd Arnold 的《Fly Guy》原版系列（约 2005–2020 年出版，
          美国最畅销的早期分级读物之一）。绘本受版权保护，不内置在应用里；
          上面 <b>22</b> 个故事关卡全部对应这些真实书目，可在图书馆 / 书店借阅原版阅读。
        </p>
        <div className="rg-books-grid">
          {flyGuyBooks.map((b) => (
            <div key={b.title} className="rg-book-chip" title={b.title}>
              <span>🐝</span>
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
