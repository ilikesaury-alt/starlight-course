// Frog and Toad Storybook Favorites —— 《The Dream》(梦)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 122-134 页（scripts/_frog_the-dream.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I："T will be lonely / T always do / IT am so glad" → "I will / I always / I am"
//     （page 130、133 共 3 处）；page 132 的 "Frog, 1s that really you?" → "Frog, is that really you?"
//   - 弯引号 → 英文直双引号；大写标题式喊话保留全大写，叙述句里误大写的 "Stage" 改回小写 stage
//   - 诗歌式断行按语义合并成完整句子；page 130-132 环绕插画的乱序/破碎文字按语序还原：
//     page 130 的杂讯 "99" 与孤立 "." 是声音喊话被 "Shut up!" 打断的省略号，
//     page 131 整页 "nae / gh aa online" 是插画噪声，全删；
//     page 132 的 "ieamemehtehere,:" → "I am here,"（紧接着 "said Frog."，呼应上一句 "I will be lonely!"）
//   - 删除页脚页码：118/119/1Z0(120)/1Z1(121)/122/123/124/125/126/128/129/130
//     及书末另一册书名 "Frog and Toad All Year"

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const theDream: FrogStory = {
  id: 'the-dream',
  title: 'The Dream',
  titleZh: '梦',
  sentences: [
    { en: 'Toad was asleep, and he was having a dream.', zh: '蟾蜍睡着了，他做了一个梦。' },
    { en: 'He was on a stage, and he was wearing a costume.', zh: '他站在舞台上，身上穿着演出服。' },
    { en: 'Toad looked out into the dark.', zh: '蟾蜍朝黑漆漆的台下望去。' },
    { en: 'Frog was sitting in the theater.', zh: '青蛙正坐在剧场里。' },
    { en: 'A strange voice from far away said, "PRESENTING THE GREATEST TOAD IN ALL THE WORLD!"', zh: '远处传来一个陌生的声音："有请全世界最了不起的蟾蜍登场！"' },
    { en: 'Toad took a deep bow.', zh: '蟾蜍深深地鞠了一躬。' },
    { en: 'Frog looked smaller as he shouted, "Hooray for Toad!"', zh: '青蛙大喊："蟾蜍万岁！"他看上去变小了。' },
    { en: '"TOAD WILL NOW PLAY THE PIANO VERY WELL," said the strange voice.', zh: '"蟾蜍现在要弹钢琴啦，会弹得棒极了，"那个陌生的声音说。' },
    { en: 'Toad played the piano, and he did not miss a note.', zh: '蟾蜍弹起钢琴来，一个音都没弹错。' },
    { en: '"Frog," cried Toad, "can you play the piano like this?"', zh: '"青蛙，"蟾蜍喊道，"你能像我这样弹钢琴吗？"' },
    { en: '"No," said Frog.', zh: '"不能，"青蛙说。' },
    { en: 'It seemed to Toad that Frog looked even smaller.', zh: '蟾蜍觉得，青蛙看起来更小了。' },
    { en: '"TOAD WILL NOW WALK ON A HIGH WIRE, AND HE WILL NOT FALL DOWN," said the voice.', zh: '"蟾蜍现在要在高高的钢丝上走，还不会掉下来，"那个声音说。' },
    { en: 'Toad walked on the high wire.', zh: '蟾蜍在钢丝上走了起来。' },
    { en: '"Frog," cried Toad, "can you do tricks like this?"', zh: '"青蛙，"蟾蜍喊道，"你能表演这样的绝技吗？"' },
    { en: '"No," peeped Frog, who looked very, very small.', zh: '"不能，"青蛙小声说，他看上去非常非常小。' },
    { en: '"TOAD WILL NOW DANCE, AND HE WILL BE WONDERFUL," said the voice.', zh: '"蟾蜍现在要跳舞啦，他会跳得精彩极了，"那个声音说。' },
    { en: '"Frog, can you be as wonderful as this?" said Toad as he danced all over the stage.', zh: '"青蛙，你能像我这么棒吗？"蟾蜍一边说，一边在舞台上跳来跳去。' },
    { en: 'There was no answer.', zh: '没有人回答。' },
    { en: 'Toad looked out into the theater.', zh: '蟾蜍朝剧场里望去。' },
    { en: 'Frog was so small that he could not be seen or heard.', zh: '青蛙太小了，看不见，也听不见了。' },
    { en: '"Frog," said Toad, "where are you?"', zh: '"青蛙，"蟾蜍说，"你在哪儿呀？"' },
    { en: 'There was still no answer.', zh: '还是没有人回答。' },
    { en: '"Frog, what have I done?" cried Toad.', zh: '"青蛙，我做了什么呀？"蟾蜍喊道。' },
    { en: 'Then the voice said, "THE GREATEST TOAD WILL NOW..."', zh: '这时那个声音又说："最了不起的蟾蜍现在要……"' },
    { en: '"Shut up!" screamed Toad. "Frog, Frog, where have you gone?"', zh: '"别说了！"蟾蜍尖叫起来。"青蛙，青蛙，你到哪儿去了？"' },
    { en: 'Toad was spinning in the dark.', zh: '蟾蜍在黑暗里团团转。' },
    { en: '"Come back, Frog," he shouted. "I will be lonely!"', zh: '"回来吧，青蛙，"他大声喊，"我会孤单的！"' },
    { en: '"I am here," said Frog.', zh: '"我在这儿呢，"青蛙说。' },
    { en: 'Frog was standing near Toad\'s bed.', zh: '青蛙正站在蟾蜍的床边。' },
    { en: '"Wake up, Toad," he said.', zh: '"醒醒，蟾蜍，"他说。' },
    { en: '"Frog, is that really you?" said Toad.', zh: '"青蛙，真的是你吗？"蟾蜍问。' },
    { en: '"Of course it is me," said Frog.', zh: '"当然是我呀，"青蛙说。' },
    { en: '"And are you your own right size?" asked Toad.', zh: '"那你也变回原来的大小了吗？"蟾蜍问。' },
    { en: '"Yes, I think so," said Frog.', zh: '"是的，我想是吧，"青蛙说。' },
    { en: 'Toad looked at the sunshine coming through the window.', zh: '蟾蜍看着从窗户照进来的阳光。' },
    { en: '"Frog," he said, "I am so glad that you came over."', zh: '"青蛙，"他说，"你过来找我，我真是太高兴了。"' },
    { en: '"I always do," said Frog.', zh: '"我总是会来的呀，"青蛙说。' },
    { en: 'Then Frog and Toad ate a big breakfast.', zh: '后来，青蛙和蟾蜍吃了一顿丰盛的早餐。' },
    { en: 'And after that they spent a fine, long day together.', zh: '吃完以后，他们一起度过了美好又漫长的一天。' },
  ],
  words: [
    { en: 'dream', zh: '梦', emoji: '💭' },
    { en: 'asleep', zh: '睡着', emoji: '😴' },
    { en: 'stage', zh: '舞台', emoji: '🎭' },
    { en: 'costume', zh: '演出服', emoji: '👗' },
    { en: 'theater', zh: '剧场', emoji: '🏛️' },
    { en: 'voice', zh: '声音', emoji: '🗣️' },
    { en: 'piano', zh: '钢琴', emoji: '🎹' },
    { en: 'wire', zh: '钢丝', emoji: '🎢' },
    { en: 'dance', zh: '跳舞', emoji: '💃' },
    { en: 'bow', zh: '鞠躬', emoji: '🙇' },
    { en: 'sunshine', zh: '阳光', emoji: '☀️' },
    { en: 'breakfast', zh: '早餐', emoji: '🍳' },
  ],
}
