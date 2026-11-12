import StoryPage from '@/pages/StoryPage'
import { rocketGirlStories, getStory, RG_THEME } from '@/data/rocketgirl'
import {
  rgStoryPages,
  rgReadingVocab,
  lookupRgZh,
} from '@/data/rocketgirlReading'

// 「并入阅读模块」的落点：
// Rocket Girl 保留 108 关的通关 / 星数 / 测验 / 绘本馆（全在 StoryPage 里），
// 只把「💬 例句」Tab 换成阅读模块那套 ReadingZone —— 逐词中文点读、高亮、
// 逐句/整篇朗读、中文对照、慢速、记忆色。
//
// ⚠️ 不注册成「阅读系列第三册」：RG 没有绘本正文，只有词条+例句，
// 而 /reading 的首屏母题是「只用了你学过的词」（零超纲口径由 readingPassage.test.ts
// 钉死）。把绘本词汇塞进那个母题等于当着孩子说假话，还会撞坏 33 条 e2e 契约。
// 所以复用的是**阅读器**，不是阅读目录。
const READING = {
  pagesOf: rgStoryPages,
  vocabOf: rgReadingVocab,
  lookup: lookupRgZh,
  hint: '点单词听发音 · 高亮的是这一关的词',
}

export default function RocketGirlStory() {
  return (
    <StoryPage
      moduleId="rocketgirl"
      theme={RG_THEME}
      stories={rocketGirlStories}
      getStory={getStory}
      basePath="/rocketgirl"
      label="Rocket Girl"
      moduleEmoji="🚀"
      reading={READING}
    />
  )
}
