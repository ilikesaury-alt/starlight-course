// E 课堂拓展词 · 主题词库（手工整理，随教材 96 课的主题配套）
// 背景：GitHub 上没有可用的 RAZ 开放词表（Reading A-Z 内容为 Learning A-Z 商业版权），
//       其余开放词表（ECDICT / Oxford 3000 / Fry-Dolch / GSL 等）只有「单词池」，
//       既没有按儿童主题分类，也没有中英对照 + emoji，因此这里按 96 课主题人工建库。
// 约定：
//   1. 每个主题 10~14 个词，按「优先级」排序 —— suggestExtensions 按顺序取，
//      所以越靠前的词越贴合该主题的核心场景（换一批靠轮次轮换，不会一直取头部）。
//   2. 词库不排重也不剔除课内词：suggestExtensions 运行时按「本课课内词 + 本课已录词」过滤，
//      因此同一个词可以出现在多个主题里（例如 corn 同时属于农场与蔬菜）。
//   3. 只存 en / zh / emoji：ipa 由读音引擎负责，手写 500+ 音标容易出错。

import type { Word } from './starlight'

/** 每节课拓展词上限（自动填充与手动录入共用，含课内词外的所有拓展词） */
export const EXT_LIMIT = 5

/** 自动填充写入的拓展词带 auto 标记；缺省（undefined）= 家长/老师手动录入 */
export interface ExtWord extends Word {
  auto?: boolean
}

const w = (en: string, zh: string, emoji: string): Word => ({ en, zh, emoji })

interface Topic {
  /** 主题名（展示用，如填充提示里的「本课主题：打招呼」） */
  zh: string
  /** 候选词，按优先级排序 */
  words: Word[]
}

export const TOPICS: Record<string, Topic> = {
  greeting: { zh: '打招呼', words: [
    w('goodbye', '再见', '👋'), w('welcome', '欢迎', '🤗'), w('introduce', '介绍', '🗣️'),
    w('nice', '令人愉快的', '😊'), w('meet', '见面', '🤝'), w('wave', '挥手', '👋'),
    w('good night', '晚安', '🌙'), w('today', '今天', '📅'), w('tomorrow', '明天', '📆'),
    w('cousin', '堂（表）兄弟姐妹', '👦'), w('miss', '想念', '💭'), w('again', '再一次', '🔁'),
  ] },

  time: { zh: '时间', words: [
    w('night', '夜晚', '🌙'), w('noon', '正午', '🕛'), w('watch', '手表', '⌚'),
    w('hour', '小时', '⏰'), w('minute', '分钟', '⌚'), w('day', '一天', '☀️'),
    w('week', '星期', '🗓️'), w('month', '月份', '📅'), w('sun', '太阳', '☀️'),
    w('moon', '月亮', '🌕'), w('star', '星星', '⭐'), w('early', '早的', '🐦'),
  ] },

  self: { zh: '我自己', words: [
    w('family', '家庭', '👨‍👩‍👧'), w('mother', '妈妈', '👩'), w('father', '爸爸', '👨'),
    w('brother', '哥哥／弟弟', '👦'), w('sister', '姐姐／妹妹', '👧'), w('baby', '宝宝', '🍼'),
    w('kid', '小孩', '🧒'), w('young', '年轻的', '🧑'), w('twin', '双胞胎', '👯'),
    w('hair', '头发', '💇'), w('tall', '高的', '🧍'), w('age', '年龄', '🎂'),
  ] },

  colors: { zh: '颜色', words: [
    w('pink', '粉色', '🩷'), w('white', '白色', '⚪'), w('black', '黑色', '⚫'),
    w('brown', '棕色', '🟤'), w('gray', '灰色', '⬜'), w('gold', '金色', '🥇'),
    w('silver', '银色', '🪙'), w('colorful', '五彩缤纷的', '🌈'), w('bright', '明亮的', '💡'),
    w('dark', '黑暗的', '🌑'), w('shiny', '闪闪发亮的', '✨'), w('violet', '紫罗兰色', '💜'),
  ] },

  numbers: { zh: '数与形', words: [
    w('zero', '零', '0️⃣'), w('hundred', '一百', '💯'), w('first', '第一', '🥇'),
    w('second', '第二', '🥈'), w('third', '第三', '🥉'), w('half', '一半', '½'),
    w('pair', '一双', '👯'), w('double', '双倍', '✖️'), w('twice', '两次', '🔁'),
    w('both', '两个都', '✌️'), w('many', '许多', '➕'), w('few', '很少', '➖'),
  ] },

  pets: { zh: '宠物', words: [
    w('puppy', '小狗', '🐕'), w('kitten', '小猫', '🐈'), w('goldfish', '金鱼', '🐠'),
    w('bird', '小鸟', '🐦'), w('cage', '笼子', '🐾'), w('tail', '尾巴', '🐕'),
    w('paw', '爪子', '🐾'), w('feed', '喂食', '🥣'), w('bone', '骨头', '🦴'),
    w('leash', '牵引绳', '🦮'), w('fluffy', '毛茸茸的', '🐑'), w('vet', '兽医', '🩺'),
  ] },

  farm: { zh: '农场', words: [
    w('sheep', '绵羊', '🐑'), w('goat', '山羊', '🐐'), w('horse', '马', '🐴'),
    w('goose', '鹅', '🪿'), w('hen', '母鸡', '🐔'), w('rooster', '公鸡', '🐓'),
    w('barn', '谷仓', '🚜'), w('corn', '玉米', '🌽'), w('tractor', '拖拉机', '🚜'),
    w('farmer', '农夫', '👨‍🌾'), w('hay', '干草', '🌾'), w('mud', '泥坑', '🐷'),
  ] },

  zoo: { zh: '动物园', words: [
    w('lion', '狮子', '🦁'), w('tiger', '老虎', '🐅'), w('snake', '蛇', '🐍'),
    w('fox', '狐狸', '🦊'), w('wolf', '狼', '🐺'), w('hippo', '河马', '🦛'),
    w('camel', '骆驼', '🐫'), w('kangaroo', '袋鼠', '🦘'), w('penguin', '企鹅', '🐧'),
    w('peacock', '孔雀', '🦚'), w('crocodile', '鳄鱼', '🐊'), w('rhino', '犀牛', '🦏'),
  ] },

  ocean: { zh: '海洋', words: [
    w('whale', '鲸鱼', '🐋'), w('seal', '海豹', '🦭'), w('coral', '珊瑚', '🪸'),
    w('wave', '海浪', '🌊'), w('mermaid', '美人鱼', '🧜'), w('submarine', '潜水艇', '🚢'),
    w('fin', '鱼鳍', '🦈'), w('sea', '大海', '🌊'), w('seaweed', '海藻', '🌿'),
    w('deep', '深的', '🌊'), w('salty', '咸的', '🧂'), w('kelp', '海带', '🌿'),
  ] },

  bugs: { zh: '虫子', words: [
    w('ant', '蚂蚁', '🐜'), w('snail', '蜗牛', '🐌'), w('ladybug', '瓢虫', '🐞'),
    w('beetle', '甲虫', '🪲'), w('dragonfly', '蜻蜓', '🪰'), w('grasshopper', '蚱蜢', '🦗'),
    w('worm', '蚯蚓', '🪱'), w('fly', '苍蝇', '🪰'), w('mosquito', '蚊子', '🦟'),
    w('insect', '昆虫', '🐛'), w('wings', '翅膀', '🪽'), w('wasp', '黄蜂', '🐝'),
  ] },

  math: { zh: '数学', words: [
    w('minus', '减', '➖'), w('more', '更多', '➕'), w('less', '更少', '➖'),
    w('sum', '总和', '🧮'), w('add', '加', '🧮'), w('shape', '形状', '🔷'),
    w('circle', '圆形', '⭕'), w('square', '正方形', '🟦'), w('triangle', '三角形', '🔺'),
    w('rectangle', '长方形', '🟧'), w('compare', '比较', '⚖️'), w('order', '顺序', '🔢'),
  ] },

  fruit: { zh: '水果', words: [
    w('pear', '梨', '🍐'), w('lemon', '柠檬', '🍋'), w('mango', '芒果', '🥭'),
    w('melon', '甜瓜', '🍈'), w('blueberry', '蓝莓', '🫐'), w('coconut', '椰子', '🥥'),
    w('plum', '李子', '🟣'), w('papaya', '木瓜', '🟠'), w('seed', '种子', '🌰'),
    w('peel', '果皮', '🍌'), w('sweet', '甜的', '🍬'), w('ripe', '成熟的', '🍏'),
  ] },

  drinks: { zh: '饮料', words: [
    w('tea', '茶', '🍵'), w('coffee', '咖啡', '☕'), w('smoothie', '冰沙', '🥤'),
    w('straw', '吸管', '🥤'), w('cup', '杯子', '☕'), w('thirsty', '口渴的', '😩'),
    w('bottle', '瓶子', '🍶'), w('lemonade', '柠檬水', '🍋'), w('ice', '冰块', '🧊'),
    w('honey', '蜂蜜', '🍯'), w('hot chocolate', '热巧克力', '🍫'), w('thermos', '保温杯', '🫖'),
  ] },

  vegetables: { zh: '蔬菜', words: [
    w('corn', '玉米', '🌽'), w('pea', '豌豆', '🟢'), w('mushroom', '蘑菇', '🍄'),
    w('cabbage', '卷心菜', '🥬'), w('garlic', '大蒜', '🧄'), w('chili', '辣椒', '🌶️'),
    w('fresh', '新鲜的', '🥬'), w('healthy', '健康的', '💪'), w('cook', '做饭', '👨‍🍳'),
    w('soup', '汤', '🍲'), w('grow', '种植', '🌱'), w('crunchy', '脆脆的', '🥕'),
  ] },

  snacks: { zh: '零食', words: [
    w('ice cream', '冰淇淋', '🍦'), w('popsicle', '冰棍', '🍦'), w('gum', '口香糖', '🫧'),
    w('waffle', '华夫饼', '🧇'), w('pancake', '松饼', '🥞'), w('cracker', '苏打饼干', '🍘'),
    w('yummy', '好吃的', '😋'), w('delicious', '美味的', '😋'), w('bite', '一口', '🤤'),
    w('treat', '好吃的零食', '🍬'), w('hungry', '饿了', '🤤'), w('munch', '啃着吃', '🍪'),
  ] },

  breakfast: { zh: '早餐', words: [
    w('toast', '吐司', '🍞'), w('jam', '果酱', '🍓'), w('bacon', '培根', '🥓'),
    w('cheese', '奶酪', '🧀'), w('butter', '黄油', '🧈'), w('milk', '牛奶', '🥛'),
    w('juice', '果汁', '🧃'), w('yogurt', '酸奶', '🥛'), w('honey', '蜂蜜', '🍯'),
    w('sandwich', '三明治', '🥪'), w('omelette', '煎蛋卷', '🍳'), w('syrup', '糖浆', '🍯'),
  ] },

  seafood: { zh: '海鲜', words: [
    w('lobster', '龙虾', '🦞'), w('tuna', '金枪鱼', '🐟'), w('salmon', '三文鱼', '🐟'),
    w('clam', '蛤蜊', '🦪'), w('scallop', '扇贝', '🐚'), w('seaweed', '海藻', '🌿'),
    w('sardine', '沙丁鱼', '🐟'), w('mussel', '贻贝', '🦪'), w('prawn', '大虾', '🦐'),
    w('kelp', '海带', '🌿'), w('shellfish', '贝类', '🦪'), w('caviar', '鱼子酱', '🐟'),
  ] },

  meat: { zh: '肉类', words: [
    w('steak', '牛排', '🥩'), w('ham', '火腿', '🥓'), w('ribs', '排骨', '🍖'),
    w('lamb', '羊肉', '🐑'), w('turkey', '火鸡肉', '🦃'), w('meatball', '肉丸', '🍢'),
    w('roast', '烤肉', '🍗'), w('grill', '烧烤', '🍢'), w('slice', '切片', '🔪'),
    w('fry', '煎', '🍳'), w('juicy', '多汁的', '🥩'), w('tasty', '好吃的', '😋'),
  ] },

  chinese: { zh: '中式家常', words: [
    w('congee', '粥', '🍚'), w('tofu', '豆腐', '🍮'), w('spring roll', '春卷', '🥟'),
    w('fried rice', '炒饭', '🍚'), w('hot pot', '火锅', '🍲'), w('wonton', '馄饨', '🥟'),
    w('soy milk', '豆浆', '🥛'), w('rice noodles', '米粉', '🍜'), w('braised pork', '红烧肉', '🍖'),
    w('zongzi', '粽子', '🫔'), w('mooncake', '月饼', '🥮'), w('tea egg', '茶叶蛋', '🥚'),
  ] },

  bedroom: { zh: '卧室', words: [
    w('blanket', '毯子', '🛏️'), w('wardrobe', '衣柜', '🚪'), w('drawer', '抽屉', '🗄️'),
    w('rug', '小地毯', '🟫'), w('curtain', '窗帘', '🪟'), w('carpet', '地毯', '🟫'),
    w('hanger', '衣架', '🧷'), w('closet', '壁橱', '🚪'), w('mattress', '床垫', '🛏️'),
    w('sheet', '床单', '🛏️'), w('bunk bed', '双层床', '🛏️'), w('toy box', '玩具箱', '🧸'),
  ] },

  livingroom: { zh: '客厅', words: [
    w('floor', '地板', '🟫'), w('wall', '墙', '🧱'), w('window', '窗户', '🪟'),
    w('door', '门', '🚪'), w('chair', '椅子', '🪑'), w('stairs', '楼梯', '🪜'),
    w('shelf', '架子', '📚'), w('lamp', '台灯', '💡'), w('remote', '遥控器', '📺'),
    w('key', '钥匙', '🔑'), w('cushion', '靠垫', '🛋️'), w('fan', '风扇', '🌀'),
  ] },

  bathroom: { zh: '浴室', words: [
    w('towel', '毛巾', '🧻'), w('soap', '肥皂', '🧼'), w('shampoo', '洗发水', '🧴'),
    w('bath', '洗澡', '🛁'), w('shower', '淋浴', '🚿'), w('bubble', '泡泡', '🫧'),
    w('bucket', '水桶', '🪣'), w('wash', '洗', '🧼'), w('brush', '刷', '🪥'),
    w('sponge', '海绵', '🧽'), w('mat', '垫子', '🟫'), w('comb', '梳子', '💇'),
  ] },

  kitchen: { zh: '厨房', words: [
    w('bowl', '碗', '🥣'), w('plate', '盘子', '🍽️'), w('fork', '叉子', '🍴'),
    w('spoon', '勺子', '🥄'), w('fridge', '冰箱', '🧊'), w('oven', '烤箱', '🍞'),
    w('kettle', '水壶', '🫖'), w('dish', '一道菜', '🍲'), w('tray', '托盘', '🍱'),
    w('apron', '围裙', '👨‍🍳'), w('chopstick', '筷子', '🥢'), w('jar', '罐子', '🫙'),
  ] },

  garden: { zh: '花园', words: [
    w('tree', '树', '🌳'), w('rock', '石头', '🪨'), w('leaf', '叶子', '🍃'),
    w('plant', '植物', '🪴'), w('seed', '种子', '🌱'), w('bush', '灌木', '🌿'),
    w('fence', '栅栏', '🚧'), w('path', '小路', '🛤️'), w('grow', '生长', '🌱'),
    w('shade', '树荫', '🌳'), w('spade', '铲子', '🪏'), w('water', '浇水', '💧'),
  ] },

  study: { zh: '书房', words: [
    w('pen', '钢笔', '🖊️'), w('paper', '纸', '📄'), w('ruler', '尺子', '📏'),
    w('eraser', '橡皮', '🧽'), w('pencil', '铅笔', '✏️'), w('notebook', '笔记本', '📓'),
    w('map', '地图', '🗺️'), w('globe', '地球仪', '🌍'), w('poster', '海报', '🖼️'),
    w('computer', '电脑', '💻'), w('dictionary', '词典', '📖'), w('shelf', '架子', '📚'),
  ] },

  routine: { zh: '一天作息', words: [
    w('wake', '醒来', '⏰'), w('sleep', '睡觉', '😴'), w('dress', '穿衣', '👗'),
    w('lunch', '午餐', '🍱'), w('dinner', '晚餐', '🍽️'), w('pajamas', '睡衣', '🩳'),
    w('sleepy', '困的', '😪'), w('hurry', '赶快', '🏃'), w('busy', '忙碌的', '🏃'),
    w('rest', '休息', '😌'), w('relax', '放松', '🧘'), w('wash', '洗', '🧼'),
  ] },

  cleaning: { zh: '打扫整理', words: [
    w('broom', '扫帚', '🧹'), w('mop', '拖把', '🪣'), w('bucket', '水桶', '🪣'),
    w('dust', '灰尘', '🌫️'), w('trash', '垃圾', '🗑️'), w('laundry', '要洗的衣服', '🧺'),
    w('sweep', '扫', '🧹'), w('tidy', '整理', '📦'), w('vacuum', '吸尘器', '🌀'),
    w('bin', '垃圾桶', '🗑️'), w('wipe', '擦', '🧽'), w('cloth', '抹布', '🧽'),
  ] },

  clothes: { zh: '衣物', words: [
    w('coat', '外套', '🧥'), w('shirt', '衬衫', '👕'), w('jacket', '夹克', '🧥'),
    w('socks', '袜子', '🧦'), w('shoes', '鞋', '👟'), w('boots', '靴子', '🥾'),
    w('dress', '连衣裙', '👗'), w('sweater', '毛衣', '🧶'), w('mitten', '连指手套', '🧤'),
    w('cap', '鸭舌帽', '🧢'), w('bow', '蝴蝶结', '🎀'), w('belt', '腰带', '🥇'),
  ] },

  school: { zh: '学校用品', words: [
    w('ruler', '尺子', '📏'), w('pen', '钢笔', '🖊️'), w('paper', '纸', '📄'),
    w('scissors', '剪刀', '✂️'), w('notebook', '笔记本', '📓'), w('backpack', '书包', '🎒'),
    w('board', '黑板', '⬛'), w('homework', '家庭作业', '📝'), w('student', '学生', '🧑‍🎓'),
    w('teacher', '老师', '👩‍🏫'), w('class', '班级', '👨‍🏫'), w('map', '地图', '🗺️'),
  ] },

  toys: { zh: '玩具', words: [
    w('kite', '风筝', '🪁'), w('teddy bear', '泰迪熊', '🧸'), w('toy', '玩具', '🎁'),
    w('robot', '机器人', '🤖'), w('marbles', '弹珠', '🔵'), w('yo-yo', '悠悠球', '🪀'),
    w('race car', '赛车', '🏎️'), w('pretend', '假装', '🎭'), w('game', '游戏', '🎮'),
    w('fun', '玩得开心', '🎉'), w('dollhouse', '娃娃屋', '🏠'), w('spin', '旋转', '🌀'),
  ] },

  polite: { zh: '懂礼貌', words: [
    w('excuse', '打扰一下', '🙏'), w('share', '分享', '🤝'), w('kind', '友善的', '💛'),
    w('manners', '礼貌', '🙇'), w('may', '可以', '🙏'), w('polite', '有礼貌的', '🙏'),
    w('help', '帮助', '🤲'), w('gentle', '温柔的', '🕊️'), w('respect', '尊重', '🙇'),
    w('line up', '排队', '🧍'), w('take turns', '轮流', '🔁'), w('thank', '道谢', '🙏'),
  ] },

  heroes: { zh: '超级英雄', words: [
    w('hero', '英雄', '🦸'), w('villain', '反派', '🦹'), w('cape', '披风', '🦸'),
    w('mask', '面具', '🎭'), w('magic', '魔法', '🪄'), w('wizard', '巫师', '🧙'),
    w('fairy', '仙女', '🧚'), w('giant', '巨人', '🗿'), w('super', '超级', '💪'),
    w('power', '力量', '💥'), w('save', '拯救', '🆘'), w('castle', '城堡', '🏰'),
  ] },

  music: { zh: '音乐', words: [
    w('song', '歌曲', '🎵'), w('drum', '鼓', '🥁'), w('trumpet', '小号', '🎺'),
    w('band', '乐队', '🎸'), w('concert', '音乐会', '🎤'), w('note', '音符', '🎶'),
    w('music', '音乐', '🎧'), w('singer', '歌手', '🎤'), w('listen', '听', '👂'),
    w('rhythm', '节奏', '🥁'), w('melody', '旋律', '🎶'), w('instrument', '乐器', '🎻'),
  ] },

  size: { zh: '大小', words: [
    w('tall', '高的', '🧍'), w('short', '矮的', '📏'), w('long', '长的', '📏'),
    w('heavy', '重的', '⚖️'), w('light', '轻的', '🪶'), w('thick', '厚的', '📚'),
    w('wide', '宽的', '↔️'), w('narrow', '窄的', '↔️'), w('high', '高的', '⬆️'),
    w('low', '低的', '⬇️'), w('huge', '巨大的', '🐘'), w('tiny', '极小的', '🐭'),
  ] },

  sounds: { zh: '声音', words: [
    w('noise', '噪音', '📢'), w('silent', '安静的', '🤫'), w('ring', '叮铃响', '🔔'),
    w('beep', '嘟嘟声', '📢'), w('honk', '鸣笛', '📯'), w('bang', '砰的一声', '💥'),
    w('noisy', '吵闹的', '📢'), w('mute', '消音', '🔇'), w('sound', '声音', '🔊'),
    w('echo', '回声', '🗣️'), w('tick', '滴答声', '⏱️'), w('clap', '拍手', '👏'),
  ] },

  race: { zh: '比赛', words: [
    w('race', '赛跑', '🏁'), w('win', '赢', '🏆'), w('ready', '准备好了', '✅'),
    w('quick', '迅速的', '⚡'), w('runner', '跑步的人', '🏃'), w('jog', '慢跑', '🏃'),
    w('goal', '球门／目标', '🥅'), w('team', '队伍', '🏅'), w('player', '选手', '🧑'),
    w('sport', '运动', '⚽'), w('exercise', '锻炼', '🏋️'), w('practice', '练习', '🔄'),
  ] },

  quality: { zh: '好不好', words: [
    w('fine', '不错的', '👌'), w('terrible', '糟糕的', '😖'), w('wonderful', '精彩的', '🎉'),
    w('favorite', '最喜欢的', '⭐'), w('boring', '无聊的', '😴'), w('interesting', '有趣的', '🤔'),
    w('best', '最好的', '🥇'), w('worst', '最差的', '💩'), w('awesome', '太棒了', '😎'),
    w('perfect', '完美的', '✨'), w('yummy', '好吃的', '😋'), w('yucky', '难吃的', '😝'),
  ] },

  feelings: { zh: '心情', words: [
    w('angry', '生气的', '😠'), w('scared', '害怕的', '😨'), w('surprised', '惊讶的', '😲'),
    w('excited', '兴奋的', '🤩'), w('tired', '累的', '😩'), w('proud', '骄傲的', '😤'),
    w('shy', '害羞的', '😊'), w('bored', '无聊的', '😑'), w('worried', '担心的', '😟'),
    w('cry', '哭', '😢'), w('laugh', '笑', '😂'), w('joy', '快乐', '🥳'),
  ] },

  weather: { zh: '天气', words: [
    w('warm', '温暖的', '🌤️'), w('cool', '凉爽的', '🥶'), w('sunny', '晴朗的', '☀️'),
    w('rainy', '下雨的', '🌧️'), w('snowy', '下雪的', '❄️'), w('windy', '刮风的', '💨'),
    w('cloudy', '多云的', '☁️'), w('stormy', '暴风雨的', '⛈️'), w('snow', '雪', '❄️'),
    w('rain', '雨', '🌧️'), w('wind', '风', '💨'), w('weather', '天气', '🌦️'),
    w('umbrella', '雨伞', '☂️'), w('temperature', '温度', '🌡️'),
  ] },

  body: { zh: '身体', words: [
    w('head', '头', '🧠'), w('face', '脸', '😊'), w('tooth', '牙齿', '🦷'),
    w('finger', '手指', '🖐️'), w('toe', '脚趾', '🦶'), w('knee', '膝盖', '🦵'),
    w('shoulder', '肩膀', '🤲'), w('neck', '脖子', '🦒'), w('chin', '下巴', '🙂'),
    w('cheek', '脸颊', '😊'), w('tongue', '舌头', '👅'), w('skin', '皮肤', '🧴'),
    w('bone', '骨头', '🦴'), w('thumb', '大拇指', '👍'),
  ] },

  actions: { zh: '动作', words: [
    w('swim', '游泳', '🏊'), w('crawl', '爬', '🐛'), w('climb', '爬上去', '🧗'),
    w('kick', '踢', '⚽'), w('throw', '扔', '🤾'), w('catch', '接住', '🤲'),
    w('push', '推', '🚪'), w('pull', '拉', '🪢'), w('touch', '摸', '✋'),
    w('point', '指', '👉'), w('stand', '站', '🧍'), w('sit', '坐', '🪑'),
    w('chew', '咀嚼', '🦷'), w('shout', '喊', '📣'),
  ] },

  birthday: { zh: '生日派对', words: [
    w('party', '派对', '🎉'), w('invite', '邀请', '📨'), w('surprise', '惊喜', '🎁'),
    w('celebrate', '庆祝', '🥳'), w('decorate', '装饰', '🎊'), w('box', '盒子', '📦'),
    w('cheer', '欢呼', '🎉'), w('confetti', '彩纸', '🎊'), w('guest', '客人', '👋'),
    w('sing', '唱歌', '🎤'), w('blow', '吹', '🌬️'), w('letter', '请柬', '✉️'),
  ] },

  love: { zh: '表达爱', words: [
    w('dear', '亲爱的', '💕'), w('heart', '心', '❤️'), w('warm', '温暖的', '🤗'),
    w('treasure', '珍爱', '💎'), w('family', '家庭', '👨‍👩‍👧'), w('true', '真心的', '💯'),
    w('always', '永远', '♾️'), w('close', '亲密的', '🤗'), w('adore', '喜爱', '🥰'),
    w('cherish', '珍惜', '💝'), w('sweet', '甜蜜的', '🍬'), w('kind', '友善的', '💛'),
  ] },

  friends: { zh: '朋友', words: [
    w('together', '一起', '🤝'), w('care', '关心', '💕'), w('trust', '信任', '🤝'),
    w('group', '小组', '👥'), w('partner', '伙伴', '🤝'), w('play', '玩', '⚽'),
    w('friendly', '友好的', '😄'), w('buddy', '好朋友', '🤝'), w('mate', '小伙伴', '🤝'),
    w('pal', '朋友', '😄'), w('playdate', '约着一起玩', '🛝'), w('get along', '相处融洽', '🤝'),
  ] },

  places: { zh: '场所', words: [
    w('museum', '博物馆', '🏛️'), w('library', '图书馆', '📚'), w('cinema', '电影院', '🎬'),
    w('restaurant', '餐厅', '🍴'), w('bank', '银行', '🏦'), w('post office', '邮局', '📮'),
    w('pharmacy', '药店', '💊'), w('store', '商店', '🏪'), w('market', '市场', '🛍️'),
    w('gym', '健身房', '🏋️'), w('factory', '工厂', '🏭'), w('office', '办公室', '🏢'),
    w('airport', '机场', '✈️'), w('station', '车站', '🚉'),
  ] },

  shopping: { zh: '购物', words: [
    w('money', '钱', '💰'), w('price', '价格', '💲'), w('cheap', '便宜的', '💸'),
    w('expensive', '贵的', '💎'), w('buy', '买', '🛍️'), w('sell', '卖', '🏷️'),
    w('basket', '篮子', '🧺'), w('coin', '硬币', '🪙'), w('cart', '购物车', '🛒'),
    w('change', '找零', '💵'), w('receipt', '收据', '🧾'), w('sale', '特卖', '🏷️'),
  ] },

  beach: { zh: '海滩', words: [
    w('sun', '太阳', '☀️'), w('surf', '冲浪', '🏄'), w('sunglasses', '太阳镜', '😎'),
    w('sunscreen', '防晒霜', '🧴'), w('sandcastle', '沙堡', '🏖️'), w('boat', '小船', '⛵'),
    w('island', '岛屿', '🏝️'), w('float', '漂浮', '🏊'), w('summer', '夏天', '☀️'),
    w('holiday', '假日', '🏖️'), w('vacation', '假期', '🏝️'), w('picnic', '野餐', '🧺'),
  ] },

  playground: { zh: '操场游戏', words: [
    w('tag', '捉人游戏', '🏃'), w('hide-and-seek', '捉迷藏', '🫣'), w('hopscotch', '跳房子', '⬜'),
    w('frisbee', '飞盘', '🥏'), w('jump rope', '跳绳', '🪢'), w('run', '跑', '🏃'),
    w('climb', '爬上去', '🧗'), w('fun', '好玩', '🎉'), w('game', '游戏', '🎮'),
    w('kite', '风筝', '🪁'), w('ball', '球', '⚽'), w('play', '玩耍', '⚽'),
  ] },

  sports: { zh: '体育运动', words: [
    w('badminton', '羽毛球', '🏸'), w('tennis', '网球', '🎾'), w('hop', '单脚跳', '🐰'),
    w('skip', '蹦跳', '🏃'), w('medal', '奖牌', '🏅'), w('trophy', '奖杯', '🏆'),
    w('coach', '教练', '📣'), w('stadium', '体育场', '🏟️'), w('referee', '裁判', '🙋'),
    w('jersey', '球衣', '👕'), w('score', '得分', '📊'), w('fan', '球迷', '📣'),
  ] },

  themepark: { zh: '主题公园', words: [
    w('ride', '乘坐的游乐设施', '🎠'), w('roller coaster', '过山车', '🎢'), w('queue', '排队', '🧍'),
    w('carnival', '嘉年华', '🎪'), w('prize', '奖品', '🎁'), w('ticket', '门票', '🎫'),
    w('popcorn', '爆米花', '🍿'), w('cotton candy', '棉花糖', '🍭'), w('scary', '吓人的', '😱'),
    w('exciting', '刺激的', '🤩'), w('thrill', '惊险好玩', '🎢'), w('balloon', '气球', '🎈'),
  ] },

  transport: { zh: '交通工具', words: [
    w('car', '小汽车', '🚗'), w('train', '火车', '🚂'), w('plane', '飞机', '✈️'),
    w('ship', '轮船', '🚢'), w('truck', '卡车', '🚚'), w('van', '面包车', '🚐'),
    w('motorcycle', '摩托车', '🏍️'), w('rocket', '火箭', '🚀'), w('helicopter', '直升机', '🚁'),
    w('drive', '开车', '🚗'), w('ride', '乘坐', '🛴'), w('seat', '座位', '💺'),
    w('ticket', '车票', '🎫'), w('road', '马路', '🛣️'),
  ] },

  traffic: { zh: '交通规则', words: [
    w('cross', '穿过马路', '🚶'), w('sign', '标志牌', '🪧'), w('traffic', '交通', '🚦'),
    w('safe', '安全的', '🛟'), w('careful', '小心的', '⚠️'), w('danger', '危险', '⚠️'),
    w('horn', '喇叭', '📯'), w('parking', '停车', '🅿️'), w('rule', '规则', '📏'),
    w('helmet', '头盔', '🪖'), w('seat belt', '安全带', '🎗️'), w('walk', '步行', '🚶'),
  ] },
}

/** 96 课 → 主题 key 列表（按优先级：第一个最贴课，后面是补充池）。
 *  测验 / 复习课给多个主题，让候选池覆盖整单元。 */
export const LESSON_TOPICS: Record<string, string[]> = {
  // Unit 1 Hello!
  '1-1': ['greeting'], '1-2': ['time', 'greeting'], '1-3': ['self'], '1-4': ['colors'],
  '1-5': ['colors'], '1-6': ['greeting', 'self', 'colors', 'numbers'],
  '1-7': ['numbers'], '1-8': ['numbers'],
  // Unit 2 Animals
  '2-1': ['pets'], '2-2': ['farm'], '2-3': ['zoo'], '2-4': ['ocean'],
  '2-5': ['bugs'], '2-6': ['pets', 'farm', 'zoo', 'ocean', 'bugs', 'math'],
  '2-7': ['math'], '2-8': ['math'],
  // Unit 3 Food I Like
  '3-1': ['fruit'], '3-2': ['fruit'], '3-3': ['drinks'], '3-4': ['vegetables'],
  '3-5': ['vegetables'], '3-6': ['fruit', 'drinks', 'vegetables', 'snacks', 'math'],
  '3-7': ['snacks'], '3-8': ['snacks'],
  // Unit 4 Toys & Fun
  '4-1': ['toys'], '4-2': ['toys'], '4-3': ['polite'], '4-4': ['heroes'],
  '4-5': ['music'], '4-6': ['toys', 'polite', 'heroes', 'music'],
  '4-7': ['music'], '4-8': ['math'],
  // Unit 5 Opposites
  '5-1': ['size'], '5-2': ['sounds'], '5-3': ['race'], '5-4': ['quality'],
  '5-5': ['size'], '5-6': ['size', 'sounds', 'race', 'quality', 'feelings'],
  '5-7': ['feelings'], '5-8': ['weather'],
  // Unit 6 My Body
  '6-1': ['body'], '6-2': ['body'], '6-3': ['body'], '6-4': ['actions'],
  '6-5': ['actions'], '6-6': ['body', 'actions', 'feelings', 'weather'],
  '6-7': ['actions', 'music'], '6-8': ['self'],
  // Unit 7 My Home
  '7-1': ['bedroom'], '7-2': ['livingroom'], '7-3': ['bathroom'], '7-4': ['garden'],
  '7-5': ['kitchen'], '7-6': ['bedroom', 'livingroom', 'bathroom', 'kitchen', 'garden', 'study'],
  '7-7': ['study'], '7-8': ['bedroom', 'livingroom', 'kitchen', 'study'],
  // Unit 8 Food
  '8-1': ['fruit'], '8-2': ['vegetables'], '8-3': ['seafood'], '8-4': ['snacks'],
  '8-5': ['chinese'], '8-6': ['fruit', 'vegetables', 'seafood', 'snacks', 'meat'],
  '8-7': ['meat'], '8-8': ['fruit', 'vegetables', 'seafood', 'meat', 'chinese'],
  // Unit 9 A Day
  '9-1': ['routine', 'clothes'], '9-2': ['breakfast'], '9-3': ['school'], '9-4': ['playground'],
  '9-5': ['snacks'], '9-6': ['routine', 'breakfast', 'school', 'playground', 'snacks'],
  '9-7': ['routine'], '9-8': ['routine', 'breakfast', 'school', 'playground'],
  // Unit 10 Birthday
  '10-1': ['birthday'], '10-2': ['friends'], '10-3': ['birthday', 'clothes'], '10-4': ['love', 'friends'],
  '10-5': ['birthday'], '10-6': ['birthday', 'friends', 'love', 'clothes'],
  '10-7': ['cleaning'], '10-8': ['birthday', 'friends', 'love', 'cleaning'],
  // Unit 11 Places
  '11-1': ['places'], '11-2': ['zoo'], '11-3': ['ocean'], '11-4': ['beach'],
  '11-5': ['sports'], '11-6': ['places', 'zoo', 'ocean', 'beach', 'sports'],
  '11-7': ['themepark'], '11-8': ['places', 'zoo', 'ocean', 'beach', 'sports'],
  // Unit 12 Transport
  '12-1': ['places'], '12-2': ['shopping', 'places'], '12-3': ['transport'], '12-4': ['traffic'],
  '12-5': ['traffic'], '12-6': ['places', 'shopping', 'transport', 'traffic'],
  '12-7': ['transport'], '12-8': ['places', 'transport', 'traffic', 'shopping'],
}

/** 本课主题名（用于填充提示；没配主题时返回 undefined） */
export function lessonTopicZh(lessonKey: string): string | undefined {
  const key = LESSON_TOPICS[lessonKey]?.[0]
  return key ? TOPICS[key]?.zh : undefined
}

export interface SuggestInput {
  /** `${unitId}-${lessonId}`，与 starlightExtensions 的 key 同一套命名 */
  lessonKey: string
  /** 本课课内词 —— 拓展词必须是教材之外的词 */
  lessonWords: Word[]
  /** 本课已有的拓展词（换一批时只传手动录入的，自动词会被整体替换） */
  existing: Word[]
  /** 第几轮（1 起）。换一批时 +1，用于轮换候选窗口，避免每次都取同一批 */
  round?: number
  /** 默认 EXT_LIMIT */
  limit?: number
}

/** 按本课主题挑拓展词：主题池 → 去课内词/已录词 → 按轮次轮换 → 截断到 limit。
 *  纯函数，不碰 store；词库没有该主题或全被过滤时返回空数组。 */
export function suggestExtensions(input: SuggestInput): ExtWord[] {
  const keys = LESSON_TOPICS[input.lessonKey] ?? []
  const pool: ExtWord[] = []
  const seenPool = new Set<string>()
  for (const key of keys) {
    for (const word of TOPICS[key]?.words ?? []) {
      const base = word.en.trim().toLowerCase()
      if (!base || seenPool.has(base)) continue
      seenPool.add(base)
      pool.push(word)
    }
  }
  if (pool.length === 0) return []

  const banned = new Set<string>()
  for (const word of input.lessonWords) banned.add(word.en.trim().toLowerCase())
  for (const word of input.existing) banned.add(word.en.trim().toLowerCase())
  banned.delete('') // 空串是「无词」的占位，不能把整个池子 ban 掉

  const fresh = pool.filter((word) => !banned.has(word.en.trim().toLowerCase()))
  if (fresh.length === 0) return []

  const limit = Math.max(0, input.limit ?? EXT_LIMIT)
  if (limit === 0) return []
  const round = Math.max(1, Math.floor(input.round ?? 1))
  // 轮换窗口：第 N 轮从 (N-1)*limit 处开始绕回来取，保证「换一批」换得动
  const offset = ((round - 1) * limit) % fresh.length
  return [...fresh.slice(offset), ...fresh.slice(0, offset)].slice(0, Math.min(limit, fresh.length))
}
