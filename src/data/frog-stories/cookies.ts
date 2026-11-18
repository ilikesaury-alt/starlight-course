// Frog and Toad Storybook Favorites —— 《Cookies》(饼干)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 100-111 页（scripts/_frog_cookies.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I："IT think / IT am" → "I think / I am"（共 2 处）
//   - 弯引号 / 单双引号混用 → 统一为英文直双引号（如 'And they taste... → "And they taste...）
//   - 诗歌式断行按语义合并成完整句子；环绕插画处乱序/破碎文字按正确语序还原
//   - 删除页脚页码（96/97/99/100/101/102/103/104/105）及孤立乱码噪声
//     （blewateeones、fz、1??、~ijheretaher sara:、行首孤立星号 * 等）

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const cookies: FrogStory = {
  id: 'cookies',
  title: 'Cookies',
  titleZh: '饼干',
  sentences: [
    { en: 'Toad baked some cookies.', zh: '蟾蜍烤了一些饼干。' },
    { en: '"These cookies smell very good," said Toad.', zh: '"这些饼干闻起来好香啊，"蟾蜍说。' },
    { en: '"And they taste even better," he said.', zh: '"吃起来味道更棒呢，"他说。' },
    { en: 'Toad ran to Frog\'s house.', zh: '蟾蜍跑到青蛙家。' },
    { en: '"Frog, Frog," cried Toad, "taste these cookies that I have made."', zh: '"青蛙，青蛙，"蟾蜍喊道，"尝尝我做的饼干吧。"' },
    { en: 'Frog ate one of the cookies.', zh: '青蛙吃了一块饼干。' },
    { en: '"These are the best cookies I have ever eaten!" said Frog.', zh: '"这是我吃过的最好吃的饼干！"青蛙说。' },
    { en: 'Frog and Toad ate many cookies, one after another.', zh: '青蛙和蟾蜍吃了一块又一块饼干。' },
    { en: '"You know, Toad," said Frog, with his mouth full, "I think we should stop eating. We will soon be sick."', zh: '"你知道吗，蟾蜍，"青蛙嘴里塞得满满的说，"我觉得咱们该停下来了。再吃下去很快就要生病啦。"' },
    { en: '"You are right," said Toad.', zh: '"你说得对，"蟾蜍说。' },
    { en: '"Let us eat one last cookie, and then we will stop."', zh: '"咱们再吃最后一块，然后就不吃了。"' },
    { en: 'Frog and Toad ate one last cookie.', zh: '青蛙和蟾蜍吃了最后一块饼干。' },
    { en: 'There were many cookies left in the bowl.', zh: '碗里还剩好多饼干呢。' },
    { en: '"Frog," said Toad, "let us eat one very last cookie, and then we will stop."', zh: '"青蛙，"蟾蜍说，"咱们再吃一块最最后一块，然后就真的不吃了。"' },
    { en: 'Frog and Toad ate one very last cookie.', zh: '青蛙和蟾蜍吃了最最后一块饼干。' },
    { en: '"We must stop eating!" cried Toad as he ate another.', zh: '"我们必须停下来！"蟾蜍一边喊，一边又吃了一块。' },
    { en: '"Yes," said Frog, reaching for a cookie, "we need will power."', zh: '"是啊，"青蛙伸手又去拿饼干，"我们需要意志力。"' },
    { en: '"What is will power?" asked Toad.', zh: '"什么是意志力呀？"蟾蜍问。' },
    { en: '"Will power is trying hard not to do something that you really want to do," said Frog.', zh: '"意志力就是努力忍着，不去做你特别想做的事，"青蛙说。' },
    { en: '"You mean like trying not to eat all of these cookies?" asked Toad.', zh: '"你是说，就像忍着别把这些饼干全吃掉那样吗？"蟾蜍问。' },
    { en: '"Right," said Frog.', zh: '"没错，"青蛙说。' },
    { en: 'Frog put the cookies in a box.', zh: '青蛙把饼干放进一个盒子里。' },
    { en: '"Now we will not eat any more cookies."', zh: '"现在咱们不会再吃饼干了。"' },
    { en: '"But we can open the box," said Toad.', zh: '"可是咱们可以把盒子打开呀，"蟾蜍说。' },
    { en: '"That is true," said Frog.', zh: '"这倒是真的，"青蛙说。' },
    { en: 'Frog tied some string around the box.', zh: '青蛙用一根绳子把盒子捆了起来。' },
    { en: '"There," he said. "Now we will not eat any more cookies."', zh: '"好啦，"他说，"现在咱们不会再吃饼干了。"' },
    { en: '"But we can cut the string and open the box," said Toad.', zh: '"可是咱们可以把绳子剪断，把盒子打开呀，"蟾蜍说。' },
    { en: '"That is true," said Frog.', zh: '"这倒是真的，"青蛙说。' },
    { en: 'Frog got a ladder.', zh: '青蛙搬来一架梯子。' },
    { en: 'He put the box up on a high shelf.', zh: '他把盒子放到高高的架子上。' },
    { en: '"There," said Frog. "Now we will not eat any more cookies."', zh: '"好啦，"青蛙说，"现在咱们不会再吃饼干了。"' },
    { en: '"But we can climb the ladder and take the box down from the shelf and cut the string and open the box," said Toad.', zh: '"可是咱们可以爬上梯子，把盒子从架子上拿下来，剪断绳子，再打开盒子呀，"蟾蜍说。' },
    { en: '"That is true," said Frog.', zh: '"这倒是真的，"青蛙说。' },
    { en: 'Frog climbed the ladder and took the box down from the shelf.', zh: '青蛙爬上梯子，把盒子从架子上拿了下来。' },
    { en: 'He cut the string and opened the box.', zh: '他剪断绳子，打开了盒子。' },
    { en: 'Frog took the box outside.', zh: '青蛙把盒子拿到屋外。' },
    { en: 'He shouted in a loud voice, "HEY BIRDS, HERE ARE COOKIES!"', zh: '他大声喊道："喂，小鸟们，饼干在这儿！"' },
    { en: 'Birds came from everywhere.', zh: '小鸟从四面八方飞来了。' },
    { en: 'They picked up all the cookies in their beaks and flew away.', zh: '它们用嘴叼起所有的饼干，飞走了。' },
    { en: '"Now we have no more cookies to eat," said Toad sadly.', zh: '"现在我们没有饼干吃啦，"蟾蜍伤心地说。' },
    { en: '"Not even one."', zh: '"一块也不剩。"' },
    { en: '"Yes," said Frog, "but we have lots and lots of will power."', zh: '"是啊，"青蛙说，"可我们有许多许多的意志力呀。"' },
    { en: '"You may keep it all, Frog," said Toad.', zh: '"那你就把意志力都留着吧，青蛙，"蟾蜍说。' },
    { en: '"I am going home now to bake a cake."', zh: '"我现在要回家去烤一个蛋糕啦。"' },
  ],
  words: [
    { en: 'cookie', zh: '饼干', emoji: '🍪' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🟤' },
    { en: 'bake', zh: '烤', emoji: '🔥' },
    { en: 'bowl', zh: '碗', emoji: '🥣' },
    { en: 'box', zh: '盒子', emoji: '📦' },
    { en: 'string', zh: '绳子', emoji: '🧵' },
    { en: 'ladder', zh: '梯子', emoji: '🪜' },
    { en: 'shelf', zh: '架子', emoji: '🗄️' },
    { en: 'bird', zh: '小鸟', emoji: '🐦' },
    { en: 'cake', zh: '蛋糕', emoji: '🎂' },
    { en: 'sick', zh: '生病的', emoji: '🤒' },
  ],
}
