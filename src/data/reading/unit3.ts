// Unit 3 Food & Drinks 阅读短文（8 课）
// 照 unit1.ts 的形状手写：有情节的小故事，不是单词罗列。
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
//
// 2026-11-02 文体改写：8 篇全部重写为「一个小故事」——
//   3-1 小猴子分西瓜；3-2 一盒水果分给朋友；3-3 四种饮料解渴；
//   3-4 汤太香，Tom 改口；3-5 咬一口胡萝卜，爱上沙拉；3-6 问答赢来的食物大家分；
//   3-7 小老鼠叼走软糖，用棒棒糖换回来；3-8 零食和 Bunny 一起分享。
//   对话推进 + 结尾回声（同一句话变形回来），中文同步改口语、有画面感。
import type { ReadingPassage } from './index'

export const unit3: Record<string, ReadingPassage> = {
  '3-1': {
    title: 'My Fruit Bag',
    titleZh: '我的水果袋',
    paragraphs: [
      [
        { en: 'Hello! I am Mia. I have a big bag.', zh: '你好！我是 Mia。我有一个大袋子。' },
        { en: 'I put an apple, a peach and grapes in it.', zh: '我把一个苹果、一个桃子和一些葡萄放了进去。' },
        { en: 'A big watermelon is in it.', zh: '里面还放着一个大西瓜。' },
        { en: 'My bag is too big. I can not carry it.', zh: '我的袋子太大了，我拿不动它。' },
      ],
      [
        { en: 'A little monkey comes and looks at my bag.', zh: '一只小猴子走过来，盯着我的袋子看。' },
        { en: '"Hello, Mia! Which fruit do you like?"', zh: '“你好呀，Mia！你喜欢哪种水果？”' },
        { en: '"I like grapes. Do you like the watermelon?"', zh: '“我喜欢葡萄。你喜欢西瓜吗？”' },
        { en: '"Yes! I want that big watermelon," says the monkey.', zh: '“喜欢！我想要那个大西瓜。”猴子说。' },
      ],
      [
        { en: 'We sit down and eat the watermelon together.', zh: '我们坐下来，一起吃西瓜。' },
        { en: 'The watermelon is cold and good.', zh: '西瓜又凉又好吃。' },
        { en: '"Hello, watermelon! You are so good!"', zh: '“你好呀，西瓜！你真好吃！”' },
        { en: 'The bag is small now. I can carry it home.', zh: '现在袋子变小了，我拎得动它回家了。' },
      ],
    ],
  },
  '3-2': {
    title: 'A Box of Fruit',
    titleZh: '一盒水果',
    paragraphs: [
      [
        { en: 'Hello! I am Ben. Today I open my box.', zh: '你好！我是 Ben。今天我打开了我的盒子。' },
        { en: '"What is this? It is a red cherry."', zh: '“这是什么？是一颗红红的樱桃。”' },
        { en: 'It is small. I eat it and smile.', zh: '它小小的。我咬一口，笑了。' },
        { en: 'Then I find a long yellow banana.', zh: '接着我又摸到一根长长的黄香蕉。' },
        { en: '"Wow! My box has fruit for two!"', zh: '“哇！我的盒子里有两人份的水果！”' },
      ],
      [
        { en: 'Leo comes and sits down with me.', zh: 'Leo 走过来，在我身边坐下。' },
        { en: '"Look! A big orange and a red strawberry."', zh: '“快看！一个大橙子，还有一颗红草莓。”' },
        { en: '"Can I have the strawberry?" asks Leo.', zh: '“我可以吃那颗草莓吗？”Leo 问。' },
      ],
      [
        { en: '"Yes! Here you are," I say and give it to him.', zh: '“当然可以！给你。”我把它递给他。' },
        { en: 'We eat the fruit and laugh together.', zh: '我们一起吃水果，一起笑。' },
        { en: 'Now my box is empty, but I am happy.', zh: '现在盒子空空的，可我心里美滋滋的。' },
        { en: '"Hello, fruit! I will bring you more."', zh: '“你好呀，水果！明天我还要带更多来。”' },
      ],
    ],
  },
  '3-3': {
    title: 'What Would You Like to Drink?',
    titleZh: '你想喝点什么',
    paragraphs: [
      [
        { en: 'Hello! I am Lily. I run home from school.', zh: '你好！我是 Lily。我从学校跑回家。' },
        { en: 'I am thirsty. My mouth is dry.', zh: '我好渴，嘴巴干干的。' },
        { en: '"What would you like to drink?" asks Mom.', zh: '“你想喝点什么呀？”妈妈问。' },
        { en: '"I would like some juice, please."', zh: '“我想喝点果汁，谢谢。”' },
      ],
      [
        { en: '"Let\'s make four fruit drinks," says Dad.', zh: '“我们来做四杯水果饮料吧。”爸爸说。' },
        { en: 'We wash apples and put them in a big cup.', zh: '我们把苹果洗一洗，全放进大杯子里。' },
        { en: 'Now we have juice, milk, soda and water.', zh: '现在桌上有果汁、牛奶、汽水，还有水。' },
        { en: 'I drink the juice. It is cold and good.', zh: '我喝着果汁，凉凉的，真好喝。' },
      ],
      [
        { en: 'Then my friends come and ask for a drink.', zh: '这时候朋友们来了，也想喝点什么。' },
        { en: '"We have four," I say. "Take one each!"', zh: '“我们有四杯呢，”我说，“一人一杯！”' },
        { en: 'We all drink and we all smile.', zh: '大家都喝着，都笑起来了。' },
        { en: '"Now I know what I want to drink!"', zh: '“现在我知道自己想喝什么啦！”' },
      ],
    ],
  },
  '3-4': {
    title: 'A Big Box of Vegetables',
    titleZh: '一大箱蔬菜',
    paragraphs: [
      [
        { en: '"Do you know these vegetables?" asks Mom.', zh: '“你认识这些蔬菜吗？”妈妈问。' },
        { en: 'A big box is at our door this morning.', zh: '今天早上，一个大箱子放在我们家门口。' },
        { en: '"What colors are they?" I ask Mom.', zh: '“它们都是什么颜色的？”我问妈妈。' },
        { en: '"Green broccoli and a red tomato!"', zh: '“绿色的西兰花，还有一个红番茄！”' },
        { en: '"I do not like vegetables," says Tom.', zh: '“我不爱吃蔬菜。”Tom 说。' },
      ],
      [
        { en: 'I wash all of them very clean.', zh: '我把这些蔬菜全都洗得干干净净。' },
        { en: 'Mom puts a potato and celery in the soup.', zh: '妈妈把土豆和芹菜放进汤里。' },
        { en: 'The soup is hot and it looks so good.', zh: '这汤又热腾腾的，看着就好香。' },
      ],
      [
        { en: '"Can I try one cup?" asks Tom.', zh: '“我能尝一杯吗？”Tom 问。' },
        { en: '"Yes! Take a little," says Mom.', zh: '“行呀！少盛一点。”妈妈说。' },
        { en: 'Tom eats the soup and the celery.', zh: 'Tom 把汤和芹菜都吃了。' },
        { en: '"Mom, now I like vegetables," says Tom.', zh: '“妈妈，我现在爱吃蔬菜了。”Tom 说。' },
      ],
    ],
  },
  '3-5': {
    title: 'Now I Like Vegetables',
    titleZh: '现在我爱吃蔬菜了',
    paragraphs: [
      [
        { en: 'Hello! I am Anna. I am hungry now.', zh: '你好！我是 Anna。我现在饿了。' },
        { en: 'Mom gives me a big green salad.', zh: '妈妈端给我一大盘绿绿的沙拉。' },
        { en: '"Do you like vegetables?" she asks.', zh: '“你喜欢吃蔬菜吗？”她问。' },
        { en: '"No, I don\'t. I only like fruit."', zh: '“不喜欢。我只爱吃水果。”' },
      ],
      [
        { en: 'I look at the salad. It has lettuce and cucumber.', zh: '我看着这盘沙拉：里面有生菜，还有黄瓜。' },
        { en: 'And there is one small bean in it.', zh: '还有一颗小小的豆子。' },
        { en: '"Just one try," says Mom. I try a carrot.', zh: '“就尝一口嘛。”妈妈说。我咬了一根胡萝卜。' },
        { en: 'The carrot is cold and good.', zh: '胡萝卜脆脆的，还挺好吃的。' },
      ],
      [
        { en: 'Then I try a bean and some cucumber.', zh: '接着我又尝了豆子和黄瓜。' },
        { en: 'Now I eat all the salad!', zh: '现在我把整盘沙拉都吃光啦！' },
        { en: '"Yes, I do! I like vegetables," I say.', zh: '“喜欢呀！我爱蔬菜。”我说。' },
        { en: '"Can I have more carrots?" I ask Mom.', zh: '“我能再要点胡萝卜吗？”我问妈妈。' },
      ],
    ],
  },
  '3-6': {
    title: 'The Big Food Quiz',
    titleZh: '大食物小测验',
    paragraphs: [
      [
        { en: 'Hello! Today we play a big food game.', zh: '你好！今天我们要玩一场食物大问答。' },
        { en: 'Mom puts a box of food on the table.', zh: '妈妈把一盒吃的放在桌子上。' },
        { en: '"The one with the most answers takes it," says Mom.', zh: '“答得最多的人，抱走这盒吃的。”妈妈说。' },
      ],
      [
        { en: '"What fruit do you like?" I ask Ben.', zh: '“你喜欢什么水果？”我问 Ben。' },
        { en: '"I like apples and grapes," says Ben.', zh: '“我喜欢苹果和葡萄。”Ben 说。' },
        { en: '"Do you like every vegetable?" I ask Tom.', zh: '“每一种蔬菜你都爱吃吗？”我问 Tom。' },
        { en: '"I like carrots," says Tom.', zh: '“我喜欢胡萝卜。”Tom 说。' },
        { en: '"What is four plus two?" asks Leo.', zh: '“四加二等于多少？”Leo 问。' },
        { en: '"Six is equal to four plus two!"', zh: '“六就等于四加二！”' },
      ],
      [
        { en: 'Leo knows all the answers. He is so happy.', zh: 'Leo 什么都答得上来，他高兴极了。' },
        { en: '"But we share it, one for you, one for me."', zh: '“可是我们分着吃，一人一份。”' },
        { en: '"Now we all have food and a drink."', zh: '“现在大家都有吃的，还有喝的啦。”' },
      ],
    ],
  },
  '3-7': {
    title: 'Where Is My Snack?',
    titleZh: '我的零食去哪儿了',
    paragraphs: [
      [
        { en: 'Hello! I am Leo. I am hungry now.', zh: '你好！我是 Leo。我现在饿坏了。' },
        { en: 'Mom puts five snacks in a big box.', zh: '妈妈往大盒子里装了五份零食。' },
        { en: 'I see chips, a lollipop and a marshmallow.', zh: '我看见薯片、一根棒棒糖，还有一颗棉花糖。' },
        { en: '"What a nice snack box!" I say.', zh: '“多好的零食盒子呀！”我说。' },
      ],
      [
        { en: 'Then I look in the box again.', zh: '接着我又低头看了看盒子。' },
        { en: 'Where is my gummy bear? It is not here.', zh: '我的小熊软糖在哪儿？它不在这里。' },
        { en: 'I look under the table and the chair.', zh: '我看了桌子底下，也看了椅子底下。' },
        { en: 'A little mouse runs out with it!', zh: '一只小老鼠叼着它跑了出来！' },
      ],
      [
        { en: '"Hello! Do you want the lollipop?" I ask.', zh: '“你好！你想要这根棒棒糖吗？”我问。' },
        { en: 'The mouse takes it and gives back the bear.', zh: '小老鼠接过棒棒糖，又把软糖还给我。' },
        { en: 'Now I have five snacks for my friends.', zh: '现在我又凑齐五份零食，分给朋友们。' },
        { en: '"Bye bye, little mouse! See you tomorrow."', zh: '“再见啦，小老鼠！明天见。”' },
      ],
    ],
  },
  '3-8': {
    title: 'Snack Time with My Bunny',
    titleZh: '和小兔的零食时间',
    paragraphs: [
      [
        { en: 'Hello! I am Grace. I want a snack.', zh: '你好！我是 Grace。我想吃点零食。' },
        { en: 'Mom makes popcorn. It is hot and good.', zh: '妈妈做了爆米花，热乎乎的，真香。' },
        { en: 'She puts candy, a jelly bean and a nut in my bag.', zh: '她往我包里放糖果、果冻豆，还有一颗坚果。' },
        { en: 'My bunny comes. "What do you want?" she asks.', zh: '我的小兔子来了。“你想要什么呀？”她问。' },
      ],
      [
        { en: '"I want popcorn," I say. We sit on the grass.', zh: '“我想吃爆米花。”我说。我们在草地上坐下。' },
        { en: 'Then the bunny takes my candy!', zh: '结果小兔子把我的糖果叼走了！' },
        { en: '"Oh no! I want that candy too," I say.', zh: '“哎呀！那我也想吃糖果呀。”我说。' },
        { en: '"We can share it," says the bunny.', zh: '“我们可以分着吃呀。”小兔子说。' },
      ],
      [
        { en: 'Now we have one candy each.', zh: '现在我们一人一颗糖果。' },
        { en: 'The popcorn is hot, and I like it.', zh: '爆米花热热的，我特别爱吃。' },
        { en: '"What do you want?" I ask again.', zh: '“你想要什么呀？”我又问了一遍。' },
        { en: '"I want a friend," says the bunny.', zh: '“我想要一个朋友。”小兔子说。' },
      ],
    ],
  },
}
