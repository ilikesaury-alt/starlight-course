// dictation 工具单测：守住「取词池 / 长度过滤 / 干扰项 / 三选一选项」的口径。
// 三选一模式要能真的难住"记住了大致长相"的孩子，干扰项必须是「像但不等于」，
// 且绝不能与正确答案重复——这几条一旦破了，练习就失去意义。
import { describe, expect, it } from 'vitest'
import {
  buildChoices,
  buildDictationPool,
  normalizeDictationWord,
  pickDistractors,
  shuffle,
} from './dictation'

const rnd = (seed: number) => () => {
  seed = (seed * 1103515245 + 12345) % 2147483648
  return seed / 2147483648
}

/** 编辑距离（测试用，校验干扰项「像」原词而非乱码） */
function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
  }
  return dp[a.length][b.length]
}

describe('buildDictationPool · 取词池', () => {
  const getWords = (id: string) =>
    id === 'u1'
      ? [
          { en: 'cat', zh: '猫' },
          { en: 'dog', zh: '狗' },
          { en: 'Cat', zh: '猫(重复)' },
        ]
      : [{ en: 'watermelon', zh: '西瓜' }]

  it('跨单元汇总并按小写去重', () => {
    const pool = buildDictationPool(['u1', 'u2'], getWords, 'all')
    expect(pool.map((w) => w.en)).toEqual(['cat', 'dog', 'watermelon'])
  })

  it('短词过滤 <=4 字母', () => {
    const pool = buildDictationPool(['u1', 'u2'], getWords, 'short')
    expect(pool.map((w) => w.en)).toEqual(['cat', 'dog'])
  })

  it('长词过滤 >4 字母', () => {
    const pool = buildDictationPool(['u1', 'u2'], getWords, 'long')
    expect(pool.map((w) => w.en)).toEqual(['watermelon'])
  })

  it('空单元列表返回空池', () => {
    expect(buildDictationPool([], getWords, 'all')).toEqual([])
  })
})

describe('normalizeDictationWord · 错词本 → 练习词', () => {
  it('缺省 emoji 兜底', () => {
    expect(normalizeDictationWord({ en: 'cat', zh: '猫' })).toMatchObject({
      en: 'cat',
      zh: '猫',
    })
  })
})

describe('pickDistractors · 干扰项', () => {
  it('数量正确、互不重复、且都不等于正确答案', () => {
    const out = pickDistractors('cat', 3, rnd(7))
    expect(out).toHaveLength(3)
    expect(new Set(out.map((s) => s.toLowerCase())).size).toBe(3)
    for (const s of out) expect(s.toLowerCase()).not.toBe('cat')
  })

  it('干扰项与原词长度接近（像同一个词的长相）', () => {
    const out = pickDistractors('ship', 3, rnd(11))
    for (const s of out) expect(Math.abs(s.length - 4)).toBeLessThanOrEqual(1)
  })

  // 对抗审查发现：早期用随机字母串做干扰项（如 xqz），孩子一眼就能排除，
  // 三选一形同虚设。干扰项必须由原词「变形」而来，才真的能练到 音→形。
  it('干扰项必须由原词变形而来（与原词共享绝大多数字母）', () => {
    for (const word of ['cat', 'ship', 'cake', 'book']) {
      for (const d of pickDistractors(word, 3, rnd(13))) {
        const shared = [...d].filter((c) => word.includes(c)).length
        expect(shared).toBeGreaterThanOrEqual(Math.max(2, word.length - 2))
      }
    }
  })

  it('干扰项不得是纯随机串（每个字符都应来自原词或近音替换）', () => {
    const out = pickDistractors('dog', 3, rnd(17))
    for (const d of out) {
      // 与原词编辑距离必须很小（<=2），否则就是乱码
      const dist = editDistance(d, 'dog')
      expect(dist).toBeLessThanOrEqual(2)
    }
  })
})

describe('buildChoices · 三选一选项', () => {
  it('恰好一个正确项，且位置被打乱', () => {
    const choices = buildChoices('cat', 3, rnd(3))
    expect(choices).toHaveLength(3)
    expect(choices.filter((c) => c.correct)).toHaveLength(1)
    const right = choices.find((c) => c.correct)!
    expect(right.text.toLowerCase()).toBe('cat')
  })

  it('选项文本互不重复', () => {
    const choices = buildChoices('dog', 3, rnd(5))
    const texts = choices.map((c) => c.text.toLowerCase())
    expect(new Set(texts).size).toBe(texts.length)
  })
})

describe('shuffle · 洗牌', () => {
  it('不改长度且元素守恒', () => {
    const src = ['a', 'b', 'c', 'd']
    const out = shuffle(src, rnd(9))
    expect(out).toHaveLength(4)
    expect([...out].sort()).toEqual([...src].sort())
  })
  it('不修改原数组', () => {
    const src = ['a', 'b', 'c']
    shuffle(src, rnd(1))
    expect(src).toEqual(['a', 'b', 'c'])
  })
})
