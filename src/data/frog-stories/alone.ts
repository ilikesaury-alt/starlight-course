// 《Alone》（独处）—— Arnold Lobel 正版绘本《Frog and Toad Storybook Favorites》中的故事
// 内容来源：用户自有正版绘本 PDF 第 246~258 页（书页 242~254），经 OCR 提取 + 人工校对。
// 原 OCR 噪声及修正：
//   - 字母 T 大量误识为 I（"1t was"→"it was"、"Frog 1s"→"Frog is"、"T am"→"I am"、
//     "T will"→"I will"）；乱序碎片 "SOh. ssaideloade" 还原为 "Oh," said Toad.
//   - 弯曲引号 “ ” ’ 统一为英文直引号 " '
//   - 诗歌式断行按语义合并（"This morning / when I woke up / I felt good because..."、
//     "He was sitting on an island / by himself." 等）
//   - 插画环绕页的乱序碎片、孤立噪声词（单独的 "|"）与页脚页码（242~254、24G、19>）删除
//   - 故事止于 "sitting alone together."，后面的版权页不收录
//
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

export const alone: FrogStory = {
  id: 'alone',
  title: 'Alone',
  titleZh: '独处',
  sentences: [
    { en: "Toad went to Frog's house.", zh: '蟾蜍去了青蛙家。' },
    { en: 'He found a note on the door.', zh: '他发现门上贴着一张纸条。' },
    { en: 'The note said, "Dear Toad, I am not at home. I went out. I want to be alone."', zh: '纸条上写着："亲爱的蟾蜍，我不在家。我出去了。我想一个人待着。"' },
    { en: '"Alone?" said Toad.', zh: '"一个人待着？"蟾蜍说。' },
    { en: '"Frog has me for a friend. Why does he want to be alone?"', zh: '"青蛙有我这个朋友呀。他为什么想一个人待着呢？"' },
    { en: 'Toad looked through the windows.', zh: '蟾蜍透过窗户往里瞧。' },
    { en: 'He looked in the garden.', zh: '他又在花园里找了找。' },
    { en: 'He did not see Frog.', zh: '可是没看见青蛙。' },
    { en: 'Toad went to the woods.', zh: '蟾蜍去了树林里。' },
    { en: 'Frog was not there.', zh: '青蛙不在那儿。' },
    { en: 'He went to the meadow.', zh: '他又去了草地上。' },
    { en: 'Frog was not there.', zh: '青蛙还是不在。' },
    { en: 'Toad went down to the river.', zh: '蟾蜍来到小河边。' },
    { en: 'There was Frog.', zh: '青蛙在那儿呢。' },
    { en: 'He was sitting on an island by himself.', zh: '他独自坐在一座小岛上。' },
    { en: '"Poor Frog," said Toad.', zh: '"可怜的青蛙，"蟾蜍说。' },
    { en: '"He must be very sad. I will cheer him up."', zh: '"他一定很难过。我要去逗他开心。"' },
    { en: 'Toad ran home.', zh: '蟾蜍跑回了家。' },
    { en: 'He made sandwiches.', zh: '他做了三明治。' },
    { en: 'He made a pitcher of iced tea.', zh: '他又做了一大壶冰茶。' },
    { en: 'He put everything in a basket.', zh: '他把所有东西都放进一个篮子里。' },
    { en: 'Toad hurried back to the river.', zh: '蟾蜍急急忙忙赶回小河边。' },
    { en: `"Frog," he shouted, "it's me. It's your best friend, Toad!"`, zh: '"青蛙！"他大声喊，"是我呀，是你最好的朋友蟾蜍！"' },
    { en: 'Frog was too far away to hear.', zh: '青蛙太远了，听不见。' },
    { en: 'Toad took off his jacket and waved it like a flag.', zh: '蟾蜍脱下外套，像挥旗帜一样挥了起来。' },
    { en: 'Frog was too far away to see.', zh: '青蛙太远了，看不见。' },
    { en: 'Toad shouted and waved, but it was no use.', zh: '蟾蜍又喊又挥，可是没有用。' },
    { en: 'Frog sat on the island.', zh: '青蛙坐在小岛上。' },
    { en: 'He did not see or hear Toad.', zh: '他既没看见，也没听见蟾蜍。' },
    { en: 'A turtle swam by.', zh: '一只乌龟游了过来。' },
    { en: "Toad climbed on the turtle's back.", zh: '蟾蜍爬到了乌龟背上。' },
    { en: '"Turtle," said Toad, "carry me to the island. Frog is there. He wants to be alone."', zh: '"乌龟，"蟾蜍说，"驮我到小岛上去吧。青蛙在那儿，他想一个人待着。"' },
    { en: `"If Frog wants to be alone," said the turtle, "why don't you leave him alone?"`, zh: '"如果青蛙想一个人待着，"乌龟说，"你为什么不让他自己待着呢？"' },
    { en: '"Maybe you are right," said Toad.', zh: '"也许你说得对，"蟾蜍说。' },
    { en: '"Maybe Frog does not want to see me. Maybe he does not want me to be his friend anymore."', zh: '"也许青蛙不想见我。也许他不想再和我做朋友了。"' },
    { en: '"Yes, maybe," said the turtle as he swam to the island.', zh: '"嗯，也许是吧，"乌龟一边说，一边游向小岛。' },
    { en: '"Frog!" cried Toad.', zh: '"青蛙！"蟾蜍喊道。' },
    { en: '"I am sorry for all the dumb things I do. I am sorry for all the silly things I say. Please be my friend again."', zh: '"对不起，我做了那么多傻事。对不起，我说了那么多傻话。请再和我做朋友吧。"' },
    { en: 'Toad slipped off the turtle.', zh: '蟾蜍从乌龟背上滑了下来。' },
    { en: 'With a splash, he fell in the river.', zh: '"扑通"一声，他掉进了河里。' },
    { en: 'Frog pulled Toad up onto the island.', zh: '青蛙把蟾蜍拉上了小岛。' },
    { en: 'Toad looked in the basket.', zh: '蟾蜍看了看篮子。' },
    { en: 'The sandwiches were wet.', zh: '三明治都湿了。' },
    { en: 'The pitcher of iced tea was empty.', zh: '那壶冰茶也空了。' },
    { en: '"Our lunch is spoiled," said Toad.', zh: '"我们的午餐全毁了，"蟾蜍说。' },
    { en: '"I made it for you, Frog, so that you would be happy."', zh: '"我是做给你吃的呀，青蛙，想让你开心一点。"' },
    { en: '"But Toad," said Frog.', zh: '"可是，蟾蜍，"青蛙说。' },
    { en: '"I am happy. I am very happy."', zh: '"我很开心呀，我特别开心。"' },
    { en: '"This morning when I woke up I felt good because the sun was shining."', zh: '"今天早上我醒来的时候，心里特别舒服，因为阳光暖暖地照着。"' },
    { en: '"I felt good because I was a frog."', zh: '"我心里舒服，因为我是一只青蛙。"' },
    { en: '"And I felt good because I have you for a friend."', zh: '"我心里还舒服，因为我有你这个朋友。"' },
    { en: '"I wanted to be alone."', zh: '"我只是想一个人待一会儿。"' },
    { en: '"I wanted to think about how fine everything is."', zh: '"我想好好想一想，一切都是多么美好。"' },
    { en: '"Oh," said Toad.', zh: '"哦，"蟾蜍说。' },
    { en: '"I guess that is a very good reason for wanting to be alone."', zh: '"我想，这确实是一个想一个人待着的好理由。"' },
    { en: '"Now," said Frog, "I will be glad not to be alone."', zh: '"现在嘛，"青蛙说，"我倒是很高兴不用一个人待着了。"' },
    { en: '"Let\'s eat lunch."', zh: '"我们吃午饭吧。"' },
    { en: 'Frog and Toad stayed on the island all afternoon.', zh: '青蛙和蟾蜍在小岛上待了整整一个下午。' },
    { en: 'They ate wet sandwiches without iced tea.', zh: '他们吃着湿湿的三明治，没有冰茶。' },
    { en: 'They were two close friends sitting alone together.', zh: '他们是两个要好的朋友，安安静静地坐在一起。' },
  ],
  words: [
    { en: 'alone', zh: '独自', emoji: '🧘' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'note', zh: '纸条', emoji: '📝' },
    { en: 'woods', zh: '树林', emoji: '🌲' },
    { en: 'meadow', zh: '草地', emoji: '🌿' },
    { en: 'river', zh: '小河', emoji: '🏞️' },
    { en: 'island', zh: '小岛', emoji: '🏝️' },
    { en: 'turtle', zh: '乌龟', emoji: '🐢' },
    { en: 'basket', zh: '篮子', emoji: '🧺' },
    { en: 'sandwiches', zh: '三明治', emoji: '🥪' },
    { en: 'friend', zh: '朋友', emoji: '🤝' },
  ],
}
