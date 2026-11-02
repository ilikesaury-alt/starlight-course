// Unit 5 Opposites 阅读短文（8 课）
// 本单元教成对反义词（big/small、loud/quiet、fast/slow、good/bad、fat/thin、happy/sad、hot/cold），
// 所以每篇都用「两样东西摆在一起比」来推进故事，反义对照顺带落在情节里，不用另起一句做练习。
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 2026-11-02 文体改写：8 篇全部重写成「一个孩子能一口气读完的小故事」——
//   每篇都用「两样东西摆在一起比」当故事的发动机：5-1 蚂蚁请大狮子搬大苹果、5-2 Mia 的鼓声吵醒宝宝后改用悄悄话、
//   5-3 兔龟赛跑（慢的赢）、5-4 Leo 的坏车与好车、5-5 胖猫瘦猫去动物园、5-6 反义词猜猜猜游戏、5-7 雨天的 sad 被一张 happy 的画变过来、
//   5-8 大热天里的冰雪人；反义词都长在情节里，不另起练习句。
//   对话推进 + 结尾回声（Hello, ant! / Quieter and quieter. / Ready? Go! / Good bye, bad car! / Hello, tomorrow! …），中文同步改为口语讲法。
import type { ReadingPassage } from './index'

export const unit5: Record<string, ReadingPassage> = {
  '5-1': {
    title: 'The Ant and the Big Lion',
    titleZh: '蚂蚁和大狮子',
    paragraphs: [
      [
        { en: 'I am a big lion. I walk in the park.', zh: '我是一只大狮子。我在公园里散步。' },
        { en: 'A small ant stops me and says hi.', zh: '一只小蚂蚁拦住我，跟我打招呼。' },
        { en: '"Hello, lion! I am small, but I can help you."', zh: '“你好呀，狮子！我虽然小，可我能帮你哦。”' },
      ],
      [
        { en: '"My family has a big apple. It can not go home."', zh: '“我家有个大苹果，它搬不回家了。”' },
        { en: '"Please take it to our home under the tree."', zh: '“请帮我们把它搬到树下的家里去。”' },
        { en: '"You are big. I am small. You can do it!"', zh: '“你大，我小。这事你一定行！”' },
        { en: 'I carry it home, and the ant walks with me.', zh: '我把苹果搬回家，小蚂蚁就在旁边跟着走。' },
        { en: '"Thank you! Now we can eat it!"', zh: '“谢谢你！现在我们可以吃啦！”' },
      ],
      [
        { en: '"Look at us! A big lion and a small ant."', zh: '“瞧瞧咱俩！一只大狮子，一只小蚂蚁。”' },
        { en: '"We are good friends now!"', zh: '“我们现在是好朋友啦！”' },
        { en: '"Hello, ant! See you tomorrow!"', zh: '“你好呀，蚂蚁！明天见！”' },
      ],
    ],
  },
  '5-2': {
    title: 'Quieter and Quieter',
    titleZh: '越来越安静',
    paragraphs: [
      [
        { en: 'Mia makes a drumbeat with her hands.', zh: 'Mia 用小手拍出咚咚的鼓声。' },
        { en: 'It is loud, loud, loud!', zh: '好响好响好响呀！' },
        { en: 'She sings and dances in her room.', zh: '她在自己房间里又唱又跳。' },
        { en: 'The dog runs out of the room.', zh: '小狗吓得跑出了房间。' },
        { en: 'The bird flies out of the tree.', zh: '小鸟也飞出了那棵树。' },
        { en: 'The baby starts to cry.', zh: '小宝宝哭了起来。' },
      ],
      [
        { en: '"Oh no! What is very loud?" says Mia.', zh: '“哎呀！是什么这么大声呀？”Mia 说。' },
        { en: '"It is my drumbeat. I will make it quiet."', zh: '“是我的鼓声。我要让它安静下来。”' },
        { en: 'She sits near the baby and holds his hand.', zh: '她坐到小宝宝身边，握住他的小手。' },
        { en: '"Sleep now. I have a whisper for you."', zh: '“睡吧，我给你一个悄悄话。”' },
      ],
      [
        { en: 'Mia whispers a song, very quiet.', zh: 'Mia 轻轻地哼起一首歌，好轻好轻。' },
        { en: 'Quieter and quieter. The baby smiles and sleeps.', zh: '越来越安静。宝宝笑着睡着啦。' },
      ],
    ],
  },
  '5-3': {
    title: 'The Rabbit and the Turtle',
    titleZh: '兔子和乌龟',
    paragraphs: [
      [
        { en: 'Anna has a rabbit and a turtle.', zh: 'Anna 养了一只兔子和一只乌龟。' },
        { en: 'The rabbit is fast. The turtle is slow.', zh: '兔子跑得快，乌龟走得慢。' },
        { en: '"Ready? Go!" says Anna.', zh: '“准备好了吗？开始！”Anna 喊。' },
        { en: 'They run down the long road. The rabbit jumps on the grass.', zh: '它们一起冲下那条长长的小路，兔子还在草地上蹦蹦跳。' },
        { en: 'The turtle walks on. One foot, two feet.', zh: '乌龟一步一步往前走。一只脚，两只脚。' },
      ],
      [
        { en: 'It is slow, but it does not stop.', zh: '它很慢，可它一直不停下来。' },
        { en: 'The rabbit sleeps under a big tree.', zh: '兔子却在大树下睡着了。' },
        { en: 'The sun goes down. The turtle comes close.', zh: '太阳快落山了，乌龟却越来越近了。' },
      ],
      [
        { en: '"Look! The turtle is at the big tree!"', zh: '“快看！乌龟到大树边了！”' },
        { en: 'The rabbit runs fast, but the turtle walks on.', zh: '兔子拼命地跑，可乌龟还在一步一步往前走。' },
        { en: '"The slow turtle is the best!" says Anna.', zh: '“慢吞吞的乌龟最棒！”Anna 说。' },
        { en: '"Ready? Go!" she says. "We run again tomorrow!"', zh: '“准备好了吗？开始！”她笑着说，“明天我们再跑一场！”' },
      ],
    ],
  },
  '5-4': {
    title: 'My Car Is Not Good Yet',
    titleZh: '我的车还没画好',
    paragraphs: [
      [
        { en: 'Leo wants to draw a car for his mom.', zh: 'Leo 想给妈妈画一辆车。' },
        { en: 'He draws a big black car.', zh: '他画了一辆大大的黑车。' },
        { en: 'It has one wheel and no door. "Mom, is it good?"', zh: '这辆车只有一个轮子，连门也没有。“妈妈，这样好看吗？”' },
        { en: 'Mom looks at it and says, "It is bad. It is awful."', zh: '妈妈看了半天，还是说了实话：“画得不好，太糟糕了。”' },
      ],
      [
        { en: 'Leo wants to cry, but he does not.', zh: 'Leo 有点想哭，但他忍住了。' },
        { en: 'He looks at the old truck in the yard.', zh: '他跑到院子里，盯着那辆旧卡车看。' },
        { en: 'The truck has four wheels and a door.', zh: '卡车有四个轮子，还有一扇门。' },
      ],
      [
        { en: '"Now I know what a car needs!"', zh: '“我知道车该长什么样啦！”' },
        { en: 'He draws again. This time it is good.', zh: '他重新画了一遍。这一次，画得好多了。' },
        { en: 'His mom smiles. "It is good!"', zh: '妈妈笑了：“这回好啦！”' },
        { en: '"Good bye, bad car! Hello, good car!"', zh: '“坏车再见啦！好车，你好呀！”' },
      ],
    ],
  },
  '5-5': {
    title: 'Which Cat Is Fat?',
    titleZh: '哪只猫胖？',
    paragraphs: [
      [
        { en: 'Mia has two cats: one fat, one thin.', zh: 'Mia 有两只猫：一只胖胖的，一只瘦瘦的。' },
        { en: 'The fat cat eats cake all day.', zh: '胖猫整天都在吃蛋糕。' },
        { en: 'The thin cat runs and jumps in the sun.', zh: '瘦猫却在太阳底下跑呀跳呀。' },
        { en: '"Come, cats! We go to the zoo," says Mia.', zh: '“走吧，猫猫们！我们去动物园。”Mia 说。' },
      ],
      [
        { en: 'A monkey sits high in a tree.', zh: '一只猴子坐在高高的树上。' },
        { en: 'The thin cat climbs up to see it.', zh: '瘦猫一下就爬上去看猴子。' },
        { en: 'The fat cat jumps, but it can not go up.', zh: '胖猫也跳了几下，可它就是上不去。' },
      ],
      [
        { en: 'The monkey brings an apple down to the fat cat.', zh: '猴子把一个苹果送下来给胖猫。' },
        { en: 'The fat cat eats it. The thin cat plays.', zh: '胖猫把苹果吃了，瘦猫还在树边玩。' },
        { en: '"Which cat is fat?" asks Mia.', zh: '“哪只猫是胖的？”Mia 问。' },
        { en: '"The one that eats cake!" says the monkey.', zh: '“吃蛋糕的那只呀！”猴子说。' },
      ],
    ],
  },
  '5-6': {
    title: 'Our Opposites Game',
    titleZh: '我们的反义词游戏',
    paragraphs: [
      [
        { en: 'Today Sam plays a game in the park.', zh: '今天 Sam 在公园里玩一个游戏。' },
        { en: 'He stands near a tree and closes his eyes.', zh: '他站在树旁，把眼睛闭上。' },
        { en: '"Is he big or small?" asks Mia.', zh: '“他是个大个子还是小个子？”Mia 问。' },
        { en: '"He is small!" says Lily.', zh: '“他小小的！”Lily 说。' },
        { en: 'Sam opens his eyes. "Good!" he says.', zh: 'Sam 睁开眼睛：“答对啦！”' },
      ],
      [
        { en: '"Is your cat fast or slow?" asks Tom.', zh: '“你的猫跑得快还是慢？”Tom 问。' },
        { en: 'Tom shows his cat. "It is fast and fat!"', zh: 'Tom 把猫抱出来：“它又快又胖！”' },
        { en: 'Mia claps. "Good! You get a point."', zh: 'Mia 拍拍手：“答对啦！你得一分。”' },
        { en: 'Now Sam puts his big bag behind his back.', zh: '现在轮到 Sam 啦。他把那只大包藏在身后。' },
      ],
      [
        { en: '"What is in the bag?" asks Lily.', zh: '“包里是什么呀？”Lily 问。' },
        { en: 'Sam shows a picture. "Is it good or bad?"', zh: 'Sam 拿出一张画。“这是好还是坏呀？”' },
        { en: '"Good!" says Lily. "Hello, tomorrow! We play again."', zh: '“好！”Lily 说。“你好呀，明天！我们还要再玩哦。”' },
      ],
    ],
  },
  '5-7': {
    title: 'From Sad to Happy',
    titleZh: '从难过到开心',
    paragraphs: [
      [
        { en: 'It is a cold day with rain.', zh: '这天又冷又下雨。' },
        { en: 'Anna sits near the window and draws.', zh: 'Anna 坐在窗边画画。' },
        { en: 'She can not play out today.', zh: '今天她没法出去玩。' },
        { en: 'Her picture is bad, and she feels sad.', zh: '她画得很糟，心里也闷闷的。' },
        { en: '"How do you feel?" asks Mom.', zh: '“你感觉怎么样？”妈妈问。' },
      ],
      [
        { en: 'Then Mia comes with a big cake.', zh: '这时候 Mia 带着一个大蛋糕来了。' },
        { en: '"Hello! I brought a cake for you!"', zh: '“你好呀！我给你带了蛋糕！”' },
        { en: 'Mia draws a big smile on the picture.', zh: 'Mia 在画上画了一个大大的笑脸。' },
        { en: '"Now it is a happy picture. Clap your hands!"', zh: '“现在它是一张开心的画啦。拍拍手吧！”' },
      ],
      [
        { en: 'Anna claps and claps. Mom claps too.', zh: 'Anna 拍呀拍，妈妈也拍。' },
        { en: 'They eat the cake, sing and laugh all afternoon.', zh: '她们吃着蛋糕，唱着歌，笑了整个下午。' },
        { en: '"I feel happy now. Good bye, sad day!"', zh: '“我现在很开心啦。再见啦，难过的一天！”' },
      ],
    ],
  },
  '5-8': {
    title: 'The Snowman in the Yard',
    titleZh: '院子里的雪人',
    paragraphs: [
      [
        { en: 'It is very hot in the yard today.', zh: '今天院子里热得不得了。' },
        { en: 'The sun is big and hot.', zh: '太阳又大又热。' },
        { en: 'Ben wants a snowman, but there is no snow.', zh: 'Ben 想要一个雪人，可地上一点雪也没有。' },
        { en: '"It is hot, and I want cold!" says Ben.', zh: '“外面好热，我想要凉快的！”Ben 说。' },
      ],
      [
        { en: 'So Ben makes a snowman with big ice.', zh: '于是 Ben 用大冰块堆了一个雪人。' },
        { en: 'The snowman is white and very cold.', zh: '雪人雪白雪白的，凉得很。' },
        { en: 'Ben puts him near the window.', zh: 'Ben 把它放到窗边。' },
        { en: 'The cat sleeps near him.', zh: '小猫就睡在它旁边。' },
        { en: '"It is cold here," says Ben.', zh: '“这里好凉快呀，”Ben 说。' },
      ],
      [
        { en: 'The sun goes down, and the house is hot.', zh: '太阳落山了，屋子里又热起来。' },
        { en: 'The snowman is small now. It is not cold.', zh: '雪人已经变得小小的，也不凉了。' },
        { en: '"Good bye, snowman! Hello, hot sun!"', zh: '“雪人再见啦！热太阳，你好呀！”' },
      ],
    ],
  },
}
