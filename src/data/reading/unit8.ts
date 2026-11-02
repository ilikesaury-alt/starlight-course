// Unit 8 Food Groups 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 两个本单元特有的坑（照 unit1.ts 的写法前先记住）：
//   1. 课文句型里的 "I'd like ..." 不能直接抄 —— "I'd" 切出来是 i / d 两个 token，
//      'd' 不在词表里，会被判超纲。同一意思用 "I want ..." 或 "I would like ..."。
//   2. lesson.title 不是词表（allowedWordsFor 只收 words），所以 Quiz 那课
//      正文里不能出现 'quiz'，用 'game' 代替。
//   3. Unit 8 同样没有 by / land / orange / first / let / deep / past 这些词
//      （by、orange 是上一轮 Agent 在本单元栽过的坑），也不要用所有格 "Ben's" ——
//      切词后是 "ben's"，不在词表里。
//
// 2026-11-02 文体改写：8 篇全部从头重写成「一个小故事」——
//   分类不是上一堂课，而是让孩子在情节里「发现」一个食物家族：
//   8-1 Mia 认不出箱子里的果子，最后把答案讲给一只小猴子听（问句回到开头，答案换了位置）；
//   8-2 Ben 把南瓜猜成球、把花椰菜当成花、被洋葱辣哭，最后反过来告诉妈妈「蔬菜」；
//   8-3 Dad 带 Leo 出海，Leo 把鱿鱼错认成鱼，爸爸一句话点破，爸爸的「往下看」
//     到结尾变成 Leo 对小鸟说的「看，给你」；
//   8-4 Kate 以为海苔是公园捡的叶子，尝过之后把问题反手丢给 Ben；
//   8-5 Sam 第一次吃中国菜，同一句「你喜欢中国菜吗」最后由 Anna 问回来；
//   8-6 食物游戏里 Leo 先错后对，那个「错」就是故事里的小问题；
//   8-7 Sam 以为鱼不算肉，爸爸一句话点破；「你想要什么」从爸爸转到 Sam 再转到小狗；
//   8-8 野餐要先说对盘子名字才能吃，四个家族一段一段对上，最后四口人一起吃。
// 对话推进 + 结尾回声 + 段落即叙事节拍，中文同步改成温暖口语的讲法。
import type { ReadingPassage } from './index'

export const unit8: Record<string, ReadingPassage> = {
  '8-1': {
    title: 'The Fruit Plate',
    titleZh: '一盘水果',
    paragraphs: [
      [
        { en: 'Mom comes home with a big box.', zh: '妈妈拎着一个大箱子回家啦。' },
        { en: '"What is in the box?" Mia asks.', zh: '“箱子里装的是什么呀？”Mia 问。' },
        { en: '"Fruit!" says Mom. "Look at them."', zh: '“是水果！”妈妈说，“快看呀。”' },
      ],
      [
        { en: '"What would you like?" Mom asks.', zh: '“那你想要哪个呀？”妈妈问。' },
        { en: 'Mia touches the green one. "I want this."', zh: 'Mia 摸了摸那个绿色的：“我要这个。”' },
        { en: '"That is a kiwifruit," says Mom.', zh: '“这是猕猴桃。”妈妈说。' },
        { en: '"And the big one with leaves on top?" Mia asks.', zh: '“那个顶上长着叶子的大家伙呢？”Mia 问。' },
        { en: '"A pineapple," says Mom. "Try a little."', zh: '“是菠萝。”妈妈说，“尝一小口。”' },
      ],
      [
        { en: 'Then Mia sees a red one. "Is it an animal?"', zh: '这会儿 Mia 又看见一个红的：“它是个小动物吗？”' },
        { en: '"It is a dragon fruit," says Mom. "The white ones are lychees."', zh: '“那是火龙果。”妈妈说，“这些白白的小家伙是荔枝。”' },
        { en: 'A monkey comes and asks, "What are these?"', zh: '小猴子跑到门口，探头问：“这些是什么呀？”' },
        { en: '"Fruit!" says Mia. "They are all one family!"', zh: '“是水果！”Mia 说，“它们都是一家人呢！”' },
      ],
    ],
  },
  '8-2': {
    title: 'The Vegetable Box',
    titleZh: '一箱蔬菜',
    paragraphs: [
      [
        { en: 'Ben finds a big box in the yard.', zh: 'Ben 在院子里发现一个大箱子。' },
        { en: '"What is in the box?" Ben asks.', zh: '“箱子里是什么呀？”Ben 问。' },
        { en: '"Vegetables!" says Mom. "Carry them in."', zh: '“是蔬菜！”妈妈说，“帮我们搬进去。”' },
      ],
      [
        { en: '"Is this a ball?" Ben asks. "No, a pumpkin," says Mom.', zh: '“这是球吗？”Ben 问。“不是，是南瓜。”妈妈说。' },
        { en: '"Is that a flower?" Ben asks. "A cauliflower," says Mom.', zh: '“那是花吗？”Ben 问。“是花椰菜。”妈妈说。' },
        { en: '"And the purple one?" Ben asks. "An eggplant," says Mom.', zh: '“那个紫紫的呢？”Ben 问。“是茄子。”妈妈说。' },
        { en: '"And this small round one?" Ben asks. "An onion," says Mom.', zh: '“这个小小的圆球呢？”Ben 问。“是洋葱。”妈妈说。' },
      ],
      [
        { en: 'The onion makes his eyes water. Ben cries.', zh: '洋葱把 Ben 的眼泪都弄出来啦。' },
        { en: 'They wash them all and make a big soup.', zh: '他们把菜都洗干净，做了一大锅汤。' },
        { en: '"What is this?" Mom asks. "Vegetables!" says Ben, and he smiles.', zh: '“这些是什么呀？”妈妈问。“蔬菜！”Ben 笑着说。' },
      ],
    ],
  },
  '8-3': {
    title: 'A Boat and Some Seafood',
    titleZh: '船上的海鲜',
    paragraphs: [
      [
        { en: 'Dad and Leo take a boat out.', zh: '今天 Dad 和 Leo 坐船出海啦。' },
        { en: 'The sea is big and cold.', zh: '大海又大又凉。' },
        { en: '"Look down, Leo!" says Dad.', zh: '“往下看，Leo！”爸爸说。' },
        { en: '"What is that?" says Leo. "Is it a crab?"', zh: '“那是什么呀？”Leo 问，“是螃蟹吗？”' },
      ],
      [
        { en: '"Yes, it is a crab!" says Dad. "Look down."', zh: '“对，是螃蟹！”爸爸说，“再往下看。”' },
        { en: 'A squid comes close with long arms.', zh: '一只鱿鱼游过来，长长的触手一甩一甩。' },
        { en: '"Is it a fish?" asks Leo.', zh: '“它是鱼吗？”Leo 问。' },
        { en: '"It is a squid," says Dad. "These are oysters."', zh: '“是鱿鱼。”爸爸说，“这些是牡蛎。”' },
        { en: '"And the small pink ones?" asks Leo. "Shrimps," says Dad.', zh: '“那些小小的粉粉的呢？”Leo 问。“是虾。”爸爸说。' },
      ],
      [
        { en: 'A bird comes down to the boat.', zh: '一只小鸟落到船上。' },
        { en: '"Can I have a shrimp?" asks the bird. "Look, here you are!" says Leo.', zh: '“可以给我一只虾吗？”小鸟问。“看，给你啦！”Leo 说。' },
      ],
    ],
  },
  '8-4': {
    title: 'Snacks in My Bag',
    titleZh: '一袋零食',
    paragraphs: [
      [
        { en: 'Kate comes home after school.', zh: 'Kate 放学回家啦。' },
        { en: 'She is hungry and very sleepy.', zh: '她又饿又困，眼皮都耷拉下来了。' },
        { en: 'Mom puts a bag on the table.', zh: '妈妈把一个袋子放在桌上。' },
        { en: '"What snacks do you want?" asks Mom.', zh: '“你想吃点什么零食呀？”妈妈问。' },
      ],
      [
        { en: '"I want a cookie and some chocolate," says Kate.', zh: '“我要饼干，还要巧克力。”Kate 说。' },
        { en: 'In the bag she finds many raisins.', zh: '袋子里还有好多葡萄干。' },
        { en: 'Then she sees a green thing like a leaf.', zh: '接着她看见一片绿绿的东西，像片叶子。' },
        { en: '"Is this a leaf from the park?" asks Kate.', zh: '“这是从公园捡来的叶子吗？”Kate 问。' },
      ],
      [
        { en: '"No, it is nori," says Mom. "It is a snack."', zh: '“不是啦，这是海苔。”妈妈说，“它也是零食哦。”' },
        { en: 'Kate tries it. "It is good!"', zh: 'Kate 尝了一口：“真好吃！”' },
        { en: 'Ben comes to the door. They share it.', zh: 'Ben 跑到门口来，两个孩子分着吃。' },
        { en: '"What snacks do you want?" asks Kate. "Nori!" says Ben.', zh: '“你想吃点什么零食呀？”Kate 问。“海苔！”Ben 说。' },
      ],
    ],
  },
  '8-5': {
    title: 'Chinese Food at Home',
    titleZh: '家里的中国菜',
    paragraphs: [
      [
        { en: 'Anna and Sam walk home with Mom.', zh: 'Anna 和 Sam 跟 Mom 一起走回家。' },
        { en: 'Mom is cooking Chinese food.', zh: 'Mom 正在做中国菜呢。' },
        { en: '"Do you like Chinese food?" asks Mom.', zh: '“你喜欢中国菜吗？”Mom 问。' },
        { en: '"I do! What is all this?" says Sam.', zh: '“喜欢！这些都是什么呀？”Sam 说。' },
      ],
      [
        { en: '"These are dumplings," says Mom. "Try one."', zh: '“这些是饺子。”Mom 说，“尝一个。”' },
        { en: 'Sam tries one. "Wow, it is good!"', zh: 'Sam 夹起一个：“哇，太好吃啦！”' },
        { en: '"And those white balls?" asks Sam.', zh: '“那些白白的大圆球是什么呀？”Sam 问。' },
        { en: '"Steamed buns," says Mom. "They are made of dough."', zh: '“是馒头。”Mom 说，“都是面团做的。”' },
        { en: 'Then Mom brings noodles.', zh: 'Mom 又端来了面条。' },
      ],
      [
        { en: 'Sam eats the noodles and some rice.', zh: 'Sam 吃了面条，还吃了米饭。' },
        { en: '"They do not look the same," says Sam. "But they are good."', zh: '“它们看起来不一样，”Sam 说，“可都好吃。”' },
        { en: '"Do you like Chinese food?" asks Anna. "Yes!" says Sam.', zh: '“你喜欢中国菜吗？”Anna 问。“喜欢！”Sam 说。' },
      ],
    ],
  },
  '8-6': {
    title: 'The Food Game',
    titleZh: '食物分类游戏',
    paragraphs: [
      [
        { en: 'Mia and Leo play a food game.', zh: 'Mia 和 Leo 玩食物分类游戏。' },
        { en: 'Mia puts food on the table.', zh: 'Mia 把食物一样一样摆在桌上。' },
        { en: '"Put each one on its plate," says Mia.', zh: '“把每一样都放到对的盘子里。”Mia 说。' },
        { en: 'Leo is fast. He puts the apple with the chocolate.', zh: 'Leo 手快，一下就把苹果和巧克力放到了一起。' },
      ],
      [
        { en: '"No, they are not a family," says Mia.', zh: '“不对，它们不是一家人。”Mia 说。' },
        { en: '"The apple is fruit. The chocolate is a snack."', zh: '“苹果是水果，巧克力是零食。”' },
        { en: '"Oh," says Leo. He puts the chocolate away.', zh: '“哦。”Leo 说着，把巧克力拿开了。' },
        { en: 'Now he puts the pumpkin and the onion together.', zh: '这回他把洋葱和南瓜放到一起。' },
      ],
      [
        { en: '"Yes! Those are vegetables," says Mia.', zh: '“对啦！那些是蔬菜。”Mia 说。' },
        { en: 'Then Leo finds the crab and the shrimp.', zh: '接着 Leo 找到了螃蟹和虾。' },
        { en: '"Seafood!" says Leo. "And fruit!"', zh: '“海鲜！”Leo 说，“还有水果！”' },
        { en: '"Now you know them all," says Mia, and she smiles.', zh: '“现在你全都认识啦。”Mia 笑着说。' },
      ],
    ],
  },
  '8-7': {
    title: 'Dad Cooks Meat',
    titleZh: '爸爸做的肉菜',
    paragraphs: [
      [
        { en: 'Sam and Dad cook food at home.', zh: 'Sam 和 Dad 在家做饭。' },
        { en: 'Dad puts beef on the plate.', zh: 'Dad 把牛肉放在盘子里。' },
        { en: '"What do you want?" asks Dad.', zh: '“你想要什么呀？”Dad 问。' },
        { en: '"I want some beef and some pork," says Sam.', zh: '“我想要一些牛肉，还要一些猪肉。”Sam 说。' },
      ],
      [
        { en: '"Here is some chicken too," says Dad.', zh: '“这里还有一些鸡肉。”Dad 说。' },
        { en: 'Then Dad opens a box and shows a fish.', zh: '接着 Dad 打开一个盒子，露出一条鱼。' },
        { en: '"But fish lives in the water!" says Sam.', zh: '“可是鱼住在水里呀！”Sam 说。' },
        { en: '"Yes, but we eat fish. It is meat too."', zh: '“对呀，可我们吃鱼，鱼也是肉呢。”' },
      ],
      [
        { en: 'The dog comes and sits near the table.', zh: '小狗走过来，坐在桌子边上。' },
        { en: '"What do you want?" asks Sam.', zh: '“你想要什么呀？”Sam 问小狗。' },
        { en: '"Some pork, please," says the dog.', zh: '“我要一些猪肉，谢谢。”小狗说。' },
        { en: '"Here you are," says Sam, and the dog smiles.', zh: '“给你。”Sam 说，小狗笑得眼睛都眯起来了。' },
      ],
    ],
  },
  '8-8': {
    title: 'Four Plates in the Park',
    titleZh: '公园里的四盘菜',
    paragraphs: [
      [
        { en: 'Mom and Dad put four plates on the table.', zh: 'Mom 和 Dad 在公园的桌上摆好四个盘子。' },
        { en: 'Kate and Ben sit down in the park.', zh: 'Kate 和 Ben 在公园里坐下来。' },
        { en: '"Eat from a plate you can name," says Mom.', zh: '“你能说出盘子里是什么，才能吃哦。”Mom 说。' },
        { en: '"What is on that plate?" asks Kate.', zh: '“那个盘子里是什么呀？”Kate 问。' },
      ],
      [
        { en: '"Pineapple and lychee," says Mom. "Fruit!" says Ben, and he eats one.', zh: '“菠萝和荔枝。”Mom 说。“水果！”Ben 说，拿起一个就吃。' },
        { en: 'Kate looks at the green plate.', zh: 'Kate 看向那个绿绿的盘子。' },
        { en: '"Pumpkin and onion," says Kate. "Vegetables!" says Ben.', zh: '“南瓜和洋葱。”Kate 说。“蔬菜！”Ben 说。' },
        { en: '"Yes! That is a family," says Mom.', zh: '“对！那是一家人。”Mom 说。' },
      ],
      [
        { en: '"And the brown plate?" asks Ben.', zh: '“那棕色那个盘子呢？”Ben 问。' },
        { en: '"Beef and pork," says Mom. "That is meat."', zh: '“牛肉和猪肉。”Mom 说，“那是肉。”' },
        { en: '"What is on that plate?" asks Ben.', zh: '“那个盘子里是什么呀？”Ben 问。' },
        { en: '"Seafood: crab and shrimp," says Kate. "Now we can eat!"', zh: '“海鲜：螃蟹和虾。”Kate 说，“现在我们可以吃啦！”' },
      ],
    ],
  },
}
// 2026-11-02 文体改写：8 篇全部重写为「小故事」——分类从清单变成情节里的发现，
// 每篇都有对话、因果链和结尾回声；词数 89~96 / 句数 10~12 / 段数 3，零超纲。
