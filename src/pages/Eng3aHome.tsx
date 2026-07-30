import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { eng3aUnits, ENG3A_THEME, totalEngLessons } from '@/data/eng3a'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

const mcStyle = moduleThemeVars(ENG3A_THEME)

export default function Eng3aHome() {
  const recite = useCourseStore((s) => s.eng3aRecite)

  const reciteCount = useMemo(
    () => Object.values(recite).reduce((a, days) => a + days.length, 0),
    [recite],
  )

  return (
    <div className="home" style={mcStyle}>
      <section className="hero" style={mcStyle}>
        <div className="hero-emoji">📘</div>
        <h1 className="hero-title">三年级上册英语</h1>
        <p className="hero-sub">
          外研版（新标准 2024）课本同步，配合在校学习。<br />
          共 <b>{eng3aUnits.length}</b> 个单元、<b>{totalEngLessons}</b> 课，含
          <b>词汇</b>、<b>句型对话</b>、<b>字母歌谣</b>与<b>自测练习</b>。
        </p>
        <div className="hero-tags">
          <span className="hero-tag">🔤 词汇</span>
          <span className="hero-tag">💬 句型</span>
          <span className="hero-tag">🎵 歌谣</span>
          <span className="hero-tag">✅ 跟读</span>
        </div>
      </section>

      <div className="rg-progress-pill" style={mcStyle}>
        🏆 已跟读打卡 <b>{reciteCount}</b> 次（共 {totalEngLessons} 课）
      </div>

      <h2 className="section-title">📘 学习单元</h2>
      <div className="module-grid">
        {eng3aUnits.map((u) => {
          const done = u.lessons.filter((l) => (recite[l.slug]?.length ?? 0) > 0).length
          return (
            <Link
              key={u.slug}
              to={`/eng3a/${u.slug}`}
              className="module-card"
              style={{ '--mc': u.theme.color, '--mc-soft': u.theme.colorSoft } as React.CSSProperties}
            >
              <div className="module-emoji">{u.emoji}</div>
              <div className="module-info">
                <div className="module-num">
                  {u.title} {done > 0 && `· 已读 ${done}`}
                </div>
                <div className="module-title">{u.titleZh}</div>
                <div className="module-zh">{u.lessons.length} 课</div>
              </div>
              <div className="module-arrow">›</div>
            </Link>
          )
        })}
      </div>

      <details className="rg-books" style={mcStyle}>
        <summary>📘 关于本课程</summary>
        <p className="rg-books-note">
          课程依据<b>外研版（新标准 2024）三年级上册英语</b>教材整理，覆盖全部 6 个单元：
          打招呼与姓名、学习用品、颜色、数字、家庭、我的家。每课都能<b>看知识点</b>、
          <b>做跟读练习</b>、<b>玩自测练习</b>；课文插图均从原版教材提取，帮助课内巩固与听说启蒙。
        </p>
      </details>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
