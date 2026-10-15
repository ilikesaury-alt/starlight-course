// Unit 8 Food Groups 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 两个本单元特有的坑（照 unit1.ts 的写法前先记住）：
//   1. 课文句型里的 "I'd like ..." 不能直接抄 —— "I'd" 切出来是 i / d 两个 token，
//      'd' 不在词表里，会被判超纲。同一意思用 "I want ..." 或 "I would like ..."。
//   2. lesson.title 不是词表（allowedWordsFor 只收 words），所以 Quiz 那课
//      正文里不能出现 'quiz'，用 'game' 代替。
import type { ReadingPassage } from './index'

export const unit8: Record<string, ReadingPassage> = {
  '8-1': {
    title: 'The Fruit Plate',
    titleZh: '水果拼盘',
    paragraphs: [
      [
        { en: 'Today Mia is very hungry.', zh: '今天 Mia 很饿。' },
        { en: 'Mom puts a big plate on the table.', zh: '妈妈把一个大盘子放在桌子上。' },
        { en: "Mom asks, 'What would you like?'", zh: '妈妈问：“你想要什么？”' },
        { en: "Mia says, 'I want kiwifruit and dragon fruit, please.'", zh: 'Mia 说：“我想要猕猴桃和火龙果，谢谢。”' },
        { en: 'Mom gives her a pineapple and lychees.', zh: '妈妈又给了她一个菠萝和几颗荔枝。' },
      ],
      [
        { en: 'A small monkey comes to the door.', zh: '一只小猴子来到门口。' },
        { en: "Mia asks, 'Do you like fruit?'", zh: 'Mia 问：“你喜欢水果吗？”' },
        { en: "The monkey says, 'I love pineapples!'", zh: '猴子说：“我爱吃菠萝！”' },
        { en: 'They share one lychee and laugh.', zh: '他们分着吃一颗荔枝，笑了起来。' },
        { en: 'Now Mia and the little monkey are friends.', zh: '现在 Mia 和小猴子是好朋友了。' },
        { en: 'What fruit will they eat tomorrow?', zh: '明天他们会吃什么呢？' },
      ],
    ],
  },
  '8-2': {
    title: 'The Vegetable Box',
    titleZh: '装蔬菜的箱子',
    paragraphs: [
      [
        { en: 'Ben is in the yard with Mom.', zh: 'Ben 和妈妈在院子里。' },
        { en: 'There are many vegetables on the grass.', zh: '草地上有很多蔬菜。' },
        { en: "Mom asks, 'What do you want?'", zh: '妈妈问：“你想要什么？”' },
        { en: "Ben says, 'I want cauliflowers and a pumpkin.'", zh: 'Ben 说：“我想要花椰菜和一个南瓜。”' },
        { en: "'I want one big eggplant too!'", zh: '“我还要一个大茄子！”' },
        { en: 'Ben finds an onion under a big leaf.', zh: 'Ben 在一片大叶子下面找到了一颗洋葱。' },
      ],
      [
        { en: 'They put all of them in a box.', zh: '他们把所有东西都放进一个箱子。' },
        { en: 'The box is big, so Ben carries it.', zh: '箱子很大，所以 Ben 提着它。' },
        { en: "Mom says, 'Let's cook soup now.'", zh: '妈妈说：“我们现在煮汤吧。”' },
        { en: 'They wash the cauliflower and the onion.', zh: '他们把花椰菜和洋葱洗干净。' },
        { en: 'The soup is hot and very nice.', zh: '汤又热又好喝。' },
        { en: 'Ben wants more soup tomorrow, too.', zh: '明天 Ben 还想喝汤。' },
      ],
    ],
  },
  '8-3': {
    title: 'A Boat and Some Seafood',
    titleZh: '船上的海鲜',
    paragraphs: [
      [
        { en: 'Dad and Leo take a boat today.', zh: '今天 Dad 和 Leo 坐船出门。' },
        { en: 'The water is cold this morning.', zh: '今天早上水很凉。' },
        { en: "Dad asks, 'What would you like?'", zh: 'Dad 问：“你想要什么？”' },
        { en: "Leo says, 'I want a crab!'", zh: 'Leo 说：“我想要一只螃蟹！”' },
        { en: "'I want some shrimps and oysters!'", zh: '“我还要一些虾和牡蛎！”' },
        { en: 'Dad finds one big squid in the boat.', zh: 'Dad 在船上找到了一只大鱿鱼。' },
      ],
      [
        { en: 'Leo puts the squid in his box.', zh: 'Leo 把鱿鱼放进他的箱子。' },
        { en: 'A little bird flies near the boat.', zh: '一只小鸟飞到船边。' },
        { en: "The bird says, 'Can I have a shrimp?'", zh: '小鸟说：“可以给我一只虾吗？”' },
        { en: "Leo says, 'Yes! Here you are.'", zh: 'Leo 说：“当然！给你。”' },
        { en: 'The bird is very happy now.', zh: '小鸟现在非常开心。' },
        { en: 'Leo wants more seafood at home.', zh: 'Leo 回家还想再吃海鲜。' },
      ],
    ],
  },
  '8-4': {
    title: 'Snacks in My Bag',
    titleZh: '书包里的零食',
    paragraphs: [
      [
        { en: 'Kate comes home after school.', zh: 'Kate 放学回家。' },
        { en: 'She is hungry and very sleepy.', zh: '她又饿又困。' },
        { en: 'Mom puts snacks in her bag.', zh: '妈妈在她的书包里放了一些零食。' },
        { en: 'There are cookies, raisins and chocolate.', zh: '里面有饼干、葡萄干和巧克力。' },
        { en: "Mom asks, 'What snacks do you want?'", zh: '妈妈问：“你想要什么零食？”' },
        { en: "Kate says, 'I want chocolate and cookies!'", zh: 'Kate 说：“我想要巧克力和饼干！”' },
      ],
      [
        { en: 'Kate also finds some nori in the bag.', zh: 'Kate 还在书包里找到了海苔。' },
        { en: 'Ben comes to the door to play.', zh: 'Ben 来到门口找她玩。' },
        { en: 'They share the raisins with Ben.', zh: '他们把葡萄干分给 Ben。' },
        { en: "Ben says, 'The nori is very good!'", zh: 'Ben 说：“海苔真好吃！”' },
        { en: 'Kate laughs and they sing a song.', zh: 'Kate 笑了，他们一起唱歌。' },
        { en: 'Tomorrow Mom will bring more snacks.', zh: '明天妈妈还会带更多零食。' },
      ],
    ],
  },
  '8-5': {
    title: 'Chinese Food at Home',
    titleZh: '中国家常饭',
    paragraphs: [
      [
        { en: 'Anna comes home with her friend Sam.', zh: 'Anna 和朋友 Sam 一起回家。' },
        { en: 'Mom cooks Chinese food for them.', zh: '妈妈给他们做中国菜。' },
        { en: "Mom asks, 'Do you like Chinese food?'", zh: '妈妈问：“你喜欢中国菜吗？”' },
        { en: "Sam says, 'Yes! It is very good.'", zh: 'Sam 说：“喜欢！非常好吃。”' },
        { en: "'What would you like to eat?'", zh: '“你想要吃什么？”' },
        { en: "Anna says, 'I want dumplings and steamed buns, please.'", zh: 'Anna 说：“我想要饺子和馒头，谢谢。”' },
      ],
      [
        { en: 'Mom puts eight dumplings on the plate.', zh: '妈妈在盘子里放了八个饺子。' },
        { en: 'Sam wants rice and hot soup.', zh: 'Sam 想要米饭和热汤。' },
        { en: 'They also eat noodles and steamed buns at the table.', zh: '他们还在桌子上吃面条和馒头。' },
        { en: 'The food is warm and very nice.', zh: '饭菜又暖和又好吃。' },
        { en: 'Anna is sleepy and very happy.', zh: 'Anna 困了，可她很开心。' },
        { en: "'Come again tomorrow!' Anna says.", zh: 'Anna 说：“明天还来！”' },
      ],
    ],
  },
  '8-6': {
    title: 'The Food Game',
    titleZh: '食物大挑战',
    paragraphs: [
      [
        { en: 'Today Leo and Mia play a food game.', zh: '今天 Leo 和 Mia 玩食物游戏。' },
        { en: 'Mia puts four things on the table.', zh: 'Mia 把四样东西放在桌子上。' },
        { en: "'What are these?' asks Leo.", zh: 'Leo 问：“这些是什么？”' },
        { en: "'They are fruit: kiwifruit and lychee.'", zh: '“它们是水果：猕猴桃和荔枝。”' },
        { en: "'Yes! I know these,' says Mia.", zh: 'Mia 说：“对呀！我认识它们。”' },
        { en: "'Now look at these two vegetables.'", zh: '“现在看这两样蔬菜。”' },
      ],
      [
        { en: "'They are onion and pumpkin.'", zh: '“它们是洋葱和南瓜。”' },
        { en: 'Leo wants some seafood for the game.', zh: 'Leo 想要一些海鲜来继续游戏。' },
        { en: 'Mia gives him a crab and a shrimp.', zh: 'Mia 给了他一只螃蟹和一只虾。' },
        { en: "'What snack do you want?' Mia asks.", zh: 'Mia 问：“你想要什么零食？”' },
        { en: "'I want chocolate, thank you!'", zh: '“我想要巧克力，谢谢！”' },
        { en: 'Leo is happy. Now the game is fun.', zh: 'Leo 很开心。这个游戏真好玩。' },
      ],
    ],
  },
  '8-7': {
    title: 'Dad Cooks Meat',
    titleZh: '爸爸做肉菜',
    paragraphs: [
      [
        { en: 'Sam and Dad cook meat at home.', zh: 'Sam 和爸爸在家做肉菜。' },
        { en: 'Dad puts beef and pork on the plate.', zh: '爸爸把牛肉和猪肉放在盘子里。' },
        { en: "'What do you want?' asks Dad.", zh: '爸爸问：“你想要什么？”' },
        { en: "'I want some beef, please,' says Sam.", zh: 'Sam 说：“我想要一些牛肉，谢谢。”' },
        { en: "'I want some chicken too!'", zh: '“我还要一些鸡肉！”' },
        { en: 'Dad gives Sam some fish as well.', zh: '爸爸也给 Sam 一些鱼肉。' },
      ],
      [
        { en: 'The dog sits under the table.', zh: '狗坐在桌子下面。' },
        { en: 'He looks at the meat with big eyes.', zh: '它用大眼睛看着这些肉。' },
        { en: "'Can I have some pork?' says the dog.", zh: '狗说：“可以给我一些猪肉吗？”' },
        { en: 'Sam gives the dog a little meat.', zh: 'Sam 给狗一点肉。' },
        { en: 'Now the dog jumps and smiles.', zh: '现在狗又跳又笑。' },
        { en: 'Tomorrow Dad will cook chicken again.', zh: '明天爸爸还会做鸡肉。' },
      ],
    ],
  },
  '8-8': {
    title: 'Four Plates in the Park',
    titleZh: '公园里的四盘菜',
    paragraphs: [
      [
        { en: 'Today Mom and Dad go to the park.', zh: '今天 Mom 和 Dad 去公园。' },
        { en: 'They open four plates on the table.', zh: '他们在桌子上摆好四个盘子。' },
        { en: "'Kate asks, 'What are these?'", zh: 'Kate 问：“这些是什么？”' },
        { en: "'They are fruit: pineapple and lychee.'", zh: '“它们是水果：菠萝和荔枝。”' },
        { en: "'Yes! Those are fruit,' says Ben.", zh: 'Ben 说：“对！那些是水果。”' },
        { en: "'What are these green ones?'", zh: '“这些绿色的又是什么？”' },
        { en: "'They are vegetables: pumpkin and onion.'", zh: '“它们是蔬菜：南瓜和洋葱。”' },
      ],
      [
        { en: "'And what is on that big plate?'", zh: '“那个大盘子里是什么？”' },
        { en: "'They are meat: beef and pork.'", zh: '“它们是肉：牛肉和猪肉。”' },
        { en: 'Mom also has seafood for everyone.', zh: 'Mom 还准备了一些海鲜。' },
        { en: "'I want some fish and some shrimp!'", zh: '“我想要一些鱼肉和一些虾！”' },
        { en: 'What will they cook at home?', zh: '他们回家会做什么菜呢？' },
      ],
    ],
  },
}