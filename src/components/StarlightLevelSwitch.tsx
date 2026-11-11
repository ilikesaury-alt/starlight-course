// Starlight 册次切换条 —— 首页 / 课程中心共用的「等级切换」。
//
// 为什么要有：Starlight 是两册系列，首页原来把「预备级主课 / 第一册主课 /
// 预备级阅读 / 第一册阅读」摆成四张卡，孩子和家长看不出这是**同一套课程的两本书**，
// 还把首屏宫格占了四格。现在收敛成「一条切换条 + 两张卡」：选哪一册，
// 主课卡和阅读卡就一起换到哪一册（链接、文案、进度徽章同步）。
//
// ⚠️ 刻意零教材数据依赖：只从 starlightSeries.ts 取册次元信息，
// 本组件被首页首屏引用，import 任何教材数据都会把课程 chunk 拖进首屏。
//
// 状态放在 localStorage（不放 Zustand）：册次只是「这次打开想看哪本」的视图偏好，
// 不是学习进度，不参与 persist 版本号，也不该混进进度统计（读写见 data/homeLevel.ts）。

import {
  STARLIGHT_LEVELS,
  STARLIGHT_LEVEL_ORDER,
  type StarlightLevel,
} from '@/data/starlightSeries'

export default function StarlightLevelSwitch({
  current,
  onChange,
}: {
  current: StarlightLevel
  onChange: (level: StarlightLevel) => void
}) {
  return (
    <div className="sl-level-switch" role="group" aria-label="Starlight 册次">
      <span className="sl-level-switch-label">Starlight 系列</span>
      <div className="sl-level-switch-opts">
        {STARLIGHT_LEVEL_ORDER.map((id) => {
          const meta = STARLIGHT_LEVELS[id]
          const on = id === current
          return (
            <button
              key={id}
              type="button"
              className={'sl-level-opt' + (on ? ' is-on' : '')}
              aria-pressed={on}
              data-level={id}
              onClick={() => onChange(id)}
            >
              <span className="sl-level-title">{meta.labelZh}</span>
              <span className="sl-level-sub">{meta.bookTitle}</span>
            </button>
          )
        })}
      </div>
      <span className="sl-level-switch-hint">切换册次，下面的入口会一起换</span>
    </div>
  )
}
