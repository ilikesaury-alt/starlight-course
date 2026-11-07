// Starlight 1 · Level 1 数据总入口（试点单元：Unit 1）
// 本文件把 Unit 1 的各层数据聚合，并给出一个可直接接入 App 的 modules1（与 level-0 的 modules 同构）。
// 仅做数据层：接入 App 首页「等级切换」时，把 modules1 与 modules（level-0）按等级分组即可。

import type { Module } from '../starlight'
import type { ReadingPassage, SentenceFrame } from './shared'
import { lessonsByUnit1 } from './lessons'
import { STARLIGHT_BOOK1 } from './book'
import { READING_PASSAGES1, getReadingPassage1 } from './reading'
import { STARLIGHT_FRAMES1, UNIT1_FRAMES, framesOfLesson1 } from './sentenceFrames'
import { EXT_TOPICS1 } from './extensions'
import { u2_module, u2_frames, u2_reading } from './u2'
import { u3_module, u3_frames, u3_reading } from './u3'
import { u4_module, u4_frames, u4_reading } from './u4'
import { u5_module, u5_frames, u5_reading } from './u5'
import { u6_module, u6_frames, u6_reading } from './u6'
import { u7_module, u7_frames, u7_reading } from './u7'
import { u8_module, u8_frames, u8_reading } from './u8'
import { u9_module, u9_frames, u9_reading } from './u9'

export {
  lessonsByUnit1,
  STARLIGHT_BOOK1,
  READING_PASSAGES1,
  getReadingPassage1,
  STARLIGHT_FRAMES1,
  framesOfLesson1,
  EXT_TOPICS1,
}

/**
 * 句型框架卡：**按单元聚合**。
 * Unit 1 的卡在 sentenceFrames.ts，Unit 2–9 的卡分散在各自的 uN.ts 里
 * （u2_frames / u3_frames …）—— 之前只接了 Unit 1，等于 u2–u9 那些卡白放着。
 * 现按 unitId 归拢，缺哪一单元由调用方兜底（[] 表示这一课确实没有卡）。
 */
export const FRAMES_BY_UNIT1: Record<number, SentenceFrame[]> = {
  1: UNIT1_FRAMES,
  2: u2_frames,
  3: u3_frames,
  4: u4_frames,
  5: u5_frames,
  6: u6_frames,
  7: u7_frames,
  8: u8_frames,
  9: u9_frames,
}

/** 某课的句型框架卡（按 unitSlug + lessonId 精确过滤）。
 *
 *  ⚠️ 只扫**摊平总表**这一份，不要扫 FRAMES_BY_UNIT1 的各桶：
 *    早先尝试从 unitSlug 推 unitId（'u2' 之类），但第一册 slug 是
 *    'lola-the-doctor' 这类角色名，解析永远失败 → 退回全桶 flat()，
 *    总表 + 各桶各一份，每张卡返回两次，UI 渲染重复卡、SRS 重复播种。
 *    slug 全局唯一，直接按 slug 过滤就是最准也最省的做法。 */
export function framesOfLesson1Series(unitSlug: string, lessonId: number): SentenceFrame[] {
  return STARLIGHT_FRAMES1.filter((f) => f.unitSlug === unitSlug && f.lessonId === lessonId)
}

/**
 * 阅读短文：**按单元聚合**（键形同为 `${单元}-${课}`，与 Unit 1 的 READING_PASSAGES1 一致）。
 * Unit 2–9 的短文在各自的 uN_reading 里，之前没接。
 *
 * ⚠️ Unit 1 的桶只放 `1-*` 两篇：READING_PASSAGES1 是**摊平的总表**（另拼了 u2–u9
 * 的短文供 getReadingPassage1 用），整张塞进来会让 Unit 1 名下混进别的单元键，
 * 任何「遍历本桶」的逻辑都会读串。按前缀过滤成真正的 Unit 1 桶。
 */
const UNIT1_READINGS: Record<string, ReadingPassage> = Object.fromEntries(
  Object.entries(READING_PASSAGES1).filter(([key]) => key.startsWith('1-')),
)

export const READINGS_BY_UNIT1: Record<number, Record<string, ReadingPassage>> = {
  1: UNIT1_READINGS,
  2: u2_reading,
  3: u3_reading,
  4: u4_reading,
  5: u5_reading,
  6: u6_reading,
  7: u7_reading,
  8: u8_reading,
  9: u9_reading,
}

/** 某课的阅读短文（第一册专用；预备级走 src/data/reading） */
export function getReadingPassage1Series(unitId: number, lessonId: number): ReadingPassage | undefined {
  return READINGS_BY_UNIT1[unitId]?.[`${unitId}-${lessonId}`]
}

/** Level 1「Monty the Artist」单元（试点只放 Unit 1；后续照此补 Unit 2–9） */
export const modules1: Module[] = [
  {
    id: 1,
    slug: 'monty-the-artist',
    title: 'Monty the Artist',
    titleZh: '蒙蒂小画家',
    emoji: '🎨',
    color: '#F5B017',
    colorSoft: '#FFF3C4',
    preview: {
      goals: [
        '认识教室物品与数字，能用 I can see... / How many... 问答',
        '学会 10 种颜色并问答 What color is it? It\'s...',
        '学会文具名称，用 my / your 表达归属',
        '读懂美术课「蓝色手印」小故事，并学说自然拼读短音 i',
        '认识四种基本形状（圆 / 正方 / 三角 / 长方）',
      ],
      keyWords: 'chair, board, window, red, blue, yellow, pen, pencil, schoolbag, circle, square, triangle, rectangle',
      keySentences: "What color is it? It's blue. What's your name? I'm Monty. It's my pencil. This is a circle.",
      tip: '预习时找出家里的彩色物品、文具和形状，用英语边指边说；读「蓝色手印」故事时模仿角色语气。',
    },
    lessons: lessonsByUnit1[1],
    quiz: [
      { q: '它是什么颜色？🔵', options: ['blue', 'red', 'green'], answer: 0, explain: '蓝色是 blue。' },
      { q: 'Whose pen is this? 这支钢笔是谁的？🖊️', options: ["It's my pen.", "It's a book.", "It's blue."], answer: 0, explain: 'my = 我的。' },
      { q: '美术课上墙上的手印是什么颜色？✋', options: ['red', 'blue', 'yellow'], answer: 1, explain: '手印是蓝色的 blue。' },
      { q: '下面哪个是三角形？🔺', options: ['circle', 'square', 'triangle'], answer: 2, explain: '三角形是 triangle。' },
      { q: '字母 i 在 pig 里发什么音？🐷', options: ['/i/', '/a/', '/o/'], answer: 0, explain: 'pig 里的 i 发短音 /i/。' },
    ],
  },
  u2_module,
  u3_module,
  u4_module,
  u5_module,
  u6_module,
  u7_module,
  u8_module,
  u9_module,
]

export const STARLIGHT1 = {
  modules: modules1,
  lessonsByUnit: lessonsByUnit1,
  book: STARLIGHT_BOOK1,
  reading: READING_PASSAGES1,
  frames: STARLIGHT_FRAMES1,
  extensionTopics: EXT_TOPICS1,
}
