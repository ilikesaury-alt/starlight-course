// Unit 4 Toys & Fun 阅读短文（8 课）
// 照 unit1.ts 的先例手写：用词口径见 ../baseVocab.ts（零超纲），本课每个词都要出现在短文里，单测硬卡。
// 本单元自有词：toy shop 那课刻意避开 shop/shopping（不在允许词表内），用「toy place」表达同一个场景。
import type { ReadingPassage } from './index'

export const unit4: Record<string, ReadingPassage> = {
  '4-1': {
    title: 'My Toy Box',
    titleZh: '我的玩具箱',
    paragraphs: [
      [
        { en: 'My name is Lily.', zh: '我叫 Lily。' },
        { en: 'Today I open my big toy box.', zh: '今天我打开我的大玩具箱。' },
        { en: 'I have a doll and many blocks.', zh: '我有一个洋娃娃和许多积木。' },
        { en: 'I have red play dough too.', zh: '我还有红色的橡皮泥。' },
        { en: 'My puzzle is not in the box.', zh: '我的拼图不在箱子里。' },
        { en: 'Where is it? I look and look.', zh: '它在哪儿？我看了又看。' },
      ],
      [
        { en: 'I go under my bed and look again.', zh: '我到床底下又看了一遍。' },
        { en: 'A small cat sits on my puzzle.', zh: '一只小猫坐在我的拼图上。' },
        { en: 'I say please and the cat jumps down.', zh: '我说「请」，小猫跳了下来。' },
        { en: 'Now I take the puzzle and count it.', zh: '现在我拿起拼图数了数。' },
        { en: 'One doll, two blocks, one puzzle.', zh: '一个洋娃娃，两块积木，一张拼图。' },
        { en: 'What toy do you want to play today?', zh: '今天你想玩哪个玩具？' },
      ],
    ],
  },
  '4-2': {
    title: 'My Toy Shop',
    titleZh: '我的玩具店',
    paragraphs: [
      [
        { en: 'My name is Tom and I love toys.', zh: '我叫 Tom，我爱玩具。' },
        { en: 'Today I open my little toy place.', zh: '今天我开起了我的小小玩具店。' },
        { en: 'I put my new toys on a table.', zh: '我把新玩具摆在桌子上。' },
        { en: 'Leo comes in and says hello.', zh: 'Leo 走进来打了个招呼。' },
        { en: 'Which toy do you want?', zh: '你想要哪个玩具？' },
      ],
      [
        { en: 'Leo wants a train.', zh: 'Leo 想要一列火车。' },
        { en: 'Here you are! I take the train.', zh: '给你！我把火车拿给他。' },
        { en: 'Mia wants a big airplane.', zh: 'Mia 想要一架大飞机。' },
        { en: 'This airplane can fly very fast.', zh: '这架飞机能飞得很快。' },
        { en: 'Kate wants a red car.', zh: 'Kate 想要一辆红汽车。' },
        { en: 'Now Sam wants my new scooter.', zh: '现在 Sam 想要我的新滑板车。' },
        { en: 'I smile. More friends come tomorrow.', zh: '我笑了。明天还会有更多朋友来。' },
      ],
    ],
  },
  '4-3': {
    title: 'Be Polite',
    titleZh: '懂礼貌',
    paragraphs: [
      [
        { en: 'I am Ben. I play in the park.', zh: '我是 Ben。我在公园里玩。' },
        { en: 'I run fast with my new ball.', zh: '我拿着新球跑得飞快。' },
        { en: 'Oh no! I run into Mia.', zh: '哎呀！我撞上了 Mia。' },
        { en: 'Her hat is on the grass now.', zh: '她的帽子现在掉在草地上。' },
        { en: 'I say sorry. I am sorry.', zh: '我说对不起。我很抱歉。' },
        { en: 'Mia is not sad. She says okay.', zh: 'Mia 没有生气。她说说没关系。' },
        { en: 'It is okay, she says to me.', zh: '没关系，她对我说。' },
      ],
      [
        { en: 'I take the hat and give it.', zh: '我拿起帽子还给她。' },
        { en: 'Mia says thanks to me.', zh: 'Mia 对我说谢谢。' },
        { en: 'Please have my other ball.', zh: '请收下我的另一个球。' },
        { en: 'We play with the ball all day.', zh: '我们一起玩球，玩了一整天。' },
        { en: 'Good bye, Mia! See you tomorrow.', zh: '再见，Mia！明天见。' },
      ],
    ],
  },
  '4-4': {
    title: 'Look! Superman!',
    titleZh: '看！超人！',
    paragraphs: [
      [
        { en: 'My name is Jack. I like toys.', zh: '我叫 Jack。我喜欢玩具。' },
        { en: 'Today we watch a funny show.', zh: '今天我们看一场好笑的表演。' },
        { en: 'Look! A man flies in the sky.', zh: '看！一个人在天上飞。' },
        { en: 'Who is this? I know his name!', zh: '这是谁？我知道他的名字！' },
        { en: 'Look! This is Superman!', zh: '看！这就是超人！' },
        { en: 'He can fly like a big bird.', zh: '他能像一只大鸟一样飞。' },
      ],
      [
        { en: 'Then a small man comes down.', zh: '然后一个小个子男人下来了。' },
        { en: 'This is Spiderman. He is fast.', zh: '这是蜘蛛侠。他跑得快。' },
        { en: 'He climbs up a tall tree.', zh: '他爬上高高的树。' },
        { en: 'Now a girl comes in a pink dress.', zh: '这时一个女孩穿着粉裙子走进来。' },
        { en: 'Who is she? She is a princess.', zh: '她是谁？她是公主。' },
        { en: 'And look! A big gray Transformer!', zh: '快看！一个灰色的大变形金刚！' },
      ],
    ],
  },
  '4-5': {
    title: 'I Love Music',
    titleZh: '我爱音乐',
    paragraphs: [
      [
        { en: 'My name is Grace and I love songs.', zh: '我叫 Grace，我爱唱歌。' },
        { en: 'Today I go to my school room.', zh: '今天我去我的教室。' },
        { en: 'Who is that boy with the guitar?', zh: '那个拿吉他的男孩是谁？' },
        { en: 'His guitar is small and brown.', zh: '他的吉他又小又棕。' },
        { en: 'He can play a happy song.', zh: '他会弹一首快乐的歌。' },
        { en: 'I want to play with him.', zh: '我想和他一起玩。' },
      ],
      [
        { en: 'A girl plays a long white flute.', zh: '一个女孩吹着一支长长的白色长笛。' },
        { en: 'Her song is like a bird.', zh: '她的声音像小鸟一样。' },
        { en: 'Then I find a piano near the door.', zh: '然后我在门边找到一架钢琴。' },
        { en: 'Who can play the piano?', zh: '谁会弹钢琴？' },
        { en: 'I can play it very soft.', zh: '我会轻轻地弹。' },
        { en: 'The violin is here, and we sing.', zh: '小提琴也在这里，我们一起唱歌。' },
      ],
    ],
  },
  '4-6': {
    title: 'My Toy Quiz',
    titleZh: '我的玩具小测验',
    paragraphs: [
      [
        { en: 'Hello! My name is Leo.', zh: '你好！我叫 Leo。' },
        { en: 'Today I bring my toys out.', zh: '今天我把玩具都拿了出来。' },
        { en: 'I have a doll and a puzzle.', zh: '我有一个洋娃娃和一张拼图。' },
        { en: 'My new scooter is very fast.', zh: '我的新滑板车非常快。' },
        { en: 'What toys do you have?', zh: '你有什么玩具？' },
        { en: 'I have many blocks, too.', zh: '我还有许多积木。' },
      ],
      [
        { en: 'Now Ben puts on a big shirt.', zh: '现在 Ben 穿上了一件大衬衫。' },
        { en: 'Who is he? He is Spiderman!', zh: '他是谁？他是蜘蛛侠！' },
        { en: 'He can climb like a cat.', zh: '他能像猫一样爬。' },
        { en: 'Then he flies like an airplane.', zh: '然后他像飞机一样飞起来。' },
        { en: 'We run fast on my scooter.', zh: '我们踩着滑板车跑得飞快。' },
        { en: 'What toy do you want to play?', zh: '你想玩哪个玩具？' },
      ],
    ],
  },
  '4-7': {
    title: 'Show Time',
    titleZh: '表演时间',
    paragraphs: [
      [
        { en: 'It is show time at our school.', zh: '今天是我们学校的表演时间。' },
        { en: 'I am Lily and I am ready.', zh: '我是 Lily，我准备好了。' },
        { en: 'Can you play the violin?', zh: '你会拉小提琴吗？' },
        { en: 'Yes! I can play the violin.', zh: '会！我会拉小提琴。' },
        { en: 'My violin is small and brown.', zh: '我的小提琴又小又棕。' },
        { en: 'I play it, and the room is quiet.', zh: '我拉起来，教室里安安静静。' },
      ],
      [
        { en: 'Now Ben comes with his guitar.', zh: '现在 Ben 抱着吉他也上来了。' },
        { en: 'He plays a song very loud.', zh: '他大声地弹了一首歌。' },
        { en: 'Then Kate plays a long flute.', zh: '然后 Kate 吹起了长笛。' },
        { en: 'We all clap and sing.', zh: '我们大家拍手唱歌。' },
        { en: 'Who plays the piano now?', zh: '现在谁来弹钢琴？' },
        { en: 'My mom plays it. It is fun!', zh: '我妈妈来弹。真好玩！' },
      ],
    ],
  },
  '4-8': {
    title: 'Take Away',
    titleZh: '减一减',
    paragraphs: [
      [
        { en: 'Hello! I am Abby and I love candy.', zh: '你好！我叫 Abby，我爱吃糖。' },
        { en: 'Today my mom gives me ten candies.', zh: '今天妈妈给了我十颗糖。' },
        { en: "Let's count all of them!", zh: '我们来数一数它们！' },
        { en: 'One, two, three, four, five.', zh: '一、二、三、四、五。' },
        { en: 'Six, seven, eight, nine and ten.', zh: '六、七、八、九和十。' },
      ],
      [
        { en: 'Then my friend says take away two.', zh: '然后我的朋友说减去二。' },
        { en: 'How many candies are left?', zh: '还剩多少颗糖？' },
        { en: 'Ten take away two is eight.', zh: '十减去二等于八。' },
        { en: 'I eat two candies with my friend.', zh: '我和朋友各吃了两颗糖。' },
        { en: 'How many are left?', zh: '还剩多少？' },
        { en: 'Eight take away two is six.', zh: '八减去二等于六。' },
        { en: 'I want ten more candies tomorrow!', zh: '明天我还想要十颗糖！' },
      ],
    ],
  },
}
