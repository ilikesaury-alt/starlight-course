// 外教上课对话库（96 课，按「单元号-课号」命名）
// 结合每课单词与句型，想象外教一对一上课时可能说的话：热身 → 带新词 → 练句型 → 玩游戏 → 闭环复述。
// 数据口径与 lessons.ts 完全一致：改课文请先改 lessons.ts，再同步这里。
// speaker: T = 外教老师, S = 学生（孩子）

export interface DialogueTurn {
  speaker: 'T' | 'S'
  /** 英文台词 */
  en: string
  /** 中文对照（家长/孩子看不懂时的兜底） */
  zh?: string
  /** 教学提示，如「（展示胖猫图片）」，渲染时用斜体小字 */
  note?: string
}

export interface LessonDialogue {
  title: string
  turns: DialogueTurn[]
}

import { unit1 } from './dialogue/unit1'
import { unit2 } from './dialogue/unit2'
import { unit3 } from './dialogue/unit3'
import { unit4 } from './dialogue/unit4'
import { unit5 } from './dialogue/unit5'
import { unit6 } from './dialogue/unit6'
import { unit7 } from './dialogue/unit7'
import { unit8 } from './dialogue/unit8'
import { unit9 } from './dialogue/unit9'
import { unit10 } from './dialogue/unit10'
import { unit11 } from './dialogue/unit11'
import { unit12 } from './dialogue/unit12'

/** 全部 96 课对话，key 形如 '5-5' */
export const LESSON_DIALOGUE: Record<string, LessonDialogue> = {
  ...unit1,
  ...unit2,
  ...unit3,
  ...unit4,
  ...unit5,
  ...unit6,
  ...unit7,
  ...unit8,
  ...unit9,
  ...unit10,
  ...unit11,
  ...unit12,
}

/** 取某课对话；没有时返回 undefined，由调用方决定回落展示 */
export function getLessonDialogue(unitId: number, lessonId: number): LessonDialogue | undefined {
  return LESSON_DIALOGUE[`${unitId}-${lessonId}`]
}
