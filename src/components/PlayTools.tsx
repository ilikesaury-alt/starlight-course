// 课文详情页的统一播放工具条：🐢 慢速 + 🧠 记忆状态 + 说明文字。
//
// 替代原来散落各区的「每句/每词一个慢速按钮」——见 docs/lesson-detail-ui-research.md：
//   · 原来重点句型每句 2 个喇叭、外教对话每轮 2 个，一个 Tab 里 37 个发音按钮，
//     真正该点的「点词听发音」被同形按钮包围；
//   · TouchRead.js 设计原则 1「same pronunciation profile」：句级与词级朗读共用
//     同一套语速，所以慢速是**全局一个开关**，不是每句一个按钮。
//
// 两个开关都是纯内存态（src/utils/slowMode.ts / src/utils/memoryState.ts），不持久化，
// 刷新即复位，避免家长忘记关着慢速/满屏彩色底。

import { useSlowMode, toggleSlowMode } from '@/utils/slowMode'
import { useMemoryState, toggleMemoryState } from '@/utils/memoryState'

interface Props {
  /** 右侧说明文字，如「点单词听发音 · 带波浪线的是本课学过的词」 */
  hint?: React.ReactNode
  /** 额外插在按钮后的子节点（如「听整篇」「显示中文」等区块自己的操作） */
  children?: React.ReactNode
}

export default function PlayTools({ hint, children }: Props) {
  const slow = useSlowMode()
  const mem = useMemoryState()

  return (
    <div className="play-tools">
      {children}
      <button
        type="button"
        className={'btn btn-soft' + (slow ? ' active' : '')}
        onClick={() => toggleSlowMode()}
        aria-pressed={slow}
        title="慢速朗读：点词和整句都会放慢"
        data-testid="slow-toggle"
      >
        🐢 {slow ? '慢速中' : '慢速'}
      </button>
      <button
        type="button"
        className={'btn btn-soft' + (mem ? ' active' : '')}
        onClick={() => toggleMemoryState()}
        aria-pressed={mem}
        title="按记忆强度给单词上色：熟=绿 / 模糊=黄 / 未知=灰"
        data-testid="memory-toggle"
      >
        🧠 {mem ? '隐藏记忆色' : '记忆状态'}
      </button>
      {hint && <span className="play-tools-hint">{hint}</span>}
    </div>
  )
}
