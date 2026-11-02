// Unit 9 My Day 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 2026-11-02 文体改写：8 篇全部重写为「一天走完」的小故事——
//   9-1 早上找毛巾 → 9-2 早餐分着吃 → 9-3 教室借蜡笔 → 9-4 操场玩到日落 →
//   9-5 点心分给妈妈 → 9-6 晚间词语游戏 → 9-7 洗澡读书睡觉 → 9-8 全天回声收束。
// 时间词（morning / afternoon / evening / night）当结构用，一段一个时段；
// 对话推进情节，结尾都有回声余韵（Good morning / See you tomorrow / again）。
import type { ReadingPassage } from './index'

export const unit9: Record<string, ReadingPassage> = {
  '9-1': {
    title: 'Sun Up, Ben!',
    titleZh: '太阳出来了，Ben！',
    paragraphs: [
      [
        { en: 'It is morning. The sun is up.', zh: '早上啦，太阳升起来了。' },
        { en: '"Good morning!" says Ben. He looks for his towel.', zh: '“早上好！”Ben 说。他找起自己的毛巾来。' },
        { en: 'The chair is empty, so he looks and looks.', zh: '椅子上空空的，他找呀找呀。' },
        { en: '"Where is my towel?" he asks his mom.', zh: '“我的毛巾在哪儿呀？”他问妈妈。' },
        { en: '"Look under the bed, Ben," says his mom.', zh: '“看看床底下，Ben。”妈妈说。' },
        { en: 'Yes! The towel is there, and his comb is too.', zh: '果然！毛巾就在那儿，梳子也在。' },
      ],
      [
        { en: 'Ben washes his face and combs his hair.', zh: 'Ben 洗了把脸，又把头发梳得顺顺的。' },
        { en: 'Then he takes his toothbrush and toothpaste.', zh: '接着他拿起牙刷和牙膏。' },
        { en: '"Now brush your teeth," says Mom, and she smiles.', zh: '“现在刷牙啦。”妈妈笑着说。' },
        { en: 'Ben brushes them clean, one, two, three.', zh: 'Ben 一二三四，把牙齿刷得干干净净。' },
        { en: '"Good morning, world! I am ready for the day."', zh: '“早上好呀，整个世界！我准备好迎接这一天啦。”' },
      ],
    ],
  },
  '9-2': {
    title: 'Breakfast Time',
    titleZh: '早餐时间',
    paragraphs: [
      [
        { en: 'It is morning, and Mia comes to the table.', zh: '早上到了，Mia 走到餐桌旁。' },
        { en: 'Mom puts bread, eggs and porridge on the plate.', zh: '妈妈把面包、鸡蛋和粥放在盘子里。' },
        { en: '"What do you like for breakfast?" Mom asks.', zh: '“你早餐喜欢吃什么？”妈妈问。' },
        { en: '"I like porridge and eggs," says Mia.', zh: '“我喜欢粥和鸡蛋。”Mia 说。' },
        { en: 'Leo wants cereal, but his box is empty.', zh: 'Leo 想吃麦片，可是他的盒子空空的。' },
      ],
      [
        { en: 'Leo is so sad. He does not smile.', zh: 'Leo 心里酸酸的，笑不出来。' },
        { en: '"Do not cry. We can share," says Mia.', zh: '“别难过呀，我们一起吃。”Mia 说。' },
        { en: 'She gives him bread and an egg.', zh: '她分给他一些面包和一个鸡蛋。' },
        { en: 'Then Mom brings a new box of cereal, and Leo smiles.', zh: '这时妈妈拿来一盒新的麦片，Leo 笑开了花。' },
        { en: 'They eat and laugh, and the morning is warm.', zh: '他们一边吃一边笑，这个早晨暖烘烘的。' },
        { en: '"Same time tomorrow," says Mom. "We share again."', zh: '“明天还是这个时候。”妈妈说，“我们还一起吃。”' },
      ],
    ],
  },
  '9-3': {
    title: "What's in My Bag?",
    titleZh: '我的书包里有什么？',
    paragraphs: [
      [
        { en: 'It is morning. Anna sits at her desk.', zh: '早上到了，Anna 在自己的书桌前坐下。' },
        { en: '"What is in your school bag?" asks Leo.', zh: '“你的书包里有什么？”Leo 问。' },
        { en: '"There is a pencil and an eraser."', zh: '“里面有一支铅笔和一块橡皮。”' },
        { en: '"There is a glue stick too. Look!"', zh: '“还有一支固体胶。你看！”' },
        { en: '"And I have many crayons!" says Anna.', zh: '“我还有好多好多蜡笔呢！”Anna 说。' },
      ],
      [
        { en: 'Anna opens her bag and finds a crayon.', zh: 'Anna 打开书包，拿出一支蜡笔。' },
        { en: 'She draws a red flower for Leo.', zh: '她要给 Leo 画一朵红花。' },
        { en: 'Oh no! The crayon is very short now.', zh: '哎呀！这支蜡笔太短了。' },
        { en: 'Leo has a new one and gives it to her.', zh: 'Leo 有一支新的，就递给了她。' },
        { en: 'Anna draws flower after flower.', zh: 'Anna 一朵接一朵地画。' },
        { en: '"Thank you!" says Anna. She gives him a crayon.', zh: '“谢谢你！”Anna 说，又递给他一支蜡笔。' },
        { en: '"Now we have many crayons!" says Leo.', zh: '“现在我们都有好多蜡笔啦！”Leo 说。' },
      ],
    ],
  },
  '9-4': {
    title: 'Fun at the Playground',
    titleZh: '操场上真好玩',
    paragraphs: [
      [
        { en: 'It is afternoon. Tom and Kate go to the playground.', zh: '下午了，Tom 和 Kate 一起跑到操场。' },
        { en: '"What should we play now? I want the swing," says Tom.', zh: '“我们现在玩什么？我想玩秋千。”Tom 说。' },
        { en: '"Then I will push you," says Kate.', zh: '“那我来推你。”Kate 说。' },
      ],
      [
        { en: 'Kate sits on the swing, and Tom pushes her.', zh: 'Kate 坐上秋千，Tom 在后面推她。' },
        { en: 'She goes up and down, but not very high.', zh: '她一上一下，却荡得不够高。' },
        { en: '"Push me more!" says Kate.', zh: '“再用力一点！”Kate 说。' },
        { en: 'Tom pushes hard, and Kate goes higher and higher.', zh: 'Tom 使上劲，Kate 越荡越高，高得快要碰到云啦。' },
        { en: 'Now Tom wants the slide. Down he goes! It is fun!', zh: '轮到 Tom 了，他去试滑梯。噌地一下滑下去！太好玩啦！' },
      ],
      [
        { en: 'Now they play on the seesaw, up and down.', zh: '现在他们一起玩跷跷板，一起上去，一起下来。' },
        { en: 'They laugh and laugh, and the sun goes down.', zh: '他们笑个不停，太阳慢慢落下去。' },
        { en: '"Good bye, playground! See you tomorrow!"', zh: '“再见啦，操场！明天还来！”' },
      ],
    ],
  },
  '9-5': {
    title: 'Snack Time with Lily',
    titleZh: '和 Lily 一起吃点心',
    paragraphs: [
      [
        { en: 'It is afternoon, and Lily comes home from school.', zh: '下午了，Lily 放学回到家。' },
        { en: 'She is hungry after a long day.', zh: '忙了一天，她肚子饿得咕咕叫。' },
        { en: 'Mom opens a big box on the table.', zh: '妈妈在桌上打开一个大盒子。' },
        { en: '"What do you like?" asks Mom.', zh: '“你喜欢什么呀？”妈妈问。' },
        { en: '"I like a donut and some yogurt," says Lily.', zh: '“我喜欢甜甜圈，还有酸奶。”Lily 说。' },
      ],
      [
        { en: 'But the donut is big, and Lily is small.', zh: '可是甜甜圈好大，而 Lily 太小啦。' },
        { en: 'Mom gives her a small donut.', zh: '妈妈就给她一个小小的甜甜圈。' },
        { en: 'Then Lily finds a cake and a red lollipop.', zh: '接着 Lily 又翻出一块蛋糕和一根红棒棒糖。' },
        { en: '"Do you like the cake?" asks Mom.', zh: '“你喜欢蛋糕吗？”妈妈问。' },
        { en: '"Yes! We share," says Lily.', zh: '“喜欢！我们一起吃吧。”Lily 说。' },
        { en: 'She gives Mom the lollipop, and they both laugh.', zh: '她把棒棒糖分给妈妈，两个人都笑了。' },
        { en: 'Now Lily is not hungry, and they will share again tomorrow.', zh: '现在 Lily 不饿了，明天他们还要一起分着吃。' },
      ],
    ],
  },
  '9-6': {
    title: 'The Word Game',
    titleZh: '词语游戏',
    paragraphs: [
      [
        { en: 'It is evening, and Mom has a game for me.', zh: '晚上啦，妈妈要和我玩一个游戏。' },
        { en: '"Look! What is it?" she says.', zh: '“快看！这是什么？”她说。' },
        { en: 'It is a towel! I know it very well.', zh: '是一条毛巾！我可太熟悉啦。' },
        { en: '"Good!" says Mom, and we play again.', zh: '“答对啦！”妈妈说，我们接着玩。' },
        { en: '"What do you like for breakfast?" asks Mom.', zh: '“你早餐喜欢吃什么？”妈妈问。' },
      ],
      [
        { en: '"I like an egg and some bread," I say.', zh: '“我喜欢吃鸡蛋，还爱吃面包。”我说。' },
        { en: '"Now open your school bag. What is in it?"', zh: '“现在打开你的书包，里面有什么？”' },
        { en: '"A pencil and a glue stick!"', zh: '“一支铅笔，还有一支固体胶！”' },
        { en: '"And what do you want to play with?"', zh: '“那你今天想玩什么呀？”' },
        { en: '"A swing in the park!"', zh: '“公园里的秋千！”' },
        { en: 'Mom laughs and claps her hands.', zh: '妈妈笑着拍起手来。' },
        { en: '"Now it is your turn to ask me! I love this game."', zh: '“现在轮到你来问我啦！我好喜欢这个游戏。”' },
      ],
    ],
  },
  '9-7': {
    title: 'Good Night, Emma',
    titleZh: '晚安，Emma',
    paragraphs: [
      [
        { en: 'It is night, and Emma is sleepy.', zh: '夜深了，Emma 困得睁不开眼。' },
        { en: '"It is time to take a shower," says Mom.', zh: '“该洗澡啦。”妈妈说。' },
        { en: 'The water is warm, and it feels so good.', zh: '水暖暖的，舒服得她直叹气。' },
        { en: 'She takes her towel and washes her feet.', zh: '她拿上毛巾，把脚也洗得干干净净。' },
      ],
      [
        { en: '"Now it is time to read a book," says Mom.', zh: '“接下来该读书啦。”妈妈说。' },
        { en: 'They sit on the bed and open the book.', zh: '妈妈和 Emma 坐在床上，把书翻开。' },
        { en: 'The book is about a small dog.', zh: '书里讲的是一只小狗。' },
        { en: 'Emma laughs and reads it again.', zh: 'Emma 笑得停不下来，又读了一遍。' },
        { en: '"It is time to go to bed," says Mom.', zh: '“该上床睡觉啦。”妈妈说。' },
        { en: 'Emma gets in bed, and her dog jumps up too.', zh: 'Emma 钻进被窝，她的小狗也跳上床来。' },
        { en: '"Good night, Emma. Good night, little dog."', zh: '“晚安，Emma。晚安，小狗。”' },
        { en: 'Tomorrow the sun comes up again.', zh: '明天，太阳还会再升起来。' },
      ],
    ],
  },
  '9-8': {
    title: 'A Whole Day',
    titleZh: '满满的一天',
    paragraphs: [
      [
        { en: 'This is my day, from the sun to the moon.', zh: '这就是我的一天，从太阳一直走到月亮。' },
        { en: 'In the morning I get up and brush my teeth.', zh: '早上我起床，刷牙。' },
        { en: 'Then it is time to have breakfast.', zh: '然后就该吃早饭啦。' },
        { en: 'I eat bread and eggs with my mom.', zh: '我和妈妈一起吃面包和鸡蛋。' },
      ],
      [
        { en: 'In the afternoon I go to the park to play.', zh: '下午我跑到公园里玩。' },
        { en: '"I want the swing and the slide!" says Tom.', zh: '“我想玩秋千，还想玩滑梯！”Tom 说。' },
        { en: 'We run and jump, and we have fun.', zh: '我们跑来跑去，跳来跳去，玩得好开心。' },
      ],
      [
        { en: 'At night I take a shower and read a book.', zh: '晚上我洗个热水澡，再读一会儿书。' },
        { en: 'Mom plays a game, then it is time to go to bed.', zh: '妈妈和我玩一会儿游戏，然后就该上床睡觉啦。' },
        { en: '"Good night! I will do it all again tomorrow."', zh: '“晚安！明天我还要把这一天从头再走一遍。”' },
      ],
    ],
  },
}
