// E 课堂拓展词主题词库的契约测试
// 锁三件事：① 96 课全部配得上主题 ② 词库本身够干净 ③ 挑词会排除课内词/已录词并受上限约束

import { describe, expect, it } from 'vitest'
import { lessonsByUnit } from './lessons'
import {
  EXT_LIMIT,
  LESSON_TOPICS,
  TOPICS,
  lessonTopicZh,
  suggestExtensions,
} from './extensionTopics'
import type { Word } from './starlight'

const w = (en: string): Word => ({ en, zh: '', emoji: '' })

describe('上限', () => {
  it('每节课拓展词上限固定为 5', () => {
    expect(EXT_LIMIT).toBe(5)
  })
})

describe('词库自检', () => {
  it('每个主题至少有 EXT_LIMIT 个词（否则填不满一课）', () => {
    const tooSmall = Object.entries(TOPICS)
      .filter(([, t]) => t.words.length < EXT_LIMIT)
      .map(([key]) => key)
    expect(tooSmall).toEqual([])
  })

  it('每条词都有 en / zh / emoji（缺一个 UI 就露空）', () => {
    const bad: string[] = []
    for (const [key, topic] of Object.entries(TOPICS)) {
      expect(topic.zh, `主题 ${key} 缺中文名`).toBeTruthy()
      for (const word of topic.words) {
        if (!word.en?.trim() || !word.zh?.trim() || !word.emoji?.trim()) {
          bad.push(`${key}:${word.en || '(空)'}`)
        }
      }
    }
    expect(bad).toEqual([])
  })

  it('主题内部不重复 en（重复会占掉挑词名额）', () => {
    const dup: string[] = []
    for (const [key, topic] of Object.entries(TOPICS)) {
      const seen = new Set<string>()
      for (const word of topic.words) {
        const base = word.en.toLowerCase()
        if (seen.has(base)) dup.push(`${key}:${base}`)
        seen.add(base)
      }
    }
    expect(dup).toEqual([])
  })
})

describe('LESSON_TOPICS 覆盖', () => {
  it('96 课全部配到主题，且主题 key 都存在', () => {
    const missing: string[] = []
    const unknownTopic: string[] = []
    let total = 0
    for (const [unit, lessons] of Object.entries(lessonsByUnit)) {
      for (const lesson of lessons) {
        total++
        const key = `${unit}-${lesson.id}`
        const topics = LESSON_TOPICS[key]
        if (!topics || topics.length === 0) missing.push(key)
        else if (topics.some((t) => !TOPICS[t])) unknownTopic.push(key)
      }
    }
    expect(total).toBe(96)
    expect(missing).toEqual([])
    expect(unknownTopic).toEqual([])
  })

  it('没有配不上的孤儿主题 key（词库删过主题就会暴露）', () => {
    const used = new Set(Object.values(LESSON_TOPICS).flat())
    const orphan = Object.keys(TOPICS).filter((k) => !used.has(k))
    expect(orphan).toEqual([])
  })

  it('lessonTopicZh 返回首个主题名', () => {
    expect(lessonTopicZh('1-4')).toBe('颜色')
    expect(lessonTopicZh('99-99')).toBeUndefined()
  })
})

describe('suggestExtensions', () => {
  it('按本课主题给词，且不超过上限', () => {
    const out = suggestExtensions({ lessonKey: '1-4', lessonWords: [], existing: [] })
    expect(out.length).toBe(EXT_LIMIT)
    expect(out.every((x) => TOPICS.colors.words.includes(x))).toBe(true)
  })

  it('排除课内词：课内已有的词不会再被当成拓展词', () => {
    const lessonWords = TOPICS.colors.words.slice(0, 5) // 假装这 5 个是课内词
    const out = suggestExtensions({ lessonKey: '1-4', lessonWords, existing: [] })
    const lessonSet = new Set(lessonWords.map((x) => x.en.toLowerCase()))
    expect(out.some((x) => lessonSet.has(x.en.toLowerCase()))).toBe(false)
    expect(out.length).toBe(EXT_LIMIT) // 前 5 个被剔掉后仍能补满
  })

  it('排除已录词：换一批时只传手动词，自动词不参与过滤', () => {
    const manual = TOPICS.colors.words[0]
    const out = suggestExtensions({
      lessonKey: '1-4',
      lessonWords: [],
      existing: [manual],
      round: 2,
    })
    expect(out.some((x) => x.en === manual.en)).toBe(false)
  })

  it('换一批取的是不同的一批词（轮次生效）', () => {
    const r1 = suggestExtensions({ lessonKey: '1-4', lessonWords: [], existing: [], round: 1 })
    const r2 = suggestExtensions({ lessonKey: '1-4', lessonWords: [], existing: [], round: 2 })
    expect(r2.map((x) => x.en)).not.toEqual(r1.map((x) => x.en))
    expect(new Set([...r1, ...r2]).size).toBeGreaterThan(EXT_LIMIT)
  })

  it('同主题候选全被过滤时返回空数组（不抛错、不越界）', () => {
    const pool = TOPICS.colors.words.map((x) => w(x.en))
    expect(
      suggestExtensions({ lessonKey: '1-4', lessonWords: pool, existing: [], round: 9 })
    ).toEqual([])
    expect(
      suggestExtensions({ lessonKey: '0-0', lessonWords: [], existing: [] })
    ).toEqual([])
    expect(
      suggestExtensions({ lessonKey: '1-4', lessonWords: [], existing: [], limit: 0 })
    ).toEqual([])
  })

  it('课内词大小写不敏感地排除', () => {
    const out = suggestExtensions({
      lessonKey: '1-4',
      lessonWords: [{ en: 'PINK', zh: '', emoji: '' }],
      existing: [],
    })
    expect(out.some((x) => x.en.toLowerCase() === 'pink')).toBe(false)
  })
})
