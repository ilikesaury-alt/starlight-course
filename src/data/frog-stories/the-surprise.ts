// Frog and Toad Storybook Favorites —— 《The Surprise》(惊喜)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 174-185 页（scripts/_frog_the-surprise.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I："T will" → "I will"（共 2 处）
//   - 弯引号与弯撇号 → 统一为英文直引号 " 和直撇号 '
//   - 跨行断句按语义合并成完整句子；环绕插画页（181 页纯图无正文）跳过
//   - 删除页脚页码（170~181）及孤立杂讯词：thes trees: → the trees、
//     "hg"、"A petra,"、孤立竖线 | 等
//   - 诗歌式断行按语义还原：How surprised Toad / Frog must be! 补回缺失的收尾引号与感叹号

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const theSurprise: FrogStory = {
  id: 'the-surprise',
  title: 'The Surprise',
  titleZh: '惊喜',
  sentences: [
    { en: 'It was October.', zh: '十月到了。' },
    { en: 'The leaves had fallen off the trees.', zh: '树叶都从树上落下来了。' },
    { en: 'They were lying on the ground.', zh: '它们躺在地上。' },
    { en: '"I will go to Toad\'s house," said Frog.', zh: '"我要去蟾蜍家，"青蛙说。' },
    { en: '"I will rake all of the leaves that have fallen on his lawn. Toad will be surprised."', zh: '"我要把他草坪上落下的叶子全都耙干净。蟾蜍一定会大吃一惊。"' },
    { en: 'Frog took a rake out of the garden shed.', zh: '青蛙从花园的棚子里拿出一把耙子。' },
    { en: 'Toad looked out of his window.', zh: '蟾蜍从窗户往外看。' },
    { en: '"These messy leaves have covered everything," said Toad.', zh: '"这些乱糟糟的叶子把什么都盖住了，"蟾蜍说。' },
    { en: 'He took a rake out of the closet.', zh: '他从壁橱里也拿出一把耙子。' },
    { en: '"I will run over to Frog\'s house. I will rake all of his leaves. Frog will be very pleased."', zh: '"我要跑到青蛙家去。把他所有的叶子都耙干净。青蛙一定会特别开心。"' },
    { en: 'Frog ran through the woods so that Toad would not see him.', zh: '青蛙穿过树林跑，好让蟾蜍看不见他。' },
    { en: 'Toad ran through the high grass so that Frog would not see him.', zh: '蟾蜍穿过高高的草丛跑，好让青蛙看不见他。' },
    { en: 'Frog came to Toad\'s house.', zh: '青蛙来到了蟾蜍家。' },
    { en: 'He looked in the window.', zh: '他往窗户里看了看。' },
    { en: '"Good," said Frog.', zh: '"太好了，"青蛙说。' },
    { en: '"Toad is out. He will never know who raked his leaves."', zh: '"蟾蜍出去了。他永远不会知道是谁帮他耙了叶子。"' },
    { en: 'Toad got to Frog\'s house.', zh: '蟾蜍到了青蛙家。' },
    { en: 'He looked in the window.', zh: '他往窗户里看了看。' },
    { en: '"Good," said Toad.', zh: '"太好了，"蟾蜍说。' },
    { en: '"Frog is not home. He will never guess who raked his leaves."', zh: '"青蛙不在家。他永远猜不到是谁帮他耙了叶子。"' },
    { en: 'Frog worked hard.', zh: '青蛙干得可卖力了。' },
    { en: 'He raked the leaves into a pile.', zh: '他把叶子耙成了一大堆。' },
    { en: 'Soon Toad\'s lawn was clean.', zh: '很快，蟾蜍的草坪就干干净净了。' },
    { en: 'Frog picked up his rake and started home.', zh: '青蛙拿起耙子，动身回家。' },
    { en: 'Toad pushed and pulled on the rake.', zh: '蟾蜍推呀、拉呀，用着那把耙子。' },
    { en: 'He raked the leaves into a pile.', zh: '他也把叶子耙成了一大堆。' },
    { en: 'Soon there was not a single leaf in Frog\'s front yard.', zh: '很快，青蛙家的前院里连一片叶子都不剩了。' },
    { en: 'Toad took his rake and started home.', zh: '蟾蜍拿起耙子，也动身回家。' },
    { en: 'A wind came.', zh: '起风了。' },
    { en: 'It blew across the land.', zh: '风呼呼地吹过大地。' },
    { en: 'The pile of leaves that Frog had raked for Toad blew everywhere.', zh: '青蛙替蟾蜍耙好的那堆叶子，被吹得到处都是。' },
    { en: 'The pile of leaves that Toad had raked for Frog blew everywhere.', zh: '蟾蜍替青蛙耙好的那堆叶子，也被吹得到处都是。' },
    { en: 'When Frog got home, he said, "Tomorrow I will clean up the leaves that are all over my own lawn. How surprised Toad must be!"', zh: '青蛙回到家，说："明天我要把自家草坪上到处都是的叶子收拾干净。蟾蜍一定会特别吃惊！"' },
    { en: 'When Toad got home, he said, "Tomorrow I will get to work and rake all of my own leaves. How surprised Frog must be!"', zh: '蟾蜍回到家，说："明天我要动手，把自家所有的叶子都耙干净。青蛙一定会特别吃惊！"' },
    { en: 'That night Frog and Toad were both happy when they each turned out the light and went to bed.', zh: '那天晚上，青蛙和蟾蜍都很开心，各自关了灯，钻进了被窝。' },
  ],
  words: [
    { en: 'surprise', zh: '惊喜', emoji: '🎁' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🟤' },
    { en: 'leaves', zh: '树叶', emoji: '🍂' },
    { en: 'rake', zh: '耙子', emoji: '🧹' },
    { en: 'lawn', zh: '草坪', emoji: '🌱' },
    { en: 'woods', zh: '树林', emoji: '🌲' },
    { en: 'grass', zh: '草', emoji: '🌿' },
    { en: 'pile', zh: '一堆', emoji: '🍁' },
    { en: 'wind', zh: '风', emoji: '💨' },
    { en: 'ground', zh: '地面', emoji: '🟫' },
    { en: 'bed', zh: '床', emoji: '🛏️' },
  ],
}
