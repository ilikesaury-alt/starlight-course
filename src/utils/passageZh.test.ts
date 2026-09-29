// 整句中文索引（src/utils/passageZh.ts）：跨数据源匹配的归一化规则是本模块的全部难点，
// 弯直引号 / 结尾标点没对齐就表现为「点了没中文」，所以用测试把住。

import { describe, it, expect } from 'vitest'
import { normLine, buildLineZhIndex, lineZhOf } from './passageZh'

describe('normLine', () => {
  it('弯引号统一成直引号（课本 What’s ↔ passage What\'s）', () => {
    expect(normLine('What\u2019s wrong with the boy?')).toBe(normLine("What's wrong with the boy?"))
  })

  it('忽略大小写、空白差异与结尾标点', () => {
    expect(normLine('What do you have?')).toBe('what do you have')
    expect(normLine('  Yes   or No. ')).toBe('yes or no')
    expect(normLine('Nose, mouth: only one.')).toBe('nose, mouth: only one')
  })
})

describe('buildLineZhIndex', () => {
  it('先出现的数据源优先，后出现的不覆盖', () => {
    const idx = buildLineZhIndex([
      [{ en: 'I have a nose.', zh: '我有一个鼻子。' }],
      [{ en: 'I have a nose.', zh: '（低优先级，不该出现）' }],
    ])
    expect(idx.get('i have a nose')).toBe('我有一个鼻子。')
  })

  it('跳过没有中文 / 空 key 的条目', () => {
    const idx = buildLineZhIndex([[{ en: 'Hello!' }, { en: '', zh: '空句子' }]])
    expect(idx.size).toBe(0)
  })
})

describe('lineZhOf', () => {
  const idx = buildLineZhIndex([
    [{ en: 'What\u2019s wrong with the boy?', zh: '这孩子怎么了？' }],
  ])

  it('命中索引时返回人工翻译，并标记非粗释义', () => {
    expect(lineZhOf(idx, "What's wrong with the boy?")).toEqual({ zh: '这孩子怎么了？', auto: false })
  })

  it('查不到时退回逐词词典拼接的粗释义', () => {
    const r = lineZhOf(idx, 'Some line with no translation.')
    expect(r.auto).toBe(true)
    expect(typeof r.zh).toBe('string')
  })
})
