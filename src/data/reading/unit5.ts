// Unit 5 Opposites 阅读短文（8 课）
// 本单元教成对反义词（big/small、loud/quiet、fast/slow、good/bad、fat/thin、happy/sad、hot/cold），
// 所以每篇都用「两样东西摆在一起比」来推进故事，反义对照顺带落在情节里，不用另起一句做练习。
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
import type { ReadingPassage } from './index'

export const unit5: Record<string, ReadingPassage> = {
  '5-1': {
    title: 'The Ant and the Big Lion',
    titleZh: '蚂蚁和大狮子',
    paragraphs: [
      [
        { en: 'Hello, ant! I am a big lion.', zh: '你好呀，蚂蚁！我是一只大狮子。' },
        { en: 'I come to the park with my friend.', zh: '我和朋友一起来到公园。' },
        { en: 'My head is big. My nose is big.', zh: '我的头很大。我的鼻子也很大。' },
        { en: 'The little ant looks up and says hi.', zh: '小蚂蚁抬头向上，跟我打招呼。' },
        { en: 'Is it big or small? It is very small.', zh: '它是大的还是小的？它非常小。' },
      ],
      [
        { en: 'The ant shows me a big tree.', zh: '蚂蚁给我看一棵大树。' },
        { en: 'It shows me a small flower too.', zh: '它还给我看一朵小花。' },
        { en: 'Look! The tree is big and tall.', zh: '看！那棵树又大又高。' },
        { en: 'The flower is small and very soft.', zh: '那朵花又小又软。' },
        { en: 'I want a tree and a flower too.', zh: '我也想要一棵树和一朵花。' },
        { en: 'Come here tomorrow, little ant!', zh: '小蚂蚁，明天再来这里呀！' },
      ],
    ],
  },
  '5-2': {
    title: 'Quieter and Quieter',
    titleZh: '越来越安静',
    paragraphs: [
      [
        { en: 'Mia plays and sings in her room.', zh: 'Mia 在自己的房间里又唱又玩。' },
        { en: 'The drumbeat is very, very loud.', zh: '那鼓声非常非常大。' },
        { en: 'The room is loud too.', zh: '房间里也很吵。' },
        { en: 'The dog runs out of the room.', zh: '小狗跑出了房间。' },
        { en: 'The bird flies out of the tree.', zh: '小鸟飞出了树。' },
        { en: 'The baby starts to cry.', zh: '宝宝哭了起来。' },
        { en: 'Oh no! What is very loud?', zh: '哎呀！是什么这么大声？' },
      ],
      [
        { en: 'Mia says sorry to the baby.', zh: 'Mia 对宝宝说对不起。' },
        { en: 'Now she does not play. It is quiet.', zh: '现在她不敲了。安静下来了。' },
        { en: 'She comes near to my ear.', zh: '她走到我耳边。' },
        { en: 'Listen! She has a whisper for me.', zh: '听！她给我一句悄悄话。' },
        { en: 'Quieter and quieter. The baby smiles at me.', zh: '越来越安静。宝宝对我笑了。' },
      ],
    ],
  },
  '5-3': {
    title: 'The Rabbit and the Turtle',
    titleZh: '兔子和乌龟',
    paragraphs: [
      [
        { en: 'Sam has a rabbit and a turtle.', zh: 'Sam 有一只兔子和一只乌龟。' },
        { en: 'The rabbit is fast. The turtle is slow.', zh: '兔子很快。乌龟很慢。' },
        { en: 'Ready? Go! They start to run.', zh: '准备好了吗？开始！它们跑了起来。' },
        { en: 'The rabbit runs and runs very fast.', zh: '兔子跑呀跑，跑得飞快。' },
        { en: 'The turtle is slow, but it does not stop.', zh: '乌龟很慢，但它没有停下来。' },
      ],
      [
        { en: 'The rabbit jumps over the road.', zh: '兔子跳过了马路。' },
        { en: 'The turtle walks on. One foot, two feet.', zh: '乌龟继续走。一只脚，两只脚。' },
        { en: 'The rabbit sees a big tree.', zh: '兔子看见一棵大树。' },
        { en: 'It sleeps under the tree.', zh: '它在大树下睡着了。' },
        { en: 'The turtle is at the tree now!', zh: '现在乌龟到树边上了！' },
        { en: 'The rabbit gets up and runs again.', zh: '兔子爬起来，又跑了起来。' },
        { en: 'Who is faster? Come and look!', zh: '谁更快呢？快来看！' },
      ],
    ],
  },
  '5-4': {
    title: 'My Car Is Not Good Yet',
    titleZh: '我的车还没画好',
    paragraphs: [
      [
        { en: 'Leo wants to draw a car for his mom.', zh: 'Leo 想给妈妈画一辆车。' },
        { en: 'He draws a big black car.', zh: '他画了一辆大大的黑车。' },
        { en: 'Is it good? No, it is bad.', zh: '画得好吗？不好，它很糟。' },
        { en: 'The car has no eyes and no door.', zh: '这辆车没有眼睛，也没有门。' },
        { en: 'His mom says it is awful.', zh: '妈妈说它太糟糕了。' },
      ],
      [
        { en: 'Leo is sad, but he tries again.', zh: 'Leo 有点难过，但他又试了一次。' },
        { en: 'Now he draws eyes, a door and a window.', zh: '这次他画上了眼睛、门和窗户。' },
        { en: 'He draws a big sun in the sky.', zh: '他还在天上画了一个大太阳。' },
        { en: 'Is it good now? Yes, it is very good!', zh: '现在画得好吗？嗯，非常好！' },
        { en: 'His mom likes the new car.', zh: '妈妈喜欢这辆新画的车。' },
        { en: 'Leo puts the bad picture in his bag.', zh: 'Leo 把那张画坏的车收进了包里。' },
        { en: 'Tomorrow he will draw one more car.', zh: '明天他还要再画一辆车。' },
      ],
    ],
  },
  '5-5': {
    title: 'Which Cat Is Fat?',
    titleZh: '哪只猫胖',
    paragraphs: [
      [
        { en: 'Look at this cat! It is very fat.', zh: '看这只猫！它好胖。' },
        { en: 'The cat eats cake all day.', zh: '这只猫整天都在吃蛋糕。' },
        { en: 'It sits on my soft bed.', zh: '它整天坐在我软软的床上。' },
        { en: 'It can not run fast. It is slow.', zh: '它跑不快。它很慢。' },
        { en: 'My friend says my cat is too fat.', zh: '朋友说我的猫太胖了。' },
      ],
      [
        { en: 'We go to the park to see a monkey.', zh: '我们到公园去看猴子。' },
        { en: 'The monkey sits on a tree.', zh: '猴子坐在一棵树上。' },
        { en: 'One cat is fat and one cat is thin.', zh: '一只猫胖胖的，一只猫瘦瘦的。' },
        { en: 'The thin cat can jump and climb.', zh: '瘦猫又会跳又会爬。' },
        { en: 'The fat cat sleeps all day.', zh: '胖猫整天都在睡觉。' },
        { en: 'Which monkey is fat? Which cat is fat?', zh: '哪只猴子胖？哪只猫胖？' },
        { en: 'Come and see my fat cat tomorrow!', zh: '明天来看看我的胖猫吧！' },
      ],
    ],
  },
  '5-6': {
    title: 'Our Opposites Game',
    titleZh: '我们的反义词游戏',
    paragraphs: [
      [
        { en: 'Today we play a game in the park.', zh: '今天我们在公园里玩一个游戏。' },
        { en: 'My friends and I sit on the grass.', zh: '我和朋友们坐在草地上。' },
        { en: 'Is the tree big or small? It is big.', zh: '这树是大还是小？它很大。' },
        { en: 'Is the ant fast or slow? It is slow.', zh: '蚂蚁是快还是慢？它很慢。' },
        { en: 'Yes! We get one point.', zh: '答对了！我们得一分。' },
      ],
      [
        { en: 'Is your lion good or bad? Good!', zh: '你的狮子是好还是坏？好的！' },
        { en: 'Is your cat thin or fat? Fat!', zh: '你的猫是瘦还是胖？胖的！' },
        { en: 'Is it loud or quiet now? It is quiet.', zh: '现在是吵还是安静？很安静。' },
        { en: 'How do you feel? I feel very happy.', zh: '你感觉怎么样？我非常开心。' },
        { en: 'We clap and sing a song.', zh: '我们拍着手唱歌。' },
        { en: 'Tomorrow we will play the game again.', zh: '明天我们还要再玩这个游戏。' },
      ],
    ],
  },
  '5-7': {
    title: 'From Sad to Happy',
    titleZh: '从难过到开心',
    paragraphs: [
      [
        { en: 'It is a cold day and it rains.', zh: '今天很冷，还下着雨。' },
        { en: 'I sit at the window and draw.', zh: '我坐在窗边画画。' },
        { en: 'I can not play out today.', zh: '我今天不能出去玩。' },
        { en: 'I feel very sad today.', zh: '我今天很难过。' },
        { en: 'My picture is bad. I do not like it.', zh: '我画得很糟，我不喜欢。' },
      ],
      [
        { en: 'Then my mom comes to the door.', zh: '这时妈妈来到门口。' },
        { en: 'My friend Mia has a big cake.', zh: '我的朋友 Mia 带来一个大蛋糕。' },
        { en: 'How do you feel? I feel happy now.', zh: '你感觉怎么样？我现在很开心。' },
        { en: 'If you are happy, clap your hands.', zh: '开心的话，就拍拍手。' },
        { en: 'I clap and clap. My mom claps too.', zh: '我拍呀拍，妈妈也拍手。' },
        { en: 'We sing and laugh all afternoon.', zh: '我们唱着歌笑了整个下午。' },
        { en: 'Tomorrow I will draw the sun.', zh: '明天我要画一个太阳。' },
      ],
    ],
  },
  '5-8': {
    title: 'The Snowman in the Yard',
    titleZh: '院子里的雪人',
    paragraphs: [
      [
        { en: 'It is very hot in the yard today.', zh: '今天院子里非常热。' },
        { en: 'The sun is big and very hot.', zh: '太阳又大又热。' },
        { en: 'Ben wants a snowman, but there is no snow.', zh: 'Ben 想要一个雪人，可是没有雪。' },
        { en: 'So he makes a snowman with big ice.', zh: '于是他用大冰块做了一个雪人。' },
        { en: 'The snowman is white and very cold.', zh: '雪人雪白的，非常冷。' },
      ],
      [
        { en: 'Ben puts him near the cold window.', zh: 'Ben 把它放在冷冷的窗户旁边。' },
        { en: 'The cat sleeps near him.', zh: '小猫睡在他旁边。' },
        { en: 'It is cold in the house now.', zh: '现在屋里很冷。' },
        { en: 'Is the snowman hot? No, it is cold.', zh: '雪人热吗？不，它很冷。' },
        { en: 'Ben is not hot. He feels very cool.', zh: 'Ben 不热了。他感觉很凉快。' },
        { en: 'Look! The snowman is now very small.', zh: '看！雪人现在变得很小很小。' },
        { en: 'Come and see him tomorrow!', zh: '明天来看看他吧！' },
      ],
    ],
  },
}
