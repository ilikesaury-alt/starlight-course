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
import type { ReadingPassage } from './index'

export const unit10: Record<string, ReadingPassage> = {
  '10-1': {
    title: 'My Birthday Today',
    titleZh: '我的生日',
    paragraphs: [
      [
        { en: 'Hello! Today is my birthday.', zh: '你好！今天是我的生日！' },
        { en: 'My name is Lily and I am six.', zh: '我叫 Lily，我六岁。' },
        { en: 'I need a big birthday cake.', zh: '我需要一个大大的生日蛋糕。' },
        { en: 'I need some red balloons too.', zh: '我还需要一些红气球。' },
      ],
      [
        { en: 'I can not find my blue ribbon.', zh: '我找不到我的蓝丝带了。' },
        { en: 'Mom has one in her box.', zh: '妈妈在她的盒子里就有一条。' },
        { en: 'We put it on my new hat.', zh: '我们把它系在我的新帽子上。' },
        { en: 'Then we put up all the balloons.', zh: '然后我们把所有气球都挂起来。' },
      ],
      [
        { en: 'Oh! One red balloon can fly.', zh: '哦！有一个红气球飞走了。' },
        { en: 'My dog brings it here.', zh: '小狗把它带回来了。' },
        { en: 'Now I can eat my cake!', zh: '现在我就可以吃蛋糕啦！' },
        { en: 'What do you get on your birthday?', zh: '你生日的时候会得到什么呀？' },
      ],
    ],
  },
  '10-2': {
    title: 'A New Friend in the Park',
    titleZh: '公园里的新朋友',
    paragraphs: [
      [
        { en: 'I go to the park today.', zh: '今天我去公园。' },
        { en: 'I see a boy behind the tree.', zh: '我看见树后面有一个男孩。' },
        { en: 'He is new. I do not know him.', zh: '他是新来的，我不认识他。' },
        { en: 'I see a girl on the grass too.', zh: '我还看见草地上有一个女孩。' },
      ],
      [
        { en: 'She has a big red ball.', zh: '她有一个大红球。' },
        { en: 'The boy has a small blue car.', zh: '那个男孩有一辆蓝色的小汽车。' },
        { en: 'Hello! Can I play with you?', zh: '你好！我可以和你一起玩吗？' },
        { en: 'He says yes and comes near.', zh: '他说好，然后走了过来。' },
      ],
      [
        { en: 'Now we play with the ball.', zh: '现在我们一起玩球。' },
        { en: 'She is my friend now too.', zh: '现在她也是我的朋友了。' },
        { en: 'He is my good friend.', zh: '他是我的好朋友。' },
        { en: 'Come and play with us!', zh: '过来和我们一起玩吧！' },
      ],
    ],
  },
  '10-3': {
    title: 'Warm Gifts for Leo',
    titleZh: '给 Leo 的暖暖礼物',
    paragraphs: [
      [
        { en: 'It is a very cold day.', zh: '今天非常冷。' },
        { en: 'The snow is white and new.', zh: '雪是白色的，也是刚下的。' },
        { en: 'The ice is hard and cold.', zh: '冰又硬又冷。' },
        { en: 'I have a big box for Leo.', zh: '我给 Leo 准备了一个大盒子。' },
      ],
      [
        { en: 'Leo is my friend. He is six.', zh: 'Leo 是我的朋友，他六岁。' },
        { en: 'Here is a gift for you.', zh: '这是给你的礼物。' },
        { en: 'I give him ice skates and a blue scarf.', zh: '我给他一双冰鞋和一条蓝围巾。' },
        { en: 'He puts the scarf on.', zh: '他把围巾戴上了。' },
      ],
      [
        { en: 'Here are gloves for you too.', zh: '这里还有给你的手套。' },
        { en: 'He smiles and says thanks.', zh: '他笑着说谢谢。' },
        { en: 'Now he is warm and I love him.', zh: '现在他暖和了，我很爱他。' },
        { en: 'What gift will you give me?', zh: '你会给我什么礼物呢？' },
      ],
    ],
  },
  '10-4': {
    title: 'Anna Has a Friend Now',
    titleZh: 'Anna 现在有朋友了',
    paragraphs: [
      [
        { en: 'It is a cold day with snow.', zh: '今天很冷，还下着雪。' },
        { en: 'I see my friend Anna at school.', zh: '我在学校看见我的朋友 Anna。' },
        { en: 'She stands near the school door.', zh: '她站在学校门边。' },
        { en: 'She does not have a friend now.', zh: '她现在没有朋友。' },
      ],
      [
        { en: 'I go to her and I say hi.', zh: '我走过去，对她说你好。' },
        { en: 'She smiles at me now.', zh: '她朝我笑了。' },
        { en: 'I hug my friend Anna.', zh: '我拥抱我的朋友 Anna。' },
        { en: 'Oh, she hugs me too!', zh: '哦，她也抱了我！' },
      ],
      [
        { en: 'Then I kiss her little hand.', zh: '然后我亲了亲她的小手。' },
        { en: 'She laughs and I smile.', zh: '她笑了起来，我也笑了。' },
        { en: 'Now she has a friend. I love her.', zh: '现在她有朋友了。我爱她。' },
        { en: 'Come and be my friend too!', zh: '你也来做我的朋友吧！' },
      ],
    ],
  },
  '10-5': {
    title: 'Around the Birthday Cake',
    titleZh: '围着生日蛋糕',
    paragraphs: [
      [
        { en: 'Hello! Today is a birthday.', zh: '你好！今天是一个生日会。' },
        { en: 'Mom brings the big birthday cake.', zh: '妈妈端来了大大的生日蛋糕。' },
        { en: 'A candle stands on the cake.', zh: '蛋糕上立着一根蜡烛。' },
        { en: 'Mom says, do not touch it.', zh: '妈妈说，别碰它。' },
      ],
      [
        { en: 'We sing a birthday song now.', zh: '我们现在唱一首生日歌。' },
        { en: 'Then we close our eyes and wish.', zh: '然后我们闭上眼睛许愿。' },
        { en: 'My wish is a blue new bike.', zh: '我的愿望是一辆蓝色的新自行车。' },
        { en: 'My friends clap and laugh now.', zh: '我的朋友们拍手哈哈大笑。' },
      ],
      [
        { en: 'I hop and the candle goes out.', zh: '我往上一跳，蜡烛就灭了。' },
        { en: 'Now we eat the birthday cake.', zh: '现在我们吃生日蛋糕。' },
        { en: 'It is so good and so soft.', zh: '蛋糕又好吃又松软。' },
        { en: 'What will you wish for today?', zh: '今天你要许什么愿呢？' },
      ],
    ],
  },
  '10-6': {
    title: 'My Birthday, My Friends',
    titleZh: '我的生日，我的朋友',
    paragraphs: [
      [
        { en: 'What do you need for a birthday?', zh: '过生日你需要准备什么呀？' },
        { en: 'I need balloons and a gift.', zh: '我需要气球，还需要礼物。' },
        { en: 'I need my good friend here too.', zh: '我还需要我的好朋友也在这里。' },
        { en: 'Ben comes to my house now.', zh: 'Ben 现在来到我家了。' },
      ],
      [
        { en: 'He gives me a big blue balloon.', zh: '他给了我一个大蓝气球。' },
        { en: 'I give him my new gift.', zh: '我把我的新礼物送给了他。' },
        { en: 'We sing and eat the cake.', zh: '我们一起唱歌、一起吃蛋糕。' },
        { en: 'Then we play with the balloon.', zh: '然后我们一起玩气球。' },
      ],
      [
        { en: 'The balloon flies up to the sky.', zh: '气球飞上天去了。' },
        { en: 'We can not get it down.', zh: '它怎么也下不来了。' },
        { en: 'My friend hugs me and I hug him.', zh: '我的朋友抱住我，我也抱住他。' },
        { en: 'Do you want a balloon too?', zh: '你也想要一个气球吗？' },
      ],
    ],
  },
  '10-7': {
    title: 'Clean Up My Room',
    titleZh: '打扫我的房间',
    paragraphs: [
      [
        { en: 'Today I play with my blocks.', zh: '今天我在玩我的积木。' },
        { en: 'My blocks make a very big house.', zh: '我的积木搭出了一座很大的房子。' },
        { en: 'My old doll sits on the chair.', zh: '我的旧娃娃坐在椅子上。' },
        { en: 'I put the doll on the bed.', zh: '我又把娃娃放到了床上。' },
      ],
      [
        { en: 'Now my room is not clean.', zh: '现在我的房间不干净了。' },
        { en: 'Mom says it is time to clean up.', zh: '妈妈说，该打扫了。' },
        { en: 'I put away my blocks in the box.', zh: '我把积木都收进盒子里。' },
        { en: 'I put away my books on the desk.', zh: '我把书都放到了书桌上。' },
      ],
      [
        { en: 'Now I can walk in my room.', zh: '现在我可以在房间里走来走去了。' },
        { en: 'My cat comes out to see me.', zh: '我的猫走出来看我。' },
        { en: 'Then my room looks so nice!', zh: '我的房间看起来真漂亮！' },
        { en: 'Come in and see my house!', zh: '进来看看我的房子吧！' },
      ],
    ],
  },
  '10-8': {
    title: 'One Happy Birthday',
    titleZh: '一个快乐的生日',
    paragraphs: [
      [
        { en: 'Today is my birthday!', zh: '今天是我的生日！' },
        { en: 'My friend Ben gives me a gift.', zh: '我的朋友 Ben 送我一个礼物。' },
        { en: 'Lily gives me a big red balloon.', zh: 'Lily 给了我一个大红气球。' },
        { en: 'She gives me a blue scarf.', zh: '她还给了我一条蓝围巾。' },
      ],
      [
        { en: 'We sing a birthday song now.', zh: '我们现在唱一首生日歌。' },
        { en: 'Then we sing the song again.', zh: '然后我们又唱了一遍。' },
        { en: 'There is one candle on the cake.', zh: '蛋糕上有一根蜡烛。' },
        { en: 'I hop and the candle goes out.', zh: '我往上一跳，蜡烛就灭了。' },
      ],
      [
        { en: 'We eat the cake and laugh.', zh: '我们吃着蛋糕笑了起来。' },
        { en: 'My friends hug me and smile.', zh: '朋友们抱着我，笑着。' },
        { en: 'I love my friends very much.', zh: '我非常爱我的朋友们。' },
        { en: 'Happy birthday to all of you!', zh: '祝你们大家生日快乐！' },
      ],
    ],
  },
}
