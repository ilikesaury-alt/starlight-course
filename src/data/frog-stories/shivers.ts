// Frog and Toad Storybook Favorites —— 《Shivers》(发抖)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 222-235 页（scripts/_frog_shivers.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I："Tam not too sure / Tam very hungry / T had to / T ran / T found"
//     → "I am not too sure / I am very hungry / I had to / I ran / I found"；
//     "| have eaten / | am not hungry" → "I have eaten / I am not hungry"；
//     "Who 1s that?" → "Who is that?"（数字 1 误识为 i）
//   - 弯引号 → 英文直引号 " '；诗歌式断行按语义合并成完整句子
//   - 环绕插画页乱序还原：page 227 的 "ing near me. / He was stand" → "He was standing near me."；
//     page 224 顶部 "Vi / zn! PIP / A / Le OP"、page 235 的 "So / aoe oie / ie" 均为插画噪声，全删
//   - 删除页脚页码：218/219/ZZO(220)/Z2Z1(221)/222/223/224/226/228/229/230/231

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const shivers: FrogStory = {
  id: 'shivers',
  title: 'Shivers',
  titleZh: '发抖',
  sentences: [
    { en: 'The night was cold and dark.', zh: '夜晚又冷又黑。' },
    { en: '"Listen to the wind howling in the trees," said Frog.', zh: '"听，风在树丛里呼啸，"青蛙说。' },
    { en: '"What a fine time for a ghost story."', zh: '"这正适合讲个鬼故事。"' },
    { en: 'Toad moved deeper into his chair.', zh: '蟾蜍往椅子里缩了缩。' },
    { en: '"Toad," asked Frog, "don\'t you like to be scared? Don\'t you like to feel the shivers?"', zh: '"蟾蜍，"青蛙问，"难道你不喜欢害怕的感觉吗？不喜欢发抖的感觉吗？"' },
    { en: '"I am not too sure," said Toad.', zh: '"我不太确定，"蟾蜍说。' },
    { en: 'Frog made a fresh pot of tea.', zh: '青蛙泡了一壶热茶。' },
    { en: 'He sat down and began a story.', zh: '他坐下来，讲起了故事。' },
    { en: '"When I was small," said Frog, "my mother and father and I went out for a picnic."', zh: '"我小时候，"青蛙说，"爸爸妈妈和我一起去野餐。"' },
    { en: 'On the way home we lost our way.', zh: '回家的路上，我们迷路了。' },
    { en: 'My mother was worried.', zh: '妈妈很着急。' },
    { en: '"We must get home," she said.', zh: '"我们必须回家，"她说。' },
    { en: '"We do not want to meet the Old Dark Frog."', zh: '"我们可不想碰上黑衣老青蛙。"' },
    { en: '"Who is that?" I asked.', zh: '"那是谁呀？"我问。' },
    { en: '"A terrible ghost," said my father.', zh: '"一只可怕的鬼，"爸爸说。' },
    { en: '"He comes out at night and eats little frog children for supper."', zh: '"他夜里出来，抓小青蛙当晚饭吃掉。"' },
    { en: 'Toad sipped his tea.', zh: '蟾蜍抿了一口茶。' },
    { en: '"Frog," he asked, "are you making this up?"', zh: '"青蛙，"他问，"这是你编的吧？"' },
    { en: '"Maybe yes and maybe no," said Frog.', zh: '"也许是，也许不是，"青蛙说。' },
    { en: '"My mother and father went to search for a path," said Frog.', zh: '"爸爸妈妈去找路了，"青蛙说。' },
    { en: '"They told me to wait until they came back."', zh: '"他们叫我等着，等他们回来。"' },
    { en: 'I sat under a tree and waited.', zh: '我坐在一棵树下等啊等。' },
    { en: 'The woods became dark.', zh: '树林里慢慢黑了下来。' },
    { en: 'I was afraid.', zh: '我害怕极了。' },
    { en: 'Then I saw two huge eyes.', zh: '这时，我看见了两只大大的眼睛。' },
    { en: 'It was the Old Dark Frog.', zh: '是黑衣老青蛙！' },
    { en: 'He was standing near me.', zh: '他就站在我身边。' },
    { en: '"Frog," asked Toad, "did this really happen?"', zh: '"青蛙，"蟾蜍问，"这事真的发生过吗？"' },
    { en: '"Maybe it did and maybe it didn\'t," said Frog.', zh: '"也许发生过，也许没有，"青蛙说。' },
    { en: 'Frog went on with the story.', zh: '青蛙接着往下讲。' },
    { en: '"The Dark Frog pulled a jump rope out of his pocket."', zh: '"黑衣老青蛙从口袋里掏出一根跳绳。"' },
    { en: '"I am not hungry now," said the Dark Frog.', zh: '"我现在不饿，"黑衣老青蛙说。' },
    { en: '"I have eaten too many tasty frog children."', zh: '"我已经吃了好多好多美味的小青蛙。"' },
    { en: '"But after I jump rope one hundred times, I will be hungry again."', zh: '"可是我跳一百下绳以后，就又会饿了。"' },
    { en: '"Then I will eat YOU!"', zh: '"到时候我就把你吃掉！"' },
    { en: '"The Dark Frog tied one end of the rope to a tree."', zh: '"黑衣老青蛙把绳子的一头系在树上。"' },
    { en: '"Turn for me!" he shouted.', zh: '"给我摇绳！"他大喊。' },
    { en: 'I turned the rope for the Dark Frog.', zh: '我替黑衣老青蛙摇起绳来。' },
    { en: 'He jumped twenty times.', zh: '他跳了二十下。' },
    { en: '"I am beginning to get hungry," said the Dark Frog.', zh: '"我开始有点饿了，"黑衣老青蛙说。' },
    { en: 'He jumped fifty times.', zh: '他跳了五十下。' },
    { en: '"I am getting hungrier," said the Dark Frog.', zh: '"我越来越饿了，"黑衣老青蛙说。' },
    { en: 'He jumped ninety times.', zh: '他跳了九十下。' },
    { en: '"I am very hungry now!" said the Dark Frog.', zh: '"我现在饿极了！"黑衣老青蛙说。' },
    { en: '"What happened then?" asked Toad.', zh: '"后来怎么样了？"蟾蜍问。' },
    { en: '"I had to save my life," said Frog.', zh: '"我得救自己的命呀，"青蛙说。' },
    { en: '"I ran around and around the tree with the rope."', zh: '"我拿着绳子，绕着树跑了一圈又一圈。"' },
    { en: '"I tied up the Old Dark Frog."', zh: '"我把黑衣老青蛙捆了起来。"' },
    { en: 'He roared and screamed.', zh: '他又是吼又是叫。' },
    { en: 'I ran away fast.', zh: '我飞快地跑掉了。' },
    { en: '"I found my mother and father," said Frog.', zh: '"我找到了爸爸妈妈，"青蛙说。' },
    { en: '"We came safely home."', zh: '"我们平平安安地回了家。"' },
    { en: '"Frog," asked Toad, "was that a true story?"', zh: '"青蛙，"蟾蜍问，"这是真事吗？"' },
    { en: '"Maybe it was and maybe it wasn\'t," said Frog.', zh: '"也许是，也许不是，"青蛙说。' },
    { en: 'Frog and Toad sat close by the fire.', zh: '青蛙和蟾蜍紧挨着火炉坐着。' },
    { en: 'They were scared.', zh: '他们很害怕。' },
    { en: 'The teacups shook in their hands.', zh: '茶杯在他们手里直发抖。' },
    { en: 'They were having the shivers.', zh: '他们抖个不停。' },
    { en: 'It was a good, warm feeling.', zh: '那是一种又舒服又温暖的感觉。' },
  ],
  words: [
    { en: 'ghost', zh: '鬼', emoji: '👻' },
    { en: 'shivers', zh: '发抖', emoji: '😨' },
    { en: 'night', zh: '夜晚', emoji: '🌙' },
    { en: 'cold', zh: '冷的', emoji: '🥶' },
    { en: 'dark', zh: '黑暗的', emoji: '🌑' },
    { en: 'wind', zh: '风', emoji: '💨' },
    { en: 'tea', zh: '茶', emoji: '🍵' },
    { en: 'picnic', zh: '野餐', emoji: '🧺' },
    { en: 'rope', zh: '绳子', emoji: '🪢' },
    { en: 'hungry', zh: '饿的', emoji: '🍽️' },
    { en: 'scared', zh: '害怕的', emoji: '😰' },
    { en: 'fire', zh: '火', emoji: '🔥' },
  ],
}
