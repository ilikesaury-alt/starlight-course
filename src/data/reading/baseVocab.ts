// 阅读短文「零超纲」词表 —— 全站唯一真源。
//
// 背景（实测数据，勿凭感觉改）：
//   Starlight 96 课去重单词只有 296 个，每课仅 3~5 个词，每单元词表 15~38 词；
//   课本原文 741 个去重 token 里只有 31.2% 命中词表，其余全是功能词。
//   → 只用「本课那 4 个词」物理上写不出 70~100 词的短文，
//     所以零超纲 = 基线高频词表 ∪ 受控人名 ∪ 本单元全部课词表 ∪ 本课词表。
//
// 口径纪律：
//   1. 内容生成（子 Agent）与单测都从这里取 allowedWordsFor()，
//      **不要在别处再实现一份词表**，两处实现必然漂移。
//   2. 加 BASE_WORDS 只能加「学前到小学一年级就该认识」的词；
//      加本课专属的生词请走 lessons.ts（本课词表），别塞进基线。
//   3. BASE_WORDS 允许与课内词表重叠（取并集），重叠无害，不必去重后再加。

import { lessonsByUnit } from '../lessons'

/** 缩写/缩写的完整写法：教材里 "I'm good." 极常见，词表必须收 surface form */
const CONTRACTIONS = [
  "i'm", "you're", "he's", "she's", "it's", "we're", "they're",
  "that's", "what's", "who's", "where's", "here's", "there's", "let's",
  "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't",
  "can't", "won't", "wouldn't", "couldn't", "shouldn't", "haven't", "hasn't", "hadn't",
]

/** 功能词、代词、助动词、介词、连词、疑问词、数字 */
const FUNCTION_WORDS = [
  'a', 'an', 'the', 'and', 'but', 'or', 'so', 'because', 'if', 'then', 'than', 'as',
  'that', 'this', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'me', 'you', 'he', 'she', 'it', 'we', 'they', 'him', 'them', 'us', 'i',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did', 'done', 'have', 'has', 'had',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'not', 'no', 'yes', 'ok', 'okay', 'oh', 'wow', 'hi', 'hello', 'bye', 'please', 'thanks', 'sorry', 'thank',
  'very', 'too', 'now', 'again', 'also', 'just', 'only', 'even', 'still', 'well', 'away',
  'all', 'some', 'many', 'much', 'more', 'most', 'any', 'every', 'each', 'both', 'other', 'same', 'everyone',
  'here', 'there', 'today', 'tomorrow', 'yesterday', 'always', 'never', 'often', 'sometimes',
  'in', 'on', 'at', 'to', 'from', 'with', 'of', 'for', 'about', 'after', 'before',
  'up', 'down', 'out', 'off', 'over', 'under', 'into', 'near', 'behind', 'like', 'together', 'world',
  'what', 'who', 'where', 'when', 'why', 'how', 'which',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'chinese',
]

/** 基础动作：短文要能叙事，全靠词表里那 3~5 个内容词是撑不起故事的 */
const VERBS = [
  'go', 'come', 'run', 'walk', 'jump', 'sit', 'stand', 'play', 'read', 'write', 'sing', 'dance',
  'draw', 'eat', 'drink', 'sleep', 'look', 'see', 'watch', 'listen', 'say', 'tell', 'ask', 'answer',
  'call', 'smile', 'laugh', 'cry', 'help', 'find', 'put', 'take', 'give', 'get', 'open', 'close',
  'stop', 'start', 'want', 'need', 'know', 'think', 'make', 'try', 'use', 'show', 'bring', 'carry',
  'catch', 'throw', 'kick', 'ride', 'fly', 'swim', 'climb', 'count', 'clap', 'wave', 'point',
  'touch', 'feel', 'keep', 'hold', 'wear', 'wash', 'clean', 'cook', 'wait', 'share', 'meet', 'visit',
  'live', 'work', 'like', 'love', 'have', 'hop', 'glue', 'stick', 'push', 'hear',
]

/** 基础名词 */
const NOUNS = [
  'boy', 'girl', 'man', 'woman', 'baby', 'mom', 'dad', 'mum', 'family', 'friend', 'name',
  'home', 'house', 'room', 'school', 'bag', 'book', 'pen', 'desk', 'chair', 'table', 'bed',
  'door', 'window', 'tree', 'flower', 'sun', 'moon', 'star', 'sky', 'cloud', 'rain', 'snow', 'wind',
  'day', 'night', 'morning', 'afternoon', 'evening', 'time', 'way', 'place', 'thing',
  'toy', 'ball', 'doll', 'car', 'bus', 'bike', 'boat', 'train', 'plane', 'food', 'cake', 'milk',
  'bread', 'apple', 'water', 'box', 'game', 'song', 'story', 'picture', 'color', 'letter',
  'number', 'nose', 'park', 'yard', 'grass', 'leaf', 'hat', 'shoe', 'sock', 'shirt', 'coat', 'dress',
  'soup', 'juice', 'rice', 'sand', 'ice', 'hill', 'road', 'cup', 'plate',
  'dragon', 'kiwi', 'pineapple', 'lychee', 'dough', 'buns', 'back', 'breakfast', 'skate', 'sea', 'umbrella', 'tennis', 'animal', 'round', 'bump', 'bang', 'wheel', 'high', 'top', 'light', 'turn', 'straight', 'right', 'fire', 'station', 'police', 'truck',
]

/** 形容词 */
const ADJECTIVES = [
  'big', 'small', 'tall', 'short', 'long', 'new', 'old', 'hot', 'cold', 'warm', 'cool',
  'happy', 'sad', 'good', 'bad', 'fast', 'slow', 'nice', 'fine', 'fun', 'funny', 'pretty', 'clean',
  'hungry', 'thirsty', 'sleepy', 'ready', 'kind', 'loud', 'quiet', 'soft', 'hard', 'wet', 'dry',
  'gummy', 'yummy', 'jelly', 'steamed', 'empty', 'brush', 'merry', 'bumper', 'ferris',
]

/** 动物：短文主角常是动物，动物名必须全在词表内 */
const ANIMALS = [
  'cat', 'dog', 'bird', 'fish', 'duck', 'hen', 'bunny', 'bear', 'panda', 'monkey', 'frog',
  'lion', 'tiger', 'pig', 'cow', 'goat', 'sheep', 'horse', 'mouse', 'fox', 'bee', 'ant',
  'butterfly', 'egg', 'zoo',
]

/** 颜色与身体 */
const COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'brown', 'gray', 'gold', 'silver']
const BODY = ['head', 'hand', 'foot', 'feet', 'eye', 'ear', 'nose', 'mouth', 'arm', 'leg', 'face', 'hair', 'tooth']

/** 不规则变化：词形回退覆盖不了的（过去式/比较级/不规则复数）显式收口 */
const IRREGULARS = [
  'said', 'saw', 'ate', 'ran', 'sang', 'swam', 'flew', 'drew', 'wrote', 'slept', 'stood', 'sat',
  'took', 'came', 'gave', 'got', 'made', 'knew', 'thought', 'felt', 'kept', 'held', 'left', 'met',
  'brought', 'caught', 'chose', 'fell', 'forgot', 'heard', 'lost', 'sent', 'spoke', 'wore', 'won',
  'began', 'became', 'bought', 'built', 'taught', 'drank', 'laid', 'paid', 'understood', 'grew',
  'children', 'men', 'women', 'feet', 'teeth', 'mice', 'people', 'person', 'geese', 'leaves',
  'better', 'best', 'worse', 'worst', 'less', 'least', 'little', 'far',
]

/** 基线词表（已去重）：零超纲校验的第一层 */
export const BASE_WORDS: readonly string[] = [
  ...new Set([
    ...FUNCTION_WORDS,
    ...CONTRACTIONS,
    ...VERBS,
    ...NOUNS,
    ...ADJECTIVES,
    ...ANIMALS,
    ...COLORS,
    ...BODY,
    ...IRREGULARS,
  ]),
]

/**
 * 受控人名白名单。
 * 短文主角每课自由（可能是人），但人名不是「学过的词」，必须显式收口，
 * 否则 96 篇会各自发明名字，等于零超纲失效。
 */
export const NAMES: readonly string[] = ['abby', 'leo', 'grace', 'sam', 'anna', 'ben', 'mia', 'tom', 'lily', 'kate', 'jack', 'emma']

/** 切词口径：保留撇号（i'm 是一个词），全小写。测试与生成必须共用这一个函数。 */
export function tokenizeReading(text: string): string[] {
  return text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []
}

/**
 * 词形回退：把 playing / running / says / babies / bigger 还原成候选原形。
 * 短文写的是「说的话」，必然带 -s / -ing / -ed / -er 这类变形，
 * 词表里只存原形，靠这里把变形接回原形，而不是把变形一个个塞进词表。
 */
function stemsOf(token: string): string[] {
  const out = new Set<string>([token])
  const add = (s: string) => { if (s.length >= 2) out.add(s) }
  if (token.endsWith('ies')) add(token.slice(0, -3) + 'y')
  if (token.endsWith('ing')) {
    const s = token.slice(0, -3)
    add(s); add(s + 'e')
    if (/(.)\1$/.test(s)) add(s.slice(0, -1)) // running → run
  }
  if (token.endsWith('ed')) {
    const s = token.slice(0, -2)
    add(s); add(s + 'e')
    if (/(.)\1$/.test(s)) add(s.slice(0, -1)) // stopped → stop
  }
  if (token.endsWith('est')) {
    const s = token.slice(0, -3)
    add(s); add(s.slice(0, -1) + 'i') // happiest → happi → happy
  }
  if (token.endsWith('er')) {
    const s = token.slice(0, -2)
    add(s); add(s.slice(0, -1) + 'y') // happier → happy
  }
  if (token.endsWith('es')) add(token.slice(0, -2))
  if (token.endsWith('s')) add(token.slice(0, -1))
  return [...out]
}

/** 这个 token 是否落在允许词表内（含词形回退） */
export function isAllowedWord(token: string, allowed: Set<string>): boolean {
  const t = token.toLowerCase()
  return stemsOf(t).some((s) => allowed.has(s))
}

/** 单元号-课号，如 '1-1'（与 starlight-passage / dialogue 同一套命名） */
export function readingKey(unitId: number, lessonId: number): string {
  return `${unitId}-${lessonId}`
}

/** unit → 该单元全部课的词表（后一课可以复用前一课的词） */
function unitWordsOf(unitId: number): Set<string> {
  const out = new Set<string>()
  for (const lesson of lessonsByUnit[unitId] ?? []) {
    for (const w of lesson.words) out.add(w.en.toLowerCase())
  }
  return out
}

/**
 * 某一课短文允许出现的全部词：基线 ∪ 人名 ∪ 本单元词表 ∪ 本课词表。
 * @param unitId 单元号（1~12）
 * @param lessonId 课号（1~8）
 */
export function allowedWordsFor(unitId: number, lessonId: number): Set<string> {
  const out = new Set<string>(BASE_WORDS)
  for (const n of NAMES) out.add(n)
  for (const w of unitWordsOf(unitId)) out.add(w)
  for (const w of lessonsByUnit[unitId]?.find((l) => l.id === lessonId)?.words ?? []) {
    out.add(w.en.toLowerCase())
  }
  return out
}

/** 96 课的 key 全集，用作「短文是否课课都有」的判定基准 */
export function allReadingKeys(): string[] {
  const keys: string[] = []
  for (const [unitId, lessons] of Object.entries(lessonsByUnit)) {
    for (const lesson of lessons) keys.push(readingKey(Number(unitId), lesson.id))
  }
  return keys
}