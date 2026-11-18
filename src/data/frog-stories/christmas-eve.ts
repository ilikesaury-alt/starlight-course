// 《Frog and Toad Storybook Favorites》— 《Christmas Eve》（平安夜）
// 内容来源：Arnold Lobel 正版绘本，用户自有 PDF（第 182~192 页）经 OCR 提取后，
// 对照原图人工校对 + 逐句中文翻译。
//
// 校对说明（OCR 噪声修正）：
//   - 字母 T 误识别为 I："T will / T am / IT am" → "I will / I am / I am"
//   - "wotried" → "worried"，"he 1s" → "he is"
//   - 诗歌式排版按语义合并断行（一句话原本拆成 2~3 行）
//   - p184 孤立噪声词 "hes"、p186 孤立噪声词 "lve" 删除
//   - 删除页脚页码（182~192）与下一则故事标题 "Days With Frog and Toad"
//   - 弯引号 → 英文直引号 " '
//
// ⚠️ 版权口径：与 Winnie / Fly Guy / Frog and Toad 一致 —— 这是用户自有实体书，
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

export const christmasEve: FrogStory = {
  id: 'christmas-eve',
  title: 'Christmas Eve',
  titleZh: '平安夜',
  sentences: [
    { en: 'On Christmas Eve Toad cooked a big dinner.', zh: '平安夜那天，蟾蜍做了一顿丰盛的晚餐。' },
    { en: 'He decorated the tree.', zh: '他把圣诞树装饰好了。' },
    { en: '"Frog is late," said Toad.', zh: '"青蛙迟到了，"蟾蜍说。' },
    { en: 'Toad looked at his clock.', zh: '蟾蜍看了看他的钟。' },
    { en: 'He remembered it was broken.', zh: '他想起这个钟早就坏了。' },
    { en: 'The hands of the clock did not move.', zh: '钟上的指针一动也不动。' },
    { en: 'Toad opened the front door.', zh: '蟾蜍打开了前门。' },
    { en: 'He looked out into the night.', zh: '他望向外面的夜色。' },
    { en: 'Frog was not there.', zh: '青蛙不在那儿。' },
    { en: '"I am worried," said Toad.', zh: '"我好担心啊，"蟾蜍说。' },
    { en: '"What if something terrible has happened?" said Toad.', zh: '"万一出了什么可怕的事呢？"蟾蜍说。' },
    { en: '"What if Frog has fallen into a deep hole and cannot get out? I will never see him again!"', zh: '"万一青蛙掉进了一个深洞里，爬不出来可怎么办？那我就再也见不到他了！"' },
    { en: 'Toad opened the door once more.', zh: '蟾蜍又一次打开了门。' },
    { en: 'Frog was not on the path.', zh: '小路上还是没有青蛙。' },
    { en: '"What if Frog is lost in the woods?" said Toad.', zh: '"万一青蛙在树林里迷路了呢？"蟾蜍说。' },
    { en: '"What if he is cold and wet and hungry?"', zh: '"万一他又冷又湿，肚子还饿着呢？"' },
    { en: '"What if Frog is being chased by a big animal with many sharp teeth? What if he is being eaten up?" cried Toad.', zh: '"万一青蛙正被一只长着满口尖牙的大野兽追着跑呢？万一他被吃掉了呢？"蟾蜍喊道。' },
    { en: '"My friend and I will never have another Christmas together!"', zh: '"我和我的朋友，再也不能一起过圣诞节了！"' },
    { en: 'Toad found some rope in the cellar.', zh: '蟾蜍在地窖里找到了一些绳子。' },
    { en: '"I will pull Frog out of the hole with this," said Toad.', zh: '"我要用这个把青蛙从洞里拉上来，"蟾蜍说。' },
    { en: 'Toad found a lantern in the attic.', zh: '蟾蜍在阁楼里找到了一盏提灯。' },
    { en: '"Frog will see this light. I will show him the way out of the woods," said Toad.', zh: '"青蛙会看见这盏灯的。我要给他指路，带他走出树林，"蟾蜍说。' },
    { en: 'Toad found a frying pan in the kitchen.', zh: '蟾蜍在厨房里找到了一只平底锅。' },
    { en: '"I will hit that big animal with this," said Toad.', zh: '"我要用这个去打那只大野兽，"蟾蜍说。' },
    { en: '"All of his teeth will fall out. Frog, do not worry," cried Toad.', zh: '"它的牙就会全掉光啦。青蛙，别担心，"蟾蜍喊道。' },
    { en: '"I am coming to help you!"', zh: '"我这就来帮你！"' },
    { en: 'Toad ran out of his house.', zh: '蟾蜍跑出了屋子。' },
    { en: 'There was Frog.', zh: '青蛙就在那里。' },
    { en: '"Hello, Toad," he said.', zh: '"你好，蟾蜍，"他说。' },
    { en: '"I am very sorry to be late. I was wrapping your present."', zh: '"真对不起，我来晚了。我刚才一直在包你的礼物。"' },
    { en: '"You are not at the bottom of a hole?" asked Toad.', zh: '"你没有掉到洞底下去吧？"蟾蜍问。' },
    { en: '"No," said Frog.', zh: '"没有，"青蛙说。' },
    { en: '"You are not lost in the woods?" asked Toad.', zh: '"你没有在树林里迷路吧？"蟾蜍问。' },
    { en: '"No," said Frog.', zh: '"没有，"青蛙说。' },
    { en: '"You are not being eaten by a big animal?" asked Toad.', zh: '"你没有被大野兽吃掉吧？"蟾蜍问。' },
    { en: '"No," said Frog. "Not at all."', zh: '"没有，"青蛙说，"根本没有。"' },
    { en: '"Oh, Frog," said Toad, "I am so glad to be spending Christmas with you."', zh: '"哦，青蛙，"蟾蜍说，"我真高兴能和你一起过圣诞节。"' },
    { en: 'Toad opened his present from Frog.', zh: '蟾蜍打开了青蛙送给他的礼物。' },
    { en: 'It was a beautiful new clock.', zh: '是一只漂亮的新钟。' },
    { en: 'The two friends sat by the fire.', zh: '两个好朋友坐在炉火旁。' },
    { en: 'The hands of the clock moved to show the hours of a merry Christmas Eve.', zh: '钟上的指针一格一格地走着，记下了一个快乐的平安夜。' },
  ],
  words: [
    { en: 'christmas', zh: '圣诞节', emoji: '🎄' },
    { en: 'eve', zh: '平安夜', emoji: '🌙' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'dinner', zh: '晚餐', emoji: '🍽️' },
    { en: 'clock', zh: '钟', emoji: '🕐' },
    { en: 'worried', zh: '担心的', emoji: '😟' },
    { en: 'hole', zh: '洞', emoji: '🕳️' },
    { en: 'woods', zh: '树林', emoji: '🌲' },
    { en: 'lantern', zh: '提灯', emoji: '🏮' },
    { en: 'present', zh: '礼物', emoji: '🎁' },
    { en: 'fire', zh: '炉火', emoji: '🔥' },
  ],
}
