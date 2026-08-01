/**
 * Universal pronunciation helper（对外兼容入口）。
 *
 * 全部播放逻辑已迁移到 `./speakService`：
 *   - 有界兜底链（Kokoro / Edge TTS / 有道 / WebSpeech），永不递归、永不死循环；
 *   - 会话代次并发管理：并发抢占 / 迟到回调自动失效；
 *   - 浏览器自动播放解锁 + blocked 重试；
 *   - Chrome speechSynthesis 假死检测 + 有界自愈 + 冷却；
 *   - 请求级硬预算，按钮动画绝不永久卡在「播放中」。
 *
 * 本文件仅 re-export，保持对既有调用方（SpeakButton / FcWord / 各页面）的签名不变。
 */

export { speakText, cancelSpeech } from './speakService'
export type { SpeakOptions } from './speakService'
