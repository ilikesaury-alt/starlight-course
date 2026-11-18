// 《Frog and Toad Storybook Favorites》— 《The Garden》（花园）
// 内容来源：Arnold Lobel 正版绘本，用户自有 PDF（第 84~95 页）经 OCR 提取后，
// 对照原图人工校对 + 逐句中文翻译。
//
// 校对说明（OCR 噪声修正）：
//   - 字母 T 误识别为 I："T will read" → "I will read"
//   - 弯引号 → 英文直引号 " '（"you have, Frog," / "Of course,' → 直引号）
//   - 诗歌式排版按语义合并断行（"start srowing!" 修为 "start growing!"；
//       "iS seeds. / to h" 还原为 "to his seeds."；页码 9 / 84~99 / 孤立噪声词
//       9、S、ee、tz、»）删除
//   - p89 因环绕插画乱序：还原为
//       "Of course," said Frog. "Leave them alone for a few days. ..."
//   - p95 因环绕插画乱序：还原为结尾三句
//       "At last," shouted Toad ... / "And now you will have ... ," said Frog. /
//       "Yes," said Toad, "but you were right, Frog. It was very hard work."
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

export const theGarden: FrogStory = {
  id: 'the-garden',
  title: 'The Garden',
  titleZh: '花园',
  sentences: [
    { en: 'Frog was in his garden.', zh: '青蛙在自己的花园里。' },
    { en: 'Toad came walking by.', zh: '蟾蜍路过，走了过来。' },
    { en: '"What a fine garden you have, Frog," he said.', zh: '"你的花园真漂亮呀，青蛙，"他说。' },
    { en: '"Yes," said Frog. "It is very nice, but it was hard work."', zh: '"是呀，"青蛙说，"是很漂亮，不过这可是辛苦种出来的。"' },
    { en: '"I wish I had a garden," said Toad.', zh: '"我真希望自己也有一个花园，"蟾蜍说。' },
    { en: '"Here are some flower seeds. Plant them in the ground," said Frog, "and soon you will have a garden."', zh: '"这儿有些花种子。把它们种进土里，"青蛙说，"很快你就会有一个花园啦。"' },
    { en: '"How soon?" asked Toad.', zh: '"多快呀？"蟾蜍问。' },
    { en: '"Quite soon," said Frog.', zh: '"很快很快，"青蛙说。' },
    { en: 'Toad ran home.', zh: '蟾蜍跑回了家。' },
    { en: 'He planted the flower seeds.', zh: '他把花种子种了下去。' },
    { en: '"Now seeds," said Toad, "start growing."', zh: '"现在开始长吧，种子，"蟾蜍说。' },
    { en: 'Toad walked up and down a few times.', zh: '蟾蜍踱来踱去，来回走了好几趟。' },
    { en: 'The seeds did not start to grow.', zh: '种子还是没有发芽。' },
    { en: 'Toad put his head close to the ground and said loudly,', zh: '蟾蜍把头凑近地面，大声说：' },
    { en: '"Now seeds, start growing!"', zh: '"现在开始长吧，种子！"' },
    { en: 'Toad looked at the ground again.', zh: '蟾蜍又看了看地面。' },
    { en: 'The seeds did not start to grow.', zh: '种子还是没有发芽。' },
    { en: 'Toad put his head very close to the ground and shouted,', zh: '蟾蜍把头凑得离地面更近，喊道：' },
    { en: '"NOW SEEDS, START GROWING!"', zh: '"种子们，快快长大！"' },
    { en: 'Frog came running up the path.', zh: '青蛙沿着小路跑了过来。' },
    { en: '"What is all this noise?" he asked.', zh: '"这是哪儿来的这么大动静呀？"他问。' },
    { en: '"My seeds will not grow," said Toad.', zh: '"我的种子不肯发芽，"蟾蜍说。' },
    { en: '"You are shouting too much," said Frog. "These poor seeds are afraid to grow."', zh: '"你喊得太厉害啦，"青蛙说，"这些可怜的种子都不敢发芽了。"' },
    { en: '"My seeds are afraid to grow?" asked Toad.', zh: '"我的种子不敢发芽了？"蟾蜍问。' },
    { en: '"Of course," said Frog. "Leave them alone for a few days. Let the sun shine on them, let the rain fall on them. Soon your seeds will start to grow."', zh: '"当然啦，"青蛙说，"让它们安安静静待上几天。让太阳晒着它们，让雨水淋着它们。很快，你的种子就会发芽的。"' },
    { en: 'That night Toad looked out of his window.', zh: '那天晚上，蟾蜍朝窗外看了看。' },
    { en: '"Drat!" said Toad. "My seeds have not started to grow. They must be afraid of the dark."', zh: '"真糟糕！"蟾蜍说，"我的种子还没发芽，它们一定是怕黑。"' },
    { en: 'Toad went out to his garden with some candles.', zh: '蟾蜍拿着几支蜡烛，走到了花园里。' },
    { en: '"I will read the seeds a story," said Toad. "Then they will not be afraid."', zh: '"我来给种子们讲个故事，"蟾蜍说，"这样它们就不怕了。"' },
    { en: 'Toad read a long story to his seeds.', zh: '蟾蜍给种子们讲了一个长长的故事。' },
    { en: 'All the next day Toad sang songs to his seeds.', zh: '接下来一整天，蟾蜍都在给种子们唱歌。' },
    { en: 'And all the next day Toad read poems to his seeds.', zh: '又过了一整天，蟾蜍都在给种子们念诗。' },
    { en: 'And all the next day Toad played music for his seeds.', zh: '再过了一整天，蟾蜍都在给种子们放音乐。' },
    { en: 'Toad looked at the ground.', zh: '蟾蜍看了看地面。' },
    { en: 'The seeds still did not start to grow.', zh: '种子还是没有发芽。' },
    { en: '"What shall I do?" cried Toad. "These must be the most frightened seeds in the whole world."', zh: '"我到底该怎么办呀？"蟾蜍叫起来，"它们一定是全世界最胆小的种子了。"' },
    { en: 'Then Toad felt very tired and he fell asleep.', zh: '后来蟾蜍累极了，就睡着了。' },
    { en: '"Toad, Toad, wake up," said Frog. "Look at your garden!"', zh: '"蟾蜍，蟾蜍，醒醒呀，"青蛙说，"快看你的花园！"' },
    { en: 'Toad looked at his garden.', zh: '蟾蜍看了看自己的花园。' },
    { en: 'Little green plants were coming up out of the ground.', zh: '一棵棵绿色的小苗，正从土里钻出来呢。' },
    { en: '"At last," shouted Toad, "my seeds have stopped being afraid to grow!"', zh: '"终于呀！"蟾蜍喊道，"我的种子不怕发芽啦！"' },
    { en: '"And now you will have a nice garden too," said Frog.', zh: '"现在你也有一个漂亮的花园啦，"青蛙说。' },
    { en: '"Yes," said Toad, "but you were right, Frog. It was very hard work."', zh: '"是呀，"蟾蜍说，"不过你说得对，青蛙。种花园真的很辛苦。"' },
  ],
  words: [
    { en: 'garden', zh: '花园', emoji: '🌷' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'seeds', zh: '种子', emoji: '🌰' },
    { en: 'ground', zh: '土地', emoji: '🟤' },
    { en: 'grow', zh: '生长', emoji: '🌱' },
    { en: 'sun', zh: '太阳', emoji: '☀️' },
    { en: 'rain', zh: '雨', emoji: '🌧️' },
    { en: 'candles', zh: '蜡烛', emoji: '🕯️' },
    { en: 'story', zh: '故事', emoji: '📖' },
    { en: 'plants', zh: '植物', emoji: '🌿' },
    { en: 'flowers', zh: '花', emoji: '🌸' },
  ],
}
