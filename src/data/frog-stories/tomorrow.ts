// Frog and Toad Storybook Favorites —— 《Tomorrow》(明天)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 198-209 页（scripts/_frog_tomorrow.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I："T will / T feel / T am / IT am" → "I will / I feel / I am / I am"
//     （page 199、201、203 共 5 处）
//   - 数字 1 被误识别为字母 I："This house 1s" → "is"、"There 1s" → "is"、
//     "will 1?" → "will I?"（page 198、201、205）
//   - 字母 af 被误识别为 if："'af I pick up / 'af I dust" → "if I ..."（page 204、206）
//   - 弯引号/弯撇号 → 统一为英文直引号 " 与直撇号 '
//   - 诗歌式断行按语义合并成完整句子；环绕插画页的乱序碎字按语序还原
//     （page 199 "Tew ob nee / SSS"、page 209 "2 / Ti / iy / aN / / / es" 均为插画噪声）
//   - page 208 "plete / said Toad" 中 "plete" 为孤立噪声词，按原文 "There," said Toad 还原
//   - 删除页脚页码（194~205）及孤立杂讯词（9、Me,、1G、I.、a、——— 等）

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const tomorrow: FrogStory = {
  id: 'tomorrow',
  title: 'Tomorrow',
  titleZh: '明天',
  sentences: [
    { en: 'Toad woke up.', zh: '蟾蜍醒来了。' },
    { en: '"Drat!" he said.', zh: '"真糟糕！"他说。' },
    { en: '"This house is a mess. I have so much work to do."', zh: '"这屋子乱糟糟的。我有好多活儿要干呢。"' },
    { en: 'Frog looked through the window.', zh: '青蛙从窗户往里瞧。' },
    { en: '"Toad, you are right," said Frog. "It is a mess."', zh: '"蟾蜍，你说得对，"青蛙说，"是挺乱的。"' },
    { en: 'Toad pulled the covers over his head.', zh: '蟾蜍把被子拉过来，盖住了头。' },
    { en: '"I will do it tomorrow," said Toad. "Today I will take life easy."', zh: '"我明天再做，"蟾蜍说，"今天我要轻轻松松地过。"' },
    { en: 'Frog came into the house.', zh: '青蛙走进了屋子。' },
    { en: '"Toad," said Frog, "your pants and jacket are lying on the floor."', zh: '"蟾蜍，"青蛙说，"你的裤子和外套都躺在地板上呢。"' },
    { en: '"Tomorrow," said Toad from under the covers.', zh: '"明天再说，"蟾蜍在被子里嘟囔。' },
    { en: '"Your kitchen sink is filled with dirty dishes," said Frog.', zh: '"你的厨房水槽里堆满了脏盘子，"青蛙说。' },
    { en: '"Tomorrow," said Toad.', zh: '"明天再说，"蟾蜍说。' },
    { en: '"There is dust on your chairs."', zh: '"你的椅子上全是灰。"' },
    { en: '"Tomorrow," said Toad.', zh: '"明天再说，"蟾蜍说。' },
    { en: '"Your windows need scrubbing," said Frog. "Your plants need watering."', zh: '"你的窗户该擦擦了，"青蛙说，"你的植物也该浇水啦。"' },
    { en: '"Tomorrow!" cried Toad. "I will do it all tomorrow!"', zh: '"明天！"蟾蜍大声说，"我明天全都做！"' },
    { en: 'Toad sat on the edge of his bed.', zh: '蟾蜍坐在床边。' },
    { en: '"Blah," said Toad. "I feel down in the dumps."', zh: '"唉，"蟾蜍说，"我心里好沮丧啊。"' },
    { en: '"Why?" asked Frog.', zh: '"怎么啦？"青蛙问。' },
    { en: '"I am thinking about tomorrow," said Toad. "I am thinking about all of the many things that I will have to do."', zh: '"我在想明天呢，"蟾蜍说，"我在想明天要做的那么多事情。"' },
    { en: '"Yes," said Frog, "tomorrow will be a very hard day for you."', zh: '"是啊，"青蛙说，"明天对你来说，可真是辛苦的一天。"' },
    { en: '"But Frog," said Toad, "if I pick up my pants and jacket right now, then I will not have to pick them up tomorrow, will I?"', zh: '"不过青蛙呀，"蟾蜍说，"要是我现在就把裤子和外套捡起来，明天就不用再捡了，对不对？"' },
    { en: '"No," said Frog. "You will not have to."', zh: '"不用啦，"青蛙说，"你就不用再捡了。"' },
    { en: 'Toad picked up his clothes.', zh: '蟾蜍捡起了衣服。' },
    { en: 'He put them in the closet.', zh: '他把衣服放进了壁橱。' },
    { en: '"Frog," said Toad, "if I wash my dishes right now, then I will not have to wash them tomorrow, will I?"', zh: '"青蛙，"蟾蜍说，"要是我现在就把盘子洗了，明天就不用再洗了，对不对？"' },
    { en: '"No," said Frog. "You will not have to."', zh: '"不用啦，"青蛙说，"你就不用再洗了。"' },
    { en: 'Toad washed and dried his dishes.', zh: '蟾蜍把盘子洗好，又擦干了。' },
    { en: 'He put them in the cupboard.', zh: '他把盘子放进了橱柜。' },
    { en: '"Frog," said Toad, "if I dust my chairs and scrub my windows and water my plants right now, then I will not have to do it tomorrow, will I?"', zh: '"青蛙，"蟾蜍说，"要是我现在就擦椅子、擦窗户、给植物浇水，明天就不用做了，对不对？"' },
    { en: '"No," said Frog. "You will not have to do any of it."', zh: '"不用啦，"青蛙说，"这些事你通通都不用做啦。"' },
    { en: 'Toad dusted his chairs.', zh: '蟾蜍擦了椅子。' },
    { en: 'He scrubbed his windows.', zh: '他擦了窗户。' },
    { en: 'He watered his plants.', zh: '他给植物浇了水。' },
    { en: '"There," said Toad. "Now I feel better. I am not in the dumps anymore."', zh: '"好啦，"蟾蜍说，"现在我心里舒服多了，不再闷闷不乐啦。"' },
    { en: '"Why?" asked Frog.', zh: '"这是为什么呢？"青蛙问。' },
    { en: '"Because I have done all that work," said Toad. "Now I can save tomorrow for something that I really want to do."', zh: '"因为那些活儿我都干完啦，"蟾蜍说，"现在我可以把明天留给我真正想做的事了。"' },
    { en: '"What is that?" asked Frog.', zh: '"是什么事呀？"青蛙问。' },
    { en: '"Tomorrow," said Toad, "I can just take life easy."', zh: '"明天呀，"蟾蜍说，"我可以轻轻松松地过一天。"' },
    { en: 'Toad went back to bed.', zh: '蟾蜍回到床上。' },
    { en: 'He pulled the covers over his head and fell asleep.', zh: '他把被子拉过来盖住头，不一会儿就睡着了。' },
  ],
  words: [
    { en: 'tomorrow', zh: '明天', emoji: '🌅' },
    { en: 'toad', zh: '蟾蜍', emoji: '🟤' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'mess', zh: '乱糟糟', emoji: '🌀' },
    { en: 'work', zh: '活儿', emoji: '🔧' },
    { en: 'dishes', zh: '盘子', emoji: '🍽️' },
    { en: 'sink', zh: '水槽', emoji: '🚰' },
    { en: 'dust', zh: '灰尘', emoji: '🌫️' },
    { en: 'windows', zh: '窗户', emoji: '🪟' },
    { en: 'plants', zh: '植物', emoji: '🪴' },
    { en: 'closet', zh: '壁橱', emoji: '🚪' },
    { en: 'bed', zh: '床', emoji: '🛏️' },
  ],
}
