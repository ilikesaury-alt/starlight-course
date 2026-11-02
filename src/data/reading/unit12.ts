// Unit 12 I See It 阅读短文（8 课）
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 2026-11-02 文体改写：8 篇全部改写成「一路走一路看」的小故事——
//   12-1 找红球路过学校/医院/公园；12-2 买牛奶面包撞见理发店里的爸爸；
//   12-3 放学遇上雨，四个人的四种回家方式；12-4 小兔子过马路听红黄绿三盏灯；
//   12-5 新来的 Jack 在 Leo 带领下左转/直走/右转找到学校；
//   12-6 带迷路的 Tom 走一遍自家这条路；12-7 救护车、消防车、警车一起让路；
//   12-8 Grace 找猫，一路看见学校/医院/超市/面包店。
//   每篇都用对话推进、结尾回声，中文改口语有画面感。
import type { ReadingPassage } from './index'

export const unit12: Record<string, ReadingPassage> = {
  '12-1': {
    title: 'I See It!',
    titleZh: '我看到了！',
    paragraphs: [
      [
        { en: 'My red ball is not in my bag.', zh: '我的红球不在包里。' },
        { en: '"Where is my ball?" I ask Mom.', zh: '“我的球在哪儿呢？”我问妈妈。' },
        { en: '"Go out and look," says Mom.', zh: '“出去找找吧。”妈妈说。' },
        { en: 'I walk out and open the door.', zh: '我推开门走了出去。' },
      ],
      [
        { en: 'I see a school. It is big and white.', zh: '我看见一所学校，又大又白。' },
        { en: 'I see a hospital near the road.', zh: '我看见路边的一家医院。' },
        { en: 'I see a park with many trees.', zh: '我看见一个公园，里面好多好多树。' },
        { en: 'A small dog runs out of the park.', zh: '一只小狗从公园里跑了出来。' },
      ],
      [
        { en: '"Look! That is my ball," I say.', zh: '“快看！那是我的球！”我说。' },
        { en: 'The dog sits down and holds it.', zh: '小狗坐下来，把球抱在怀里。' },
        { en: 'I take my ball and walk home.', zh: '我拿回球，走回家。' },
        { en: '"What do you see today?" Mom asks.', zh: '“今天你都看见什么啦？”妈妈问。' },
      ],
    ],
  },
  '12-2': {
    title: 'We Go Shopping',
    titleZh: '我们去买东西',
    paragraphs: [
      [
        { en: '"We need milk and bread," says Mom.', zh: '“我们要买牛奶和面包。”妈妈说。' },
        { en: '"Let\'s go!" I say. We walk out.', zh: '“走吧！”我说。我们就出门啦。' },
        { en: 'I see a supermarket. It is big and new.', zh: '我看见一家超市，又大又新。' },
        { en: '"Can we get milk there?" I ask.', zh: '“我们能在那儿拿到牛奶吗？”我问。' },
      ],
      [
        { en: '"Yes," says Mom. We go in together.', zh: '“好呀。”妈妈说。我们一起走了进去。' },
        { en: 'Mom gets milk. Then I see a bakery.', zh: '妈妈拿了牛奶。接着我看见一家面包店。' },
        { en: 'It has hot bread and cakes. "Yummy!"', zh: '里面有热乎乎的面包和蛋糕。“真香呀！”' },
        { en: 'Mom takes bread and one cake.', zh: '妈妈拿了面包，又拿了一个蛋糕。' },
        { en: 'Then we see a barbershop. Dad is there.', zh: '然后我们看见一家理发店，我爸爸就在那儿。' },
      ],
      [
        { en: '"Hi, Dad! You look new!" I say.', zh: '“嗨，爸爸！你看起来真精神！”我说。' },
        { en: 'We walk home and eat the cake.', zh: '我们一边走回家，一边把蛋糕吃掉了。' },
        { en: '"I see a supermarket, a bakery and a barbershop," I say.', zh: '“我看见一家超市、一家面包店和一家理发店。”我说。' },
      ],
    ],
  },
  '12-3': {
    title: 'How Do You Go?',
    titleZh: '你怎么去？',
    paragraphs: [
      [
        { en: 'School is over. We walk out together.', zh: '放学啦。我们一起走出去。' },
        { en: '"How do you go home?" I ask.', zh: '“你们怎么回家呀？”我问。' },
        { en: '"I ride my bike," says Leo.', zh: '“我骑自行车回家。”Leo 说。' },
        { en: '"I take the bus," says Mia.', zh: '“我坐公共汽车回家。”Mia 说。' },
        { en: '"I take the subway," says Anna.', zh: '“我坐地铁回家。”Anna 说。' },
        { en: '"I take a taxi," I say.', zh: '“我坐出租车回家。”我说。' },
      ],
      [
        { en: 'Then the rain comes. Leo can not ride his bike.', zh: '这时下起雨来。Leo 骑不了自行车啦。' },
        { en: 'We stand under a tree and wait.', zh: '我们站在大树下等一等。' },
        { en: 'My taxi comes and stops near us.', zh: '我的出租车开过来，停在我们旁边。' },
      ],
      [
        { en: 'We get in. We are all wet.', zh: '我们坐进车里。大家都湿了。' },
        { en: 'We laugh and sing all the way home.', zh: '一路上我们又笑又唱。' },
        { en: '"A taxi tomorrow too?" says Leo.', zh: '“明天也坐出租车吗？”Leo 说。' },
      ],
    ],
  },
  '12-4': {
    title: 'Stop or Go?',
    titleZh: '停还是走？',
    paragraphs: [
      [
        { en: 'A small bunny wants to go to the park.', zh: '一只小兔子想去公园。' },
        { en: 'Her friends wait for her there.', zh: '她的朋友们就在那儿等她。' },
        { en: 'She comes to the road. The red light says stop.', zh: '她走到路口。红灯说：停。' },
        { en: 'So she stops and waits there.', zh: '于是她停下来，站在那儿等。' },
      ],
      [
        { en: 'Then the yellow light says wait.', zh: '接着黄灯说：等一等。' },
        { en: 'The bunny looks up and waits a long time.', zh: '小兔子抬头看着灯，等了好久好久。' },
        { en: 'Then the green light comes. It says go.', zh: '然后绿灯来了，它说：走。' },
        { en: '"Go!" says the bunny, and she runs.', zh: '“走啦！”小兔子说完就跑了起来。' },
      ],
      [
        { en: 'A car stops. The man waves to her.', zh: '一辆车停了下来，叔叔朝她挥挥手。' },
        { en: '"Thank you!" says the bunny.', zh: '“谢谢您！”小兔子说。' },
        { en: 'Now she can play with her friends.', zh: '现在她可以去找朋友们玩啦。' },
        { en: 'She waits at the light every day.', zh: '她每天都在那盏灯下等一等。' },
      ],
    ],
  },
  '12-5': {
    title: 'This Way, Please',
    titleZh: '请这边走',
    paragraphs: [
      [
        { en: 'Hi! I am Jack. I am new here.', zh: '嗨！我是 Jack，我刚来这个地方。' },
        { en: 'I do not know the way to school.', zh: '我不知道怎么去学校。' },
        { en: '"I can help you," says my friend Leo.', zh: '“我可以帮你。”我的朋友 Leo 说。' },
        { en: '"How do I get to school?" I ask.', zh: '“我怎么才能到学校呢？”我问。' },
        { en: '"Come with me," says Leo. We walk.', zh: '“跟我来。”Leo 说。我们走起来。' },
      ],
      [
        { en: '"Turn left!" says Leo. We walk to a big tree.', zh: '“向左转！”Leo 说。我们走到一棵大树下。' },
        { en: '"Go straight!" says Leo. We walk for a long time.', zh: '“直走！”Leo 说。我们走了好长好长一段路。' },
        { en: '"Now turn right," says Leo.', zh: '“现在向右转。”Leo 说。' },
        { en: 'We turn right and see my school.', zh: '我们向右转，就看见了我的学校。' },
      ],
      [
        { en: 'My mom is at the school door.', zh: '妈妈正站在学校门口。' },
        { en: '"You made it!" says Mom.', zh: '“你自己走到啦！”妈妈说。' },
        { en: '"Thanks, Leo! Come with me tomorrow."', zh: '“谢谢你，Leo！明天和我一起来吧。”' },
      ],
    ],
  },
  '12-6': {
    title: 'On My Road',
    titleZh: '在我家这条路上',
    paragraphs: [
      [
        { en: 'Hi! I am Leo. This is my road.', zh: '嗨！我是 Leo。这就是我家这条路。' },
        { en: 'Today my new friend Tom comes with me.', zh: '今天，我的新朋友 Tom 跟我一起走。' },
        { en: 'We walk on the road in the sun.', zh: '我们在太阳底下走在路上。' },
        { en: '"Where is your school?" I ask him.', zh: '“你的学校在哪儿呀？”我问他。' },
        { en: '"I can not find it," says Tom.', zh: '“我找不到了。”Tom 说。' },
      ],
      [
        { en: 'I see a supermarket. It is big and new.', zh: '我看见一家超市，又大又新。' },
        { en: 'I see a fire station near the park.', zh: '我看见公园附近的一个消防站。' },
        { en: 'I see a police station too.', zh: '我还看见一个警察局。' },
        { en: '"This is my bus," I say. "Come with me."', zh: '“这是我的公交车，”我说，“跟我一起上车吧。”' },
      ],
      [
        { en: 'We take the bus to school.', zh: '我们坐公交车去上学。' },
        { en: '"Now you know the way," I say.', zh: '“现在你认识路啦。”我说。' },
        { en: '"Thanks, Leo!" says Tom. "See you tomorrow."', zh: '“谢谢你，Leo！”Tom 说，“明天见。”' },
      ],
    ],
  },
  '12-7': {
    title: 'Make Way, Please!',
    titleZh: '请让一让！',
    paragraphs: [
      [
        { en: 'I am Mia. I walk home with my dog.', zh: '我是 Mia。我和我的狗一起走回家。' },
        { en: 'Oh! What is that? It is very loud.', zh: '咦！那是什么呀？声音好大。' },
        { en: 'An ambulance comes down the road.', zh: '一辆救护车沿着路开过来。' },
        { en: '"Make way, please!" says my mom.', zh: '“请让一让！”妈妈说。' },
        { en: 'This is a fire truck. It is big.', zh: '这是一辆消防车，好大呀。' },
      ],
      [
        { en: 'Then I see a police car too.', zh: '接着我还看见一辆警车。' },
        { en: 'The police car helps a little boy.', zh: '警车帮了一个小男孩。' },
        { en: 'My dog is very quiet and sits down.', zh: '我的狗很安静，乖乖坐了下来。' },
        { en: 'We go near the big tree.', zh: '我们走到大树旁边。' },
      ],
      [
        { en: 'The boy says, "Thank you! I am happy."', zh: '小男孩说：“谢谢你！我好开心。”' },
        { en: '"Make way, please!" we say together.', zh: '“请让一让！”我们一起喊。' },
        { en: 'Then the cars go away, and we wave.', zh: '然后车子都开走了，我们朝它们挥挥手。' },
      ],
    ],
  },
  '12-8': {
    title: 'Four Places',
    titleZh: '四个地方',
    paragraphs: [
      [
        { en: 'Hello! I am Grace. My cat is not home.', zh: '你好！我是 Grace。我的猫不在家。' },
        { en: '"Where is she?" I ask Mom.', zh: '“它在哪儿呢？”我问妈妈。' },
        { en: '"Look near the road," says Mom.', zh: '“到路边去找找吧。”妈妈说。' },
        { en: 'I walk out and look at every place.', zh: '我出门去，一个地方一个地方地看。' },
      ],
      [
        { en: 'I see my school. It is big.', zh: '我看见我的学校，它好大。' },
        { en: 'I see a hospital near the road.', zh: '我看见路边的一家医院。' },
        { en: 'I see a supermarket and a bakery.', zh: '我看见一家超市和一家面包店。' },
        { en: '"Look! My cat is near the bakery door!"', zh: '“快看！我的猫在面包店门口！”' },
      ],
      [
        { en: 'The man in the bakery says, "She wants bread."', zh: '面包店的男人说：“它是来要面包吃的。”' },
        { en: 'We go home. My cat eats the bread.', zh: '我们回到家。我的猫把面包吃了。' },
        { en: 'She is warm and soft. I am happy.', zh: '它暖暖的，软软的。我好开心。' },
        { en: '"I see a school, a hospital, a supermarket and a bakery," I say.', zh: '“我看见一所学校、一家医院、一家超市和一家面包店。”我说。' },
      ],
    ],
  },
}
