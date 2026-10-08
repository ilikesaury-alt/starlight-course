/**
 * 百度翻译 TTS 引擎（网络音频）：英文 `lan=en`，中文 `lan=zh`。
 *
 * 为什么要加这台引擎（2026-10 实测）：
 *   - dict.youdao.com 对**整句**几乎必回 HTTP 500（同批整句 4/20 命中），
 *     切成 2~3 词小片才勉强 17/25 —— 于是「单词有声、句子没声」；
 *   - 失败设备上英文语音包常常一个都没有（`?debug=audio` 面板 voiceEn=0），
 *     最后一级原生合成器对英文也哑火 → 整句彻底静音；
 *   - `fanyi.baidu.com/gettts` 实测句子 8/8 返回**真实音频**（逗号 / 问号 / 感叹号 /
 *     撇号 / 17 词长句都行），中文 3/3 也是真实音频（不同文本字节不同，
 *     不是有道那种固定 48ms 空白段），TTFB 约 480ms。
 *
 * ⚠️ 关键坑：**带非百度的 Referer 就回 0 字节 text/html**（HTTP 200 却没有声音）。
 *   页面默认 `strict-origin-when-cross-origin` 一定会给跨域请求带上 Origin-only
 *   Referer（实测 `Referer: https://xxx.github.io/`、`Referer: http://localhost:5173/`
 *   都被拒），而只带 `Origin` 头反而正常 —— 纯粹是 Referer 触发的反爬。
 *   所以 `index.html` 里必须有 `<meta name="referrer" content="no-referrer">`，
 *   否则 `<audio>` 拿到的是空 HTML → `MEDIA_ERR_SRC_NOT_SUPPORTED`，链路白降一级。
 *   （`fetch()` 也不行：服务端不发 `Access-Control-Allow-Origin`，只能 `<audio>` 直连播放。）
 *
 * 本引擎只负责「一个 URL 播一次」，整段/分片/熔断的编排在 `youdao.ts` 里。
 */

import { PlayOutcome } from './types'
import { playUrl } from './playUrl'

export interface BaiduOptions {
  /** 播放速率（慢速 0.6 / 正常 1） */
  rate?: number
  /** 代次守卫 */
  guard?: () => boolean
  /** 创建出 audio 元素时回调，便于上层接管取消逻辑 */
  onAudio?: (el: HTMLAudioElement) => void
  /** 加载超时（毫秒） */
  loadTimeout?: number
}

/** 引擎实际请求的 URL（导出便于单测断言编码与参数） */
export function buildBaiduTtsUrl(text: string, lang: 'en' | 'zh'): string {
  const lan = lang === 'zh' ? 'zh' : 'en'
  return `https://fanyi.baidu.com/gettts?lan=${lan}&spd=5&source=web&text=${encodeURIComponent(text)}`
}

/**
 * 整段 / 分片请求时「先百度还是先有道」。
 *
 *   - 英文**整句**（≥3 词、含标点、或超过 14 字符）→ 先百度：有道整句几乎必 500，
 *     而百度一次就能给出自然的整句音频，还省掉「整段 5s 超时 → 分片」这一长串等待；
 *   - 英文**单词 / 短语** → 先有道：实测 130ms 就响、命中率高，比百度（约 480ms）跟手，
 *     也让点单词的高频流量继续留在原来那条已验证的链路上；
 *   - 中文 → 恒先百度：有道中文几乎只回同一段 48ms 空白音频，试了也是白试。
 */
export function preferBaiduFirst(text: string, lang: 'en' | 'zh'): boolean {
  if (lang === 'zh') return true
  const t = text.trim()
  if (!t) return false
  const words = t.split(/\s+/)
  if (words.length >= 3) return true
  if (/[.!?。！？；;，,、:：]/.test(t)) return true
  return t.length > 14
}

export function playBaiduAudio(
  text: string,
  lang: 'en' | 'zh',
  opts: BaiduOptions = {},
): Promise<PlayOutcome> {
  return playUrl(buildBaiduTtsUrl(text, lang), {
    guard: opts.guard,
    onAudio: opts.onAudio,
    playbackRate: opts.rate ?? 1,
    // 百度整段也偏慢，但绝不能像有道那样白等到天荒地老 —— 早点判失败早点降级
    loadTimeout: opts.loadTimeout ?? 5000,
    hardCapMs: 120000,
    // 空白/坏响应的诊断要记在百度名下
    engineName: 'baidu',
  })
}
