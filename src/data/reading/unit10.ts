// Unit 10 My Birthday 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 两条本单元特有的坑，写之前先记下来：
//
// 1) 词表里有几个**多词词条**：10-3 `ice skates`、10-5 `birthday song` / `birthday cake`、
//    10-7 `clean up` / `put away`。readingPassage.test.ts 的「本课词表 100%」用
//    `used.has(w.en.toLowerCase())` 判定，而 used 是 tokenizeReading 的产物
//    （每个 token 由 /[a-z]+(?:'[a-z]+)?/g 切出，不可能含空格），
//    所以**多词词条永远判不出来** —— 这是测试口径的既有限制
//    （Unit 3/4/6/9/12 的 `gummy bear` / `take away` / `table tennis` 等同款），
//    与短文写得好不好无关。本文件仍按语义把每个词真正写进正文：
//    `birthday song`、`birthday cake`、`clean up` 三组两个词都在句子里真实出现。
//
// 2) `ice skates` / `put away` 只以**整词**形式存在于 unit 词表，
//    `skates` 和 `away` 还原不到任何允许词形（stemsOf 只产出 skates/skat/skate）。
//    硬写这两个 token 会违反「零超纲」这条更重要的规则（孩子没学过 = 不能出现），
//    故英文正文改用 scarf / gloves / "put ... in the box" 表达同一件事，
//    中文照常说冰鞋与收好。其余六课的词表词全部以**原形**真实出现
//    （注意是原形：smiles 不算 smile，必须有一处写 smile）。
//
// 2026-11-02 文体改写：8 篇全部重写成「生日那天发生的小故事」——
//   准备 → 出状况 → 想办法 → 回声收尾；对话推动、段落=叙事节拍、句短错落。
//   ⚠️ 上面第 2 条的前提**已过时**（2026-11-02 实测）：baseVocab.ts 的 BASE_NOUNS
//   里有 `skate`（stemsOf('skates') → skate）、FUNCTION_WORDS 里有 `away`，
//   两个 token 都**不是**超纲；而且「本课词 100%」按空格拆分后要求
//   `ice`/`skates`、`put`/`away` 都在正文里出现，改写成 "put ... in the box"
//   反而会漏掉 `away` 而挂测试。故本次照旧把 `ice skates` / `put away` 原样写进正文
//   （10-3 第 3~4 句、10-7 第 7~9 句），中文照常说冰鞋与收好。
import type { ReadingPassage } from './index'

export const unit10: Record<string, ReadingPassage> = {
  '10-1': {
    title: 'My Birthday Today',
    titleZh: '今天是我的生日',
    paragraphs: [
      [
        { en: 'Hello! Today is my birthday.', zh: '你好！今天是我的生日！' },
        { en: 'My name is Lily, and I am six.', zh: '我叫 Lily，今年六岁。' },
        { en: 'Mom says, "We need a big cake today."', zh: '妈妈说：“我们今天要一个大大的蛋糕。”' },
        { en: 'I say, "I need some red balloons."', zh: '我说：“我还要几个红气球。”' },
      ],
      [
        { en: 'Oh no! I can not find my blue ribbon.', zh: '哎呀！我找不到那条蓝丝带了。' },
        { en: 'Mom has one in her box.', zh: '妈妈的盒子里就有一条呢。' },
        { en: 'We put the ribbon on my new hat.', zh: '我们把丝带系在我的新帽子上。' },
      ],
      [
        { en: 'The balloons go up high in my room.', zh: '气球一个个飘到房间的高处。' },
        { en: 'One red balloon flies up and away!', zh: '一个红气球飞呀飞，飘走啦！' },
        { en: 'My dog runs fast and brings it back.', zh: '小狗飞快地跑过去，把气球叼了回来。' },
        { en: 'Now I can eat my cake!', zh: '现在我可以吃蛋糕啦！' },
        { en: '"Happy birthday, Lily!" says Mom, and I smile.', zh: '“生日快乐，Lily！”妈妈笑着说，我笑得眼睛都弯了。' },
      ],
    ],
  },
  '10-2': {
    title: 'A New Friend in the Park',
    titleZh: '公园里的新朋友',
    paragraphs: [
      [
        { en: 'It is my birthday. I go to the park.', zh: '今天是我的生日，我去了公园。' },
        { en: 'A boy stands behind a big tree.', zh: '一棵大树后面站着一个男孩。' },
        { en: 'He holds a small blue car.', zh: '他手里拿着一辆蓝色的小汽车。' },
        { en: 'A girl sits on the grass with a ball.', zh: '草地上坐着一个女孩，手里抱着一个球。' },
      ],
      [
        { en: '"Hi! Can I play with you?" I ask.', zh: '“嗨！我可以和你们一起玩吗？”我问。' },
        { en: '"Yes! Come here!" says the boy.', zh: '“好呀！快来！”男孩说。' },
        { en: '"I can throw the ball high," she says.', zh: '“我会把球抛得很高。”她说。' },
        { en: 'So now I play with them.', zh: '于是我也加入他们一起玩。' },
      ],
      [
        { en: 'We run and jump and laugh all day.', zh: '我们跑呀跳呀，笑了一整天。' },
        { en: 'The sun goes down. We say bye.', zh: '太阳落山了，我们说再见。' },
        { en: 'The boy is my friend now.', zh: '那个男孩现在是我的朋友了。' },
        { en: '"Come to my birthday!" I say and smile.', zh: '“来我的生日会吧！”我笑着说。' },
      ],
    ],
  },
  '10-3': {
    title: 'Warm Gifts for Leo',
    titleZh: '送给 Leo 的暖暖礼物',
    paragraphs: [
      [
        { en: 'Leo has a birthday today. The snow is white.', zh: '今天轮到 Leo 过生日，雪白白的。' },
        { en: 'I have a big box for his gift.', zh: '我准备了一个大盒子，装他的礼物。' },
        { en: 'I put a blue scarf and warm gloves in.', zh: '我把一条蓝围巾和暖和的手套放进去。' },
        { en: 'And I put new ice skates in too.', zh: '还把一双新冰鞋也放进去。' },
      ],
      [
        { en: 'Leo comes to my house and opens the box.', zh: 'Leo 来我家，打开了盒子。' },
        { en: '"Wow! Are these for me?" he asks.', zh: '“哇！这些是给我的吗？”他问。' },
        { en: 'He puts the scarf on and smiles.', zh: '他把围巾围上，笑了起来。' },
        { en: '"Thank you! I can not wait to skate."', zh: '“谢谢你！我等不及要去滑冰啦。”' },
      ],
      [
        { en: 'We go out and skate on the hard ice.', zh: '我们跑到外面，在硬邦邦的冰上滑起来。' },
        { en: 'His face is red, but he is happy.', zh: '他的脸冻得红红的，可开心极了。' },
        { en: 'I give him my gloves when he is cold.', zh: '他冷了，我就把手套给他。' },
        { en: '"Happy birthday, Leo!" we say together.', zh: '“生日快乐，Leo！”我们一起说。' },
      ],
    ],
  },
  '10-4': {
    title: 'Anna Has a Friend Now',
    titleZh: 'Anna 现在有朋友啦',
    paragraphs: [
      [
        { en: 'Anna has a birthday today, but she is sad.', zh: '今天轮到 Anna 过生日，可她却很难过。' },
        { en: 'She has no gift, and her eyes are red.', zh: '她没有礼物，眼睛红红的。' },
        { en: 'She looks down and does not answer.', zh: '她低着头，一句话也不说。' },
        { en: 'I go to her and say, "Hi, Anna."', zh: '我走过去，对她说：“嗨，Anna。”' },
      ],
      [
        { en: '"Why do you sit here?" I ask.', zh: '“你为什么一个人坐这儿？”我问。' },
        { en: '"All my friends are away," she says.', zh: '“我的朋友都出去了。”她说。' },
        { en: 'I sit down close to her and smile.', zh: '我坐到她身边，对她笑了笑。' },
        { en: '"I am here now. Can I hug you?"', zh: '“我现在陪着你，可以抱抱你吗？”' },
      ],
      [
        { en: 'She smiles and hugs me back.', zh: '她笑了，也抱住了我。' },
        { en: 'She gives me a gift from her bag.', zh: '她从包里掏出一个礼物送给我。' },
        { en: 'We kiss and say, "I love you."', zh: '我们亲了亲，说：“我爱你。”' },
        { en: 'Now Anna is not sad, and she smiles.', zh: '现在 Anna 不难过了，脸上又有了笑。' },
      ],
    ],
  },
  '10-5': {
    title: 'Around the Birthday Cake',
    titleZh: '围着生日蛋糕',
    paragraphs: [
      [
        { en: 'Hello! Today is my birthday.', zh: '你好！今天是我的生日。' },
        { en: 'Mom brings the big birthday cake to the table.', zh: '妈妈把那个大大的生日蛋糕端上桌。' },
        { en: 'Seven candles stand on the top of it.', zh: '蛋糕上竖着七根小蜡烛。' },
        { en: '"Do not touch it!" says Mom.', zh: '“别碰它！”妈妈说。' },
      ],
      [
        { en: '"Let\'s sing a birthday song," says Tom.', zh: '“我们来唱生日歌吧。”Tom 说。' },
        { en: 'We sing and clap and smile.', zh: '我们唱着歌，拍着手，笑着。' },
        { en: '"Now make a wish," says my friend.', zh: '“现在许个愿吧。”朋友说。' },
        { en: 'I close my eyes and wish for a new bike.', zh: '我闭上眼睛，许愿要一辆新自行车。' },
      ],
      [
        { en: 'I hop, and all the candles go out.', zh: '我往上一跳，蜡烛全都灭啦。' },
        { en: 'Now we eat the birthday cake.', zh: '现在我们一起吃生日蛋糕。' },
        { en: 'It is soft and warm and yummy.', zh: '蛋糕又软又香，甜甜的。' },
        { en: '"Happy birthday to you!" we sing again.', zh: '“祝你生日快乐！”我们又唱了一遍。' },
      ],
    ],
  },
  '10-6': {
    title: 'My Birthday, My Friends',
    titleZh: '我的生日，我的好朋友',
    paragraphs: [
      [
        { en: 'Mom asks, "What do you need for your birthday?"', zh: '妈妈问：“你的生日要准备什么呀？”' },
        { en: '"Balloons and a cake," I say.', zh: '“气球和蛋糕。”我说。' },
        { en: 'I need my good friend here too.', zh: '还要我最好的朋友也来。' },
      ],
      [
        { en: 'Ben comes with a big red balloon.', zh: 'Ben 来了，手里拿着一个大红气球。' },
        { en: '"This is for you," he says and smiles.', zh: '“这个送给你。”他笑着说。' },
        { en: 'I give him a gift and a hug.', zh: '我把礼物送给他，还抱了抱他。' },
        { en: 'We sing and eat the cake together.', zh: '我们一起唱歌，一起吃蛋糕。' },
      ],
      [
        { en: 'Then we play with the balloon.', zh: '然后我们一起玩气球。' },
        { en: 'The wind takes it up to the tree.', zh: '风一吹，气球飞到了树梢上。' },
        { en: 'We can not get it down, but we laugh.', zh: '我们够不下来，可是都笑弯了腰。' },
        { en: 'Ben hugs me and says, "Best birthday!"', zh: 'Ben 抱住我，说：“最棒的生日！”' },
        { en: '"The best one!" I say and smile.', zh: '“最棒的生日！”我也笑着说。' },
      ],
    ],
  },
  '10-7': {
    title: 'Clean Up My Room',
    titleZh: '把我的房间收拾好',
    paragraphs: [
      [
        { en: 'It is my birthday, and I play in my room.', zh: '今天是我的生日，我在房间里玩。' },
        { en: 'My blocks make a big house.', zh: '我的积木搭成了一座大房子。' },
        { en: 'My old doll sits on the chair.', zh: '我的旧娃娃坐在椅子上。' },
        { en: 'I put her on the bed too.', zh: '我又把她放到了床上。' },
      ],
      [
        { en: 'Now my room is not clean.', zh: '现在我的房间乱糟糟的。' },
        { en: 'Mom says, "It is time to clean up."', zh: '妈妈说：“该打扫啦。”' },
        { en: '"Put away the blocks, please," says Mom.', zh: '“把积木收好吧。”妈妈说。' },
        { en: 'I put away my blocks in the box.', zh: '我把积木都收进了盒子里。' },
      ],
      [
        { en: 'I put away the doll. It sits on the bed.', zh: '我把娃娃收好，让它坐在床上。' },
        { en: 'Now my room is clean and nice.', zh: '现在房间又干净又漂亮。' },
        { en: 'My cat comes out to see me.', zh: '我的猫从床底下钻出来看我。' },
        { en: 'Now my birthday can start!', zh: '现在，我的生日可以开始啦！' },
      ],
    ],
  },
  '10-8': {
    title: 'One Happy Birthday',
    titleZh: '一个快乐的生日',
    paragraphs: [
      [
        { en: 'Today is my birthday, and I am six.', zh: '今天是我的生日，我六岁啦。' },
        { en: 'My friends come to my house.', zh: '我的朋友们都来我家了。' },
        { en: 'Ben gives me a gift and a blue balloon.', zh: 'Ben 送我一个礼物，还有一个大蓝气球。' },
        { en: 'Lily gives me a warm scarf.', zh: 'Lily 送给我一条暖暖的围巾。' },
      ],
      [
        { en: 'We sing a birthday song for me.', zh: '我们为我唱起生日歌。' },
        { en: 'One candle stands on my cake.', zh: '蛋糕上立着一根蜡烛。' },
        { en: '"Make a wish!" says my friend.', zh: '“许个愿吧！”朋友说。' },
        { en: 'I hop and the candle goes out.', zh: '我往上一跳，蜡烛灭啦。' },
      ],
      [
        { en: 'We eat the cake and laugh together.', zh: '我们一边吃蛋糕一边笑。' },
        { en: 'Then it is time to clean up.', zh: '接着就该打扫收拾啦。' },
        { en: 'We put the gifts in one box.', zh: '我们把礼物都放进一个盒子里。' },
        { en: '"Happy birthday to all of you!"', zh: '“祝你们大家生日快乐！”' },
      ],
    ],
  },
}
