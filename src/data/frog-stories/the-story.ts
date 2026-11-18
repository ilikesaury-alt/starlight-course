// Frog and Toad Storybook Favorites —— 《The Story》(故事)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 24-35 页（scripts/_frog_the-story.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I："T will / T hope" → "I will / I hope"（共 4 处）
//   - 半角/弯引号与单双引号混用 → 统一为直双引号（如 page 28 的 a story,' → a story,"，
//     page 34 的 Once upon a time,' → Once upon a time,"）
//   - 跨行断句按语义合并成完整句子；环绕插画处乱序/破碎文字按正确语序还原
//   - 删除页脚页码及杂讯：ZO/21/az,/23/28/25/26/9/30/31、iihicrencd:、孤立竖线等

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const theStory: FrogStory = {
  id: 'the-story',
  title: 'The Story',
  titleZh: '故事',
  sentences: [
    { en: 'One day in summer, Frog was not feeling well.', zh: '夏天的一天，青蛙觉得不太舒服。' },
    { en: 'Toad said, "Frog, you are looking quite green."', zh: '蟾蜍说："青蛙，你看起来好绿呀。"' },
    { en: '"But I always look green," said Frog.', zh: '"可是我本来就绿呀，"青蛙说。' },
    { en: '"I am a frog."', zh: '"我是一只青蛙嘛。"' },
    { en: '"Today you look very green even for a frog," said Toad.', zh: '"可你今天绿得连青蛙都嫌绿啦，"蟾蜍说。' },
    { en: '"Get into my bed and rest."', zh: '"快到我的床上去躺躺吧。"' },
    { en: 'Toad made Frog a cup of hot tea.', zh: '蟾蜍给青蛙泡了一杯热茶。' },
    { en: 'Frog drank the tea, and then he said, "Tell me a story while I am resting."', zh: '青蛙喝了茶，然后说："我躺着休息的时候，给我讲个故事吧。"' },
    { en: '"All right," said Toad.', zh: '"好吧，"蟾蜍说。' },
    { en: '"Let me think of a story to tell you."', zh: '"让我想个故事讲给你听。"' },
    { en: 'Toad thought and thought.', zh: '蟾蜍想啊想。' },
    { en: 'But he could not think of a story to tell Frog.', zh: '可他就是想不出一个能讲给青蛙听的故事。' },
    { en: '"I will go out on the front porch and walk up and down," said Toad.', zh: '"我到门廊上去走来走去，"蟾蜍说。' },
    { en: '"Perhaps that will help me to think of a story."', zh: '"也许那样能帮我想出个故事来。"' },
    { en: 'Toad walked up and down on the porch for a long time.', zh: '蟾蜍在门廊上走来走去，走了好长时间。' },
    { en: 'But he could not think of a story to tell Frog.', zh: '可他还是想不出一个能讲给青蛙听的故事。' },
    { en: 'Then Toad went into the house and stood on his head.', zh: '后来蟾蜍走进屋子，倒立了起来。' },
    { en: '"Why are you standing on your head?" asked Frog.', zh: '"你为什么倒立呀？"青蛙问。' },
    { en: '"I hope that if I stand on my head, it will help me to think of a story," said Toad.', zh: '"我希望倒立能帮我想出个故事来，"蟾蜍说。' },
    { en: 'Toad stood on his head for a long time.', zh: '蟾蜍倒立了好长时间。' },
    { en: 'But he could not think of a story to tell Frog.', zh: '可他还是想不出一个能讲给青蛙听的故事。' },
    { en: 'Then Toad poured a glass of water over his head.', zh: '后来蟾蜍把一杯水浇在了自己头上。' },
    { en: '"Why are you pouring water over your head?" asked Frog.', zh: '"你为什么往头上浇水呀？"青蛙问。' },
    { en: '"I hope that if I pour water over my head, it will help me to think of a story," said Toad.', zh: '"我希望往头上浇水能帮我想出个故事来，"蟾蜍说。' },
    { en: 'Toad poured many glasses of water over his head.', zh: '蟾蜍往头上浇了一杯又一杯的水。' },
    { en: 'But he could not think of a story to tell Frog.', zh: '可他还是想不出一个能讲给青蛙听的故事。' },
    { en: 'Then Toad began to bang his head against the wall.', zh: '后来蟾蜍开始用头撞墙。' },
    { en: '"Why are you banging your head against the wall?" asked Frog.', zh: '"你为什么用头撞墙呀？"青蛙问。' },
    { en: '"I hope that if I bang my head against the wall hard enough, it will help me to think of a story," said Toad.', zh: '"我希望用力撞墙能帮我想出个故事来，"蟾蜍说。' },
    { en: '"I am feeling much better now, Toad," said Frog.', zh: '"我现在舒服多了，蟾蜍，"青蛙说。' },
    { en: '"I do not think I need a story anymore."', zh: '"我想我不用听故事了。"' },
    { en: '"Then you get out of bed and let me get into it," said Toad, "because now I feel terrible."', zh: '"那你起来，换我躺进去，"蟾蜍说，"因为我现在难受极啦。"' },
    { en: 'Frog said, "Would you like me to tell you a story, Toad?"', zh: '青蛙说："要我给你讲个故事吗，蟾蜍？"' },
    { en: '"Yes," said Toad, "if you know one."', zh: '"要呀，"蟾蜍说，"如果你会讲的话。"' },
    { en: '"Once upon a time," said Frog, "there were two good friends, a frog and a toad."', zh: '"从前呀，"青蛙讲起来，"有两个好朋友，一只青蛙和一只蟾蜍。"' },
    { en: 'The frog was not feeling well.', zh: '青蛙觉得不太舒服。' },
    { en: 'He asked his friend the toad to tell him a story.', zh: '他请他的好朋友蟾蜍给他讲个故事。' },
    { en: 'The toad could not think of a story.', zh: '蟾蜍想不出故事来。' },
    { en: 'He walked up and down on the porch, but he could not think of a story.', zh: '他在门廊上走来走去，还是想不出故事。' },
    { en: 'He stood on his head, but he could not think of a story.', zh: '他倒立起来，还是想不出故事。' },
    { en: 'He poured water over his head, but he could not think of a story.', zh: '他往头上浇水，还是想不出故事。' },
    { en: 'He banged his head against the wall, but he still could not think of a story.', zh: '他用头撞墙，可还是想不出故事。' },
    { en: 'Then the toad did not feel so well, and the frog was feeling better.', zh: '后来蟾蜍觉得不太舒服了，青蛙倒是舒服多了。' },
    { en: 'So the toad went to bed and the frog got up and told him a story.', zh: '于是蟾蜍上了床，青蛙爬起来，给他讲了个故事。' },
    { en: '"How was that, Toad?" said Frog.', zh: '"这个故事怎么样呀，蟾蜍？"青蛙问。' },
    { en: 'But Toad did not answer.', zh: '可是蟾蜍没有回答。' },
    { en: 'He had fallen asleep.', zh: '他已经睡着啦。' },
  ],
  words: [
    { en: 'story', zh: '故事', emoji: '📖' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🟤' },
    { en: 'summer', zh: '夏天', emoji: '☀️' },
    { en: 'tea', zh: '茶', emoji: '🍵' },
    { en: 'bed', zh: '床', emoji: '🛏️' },
    { en: 'porch', zh: '门廊', emoji: '🏠' },
    { en: 'water', zh: '水', emoji: '💧' },
    { en: 'wall', zh: '墙', emoji: '🧱' },
    { en: 'head', zh: '头', emoji: '🧠' },
    { en: 'friend', zh: '朋友', emoji: '👫' },
    { en: 'asleep', zh: '睡着', emoji: '😴' },
  ],
}
