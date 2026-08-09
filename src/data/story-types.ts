// 故事类模块（Fly Guy / Rocket Girl 等）共享的数据结构。
// FGWord/RGWord 与 FGStory/RGStory 结构与此一致，可被 StoryPage 直接复用。

export interface StoryWord {
  en: string
  zh: string
  sentence?: string
  sentenceZh?: string
  // 绘本原句：取自真实童书正文的短句摘录，帮助孩子在 App 与实体书之间建立联系。
  // 仅存少量、经过清理的原文短句，不内置整本受版权保护的书。
  bookSentence?: string
  bookSentenceZh?: string
  emoji?: string
}

// 绘本原文：按章节 / 页码组织的真实童书正文（来自用户提供的 txt），
// 用于「绘本原文」阅读视图。每页可带页码（page）、一句原文（text）与中文释义（textZh）。
export interface BookTextPage {
  page?: number
  text: string
  // 整页原文的中文释义（与 text 一一对应），帮助孩子在 App 与实体书之间建立联系。
  textZh?: string
}
export interface BookTextChapter {
  chapter?: string
  pages: BookTextPage[]
}

export interface Story {
  id: number
  slug: string
  title: string
  emoji: string
  words: StoryWord[]
  // 绘本原文（整段、按章节顺序）。存在时「绘本原文」视图优先展示它，不再按单词列句。
  bookText?: BookTextChapter[]
}
