// 教材同步类课程(语文三年级上 / 英语3A)首页的共享骨架。
// 两类页面结构逐行对应,差异(数据源、主题、文案、打卡记录字段、跳转前缀)全部由 props 注入。

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { ModuleTheme } from '@/utils/theme'
import { moduleThemeVars } from '@/utils/theme'

/** 单元最小结构(chinese.Unit 与 eng3a.Unit 的公共子集) */
export interface BookUnitLike {
  slug: string
  title: string
  titleZh?: string
  emoji: string
  theme: ModuleTheme
  lessons: { slug: string }[]
}

interface BookHomeProps {
  theme: ModuleTheme
  heroEmoji: string
  heroTitle: string
  heroSub: React.ReactNode
  heroTags: string[]
  /** 进度 pill 文案,如「已背诵打卡」/「已跟读打卡」 */
  progressLabel: string
  totalLessons: number
  sectionTitle: string
  /** 单元跳转前缀,如 '/chinese' */
  basePath: string
  units: BookUnitLike[]
  /** 打卡记录(slug -> 打卡日期戳列表),由页面按模块从 store 取出后传入 */
  checkins: Record<string, number[]>
  /** 单元卡片上的完成标记词,如「已背」/「已读」 */
  doneWord: string
  aboutNote: React.ReactNode
}

export default function BookHome({
  theme,
  heroEmoji,
  heroTitle,
  heroSub,
  heroTags,
  progressLabel,
  totalLessons,
  sectionTitle,
  basePath,
  units,
  checkins,
  doneWord,
  aboutNote,
}: BookHomeProps) {
  const checkinCount = useMemo(
    () => Object.values(checkins).reduce((a, days) => a + days.length, 0),
    [checkins],
  )

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
        🏆 {progressLabel} <b>{checkinCount}</b> 次（共 {totalLessons} 课）
      </div>

      <h2 className="section-title">{sectionTitle}</h2>
      <div className="module-grid">
        {units.map((u) => {
          const done = u.lessons.filter((l) => (checkins[l.slug]?.length ?? 0) > 0).length
          return (
            <Link
              key={u.slug}
              to={`${basePath}/${u.slug}`}
              className="module-card"
              style={moduleThemeVars(u.theme)}
            >
              <div className="module-emoji">{u.emoji}</div>
              <div className="module-info">
                <div className="module-num">
                  {u.title} {done > 0 && `· ${doneWord} ${done}`}
                </div>
                <div className="module-title">{u.titleZh ?? u.title}</div>
                <div className="module-zh">{u.lessons.length} 课</div>
              </div>
              <div className="module-arrow">›</div>
            </Link>
          )
        })}
      </div>

      <details className="rg-books" style={moduleThemeVars(theme)}>
        <summary>📘 关于本课程</summary>
        <p className="rg-books-note">{aboutNote}</p>
      </details>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
