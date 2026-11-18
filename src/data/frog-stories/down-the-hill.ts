// 《Frog and Toad Storybook Favorites》— 《Down the Hill》（下山）
// 内容来源：Arnold Lobel 正版绘本，用户自有 PDF（第 136~149 页 / 书页 132~145）经 OCR 提取后，
// 对照原图人工校对 + 逐句中文翻译。
//
// 校对说明（OCR 噪声修正）：
//   - 字母 T 大量误识别为 I：'"T will / "Tam / "IT / "T have / Winter 1s' →
//       'I will / I am / I / I have / Winter is'
//   - 弯引号统一为英文直引号 " '
//   - 诗歌式排版按语义合并断行（一句话原本拆成 2~3 行）
//   - p137 环绕插画乱序："I do not have / ter clothes. / any win" →
//       "I do not have any winter clothes."
//   - p139 删孤立噪声词 "hes"、"2"，还原 "My best friend is trying to kill me."
//   - p147 删孤立噪声词 "Seema"；p146 删页首页码 "142"；p148 删孤立噪声词 "9"
//   - 删除各页页脚页码（132~145）
//
// ⚠️ 版权口径：与 Winnie / Fly Guy / 其它 Frog 故事一致 —— 这是用户自有实体书，
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

export const downTheHill: FrogStory = {
  id: 'down-the-hill',
  title: 'Down the Hill',
  titleZh: '下山',
  sentences: [
    { en: 'Frog knocked at Toad\'s door.', zh: '青蛙敲了敲蟾蜍的门。' },
    { en: '"Toad, wake up," he cried.', zh: '"蟾蜍，醒醒呀，"他大声喊。' },
    { en: '"Come out and see how wonderful the winter is!"', zh: '"快出来看看，冬天有多美呀！"' },
    { en: '"I will not," said Toad.', zh: '"我才不出来呢，"蟾蜍说。' },
    { en: '"I am in my warm bed."', zh: '"我正待在我暖和的被窝里呢。"' },
    { en: '"Winter is beautiful," said Frog.', zh: '"冬天很美呀，"青蛙说。' },
    { en: '"Come out and have fun."', zh: '"出来玩吧，可好玩啦。"' },
    { en: '"Blah," said Toad.', zh: '"哼，"蟾蜍说。' },
    { en: '"I do not have any winter clothes."', zh: '"我又没有冬天的衣服。"' },
    { en: 'Frog came into the house.', zh: '青蛙走进了屋子。' },
    { en: '"I have brought you some things to wear," he said.', zh: '"我给你带了些穿的东西，"他说。' },
    { en: 'Frog pushed a coat down over the top of Toad.', zh: '青蛙把一件外套从蟾蜍的头上套了下去。' },
    { en: 'Frog pulled snowpants up over the bottom of Toad.', zh: '又把雪裤从蟾蜍的脚底往上拉了上来。' },
    { en: 'He put a hat and scarf on Toad\'s head.', zh: '他还把帽子和围巾戴在了蟾蜍头上。' },
    { en: '"Help!" cried Toad.', zh: '"救命呀！"蟾蜍大叫。' },
    { en: '"My best friend is trying to kill me."', zh: '"我最好的朋友想害死我。"' },
    { en: '"I am only getting you ready for winter," said Frog.', zh: '"我只是让你准备好过冬天呀，"青蛙说。' },
    { en: 'Frog and Toad went outside.', zh: '青蛙和蟾蜍走到了外面。' },
    { en: 'They tramped through the snow.', zh: '他们踩着雪往前走。' },
    { en: '"We will ride down this big hill on my sled," said Frog.', zh: '"我们要坐着我的雪橇从这座大山坡上滑下去，"青蛙说。' },
    { en: '"Not me," said Toad.', zh: '"我可不要，"蟾蜍说。' },
    { en: '"Do not be afraid," said Frog.', zh: '"别害怕，"青蛙说。' },
    { en: '"I will be with you on the sled.', zh: '"我会和你一起坐在雪橇上。' },
    { en: 'It will be a fine, fast ride.', zh: '这会是一次又稳又快的滑行。' },
    { en: 'Toad, you sit in front.', zh: '蟾蜍，你坐在前面。' },
    { en: 'I will sit right behind you."', zh: '我就坐在你后面。"' },
    { en: 'The sled began to move down the hill.', zh: '雪橇开始顺着山坡往下滑了。' },
    { en: '"Here we go!" said Frog.', zh: '"我们来啦！"青蛙说。' },
    { en: 'There was a bump.', zh: '颠了一下。' },
    { en: 'Frog fell off the sled.', zh: '青蛙从雪橇上摔了下去。' },
    { en: 'Toad rushed past trees and rocks.', zh: '蟾蜍嗖地冲过树木和石头。' },
    { en: '"Frog, I am glad that you are here," said Toad.', zh: '"青蛙，我真高兴你还在这儿，"蟾蜍说。' },
    { en: 'Toad leaped over a snowbank.', zh: '蟾蜍跃过了一个雪堆。' },
    { en: '"I could not steer the sled without you, Frog," he said.', zh: '"没有你，我可驾驭不了雪橇，青蛙，"他说。' },
    { en: '"You are right. Winter is fun!"', zh: '"你说得对，冬天真好玩！"' },
    { en: 'A crow flew nearby.', zh: '一只乌鸦飞了过来。' },
    { en: '"Hello, Crow," shouted Toad.', zh: '"你好呀，乌鸦！"蟾蜍大声喊。' },
    { en: '"Look at Frog and me.', zh: '"你看看青蛙和我。' },
    { en: 'We can ride a sled better than anybody in the world!"', zh: '我们滑雪橇比世界上任何人都棒！"' },
    { en: '"But Toad," said the crow, "you are alone on the sled."', zh: '"可是蟾蜍，"乌鸦说，"雪橇上只有你一个呀。"' },
    { en: 'Toad looked around.', zh: '蟾蜍四周看了看。' },
    { en: 'He saw that Frog was not there.', zh: '他发现青蛙根本不在。' },
    { en: '"I AM ALL ALONE!" screamed Toad.', zh: '"就我一个人啦！"蟾蜍尖叫起来。' },
    { en: 'The sled hit a tree.', zh: '雪橇撞上了一棵树。' },
    { en: 'The sled hit a rock.', zh: '雪橇又撞上了一块石头。' },
    { en: 'Plop!', zh: '扑通！' },
    { en: 'The sled dived into the snow.', zh: '雪橇一头扎进了雪里。' },
    { en: 'Frog came running down the hill.', zh: '青蛙从山坡上跑了下来。' },
    { en: 'He pulled Toad out of the snow.', zh: '他把蟾蜍从雪里拉了出来。' },
    { en: '"I saw everything," said Frog.', zh: '"我都看见啦，"青蛙说。' },
    { en: '"You did very well by yourself."', zh: '"你自己做得棒极了。"' },
    { en: '"I did not," said Toad.', zh: '"才没有呢，"蟾蜍说。' },
    { en: '"But there is one thing that I can do all by myself."', zh: '"不过有一件事，我一个人就能做好。"' },
    { en: '"What is that?" asked Frog.', zh: '"什么事呀？"青蛙问。' },
    { en: '"I can go home," said Toad.', zh: '"我能自己回家，"蟾蜍说。' },
    { en: '"Winter may be beautiful, but bed is much better."', zh: '"冬天也许很美，可是被窝要舒服多啦。"' },
  ],
  words: [
    { en: 'hill', zh: '小山', emoji: '⛰️' },
    { en: 'winter', zh: '冬天', emoji: '❄️' },
    { en: 'sled', zh: '雪橇', emoji: '🛷' },
    { en: 'snow', zh: '雪', emoji: '🌨️' },
    { en: 'coat', zh: '外套', emoji: '🧥' },
    { en: 'hat', zh: '帽子', emoji: '🎩' },
    { en: 'scarf', zh: '围巾', emoji: '🧣' },
    { en: 'crow', zh: '乌鸦', emoji: '🐦‍⬛' },
    { en: 'rock', zh: '石头', emoji: '🪨' },
    { en: 'tree', zh: '树', emoji: '🌳' },
    { en: 'door', zh: '门', emoji: '🚪' },
    { en: 'bed', zh: '床', emoji: '🛏️' },
  ],
}
