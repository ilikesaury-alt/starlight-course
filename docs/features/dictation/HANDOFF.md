# HANDOFF · 听写练习（/dictation）

> 冷启动入口：未来会话要改这个功能时，先读本文件，再读 `CONTEXT.md`（决策/验收）与 `docs/features/dictation/听写练习-交付文档.md`（面向测试/业务）。
> 本文件回答「从哪接着干」；CONTEXT.md 回答「怎么做成这样的」。

## 当前状态（revision）

- **未提交**：全部改动在工作区，基线 commit `a99600e`。
  ⚠️ **diff 只在工作区，切分支/换会话会丢。若隔夜继续，请先 commit。**
- 已完成：第 0~5 步（定档 / 需求对齐 / 方案 / 复核授权 / 实现 / 对抗审查）+ 第 7 步交付文档。
- 未完成：第 6 步人工 Review、第 8 步提交、第 10 步复盘、第 11 步 E2E。

## 改动文件

**新增**
```
src/data/phonics.ts                 音素切分 / 金字塔 / 拼读提示（轻量规则）
src/utils/dictation.ts              取词池 / 长度过滤 / 干扰项 / 三选一 / 洗牌
src/components/DictationPlayer.tsx  单轮：听→写/选→反馈→音素格子/金字塔
src/pages/DictationPage.tsx         范围+模式选择 / 流程编排 / 会话报告 / 回灌
src/styles/_dictation.scss          听写相关样式
src/data/phonics.test.ts            8 项
src/utils/dictation.test.ts         13 项
src/pages/DictationPage.test.tsx    3 项（页面级：渲染/兜底/不加星回归）
src/pages/__dictationTestHelpers.ts 测试辅助（读 eng3a 真实词池）
docs/dictation-design.md            前期调研+草图（非正式口径，参考用）
docs/features/dictation/听写练习-交付文档.md
```

**修改**
```
src/App.tsx                  加 lazy import + <Route path="/dictation">
src/components/CourseEntries.tsx  首页加「✍️ 听写练习」卡片
src/styles/_theme.scss       加 dt-home-entry mixin 调用（青绿）
src/index.scss               注册 styles/dictation
CONTEXT.md                   需求/方案/验收/证据/流程状态
```

## 复现验证命令

```bash
npm run check                                        # tsc（含 e2e tsconfig）
npm run lint                                         # ESLint，应零告警
npm run test                                         # 全量 239 项 / 21 文件
npx vitest run src/utils/dictation.test.ts src/data/phonics.test.ts src/pages/DictationPage.test.tsx
npm run build                                        # 产 dist/，DictationPage 独立 chunk
npm run dev                                          # 手动看 #/dictation
```

## 关键实现约定（改代码前必读）

1. **星数只在进入报告页时结算一次**（`handleAdvance` 里 `quizStars` + `addStars`）。
   ❌ 绝不要在 JSX/渲染期调用 `addStars` —— 曾因此重复加星（对抗审查 A1）。
   已有测试守住：`DictationPage.test.tsx` 的「渲染设置页本身不会改变 totalStars」。
2. **结算读 `correctRef` 而非 `correctCount`** —— `onAdvance` 会被 `DictationPlayer` 的
   `setTimeout` 闭包捕获，读 state 会拿到上一轮旧值（对抗审查 A2）。
3. **计分口径**：首次独立写对才算对；第一次错第二次改对**仍计错**（进错题本）。
   这是有意设计，`DictationPlayer.tsx` 的 `settle` 上方有注释说明，勿当 bug 改。
4. **干扰项必须是原词的"小变形"**（换元音/换辅音/双写/删字母/相邻换位/魔术 e），
   不是随机字母串。测试用「共享字母数」+「编辑距离 ≤2」两条约束守住。
5. **`wrongWords` 用 `setupEpoch` 触发重算**，因为 `getWrongWords` 是 store 读方法、非订阅式；
   靠 `[phase]` 会读到过期快照（A4）。
6. **零新增持久化字段**：只复用 `wrongWords` / `srsCards`，`persist version: 8` 不动。

## 未解决问题 / 待办

| 项 | 说明 |
|---|---|
| 第 6 步 人工 Review | 待你按验收标准逐条过（交付文档第 4 节给了 14 条用例） |
| 第 8 步 提交 | 待你确认；提交时必须标 `E2E pending` |
| 第 11 步 E2E | 待你手动跑（需真实设备 + 出声） |
| 已知设计取舍 | 两试一揭的计分口径、轻量音素切分——见交付文档第 5 节，**不是待修 bug** |
| 后续 Phase 2 | 手写输入、跨模块取词、按 SRS 到期自适应选词（CONTEXT Out of scope） |

## 猜测 vs 已验证（明确分开）

**已验证**
- ✅ 239 项测试全绿、lint 零告警、`npm run check` 通过、`npm run build` 成功
- ✅ 干扰项为原词变形（编辑距离 ≤2 已断言）
- ✅ 渲染不重复加星（已断言）
- ✅ 空错题本时按钮禁用 + 兜底提示（已断言）
- ✅ 词池确实来自 eng3a 真实教材数据（已断言 >20 词）
- ✅ 音素切分在真实词上的输出已逐个打印核对（apple/banana/cake/chick/ship/this/name/green/book/teacher…）

**未验证（猜测，需 E2E 确认）**
- ⬜ 真实设备上 🔊 能出声（云 TTS 链路可用性依赖网络/设备）
- ⬜ 答对后 1.1s 自动进下一词的观感是否合适（未做真实使用时长测试）
- ⬜ 移动端字母盘 26 键的实际触控手感（仅按 grid 布局推断）
- ⬜ 错词进 `/wrong`、结果进 `/smart` 的端到端串联（代码路径已核对，未跑真实流程）
- ⬜ "第一次错第二次改对仍计错" 在孩子实际使用中的心理接受度（教学口径判断，非技术验证）
