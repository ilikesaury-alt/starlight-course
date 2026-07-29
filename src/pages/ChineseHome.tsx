import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { chineseUnits, CHINESE_THEME, totalChineseLessons } from '@/data/chinese'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

const mcStyle = moduleThemeVars(CHINESE_THEME)

export default function ChineseHome() {
  const reciteCheckins = useCourseStore((s) => s.reciteCheckins)

  const reciteCount = useMemo(
    () => Object.values(reciteCheckins).reduce((a, days) => a + days.length, 0),
    [reciteCheckins],
  )

  return (
    <div className="home" style={mcStyle}>
      <section className="hero" style={mcStyle}>
        <div className="hero-emoji">📚</div>
        <h1 className="hero-title">三年级上册语文</h1>
        <p className="hero-sub">
          人教版（统编版）必背知识点，配合在校学习。<br />
          共 <b>{chineseUnits.length}</b> 个单元、<b>{totalChineseLessons}</b> 课，含
          <b>古诗词</b>、<b>课文重点段落</b>、<b>生字词</b>与<b>日积月累</b>。
        </p>
        <div className="hero-tags">
          <span className="hero-tag">📜 古诗词</span>
          <span className="hero-tag">📖 课文</span>
          <span className="hero-tag">✍️ 生字</span>
          <span className="hero-tag">✅ 打卡</span>
        </div>
      </section>

      <div className="rg-progress-pill" style={mcStyle}>
        🏆 已背诵打卡 <b>{reciteCount}</b> 次（共 {totalChineseLessons} 课）
      </div>

      <h2 className="section-title">📚 学习单元</h2>
      <div className="module-grid">
        {chineseUnits.map((u) => {
          const done = u.lessons.filter((l) => (reciteCheckins[l.slug]?.length ?? 0) > 0).length
          return (
            <Link
              key={u.id}
              to={`/chinese/${u.slug}`}
              className="module-card"
              style={{ '--mc': u.theme.color, '--mc-soft': u.theme.colorSoft } as React.CSSProperties}
            >
              <div className="module-emoji">{u.emoji}</div>
              <div className="module-info">
                <div className="module-num">
                  {u.title} {done > 0 && `· 已背 ${done}`}
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
          课程依据<b>人教版（统编版）三年级上册语文</b>教材的必背内容整理，覆盖全部 8 个单元：
          古诗词（9 首）、课文重点段落、写字表生字（拼音 + 组词）与语文园地日积月累。
          每课都能<b>看知识点</b>、<b>做背诵打卡</b>、<b>玩自测练习</b>，帮助课内巩固。
        </p>
      </details>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
