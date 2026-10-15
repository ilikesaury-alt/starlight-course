// Unit 2 Animals 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 两个容易踩的坑（写的时候先记住）：
//   1. 本课词表要求「原形真出现」，写 ducks / dolphins / counts 不算数，要写 duck / dolphin / count；
//   2. 词表里没有的派生词一律不能碰：-ly 副词（slowly）、first、question、moo、possessive（dog's）。
import type { ReadingPassage } from './index'

export const unit2: Record<string, ReadingPassage> = {
  '2-1': {
    title: 'Five New Pets',
    titleZh: '五个新宠物',
    paragraphs: [
      [
        { en: 'Today is a big day for Lily.', zh: '今天是 Lily 的大日子。' },
        { en: "Mom, it's a new pet!", zh: '妈妈，这是一只新宠物！' },
        { en: 'It is a small dog.', zh: '它是一只小狗。' },
        { en: 'The dog is so cute.', zh: '这只狗真可爱。' },
        { en: 'It runs to Lily and stops.', zh: '它跑到 Lily 身边停下来。' },
        { en: 'The cat sits on the bed and looks.', zh: '猫坐在床上看着它。' },
      ],
      [
        { en: 'Which pet do you like, Lily?', zh: 'Lily，你喜欢哪只宠物？' },
        { en: 'I like the dog best of all.', zh: '我最喜欢那只狗。' },
        { en: 'Now Lily opens a big box.', zh: '现在 Lily 打开一个大盒子。' },
        { en: 'A small white rabbit comes out.', zh: '一只白色小兔子钻了出来。' },
        { en: 'Then a little hamster runs out too.', zh: '接着一只小仓鼠也跑了出来。' },
        { en: 'Four pets! Lily can not wait for tomorrow.', zh: '四只宠物！Lily 等不及明天了。' },
      ],
    ],
  },
  '2-2': {
    title: 'A Day at the Farm',
    titleZh: '农场上的一天',
    paragraphs: [
      [
        { en: 'Tom and Dad go to a big farm today.', zh: '今天 Tom 和爸爸去一个大农场。' },
        { en: 'They see a big cow in the yard.', zh: '他们在院子里看见一头大奶牛。' },
        { en: 'The cow is big and white.', zh: '这头奶牛又大又白。' },
        { en: 'Tom asks, what does the cow say?', zh: 'Tom 问，奶牛怎么叫呢？' },
        { en: 'The cow only looks at Tom.', zh: '奶牛只是看着 Tom。' },
        { en: 'Dad laughs. It is a funny animal.', zh: '爸爸笑了。这真是一只好玩的动物。' },
      ],
      [
        { en: 'Now a big pink pig comes to them.', zh: '这时一头粉色大猪走到他们身边。' },
        { en: 'Tom gives the pig a green apple.', zh: 'Tom 给猪一个青苹果。' },
        { en: 'One duck sits near the water.', zh: '一只鸭子坐在水边。' },
        { en: 'Five more ducks swim in the water.', zh: '又有五只鸭子在水中游。' },
        { en: 'A yellow chicken sits on the road.', zh: '一只黄色的鸡坐在路上。' },
        { en: 'Tom wants to see them tomorrow.', zh: 'Tom 想明天再来看它们。' },
      ],
    ],
  },
  '2-3': {
    title: "Let's Go to the Zoo",
    titleZh: '我们去动物园',
    paragraphs: [
      [
        { en: 'Emma and her dad go to the zoo.', zh: 'Emma 和爸爸去动物园。' },
        { en: 'It is a big and happy day.', zh: '这是个又大又开心的日子。' },
        { en: 'They see a black and white panda.', zh: '他们看见一只黑白熊猫。' },
        { en: 'The panda eats and does not look at them.', zh: '熊猫在吃东西，不看他们。' },
        { en: 'A brown monkey climbs the tall tree.', zh: '一只棕色猴子爬上高高的树。' },
        { en: 'It comes down and waves at Emma.', zh: '它爬下来，向 Emma 挥手。' },
      ],
      [
        { en: 'Then a big bear stands up.', zh: '这时一只大熊站了起来。' },
        { en: 'The bear is very loud, so Emma laughs.', zh: '这只熊声音很响，Emma 笑了。' },
        { en: 'She says, "Hello, parrot! Are you happy?"', zh: '她说：「你好，鹦鹉！你开心吗？」' },
        { en: 'The parrot says, "Hello, Emma! Hello, Emma!"', zh: '鹦鹉说：「你好，Emma！你好，Emma！」' },
        { en: 'Emma laughs and sings to the parrot.', zh: 'Emma 笑着对鹦鹉唱歌。' },
        { en: 'She wants to come here again.', zh: '她还想再来这里。' },
      ],
    ],
  },
  '2-4': {
    title: 'A Day in the Ocean',
    titleZh: '海洋里的一天',
    paragraphs: [
      [
        { en: 'Sam and Mia take a boat to the ocean.', zh: 'Sam 和 Mia 坐船去海洋。' },
        { en: 'The water is blue and warm.', zh: '海水又蓝又暖。' },
        { en: 'Sam sees a small green turtle.', zh: 'Sam 看见一只绿色的小海龟。' },
        { en: 'The turtle can not swim fast.', zh: '海龟游得不快。' },
        { en: '"Swim like a turtle," says Sam.', zh: 'Sam 说：「像海龟一样游。」' },
        { en: 'Mia sees a dolphin near the boat.', zh: 'Mia 在船边看见一只海豚。' },
        { en: 'The dolphin jumps and plays with her.', zh: '海豚跳出水面，和她玩。' },
      ],
      [
        { en: 'Then they see one little seahorse.', zh: '接着他们看见一只小海马。' },
        { en: 'It is very small and very still.', zh: '它很小，也一动不动。' },
        { en: 'Many fish swim near their boat.', zh: '许多鱼在他们的船边游。' },
        { en: 'Mia counts the fish: one, two, three.', zh: 'Mia 数着鱼：一、二、三。' },
        { en: "Mia says, let's come here tomorrow.", zh: 'Mia 说：「我们明天再来这里吧。」' },
      ],
    ],
  },
  '2-5': {
    title: 'Bugs! Bugs! Bugs!',
    titleZh: '虫虫虫',
    paragraphs: [
      [
        { en: 'Kate sits in the yard on a warm day.', zh: '一个暖和的日子，Kate 坐在院子里。' },
        { en: 'She finds a green caterpillar on a leaf.', zh: '她在一片叶子上发现一条绿色的毛毛虫。' },
        { en: 'It is small, but it eats and eats.', zh: '它很小，却一直在吃呀吃。' },
        { en: 'Kate watches it every day.', zh: 'Kate 每天都看着它。' },
        { en: 'One day it is missing.', zh: '有一天，它不见了。' },
        { en: 'Kate looks behind the big green leaf.', zh: 'Kate 往那片大绿叶子后面看。' },
      ],
      [
        { en: 'Now a butterfly is there!', zh: '现在那儿有一只蝴蝶！' },
        { en: 'The caterpillar became a butterfly.', zh: '毛毛虫变成了一只蝴蝶。' },
        { en: 'Kate says, "What a pretty bug!"', zh: 'Kate 说：「多可爱的一只虫子！」' },
        { en: 'Its colors are pink and blue.', zh: '它的颜色是粉色和蓝色的。' },
        { en: 'Then a bee comes to the flower.', zh: '接着一只蜜蜂飞到花上。' },
        { en: 'Now a spider comes too. Oh no!', zh: '这时一只蜘蛛也来了。哎呀！' },
      ],
    ],
  },
  '2-6': {
    title: 'The Animal Quiz',
    titleZh: '动物小测验',
    paragraphs: [
      [
        { en: 'Mom gives Leo a book about animals.', zh: '妈妈给了 Leo 一本动物的书。' },
        { en: 'Now he must answer every one.', zh: '现在他每一题都得回答。' },
        { en: '"What is this animal?" asks Mom.', zh: '妈妈问：「这是什么动物？」' },
        { en: 'It is a dog. Leo knows the answer.', zh: '是一只狗。Leo 知道答案。' },
        { en: '"How many animals do you see?"', zh: '「你看见几只动物？」' },
        { en: 'Leo must count them all.', zh: 'Leo 得把它们全数出来。' },
      ],
      [
        { en: 'One cat, two ducks, and one pig.', zh: '一只猫、两只鸭子、一头猪。' },
        { en: '"And what lives in the ocean?"', zh: '「还有谁住在海洋里？」' },
        { en: 'Leo says a dolphin and a fish.', zh: 'Leo 说是一只海豚和一条鱼。' },
        { en: '"Good boy! Which pet is best?"', zh: '「好孩子！哪只宠物最好？」' },
        { en: 'Leo says the rabbit. It is so cute.', zh: 'Leo 说是兔子。它真可爱。' },
        { en: 'Mom laughs and claps for him.', zh: '妈妈笑着为他鼓掌。' },
      ],
    ],
  },
  '2-7': {
    title: 'Add It Up',
    titleZh: '加起来',
    paragraphs: [
      [
        { en: 'Anna and Ben sit on the grass.', zh: 'Anna 和 Ben 坐在草地上。' },
        { en: 'A dog comes and looks at them.', zh: '一只狗走过来看着他们。' },
        { en: '"How many legs does a dog have?"', zh: '「狗有几条腿？」' },
        { en: 'Ben says four, and points to one leg.', zh: 'Ben 说着，并指出一条腿。' },
        { en: 'Then a cat comes to the grass.', zh: '接着一只猫来到草地上。' },
        { en: 'The cat has 4 legs too.', zh: '这只猫也有 4 条腿。' },
      ],
      [
        { en: '"4 plus 4 equals 8," says Ben.', zh: 'Ben 说：「4 加 4 等于 8。」' },
        { en: '"How many legs do they have?"', zh: '「它们一共有几条腿？」' },
        { en: 'The dog and the cat have 8 legs altogether.', zh: '狗和猫总共有 8 条腿。' },
        { en: 'Anna can do the addition fast.', zh: 'Anna 很快就能做出这道加法。' },
        { en: 'Ben writes it in his book.', zh: 'Ben 把它写进本子里。' },
        { en: 'Now Ben wants to count more.', zh: '现在 Ben 还想数更多。' },
      ],
    ],
  },
  '2-8': {
    title: 'What Comes Next',
    titleZh: '下一个是什么',
    paragraphs: [
      [
        { en: 'Jack has five new toys.', zh: 'Jack 有五个新玩具。' },
        { en: 'He says, "Cat, come! Dog, come!"', zh: '他说：「猫，来！狗，来！」' },
        { en: 'So the toys are cat, dog, cat, dog.', zh: '于是玩具是：猫、狗、猫、狗。' },
        { en: '"What comes next?" asks Jack.', zh: 'Jack 问：「下一个是什么？」' },
        { en: 'The cat comes next. Jack is happy.', zh: '下一个是猫。Jack 很开心。' },
        { en: '"Yes! It is a pattern."', zh: '「对！这是一个规律。」' },
      ],
      [
        { en: 'But one toy is missing.', zh: '可是有一个玩具不见了。' },
        { en: 'It must be the dog, Jack thinks.', zh: 'Jack 想，一定是那只狗。' },
        { en: 'He looks in the box.', zh: '他往盒子里看。' },
        { en: 'The little dog comes out of the box.', zh: '小狗从盒子里钻了出来。' },
        { en: '"Now the pattern is here!" says Jack.', zh: 'Jack 说：「现在规律完整啦！」' },
        { en: '"We can finish it. What comes next?"', zh: '「我们可以完成了。下一个是什么？」' },
      ],
    ],
  },
}
