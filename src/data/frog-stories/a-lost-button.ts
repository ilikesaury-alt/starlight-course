// Arnold Lobel 正版绘本《Frog and Toad Storybook Favorites》逐句整理
// 《A Lost Button》（丢掉的纽扣）—— 来源：用户自有绘本 PDF 第 36-47 页，
// 经 OCR 提取 + 对照上下文人工校对（修正 T→I 误识别、断行合并、乱序还原、
// 引号统一为英文半角、删除页脚页码与插画噪声）+ 逐句中文化（温暖口语，面向 6-9 岁）。
//
// 结构：故事按页顺序列出完整句子，words 为主人公和核心情节词（单 token，供点读高亮）。

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const aLostButton: FrogStory = {
  id: 'a-lost-button',
  title: 'A Lost Button',
  titleZh: '丢掉的纽扣',
  sentences: [
    { en: 'Toad and Frog went for a long walk.', zh: '蟾蜍和青蛙去散了很久的步。' },
    { en: 'They walked across a large meadow.', zh: '他们走过一大片草地。' },
    { en: 'They walked in the woods.', zh: '他们穿过树林。' },
    { en: 'They walked along the river.', zh: '他们沿着河边走。' },
    { en: 'At last they went back home to Toad\'s house.', zh: '最后，他们回到了蟾蜍的家。' },
    { en: '"Oh, drat," said Toad.', zh: '“哎呀，真气人！”蟾蜍说。' },
    { en: '"Not only do my feet hurt, but I have lost one of the buttons on my jacket."', zh: '“我的脚不但疼，外套上的一颗纽扣也不见了。”' },
    { en: '"Don\'t worry," said Frog.', zh: '“别担心，”青蛙说。' },
    { en: '"We will go back to all the places where we walked."', zh: '“我们会走回去过的每一个地方。”' },
    { en: '"We will soon find your button."', zh: '“很快就能找到你的纽扣。”' },
    { en: 'They walked back to the large meadow.', zh: '他们走回那片大草地。' },
    { en: 'They began to look for the button in the tall grass.', zh: '他们开始在深草里找纽扣。' },
    { en: '"Here is your button!" cried Frog.', zh: '“你的纽扣在这儿！”青蛙喊道。' },
    { en: '"That is not my button," said Toad.', zh: '“那不是我的纽扣，”蟾蜍说。' },
    { en: '"That button is black. My button was white."', zh: '“那颗纽扣是黑色的，我的纽扣是白色的。”' },
    { en: 'Toad put the black button in his pocket.', zh: '蟾蜍把黑纽扣放进了口袋。' },
    { en: 'A sparrow flew down.', zh: '一只麻雀飞了下来。' },
    { en: '"Excuse me," said the sparrow.', zh: '“打扰一下，”麻雀说。' },
    { en: '"Did you lose a button? I found one."', zh: '“你们丢了一颗纽扣吗？我捡到了一颗。”' },
    { en: '"That is not my button," said Toad.', zh: '“那不是我的纽扣，”蟾蜍说。' },
    { en: '"That button has two holes. My button had four holes."', zh: '“那颗纽扣有两个孔，我的纽扣有四个孔。”' },
    { en: 'Toad put the button with two holes in his pocket.', zh: '蟾蜍把两孔的纽扣放进了口袋。' },
    { en: 'They went back to the woods and looked on the dark paths.', zh: '他们回到树林，在阴暗的小路上找。' },
    { en: '"Here is your button," said Frog.', zh: '“你的纽扣在这儿，”青蛙说。' },
    { en: '"That is not my button," cried Toad.', zh: '“那不是我的纽扣！”蟾蜍叫道。' },
    { en: '"That button is small. My button was big."', zh: '“那颗纽扣很小，我的纽扣很大。”' },
    { en: 'Toad put the small button in his pocket.', zh: '蟾蜍把小纽扣放进了口袋。' },
    { en: 'A raccoon came out from behind a tree.', zh: '一只浣熊从树后面钻了出来。' },
    { en: '"I heard that you were looking for a button," he said.', zh: '“我听说你们在找一颗纽扣，”他说。' },
    { en: '"Here is one that I just found."', zh: '“这就是我刚捡到的。”' },
    { en: '"That is not my button!" wailed Toad.', zh: '“那不是我的纽扣！”蟾蜍哀嚎道。' },
    { en: '"That button is square. My button was round."', zh: '“那颗纽扣是方的，我的纽扣是圆的。”' },
    { en: 'Toad put the square button in his pocket.', zh: '蟾蜍把方纽扣放进了口袋。' },
    { en: 'Frog and Toad went back to the river.', zh: '青蛙和蟾蜍回到河边。' },
    { en: 'They looked for the button in the mud.', zh: '他们在泥巴里找纽扣。' },
    { en: '"Here is your button," said Frog.', zh: '“你的纽扣在这儿，”青蛙说。' },
    { en: '"That is not my button!" shouted Toad.', zh: '“那不是我的纽扣！”蟾蜍大喊。' },
    { en: '"That button is thin. My button was thick."', zh: '“那颗纽扣很薄，我的纽扣很厚。”' },
    { en: 'Toad put the thin button in his pocket.', zh: '蟾蜍把薄纽扣放进了口袋。' },
    { en: 'He was very angry.', zh: '他非常生气。' },
    { en: 'He jumped up and down and screamed, "The whole world is covered with buttons, and not one of them is mine!"', zh: '他跳上跳下，尖叫道：“全世界都是纽扣，就没有一颗是我的！”' },
    { en: 'Toad ran home and slammed the door.', zh: '蟾蜍跑回家，砰地关上门。' },
    { en: 'There, on the floor, he saw his white, four-holed, big, round, thick button.', zh: '就在那儿，地板上，他看见了那颗白色的、四个孔的、又大又圆又厚的纽扣。' },
    { en: '"Oh," said Toad.', zh: '“哦，”蟾蜍说。' },
    { en: '"It was here all the time. What a lot of trouble I have made for Frog."', zh: '“它一直都在这儿啊。我可让青蛙白忙活了一场。”' },
    { en: 'Toad took all of the buttons out of his pocket.', zh: '蟾蜍把口袋里所有的纽扣都拿了出来。' },
    { en: 'He took his sewing box down from the shelf.', zh: '他把针线盒从架子上拿下来。' },
    { en: 'Toad sewed the buttons all over his jacket.', zh: '蟾蜍把纽扣缝得满外套都是。' },
    { en: 'The next day Toad gave his jacket to Frog.', zh: '第二天，蟾蜍把外套送给了青蛙。' },
    { en: 'Frog thought that it was beautiful.', zh: '青蛙觉得它漂亮极了。' },
    { en: 'He put it on and jumped for joy.', zh: '他穿上它，高兴得跳了起来。' },
    { en: 'None of the buttons fell off.', zh: '一颗纽扣也没有掉下来。' },
    { en: 'Toad had sewed them on very well.', zh: '蟾蜍缝得可结实了。' },
  ],
  words: [
    { en: 'button', zh: '纽扣', emoji: '🔘' },
    { en: 'jacket', zh: '外套', emoji: '🧥' },
    { en: 'meadow', zh: '草地', emoji: '🌿' },
    { en: 'woods', zh: '树林', emoji: '🌲' },
    { en: 'river', zh: '小河', emoji: '🏞️' },
    { en: 'pocket', zh: '口袋', emoji: '👖' },
    { en: 'sparrow', zh: '麻雀', emoji: '🐦' },
    { en: 'raccoon', zh: '浣熊', emoji: '🦝' },
    { en: 'mud', zh: '泥巴', emoji: '🟤' },
    { en: 'white', zh: '白色的', emoji: '⬜' },
    { en: 'sew', zh: '缝', emoji: '🧵' },
    { en: 'walk', zh: '走、散步', emoji: '🚶' },
  ],
}
