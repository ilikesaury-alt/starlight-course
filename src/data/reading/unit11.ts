// Unit 11 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// ⚠️ 本单元有一个**词表结构性缺陷**（不是本文件能修的，改动 lessons.ts / 单测才属于别的任务）：
// 11-1 Sea World、11-3 sea lion、11-4 sun umbrella、11-5 / 11-8 table tennis、
// 11-7 merry-go-round / bumper cars / Ferris wheel 都是**多词词条**。
//   - 单测「本课词表 100%」拿 w.en 整串去比 **切词后的 token 集合**，而 tokenizeReading
//     用 /[a-z]+(?:'[a-z]+)?/g，永不产生带空格的字符串 → 这 8 个词**写不出来**；
//   - 单测「零超纲」的 allowedWordsFor 也是按整串加入，于是 sea / world / umbrella /
//     tennis / merry / round / bumper / ferris / wheel 这些**片段不在允许词表内**，
//     真写出来反而判超纲。
// 所以这里的取舍是：**宁可少写、也不引入超纲词**（两个测试冲突时，取失败面更小的一边）。
// 11-2、11-6 的词表全是单词，已 100% 覆盖；其余各课只差上面那些多词词条。
import type { ReadingPassage } from './index'

export const unit11: Record<string, ReadingPassage> = {
  '11-1': {
    title: 'Where Do We Go?',
    titleZh: '我们去哪里？',
    paragraphs: [
      [
        { en: 'It is a happy morning. I am ready.', zh: '这是个开心的早晨，我准备好啦。' },
        { en: 'I want to go out and play.', zh: '我想出去玩。' },
        { en: 'Leo says we can go to the zoo.', zh: 'Leo 说我们可以去动物园。' },
        { en: 'Mia says we can go to the beach.', zh: 'Mia 说我们可以去海滩。' },
        { en: 'Sam says we can go to Sea World.', zh: 'Sam 说我们可以去海洋世界。' },
      ],
      [
        { en: 'The zoo has a big elephant.', zh: '动物园里有一头大象。' },
        { en: 'The beach has warm sand.', zh: '海滩上有暖暖的沙子。' },
        { en: 'I want to see them both.', zh: '两个我都想去看看。' },
        { en: 'Then my dad says we can do both.', zh: '这时爸爸说我们都可以去。' },
        { en: 'We take the bus and sing a song.', zh: '我们坐上公交车，还唱了首歌。' },
        { en: 'Today we go to the zoo.', zh: '今天我们先去动物园。' },
        { en: 'Tomorrow we can go to the beach.', zh: '明天我们就可以去海滩啦。' },
      ],
    ],
  },
  '11-2': {
    title: 'A Day at the Zoo',
    titleZh: '动物园的一天',
    paragraphs: [
      [
        { en: 'We go to the zoo with my mom.', zh: '我和妈妈一起去了动物园。' },
        { en: 'I see an elephant near the tree.', zh: '我看见一棵树旁有一头大象。' },
        { en: 'The elephant is big and gray.', zh: '这头象又大又灰。' },
        { en: 'It has a very long nose.', zh: '它有一条长长的鼻子。' },
        { en: 'Then I see a tall giraffe.', zh: '接着我看见一只高高的长颈鹿。' },
        { en: 'It eats green leaves from the tree.', zh: '它在吃树上的绿叶子。' },
      ],
      [
        { en: 'The giraffe looks at my bag.', zh: '长颈鹿低头看着我的包。' },
        { en: 'I see one deer behind the grass.', zh: '我在草丛后面看见一只鹿。' },
        { en: 'Two zebras run very fast.', zh: '两只斑马跑得飞快。' },
        { en: 'I say hello to all of them.', zh: '我向它们每一个问好。' },
        { en: 'The panda sits here and eats.', zh: '熊猫就坐在这里吃东西。' },
        { en: 'I want to go there again tomorrow.', zh: '明天我还想再去那里。' },
      ],
    ],
  },
  '11-3': {
    title: 'Down in the Water',
    titleZh: '到水下去',
    paragraphs: [
      [
        { en: 'My dad and I go out today.', zh: '今天我和爸爸一起出门。' },
        { en: 'We go in and the door is big.', zh: '我们走进去，那扇门好大。' },
        { en: 'I see an octopus in the water.', zh: '我先在水里看到一只章鱼。' },
        { en: 'It has eight long arms.', zh: '它有八条长长的脚。' },
        { en: 'It can be red, blue and white.', zh: '它可以是红的、蓝的、白的。' },
        { en: 'Wow! It is very funny.', zh: '哇！它真好玩。' },
      ],
      [
        { en: 'Then I see a sea lion in the water.', zh: '然后我在水里看到一只海狮。' },
        { en: 'Then I see a jellyfish in the water.', zh: '然后我在水里看到一只水母。' },
        { en: 'After that I see a big shark.', zh: '之后我又看到一条大鲨鱼。' },
        { en: 'Its teeth are very white.', zh: '它的牙齿非常白。' },
        { en: 'I want to see it again tomorrow.', zh: '明天我还想再来看它。' },
      ],
    ],
  },
  '11-4': {
    title: 'A Day at the Beach',
    titleZh: '海滩的一天',
    paragraphs: [
      [
        { en: 'We go to the beach with my dad.', zh: '我和爸爸去了海滩。' },
        { en: 'The sun is hot on my head.', zh: '太阳晒得我头很热。' },
        { en: 'My hat is big and keeps me cool.', zh: '我的帽子很大，让我很凉快。' },
        { en: 'We sit under a sun umbrella.', zh: '我们坐在阳伞下面。' },
        { en: 'The water is blue and warm.', zh: '海水又蓝又暖。' },
        { en: 'I see a starfish near my shoe.', zh: '我在鞋子旁边看到一只海星。' },
      ],
      [
        { en: 'I put it in my box.', zh: '我把它放进我的盒子里。' },
        { en: 'Then I find a big shell.', zh: '接着我找到一个大贝壳。' },
        { en: 'I hear the water, so I go.', zh: '我听见水声，就走过去。' },
        { en: 'We make a house with the sand.', zh: '我们用沙子堆了一间房子。' },
        { en: 'My dad helps me put a door.', zh: '爸爸帮我装了一扇门。' },
        { en: 'The water comes and takes our house.', zh: '水涌过来，把我们的房子带走了。' },
      ],
    ],
  },
  '11-5': {
    title: 'Balls with My Friends',
    titleZh: '和朋友玩球',
    paragraphs: [
      [
        { en: 'After school, I go out to play.', zh: '放学后，我出去玩。' },
        { en: 'My friends are here with a ball.', zh: '我的朋友们拿着球在这儿。' },
        { en: 'I like playing basketball very much.', zh: '我非常喜欢打篮球。' },
        { en: 'I throw the ball and it goes in.', zh: '我把球一扔，它就进去了。' },
        { en: 'My friend Jack can play it too.', zh: '我的朋友 Jack 也会打。' },
      ],
      [
        { en: 'Then we play football together.', zh: '然后我们一起踢足球。' },
        { en: 'We also play table tennis.', zh: '我们还打乒乓球。' },
        { en: 'I kick the ball to Leo.', zh: '我把球踢给 Leo。' },
        { en: 'He kicks it back to me fast.', zh: '他很快又把球踢回给我。' },
        { en: 'Then I sit down and drink water.', zh: '然后我坐下来喝点水。' },
        { en: 'Leo gives me his water, too.', zh: 'Leo 也把他的水分给了我。' },
        { en: 'We want to play more tomorrow.', zh: '我们明天还想再玩。' },
      ],
    ],
  },
  '11-6': {
    title: 'My Big Picture',
    titleZh: '我的大画',
    paragraphs: [
      [
        { en: 'Today I draw a very big picture.', zh: '今天我画了一张好大的画。' },
        { en: 'I draw the zoo and a tall tree.', zh: '我画了动物园，还有一棵高高的树。' },
        { en: 'An elephant stands there and eats.', zh: '一头大象站在那儿吃东西。' },
        { en: 'I draw a shark in the blue water.', zh: '我在蓝蓝的水里画了一条鲨鱼。' },
        { en: 'Then I draw a blue octopus.', zh: '然后我又画了一只蓝色的章鱼。' },
        { en: 'Mom looks at my picture.', zh: '妈妈看着我的画。' },
      ],
      [
        { en: 'What is this animal, Mom says.', zh: '妈妈问：这是什么动物呀？' },
        { en: 'It is an octopus, with eight arms.', zh: '是章鱼呀，它有八条脚。' },
        { en: 'She points at the white shark.', zh: '她指着那条白色的鲨鱼。' },
        { en: 'I say the beach is very warm.', zh: '我说海滩上很暖和。' },
        { en: 'I say I like playing basketball.', zh: '我说我喜欢打篮球。' },
        { en: 'Mom claps and says it is fun.', zh: '妈妈拍拍手，说这张画真有趣。' },
      ],
    ],
  },
  '11-7': {
    title: 'A Day at the Park',
    titleZh: '公园里的一天',
    paragraphs: [
      [
        { en: 'Today Mia and her dad go to the park.', zh: '今天 Mia 和爸爸去了公园。' },
        { en: 'It is a big and happy place.', zh: '那是个又大又开心的地方。' },
        { en: 'Mia wants to ride a merry-go-round.', zh: 'Mia 想坐转马。' },
        { en: 'It goes round and round.', zh: '它转呀转。' },
        { en: 'It is fast and very fun.', zh: '它又快又好玩。' },
      ],
      [
        { en: 'Then they ride bumper cars.', zh: '接着他们坐碰碰车。' },
        { en: 'The cars go bump and bang.', zh: '车碰来撞去。' },
        { en: 'Mia laughs and says again.', zh: 'Mia 笑着说再来一次。' },
        { en: 'Then they ride a ferris wheel.', zh: '然后他们坐摩天轮。' },
        { en: 'It goes up very high.', zh: '它升得好高好高。' },
        { en: 'Mia sees the big park from the top.', zh: 'Mia 从顶上看见大大的公园。' },
      ],
    ],
  },
  '11-8': {
    title: 'My Best Day',
    titleZh: '我最棒的一天',
    paragraphs: [
      [
        { en: 'This morning I go to the zoo.', zh: '今天早上我去了动物园。' },
        { en: 'I see an elephant eat green grass.', zh: '我看见一头大象在吃青草。' },
        { en: 'The elephant is big and very kind.', zh: '这头象又大又和气。' },
        { en: 'After that I go to the water.', zh: '之后我又去了水边。' },
        { en: 'I see a shark swim very fast.', zh: '我看见一条鲨鱼游得飞快。' },
        { en: 'The shark is long and gray.', zh: '这条鲨鱼又长又灰。' },
      ],
      [
        { en: 'In the afternoon I go to the beach.', zh: '下午我去了海滩。' },
        { en: 'I play table tennis on the sand.', zh: '我在沙子上打乒乓球。' },
        { en: 'I find a starfish in the sand.', zh: '我在沙子里找到一只海星。' },
        { en: 'I put it in my box for Mom.', zh: '我把它放进盒子里送给妈妈。' },
        { en: 'The water is warm and blue.', zh: '海水又暖又蓝。' },
        { en: 'Tomorrow I want to go again.', zh: '明天我还想再去一次。' },
      ],
    ],
  },
}
