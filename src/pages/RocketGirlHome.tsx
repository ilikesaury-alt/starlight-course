// 🚀 Rocket Girl 阅读 —— 整个模块就是一本阅读书。
//
// 页面骨架、hero 母题、通栏故事弧目录、展开见宝藏词、点一条就地展开阅读器，
// 全部复用 /reading 的 ReadingBook；这里只提供三样东西：
//   ① 数据源 RG_READING_SOURCE（27 个故事弧 × 4 集 = 108 篇例句阅读）
//   ② custom 覆盖项（书名 / 面包屑 / 弧名目录 / RG 紫色 / RG 查词链）
//   ③ 什么都不多做 —— 没有搜索、没有绘本馆、没有 Tab、没有测验、没有星星。
//
// ⚠️ RG 不是 Starlight 第三册：不注册进 STARLIGHT_LEVELS / READING_PATHS，
// 也不渲染 StarlightSeriesTabs（/reading 的 e2e 钉死切换条恰好 2 项）。

import ReadingBook, { type ReadingBookCustom } from '@/components/ReadingBook'
import { RG_THEME } from '@/data/story-themes'
import { RG_READING_SOURCE, lookupRgZh } from '@/data/rocketgirlReading'

const RG_BOOK: ReadingBookCustom = {
  pageClass: 'rg-reading-sheet',
  breadcrumb: [{ label: '🏠', to: '/' }, { label: 'Rocket Girl 阅读' }],
  heroTitle: 'Rocket Girl 阅读',
  heroStatement: (
    <>
      跟着 Roxy <b>一集一集读故事</b>
    </>
  ),
  heroSub: ({ storyCount, unitCount, distinctWords }) => (
    <>
      共 <b>{unitCount}</b> 个故事 · <b>{storyCount}</b> 集 · <b>{distinctWords}</b> 个不同的词。
      点开一集自己读一遍，读不出的词点一下就能听发音。
    </>
  ),
  hideSeriesTabs: true,
  theme: RG_THEME,
  // 「单元」是故事弧：直接印弧名，不套 Starlight 的 Module N 前缀。
  unitTitle: (m) => m.title,
  unitZh: (m) => m.titleZh,
  // 弧图形用这一弧第一集的故事 emoji（绝不借用 Starlight 的 12 张主题图形）。
  unitIcon: (m) => <span aria-hidden="true">{m.emoji}</span>,
  treasureLabel: (m) => `${m.title} 的词`,
  lessonTestId: (m, l) => `rm-lesson-rg-${m.id}-${l.id}`,
  readerTitle: (m, l) => `🚀 第 ${l.id} 集 · ${l.title}`,
  readerSide: '🧒 自己读一遍 · 点词听发音',
  lookup: lookupRgZh,
  hint: '点单词听发音 · 高亮的是这一集的词',
}

export default function RocketGirlHome() {
  return <ReadingBook source={RG_READING_SOURCE} custom={RG_BOOK} />
}
