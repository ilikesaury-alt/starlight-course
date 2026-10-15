// Unit 6 My Body 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
import type { ReadingPassage } from './index'

export const unit6: Record<string, ReadingPassage> = {
  // 6-1 My Face：五官各自有本事，最后帮 Mia 找到丢的球
  '6-1': {
    title: 'My Face Can Help',
    titleZh: '我的脸真能干',
    paragraphs: [
      [
        { en: 'This is my friend Mia.', zh: '这是我的朋友 Mia。' },
        { en: 'Today we play with a red ball.', zh: '今天我们玩一个红球。' },
        { en: 'Oh no! The ball is not here.', zh: '哦不！球不在这里。' },
        { en: 'Mia has a sad face now.', zh: 'Mia 现在有一张难过的脸。' },
        { en: 'Where is my little red ball?', zh: '我的小红球在哪里？' },
      ],
      [
        { en: 'One eye can see the park.', zh: '一只眼睛能看见公园。' },
        { en: 'My nose can smell the flowers.', zh: '我的鼻子能闻到花香。' },
        { en: 'My mouth can say, I know!', zh: '我的嘴巴能说：我知道啦！' },
        { en: 'Touch your ear and listen.', zh: '摸摸你的耳朵，听一听。' },
        { en: 'The ball is behind the tree.', zh: '球在树的后面。' },
        { en: 'She gets her ball and laughs.', zh: '她拿到球，笑了起来。' },
        { en: 'We play in the park all day.', zh: '我们在公园里玩了一整天。' },
      ],
    ],
  },

  // 6-2 Oh! My Mouth!：嘴巴早上吃了喝了，中午又唱了歌
  '6-2': {
    title: 'Oh! My Mouth!',
    titleZh: '哦！我的嘴巴！',
    paragraphs: [
      [
        { en: 'Good morning! Mia is hungry.', zh: '早上好！Mia 饿了。' },
        { en: 'Her mouth can eat a big apple.', zh: '她的嘴巴能吃一个大苹果。' },
        { en: 'The apple is red and very good.', zh: '这个苹果又红又好吃。' },
        { en: 'Now Mia is thirsty too.', zh: '现在 Mia 也渴了。' },
        { en: 'Her mouth can drink cold milk.', zh: '她的嘴巴能喝凉牛奶。' },
        { en: 'The milk is white and nice.', zh: '牛奶又白又好。' },
      ],
      [
        { en: 'Mia can smell a big cake.', zh: 'Mia 能闻到一个大蛋糕。' },
        { en: 'The cake is on the table.', zh: '蛋糕在桌子上。' },
        { en: 'She wants to eat it now.', zh: '她现在就想吃它。' },
        { en: 'Mia can sing one happy song.', zh: 'Mia 能唱一首快乐的歌。' },
        { en: 'Her song is very, very nice.', zh: '她的歌非常非常好听。' },
        { en: 'So, what can your mouth do?', zh: '那么，你的嘴巴能做什么？' },
      ],
    ],
  },

  // 6-3 My Body Parts：Ben 只会用手，接不住球，最后学会用全身
  '6-3': {
    title: 'Clap Your Hands!',
    titleZh: '拍拍你的手！',
    paragraphs: [
      [
        { en: 'Ben has two arms and two legs.', zh: 'Ben 有两只胳膊和两条腿。' },
        { en: 'He has two hands and two feet.', zh: '他有两只手和两只脚。' },
        { en: 'Today he wants to play ball.', zh: '今天他想玩球。' },
        { en: 'The ball comes down from the tree.', zh: '球从树上掉下来。' },
        { en: 'Ben can not catch it.', zh: 'Ben 接不住它。' },
        { en: 'It goes under the chair.', zh: '它滚到椅子下面去了。' },
      ],
      [
        { en: 'Clap your hands and try again.', zh: '拍拍手，再试一次。' },
        { en: 'He tries one arm and one leg.', zh: '他试着用一只胳膊和一条腿。' },
        { en: 'Now Ben can run and jump.', zh: '现在 Ben 会跑，也会跳。' },
        { en: 'His two hands take the ball.', zh: '他的两只手接住了球。' },
        { en: 'Ben is very happy now.', zh: 'Ben 现在非常开心。' },
        { en: 'Hello, hand! Hello, foot!', zh: '你好呀，手！你好呀，脚！' },
      ],
    ],
  },

  // 6-4 What Can You Do：公园里 Anna 遇到一只什么都会的青蛙
  '6-4': {
    title: 'What Can You Do?',
    titleZh: '你会做什么？',
    paragraphs: [
      [
        { en: 'Anna goes to the park today.', zh: 'Anna 今天去公园。' },
        { en: 'A big frog sits down on the grass.', zh: '一只大青蛙坐在草地上。' },
        { en: 'Hello! What can you do?', zh: '你好！你会做什么？' },
        { en: 'I can jump like this.', zh: '我可以这样跳。' },
        { en: 'I can run very fast.', zh: '我可以跑得很快。' },
        { en: 'I can walk like you.', zh: '我可以像你一样走。' },
      ],
      [
        { en: 'Can you walk like a lion?', zh: '你能像狮子一样走吗？' },
        { en: 'No! I can not do that.', zh: '不！我做不到那个。' },
        { en: 'Then we can run and jump!', zh: '那我们就一起跑和跳吧！' },
        { en: 'Anna jumps over the little frog.', zh: 'Anna 跳过了那只小青蛙。' },
        { en: 'The frog is very happy now.', zh: '青蛙现在非常开心。' },
        { en: 'I can run! I can jump! I can walk!', zh: '我会跑！我会跳！我会走！' },
      ],
    ],
  },

  // 6-5 Magic Hands：下雨天出不了门，Emma 用手做了一张卡片送给妈妈
  '6-5': {
    title: 'My Hands Can Do',
    titleZh: '我的手会做这些',
    paragraphs: [
      [
        { en: 'It is raining in the afternoon.', zh: '下午在下雨。' },
        { en: 'Emma can not play out today.', zh: 'Emma 今天不能出去玩。' },
        { en: 'So she uses her two hands.', zh: '于是她用起两只手来。' },
        { en: 'She can paint a big red flower.', zh: '她会涂一朵大红花。' },
        { en: 'She can draw one little cat.', zh: '她会画一只小猫。' },
        { en: 'She can write her name too.', zh: '她还会写自己的名字。' },
      ],
      [
        { en: 'Now she has one very nice card.', zh: '现在她有了一张很漂亮的卡片。' },
        { en: 'She gives it to her mom.', zh: '她把卡片送给妈妈。' },
        { en: 'Mom opens it and smiles.', zh: '妈妈打开卡片，笑了。' },
        { en: 'Oh! This card is very nice.', zh: '哦！这张卡片真漂亮。' },
        { en: 'Now Emma wants to make more cards.', zh: '现在 Emma 还想做更多卡片。' },
        { en: 'What can your hands do?', zh: '你的手会做什么呢？' },
      ],
    ],
  },

  // 6-6 Quiz：复习课 —— 跳、跑、转、弯腰，外加摸一摸五官说一说
  '6-6': {
    title: 'Happy Game Day',
    titleZh: '快乐游戏日',
    paragraphs: [
      [
        { en: 'Today is a good day for a game.', zh: '今天很适合玩游戏。' },
        { en: 'Lily asks me, jump or run?', zh: 'Lily 问我：跳还是跑？' },
        { en: 'I say, jump! I can jump like this.', zh: '我说：跳！我可以这样跳。' },
        { en: 'Now Lily says, spin, bend and sing.', zh: '现在 Lily 说：转、转圈、弯腰、唱歌。' },
        { en: 'I spin and bend with her.', zh: '我和她一起转圈、弯腰。' },
        { en: 'We are hot and very happy.', zh: '我们很热，也非常开心。' },
      ],
      [
        { en: 'Is it hot or cold today?', zh: '今天是热还是冷？' },
        { en: 'It is hot! I drink my milk.', zh: '很热！我喝了牛奶。' },
        { en: 'We can run and jump all day.', zh: '我们可以跑和跳一整天。' },
        { en: 'Then we touch our nose and ear.', zh: '然后我们摸摸鼻子和耳朵。' },
        { en: 'Touch your hands and your feet!', zh: '摸摸你的手和你的脚！' },
        { en: 'I can eat, sing, run and jump!', zh: '我会吃、会唱、会跑、会跳！' },
      ],
    ],
  },

  // 6-7 Let's Dance：Sam 一个人闷闷的，Jack 拉他跳舞
  '6-7': {
    title: "Let's Dance",
    titleZh: '一起来跳舞',
    paragraphs: [
      [
        { en: 'Sam sits in his room and is sad.', zh: 'Sam 坐在房间里，很难过。' },
        { en: 'Today is a cold and long day.', zh: '今天又冷又漫长。' },
        { en: 'He can not go out to play.', zh: '他不能出去玩。' },
        { en: 'Then a friend sings a happy song.', zh: '这时一个朋友唱起了快乐的歌。' },
        { en: 'It is his friend Jack.', zh: '那是他的朋友 Jack。' },
        { en: 'Jack can dance very well.', zh: 'Jack 跳舞跳得很好。' },
      ],
      [
        { en: "Come on, Sam! Let's dance!", zh: '来吧，Sam！我们跳舞吧！' },
        { en: "Let's bend. Let's spin. Let's dance!", zh: '我们弯弯腰。我们转个圈。我们跳舞吧！' },
        { en: 'Sam can bend and spin now.', zh: 'Sam 现在会弯腰，也会转圈。' },
        { en: 'He can dance like a bird.', zh: '他可以像小鸟一样跳舞。' },
        { en: 'They dance in the room all day.', zh: '他们在房间里跳了一整天。' },
        { en: 'Now Sam is very happy!', zh: '现在 Sam 非常开心！' },
      ],
    ],
  },

  // 6-8 All About Me：Kate 认识了新朋友，互相认识自己
  '6-8': {
    title: 'All About Me',
    titleZh: '关于我自己',
    paragraphs: [
      [
        { en: 'This is me. I am a boy.', zh: '这就是我。我是一个男孩。' },
        { en: 'I have one eye and one nose.', zh: '我有一只眼睛、一个鼻子。' },
        { en: 'I have two hands and two feet.', zh: '我有两只手和两只脚。' },
        { en: 'Hello! My name is Kate.', zh: '你好！我叫 Kate。' },
        { en: 'Are you a boy or a girl?', zh: '你是男孩还是女孩？' },
        { en: 'I am a girl. I like apples.', zh: '我是女孩。我喜欢苹果。' },
      ],
      [
        { en: 'Kate has big eyes and short hair.', zh: 'Kate 有大眼睛和短头发。' },
        { en: 'This one hand can clap and wave.', zh: '这一只手能拍手，也能招手。' },
        { en: 'This one foot can run and jump.', zh: '这一只脚能跑，也能跳。' },
        { en: 'How old are you?', zh: '你几岁了？' },
        { en: 'I am six! Are you happy?', zh: '我六岁！你开心吗？' },
        { en: 'Yes! Now we are good friends.', zh: '开心！现在我们是好朋友了。' },
      ],
    ],
  },
}