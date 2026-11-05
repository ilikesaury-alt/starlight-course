// Starlight 1 · Level 1 · Unit 1 阅读短文（试点单元）
// 对应 level-0 的 src/data/reading/（READING_PASSAGES）：每课一段连贯短文，供自主阅读。
// 这里用 Unit 1 学过的词，把美术课「蓝色手印」的故事讲完（1-4 阅读课主故事 + 1-5 阅读练习续篇）。
// 与课本原文（book.ts）分工：book.ts = 教材真实课文（一句一活动，供点读/挖空）；本文件 = 另写的连贯小故事。

import type { ReadingPassage } from '../reading/index'
import { u2_reading } from './u2'
import { u3_reading } from './u3'
import { u4_reading } from './u4'
import { u5_reading } from './u5'
import { u6_reading } from './u6'
import { u7_reading } from './u7'
import { u8_reading } from './u8'
import { u9_reading } from './u9'

export const READING_PASSAGES1: Record<string, ReadingPassage> = {
  ...u2_reading,
  ...u3_reading,
  ...u4_reading,
  ...u5_reading,
  ...u6_reading,
  ...u7_reading,
  ...u8_reading,
  ...u9_reading,
  '1-4': {
    title: 'The Blue Handprint',
    titleZh: '蓝色手印',
    paragraphs: [
      [
        { en: 'Today is art class. The teacher is Mr. Gnome.', zh: '今天是美术课，老师是 Gnome 先生。' },
        { en: 'Look at my painting. It is a butterfly. It is very good.', zh: '看我的画。这是一只蝴蝶，画得真好。' },
        { en: 'Sammy has red paint. Daisy has yellow paint.', zh: 'Sammy 有红色颜料，Daisy 有黄色颜料。' },
      ],
      [
        { en: 'Oh no! A blue handprint is on the wall!', zh: '哦不！墙上有一个蓝色手印！' },
        { en: 'Mr. Gnome sees the handprint. He is not happy.', zh: 'Gnome 老师看见了手印，他不高兴。' },
        { en: 'Billy has blue paint. His hand is big.', zh: 'Billy 有蓝色颜料，他的手很大。' },
      ],
      [
        { en: 'Look at your hand, Mr. Gnome!', zh: '看看你的手，Gnome 老师！' },
        { en: 'Oh! It is Mr. Gnome’s handprint. It is blue!', zh: '哦！原来是 Gnome 老师的手印，是蓝色的！' },
        { en: 'It is OK, Mr. Gnome!', zh: '没关系的，Gnome 老师！' },
      ],
    ],
  },
  '1-5': {
    title: "Billy's Idea",
    titleZh: 'Billy 的主意',
    paragraphs: [
      [
        { en: 'This is Billy. His paint is blue.', zh: '这是 Billy，他的颜料是蓝色的。' },
        { en: 'My favorite color is blue, he says.', zh: '我最喜欢的颜色是蓝色，他说。' },
      ],
      [
        { en: 'But my hand is small. This hand is big.', zh: '可是我的手很小，这只手却很大。' },
        { en: 'Billy has an idea. He looks at Mr. Gnome.', zh: 'Billy 有了主意，他看着 Gnome 老师。' },
      ],
      [
        { en: 'Look at your hand, Mr. Gnome!', zh: '看看你的手，Gnome 老师！' },
        { en: 'Sorry, children! It is my handprint.', zh: '对不起，孩子们！这是我的手印。' },
      ],
    ],
  },
}

export function getReadingPassage1(unitId: number, lessonId: number): ReadingPassage | undefined {
  return READING_PASSAGES1[`${unitId}-${lessonId}`]
}
