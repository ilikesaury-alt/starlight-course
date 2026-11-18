// Frog and Toad Storybook Favorites —— 《Dragons and Giants》(龙和巨人)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 112-121 页（scripts/_frog_dragons-and-giants.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I："Tl wonder" → "I wonder"、"IT am not afraid" → "I am not afraid"、
//     "T am not afraid" → "I am not afraid"（page 112、115、117 共 3 处）
//   - 弯引号与错配引号 → 统一为直双引号 / 直单引号（如 mountain,' → mountain,"、
//     afraid!'' → afraid!"、"It's" 等）
//   - 跨行断句按语义合并成完整句子；环绕插画页乱序按语序还原：
//     page 113 的 "mY CSD Uiabcawer ©" → "Yes, but are we?"
//     page 119 的 "ton lOddessnousc:" → "to Toad's house."
//     page 121 的 "1me / for a long t / brave together / ing very / t feel / jus"
//       → "for a long time, just feeling very brave together."
//   - 删除页脚页码（108-117）及孤立噪声词（"9" "SR I eet" "PEE lag" "Di" "i" ":" 等）

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const dragonsAndGiants: FrogStory = {
  id: 'dragons-and-giants',
  title: 'Dragons and Giants',
  titleZh: '龙和巨人',
  sentences: [
    { en: 'Frog and Toad were reading a book together.', zh: '青蛙和蟾蜍在一起看书。' },
    { en: '"The people in this book are brave," said Toad.', zh: '"这本书里的人都很勇敢，"蟾蜍说。' },
    { en: '"They fight dragons and giants, and they are never afraid."', zh: '"他们打龙，还打巨人，从来都不害怕。"' },
    { en: '"I wonder if we are brave," said Frog.', zh: '"我在想，我们算不算勇敢呢，"青蛙说。' },
    { en: 'Frog and Toad looked into a mirror.', zh: '青蛙和蟾蜍对着镜子照了照。' },
    { en: '"We look brave," said Frog.', zh: '"我们看起来挺勇敢的，"青蛙说。' },
    { en: '"Yes, but are we?" asked Toad.', zh: '"是呀，可我们真的勇敢吗？"蟾蜍问。' },
    { en: 'Frog and Toad went outside.', zh: '青蛙和蟾蜍走到了外面。' },
    { en: '"We can try to climb this mountain," said Frog. "That should tell us if we are brave."', zh: '"我们来爬爬这座山吧，"青蛙说，"这样就知道我们勇不勇敢了。"' },
    { en: 'Frog went leaping over rocks, and Toad came puffing up behind him.', zh: '青蛙在石头上蹦蹦跳跳地往前走，蟾蜍在后面呼哧呼哧地跟着。' },
    { en: 'They came to a dark cave.', zh: '他们来到一个黑黑的山洞前。' },
    { en: 'A big snake came out of the cave.', zh: '一条大蛇从山洞里爬了出来。' },
    { en: '"Hello lunch," said the snake when he saw Frog and Toad.', zh: '"你好呀，午餐，"大蛇看见青蛙和蟾蜍，说道。' },
    { en: 'He opened his wide mouth.', zh: '他张开了大大的嘴巴。' },
    { en: 'Frog and Toad jumped away.', zh: '青蛙和蟾蜍赶紧跳开了。' },
    { en: 'Toad was shaking.', zh: '蟾蜍直发抖。' },
    { en: '"I am not afraid!" he cried.', zh: '"我一点也不怕！"他喊道。' },
    { en: 'They climbed higher, and they heard a loud noise.', zh: '他们继续往上爬，听见一阵很大的响声。' },
    { en: 'Many large stones were rolling down the mountain.', zh: '好多大石头从山上滚了下来。' },
    { en: '"It\'s an avalanche!" cried Toad.', zh: '"雪崩啦！"蟾蜍大叫起来。' },
    { en: 'Frog and Toad jumped away.', zh: '青蛙和蟾蜍又跳开了。' },
    { en: 'Frog was trembling.', zh: '青蛙浑身发抖。' },
    { en: '"I am not afraid!" he shouted.', zh: '"我一点也不怕！"他大声说。' },
    { en: 'They came to the top of the mountain.', zh: '他们爬到了山顶。' },
    { en: 'The shadow of a hawk fell over them.', zh: '一只老鹰的影子罩在了他们身上。' },
    { en: 'Frog and Toad jumped under a rock.', zh: '青蛙和蟾蜍赶紧钻到一块石头底下。' },
    { en: 'The hawk flew away.', zh: '老鹰飞走了。' },
    { en: '"We are not afraid!" screamed Frog and Toad at the same time.', zh: '"我们不怕！"青蛙和蟾蜍同时尖叫起来。' },
    { en: 'Then they ran down the mountain very fast.', zh: '然后，他们飞快地跑下了山。' },
    { en: 'They ran past the place where they saw the avalanche.', zh: '他们跑过了刚才遇到雪崩的地方。' },
    { en: 'They ran past the place where they saw the snake.', zh: '他们跑过了刚才遇到大蛇的地方。' },
    { en: 'They ran all the way to Toad\'s house.', zh: '他们一路跑回了蟾蜍家。' },
    { en: '"Frog, I am glad to have a brave friend like you," said Toad.', zh: '"青蛙，有你这么勇敢的朋友，我真高兴，"蟾蜍说。' },
    { en: 'He jumped into the bed and pulled the covers over his head.', zh: '他跳上床，把被子拉过来盖住了脑袋。' },
    { en: '"And I am happy to know a brave person like you, Toad," said Frog.', zh: '"我也很高兴认识你这么勇敢的人，蟾蜍，"青蛙说。' },
    { en: 'He jumped into the closet and shut the door.', zh: '他跳进壁橱，把门关上了。' },
    { en: 'Toad stayed in the bed, and Frog stayed in the closet.', zh: '蟾蜍待在床上，青蛙待在壁橱里。' },
    { en: 'They stayed there for a long time, just feeling very brave together.', zh: '他们在那里待了好久好久，心里都觉得自己特别勇敢。' },
  ],
  words: [
    { en: 'dragon', zh: '龙', emoji: '🐉' },
    { en: 'giant', zh: '巨人', emoji: '🧍' },
    { en: 'brave', zh: '勇敢的', emoji: '💪' },
    { en: 'mirror', zh: '镜子', emoji: '🪞' },
    { en: 'mountain', zh: '山', emoji: '⛰️' },
    { en: 'cave', zh: '山洞', emoji: '🕳️' },
    { en: 'snake', zh: '蛇', emoji: '🐍' },
    { en: 'avalanche', zh: '雪崩', emoji: '🏔️' },
    { en: 'hawk', zh: '老鹰', emoji: '🦅' },
    { en: 'shadow', zh: '影子', emoji: '👤' },
    { en: 'afraid', zh: '害怕的', emoji: '😨' },
    { en: 'friend', zh: '朋友', emoji: '🤝' },
  ],
}
