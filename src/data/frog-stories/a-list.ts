// Frog and Toad Storybook Favorites —— 《A List》(清单)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著，
// HarperCollins 出版)。原始 OCR 来自 PDF 第 74-87 页（scripts/_frog_a-list.txt），
// 经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I（句首/引号后）："T have / T will / TI cannot / IT am / IT am glad"
//     → "I have / I will / I cannot / I am / I am glad"；"it 1s" → "it is"
//   - 弯引号 “ ” ‘ ’ → 英文直引号 " '
//   - 诗歌式断行按语义合并成完整句（如 "I will write them / all down on a list / so that I
//     can remember them." → 一句）；环绕插画页的破碎文字按语序还原（page 78 的纯噪声页
//     按原著补回 "Toad took his clothes out of the closet and put them on." 等过渡句）
//   - 清单项OCR误字："Wake vp" → "Wake up"、"Zat Breakiast" → "Eat breakfast"、
//     "Set Dressed" → "Get dressed"、"So to Frogs House" → "Go to Frog's house"、
//     "Eat lun" → "Eat lunch"、"Fat Supper" → "Eat supper"、"Eo To SIk2P" → "Go to sleep"
//     （书页上的删除线以文字说明："crossed out: ..."）
//   - 删除页脚页码：70/71/72/73/75/76/78/79/82 及孤立杂讯（"18 5 = < 2)"、"miiheres asaid loads" 等

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const aList: FrogStory = {
  id: 'a-list',
  title: 'A List',
  titleZh: '清单',
  sentences: [
    { en: 'One morning Toad sat in bed.', zh: '一天早上，蟾蜍坐在床上。' },
    { en: '"I have many things to do," he said.', zh: '"我有好多事要做呢，"他说。' },
    { en: '"I will write them all down on a list so that I can remember them."', zh: '"我要把它们全写在一张清单上，这样我就不会忘啦。"' },
    { en: 'Toad wrote on a piece of paper: A List of things to do today', zh: '蟾蜍在一张纸上写道：今天要做的事清单' },
    { en: 'Then he wrote: Wake up', zh: '接着他写下：起床' },
    { en: '"I have done that," said Toad, and he crossed out: Wake up', zh: '"这件事我已经做完啦，"蟾蜍说着，把"起床"划掉了。' },
    { en: 'Then Toad wrote other things on the paper.', zh: '然后蟾蜍又在纸上写了别的事。' },
    { en: 'Eat breakfast', zh: '吃早饭' },
    { en: 'Get dressed', zh: '穿衣服' },
    { en: 'Go to Frog\'s house', zh: '去青蛙家' },
    { en: 'Take a walk with Frog', zh: '和青蛙去散步' },
    { en: 'Eat lunch', zh: '吃午饭' },
    { en: 'Take a nap', zh: '睡午觉' },
    { en: 'Play games with Frog', zh: '和青蛙玩游戏' },
    { en: 'Eat supper', zh: '吃晚饭' },
    { en: 'Go to sleep', zh: '上床睡觉' },
    { en: '"There," said Toad. "Now my day is all written down."', zh: '"好啦，"蟾蜍说，"现在我这一天全都写下来了。"' },
    { en: 'He got out of bed and had something to eat.', zh: '他下了床，吃了点东西。' },
    { en: 'Then Toad crossed out: Eat breakfast', zh: '然后蟾蜍把"吃早饭"划掉了。' },
    { en: 'Toad took his clothes out of the closet and put them on.', zh: '蟾蜍从衣柜里拿出衣服，穿在身上。' },
    { en: 'Then he crossed out: Get dressed', zh: '然后他把"穿衣服"划掉了。' },
    { en: 'Toad put the list in his pocket.', zh: '蟾蜍把清单放进口袋里。' },
    { en: 'He opened the door and walked out into the morning.', zh: '他打开门，走进了清晨的阳光里。' },
    { en: 'Soon Toad was at Frog\'s front door.', zh: '不一会儿，蟾蜍就到了青蛙家的前门口。' },
    { en: 'He took the list from his pocket and crossed out: Go to Frog\'s house', zh: '他从口袋里掏出清单，把"去青蛙家"划掉了。' },
    { en: 'Toad knocked at the door.', zh: '蟾蜍敲了敲门。' },
    { en: '"Hello," said Frog.', zh: '"你好呀，"青蛙说。' },
    { en: '"Look at my list of things to do," said Toad.', zh: '"看看我的做事清单吧，"蟾蜍说。' },
    { en: '"Oh," said Frog. "That is very nice."', zh: '"噢，"青蛙说，"真不错呀。"' },
    { en: 'Toad said, "My list tells me that we will go for a walk."', zh: '蟾蜍说："我的清单上说，我们要去散步。"' },
    { en: '"All right," said Frog. "I am ready."', zh: '"好呀，"青蛙说，"我准备好啦。"' },
    { en: 'Frog and Toad went on a long walk.', zh: '青蛙和蟾蜍去散了很久的步。' },
    { en: 'Then Toad took the list from his pocket again.', zh: '后来蟾蜍又从口袋里掏出了清单。' },
    { en: 'He crossed out: Take a walk with Frog', zh: '他把"和青蛙去散步"划掉了。' },
    { en: 'Just then there was a strong wind.', zh: '就在这时候，刮起了一阵大风。' },
    { en: 'It blew the list out of Toad\'s hand.', zh: '大风把清单从蟾蜍手里吹走了。' },
    { en: 'The list blew high up into the air.', zh: '清单被吹得高高的，飞上了天。' },
    { en: '"Help!" cried Toad.', zh: '"救命啊！"蟾蜍喊起来。' },
    { en: '"My list is blowing away. What will I do without my list?"', zh: '"我的清单被吹跑啦！没有清单，我可怎么办呢？"' },
    { en: '"Hurry!" said Frog. "We will run and catch it."', zh: '"快点！"青蛙说，"我们跑去把它抓住。"' },
    { en: '"No!" shouted Toad.', zh: '"不行！"蟾蜍大叫。' },
    { en: '"I cannot do that."', zh: '"这个我做不到。"' },
    { en: '"Why not?" asked Frog.', zh: '"为什么不行呀？"青蛙问。' },
    { en: '"Because," wailed Toad, "running after my list is not one of the things that I wrote on my list of things to do!"', zh: '"因为，"蟾蜍哭丧着脸说，"追清单这件事，根本不在我写的清单上呀！"' },
    { en: 'Frog ran after the list.', zh: '青蛙追着清单跑了起来。' },
    { en: 'He ran over hills and swamps, but the list blew on and on.', zh: '他跑过小山，跑过沼泽，可清单还是一直往前飘啊飘。' },
    { en: 'At last Frog came back to Toad.', zh: '最后，青蛙回到了蟾蜍身边。' },
    { en: '"I am sorry," gasped Frog, "but I could not catch your list."', zh: '"对不起呀，"青蛙喘着气说，"我没能抓住你的清单。"' },
    { en: '"Blah," said Toad.', zh: '"哼，"蟾蜍没好气地说。' },
    { en: '"I cannot remember any of the things that were on my list of things to do. I will just have to sit here and do nothing," said Toad.', zh: '"清单上的事，我一件也想不起来了。看来我只能坐在这儿，什么也不干了，"蟾蜍说。' },
    { en: 'Toad sat and did nothing.', zh: '蟾蜍坐在那儿，什么也不做。' },
    { en: 'Frog sat with him.', zh: '青蛙陪着他一起坐着。' },
    { en: 'After a long time Frog said, "Toad, it is getting dark. We should be going to sleep now."', zh: '过了好一会儿，青蛙说："蟾蜍，天快黑了，我们该睡觉啦。"' },
    { en: '"Go to sleep!" shouted Toad.', zh: '"睡觉！"蟾蜍喊出声来。' },
    { en: '"That was the last thing on my list!"', zh: '"那正是我清单上的最后一件！"' },
    { en: 'Toad wrote on the ground with a stick: Go to sleep', zh: '蟾蜍用一根小树枝在地上写下：上床睡觉' },
    { en: 'Then he crossed out: Go to sleep', zh: '然后他把"上床睡觉"划掉了。' },
    { en: '"There," said Toad. "Now my day is all crossed out!"', zh: '"好啦，"蟾蜍说，"现在我这一天全都划完啦！"' },
    { en: '"I am glad," said Frog.', zh: '"我真高兴，"青蛙说。' },
    { en: 'Then Frog and Toad went right to sleep.', zh: '然后青蛙和蟾蜍很快就睡着了。' },
  ],
  words: [
    { en: 'list', zh: '清单', emoji: '📝' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'paper', zh: '纸', emoji: '📄' },
    { en: 'pocket', zh: '口袋', emoji: '👖' },
    { en: 'walk', zh: '散步', emoji: '🚶' },
    { en: 'wind', zh: '风', emoji: '💨' },
    { en: 'breakfast', zh: '早饭', emoji: '🍳' },
    { en: 'lunch', zh: '午饭', emoji: '🍽️' },
    { en: 'supper', zh: '晚饭', emoji: '🍲' },
    { en: 'sleep', zh: '睡觉', emoji: '😴' },
    { en: 'stick', zh: '小树枝', emoji: '🪵' },
  ],
}
