// 发音语言判定：文本里有汉字就走中文引擎，否则走英文。
//
// 动机：闯关听力题的选项是中文（耳朵/嘴巴/…），若按缺省 'en' 播，
// 英文引擎会把汉字当外文念，出来的是乱码一样的怪音。
// 判定放在文本这一层（而不是只看题目 lang），因为同一题里
// 题干是英文（speakText=target.en）、选项是中文，语言各不相同。

/** 含 CJK 统一表意文字（含扩展A前的基本区）即视为中文 */
export function isZhText(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text)
}

/** 依文本选发音语言：含中文 → 'zh'，否则用调用方的缺省（默认 'en'） */
export function pickLang(text: string | undefined, fallback: 'en' | 'zh' = 'en'): 'en' | 'zh' {
  return text && isZhText(text) ? 'zh' : fallback
}
