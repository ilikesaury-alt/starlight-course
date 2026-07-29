// 故事类模块（Fly Guy / Rocket Girl 等）共享的数据结构。
// FGWord/RGWord 与 FGStory/RGStory 结构与此一致，可被 StoryPage 直接复用。

export interface StoryWord {
  en: string
  zh: string
  sentence?: string
  sentenceZh?: string
  emoji?: string
}

export interface Story {
  id: number
  slug: string
  title: string
  emoji: string
  words: StoryWord[]
}
