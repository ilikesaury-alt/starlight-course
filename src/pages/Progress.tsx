import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourseStore } from '../store/useCourseStore'
import { totalChineseLessons } from '../data/chinese'
import { totalEngLessons } from '../data/eng3a'
import { flyGuyStories, flyGuyStoryCount } from '../data/flyguy'
import { rgArcCount, rgStoryCount } from '../data/rocketgirlReading'
import { moduleThemeOf } from '../data/modules'
import {
  STARLIGHT_LEVEL_ORDER,
  STARLIGHT_LEVELS,
  countLessonsByLevel,
  countQuizzesByLevel,
} from '../data/starlightSeries'
import { moduleThemeVars } from '../utils/theme'
import ConfirmDialog from '../components/ConfirmDialog'

// 学习进度：每模块一栏带进度条（Starlight 两册各一栏 + 语文 / 英语3A / 两个绘本），
// 点任意模块可直接跳转到对应课程首页，减少「看进度 → 回首页 → 找模块」的往返。
export default function Progress() {
  const totalStars = useCourseStore((s) => s.totalStars)
  const wrongWords = useCourseStore((s) => s.wrongWords)
  const completedQuizzes = useCourseStore((s) => s.completedQuizzes)
  const lessonCompleted = useCourseStore((s) => s.lessonCompleted)
  const completedStories = useCourseStore((s) => s.completedStories)
  const reciteCheckins = useCourseStore((s) => s.reciteCheckins)
  const eng3aRecite = useCourseStore((s) => s.eng3aRecite)
  const completedChinese = useCourseStore((s) => s.completedChinese)
  const completedEng3a = useCourseStore((s) => s.completedEng3a)
  const todayDue = useCourseStore((s) => s.getTodayDueCount())
  const resetAll = useCourseStore((s) => s.resetAll)
  const [showReset, setShowReset] = useState(false)

  const chineseRecited = Object.keys(reciteCheckins).filter((k) => (reciteCheckins[k]?.length ?? 0) > 0).length
  const eng3aRead = Object.keys(eng3aRecite).filter((k) => (eng3aRecite[k]?.length ?? 0) > 0).length
  const flyguyDone = flyGuyStories.filter((s) => completedStories.includes(s.slug)).length

  // Starlight 是一个系列：两册的完成记录都存在同一份 lessonCompleted /
  // completedQuizzes 里（键是单元 slug，全局唯一）。按册拆开统计，分母取自
  // 册次元信息 —— 早期把两册一起 reduce 却写死 slTotal=96，孩子只要学了第一册
  // 任意一课，预备级就会显示「已学 97/96 课」、进度条溢出。
  const lessonsByLevel = countLessonsByLevel(lessonCompleted)
  const quizzesByLevel = countQuizzesByLevel(completedQuizzes)

  const starlightRows = STARLIGHT_LEVEL_ORDER.map((level) => {
    const meta = STARLIGHT_LEVELS[level]
    const done = lessonsByLevel[level]
    const quizzes = quizzesByLevel[level]
    return {
      id: level,
      to: meta.path,
      emoji: level === 'starlight' ? '🌟' : '📗',
      name: `Starlight 主课 · ${meta.labelZh}`,
      status: quizzes > 0
        ? `已学 ${done}/${meta.lessonCount} 课 · 已闯关 ${quizzes} 关`
        : `已学 ${done}/${meta.lessonCount} 课`,
      total: meta.lessonCount,
      done,
    }
  })

  const rows = [
    ...starlightRows,
    { id: 'chinese', to: '/chinese', emoji: '📚', name: '三年级上册语文', status: `已学完 ${completedChinese.length}/${totalChineseLessons} 课 · 已背 ${chineseRecited} 课`, total: totalChineseLessons, done: completedChinese.length },
    { id: 'eng3a', to: '/eng3a', emoji: '📘', name: '三年级上册英语', status: `已学完 ${completedEng3a.length}/${totalEngLessons} 课 · 已读 ${eng3aRead} 课`, total: totalEngLessons, done: completedEng3a.length },
    { id: 'flyguy', to: '/flyguy', emoji: '🐝', name: 'Fly Guy 绘本闯关', status: `已通关 ${flyguyDone}/${flyGuyStoryCount} 关`, total: flyGuyStoryCount, done: flyguyDone },
    // Rocket Girl 已整体并入阅读模块：阅读不写「已读」记录，所以这里只报静态规模，
    // total=0 → 不画进度条。绝不把 `completedStories` 里的历史 rg-* 当成阅读进度。
    { id: 'rocketgirl', to: '/rocketgirl', emoji: '🚀', name: 'Rocket Girl 阅读', status: `${rgArcCount} 个故事 · ${rgStoryCount} 段例句`, total: 0, done: 0 },
  ]

  const stats = [
    { emoji: '⭐', value: totalStars, label: '累计星星', to: undefined as string | undefined },
    { emoji: '🧠', value: todayDue, label: '今日到期', to: '/smart' },
    { emoji: '📋', value: wrongWords.length, label: '错题本', to: '/wrong' },
    // Rocket Girl 已并入阅读模块（不记「已读」）：历史 localStorage 里的 rg-* 不再
    // 算作通关进度，只统计还有通关语义的 Fly Guy 绘本。
    { emoji: '🏆', value: completedStories.filter((s) => !s.startsWith('rg-')).length, label: '已通关绘本', to: undefined },
  ]

  return (
    <div className="page progress">
      <div className="page-head">
        <span className="page-emoji">📊</span>
        <div>
          <div className="page-kicker">学习进度</div>
          <h1 className="page-title">我的成长记录</h1>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) =>
          s.to ? (
            <Link key={i} to={s.to} className="stat-card stat-card-link">
              <div className="stat-emoji">{s.emoji}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </Link>
          ) : (
            <div key={i} className="stat-card">
              <div className="stat-emoji">{s.emoji}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          )
        )}
      </div>

      <h2 className="section-title">📚 各模块进度</h2>
      <div className="module-progress-list">
        {rows.map((r) => {
          // 夹紧到 100%：即便 localStorage 里有旧版本写坏的完成记录，
          // 进度条也不能溢出容器（数字仍如实显示，不掩盖数据问题）。
          const pct = r.total > 0 ? Math.min(100, Math.max(0, Math.round((r.done / r.total) * 100))) : 0
          return (
            <Link
              key={r.id}
              to={r.to}
              className="module-progress-row"
              style={moduleThemeVars(moduleThemeOf(r.id))}
            >
              <span className="mp-emoji">{r.emoji}</span>
              <div className="mp-body">
                <div className="mp-name">{r.name}</div>
                <div className="mp-status">{r.status}</div>
                {/* 没有可靠进度记录的模块（Rocket Girl 阅读）不画空进度条 ——
                    空的 0% 也是一种「你没读过」的伪造陈述。 */}
                {r.total > 0 && (
                  <div className="mp-bar">
                    <div className="mp-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
              <span className="mp-arrow">›</span>
            </Link>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button type="button" className="btn btn--soft" onClick={() => setShowReset(true)}>
          🔄 重置全部数据
        </button>
      </div>

      <ConfirmDialog
        open={showReset}
        emoji="🔄"
        title="确定重置所有进度吗？"
        message="星星、单词、错题和学习记录都会清空，而且找不回来哦。"
        confirmText="全部清空"
        cancelText="再想想"
        danger
        onConfirm={() => {
          resetAll()
          setShowReset(false)
        }}
        onCancel={() => setShowReset(false)}
      />

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
        <Link to="/smart" className="btn">去复习 →</Link>
      </div>
    </div>
  )
}
