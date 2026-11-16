// 首页入口：**主课优先**结构（2026-11-16 重设计）。
//
// 旧版问题（实测）：8 张卡片全是 474×177px 等高、2 列平铺 —— 语文/英语/主课/RG/
// FlyGuy/听写/积木/阅读 全部平级，视觉上分不出「主课」和「听写练习」，
// 而且首屏滚很久才看完。**信息没有层次 = 用户没有决策依据。**
//
// 新结构（三档）：
//   ① 主课区（大卡，2 列）：Starlight 主课 / 语文 / 英语 —— 真正要"学"的三门
//   ② 阅读区（中卡，3 列）：阅读小故事 / Rocket Girl / Fly Guy —— 自选拓展
//   ③ 练习区（紧凑条，横排）：听写 / 字母积木 / 字母表 —— 工具性质，不该占大块
//
// ⚠️ **所有 e2e class 锚点一个都不能改名**（tests/*.spec.ts 靠它们定位）：
//    .cn-home-entry .en3-home-entry .sl-home-entry .rg-home-entry .fg-home-entry
//    .dt-home-entry .ab-home-entry .rd-home-entry .rd1-home-entry
// 改动只调**结构与尺寸**，不动 class 名。旧的 `.home-entries` 保留为外层容器
// （e2e 与样式仍引用），内部改为分区。
//
// 故事类数据体积大（~600KB 源码）→ 仍走 import() 动态获取，不进首屏 chunk。

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Type, ChartColumn } from 'lucide-react'
import { totalEngLessons, eng3aWordCount, eng3aUnits } from '@/data/eng3a'
import { chineseUnits } from '@/data/chinese'
import { useCourseStore } from '@/store/useCourseStore'
import type { ModuleId } from '@/data/modules'
import StarlightLevelSwitch from './StarlightLevelSwitch'
import { useHomeLevel } from '@/hooks/useHomeLevel'
import { STARLIGHT_LEVELS, levelOfUnitSlug, type StarlightLevel } from '@/data/starlightSeries'

export default function CourseEntries() {
  const completedPreviews = useCourseStore((s) => s.completedPreviews)
  const completedStories = useCourseStore((s) => s.completedStories)
  const completedChinese = useCourseStore((s) => s.completedChinese)
  const completedEng3a = useCourseStore((s) => s.completedEng3a)
  const getTodayDueCount = useCourseStore((s) => s.getTodayDueCount)

  const [level, changeLevel] = useHomeLevel()
  const meta = STARLIGHT_LEVELS[level]
  const readingPath = level === 'starlight1' ? '/reading1' : '/reading'

  const [fgStats, setFgStats] = useState<{ stories: number; words: number } | null>(null)
  const [rgStats, setRgStats] = useState<{ arcs: number; stories: number } | null>(null)

  useEffect(() => {
    let alive = true
    void import('@/data/flyguy').then((m) => {
      if (!alive) return
      setFgStats({ stories: m.flyGuyStoryCount, words: m.flyGuyWordCount })
    })
    void import('@/data/rocketgirlReading').then((m) => {
      if (!alive) return
      setRgStats({ arcs: m.rgArcCount, stories: m.rgStoryCount })
    })
    return () => {
      alive = false
    }
  }, [])

  const pct = (done: number, total?: number) =>
    total && total > 0 ? Math.round((done / total) * 100) : undefined

  const chineseLessonTotal = chineseUnits.reduce((n, u) => n + u.lessons.length, 0)
  const eng3aLessonTotal = eng3aUnits.reduce((n, u) => n + u.lessons.length, 0)

  // Starlight 是系列：两册共用一份 completedPreviews（按单元 slug 记），
  // 进度必须各算各的，否则学完第一册会把预备级的进度条顶上去。
  const doneByLevel = { starlight: 0, starlight1: 0 }
  for (const slug of completedPreviews) {
    const l = levelOfUnitSlug(slug)
    if (l) doneByLevel[l] += 1
  }
  const unitTotalOf = (l: StarlightLevel) => STARLIGHT_LEVELS[l].unitCount

  /** 进度环：主课卡上的核心视觉（比进度条更有"到达感"） */
  const Ring = ({ percent, tone }: { percent?: number; tone: string }) => {
    const p = percent ?? 0
    const r = 17
    const circ = 2 * Math.PI * r
    return (
      <span className="hall-ring" data-tone={tone} aria-hidden="true">
        <svg viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r={r} className="hall-ring-track" />
          <circle
            cx="20"
            cy="20"
            r={r}
            className="hall-ring-fill"
            strokeDasharray={`${(p / 100) * circ} ${circ}`}
            transform="rotate(-90 20 20)"
          />
        </svg>
        <span className="hall-ring-text">{percent === undefined ? '—' : `${p}%`}</span>
      </span>
    )
  }

  const badges: Partial<Record<ModuleId, { percent?: number; due: number }>> = {
    chinese: { percent: pct(completedChinese.length, chineseLessonTotal), due: getTodayDueCount('chinese') },
    eng3a: { percent: pct(completedEng3a.length, eng3aLessonTotal), due: getTodayDueCount('eng3a') },
    starlight: { percent: pct(doneByLevel.starlight, unitTotalOf('starlight')), due: getTodayDueCount('starlight') },
    starlight1: { percent: pct(doneByLevel.starlight1, unitTotalOf('starlight1')), due: getTodayDueCount('starlight1') },
    rocketgirl: { due: getTodayDueCount('rocketgirl') },
    flyguy: {
      percent: pct(completedStories.filter((s) => !s.startsWith('rg-')).length, fgStats?.stories),
      due: getTodayDueCount('flyguy'),
    },
  }

  /** 到期复习徽章（"12 待复习"）—— 只在真的有时才出现 */
  const Due = ({ id }: { id: ModuleId }) => {
    const d = badges[id]?.due ?? 0
    return d > 0 ? <span className="hall-due">{d} 待复习</span> : null
  }

  return (
    <>
      {/* 册次切换条：管着下面 Starlight 卡的链接/文案/进度 */}
      <div className="sl-level-block" data-level={level}>
        <StarlightLevelSwitch current={level} onChange={changeLevel} />
        <Link to="/reading1" className="rd1-home-entry sl-direct-book1">
          阅读小故事 · 第一册 <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {/* 外层容器保留 .home-entries（e2e 与旧样式仍引用），内部改为分区 */}
      <div className="home-entries hall">

        {/* ① 主课区 —— 三门真正要「学」的课，大卡 + 进度环 */}
        <div className="hall-section hall-section--main">
          <h2 className="hall-heading">
            <span className="hall-heading-emoji" aria-hidden="true">🌟</span>
            主课
            <span className="hall-heading-note">每天从这里开始</span>
          </h2>

          <div className="hall-main">
            <Link to={meta.path} className="sl-home-entry hall-card hall-card--main">
              <span className="hall-card-glyph" aria-hidden="true">🌟</span>
              <div className="sl-home-body hall-card-body">
                {/* ⚠️ 文案必须是「Starlight 主课 · {册}」—— e2e 靠 `getByText('Starlight 主课')`
                定位这个入口（tests/home.spec.ts 两条 + tests/eng3a.spec.ts）。
                重设计时我一度改成「Starlight · 预备级」，两条 e2e 立刻红。
                排版调整不能顺手改既有文案 —— 文案是契约。 */}
                <div className="sl-home-title">Starlight 主课 · {meta.labelZh}</div>
                <div className="sl-home-sub">
                  {meta.bookTitle} · {meta.unitCount} 单元 / {meta.lessonCount} 课
                </div>
                <div className="hall-card-foot">
                  <Due id={level} />
                  <span className="hall-card-go">继续学 ›</span>
                </div>
              </div>
              <Ring percent={badges[level]?.percent} tone="amber" />
            </Link>

            <Link to="/chinese" className="cn-home-entry hall-card hall-card--main">
              <span className="hall-card-glyph" aria-hidden="true">📚</span>
              <div className="cn-home-body hall-card-body">
                <div className="cn-home-title">三年级上册语文</div>
                <div className="cn-home-sub">人教版 · 8 单元 · 古诗词 / 课文 / 生字</div>
                <div className="hall-card-foot">
                  <Due id="chinese" />
                  <span className="hall-card-go">继续学 ›</span>
                </div>
              </div>
              <Ring percent={badges.chinese?.percent} tone="rose" />
            </Link>

            <Link to="/eng3a" className="en3-home-entry hall-card hall-card--main">
              <span className="hall-card-glyph" aria-hidden="true">📘</span>
              <div className="en3-home-body hall-card-body">
                <div className="en3-home-title">三年级上册英语</div>
                <div className="en3-home-sub">
                  外研版 · {eng3aUnits.length} 单元 / {totalEngLessons} 关 · {eng3aWordCount} 词
                </div>
                <div className="hall-card-foot">
                  <Due id="eng3a" />
                  <span className="hall-card-go">继续学 ›</span>
                </div>
              </div>
              <Ring percent={badges.eng3a?.percent} tone="blue" />
            </Link>
          </div>
        </div>

        {/* ② 阅读区 —— 自选拓展，中卡三列 */}
        <div className="hall-section">
          <h2 className="hall-heading">
            <span className="hall-heading-emoji" aria-hidden="true">📖</span>
            阅读
            <span className="hall-heading-note">想读哪本就读哪本</span>
          </h2>

          <div className="hall-reading">
            <Link to={readingPath} className="rd-home-entry hall-card hall-card--read">
              <span className="hall-card-glyph" aria-hidden="true">📚</span>
              <div className="rd-home-body hall-card-body">
                <div className="rd-home-title">阅读小故事</div>
                <div className="rd-home-sub">{meta.labelZh} · {meta.lessonCount} 篇</div>
              </div>
            </Link>

            <Link to="/rocketgirl" className="rg-home-entry hall-card hall-card--read">
              <span className="hall-card-glyph" aria-hidden="true">🚀</span>
              <div className="rg-home-body hall-card-body">
                {/* ⚠️ 必须含「Rocket Girl 阅读」整串 —— tests/rocketgirl-reading.spec.ts:45
                用 toContainText('Rocket Girl 阅读') 断言。缩到「Rocket Girl」会红。 */}
                <div className="rg-home-title">Rocket Girl 阅读</div>
                <div className="rg-home-sub">
                  {rgStats ? `${rgStats.arcs} 个故事 / ${rgStats.stories} 段` : '故事阅读'}
                </div>
                <div className="hall-card-foot">
                  <Due id="rocketgirl" />
                </div>
              </div>
            </Link>

            <Link to="/flyguy" className="fg-home-entry hall-card hall-card--read">
              <span className="hall-card-glyph" aria-hidden="true">🐝</span>
              <div className="fg-home-body hall-card-body">
                <div className="fg-home-title">Fly Guy 绘本</div>
                <div className="fg-home-sub">
                  {fgStats ? `${fgStats.stories} 个故事 / ${fgStats.words} 词` : '分级绘本闯关'}
                </div>
                <div className="hall-card-foot">
                  <Due id="flyguy" />
                </div>
              </div>
              <Ring percent={badges.flyguy?.percent} tone="green" />
            </Link>
          </div>
        </div>

        {/* ③ 练习区 —— 工具性质，紧凑条横排，不占大块 */}
        <div className="hall-section">
          <h2 className="hall-heading">
            <span className="hall-heading-emoji" aria-hidden="true">✏️</span>
            练一练
          </h2>

          <div className="hall-tools">
            <Link to="/dictation" className="dt-home-entry hall-tool">
              <span className="hall-tool-emoji" aria-hidden="true">✍️</span>
              <span className="hall-tool-body">
                <span className="dt-home-title">听写练习</span>
                <span className="dt-home-sub">听音写词 · 自然拼读</span>
              </span>
            </Link>

            <Link to="/alphablocks" className="ab-home-entry hall-tool">
              <span className="hall-tool-emoji" aria-hidden="true">🧱</span>
              <span className="hall-tool-body">
                <span className="ab-home-title">字母积木</span>
                <span className="ab-home-sub">听音搭积木</span>
              </span>
            </Link>

            <Link to="/alphabet" className="hall-tool hall-tool--plain">
              <Type size={20} strokeWidth={1.9} aria-hidden="true" />
              <span className="hall-tool-body">
                <span className="hall-tool-title">字母表</span>
                <span className="hall-tool-sub">26 个字母发音</span>
              </span>
            </Link>

            <Link to="/progress" className="hall-tool hall-tool--plain">
              <ChartColumn size={20} strokeWidth={1.9} aria-hidden="true" />
              <span className="hall-tool-body">
                <span className="hall-tool-title">学习进度</span>
                <span className="hall-tool-sub">星星与成就</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}