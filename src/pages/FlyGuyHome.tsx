import StoryHome, { type StoryBookEntry } from '@/components/StoryHome'
import {
  flyGuyStories,
  flyGuyBooks,
  flyGuyStoryCount,
  flyGuyWordCount,
  FG_THEME,
} from '@/data/flyguy'

const books: StoryBookEntry[] = flyGuyBooks.map((b) => ({ key: b.title, title: b.title }))

export default function FlyGuyHome() {
  return (
    <StoryHome
      theme={FG_THEME}
      heroEmoji="🐝"
      heroTitle="Fly Guy 英语闯关"
      heroSub={
        <>
          跟着小男孩 <b>Buzz</b> 和他最爱的小宠物苍蝇 <b>Fly Guy</b> 读绘本学英语！<br />
          每本一个主题，边读边记 <b>{flyGuyWordCount}</b> 个单词，
          共 <b>{flyGuyStoryCount}</b> 个故事关卡。
        </>
      }
      heroTags={['📖 读绘本', '🎴 记单词', '🎯 闯关测', '⭐ 得星星']}
      searchPlaceholder="🔍 搜故事名或单词，例如 fly、super、pet…"
      basePath="/flyguy"
      stories={flyGuyStories}
      booksTitle="📖 真实书单（Fly Guy 系列）"
      booksSummary={`📚 共 ${flyGuyBooks.length} 本 Fly Guy 绘本`}
      booksNote={
        <>
          书目来自 Tedd Arnold 的《Fly Guy》原版系列（约 2005–2020 年出版，
          美国最畅销的早期分级读物之一）。绘本受版权保护，不内置在应用里；
          上面 <b>{flyGuyStoryCount}</b> 个故事关卡全部对应这些真实书目，可在图书馆 / 书店借阅原版阅读。
        </>
      }
      bookIcon="🐝"
      books={books}
    />
  )
}
