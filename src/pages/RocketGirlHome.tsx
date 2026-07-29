import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  rocketGirlStories,
  rocketGirlBooks,
  rocketGirlStoryCount,
  rocketGirlWordCount,
  RG_THEME,
} from '@/data/rocketgirl'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

const mcStyle = { '--mc': RG_THEME.color, '--mc-soft': RG_THEME.colorSoft } as React.CSSProperties

export default function RocketGirlHome() {
  const [query, setQuery] = useState('')
  const completed = useCourseStore((s) => s.completedStories)
  const doneCount = useMemo(
    () => rocketGirlStories.filter((s) => completed.includes(s.slug)).length,
    [completed],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rocketGirlStories
    return rocketGirlStories.filter(
      (s) => s.title.toLowerCase().includes(q) || s.words.some((w) => w.en.toLowerCase().includes(q) || w.zh.includes(q)),
    )
  }, [query])

  return (
    <div className="home" style={moduleThemeVars(RG_THEME)}>
      <section className="hero" style={mcStyle}>
        <div className="hero-emoji">🚀</div>
        <h1 className="hero-title">Rocket Girl 英语闯关</h1>
        <p className="hero-sub">
          跟着宝贝最爱的 <b>Rocket Girl</b> 动画片学英语！<br />
          每集一个故事，边看边记 <b>{rocketGirlWordCount}</b> 个单词，
          共 <b>{rocketGirlStoryCount}</b> 个关卡。
        </p>
        <div className="hero-tags">
          <span className="hero-tag">📺 看动画</span>
          <span className="hero-tag">🎴 记单词</span>
          <span className="hero-tag">🎯 闯关测</span>
          <span className="hero-tag">⭐ 得星星</span>
        </div>
      </section>

      <div className="rg-progress-pill" style={mcStyle}>
        🏆 已通关 <b>{doneCount}</b> / {rocketGirlStoryCount} 个故事
      </div>

      <div className="rg-search-wrap">
        <input
          className="rg-search"
          type="search"
          placeholder="🔍 搜故事名或单词，例如 rocket、superhero…"
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
              to={`/rocketgirl/${s.slug}`}
              className="module-card rg-card"
              style={{ '--mc': RG_THEME.color, '--mc-soft': RG_THEME.colorSoft } as React.CSSProperties}
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

      <h2 className="section-title">📖 绘本馆（本地绘本资源）</h2>
      <details className="rg-books">
        <summary style={mcStyle}>
          📚 共 {rocketGirlBooks.length} 本 Rocket Girl 连环画（点击展开）
        </summary>
        <p className="rg-books-note">
          这些是绘本 PDF 原件，存放在 <code>src/data/rocketgirl/</code>（约 435MB），
          已通过 <code>.gitignore</code> 排除、不进版本库。应用课程用的是从中提取的单词数据，
          绘本可在本地/开发环境打开阅读。
        </p>
        <div className="rg-books-grid">
          {rocketGirlBooks.map((b) => (
            <div key={b.file} className="rg-book-chip" title={b.file}>
              <span>📕</span>
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
