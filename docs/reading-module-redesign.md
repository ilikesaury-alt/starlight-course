# 阅读模块（/reading）重设计 — 工作记录（tasteskill v2）

> 在 /starlight 与全站换皮之后，对**阅读短文模块**单独重跑一遍 skill 流程。
> Before：`.taste-skill/reading-before/rm-home/`
> After：`.taste-skill/reading-after/rm-home/`、`reading-final/`
> 相关：`starlight-module-redesign.md`（主课模块的两轮改造）、`ui-redesign-taste-skill.md`（全站换皮）

## 1. 这个模块的底子比主课好

/reading **已经有 idea**：「这些故事只用了你学过的词」+ 💎 宝藏词。96 篇短文全部用本课词表写成，
这是本 app 独有的产物——换成别家分级阅读（RAZ / 牛津树）不成立。

所以这一轮**没有另起 idea**，做的是三件事：

1. 把已有的母题**讲得更响**（原来缩在一张淡紫卡片里，h1 只有 19px）
2. 把「💎 N 词」从一枚**数字**变成 **N 个真实可读的词**
3. 按 job 分版式，并把骨架与主课统一

## 2. 方向

| 项 | 值 |
|---|---|
| app 风格 | `framed-sheet`（与 /starlight 同一套）：白纸页 1px 边 / 16px 圆角 / 无阴影，页内区块只靠 1px 细线分开 |
| idea 引擎 | `page-is-the-object`：**一本按单元翻的故事书** |
| 品牌适配 | reading 自己的靛蓝 `#6366f1`（与主课暖橙区分） |

**骨架共用**：白纸页的规则抽成了 `mixins.scss` 的 `@mixin paper-sheet`，/starlight 与 /reading
共用同一份 —— 两个模块是**同一种东西**，不是两个各写一套的页面。

## 3. 改了什么

### 3.1 Hero：母题从「卡片里的一句话」变成这一屏的主张

| | Before | After |
|---|---|---|
| h1「阅读小故事」 | 19px（比正文还小） | **24px** 名词 |
| 📚 emoji | 44px，页面上最大的东西，却零信息量 | 删除 |
| 母题 | 紫色句 + 橙色波浪线底纹（两套强调打架） | 墨色整句 + 靛蓝加粗**一个**强调 |
| 支撑句 | 「共 96 篇」 | 「96 篇 · 12 个单元 · **341 个不同的词**」 |
| 5 个宝藏词 | 靛蓝描边药丸（像标签） | 词条形态：浅底 + 2px 下划线（像词） |

### 3.2 单元目录：从 12 张碎白卡变成通栏行表

- 每行：UnitGlyph 图形（复用主课那 12 张 code-drawn 图形）+ `Module N · 标题` + 中文 + `8 篇` + `💎 N 词`
- 💎 emoji → Lucide `Gem` 线性图标（系统 emoji 在各平台长得不一样）
- 徽章从药丸改成纯文字 + 线性图标

### 3.3 **新增：单元的宝藏词表**（这一轮的核心）

展开一个单元时，那个单元**去重后的全部课本词**真实地列出来，每个词可点发音：

```
hello good great name friend morning afternoon evening boy girl mirror missing
color red yellow blue balloon green orange purple rainbow make one two three …
```

「💎 32 词」从一枚数字变成 **32 个孩子真能读的词**——母题这才立得住。
数据来自 `modules[].lessons[].words` 去重（同一单元 8 课会反复出现 hello/name，重复计数会让数字像虚数）。

### 3.4 阅读器

- `.rm-reader` 降层：不再套紫边卡片，直接落在白纸页上
- `.reading-body`（书页内页）**居中**：`max-width: 34em` 是阅读排版要求（单行太长孩子读着跳行），
  不能放宽；但原来它 block 左对齐，导致书页靠左、右半屏全空。居中之后这一屏的留白是「有意的一处留白」——
  书本来就窄，而不是一个没排完的右半屏
- 展开的课跨整行：`grid-column: 1 / -1`，否则阅读器（很高）把同行的另一课顶飞
- 工具条与 mode-badge 沿用主课那套：灰字小注 + 方钮，不是药丸

## 4. Critique

```
ROUND 1 — before (.taste-skill/reading-before/rm-home/desktop-fold.jpg)
Seen in one second: 一张淡紫卡片，44px 的 📚，一句紫橙双色的大字，五颗药丸，下面十二张白卡。
Idea: 「只用了你学过的词」——这一句是全 app 独有的事实，值得更大的版面，但它被关在卡片里。
Live thing: 点词就响（有）。但「💎 32 词」是一枚数字，看不见它背后是什么。
Layout words by section: head=紫卡 / cards=一排药丸 / rows=十二张白卡 / badges=药丸
Scores: design 4 · usability 6 · creativity 4 · content 8 → overall 5.0
Caps applied: 0 FAIL / 0 WARN（量不出来的问题：19px 的 h1、44px 的 emoji、8 档字号）
Top three problems:
1. h1 19px + 📚 emoji 44px：页面上最大的东西是一只没有信息量的书 emoji，标题反而比正文小。
2. 「💎 32 词」是一枚药丸徽章 —— 母题最独特的事实被缩成了一个数字。
3. 12 个单元是 12 张独立白卡，卡与卡之间只有 10px 缝，像一张卡片列表而不是一本书的目录。
```

```
ROUND 2 — after (.taste-skill/reading-after/rm-home/desktop-fold.jpg)
Seen in one second: 一页摊开的书：标题、主张、五个能点的词，下面十二行单元目录。
Idea: 96 篇故事全部只用本课词写成 —— 展开一个单元，那 32 个词就摆在你面前。
Live thing: 宝藏词表（每个词可点发音）+ 正文里的点词即响。
Layout words by section: head=标题行 / statement=大字主张 / words=词条 / rows=通栏目录
Scores: design 7 · usability 8 · creativity 7 · content 8 → overall 7.5
Caps applied: 0 FAIL / 0 WARN；字号 8 档 → 7 档；emoji 10 → 1；h1 19 → 24px
Top three remaining problems:
1. 32 个词在窄屏要占 8 行，展开一个单元就把首屏推得很远。可以考虑默认只显示前 12 个 + 「还有 20 个」。
2. 阅读器的书页居中后左右留白很大。34em 是阅读排版的要求，但可以在更宽的屏上把
   「本篇的词表」放到右侧，把留白填上（还没做）。
3. 单元图形在 26px 下，Food & Drinks（苹果 + 杯子）那一张仍偏难认。
```

## 5. 验证

```
npm run test    343 passed / 28 files
npm run check   ✓     npm run lint  ✓     npm run build  ✓
npm run e2e     96 passed / 3 skipped / 0 failed
inspect.mjs     /reading × 1440/768/390：0 FAIL / 0 WARN
```

**e2e 契约一条没破**（`tests/reading.spec.ts` 全绿）：
- `.rm-unit` × 12、`.rm-unit[data-unit]`、`.rm-lesson-{u}-{n}` data-testid × 8 / 单元
- `.rm-hero-statement` 含「学过的词」、字号 > `.rm-hero-sub` × 1.5、360px 下 ≤2 行且 `<b>` 一行
- `.rm-hero-word` 恰好 5 个且都是 Unit 1 的真实课表词
- `.rm-unit-treasure` 的数字 = 真实去重词数（12 个单元逐一核对）
- `.reading-sent` == `.reading-zh` == `.reading-say` 数量；译文在英文**下方**且左对齐 <6px
- `.tt-word` 默认透明底；`.reading-zone.is-playing` focus dimming

**结构改动**（不改任何 e2e 断言的类名与文本）：
- 页面根节点加 `.reading-sheet` 类
- `.rm-hero-emoji` 从 DOM 里删掉
- 单元 emoji → `<UnitGlyph />`；💎 → Lucide `Gem`
- 新增 `.rm-treasure-list` / `.rm-treasure-word`（宝藏词表）
- `unitTreasures` 从「数量 Map」改成「词表 Map」（同一份数据，数字由它算出）

**未改动**：短文数据（`src/data/reading/`）、阅读器逻辑（逐词点读 / 逐句朗读 / focus dimming /
分段朗读）、路由、store。
