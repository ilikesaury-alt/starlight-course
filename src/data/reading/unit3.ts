// Unit 3 Food & Drinks 阅读短文（8 课）
// 照 unit1.ts 的形状手写：有情节的小故事，不是单词罗列。
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
import type { ReadingPassage } from './index'

export const unit3: Record<string, ReadingPassage> = {
  '3-1': {
    title: 'My Fruit Bag',
    titleZh: '我的水果袋',
    paragraphs: [
      [
        { en: 'Hello! I am Mia. I have a bag.', zh: '你好！我叫 Mia。我有一个袋子。' },
        { en: 'I put fruit in my bag now.', zh: '我现在把水果放进袋子里。' },
        { en: 'I have an apple, a peach and grapes.', zh: '我有一个苹果、一个桃子和一些葡萄。' },
        { en: 'The bag is big, but I can carry it.', zh: '袋子很大，但我拿得动它。' },
        { en: 'A little monkey comes and looks at me.', zh: '一只小猴子走过来看着我。' },
      ],
      [
        { en: 'Hello, watermelon! You are so big.', zh: '你好呀，西瓜！你好大呀。' },
        { en: 'The monkey wants my watermelon.', zh: '猴子想要我的西瓜。' },
        { en: "I say, 'One fruit for you, one for me.'", zh: '我说：「给你一个水果，给我一个水果。」' },
        { en: 'We sit down and eat all the fruit.', zh: '我们坐下来，把水果都吃掉。' },
        { en: 'The monkey waves bye and runs off.', zh: '猴子挥挥手说再见，然后跑走了。' },
        { en: 'Tomorrow I will bring more fruit.', zh: '明天我要带更多水果来。' },
      ],
    ],
  },
  '3-2': {
    title: 'A Box of Fruit',
    titleZh: '一盒水果',
    paragraphs: [
      [
        { en: 'Hello! My name is Ben. I love fruit.', zh: '你好！我叫 Ben。我爱水果。' },
        { en: 'Today I open my box at the park.', zh: '今天我在公园打开了我的盒子。' },
        { en: 'What is this? It is a red cherry.', zh: '这是什么？它是一颗红樱桃。' },
        { en: 'It is small, and it is so nice.', zh: '它很小，而且真好看。' },
        { en: 'Then I see a long yellow banana.', zh: '然后我看见一根长长的黄香蕉。' },
      ],
      [
        { en: 'Now look: one orange and one strawberry.', zh: '快看：一个橙子和一颗草莓。' },
        { en: 'The orange is big and very good.', zh: '这个橙子又大又好吃。' },
        { en: 'We sit on the grass and eat them.', zh: '我们坐在草地上把它们吃掉。' },
        { en: 'I share my fruit with my friends.', zh: '我和朋友们分享我的水果。' },
        { en: 'A big strawberry is the best one.', zh: '那颗大草莓是最好的一颗。' },
        { en: 'Tomorrow I will find more fruit.', zh: '明天我要再去找更多水果。' },
      ],
    ],
  },
  '3-3': {
    title: 'What Would You Like to Drink?',
    titleZh: '你想喝点什么',
    paragraphs: [
      [
        { en: 'Hello! I am Lily. I want a drink.', zh: '你好！我叫 Lily。我想喝点东西。' },
        { en: 'I run home from school with my friends.', zh: '我和朋友们跑着回家。' },
        { en: 'My mouth is dry and I am thirsty.', zh: '我的嘴巴干干的，我好渴。' },
        { en: "Mom says, 'What would you like to drink?'", zh: '妈妈说：「你想喝点什么？」' },
        { en: 'I would like some juice, please.', zh: '我想要一些果汁，谢谢。' },
        { en: 'Mom gives me milk and some bread.', zh: '妈妈给我牛奶和一些面包。' },
      ],
      [
        { en: "'Let's make some fruit juice,' says Dad.", zh: '爸爸说：「我们来做一些水果汁吧。」' },
        { en: 'We put apples in a big cup.', zh: '我们把苹果放进一个大杯子里。' },
        { en: 'Now we have juice, milk, soda and water.', zh: '现在我们有果汁、牛奶、汽水和水。' },
        { en: 'I drink the juice. It is very good.', zh: '我喝着果汁。真好喝。' },
        { en: 'My friends drink too, and we all smile.', zh: '我的朋友们也喝着，我们都笑了。' },
      ],
    ],
  },
  '3-4': {
    title: 'A Big Box of Vegetables',
    titleZh: '一大箱蔬菜',
    paragraphs: [
      [
        { en: "'Do you know these vegetables?' asks Mom.", zh: '妈妈问：「你认识这些蔬菜吗？」' },
        { en: "'Yes, I do! I like every vegetable.'", zh: '「认识呀！我每一种蔬菜都喜欢。」' },
        { en: 'A big box is at our door this morning.', zh: '今天早上一个大箱子放在我们家门口。' },
        { en: "'What colors are they?' I ask Mom.", zh: '我问妈妈：「它们是什么颜色的？」' },
        { en: "'Green broccoli and a red tomato!'", zh: '「绿色的西兰花和一个红番茄！」' },
      ],
      [
        { en: 'I wash all of them very clean.', zh: '我把它们全都洗干净。' },
        { en: 'Mom puts a potato and celery in the soup.', zh: '妈妈把一个土豆和芹菜放进汤里。' },
        { en: 'The soup is hot and very good.', zh: '这汤又热又好喝。' },
        { en: 'I bring some soup to my friends.', zh: '我给朋友们端了一些汤。' },
        { en: "'Tom, you like vegetables now!' says Lily.", zh: 'Lily 说：「Tom，你现在爱吃蔬菜了！」' },
        { en: 'Tomorrow we will make this soup again!', zh: '明天我们还要再煮一次这个汤！' },
      ],
    ],
  },
  '3-5': {
    title: 'Now I Like Vegetables',
    titleZh: '现在我爱吃蔬菜了',
    paragraphs: [
      [
        { en: 'Hello! I am Anna. I am hungry.', zh: '你好！我叫 Anna。我饿了。' },
        { en: 'Mom gives me a big green salad.', zh: '妈妈给我一大盘绿色的沙拉。' },
        { en: "'Do you like vegetables?' she asks.", zh: '她问：「你喜欢蔬菜吗？」' },
        { en: "'No, I don't like it,' I say.", zh: '我说：「不，我不喜欢它。」' },
        { en: 'I see lettuce, cucumber and a bean.', zh: '我看见生菜、黄瓜和一颗豆子。' },
      ],
      [
        { en: 'I try one carrot. It is good.', zh: '我试了一根胡萝卜。挺好吃的。' },
        { en: 'Then I try a bean and some cucumber.', zh: '然后我又试了一颗豆子和一些黄瓜。' },
        { en: 'I eat my salad with my bunny.', zh: '我和我的小兔子一起吃沙拉。' },
        { en: "'Yes, I do!' I say to Mom now.", zh: '我现在对妈妈说：「喜欢呀！」' },
        { en: "'Can I have more carrots?' I ask.", zh: '我问：「我可以再要点胡萝卜吗？」' },
        { en: 'Tomorrow I will eat a big salad.', zh: '明天我要吃一大盘沙拉。' },
      ],
    ],
  },
  '3-6': {
    title: 'The Big Food Quiz',
    titleZh: '大食物小测验',
    paragraphs: [
      [
        { en: 'Hello! Today we have a fun game.', zh: '你好！今天我们要玩一个好玩的游戏。' },
        { en: "I ask, 'What fruit do you like?'", zh: '我问：「你喜欢什么水果？」' },
        { en: "'I like apples and grapes,' says Ben.", zh: 'Ben 说：「我喜欢苹果和葡萄。」' },
        { en: "'Do you like every vegetable?' I ask.", zh: '我问大家：「每一种蔬菜你都爱吃吗？」' },
        { en: "'Yes, I do! Carrots are very good.'", zh: '「喜欢呀！胡萝卜可好吃了。」' },
      ],
      [
        { en: "Then I ask, 'What is four plus two?'", zh: '然后我问：「四加二是多少？」' },
        { en: "'Six is equal to four plus two!'", zh: '「六等于四加二！」' },
        { en: "'Yes!' says Leo, and we clap.", zh: 'Leo 说：「对！」我们一起拍手。' },
        { en: 'A cold drink is on my table now.', zh: '现在我的桌子上放着一杯凉饮料。' },
        { en: 'I share my fruit and my drink.', zh: '我把水果和饮料分给大家。' },
        { en: "'Good bye! See you tomorrow!'", zh: '「再见！明天见！」' },
      ],
    ],
  },
  '3-7': {
    title: 'Where Is My Snack?',
    titleZh: '我的零食去哪儿了',
    paragraphs: [
      [
        { en: 'Hello! I am Leo. I am hungry now.', zh: '你好！我叫 Leo。我现在饿了。' },
        { en: 'Mom puts five snacks in a big box.', zh: '妈妈在大盒子里装了五份零食。' },
        { en: 'I see chips, a lollipop and more.', zh: '我看见薯片、一根棒棒糖，还有别的。' },
        { en: 'A marshmallow is soft and white.', zh: '一颗棉花糖又软又白。' },
        { en: "'What a nice snack!' I say and smile.", zh: '我说：「多好吃的零食呀！」然后笑了。' },
      ],
      [
        { en: 'Then I look in the box again.', zh: '然后我又低头看了看盒子。' },
        { en: 'Where is my gummy bear? It is not here.', zh: '我的小熊软糖在哪儿？它不在这里。' },
        { en: 'I look under the table and the chair.', zh: '我看了桌子底下，也看了椅子底下。' },
        { en: 'A little mouse runs out with it!', zh: '一只小老鼠拿着它跑了出来！' },
        { en: 'Now I have five snacks for my friends.', zh: '现在我又有五份零食分给朋友们了。' },
        { en: 'Tomorrow we will make a snack box too.', zh: '明天我们也要做一个零食盒子。' },
      ],
    ],
  },
  '3-8': {
    title: 'Snack Time with My Bunny',
    titleZh: '和小兔的零食时间',
    paragraphs: [
      [
        { en: 'Hello! I am Grace. I want a snack.', zh: '你好！我叫 Grace。我想要一份零食。' },
        { en: 'Mom puts popcorn and candy in my bag.', zh: '妈妈把爆米花和糖果放进我的包里。' },
        { en: 'I want a jelly bean and one nut too.', zh: '我还想要一颗果冻豆和一颗坚果。' },
        { en: "'What do you want?' asks my bunny.", zh: '我的小兔子问：「你想要什么？」' },
        { en: 'We sit down on the grass and eat.', zh: '我们在草地上坐下来吃。' },
      ],
      [
        { en: 'The popcorn is hot, and I like it.', zh: '爆米花是热的，我很喜欢。' },
        { en: 'I give the bunny one jelly bean.', zh: '我给小兔子一颗果冻豆。' },
        { en: "'Do you want this candy?' I ask.", zh: '我问：「你想吃这颗糖吗？」' },
        { en: "'Yes, I want it!' says the little bunny.", zh: '小兔子说：「想呀！我想要！」' },
        { en: 'We eat all the snacks and we are happy.', zh: '我们把零食都吃光了，我们很开心。' },
        { en: 'Tomorrow I want to make more popcorn.', zh: '明天我还想再做一锅爆米花。' },
      ],
    ],
  },
}
