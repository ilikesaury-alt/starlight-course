// Frog and Toad Storybook Favorites —— 《The Corner》(角落)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 150-161 页（scripts/_frog_the-corner.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I："T am / T went / T saw / T was" → "I am / I went / I saw / I was"（共 4 处）
//   - "IT went back home" → "I went back home"（多余 T）
//   - 弯引号统一为英文直双引号 " '，并去掉行首杂讯的孤立单引号（'"T am → "I am）
//   - 诗歌式断行按语义合并成完整句子；环绕插画处的乱序/破碎文字按正确语序还原
//   - "tree Stump" → "tree stump"（句中误大写）
//   - 删除页脚页码（146~157）及杂讯：o)、b)、f、NS Saurel Levee.、al | ; an

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const theCorner: FrogStory = {
  id: 'the-corner',
  title: 'The Corner',
  titleZh: '角落',
  sentences: [
    { en: 'Frog and Toad were caught in the rain.', zh: '青蛙和蟾蜍遇上雨了。' },
    { en: 'They ran to Frog\'s house.', zh: '他们跑到了青蛙家。' },
    { en: '"I am all wet," said Toad.', zh: '"我浑身都湿透啦，"蟾蜍说。' },
    { en: '"The day is spoiled."', zh: '"这一天全毁啦。"' },
    { en: '"Have some tea and cake," said Frog.', zh: '"来，喝点茶，吃点蛋糕吧，"青蛙说。' },
    { en: '"The rain will stop. If you stand near the stove, your clothes will soon be dry. I will tell you a story while we are waiting," said Frog.', zh: '"雨会停的。你挨着炉子站一会儿，衣服很快就会干。咱们等着的时候，我给你讲个故事吧，"青蛙说。' },
    { en: '"Oh good," said Toad.', zh: '"好呀，"蟾蜍说。' },
    { en: '"When I was small, not much bigger than a pollywog," said Frog,', zh: '"我小时候呀，比一只蝌蚪大不了多少，"青蛙说，' },
    { en: '"my father said to me, \'Son, this is a cold, gray day but spring is just around the corner.\'"', zh: '"我爸爸对我说：\'孩子呀，今天又冷又灰，不过春天就在拐角后头呢。\'"' },
    { en: 'I wanted spring to come.', zh: '我盼着春天快来。' },
    { en: 'I went out to find that corner.', zh: '我出门去找那个拐角。' },
    { en: 'I walked down a path in the woods until I came to a corner.', zh: '我沿着树林里的小路走啊走，一直走到一个拐角。' },
    { en: 'I went around the corner to see if spring was on the other side."', zh: '我绕过拐角，想看看春天是不是就在另一边。"' },
    { en: '"And was it?" asked Toad.', zh: '"是吗？"蟾蜍问。' },
    { en: '"No," said Frog.', zh: '"没有，"青蛙说。' },
    { en: '"There was only a pine tree, three pebbles and some dry grass.', zh: '"那儿只有一棵松树、三颗小石子，还有一堆干草。' },
    { en: 'I walked in the meadow.', zh: '我又在草地上走。' },
    { en: 'Soon I came to another corner.', zh: '不一会儿，我又到了一个拐角。' },
    { en: 'I went around the corner to see if spring was there."', zh: '我绕过拐角，想看看春天在不在那儿。"' },
    { en: '"Did you find it?" asked Toad.', zh: '"你找到了吗？"蟾蜍问。' },
    { en: '"No," said Frog.', zh: '"没有，"青蛙说。' },
    { en: '"There was only an old worm asleep on a tree stump.', zh: '"那儿只有一条老虫子，正睡在树桩上。' },
    { en: 'I walked along the river until I came to another corner.', zh: '我沿着河边走啊走，一直走到另一个拐角。' },
    { en: 'I went around the corner to look for spring."', zh: '我绕过拐角，去找春天。"' },
    { en: '"Was it there?" asked Toad.', zh: '"春天在那儿吗？"蟾蜍问。' },
    { en: '"No," said Frog.', zh: '"没有，"青蛙说。' },
    { en: '"There was only some wet mud and a lizard who was chasing his tail."', zh: '"那儿只有一些湿泥巴，还有一只蜥蜴在追自己的尾巴。"' },
    { en: '"You must have been tired," said Toad.', zh: '"你一定累坏了吧，"蟾蜍说。' },
    { en: '"I was tired," said Frog, "and it started to rain."', zh: '"我是累了，"青蛙说，"而且天还下起了雨。"' },
    { en: '"I went back home.', zh: '"我回家去了。' },
    { en: 'When I got there," said Frog, "I found another corner.', zh: '到家的时候，"青蛙说，"我又发现了一个拐角。' },
    { en: 'It was the corner of my house."', zh: '那是我家房子的拐角。"' },
    { en: '"Did you go around it?" asked Toad.', zh: '"你绕过去看了吗？"蟾蜍问。' },
    { en: '"I went around that corner, too," said Frog.', zh: '"那个拐角我也绕过去啦，"青蛙说。' },
    { en: '"What did you see?" asked Toad.', zh: '"你看见什么了？"蟾蜍问。' },
    { en: '"I saw the sun coming out," said Frog.', zh: '"我看见太阳出来了，"青蛙说。' },
    { en: '"I saw the birds sitting and singing in the tree.', zh: '"我看见鸟儿停在树上唱歌。' },
    { en: 'I saw my mother and father working in their garden.', zh: '我看见爸爸妈妈在他们的花园里干活。' },
    { en: 'I saw flowers in the garden."', zh: '我还看见花园里的花。"' },
    { en: '"You found it!" cried Toad.', zh: '"你找到啦！"蟾蜍叫起来。' },
    { en: '"I was very happy.', zh: '"我可高兴啦。' },
    { en: 'I had found the corner that spring was just around."', zh: '我终于找到了春天就在它后头的那个拐角。"' },
    { en: '"Look, Frog," said Toad.', zh: '"快看，青蛙，"蟾蜍说。' },
    { en: '"You were right.', zh: '"你说得对。' },
    { en: 'The rain has stopped."', zh: '雨停了。"' },
    { en: 'Frog and Toad hurried outside.', zh: '青蛙和蟾蜍赶紧跑到外面。' },
    { en: 'They ran around the corner of Frog\'s house to make sure that spring had come again.', zh: '他们绕过青蛙家的拐角，想看看春天是不是真的又来了。' },
  ],
  words: [
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🟤' },
    { en: 'rain', zh: '雨', emoji: '🌧️' },
    { en: 'corner', zh: '角落', emoji: '📐' },
    { en: 'spring', zh: '春天', emoji: '🌸' },
    { en: 'tea', zh: '茶', emoji: '🍵' },
    { en: 'cake', zh: '蛋糕', emoji: '🍰' },
    { en: 'stove', zh: '炉子', emoji: '🔥' },
    { en: 'woods', zh: '树林', emoji: '🌲' },
    { en: 'meadow', zh: '草地', emoji: '🌿' },
    { en: 'river', zh: '河', emoji: '🏞️' },
    { en: 'sun', zh: '太阳', emoji: '☀️' },
  ],
}
