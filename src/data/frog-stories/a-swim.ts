// Frog and Toad Storybook Favorites —— 《A Swim》(游泳)
// 内容来源：用户自有正版绘本《Frog and Toad Storybook Favorites》(Arnold Lobel 著)。
// 原始 OCR 来自 PDF 第 48-60 页（scripts/_frog_a-swim.txt），经人工校对后整理为逐句数据。
//
// 已修正的明显 OCR 噪声：
//   - 字母 T 被误识别为 I："T will / T don't / T have / T am" → "I will / I don't / I have / I am"
//     （page 48、55、56、57、60 共 6 处）；page 54 的 "then [5 tor one" → "then I for one"
//   - 半角/弯引号与单双引号混用 → 统一为直双引号（如 "Well, I do,' → "Well, I do,"、
//     "to go away,' → "to go away,"、"Of course I do,' → "Of course I do," 等 6 处）
//   - 跨行断句按语义合并成完整句子；page 58 环绕插画的破碎乱序文字按语序还原
//     （"Toad cl" + "out of the river" → "Toad climbed out of the river"；
//      "The water dripped" + "out of his bath" + "Ing suit" + "and down onto his feet."
//      → "The water dripped out of his bathing suit and down onto his feet."）
//   - 删除页脚页码及杂讯：45/46/47/49/51/52/53/54/55、孤立词 "Ad"/"AS"/"bed"/"1m"

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const aSwim: FrogStory = {
  id: 'a-swim',
  title: 'A Swim',
  titleZh: '游泳',
  sentences: [
    { en: 'Toad and Frog went down to the river.', zh: '蟾蜍和青蛙一起走到河边。' },
    { en: '"What a day for a swim," said Frog.', zh: '"今天真适合游泳呀，"青蛙说。' },
    { en: '"Yes," said Toad.', zh: '"是啊，"蟾蜍说。' },
    { en: '"I will go behind these rocks and put on my bathing suit."', zh: '"我到这些石头后面去换上泳衣。"' },
    { en: '"I don\'t wear a bathing suit," said Frog.', zh: '"我可不穿泳衣，"青蛙说。' },
    { en: '"Well, I do," said Toad.', zh: '"我呀，还是要穿的，"蟾蜍说。' },
    { en: '"After I put on my bathing suit, you must not look at me until I get into the water."', zh: '"我换好泳衣以后，在我下水之前，你可千万别看我。"' },
    { en: '"Why not?" asked Frog.', zh: '"为什么呀？"青蛙问。' },
    { en: '"Because I look funny in my bathing suit. That is why," said Toad.', zh: '"因为我穿泳衣的样子很好笑。就是这个原因，"蟾蜍说。' },
    { en: 'Frog closed his eyes when Toad came out from behind the rocks.', zh: '蟾蜍从石头后面出来的时候，青蛙把眼睛闭上了。' },
    { en: 'Toad was wearing his bathing suit.', zh: '蟾蜍身上穿着他的泳衣。' },
    { en: '"Don\'t peek," he said.', zh: '"别偷看哦，"他说。' },
    { en: 'Frog and Toad jumped into the water.', zh: '青蛙和蟾蜍扑通跳进了水里。' },
    { en: 'They swam all afternoon.', zh: '他们游了整整一个下午。' },
    { en: 'Frog swam fast and made big splashes.', zh: '青蛙游得快，溅起好大的水花。' },
    { en: 'Toad swam slowly and made smaller splashes.', zh: '蟾蜍游得慢，溅起的水花小小的。' },
    { en: 'A turtle came along the riverbank.', zh: '一只乌龟沿着河岸爬了过来。' },
    { en: '"Frog, tell that turtle to go away," said Toad.', zh: '"青蛙，叫那只乌龟走开，"蟾蜍说。' },
    { en: '"I do not want him to see me in my bathing suit when I come out of the river."', zh: '"我出水的时候，可不想让他看见我穿着泳衣的样子。"' },
    { en: 'Frog swam over to the turtle.', zh: '青蛙游到乌龟身边。' },
    { en: '"Turtle," said Frog, "you will have to go away."', zh: '"乌龟啊，"青蛙说，"你得走开才行。"' },
    { en: '"Why should I?" asked the turtle.', zh: '"我为什么要走呀？"乌龟问。' },
    { en: '"Because Toad thinks that he looks funny in his bathing suit, and he does not want you to see him," said Frog.', zh: '"因为蟾蜍觉得自己穿泳衣的样子很好笑，不想让你看见他，"青蛙说。' },
    { en: 'Some lizards were sitting nearby.', zh: '几只蜥蜴正坐在旁边。' },
    { en: '"Does Toad really look funny in his bathing suit?" they asked.', zh: '"蟾蜍穿泳衣真的很好笑吗？"他们问。' },
    { en: 'A snake crawled out of the grass.', zh: '一条蛇从草丛里爬了出来。' },
    { en: '"If Toad looks funny in his bathing suit," said the snake, "then I, for one, want to see him."', zh: '"要是蟾蜍穿泳衣很好笑，"蛇说，"那我第一个就想看看。"' },
    { en: '"We want to see him too," said two dragonflies.', zh: '"我们也想看，"两只蜻蜓说。' },
    { en: '"Me too," said a field mouse.', zh: '"我也想，"一只田鼠说。' },
    { en: '"I have not seen anything funny in a long time."', zh: '"我已经好久没见过好笑的事啦。"' },
    { en: 'Frog swam back to Toad.', zh: '青蛙游回蟾蜍身边。' },
    { en: '"I am sorry, Toad," he said. "Everyone wants to see how you will look."', zh: '"对不起，蟾蜍，"他说，"大家都想看看你是什么样子。"' },
    { en: '"Then I will stay right here until they go away," said Toad.', zh: '"那我就一直待在这儿，等他们走开，"蟾蜍说。' },
    { en: 'The turtle and the lizards and the snake and the dragonflies and the field mouse all sat on the riverbank.', zh: '乌龟、蜥蜴、蛇、蜻蜓，还有田鼠，全都坐在河岸上。' },
    { en: 'They waited for Toad to come out of the water.', zh: '他们等着蟾蜍从水里出来。' },
    { en: '"Please," cried Frog, "please go away!"', zh: '"拜托啦，"青蛙喊道，"快走开吧！"' },
    { en: 'But no one went away.', zh: '可是谁也没有走。' },
    { en: 'Toad was getting colder and colder.', zh: '蟾蜍觉得越来越冷了。' },
    { en: 'He was beginning to shiver and sneeze.', zh: '他开始发抖，还打起了喷嚏。' },
    { en: '"I will have to come out of the water," said Toad. "I am catching a cold."', zh: '"我得从水里出来了，"蟾蜍说，"我要感冒啦。"' },
    { en: 'Toad climbed out of the river.', zh: '蟾蜍爬出了河水。' },
    { en: 'The water dripped out of his bathing suit and down onto his feet.', zh: '水从他的泳衣上滴下来，一直滴到脚上。' },
    { en: 'The turtle laughed.', zh: '乌龟笑了。' },
    { en: 'The lizards laughed.', zh: '蜥蜴笑了。' },
    { en: 'The snake laughed.', zh: '蛇笑了。' },
    { en: 'The field mouse laughed, and Frog laughed.', zh: '田鼠笑了，青蛙也笑了。' },
    { en: '"What are you laughing at, Frog?" said Toad.', zh: '"你在笑什么呢，青蛙？"蟾蜍说。' },
    { en: '"I am laughing at you, Toad," said Frog, "because you do look funny in your bathing suit."', zh: '"我在笑你呀，蟾蜍，"青蛙说，"因为你穿泳衣的样子真的很好笑。"' },
    { en: '"Of course I do," said Toad.', zh: '"那当然啦，"蟾蜍说。' },
    { en: 'Then he picked up his clothes and went home.', zh: '然后他拿起衣服，回家去了。' },
  ],
  words: [
    { en: 'swim', zh: '游泳', emoji: '🏊' },
    { en: 'river', zh: '河', emoji: '🏞️' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'turtle', zh: '乌龟', emoji: '🐢' },
    { en: 'lizard', zh: '蜥蜴', emoji: '🦎' },
    { en: 'snake', zh: '蛇', emoji: '🐍' },
    { en: 'dragonfly', zh: '蜻蜓', emoji: '🪰' },
    { en: 'mouse', zh: '老鼠', emoji: '🐭' },
    { en: 'bathing', zh: '游泳的（bathing suit 泳衣）', emoji: '🩱' },
    { en: 'splash', zh: '水花', emoji: '💦' },
    { en: 'shiver', zh: '发抖', emoji: '🥶' },
  ],
}
