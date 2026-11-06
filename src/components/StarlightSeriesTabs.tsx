// Starlight 系列切换条 —— Starlight 是一个系列（预备级 / 第一册 / …）。
//
// 为什么要有：两册教材共用同一套页面（目录 → 单元 → 单课 → 测验 / 阅读），
// 顶部给一条「系列切换」，孩子和家长才看得出是**换了一本书**，
// 而不是跳到了一个不相干的页面。当前册高亮，未上架的册不出现。
//
// 样式沿用主课的下划线 Tab（.tab-bar 的语言），不另造一套控件。
// 路径可被覆盖：主课目录页用 STARLIGHT_LEVELS[].path（/starlight、/starlight1），
// 阅读模块用 /reading、/reading1 —— 同一条切换条，落到不同的目的地。

import { Link } from 'react-router-dom'
import {
  STARLIGHT_LEVELS,
  STARLIGHT_LEVEL_ORDER,
  type StarlightLevel,
} from '@/data/starlightSeries'

interface Props {
  current: StarlightLevel
  /** 覆盖册次目标路由；不传则用主课目录页的 path */
  paths?: Partial<Record<StarlightLevel, string>>
  /** aria-label，供同一页可能出现多条切换条时区分 */
  label?: string
}

export default function StarlightSeriesTabs({ current, paths, label = 'Starlight 系列' }: Props) {
  return (
    <nav className="sl-series" aria-label={label}>
      {STARLIGHT_LEVEL_ORDER.map((id) => {
        const meta = STARLIGHT_LEVELS[id]
        const on = id === current
        return (
          <Link
            key={id}
            to={paths?.[id] ?? meta.path}
            className={'sl-series-tab' + (on ? ' is-on' : '')}
            aria-current={on ? 'page' : undefined}
          >
            <span className="sl-series-title">{meta.bookTitle}</span>
            <span className="sl-series-sub">{meta.labelZh}</span>
          </Link>
        )
      })}
    </nav>
  )
}
