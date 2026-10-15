// Unit 1 Hello! 阅读短文（8 课）
// 试点单元：先手写定质量基线，其余单元照此产出。
// 用词口径见 ../baseVocab.ts（零超纲）；本课每个词都要出现在短文里，单测硬卡。
import type { ReadingPassage } from './index'

export const unit1: Record<string, ReadingPassage> = {
  '1-1': {
    title: 'Hello, My Friend',
    titleZh: '你好，我的朋友',
    paragraphs: [
      [
        { en: 'Hello! I am a small cat.', zh: '你好！我是一只小猫。' },
        { en: 'Today I meet a new friend.', zh: '今天我认识了一位新朋友。' },
        { en: 'The bird says hello to me.', zh: '小鸟向我问好。' },
        { en: 'Hello! My name is Sam.', zh: '你好！我叫 Sam。' },
        { en: 'I am good, and I am great.', zh: '我很好，我很棒。' },
        { en: 'Sam is a good boy.', zh: 'Sam 是个好男孩。' },
      ],
      [
        { en: 'We are friends now.', zh: '我们现在是好朋友了。' },
        { en: 'My friend has a big red ball.', zh: '我的朋友有一个大红球。' },
        { en: 'We play and run all day.', zh: '我们玩呀跑呀一整天。' },
        { en: 'Hello, my friend! How are you?', zh: '你好呀，我的朋友！你好吗？' },
        { en: 'I am great. You are great too.', zh: '我很棒。你也很棒。' },
        { en: 'Good bye! See you tomorrow.', zh: '再见！明天见。' },
      ],
    ],
  },
  '1-2': {
    title: 'Good Morning',
    titleZh: '早上好',
    paragraphs: [
      [
        { en: 'Hello! Good morning!', zh: '你好！早上好！' },
        { en: 'The sun is up and it is new.', zh: '太阳升起来了，今天是新的一天。' },
        { en: 'I say good morning to my mom.', zh: '我对妈妈说早上好。' },
        { en: 'My mom says hello and she is good.', zh: '妈妈说你好，她也很好。' },
        { en: 'Good afternoon! The sun is hot.', zh: '下午好！太阳很热。' },
        { en: 'I eat my food with my family.', zh: '我和家人一起吃饭。' },
      ],
      [
        { en: 'Good evening! The moon is out.', zh: '晚上好！月亮出来了。' },
        { en: 'The stars are big and white.', zh: '星星又大又白。' },
        { en: 'I play with my cat and my dog.', zh: '我和我的猫、我的狗一起玩。' },
        { en: 'Hello, moon! I am very happy.', zh: '你好呀月亮！我非常开心。' },
        { en: 'Good morning, good afternoon, good evening!', zh: '早上好，下午好，晚上好！' },
      ],
    ],
  },
  '1-3': {
    title: 'Look at Me',
    titleZh: '看看我',
    paragraphs: [
      [
        { en: 'Look at me! I am a new boy.', zh: '看看我！我是一个新来的男孩。' },
        { en: 'Look at the mirror and smile.', zh: '照照镜子，笑一个。' },
        { en: 'The mirror is big and clean.', zh: '镜子又大又干净。' },
        { en: 'Who is missing? I can not see her.', zh: '谁不见了？我看不到她了。' },
        { en: 'A girl is behind the door.', zh: '门后面有一个女孩。' },
        { en: 'Hello! My name is Lily.', zh: '你好！我叫 Lily。' },
      ],
      [
        { en: 'Come here and look at my picture.', zh: '过来看看我的图画。' },
        { en: 'We are a boy and a girl.', zh: '我们是一个男孩和一个女孩。' },
        { en: 'Look, two boys and one girl!', zh: '看，两个男孩和一个女孩！' },
        { en: 'The girl has a big red ball.', zh: '女孩有一个大红球。' },
        { en: 'Now no one is missing.', zh: '现在一个人也不见了。' },
        { en: 'Good bye! See you tomorrow.', zh: '再见！明天见。' },
      ],
    ],
  },
  '1-4': {
    title: 'I Love Colors',
    titleZh: '我爱颜色',
    paragraphs: [
      [
        { en: 'What color is the balloon?', zh: '这个气球是什么颜色？' },
        { en: 'The balloon is red and big.', zh: '气球又大又红。' },
        { en: 'I like red, yellow and blue.', zh: '我喜欢红色、黄色和蓝色。' },
        { en: 'My cat likes the red balloon.', zh: '我的猫喜欢那个红气球。' },
        { en: 'Look! The blue balloon can fly.', zh: '看！蓝气球会飞。' },
        { en: 'I can see a yellow balloon too.', zh: '我还能看到一个黄气球。' },
      ],
      [
        { en: 'The colors are all in the sky.', zh: '这些颜色都在天上。' },
        { en: 'Give me the red one, please.', zh: '请把那个红的给我。' },
        { en: 'Hello, colors! I love you.', zh: '你好呀，颜色！我爱你们。' },
        { en: 'What color do you like?', zh: '你喜欢什么颜色？' },
        { en: 'My friend likes blue and yellow.', zh: '我的朋友喜欢蓝色和黄色。' },
        { en: 'We play with the balloons all day.', zh: '我们拿着气球玩一整天。' },
      ],
    ],
  },
  '1-5': {
    title: 'Mix It Up',
    titleZh: '把颜色混起来',
    paragraphs: [
      [
        { en: 'Blue and yellow make green.', zh: '蓝色加黄色变成绿色。' },
        { en: 'Red and blue make purple.', zh: '红色加蓝色变成紫色。' },
        { en: 'Red and yellow make orange.', zh: '红色加黄色变成橙色。' },
        { en: 'I like green and orange.', zh: '我喜欢绿色和橙色。' },
        { en: 'Look at the rainbow! It is big.', zh: '看那彩虹！它好大。' },
        { en: 'I see red, yellow and blue in it.', zh: '我在里面看到红、黄和蓝。' },
      ],
      [
        { en: 'What color do you like?', zh: '你喜欢什么颜色？' },
        { en: 'I like purple. My mom likes green.', zh: '我喜欢紫色。妈妈喜欢绿色。' },
        { en: 'We make the colors in one big box.', zh: '我们把颜色装进一个大盒子。' },
        { en: 'The rainbow has many colors.', zh: '彩虹有许多颜色。' },
        { en: 'Hello, rainbow! You are great.', zh: '你好呀，彩虹！你真棒。' },
        { en: 'Look up! The sky is green and blue.', zh: '抬头看！天空是绿蓝色的。' },
      ],
    ],
  },
  '1-6': {
    title: 'Hello, What Is Your Name?',
    titleZh: '你好，你叫什么名字',
    paragraphs: [
      [
        { en: 'Hello! My name is Tom.', zh: '你好！我叫 Tom。' },
        { en: 'I am a boy. What is your name?', zh: '我是男孩。你叫什么名字？' },
        { en: 'My name is Mia. I am a girl.', zh: '我叫 Mia。我是女孩。' },
        { en: 'Are you a boy or a girl?', zh: '你是男孩还是女孩？' },
        { en: 'Hello, Tom! Hello, Mia!', zh: '你好，Tom！你好，Mia！' },
        { en: 'We are good friends now.', zh: '我们现在是好朋友了。' },
      ],
      [
        { en: 'What color is the balloon?', zh: '这个气球是什么颜色？' },
        { en: 'It is red, and it is big.', zh: '它是红色的，而且很大。' },
        { en: 'What color do you like?', zh: '你喜欢什么颜色？' },
        { en: 'I like blue. Mia likes green.', zh: '我喜欢蓝色。Mia 喜欢绿色。' },
        { en: 'Look at me! I know my name.', zh: '看看我！我知道我的名字。' },
        { en: 'Good bye, boy and girl!', zh: '再见，男孩和女孩！' },
      ],
    ],
  },
  '1-7': {
    title: 'Let Us Count',
    titleZh: '我们来数数',
    paragraphs: [
      [
        { en: "Let's count with me!", zh: '跟我一起数！' },
        { en: 'One cat, two dogs, three birds.', zh: '一只猫、两条狗、三只鸟。' },
        { en: 'Four fish and five ducks in the water.', zh: '四条鱼和五只鸭子在水里。' },
        { en: 'I can count all of them.', zh: '我全都能数出来。' },
        { en: 'One, two, three, four, five!', zh: '一、二、三、四、五！' },
        { en: 'What number is missing?', zh: '哪个数字不见了？' },
      ],
      [
        { en: 'Five is missing. Look!', zh: '五不见了。看！' },
        { en: 'I find it in my bag.', zh: '我在包里找到它了。' },
        { en: 'Now I can count one to five.', zh: '现在我能从一数到五。' },
        { en: 'My mom can count too.', zh: '我妈妈也会数。' },
        { en: 'We count the balls and the books and the cats.', zh: '我们数球、书和猫。' },
        { en: 'Hello, numbers! You are fun.', zh: '你好呀，数字！你们真好玩。' },
      ],
    ],
  },
  '1-8': {
    title: 'I Know My Numbers',
    titleZh: '我认识数字',
    paragraphs: [
      [
        { en: 'I know my numbers now.', zh: '我现在认识这些数字了。' },
        { en: 'Six, seven, eight, nine and ten.', zh: '六、七、八、九和十。' },
        { en: 'I can say them all to you.', zh: '我可以把它们都念给你听。' },
        { en: 'Look! Six frogs in the water are very happy.', zh: '看！水里的六只青蛙非常开心。' },
        { en: 'Seven birds sit on the green tree.', zh: '七只鸟坐在绿树上。' },
        { en: 'Eight fish swim all day.', zh: '八条鱼游了一整天。' },
      ],
      [
        { en: 'Nine cats are very happy.', zh: '九只猫非常开心。' },
        { en: 'Ten birds fly to the zoo.', zh: '十只鸟飞到动物园。' },
        { en: 'What number is missing?', zh: '哪个数字不见了？' },
        { en: 'Eight is missing. I find it!', zh: '八不见了。我找到它了！' },
        { en: 'My mom counts to ten with me.', zh: '妈妈和我一起数到十。' },
        { en: 'Good bye, numbers! See you tomorrow.', zh: '再见，数字！明天见。' },
      ],
    ],
  },
}