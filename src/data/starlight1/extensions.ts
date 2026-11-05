// Starlight 1 · Level 1 · Unit 1 拓展词主题库（试点单元）
// 对应 level-0 的 src/data/extensionTopics.ts（TOPICS）。
// 主题按 Unit 1「Monty the Artist」的场景配套；词库只存 en / zh / emoji（ipa 由读音引擎负责）。
// 后续并入主 TOPICS 时，可直接 spread 进对应主题或新增主题键。
// 自动填充上限 EXT_LIMIT = 5（与 level-0 共用同一常量，运行时过滤课内词与已录词）。

import type { ExtTopic } from './shared'
import { w } from './shared'
import { u2_ext } from './u2'
import { u3_ext } from './u3'
import { u4_ext } from './u4'
import { u5_ext } from './u5'
import { u6_ext } from './u6'
import { u7_ext } from './u7'
import { u8_ext } from './u8'
import { u9_ext } from './u9'

export type { ExtTopic }

export const EXT_TOPICS1: Record<string, ExtTopic> = {
  ...u2_ext,
  ...u3_ext,
  ...u4_ext,
  ...u5_ext,
  ...u6_ext,
  ...u7_ext,
  ...u8_ext,
  ...u9_ext,
  classroom: {
    zh: '教室物品',
    words: [
      w('chair', '椅子', '🪑'), w('board', '黑板', '🟫'), w('window', '窗户', '🪟'),
      w('desk', '书桌', '🪑'), w('door', '门', '🚪'), w('book', '书', '📕'),
      w('trash can', '垃圾桶', '🗑️'),
    ],
  },
  'school-things': {
    zh: '文具',
    words: [
      w('pen', '钢笔', '🖊️'), w('pencil', '铅笔', '✏️'), w('pencil case', '铅笔盒', '📦'),
      w('schoolbag', '书包', '🎒'), w('eraser', '橡皮', '🧽'), w('paint', '颜料', '🎨'),
      w('ruler', '尺子', '📏'),
    ],
  },
  shapes: {
    zh: '形状',
    words: [
      w('circle', '圆形', '⭕'), w('square', '正方形', '🟦'), w('triangle', '三角形', '🔺'),
      w('rectangle', '长方形', '▭'), w('star', '星形', '⭐'), w('heart', '心形', '❤️'),
    ],
  },
  art: {
    zh: '美术与艺术',
    words: [
      w('painting', '画作', '🖼️'), w('butterfly', '蝴蝶', '🦋'), w('handprint', '手印', '✋'),
      w('wall', '墙', '🧱'), w('artist', '艺术家', '🎨'), w('colorful', '色彩丰富的', '🌈'),
      w('picture', '图画', '🖼️'),
    ],
  },
}
