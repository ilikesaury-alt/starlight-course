// Unit 6 My Body 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 2026-11-02 文体改写：8 篇全部重写为「一个小故事」——
//   身体部位不再是清单，而是**动起来的道具**：耳朵去听、鼻子去闻、眼睛去找、手去捡、
//   脚去跑、嘴去说和唱、胳膊和腿去接球。
//   每篇都有起因 → 小麻烦 → 解决 → 结尾回声（1-1 的「Hello, tomorrow!」那种余韵），
//   段落即叙事节拍，对话推进，中文改成温暖口语的讲法。
import type { ReadingPassage } from './index'

export const unit6: Record<string, ReadingPassage> = {
  // 6-1 My Face：眼睛、耳朵、鼻子、嘴巴一个接一个帮忙，把丢在草丛里的红球找回来
  '6-1': {
    title: 'My Face Can Help',
    titleZh: '我的脸真有本领',
    paragraphs: [
      [
        { en: 'This morning Mia and I play with a red ball.', zh: '这天早上，Mia 和我一起玩红球。' },
        { en: 'I throw it up. It goes into the grass.', zh: '我把球往上一抛，它就滚进草丛里啦。' },
        { en: '"Oh no! My red ball is not here!" Mia says.', zh: '“哦不！我的红球不见啦！”Mia 说。' },
        { en: 'The grass is tall. Where is it?', zh: '草丛好高。它到底在哪儿呢？' },
      ],
      [
        { en: '"My ears can help. We listen," Mia says.', zh: '“我的耳朵能帮忙，我们听听看。”Mia 说。' },
        { en: '"I hear it! It is near the apple tree," I say.', zh: '“我听见啦！就在苹果树那边。”我说。' },
        { en: 'Mia uses her nose. She smells the apples.', zh: 'Mia 用起鼻子，她闻到了苹果的香味。' },
        { en: 'My eyes see a red ball under one leaf.', zh: '我的眼睛看见一片叶子下有个红球。' },
      ],
      [
        { en: 'Mia takes it with two hands.', zh: 'Mia 用两只手把球捡了起来。' },
        { en: '"My mouth says thank you!" Mia laughs.', zh: '“我的嘴巴要说谢谢！”Mia 笑啦。' },
        { en: '"Ears, nose, eyes and mouth! We play again!"', zh: '“耳朵、鼻子、眼睛和嘴巴！我们再玩一次！”' },
      ],
    ],
  },

  // 6-2 Oh! My Mouth!：嘴巴又会吃又会喝，闻到蛋糕还得先唱首歌等着
  '6-2': {
    title: 'Oh! My Mouth!',
    titleZh: '哦！我的嘴巴！',
    paragraphs: [
      [
        { en: 'Good morning! Mia is hungry now.', zh: '早上好！Mia 现在饿啦。' },
        { en: 'Her mouth eats a big red apple.', zh: '她的嘴巴吃下一个又大又红的苹果。' },
        { en: '"I can eat!" Mia laughs. Now she is thirsty.', zh: '“我会吃！”Mia 笑着说。这时候她渴了。' },
        { en: 'Her mouth drinks cold white milk.', zh: '她的嘴巴喝掉了凉凉的白牛奶。' },
      ],
      [
        { en: 'Then Mia smells a cake on the table.', zh: '接着 Mia 闻到桌子上有个蛋糕。' },
        { en: 'The cake is not ready. She must wait.', zh: '蛋糕还没做好，她得等一等。' },
        { en: 'Mia is sad. Her mouth wants that cake!', zh: 'Mia 有点难过。她的嘴巴好想吃那个蛋糕！' },
        { en: 'Mom says, "Sing one song and wait for me."', zh: '妈妈说：“唱首歌给妈妈听，等等我哦。”' },
      ],
      [
        { en: 'Mia sings a happy song for Mom.', zh: 'Mia 给妈妈唱了一首快乐的歌。' },
        { en: 'Her mouth can sing! It sings very well.', zh: '她的嘴巴会唱歌！唱得可好听了。' },
        { en: 'Now the cake is ready. They eat it together.', zh: '现在蛋糕好啦，她们一起吃蛋糕。' },
        { en: 'So what can your mouth do?', zh: '那么，你的嘴巴能做什么呢？' },
      ],
    ],
  },

  // 6-3 Clap Your Hands!：Ben 只会用手接球，输了以后学会胳膊腿脚一起上
  '6-3': {
    title: 'Clap Your Hands!',
    titleZh: '拍拍你的手！',
    paragraphs: [
      [
        { en: 'Ben has two arms and two legs.', zh: 'Ben 有两只胳膊和两条腿。' },
        { en: 'He has two hands and two feet.', zh: '他有两只手和两只脚。' },
        { en: 'Today he wants to play with a ball.', zh: '今天他想玩球。' },
        { en: 'The ball comes down from the tree.', zh: '球从树上掉下来了。' },
        { en: 'Ben can not catch it with his hands.', zh: 'Ben 只用手，怎么也接不住。' },
        { en: 'The ball goes under the chair.', zh: '球滚到椅子底下去了。' },
      ],
      [
        { en: '"Clap your hands and try again," says Kate.', zh: '“拍拍手，再试一次。”Kate 说。' },
        { en: 'Ben claps. He tries one arm and one leg.', zh: 'Ben 拍了拍手。这次他一只胳膊加一条腿一起上。' },
        { en: 'Now he runs and jumps with his feet.', zh: '现在他用两只脚跑呀跳呀。' },
        { en: 'His two hands take the ball.', zh: '他的两只手把球稳稳接住了。' },
        { en: 'Ben is very happy now.', zh: 'Ben 现在开心极啦。' },
        { en: '"Hello, arm! Hello, leg! Hello, hand and foot!"', zh: '“你好呀，胳膊！你好呀，腿！你好呀，手和脚！”' },
      ],
    ],
  },

  // 6-4 What Can You Do?：Anna 的猫上了树，会蹦的青蛙和会爬的 Anna 一起救猫
  '6-4': {
    title: 'What Can You Do?',
    titleZh: '你会做什么？',
    paragraphs: [
      [
        { en: 'Anna plays in the park with her cat.', zh: 'Anna 在公园里和她的猫玩。' },
        { en: 'The cat runs away under a tree.', zh: '小猫一下子跑到树底下去了。' },
        { en: 'A big frog hops out of the grass.', zh: '一只大青蛙从草丛里蹦了出来。' },
        { en: '"Hello! What can you do?" asks the frog.', zh: '“你好！你会做什么呀？”青蛙问。' },
        { en: '"I can run, jump and walk," says Anna.', zh: '“我会跑，会跳，也会走。”Anna 说。' },
      ],
      [
        { en: '"Where is my cat?" Anna asks.', zh: '“我的猫在哪儿？”Anna 问。' },
        { en: 'The frog says, "Look up! It is up on a tree."', zh: '青蛙说：“快看！它爬到树上去了。”' },
        { en: '"I can jump high!" The frog jumps.', zh: '“我会跳得高高的！”青蛙蹦了几下。' },
        { en: 'But the cat is too high.', zh: '可是猫爬得太高啦。' },
      ],
      [
        { en: '"Then I can climb," says Anna.', zh: '“那我可以爬上去。”Anna 说。' },
        { en: 'Anna climbs up and brings the cat down.', zh: 'Anna 爬上树，把小猫抱了下来。' },
        { en: '"I can run, jump, walk and climb!" Anna laughs.', zh: '“我会跑、会跳、会走，还会爬！”Anna 笑着说。' },
      ],
    ],
  },

  // 6-5 My Hands Can Do：下雨天出不了门，Emma 用两只手给妈妈做一张卡片
  '6-5': {
    title: 'My Hands Can Do',
    titleZh: '我的手会做这些事',
    paragraphs: [
      [
        { en: 'It is raining in the afternoon.', zh: '下午下雨啦。' },
        { en: 'Emma can not go out and play.', zh: 'Emma 没办法出去玩。' },
        { en: 'She looks out of the window at the rain.', zh: '她看着窗外的雨直发愁。' },
        { en: 'Mom is sad today. Emma wants to help.', zh: '今天妈妈不太开心。Emma 想帮帮妈妈。' },
      ],
      [
        { en: 'Mom gives her a box of pens.', zh: '妈妈给了她一盒画笔。' },
        { en: 'Emma can paint a big red flower.', zh: 'Emma 会涂一朵又大又红的花。' },
        { en: 'She can draw one little cat.', zh: '她会画一只小猫。' },
        { en: 'She can write her name on it.', zh: '她还会把自己的名字写上去。' },
        { en: 'Now she has one nice card.', zh: '现在她有一张漂亮的卡片啦。' },
      ],
      [
        { en: 'She gives the card to Mom.', zh: '她把卡片送给妈妈。' },
        { en: 'Mom opens the card and smiles.', zh: '妈妈打开卡片，笑了。' },
        { en: '"Oh! What can hands do?" says Mom.', zh: '“哦！手还能做这么多事呀？”妈妈说。' },
      ],
    ],
  },

  // 6-6 Quiz：复习课 —— 跳、跑、转、弯腰，跳出一身汗就一起喝牛奶
  '6-6': {
    title: 'Happy Game Day',
    titleZh: '快乐游戏日',
    paragraphs: [
      [
        { en: 'Today is a good day for a game.', zh: '今天真适合玩游戏。' },
        { en: 'Lily asks me, "Jump or run?"', zh: 'Lily 问我：“跳还是跑？”' },
        { en: '"Jump! I can jump high," I say.', zh: '“跳！我能跳得很高。”我说。' },
        { en: 'Lily can jump higher than me.', zh: 'Lily 比我跳得还高。' },
      ],
      [
        { en: '"Now spin and bend!" she says.', zh: '“现在转圈、弯腰！”她说。' },
        { en: 'We spin and bend ten times in the sun.', zh: '我们在太阳底下转十圈，弯十次腰。' },
        { en: 'We run and jump all over the park.', zh: '我们在公园里到处跑呀跳呀。' },
        { en: 'Then I am hot and my face is red.', zh: '后来我热了，小脸蛋红红的。' },
        { en: '"Is it hot or cold today?" Lily asks.', zh: '“今天是热还是冷？”Lily 问。' },
      ],
      [
        { en: '"It is hot! We drink our milk."', zh: '“热！我们去喝牛奶。”' },
        { en: '"What can you do?" Lily asks again.', zh: '“你会做什么呀？”Lily 又问。' },
        { en: '"I can eat, sing, run, spin and jump!"', zh: '“我会吃、会唱、会跑、会转，还会跳！”' },
      ],
    ],
  },

  // 6-7 Let's Dance：Sam 一个人闷闷的，Jack 用一首歌把他拉起来跳舞
  '6-7': {
    title: "Let's Dance",
    titleZh: '一起来跳舞',
    paragraphs: [
      [
        { en: 'It is a cold and long day.', zh: '今天又冷又漫长。' },
        { en: 'Sam sits in his room with his cat.', zh: 'Sam 坐在房间里，怀里抱着猫。' },
        { en: 'He can not go out and play.', zh: '他没法出去玩。' },
        { en: 'He is sad and quiet.', zh: '他安安静静的，心里闷闷的。' },
      ],
      [
        { en: 'Then a happy song comes to my window.', zh: '这时，窗外飘来一首快乐的歌。' },
        { en: 'It is his friend Jack.', zh: '是他的朋友 Jack。' },
        { en: '"Come on, Sam! Let\'s dance!" says Jack.', zh: '“来吧，Sam！我们跳舞吧！”Jack 说。' },
        { en: '"I can not dance," says Sam.', zh: '“我不会跳舞。”Sam 说。' },
        { en: 'Jack shows him. "Let\'s bend. Let\'s spin."', zh: 'Jack 做给他看：“我们弯弯腰。我们转个圈。”' },
      ],
      [
        { en: 'Sam tries one bend and one spin.', zh: 'Sam 试着弯了一次腰，又转了一个圈。' },
        { en: 'His feet can dance now!', zh: '现在他的两只脚会跳舞啦！' },
        { en: 'They dance all day. "Let\'s dance again!" Sam says.', zh: '他们跳了一整天。“我们再跳一支！”Sam 说。' },
      ],
    ],
  },

  // 6-8 All About Me：Kate 一个人坐在公园，一个新朋友用身体部位打破沉默
  '6-8': {
    title: 'All About Me',
    titleZh: '这就是我',
    paragraphs: [
      [
        { en: 'This is me. I am Kate, a girl.', zh: '这就是我。我叫 Kate，是个女孩。' },
        { en: 'I have two eyes, two hands and two feet.', zh: '我有两只眼睛、两只手和两只脚。' },
        { en: 'I have black hair and a big smile.', zh: '我有一头黑头发，笑起来大大的。' },
        { en: 'One foot can run and one hand can clap.', zh: '一只脚会跑，一只手会拍手。' },
        { en: 'Today I sit in the park and wait.', zh: '今天我一个人在公园里坐着等。' },
      ],
      [
        { en: 'I have no friends here.', zh: '这里我一个朋友也没有。' },
        { en: 'A boy comes to me. "Hello! I am Tom."', zh: '一个男孩走过来。“你好！我叫 Tom。”' },
        { en: '"Hello, Kate! How old are you?"', zh: '“你好，Kate！你几岁了？”' },
        { en: '"I am six! I like apples too."', zh: '“我六岁！我也喜欢苹果。”' },
      ],
      [
        { en: '"Me too!" Tom says. "Can we play?"', zh: '“我也是！”Tom 说，“我们一起玩好吗？”' },
        { en: 'We clap our hands and sing a song.', zh: '我们拍拍手，唱了一首歌。' },
        { en: 'Now I have one good friend.', zh: '现在我有一个好朋友啦。' },
      ],
    ],
  },
}
