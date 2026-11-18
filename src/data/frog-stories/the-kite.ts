// Arnold Lobel 正版绘本《Frog and Toad Storybook Favorites》逐句整理
// 《The Kite》（风筝）—— 来源：用户自有绘本 PDF 第 210-221 页，
// 经 OCR 提取 + 对照上下文人工校对（修正 T→I 误识别、弯引号→英文直引号、
// 诗歌断行按语义合并、环绕插画页乱序还原、删除页脚页码与孤立噪声词）
// + 逐句中文化（温暖口语，面向 6-9 岁）。
//
// 结构：故事按情节顺序列出完整句子，words 为主人公和核心情节词（单 token，供点读高亮）。

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const theKite: FrogStory = {
  id: 'the-kite',
  title: 'The Kite',
  titleZh: '风筝',
  sentences: [
    { en: 'Frog and Toad went out to fly a kite.', zh: '青蛙和蟾蜍出去放风筝。' },
    { en: 'They went to a large meadow where the wind was strong.', zh: '他们来到一片大风呼呼吹的大草地。' },
    { en: '"Our kite will fly up and up," said Frog.', zh: '“我们的风筝会越飞越高，”青蛙说。' },
    { en: '"It will fly all the way up to the top of the sky."', zh: '“它会一直飞到天空最高最高的地方。”' },
    { en: '"Toad," said Frog, "I will hold the ball of string. You hold the kite and run."', zh: '“蟾蜍，”青蛙说，“我来拿着这团线，你举着风筝跑。”' },
    { en: 'Toad ran across the meadow.', zh: '蟾蜍跑过草地。' },
    { en: 'He ran as fast as his short legs could carry him.', zh: '他那两条小短腿，能跑多快就跑多快。' },
    { en: 'The kite went up in the air.', zh: '风筝飞上了天。' },
    { en: 'It fell to the ground with a bump.', zh: '可它“砰”的一声掉到了地上。' },
    { en: 'Toad heard laughter.', zh: '蟾蜍听见一阵笑声。' },
    { en: 'Three robins were sitting in a bush.', zh: '三只知更鸟正坐在灌木丛里。' },
    { en: '"That kite will not fly," said the robins.', zh: '“那风筝根本飞不起来，”知更鸟们说。' },
    { en: '"You may as well give up."', zh: '“你们还是放弃吧。”' },
    { en: 'Toad ran back to Frog.', zh: '蟾蜍跑回青蛙身边。' },
    { en: '"Frog," said Toad, "this kite will not fly. I give up."', zh: '“青蛙，”蟾蜍说，“这风筝飞不起来，我放弃了。”' },
    { en: '"We must make a second try," said Frog.', zh: '“我们得再试第二回，”青蛙说。' },
    { en: '"Wave the kite over your head. Perhaps that will make it fly."', zh: '“把风筝举过头顶挥一挥，说不定它就飞起来了。”' },
    { en: 'Toad ran back across the meadow.', zh: '蟾蜍又跑过草地。' },
    { en: 'He waved the kite over his head.', zh: '他把风筝举过头顶挥来挥去。' },
    { en: 'The kite went up in the air and then fell down with a thud.', zh: '风筝飞上了天，接着又“咚”的一声掉了下来。' },
    { en: '"What a joke!" said the robins.', zh: '“真是个笑话！”知更鸟们说。' },
    { en: '"That kite will never get off the ground."', zh: '“那风筝永远也离不了地。”' },
    { en: 'Toad ran back to Frog.', zh: '蟾蜍又跑回青蛙身边。' },
    { en: '"This kite is a joke," he said.', zh: '“这风筝就是个笑话，”他说。' },
    { en: '"It will never get off the ground."', zh: '“它永远也飞不起来。”' },
    { en: '"We have to make a third try," said Frog.', zh: '“我们得试第三回，”青蛙说。' },
    { en: '"Wave the kite over your head and jump up and down. Perhaps that will make it fly."', zh: '“把风筝举过头顶挥一挥，再跳上跳下，说不定它就飞起来了。”' },
    { en: 'Toad ran across the meadow again.', zh: '蟾蜍再一次跑过草地。' },
    { en: 'He waved the kite over his head.', zh: '他把风筝举过头顶挥来挥去。' },
    { en: 'He jumped up and down.', zh: '他跳上又跳下。' },
    { en: 'The kite went up in the air and crashed down into the grass.', zh: '风筝飞上了天，却“哗啦”一头栽进了草里。' },
    { en: '"That kite is junk," said the robins.', zh: '“那风筝就是堆破烂，”知更鸟们说。' },
    { en: '"Throw it away and go home."', zh: '“把它扔了，回家去吧。”' },
    { en: 'Toad ran back to Frog.', zh: '蟾蜍跑回青蛙身边。' },
    { en: '"This kite is junk," he said.', zh: '“这风筝就是堆破烂，”他说。' },
    { en: '"I think we should throw it away and go home."', zh: '“我觉得我们该把它扔了，回家去。”' },
    { en: '"Toad," said Frog, "we need one more try."', zh: '“蟾蜍，”青蛙说，“我们还得再试一次。”' },
    { en: '"Wave the kite over your head."', zh: '“把风筝举过头顶挥一挥。”' },
    { en: '"Jump up and down and shout, UP KITE UP."', zh: '“跳上跳下，还要喊：风筝飞起来，飞起来！”' },
    { en: 'Toad ran across the meadow.', zh: '蟾蜍跑过草地。' },
    { en: 'He waved the kite over his head.', zh: '他把风筝举过头顶挥来挥去。' },
    { en: 'He jumped up and down.', zh: '他跳上又跳下。' },
    { en: 'He shouted, "UP KITE UP!"', zh: '他大喊：“风筝飞起来，飞起来！”' },
    { en: 'The kite flew into the air.', zh: '风筝飞上了天空。' },
    { en: 'It climbed higher and higher.', zh: '它越飞越高，越飞越高。' },
    { en: '"We did it!" cried Toad.', zh: '“我们做到啦！”蟾蜍叫了起来。' },
    { en: '"Yes," said Frog.', zh: '“是啊，”青蛙说。' },
    { en: '"If a running try did not work, and a running and waving try did not work,"', zh: '“光跑没用，边跑边挥也没用，”' },
    { en: '"and a running, waving, and jumping try did not work,"', zh: '“边跑、边挥、再跳还是没用，”' },
    { en: '"I knew that a running, waving, jumping, and shouting try just had to work."', zh: '“我就知道，边跑、边挥、边跳，再加上喊，这一回准能成。”' },
    { en: 'The robins flew out of the bush.', zh: '知更鸟们从灌木丛里飞了出来。' },
    { en: 'But they could not fly as high as the kite.', zh: '可是他们飞得没有风筝那么高。' },
    { en: 'Frog and Toad sat and watched their kite.', zh: '青蛙和蟾蜍坐下来，看着他们的风筝。' },
    { en: 'It seemed to be flying way up at the top of the sky.', zh: '那风筝看起来，正高高地飞在天空的顶上呢。' },
  ],
  words: [
    { en: 'kite', zh: '风筝', emoji: '🪁' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'meadow', zh: '草地', emoji: '🌿' },
    { en: 'wind', zh: '风', emoji: '💨' },
    { en: 'string', zh: '线', emoji: '🧵' },
    { en: 'fly', zh: '飞', emoji: '🕊️' },
    { en: 'robin', zh: '知更鸟', emoji: '🐦' },
    { en: 'jump', zh: '跳', emoji: '🦘' },
    { en: 'shout', zh: '喊', emoji: '📣' },
    { en: 'sky', zh: '天空', emoji: '☁️' },
    { en: 'grass', zh: '草', emoji: '🌱' },
  ],
}
