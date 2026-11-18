// 🧙 Winnie the Witch 阅读 —— 整本按页读（对齐 Fly Guy / Rocket Girl）。
//
// 页面骨架复用 /reading 的 ReadingBook；这里只提供数据源 WINNIE_READING_SOURCE
// 和 custom 覆盖项。书 = 1 个单元，20 个正文页 = 20 课。
//
// ⚠️ 版权口径：用户自有正版绘本（Valerie Thomas / Korky Paul），仅作合理使用
//    文字展示，不内置扫描图片、不内置整本书。原文经 OCR + 人工校对。

import ReadingBook, { type ReadingBookCustom } from '@/components/ReadingBook'
import { WINNIE_THEME } from '@/data/story-themes'
import { WINNIE_READING_SOURCE } from '@/data/winnieReading'

const WINNIE_BOOK: ReadingBookCustom = {
  pageClass: 'winnie-reading-sheet',
  breadcrumb: [{ label: '🏠', to: '/' }, { label: '绘本桥梁书馆', to: '/books' }, { label: '女巫温妮' }],
  heroTitle: 'Winnie the Witch 女巫温妮',
  heroStatement: (
    <>
      跟着女巫 <b>Winnie</b> 和她的黑猫 <b>Wilbur</b> 一页一页读
    </>
  ),
  heroSub: ({ storyCount, distinctWords }) => (
    <>
      共 <b>{storyCount}</b> 页绘本原文 · <b>{distinctWords}</b> 个书里的词。
      点开一页自己读一遍，读不出的词点一下就能听发音。
      <span className="winnie-copyright-note">
        文字来自 Valerie Thomas 著、Korky Paul 绘的正版绘本（ HarperCollins 出版），
        仅作合理使用展示；绘本受版权保护，可在图书馆 / 书店借阅原版看插画。
      </span>
    </>
  ),
  hideSeriesTabs: true,
  theme: WINNIE_THEME,
  unitTitle: (m) => m.title,
  unitZh: (m) => m.titleZh,
  unitIcon: (m) => <span aria-hidden="true">{m.emoji}</span>,
  treasureLabel: (m) => `${m.title} 的词`,
  lessonTestId: (m, l) => `rm-lesson-winnie-${m.id}-${l.id}`,
  readerTitle: (_m, l, p) => `🧙 ${p.title} · ${l.titleZh}`,
  readerSide: '🧒 自己读一遍 · 点词听发音',
  hint: '点单词听发音 · 高亮的是这一页的词',
}

export default function WinnieHome() {
  return <ReadingBook source={WINNIE_READING_SOURCE} custom={WINNIE_BOOK} />
}
