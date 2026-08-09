// 泛型故事页：Fly Guy 与 Rocket Girl 共用同一套「单词卡 / 例句 / 闯关」交互。
// 两个模块的差异（主题色、文案、emoji、底部导航布局）全部通过 props 注入，
// 页面本身不重复实现任何逻辑。新增故事类模块 = 在 data 层注册 + 写一个 ~15 行薄壳。

import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import SafeBoundary from '@/components/SafeBoundary'
import QuizEngine, { type QuizItem } from '@/components/QuizEngine'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { moduleThemeVars } from '@/utils/theme'
import type { ModuleId } from '@/data/modules'
import type { Story, StoryWord } from '@/data/story-types'

interface StoryPageProps {
  moduleId: ModuleId
  theme: { color: string; colorSoft: string }
  stories: Story[]
  getStory: (slug: string) => Story | undefined
  basePath: string
  label: string
  moduleEmoji: string
}

type Tab = 'vocab' | 'sentences' | 'quiz'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// 从本故事单词生成闯关题(每词 1 题,最多 12 题)
function buildQuiz(storyWords: StoryWord[], allPool: StoryWord[]): QuizItem[] {
  const questions: QuizItem[] = []
  const limit = Math.min(storyWords.length, 12)
  for (let i = 0; i < limit; i++) {
    const target = storyWords[i]
    let distractPool = storyWords.filter((w) => w.en !== target.en)
    if (distractPool.length < 3) {
      distractPool = allPool.filter((w) => w.en !== target.en)
    }
    const distract = shuffle(distractPool).slice(0, 3)
    const options = shuffle([target, ...distract])
    const answer = options.findIndex((o) => o.en === target.en)
    questions.push({
      q: `哪个是"${target.zh}"？`,
      options: options.map((o) => o.en),
      answer,
      explain: `${target.en} 意思是"${target.zh}"。`,
      speakText: target.en,
      emoji: target.emoji,
    })
  }
  return questions
}

// 去掉句末标点,避免 TTS 把 "." 也读出来
function cleanForSpeak(tok: string): string {
  return tok.replace(/[.,!?;:]"'`]+$/g, '').trim() || tok
}

// 仅替换首个词边界命中的单词(保留原大小写与相邻标点),用于把原句中的目标词挖空。
function replaceFirstWord(text: string, base: string, sub: string): string {
  const re = new RegExp(`\\b${base}\\b`, 'i')
  return text.replace(re, sub)
}

// 收集 bookText 中所有「命中词典」的单词(小写去标点词形),用作填空题干扰项池。
function bookWordPool(story: Story): string[] {
  const set = new Set<string>()
  for (const ch of story.bookText ?? []) {
    for (const p of ch.pages) {
      for (const tk of p.text.split(/\s+/)) {
        const b = tk.toLowerCase().replace(/[^a-z]/g, '')
        if (b.length >= 3 && (BOOK_WORD_ZH[b] || lookupZh(b))) set.add(b)
      }
    }
  }
  return [...set]
}

// 基于绘本原文生成「选词填空」闯关题:从真实句子挖掉一个关键词,让孩子从选项中选词补全。
function buildBookQuiz(story: Story): QuizItem[] {
  const vocabBases = new Set(story.words.map((w) => w.en.toLowerCase().replace(/[^a-z]/g, '')))
  const pool = bookWordPool(story)
  const items: QuizItem[] = []
  const used = new Set<string>()

  for (const ch of story.bookText ?? []) {
    for (const p of ch.pages) {
      if (items.length >= 10) break
      const toks = p.text.split(/\s+/).filter(Boolean)
      // 候选目标词:本页中能被词典解释的实词
      const cands = toks.filter((tk) => {
        const b = tk.toLowerCase().replace(/[^a-z]/g, '')
        return b.length >= 3 && (vocabBases.has(b) || BOOK_WORD_ZH[b] || lookupZh(b))
      })
      if (cands.length === 0) continue
      // 优先挖「学习词汇」,更能巩固本课重点
      const target = cands.find((tk) => vocabBases.has(tk.toLowerCase().replace(/[^a-z]/g, ''))) ?? cands[0]
      const tb = target.toLowerCase().replace(/[^a-z]/g, '')
      if (used.has(tb)) continue
      used.add(tb)

      // 干扰项:优先同故事其他词汇,其次绘本词池
      let distractPool = story.words.map((w) => w.en).filter((e) => e.toLowerCase().replace(/[^a-z]/g, '') !== tb)
      if (distractPool.length < 3) distractPool = pool.filter((w) => w !== tb)
      const distract = shuffle(distractPool).slice(0, 3)
      const options = shuffle([target, ...distract])
      const answer = options.findIndex((o) => o.toLowerCase().replace(/[^a-z]/g, '') === tb)
      if (answer < 0) continue

      const prompt = replaceFirstWord(p.text, tb, '＿＿＿')
      items.push({
        q: '从下面选一个词，填到横线里',
        cloze: { prompt, full: p.text },
        options,
        answer,
        explain: `《${story.title}》原文：“${p.text}” —— 横线处应填 “${target}”。`,
        speakText: tb,
        emoji: story.emoji,
      })
    }
    if (items.length >= 10) break
  }
  return items
}

// 查词：先精确匹配，再尝试去掉常见词尾(-s/-es/-ed/-ing/-ly/-er/-est)回退到词根。
function lookupZh(base: string): string | undefined {
  if (!base) return undefined
  if (BOOK_WORD_ZH[base]) return BOOK_WORD_ZH[base]
  for (const suf of ['est', 'ing', 'ed', 'es', 'ly', 'er', 's']) {
    if (base.endsWith(suf) && base.length - suf.length >= 3) {
      const stem = base.slice(0, -suf.length)
      if (BOOK_WORD_ZH[stem]) return BOOK_WORD_ZH[stem]
    }
  }
  return undefined
}

// 绘本原文逐词中文释义(小写、去标点后的词形 → 中文)。
// 当前覆盖 fg-1《Hi! Fly Guy》全部原文词汇;其他带 bookText 的故事可在此扩展。
const BOOK_WORD_ZH: Record<string, string> = {
  // 通用绘本词典(小写、去标点词形 → 中文)；覆盖 Fly Guy 各书高频词 + 每本核心词 + 全本生词。
  'a': "一个", 'about': "关于", 'above': "在…上面", 'action': "行动", 'adventures': "冒险(复数)", 'after': "在…之后",
  'again': "再次", 'agreed': "同意了", 'agreedbest': "最好地同意了", 'ahead': "向前", 'air': "空气", 'airplane': "飞机",
  'alien': "外星人", 'all': "全部", 'almost': "几乎", 'also': "也", 'always': "总是", 'am': "是",
  'amazing': "令人惊叹的", 'an': "一个", 'and': "和", 'angry': "生气的", 'another': "另一个", 'answer': "回答",
  'answered': "回答(过去)", 'any': "任何", 'anything': "任何东西", 'anyway': "无论如何", 'approved': "批准了", 'are': "是",
  'arent': "不是吗(aren't)", 'armpits': "腋下", 'around': "在…周围", 'arrived': "到了", 'art': "艺术", 'as': "当；像",
  'ask': "问", 'asked': "问(过去)", 'asleep': "睡着了", 'at': "在", 'ate': "吃(过去)", 'award': "奖",
  'away': "离开", 'awww': "啊(感叹)", 'baby': "宝宝", 'back': "回来；后面", 'backpack': "背包", 'backstroke': "仰泳",
  'backward': "向后", 'bad': "坏的", 'balance': "平衡", 'ball': "球", 'bath': "洗澡", 'bathtub': "浴缸",
  'be': "是", 'beach': "海滩", 'beautiful': "美丽的", 'became': "成为(过去)", 'because': "因为", 'become': "成为",
  'bed': "床", 'before': "在…之前", 'began': "开始(过去)", 'begin': "开始", 'behind': "在…后面", 'being': "存在",
  'bell': "铃铛", 'bench': "长椅", 'best': "最好的", 'between': "在…之间", 'bezt': "最好的(best)", 'big': "大的",
  'biggest': "最大的", 'bike': "自行车", 'bird': "鸟", 'birdbath': "鸟澡盆", 'bit': "一点", 'bizzy': "忙碌的(busy)",
  'black': "黑色的", 'blew': "吹了", 'blue': "蓝色的", 'boat': "船", 'boink': "哐(撞击声)", 'bolt': "闪电",
  'bone': "骨头", 'booger': "鼻屎", 'book': "书", 'bored': "无聊的", 'boss': "老板", 'both': "两者都",
  'bottom': "底部", 'bought': "买(过去)", 'bounce': "弹跳", 'bow': "鞠躬", 'bowed': "鞠躬(过去)", 'bowl': "碗",
  'box': "盒子", 'boy': "男孩", 'brains': "大脑(复数)", 'brave': "勇敢的", 'break': "打破", 'breakfast': "早餐",
  'bring': "带来", 'broke': "打破(过去)", 'brother': "兄弟", 'brought': "带来(过去)", 'brown': "棕色的", 'brush': "刷子",
  'brushes': "刷子(复数)", 'buckle': "扣子", 'bug': "虫子", 'build': "建造", 'building': "大楼", 'built': "建造(过去)",
  'bumping': "碰撞中", 'burnt': "烧焦的", 'burp': "打嗝", 'bus': "公交车", 'but': "但是", 'buy': "买",
  'buzz': "巴斯", 'buzzness': "嗡嗡忙乱", 'buzzz': "嗡(嗡嗡声)", 'buzzzzzz': "嗡(嗡嗡声)", 'buzzzzzzzz': "嗡(嗡嗡声)", 'by': "被；由",
  'cake': "蛋糕", 'call': "叫；打电话", 'called': "叫(过去)", 'came': "来(过去)", 'can': "能", 'cannot': "不能",
  'cant': "不能(can't)", 'cape': "披风", 'car': "汽车", 'care': "关心", 'carried': "搬了", 'carry': "搬",
  'castle': "城堡", 'cat': "猫", 'catch': "抓住", 'caught': "抓(过去)", 'cave': "洞穴", 'caveman': "穴居人",
  'chase': "追逐", 'chased': "追了", 'chasing': "追逐中", 'cheer': "欢呼", 'cheered': "欢呼(过去)", 'chicken': "鸡肉",
  'child': "孩子", 'children': "孩子们", 'chocolate': "巧克力", 'choose': "选择", 'chose': "选择(过去)", 'christmas': "圣诞节",
  'circus': "马戏团", 'city': "城市", 'class': "班级", 'clean': "干净的", 'close': "关上", 'closed': "关着的",
  'cloud': "云", 'coach': "教练", 'cold': "冷的", 'come': "来", 'completely': "完全地", 'control': "控制",
  'cook': "做饭", 'cool': "酷的", 'cooled': "变凉了", 'cost': "花费", 'costumes': "服装(复数)", 'could': "能；过去能",
  'course': "当然", 'cow': "牛", 'crash': "撞", 'crashed': "撞了", 'cried': "哭(过去)", 'crown': "王冠",
  'cry': "哭", 'cut': "切", 'cute': "可爱的", 'dad': "爸爸", 'dance': "跳舞", 'danced': "跳舞(过去)",
  'danger': "危险", 'dark': "黑暗", 'day': "白天", 'dear': "亲爱的", 'deep': "深的", 'desk': "书桌",
  'did': "做(过去)", 'didnt': "没做(didn't)", 'difficult': "困难的", 'digital': "数字的", 'dinner': "晚餐", 'dinnertime': "晚餐时间",
  'dinosaur': "恐龙", 'dirty': "脏的", 'disappear': "消失", 'dish': "盘子", 'display': "展示", 'dive': "俯冲",
  'dived': "俯冲(过去)", 'dizzy': "头晕的", 'do': "做", 'does': "做(三单)", 'dog': "狗", 'dont': "不要(don't)",
  'door': "门", 'doozie': "厉害的家伙", 'down': "向下", 'downstairs': "楼下", 'dragon': "龙", 'drank': "喝(过去)",
  'draw': "画", 'dream': "梦", 'drew': "画(过去)", 'drink': "喝", 'drive': "驾驶", 'driver': "司机",
  'drivers': "司机(复数)", 'dropped': "掉了", 'drove': "驾驶(过去)", 'dude': "家伙", 'dump': "倾倒", 'dumped': "倒了",
  'dwarf': "矮人", 'each': "每个", 'eat': "吃", 'eazzy': "容易的(easy)", 'egg': "蛋", 'either': "要么",
  'elephant': "大象", 'else': "其他", 'empty': "空的", 'end': "结束", 'enough': "足够", 'escape': "逃跑",
  'escaped': "逃跑(过去)", 'even': "甚至", 'ever': "曾经", 'every': "每个", 'everyone': "每个人", 'everyones': "每个人的",
  'everything': "每件事", 'everywhere': "到处", 'eye': "眼睛", 'face': "脸", 'factory': "工厂", 'fairy': "仙女",
  'fall': "掉", 'family': "家庭", 'famous': "有名的", 'fantastic': "极好的", 'far': "远的", 'fast': "快的",
  'favorite': "最喜欢的", 'favoriteshoo': "最喜欢的鞋", 'fed': "喂(过去)", 'feed': "喂", 'feel': "感觉", 'feet': "脚(复数)",
  'fell': "掉(过去)", 'felt': "感觉(过去)", 'field': "田野", 'fight': "打架", 'fin': "鳍", 'finally': "终于",
  'find': "找到", 'finger': "手指", 'fire': "解雇；开火", 'fired': "解雇(过去)", 'first': "第一", 'fish': "鱼",
  'fivezzz': "五(嗡)", 'flew': "飞(过去)", 'flies': "苍蝇(复数)", 'floor': "地板", 'fly': "飞", 'flying': "飞",
  'flyswatter': "苍蝇拍", 'flyswatters': "苍蝇拍(复数)", 'follow': "跟随", 'followed': "跟了", 'food': "食物", 'foot': "脚",
  'football': "足球", 'for': "为了；找", 'forever': "永远", 'forgave': "原谅(过去)", 'forget': "忘记", 'forgive': "原谅",
  'forgot': "忘记(过去)", 'fossil': "化石", 'fought': "打架(过去)", 'found': "找到(过去)", 'fountain': "喷泉", 'frankenfly': "弗兰蝇",
  'fred': "弗雷德(人名)", 'free': "自由的", 'freeze': "冻结", 'friend': "朋友", 'friendship': "友谊", 'frienz': "朋友们(friends)",
  'frog': "青蛙", 'from': "从", 'front': "前面", 'froze': "冻结(过去)", 'full': "饱的", 'fun': "有趣的",
  'funny': "有趣的", 'funzzie': "有趣的(funny)", 'futurethe': "未来那个", 'galaxy': "星系", 'game': "游戏", 'garbage': "垃圾",
  'garbageman': "垃圾工", 'garden': "花园", 'gasped': "倒吸一口气", 'gave': "给(过去)", 'gentleman': "绅士", 'gentlemans': "绅士们",
  'get': "得到", 'getting': "正在得到", 'giant': "巨大的", 'gift': "礼物", 'girl': "女孩", 'give': "给",
  'glass': "玻璃杯", 'gluk': "咕噜(声)", 'go': "走", 'goat': "山羊", 'going': "正在去", 'gone': "走了",
  'good': "好的", 'got': "得到(过去)", 'grab': "抓", 'grabbed': "抓(过去)", 'grandma': "奶奶", 'grandpa': "爷爷",
  'grape': "葡萄", 'great': "棒的", 'green': "绿色", 'grew': "长大(过去)", 'gross': "恶心的", 'grosser': "更恶心的",
  'ground': "地面", 'grow': "长大", 'growled': "咆哮", 'grozz': "恶心的(gross)", 'guards': "卫兵", 'guide': "向导",
  'guy': "家伙", 'had': "有(过去)", 'hair': "头发", 'hairy': "多毛的", 'hamburger': "汉堡", 'hamster': "仓鼠",
  'hand': "手", 'handsome': "英俊的", 'hang': "挂", 'happily': "开心地", 'happy': "高兴的", 'hard': "硬的",
  'has': "有", 'hat': "帽子", 'have': "有", 'he': "他", 'head': "头", 'hear': "听见",
  'heard': "听见(过去)", 'heavy': "重的", 'held': "握住(过去)", 'hello': "你好", 'helmet': "头盔", 'help': "帮助",
  'helped': "帮助(过去)", 'her': "她的", 'herder': "牧人", 'here': "这里", 'hero': "英雄", 'herozzz': "英雄(嗡)",
  'herozzzz': "英雄(嗡)", 'hes': "他是(he's)", 'hey': "嘿", 'hi': "你好", 'hid': "躲(过去)", 'hide': "躲藏",
  'hideandseek': "捉迷藏", 'high': "高的", 'himself': "他自己", 'his': "他的", 'hit': "打", 'hold': "握住",
  'hole': "洞", 'home': "家", 'homework': "家庭作业", 'hook': "钩子", 'hooray': "好耶", 'horse': "马",
  'hot': "热的", 'hotel': "旅馆", 'hotels': "旅馆们", 'hotelzz': "旅馆(嗡)", 'house': "房子", 'how': "怎么",
  'hug': "拥抱", 'hugged': "拥抱(过去)", 'hung': "挂(过去)", 'hungry': "饿的", 'hurt': "受伤", 'i': "我",
  'idea': "主意", 'if': "如果", 'ill': "生病的", 'im': "我是(I'm)", 'imagined': "想象", 'in': "在…里",
  'inside': "里面", 'instead': "反而", 'into': "进入", 'is': "是", 'island': "岛屿", 'iswatter': "是水(is water)",
  'it': "它", 'its': "它的", 'ive': "我已经(I've)", 'iz': "是(is)", 'jacks': "杰克们", 'jail': "监狱",
  'jar': "罐子", 'join': "加入", 'joined': "加入了", 'judge': "评委", 'judges': "评委", 'juice': "果汁",
  'jump': "跳", 'jumped': "跳(过去)", 'just': "刚才；仅仅", 'keep': "保持", 'kept': "保持(过去)", 'key': "钥匙",
  'kicked': "踢了", 'kid': "小孩", 'kids': "孩子们", 'king': "国王", 'kissed': "亲了", 'kissing': "正在亲",
  'kitchen': "厨房", 'knew': "知道(过去)", 'knocked': "敲了", 'know': "知道", 'knows': "知道(三单)", 'laboratory': "实验室",
  'lady': "女士", 'landed': "着陆", 'landing': "着陆", 'last': "最后的", 'late': "迟到的", 'laugh': "笑",
  'laughed': "笑(过去)", 'leading': "带领", 'learn': "学习", 'learned': "学习(过去)", 'leave': "离开", 'led': "带领了",
  'left': "离开(过去)", 'let': "让", 'light': "轻的", 'like': "喜欢", 'liked': "喜欢(过去)", 'line': "队伍",
  'lit': "点亮(过去)", 'little': "小的", 'lived': "住过", 'living': "生活", 'liz': "莉兹", 'lizzz': "莉兹(嗡)",
  'long': "长的", 'look': "看", 'looked': "看(过去)", 'looking': "看；寻找", 'loops': "圈圈", 'loozzz': "松的(loose嗡)",
  'lose': "丢失", 'lost': "丢失(过去)", 'lot': "许多", 'loud': "大声的", 'love': "爱", 'loved': "爱(过去)",
  'low': "低的", 'lumpy': "疙疙瘩瘩的", 'lunch': "午饭", 'lunchnot': "午饭不", 'lunchroom': "食堂", 'lunchtime': "午饭时间",
  'machines': "机器", 'mad': "生气的", 'made': "做(过去)", 'magic': "魔法", 'make': "做；制造", 'making': "正在做",
  'man': "男人", 'married': "结婚了", 'mascot': "吉祥物", 'mask': "面具", 'matching': "相配的", 'may': "也许",
  'maybe': "也许", 'me': "我", 'mean': "意思是", 'meanwhile': "与此同时", 'meet': "遇见", 'mess': "一团糟",
  'met': "遇见(过去)", 'mezzy': "脏乱的(messy)", 'might': "可能", 'milk': "牛奶", 'minute': "一会儿", 'miss': "错过",
  'missed': "错过(过去)", 'mom': "妈妈", 'monster': "怪物", 'mop': "拖把", 'more': "更；更多", 'morning': "早晨",
  'most': "最", 'motorboat': "汽艇", 'mouth': "嘴巴", 'museum': "博物馆", 'muzzle': "马兹尔(午餐阿姨)", 'muzzz': "嗡",
  'my': "我的", 'name': "名字", 'namebuzz': "名字(嗡)", 'named': "名叫", 'nasty': "讨厌的", 'neck': "脖子",
  'need': "需要", 'needed': "需要(过去)", 'needs': "需要(三单)", 'new': "新的", 'newzz': "新闻(news)", 'next': "下一个",
  'nice': "好的", 'night': "夜晚", 'ninja': "忍者", 'nizze': "不错的(nice)", 'no': "不；没有", 'nodded': "点头",
  'nose': "鼻子", 'not': "不", 'note': "便条", 'now': "现在", 'ocean': "海洋", 'of': "的",
  'off': "离开", 'oh': "哦", 'okay': "好的", 'old': "古老的", 'on': "在…上", 'once': "曾经",
  'one': "一", 'only': "只有", 'onto': "到...上", 'oops': "哎呀", 'oopz': "哎呀", 'oozy': "黏糊糊的",
  'open': "开着的", 'opened': "打开(过去)", 'or': "或者", 'other': "其他的", 'ouch': "哎哟", 'our': "我们的",
  'out': "出来", 'outside': "外面", 'over': "在…上方", 'overboard': "落水", 'own': "自己的", 'paid': "付(过去)",
  'paint': "颜料", 'painting': "画作", 'paper': "纸", 'parachutes': "降落伞", 'park': "公园", 'party': "派对",
  'pass': "经过", 'passing': "经过", 'past': "经过", 'pay': "付", 'peas': "豌豆", 'peeked': "偷看了",
  'perfect': "完美的", 'pests': "害虫", 'pet': "宠物", 'phonics': "自然拼读", 'picked': "摘了", 'picnic': "野餐",
  'pie': "派", 'piece': "一块", 'pig': "猪", 'pilot': "飞行员", 'pink': "粉色的", 'pirate': "海盗",
  'pirates': "海盗们", 'pizza': "披萨", 'place': "地方", 'plan': "计划", 'planet': "行星", 'planned': "计划了",
  'play': "玩", 'played': "玩(过去)", 'pocket': "口袋", 'pointed': "指向", 'pool': "泳池", 'porridge': "粥",
  'power': "力量", 'present': "礼物", 'pretended': "假装", 'pretty': "漂亮的", 'prince': "王子", 'princess': "公主",
  'project': "项目", 'proud': "骄傲的", 'puddle': "水坑", 'put': "放", 'puzzles': "拼图", 'quarterback': "四分卫",
  'quarterbacks': "四分卫们", 'queen': "女王", 'quick': "迅速的", 'quiet': "安静的", 'raced': "赛跑", 'rampaging': "横冲直撞",
  'ran': "跑(过去)", 'rang': "响(过去)", 'read': "读", 'ready': "准备好的", 'red': "红色的", 'release': "释放",
  'remembered': "记得", 'rescue': "救援", 'rescued': "救援(过去)", 'restaurant': "餐厅", 'ride': "乘坐", 'ridezzz': "骑(嗡)",
  'riding': "骑", 'right': "对的", 'ring': "响", 'rise': "升起", 'road': "路", 'roadkill': "路上死动物",
  'roar': "吼叫", 'roared': "吼叫(过去)", 'robot': "机器人", 'rocket': "火箭", 'rode': "乘坐(过去)", 'room': "房间",
  'rose': "升起(过去)", 'rotten': "腐烂的", 'round': "圆的", 'royal': "皇家的", 'roz': "罗兹(午餐阿姨)", 'rule': "统治",
  'run': "跑", 'running': "跑", 'sad': "伤心的", 'safe': "安全的", 'said': "说(过去)", 'saidglurk': "咕噜地说",
  'saidmizz': "Miz地说", 'saidmore': "更多地说", 'saidrozzz': "rozzz地说", 'same': "相同的", 'sang': "唱(过去)", 'sank': "沉(过去)",
  'sat': "坐(过去)", 'save': "拯救", 'saved': "拯救(过去)", 'saw': "看见(过去)", 'say': "说", 'scare': "吓",
  'scared': "害怕的", 'scary': "可怕的", 'school': "学校", 'score': "得分", 'scored': "得分", 'screamed': "尖叫",
  'second': "第二", 'secret': "秘密", 'see': "看见", 'seek': "寻找", 'sell': "卖", 'send': "送",
  'sent': "送(过去)", 'set': "放", 'shark': "鲨鱼", 'she': "她", 'shed': "棚屋", 'ship': "船",
  'shoo': "嘘走", 'short': "短的", 'shot': "射", 'shout': "喊", 'shouted': "喊(过去)", 'show': "表演；秀",
  'showed': "展示(过去)", 'shut': "关", 'side': "边", 'silly': "傻乎乎的", 'sing': "唱歌", 'sink': "沉",
  'sister': "姐妹", 'sit': "坐", 'size': "尺寸", 'skeleton': "骷髅", 'sky': "天空", 'sleep': "睡",
  'sleepy': "困的", 'slept': "睡(过去)", 'slime': "黏液", 'slimiest': "最黏的", 'slimy': "黏糊糊的", 'slow': "慢的",
  'small': "小的", 'smart': "聪明的", 'smartest': "最聪明的", 'smashed': "砸碎", 'smell': "闻", 'smelled': "闻了",
  'smelly': "臭的", 'smile': "微笑", 'smiled': "微笑(过去)", 'snapped': "猛咬", 'sneak': "潜行", 'sneaked': "潜行(过去)",
  'snow': "雪", 'so': "于是", 'soft': "软的", 'sold': "卖(过去)", 'some': "一些", 'something': "某物",
  'song': "歌", 'sorry': "抱歉", 'sought': "寻找(过去)", 'soup': "汤", 'sour': "酸的", 'space': "太空",
  'spaceship': "宇宙飞船", 'speak': "说", 'special': "特别的", 'spend': "花费", 'spent': "花费(过去)", 'spider': "蜘蛛",
  'spied': "发现(过去)", 'spilled': "洒了", 'spin': "旋转", 'spit': "吐", 'splashed': "溅起", 'splashing': "溅起",
  'spoke': "说(过去)", 'spooky': "诡异的", 'spoon': "勺子", 'spot': "斑点", 'spy': "发现", 'squawked': "嘎嘎叫",
  'stand': "站", 'star': "星星", 'started': "开始", 'stay': "留下", 'stayed': "留下了", 'stays': "留下",
  'steal': "偷", 'stepped': "踩", 'stick': "粘", 'sticky': "黏的", 'still': "仍然", 'stole': "偷(过去)",
  'stomp': "跺脚", 'stomped': "跺脚(过去)", 'stood': "站(过去)", 'stop': "停", 'stopped': "停(过去)", 'stormy': "暴风雨的",
  'straight': "直的", 'strange': "奇怪的", 'strong': "强壮的", 'stuck': "粘(过去)", 'stuff': "东西", 'suddenly': "突然",
  'sun': "太阳", 'super': "超级", 'superheroes': "超级英雄", 'superloudness': "超级大声", 'superstrength': "超级力量", 'supper': "晚餐",
  'sure': "当然", 'surprise': "惊讶", 'surprised': "惊讶的", 'surprizze': "惊喜(surprise)", 'survive': "幸存", 'swallow': "吞",
  'swam': "游泳(过去)", 'swatter': "苍蝇拍", 'swatting': "拍打", 'sweet': "可爱的", 'swim': "游泳", 'swing': "挥舞",
  'sword': "剑", 'swung': "挥舞(过去)", 'table': "桌子", 'tackle': "擒抱", 'tail': "尾巴", 'take': "拿",
  'tale': "故事", 'talk': "说话", 'talked': "说话(过去)", 'tall': "高的", 'tapped': "轻拍", 'tasty': "好吃的",
  'taught': "教(过去)", 'teach': "教", 'team': "团队", 'tear': "撕", 'teeth': "牙齿(复数)", 'tell': "告诉",
  'than': "比", 'thank': "谢谢", 'that': "那", 'the': "这/那", 'then': "然后", 'there': "那里",
  'these': "这些", 'they': "他们", 'thing': "东西", 'think': "想", 'this': "这", 'those': "那些",
  'thought': "想(过去)", 'three': "三", 'threw': "扔(过去)", 'throne': "王座", 'through': "穿过", 'throw': "扔",
  'time': "时间", 'tiny': "微小的", 'tipped': "倾斜", 'tired': "累的", 'title': "标题", 'to': "去；到",
  'toes': "脚趾", 'together': "一起", 'told': "告诉(过去)", 'tongue': "舌头", 'too': "太；也", 'took': "拿(过去)",
  'tooth': "牙齿", 'top': "顶部", 'tore': "撕(过去)", 'touchdown': "达阵", 'toupee': "假发", 'tour': "游览",
  'tours': "游览", 'town': "小镇", 'train': "火车", 'trash': "垃圾", 'tree': "圣诞树", 'trick': "戏法",
  'tried': "试了", 'trip': "绊倒", 'troll': "巨魔", 'truck': "卡车", 'trunk': "树干", 'tumbled': "翻滚",
  'turn': "转身", 'turned': "转了", 'turnip': "萝卜", 'two': "二", 'ugly': "丑的", 'under': "在…下面",
  'understand': "理解", 'understood': "理解(过去)", 'unlocked': "打开了", 'until': "直到", 'up': "向上", 'upon': "在…上",
  'upside': "颠倒", 'used': "用了", 'very': "非常", 'visit': "拜访", 'voice': "声音", 'waiter': "服务员",
  'wake': "醒", 'walk': "走", 'walked': "走(过去)", 'want': "想要", 'wanted': "想要(过去)", 'warm': "温暖的",
  'was': "是(过去)", 'wash': "洗", 'washed': "洗了", 'wasnt': "不是(wasn't)", 'water': "水", 'way': "路",
  'we': "我们", 'wear': "穿", 'well': "好", 'went': "去(过去)", 'were': "是(过去)", 'wet': "湿的",
  'whap': "啪(拍打)", 'what': "什么", 'wheel': "轮子", 'when': "什么时候", 'where': "哪里", 'while': "当…时候",
  'white': "白色的", 'who': "谁", 'why': "为什么", 'will': "将", 'win': "赢", 'wind': "风",
  'window': "窗户", 'wipers': "雨刷", 'with': "和；用", 'woke': "醒(过去)", 'won': "赢(过去)", 'wondered': "想知道",
  'wonderful': "棒极了", 'word': "词", 'wore': "穿(过去)", 'work': "工作", 'world': "世界", 'worried': "担心",
  'worry': "担心", 'worst': "最差的", 'would': "会", 'wow': "哇", 'write': "写", 'wrong': "错的",
  'wrote': "写(过去)", 'wuzzee': "是(was)", 'wuzzie': "是", 'wuzzle': "是", 'wuzzzup': "怎么了(what's up)", 'yay': "耶",
  'yeah': "yeah(对)", 'yell': "大叫", 'yelled': "大叫(过去)", 'yellow': "黄色的", 'yes': "是", 'yezz': "是的(yes)",
  'yezzz': "是的", 'yezzzz': "是的", 'yikes': "呀(惊呼)", 'yikezz': "呀", 'you': "你", 'young': "年轻的",
  'your': "你的", 'youre': "你是(you're)", 'yuck': "呸/讨厌", 'yuckzz': "呸(嫌弃)", 'yum': "好吃", 'zillion': "无数",
  'zoom': "飞驰", 'zoomed': "飞驰(过去)"
}

export default function StoryPage({
  moduleId,
  theme,
  stories,
  getStory,
  basePath,
  label,
  moduleEmoji,
}: StoryPageProps) {
  const { slug = '' } = useParams()
  const story = getStory(slug)

  const seedCards = useCourseStore((s) => s.seedCards)
  const addStars = useCourseStore((s) => s.addStars)
  const markStoryDone = useCourseStore((s) => s.markStoryDone)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addWrongWord = useCourseStore((s) => s.addWrongWord)

  const [tab, setTab] = useState<Tab>('vocab')
  const words = story?.words ?? []

  // 进入故事:把单词种子化进 SRS 调度池
  useEffect(() => {
    if (words.length === 0) return
    seedCards(words.map((w) => w.en), moduleId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.slug])

  if (!story) {
    return (
      <div className="empty">
        <p>没有找到这个 {label} 故事。</p>
        <Link to={basePath} className="btn">返回故事列表</Link>
      </div>
    )
  }

  const quiz = useMemo(
    () => (story.bookText && story.bookText.length > 0
      ? buildBookQuiz(story)
      : buildQuiz(words, stories.flatMap((s) => s.words))),
    [story.slug]
  )

  const quizBadge = story.bookText && story.bookText.length > 0
    ? '📖 绘本选词填空 · 读原文选一选'
    : '🎯 闯关测验 · 听一听选一选'

  const storyIdx = stories.findIndex((s) => s.slug === story.slug)
  const prevStory = storyIdx > 0 ? stories[storyIdx - 1] : null
  const nextStory = storyIdx >= 0 && storyIdx < stories.length - 1 ? stories[storyIdx + 1] : null

  const mc = { '--mc': theme.color, '--mc-soft': theme.colorSoft } as React.CSSProperties

  const resultLinks = (
    <>
      <Link to="/wrong" className="btn btn-soft">📋 看错题本</Link>
      <Link to={basePath} className="btn btn-soft">{moduleEmoji} 返回故事列表</Link>
    </>
  )

  return (
    <div className="page lesson-preview" style={moduleThemeVars(theme)}>
      <div className="page-head" style={mc}>
        <span className="page-emoji">{story.emoji}</span>
        <div>
          <div className="page-kicker">{label} · 第 {story.id} 关</div>
          <h1 className="page-title">{story.title}</h1>
        </div>
      </div>

      <SafeBoundary label={`${label} 学习`}>
        <div className="mode-badge mode-preview">{moduleEmoji} {label} 主题课</div>

        <div className="tab-bar" style={mc}>
          <button type="button" className={'tab-btn' + (tab === 'vocab' ? ' active' : '')} onClick={() => setTab('vocab')}>
            🎴 单词卡
          </button>
          <button type="button" className={'tab-btn' + (tab === 'sentences' ? ' active' : '')} onClick={() => setTab('sentences')}>
            {story.bookText ? '📖 绘本原文' : '💬 例句'}
          </button>
          <button type="button" className={'tab-btn' + (tab === 'quiz' ? ' active' : '')} onClick={() => setTab('quiz')}>
            🎯 闯关
          </button>
        </div>

        {tab === 'vocab' && <VocabTab words={words} mc={mc} />}
        {tab === 'sentences' && <SentencesTab story={story} words={words} mc={mc} />}
        {tab === 'quiz' && (
          <QuizEngine
            quiz={quiz}
            mcStyle={mc}
            badgeText={quizBadge}
            resultTitle="闯关完成！"
            resultLinks={resultLinks}
            onPick={({ en, correct }) => {
              seedCards([en], moduleId)
              recordReview(en, correct, moduleId)
            }}
            onFinish={(correct, total, wrongEns) => {
              const stars = correct === total ? correct + 5 : correct
              addStars(stars)
              markStoryDone(story.slug)
              wrongEns.forEach((en) => {
                const w = words.find((x) => x.en === en)
                if (w) addWrongWord({ en: w.en, zh: w.zh, emoji: w.emoji ?? moduleEmoji, from: story.title, module: moduleId })
              })
            }}
          />
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to={basePath} className="back-link">← 故事列表</Link>
        <div className="lesson-nav">
          {prevStory && (
            <Link to={`${basePath}/${prevStory.slug}`} className="btn btn-soft">← 上一关</Link>
          )}
          {nextStory && (
            <Link to={`${basePath}/${nextStory.slug}`} className="btn">下一关 →</Link>
          )}
        </div>
      </div>
    </div>
  )
}

function VocabTab({ words, mc }: { words: StoryWord[]; mc: React.CSSProperties }) {
  const [idx, setIdx] = useState(0)
  const [showZh, setShowZh] = useState(true)
  useEffect(() => { setIdx(0); setShowZh(true) }, [words])

  useEffect(() => {
    const cur = words[idx]
    if (cur) speakText(cur.en)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, words])

  if (words.length === 0) return <div className="empty"><p>这一关还没有单词。</p></div>

  const w = words[idx]
  const prev = () => setIdx((i) => (i - 1 + words.length) % words.length)
  const next = () => setIdx((i) => (i + 1) % words.length)

  return (
    <>
      <div className="flashcard" style={mc}>
        <div className="fc-emoji">{w.emoji ?? '✨'}</div>
        <div className="fc-word-row">
          <button type="button" className="fc-word" onClick={() => speakText(w.en)}>{w.en}</button>
          <SpeakButton text={w.en} label={w.en} />
          <SpeakButton text={w.en} label={`${w.en} 慢速`} slow />
        </div>
        {showZh ? (
          <div className="fc-zh" onClick={() => setShowZh(false)} title="点击隐藏中文">
            {w.zh}
          </div>
        ) : (
          <button type="button" className="fc-reveal" onClick={() => setShowZh(true)}>
            👀 显示中文
          </button>
        )}
        {w.sentence && (
          <div className="rg-sentence">
            <span className="rg-sentence-en">“{w.sentence}”</span>
            <span onClick={(e) => e.stopPropagation()}>
              <SpeakButton text={w.sentence} label="听例句" />
            </span>
            {w.sentenceZh && <span className="rg-sentence-zh">{w.sentenceZh}</span>}
          </div>
        )}
      </div>

      <div className="fc-progress">{idx + 1} / {words.length}</div>
      <div className="fc-dots">
        {words.map((_, i) => (
          <button
            key={i}
            type="button"
            className={'fc-dot' + (i === idx ? ' on' : '')}
            onClick={() => setIdx(i)}
            aria-label={`第 ${i + 1} 个单词`}
          />
        ))}
      </div>

      <div className="fc-controls">
        <button type="button" className="btn btn-soft" onClick={prev}>← 上一个</button>
        <button type="button" className="btn" onClick={next}>下一个 →</button>
      </div>

      <div className="word-list-mini" style={mc}>
        {words.map((ww, i) => (
          <div
            key={ww.en}
            className={'word-chip' + (i === idx ? ' on' : '')}
            onClick={() => setIdx(i)}
          >
            <span>{ww.emoji ?? '✨'}</span>
            <span>{ww.en}</span>
            <span onClick={(e) => e.stopPropagation()}>
              <SpeakButton text={ww.en} label={ww.en} />
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function SentencesTab({ story, words, mc }: { story: Story; words: StoryWord[]; mc: React.CSSProperties }) {
  const bookText = story.bookText
  // 绘本原文优先:按章节 / 页码顺序整段展示,不按单词列句
  if (bookText && bookText.length > 0) {
    return (
      <>
        <p className="lead">
          这是绘本的真实原文，按书里的章节顺序读一遍吧。
          <span className="sent-hint">点单词听发音，鼠标悬停看中文意思</span>
        </p>
        <div className="book-original">
          {bookText.map((ch, ci) => (
            <section key={ci} className="bo-chapter">
              {ch.chapter && <h3 className="bo-chapter-title">{ch.chapter}</h3>}
              <div className="bo-pages">
                {ch.pages.map((p, pi) => (
                  <div key={pi} className="bo-page" style={mc}>
                    <div className="bo-page-head">
                      {p.page != null && <span className="bo-page-num">p.{p.page}</span>}
                      <SpeakButton text={p.text} label="听原文" />
                    </div>
                    {(() => {
                      const toks = p.text
                        .split(/\s+/)
                        .filter(Boolean)
                        .map((tk) => {
                          const base = tk.toLowerCase().replace(/[^a-z]/g, '')
                          return { tk, zh: lookupZh(base) }
                        })
                      const autoZh = p.textZh
                        ? null
                        : toks.map((t) => t.zh).filter(Boolean).join(' ')
                      return (
                        <>
                          <p className="bo-text">
                            {toks.map((t, j) => (
                              <span
                                key={j}
                                className="rg-word-inline"
                                onClick={() => speakText(cleanForSpeak(t.tk))}
                                title={t.zh ? `${t.zh}（点击听发音）` : '点击听发音'}
                                {...(t.zh ? { 'data-zh': t.zh } : {})}
                              >
                                {t.tk}
                              </span>
                            ))}
                          </p>
                          {p.textZh ? (
                            <p className="bo-text-zh">{p.textZh}</p>
                          ) : autoZh ? (
                            <p className="bo-text-zh bo-text-zh--auto">{autoZh}</p>
                          ) : null}
                        </>
                      )
                    })()}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </>
    )
  }
  // 回退:无绘本原文的故事,仍按单词展示(学法句型 / 绘本原句)
  const withSent = words.filter((w) => w.sentence || w.bookSentence)
  if (withSent.length === 0) return <div className="empty"><p>这一关还没有例句。</p></div>
  return (
    <>
      <p className="lead">
        点击句子里高亮的单词，可以单独听发音。
        <span className="sent-hint">📖 绘本原句 取自绘本真实文字</span>
      </p>
      <div className="sent-list">
        {withSent.map((s, i) => {
          const isBook = !!s.bookSentence
          const text = s.bookSentence ?? s.sentence!
          const textZh = s.bookSentenceZh ?? s.sentenceZh
          const tokens = text.split(/\s+/).filter(Boolean)
          return (
            <div key={i} className="sent-card" style={mc}>
              <div className="sent-en-row">
                <span className="sent-en">
                  <b>{s.en}</b> · {s.zh}
                </span>
                <SpeakButton text={text} label={isBook ? '听绘本原句' : '听例句'} />
              </div>
              <div className="book-sentence">
                <div className="book-sentence-head">
                  <span className={'book-sentence-tag' + (isBook ? '' : ' book-sentence-tag--fallback')}>
                    {isBook ? '📖 绘本原句' : '例句'}
                  </span>
                </div>
                <div className="sent-zh sent-example">
                  “
                  {tokens.map((tk, j) => (
                    <span
                      key={j}
                      className="rg-word-inline"
                      onClick={() => speakText(cleanForSpeak(tk))}
                      title="点单词听发音"
                    >
                      {tk}
                    </span>
                  ))}
                  ”
                </div>
                {textZh && <div className="rg-sentence-zh">（{textZh}）</div>}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
