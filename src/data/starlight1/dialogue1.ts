// 第一册（Starlight 1）外教课堂对话数据层 + 校验口径。
//
// 与预备级 src/data/lessonDialogue.ts 分工：那边是 level-0 的 96 课对话，
// 两册单元号都从 1 开始，混在一张表里查会串书，所以第一册独立一份表、独立 getter，
// 由 starlightSeriesData.ts 的 seriesDialogue() 按 level 分发。
//
// 复用预备级的 LessonDialogue / DialogueTurn 类型（结构相同），
// 不重复定义，UI 组件 LessonDialogueBox 也就零改动。
//
// 校验口径见 src/data/starlight1/dialogue1.test.ts 与 scripts/check-dialogue1.mjs，
// 两边都调这里的 validateDialogue1()，生成与单测不会漂移。

import type { LessonDialogue } from '../lessonDialogue'
import { lessonsByUnit1 } from './lessons'
import { u1_dialogue } from './dialogue/u1'
import { u2_dialogue } from './dialogue/u2'
import { u3_dialogue } from './dialogue/u3'
import { u4_dialogue } from './dialogue/u4'
import { u5_dialogue } from './dialogue/u5'
import { u6_dialogue } from './dialogue/u6'
import { u7_dialogue } from './dialogue/u7'
import { u8_dialogue } from './dialogue/u8'
import { u9_dialogue } from './dialogue/u9'

export type { LessonDialogue, DialogueTurn } from '../lessonDialogue'

/** 全册 96 课对话，key 形如 '2-5'。与预备级 LESSON_DIALOGUE 分开，避免单元号串书。 */
export const LESSON_DIALOGUE1: Record<string, LessonDialogue> = {
  ...u1_dialogue,
  ...u2_dialogue,
  ...u3_dialogue,
  ...u4_dialogue,
  ...u5_dialogue,
  ...u6_dialogue,
  ...u7_dialogue,
  ...u8_dialogue,
  ...u9_dialogue,
}

export function getLessonDialogue1(unitId: number, lessonId: number): LessonDialogue | undefined {
  return LESSON_DIALOGUE1[`${unitId}-${lessonId}`]
}

/** 96 课的 key 全集（单元号-课号），用作「对话是否课课都有」的判定基准 */
export function allDialogueKeys1(): string[] {
  const keys: string[] = []
  for (const [unitId, lessons] of Object.entries(lessonsByUnit1)) {
    for (const lesson of lessons) keys.push(`${unitId}-${lesson.id}`)
  }
  return keys
}

/** 轮次下限/上限：预备级实测 10~15 轮（平均 12），第一册按同一节奏 */
export const TURNS_MIN = 10
export const TURNS_MAX = 15

/**
 * 单课对话的完整校验，返回问题列表（空 = 通过）。
 * 对话是「外教一对一上课时的可能台词」，不是阅读短文：
 * 老师会用到课堂用语，故不要求零超纲；本课词也不硬性 100% 出现
 * （预备级 96 课里只有 73 课全覆），只要求覆盖过半，免得对话跟本课脱钩。
 */
export function validateDialogue1(d: LessonDialogue | undefined, unitId: number, lessonId: number): string[] {
  const errs: string[] = []
  if (!d) return ['缺少对话']
  if (!d.title?.trim()) errs.push('缺标题')
  const turns = d.turns ?? []
  if (turns.length < TURNS_MIN || turns.length > TURNS_MAX) {
    errs.push(`轮次 ${turns.length} 不在 ${TURNS_MIN}~${TURNS_MAX}`)
  }
  const speakers = new Set<string>()
  const cnPunct = /[\u3000-\u303f\uff00-\uffef]/
  const seen = new Set<string>()
  for (const [i, t] of turns.entries()) {
    if (!t) { errs.push(`第 ${i + 1} 轮为空`); continue }
    if (t.speaker !== 'T' && t.speaker !== 'S') errs.push(`第 ${i + 1} 轮 speaker=${t.speaker} 非法`)
    else speakers.add(t.speaker)
    if (!t.en?.trim()) errs.push(`第 ${i + 1} 轮缺英文`)
    if (!t.zh?.trim()) errs.push(`第 ${i + 1} 轮缺中文对照`)
    if (cnPunct.test(t.en ?? '')) errs.push(`第 ${i + 1} 轮英文混入中文标点: ${t.en}`)
    const norm = (t.en ?? '').toLowerCase().trim().replace(/\s+/g, ' ')
    if (seen.has(norm)) errs.push(`第 ${i + 1} 轮台词重复: ${t.en}`)
    seen.add(norm)
  }
  if (!speakers.has('T')) errs.push('没有外教(T)台词')
  if (!speakers.has('S')) errs.push('没有孩子(S)台词')

  // 本课词覆盖过半（多词词条按空格拆，每部分都出现才算命中）
  const words = (lessonsByUnit1[unitId]?.find((l) => l.id === lessonId)?.words ?? []).map((w) => w.en.toLowerCase())
  if (words.length) {
    const full = turns.map((t) => (t?.en ?? '').toLowerCase()).join(' ')
    const hit = words.filter((w) => w.split(' ').every((p) => full.includes(p))).length
    if (hit / words.length < 0.6) {
      const missing = words.filter((w) => !w.split(' ').every((p) => full.includes(p)))
      errs.push(`本课词覆盖 ${hit}/${words.length}（需 ≥60%），缺: ${missing.join(', ')}`)
    }
  }
  return errs
}
