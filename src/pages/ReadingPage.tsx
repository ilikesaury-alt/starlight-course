// 📚 阅读模块（/reading）—— 把「每课阅读短文」从 LessonPreview 的 Tab 提升为独立入口。
//
// 单页聚合（用户已确认的形态）：
//   12 个单元用原生 <details> 折叠（默认全收起，96 篇不一次性铺满首屏）；
//   每个单元下列出该单元 8 课，点某一课**就地展开**阅读器（ReadingZone）。
//
// 视觉母题：「学过的词宝藏」（docs/specs/reading-ui-beautify.md）
//   这 96 篇短文全部只用本课学过的词写成 —— 这是本 app 独有的产物，
//   换成别家阅读 app 就不成立。所以整个页面围绕它组织：
//   · 首屏直接讲这件事（大标题，不塞在小注里），并给出**真实课表词**当宝藏示例；
//   · 每个单元挂一枚「💎 N 词」= 该单元课本词**去重**后的数量；
//   · 阅读器里本课词（.tt-word--mark）升级为「宝藏词」：静态金边/柔光，
//     交互时闪一下（复用品牌已有的 twinkle 动画）。
//
// 两个刻意的约束：
//   1. **一次只展开一篇**（受控 openKey）。多个 ReadingZone 同时挂载会有两条
//      「按句串行朗读」链互相抢占 speakService，表现是「点听整篇、两篇一起念」。
//   2. 阅读器逻辑零改动复用：ReadingZone 自带逐词点读 / 本课词高亮 / 逐句朗读 /
//      中文开关 / 慢速 / 记忆状态，这里只喂 passage + vocab + boxOf。
//
// 不做（沿用 docs/CONTEXT-阅读短文-已归档.md 的裁决）：不播种 SRS、不做理解测验、
// 不引跟读 STT、不持久化「已读」进度。

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/Breadcrumb'
import ZoneCard from '@/components/ZoneCard'
import ReadingZone from '@/components/ReadingZone'
import { modules } from '@/data/starlight'
import { getReadingPassage } from '@/data/reading'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'
import { useMemoryState } from '@/utils/memoryState'
import { useSlowMode } from '@/utils/slowMode'
import { speakText } from '@/utils/speak'
import { cleanForSpeak } from '@/utils/bookDict'

// 阅读模块专属主题色（靛蓝）：区别于主课暖橙、Rocket Girl 紫、英语蓝、听写青绿。
export const READING_THEME = { color: '#6366f1', colorSoft: '#eef2ff' } as const

const mcStyle = moduleThemeVars(READING_THEME)

// 首屏宝藏词示例：取自真实课表（Unit 1 的课本词），不是写死的装饰词。
// 为什么要真实词：首屏说「只用了你学过的词」，举的例子必须真是学过的词，
// 否则孩子点开发现不认识，母题就穿了。
// （单测会拿真实词表逐个校验这些词确实存在）
const HERO_TREASURE_WORDS = ['hello', 'friend', 'name', 'color', 'good']

export default function ReadingPage() {
  // 当前展开的那一篇（key 形如 '1-1'）；null = 全部收起
  const [openKey, setOpenKey] = useState<string | null>(null)
  const srsCards = useCourseStore((s) => s.srsCards)
  // 🧠 记忆状态着色的 CSS 是 `.sr-mem .tt-word--*`，开关本身在 PlayTools 里，
  // 但着色类必须由**页面根节点**挂上（LessonPreview 挂在 .lesson-shell 上）。
  // 不挂 = 开关能点、文案也变，但整篇一个字都不变色（假按钮）。
  const memOn = useMemoryState()
  // 首屏示例词的发音语速跟着全局慢速开关（和正文点词同一套语速）
  const slow = useSlowMode()

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0)

  // 每个单元的宝藏词数：本单元各课课本词**去重**后的数量。
  // 去重的原因：同一单元 8 课会反复出现 hello/name 这类共词，
  // 重复计数会让「💎 120 词」看着像虚数。
  const unitTreasures = useMemo(
    () =>
      new Map(
        modules.map((m) => [
          m.id,
          new Set(m.lessons.flatMap((l) => l.words.map((w) => w.en.toLowerCase()))).size,
        ])
      ),
    []
  )

  return (
    <div className={'page reading-module' + (memOn ? ' sr-mem' : '')} style={mcStyle}>
      <Breadcrumb items={[{ label: '🏠', to: '/' }, { label: '阅读小故事' }]} />

      <section className="rm-hero">
        <div className="rm-hero-emoji">📚</div>
        <div className="rm-hero-main">
          {/* h1 = 模块名（页面自己要说清这是哪一页，不只靠面包屑）。
              母题「只用了你学过的词」写成**大字陈述句**而不是标题：
              它是介绍性的一句话，不是另一个标题（标题只能有一个）。 */}
          <h1 className="rm-hero-title">阅读小故事</h1>
          <p className="rm-hero-statement">
            这些故事<b>只用了你学过的词</b>
          </p>
          <p className="rm-hero-sub">
            每节课配一段小故事，共 <b>{totalLessons}</b> 篇。
            点开一课自己读一遍，读不出的词点一下就能听发音。
          </p>
          {/* 宝藏词示例：真实课表词，且**真的能点、能发音**（复用同一条 TTS 链路）。 */}
          <div className="rm-hero-words" aria-label="学过的词示例">
            {HERO_TREASURE_WORDS.map((w) => (
              <button
                type="button"
                className="rm-hero-word"
                key={w}
                onClick={() => speakText(cleanForSpeak(w), { slow })}
                title="点一下听发音"
              >
                {w}
              </button>
            ))}
          </div>
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
              {/* 两枚徽章成组：作为一整块推到右侧，宽度不够时整组换行 */}
              <span className="rm-unit-badges">
                <span className="rm-unit-count">{m.lessons.length} 篇</span>
                <span className="rm-unit-treasure">
                  💎 {unitTreasures.get(m.id)} 词
                </span>
              </span>
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
                        <div className="empty rm-empty" data-testid="rm-empty">
                          <p className="rm-empty-emoji">📖</p>
                          <p className="rm-empty-title">这一课还没有阅读短文</p>
                          <p className="rm-empty-hint">
                            短文会跟着课文一课一课补上。先去这一课读课本，
                            等故事来了再回来看。
                          </p>
                        </div>
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