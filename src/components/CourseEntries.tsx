import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Type, ChartColumn } from 'lucide-react'
import { totalEngLessons, eng3aWordCount, eng3aUnits, eng3aPlays } from '@/data/eng3a'
import { chineseUnits } from '@/data/chinese'
import { useCourseStore } from '@/store/useCourseStore'
import type { ModuleId } from '@/data/modules'
import StarlightLevelSwitch from './StarlightLevelSwitch'
import { useHomeLevel } from '@/hooks/useHomeLevel'
import { STARLIGHT_LEVELS, levelOfUnitSlug, type StarlightLevel } from '@/data/starlightSeries'

// 首页与「课程」页共用的模块入口宫格 + 快捷入口。
// 每张卡片带实时徽章：模块进度百分比 + 今日 SRS 到期数，让复习提醒在所有入口可见。
// 故事类词表体积大,统计数字经 import() 动态获取,不进首屏 chunk。
//
// Starlight 是两册系列：首页只放一组「主课 / 阅读」入口，由册次切换条决定当前册。
// 册次元信息（单元数/课数/slug 归属）全在零数据的 starlightSeries.ts 里，
// 首页不必再动态 import 第一册教材（那条老路会把 350KB 数据 chunk 拉进首屏加载）。
export default function CourseEntries() {
  const completedPreviews = useCourseStore((s) => s.completedPreviews)
  const completedStories = useCourseStore((s) => s.completedStories)
  const completedChinese = useCourseStore((s) => s.completedChinese)
  const completedEng3a = useCourseStore((s) => s.completedEng3a)
  const getTodayDueCount = useCourseStore((s) => s.getTodayDueCount)

  // 册次是视图偏好，不是学习进度：放 localStorage，不进 Zustand persist。
  // 用 useHomeLevel 而非本地 useState —— 「今日任务」也读同一份偏好，
  // 切册要让两处同时换，靠 data/homeLevel.ts 的订阅广播同步。
  const [level, changeLevel] = useHomeLevel()
  const meta = STARLIGHT_LEVELS[level]
  const readingPath = level === 'starlight1' ? '/reading1' : '/reading'

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

  // Starlight 是一个系列：两册共用一份 completedPreviews（按单元 slug 记），
  // 进度百分比必须各算各的 —— 否则第一册学完会把预备级的进度条顶上去。
  // slug → 册 的归属表在零数据的 starlightSeries.ts，首页不必 import 教材。
  const doneByLevel = { starlight: 0, starlight1: 0 }
  for (const slug of completedPreviews) {
    const l = levelOfUnitSlug(slug)
    if (l) doneByLevel[l] += 1
  }
  const unitTotalOf = (l: StarlightLevel) => STARLIGHT_LEVELS[l].unitCount

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
      percent: pct(doneByLevel.starlight, unitTotalOf('starlight')),
      due: getTodayDueCount('starlight'),
    },
    starlight1: {
      percent: pct(doneByLevel.starlight1, unitTotalOf('starlight1')),
      due: getTodayDueCount('starlight1'),
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
        {b.percent !== undefined && <span>{b.percent}%</span>}
        {b.due > 0 && <span className="home-entry-due">{b.due} 待复习</span>}
      </span>
    )
  }

  return (
    <>
      {/* Starlight 是一个系列：一条册次切换条管着下面「主课 / 阅读」两张卡，
          选哪一册，两张卡的链接、文案、进度徽章就一起换到哪一册。
          另一个册次仍留一条直达链，孩子不用先切再进（也是既有 e2e 锚点）。 */}
      <div className="sl-level-block" data-level={level}>
        <StarlightLevelSwitch current={level} onChange={changeLevel} />
        {/* 另一册的阅读直达链：预备级视图下给第一册留一个不用先切换就能进的口子。
            class 保留 rd1-home-entry —— reading.spec 用它唯一定位首页第一册阅读入口。 */}
        <Link to="/reading1" className="rd1-home-entry sl-direct-book1">
          阅读小故事 · 第一册 <span aria-hidden="true">↗</span>
        </Link>
      </div>

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
            <div className="en3-home-sub">外研版（新标准 2024）· {eng3aUnits.length} 单元 / {totalEngLessons} 关 · 5 步闯关 + {eng3aPlays.length} 出小戏 / {eng3aWordCount} 词</div>
            <Badge id="eng3a" />
          </div>
          <span className="en3-home-arrow">›</span>
        </Link>
        <Link to={meta.path} className="sl-home-entry">
          <span className="sl-home-emoji">🌟</span>
          <div className="sl-home-body">
            <div className="sl-home-title">Starlight 主课 · {meta.labelZh}</div>
            <div className="sl-home-sub">{meta.bookTitle} · {meta.unitCount} 单元 / {meta.lessonCount} 课 / 全教材单词</div>
            <Badge id={level} />
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
        <Link to="/dictation" className="dt-home-entry">
          <span className="dt-home-emoji">✍️</span>
          <div className="dt-home-body">
            <div className="dt-home-title">听写练习</div>
            <div className="dt-home-sub">听音写词 · 自然拼读 · 三年级上册英语单词</div>
          </div>
          <span className="dt-home-arrow">›</span>
        </Link>
        <Link to="/alphablocks" className="ab-home-entry">
          <span className="ab-home-emoji">🧱</span>
          <div className="ab-home-body">
            <div className="ab-home-title">字母积木</div>
            <div className="ab-home-sub">看完《字母积木》来练稳固 · 听音搭积木</div>
          </div>
          <span className="ab-home-arrow">›</span>
        </Link>
        <Link to={readingPath} className="rd-home-entry">
          <span className="rd-home-emoji">📚</span>
          <div className="rd-home-body">
            <div className="rd-home-title">阅读小故事</div>
            <div className="rd-home-sub">{meta.labelZh} · {meta.lessonCount} 篇 · 用每课学过的词写的小故事</div>
          </div>
          <span className="rd-home-arrow">›</span>
        </Link>
      </div>

      <div className="quick-row">
        <Link to="/alphabet" className="quick-card quick-alphabet">
          <Type size={21} strokeWidth={1.9} className="qc-emoji" aria-hidden="true" />
          <span>字母表</span>
          <span className="qc-sub">26 个字母发音</span>
        </Link>
        <Link to="/progress" className="quick-card quick-progress">
          <ChartColumn size={21} strokeWidth={1.9} className="qc-emoji" aria-hidden="true" />
          <span>学习进度</span>
          <span className="qc-sub">星星与成就</span>
        </Link>
      </div>
    </>
  )
}
