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
//
// 2026-11-02 文体改写：8 篇全部重写为「一个地点 = 一个小故事」。
//   - 每个地点都写出了自己的气味与声音（猴子叫、海浪拍岸、水声、碰碰车砰砰）；
//   - 用对话推动情节、用「重复变奏」收尾（帽子 / 水声 / hello 的回声）；
//   - 段落 = 叙事节拍（出门 → 出事 → 解决）。
//   - 多词词条的口径已复核：单测「本课词 100%」是**按空格拆开后做子串匹配**
//     （不是 token 集合比较），且 sea / world / umbrella / tennis / merry / round /
//     bumper / ferris / wheel 这些片段**都在 BASE_WORDS 里**（baseVocab.ts NOUNS/ADJECTIVES），
//     所以这些词条现在**可以如实写出来**，不需要再牺牲内容去绕开它们。
import type { ReadingPassage } from './index'

export const unit11: Record<string, ReadingPassage> = {
  '11-1': {
    title: 'Where Do We Go?',
    titleZh: '我们去哪儿玩？',
    paragraphs: [
      [
        { en: 'This morning I want to go and play.', zh: '今天早上，我想出去玩。' },
        { en: '"I want to go to the zoo!" says Leo.', zh: '“我要去动物园！”Leo 说。' },
        { en: '"I want to go to Sea World," says Mia.', zh: '“我要去海洋世界，”Mia 说。' },
        { en: '"I want to go to the beach!" says Sam.', zh: '“我要去海滩！”Sam 说。' },
      ],
      [
        { en: 'We ask Mom: "Where do we go?"', zh: '我们问妈妈：“我们去哪儿呀？”' },
        { en: 'Mom laughs. "We can\'t go to all three."', zh: '妈妈笑了。“三个地方今天可去不完哦。”' },
        { en: 'We take a bus to the zoo.', zh: '我们坐公交车去了动物园。' },
        { en: 'I see an elephant. The monkeys call.', zh: '我看见一头大象，猴子们叫得正欢。' },
      ],
      [
        { en: '"Now we go to the beach," says Sam.', zh: '“现在我们去海滩吧，”Sam 说。' },
        { en: '"I want to go to Sea World!" says Mia.', zh: '“我还想去海洋世界！”Mia 说。' },
        { en: 'Mom says, "One place each day. Every day is fun."', zh: '妈妈说：“一天去一个地方，每天都好玩。”' },
      ],
    ],
  },
  '11-2': {
    title: 'A Day at the Zoo',
    titleZh: '动物园的一天',
    paragraphs: [
      [
        { en: 'We go to the zoo. I say hello to every animal.', zh: '我们去了动物园，我跟每只动物打招呼。' },
        { en: 'An elephant is big and gray.', zh: '一头大象又大又灰。' },
        { en: 'It takes my hat up with its long nose.', zh: '它用长长的鼻子把我的帽子卷走了。' },
        { en: '"I can\'t get it down!" I say.', zh: '“我拿不下来了！”我说。' },
      ],
      [
        { en: 'Then a tall giraffe walks over.', zh: '这时一只高高的长颈鹿走了过来。' },
        { en: 'It puts its head down and gets my hat.', zh: '它低下头，把我的帽子叼了下来。' },
        { en: 'Down comes my hat! We laugh and clap.', zh: '帽子落下来啦！我们又笑又拍手。' },
        { en: 'A deer stands behind the grass.', zh: '草丛后面站着一只鹿，静静地看着我们。' },
        { en: 'Two zebras run fast. They are so funny!', zh: '两只斑马跑得飞快，样子太逗了！' },
      ],
      [
        { en: '"Hello!" I say to all of them.', zh: '“你好呀！”我向它们每一个问好。' },
        { en: 'The elephant calls loud. I love this place.', zh: '大象叫得好大声呀。我喜欢这个地方。' },
      ],
    ],
  },
  '11-3': {
    title: 'Down in the Water',
    titleZh: '到水下去',
    paragraphs: [
      [
        { en: 'We go in. The door is big and cold.', zh: '我们走进去，那扇门又大又凉。' },
        { en: 'I hear the water. It is loud.', zh: '我听见水声，这里好响。' },
        { en: 'An octopus sits in the water.', zh: '一只章鱼坐在水里。' },
        { en: 'It has eight arms and waves at me.', zh: '它有八条长长的手臂，朝我挥手。' },
      ],
      [
        { en: 'Then a pink jellyfish goes up and down.', zh: '接着一只粉粉的水母飘上飘下。' },
        { en: 'It looks like a flower.', zh: '它看起来像一朵花。' },
        { en: 'Then I see a big shark in the water.', zh: '然后我看见一条大鲨鱼在水里。' },
        { en: 'It is long and gray. Dad holds my hand.', zh: '它又长又灰，爸爸牵着我的手。' },
      ],
      [
        { en: '"Will it eat me?" I ask Dad.', zh: '“它会吃掉我吗？”我问爸爸。' },
        { en: 'Then a sea lion jumps up and plays.', zh: '这时一只海狮蹦得高高的，在跟我玩。' },
        { en: 'Dad laughs. "It is a friend!"', zh: '爸爸笑了。“它是好朋友呀！”' },
        { en: 'The shark swims away. The water is still loud.', zh: '鲨鱼游走了，水声还是那么响。' },
      ],
    ],
  },
  '11-4': {
    title: 'A Day at the Beach',
    titleZh: '海滩的一天',
    paragraphs: [
      [
        { en: 'We go to the beach. The sun is hot.', zh: '我们去海滩，太阳晒得人发烫。' },
        { en: 'My dad puts up a sun umbrella.', zh: '爸爸撑起一把太阳伞。' },
        { en: 'I sit under it and hear the waves.', zh: '我坐在伞下，听海浪的声音。' },
        { en: 'The sand is warm and soft.', zh: '沙子又暖又软。' },
      ],
      [
        { en: 'I make a sand house with a door.', zh: '我用沙子堆了一间小房子，还给它开了门。' },
        { en: 'Then a big wave comes and takes it.', zh: '这时一个大浪扑过来，把房子带走了。' },
        { en: '"Oh no!" I say. My eyes are wet.', zh: '“呜哇！”我说，眼泪都要掉下来了。' },
      ],
      [
        { en: 'Dad says, "The sea gives and takes."', zh: '爸爸说：“海会给你东西，也会拿走东西。”' },
        { en: 'I look down. I find a shell and a pink starfish.', zh: '我低头一看，捡到一个贝壳，还有一只粉粉的海星。' },
        { en: 'I put them in my box for Mom.', zh: '我把它们放进我的小盒子，带给妈妈。' },
        { en: 'The sun goes down. The waves still sing.', zh: '太阳落下去了，海浪还在轻轻地唱。' },
      ],
    ],
  },
  '11-5': {
    title: 'Balls with My Friends',
    titleZh: '和朋友玩球',
    paragraphs: [
      [
        { en: 'After school I go out to play.', zh: '放学以后，我出去玩。' },
        { en: 'My friends are here with a ball.', zh: '我的朋友们拿着球在这儿。' },
        { en: '"Let\'s play basketball!" says Jack.', zh: '“我们打篮球吧！”Jack 说。' },
        { en: 'I throw the ball. It goes in!', zh: '我把球一扔，球进了！' },
        { en: 'We run and laugh. The sky is blue.', zh: '我们跑呀笑呀，天是蓝蓝的。' },
      ],
      [
        { en: 'Then we play football on the grass.', zh: '接着我们在草地上踢足球。' },
        { en: 'I kick the ball to Leo. He kicks it back.', zh: '我把球踢给 Leo，他一脚又踢回来。' },
        { en: 'The ball goes up high. We can\'t get it.', zh: '球飞得高高的，我们够不着。' },
        { en: 'Jack climbs up and gets it down.', zh: 'Jack 爬上去，把球拿了下来。' },
      ],
      [
        { en: 'Now we play table tennis.', zh: '现在我们打乒乓球。' },
        { en: 'Leo is thirsty. I give him my water.', zh: 'Leo 口渴了，我把水分给他。' },
        { en: 'We smile. We want to play again tomorrow!', zh: '我们笑着，还想明天再来玩！' },
      ],
    ],
  },
  '11-6': {
    title: 'My Big Picture',
    titleZh: '我的大画',
    paragraphs: [
      [
        { en: 'Mom says, "Let\'s play a game today."', zh: '妈妈说：“今天我们来玩个问答游戏吧。”' },
        { en: 'I draw a big picture.', zh: '我画了一张大大的画。' },
        { en: '"Where do you want to go?" Mom asks.', zh: '“你想去哪里呀？”妈妈问。' },
        { en: '"I want to go to the zoo," I say.', zh: '“我想去动物园，”我说。' },
        { en: 'I draw an elephant. It is big.', zh: '我画了一头大象，它好大。' },
      ],
      [
        { en: '"What do you like to play?" Mom asks.', zh: '“你喜欢玩什么呀？”妈妈问。' },
        { en: '"I like playing basketball," I say.', zh: '“我喜欢打篮球，”我说。' },
        { en: 'I draw a big ball and two boys.', zh: '我画了一个大球和两个男孩。' },
        { en: '"Where do you want to go now?" Mom asks.', zh: '“现在你想去哪里呀？”妈妈问。' },
        { en: '"I want to go to the beach," I say.', zh: '“我想去海滩，”我说。' },
      ],
      [
        { en: 'I draw blue water and a big octopus.', zh: '我画了蓝蓝的海水，还有一只大章鱼。' },
        { en: 'Mom claps. "You know the places!"', zh: '妈妈拍拍手。“你都知道啦！”' },
      ],
    ],
  },
  '11-7': {
    title: 'A Day at the Park',
    titleZh: '公园里的一天',
    paragraphs: [
      [
        { en: 'Today Mia and her dad go to the park.', zh: '今天 Mia 和爸爸去了公园。' },
        { en: 'There are many rides. Mia is so happy.', zh: '园子里有好多游乐设施，Mia 开心极了。' },
        { en: '"I want to ride the merry-go-round!" says Mia.', zh: '“我想坐旋转木马！”Mia 说。' },
        { en: 'It goes round and round. Her hat flies off!', zh: '转呀转呀，她的帽子飞了出去！' },
      ],
      [
        { en: '"I want my hat back!" Mia cries.', zh: '“我要我的帽子！”Mia 喊起来。' },
        { en: 'Dad says, "We look after the ride."', zh: '爸爸说：“我们玩完再找找看。”' },
        { en: 'They ride the bumper cars. Bang! Bang!', zh: '他们去坐碰碰车。砰！砰！' },
        { en: 'The cars go bump, bump, bump.', zh: '小车一下一下撞来撞去。' },
      ],
      [
        { en: 'Then they ride the Ferris wheel.', zh: '然后他们坐上了摩天轮。' },
        { en: 'It goes up high. Mia looks down.', zh: '摩天轮升得高高的，Mia 往下看。' },
        { en: '"There! I see my hat near the tree!"', zh: '“看！我的帽子就在那棵树旁边！”' },
        { en: 'Dad gets it. Mia smiles and holds it.', zh: '爸爸拿到帽子，Mia 笑着把它抱在怀里。' },
      ],
    ],
  },
  '11-8': {
    title: 'My Best Day',
    titleZh: '我最棒的一天',
    paragraphs: [
      [
        { en: 'This morning I go to the zoo with Dad.', zh: '今天早上我和爸爸去了动物园。' },
        { en: 'An elephant eats green grass.', zh: '一头大象在吃青草。' },
        { en: 'It is big and kind. I say hello.', zh: '它又大又和气。我跟它说声你好。' },
        { en: 'It waves back to me.', zh: '它也朝我挥了挥手。' },
      ],
      [
        { en: 'After that I go to the water.', zh: '后来我又去了水边。' },
        { en: 'A shark comes. It is long and gray.', zh: '一条鲨鱼游过来，又长又灰。' },
        { en: 'I watch it swim and swim.', zh: '我看着它游啊游。' },
      ],
      [
        { en: 'In the afternoon I go to the beach.', zh: '下午我去了海滩。' },
        { en: 'I play table tennis on the sand.', zh: '我在沙滩上打乒乓球。' },
        { en: 'Then I find a starfish in the sand.', zh: '然后我在沙子里找到一只海星。' },
        { en: 'I put it in my box for Mom.', zh: '我把它放进小盒子，带给妈妈。' },
        { en: 'Tomorrow I want to go again.', zh: '明天我还想再来一次。' },
      ],
    ],
  },
}
