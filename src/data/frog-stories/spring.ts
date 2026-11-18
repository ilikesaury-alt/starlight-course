// 《Frog and Toad Storybook Favorites》— 《Spring》（春天）
// 内容来源：Arnold Lobel 正版绘本，用户自有 PDF（第 12~23 页）经 OCR 提取后，
// 对照原图人工校对 + 逐句中文翻译。
//
// 校对说明（OCR 噪声修正）：
//   - 字母 T 大量误识别为 I："T will / T cannot / 'T am" → "I will / I cannot / I am"
//   - 诗歌式排版按语义合并断行（一句话原本拆成 2~3 行）
//   - p13 因环绕插画严重乱序：还原为
//       "The sun is shining! The snow is melting. Wake up!" / "I am not here," said the voice.
//   - p17 因环绕插画破碎：还原为
//       "You can count them, Frog," said Toad. "I will be too tired. I am going back to bed."
//   - 删除页脚页码（9 / 10 / 11 / 1Z / 12 / 13 / 14 / 15 / 16 / 17 / 18 / 19）
//
// ⚠️ 版权口径：与 Winnie / Fly Guy / Rocket Girl 一致 —— 这是用户自有实体书，
//   仅作合理使用展示，这里只放文字（逐句 en/zh），不内置扫描图片。原 PDF 不进 git。

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const spring: FrogStory = {
  id: 'spring',
  title: 'Spring',
  titleZh: '春天',
  sentences: [
    { en: 'Frog ran up the path to Toad\'s house.', zh: '青蛙沿着小路跑到蟾蜍家。' },
    { en: 'He knocked on the front door.', zh: '他敲了敲前门。' },
    { en: 'There was no answer.', zh: '没有人应答。' },
    { en: '"Toad, Toad," shouted Frog, "wake up. It is spring!"', zh: '"蟾蜍，蟾蜍，"青蛙大声喊，"醒醒啦，春天到啦！"' },
    { en: '"Blah," said a voice from inside the house.', zh: '"哼哼，"屋子里传来一个声音。' },
    { en: '"Toad, Toad," cried Frog.', zh: '"蟾蜍，蟾蜍，"青蛙又叫起来。' },
    { en: '"The sun is shining! The snow is melting. Wake up!"', zh: '"太阳出来啦！雪在融化啦！快醒醒！"' },
    { en: '"I am not here," said the voice.', zh: '"我不在这儿，"那个声音说。' },
    { en: 'Frog walked into the house.', zh: '青蛙走进屋子。' },
    { en: 'It was dark.', zh: '屋子里黑黑的。' },
    { en: 'All the shutters were closed.', zh: '所有的百叶窗都关着。' },
    { en: '"Toad, where are you?" called Frog.', zh: '"蟾蜍，你在哪儿？"青蛙喊道。' },
    { en: '"Go away," said the voice from a corner of the room.', zh: '"走开，"屋子角落里传来那个声音。' },
    { en: 'Toad was lying in bed.', zh: '蟾蜍正躺在床上。' },
    { en: 'He had pulled all the covers over his head.', zh: '他把被子整个蒙在了头上。' },
    { en: 'Frog pushed Toad out of bed.', zh: '青蛙把蟾蜍从床上推了起来。' },
    { en: 'He pushed him out of the house and onto the front porch.', zh: '又把他推出屋子，推到了前廊上。' },
    { en: 'Toad blinked in the bright sun.', zh: '蟾蜍在明亮的阳光下眨了眨眼。' },
    { en: '"Help!" said Toad.', zh: '"救命呀！"蟾蜍说。' },
    { en: '"I cannot see anything."', zh: '"我什么都看不见。"' },
    { en: '"Don\'t be silly," said Frog.', zh: '"别傻啦，"青蛙说。' },
    { en: '"What you see is the clear warm light of April.', zh: '"你看见的，是四月里明亮又暖和的阳光。' },
    { en: 'And it means that we can begin a whole new year together, Toad.', zh: '它意味着，我们可以一起开始全新的一年了，蟾蜍。' },
    { en: 'Think of it," said Frog.', zh: '想想看呀，"青蛙说。' },
    { en: '"We will skip through the meadows and run through the woods and swim in the river.', zh: '"我们要蹦蹦跳跳过草地，跑过树林，还在河里游泳。' },
    { en: 'In the evenings we will sit right here on this front porch and count the stars."', zh: '到了晚上，我们就坐在这前廊上，一起数星星。"' },
    { en: '"You can count them, Frog," said Toad.', zh: '"你数吧，青蛙，"蟾蜍说。' },
    { en: '"I will be too tired. I am going back to bed."', zh: '"我会累坏的。我要回床上睡觉去了。"' },
    { en: 'Toad went back into the house.', zh: '蟾蜍走回屋子里。' },
    { en: 'He got into the bed and pulled the covers over his head again.', zh: '他爬上床，又把被子蒙过了头顶。' },
    { en: '"But, Toad," cried Frog, "you will miss all the fun!"', zh: '"可是，蟾蜍，"青蛙喊道，"你会错过所有好玩的事呀！"' },
    { en: '"Listen, Frog," said Toad. "How long have I been asleep?"', zh: '"听着，青蛙，"蟾蜍说，"我睡了多久啦？"' },
    { en: '"You have been asleep since November," said Frog.', zh: '"你从十一月就一直睡着呢，"青蛙说。' },
    { en: '"Well then," said Toad, "a little more sleep will not hurt me.', zh: '"那好吧，"蟾蜍说，"再睡一小会儿也碍不了事。' },
    { en: 'Come back again and wake me up at about half past May. Good night, Frog."', zh: '你五点半左右再回来叫醒我吧。晚安，青蛙。"' },
    { en: '"But, Toad," said Frog, "I will be lonely until then."', zh: '"可是，蟾蜍，"青蛙说，"在那之前我会很孤单的。"' },
    { en: 'Toad did not answer.', zh: '蟾蜍没有回答。' },
    { en: 'He had fallen asleep.', zh: '他已经睡着了。' },
    { en: 'Frog looked at Toad\'s calendar.', zh: '青蛙看了看蟾蜍的日历。' },
    { en: 'The November page was still on top.', zh: '最上面还是十一月那一页。' },
    { en: 'Frog tore off the November page.', zh: '青蛙撕掉了十一月那一页。' },
    { en: 'He tore off the December page.', zh: '他又撕掉了十二月那一页。' },
    { en: 'And the January page, the February page, and the March page.', zh: '还有一月、二月和三月那几页。' },
    { en: 'He came to the April page.', zh: '他翻到了四月那一页。' },
    { en: 'Frog tore off the April page too.', zh: '青蛙把四月那一页也撕掉了。' },
    { en: 'Then Frog ran back to Toad\'s bed.', zh: '然后青蛙跑回蟾蜍的床边。' },
    { en: '"Toad, Toad, wake up. It is May now."', zh: '"蟾蜍，蟾蜍，醒醒，现在已经是五月啦。"' },
    { en: '"What?" said Toad.', zh: '"什么？"蟾蜍说。' },
    { en: '"Can it be May so soon?"', zh: '"五月怎么会来得这么快？"' },
    { en: '"Yes," said Frog.', zh: '"是啊，"青蛙说。' },
    { en: '"Look at your calendar."', zh: '"看看你的日历吧。"' },
    { en: 'Toad looked at the calendar.', zh: '蟾蜍看了看日历。' },
    { en: 'The May page was on top.', zh: '最上面是五月那一页。' },
    { en: '"Why, it is May!" said Toad as he climbed out of bed.', zh: '"哎呀，真的是五月了！"蟾蜍一边说，一边爬下了床。' },
    { en: 'Then he and Frog ran outside to see how the world was looking in the spring.', zh: '然后他和青蛙跑到外面，去看看春天里的世界是什么模样。' },
  ],
  words: [
    { en: 'spring', zh: '春天', emoji: '🌸' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'sun', zh: '太阳', emoji: '☀️' },
    { en: 'snow', zh: '雪', emoji: '❄️' },
    { en: 'shining', zh: '照耀', emoji: '✨' },
    { en: 'melting', zh: '融化', emoji: '💧' },
    { en: 'bed', zh: '床', emoji: '🛏️' },
    { en: 'calendar', zh: '日历', emoji: '📅' },
    { en: 'tired', zh: '累的', emoji: '😴' },
    { en: 'asleep', zh: '睡着的', emoji: '😪' },
    { en: 'stars', zh: '星星', emoji: '⭐' },
  ],
}
