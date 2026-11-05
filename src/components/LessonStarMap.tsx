// 课次星图 —— Oxford Starlight 系列独有的「单元 × 课」目录。
//
// 这不是进度条：每一格就是教材里真实存在的一课，格子排布就是这本课本的目录本身。
// 状态完全由 store.lessonCompleted 派生，不引入新状态；总数与已完成数从同一份
// modules 数据算出，保证「已完成 N / 96 课」与格子永远对得上（app-screens.md §2.1）。
//
// 用途：
//   /starlight        → 预备级的 12 单元 96 格全图，孩子一眼看到学到哪了
//   /starlight1       → 第一册的 9 单元 96 格全图
//   /preview/:unitId  → 本单元的格子，当前课描边高亮
// 每个格子都是真实链接，点一下直达那一课（一击可达，§2.2）。
//
// 册次：两册教材的单元号都从 1 开始，图形/课文都按册分发，所以这里必须带 level。

import { Link } from 'react-router-dom'
import { type StarlightLevel } from '@/data/starlightSeries'
import { getSeriesModule, modulesOfLevel } from '@/data/starlightSeriesData'
import { useCourseStore } from '@/store/useCourseStore'

interface Props {
  /** 只画某一个单元的格子；不传则画整册全图 */
  unitSlug?: string
  /** 描边高亮「当前正在看的课」 */
  currentLessonId?: number
  /** 画哪一册（不传 unitSlug 时决定全图是哪册；传了 unitSlug 时自动按 slug 判册） */
  level?: StarlightLevel
}

export default function LessonStarMap({ unitSlug, currentLessonId, level = 'starlight' }: Props) {
  const lessonCompleted = useCourseStore((s) => s.lessonCompleted)
  // 传了 unitSlug 就以 slug 判册（slug 全局唯一），避免页面的默认 level 与实际单元不符
  const resolvedLevel = unitSlug ? (getSeriesModule(unitSlug)?.level ?? level) : level
  const list = unitSlug
    ? modulesOfLevel(resolvedLevel).filter((m) => m.slug === unitSlug)
    : modulesOfLevel(resolvedLevel)

  const isDone = (slug: string, id: number) => (lessonCompleted[slug] ?? []).includes(id)
  const total = list.reduce((n, m) => n + m.lessons.length, 0)
  const done = list.reduce(
    (n, m) => n + m.lessons.filter((l) => isDone(m.slug, l.id)).length,
    0
  )
  // 目录意义上的「下一课」：按单元→课顺序第一个未完成的课
  let next: { slug: string; id: number; title: string } | undefined
  for (const m of list) {
    const l = m.lessons.find((x) => !isDone(m.slug, x.id))
    if (l) { next = { slug: m.slug, id: l.id, title: l.title }; break }
  }

  return (
    <section className="sl-map" aria-label="课次星图">
      <div className="sl-map-head">
        <h2 className="sl-map-title">
          {unitSlug ? `这一单元的 ${total} 课` : `这本教材的 ${total} 课`}
        </h2>
        <p className="sl-map-total">
          已完成 <b>{done}</b> / {total} 课
          {done === 0 && <span className="sl-map-note"> · 从第一课开始吧</span>}
        </p>
      </div>

      <div className="sl-map-rows">
        {list.map((m) => (
          <div className="sl-map-row" key={m.slug}>
            <div className="sl-map-label">
              <span className="sl-map-unit">M{m.id}</span>
              <span className="sl-map-topic">{m.titleZh}</span>
            </div>
            <div className="sl-map-cells">
              {m.lessons.map((l) => {
                const finished = isDone(m.slug, l.id)
                const current = currentLessonId === l.id
                return (
                  <Link
                    key={l.id}
                    to={`/preview/${m.slug}/${l.id}`}
                    className={
                      'sl-map-cell' +
                      (finished ? ' is-done' : '') +
                      (current ? ' is-current' : '')
                    }
                    aria-label={`Module ${m.id} Lesson ${l.id} ${l.title}${finished ? '，已完成' : ''}`}
                    title={`Lesson ${l.id} · ${l.title}${finished ? ' · 已完成' : ''}`}
                  >
                    <span className="sl-map-num">{l.id}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {next && (
        <Link className="sl-map-next" to={`/preview/${next.slug}/${next.id}`}>
          继续 Lesson {next.id} · {next.title} <span aria-hidden="true">→</span>
        </Link>
      )}
    </section>
  )
}
