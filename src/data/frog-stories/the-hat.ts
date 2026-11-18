// 《The Hat》（帽子）—— Arnold Lobel 正版绘本《Frog and Toad Storybook Favorites》中的故事
// 内容来源：用户自有正版绘本 PDF 第 236~245 页（书页 232~241），经 OCR 提取 + 人工校对。
// 原 OCR 噪声及修正：
//   - 字母 T 误识为 I（"T am sorry"→"I am sorry"、"T can't"→"I can't"、"T will"→"I will"）
//   - is 误识为 1S（"That hat 1s"→"That hat is"）
//   - 弯引号 “ ” ’ 统一为英文直引号 " '
//   - 诗歌断行按语义合并（逐行断开的句子拼回完整句）
//   - 第 237 页环绕插画的乱序碎片（hat / Sal / eNom / ke / "Th / d Toad. 等）还原为
//     "No," said Toad. "This hat is your present to me. I like it. I will wear it the way it is."
//   - 第 242/243 页插画噪声（aaa RR / 3 / 2, / L\ } 等孤立词）剔除
//   - 第 244 页 "Frog, Frogs!" 订正为 "Frog, Frog!"
//   - 页脚页码（232~241）删除
//
// 中文风格：温暖口语，面向 6~9 岁孩子（参考 winnie.ts）。sentences 逐句覆盖整个故事。
// 版权口径：仅放文字（逐句 en/zh）作合理使用展示，不含扫描图片，原 PDF 不进版本控制。

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const theHat: FrogStory = {
  id: 'the-hat',
  title: 'The Hat',
  titleZh: '帽子',
  sentences: [
    { en: 'On Toad\'s birthday Frog gave him a hat.', zh: '蟾蜍生日那天，青蛙送了他一顶帽子。' },
    { en: 'Toad was delighted.', zh: '蟾蜍高兴极了。' },
    { en: '"Happy birthday," said Frog.', zh: '"生日快乐，"青蛙说。' },
    { en: 'Toad put on the hat.', zh: '蟾蜍戴上帽子。' },
    { en: 'It fell down over his eyes.', zh: '帽子一下子滑下来，盖住了他的眼睛。' },
    { en: '"I am sorry," said Frog.', zh: '"对不起，"青蛙说。' },
    { en: '"That hat is much too big for you. I will give you something else."', zh: '"那顶帽子对你来说太大了。我再给你别的东西吧。"' },
    { en: '"No," said Toad.', zh: '"不用啦，"蟾蜍说。' },
    { en: '"This hat is your present to me. I like it. I will wear it the way it is."', zh: '"这顶帽子是你送给我的礼物。我喜欢它。我就要照它现在的样子戴着。"' },
    { en: 'Frog and Toad went for a walk.', zh: '青蛙和蟾蜍去散步。' },
    { en: 'Toad tripped over a rock.', zh: '蟾蜍被一块石头绊了一跤。' },
    { en: 'He bumped into a tree.', zh: '他撞到了一棵树上。' },
    { en: 'He fell in a hole.', zh: '他掉进了一个坑里。' },
    { en: '"Frog," said Toad, "I can\'t see anything. I will not be able to wear your beautiful present. This is a sad birthday for me."', zh: '"青蛙，"蟾蜍说，"我什么也看不见。我没法戴你送我的漂亮礼物了。这真是个难过的生日。"' },
    { en: 'Frog and Toad were sad for a while.', zh: '青蛙和蟾蜍难过了一会儿。' },
    { en: 'Then Frog said, "Toad, here is what you must do. Tonight when you go to bed you must think some very big thoughts. Those big thoughts will make your head grow larger. In the morning your new hat may fit."', zh: '然后青蛙说："蟾蜍，你得这么做。今晚睡觉的时候，你要想一些非常大的念头。那些大念头会让你的脑袋变大。明天早上，你的新帽子也许就合适了。"' },
    { en: '"What a good idea," said Toad.', zh: '"真是个好主意，"蟾蜍说。' },
    { en: 'That night when Toad went to bed he thought the biggest thoughts that he could think.', zh: '那天晚上，蟾蜍上了床，想了他能想到的最大的念头。' },
    { en: 'Toad thought about giant sunflowers.', zh: '蟾蜍想到了巨大的向日葵。' },
    { en: 'He thought about tall oak trees.', zh: '他想到了高高的橡树。' },
    { en: 'He thought about high mountains covered with snow.', zh: '他想到了被白雪盖住的高山。' },
    { en: 'Then Toad fell asleep.', zh: '然后蟾蜍睡着了。' },
    { en: 'Frog came into Toad\'s house.', zh: '青蛙走进了蟾蜍的家。' },
    { en: 'He came in quietly.', zh: '他悄悄地走了进去。' },
    { en: 'Frog found the hat and took it to his house.', zh: '青蛙找到那顶帽子，把它带回了家。' },
    { en: 'Frog poured some water on the hat.', zh: '青蛙往帽子上洒了些水。' },
    { en: 'He put the hat in a warm place to dry.', zh: '他把帽子放在暖和的地方晾干。' },
    { en: 'It began to shrink.', zh: '帽子开始缩水了。' },
    { en: 'That hat grew smaller and smaller.', zh: '那顶帽子变得越来越小。' },
    { en: 'Frog went back to Toad\'s house.', zh: '青蛙回到了蟾蜍的家。' },
    { en: 'Toad was still fast asleep.', zh: '蟾蜍还睡得很熟。' },
    { en: 'Frog put the hat back on the hook where he found it.', zh: '青蛙把帽子挂回原来挂钩的地方。' },
    { en: 'When Toad woke up in the morning, he put the hat on his head.', zh: '早上蟾蜍醒来，把帽子戴在头上。' },
    { en: 'It was just the right size.', zh: '帽子正好合适。' },
    { en: 'Toad ran to Frog\'s house.', zh: '蟾蜍跑到青蛙家。' },
    { en: '"Frog, Frog!" he cried.', zh: '"青蛙，青蛙！"他喊道。' },
    { en: '"All those big thoughts have made my head much larger. Now I can wear your present!"', zh: '"那些大念头把我的脑袋变大了好多。现在我能戴你的礼物啦！"' },
    { en: 'Frog and Toad went for a walk.', zh: '青蛙和蟾蜍去散步。' },
    { en: 'Toad did not trip over a rock.', zh: '蟾蜍没有再被石头绊倒。' },
    { en: 'He did not bump into a tree.', zh: '他没有再撞到树上。' },
    { en: 'He did not fall in a hole.', zh: '他没有再掉进坑里。' },
    { en: 'It turned out to be a very pleasant day after Toad\'s birthday.', zh: '蟾蜍生日过后的那一天，结果过得特别愉快。' },
  ],
  words: [
    { en: 'hat', zh: '帽子', emoji: '🎩' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'birthday', zh: '生日', emoji: '🎂' },
    { en: 'present', zh: '礼物', emoji: '🎁' },
    { en: 'rock', zh: '石头', emoji: '🪨' },
    { en: 'tree', zh: '树', emoji: '🌳' },
    { en: 'hole', zh: '坑', emoji: '🕳️' },
    { en: 'sleep', zh: '睡觉', emoji: '😴' },
    { en: 'water', zh: '水', emoji: '💧' },
    { en: 'head', zh: '脑袋', emoji: '🧠' },
    { en: 'happy', zh: '开心的', emoji: '😊' },
  ],
}
