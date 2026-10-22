# 英语听写 + 自然拼读模块（/dictation）设计文档

> 背景：8 岁，三年级上册，两年听力启蒙（Little Fox / Big Muzzy），日常刷百词斩，但三年级听写"很简单的词都不会写"。
> 根因：**听/说/理解 ≠ 拼写**——过去两年练的全是前三者，"音→形"的反向编码（拼写）从未专门练过；百词斩是"认词"不是"写词"。
> 目标（用户指定）：**B. 独立首页入口**；内容先**只从 eng3a（三年级上册英语）** 来；**重点补上"自然拼读 + 拼写"这座桥**。
>
> ⚠️ 本文件是**前期调研草图**，保留决策过程。2026-10 的 UI/交互重构（一字一盒、逐格标色、听音主操作、`✕ 退出`、报告页正确率环）
> 之后，实际交互以 `docs/features/dictation/听写练习-交付文档.md` 与 `HANDOFF.md` 为准。

---

## 一、GitHub 调研结论（借鉴点）

| 项目 | 借鉴 |
|---|---|
| **mihahribar/learn (EnglishGym)** | 三种模式：**Listen & Spell**（听音打字）、**Pick Spelling**（三选一）、**Plural Forms**；每轮 10 词随机、streak/perfect round、localStorage 成就徽章；`BaseGameScreen` 统一进度头。 |
| **Coderrob/spelling-bee-prep** | 听音→输入→**绿/红即时反馈**；**两次机会**（第一次错可改，第二次错才给答案）；`sessionMachine` / `masteryPolicy` / `selectionStrategies`（按难度/未掌握/到期自适应选词）；Grade 词典含 `syllableCount` / `spellingPatterns`。 |
| **dev-euston/spelling-trainer (Spell Star)** | 朗读每词 + 结果报告（会话报告，accuracy + 错词清单）。 |
| **ankur-katiyar/spelling-bee** | 听音 + 麦克风口播，随机词表。 |

**提炼的可借鉴设计：**
1. **听音写词** 为核心（正中"音→形"短板），不是看词抄写。
2. **即时反馈**：对=绿+鼓励文案+音效；错=第一次给机会改，第二次才揭晓答案（降低挫败）。
3. **音素桥接（自然拼读）**——这是本项目独有、调研项目里较弱的环节：把"音拆成音素→对应字母"显式教出来（Elkonin 音盒 / 音素格子 / 分段朗读），弥补他缺失的 phonics。
4. **选词范围**：先锁定 eng3a 单元/课/词；支持"仅错题""仅本周新学"等子集。
5. **会话报告**：本轮正确率、连对、错词清单（可一键回灌复习）。
6. **轻量成就/连对**：对 8 岁孩子用 streak 和小星星激励，但不喧宾夺主（沿用本 App 星规）。

---

## 二、与现有系统的接线（已确认）

- **取词**：复用 `src/data/modules.ts` 的 `eng3aMeta.items`（单元 + 剧本）与 `getWords(itemId)`，覆盖 单元重点词 + 补充词（moreWords）+ 剧本重点词。无需新增词库。
- **发音**：复用 `SpeakButton` / `speakText`（已有英文兜底链：Kokoro→云TTS→WebSpeech），统一体验。
- **错题回灌**：`addWrongWord({ en, zh, module:'eng3a', from })` → 进入现有 `/wrong` 错题本；`recordReview(en, correct, 'eng3a')` → 进入 SRS 调度（与 `/smart` 打通）。
- **配色**：用 `ENG3A_THEME`（蓝 #2563eb / #dbeafe）与 `moduleThemeVars`，保持英语模块视觉一致。
- **路由/入口**：新增 `/dictation` 路由 + 首页 `CourseEntries` 加独立卡片（与现有 5 模块 + 字母表平级，但作为"练习"类入口）。

---

## 三、功能结构（独立入口 /dictation）

### 3.1 首页卡片
首页 `home-entries` 网格新增一张 **✍️ 听写练习** 卡片（蓝色调，对应 eng3a 主题），副标题提示"听音写词 · 自然拼读 · 三年级上册英语"。带进度徽章（本轮完成情况，可选）。

### 3.2 听写主页（/dictation）
- 顶部：模块说明 + 返回。
- **范围选择**：
  - 按单元（Welcome / Unit 1–6）+ 剧本（可选）。
  - 子集开关：**全单元词** / **仅本课新学**（默认进到某课的单词）/ **仅错题**（来自 eng3a 错题本）。
  - 难度/长度过滤：全部 / 短词(≤4字母) / 长词，让起步先短词建立信心（对应调研"start with easy"）。
- "开始听写" 按钮（随机打乱取词，避免机械记忆顺序）。

### 3.3 练习流程（每词一轮：听 → 写 → 反馈）
借鉴 spelling-bee-prep 的"两试一揭"：
1. **听音**：进词自动朗读一遍（用户手势激活后），🔊 可重听，可调速（slow）。
2. **写词**：**一字一盒**（一个字母一个方格，键盘与屏幕字母盘共用同一输入）+ 移动端屏幕字母盘（点选，适配触屏/防拼音联想）；写错逐格标色。
3. **第一种反馈（对）**：绿勾 + 鼓励文案 + 音效 → 自动进下一词（~1.2s）。
4. **第一种反馈（错，第 1 次）**：红，提示"再试一次 / 听听音素"，**给一个拼读线索**（见 3.4）。
5. **第一种反馈（错，第 2 次）**：揭晓正确拼写 + 音素拆分布局（见 3.4），可朗读正确词。
6. 每词结果：对→`recordReview(en,true,'eng3a')`；错→`recordReview(en,false,'eng3a')` + `addWrongWord(...)`。

### 3.4 自然拼读桥接（本项目核心差异化）
针对"缺失 phonics"，每词额外提供**音素可视化**辅助，且可切换"拼读模式"：
- **音素格子（Elkonin box）**：根据词长动态生成 N 个格子，点 🔊 逐音素朗读（c-a-t → 3 格），让孩子把"声音段"对应到"字母段"。
  - 实现：用轻量规则做音素→字母的近似切分（CVC/常见辅元辅、digraph th/sh/ch/ck、magic e 等），不追求语言学精确，重点是"分段对应"。
- **分段慢读**：`speakText(word, {slow:true})` 已支持慢速，但再加"逐字母慢读"按钮（a-b-c），对应不会写时的抓字母。
- **金字塔拼写（Pyramid）**：c / ca / cat 逐步展开，作为"记不住怎么拼"时的提示阶梯（调研里没有，但补足"拼写策略"）。
- **拼读提示阶梯**（错第 1 次给）：
  1. 重听整词（慢速）
  2. 看音素格子（不揭答案）
  3. 看金字塔首字母 → 前两字母 → 全词（点一次展开一阶）
- **自然拼读小课入口**（可选，轻量）：从字母发音（已有 `/alphabet`）桥接"字母→音"，在听写页顶部放一个"先练发音"的提示，链接到字母表。

### 3.5 会话报告（/dictation 结束页）
- 本轮：总数、正确数、**正确率 %**、最长连对、得分星（复用 `quizStars`）。
- **错词清单**：列出本轮拼错的词（en + zh + 🔊），每个可"加入复习/再听写一次"。
- 按钮：再来一轮（同范围）/ 换范围 / 去错题本 `/wrong` / 去智能复习 `/smart`。

---

## 四、数据/状态（新增，最小化）
不新增持久化字段（避免迁移），复用现有：
- `wrongWords`（module='eng3a'）—— 错词持久化。
- `srsCards`（module='eng3a'）—— 复习调度。
- 本轮临时状态放组件 `useState`（streak、correctCount、错词列表），结束即生成报告，无需持久化。

---

## 五、交互/可访问性（对齐本 App 既有约定）
- 大触控目标、大字号、儿童化文案。
- 语音三防护（已有 `speakService` 兜底链 + SafeBoundary）。
- 键盘可操作（Enter 交卷）；移动端有屏幕字母盘。
- 动画沿用 `pop/rise` 等 keyframes（已有）。

---

## 六、实现清单
1. `src/pages/DictationPage.tsx`（主页面：范围选择 + 流程 + 报告）。
2. `src/components/DictationPlayer.tsx`（每词一轮：听/写/反馈/音素格子/金字塔）。
3. `src/data/phonics.ts`（轻量音素→字母切分 + 金字塔生成 + digraph 规则）。
4. `src/App.tsx` 加 `/dictation` 路由（lazy）。
5. `src/components/CourseEntries.tsx` 加首页独立卡片。
6. 样式（Tailwind，复用 `.page` / `.btn` / 主题令牌）。
7. `npm run check` + `npm run lint` 通过；可选一个 vitest 覆盖 `phonics.ts`。

## 七、分步交付
- **Phase 1（本次）**：独立入口 + eng3a 取词 + 听音写词 + 两试一揭 + 即时反馈 + 错题/SRS 回灌 + 会话报告 + phonics 音素格子/金字塔提示。
- **Phase 2（以后）**：跨模块取词（starlight/flyguy/错题混合）、自适应选词（按 SRS 到期）、成就徽章、手写输入。
