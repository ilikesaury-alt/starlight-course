// Starlight 系列切换条 —— Starlight 是一个系列（预备级 / 第一册 / …）。
//
// 为什么要有：两册教材共用同一套页面（目录 → 单元 → 单课 → 测验），
// 顶部给一条「系列切换」，孩子和家长才看得出是**换了一本书**，
// 而不是跳到了一个不相干的页面。当前册高亮，未上架的册不出现。
//
// 样式沿用主课的下划线 Tab（.tab-bar 的语言），不另造一套控件。

import { Link } from 'react-router-dom'
import {
  STARLIGHT_LEVELS,
  STARLIGHT_LEVEL_ORDER,
  type StarlightLevel,
} from '@/data/starlightSeries'

export default function StarlightSeriesTabs({ current }: { current: StarlightLevel }) {
  return (
    <nav className="sl-series" aria-label="Starlight 系列">
      {STARLIGHT_LEVEL_ORDER.map((id) => {
        const meta = STARLIGHT_LEVELS[id]
        const on = id === current
        return (
          <Link
            key={id}
            to={meta.path}
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
