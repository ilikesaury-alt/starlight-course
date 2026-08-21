import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { totalEngLessons, eng3aWordCount, eng3aUnits } from '@/data/eng3a'
import { chineseUnits } from '@/data/chinese'
import { modules as starlightModules } from '@/data/starlight'
import { useCourseStore } from '@/store/useCourseStore'
import type { ModuleId } from '@/data/modules'

// 首页与「课程」页共用的模块入口宫格 + 快捷入口。
// 每张卡片带实时徽章：模块进度百分比 + 今日 SRS 到期数，让复习提醒在所有入口可见。
// 故事类词表体积大,统计数字经 import() 动态获取,不进首屏 chunk。
export default function CourseEntries() {
  const completedPreviews = useCourseStore((s) => s.completedPreviews)
  const completedStories = useCourseStore((s) => s.completedStories)
  const completedChinese = useCourseStore((s) => s.completedChinese)
  const completedEng3a = useCourseStore((s) => s.completedEng3a)
  const getTodayDueCount = useCourseStore((s) => s.getTodayDueCount)

  // 故事模块动态统计:总数(进度%)与 Fly Guy 文案用数字
  const [fgStats, setFgStats] = useState<{ stories: number; words: number } | null>(null)
  const [storyTotals, setStoryTotals] = useState<{ flyguy?: number; rocketgirl?: number }>({})

  useEffect(() => {
    let alive = true
    void import('@/data/flyguy').then((m) => {
      if (!alive) return
      setFgStats({ stories: m.flyGuyStoryCount, words: m.flyGuyWordCount })
      setStoryTotals((s) => ({ ...s, flyguy: m.flyGuyStories.length }))
    })
    void import('@/data/rocketgirl').then((m) => {
      if (!alive) return
      setStoryTotals((s) => ({ ...s, rocketgirl: m.rocketGirlStories.length }))
    })
    return () => {
      alive = false
    }
  }, [])

  const pct = (done: number, total?: number) =>
    total && total > 0 ? Math.round((done / total) * 100) : undefined

  const chineseLessonTotal = chineseUnits.reduce((n, u) => n + u.lessons.length, 0)
  const eng3aLessonTotal = eng3aUnits.reduce((n, u) => n + u.lessons.length, 0)

  const badges: Partial<Record<ModuleId, { percent?: number; due: number }>> = {
    chinese: {
      percent: pct(completedChinese.length, chineseLessonTotal),
      due: getTodayDueCount('chinese'),
    },
    eng3a: {
      percent: pct(completedEng3a.length, eng3aLessonTotal),
      due: getTodayDueCount('eng3a'),
    },
    starlight: {
      percent: pct(completedPreviews.length, starlightModules.length),
      due: getTodayDueCount('starlight'),
    },
    rocketgirl: {
      percent: pct(
        completedStories.filter((s) => s.startsWith('rg-')).length,
        storyTotals.rocketgirl
      ),
      due: getTodayDueCount('rocketgirl'),
    },
    flyguy: {
      percent: pct(
        completedStories.filter((s) => !s.startsWith('rg-')).length,
        storyTotals.flyguy
      ),
      due: getTodayDueCount('flyguy'),
    },
  }

  const Badge = ({ id }: { id: ModuleId }) => {
    const b = badges[id]
    if (!b || (b.percent === undefined && b.due === 0)) return null
    return (
      <span className="home-entry-badge">
        {b.percent !== undefined && <span>📊 {b.percent}%</span>}
        {b.due > 0 && <span className="home-entry-due">🧠 {b.due} 待复习</span>}
      </span>
    )
  }

  return (
    <>
      <div className="home-entries">
        <Link to="/chinese" className="cn-home-entry">
          <span className="cn-home-emoji">📚</span>
          <div className="cn-home-body">
            <div className="cn-home-title">三年级上册语文</div>
            <div className="cn-home-sub">人教版必背 · 8 单元 / 古诗词·课文·生字·日积月累</div>
            <Badge id="chinese" />
          </div>
          <span className="cn-home-arrow">›</span>
        </Link>
        <Link to="/eng3a" className="en3-home-entry">
          <span className="en3-home-emoji">📘</span>
          <div className="en3-home-body">
            <div className="en3-home-title">三年级上册英语</div>
            <div className="en3-home-sub">外研版（新标准 2024）· 6 单元 / {totalEngLessons} 课 / {eng3aWordCount} 词 · 听说启蒙</div>
            <Badge id="eng3a" />
          </div>
          <span className="en3-home-arrow">›</span>
        </Link>
        <Link to="/starlight" className="sl-home-entry">
          <span className="sl-home-emoji">🌟</span>
          <div className="sl-home-body">
            <div className="sl-home-title">Starlight 主课</div>
            <div className="sl-home-sub">牛津 Starlight 预备级 · 12 单元 / 96 课 / 全教材单词</div>
            <Badge id="starlight" />
          </div>
          <span className="sl-home-arrow">›</span>
        </Link>
        <Link to="/rocketgirl" className="rg-home-entry">
          <span className="rg-home-emoji">🚀</span>
          <div className="rg-home-body">
            <div className="rg-home-title">Rocket Girl 英语闯关</div>
            <div className="rg-home-sub">宝贝最爱的动画片主题课 · 108 个故事关卡</div>
            <Badge id="rocketgirl" />
          </div>
          <span className="rg-home-arrow">›</span>
        </Link>
        <Link to="/flyguy" className="fg-home-entry">
          <span className="fg-home-emoji">🐝</span>
          <div className="fg-home-body">
            <div className="fg-home-title">Fly Guy 英语绘本闯关</div>
            <div className="fg-home-sub">小男孩 Buzz 和宠物苍蝇的爆笑绘本 · {fgStats ? `${fgStats.stories} 个故事 / ${fgStats.words} 词` : '分级绘本闯关'}</div>
            <Badge id="flyguy" />
          </div>
          <span className="fg-home-arrow">›</span>
        </Link>
        <Link to="/phrases" className="ph-home-entry">
          <span className="ph-home-emoji">🗣️</span>
          <div className="ph-home-body">
            <div className="ph-home-title">菲教课堂用语</div>
            <div className="ph-home-sub">外教每天说的话 · 点英文听发音，课前先听懂不慌</div>
          </div>
          <span className="ph-home-arrow">›</span>
        </Link>
      </div>

      <div className="quick-row">
        <Link to="/alphabet" className="quick-card quick-alphabet">
          <span className="qc-emoji">🔤</span>
          <span>字母表</span>
          <span className="qc-sub">26 个字母发音</span>
        </Link>
        <Link to="/progress" className="quick-card quick-progress">
          <span className="qc-emoji">📊</span>
          <span>学习进度</span>
          <span className="qc-sub">星星与成就</span>
        </Link>
      </div>
    </>
  )
}
