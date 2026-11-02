// Unit 2 Animals 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 两个容易踩的坑（写的时候先记住）：
//   1. 本课词表要求「原形真出现」，写 ducks / dolphins / counts 不算数，要写 duck / dolphin / count；
//   2. 词表里没有的派生词一律不能碰：-ly 副词（slowly）、first、question、moo、possessive（dog's）。
//
// 2026-11-02 文体改写：8 篇全部重写成「一个连贯的小故事」——
//   动物当主角，性格靠动作体现（谁跑、谁躲、谁帮谁），用对话推动，
//   结尾把开头那句话变奏回来（Hello / What comes next）留一点余味；
//   2-7 用「四条腿 + 两条腿」把 addition 变成真正的加法情节。
//   写法照 docs/reading-passage-style.md 与 Unit 1 的 1-1 / 1-2 样板。
import type { ReadingPassage } from './index'

export const unit2: Record<string, ReadingPassage> = {
  '2-1': {
    title: 'Five New Pets',
    titleZh: '五个新宠物',
    paragraphs: [
      [
        { en: 'The cat sits in the yard and waits.', zh: '小猫咪坐在院子里，静静等着。' },
        { en: 'A small white dog comes and stops.', zh: '一只白色小狗走了过来，停下脚步。' },
        { en: '"Hello! I am a new pet," says the dog.', zh: '“你好！我是一只新来的小宠物。”小狗说。' },
        { en: '"Can I live with you?" asks Lily.', zh: '“你能和我们一起住吗？”Lily 问。' },
        { en: '"Yes! But I am very hungry," says the dog.', zh: '“好呀！不过我的肚子好饿。”小狗说。' },
      ],
      [
        { en: 'Lily puts her food down and opens a big box.', zh: 'Lily 放下食物，又打开一个大盒子。' },
        { en: 'A rabbit hops out and says, "Hello!"', zh: '一只小兔子蹦了出来：“你好！”' },
        { en: 'Then a little hamster runs out too.', zh: '接着，一只小仓鼠也跑了出来。' },
        { en: 'A bird flies down and eats with them.', zh: '一只小鸟飞下来，和大家一起吃。' },
        { en: '"Come and eat with me," says the cat.', zh: '“快来和我一起吃吧。”小猫说。' },
      ],
      [
        { en: 'Now the dog has four new friends.', zh: '现在小狗多了四个新朋友。' },
        { en: '"Hello, new pets! We are five pets now."', zh: '“你好呀，新伙伴们！我们现在有五只宠物啦。”' },
      ],
    ],
  },
  '2-2': {
    title: 'A Day at the Farm',
    titleZh: '农场里的一天',
    paragraphs: [
      [
        { en: 'A little duck walks on the farm today.', zh: '今天，小鸭子一个人在农场上走着。' },
        { en: 'She can not find her family.', zh: '它找不到自己的家人了。' },
        { en: '"Hello, duck! Where is your family?" asks the cow.', zh: '“你好呀，小鸭子！你的家人在哪儿？”奶牛问。' },
        { en: '"I do not know," says the duck.', zh: '“我不知道……”小鸭子说。' },
        { en: 'The big pig does not help. It eats an apple.', zh: '大猪也帮不上忙，它正忙着啃苹果。' },
      ],
      [
        { en: 'Then a white chicken comes to the duck.', zh: '这时，一只白母鸡走到小鸭子身边。' },
        { en: '"I saw them near the old tree," says the chicken.', zh: '“我在老树那边看见它们了。”母鸡说。' },
        { en: 'The duck runs and looks behind it.', zh: '小鸭子跑过去，往树后一看。' },
        { en: 'Her family is there! They all say, "Hello!"', zh: '家人都到齐了！它们一起喊：“你好！”' },
      ],
      [
        { en: 'The cow, the pig and the chicken come too.', zh: '奶牛、大猪和母鸡也赶来了。' },
        { en: 'The animals stand together in the sun.', zh: '动物们站在太阳底下，挤成一团。' },
        { en: '"Hello, family! Here you are," says the duck.', zh: '“你好呀，家人！我找到你们啦。”小鸭子说。' },
      ],
    ],
  },
  '2-3': {
    title: "Let's Go to the Zoo",
    titleZh: '我们去动物园吧',
    paragraphs: [
      [
        { en: 'A new panda comes to the zoo.', zh: '一只新来的熊猫走进动物园。' },
        { en: 'He is big, but he does not come out.', zh: '它很大，却总是不肯出来。' },
        { en: 'He sits in his house and waits.', zh: '它坐在自己的小屋里，等着谁叫它。' },
        { en: '"Come out and play, panda!" says the monkey.', zh: '“出来一起玩吧，熊猫！”猴子说。' },
        { en: '"No! I am not ready," says the panda.', zh: '“不要！我还没准备好。”熊猫说。' },
      ],
      [
        { en: 'The monkey climbs a tall tree and looks for him.', zh: '猴子爬上一棵高高的树，帮它找。' },
        { en: 'Then a big bear comes and calls him.', zh: '后来，大熊走过来喊它。' },
        { en: '"I am big, but I am kind," says the bear.', zh: '“我虽然大，可是我很善良。”熊说。' },
        { en: 'A parrot flies down and says, "Hello! I can sing!"', zh: '一只鹦鹉飞下来：“你好！我会唱歌！”' },
      ],
      [
        { en: 'The panda laughs and comes out of his house.', zh: '熊猫笑了，从小屋里走了出来。' },
        { en: 'He jumps and plays with the monkey.', zh: '它跳呀跳，和猴子玩在一起。' },
        { en: '"Hello, new friend! Let\'s play again!"', zh: '“你好呀，新朋友！我们下次再玩！”' },
      ],
    ],
  },
  '2-4': {
    title: 'A Day in the Ocean',
    titleZh: '海洋里的一天',
    paragraphs: [
      [
        { en: 'A little turtle swims in the big ocean.', zh: '小海龟在大海里慢慢地游着。' },
        { en: 'She is slow and can not keep up.', zh: '它游得慢，怎么也跟不上。' },
        { en: 'A dolphin jumps and laughs at her.', zh: '一只海豚跳起来，笑她。' },
        { en: '"You are too slow, turtle!" says the dolphin.', zh: '“你太慢啦，小海龟！”海豚说。' },
        { en: 'The turtle goes away. She feels sad.', zh: '小海龟游开了，心里有点难过。' },
      ],
      [
        { en: 'Then a small fish comes and says, "Hello!"', zh: '这时，一条小鱼游过来：“你好！”' },
        { en: 'A little seahorse is there. "I am lost."', zh: '那边有一只小海马。“我迷路了。”' },
        { en: '"We will take you home," says the turtle.', zh: '“我们送你回家。”小海龟说。' },
        { en: 'The turtle and the fish help him.', zh: '小海龟和小鱼一起帮他。' },
        { en: 'Then the fish shows the turtle how to swim.', zh: '后来，小鱼教小海龟怎么游泳。' },
      ],
      [
        { en: 'The turtle swims fast now, like a fish.', zh: '现在小海龟游得可快了，像鱼一样。' },
        { en: 'The dolphin comes back. "Hello! We can swim together!"', zh: '海豚又游回来了：“你好！我们一起游吧！”' },
      ],
    ],
  },
  '2-5': {
    title: 'Bugs! Bugs! Bugs!',
    titleZh: '虫子！虫子！虫子！',
    paragraphs: [
      [
        { en: 'A little caterpillar eats a green leaf.', zh: '一条小毛毛虫在绿叶上吃着东西。' },
        { en: 'It is small, but it eats and eats.', zh: '它很小，却一直吃呀吃。' },
        { en: 'It wants to fly, like a butterfly.', zh: '它想像蝴蝶一样飞起来。' },
        { en: 'Kate watches it every day in the yard.', zh: 'Kate 每天都在院子里看它。' },
      ],
      [
        { en: '"Hello! Do you want to fly?" says a bee.', zh: '“你好！你想飞吗？”一只蜜蜂说。' },
        { en: '"Eat and get big," says the bee. The caterpillar eats.', zh: '“多吃一点，快快长大。”蜜蜂说。小毛毛虫吃呀吃。' },
        { en: 'Then a spider comes down from the tree.', zh: '这时，一只蜘蛛从树上下来了。' },
        { en: '"Go behind the leaf!" says the bee. The caterpillar waits.', zh: '“快到叶子后面去！”蜜蜂说。小毛毛虫乖乖等着。' },
      ],
      [
        { en: 'Now the caterpillar comes out and eats and gets big.', zh: '小毛毛虫又出来啦，一边吃一边长大。' },
        { en: 'One day it is not on the leaf.', zh: '有一天，它不在叶子上了。' },
        { en: 'Kate looks behind the leaf.', zh: 'Kate 往叶子后面一看。' },
        { en: '"Hello! I am your little bug," says the butterfly.', zh: '“你好！我就是你那条小虫子。”蝴蝶说。' },
      ],
    ],
  },
  '2-6': {
    title: 'The Animal Quiz',
    titleZh: '动物小测验',
    paragraphs: [
      [
        { en: 'Mom gives Leo a book about animals.', zh: '妈妈给了 Leo 一本讲动物的书。' },
        { en: 'He knows every animal in the book.', zh: '书里的动物他全都认识。' },
        { en: '"How many animals can you see?" asks Mom.', zh: '“你看见多少只动物？”妈妈问。' },
        { en: 'Leo counts them all, but one is hard.', zh: 'Leo 全都数了出来，可有一题很难。' },
        { en: '"What animal lives in the ocean?" Leo asks.', zh: '“什么动物住在海洋里？”Leo 问。' },
      ],
      [
        { en: 'They go to the ocean, and the cat comes too.', zh: '他们去海边看海，小猫也跟着一起来了。' },
        { en: 'One dolphin jumps in the water.', zh: '一只海豚跳出水面。' },
        { en: '"One! Now count the fish," says Leo.', zh: '“一只！Leo，现在数数鱼吧。”Leo 说。' },
        { en: 'Leo counts two, three, four and five.', zh: 'Leo 数着：两条、三条、四条、五条。' },
        { en: 'The cat counts them too and laughs.', zh: '小猫也跟着数，笑出了声。' },
      ],
      [
        { en: '"Now you know all the answers," says Mom.', zh: '“现在你全都答对啦。”妈妈说。' },
        { en: '"Hello, Mom! The cat is my pet. It is so cute."', zh: '“你好呀，妈妈！小猫是我的宠物，它太可爱啦。”' },
      ],
    ],
  },
  '2-7': {
    title: 'Add It Up',
    titleZh: '加起来',
    paragraphs: [
      [
        { en: 'Ben and Anna sit on the grass.', zh: 'Ben 和 Anna 坐在草地上。' },
        { en: 'A dog comes and looks at them.', zh: '一只狗走过来，看着他们。' },
        { en: '"How many legs do you have?" asks Ben.', zh: '“你有几条腿？”Ben 问。' },
        { en: '"I have four legs," says the dog.', zh: '“我有四条腿。”狗说。' },
        { en: 'A cat comes too. It has four legs.', zh: '一只猫也来了，它有四条腿。' },
      ],
      [
        { en: 'Now a bird and a duck come to play.', zh: '这时，一只鸟和一只鸭子也来玩。' },
        { en: 'The bird has two legs. The duck has two.', zh: '鸟有两条腿，鸭子也有两条。' },
        { en: '"4 plus 4 equals 8," says Ben.', zh: '“4 加 4 等于 8。”Ben 说。' },
        { en: '"And 2 plus 2 makes 4," says Anna.', zh: '“那 2 加 2 就是 4。”Anna 说。' },
      ],
      [
        { en: '"How many legs do they have altogether?" asks Anna.', zh: '“它们一共有多少条腿？”Anna 问。' },
        { en: '"12 legs! That is hard addition," says Ben.', zh: '“12 条腿！这道加法好难。”Ben 说。' },
        { en: 'The dog jumps. "Hello! We did it!"', zh: '小狗跳了起来：“你好！我们算出来啦！”' },
      ],
    ],
  },
  '2-8': {
    title: 'What Comes Next',
    titleZh: '下一个是什么',
    paragraphs: [
      [
        { en: 'Jack puts his toy animals on the table.', zh: 'Jack 把玩具动物一个一个摆在桌上。' },
        { en: 'Cat, dog, cat, dog. It is a pattern.', zh: '猫、狗、猫、狗——这是一个规律。' },
        { en: '"What comes next?" asks Jack.', zh: '“下一个是什么？”Jack 问。' },
        { en: 'The cat comes next, and then the dog.', zh: '下一个是猫，然后才是狗。' },
        { en: '"I can finish it," says Jack.', zh: '“我能把它排完。”Jack 说。' },
      ],
      [
        { en: 'But one animal is missing from the table.', zh: '可是桌上少了一个动物。' },
        { en: 'Jack looks in the box and under the bed.', zh: 'Jack 在盒子里、床上都找过了。' },
        { en: 'The little dog is not there.', zh: '小狗狗不见了。' },
        { en: 'Then a big dog comes and sits next to the cat.', zh: '这时，一只大狗走进来，坐在小猫旁边。' },
      ],
      [
        { en: '"Now the pattern is here!" says Jack.', zh: '“现在规律齐啦！”Jack 说。' },
        { en: 'The dog comes next. Then the cat comes too.', zh: '下一个是狗，然后猫也来了。' },
        { en: '"Hello! What comes next?" asks the dog.', zh: '“你好！下一个是什么？”小狗问。' },
      ],
    ],
  },
}
