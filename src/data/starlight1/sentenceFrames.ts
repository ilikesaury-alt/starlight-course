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

// Unit 1 专有卡（其余单元的卡在各自 uN.ts 的 uN_frames 里）。
// 单独导出，别把摊平总表当成 Unit 1 的桶 —— index.ts 的 FRAMES_BY_UNIT1[1] 要用这个。
export const UNIT1_FRAMES: SentenceFrame[] = [
  {
    id: 'l1-monty-the-artist-1-see',
    pattern: 'I can see a ___.',
    blanks: [
      {
        options: ['chair', 'board', 'window', 'trash can'],
        answer: 0,
        zhOptions: ['我看见一把椅子。', '我看见一块黑板。', '我看见一扇窗户。', '我看见一个垃圾桶。'],
      },
    ],
    zh: '我看见一把椅子。',
    hint: 'I can see a ... 说出看到的物品',
    unitSlug: 'monty-the-artist',
    lessonId: 1,
  },
  {
    id: 'l1-monty-the-artist-2-color',
    pattern: "It's ___.",
    blanks: [
      {
        options: ['red', 'black', 'green', 'white', 'purple'],
        answer: 0,
        zhOptions: ['它是红色的。', '它是黑色的。', '它是绿色的。', '它是白色的。', '它是紫色的。'],
      },
    ],
    zh: '它是红色的。',
    hint: "It's + 颜色 回答颜色",
    unitSlug: 'monty-the-artist',
    lessonId: 2,
  },
  {
    id: 'l1-monty-the-artist-3-paint',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['paint', 'pen', 'eraser', 'schoolbag'],
        answer: 0,
        zhOptions: ['这是我的颜料。', '这是我的钢笔。', '这是我的橡皮。', '这是我的书包。'],
      },
    ],
    zh: '这是我的颜料。',
    hint: 'This is my ... 介绍自己的东西',
    unitSlug: 'monty-the-artist',
    lessonId: 3,
  },
  {
    id: 'l1-monty-the-artist-4-butterfly',
    pattern: "It's a ___.",
    blanks: [
      {
        options: ['butterfly', 'painting', 'handprint', 'wall'],
        answer: 0,
        zhOptions: ['它是一只蝴蝶。', '它是一幅画。', '它是一个手印。', '它是一面墙。'],
      },
    ],
    zh: '它是一只蝴蝶。',
    hint: "It's a ... 说出画里是什么",
    unitSlug: 'monty-the-artist',
    lessonId: 4,
  },
  {
    id: 'l1-monty-the-artist-5-handprint',
    pattern: "It's Mr. Gnome's ___.",
    blanks: [
      {
        options: ['handprint', 'painting', 'butterfly', 'wall'],
        answer: 0,
        zhOptions: ['这是 Gnome 老师的手印。', '这是 Gnome 老师的画。', '这是 Gnome 老师的蝴蝶。', '这是 Gnome 老师的墙。'],
      },
    ],
    zh: '这是 Gnome 老师的手印。',
    hint: '故事结尾：手印是谁的？',
    unitSlug: 'monty-the-artist',
    lessonId: 5,
  },
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
    pattern: "It's a ___ book.",
    blanks: [
      {
        options: ['red', 'blue', 'yellow'],
        answer: 0,
        zhOptions: ['它是一本红色的书。', '它是一本蓝色的书。', '它是一本黄色的书。'],
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
        options: ['my', 'your', 'a'],
        answer: 0,
        zhOptions: ['它是我的铅笔。', '它是你的铅笔。', '它是一支铅笔。'],
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
    id: 'l1-monty-the-artist-8-window',
    pattern: 'The window is ___.',
    blanks: [
      {
        options: ['pink', 'blue', 'yellow', 'green'],
        answer: 0,
        zhOptions: ['窗户是粉色的。', '窗户是蓝色的。', '窗户是黄色的。', '窗户是绿色的。'],
      },
    ],
    zh: '窗户是粉色的。',
    hint: 'The window is + 颜色',
    unitSlug: 'monty-the-artist',
    lessonId: 8,
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
  {
    id: 'l1-monty-the-artist-10-favorite',
    pattern: 'My favorite color is ___.',
    blanks: [
      {
        options: ['blue', 'red', 'pink', 'green'],
        answer: 0,
        zhOptions: ['我最喜欢的颜色是蓝色。', '我最喜欢的颜色是红色。', '我最喜欢的颜色是粉色。', '我最喜欢的颜色是绿色。'],
      },
    ],
    zh: '我最喜欢的颜色是蓝色。',
    hint: 'My favorite color is ... 说出最爱的颜色',
    unitSlug: 'monty-the-artist',
    lessonId: 10,
  },
]

/** 全册摊平总表（供 framesOfLesson1 / STARLIGHT1.frames / 校验器用）。
 *  与 FRAMES_BY_UNIT1 的分桶视图分开：总表每张卡只出现一次。 */
export const STARLIGHT_FRAMES1: SentenceFrame[] = [
  ...UNIT1_FRAMES,
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
