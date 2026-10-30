// 📚 阅读模块（/reading）—— 把「每课阅读短文」从 LessonPreview 的 Tab 提升为独立入口。
//
// 单页聚合（用户已确认的形态）：
//   12 个单元用原生 <details> 折叠（默认全收起，96 篇不一次性铺满首屏）；
//   每个单元下列出该单元 8 课，点某一课**就地展开**阅读器（ReadingZone）。
//
// 两个刻意的约束：
//   1. **一次只展开一篇**（受控 openKey）。多个 ReadingZone 同时挂载会有两条
//      「按句串行朗读」链互相抢占 speakService，表现是「点听整篇、两篇一起念」。
//   2. 阅读器零改动复用：ReadingZone 自带逐词点读 / 本课词高亮 / 逐句朗读 /
//      中文开关 / 慢速 / 记忆状态，这里只喂 passage + vocab + boxOf。
//
// 不做（沿用 docs/CONTEXT-阅读短文-已归档.md 的裁决）：不播种 SRS、不做理解测验、
// 不引跟读 STT、不持久化「已读」进度。

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/Breadcrumb'
import ZoneCard from '@/components/ZoneCard'
import ReadingZone from '@/components/ReadingZone'
import { modules } from '@/data/starlight'
import { getReadingPassage } from '@/data/reading'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'
import { useMemoryState } from '@/utils/memoryState'

// 阅读模块专属主题色（靛蓝）：区别于主课暖橙、Rocket Girl 紫、英语蓝、听写青绿。
export const READING_THEME = { color: '#6366f1', colorSoft: '#eef2ff' } as const

const mcStyle = moduleThemeVars(READING_THEME)

export default function ReadingPage() {
  // 当前展开的那一篇（key 形如 '1-1'）；null = 全部收起
  const [openKey, setOpenKey] = useState<string | null>(null)
  const srsCards = useCourseStore((s) => s.srsCards)
  // 🧠 记忆状态着色的 CSS 是 `.sr-mem .tt-word--*`，开关本身在 PlayTools 里，
  // 但着色类必须由**页面根节点**挂上（LessonPreview 挂在 .lesson-shell 上）。
  // 不挂 = 开关能点、文案也变，但整篇一个字都不变色（假按钮）。
  const memOn = useMemoryState()

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0)

  return (
    <div className={'page reading-module' + (memOn ? ' sr-mem' : '')} style={mcStyle}>
      <Breadcrumb items={[{ label: '🏠', to: '/' }, { label: '阅读小故事' }]} />

      <section className="rm-hero">
        <div className="rm-hero-emoji">📚</div>
        <div>
          <h1 className="rm-hero-title">阅读小故事</h1>
          <p className="rm-hero-sub">
            每节课配一段用<b>学过的词</b>写的小故事，共 <b>{totalLessons}</b> 篇。
            <br />
            点开一课自己读一遍，读不出的词点一下就能听发音。
          </p>
        </div>
      </section>

      <div className="rm-units">
        {modules.map((m) => (
          <details
            className="rm-unit"
            key={m.slug}
            data-unit={m.id}
            // 原生 <details> 收起只是把子树**藏起来**，不卸载组件。若不在收起时清掉
            // openKey，阅读器会继续按句朗读，而 ⏸ 停止朗读按钮随内容隐入折叠区，
            // 屏幕上看不到任何能停的地方（Cross-review 抓到的 P1）。
            onToggle={(e) => {
              if (!e.currentTarget.open && openKey?.startsWith(`${m.id}-`)) setOpenKey(null)
            }}
          >
            <summary className="rm-unit-head">
              <span className="rm-unit-emoji">{m.emoji}</span>
              <span className="rm-unit-title">Module {m.id} · {m.title}</span>
              <span className="rm-unit-zh">{m.titleZh}</span>
              <span className="rm-unit-count">{m.lessons.length} 篇</span>
            </summary>

            <div className="rm-lessons">
              {m.lessons.map((l) => {
                const key = `${m.id}-${l.id}`
                const passage = getReadingPassage(m.id, l.id)
                const open = openKey === key
                return (
                  <div className={'rm-lesson-wrap' + (open ? ' is-open' : '')} key={key}>
                    <button
                      type="button"
                      className={'rm-lesson' + (open ? ' is-open' : '')}
                      data-testid={`rm-lesson-${key}`}
                      aria-expanded={open}
                      onClick={() => setOpenKey(open ? null : key)}
                    >
                      <span className="rm-lesson-num">{l.id}</span>
                      <span className="rm-lesson-body">
                        <span className="rm-lesson-title">{l.title}</span>
                        <span className="rm-lesson-zh">{l.titleZh}</span>
                      </span>
                      <span className="rm-lesson-meta">{l.words.length} 词</span>
                      <span className="rm-lesson-arrow">{open ? '收起 ▲' : '读一读 ›'}</span>
                    </button>

                    {open && (
                      passage ? (
                        <ZoneCard
                          title={`📚 Lesson ${l.id} · ${passage.title}`}
                          side="🧒 自己读一遍 · 点词听发音"
                          mcStyle={mcStyle}
                          className="rm-reader"
                          // 不用 ZoneCard 自带的折叠：它收起的只是 body，阅读器仍在挂载，
                          // 会出现「内容看不见、声音还在念」。收起职责统一归课卡片按钮。
                          collapsible={false}
                        >
                          <ReadingZone
                            passage={passage}
                            vocab={l.words}
                            boxOf={(en) => srsCards[en]?.box}
                          />
                        </ZoneCard>
                      ) : (
                        // 96 篇目前是全的；保留空态，避免未来某课缺数据时
                        // 「按钮写着收起 ▲、点了什么都没有」的静默失败
                        <div className="empty"><p>这一课还没有阅读短文。</p></div>
                      )
                    )}
                  </div>
                )
              })}
            </div>
          </details>
        ))}
      </div>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}