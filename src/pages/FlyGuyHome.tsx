// 🐝 Fly Guy 阅读 —— 整个模块就是一本阅读书（2026-11-17 重做，对齐 Rocket Girl）。
//
// 旧版是「StoryHome 书单 + StoryPage 闯关」（单词卡/例句/闯关三 Tab），
// 2026-11-13 起 Rocket Girl 已整体并入阅读模块，Fly Guy 是最后一个闯关形态，
// 本次迁到同一套 ReadingBook。页面骨架、hero 母题、通栏书单、点一本书就地
// 展开阅读器，全部复用 /reading 的 ReadingBook；这里只提供三样东西：
//   ① 数据源 FG_READING_SOURCE（22 本书；15 本按章拆课=绘本原文，7 本例句课）
//   ② custom 覆盖项（书名 / 面包屑 / 书目录 / FG 绿色 / 单元 emoji）
//   ③ 什么都不多做 —— 没有搜索、没有单词卡、没有闯关、没有星星。
//
// ⚠️ FG 不是 Starlight 第三册：不注册进 STARLIGHT_LEVELS / READING_PATHS，
// 也不渲染 StarlightSeriesTabs（/reading 的 e2e 钉死切换条恰好 2 项）。
//
// 版权口径与旧版一致：书目来自 Tedd Arnold 的《Fly Guy》原版系列；有原文的
// 15 本来自用户提供的实体书 txt，仅作合理使用展示，不内置整本书。

import ReadingBook, { type ReadingBookCustom } from '@/components/ReadingBook'
import { FG_THEME } from '@/data/story-themes'
import { FG_READING_SOURCE } from '@/data/flyguyReading'

const FG_BOOK: ReadingBookCustom = {
  pageClass: 'fg-reading-sheet',
  breadcrumb: [{ label: '🏠', to: '/' }, { label: 'Fly Guy 绘本' }],
  heroTitle: 'Fly Guy 绘本',
  heroStatement: (
    <>
      跟着小男孩 <b>Buzz</b> 和他的宠物苍蝇 <b>Fly Guy</b> 一本一本读
    </>
  ),
  heroSub: ({ storyCount, unitCount, distinctWords }) => (
    <>
      共 <b>{unitCount}</b> 本真实绘本 · <b>{storyCount}</b> 课 · <b>{distinctWords}</b> 个书里的词。
      点开一章自己读一遍，读不出的词点一下就能听发音。
      <span className="fg-copyright-note">
        书目来自 Tedd Arnold 的《Fly Guy》原版系列，绘本受版权保护，原文仅作合理使用展示，
        可在图书馆 / 书店借阅原版阅读。
      </span>
    </>
  ),
  hideSeriesTabs: true,
  theme: FG_THEME,
  // 「单元」是一本书：印书名，不套 Starlight 的 Module N 前缀。
  unitTitle: (m) => m.title,
  unitZh: (m) => m.titleZh,
  // 书图形用这一本的故事 emoji（绝不借用 Starlight 的 12 张主题图形）。
  unitIcon: (m) => <span aria-hidden="true">{m.emoji}</span>,
  treasureLabel: (m) => `${m.title} 的词`,
  lessonTestId: (m, l) => `rm-lesson-fg-${m.id}-${l.id}`,
  readerTitle: (m, l, p) => `🐝 第 ${l.id} 章 · ${p.title}`,
  readerSide: '🧒 自己读一遍 · 点词听发音',
  hint: '点单词听发音 · 高亮的是这本书的词',
}

export default function FlyGuyHome() {
  return <ReadingBook source={FG_READING_SOURCE} custom={FG_BOOK} />
}
