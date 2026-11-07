// 📚 阅读模块共享组件 —— 预备级与第一册共用同一套页面，只换「数据源」。
//
// Starlight 是一个系列：/reading（预备级，96 篇）与 /reading1（第一册，96 篇）
// 渲染的是同一个组件，差别只在传入的 ReadingSource。这样不写第二套页面，
// 首屏母题、阅读器、e2e 契约全部只有一份。
//
// 单页聚合（用户已确认的形态）：
//   单元用原生 <details> 折叠（默认全收起，短文不一次性铺满首屏）；
//   每个单元下列出该单元的课，点某一课**就地展开**阅读器（ReadingZone）。
//
// 视觉母题：「学过的词宝藏」
//   · 首屏直接讲这件事（大标题，不塞在小注里），举的例子是**该册 Unit 1 真实课表词**；
//   · 每个单元挂一枚「💎 N 词」= 该单元课本词**去重**后的数量，展开可逐个点发音；
//   · 阅读器里本课词升级为「宝藏词」：静态金边/柔光，交互时闪一下。
//
// 两个刻意的约束：
//   1. **一次只展开一篇**（受控 openKey）。多个 ReadingZone 同时挂载会有两条
//      「按句串行朗读」链互相抢占 speakService，表现是「点听整篇、两篇一起念」。
//   2. 阅读器逻辑零改动复用：ReadingZone 自带逐词点读 / 本课词高亮 / 逐句朗读 /
//      中文开关 / 慢速 / 记忆状态，这里只喂 passage + vocab + boxOf。
//
// 不做：不播种 SRS、不做理解测验、不引跟读 STT、不持久化「已读」进度。

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Gem } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import ZoneCard from '@/components/ZoneCard'
import ReadingZone from '@/components/ReadingZone'
import UnitGlyph from '@/components/UnitGlyph'
import StarlightSeriesTabs from '@/components/StarlightSeriesTabs'
import {
  READING_PATHS,
  READING_THEME,
  readingHeroWords,
  readingLessonsOf,
  readingStoryCount,
  type ReadingSource,
} from '@/data/readingSeries'
import { STARLIGHT_LEVELS } from '@/data/starlightSeries'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'
import { useMemoryState } from '@/utils/memoryState'
import { useSlowMode } from '@/utils/slowMode'
import { speakText } from '@/utils/speak'
import { cleanForSpeak } from '@/utils/bookDict'

const mcStyle = moduleThemeVars(READING_THEME)

export default function ReadingBook({ source }: { source: ReadingSource }) {
  // 当前展开的那一篇（key 形如 '1-1'）；null = 全部收起
  const [openKey, setOpenKey] = useState<string | null>(null)
  const srsCards = useCourseStore((s) => s.srsCards)
  // 🧠 记忆状态着色的 CSS 是 `.sr-mem .tt-word--*`，着色类必须由**页面根节点**挂上。
  const memOn = useMemoryState()
  const slow = useSlowMode()

  const { level, mods, passageOf } = source
  const levelMeta = STARLIGHT_LEVELS[level]
  const storyCount = useMemo(() => readingStoryCount(source), [source])
  const heroWords = useMemo(() => readingHeroWords(source), [source])

  // 每个单元的宝藏词：本单元各课课本词**去重**后的词表。
  // 去重的原因：同一单元会反复出现共词，重复计数会让「💎 120 词」看着像虚数。
  const unitTreasures = useMemo(
    () =>
      new Map(
        mods.map((m) => {
          const seen = new Set<string>()
          const words: { en: string; zh: string; emoji?: string }[] = []
          for (const l of m.lessons) {
            for (const w of l.words) {
              const k = w.en.toLowerCase()
              if (seen.has(k)) continue
              seen.add(k)
              words.push(w)
            }
          }
          return [m.id, words] as const
        })
      ),
    [mods]
  )

  const distinctWords = mods.reduce((n, m) => n + (unitTreasures.get(m.id)?.length ?? 0), 0)

  return (
    <div className={'page reading-module reading-sheet' + (memOn ? ' sr-mem' : '')} style={mcStyle}>
      <Breadcrumb items={[{ label: '🏠', to: '/' }, { label: '阅读小故事' }, ...(level === 'starlight1' ? [{ label: levelMeta.labelZh }] : [])]} />

      <section className="rm-hero">
        <div className="rm-hero-main">
          <h1 className="rm-hero-title">阅读小故事</h1>
          <p className="rm-hero-statement">
            这些故事<b>只用了你学过的词</b>
          </p>
          <p className="rm-hero-sub">
            {level === 'starlight1' ? (
              <>
                第一册的小故事正跟着阅读课<b>一课一课补上</b>，现在收录 <b>{storyCount}</b> 篇 · {mods.length} 个单元 ·{' '}
                {distinctWords} 个不同的词。点开一课自己读一遍，读不出的词点一下就能听发音。
              </>
            ) : (
              <>
                每节课配一段小故事，共 <b>{storyCount}</b> 篇 · {mods.length} 个单元 ·{' '}
                {distinctWords} 个不同的词。
                点开一课自己读一遍，读不出的词点一下就能听发音。
              </>
            )}
          </p>
          {/* 宝藏词示例：该册 Unit 1 的真实课表词，且真的能点、能发音 */}
          <div className="rm-hero-words" aria-label="学过的词示例">
            {heroWords.map((w) => (
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

      {/* 系列切换：预备级 / 第一册。路径落到阅读模块自己的两个路由 */}
      <StarlightSeriesTabs current={level} paths={READING_PATHS} label="Starlight 系列 · 阅读" />

      <div className="rm-units">
        {mods.map((m) => {
          // 只列出真正有短文的课：预备级 96 篇全有；第一册按阅读课收录，
          // 其余词汇/拼读/CLIL 课不摆「读一读」死链。
          const lessons = readingLessonsOf(source, m)
          return (
          <details
            className="rm-unit"
            key={m.slug}
            data-unit={m.id}
            // 原生 <details> 收起只是把子树**藏起来**，不卸载组件。若不在收起时清掉
            // openKey，阅读器会继续按句朗读，而 ⏸ 停止朗读按钮随内容隐入折叠区。
            onToggle={(e) => {
              if (!e.currentTarget.open && openKey?.startsWith(`${m.id}-`)) setOpenKey(null)
            }}
          >
            <summary className="rm-unit-head">
              <span className="rm-unit-emoji">
                <UnitGlyph
                  unitId={m.id}
                  level={level}
                  fallback={m.emoji}
                  color={m.color}
                  soft={m.colorSoft}
                  size={26}
                />
              </span>
              <span className="rm-unit-title">Module {m.id} · {m.title}</span>
              <span className="rm-unit-zh">{m.titleZh}</span>
              <span className="rm-unit-badges">
                <span className="rm-unit-count">{lessons.length} 篇</span>
                <span className="rm-unit-treasure">
                  <Gem size={14} aria-hidden="true" />
                  {unitTreasures.get(m.id)?.length ?? 0} 词
                </span>
              </span>
            </summary>

            <div className="rm-treasure-list" aria-label={`Module ${m.id} 的课本词`}>
              {(unitTreasures.get(m.id) ?? []).map((w) => (
                <button
                  type="button"
                  className="rm-treasure-word"
                  key={w.en}
                  onClick={() => speakText(cleanForSpeak(w.en), { slow })}
                  title={`${w.zh} · 点一下听发音`}
                >
                  {w.en}
                </button>
              ))}
            </div>

            <div className="rm-lessons">
              {lessons.map((l) => {
                const key = `${m.id}-${l.id}`
                const passage = passageOf(m.id, l.id)
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
                          collapsible={false}
                        >
                          <ReadingZone
                            passage={passage}
                            vocab={l.words}
                            boxOf={(en) => srsCards[en]?.box}
                          />
                        </ZoneCard>
                      ) : (
                        // 兜底：readingLessonsOf 已保证列出的课都有短文；
                        // 保留空态，防止将来数据回退时出现「按钮写着收起、点了没反应」
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
          )
        })}
      </div>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
