// 🐸 青蛙与蟾蜍阅读 —— 整本按故事读（对齐 Fly Guy / Winnie / RG）。
//
// 复用 ReadingBook：4 本子书 = 4 个单元，每本 5 个故事 = 20 课，全部收录。
//
// ⚠️ 版权口径：用户自有正版绘本（Arnold Lobel / HarperCollins），仅作合理使用
//   文字展示，不内置扫描图片。

import ReadingBook, { type ReadingBookCustom } from '@/components/ReadingBook'
import { FROG_THEME } from '@/data/story-themes'
import { FROG_READING_SOURCE } from '@/data/frogAndToadReading'

const FROG_BOOK: ReadingBookCustom = {
  pageClass: 'frog-reading-sheet',
  breadcrumb: [
    { label: '🏠', to: '/' },
    { label: '绘本桥梁书馆', to: '/books' },
    { label: '青蛙与蟾蜍' },
  ],
  heroTitle: 'Frog and Toad 青蛙与蟾蜍',
  heroStatement: (
    <>
      跟着 <b>Frog</b> 和 <b>Toad</b> 这对好朋友，一个故事一个故事读
    </>
  ),
  heroSub: ({ storyCount, unitCount, distinctWords }) => (
    <>
      共 <b>{unitCount}</b> 本故事书 · 已收录 <b>{storyCount}</b> 个故事 · <b>{distinctWords}</b> 个书里的词。
      点开一个故事自己读一遍，读不出的词点一下就能听发音。
      <span className="frog-copyright-note">
        文字来自 Arnold Lobel 的《Frog and Toad Storybook Favorites》（HarperCollins 出版），
        仅作合理使用展示；绘本受版权保护，可在图书馆 / 书店借阅原版看插画。
      </span>
    </>
  ),
  hideSeriesTabs: true,
  theme: FROG_THEME,
  // 单元是子书：书名较长，印书名主标题 + 中文副标题（下方栅格样式保证不挤）
  unitTitle: (m) => m.title,
  unitZh: (m) => m.titleZh,
  unitIcon: (m) => <span aria-hidden="true">{m.emoji}</span>,
  treasureLabel: (m) => `${m.title} 的词`,
  lessonTestId: (m, l) => `rm-lesson-frog-${m.id}-${l.id}`,
  readerTitle: (_m, l) => `🐸 ${l.title} · ${l.titleZh}`,
  readerSide: '🧒 自己读一遍 · 点词听发音',
  hint: '点单词听发音 · 高亮的是这个故事的词',
}

export default function FrogAndToadHome() {
  return <ReadingBook source={FROG_READING_SOURCE} custom={FROG_BOOK} />
}
