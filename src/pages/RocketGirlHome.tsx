import StoryHome, { type StoryBookEntry } from '@/components/StoryHome'
import {
  rocketGirlStories,
  rocketGirlBooks,
  rocketGirlStoryCount,
  rocketGirlWordCount,
  RG_THEME,
} from '@/data/rocketgirl'

const books: StoryBookEntry[] = rocketGirlBooks.map((b) => ({ key: b.file, title: b.title }))

export default function RocketGirlHome() {
  return (
    <StoryHome
      theme={RG_THEME}
      heroEmoji="🚀"
      heroTitle="Rocket Girl 英语闯关"
      heroSub={
        <>
          跟着宝贝最爱的 <b>Rocket Girl</b> 动画片学英语！<br />
          每集一个故事，边看边记 <b>{rocketGirlWordCount}</b> 个单词，
          共 <b>{rocketGirlStoryCount}</b> 个关卡。
        </>
      }
      heroTags={['📺 看动画', '🎴 记单词', '🎯 闯关测', '⭐ 得星星']}
      searchPlaceholder="🔍 搜故事名或单词，例如 rocket、superhero…"
      basePath="/rocketgirl"
      stories={rocketGirlStories}
      booksTitle="📖 绘本馆（本地绘本资源）"
      booksSummary={`📚 共 ${rocketGirlBooks.length} 本 Rocket Girl 连环画`}
      booksNote={
        <>
          这些是绘本 PDF 原件，存放在 <code>src/data/rocketgirl/</code>（约 435MB），
          已通过 <code>.gitignore</code> 排除、不进版本库。应用课程用的是从中提取的单词数据，
          绘本可在本地/开发环境打开阅读。
        </>
      }
      bookIcon="📕"
      books={books}
    />
  )
}
