// phonics 工具单测：守住「音素格子 / 金字塔 / 拼读提示」的切分口径。
// 这些是听写模块「自然拼读桥接」的底层契约，规则一改就要在这里对账。
//
// ⭐ 口径对齐《字母积木》(Alphablocks) 的教学分级（见 phonics.ts 文件头）：
//   单字母 / 字母小队 / 手拉手 / 双写 / 魔法E / 不发音。
//   下面每条断言都对应动画里的一个概念，改规则时先回到动画口径对账。
import { describe, expect, it } from 'vitest'
import { isShortWord, phonemeBoxes, phonemeSegments, phonicsHint, spellingPyramid } from './phonics'

/** 便捷断言：单词 → 片段文本 */
const seg = (w: string) => phonemeSegments(w).map((s) => s.text)
/** 便捷断言：单词 → 片段类别 */
const kinds = (w: string) => phonemeSegments(w).map((s) => s.kind)

describe('phonemeSegments · 不变量', () => {
  it('所有片段拼起来 === 原词字母序列（格子不能吞字/加字）', () => {
    const words = [
      'cat', 'ship', 'chick', 'this', 'cake', 'name', 'stand', 'friend',
      'father', 'bird', 'eight', 'right', 'know', 'write', 'today',
      'ball', 'egg', 'happy', 'umbrella', 'people', 'orange', 'picture',
      'school', 'nice', 'see', 'blue', 'house', 'please', 'their', 'everywhere',
    ]
    for (const w of words) {
      expect(seg(w).join(''), w).toBe(w)
    }
  })

  it('片段文本全部是小写字母，且不含空格', () => {
    for (const w of ['cat', 'ship', 'umbrella', 'school', 'everywhere']) {
      for (const s of phonemeSegments(w)) {
        expect(s.text).toMatch(/^[a-z]+$/)
      }
    }
  })

  it('每个片段都有中文标签和音数（魔法E/不发音 = 0 音）', () => {
    for (const w of ['cat', 'cake', 'know', 'stand', 'ball']) {
      for (const s of phonemeSegments(w)) {
        expect(s.label.length).toBeGreaterThan(0)
        if (s.kind === 'magic-e' || s.kind === 'silent') expect(s.sounds).toBe(0)
        else expect(s.sounds).toBeGreaterThan(0)
      }
    }
  })
})

describe('phonemeSegments · L1-2 单字母', () => {
  it('CVC 短词按字母逐格', () => {
    expect(seg('cat')).toEqual(['c', 'a', 't'])
    expect(seg('dog')).toEqual(['d', 'o', 'g'])
    expect(seg('bag')).toEqual(['b', 'a', 'g'])
  })
})

describe('phonemeSegments · L3 字母小队（两三个字母合成一个音）', () => {
  it('辅音小队：ch / sh / th / ng / ck', () => {
    expect(seg('ship')).toEqual(['sh', 'i', 'p'])
    expect(seg('chick')).toEqual(['ch', 'i', 'ck'])
    expect(seg('this')).toEqual(['th', 'i', 's'])
    expect(seg('sing')).toEqual(['s', 'i', 'ng'])
  })

  it('元音小队：oo / ee / ai / ay', () => {
    expect(seg('book')).toEqual(['b', 'oo', 'k'])
    expect(seg('see')).toEqual(['s', 'ee'])
    expect(seg('rainbow')).toEqual(['r', 'ai', 'n', 'b', 'ow'])
    expect(seg('today')).toEqual(['t', 'o', 'd', 'ay'])
  })

  it('r 控制元音也是小队（动画同款教法）', () => {
    expect(seg('father')).toEqual(['f', 'a', 'th', 'er'])
    expect(seg('bird')).toEqual(['b', 'ir', 'd'])
    expect(seg('girl')).toEqual(['g', 'ir', 'l'])
  })

  it('三字母 / 四字母队伍', () => {
    expect(seg('eight')).toEqual(['eigh', 't'])
    expect(seg('chair')).toEqual(['ch', 'air'])
  })
})

describe('phonemeSegments · L4 手拉手（辅音簇，各发各的音）', () => {
  it('词首手拉手：st / bl / tr / thr', () => {
    expect(seg('stand')).toEqual(['st', 'a', 'nd'])
    expect(seg('black')).toEqual(['bl', 'a', 'ck'])
    expect(seg('three')).toEqual(['thr', 'ee'])
  })

  it('词尾手拉手：-nd', () => {
    expect(seg('friend')).toEqual(['fr', 'ie', 'nd'])
    expect(seg('find')).toEqual(['f', 'i', 'nd'])
  })

  it('手拉手里的每个字母各占一个音（sounds = 字母数）', () => {
    const st = phonemeSegments('stand').find((s) => s.text === 'st')!
    expect(st.kind).toBe('blend')
    expect(st.sounds).toBe(2)
  })
})

describe('phonemeSegments · 双写（ll / ss / ff 合成一个音）', () => {
  it('双写合成一格，不再拆成两格', () => {
    expect(seg('ball')).toEqual(['b', 'a', 'll'])
    expect(seg('egg')).toEqual(['e', 'gg'])
    expect(seg('happy')).toEqual(['h', 'a', 'pp', 'y'])
    expect(seg('miss')).toEqual(['m', 'i', 'ss'])
  })

  it('双写片段标为 double，且只算一个音', () => {
    const ll = phonemeSegments('ball').find((s) => s.text === 'll')!
    expect(ll.kind).toBe('double')
    expect(ll.sounds).toBe(1)
  })
})

describe('phonemeSegments · L5 魔法E（e 独立成格）', () => {
  it('e 自己不发音，但让前面的元音发长音 —— 两者都看得见', () => {
    expect(seg('cake')).toEqual(['c', 'a', 'k', 'e'])
    expect(kinds('cake')).toEqual(['letter', 'magic-vowel', 'letter', 'magic-e'])
    expect(seg('name')).toEqual(['n', 'a', 'm', 'e'])
    expect(seg('game')).toEqual(['g', 'a', 'm', 'e'])
  })

  it('魔法E 自己没声音（0 音），被施法的元音是长音（1 音）', () => {
    const segs = phonemeSegments('cake')
    const magicE = segs.find((s) => s.kind === 'magic-e')!
    const magicVowel = segs.find((s) => s.kind === 'magic-vowel')!
    expect(magicE.sounds).toBe(0)
    expect(magicVowel.sounds).toBe(1)
  })

  it('元音 + e（ue 型）也算魔法E：blue', () => {
    expect(seg('blue')).toEqual(['bl', 'u', 'e'])
    expect(kinds('blue')).toEqual(['blend', 'magic-vowel', 'magic-e'])
  })

  it('短音词不吃魔法E：come / have / love / one', () => {
    expect(kinds('come')).toEqual(['letter', 'letter', 'letter', 'silent'])
    expect(kinds('have')).toEqual(['letter', 'letter', 'letter', 'silent'])
    expect(kinds('love')).toEqual(['letter', 'letter', 'letter', 'silent'])
    expect(kinds('one')).toEqual(['letter', 'letter', 'silent'])
  })

  it('元音小队 + 不发音的 e：house / please 不是魔法E', () => {
    expect(kinds('house')).toEqual(['letter', 'team', 'letter', 'silent'])
    expect(kinds('please')).toEqual(['blend', 'team', 'letter', 'silent'])
  })

  it('r 控制小队 + 不发音的 e：share / there 不是魔法E', () => {
    expect(kinds('share')).toEqual(['team', 'team', 'silent'])
  })
})

describe('phonemeSegments · 不发音的字母', () => {
  it('know 的 k / write 的 w 不发音', () => {
    expect(kinds('know')[0]).toBe('silent')
    expect(kinds('write')[0]).toBe('silent')
  })

  it('the / she / me 的结尾 e 不发音', () => {
    expect(kinds('the')).toEqual(['team', 'silent'])
    expect(kinds('she')).toEqual(['team', 'silent'])
    expect(kinds('me')).toEqual(['letter', 'silent'])
  })
})

describe('phonemeSegments · 课程真实词（旧口径出错最多的那些）', () => {
  it('school 的 ch 不能被 sc 手拉手吃掉', () => {
    expect(seg('school')).toEqual(['s', 'ch', 'oo', 'l'])
  })

  it('umbrella：e 不发音 + ll 是一个音', () => {
    expect(seg('umbrella')).toEqual(['u', 'm', 'br', 'e', 'll', 'a'])
    expect(kinds('umbrella')).toEqual(['letter', 'letter', 'blend', 'silent', 'double', 'letter'])
  })

  it('orange：nge 是小队，a 是短音（不是魔法E）', () => {
    expect(seg('orange')).toEqual(['or', 'a', 'nge'])
    expect(kinds('orange')).not.toContain('magic-e')
  })

  it('purple / picture：ur 是小队，结尾 e 不发音', () => {
    expect(seg('purple')).toEqual(['p', 'ur', 'pl', 'e'])
    expect(seg('picture')).toEqual(['p', 'i', 'c', 't', 'ur', 'e'])
    expect(kinds('purple')).not.toContain('magic-e')
  })

  it('nice：i 被魔法E 变长音', () => {
    expect(seg('nice')).toEqual(['n', 'i', 'c', 'e'])
    expect(kinds('nice')).toContain('magic-e')
  })

  it('every- 开头：ev 的第二个 e 不发音（不能切成 er 小队）', () => {
    expect(seg('every')).toEqual(['e', 'v', 'e', 'r', 'y'])
    expect(kinds('every')).toContain('silent')
    expect(seg('every')).not.toContain('er')
  })

  it('eleven / beautiful 走规则即可（不靠例外表）', () => {
    expect(seg('eleven')).toEqual(['e', 'l', 'e', 'v', 'e', 'n'])
    expect(seg('beautiful')).toEqual(['b', 'eau', 't', 'i', 'f', 'u', 'l'])
  })
})

describe('phonemeSegments · 多词词条（按空格分段）', () => {
  it('不能跨词边界误判：next to 的 t t 不是双写', () => {
    expect(seg('next to')).toEqual(['n', 'e', 'x', 't', 't', 'o'])
    expect(kinds('next to')).not.toContain('double')
  })

  it('不能跨词边界误判：is my 的 s m 不是手拉手', () => {
    expect(kinds('is my')).not.toContain('blend')
  })

  it('各词分别按自己的规则切：pencil case', () => {
    expect(seg('pencil case')).toEqual([
      'p', 'e', 'n', 'c', 'i', 'l', 'c', 'a', 's', 'e',
    ])
    expect(kinds('pencil case')).toContain('magic-e')
  })
})

describe('phonemeBoxes · 旧接口（只要字母片段）', () => {
  it('拼接结果 === 原词', () => {
    expect(phonemeBoxes('cat')).toEqual(['c', 'a', 't'])
    expect(phonemeBoxes('ship')).toEqual(['sh', 'i', 'p'])
    expect(phonemeBoxes('school')).toEqual(['s', 'ch', 'oo', 'l'])
  })

  it('空串 / 非字母被清理', () => {
    expect(phonemeBoxes('')).toEqual([])
    expect(phonemeBoxes('c-at!')).toEqual(['c', 'a', 't'])
  })
})

describe('spellingPyramid · 金字塔拼写阶梯', () => {
  it('逐字母展开', () => {
    expect(spellingPyramid('cat')).toEqual(['c', 'ca', 'cat'])
  })
  it('空串返回空', () => {
    expect(spellingPyramid('')).toEqual([])
  })
})

describe('phonicsHint · 拼读提示文本', () => {
  it('大写并用分隔符连接', () => {
    expect(phonicsHint('cat')).toBe('C · A · T')
    expect(phonicsHint('ship')).toBe('SH · I · P')
  })
})

describe('isShortWord · 短词判定', () => {
  it('<=4 字母视为短词', () => {
    expect(isShortWord('cat')).toBe(true)
    expect(isShortWord('cake')).toBe(true)
    expect(isShortWord('water')).toBe(false)
  })
})
