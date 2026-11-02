// Unit 1 Hello! 阅读短文（8 课）
// 试点单元：先手写定质量基线，其余单元照此产出。
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 2026-11-02 文体美化试点：1-1 / 1-2 重写为「一个连贯的小故事」——
//   1-1 让 hello 贯穿全篇并在结尾还给 tomorrow（首尾呼应）；
//   1-2 用 morning → afternoon → evening 三段时间线，hello 跟着太阳走一天。
// 对话推进 + 重复句式造节奏，中文同步改为更口语、有画面感的讲法。
// 其余 6 课待确认后照此铺开。
// 2026-11-02 文体改写：其余 6 课（1-3~1-8）已按此铺开——1-3 镜子前「谁不见了」、1-4 蓝气球飞上树、1-5 调三原色画彩虹、1-6 入学第一天自我介绍、1-7 数苹果少一个、1-8 动物园数到 6~10；都有对话推进、首尾回响，中文一并改口语。
import type { ReadingPassage } from './index'

export const unit1: Record<string, ReadingPassage> = {
  '1-1': {
    title: 'Hello, My Friend',
    titleZh: '你好，我的朋友',
    paragraphs: [
      [
        { en: "Hello! I'm Sam, a little cat.", zh: '你好！我是小猫咪 Sam。' },
        { en: "It's a new day and the sun is up.", zh: '新的一天，太阳公公起来啦。' },
        { en: 'I walk out to play.', zh: '我出门玩喽。' },
        { en: 'Hello! My name is Sam. Can I play with you?', zh: '你好！我叫 Sam，我可以和你一起玩吗？' },
        { en: '"Hello, Sam! Great! You can play with me," says the bird.', zh: '“你好呀，Sam！太好了！跟我一起玩吧。”小鸟说。' },
      ],
      [
        { en: 'The bird is small and red.', zh: '这只小鸟小小的、红红的。' },
        { en: 'We are happy friends now.', zh: '现在我们是一对好朋友啦。' },
        { en: 'We play and play all day.', zh: '我们玩呀玩，玩了一整天。' },
        { en: 'We run and jump and sing, too.', zh: '还一起跑、一起跳、一起唱歌。' },
      ],
      [
        { en: 'The sun goes down. It is evening.', zh: '太阳落山了，到傍晚啦。' },
        { en: '"Good bye, my friend!" I say.', zh: '“再见啦，我的朋友！”我说。' },
        { en: 'Hello, tomorrow! We will play again.', zh: '你好呀，明天！我们还要一起玩哦。' },
      ],
    ],
  },
  '1-2': {
    title: 'Good Morning',
    titleZh: '早上好',
    paragraphs: [
      [
        { en: 'Good morning! The sun is up.', zh: '早上好！太阳公公起来啦。' },
        { en: 'Good morning, Mom! Hello, new day!', zh: '早上好，妈妈！你好呀，新的一天！' },
        { en: 'My mom smiles and says hello to me.', zh: '妈妈笑着对我说了声你好。' },
        { en: 'We eat breakfast with my little cat.', zh: '我们和小猫咪一起吃早饭。' },
      ],
      [
        { en: 'Good afternoon! The sun is high.', zh: '下午好！太阳爬得高高的。' },
        { en: 'We play with my cat and my dog.', zh: '我们和小猫小狗一起玩。' },
        { en: 'We run and jump in the sun.', zh: '我们在太阳底下跑呀跳呀。' },
        { en: 'What a happy day!', zh: '多么开心的一天呀！' },
      ],
      [
        { en: 'Good evening! The moon is out.', zh: '晚上好！月亮悄悄爬出来了。' },
        { en: 'The little stars say hello too.', zh: '小星星们也在对我说你好呢。' },
        { en: '"Good night, moon. Good night, stars."', zh: '“晚安，月亮。晚安，星星。”' },
        { en: 'Hello, tomorrow! I can not wait.', zh: '你好呀，明天！我已经等不及啦。' },
      ],
    ],
  },
  '1-3': {
    title: 'Look at Me',
    titleZh: '看看我',
    paragraphs: [
      [
        { en: 'Look at me! I am Ben, a boy.', zh: '看看我！我是男孩 Ben。' },
        { en: 'My friend and I play a mirror game.', zh: '我和好朋友玩照镜子的游戏。' },
        { en: 'This morning I stand before my mirror.', zh: '今天早上，我站到了镜子前面。' },
        { en: 'The mirror is clean. I see one boy.', zh: '镜子擦得干干净净。我看见一个男孩。' },
      ],
      [
        { en: '"Who\'s missing?" I ask my mom.', zh: '“谁不见了？”我问妈妈。' },
        { en: '"Look at the mirror," says Mom.', zh: '“自己照照镜子。”妈妈说。' },
        { en: '"I see one boy," I say. "Where is the girl?"', zh: '“我只看到一个男孩。”我说，“女孩在哪儿呢？”' },
        { en: 'Then I hear a laugh near the door.', zh: '这时候，我听见门边传来笑声。' },
      ],
      [
        { en: 'A girl comes out. "My name is Lily!"', zh: '一个女孩跳了出来。“我叫 Lily！”' },
        { en: 'Now we look in the mirror. One boy, one girl.', zh: '现在我们一起照镜子。一个男孩，一个女孩。' },
        { en: '"No one is missing," we say. "Look at me!"', zh: '“谁也不见啦，”我们说。“快看我们！”' },
      ],
    ],
  },
  '1-4': {
    title: 'I Love Colors',
    titleZh: '我爱颜色',
    paragraphs: [
      [
        { en: 'Look! I have three balloons.', zh: '瞧！我有三个气球。' },
        { en: 'One is red. One is yellow. One is blue.', zh: '一个是红的，一个是黄的，一个是蓝的。' },
        { en: '"What color do you like?" I ask Ben.', zh: '“你喜欢什么颜色？”我问 Ben。' },
        { en: '"I like blue," says Ben. "Can I have it?"', zh: '“我喜欢蓝色，”Ben 说，“能给我吗？”' },
      ],
      [
        { en: 'Ben runs with the blue balloon, and it goes up.', zh: 'Ben 抱着蓝气球跑起来，气球却飞上了天。' },
        { en: 'It is in the tree now. I can not get it.', zh: '气球挂到树上了，我怎么也够不着。' },
        { en: '"Get it down, please!" I ask a bird.', zh: '“帮我拿下来好不好？”我问一只小鸟。' },
        { en: 'The bird flies up and pushes the balloon.', zh: '小鸟飞上去，用力一推。' },
        { en: 'The balloon comes down on my head!', zh: '气球“啪”地落到我头上！' },
      ],
      [
        { en: '"Thank you!" I say. "I love blue!"', zh: '“谢谢你！”我说，“蓝色真好！”' },
        { en: 'Hello, colors! I love you all!', zh: '你好呀，颜色们！我爱你们！' },
      ],
    ],
  },
  '1-5': {
    title: 'Mix It Up',
    titleZh: '把颜色混起来',
    paragraphs: [
      [
        { en: 'The rain stops. A rainbow is in the sky.', zh: '雨停了，天上挂着一道彩虹。' },
        { en: '"Look at that rainbow!" says Mia.', zh: '“快看那道彩虹！”Mia 说。' },
        { en: '"I want a rainbow too," I say.', zh: '“我也想要一道彩虹。”我说。' },
        { en: 'But I have only red, yellow and blue.', zh: '可我手里只有红、黄、蓝三种颜色。' },
      ],
      [
        { en: '"What color do blue and yellow make?" asks Mia.', zh: '“蓝色和黄色能变成什么颜色？”Mia 问。' },
        { en: '"Blue and yellow make green," I say.', zh: '“蓝色加黄色就变成绿色。”我说。' },
        { en: '"Red and blue make purple!" Mia says.', zh: '“红色加蓝色会变成紫色！”Mia 说。' },
        { en: '"Red and yellow make orange," I say.', zh: '“红色加黄色就变成橙色。”我说。' },
      ],
      [
        { en: 'Now I can make every color I want.', zh: '现在我想变出什么颜色都行。' },
        { en: 'I draw a big rainbow for Mia.', zh: '我给 Mia 画了一道大大的彩虹。' },
        { en: '"Hello, rainbow!" Mia says. "You are big!"', zh: '“你好呀，彩虹！”Mia 说，“你好大呀！”' },
        { en: '"Hello, rainbow!" we say, and laugh.', zh: '“你好呀，彩虹！”我们一起喊，然后都笑了。' },
      ],
    ],
  },
  '1-6': {
    title: 'Hello, What Is Your Name?',
    titleZh: '你好，你叫什么名字',
    paragraphs: [
      [
        { en: 'Today I go to a new school.', zh: '今天我来到一所新学校。' },
        { en: 'I can not find my room.', zh: '我找不到自己的教室啦。' },
        { en: 'My hands are cold, but I walk in.', zh: '我的手心凉凉的，可我还是走了进去。' },
        { en: '"Hello! My name is Emma," I say.', zh: '“你好！我叫 Emma。”我说。' },
      ],
      [
        { en: '"Hello, Emma! My name is Tom."', zh: '“你好，Emma！我叫 Tom。”' },
        { en: '"Are you a boy or a girl?" he asks.', zh: '“你是男孩还是女孩？”他问。' },
        { en: '"I am a girl," I say, and smile.', zh: '“我是女孩。”我笑着说。' },
        { en: '"What color is your bag?" he asks.', zh: '“你的书包是什么颜色？”他问。' },
        { en: '"It is blue," I say, and show my bag.', zh: '“是蓝色的。”我举起书包给他看。' },
      ],
      [
        { en: '"Come with me," says Tom. "Your room is here."', zh: '“跟我来，”Tom 说，“你的教室在这儿。”' },
        { en: '"Hello, Emma!" says a girl named Lily.', zh: '“你好，Emma！”一个叫 Lily 的女孩说。' },
        { en: '"I am Lily. We are friends now!"', zh: '“我叫 Lily。我们现在是朋友啦！”' },
      ],
    ],
  },
  '1-7': {
    title: 'Let Us Count',
    titleZh: '我们来数数',
    paragraphs: [
      [
        { en: '"Let\'s count!" says Mom.', zh: '“我们来数数！”妈妈说。' },
        { en: 'We put apples in a big box.', zh: '我们把苹果放进一个大盒子里。' },
        { en: '"One apple, two apples, three apples," I say.', zh: '“一个苹果、两个苹果、三个苹果。”我说。' },
        { en: '"And four, and five," says Mom.', zh: '“还有四个、五个。”妈妈说。' },
      ],
      [
        { en: 'We look in the box, but one is missing.', zh: '我们往盒子里一看，少了一个。' },
        { en: '"What number is missing?" I ask.', zh: '“少的是哪个数呢？”我问。' },
        { en: '"Five," says Mom. "One apple is not here."', zh: '“五，”妈妈说，“少了一个苹果。”' },
        { en: 'Then Mom points to the table.', zh: '这时妈妈指了指桌子。' },
        { en: 'The cat is under the table with it!', zh: '原来小猫就在桌子底下，嘴里还叼着它！' },
      ],
      [
        { en: 'Now I count one, two, three, four, five!', zh: '现在我数：一个、两个、三个、四个、五个！' },
        { en: '"Good cat! Give me the apple," I say.', zh: '“好猫咪！把苹果给我。”我说。' },
        { en: 'We count the apples again and eat them all.', zh: '我们又数了一遍苹果，然后一起吃掉了。' },
      ],
    ],
  },
  '1-8': {
    title: 'I Know My Numbers',
    titleZh: '我认识数字',
    paragraphs: [
      [
        { en: 'We go to the zoo today.', zh: '今天我们去了动物园。' },
        { en: '"How many frogs are there?" I ask.', zh: '“那里有多少只青蛙？”我问。' },
        { en: '"Six frogs," says Tom. "Look at the water!"', zh: '“六只青蛙，”Tom 说，“快看水里！”' },
        { en: 'Seven birds sit in the tree.', zh: '七只小鸟坐在树上。' },
      ],
      [
        { en: 'Eight fish swim in the water.', zh: '八条鱼在水里游来游去。' },
        { en: 'I count nine cats near the door.', zh: '我数到门边有九只猫。' },
        { en: 'Ten ducks walk on the road.', zh: '十只小鸭子在路上走。' },
      ],
      [
        { en: '"Count them all again!" says Mom.', zh: '“再数一遍！”妈妈说。' },
        { en: '"What number is missing?" I ask Mom.', zh: '“少了哪个数呢？”我问妈妈。' },
        { en: '"Ten," says Mom. "One duck walked away."', zh: '“十，”妈妈说，“有一只鸭子走远了。”' },
        { en: 'We look down the road. One duck comes back!', zh: '我们顺着路看过去，那只鸭子又回来了！' },
        { en: 'Now I know my numbers from six to ten!', zh: '现在我从六到十的数字全都认识啦！' },
      ],
    ],
  },
}
