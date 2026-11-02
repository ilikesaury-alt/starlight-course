// Unit 4 Toys & Fun 阅读短文（8 课）
// 照 unit1.ts 的先例手写：用词口径见 ../baseVocab.ts（零超纲），本课每个词都要出现在短文里，单测硬卡。
// 本单元自有词：toy shop 那课刻意避开 shop/shopping（不在允许词表内），用「toy place」表达同一个场景。
//
// 2026-11-02 文体改写：8 篇全部改写成「一个能一口气读完的小故事」——
//   每篇都有因果链：拿到新玩具 → 一起玩 → 冒出小问题 → 分享/修好 → 收起来 → 还想再玩；
//   对话推进情节，结尾用当课核心词回声收尾（找拼图 → All my toys are here；
//   Let's count them all → Let's count again tomorrow）；
//   句子改短、节奏错落，中文同步换成温暖口语、留画面的讲法。
//   结构一律 3 段（起 / 承 / 合），段间留白给孩子喘气。
import type { ReadingPassage } from './index'

export const unit4: Record<string, ReadingPassage> = {
  '4-1': {
    title: 'My Toy Box',
    titleZh: '我的玩具箱',
    paragraphs: [
      [
        { en: 'My name is Lily. I have a big toy box.', zh: '我叫 Lily，我有一个大玩具箱。' },
        { en: 'Today I open it. What do I see?', zh: '今天我把它打开，哟，都有些什么呀？' },
        { en: 'A doll, many blocks and red play dough.', zh: '一个洋娃娃，好多积木，还有红色的橡皮泥。' },
        { en: '"Where is my puzzle? It is not here!"', zh: '“我的拼图在哪儿？咦，它不在这里！”' },
      ],
      [
        { en: 'I look under the bed and behind the chair.', zh: '我趴到床底下看，又绕到椅子后面瞧。' },
        { en: 'I look in the box and under the table.', zh: '我把箱子翻了个底朝天，又钻到桌子底下。' },
        { en: 'Then I see it. My cat has the puzzle.', zh: '然后我看见啦——我的小猫正抱着拼图呢。' },
        { en: '"Please give it back to me," I say.', zh: '“请把它还给我，好不好？”我说。' },
      ],
      [
        { en: 'My cat gives it and runs away.', zh: '小猫把拼图放下，一溜烟跑开了。' },
        { en: 'Now I count them: doll, blocks, play dough, puzzle.', zh: '我一样一样数过来：洋娃娃、积木、橡皮泥、拼图。' },
        { en: 'I put them in the box.', zh: '我把它们都放回箱子里。' },
        { en: `"All my toys are here! Let's play tomorrow."`, zh: '“我的玩具一个都不少！明天我们再一起玩。”' },
      ],
    ],
  },
  '4-2': {
    title: 'My Toy Shop',
    titleZh: '我的玩具店',
    paragraphs: [
      [
        { en: 'My name is Tom. I love toys.', zh: '我叫 Tom，我爱玩具。' },
        { en: 'I have many toys, but no one plays with me.', zh: '我的玩具堆成小山，可没人陪我玩，好没意思。' },
        { en: '"Today I open my toy place!"', zh: '“今天我就开一家玩具小店！”' },
        { en: 'I put my toys on a long table.', zh: '我把玩具一件件摆到长桌子上。' },
      ],
      [
        { en: 'Leo comes in. "I want a train, please."', zh: 'Leo 推门进来：“我要一列火车，谢谢。”' },
        { en: 'Here you are! He says thanks.', zh: '“给你！”他高兴地道谢。' },
        { en: 'Mia comes in. "I want an airplane."', zh: 'Mia 也进来了：“我要一架大飞机。”' },
        { en: 'Kate comes too. "I want a red car."', zh: 'Kate 也挤进来：“我要一辆红汽车。”' },
      ],
      [
        { en: 'We play all day. It is fun.', zh: '我们玩了一整天，热闹极了。' },
        { en: 'Then Sam comes and sees my new scooter.', zh: '后来 Sam 来了，一眼就瞧见我的新滑板车。' },
        { en: 'It is my best toy.', zh: '那可是我最好的宝贝。' },
        { en: `"You can have it. Let's play together!"`, zh: '“拿去玩吧！我们一起玩！”' },
      ],
    ],
  },
  '4-3': {
    title: 'Be Polite',
    titleZh: '懂礼貌',
    paragraphs: [
      [
        { en: 'I am Ben. Today I get a new ball.', zh: '我是 Ben，今天我拿到了一个新球。' },
        { en: 'I take it to the park and run fast.', zh: '我把它带到公园，跑呀跑得好快。' },
        { en: 'Then I run into Mia.', zh: '结果一头撞上了 Mia。' },
        { en: 'Oh no! Her hat is on the grass.', zh: '哎呀！她的帽子掉在草地上啦。' },
        { en: `"I'm sorry," I say. "I am so sorry."`, zh: '“对不起，”我说，“真的对不起。”' },
      ],
      [
        { en: `Mia looks at me. "It's okay," she says.`, zh: 'Mia 抬头看看我：“没关系啦。”' },
        { en: 'I take the hat. "Here you are!"', zh: '我把帽子捡起来：“给你！”' },
        { en: '"Thank you," says Mia.', zh: '“谢谢。”Mia 说。' },
        { en: '"Please play with my other ball," I say.', zh: '“我还有一个球，也一起玩好不好？”我说。' },
      ],
      [
        { en: 'We play with the ball all day.', zh: '我们抱着球玩了一整天。' },
        { en: 'Before I go home, I say, "Sorry, please and thanks."', zh: '临走前我又把三句好话念了一遍：“对不起、请、还有谢谢。”' },
        { en: 'Mia smiles. "Okay! See you tomorrow."', zh: 'Mia 笑了：“好呀！明天见。”' },
      ],
    ],
  },
  '4-4': {
    title: 'Look! Superman!',
    titleZh: '看！超人！',
    paragraphs: [
      [
        { en: 'My name is Jack. I love toys.', zh: '我叫 Jack，我最喜欢玩具。' },
        { en: 'Today I open a big box of toys.', zh: '今天我打开一个大大的玩具箱。' },
        { en: 'Look! This is Superman. He can fly!', zh: '看！这是超人，他能飞！' },
        { en: 'This is Spiderman. He can climb fast.', zh: '这是蜘蛛侠，他爬得可快了。' },
        { en: 'And look! A big gray Transformer.', zh: '还有！一个灰色的大变形金刚。' },
      ],
      [
        { en: 'Who is this? A princess doll in pink.', zh: '咦，这个是谁？一个穿粉裙子的公主娃娃。' },
        { en: '"I want to be Superman," I say.', zh: '“我要当超人！”我说。' },
        { en: 'I put on the coat and run to the yard.', zh: '我披上那件外套，跑到院子里。' },
        { en: 'I try to fly. I do not fly.', zh: '我张开胳膊想飞……可我飞不起来。' },
        { en: 'I sit down on the grass and think.', zh: '我坐在草地上，想呀想。' },
      ],
      [
        { en: 'Then Mia can not hold her blocks. I help her.', zh: '这时 Mia 的积木抱不住了，我帮她接住。' },
        { en: '"Now I know what Superman does," I say. "He helps."', zh: '“现在我知道超人做什么了。”我说，“他帮人。”' },
      ],
    ],
  },
  '4-5': {
    title: 'I Love Music',
    titleZh: '我爱音乐',
    paragraphs: [
      [
        { en: 'My name is Grace. I love songs.', zh: '我叫 Grace，我最爱唱歌。' },
        { en: 'Today I go to the school room.', zh: '今天我去了学校的小音乐教室。' },
        { en: 'A boy plays a guitar near the door.', zh: '门边坐着一个男孩，正在弹吉他。' },
        { en: `"What's this?" I ask. "A guitar?"`, zh: '“这是什么呀？”我问，“是吉他吗？”' },
        { en: '"Yes! Listen to my song."', zh: '“对呀！听听我的歌。”' },
      ],
      [
        { en: 'He plays a happy song for me.', zh: '他给我弹了一首快活的小曲。' },
        { en: 'A girl plays a long white flute.', zh: '一个女孩吹着一支长长的白长笛。' },
        { en: 'Her song is like a little bird.', zh: '她的声音像一只小鸟在唱歌。' },
        { en: 'On the chair I see a violin.', zh: '椅子上还躺着一把小提琴。' },
      ],
      [
        { en: 'The boy takes the violin.', zh: '那个男孩把小提琴拿了起来。' },
        { en: '"Who can play the piano?" I ask.', zh: '“谁会弹钢琴？”我问。' },
        { en: `"I can play the piano," I say. "Let's play again tomorrow!"`, zh: '“我会弹钢琴！”我说，“明天我们再一起玩！”' },
      ],
    ],
  },
  '4-6': {
    title: 'My Toy Quiz',
    titleZh: '我的玩具小测验',
    paragraphs: [
      [
        { en: 'Hello! My name is Leo.', zh: '你好！我叫 Leo。' },
        { en: 'Today Ben comes to my house.', zh: '今天 Ben 来我家了。' },
        { en: `"Let's play a toy game," I say.`, zh: '“我们来玩个玩具游戏吧。”我说。' },
        { en: '"What toys do you have?" Ben asks.', zh: '“你都有什么玩具？”Ben 问。' },
      ],
      [
        { en: 'I have a doll, a puzzle and a scooter.', zh: '我有一个洋娃娃、一张拼图，还有一辆滑板车。' },
        { en: 'Ben puts on a big shirt.', zh: 'Ben 套上一件大衬衫。' },
        { en: '"Who is he?" I ask. "He is Spiderman!"', zh: '“咦，他是谁？”我问，“他是蜘蛛侠！”' },
        { en: 'We do the puzzle, but one is not here.', zh: '我们一起拼拼图，可有一块怎么也找不着。' },
      ],
      [
        { en: 'We look under the bed. We find it!', zh: '我们趴到床底下一找——在那儿！' },
        { en: 'Then we ride the scooter to the park.', zh: '后来我们踩着滑板车一路去了公园。' },
        { en: 'Ben goes fast. I go fast too.', zh: 'Ben 滑得飞快，我也一样。' },
        { en: '"Same again tomorrow," says Ben.', zh: '“明天再来一次！”Ben 说。' },
      ],
    ],
  },
  '4-7': {
    title: 'Show Time',
    titleZh: '表演时间',
    paragraphs: [
      [
        { en: 'It is show time at our school.', zh: '今天是我们学校的表演时间。' },
        { en: 'I am Lily, and I am ready.', zh: '我是 Lily，我准备好了。' },
        { en: 'But my violin is not in my bag.', zh: '咦，我的小提琴不在书包里。' },
        { en: 'I look in my bag and under the chair.', zh: '我翻遍书包，又趴到椅子底下看。' },
        { en: 'It is on the table. I take it.', zh: '原来在桌子上。我把它抱起来。' },
      ],
      [
        { en: '"Can you play the violin?" Ben asks.', zh: '“你会拉小提琴吗？”Ben 问。' },
        { en: '"Yes! I can play the violin."', zh: '“会！我会拉小提琴。”' },
        { en: 'I play it. The room is quiet.', zh: '我拉起来，教室里一下子静悄悄的。' },
        { en: 'Then Ben comes with his guitar.', zh: '接着 Ben 抱着吉他也上了台。' },
        { en: 'He plays a song. Kate plays a flute.', zh: '他弹起歌来，Kate 吹起了长笛。' },
      ],
      [
        { en: 'We all clap and sing together.', zh: '我们大家拍手，一起唱歌。' },
        { en: `My mom plays the piano. "Let's play again tomorrow!"`, zh: '妈妈来弹钢琴。“明天我们再演一场！”' },
      ],
    ],
  },
  '4-8': {
    title: 'Take Away',
    titleZh: '减一减',
    paragraphs: [
      [
        { en: 'Hello! I am Abby and I love candy.', zh: '你好！我叫 Abby，我最爱吃糖。' },
        { en: 'Today my mom gives me ten candies.', zh: '今天妈妈给了我十颗糖。' },
        { en: `"Let's count them all!"`, zh: '“我们一颗一颗数清楚！”' },
        { en: 'One, two, three, four, five.', zh: '一、二、三、四、五。' },
        { en: 'Six, seven, eight, nine and ten.', zh: '六、七、八、九、十，一颗也不少。' },
      ],
      [
        { en: 'Then my friend says, "Take away two."', zh: '这时我的朋友说：“减去二。”' },
        { en: '"How many are left?" I ask.', zh: '“还剩多少？”我问。' },
        { en: 'Ten take away two is eight.', zh: '十减去二，还剩八颗。' },
        { en: 'I give two candies to my friend.', zh: '我分给朋友两颗糖。' },
        { en: 'Eight take away two is six.', zh: '八再减去二，还剩六颗。' },
      ],
      [
        { en: 'We eat one candy each. "How many are left?"', zh: '我们一人吃了一颗。“还剩多少？”' },
        { en: `"Two left!" we say. "Let's count again tomorrow!"`, zh: '“还剩两颗！”我们说，“明天接着数！”' },
      ],
    ],
  },
}
