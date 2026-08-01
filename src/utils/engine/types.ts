/**
 * 所有 TTS 引擎的统一播放结果（供 speakService 的兜底链使用）。
 *
 * 引入该类型是为了让回退链能够区分：
 *   - success：播放成功（含软兜底已复位、音频自然结束）
 *   - blocked：被浏览器自动播放策略拦截（异步 play() 被 NotAllowedError 拒绝）——
 *              这需要「解锁音频 + 重试本引擎」，而不是简单地降级
 *   - failed： 加载 / 解码 / 网络 / 引擎内部错误——应降级到下一层
 *   - aborted：代次失效（用户已发起新的播放 / 已取消）——停止整条链
 */
export type PlayOutcome =
  | { status: 'success' }
  | { status: 'blocked' }
  | { status: 'failed' }
  | { status: 'aborted' }
