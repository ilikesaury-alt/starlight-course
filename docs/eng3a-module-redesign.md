# 三年级上册英语（/eng3a）重设计 — 工作记录（tasteskill v2）

> 最后一个模块：5 个页面（约 35KB）+ `_eng3a.scss`（828 行 / 24.4KB）+ `eng3a.ts`（91KB 教材数据）
> + `tests/eng3a.spec.ts` 13 条密集契约。
> Before：`.taste-skill/eng3a-before/{home,unit,lesson,play}/`
> After：`.taste-skill/eng3a-final/`
> 侦察：subagent 只读报告（未入库）

## 0. 这一轮和前几轮最大的不同：**有真 FAIL**

前面六个模块 before 都是 0 FAIL / 0~2 WARN（量不出来的问题）；eng3a 的 before 是：

| 路由 | before |
|---|---|
| home | 0 FAIL / 2 WARN（heavy-borders 饱和描边 · below-fold 19 块只露 6） |
| **unit** | **1 FAIL** / 0 WARN — `contrast` 1.9:1（亮琥珀字压浅黄底，4 处） |
| **lesson** | **1 FAIL** / 3 WARN — 同样 1.9:1（2 处）+ 14 个饱和描边 + panel-void + tiny-text |
| play | 0 FAIL / 1 WARN（hero-void） |

字号：home 10 档、lesson 11 档，含 11px 小字。

根因：`src/data/eng3a.ts:248` 的模块主题色是**亮琥珀 `#f59e0b`**，`moduleThemeVars()` 把它注入
`--mc`；而 `_chinese.scss` / `_eng3a.scss` 里多处**直接拿 `--mc` 当文字色**（`.cn-section-title`
/ `.cn-unit-stat` / `.cn-tag` / `.en3-gallery-title` / `.en3-tip-eq` …），压在 `--mc-soft`
（`#fef3c7` 浅黄）或骨白底上只有 1.9:1，远低于 WCAG AA 的 4.5:1。
这是**真读不清**，不是审美问题。

## 1. 方向

| 项 | 值 |
|---|---|
| app 风格 | `framed-sheet`（与其它模块共用 `mixins.scss` 的 `paper-sheet`） |
| Idea | 外研版 2024 新课标教材的「**每单元五关**」（认单词 → 说句子 → 唱起来 → 长知识 → 闯关测）是这个模块独有的结构，它是一条路径，不是五张卡 |
| 必须保留 | **教材原版插图**（`eng3a.ts` 用 `import.meta.glob` 静态导入，是内容资产，不是装饰图） |

**作用域**：4 个页面挂 `.eng3a-sheet`；关卡页走共享组件 `SelfStudyLesson`，
它的根是 `.page.cn-lesson[data-module='eng3a']` —— 用**属性选择器**接住，
不动共享组件（语文模块也用它，加类会串模块）。

## 2. 改了什么

### 2.1 修两个真 FAIL（不是皮肤）

- **contrast 1.9:1 → 达标**：把 `.cn-section-title` / `.cn-unit-stat` / `.cn-tag` /
  `.en3-gallery-title` / `.en3-section-lead` / `.en3-tip-eq` / `.en3-play-arrow` /
  `.en3-board-title` 在作用域内的文字色统一改成 `--ink`（深墨）。
  单元页「🛤️ 5 关 / 🎓 已学完 0 …」从淡黄胶囊改成细线一行，字色改深。
- **14 个 heavy-borders → 0**：源头是 `.en3-flip-face` 的 `border-top: 4px solid var(--mc)`
  （不是 `.en3-flip-card::before`，第一次猜错了）。改成 1px 细边，只给正面一条 2px
  主题细线做区分。
- **tiny-text 51% → 0**：`.en3-stage-idx`（11px）/.en3-flip-egzh（11px）/
  `.en3-pathbar-label`（11px）等统一提到 13px。

### 2.2 白纸页骨架与版式

- 5 个页面统一白纸页：h1 22/30 → **24px**，删页头 emoji，kicker 降级小字。
- **三板块导航**（`.en3-board` ×3）：2px 彩色左边条 → 1px 细边卡。
- **五关路径**（`.en3-path-step` ×5）：5 张同构白卡 → **一条轨道**（编号圆点 + 节点间连线）；
  并把「互动方式」移到行右端，让 1200px 宽的行不再只装左边 400px 内容 —— 这一步消掉了
  `hero-void 31%`。
- 单元页：`.cn-lesson-card` ×5 的 2px 边 + 6px 满色左条 → 细线行；进度胶囊 → 细线一行。
- 关卡页：stage banner 降层；翻卡去橙顶条；补充词 chip 去药丸。
- 小剧场：3 张剧本卡 → 细线行；角色 chip / 剧本行去药丸与满色左条。
- **教材插画全部保留**（单元页 cover、关卡页 lesson-cover、gallery）。

### 2.3 顺手修了一个真内容丢失

侦察发现 `.en3-flip-card { height:152px }` + `.en3-flip-face { overflow:hidden }` +
`.en3-flip-eg { -webkit-line-clamp:3 }` + 11px 译文，会让 w0-1 的长例句
（「Goodbye, Bobo. Have a nice day!」）在 148px 窄卡里**被裁掉且无展开入口**。
作用域内改为 `min-height:168px` + `overflow:visible` + `line-clamp:unset` + 译文 12px。

## 3. Critique

```
ROUND 1 — before
Seen in one second: 淡黄横幅、一排药丸、三张带彩色边条的卡、五张一样的白卡。
Idea: 外研版教材的「每单元五关」—— 但被做成了五张同构卡，看不出是路径。
Live thing: 教材原版插图 + 单词翻卡 + 句子连线（都在）。
Scores: design 3 · usability 4（文字真读不清）· creativity 4 · content 9 → overall 4.6
Caps applied: 2 FAIL（contrast 1.9:1）· 14 个饱和描边 · 11 档字号 · 11px 小字
Top three problems:
1. 亮琥珀字压浅黄底 1.9:1 —— 单元页和关卡页的区块标题读不清。
2. 14 张翻卡顶着 4px 满色橙条，一屏全是橙色边框。
3. 五关是五张一样的白卡，没有连线、没有顺序感；右半屏空着。
```

```
ROUND 2 — after
Seen in one second: 一页纸上，标题、进度一行、三板块、下面一条五关轨道，教材插画在位。
Idea: 五关是一条轨道（编号圆点 + 连线），右端写着这一关怎么练。
Live thing: 翻卡 / 连线 / 教材插画 / 角色朗读（全部保留）。
Scores: design 7 · usability 8 · creativity 7 · content 9 → overall 7.8
Caps applied: 0 FAIL；unit / lesson 两个路由 0 WARN；字号 home 11→? 档、lesson 11→10 档
Top three remaining problems:
1. home 留 1 个 no-data-hue WARN：五关轨道被检测器当图表，但 0/38 关完成，
   全灰是诚实的（§5 颜色说好坏，没数据就不该有色）—— 可辩护，不硬凑颜色。
2. play 留 1 个 hero-void WARN：3 行剧本列表的右侧留白，短列表页固有形态。
3. 侦察还发现 7 个**功能 bug**（见下节），不在本轮 UI 范围内，未修。
```

## 4. ⚠️ 侦察发现但本轮**未修**的 7 个真 bug

这些不是皮肤问题，且多数在**共享组件**里（影响语文模块），需要单独一轮、单独验证：

| # | bug | 位置 | 影响 |
|---|---|---|---|
| 1 | 自测最后一题答对**多算 1 分**：`setCorrect(c=>c+1)` 之后 `finalCorrect = ... correct+1` 又 +1 → `onSubmit(N+2,N)` | `SelfStudyLesson.tsx:248-266` | eng3a 35 关 + 语文共享课；store 存「7/6」 |
| 2 | **错题只收最后一题**：除 `i===idx` 外 `picked` 恒 undefined 直接 return，切题不清历史 | `SelfStudyLesson.tsx:258-265` | 与「错题自动进错题本」矛盾 |
| 3 | **角色筛选丢台词**：`l.speaker===role` 精确匹配，但 `Deer & Mouse` / `Mulan's family` / `Soldier 1/2` / `The Bears` 都不在 `characters` 里 | `Eng3aPlayScript.tsx:67-68` + `eng3a.ts` | 3 出戏都有，e2e 只断言 0<n<16 测不出 |
| 4 | 朗读中切角色**高亮与声音错位**：切角色不 `cancelSpeech`、不重置 `nowLine` | `Eng3aPlayScript.tsx:70-79` | 声音是旧角色、高亮落新列表同索引 |
| 5 | 翻卡背面例句被裁（**本轮已用 CSS 修**） | `_eng3a.scss:421/452/473` | 已修 |
| 6 | `hasAnything` 漏判 `moreWords`/`tips`；`EngMatchPairs` 永远只抽最短 4 句 | `Eng3aLesson.tsx:107` / `EngMatchPairs.tsx:31` | 练习覆盖缺口 |
| 7 | 排除项：`dayStamp()` 是距 epoch 天数，`cur -= 1` 跨月计算是**正确**的，别当 bug 修 | `srs.ts:43-45` | — |

另：`.en3-word-*`（`_eng3a.scss:56-134`，约 80 行）是历史死代码，5 页面 + 3 组件零引用；
20+ 处 `box-shadow: var(--shadow-sm)` 因令牌为 `none` 全是死声明。本轮未清理（避免超范围）。

## 5. 验证

```
npm run test    364 passed / 30 files
npm run check   ✓     npm run lint  ✓     npm run build  ✓
npm run e2e     96 passed / 3 skipped / 0 failed
eng3a.spec.ts   11 passed（单独跑）
inspect.mjs     home 0F/1W(no-data-hue) · unit 0F/0W · lesson 0F/0W · play 0F/1W(hero-void)
```

**e2e 契约一条没破**：`.hero-title`「三年级上册英语」、`.en3-board` ×3、`.en3-path-step` ×5、
`.module-card` ×7、`.en3-play-mini` ×4、`.cn-lesson-card` ×5、`.en3-pathbar-dot` ×5、
`.en3-flip-card` ×14（含 `.open` 全开→全关）、`.en3-more-chip` ×12、`.en3-match-item` ×8、
`.en3-explore-card` ×5、`.en3-play-card` ×3、`.en3-role-chip` ×6、`.en3-script-line` ×16、
`#units` 页面内滚动且 hash 不变、两条颜色等式、5 个 stage 名、兜底页文案。

**结构改动**：4 个页面根节点各加 `.eng3a-sheet`；关卡页用 `[data-module='eng3a']` 作用域覆盖，
**未修改任何共享组件**（`SelfStudyLesson` / `EngFlipWords` / `EngMatchPairs` 全部原样）。
新增 `src/styles/_eng3a-module.scss`，在 `index.scss` 最后加载。

**未改动**：`eng3a.ts` 教材数据（91KB）、教材插图、路由、store、TTS/SRS 逻辑。
