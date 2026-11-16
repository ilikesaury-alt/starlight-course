// 首页「今日清单」：从「推荐该做什么」升级为「今天要做完什么」（P1 每日节律）。
//
// 产品口径（2026-11-16 Lichun 定，方案 C **混合封顶**）：
//   今日 = min(到期复习卡, 40) + 1 节新课 + 1 篇阅读
// 配额与完成判据全在 `data/dailyPlan.ts`（纯函数、已单测），这里只负责取数与渲染。
//
// 为什么不再「每个模块各露一条」：
// 那是「内容目录」，不是「今天的任务」—— 孩子看到 5 条平级入口，不知道做哪个才算完，
// 于是永远没有「今天做完了」这个终点。现在收敛成 3 项，做完就是真的做完了。
// 想自由挑内容仍然可以：下面「课程入口」宫格一个都没少。
//
// ⚠️ Starlight 是两册一个系列，只推**当前册**的一条（跟册次偏好同源）。
// 原来两册各推一条会把清单位置占满，语文/英语永远轮不上。

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourseStore } from '@/store/useCourseStore'
import { useHomeLevel } from '@/hooks/useHomeLevel'
import { modules as starlightModules } from '@/data/starlight'
import { chineseUnits } from '@/data/chinese'
import { eng3aUnits } from '@/data/eng3a'
import {
  DAILY_REVIEW_CAP,
  countReviewedToday,
  dailyProgress,
  isToday,
} from '@/data/dailyPlan'

interface PlanItem {
  key: 'review' | 'lesson' | 'reading'
  emoji: string
  title: string
  /** 已完成时的说明 */
  doneLabel: string
  to: string
  done: boolean
  /** 复习项的进度描述；其它项为空 */
  progress?: string
  /** 超上限没排进今天的提醒 */
  overflow?: string
}

export default function TodayTasks() {
  const srsCards = useCourseStore((s) => s.srsCards)
  const todayDue = useCourseStore((s) => s.getTodayDueCount())
  const lessonCompleted = useCourseStore((s) => s.lessonCompleted)
  const completedChinese = useCourseStore((s) => s.completedChinese)
  const completedEng3a = useCourseStore((s) => s.completedEng3a)
  const lessonDoneOn = useCourseStore((s) => s.lessonDoneOn)
  const readingDoneOn = useCourseStore((s) => s.readingDoneOn)
  const [level] = useHomeLevel()

  // 新课候选：当前册 / 语文 / 英语三选一（Starlight 优先 —— 它是主课）。
  // Starlight 第一册教材数据体积大，按需 import，不拖首屏。
  const [sl1Next, setSl1Next] = useState<{ to: string; label: string } | null>(null)
  useEffect(() => {
    if (level !== 'starlight1') {
      setSl1Next(null)
      return
    }
    let alive = true
    void import('@/data/starlightSeriesData').then((m) => {
      if (!alive) return
      const found = m
        .modulesOfLevel('starlight1')
        .flatMap((x) => x.lessons.map((l) => ({ x, l })))
        .find(({ x, l }) => !(lessonCompleted[x.slug] ?? []).includes(l.id))
      setSl1Next(
        found
          ? { to: `/preview/${found.x.slug}/${found.l.id}`, label: `Lesson ${found.l.id} · ${found.l.title}` }
          : null
      )
    })
    return () => {
      alive = false
    }
  }, [lessonCompleted, level])

  // ---- ① 复习 ----
  const reviewedToday = countReviewedToday(Object.values(srsCards))
  const progress = dailyProgress({
    reviewedToday,
    reviewDue: todayDue,
    lessonDone: isToday(lessonDoneOn),
    readingDone: isToday(readingDoneOn),
  })
  const reviewTarget = Math.min(todayDue, DAILY_REVIEW_CAP)
  const overflow = todayDue > DAILY_REVIEW_CAP ? todayDue - DAILY_REVIEW_CAP : 0

  // ---- ② 新课 ----
  // 优先 Starlight（主课），其次语文、英语 —— 顺序刻意固定，不做「智能推荐」：
  // 孩子需要的是稳定可预期的清单，而不是每天变一个花样的算法。
  let lessonTitle = ''
  let lessonTo = ''
  if (level === 'starlight1') {
    if (sl1Next) {
      lessonTitle = sl1Next.label
      lessonTo = sl1Next.to
    }
  } else {
    const slNext = starlightModules
      .flatMap((m) => m.lessons.map((l) => ({ m, l })))
      .find(({ m, l }) => !(lessonCompleted[m.slug] ?? []).includes(l.id))
    if (slNext) {
      lessonTitle = `Lesson ${slNext.l.id} · ${slNext.l.title}`
      lessonTo = `/preview/${slNext.m.slug}/${slNext.l.id}`
    }
  }
  if (!lessonTo && todayDue === 0) {
    // Starlight 学完了就退到语文
    const cnNext = chineseUnits
      .flatMap((u) => u.lessons.map((l) => ({ u, l })))
      .find(({ l }) => !completedChinese.includes(l.slug))
    if (cnNext) {
      lessonTitle = `${cnNext.u.title} · ${cnNext.l.title}`
      lessonTo = `/chinese/${cnNext.u.slug}/${cnNext.l.slug}`
    } else {
      const enNext = eng3aUnits
        .flatMap((u) => u.lessons.map((l) => ({ u, l })))
        .find(({ l }) => !completedEng3a.includes(l.slug))
      if (enNext) {
        lessonTitle = `${enNext.u.title} · 第 ${enNext.l.id} 课 ${enNext.l.title}`
        lessonTo = `/eng3a/${enNext.u.slug}/${enNext.l.slug}`
      }
    }
  }

  // ---- ③ 阅读 ----
  const readingTo = level === 'starlight1' ? '/reading1' : '/reading'

  const items: PlanItem[] = [
    {
      key: 'review',
      emoji: '🧠',
      title:
        reviewTarget > 0
          ? `复习 ${reviewTarget} 个单词`
          : '今天没有到期的单词',
      doneLabel: '复习完成',
      to: '/smart',
      // 没有到期卡时「复习」这件事本身是完成了的（无事可做 = 做完）
      // ⚠️ 「无到期卡」不等于「复习完了」。
      // 空数据的新用户如果看到复习项打勾，会以为「今天已经复习过了」——
      // 那是假的完成。所以这里只在**真的复习过**（reviewedToday > 0）
      // 或者**本来就有到期卡且已做满**时才算完成。
      done: reviewTarget > 0 && progress.reviewDone,
      progress: reviewTarget > 0 ? `${Math.min(reviewedToday, reviewTarget)} / ${reviewTarget}` : undefined,
      overflow: overflow > 0 ? `还有 ${overflow} 个没排进今天，明天继续` : undefined,
    },
    {
      key: 'lesson',
      emoji: '📖',
      title: lessonTo ? `学一节新课：${lessonTitle}` : '课程都学完啦',
      doneLabel: '新课完成',
      to: lessonTo || '/courses',
      // 只在**今天真的学了一节**时才算完成。
      // ⚠️ 「没有下一节课」不能算完成：那是「课程都学完了」的另一件事，
      // 而且新用户一打开就看到打勾会以为任务已达成，收束文案也就失去意义。
      done: progress.lessonDone,
    },
    {
      key: 'reading',
      emoji: '📚',
      title: '读一篇小故事',
      doneLabel: '阅读完成',
      to: readingTo,
      done: progress.readingDone,
    },
  ]

  // 收束判定与行状态必须同源：直接数 items，不复用 progress.allDone。
  // ⚠️ progress.allDone 把「无到期卡」算作复习完成（对配额层是对的），
  // 但界面上「打勾」的语义是「我做了」，两者在空数据下会分叉 ——
  // 曾经因此让新用户一打开就看到 2/3 和「都完成啦」。
  const doneCount = items.filter((i) => i.done).length
  const allDone = doneCount === items.length

  return (
    <div className="today-card">
      <div className="today-head">
        <span>今日清单</span>
        <span className="today-count">
          {doneCount} / {items.length}
        </span>
      </div>

      {/* 全部完成时给一个明确的收束 —— 孩子需要「做完了」这个终点，
          否则清单永远做不完，也就永远没有成就感。 */}
      {allDone && (
        <p className="today-done" role="status">
          🎉 今天的任务都完成啦，真棒！明天再来。
        </p>
      )}

      {items.map((it) => (
        <Link
          key={it.key}
          to={it.to}
          className={'today-row' + (it.done ? ' is-done' : '')}
          aria-label={it.done ? `${it.doneLabel}：${it.title}` : it.title}
        >
          <span className="today-emoji" aria-hidden="true">
            {it.done ? '✅' : it.emoji}
          </span>
          <div className="today-body">
            <div className="today-module">
              {it.key === 'review' ? '复习' : it.key === 'lesson' ? '新课' : '阅读'}
              {it.done && <span className="today-badge">已完成</span>}
            </div>
            <div className="today-label">{it.done ? it.doneLabel : it.title}</div>
            {it.progress && !it.done && <div className="today-sub">{it.progress}</div>}
            {it.overflow && <div className="today-sub today-sub--muted">{it.overflow}</div>}
          </div>
          <span className="today-arrow" aria-hidden="true">
            ›
          </span>
        </Link>
      ))}
    </div>
  )
}