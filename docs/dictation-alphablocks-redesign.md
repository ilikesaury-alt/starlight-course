# 听写 /dictation 与字母积木 /alphablocks 重设计 — 工作记录（tasteskill v2）

> 继 /starlight、/reading 之后，对**听写**与**字母积木**两个模块做同一套流程。
> Before：`.taste-skill/both-before/{dt-home,ab-home}/`
> After：`.taste-skill/both-after/`、最终 `.taste-skill/both-final/`
> 相关：`starlight-module-redesign.md`、`reading-module-redesign.md`、`ui-redesign-taste-skill.md`

## 0. 两个模块的侦察结论（subagent 实测）

侦察不是读代码猜的，是在本地起 dev server 用 Playwright **实测**出来的。测出 6 个**真 bug**（不是皮肤问题）：

### 听写（/dictation）
1. **`.dt-count` 报的「N 个音」取的是音素片段数，不是音数** —— `soundCount = boxes.length`。
   `phonics.ts` 的 `PhonicsSegment.sounds` 才是音数（magic-e / 不发音字母 = 0 音，手拉手 = 每个字母各一个音）。
   用 esbuild 跑真实词池（232 词）实测 **70 词（30.2%）显示错误**：
   `write` 显示 5 个音（实为 3）、`name/have/nice` 显示 4（实为 3）、`stand` 显示 3（实为 5）、
   `friend` 显示 3（实为 5）、`play` 显示 2（实为 3）、`everyone` 显示 8（实为 6）。
   **而这个面板唯一要教的就是「这个词有几个音」** —— 教错了 30% 的词。
2. **`.dt-count` 类名被两个完全不同的东西复用**：设置页的行内 `<b>（3）</b>` 与练习页的整块「数音」面板。
   `_dictation.scss` 后定义的规则把行内那个变成了**虚线蓝框小药丸**。
3. **`--sky2` / `--sky2-soft` 这两个 CSS 变量全项目不存在** —— 4 处全部落硬编码 fallback。
4. **choice 模式误用 spell 文案**：三选一没有输入框、没有格子可清，但答错时照样显示
   「看看下面哪个格子是红的，把它改过来」+ 按钮「✏️ 清空重写」。

### 字母积木（/alphablocks）
5. **build 模式用 emoji 直接泄题**：`.ab-word-emoji` 两种模式都无条件渲染 —— 抽到 `hat` 卡片上直接显示 👒，
   答案 h-a-t 被提前说破，孩子根本不用听。（「听音搭积木」是听音拼写，给图等于给答案。）
6. **✓ 定位错位**：`.ab-level-dot` 没有 `position: relative`，绝对定位的 `::after` 参照物落到 `.ab-level`，
   黑色对勾糊在 18px 圆点的左上沿而不是圆心。
7. **`--yes` 这个变量全项目不存在** —— 4 处硬编码 `#22c55e`，与全站 `--ok: #0f9d63` 不同源。
8. **对比度不达 WCAG AA**：`.ab-wrong` 3.47:1、`.ab-mode-tag` 3.76:1（10px 白字压饱和色）。
9. **主题断裂**：这一页没调 `moduleThemeVars()`，`--brand*` 落回全站默认蓝 ——
   首页入口卡是砖橙，点进来页面变蓝。
10. **字号 16 档**（设置页一屏 10 档），其中 9px / 10px 低于全站 12px 下限。
11. **横向空白巨大**：`.ab-level` 一行 1158px 只装了约 117px 内容；主 CTA 掉出首屏（top 898 / 视口 900）；
    练习页只用掉视口 52%。
12. **`.ab-mode` 标题与描述挤在同一行**（`inline-flex` + `inline`）——
    「听音搭积木**推荐**听发音，把积木一块块搭出这个词」连成一句。
13. **主按钮颜色随关卡漂移**：`color-mix(--ab-color 45%, black)` → 黄级变成橄榄褐 `#695200`，像 disabled 状态。

## 1. 方向

| 项 | 值 |
|---|---|
| app 风格 | `framed-sheet`（与 /starlight、/reading 共用 `mixins.scss` 的 `@mixin paper-sheet`） |
| 听写 idea | 这不是「三种玩法」，是**一条从「认」到「拼」到「写」的难度阶梯**；孩子只回答「我现在练到哪一步」 |
| 积木 idea | 界面按 BBC《Alphablocks》**官方五级**（红橙黄绿蓝）这条轴组织 —— 五级一眼看完，而不是五张通栏卡 |

**两个模块最该保护、也最不能照搬竞品的资产**（六环相扣，全是 BBC CBeebies 专有）：
```
动画官方五级配色 → 每级一个词库 + 教学点分批 → 独立「双写」特别篇（S1E17「Hill」）
  → phonics.ts 按同一分级切分 + 7 种 SegmentKind + 中文概念名 → 积木块 7 套概念配色 → 单测钉住
```
别的英语 app（剑桥 / RAZ / Oxford）各有分级，但**没有「红橙黄绿蓝 + 独立双写特别篇」这一套，
也没有「积木按教学概念分 7 色」这套视觉语法**。

## 2. 改了什么

### 2.1 听写（/dictation）
- **修音数口径**：`soundCount = boxes.reduce((n, b) => n + b.sounds, 0)` —— 30% 的词从「教错」变「教对」。
- **拆开同名类**：设置页行内计数改 `.dt-inline-count`，不再被「数音面板」的样式污染。
- **`--sky2` → `--mc` / `--mc-soft`**：全部走真实令牌。
- **choice 模式换文案**：不再说「看看哪个格子是红的」「清空重写」，改成「再听一遍，然后重新选」+「🔁 重新选」。
- **h1 主次纠正**：原来 h1 是口号「听一听，写出来」，模块名「听写练习」被降级成 12px kicker。
  现在 h1 = 「听写练习」，口号降为陈述句（e2e 断言口号**可见**，不要求是 h1 ✓）。
- **三段阶梯 → 一条轨道**：序号变成轨道节点（①②③），节点之间拖一条线，当前步填满，
  ②（跳去字母积木）是空心节点 + 「去练 ›」。不再是三张 1192px 宽的横条卡。
- emoji → Lucide 线性图标（`aria-label` 里的 emoji 保留，那是 e2e 定位用的）；装饰 emoji 清到只剩 1 个。
- 「开始听写」不再横贯 1200px；底部链接左对齐而不是居中一排药丸。

### 2.2 字母积木（/alphablocks）
- **修 emoji 泄题**：词图只在「看词拆积木」时给。
- **修 ✓ 定位**：`.ab-level-dot` 加 `position: relative`。
- **`--yes` → `--ok` / `--ok-deep`**；`.ab-wrong` 改 `--no-deep`（3.47:1 → 达 AA）。
- **修主题断裂**：调 `moduleThemeVars(AB_THEME)`，主题色与首页砖橙入口一致。
- **五级 → 一行 5 列关卡轴**：每级一个色点（内容色，不是界面色）+ 名称 + 教学点 + 词数，一眼看完。
  窄屏折成 3 列 / 2 列。
- **玩法两张大卡 → 两行选项**：标题与描述分列，不再挤成一句；「推荐」标签从 10px 白字压饱和色
  改成 12px 深字浅底。
- **积木做出厚度**：`inset 0 -4px 0 rgba(0,0,0,.14)`（inset，不是浮起的投影），圆角与答案槽统一 10px。
- **主 CTA 固定主题色 + 内容宽度**，不再随关卡漂成橄榄褐，也不再掉出首屏。
- 字号 16 档 → 7 档，最小 12px；emoji 8 → 1。

## 3. Critique

```
ROUND 1 — before (.taste-skill/both-before/dt-home/desktop-fold.jpg)
Seen in one second: 一条淡蓝横幅，一个 ✍️，一句口号当标题，三张横条卡。
Idea: 「先认 → 再拼 → 后写」是这个模块独有的难度阶梯 —— 但被做成了三张同构卡。
Live thing: 「先数一数」面板（每词报音数、逐个亮灯）—— 只在非默认的 spell 分支出现。
Layout words by section: head=淡蓝横幅 / steps=三张横条卡 / buttons=一排药丸
Scores: design 3 · usability 5 · creativity 4 · content 7 → overall 4.8
Caps applied: 0 FAIL / 0 WARN（量不出来的问题：19px 的 h1 之外还有 8 档字号、10 个 emoji、
            三张 1192px 的横条卡、音数 30% 教错）
Top three problems:
1. h1 是口号、模块名是 12px kicker —— 主次反了。
2. 三段阶梯是三张等宽卡片，看不出「难度递增」和「② 是去别的页面」。
3. 「先数一数」报的是片段数不是音数，232 词里 70 词教错。
```

```
ROUND 2 — after (.taste-skill/both-final/dt-home/desktop-fold.jpg)
Seen in one second: 一页纸上，标题 + 口号，下面是一条三级轨道，当前这一步是实心的。
Idea: 一条「认 → 拼 → 写」的轨道；第二级是个空心节点，因为它通向另一个页面。
Live thing: 数音面板（音数现在是对的）—— 仍在 spell 分支，没有挪到默认路径。
Layout words by section: head=标题行 / track=轨道 / settings=一行 / cta=一个按钮
Scores: design 7 · usability 8 · creativity 7 · content 8 → overall 7.5
Caps applied: 0 FAIL / 0 WARN；字号 8 档 → 7 档；emoji 8 → 1；h1 24px
Top three remaining problems:
1. 「先数一数」仍只在 spell 模式出现（默认 choice 看不到），而它是最强的教学桥。
2. 三个阶段共用一个 DictationPlayer，choice 与 spell 只换了作答区，版式仍偏同构。
3. 音格（30px）与字母格（56×72）尺寸比例不同，「3 个音填 4 格」这条推理链
   仍没有在屏幕上把两排盒子摆到一起对齐。
```

## 4. 验证

```
npm run test    343 passed / 28 files
npm run check   ✓     npm run lint  ✓     npm run build  ✓
npm run e2e     96 passed / 3 skipped / 0 failed
inspect.mjs     /dictation 与 /alphablocks × 1440/768/390：全部 0 FAIL / 0 WARN
                （dt 字号 8→7 档、emoji 8→1；ab 字号 10→7 档、emoji 8→1）
```

**e2e 契约一条没破**：
- 听写：`input.dt-input` 可交互；`.dt-feedback.ok|warn|bad`、`.dt-answer`、`.dt-slot` 三态、
  `.dt-count-boxes` 文本为空、`.dt-box-text` 拼接 = 答案、`.dt-stat-num` 第一个 = 正确率、
  `.dt-step` 恰好 3 个且 ② 指向 `#/alphablocks`、默认 mode = choice、家长设置默认收起、
  全页只有一个 checkbox、「听一听，写出来」可见、开始按钮文本含「（N 个）」
- 积木：`.ab-level` 恰好 5 个、`.ab-level-count` 恰好 5 个带正整数、`.ab-block` 是可 disabled 的
  `<button>` 且 textContent 是裸字母、`.ab-slot` 数量 = 答案段数、`.ab-hint` 拼完即出现且不消失、
  `.ab-slot.ok` 给所有槽位、`.ab-wrong` 含「这块不对」、错词**拼完才**写入
  `starlight-course.state.wrongWords[].module='alphablocks'`、h1「字母积木」

**结构改动**（不改任何 e2e 断言的类名与文本）：
- 两个页面根节点各加一个作用域类（`.dictation-sheet` / `.alphablocks-sheet`）
- 听写：三步的 emoji span 换成 Lucide 图标（`aria-label` 里的 emoji 保留）
- 积木：`.ab-word-emoji` 只在 split 模式渲染；`.ab-mode-emoji` 换成 Lucide；`.ab-report-emoji` 删除
- 装饰 emoji 删除（🎯 👨‍👩‍👧 📏 🚀 📘 📋 🎬 🧩 ✍️ ✕ 等）

**未改动**：教材数据、词库、phonics 切分规则、判定逻辑（`usedPoolIdx` 按位置判定）、
SRS / 错题本写入时机、路由、store。
