/**
 * 所有 TTS 引擎的统一播放结果（供 speakService 的兜底链使用）。
 *
 * 引入该类型是为了让回退链能够区分：
 *   - success：播放成功（含软兜底已复位、音频自然结束）
 *   - blocked：被浏览器自动播放策略拦截（异步 play() 被 NotAllowedError 拒绝）——
 *              这需要「解锁音频 + 重试本引擎」，而不是简单地降级
 *   - failed： 加载 / 解码 / 网络 / 引擎内部错误——应降级到下一层
 *   - aborted：代次失效（用户已发起新的播放 / 已取消）——停止整条链
 *
 * `via`：这一级实际「借道」了哪台引擎（只有 success 会带，且只在与
 *   兜底链步骤名不同时给 —— 省略即代表本级自己出声）。
 *   例如兜底链里的有道那一级，内部可能先试了百度云 TTS 并由它出声 ——
 *   没有 `via` 的话诊断面板会把这次成功记在「youdao」头上，
 *   排查「到底谁在响」时会被自己人误导。
 */
import type { EngineName } from './engineTrace'

export type PlayOutcome =
  | { status: 'success'; via?: EngineName }
  | { status: 'blocked' }
  | { status: 'failed' }
  | { status: 'aborted' }
