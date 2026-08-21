// 首页「今日任务」聚合卡：把「现在该做什么」的决策统一到一处。
// 内容 = 今日到期复习(如有) + 按模块顺序推荐的前 2 条未完成课；
// 全部完成时显示鼓励态。取数全部来自 store 现有完成记录,无新增字段。

import { Link } from 'react-router-dom'
import { useCourseStore } from '@/store/useCourseStore'
import { modules as starlightModules } from '@/data/starlight'
import { chineseUnits } from '@/data/chinese'
import { eng3aUnits } from '@/data/eng3a'
import { flyGuyStories } from '@/data/flyguy'
import { rocketGirlStories } from '@/data/rocketgirl'

interface Task {
  emoji: string
  module: string
  label: string
  to: string
}

export default function TodayTasks() {
  const todayDue = useCourseStore((s) => s.getTodayDueCount())
  const lessonCompleted = useCourseStore((s) => s.lessonCompleted)
  const completedStories = useCourseStore((s) => s.completedStories)
  const completedChinese = useCourseStore((s) => s.completedChinese)
  const completedEng3a = useCourseStore((s) => s.completedEng3a)

  const tasks: Task[] = []

  // Starlight 主课:按单元→课顺序找第一个未完成课
  const slNext = starlightModules
    .flatMap((m) => m.lessons.map((l) => ({ m, l })))
    .find(({ m, l }) => !(lessonCompleted[m.slug] ?? []).includes(l.id))
  if (slNext) {
    tasks.push({
      emoji: '🌟',
      module: 'Starlight',
      label: `Lesson ${slNext.l.id} · ${slNext.l.title}`,
      to: `/preview/${slNext.m.slug}/${slNext.l.id}`,
    })
  }

  // 语文:第一个未学完课
  const cnNext = chineseUnits
    .flatMap((u) => u.lessons.map((l) => ({ u, l })))
    .find(({ l }) => !completedChinese.includes(l.slug))
  if (cnNext) {
    tasks.push({
      emoji: '📚',
      module: '语文',
      label: `${cnNext.u.title} · ${cnNext.l.title}`,
      to: `/chinese/${cnNext.u.slug}/${cnNext.l.slug}`,
    })
  }

  // 英语3A:第一个未学完课
  const enNext = eng3aUnits
    .flatMap((u) => u.lessons.map((l) => ({ u, l })))
    .find(({ l }) => !completedEng3a.includes(l.slug))
  if (enNext) {
    tasks.push({
      emoji: '📘',
      module: '英语',
      label: `${enNext.u.title} · 第 ${enNext.l.id} 课 ${enNext.l.title}`,
      to: `/eng3a/${enNext.u.slug}/${enNext.l.slug}`,
    })
  }

  // 故事关:各找第一个未通关
  const fgNext = flyGuyStories.find((s) => !completedStories.includes(s.slug))
  if (fgNext) tasks.push({ emoji: '🐝', module: 'Fly Guy', label: fgNext.title, to: `/flyguy/${fgNext.slug}` })
  const rgNext = rocketGirlStories.find((s) => !completedStories.includes(s.slug))
  if (rgNext) tasks.push({ emoji: '🚀', module: 'Rocket Girl', label: rgNext.title, to: `/rocketgirl/${rgNext.slug}` })

  const shown = tasks.slice(0, 2)
  const allDone = todayDue === 0 && shown.length === 0

  return (
    <div className="today-card">
      <div className="today-head">📅 今日任务</div>

      {todayDue > 0 && (
        <Link to="/smart" className="smart-hero-entry">
          <span className="smart-hero-emoji">🧠</span>
          <div className="smart-hero-body">
            <div className="smart-hero-title">今日复习 · 大脑健身</div>
            <div className="smart-hero-sub">
              科学记忆编排,<b>{todayDue}</b> 个单词到期,几分钟就练完
            </div>
          </div>
          <span className="smart-hero-badge">{todayDue}</span>
          <span className="smart-hero-arrow">›</span>
        </Link>
      )}

      {shown.map((t) => (
        <Link key={t.to} to={t.to} className="today-row">
          <span className="today-emoji">{t.emoji}</span>
          <div className="today-body">
            <div className="today-module">{t.module} · 继续学</div>
            <div className="today-label">{t.label}</div>
          </div>
          <span className="today-arrow">›</span>
        </Link>
      ))}

      {allDone && (
        <p className="today-done">🎉 今天的学习任务都完成啦,随时来复习哦!</p>
      )}
    </div>
  )
}
