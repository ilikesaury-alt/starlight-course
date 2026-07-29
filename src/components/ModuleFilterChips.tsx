import type { CSSProperties } from 'react'
import { MODULE_LIST, type ModuleId } from '../data/modules'

/** 模块筛选值：某个具体模块或「全部」 */
export type ModuleFilter = ModuleId | 'all'

interface Props {
  value: ModuleFilter
  onChange: (f: ModuleFilter) => void
  /**
   * 各模块的数量；传入后：
   * - 数量为 0 的模块不显示
   * - 有数量的模块标签后追加数量，如「Fly Guy 3」
   * 不传则显示全部模块、不带数量（如智能复习页）。
   */
  counts?: Partial<Record<ModuleId, number>>
}

/**
 * 模块筛选 chips（智能复习 / 错题本等页面共用）。
 * 统一「全部 + 各模块」的渲染、active 态与模块主题色，消除复制。
 */
export default function ModuleFilterChips({ value, onChange, counts }: Props) {
  return (
    <div className="filter-chips">
      <button
        type="button"
        className={'chip' + (value === 'all' ? ' active' : '')}
        onClick={() => onChange('all')}
      >
        全部
      </button>
      {MODULE_LIST.map((m) => {
        const count = counts ? (counts[m.id] ?? 0) : 0
        if (counts && count === 0) return null
        return (
          <button
            key={m.id}
            type="button"
            className={'chip' + (value === m.id ? ' active' : '')}
            style={{ '--mc': m.color, '--mc-soft': m.colorSoft } as CSSProperties}
            onClick={() => onChange(m.id)}
          >
            {m.labelZh}{counts ? ` ${count}` : ''}
          </button>
        )
      })}
    </div>
  )
}
