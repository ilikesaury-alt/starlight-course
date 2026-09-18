// 英语板块首页（三年级上册英语）。
// 架构 v2：不再只堆一张单元列表，而是先讲清「这个板块有哪三块、每块怎么学」，
// 再展开单元地图 —— 孩子和家长一眼知道下一步点哪里。

import { Link } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import {
  eng3aUnits,
  eng3aPlays,
  eng3aBook,
  ENG3A_THEME,
  ENG_STAGES,
  totalEngLessons,
  eng3aWordCount,
  eng3aKeyWordCount,
  eng3aPlayWordCount,
} from '@/data/eng3a'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

export default function Eng3aHome() {
  const recite = useCourseStore((s) => s.eng3aRecite)
  const completed = useCourseStore((s) => s.completedEng3a)

  const checkinCount = Object.values(recite).reduce((a, days) => a + days.length, 0)
  const totalNodes = totalEngLessons + eng3aPlays.length
  const doneCount = completed.length

  return (
    <div className="home en3-home" style={moduleThemeVars(ENG3A_THEME)}>
      <section className="hero" style={moduleThemeVars(ENG3A_THEME)}>
        <div className="hero-emoji">📘</div>
        <h1 className="hero-title">三年级上册英语</h1>
        <p className="hero-sub">
          外研版（新标准 2024）课本同步，配合在校学习。<br />
          共 <b>{eng3aUnits.length}</b> 个单元、<b>{totalEngLessons}</b> 课、
          <b>{eng3aWordCount}</b> 个单词，外加 <b>{eng3aPlays.length}</b> 出课本小戏。
        </p>
        <div className="hero-tags">
          {ENG_STAGES.map((s) => (
            <span key={s.key} className="hero-tag">
              {s.emoji} {s.label}
            </span>
          ))}
        </div>
      </section>

      <div className="rg-progress-pill" style={moduleThemeVars(ENG3A_THEME)}>
        🏆 已跟读打卡 <b>{checkinCount}</b> 次 · 已完成 <b>{doneCount}</b> / {totalNodes} 关
      </div>

      {/* ---------- 板块导航 ---------- */}
      <h2 className="section-title">🧭 这个板块有什么</h2>
      <div className="en3-boards">
        <a href="#units" className="en3-board">
          <span className="en3-board-emoji">📚</span>
          <div className="en3-board-body">
            <div className="en3-board-title">课文同步</div>
            <div className="en3-board-sub">
              7 个单元 · 每单元五关：认单词 → 说句子 → 唱起来 → 长知识 → 闯关测
            </div>
          </div>
        </a>
        <Link to="/eng3a/play" className="en3-board">
          <span className="en3-board-emoji">🎭</span>
          <div className="en3-board-body">
            <div className="en3-board-title">英语小剧场</div>
            <div className="en3-board-sub">
              3 出课本小戏 · 选角色跟着念台词，念熟了和爸妈演一遍
            </div>
          </div>
        </Link>
        <Link to="/smart" className="en3-board">
          <span className="en3-board-emoji">🧠</span>
          <div className="en3-board-body">
            <div className="en3-board-title">复习巩固</div>
            <div className="en3-board-sub">
              学过的单词自动排进复习计划，到期就来练一练
            </div>
          </div>
        </Link>
      </div>

      {/* ---------- 学习路径 ---------- */}
      <h2 className="section-title">🛤️ 每个单元怎么学</h2>
      <ol className="en3-path">
        {ENG_STAGES.map((s, i) => (
          <li key={s.key} className="en3-path-step">
            <span className="en3-path-num">{i + 1}</span>
            <span className="en3-path-emoji">{s.emoji}</span>
            <div className="en3-path-body">
              <div className="en3-path-title">
                {s.label}
                <span className="en3-path-en">{s.en}</span>
              </div>
              <div className="en3-path-desc">{s.desc}</div>
              <div className="en3-path-interact">🎮 {s.interact}</div>
            </div>
          </li>
        ))}
      </ol>

      {/* ---------- 单元地图 ---------- */}
      <h2 className="section-title" id="units">📚 学习单元</h2>
      <div className="module-grid">
        {eng3aUnits.map((u) => {
          const done = u.lessons.filter((l) => completed.includes(l.slug)).length
          const read = u.lessons.filter((l) => (recite[l.slug]?.length ?? 0) > 0).length
          return (
            <Link
              key={u.slug}
              to={`/eng3a/${u.slug}`}
              className="module-card"
              style={moduleThemeVars(u.theme)}
            >
              <div className="module-emoji">{u.emoji}</div>
              <div className="module-info">
                <div className="module-num">
                  {u.title}
                  {done > 0 && ` · 学完 ${done}`}
                  {read > 0 && ` · 已读 ${read}`}
                </div>
                <div className="module-title">{u.titleZh}</div>
                <div className="module-zh">{u.lessons.length} 关</div>
              </div>
              <div className="module-arrow">›</div>
            </Link>
          )
        })}
      </div>

      {/* ---------- 小剧场预览 ---------- */}
      <h2 className="section-title">🎭 英语小剧场</h2>
      <p className="en3-section-lead">
        课本附录里的 {eng3aPlays.length} 出小戏，共 {eng3aPlayWordCount} 个重点词。
        读完课文来演一段，比多做十道题管用。
      </p>
      <div className="en3-play-strip">
        {eng3aPlays.map((p) => (
          <Link
            key={p.slug}
            to={`/eng3a/play/${p.slug}`}
            className="en3-play-mini"
            style={moduleThemeVars(p.theme)}
          >
            <span className="en3-play-mini-emoji">{p.emoji}</span>
            <span className="en3-play-mini-title">{p.titleZh}</span>
            <span className="en3-play-mini-meta">{p.lines.length} 句台词</span>
          </Link>
        ))}
        <Link to="/eng3a/play" className="en3-play-mini en3-play-more">
          <span className="en3-play-mini-emoji">🎬</span>
          <span className="en3-play-mini-title">全部剧本</span>
          <span className="en3-play-mini-meta">{eng3aPlays.length} 出小戏</span>
        </Link>
      </div>

      {/* ---------- 教材人物 ---------- */}
      <SafeBoundary label="教材信息">
        <details className="rg-books" style={moduleThemeVars(ENG3A_THEME)}>
          <summary>👋 课本里的朋友</summary>
          <div className="en3-chars">
            {eng3aBook.characters.map((c) => (
              <span key={c.en} className="en3-char">
                <b>{c.emoji}</b> {c.en} · {c.zh}
              </span>
            ))}
          </div>
          <p className="rg-books-note">
            他们有的来自 <b>the UK</b>（英国），有的来自 <b>the US</b>（美国）。
            全书会跟着他们一起打招呼、认文具、看颜色、数数字、说家人、聊自己的家。
          </p>
        </details>

        <details className="rg-books" style={moduleThemeVars(ENG3A_THEME)}>
          <summary>📘 关于本课程</summary>
          <p className="rg-books-note">
            课程依据 <b>{eng3aBook.title}</b>（{eng3aBook.publisher}，{eng3aBook.edition}）整理，
            覆盖全部 {eng3aUnits.length} 个单元（含开学第一课 Welcome）与 {eng3aPlays.length} 篇附录剧本。
            词汇分两层：<b>{eng3aKeyWordCount}</b> 个带 emoji 与例句的重点词，
            加上教材词汇表里余下的功能词，合计 <b>{eng3aWordCount}</b> 词全部收录。
            每关都能<b>看知识点</b>、<b>跟读打卡</b>、<b>玩自测</b>；课文插图均从原版教材提取。
          </p>
        </details>
      </SafeBoundary>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
        <Link to="/courses" className="back-link">全部课程 →</Link>
      </div>
    </div>
  )
}
