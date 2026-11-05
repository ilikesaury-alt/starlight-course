// Starlight 1 · Level 1 数据总入口（试点单元：Unit 1）
// 本文件把 Unit 1 的各层数据聚合，并给出一个可直接接入 App 的 modules1（与 level-0 的 modules 同构）。
// 仅做数据层：接入 App 首页「等级切换」时，把 modules1 与 modules（level-0）按等级分组即可。

import type { Module } from '../starlight'
import { lessonsByUnit1 } from './lessons'
import { STARLIGHT_BOOK1 } from './book'
import { READING_PASSAGES1, getReadingPassage1 } from './reading'
import { STARLIGHT_FRAMES1, framesOfLesson1 } from './sentenceFrames'
import { EXT_TOPICS1 } from './extensions'
import { u2_module } from './u2'
import { u3_module } from './u3'
import { u4_module } from './u4'
import { u5_module } from './u5'
import { u6_module } from './u6'
import { u7_module } from './u7'
import { u8_module } from './u8'
import { u9_module } from './u9'

export {
  lessonsByUnit1,
  STARLIGHT_BOOK1,
  READING_PASSAGES1,
  getReadingPassage1,
  STARLIGHT_FRAMES1,
  framesOfLesson1,
  EXT_TOPICS1,
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
