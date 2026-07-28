import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { modules, STARLIGHT_THEME } from '@/data/starlight'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

// Starlight 主课采用暖橙模块主题色,统一由 moduleThemeVars 派生
const mcStyle = moduleThemeVars(STARLIGHT_THEME)

export default function StarlightHome() {
  const [query, setQuery] = useState('')
  const completed = useCourseStore((s) => s.completedPreviews)

  const totalLessons = useMemo(() => modules.reduce((a, m) => a + m.lessons.length, 0), [])
  const totalWords = useMemo(() => modules.reduce((a, m) => a + m.words.length, 0), [])
  const doneCount = useMemo(
    () => modules.filter((m) => completed.includes(m.slug)).length,
    [completed],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return modules
    return modules.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.titleZh.includes(q) ||
        m.words.some((w) => w.en.toLowerCase().includes(q) || w.zh.includes(q)),
    )
  }, [query])

  return (
    <div className="home" style={mcStyle}>
      <section className="hero" style={mcStyle}>
        <div className="hero-emoji">🌟</div>
        <h1 className="hero-title">Starlight 主课</h1>
        <p className="hero-sub">
          牛津 <b>Starlight Starter</b> 预备级，配合一对一菲教课使用。<br />
          共 <b>{modules.length}</b> 个单元、<b>{totalLessons}</b> 节课、<b>{totalWords}</b> 个单词，
          每单元都有预习导学、单词卡、句型对话与互动测验。
        </p>
        <div className="hero-tags">
          <span className="hero-tag">📖 预习</span>
          <span className="hero-tag">🔁 复习</span>
          <span className="hero-tag">🎯 测验</span>
          <span className="hero-tag">⭐ 得星</span>
        </div>
      </section>

      <div className="rg-progress-pill" style={mcStyle}>
        🏆 已完成 <b>{doneCount}</b> / {modules.length} 个单元预习
      </div>

      <div className="rg-search-wrap">
        <input
          className="rg-search"
          type="search"
          placeholder="🔍 搜单元名或单词，例如 hello、red、family…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <h2 className="section-title">📚 学习单元</h2>
      <div className="module-grid">
        {filtered.map((m) => {
          const done = completed.includes(m.slug)
          return (
            <Link
              key={m.id}
              to={`/preview/${m.slug}`}
              className="module-card"
              style={{ '--mc': m.color, '--mc-soft': m.colorSoft } as React.CSSProperties}
            >
              <div className="module-emoji">{m.emoji}</div>
              <div className="module-info">
                <div className="module-num">
                  Module {m.id} {done && '✅'}
                </div>
                <div className="module-title">{m.title}</div>
                <div className="module-zh">{m.titleZh}</div>
              </div>
              <div className="module-lessons-badge">{m.lessons.length} 课</div>
              <div className="module-arrow">›</div>
            </Link>
          )
        })}
        {filtered.length === 0 && <p className="rg-empty">没找到匹配的单元，换个关键词试试～</p>}
      </div>

      <details className="rg-books" style={mcStyle}>
        <summary>
          📘 关于本教材
        </summary>
        <p className="rg-books-note">
          课程依据 <b>Oxford Starlight Starter（预备级）</b> 真实教材内容构建，共 12 个单元 + 字母表，
          专为零基础幼儿 / 小学低年级设计，配合一对一菲教课使用。每节课可在「课前预习」先学一遍，
          上课更有自信；课后用「课后复习」巩固单词与听力。
        </p>
      </details>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
