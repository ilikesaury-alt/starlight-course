# 口语输出脚手架（Speaking Scaffold）调研与方案

> 调研时间：2026-09-28 ｜ 需求来源：8 岁用户上 Starlight 菲教一对一课（25 分钟/节），出现"想跟老师交流但组织不出英语、卡住后急得说中文"的典型输出受阻问题。
> 目标：为 `starlight-course`（React 18 + TS + Vite + Zustand + SCSS，纯前端 PWA）设计"开口支架"能力，补齐现有**输入型**学习链路缺失的**输出型**一环。
> 关联文档：`github-research-kids-english-2026-07-31.md`（竞品大盘）、`architecture-review-2026-07-29.md`（架构评估）。

---

## 0. 结论速览

| 维度 | 结论 |
|------|------|
| **GitHub 供给** | **真空白**。`sentence frames english learning` 精确检索 **0 命中**；少儿英语口语输出类项目全部 0–1★ |
| **主流解法** | "AI 自由对话派"（HiKid 892★ / Speak-Genie / Talk Buddy / Zetto）—— 堆模型，不解决结构性问题，且需 API/本地模型 |
| **成熟知识在哪** | **教育界，不在 GitHub**：核心 4 套（Sentence Frames / Wait Time / Follow-up Questions / Answer Moves）+ 进阶 2 套（IRF 提问、Talk Moves），共 **6 套**已成熟方法（§4） |
| **问题重新定位** | 不是"词汇储备不足"，是**提取通道不通 + 追问结构缺失**；卡壳精确集中在 warm-up / wrap-up 两段 |
| **方案可行性** | 项目现有数据（`lesson.words` + `lesson.sentences`）**可零新增字段**支撑 **P0-2**；P0-3 需新增一个轻量 `topics.ts`（见 §11.5）。新页面走**独立路由 + 首页入口**，**不需注册 `ModuleMeta`**（见 §7.2） |
| **竞争位** | 若落地，是该细分**第一个像样的结构化输出脚手架实现** |
| **补充：拓展词缺口** | 老师按**话题**拓展、预习按**课**准备 → **颗粒度错配**；全书同话题词其实都在数据里，缺"话题视图"（§11） |

---

## 1. 背景与问题定义

### 1.1 现象

用户侧观察到的三个连续动作：

1. 孩子**想**跟菲教老师交流（有交流意愿）
2. **组织不出**英语句子 → 卡住
3. 卡住 → 情绪急躁 → **退回中文**

### 1.2 初判与修正

| 初始判断 | 调研后修正 |
|----------|-----------|
| "英语储备知识不足" | 更准确的说法是 **"储备有，但提取不通"** |

支撑证据：

- **能听懂老师的提问与指令** → 理解性输入（receptive）有基础
- **卡住的是组织句子** → 缺的是"脱口而出"的自动化，不是词汇量
- **急得说中文** → 情绪加剧卡顿，卡顿又加重焦虑，形成恶性循环

> **核心推论**：泛泛背单词是在**加库存**，而瓶颈在**出货通道**。加库存见效最慢，搭脚手架见效最快。

### 1.3 语言学习理论定位

- **可理解性输出假说**（Swain）：输出本身推动学习——发现"想说的"和"能说的"之间的差距
- **自动化提取**：词汇/句型需练到"不用想就能说"，从**知识**转为**技能**
- **沉默期**（silent period）：EFL 儿童常见，需 wait time 而非催促

---

## 2. 调研方法

- **渠道**：GitHub Search API（`/search/repositories`，按 star 排序）+ WebSearch（中英文双语关键词）+ 教学法资源站（Colorín Colorado、Keys to Literacy、Cambridge、TPT）
- **关键词覆盖**：
  - 英文：`sentence frames english learning`、`esl conversation prompts`、`english speaking practice scaffold`、`conversational gambits`、`phrasebank speaking`、`esl sentence starter`、`roleplay dialogue dataset`、`turn-taking practice`、`follow-up questions scaffold`
  - 中文：`少儿英语 口语`、`英语 口语 练习 开源`、`菲教 课件 51talk palfish`
- **说明**：Code Mode 环境内无 fetch 工具，GitHub API 调用改经 `webfetch` 与搜索引擎缓存完成；部分仓库 Star 数取自页面缓存。

---

## 3. GitHub 调研结果

### 3.1 检索命中表

| 检索词 | 结果 | 备注 |
|--------|------|------|
| `sentence frames english learning` | **0 命中** | 核心概念在 GitHub 完全空白 |
| `english conversation practice kids` | 4 个，全 0–1★ | 见 3.2 |
| `conversational gambits` / `phrasebank speaking` | 无少儿向项目 | 仅有学术向 Manchester Phrasebank |
| `esl conversation prompts` | 4 个 | 多为语料库，非交互工具 |
| `少儿英语 口语 开源` | 全是"背单词/闯关/启蒙认读" | **无输出训练** |
| `roleplay dialogue dataset` | 无少儿向 | 多为 IELTS/商务 B2-C1 |

### 3.2 候选仓库总览

| 仓库 | 定位 | ⭐ | 与本需求关系 | 可借鉴 / 不可借鉴 |
|------|------|---|--------------|-------------------|
| **lpmi-13/convohelper** | "a micromaterial to scaffold **turn-taking** in conversations for EFL students" | 0 | **概念最对口**，2016 停更 | ✅ 概念（轮流发言支架）｜❌ 技术栈（Express + 句子写死在 `sentences.js`） |
| **htlin222/eng-speaking** | 24 天会话课 + turn-taking 练习，Quartz 静态站 | 3 | 内容组织方式 | ✅ 按天推进的课程结构｜❌ 纯内容站，无交互 |
| **monolithpl/ESL-discussion-questions-corpus** | 大规模 ESL 讨论问题语料 | — | **问题库数据源** | ✅ 可作"老师可能问什么"题库｜❌ 需按 8 岁难度裁剪 |
| **monolithpl/fraze-finder** | 高亮**半固定词块**（semi-fixed lexical phrases） | 17 | Sentence frame 的语言学本质 | ✅ 词块标注思路 |
| **xckevin/magic-english-buddy** | 魔法镜阅读器 + **影子跟读双声轨** | 0 | 输出前的输入/跟读 | ✅ Follow-the-Light 逐词高亮、Echo 双声轨 |
| **xiaochong/hi-kid** | 本地 AI 口语陪练（SoX+KittenTTS+Qwen3-ASR+Ollama） | 892 | 主流"AI 派"代表 | ✅ 完全离线、动森风 UI｜❌ 需本地模型，8 岁场景过重 |
| **DarshanRadhakrishnan/Speak-Genie** | Whisper + RAG + TTS 实时语音，场景角色扮演 | 1 | AI 派 | ❌ Python + 外部 API |
| **michael-borck/talk-buddy** | 场景化 AI 对话（Electron + Ollama/Piper） | — | AI 派 | ✅ "audio turn cue"（轮到你说话的提示音）|
| **Philip-Walsh/wordsIK** | 分级词汇/语法/拼写 JSON 内容包 | — | 数据 schema 参考 | ✅ 按年级组织、带 QA 校验 |
| **jasonbai/Common-English-Words-for-Children** | 300 入门词 + 儿童口语化解说 + 3 个例句 | 12 | 内容生成方式 | ✅ "一个词配儿童化讲解 + 3 例句"的格式 |
| **opheron/questions** / **Hidayathamir/conversation-starters** | 会话问题数据 | — | 问题库补充 | ✅ 数据 |

> Zetto（Cloze → Semantic → Roleplay 三级，日语向）未列于上表：它是移动端 App、非 Web/PWA，仅作理念参考，见 3.3。

### 3.3 关键洞察：GitHub 的"开口"方案全是 AI 派

| 项目 | 技术路线 | 主要缺陷 |
|------|----------|----------|
| HiKid | 本地 LLM + ASR + TTS | ① 堆模型，**不解决"孩子说不出"的结构性问题**；需本地模型 |
| Speak-Genie | Whisper + RAG | ① 同上 + ② 需 API Key，有**使用门槛** |
| Talk Buddy | Ollama / Piper + Whisper | ① 同上 + ③ 面向大学生/面试，**非 8 岁场景** |
| Zetto | Cloze → Semantic → Roleplay 三级 | ① 同上 + ④ 日语向（但 **"pushed output"理念值得借鉴**） |

**① 是四者共同的根本缺陷**，②③④ 是各自附加问题。

> **Zetto 的可取之处**：强调"你不只读，你**产出**。出声。有时间压力。"并记录"提示到开口的毫秒延迟"。这个理念对，但实现依赖 AI。

**结论**：AI 派解决的是"**有个对手陪你练**"，而本需求要解决的是"**开口那一刻没有可用的句子结构**"。两者不冲突，但后者是前置条件——**没有脚手架，AI 对话同样会卡**。

### 3.4 与 2026-07-31 竞品调研的关系

7 月调研结论"**Web/PWA + 间隔重复 + 小学生 细分几乎无主导开源方案**"依然成立。本次是**纵向深挖**该大盘下的一个子问题：输出端。两次调研合并看，机会位是：

```
输入端（背单词/闯关）：红海，已有大量 0★ 项目
输出端（开口脚手架）：空白，无参考实现  ← 本次定位
```

---

## 4. 教育界的成熟方法（本次调研最大收获）

> **核心发现**：真正的"开口支架"知识沉淀在教育界资源站，不在 GitHub。以下 **6 套方法**（4.1–4.6）均可直接落地，其中 4.1–4.4 为第一梯队，4.5–4.6 为进阶储备。

### 4.1 Sentence Frames + 三层结构 ★ 最重要

**来源**：Colorín Colorado《Sentence Frames and Sentence Starters》、TPT 会话卡模板

**标准卡片结构**（直接可实现的 UI 结构）：

```
┌─────────────────────────────────┐
│ 简单问题                         │
│ What did you do yesterday?      │
├─────────────────────────────────┤
│ Sentence starter（句型起手）      │
│ I ______ .                      │
├─────────────────────────────────┤
│ Word bank（本课词库）             │
│ [played] [watched] [ate]        │
├─────────────────────────────────┤
│ 追问问题                         │
│ Why? / Was it fun?              │
└─────────────────────────────────┘
```

**为什么最重要**：这一结构**同时解决两个问题**——
1. "不知道怎么起头" → Sentence starter
2. "答案只有一两个词就断" → Word bank + 追问

**分级原则**（Colorín Colorado 原文）：

| 水平 | 示例 |
|------|------|
| Entering/Emerging | The character is ______. |
| Developing | I think the character is ______ because ______. |
| Expanding | I can infer the character is ______, since she ______. |

**退出原则（关键）**：
> "Reduce or eliminate the frames when students can speak and write precisely without them."
> 当孩子能不用支架说出来时，**减少或撤掉支架**——避免依赖。

→ 落地为**支架强度三档**：`全支架 → 半支架 → 裸答`

**设计纪律**（原文 6 条）：
1. 框架要**留出选择空间**（不能填死）
2. 按**语言功能**选框架（比较用 both/also/similarities）
3. **给选择**：用框架，或用自己的话说
4. 孩子卡住时**递上框架**（板书/便签）
5. 会用之后**撤掉**
6. 按功能分组（同意/反对/追问/换话题）

### 4.2 Follow-up Questions + Rule of 3 ★ 解"老师拓展就崩"

**来源**：MFL Craft《How to develop fluency in the unprepared conversation》（GCSE 口语）

**通用追问结构**（可套任何话题，正是"老师稍微拓展"的解法）：

```
Do you like ___?
  → What about ___?
  → What did you do yesterday?
  → Why?
  → What would you do if…?
  → What's your favorite ___?
  → Do you prefer ___ or ___?
```

**Rule of 3**：
> 每个回答给 **3 条信息 + 1 个动词**。

```
Q: Do you like sports?
✗ "Yes."                          （1 词，对话结束）
✓ "Yes. I like swimming. I go 
   every Saturday with my dad."   （3 条信息，可继续）
```

**为什么这条最关键**：
- 菲教的"稍微拓展" = 追问题
- 孩子**从未专门练过追问结构** → 一拓展就崩
- 这不是词汇问题，是**结构问题** → 可以定点训练

### 4.3 Wait Time（等待时间）★ 零成本杠杆

**来源**：Colorín Colorado《Wait Time》；Mary Budd Rowe 研究（"wait time" 概念提出者）

> **研究结论**：等待时间从 **1.5 秒 → 3 秒**：
> - 回答长度 ↑
> - 正确回答数 ↑
> - 学生信心 ↑
> - "I don't know" 回答 **明显↓**

**教学步骤**：
1. 观察当前等待时间（整班 vs 一对一）
2. 提问后**数 3 秒**再接话
3. **用 sentence frames 兜底**
4. 让孩子**先跟同伴说一遍**再全班回答（此处=先跟家长说一遍）
5. 把问题/关键词**写下来**（视觉+听觉双通道）

**对本需求的直接含义**：

> **菲教如果接话太快，孩子就没时间组织 → 直接说中文。**
> **跟老师提这一点，是成本最低的干预。**

可直接发给老师的英文：
```
Please give him 3 seconds to think before moving on.
Please wait — he needs a moment to organize his sentence.
```

### 4.4 四个 Answer Moves（新加坡 PSLE 口语）★ 8 岁场景吻合

**来源**：PSLEPrep《PSLE Stimulus-Based Conversation: PEEL + 5W1H》

**四个可复用的应答动作**：

```
① 观察   Scan with 5W1H —— who/what/where/when/why/how
② 推断   What's happening? Why?
③ 联系   I once… / My favorite…（接自己的经验）
④ 观点   I think… because… + 例子 + 回扣问题
```

**PEEL 结构**（给答案一个形状）：
```
Point（观点）→ Explain（解释）→ Example（例子）→ Link（回扣问题）
```

**关键原则**：
> "目标不是背出一段漂亮的话，而是给孩子**可重复的应答动作**。
> 背熟的答案一被追问就崩。"

→ 这与本项目 SRS 的"**调度句型而非单词**"思路一致。

**8 岁小学口语场景完全吻合**，是 §4 六套方法里年龄匹配度最高的。

### 4.5 IRF 序列与提问类型（实证研究）

**来源**：《The Impact of Teacher Questioning Strategies on EFL Learners' Second Turn of the IRF Sequence》

| 提问类型 | 学生反应 | 研究结论 |
|----------|----------|----------|
| 封闭式 / display 问题 | 1-3 个词短答 | 限制参与 |
| 加 **"Why?" / "How?"** 追问 | **立即展开成长回答** | 追问是"把封闭对话转向开放对话"的关键 |

> **对本需求的含义**：孩子答一句就断，**一半是提问类型问题，不全是孩子的锅**。
> 应同时建议老师**多用 Why/How 追问**——反而能逼出长回答。

### 4.6 Talk Moves（对话动作，进阶储备）

**来源**：Keys to Literacy《Oral Language Webinar》

**Statement / Question / Restate 三卡**（轮流发言训练）：

```
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Statement    │  │   Question    │  │   Restate     │
│  陈述：我____   │  │  追问：____？   │  │  复述：你说的是 │
└───────────────┘  └───────────────┘  └───────────────┘
   第 1 人              第 2 人            第 3 人
```

**Sentence Starters 分类**（可按类别逐个引入，**一次只练一类**）：

| 类别 | 句型起手 |
|------|----------|
| 表达观点 | I think… / In my opinion… / It seems to me… |
| 补充评论 | What do you think? / Why is that? |
| 联系他人 | I agree with ___ because… / That is a good idea because… |
| 复述 | So, you are saying that… / In other words… |
| 求助澄清 | I don't understand ___, but… / What do you mean? |

---

## 5. 问题重新定位：卡壳点精确到时间段

### 5.1 菲教课标准结构（51Talk / PalFish，25 分钟）

```
┌──────────────┬────────────────────────────┬──────────┐
│ 3 min        │ warm-up                    │ ★★ 高发  │  ← 自由闲聊，无教材支撑
├──────────────┼────────────────────────────┼──────────┤
│ 19 min       │ Textbook Teaching          │ ★ 基本   │  ← 老师带着走，有课文依托
├──────────────┼────────────────────────────┼──────────┤
│ 3 min        │ wrap-up                    │ ★★ 高发  │  ← 自由闲聊，无教材支撑
└──────────────┴────────────────────────────┴──────────┘
```

（51Talk Kids English Lesson Guide 实证：`3-minute Warm-up + 19-minute Textbook Teaching + 3-minute Wrap-up = 25-minute Lesson`）

### 5.2 卡壳点定位表

| 卡壳点 | 时段 | 根因 | 对策 |
|--------|------|------|------|
| 开场/收尾闲聊 | warm-up / wrap-up | **无句型框架，问题完全开放** | 逃生短语 + 闲聊句型包 |
| 老师拓展追问 | 全程穿插 | **没练过追问结构** | Follow-up 结构 + Rule of 3 |
| 想说不会说 | 全程 | **缺句子骨架** | Sentence frames + Word bank |
| 急得说中文 | 卡住后 | **情绪 + wait time 不足** | 求助手势 + 跟老师提 wait time |

### 5.3 关键修正：这不是"补词汇"能解决的

```
❌ 错误路径：补更多单词 → 加库存 → 瓶颈仍在出货通道 → 依旧卡
✅ 正确路径：搭输出脚手架 → 打通出货通道 → 已有储备能调出来
```

**方案重心应是"定点爆破两个高发时段"，而非"全面提升词汇量"。**

---

## 6. 方案

### 6.1 A 层：不改代码，本周可用（成本最低，优先执行）

| # | 动作 | 具体内容 | 预期收益 |
|---|------|----------|----------|
| A1 | **逃生短语 8 句** | 贴屏幕边，每天过一遍 | 卡住有出口，不再崩回中文 |
| A2 | **闲聊句型包 10 个** | 只覆盖 warm-up/wrap-up 高频问题 | 精准打击最高发时段 |
| A3 | **跟老师沟通** | 见 6.2 | 零成本，收益杠杆最高 |
| A4 | **课后复盘 5 分钟** | 中文想清楚 → 英文练熟 1-2 句 | 聊自己最熟的内容，提取阻力最小 |

**A1 · 逃生短语卡**（"元语言"，孩子用它换来的不是答案，是**继续说下去的权利**）：

| 场景 | 英文 | 中文 |
|------|------|------|
| 想不起词 | *How do you say ___ in English?* | ___ 英语怎么说？ |
| 需要时间 | *Let me think.* / *Wait…* | 让我想想 |
| 想描述但没词 | *It's a thing you… you eat with.* | 这是个你……用来吃的东西 |
| 需要帮助 | *Can you help me?* | 你能帮我吗？ |
| 直接说不出来 | *I don't know the word for ___.* | 我不知道___怎么说 |
| 没听清 | *Sorry? Can you say that again?* | 抱歉？能再说一遍吗？ |
| 不理解 | *I don't understand.* | 我不理解 |
| 请老师慢点 | *Please speak slowly.* | 请说慢一点 |

**A2 · 闲聊句型包**（每个配 Sentence starter + 3 个可替换词，用 Rule of 3 扩成 3 句）：

| 老师常问 | Sentence starter | Word bank |
|----------|------------------|-----------|
| How are you? | I'm ___, thank you. | fine / great / happy |
| What did you do today? | I ___ . | played / watched / ate |
| Do you have a pet? | Yes, I have a ___ . | dog / cat / fish |
| What's your favorite ___? | My favorite ___ is ___ . | color / food / animal |
| What do you like? | I like ___ because ___ . | — |
| Who is your friend? | My friend is ___ . | — |
| How old are you? | I'm ___ years old. | — |
| Where do you live? | I live in ___ . | — |

> **⚠️ 使用纪律（2026-09-28 随 `/phrases` 删除确立）**：A1/A2 是**纸面清单**，最忌讳"打印出来让孩子背"——那正是 `/phrases` 整页删除的原因（§6.3 设计纪律）。正确用法：
> - **A1 逃生短语**：不要求背，只要求"**用过一次就算会**"。贴在屏幕边，卡住时**指着让孩子念出来**即可，念完就过
> - **A2 闲聊句型包**：**每次课只取 1 条**，配当天真实发生的事说一遍（`What did you do today?` → 说真的做了什么），**不滚动复习全部 8 条**
> - 判断标准：孩子**在课上主动用出来** = 掌握；能对着纸念出来 = **不算掌握，也别继续练**

### 6.2 A3 · 跟菲教的沟通脚本（可直接复制发送）

```
Hi teacher! A small request for our lessons:

1. Please give him 3 seconds to think before moving on.
   He needs a moment to organize his sentence.

2. When he gets stuck, could you give him a sentence 
   frame first instead of the answer?
   For example: "I like ___ because ___"

3. Please use "Why?" and "How?" follow-up questions 
   more — they help him give longer answers.

4. If he says something in Chinese, please ask him to 
   try again in English with a sentence frame, 
   rather than moving on.

Thank you! 😊
```

**四条分别对应调研发现**：① Wait Time（§4.3）② Sentence frame（§4.1）③ Why/How 追问（§4.5）④ 输出期望（§1.3 Swain 可理解性输出假说）

### 6.3 B 层：做进 starlight-course

> **架构修正（2026-09-28 复核）**：本节原写作"注册 `ModuleMeta` 模块"，**是错的**。求救短语不具备"可复习单元"的性质，应走**独立路由 + 首页入口**，不进 `MODULE_LIST`。详见 §7.2。

> **⚠️ 设计纪律（2026-09-28 随 `/phrases` 删除确立）**：
> 原 `/phrases`（菲教课堂用语，7 分类 170 行、"分类列表 + 中文对照 + 点 🔊 跟读"）**已整页删除**，原因是**背诵型句子孩子接受度太低**。
> 这是一条**已被证伪的设计模式**，对本节所有条目生效：
>
> | ❌ 证伪的形态 | ✅ 应采用的形态 |
> |---|---|
> | 长列表逐条读背 | 单屏只出 1 张，随机闪现 |
> | 一次性给 8–12 句"背下来" | 一次只练 1 句，用完即走 |
> | 中文对照常驻、孩子照念 | 中文默认折叠，先听/先说再看 |
> | 与真实场景脱节的"课文" | 课前 60 秒能直接用上的**当节课**内容 |
>
> **P0-1 若照抄 `PhrasesPage` 的"分类列表 + 跟读"结构，会原样重演这次删除。**

#### P0-1 · 求救短语页 `/survival`

| 项 | 内容 |
|----|------|
| 形态 | **一次一张的卡片**：随机闪现 → 点读 → 试说，**不提供可通读的长列表** |
| **架构落点** | 独立路由 + 首页入口，**不注册进 `ModuleMeta`** |
| 复用 | `SpeakButton`、`SafeBoundary`、`moduleThemeVars`；样式新建 `_survival.scss` |
| 数据 | `src/data/survival.ts`（新增，8–12 条，含场景/英文/中文），接口自行定义（`PhraseCat` 已随页删除） |
| 预估 | **约 1 天** |

**为什么不注册成 `ModuleMeta` 模块**（复核时否掉的原方案）：

| 若注册为模块 | 产生的副作用 |
|---|---|
| `ModuleId` 联合类型 | 需加 `'survival'`，`MODULES` / `MODULE_LIST` 同步改 |
| `ModuleFilterChips` | `ModuleFilter = ModuleId \| 'all'` → SmartReview / WrongBook 会多出一个"求救短语"筛选条，**点进去没有可复习的词** |
| `CourseEntries` | `badges: Partial<Record<ModuleId, …>>` 全是进度/SRS 徽章，求救短语没有进度语义 |
| `kind: 'unit'` | 语义是"按单元组织的课程"，与求救短语不符 |

**需要改的三处**（均为显式硬编码，缺一不可）：

```tsx
// 1. App.tsx —— 路由是逐条枚举的，加模块并不会自动加路由
const SurvivalPage = lazy(() => import('@/pages/Survival'))
<Route path="/survival" element={<SurvivalPage />} />

// 2. CourseEntries.tsx —— 首页宫格也是硬编码的（现成参照：/alphabet、/progress 快捷卡）
<Link to="/survival" className="sv-home-entry">…</Link>

// 3. styles —— 新建 _survival.scss，并在 index.scss @use
//    同时在 _theme.scss 加 @include home-entry('sv-home', …)（原 'ph-home' 一行已随之删除）
```

**`/phrases` 删除留下的两件事**：

| | 说明 |
|---|---|
| **覆盖缺口** | 老师课堂用语的**听懂支持**（开场/指令/表扬/纠音等 7 类）现已无入口。若日后发现孩子"听不懂老师指令"，内容可从 git 历史 `git show 519d09f:src/data/phrases.ts` 取回 |
| **形态警示** | 取回内容也**不可直接复用其 UI**；须按上表"✅ 应采用的形态"重构 |

#### P0-2 · 课前预演卡（LessonPreview 加"开口"tab）

| 项 | 内容 |
|----|------|
| 数据来源 | `lesson.words` + `lesson.sentences` —— **零新增字段，纯派生** |
| 结构 | 按 4.1 标准卡片结构渲染 |
| 预估 | **约 1.5 天** |

**派生逻辑**（示意）：
```ts
// 对每句 lesson.sentences，生成四层结构
interface OpeningCard {
  question: string       // 老师预设问题（由 sentences 反推）
  starter: string        // 句型起手（Sentence frame）
  wordBank: string[]     // 本课词（lesson.words）
  followUp: string[]     // 追问链（见 P1-1）
}
```

> **⚠️ 内容缺口（复核发现）**：`question` 不能总由 `sentences` 反推。实测 `lesson.sentences` 里**多数是陈述句**（如 U3-L4 的 `I want broccoli.`、`Let's go shopping.`），不是老师会问的问题。
> 反推规则只在少数场景成立（`Do you like vegetables?` → 可直接当问题；`I want X.` → 需反转成 `What do you want?`）。
>
> **两种解法，需二选一**：
> 1. **规则反转**（零成本但覆盖有限）：识别 `I want/like…` → `What do you want/like?` 等 4-5 条模式，其余退回用句子本身当"示范答案"
> 2. **人工补 `question` 字段**（准确但有维护成本）：给 `Sentence` 加可选 `ask?: string`
>
> **建议先做 1**，把 `question` 缺失的卡片降级为"老师可能会说 → 你可以这样接"，避免 P0-2 被内容工作量卡住。

**UI 结构**：
```
┌─────────────────────────────────────┐
│ 🎤 老师可能会问                      │
│ What do you like?                   │
├─────────────────────────────────────┤
│ 你可以这样说（Sentence starter）      │
│ I like ______ because ______ .      │
├─────────────────────────────────────┤
│ 用这些词（Word bank）                 │
│ [apples] [dogs] [blue] [running]    │
├─────────────────────────────────────┤
│ 他可能会接着问（Follow-up）            │
│ Why?  /  What about you?            │
├─────────────────────────────────────┤
│ [🔊 听一遍]  [🎤 我说一次]            │
└─────────────────────────────────────┘
```

#### P1-1 · 追问题生成器（Follow-up Chain）

- 对每句 `sentences` 自动配追问链（依 4.2 模板）：
  ```
  Why? / What about you? / What did you do yesterday?
        / What would you do if…? / Do you prefer ___ or ___?
  ```
- 配 **Rule of 3 计数器**：说出来 3 条信息 → 打星
- 复用现有 `quizStars` 星规（`utils/stars.ts` 是单一真源，不另立规则）

#### P1-2 · 支架强度三档（退出机制）

依 4.1 的"reduce or eliminate the frames"原则：

```
[全支架]  →  [半支架]  →  [裸答]
 启动器+词库   仅启动器      只有问题
```

- 记录孩子在每档的通过率，**达到阈值自动建议升档**
- **避免依赖**是这一条的全部价值

#### P1-3 · Answer Moves 训练页

依 4.4（四个可复用应答动作 + PEEL）：

```
观察 → 推断 → 联系经验 → 给观点
        ↘ PEEL: Point → Explain → Example → Link
```

- 形态：一屏一个问题，逐级展开
- 依 4.4 原则："**可复用动作，不是背答案**"

#### P2-1 · 问题库扩充

- 参考 `monolithpl/ESL-discussion-questions-corpus`（大规模 ESL 讨论问题语料）
- 按**单元/话题**可筛的"老师可能问什么"题库
- **按 8 岁难度裁剪**（原语料偏成人）

#### P2-2 · 句型进 SRS 调度（本项目独有机会）

**现状**：`srs.ts` 只调度**词**（`SrsCard.en` = 单词）

**改造**：让**句型**也进调度——
- `SrsCard` 加 `kind: 'word' | 'frame'`
- `modules.ts` 的 `getWords()` 扩展为 `getItems()`，返回词 + 句型
- `SmartReview` 按 `kind` 分组展示

**为什么值得做**：教育界研究（4.4）明确说"可复用动作"比"背单词"重要，而当前 SRS 完全没覆盖句型。这是**项目已有能力的自然延伸**，不是新造轮子。

---

## 7. 数据落点分析（项目现状）

### 7.1 现有数据可直接支撑

```ts
// src/data/starlight.ts —— 已有结构
export interface Lesson {
  id: number
  title: string
  titleZh: string
  words: Word[]        // ✅ 可作 Word bank
  sentences: Sentence[] // ✅ 可作 Sentence frame 起点
}
export interface Sentence {
  en: string
  zh: string
  hint?: string        // ✅ 已有中文提示，可作家长辅助
}
```

**结论**：P0-2（课前预演卡）**零新增数据字段**，纯派生即可。

### 7.2 架构契合点

| 项目现有能力 | 如何复用 |
|--------------|----------|
| **独立路由页先例**（`/alphabet`、`/progress` 快捷卡；原 `/phrases` 已删） | 新页面的架构模板：路由 + 首页入口，**不进 `ModuleMeta`** |
| `SpeakButton` + `speakService` | 点读直接复用，含兜底链 |
| `useSettleQuiz` / `useSettleSelfStudy` | 结算复用，星规统一走 `utils/stars.ts`（答题类功能才需要） |
| `ModuleFilterChips` | ⚠️ **仅用于按模块筛选**（`ModuleFilter = ModuleId \| 'all'`），**不能**拿来筛场景/分类 |
| `moduleThemeVars()` + `_tokens.scss` | 新页面主题色与设计令牌统一 |
| **`App.tsx` 路由 / `CourseEntries` 宫格** | 两者都是**显式硬编码**——新页面必须手动各加一处（"无需改路由表"的说法是错的） |

> **`ModuleMeta` 注册表不适用于求救短语 / 话题词库**：它服务的是"可复习、有进度、有 SRS 到期数"的学习模块。见 §6.3 P0-1 的副作用表。
>
> **样式模板已随 `/phrases` 删除**（`_phrases.scss` 7KB 含 `ph-tab` 分类条）。新页面样式需自建，但**分类条 UI 本身不要照搬**——那是被证伪的"长列表背诵"形态，见 §6.3 设计纪律。

### 7.3 性能约束（必须遵守）

- 故事类词表体积大（`flyguy.ts` 101KB、`rocketgirl`），**必须 `import()` 动态加载**
- 新增 `survival.ts` 体量小（<5KB），可同步引入
- 路由级 `lazy()` 已在 `App.tsx` 全面应用，新页面需保持

---

## 8. 落地路线

| 阶段 | 项 | 预估 | 依赖 |
|------|-----|------|------|
| **本周（A 层）** | A1 逃生短语卡（纸面） | 0.5 天 | 无 |
| | A2 闲聊句型包（纸面） | 0.5 天 | 无 |
| | A3 跟老师沟通 | 10 分钟 | 无 |
| | A4 课后复盘 + 生词录入 | 每天 5 分钟 | 无 |
| **P0** | P0-1 `/survival` 求救短语独立页 | 1 天 | A1 内容已验证 |
| | P0-2 课前预演卡 tab | 1.5 天 | 问题句反转规则（见 §6.3 内容缺口） |
| | P0-3 话题词库（`topics.ts` + 罗列页抽取 + UI） | 2 天 | A1 必须同批（见 §11.7 风险 1） |
| **P1** | P1-1 追问题生成器 | 1 天 | P0-2 |
| | P1-2 支架三档 | 1 天 | P0-2 |
| | P1-3 Answer Moves 页 | 1 天 | 无 |
| **P2** | P2-1 问题库扩充 | 1 天 | 无 |
| | P2-2 句型进 SRS | 2 天 | 需 persist 版本迁移 |

**验证顺序建议**：A 层先跑 1-2 周 → 确认哪些句型真正用上了 → 再定 **P0 三项的优先次序**（不是"要不要做"，§11.7 已确认 P0-3 必须与 A1 同批）。**避免凭空设计，让真实课堂反馈驱动。**

---

## 9. 风险与避坑

| # | 风险 | 规避 |
|---|------|------|
| 1 | **支架依赖**：孩子永远离不开句子框架 | 强制三档退出机制（P1-2），达到阈值自动建议升档 |
| 2 | **凭空设计**：加了一堆用不上的功能 | A 层先验证 1-2 周，用真实课堂命中率驱动 P0 |
| 3 | **AI 过度引入**：重蹈 GitHub AI 派覆辙 | 核心链路**必须完全离线**，AI 只做可选增强（与既有原则一致） |
| 4 | **问题库难度错配**：原语料偏成人 | 按 8 岁裁剪，只保留 warm-up/wrap-up 真实会问的 |
| 5 | **句型进 SRS 触发数据迁移** | 需递增 persist `version`（当前为 6），参照现有 `migrate` 模式 |
| 6 | **新增模块体积拖累首屏** | 路由 `lazy()` + 小体量数据同步引入、大语料动态 `import()` |
| 7 | **只做工具、不做家长侧沟通** | A3（跟老师沟通）收益/成本比最高，不可省略 |
| 8 | **误判问题为"词汇不足"** | 全程坚持"提取通道"诊断，不回到背单词路径 |
| 9 | **把新页面注册成 `ModuleMeta` 模块** | 求救短语/话题词库走 `/alphabet`、`/progress` 式独立路由；副作用见 §6.3 P0-1 表 |
| 10 | **P0-2 被"补老师问题"的内容工作量卡住** | 先用规则反转，缺失时降级为"老师说 → 孩子接"（§6.3 P0-2） |
| 11 | **只做话题词库、不做兜底话术** | 见 §11.7 风险 1，P0-3 必须与 A1 同批 |
| 12 | **重蹈"背诵型长列表"覆辙**（`/phrases` 因此整页删除） | 遵守 §6.3 设计纪律：单屏一张、随机闪现、中文折叠、绑定当节课 |

---

## 10. 成功指标

| 指标 | 测量方式 | 目标 |
|------|----------|------|
| 卡壳时说中文次数 | 家长观察记录 | 2 周内降 50% |
| 回答平均长度 | 录课抽查（允许时） | 从 1-3 词 → 完整句 |
| 逃生短语使用率 | 孩子主动说出口次数 | 每课 ≥1 次 |
| 框架档位进度 | P1-2 记录 | 4 周内从"全支架"升到"半支架" |
| 老师追问响应 | 老师反馈 | 孩子能接住 Why/How 追问 |
| **拓展词命中率**（P0-3） | 家长记录"老师拓展的词里预习见过几个" | 4 周内 ≥ 60%（见 §11.6 预期 70-80%） |
| **生词回流率**（腿 3） | 每课录入 `topics.ts` 的词数 | 每课 ≥ 1 词，形成闭环 |

---

## 11. 补充问题：老师按话题拓展词汇，预习覆盖不到（2026-09-28 追加）

### 11.1 问题描述

> 教材这一课涉及的蔬菜单词就那么几个，但老师会拓展更多蔬菜单词。预习没有覆盖到，孩子有点准备不足。

### 11.2 问题定性：不是"内容遗漏"，是**颗粒度错配**

| | 颗粒度 | 单次覆盖量 |
|---|---|---|
| **现有预习** | `lesson`（一课） | **5 词** |
| **老师拓展** | `topic`（一个语义场） | **15–25 词** |

这**不是"漏了几个词"**，而是**视图层级不对**——按课组织的数据，无法回答"这个话题一共有哪些词"。

> 类比：不是书里缺页，是**目录按章节编，而考试按主题出题**。

### 11.3 关键发现：数据其实都在，缺的只是"话题视图"

以"蔬菜"为例，全书蔬菜词的实际分布（实测）：

| 位置 | 词 | 数量 |
|------|-----|------|
| **Unit 3 · L4** We Love Vegetables | vegetable, broccoli, potato, tomato, celery | 5 |
| **Unit 3 · L5** Vegetables I Eat | lettuce, cucumber, bean, carrot, salad | 5 |
| **Unit 8 · L2** Vegetables | cauliflower, eggplant, pumpkin, onion | 4 |
| **课本词汇罗列页**（`starlight-book.ts`） | `bean cucumber carrot lettuce`（**3-6 Quiz 3** p11）<br>`cauliflower eggplant pumpkin onion`（**8-2** p5） | 8（**全是已有词，新增 0**） |
| **全书词典**（`bookDict.ts`） | 已收录 broccoli / cauliflower / eggplant / pumpkin / onion / lettuce / celery / cucumber / carrot（**其中 7 个带复数形**）；**另有 `mushrooms` —— 课文有（`How many mushrooms are there?`，**1-8** p8）、词表无、词典只收复数** | **净新增 1 词（mushroom）** |
| **合计去重** | | **15 词**（14 来自 `lessons.ts` 词表 + 1 来自课文/词典） |

**核心矛盾**：

```
孩子在 U3-L4 预习  →  只看到 5 个词
另外 10 个词        →  在项目数据里存在，但预习界面看不见
```

而老师按话题拓展时，**大概率就是把这 15 个词拉出来讲**——数据已经准备好了，只是没有聚合视图。

#### 11.3.1 课本词汇罗列页是最佳自动原料

在 `starlight-book.ts` 全文扫描中定位到 **13 处"纯词罗列页"条目**（剔除 OCR 噪声后），去重后覆盖 **11 个话题**。这些是**教材官方的话题词表**：

| 话题 | 罗列页原文 | 课次（已核实） | 页码 |
|------|-----------|----------------|------|
| 蔬菜 | `cauliflower eggplant pumpkin onion` | **8-2** Vegetables | p5 |
| 蔬菜 | `bean cucumber carrot lettuce` | **3-6** Quiz 3 | p11 |
| 水果 | `kiwifruit pineapple dragon fruit lychee` | **8-1** Fruit | p5 |
| 水果 | `kiwifruit lychee pineapple dragon fruit` | **8-6** Quiz 8 | p8（与上重复） |
| 海鲜 | `squid oyster shrimp crab` | **8-6** Quiz 8 | p9 |
| 肉类 | `fish pork chicken beef` | **8-7** Meat | p4 |
| 中餐 | `rice dumplings steamed buns noodles` | **8-5** Chinese Everyday Food | p4 |
| 零食 | `raisins chocolate nori cookie` | **8-4** Snacks | p5 |
| 昆虫 | `butterfly spider bee caterpillar` | **2-5** Bugs! Bugs! Bugs! | p9 |
| 乐器 | `guitar violin flute piano` | **4-7** Show Time | p9 |
| 卫浴 | `tub sink mirror toilet` | **7-3** The Bathroom | p5 |
| 卫浴 | `sink toilet mirror tub` | **7-6** Quiz 7 | p18（与上重复） |
| 卧室 | `pillow bed quilt picture` | **7-6** Quiz 7 | p6 |

> 另有**数字类 4 处**（`one two three four five` 等，分布在 1-7 / 1-8），以及 pronoun/OCR 噪声 4 处（`she he he she`、`happy h p y`、`e q uals si x`），已排除。

##### 两个重要副发现

**① 词汇罗列页高度集中在 Quiz 课** —— 13 处中有 4 处落在 `3-6 / 7-6 / 8-6` 三节 Quiz 课：

```
3-6 Quiz 3  → bean cucumber carrot lettuce
7-6 Quiz 7  → pillow bed quilt picture / sink toilet mirror tub
8-6 Quiz 8  → kiwifruit … / squid oyster shrimp crab
```

> **教材本身就是按"话题 → Quiz 汇总"组织的。**
> 换句话说：**Quiz 课就是教材自带的话题词总结页**。抽取脚本只需优先扫 Quiz 课，就能拿到最干净的话题词表。

**② 蔬菜话题的完整命中链**：`3-4 / 3-5`（学）→ `3-6 Quiz`（罗列页）→ `8-2`（再学，且带罗列页）
这解释了 §11.3 的现象——**同一个话题在书里出现 3 次，但预习视图只有第一次**。

### 11.4 第二层缺口：即使聚合完也堵不满

全书蔬菜词只有 ~15 个，老师仍可能教教材外的：

```
corn / peas / garlic / pepper / spinach / cabbage / radish
```

**预测永远追不上老师。** 因此方案必须**两条腿走路**，只做词库是不够的。

### 11.5 方案：三条腿

#### 腿 1 · 话题词库（新 P0-3）

**数据源三路合并，全部现成**：

| # | 数据源 | 产出 | 成本 |
|---|--------|------|------|
| 1 | `STARLIGHT_BOOK` **词汇罗列页**（优先扫 Quiz 课，见 §11.3.1） | 教材官方话题词表，11 个话题 | **零人工，可脚本抽取** |
| 2 | `lessonsByUnit` 全 96 课 `words` | 本课权威词（带 emoji + IPA） | 零人工 |
| 3 | `BOOK_WORD_ZH`（`src/utils/bookDict.ts`） | 中文释义兜底，**1443 条词形→中文** | 零人工 |

**唯一需新增**：`src/data/topics.ts`，体量极小

```ts
// 话题 seed：话题 → 召回用关键词（约 15 话题 × 5–8 词 ≈ 100 行）
export interface TopicDef {
  id: string
  zh: string
  emoji: string
  seeds: string[]        // 用于全书召回
  extra?: Word[]         // 教材外、老师高频拓展（corn/peas/garlic…）
}

export const topics: TopicDef[] = [/* vegetables / fruit / animals / colors /
  weather / body / clothes / food / family / school / transport / numbers /
  time / feelings / home */]
```

**每个词标注三档来源**（这是设计的关键）：

| 标签 | 含义 | 价值 |
|------|------|------|
| `core` | 本课词表 | 已有，必会 |
| `book` | **教材别处出现** | ★ **性价比最高**——孩子下次课就会遇到，且 100% 会考 |
| `extra` | 教材外、老师高频拓展 | 补最后一段差距 |

**UI 落点**：`LessonPreview` 增加"话题词库"区

```
┌─────────────────────────────────────────┐
│ 🥦 本课蔬菜（5）                         │
│ [vegetable][broccoli][potato][tomato]   │
│ [celery]                                │
├─────────────────────────────────────────┤
│ 📖 老师可能还会问 · 教材里也有（8）★      │
│ [lettuce][cucumber][carrot][bean]       │
│ [onion][pumpkin][eggplant][cauliflower] │
├─────────────────────────────────────────┤
│ ⭐ 老师常拓展 · 教材外（6）               │
│ [corn][peas][garlic][pepper][cabbage]   │
│ [spinach]                               │
└─────────────────────────────────────────┘
```

> **形态约束**：上图的三档分组是**数据结构示意，不是 UI 截图**。落地时若渲染成"三段可通读的词表"，就落进了被证伪的背诵形态（§6.3 设计纪律）。
> 建议：**一屏只展一个话题的一档**，词卡点读、随机翻牌，`extra` 档默认折叠——让孩子"撞见"而非"读完"。

#### 腿 2 · 兜底话术（强化 A1，不新增代码）

即使腿 1 做满，也一定会有没见过的词。关键不是"预测所有词"，而是**孩子听到陌生词时不慌、有话术接**：

| 场景 | 话术 |
|------|------|
| 直接问 | *How do you say ___ in English?* |
| 描述特征代替词（circumlocution） | *It's a long orange vegetable. Rabbits like it.* → 老师接 **carrot** |
| 承认没学过 | *We didn't learn this word yet.* |

> **认知重构（很重要）**：
> 老师拓展时孩子不会，**是黄金机会，不是灾难**。
> 这是唯一的真实语境，能逼出真正的"求助式输出"——比任何刻意练习都有效。
> 母语儿童的词汇量也正是这样扩大的。

#### 腿 3 · 课件反哺闭环（最省力、最准）

菲教课件是**固定**的，拓展词来自课件本身 → 父母其实能在课前拿到准确清单。

```
上课记 1–2 个生词 → 课后 2 分钟录入 topics.ts → 下次预习自动覆盖
        ↑______________________________________________|
                        闭环：越追越近
```

> 这条把"永远追不上老师"转化为**收敛问题**，且边际成本趋近于零。

### 11.6 预期管理

| 目标 | 可行性 |
|------|--------|
| 100% 预测老师拓展词 | ❌ **不可能，且不应设为这个目标** |
| 腿 1 覆盖 70–80% 拓展词 | ✅ 数据现成，可达成 |
| 听到陌生词不慌 | ✅ 腿 2，零成本 |
| 课后收敛、越追越近 | ✅ 腿 3，闭环 |

**真正的成功指标不是"预习全中"，而是：孩子遇到生词时情绪稳定 + 有话术接 + 生词课后进数据。**

### 11.7 落地与风险

| 项 | 内容 |
|----|------|
| 优先级 | **P0-3**，与 P0-1（逃生短语）同批——两者互补，缺一不可 |
| 预估 | `topics.ts` 15 话题人工整理 **0.5 天**；罗列页抽取脚本 **0.5 天**；UI **1 天** |
| 依赖 | 腿 2 直接复用 §6.1 A1，无新增 |
| 风险 1 | **只做词库不做兜底** → 遇到教材外的词照样崩（故必须与 A1 同批上线） |
| 风险 2 | `extra` 档选词主观 → 按"该话题老师实际高频拓展"取 6–8 个即可，**宁少勿滥** |
| 风险 3 | 词库过载 → 单话题总词数控制在 **20 以内**，超出说明颗粒度该拆了 |
| 风险 4 | 与 §9 风险 2（凭空设计）冲突 → 腿 3 的**真实课堂生词**是唯一仲裁者，`extra` 档应由它校准 |

---

## 附录 A：GitHub 来源清单

| 仓库 | URL | Star | 备注 |
|------|-----|-------|------|
| lpmi-13/convohelper | github.com/lpmi-13/convohelper | 0 | 概念最对口，2016 停更 |
| htlin222/eng-speaking | github.com/htlin222/eng-speaking | 3 | 24 天会话课 |
| monolithpl/ESL-discussion-questions-corpus | github.com/monolithpl/ESL-discussion-questions-corpus | — | 问题语料库 |
| monolithpl/fraze-finder | github.com/monolithpl/fraze-finder | 17 | 半固定词块标注 |
| xckevin/magic-english-buddy | github.com/xckevin/magic-english-buddy | 0 | 影子跟读双声轨 |
| xiaochong/hi-kid | github.com/xiaochong/hi-kid | 892 | AI 派代表，本地模型 |
| DarshanRadhakrishnan/Speak-Genie | github.com/DarshanRadhakrishnan/Speak-Genie | 1 | Whisper + RAG |
| michael-borck/talk-buddy | github.com/michael-borck/talk-buddy | — | audio turn cue 值得借鉴 |
| Philip-Walsh/wordsIK | github.com/Philip-Walsh/wordsIK | — | 分级内容 JSON schema |
| jasonbai/Common-English-Words-for-Children | github.com/jasonbai/Common-English-Words-for-Children | 12 | 词 + 儿童化解说 + 3 例句格式 |
| Axion-AU/zetto | github.com/Axion-AU/zetto | — | "pushed output" 理念 |
| opheron/questions | github.com/opheron/questions | — | 会话问题数据 |
| Hidayathamir/conversation-starters | github.com/Hidayathamir/conversation-starters | — | 会话问题数据 |
| gunthercox/chatterbot-corpus | github.com/gunthercox/chatterbot-corpus | 1K | 对话语料 |

## 附录 B：教学法来源清单

| 来源 | 主题 | URL |
|------|------|-----|
| Colorín Colorado | Sentence Frames and Sentence Starters | colorincolorado.org/teaching-ells/ell-classroom-strategy-library/sentence-frames |
| Colorín Colorado | Wait Time（Mary Budd Rowe 研究） | colorincolorado.org/teaching-ells/ell-classroom-strategy-library/wait-time |
| Keys to Literacy | Oral Language Webinar（Talk Moves / 三卡） | keystoliteracy.com/wp-content/uploads/2021/05/Oral-Language-Webinar.pdf |
| MFL Craft | Follow-up Questions + Rule of 3（GCSE 口语） | mflcraft.blogspot.com/2025/10/how-to-develop-fluency-in-the-unprepared.html |
| PSLEPrep | PSLE SBC: PEEL + 5W1H + 四个 Answer Moves | psleprep.sg/psle-stimulus-based-conversation |
| Tahric Teaches | WH Questions ESL Lesson Plan（6 活动） | tahricteaches.com/nn/wh-questions-esl-lesson-plan |
| ESL Discussions | 14,180 English Conversation Questions | esldiscussions.com |
| Cambridge | B2 First Speaking Parts 3 & 4 Lesson Plan | cambridgeenglish.org |
| 研究论文 | Teacher Questioning Strategies on IRF Sequence | （EFL 课堂实证，2025） |
| 51Talk / PalFish | 25 分钟课结构（3+19+3） | 51Talk Kids English Lesson Guide |
| Talking Unplugged | 30 Activities for One-to-One Classes | oxfordtefl.com |

---

## 附录 C：核心认知（供家长快速回顾）

1. **不是储备不足，是提取不通** —— 加库存没用，要打通出货通道
2. **卡壳集中在 warm-up / wrap-up** —— 3+3 分钟自由闲聊，无教材支撑
3. **老师拓展 = 追问题** —— 没练过追问结构，所以一拓展就崩
4. **逃生短语给孩子"继续说下去的权利"** —— 卡住不再是终点
5. **Wait Time 是零成本杠杆** —— 1.5s → 3s，效果显著
6. **可复用动作 > 背答案** —— 背熟的答案一被追问就崩
7. **支架必须会撤** —— 不撤就产生依赖
8. **每天 10 分钟 >> 每周一次 1 小时** —— 语言靠高频复现
9. **预习按"课"，老师按"话题"** —— 颗粒度错配，不是漏词（§11）
10. **数据其实都在** —— 教材本身有话题词表页，只是没有聚合视图（§11.3.1）
11. **预测永远追不上老师，所以要三条腿** —— 话题词库 + 兜底话术 + 课后反哺闭环
