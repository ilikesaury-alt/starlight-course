import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourseStore } from '../store/useCourseStore'
import { totalChineseLessons } from '../data/chinese'
import { totalEngLessons } from '../data/eng3a'
import { flyGuyStories, flyGuyStoryCount } from '../data/flyguy'
import { rocketGirlStories, rocketGirlStoryCount } from '../data/rocketgirl'
import { moduleThemeOf } from '../data/modules'
import { moduleThemeVars } from '../utils/theme'
import ConfirmDialog from '../components/ConfirmDialog'

// 学习进度：覆盖全部 5 个课程模块，每模块一栏带进度条，
// 点任意模块可直接跳转到对应课程首页，减少「看进度 → 回首页 → 找模块」的往返。
export default function Progress() {
  const totalStars = useCourseStore((s) => s.totalStars)
  const wrongWords = useCourseStore((s) => s.wrongWords)
  const completedPreviews = useCourseStore((s) => s.completedPreviews)
  const completedQuizzes = useCourseStore((s) => s.completedQuizzes)
  const completedStories = useCourseStore((s) => s.completedStories)
  const reciteCheckins = useCourseStore((s) => s.reciteCheckins)
  const eng3aRecite = useCourseStore((s) => s.eng3aRecite)
  const todayDue = useCourseStore((s) => s.getTodayDueCount())
  const resetAll = useCourseStore((s) => s.resetAll)
  const [showReset, setShowReset] = useState(false)

  const chineseDone = Object.keys(reciteCheckins).filter((k) => (reciteCheckins[k]?.length ?? 0) > 0).length
  const eng3aDone = Object.keys(eng3aRecite).filter((k) => (eng3aRecite[k]?.length ?? 0) > 0).length
  const flyguyDone = flyGuyStories.filter((s) => completedStories.includes(s.slug)).length
  const rocketgirlDone = rocketGirlStories.filter((s) => completedStories.includes(s.slug)).length

  const rows = [
    {
      id: 'starlight', to: '/starlight', emoji: '🌟', name: 'Starlight 主课',
      status: completedQuizzes.length > 0
        ? `已预习 ${completedPreviews.length}/12 单元 · 已测 ${completedQuizzes.length} 关`
        : `已预习 ${completedPreviews.length}/12 单元`,
      total: 12, done: completedPreviews.length,
    },
    { id: 'chinese', to: '/chinese', emoji: '📚', name: '三年级上册语文', status: `已背 ${chineseDone}/${totalChineseLessons} 课`, total: totalChineseLessons, done: chineseDone },
    { id: 'eng3a', to: '/eng3a', emoji: '📘', name: '三年级上册英语', status: `已读 ${eng3aDone}/${totalEngLessons} 课`, total: totalEngLessons, done: eng3aDone },
    { id: 'flyguy', to: '/flyguy', emoji: '🐝', name: 'Fly Guy 绘本闯关', status: `已通关 ${flyguyDone}/${flyGuyStoryCount} 关`, total: flyGuyStoryCount, done: flyguyDone },
    { id: 'rocketgirl', to: '/rocketgirl', emoji: '🚀', name: 'Rocket Girl 闯关', status: `已通关 ${rocketgirlDone}/${rocketGirlStoryCount} 关`, total: rocketGirlStoryCount, done: rocketgirlDone },
  ]

  const stats = [
    { emoji: '⭐', value: totalStars, label: '累计星星', to: undefined as string | undefined },
    { emoji: '🧠', value: todayDue, label: '今日到期', to: '/smart' },
    { emoji: '📋', value: wrongWords.length, label: '错题本', to: '/wrong' },
    { emoji: '🏆', value: completedStories.length, label: '已通关故事', to: undefined },
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
          const pct = r.total > 0 ? Math.round((r.done / r.total) * 100) : 0
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
                <div className="mp-bar">
                  <div className="mp-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className="mp-arrow">›</span>
            </Link>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button type="button" className="btn btn-soft" onClick={() => setShowReset(true)}>
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
