// Starlight 1 · Level 1 · Unit 1 句型框架卡（试点单元）
// 对应 level-0 的 src/data/sentenceFrame.ts（STARLIGHT_FRAMES）。
// 句型从 Unit 1 的 Language Focus 课（L6 颜色问答、L7 文具 + my/your、L9 形状）抽取。
// 数据完整性（空位数 = blanks 长度、answer 在 options 内、zhOptions 与 options 等长、id 全局唯一）
// 由 sentenceFrame.test.ts 的口径把关；本文件仅为 level-1 试点，未并入主 STARLIGHT_FRAMES。

import type { SentenceFrame } from '../sentenceFrame'
import { u2_frames } from './u2'
import { u3_frames } from './u3'
import { u4_frames } from './u4'
import { u5_frames } from './u5'
import { u6_frames } from './u6'
import { u7_frames } from './u7'
import { u8_frames } from './u8'
import { u9_frames } from './u9'

export const STARLIGHT_FRAMES1: SentenceFrame[] = [
  {
    id: 'l1-monty-6-color-q',
    pattern: 'What color is ___?',
    blanks: [
      {
        options: ['it', 'the book', 'the desk'],
        answer: 0,
        zhOptions: ['它是什么颜色？', '书是什么颜色？', '书桌是什么颜色？'],
      },
    ],
    zh: '它是什么颜色？',
    hint: '问物品的颜色',
    unitSlug: 'monty-the-artist',
    lessonId: 6,
  },
  {
    id: 'l1-monty-6-color-a',
    pattern: "It's ___.",
    blanks: [
      {
        options: ['red', 'blue', 'yellow', 'green', 'purple'],
        answer: 0,
        zhOptions: ['它是红色的。', '它是蓝色的。', '它是黄色的。', '它是绿色的。', '它是紫色的。'],
      },
    ],
    zh: '它是红色的。',
    hint: '回答颜色（It\'s = It is）',
    unitSlug: 'monty-the-artist',
    lessonId: 6,
  },
  {
    id: 'l1-monty-6-a-color',
    pattern: "It's a ___ ___.",
    blanks: [
      {
        options: ['red', 'blue', 'yellow'],
        answer: 0,
        zhOptions: ['红色的', '蓝色的', '黄色的'],
      },
      {
        options: ['book', 'desk', 'chair'],
        answer: 0,
        zhOptions: ['书', '书桌', '椅子'],
      },
    ],
    zh: '它是一本红色的书。',
    hint: 'a / an + 颜色 + 物品',
    unitSlug: 'monty-the-artist',
    lessonId: 6,
  },
  {
    id: 'l1-monty-7-my-your',
    pattern: "It's ___ pencil.",
    blanks: [
      {
        options: ['my', 'your'],
        answer: 0,
        zhOptions: ['它是我的铅笔。', '它是你的铅笔。'],
      },
    ],
    zh: '它是我的铅笔。',
    hint: 'my = 我的，your = 你的',
    unitSlug: 'monty-the-artist',
    lessonId: 7,
  },
  {
    id: 'l1-monty-7-whose',
    pattern: 'Whose is this ___?',
    blanks: [
      {
        options: ['pen', 'eraser', 'schoolbag'],
        answer: 0,
        zhOptions: ['这支钢笔是谁的？', '这块橡皮是谁的？', '这个书包是谁的？'],
      },
    ],
    zh: '这支钢笔是谁的？',
    hint: '询问物品归属',
    unitSlug: 'monty-the-artist',
    lessonId: 7,
  },
  {
    id: 'l1-monty-9-shape',
    pattern: 'This is a ___.',
    blanks: [
      {
        options: ['circle', 'square', 'triangle', 'rectangle'],
        answer: 0,
        zhOptions: ['这是一个圆形。', '这是一个正方形。', '这是一个三角形。', '这是一个长方形。'],
      },
    ],
    zh: '这是一个圆形。',
    hint: '指认形状',
    unitSlug: 'monty-the-artist',
    lessonId: 9,
  },
  ...u2_frames,
  ...u3_frames,
  ...u4_frames,
  ...u5_frames,
  ...u6_frames,
  ...u7_frames,
  ...u8_frames,
  ...u9_frames,
]

export function framesOfLesson1(unitSlug: string, lessonId: number): SentenceFrame[] {
  return STARLIGHT_FRAMES1.filter((f) => f.unitSlug === unitSlug && f.lessonId === lessonId)
}
