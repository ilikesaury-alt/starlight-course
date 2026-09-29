// 发音语言判定（src/utils/lang.ts）：中文被英文引擎念出来就是乱码怪音，
// 所以「含汉字 → zh」这条规则必须稳。

import { describe, it, expect } from 'vitest'
import { isZhText, pickLang } from './lang'

describe('isZhText', () => {
  it('汉字判为中文', () => {
    expect(isZhText('耳朵')).toBe(true)
    expect(isZhText('nose 鼻子')).toBe(true)
  })

  it('纯英文 / 空串不是中文', () => {
    expect(isZhText('What do you have?')).toBe(false)
    expect(isZhText('')).toBe(false)
  })
})

describe('pickLang', () => {
  it('含汉字走中文引擎', () => {
    expect(pickLang('嘴巴')).toBe('zh')
  })

  it('英文用调用方缺省（默认 en，语文题可显式传 zh）', () => {
    expect(pickLang('nose')).toBe('en')
    expect(pickLang('nose', 'zh')).toBe('zh')
    expect(pickLang(undefined)).toBe('en')
  })
})
