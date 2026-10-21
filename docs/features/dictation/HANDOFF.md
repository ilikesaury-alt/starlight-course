# HANDOFF · 听写练习（/dictation）

> 冷启动入口：未来会话要改这个功能时，先读本文件，再读 `docs/CONTEXT-听写练习-已归档.md`（决策/验收）与 `docs/features/dictation/听写练习-交付文档.md`（面向测试/业务）。
> 本文件回答「从哪接着干」；归档的 CONTEXT 回答「怎么做成这样的」。

## 当前状态（revision）

- **已提交：commit `296aa30`**（分支 `main`，18 文件）。
  提交描述中**已显式标注 `E2E pending`**——在真实设备 E2E 跑通前，此 commit 只是检查点快照，**不得视为验证完成**。
- 已完成：第 0~10 步（定档 / 需求对齐 / 方案 / 复核授权 / 实现 / 对抗审查 / 人工 Review 通过 / 交付文档 / 提交 / 复盘）。
- 未完成：**第 11 步 E2E（待用户手动跑）**。跑通后本任务才算验证完成。

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
docs/CONTEXT-听写练习-已归档.md  需求/方案/验收/证据/流程状态
```

## 复现验证命令

```bash
npm run check                                        # tsc（含 e2e tsconfig）
npm run lint                                         # ESLint，应零告警
npm run test                                         # 全量 239 项 / 21 文件
npx vitest run src/utils/dictation.test.ts src/data/phonics.test.ts src/pages/DictationPage.test.tsx
npx playwright test tests/dictation.spec.ts          # 听写 E2E 10 条
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
| 第 11 步 E2E | **自动化已跑通**（`tests/dictation.spec.ts` 10/10，全量 E2E 无新增失败）。剩余仅需真机人工确认：真实设备出声、移动端触控手感、1.1s 自动推进观感 |
| 已知设计取舍 | 两试一揭的计分口径、轻量音素切分——见交付文档第 5 节，**不是待修 bug** |
| 后续 Phase 2 | 手写输入、跨模块取词、按 SRS 到期自适应选词（见归档 CONTEXT 的 Out of scope） |

## 猜测 vs 已验证（明确分开）

**已验证**
- ✅ 239 项单测全绿、lint 零告警、`npm run check` 通过、`npm run build` 成功
- ✅ 干扰项为原词变形（编辑距离 ≤2 已断言）
- ✅ 渲染不重复加星（已断言）
- ✅ 空错题本时按钮禁用 + 兜底提示（已断言）
- ✅ 词池确实来自 eng3a 真实教材数据（已断言 >20 词）
- ✅ 音素切分在真实词上的输出已逐个打印核对（apple/banana/cake/chick/ship/this/name/green/book/teacher…）
- ✅ **E2E（Playwright 10 条全过）**：首页入口、词池计数、空错题本兜底、两试一揭、
  答对反馈、音素格子、金字塔逐阶、星数一次性、完整走完一轮进报告页且 0% 自洽
- ✅ **全量 E2E 无新增失败**：68 passed / 1 failed / 3 skipped，唯一失败为既有
  `audio-debug.spec.ts`（已用 `git stash` 在基线上复现，与本任务无关）

**未验证（需真机人工确认）**
- ⬜ 真实设备上 🔊 能否出声 —— headless 的 `speechSynthesis` 被 playwright.config 的 initScript mock，
  自动化测不到真实音频链路（云 TTS 可用性依赖网络/设备）
- ⬜ 移动端字母盘 26 键的实际触控手感（E2E 已验证可点，但触屏手感无法自动化）
- ⬜ 答对后 1.1s 自动进下一词的观感是否合适（未做真实使用时长测试）
- ⬜ "第一次错第二次改对仍计错" 在孩子实际使用中的心理接受度（教学口径判断，非技术验证）
