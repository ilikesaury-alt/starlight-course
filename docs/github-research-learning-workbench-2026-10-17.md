# GitHub 调研：个人学习工作台的设计模式

> 任务：「将当前项目改造为『我的工作台』」的 Step 1 外部调研输入。
> 编制：2026-10-17。方法：GitHub 开源项目检索（exa）+ 代表项目 README 深读。
> 结论先行：成熟项目的学习工作台 = **「今天学什么」为主行动区 + 「坚持得怎么样」热力图/连击 + 「整体进展」统计钻取**，儿童向再叠一层游戏化语言。

## 1. 调研项目清单

| 项目 | 形态 | 对本项目的参考价值 |
|------|------|--------------------|
| [Professional-X/StudyCoach](https://github.com/Professional-X/StudyCoach) | React+Vite 纯前端、无登录、IndexedDB/localStorage（与本项目架构同构） | ★★★ 其 Dashboard 就是「学习指挥中心」的完整样板 |
| [glutanimate/review-heatmap](https://github.com/glutanimate/review-heatmap/) | Anki 插件（5M+ 下载量级别的事实标准） | ★★★ SRS 工作台的坚持可视化范式：热力图 + 连击 + 按日钻取 |
| [Anki 统计窗口](https://docs.ankiweb.net/stats.html) | 官方文档 | ★★ 统计指标口径：今日复习数 / 预测工作量 / 记忆保持率 |
| [YerassylYerbolat/srf](https://github.com/YerassylYerbolat/srf) | Node SRS web | ★★ 首页信息结构：过去 24h 复习数 + 未来 24h 到期数 + 日均 |
| [doaoww/Remindly](https://github.com/doaoww/Remindly) | 全栈 SRS | ★★ Dashboard 模块：总量 + 今日到期 + 周活动柱状图 + 学习天数 |
| [ajtran303/cyberstudy-scheduler](https://github.com/ajtran303/cyberstudy-scheduler) | 个人学习追踪器 | ★★ 「single view of what to study and when」+ 掌握度分级 |
| [Garuda8887/recall](https://github.com/Garuda8887/recall) | 自托管 SRS 日历 | ★ 月历视角看复习安排（差异化交互，非必需） |
| [syofyanzuhad/hobits](https://github.com/syofyanzuhad/hobits/) 等 habit tracker 族 | 习惯追踪 PWA | ★★ 热力图/连击/周目标在无后端 PWA 里的落地方式 |
| [nexu-io/open-design Duolingo 设计系统](https://github.com/nexu-io/open-design/blob/main/design-systems/duolingo/DESIGN.md) | 设计系统文档 | ★★★ 儿童向游戏化 UI 的完整视觉语言 |
| [shade-solutions/lingokit-ui](https://github.com/shade-solutions/lingokit-ui) | shadcn 式组件库 | ★★ Duolingo 风组件拆件：XP 条、hearts、streak、quest 卡、课程路径 |

## 2. 提炼出的设计模式

### P1 工作台一屏回答三个问题（信息架构的主干）

所有被调研项目的首页都遵循同一结构：

1. **今天该学什么** —— 到期队列 + 一个最大的 CTA 按钮（Anki 的「Due today: 127」、StudyCoach 的 AI 推荐「what to study next」、cyberstudy 的「what to study and when」）；
2. **我坚持得怎么样** —— streak 连击 + 活动热力图；
3. **整体进展如何** —— 汇总数字 + 趋势图，点击可钻取明细。

对应到本项目：① 已有雏形 `TodayTasks`；② **完全缺失**（store 里没有按日复习记录，这是做热力图的前置条件）；③ `Progress` 页有但独立成页、没有进工作台。

### P2 「继续上次」是第二行动作

StudyCoach/Duolingo 类产品的第二优先级按钮永远是 resume：回到上次学到的那一课。比「课程入口网格」更高频。本项目有 6 套课程入口，工作台上应收敛为「继续学习：Starlight 3-2 单词卡」这类单行入口。

### P3 热力图 + 连击 = 坚持可视化的通用解

Anki Review Heatmap 被广泛移植（habits 族项目全部照抄该形态）说明：**GitHub 贡献图 + 当前/最长连击 + 点击某天看当日明细** 是零学习成本且跨年龄有效的设计。儿童版可把格子放大、颜色用项目自定义的 sun/mint/coral 主题色。

### P4 统计分层：数字 → 趋势 → 明细

Anki 统计窗口和 Remindly 都是三层：顶部 3~4 个大数字（今日到期/今日已复习/总卡片/连击天数）→ 中部趋势图（周柱状图/预测曲线）→ 底部列表（到期明细，点击进入）。**不要一上来就铺图表**。

### P5 儿童向游戏化视觉语言（Duolingo 设计系统要点）

- 主色占屏 30%+，按钮一律 **4px 底边厚阴影**（可按压的 3D 感），按下 translate-y 4px；
- 大号粗圆体标题（比常规产品大 25~40%），16~20px 圆角卡片、9999px 胶囊进度条；
- 游戏化元素 = XP 条 / 连击火焰 / 星星 / 徽章 / 课程路径节点（active 节点 1.6s 脉冲）；
- 动画克制：只在进度状态变化时给 back-out 弹跳，不做全局弹跳。
- 本项目已有对应基础：`font-cute`（ZCOOL KuaiLe）、sun/coral 主题色、stars.ts 星规、wiggle/pop 动画——**视觉语言方向一致，缺的是聚合**。

### P6 无后端 PWA 完全做得起工作台（本项目同构验证）

StudyCoach（IndexedDB + localStorage、无账号、离线可用）和 hobits（Vue3 PWA、localStorage、离线优先）证明「个人学习工作台」不需要任何后端。本项目 Zustand + persist 的现状可直接承载。

### P7 前置条件缺口：按日活动日志

热力图、连击、周柱状图全都依赖**按日学习记录**（date → reviews/quiz/lesson counts）。当前 store 只有卡片状态（box/fsrs/streak）与成绩，没有「哪天学了几个」的日志。若要做 P3/P4，需先加一个轻量 `dailyLog`（store 内 append-only，按天聚合），这是本次改造最大的新增状态。

## 3. 对本项目的映射草案（待 grill 确认，非定案）

| 调研模式 | 本项目现状 | 工作台候选模块 |
|----------|-----------|----------------|
| P1 今天学什么 | `TodayTasks`（复习队列聚合）已存在 | 升级为主行动区：到期数 + 大 CTA 直达 `SmartReview` |
| P2 继续上次 | 无 | 新增 resume：读最近学习记录 → 直达该课 |
| P3 热力图/连击 | **无按日日志** | 新增 `dailyLog` 后做儿童版热力图 + 🔥连击 |
| P4 统计三层 | `Progress` 页已有部分 | 摘要数字进工作台，钻取跳 `Progress`/`WrongBook` |
| P5 游戏化 | 主题色/字体/星规已有 | 工作台整体采用该语言，无需新造组件体系 |
| 课程入口 | 首页 `CourseEntries` 网格 | 收敛为「继续学习」单行 + 折叠入口 |

## 4. 仍未决的问题（回 grill）

1. 工作台是**替换首页**还是新增页面？孩子用还是家长用（决定 P1 与 P4 谁占首屏）？
2. 是否接受为热力图/连击新增 `dailyLog` 按日日志状态（P3/P4 的前置）？
3. 6 套课程入口在首页网格里降级到什么程度？
