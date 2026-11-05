import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { STARLIGHT_THEME } from '@/data/starlight'
import { STARLIGHT_LEVELS, type StarlightLevel } from '@/data/starlightSeries'
import { modulesOfLevel, unitCountOfLevel } from '@/data/starlightSeriesData'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'
import LessonStarMap from '@/components/LessonStarMap'
import UnitGlyph from '@/components/UnitGlyph'
import StarlightSeriesTabs from '@/components/StarlightSeriesTabs'

// Starlight 主课采用暖橙模块主题色,统一由 moduleThemeVars 派生
const mcStyle = moduleThemeVars(STARLIGHT_THEME)

// Starlight 是一个系列：预备级(Starter)与第一册(Book 1)共用这一页，
// 差别只在「哪一册」——所以这里是同一个组件按 level 取数据，不写两套页面。
export default function StarlightHome({ level = 'starlight' }: { level?: StarlightLevel }) {
  const [query, setQuery] = useState('')
  const completed = useCourseStore((s) => s.completedPreviews)
  const meta = STARLIGHT_LEVELS[level]
  const modules = useMemo(() => modulesOfLevel(level), [level])

  const totalLessons = useMemo(() => modules.reduce((a, m) => a + m.lessons.length, 0), [modules])
  // 统一以「按课细分的完整单词」为单词全集口径(与复习系统 getWords / Progress 一致)
  const totalWords = useMemo(
    () => modules.reduce((a, m) => a + m.lessons.flatMap((l) => l.words).length, 0),
    [modules]
  )
  // 进度不在这里另算一份：课次星图是唯一的进度真源（app-screens.md §2.1 一事实一变量）

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return modules
    return modules.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.titleZh.includes(q) ||
        m.lessons.flatMap((l) => l.words).some(
          (w) => w.en.toLowerCase().includes(q) || w.zh.includes(q)
        ),
    )
  }, [query, modules])

  return (
    <div className="home starlight-sheet" style={mcStyle}>
      {/* 标题行：一个名词 h1 + 一句支撑句。不再有 hero emoji / eyebrow / 胶囊阵列 */}
      <section className="hero">
        <div className="sl-title-row">
          <div>
            <h1 className="hero-title">{meta.pageTitle}</h1>
            <p className="sl-sub">
              牛津 {meta.bookTitle} · {modules.length} 单元 / {totalLessons} 课 / {totalWords} 词 · 配合一对一菲教课
            </p>
          </div>
          <Link className="sl-action" to="/smart">今天要复习 →</Link>
        </div>
      </section>

      {/* 系列切换：换册 = 换一本书，位置固定在标题正下方 */}
      <StarlightSeriesTabs current={level} />

      {/* 课次星图：这本教材的目录本身，格子状态由完成记录派生 */}
      <LessonStarMap level={level} />

      <div className="rg-search-wrap">
        <input
          className="rg-search"
          type="search"
          placeholder="搜单元名或单词，例如 hello、red、family…"
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
              <div className="module-emoji">
                <UnitGlyph
                  unitId={m.id}
                  level={level}
                  fallback={m.emoji}
                  color={m.color}
                  soft={m.colorSoft}
                  size={26}
                />
              </div>
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
          课程依据 <b>{meta.bookTitle}</b> 真实教材内容构建，共 {unitCountOfLevel(level)} 个单元，
          专为零基础幼儿 / 小学低年级设计，配合一对一菲教课使用。每节课可在「课前预习」先学一遍，
          上课更有自信；课后用「课后复习」巩固单词与听力。
        </p>
      </details>

      <div className="sl-page-foot">
        <span className="sl-page-num">{meta.bookTitle} · {modules.length} 单元 / {totalLessons} 课</span>
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
