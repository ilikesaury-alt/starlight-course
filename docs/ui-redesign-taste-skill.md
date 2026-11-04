# UI 重整记录 — tasteskill v2（2026-11-04）

> 起因：「当前项目的 UI 不好看」，按 [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) 的方法重整。
> 技能副本与检查产物在 `.taste-skill/`（已加进 `.gitignore`，不入库）。
> 目标平台不变：桌面 Chrome / Edge（Windows），幼儿（6–9 岁）在家长陪同下使用。

## 1. 方向单

| 项 | 值 |
|---|---|
| 运行 | `--app`（这是"用的"应用屏，不是"读的"落地页） |
| 风格 | **`pastel-consumer`**（浅色调分类瓦片 + 同色深字 + 一个大圆角） |
| seed | `1580259744`（`--kind wallet --screens home,list,detail --keep palette,type`） |
| 一句话 | 类别用浅色调编码，墨色取同色相的深色，所有面积共用一个大圆角；满色只落在小标记上 |

**为什么选它**：8 个课程入口本来就是「一门课一个颜色」的分类系统，`moduleThemeVars()` 也已经把每个模块色派生出 `--brand-soft` / `--brand-deep`。这个风格的 move 正是"浅色调瓦片 + 同色深字"，等于把项目已有的语言**做干净**，而不是换一套新皮肤。

**按技能「已有品牌」条款保留的资产**（`--keep palette,type`）：
- 模块色（语文红 / 英语蓝 / 主课琥珀 / Rocket Girl 紫 / Fly Guy 绿 / 听写青 / 积木橙 / 阅读靛）是分类编码，不是装饰；Rocket Girl 紫就是绘本本身的颜色。
- 字体保留 `ZCOOL KuaiLe` + `Noto Sans SC`。方向单原本派 `Manrope`，但它没有中文字形，中英混排必然回退，且会丢掉幼儿产品的声音。

**改了方向单的一处**：地面色从奶油黄 `#fff9f0` 换成低彩度骨白纸 `#f2f1ee`。技能明确要求「想要暖，取低彩度 stone / bone，不要用 yellow cream」，inspector 也报了 `palette-cream`。

**Idea**：> 在这块屏幕上，**牛津 Starlight 教材里的那一课** 变成 **摊开在桌上的一页** —— 翻开它，就接着往下学。

**Live thing**：「今天翻到这里」—— 首屏右侧的今日任务翻页卡，显示下一课（Lesson 1 · Say Hello / 第一单元 · 大青树下的小学），每次打开都随学习进度变化，点一下直达课页。

## 2. Before / After 测量（生产构建，`inspect.mjs --app`）

| 项 | Before | After |
|---|---|---|
| 首页结果 | **5 FAIL / 3 WARN** | **0 FAIL / 0 WARN** |
| 全站 15 页结果 | 未逐页量 | **0 FAIL / 11 WARN**（WARN 辩护见第 6 节） |
| 页面底色 | `#fff9f0` 奶油黄 | `#f2f1ee` 骨白纸 |
| 实际在用字号 | 11 档：14/15/16/18/20/22/26/32/34/36/52 | 9 档：13/14/17/18/19/20/22/30/34 |
| 渐变填充（首页） | 8 | 0 |
| 全站装饰渐变 | 20+ | 0（仅保留教学用高亮笔） |
| 渐变文字 | 1（品牌字标） | 0 |
| 常驻重阴影 | 9 | 0 |
| 对比度失败 | 3 处，最低 **2.3:1** | 0（三档灰阶与模块深字全部 ≥4.5:1） |
| 内容宽度 | 720px 手机栏居中贴 1440px 桌面 | 1240px 桌面骨架；8 张入口卡 4 列 × 2 行 |
| 首页标题 | 34px 居中 + 一排胶囊 | 30px 桌面 / 24px 手机，左对齐 + 一句支撑句 + 教材范围 |
| 品牌字标 | 渐变裁切文字 | 实色 + Lucide 图形标记 |
| 导航 | 桌面也用固定底部 emoji 栏 | 桌面顶栏 Lucide 图标导航；窄屏才折叠为底部图标栏 |

## 3. Critique（按 `references/critique.md` §4）

```
ROUND 1 — before (.taste-skill/before/desktop-fold.jpg, mobile-fold.jpg)
Seen in one second: 一盘糖果色的卡片，中间一条窄窄的手机栏。
Idea: 没有。标题「课前预习 · 课后复习」换成任何家教 App 都成立。
Live thing: 无（今日任务卡只是列表，没有"翻开到哪一页"的意思）。
Layout words by section: hero=居中大标题+胶囊 / today=白卡 / entries=渐变瓦片网格 / nav=底部药丸
Scores: design 4 · usability 5 · creativity 4 · content 7 → overall 4.6
Caps applied: 有 FAIL → ≤6.0；渐变+常驻阴影 → ≤6.5；5 秒测试只能说出"是个学习 App" → usability ≤6。
Top three problems:
1. desktop-fold：720px 内容栏两侧的奶油黄空地各约 360px，目标平台明明是桌面，却按手机排版。改成 1240px 桌面栅格。
2. desktop-fold：每张入口卡同时叠了渐变、2px 饱和描边、黄色呼吸光晕阴影，8 张卡就是 8 组噪音。改成浅色调底 + 4px 满色条 + 同色深字。
3. desktop-fold：正文 14px、三种灰阶都在 2.3~2.4:1，"语文 · 英语 · 主课"、"Starlight · 继续学"几乎看不清。收敛字号并把灰阶提到 4.5:1 以上。

ROUND 2 — after (.taste-skill/final-audit/home/desktop-fold.jpg, mobile-fold.jpg)
Seen in one second: 一张骨白纸上的学习工作台，左边标题、右边"今天该学哪一课"。
Idea: 教材的每一课变成摊开的书页卡，翻开即继续（由「今日任务」翻页卡与 8 张课程瓦片承载）。
Live thing: 今日任务翻页卡 —— 随进度变化的下一课，一次点击进课页。
Layout words by section: hero=左对齐声明+教材范围 / today=右对齐翻页卡 / entries=4×2 浅色调瓦片 / nav=顶栏图标（窄屏底部栏）
Scores: design 7 · usability 7 · creativity 6 · content 7 → overall 6.8
Caps applied: 0 FAIL；首屏主动作是链接卡而非独立主按钮，usability 记 7；0 张自有图片，creativity 记 6。
Top three remaining problems:
1. desktop-fold：整页 0 张真实图片。8 个模块的"封面"是 emoji，对幼儿产品偏薄；换成本教材插图会明显提升，但涉及素材授权，本次未做。
2. desktop-fold：hero 下方仍有约 100px 留白（第一行高度由右侧翻页卡决定）。已补一行真实教材范围压缩它，接受为全页唯一一次刻意留白。
3. desktop-fold：8 张瓦片仍是 8 个色相。虽已按 pastel-consumer 收成浅色调 + 小面积满色，色相数仍偏多。
```

停在 6.8，不往上凑。按技能规则最多三轮，本轮已无可被陌生人一眼看出的问题，收工。

## 4. 放行的检查项（`--allow`）及理由

最终 gate 只对**三个品牌/平台项**放行，其余全部实打实修到 0：

| 规则 | 页面 | 理由 |
|---|---|---|
| `emoji` | 全部 | 模块「封面插画」（🌟📚📘🚀🐝✍🧱）属产品身份资产；装饰性 emoji（跳动的 hero 星、📅 标题前缀、🔤/📊 快捷卡、📊/🧠 徽章前缀）已全部删掉，导航改用 Lucide 线性图标。 |
| `covered-text` | 主课页 @390px | 固定底栏在滚动采样时盖住一个大 emoji（🏖️）的假阳性。技能本身在 §12 要求手机用固定底栏；截图里该 emoji 显示完好。 |
| `palette-cream` | 主课 / 课内 / 字母页 | `#fff3c4` 是 Starlight 模块的浅琥珀色（品牌模块色），不是页面地面色；页面地面已是骨白纸。 |

`palette-purple` **没有放行**，而是真修掉了：见第 5 节。

## 5. 三个容易再踩的坑（本次实际踩过）

1. **`_responsive.scss` 在 `index.scss` 最后加载**，旧版里写了 `.app { max-width: 820px }` 并覆盖全套 `--fs-*`。第一轮改完 `_components.scss` 的 1240px 骨架后，截图里内容其实仍只有约 770px 宽、字号也是旧档 —— 全被它盖回去了。现在该文件**只放大字号，不再动任何布局宽度**，并写进文件头注释。
2. **`.home` 是共享类名**：`Home` / `StarlightHome` / `BookHome` / `StoryHome` 都用它。首页的双栏栅格必须挂在 `.home--workbench` 上，否则会把其它三个页面的单元列表挤成两栏并留下 1253px 的空洞（inspector 的 `panel-void` 抓到了）。
3. **`moduleThemeVars()` 的深字比例**：原来 `--brand-deep = color-mix(主色 58%, black)`。派生出的紫/黄"深字"其实不够深——浅色调底上只有 1.8~2.4:1，而且亮度正好落在 violet 检测区间（hue 244–295°、l 0.3–0.8）里，触发 `palette-purple` FAIL。改成 **45% 主色 + 55% 黑** 后，Rocket Girl 紫、字母积木黄/绿、英语3A 蓝的深字对比度全部达标，紫色检测也自然解除。同时把静态的 `--grape-deep` 压到 `#4a1875`。

## 6. 全站清理与第二轮审计

第一轮只做了 token 层 + 外壳 + 首页/主课/听写/复习。第二轮把余下页面逐页清完：

| 处理 | 位置 |
|---|---|
| `--shadow` / `--shadow-lg` / `--shadow-pop` 三个 token 置 `none` | `_tokens.scss` —— 一次性让 20+ 处常驻卡片阴影失效；真浮层（`.confirm-dialog`、词条 tooltip）本来就用硬编码，不受影响 |
| 骨架扫光渐变 → 静态底色 + 透明度呼吸 | `_reading.scss` `.pl-line` / `.pl-card` |
| 阅读 hero 渐变 + 2px 饱和描边 → flat 浅色调 + 发丝边 | `_reading.scss` `.rm-hero` |
| 进度条 / 结果条 / 掌握度条渐变 → 单色填充 | `_study.scss` ×3 |
| 单词卡顶部 60px 渐变色带 → 4px 满色条 | `_study.scss` `.fc-word::before` |
| 「书页」3 层渐变 + 内发光 + 外阴影 + 渐变丝带 → flat 暖纸色阶 + 实心色条 | `_study.scss` `.reading-body` |
| 手写下划线两层渐变 → `text-decoration` | `_study.scss` `.reading-title-en` |
| 常驻彩色阴影（绿光 / 红光 / hover 阴影） | `_dictation.scss` / `_chinese.scss` / `_study.scss` |
| 级别卡 2px 满色描边 → 1px 细边 + 4px 色条；级别满色文字 → 同色相深字 | `_alphablocks.scss` |
| 英语3A 步骤标签、积木主按钮的低对比文字 | `_eng3a.scss` / `_alphablocks.scss` |

**保留**（这些不是装饰）：文字高亮笔的硬停止渐变（点读/阅读的教学标记）、focus-visible 环、播放态 `speak-pulse`、真浮层阴影、`inset` 左边条、`--shadow: none` 的显式写法。

最终对 **15 个路由**（首页 / 课程 / 主课 / 课内 / 智能复习 / 错题本 / 进度 / 字母表 / 语文 / 英语3A / 听写 / 字母积木 / 阅读 / Rocket Girl / Fly Guy）逐个跑 `inspect.mjs --app`，三个宽度 1440/768/390：**0 FAIL**。

剩余 **11 个 WARN** 全部可辩护，不是漏改：

| WARN | 页数 | 理由 |
|---|---|---|
| `hero-void` | 5 | 全新账户下这些页本来就是空的（无错题 / 无到期复习 / 无进度），或单词卡按教学需要居中放大；空白是数据状态与交互形态，不是布局缺陷。 |
| `below-fold` | 4 | 26 个字母、108 个 Rocket Girl 故事、19 个英语3A 板块本就是长列表，不该硬塞进首屏。 |
| `unused-canvas` | 1 | 字母表是 26 个字母的居中网格，两侧留白是网格的呼吸，不是内容截断。 |
| `heavy-borders` | 1 | 英语3A 模块色 4~5px 单侧色条，是分类编码（技能 calendar 章节明确允许"3px left edge in the hue"），不是四边描边。 |

## 7. 验证

```
npm run test    343 passed / 28 files
npm run check   tsc -b --noEmit + tsc -p tsconfig.test.json  ✓
npm run lint    ✓
npm run build   ✓
npm run e2e     96 passed / 3 skipped / 0 failed（2.5m，串行无并行负载）
inspect.mjs     15 个路由 × 3 宽度：0 FAIL / 11 WARN（均已辩护）
```

E2E 中途出现过两次并行负载导致的 flake（lazy chunk 5s 超时、`dictation.spec.ts:272` 一个贴着 30s 边界的慢用例），单独复跑均通过；最终串行全量一次全绿。

**未改动**：所有路由、组件类名、数据结构、store、`SRS` / TTS / STT 逻辑。唯一一处 JS 逻辑改动是 `moduleThemeVars()` 的颜色派生比例（第 5 节第 3 条），仅影响 CSS 变量取值。
