// Unit 7 My Home 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
// 本单元专属词（quilt / sofa / tub / sink / mirror / soil / shovel / cupboard /
// stove / lamp / bookshelf 等）来自本单元词表，别处不得再实现一份。
//
// 2026-11-02 文体改写：8 篇全部重写成「一个能一口气读完的小故事」。
// 家里的东西不再是一张「There is a ...」的清单，而是故事里的道具：
// 被子接住月光、沙发接着跳上桌的猫、浴缸接住跳进来的小狗、铲子挖开泥土、
// 炉子上的锅、书架上抽下来的红皮书。每篇都有：人物 → 一个小问题 → 想办法 → 回声收尾；
// 对话推进剧情，中文改成温暖口语、留画面。
import type { ReadingPassage } from './index'

export const unit7: Record<string, ReadingPassage> = {
  '7-1': {
    title: 'My Little Bedroom',
    titleZh: '我的小卧室',
    paragraphs: [
      [
        { en: 'This is my room. It is small and warm.', zh: '这是我的房间，又小又暖和。' },
        { en: 'My bed is under the window.', zh: '我的小床就在窗子底下。' },
        { en: 'A pillow and a quilt are on the bed.', zh: '床上有一个枕头，还有一床被子。' },
        { en: 'There is a picture of a panda on my door.', zh: '门上贴着一只熊猫的画。' },
      ],
      [
        { en: 'At night I can not sleep.', zh: '晚上我怎么也睡不着。' },
        { en: 'I want to see the moon.', zh: '我想看看月亮。' },
        { en: '"Open the window for the moon!" says the panda.', zh: '“快把窗户打开，让月亮进来！”熊猫说。' },
        { en: 'I open the window and the moon is there.', zh: '我打开窗户，月亮就挂在外面。' },
        { en: 'Its light is on my quilt.', zh: '柔柔的月光洒在我的被子上。' },
        { en: 'I hold my pillow and I smile.', zh: '我抱紧枕头，笑了。' },
        { en: '"Good night, moon. Good night, panda."', zh: '“晚安，月亮。晚安，熊猫。”' },
        { en: 'Now I sleep in my warm bed.', zh: '现在我在暖暖的小床里睡着啦。' },
      ],
    ],
  },
  '7-2': {
    title: 'On the Sofa',
    titleZh: '在沙发上',
    paragraphs: [
      [
        { en: 'This is my living room.', zh: '这是我的客厅。' },
        { en: 'A big sofa is near the window.', zh: '窗边有一张大沙发。' },
        { en: 'A small table is near the sofa.', zh: '沙发旁边有一张小桌子。' },
        { en: 'A vase of flowers and a clock are on the table.', zh: '桌上有一个插着花的花瓶，还有一个时钟。' },
        { en: 'I sit on the sofa and turn on the TV.', zh: '我坐到沙发上，打开电视。' },
      ],
      [
        { en: 'My cat jumps on the sofa, then on the table!', zh: '我的猫先跳上沙发，又跳上桌子！' },
        { en: 'It pushes the vase with its head.', zh: '它用脑袋把花瓶一顶。' },
        { en: 'The water goes out of the vase!', zh: '水从花瓶里洒出来啦！' },
        { en: '"Oh no! The water is on the table."', zh: '“哎呀！水都流到桌子上啦。”' },
        { en: 'I clean it with my sock.', zh: '我拿袜子把桌子擦干净。' },
        { en: 'The cat looks so sorry, and I smile.', zh: '小猫一脸抱歉，我笑了。' },
        { en: 'We watch TV on the sofa again.', zh: '我们又坐回沙发上看电视。' },
      ],
    ],
  },
  '7-3': {
    title: 'The Dog in the Tub',
    titleZh: '跳进浴缸的小狗',
    paragraphs: [
      [
        { en: 'Mia is in the bathroom with her dog.', zh: '米娅和她的狗一起待在浴室里。' },
        { en: 'She puts water in the big tub.', zh: '她往大浴缸里放水。' },
        { en: 'The water is warm and nice.', zh: '水暖暖的，真舒服。' },
        { en: 'A big mirror is on the door.', zh: '门上有一面大镜子。' },
        { en: 'The sink and the toilet are near the tub.', zh: '洗手池和马桶都在浴缸旁边。' },
        { en: '"Come in, Sam! The water is warm."', zh: '“进来吧，Sam！水是暖的。”' },
      ],
      [
        { en: 'Sam jumps in the tub!', zh: 'Sam 一头扎进浴缸里！' },
        { en: 'The water goes out of the tub!', zh: '水哗啦一下漫出了浴缸！' },
        { en: 'My socks are wet now.', zh: '我的袜子全湿了。' },
        { en: 'Now the toilet is wet too!', zh: '现在连马桶也湿啦！' },
        { en: 'Sam puts his wet nose on the mirror!', zh: 'Sam 把湿鼻子印在镜子上！' },
        { en: 'We see our wet faces and laugh.', zh: '镜子里我们俩都湿漉漉的，一起笑弯了腰。' },
      ],
    ],
  },
  '7-4': {
    title: 'Flowers in the Soil',
    titleZh: '泥土里的小花',
    paragraphs: [
      [
        { en: 'We go to the garden this morning.', zh: '今天早上，我们去花园玩。' },
        { en: 'The grass is wet and soft.', zh: '草上带着露水，软软的。' },
        { en: 'Dad and I have a small shovel.', zh: '爸爸和我有一把小铲子。' },
        { en: 'I push the shovel into the soil.', zh: '我把小铲子插进泥土里。' },
        { en: 'The soil is soft and warm.', zh: '泥土又软又暖。' },
      ],
      [
        { en: 'I put a small flower in the soil.', zh: '我把一朵小花放进泥土里。' },
        { en: '"Now we water it," Dad says.', zh: '“现在给它浇点水。”爸爸说。' },
        { en: 'The flower is tall and can not stand.', zh: '小花个子太高，站不稳。' },
        { en: 'So I put a stick in the soil.', zh: '于是我在泥土里插上一根小棍。' },
        { en: 'The sun comes out and the flower opens.', zh: '太阳出来了，小花也张开了花瓣。' },
        { en: 'An ant comes to look at it.', zh: '一只蚂蚁爬过来看它。' },
        { en: '"Hello, little ant!" I say.', zh: '“你好呀，小蚂蚁！”我说。' },
      ],
    ],
  },
  '7-5': {
    title: 'One Egg in the Pan',
    titleZh: '平底锅里的鸡蛋',
    paragraphs: [
      [
        { en: 'Ben is in the kitchen.', zh: '本在厨房里。' },
        { en: 'He wants to cook an egg.', zh: '他想自己煮一个鸡蛋。' },
        { en: 'He opens the big cupboard.', zh: '他拉开了那个大橱柜。' },
        { en: 'A pan is in there.', zh: '里面有一个平底锅。' },
      ],
      [
        { en: 'He puts the pan on the stove.', zh: '他把锅放到了炉子上。' },
        { en: 'Ben takes the knife on the table.', zh: '本拿起了桌上的刀。' },
        { en: '"No, Ben! Mom will do that."', zh: '“不行，本！让妈妈来。”' },
        { en: 'Mom takes the knife and smiles.', zh: '妈妈拿过刀，笑了。' },
      ],
      [
        { en: 'She puts bread and egg in the pan.', zh: '她把面包和鸡蛋放进锅里。' },
        { en: '"I am hungry!" says Ben.', zh: '“我饿啦！”本说。' },
        { en: 'Ben eats it all and laughs.', zh: '本把它全吃光了，笑得眉眼弯弯。' },
        { en: 'Now the pan is on the table again.', zh: '现在锅又回到桌子上了。' },
      ],
    ],
  },
  '7-6': {
    title: 'What Room Is It?',
    titleZh: '这是什么房间？',
    paragraphs: [
      [
        { en: 'Anna plays a game with her mom.', zh: '安娜和妈妈玩猜房间的游戏。' },
        { en: '"Close your eyes, Mom. What room is it?"', zh: '“闭上眼吧，妈妈。这是什么房间？”' },
        { en: '"There is a bed and a pillow."', zh: '“这里有一张床，还有一个枕头。”' },
        { en: '"The bedroom!" says Mom.', zh: '“卧室！”妈妈说。' },
        { en: '"Yes! Now look at this door, Mom."', zh: '“对啦！现在再看看这一扇门，妈妈。”' },
      ],
      [
        { en: '"There is a stove and a pan."', zh: '“这里有一个炉子，还有一个平底锅。”' },
        { en: '"The kitchen!" says Mom.', zh: '“厨房！”妈妈说。' },
        { en: '"This room has a big tub and a sink."', zh: '“这一间有大浴缸，还有洗手池。”' },
        { en: '"The bathroom!" says Mom.', zh: '“浴室！”妈妈说。' },
      ],
      [
        { en: '"Now what room has grass and flowers?"', zh: '“那什么房间里有草，还有花呢？”' },
        { en: '"The garden!" says Mom.', zh: '“花园！”妈妈说。' },
        { en: '"You are very good!" says Mom and smiles.', zh: '“你真厉害！”妈妈笑着说。' },
      ],
    ],
  },
  '7-7': {
    title: 'The Red Book on the Desk',
    titleZh: '书桌上的红皮书',
    paragraphs: [
      [
        { en: 'It is night. Leo is in his study.', zh: '夜里了，利奥在他的书房里。' },
        { en: 'He turns on the lamp on the desk.', zh: '他打开书桌上的那盏台灯。' },
        { en: 'The lamp is warm and yellow.', zh: '灯光暖暖的、黄黄的。' },
        { en: 'There is a tall bookshelf near the desk.', zh: '书桌旁边有一个高高的书架。' },
        { en: 'Many books are on the bookshelf.', zh: '书架上摆了好多好多的书。' },
      ],
      [
        { en: 'He takes one red book down.', zh: '他抽出一本红红的书。' },
        { en: 'It is a story about a cat.', zh: '书里讲的是一只猫的故事。' },
        { en: 'His cat comes in and sits on the desk.', zh: '他的猫也走进书房，跳上了书桌。' },
        { en: '"Hello, cat," says Leo.', zh: '“你好呀，小猫。”利奥说。' },
        { en: 'The cat wants the book, too.', zh: '小猫也想看这本书。' },
        { en: 'Leo reads the story again and laughs.', zh: '利奥把这故事又读了一遍，笑出了声。' },
        { en: '"One more book, then I sleep."', zh: '“再看一本书，然后我就睡觉。”' },
      ],
    ],
  },
  '7-8': {
    title: 'Five Rooms in My House',
    titleZh: '我家里的五个房间',
    paragraphs: [
      [
        { en: 'This is my house. It has five rooms.', zh: '这是我的家，一共有五个房间。' },
        { en: '"Come in, Sam! I will show you them."', zh: '“进来吧，Sam！我带你一个一个看。”' },
        { en: 'There is a sofa and a TV in the living room.', zh: '客厅里有一张沙发，还有一台电视。' },
        { en: '"This is my study: a desk, a lamp, a bookshelf."', zh: '“这是我的书房：书桌、台灯，还有书架。”' },
      ],
      [
        { en: '"This is the bedroom with my red quilt."', zh: '“这是卧室，我的红被子就放在那儿。”' },
        { en: '"Here is the kitchen with a big stove."', zh: '“这是厨房，有一个大大的炉子。”' },
        { en: '"The bathroom has a tub and a sink."', zh: '“浴室里有一个浴缸，还有洗手池。”' },
        { en: '"And the garden is behind the house."', zh: '“花园就在房子后面。”' },
        { en: '"That is five rooms!" says Sam.', zh: '“一共有五个房间！”Sam 说。' },
        { en: '"Your house is nice!" says Sam.', zh: '“你的家真好看！”Sam 说。' },
        { en: '"Come and sit on the sofa with me!"', zh: '“来，跟我一起坐沙发上吧！”' },
        { en: 'We sit on the sofa and watch TV.', zh: '我们坐在沙发上看电视。' },
      ],
    ],
  },
}
