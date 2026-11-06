// 📚 阅读模块（/reading）—— 预备级（Oxford Starlight Starter）。
//
// Starlight 是一个系列：这一页只负责把「预备级数据源」喂给共享组件 ReadingBook，
// 页面本体（母题 / 单元折叠 / 阅读器 / e2e 契约）全在 ReadingBook 里，
// /reading1（第一册）用同一个组件，不写第二套页面。
//
// 刻意把数据源留在路由页里：modules 与 96 篇短文静态 import 只会打进
// /reading 的懒加载 chunk，第一册数据不会跟着预备级一起下载。

import ReadingBook from '@/components/ReadingBook'
import { READING_THEME, type ReadingSource } from '@/data/readingSeries'
import { modules } from '@/data/starlight'
import { getReadingPassage } from '@/data/reading'

export { READING_THEME }

// 首屏宝藏词示例：预备级沿用改造前写死的一组（都是 Unit 1 真实课本词），
// 保持 /reading 首屏逐字节不变；单测会逐个校验它们确实存在于课表。
const HERO_TREASURE_WORDS = ['hello', 'friend', 'name', 'color', 'good']

const SOURCE: ReadingSource = {
  level: 'starlight',
  mods: modules,
  passageOf: getReadingPassage,
  heroWords: HERO_TREASURE_WORDS,
}

export default function ReadingPage() {
  return <ReadingBook source={SOURCE} />
}
