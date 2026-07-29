# 语音播放 / TTS 开源库调研报告

> 目标：为 Starlight 英语启蒙 PWA 寻找**自然逼真、易集成、活跃维护**的 GitHub 开源语音合成方案。
> 调研日期：2026-07-29 ｜ 数据来源：GitHub 仓库元数据、官方 README、社区对比文章（见文末）。

---

## 1. TL;DR 与推荐排序

本项目是 **纯前端 PWA（React 18 + Vite，无后端）**，现有发音链路为
`有道 TTS（网络主方案）→ Web Speech API（离线兜底）`（`src/utils/speak.ts`）。
要"自然逼真"，最现实的路径是 **在浏览器内用 WASM / WebGPU 跑神经网络 TTS**，
无需新增服务器。

**综合推荐排序（针对本项目）**：

| 排名 | 库 | 一句话理由 |
|---|---|---|
| 🥇 1 | **Kokoro-82M** (`hexgrad/kokoro`) | 轻量却最接近真人、Apache-2.0 可商用、WebGPU 浏览器直跑；自然度天花板 |
| 🥈 2 | **sherpa-onnx** (`k2-fsa/sherpa-onnx`) | Apache-2.0、纯 WASM/CPU 全设备可用（含 iOS Safari）、极活跃、一个库覆盖 TTS+ASR |
| 🥉 3 | **Piper** (`rhasspy/piper`) | MIT、最简单成熟、WASM 端口完善、模型仅 ~60MB；质量"够用但逊于 Kokoro" |
| 4 | Coqui TTS / XTTS v2 | 自然度高，但 XTTS 权重**非商用**且需 Python+GPU 后端 → 不适合本 PWA |
| 5 | Bark | 表达力强但已停滞、慢、后端非商用、英文为主、无可靠浏览器方案 → 不推荐 |

> ⚙️ **运行时约束（用户确认）：目标环境 = Windows + Chrome 浏览器。**
> Chrome 在 Windows 上自 113 版起完整支持 **WebGPU（D3D12 后端）**，因此 Kokoro 的 WebGPU 路径
> 是"一等公民"，**无需担忧 iOS Safari / 低端机不支持 WebGPU**。这把 Kokoro 从"首选但有前提"
> 提升为"无前提的首选"。Chrome 自带 Web Speech 在 Windows 上多用系统 SAPI 嗓音（偏机械），
> 故引入 Kokoro 对自然度提升尤为明显。

> 若对"绝对最高音质 + 零集成负担"可以接受**云服务 + 付费 + 密钥**，
> ElevenLabs / Azure / OpenAI TTS 仍胜过所有开源（见第 4 节对比）。但用户明确要开源，故不作为主推。

---

## 2. 候选库横向对比

| 库 | 实现语言 | ⭐ Star（≈2026-07） | 最近更新 | 许可证 | 自然度 | 浏览器可行性 | 集成难度 |
|---|---|---|---|---|---|---|---|
| **Kokoro-82M** | Python + JS (StyleTTS2) | ~7k–12k（kokoro.js 活跃） | 2025-08（repo 活跃，Aug 7 提交） | **Apache-2.0** ✅商用 | **高**（TTS-Arena #1，接近真人） | ✅ WebGPU（`kokoro-js` / Transformers.js） | 中（~80MB fp32；需 WebGPU，CPU 回退重） |
| **sherpa-onnx** | C++（12 种语言绑定） | **~12k–14k**（k2-fsa 核心仓，5 天前仍有提交） | **2026-07**（极活跃） | **Apache-2.0** ✅商用 | 中上（取决于所用模型：VITS-Piper / Matcha / Kokoro / KittenTTS） | ✅ **纯 WASM/CPU + WebGPU** | 中（`wasm/tts` + JS API，多模型） |
| **Piper** | C++（ONNX） | ~8.8k–11k | 原版 2025-03；OHF-Voice 分支 v1.4.1（2026-02） | **MIT**（原版）/ **GPL**（OHF 新分支） | 中上（VITS，约 2021 级 GA 水平） | ✅ WASM（`vits-web` / `piper-tts-web`） | 中（~60MB 模型，需 Web Worker） |
| **Coqui TTS / XTTS v2** | Python | ~35k–45k（idiap 社区分支维护） | 代码 2025-12 / 2026-01 | 代码 **MPL-2.0**；**XTTS 权重 CPML（仅非商用）** ⚠️ | 高（XTTS v2） | ❌ 需 Python+GPU 服务端 | 高（须加后端） |
| **Bark** | Python（GPT 风格） | ~37k–39k | **2024-08（停滞）** | 代码 MIT；**EnCodec 后端非商用** ⚠️ | 高（富表达、非确定性） | ❌ 无可靠浏览器方案 | 高（需 GPU 服务） |
| *Chatterbox*（补充观察） | Python（SpeechT5） | ~25k（2025-12 起） | 活跃 | **MIT** ✅ | 极高（TTS-Arena 榜首、可控情绪） | ⚠️ 主要为 Python，浏览器方案待验证 | 高（暂无成熟 WASM 构建） |

> 说明：Star 数为本次检索各来源快照，会随时间小幅波动；以"量级 + 更新时间 + 许可证"综合判断更可靠。

---

## 3. 逐库详评

### 🥇 Kokoro-82M（`hexgrad/kokoro`）
- **架构**：82M 参数的 StyleTTS2 + ISTFTNet，专为"小模型高自然度"设计。
- **质量**：在 TTS Spaces Arena 以更少参数/数据击败 XTTS v2、Fish Speech 等大模型；
  第三方盲测中"最接近真人朗读者"，适合长句/故事朗读。
- **语言**：美式/英式英语、西/法/意/日/葡/中/印地等 8 语种、54 种 voicepack。
- **浏览器**：`kokoro.js` 走 Transformers.js + **WebGPU**，fp32 模型约 80MB，桌面 GPU 上实时。
- **许可证**：**Apache-2.0**，可商用 ✅。
- **短板**：依赖 WebGPU（现代 Chrome/Edge/Android 支持；iOS Safari 暂不支持 WebGPU，需回退）；
  CPU 仅 fp32 时模型约 300MB，移动端沉重。

### 🥈 sherpa-onnx（`k2-fsa/sherpa-onnx`）
- **架构**：下一代 Kaldi 的 ONNX 运行时，**完全离线、跨平台**（桌面/移动/嵌入式/浏览器 WASM）。
- **质量**：取决于所选模型——内置 **VITS-Piper / Matcha-TTS / Kokoro / KittenTTS** 等，
  英语自然度中上；且它现在能直接加载 Kokoro 模型，等于"一个运行时用多个模型"。
- **浏览器**：`wasm/tts` 提供 **纯 WASM/CPU** 路径，**不依赖 WebGPU**，可在 iOS Safari、低端机运行；
  同时支持 WebGPU 加速。
- **许可证**：**Apache-2.0** ✅。
- **维护性**：k2-fsa 组织核心项目，2026-07 仍在高频提交；同时覆盖 ASR/VAD，未来可复用。
- **价值**：作为**通用浏览器语音运行时**最稳，尤其适合"必须全设备可用"的儿童产品。

### 🥉 Piper（`rhasspy/piper`）
- **架构**：VITS 训练后导出 ONNX，边缘设备优化，树莓派可实时。
- **质量**：清晰自然（约 2021 级 Google Assistant 水平），略带"VITS 微颤"，长听舒适。
- **浏览器**：`vits-web` / `@realtimex/piper-tts-web` 已把 phonemizer+ONNX 编成 WASM；
  英文 `en_US-libritts_r-medium` 等模型 ~60MB。
- **许可证**：原版 **MIT** ✅；注意 OHF-Voice 新分支已转向 **GPL**，商用友好度略降，建议锁定原版/MIT 发布。
- **短板**：自然度不及 Kokoro；无声音克隆；社区主维护节奏放缓（靠 OHF 续命）。

### Coqui TTS / XTTS v2（`idiap/coqui-ai-TTS`）
- **优势**：XTTS v2 自然度、跨语言克隆极强（6 秒样本克隆、17 语种）。
- **致命限制**：
  1. **XTTS v2 权重为 CPML 许可证，仅限非商用**，且 Coqui 公司已关闭、无法购买商用授权；
  2. 需 Python + GPU（≥4GB）服务端，与本项目"无后端 PWA"冲突。
- **结论**：若未来加自有后端且接受非商用，可单机部署；**当前 PWA 直接集成不可行，商用有法律风险**。

### Bark（`suno-ai/bark`）
- **优势**：生成式、富情感（笑声/叹气/音乐），研究价值高。
- **限制**：2024-08 起停滞；推理慢（CPU 慢 10–100×）；**非确定性**（不适合逐词跟读）；
  EnCodec 后端非商用；无成熟浏览器构建；英文为主。
- **结论**：不适合需要"稳定、清晰、可跟读"的少儿英语场景。

---

## 4. 与商业云 TTS 的快速对比（仅供决策参考，非开源）

| 服务 | 自然度 | 集成 | 成本/合规 | 适合本项目？ |
|---|---|---|---|---|
| ElevenLabs | 最高 | 需 API Key + 后端代理 | 付费、数据出端 | 音质最佳但需后端+费用 |
| Microsoft Azure TTS | 很高（含儿童嗓） | REST API + 密钥 | 付费 | 需后端 |
| OpenAI TTS | 高 | REST API | 按量付费 | 需后端 |
| **本方案（Kokoro/sherpa-onnx）** | 高（开源天花板） | **纯前端** | 免费、离线、合规 | ✅ 首选 |

对少儿产品，**离线 + 零成本 + 合规 + 可全设备**往往比"再多一点自然度"更重要。

---

## 5. 针对本项目的集成方案（代码级建议）

现有 `speakText()` 是两级回退（有道 → WebSpeech）。在 **Windows + Chrome** 目标下，
建议**以 Kokoro(WebGPU) 为唯一神经网络主引擎**，少量环境回退到原有方案，链条更短、音质更统一：

```
Kokoro(WebGPU, Chrome/Win)  →  sherpa-onnx/Piper(WASM, 兜底无 WebGPU)  →  有道(现有)  →  WebSpeech(现有)
```

- **主引擎 Kokoro（WebGPU）**：Windows Chrome 普遍支持 WebGPU，首次点击时 `dynamic import` `kokoro-js`
  走 WebGPU 推理（机型多为集显/独显，~80MB fp32 模型可近实时）；用 `Audio`/`AudioContext` 播放 PCM。
  这是自然度提升的最大来源。
- **兜底 sherpa-onnx（WASM）**：仅当 `!navigator.gpu` 或 Kokoro 加载/推理失败时启用，
  覆盖极少数未启用/禁用 WebGPU 的环境（无需再为 iOS Safari 单独设计）。
- **降级现有方案**：神经网络引擎都不可用时，退回有道 + WebSpeech，保证"一定能出声"。
- **性能护栏**：Windows 桌面机 `deviceMemory` 通常 ≥4GB，可放心加载；模型懒加载并缓存
  （Service Worker / Cache Storage），契合项目 PWA 离线优先特性。
- **儿童体验**：统一用美式/英式儿童友好 voice（Kokoro `af_heart` / Piper `libritts`）；
  保留 `slow` 慢速选项（现有 `rate=0.6`）以适配跟读。

> 集成工作量评估：中等。核心约 1 个新的 `engine/*.ts` 模块 + 改造 `speak.ts` 的回退顺序 +
> 模型托管（放 CDN/HuggingFace 或随 PWA 预缓存）。无需改动业务页面（`SpeakButton` 接口不变）。

---

## 6. 风险与注意事项

1. **WebGPU 覆盖**：Kokoro 依赖 WebGPU，iOS Safari 尚未支持 → 必须有 sherpa-onnx(WASM) 兜底。
2. **模型体积与首屏**：神经网络模型 60–80MB，务必懒加载 + 进度提示，避免首屏卡顿。
3. **许可证商用**：
   - ✅ 安全：Kokoro(Apache-2.0)、sherpa-onnx(Apache-2.0)、Piper 原版(MIT)。
   - ⚠️ 规避：XTTS v2(CPML 非商用)、Bark 的 EnCodec 后端(非商用)、Fish Speech(CC-BY-NC)。
4. **发音清晰度 > 表达力**：少儿跟读场景，优先选"清晰、标准美/英音"的 voicepack，而非最"戏剧化"的。
5. **Star 时效**：以上数字为 2026-07-29 检索快照，落地前请再核一次仓库最新 release 与许可证文件。

---

## 7. 数据来源

- GitHub 仓库元数据：`rhasspy/piper`、`hexgrad/kokoro`、`k2-fsa/sherpa-onnx`、`idiap/coqui-ai-TTS`、`suno-ai/bark`、各 awesome.ecosyste.ms 镜像。
- 社区对比：LocalAlternative（Piper vs Coqui vs Bark）、quick-tts 博客（Web Speech vs Piper vs Kokoro 浏览器实测）、Clore.ai TTS 对比、promptquorum 许可证盘点（2026）、localaimaster（XTTS 商用许可分析）。
- 项目约束来源：`D:\everything\starlight-course\src\utils\speak.ts`、`src/components/SpeakButton.tsx`、`AGENTS.md`。

---

## 8. 实现状态（2026-07-29 已落地）

已按本报告推荐将 **Kokoro-82M（WebGPU）** 接入回退链最前端，保留原有「有道 → WebSpeech」兜底：

- 新增 `src/utils/engine/kokoro.ts`：封装 kokoro-js 的 WebGPU TTS。
  - **运行时从 CDN（esm.sh）动态导入** kokoro-js（`import(/* @vite-ignore */ 'https://esm.sh/kokoro-js')`），
    不进入构建依赖，沙箱/CI 无需联网即可构建；用户浏览器首次点击时再懒加载库 + HuggingFace 模型。
  - 模型单例 + 后台预热（warmup）；WebGPU 不可用时标记 `unsupported` 直接回落。
  - 失败（无 WebGPU / 加载异常 / 代次变更）一律返回 `false`，由 `speak.ts` 无缝降级。
  - 提供 `setKokoroEnabled()`（localStorage 开关，默认开），便于弱机/特殊环境一键关闭。
- 改造 `src/utils/speak.ts`：英文且 Kokoro 已就绪时优先走 Kokoro；否则走原有链路并后台预热。
  保留 `currentAudio` 取消、`generation` 代次机制、`cancelSpeech()` 与 `SpeakButton` 接口（`slow`/`lang`）完全不变。
- 验证：`tsc --noEmit` 通过、`vite build` 通过（kokoro-js 因 `@vite-ignore` 不被打包，主包体积未受影响）。

> 运行时约束（用户确认）：目标为 **Windows + Chrome**，完整支持 WebGPU（D3D12），故 Kokoro 为无前提首选，无需 sherpa-onnx WASM 兜底常驻。
> 注意：Kokoro 仅对英文启用；中文/古诗仍走原有有道链路（有道 type=2 中文效果好）。
> 离线/自托管：若需完全离线，将 `KOKORO_CDN` 改为自托管路径，并同时自托管 onnxruntime-web 的 wasm 与 HuggingFace 模型。

### 中文发音（2026-07-29 补充）
- **结论：Kokoro 主库不支持中文**（官方 kokoro-js v1.2.1 仅列美/英音，无中文分词器）；专做中文的 `kokoro-js-zh` 分支自带音色偏川话口音，不适合教标准普通话 → 放弃用 Kokoro 做中文。
- **Edge TTS 在 Chrome 已不可用**：微软 2025 年底改 Read Aloud 接口，要求 WebSocket 携带 Edge 专属头（`Sec-WebSocket-Version`），Chrome/Firefox/Safari 前端无法设置 → 直连失败。`edge-tts-universal` 等库明确「仅 Microsoft Edge 可用」。
- **最终方案**：中文走 **Edge TTS 云端（免费免密钥，标准普通话 `zh-CN-XiaoxiaoNeural`）**，但仅在 **Microsoft Edge 浏览器**生效；非 Edge 自动回落有道。
  - 新增 `src/utils/engine/edgeTts.ts`：运行时从 CDN 加载 `edge-tts-universal/browser`（`import(/* @vite-ignore */ 'https://esm.sh/edge-tts-universal/browser')`），不进构建依赖；`isEdgeBrowser()` 守卫（UA 含 `Edg/`）、`setEdgeTtsEnabled()` 开关、8s 连接超时护栏、失败返回 false 无缝回落。
  - `speak.ts` 中文分支：`lang==='zh' && isEdgeTtsEnabled() && isEdgeBrowser()` → Edge TTS → 有道 → WebSpeech。
- **切到 Edge 浏览器不影响英文**：Kokoro 走 WebGPU，Edge（Chromium）同样完整支持 WebGPU，英文仍是 Kokoro 高自然度；切 Edge 只是额外解锁中文 Edge TTS。
- 验证：`tsc --noEmit`、`vite build` 均通过。`npm run dev`/`preview` 在沙箱用 Windows+Chrome 无法实测 Edge TTS（需真实 Edge 浏览器联网验证）。
