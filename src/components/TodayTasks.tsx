// 首页「今日任务」聚合卡：把「现在该做什么」的决策统一到一处。
// 内容 = 今日到期复习(如有) + 按模块顺序推荐的前 2 条未完成课；
// 全部完成时显示鼓励态。取数全部来自 store 现有完成记录,无新增字段。
// 故事类词表体积大,经 import() 动态获取,不拖慢首屏。
//
// ⚠️ Starlight 是**两册一个系列**，但这里只推**当前册**的一条：
// 原来两册各推一条（预备级 + 第一册），而下面只取前 2 条 ——
// 结果是只要两册都有没学完的课，语文/英语/绘本永远轮不上，
// 「今日任务」变成两条 Starlight 的重复。现在跟着册次偏好走，
// 与上面那条册次切换条同源（data/homeLevel.ts），切册时一起换。

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourseStore } from '@/store/useCourseStore'
import { useHomeLevel } from '@/hooks/useHomeLevel'
import { modules as starlightModules } from '@/data/starlight'
import { chineseUnits } from '@/data/chinese'
import { eng3aUnits } from '@/data/eng3a'

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
  const [level] = useHomeLevel()

  const [storyTasks, setStoryTasks] = useState<Task[]>([])

  // 故事类下一关:动态加载数据后计算(避免首屏拉起大词表 chunk)
  useEffect(() => {
    let alive = true
    void Promise.all([import('@/data/flyguy'), import('@/data/rocketgirl')]).then(
      ([fg, rg]) => {
        if (!alive) return
        const t: Task[] = []
        const fgNext = fg.flyGuyStories.find((s) => !completedStories.includes(s.slug))
        if (fgNext) t.push({ emoji: '🐝', module: 'Fly Guy', label: fgNext.title, to: `/flyguy/${fgNext.slug}` })
        const rgNext = rg.rocketGirlStories.find((s) => !completedStories.includes(s.slug))
        if (rgNext) t.push({ emoji: '🚀', module: 'Rocket Girl', label: rgNext.title, to: `/rocketgirl/${rgNext.slug}` })
        setStoryTasks(t)
      }
    )
    return () => {
      alive = false
    }
  }, [completedStories])

  // Starlight 第一册:第一册教材数据体积大,经 import() 动态获取,不拖慢首屏。
  // 只在当前册是第一册时才去加载/展示 —— 预备级视图下没必要拉这份 chunk。
  const [sl1Task, setSl1Task] = useState<Task | null>(null)
  useEffect(() => {
    if (level !== 'starlight1') {
      setSl1Task(null)
      return
    }
    let alive = true
    void import('@/data/starlightSeriesData').then((m) => {
      if (!alive) return
      const found = m
        .modulesOfLevel('starlight1')
        .flatMap((x) => x.lessons.map((l) => ({ x, l })))
        .find(({ x, l }) => !(lessonCompleted[x.slug] ?? []).includes(l.id))
      if (found) {
        setSl1Task({
          emoji: '🌟',
          module: 'Starlight 1',
          label: `Lesson ${found.l.id} · ${found.l.title}`,
          to: `/preview/${found.x.slug}/${found.l.id}`,
        })
      } else {
        setSl1Task(null)
      }
    })
    return () => {
      alive = false
    }
  }, [lessonCompleted, level])

  const tasks: Task[] = []

  // Starlight 主课:只推当前册的一条（两册各推一条会把下面 2 格全占满）
  if (level === 'starlight1') {
    if (sl1Task) tasks.push(sl1Task)
  } else {
    // 预备级:按单元→课顺序找第一个未完成课
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

  tasks.push(...storyTasks)

  // ⚠️ 不再 `slice(0, 2)`：原来只露 2 条，而模块有 5 个（Starlight 当前册 /
  // 语文 / 英语 / Fly Guy / Rocket Girl），于是永远有 3 个模块的「下一课」看不见，
  // 家长想带孩子学语文，得自己从宫格里找、再点进去找课。
  //
  // 现在每个模块各占一行、全部可见 —— 这不是新增功能，是把既有能力（每模块找
  // 第一个未完成课）从「只露 2 个」放开到「全露」。行数天然有界（≤5），
  // 不需要再截断。
  const shown = tasks
  const allDone = todayDue === 0 && shown.length === 0

  return (
    <div className="today-card">
      <div className="today-head">今日任务</div>

      {todayDue > 0 && (
        <Link to="/smart" className="smart-hero-entry">
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
