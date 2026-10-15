// Unit 7 My Home 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
// 本单元专属词（quilt / sofa / tub / sink / mirror / soil / shovel / cupboard /
// stove / lamp / bookshelf 等）来自本单元词表，别处不得再实现一份。
import type { ReadingPassage } from './index'

export const unit7: Record<string, ReadingPassage> = {
  '7-1': {
    title: 'My Little Bedroom',
    titleZh: '我的小卧室',
    paragraphs: [
      [
        { en: 'This is my room. It is small and warm.', zh: '这是我的房间。它又小又暖和。' },
        { en: 'There is a bed under the window.', zh: '窗户下面有一张床。' },
        { en: 'There is a pillow on the bed.', zh: '床上有一个枕头。' },
        { en: 'There is a quilt on my bed.', zh: '我的床上盖着一床被子。' },
        { en: 'There is a picture on the door.', zh: '门上有一幅画。' },
      ],
      [
        { en: 'At night I can not sleep.', zh: '晚上我睡不着。' },
        { en: 'I look at the picture of a panda.', zh: '我看着那幅熊猫画。' },
        { en: 'The panda says good night to me.', zh: '熊猫对我说晚安。' },
        { en: 'I smile and hold my quilt.', zh: '我笑着抱紧我的被子。' },
        { en: 'Good night, room! Now I sleep.', zh: '晚安，我的房间！我现在睡着了。' },
      ],
    ],
  },
  '7-2': {
    title: 'On the Sofa',
    titleZh: '在沙发上',
    paragraphs: [
      [
        { en: 'This is the living room of my house.', zh: '这是我家里的客厅。' },
        { en: 'There is a sofa and a table.', zh: '有一张沙发和一张桌子。' },
        { en: 'The table is small and it is new.', zh: '桌子很小，而且是新的。' },
        { en: 'A vase of flowers is on the table.', zh: '桌子上有一个插着花的花瓶。' },
        { en: 'On the sofa there is a clock too.', zh: '沙发上还有一个时钟。' },
      ],
      [
        { en: 'In the afternoon I watch TV.', zh: '下午我看电视。' },
        { en: 'The show is very funny.', zh: '这个节目非常有趣。' },
        { en: 'My cat jumps up on the sofa.', zh: '我的猫跳到了沙发上。' },
        { en: 'The cat is soft and warm.', zh: '这只猫又软又暖。' },
        { en: 'We watch TV and we laugh.', zh: '我们一起看电视，一起笑。' },
        { en: 'Good bye, TV! See you tomorrow.', zh: '再见，电视！明天见。' },
      ],
    ],
  },
  '7-3': {
    title: 'The Dog in the Tub',
    titleZh: '跳进浴缸的小狗',
    paragraphs: [
      [
        { en: 'Mia is in the bathroom now.', zh: '米娅现在在浴室里。' },
        { en: 'There is a big tub near the window.', zh: '窗边有一个大浴缸。' },
        { en: 'There is a sink and a toilet.', zh: '有一个洗手池，还有一个马桶。' },
        { en: 'There is a big mirror too.', zh: '还有一面大镜子。' },
        { en: 'The water is warm and very nice.', zh: '水暖暖的，真舒服。' },
      ],
      [
        { en: 'Her dog comes in and jumps in.', zh: '她的狗跑进来，也跳了进去。' },
        { en: 'Water goes out of the tub!', zh: '水从浴缸里漫出来了！' },
        { en: 'My socks are wet now.', zh: '我的袜子现在都湿了。' },
        { en: 'They are so funny!', zh: '它们太好笑了！' },
        { en: 'Mia laughs and calls her dog.', zh: '米娅笑着唤回了她的狗。' },
        { en: 'Now the bathroom is not quiet at all.', zh: '现在浴室里一点也不安静。' },
      ],
    ],
  },
  '7-4': {
    title: 'Flowers in the Soil',
    titleZh: '泥土里的小花',
    paragraphs: [
      [
        { en: 'We go to the garden this morning.', zh: '今天早上我们去了花园。' },
        { en: 'There is green grass here.', zh: '这里有绿绿的草。' },
        { en: 'There is soft soil under it.', zh: '草下面有软软的泥土。' },
        { en: 'I have a small shovel.', zh: '我有一把小铲子。' },
        { en: 'There are many red flowers.', zh: '有很多红色的花。' },
      ],
      [
        { en: 'Dad helps me with the soil.', zh: '爸爸帮我弄泥土。' },
        { en: 'I put a small flower in the soil.', zh: '我把一朵小花放进泥土里。' },
        { en: 'Then I give the flower water.', zh: '然后我给花浇水。' },
        { en: 'The ant comes out of the soil.', zh: '一只蚂蚁从泥土里爬了出来。' },
        { en: 'It is very small, but it is funny.', zh: '它很小，不过很好玩。' },
        { en: 'We put two more flowers in.', zh: '我们又放进去两朵花。' },
        { en: 'Now our garden is very pretty.', zh: '现在我们的花园真美。' },
      ],
    ],
  },
  '7-5': {
    title: 'One Egg in the Pan',
    titleZh: '平底锅里的鸡蛋',
    paragraphs: [
      [
        { en: 'Ben is in the kitchen now.', zh: '本现在在厨房里。' },
        { en: 'There is a big stove near the door.', zh: '门边有一个大炉子。' },
        { en: 'There is a cupboard and a pan.', zh: '有一个橱柜和一个平底锅。' },
        { en: 'The knife is on the table.', zh: '那把刀放在桌子上。' },
        { en: 'Ben wants to make an egg.', zh: '本想煮一个鸡蛋。' },
      ],
      [
        { en: 'Mom shows him how to cook.', zh: '妈妈教他怎么做饭。' },
        { en: 'They put bread and egg in the pan.', zh: '他们把面包和鸡蛋放进锅里。' },
        { en: 'The kitchen is very hot now.', zh: '现在厨房很热。' },
        { en: 'The pan is on the stove now.', zh: '锅现在放在炉子上。' },
        { en: 'The egg is big, soft and warm.', zh: '鸡蛋又大又软又暖。' },
        { en: 'Ben laughs and eats it all.', zh: '本笑着把它全吃光了。' },
        { en: 'Now the pan is on the table again.', zh: '现在锅又回到桌子上了。' },
      ],
    ],
  },
  '7-6': {
    title: 'What Room Is It?',
    titleZh: '这是什么房间？',
    paragraphs: [
      [
        { en: 'Anna plays a game with her mom.', zh: '安娜和妈妈一起玩一个游戏。' },
        { en: 'What room is this?', zh: '这是什么房间？' },
        { en: 'There is a bed and a pillow.', zh: '有一张床和一个枕头。' },
        { en: 'Yes, it is the bedroom!', zh: '对，这是卧室！' },
        { en: 'Are there flowers in this room?', zh: '这个房间里有花吗？' },
        { en: 'Yes! This is the garden.', zh: '对！这就是花园。' },
      ],
      [
        { en: 'Now come and look at this room.', zh: '现在来看看这个房间。' },
        { en: 'There is a stove and a pan.', zh: '有一个炉子和一个平底锅。' },
        { en: 'Yes, it is the kitchen!', zh: '对，这是厨房！' },
        { en: 'Then we go to the bathroom.', zh: '然后我们去了浴室。' },
        { en: 'There is a tub and a sink.', zh: '有一个浴缸和一个洗手池。' },
        { en: 'Look! The mirror says hello.', zh: '看！镜子在问好。' },
      ],
    ],
  },
  '7-7': {
    title: 'The Red Book on the Desk',
    titleZh: '书桌上的红皮书',
    paragraphs: [
      [
        { en: 'Leo reads a book in his study.', zh: '利奥在书房里看书。' },
        { en: 'There is a desk and a chair.', zh: '有一张书桌和一把椅子。' },
        { en: 'On the desk there is a lamp.', zh: '书桌上有一盏台灯。' },
        { en: 'The lamp is warm and yellow.', zh: '台灯的光又暖又黄。' },
        { en: 'There is a tall bookshelf here.', zh: '这里有一个高高的书架。' },
      ],
      [
        { en: 'Many books are on the bookshelf.', zh: '书架上有很多书。' },
        { en: 'He takes one red book down.', zh: '他拿下一本红色的书。' },
        { en: 'It is a story about a cat.', zh: '这是一个关于猫的故事。' },
        { en: 'The cat runs up a big tree.', zh: '猫爬上大树。' },
        { en: 'Leo laughs and reads it again.', zh: '利奥笑着又读了一遍。' },
        { en: 'The night is quiet and long.', zh: '夜晚又安静又长。' },
        { en: 'One more book, then he sleeps.', zh: '再看一本书，然后他就睡了。' },
      ],
    ],
  },
  '7-8': {
    title: 'Five Rooms in My House',
    titleZh: '我家里的五个房间',
    paragraphs: [
      [
        { en: 'This is my house. It is big.', zh: '这是我的房子。它很大。' },
        { en: 'How many rooms are there?', zh: '一共有多少个房间？' },
        { en: 'There are five rooms in it.', zh: '房子里有五个房间。' },
        { en: 'There is a sofa in the living room.', zh: '客厅里有一张沙发。' },
        { en: 'There is a TV on the table too.', zh: '桌子上还有一台电视。' },
        { en: 'This room is warm and nice.', zh: '这个房间又暖和又舒服。' },
      ],
      [
        { en: 'There is a desk in my study.', zh: '我的书房里有一张书桌。' },
        { en: 'A small lamp is on the desk.', zh: '书桌上有一盏小台灯。' },
        { en: 'The bathroom has a tub and a sink.', zh: '浴室里有一个浴缸和一个洗手池。' },
        { en: 'My mom asks me one more thing.', zh: '妈妈又问了我一个问题。' },
        { en: 'I show her all five rooms.', zh: '我带她看了五个房间。' },
        { en: 'Come in and see my house!', zh: '进来看看我的房子吧！' },
      ],
    ],
  },
}
