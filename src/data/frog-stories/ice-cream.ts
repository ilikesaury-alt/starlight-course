// Frog and Toad Storybook Favorites —— 《Ice Cream》(冰淇淋)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 162-173 页（scripts/_frog_ice-cream.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T / 数字 1 被误识别为 I（或反之）："T wish / IT must / IT cannot / T just saw"
//     → "I wish / I must / I cannot / I just saw"；"so do 1" → "so do I"、
//     "1ce cream" → "ice cream"、"That thing 1s Toad" → "That thing is Toad"
//   - 弯引号与单双引号混用 → 统一为英文直双引号（如 'Frog likes chocolate best," →
//     "Frog likes chocolate best,"、'Here comes a thing with horns!" → "Here comes a thing with horns!" 等）
//   - 跨行断句按语义合并成完整句子（诗歌式断行，如 "A large, soft drop / of chocolate ice cream /
//     slipped down his arm." → "A large, soft drop of chocolate ice cream slipped down his arm."）
//   - page 167 为环绕插画的空白页，跳过；page 169 "Run for your life" 断行还原并补感叹号
//   - 删除页脚页码（158/159/160/161/162/164/165/166/167/169）及孤立噪声词（"ie"、"{22"）
//   - "Said Load" → "said Toad"（OCR 把 T 误识为 L、o 误识为 a）

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const iceCream: FrogStory = {
  id: 'ice-cream',
  title: 'Ice Cream',
  titleZh: '冰淇淋',
  sentences: [
    { en: 'One hot summer day Frog and Toad sat by the pond.', zh: '炎炎夏日的一天，青蛙和蟾蜍坐在池塘边。' },
    { en: '"I wish we had some sweet, cold ice cream," said Frog.', zh: '"我真希望我们能吃到又甜又凉的冰淇淋，"青蛙说。' },
    { en: '"What a good idea," said Toad.', zh: '"这主意真棒，"蟾蜍说。' },
    { en: '"Wait right here, Frog. I will be back soon."', zh: '"你就在这儿等着，青蛙。我很快就回来。"' },
    { en: 'Toad went to the store.', zh: '蟾蜍去了商店。' },
    { en: 'He bought two big ice-cream cones.', zh: '他买了两个大大的冰淇淋蛋筒。' },
    { en: 'Toad licked one of the cones.', zh: '蟾蜍舔了舔其中一个蛋筒。' },
    { en: '"Frog likes chocolate best," said Toad, and so do I.', zh: '"青蛙最喜欢巧克力味的，"蟾蜍说，"我也是。"' },
    { en: 'Toad walked along the path.', zh: '蟾蜍沿着小路往前走。' },
    { en: 'A large, soft drop of chocolate ice cream slipped down his arm.', zh: '一大滴软软的巧克力冰淇淋顺着他的胳膊滑了下来。' },
    { en: '"This ice cream is melting in the sun," said Toad.', zh: '"这冰淇淋在太阳底下化掉啦，"蟾蜍说。' },
    { en: 'Toad walked faster.', zh: '蟾蜍走得更快了。' },
    { en: 'Many drops of melting ice cream flew through the air.', zh: '好多融化的冰淇淋滴飞到了空中。' },
    { en: 'They fell down on Toad\'s head.', zh: '它们落在了蟾蜍的头上。' },
    { en: '"I must hurry back to Frog!" he cried.', zh: '"我得赶紧回到青蛙那儿去！"他喊道。' },
    { en: 'More and more of the ice cream was melting.', zh: '越来越多的冰淇淋在融化。' },
    { en: 'It dripped down on Toad\'s jacket.', zh: '它一滴一滴落在蟾蜍的外套上。' },
    { en: 'It splattered on his pants and on his feet.', zh: '它溅到了他的裤子上，还溅到了他的脚上。' },
    { en: '"Where is the path?" cried Toad. "I cannot see!"', zh: '"小路在哪儿呀？"蟾蜍喊道，"我什么都看不见！"' },
    { en: 'Frog sat by the pond waiting for Toad.', zh: '青蛙坐在池塘边，等着蟾蜍。' },
    { en: 'A mouse ran by.', zh: '一只小老鼠跑了过去。' },
    { en: '"I just saw something awful," cried the mouse. "It was big and brown!"', zh: '"我刚才看见了特别可怕的东西，"老鼠喊道，"它又大又是棕色的！"' },
    { en: '"Something covered with sticks and leaves is moving this way!" cried a squirrel.', zh: '"有个盖满树枝和树叶的东西正往这边动呢！"一只松鼠喊道。' },
    { en: '"Here comes a thing with horns!" shouted a rabbit.', zh: '"长着角的东西来啦！"一只兔子大声喊。' },
    { en: '"Run for your life!"', zh: '"快逃命呀！"' },
    { en: '"What can it be?" asked Frog.', zh: '"那会是什么呢？"青蛙问。' },
    { en: 'Frog hid behind a rock.', zh: '青蛙躲到了一块石头后面。' },
    { en: 'He saw the thing coming.', zh: '他看见那个东西走过来了。' },
    { en: 'It was big and brown.', zh: '它又大又是棕色的。' },
    { en: 'It was covered with sticks and leaves.', zh: '它身上盖着树枝和树叶。' },
    { en: 'It had two horns.', zh: '它长着两只角。' },
    { en: '"Frog," cried the thing. "Where are you?"', zh: '"青蛙，"那个东西喊道，"你在哪儿呀？"' },
    { en: '"Good heavens!" said Frog. "That thing is Toad!"', zh: '"天哪！"青蛙说，"那个东西是蟾蜍！"' },
    { en: 'Toad fell into the pond.', zh: '蟾蜍扑通一声掉进了池塘里。' },
    { en: 'He sank to the bottom and came up again.', zh: '他沉到了水底，又浮了上来。' },
    { en: '"Drat," said Toad. "All of our sweet, cold ice cream has washed away."', zh: '"真糟糕，"蟾蜍说，"我们那些又甜又凉的冰淇淋全被冲走啦。"' },
    { en: '"Never mind," said Frog. "I know what we can do."', zh: '"没关系，"青蛙说，"我知道我们能做什么。"' },
    { en: 'Frog and Toad quickly ran back to the store.', zh: '青蛙和蟾蜍飞快地跑回了商店。' },
    { en: 'Then they sat in the shade of a large tree and ate their chocolate ice-cream cones together.', zh: '然后他们坐在一棵大树的树荫下，一起吃起了巧克力冰淇淋蛋筒。' },
  ],
  words: [
    { en: 'ice', zh: '冰', emoji: '🧊' },
    { en: 'cream', zh: '奶油', emoji: '🥛' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'pond', zh: '池塘', emoji: '🪷' },
    { en: 'cone', zh: '蛋筒', emoji: '🍦' },
    { en: 'chocolate', zh: '巧克力', emoji: '🍫' },
    { en: 'melt', zh: '融化', emoji: '🫠' },
    { en: 'path', zh: '小路', emoji: '🛤️' },
    { en: 'store', zh: '商店', emoji: '🏪' },
    { en: 'shade', zh: '树荫', emoji: '🌳' },
    { en: 'drip', zh: '滴落', emoji: '💧' },
  ],
}
