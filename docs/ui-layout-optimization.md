# Starlight UI 布局专项优化

> 范围：只谈"布局"——元素尺寸/间距、网格与排列、信息密度、屏幕空间利用、导航可达性。
> 对应原审查报告 6 维度中与布局最相关的三块：操作简化（点击区/间距）、视觉设计（字号密度/信息层级）、导航结构（层级/可达性）。
> 已配合两张 before/after 可视化对比（首页课程入口、单词卡音频区）。

---

## 1. 首页课程入口：全宽列表 → 2 列模块宫格（最高优先）

**现状（问题）**
- `Home.tsx` 的 5 个课程入口是**全宽卡片**（`_theme.scss` 的 `.cn-home-entry` / `.en3-home-entry` / `.sl-home-entry` / `.rg-home-entry` / `.fg-home-entry`），每张带长副标题，如「人教版必背 · 8 单元 / 古诗词·课文·生字·日积月累」（`Home.tsx:40-79`）。
- 手机上要滚好几屏才能看完 5 个入口；长句对低龄是**信息过载**。
- 现成 `.module-grid` 已是 2 列宫格（`_home.scss:91-95`，`@media ≥520px` 两列），但 Home 没用它——入口仍是堆叠长卡。

**建议（after）**
- 改用 2 列宫格 tile：大 emoji + **短标题（4–8 字）** + 一个极简标签（如「12 单元」），副标题精简或下钻到模块页。
- 收益：首屏可见全部 5 个入口，滚动减半，认知负荷降。

```scss
// Home.tsx：5 个 entry Link 包进 .course-tiles
.course-tiles { display: grid; grid-template-columns: 1fr; gap: 10px; }
@media (min-width: 520px) { .course-tiles { grid-template-columns: 1fr 1fr; } }
.course-tile {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: var(--r-lg);
  background: var(--card); border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
}
.course-tile .t-emoji {
  font-size: 34px; width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--r-md); background: var(--mc-soft, var(--brand-soft));
  flex-shrink: 0;
}
.course-tile .t-title { font-size: var(--fs-lg); font-weight: 700; }
.course-tile .t-tag { font-size: var(--fs-sm); color: var(--mc, var(--brand)); font-weight: 700; }
```

---

## 2. 底部导航：课程不在一级 → 增加「课程」聚合入口

**现状（问题）**
- 底部导航只有 3 项：🏠首页 / 🔤字母 / 📊进度（`Layout.tsx:4-8`）。
- 5 个课程模块只能从首页卡片进；儿童在「字母/进度」页想切课程，必须先回首页再点，多一步。

**建议（after）**
- 底部导航加「📚课程」聚合入口（4 项），指向一个轻量课程 hub 页（复用 `.module-grid` 列出 5 模块），让模块**一级可达**。
- 底部仍保持大图标大字（≥50px 高，见 `_components.scss:80-96`），不要超过 5 项以免拇指够不到。

```tsx
// Layout.tsx navItems 增加一项
{ to: '/courses', label: '课程', emoji: '📚', end: false },
```

---

## 3. 单词卡音频区：两个小圆钮挤在单词旁 → 放大并归组

**现状（问题）**
- `.fc-word-row` 把单词 + 🔊 + 🐢🔊 并排（`_study.scss:39-48`，`gap:10px; flex-wrap`），两个 **38px** 圆钮在窄屏会挤、易误触相邻（`LessonPreview.tsx:154-155`）。
- `.speak-btn` 固定 38×38（`_components.scss:289-290`），低于儿童 44pt 规范。

**建议（after）**
- 单词居中放大；其下独立一行放两个音频按钮，间距 ≥14px，尺寸提到 **46px**；「显示中文」做成更醒目的大按钮（非小 pill）。

```scss
// _components.scss:289  speak-btn 38 → 46
.speak-btn { width: 46px; height: 46px; font-size: 20px; }
// _study.scss 新增音频行，把两个发音钮从 .fc-word-row 移出
.fc-audio-row { display: flex; gap: 14px; justify-content: center; margin-top: 12px; }
.fc-reveal { padding: 12px 22px; font-size: var(--fs-lg); }  // 更大更醒目
```

---

## 4. 字号密度：次要文字 12px → 13–14px（移动端基准）

**现状（问题）**
- `--fs-xs: 12px`（`_tokens.scss:94`）用在大量标签/状态/副标题；放大规则只在 ≥1024px 生效（`_responsive.scss`），**手机端 12px 文本不变**。
- `WrongBook.tsx:47` 写死 `fontSize:'13px'`，不随响应式放大。

**建议（after）**
- 移动端基准上调：`--fs-xs → 13px`、`--fs-sm → 14px`；桌面继续按 `_responsive.scss` 放大；移除硬编码 `13px`。
- 收益：低龄手机阅读更轻松，且不破坏设计系统。

---

## 5. 小点击元件：chip / 圆点 / lesson-pill 扩大命中区

**现状（问题）**
- `.chip` padding `6px 14px`（`_components.scss:333`）、`.word-chip` `8px 10px`（`_study.scss:116-129`）、`.fc-dot` 仅 8px（`_study.scss:103-112`）、`.lesson-pill` `min-width:52px`（`_home.scss:255-262`）——视觉小、可点区也小。

**建议（after）**
- 视觉可保持小，但命中区用 `padding` / `::before` 伪元素扩到 ≥40–44px；`.fc-dot` 加透明扩边，避免「点不中」。

---

## 6. 学习页面包屑：无 → 轻量层级提示

**现状（问题）**
- 仅「返回课程列表 / 返回首页」文字链接，无面包屑（`LessonPreview.tsx:105-123`）；3 层深度对低龄略深，易迷失。

**建议（after）**
- 关键学习页顶部加 `🏠 › 模块 › 单元` 的图标+短词面包屑，降低迷失感。

```scss
.crumbs { display: flex; gap: 6px; align-items: center; font-size: var(--fs-base); color: var(--ink-soft); padding: 8px 4px; }
```

---

## 7. 连续学习：页间跳转 → 同页切课

**现状（问题）**
- 「上一课/下一课」是路由跳转（整页刷新式）（`LessonPreview.tsx:110-114`），连续学习时每次回到新页面重新加载，节奏被打断。

**建议（after）**
- 单元内用同页 state 切课（借鉴现有 tab 切换思路），保持沉浸；配合面包屑/进度点不丢上下文。

---

## 优先清单（布局向）

| 优先级 | 改动 | 文件 | 当前值 → 建议值 |
|--------|------|------|----------------|
| 🔴 P0 | 首页课程宫格 | `Home.tsx` / `_home.scss` | 全宽长卡 → 2 列 tile |
| 🔴 P0 | 发音钮放大+音频行 | `_components.scss:289` / `_study.scss` | 38px 并排 → 46px 归组 |
| 🔴 P0 | 字号密度上调 | `_tokens.scss:94-95` | 12/13px → 13/14px |
| 🟡 P1 | 底部导航加课程入口 | `Layout.tsx:4-8` | 3 项 → 4 项 |
| 🟡 P1 | 学习页面包屑 | 各 lesson 页 | 无 → 轻量层级 |
| 🟡 P1 | 小元件命中区 | `_components.scss` / `_study.scss` | 视觉小→命中 ≥40px |
| 🟢 P2 | 同页切课 | `LessonPreview.tsx` | 路由跳转 → state 切换 |
