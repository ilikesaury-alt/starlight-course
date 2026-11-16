// @vitest-environment jsdom
// 首页「今日清单」的回归测试（P1 每日节律，方案 C 混合封顶）
//
// ⚠️ 这套契约在 2026-11-16 **整体改版过**：原来是「5 个模块各占一行」的
// 内容目录（每模块推一条下一课），现在是固定的三件事 ——
//   min(到期复习, 40) + 1 节新课 + 1 篇阅读
// 旧测试断言的 5 行结构已经不存在，别再按旧印象加回去。
//
// 钉死的事：
//  ① 永远恰好 3 行（复习 / 新课 / 阅读），不随模块数膨胀
//  ② 做满今天的量就算完成（到期 100 只排 40 时，做完 40 就是做完）
//  ③ 超额部分如实报出，不假装不存在
//  ④ 三项全完成时出现明确的收束文案
//  ⑤ 跨天：昨天的完成不算今天的
//  ⑥ 预备级视图下不白拉第一册数据 chunk
//
// ⚠️ 第一册教材数据约 350KB 源码，jsdom 里 `import()` 实测 5~6 秒
// （vite 现场 transform + 模块求值），远超 waitFor 默认 1s。
// 凡是要等第一册任务出现的用例，都必须显式放宽到 FIRST_BOOK_WAIT。

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TodayTasks from './TodayTasks'
import { HOME_LEVEL_KEY } from '@/data/homeLevel'
import { useCourseStore } from '@/store/useCourseStore'
import { dayStamp } from '@/data/srs'

/** 等第一册 chunk 加载完成的上限（实测 5~6s，留足余量） */
const FIRST_BOOK_WAIT = 60_000

beforeAll(() => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
  useCourseStore.setState({ lessonDoneOn: 0, readingDoneOn: 0 })
})

afterEach(cleanup)

const renderCard = () =>
  render(
    <MemoryRouter>
      <TodayTasks />
    </MemoryRouter>,
  )

const rows = () => Array.from(document.querySelectorAll('.today-row'))
const rowKinds = () =>
  Array.from(document.querySelectorAll('.today-row .today-module')).map((el) =>
    // 模块名后面可能跟着「已完成」徽章，取第一段文字
    (el.textContent ?? '').replace('已完成', '').trim(),
  )

describe('今日清单 · 结构', () => {
  it('永远恰好 3 行：复习 / 新课 / 阅读', () => {
    renderCard()
    expect(rows()).toHaveLength(3)
    expect(rowKinds()).toEqual(['复习', '新课', '阅读'])
  })

  it('不随模块数量膨胀（旧版曾按模块出 5 行）', () => {
    renderCard()
    // 空数据下 5 个模块都有「下一课」，但清单仍然只有 3 行
    expect(rows()).toHaveLength(3)
  })

  it('每行都是可达链接，没有死链', () => {
    renderCard()
    for (const row of rows()) {
      const href = row.getAttribute('href')
      expect(href, '每个任务行都要有 href').toBeTruthy()
      expect(href).toMatch(/^\/(smart|preview|chinese|eng3a|courses|reading|reading1)/)
    }
  })

  it('显示「已完成 / 总数」的进度', () => {
    renderCard()
    expect(document.querySelector('.today-count')?.textContent).toBe('0 / 3')
  })

  it('空数据的新用户：一件事都没做，不能假完成', () => {
    // 这条是真实 bug 的回归：曾经「无到期卡」被算作复习完成、
    // 「没有下一节课」被算作新课完成 ⇒ 新用户一打开首页就是 2/3 已完成。
    // 界面上「打勾」的语义是「我做了这件事」，不是「这件事当前无事可做」。
    renderCard()

    expect(document.querySelector('.today-count')?.textContent).toBe('0 / 3')
    expect(document.querySelectorAll('.today-badge')).toHaveLength(0)
    expect(document.querySelector('.today-done')).toBeNull()
  })
})

describe('今日清单 · 完成判据', () => {
  it('三项都完成时 allDone 生效：出现收束文案 + 3 个已完成徽章', async () => {
    const today = dayStamp()
    // 复习项需要**真的有到期卡且今天复习过**才算完成 ——
    // 光靠「无到期卡」不算（见「不能假完成」那条）
    useCourseStore.setState({
      srsCards: {
        apple: {
          en: 'apple',
          box: 0,
          nextReview: 0,
          lastReview: today,
          streak: 1,
          reviews: 1,
          modules: ['starlight'],
        } as never,
      },
      lessonDoneOn: today,
      readingDoneOn: today,
    })
    renderCard()

    await waitFor(() => {
      expect(document.querySelector('.today-done')).toBeTruthy()
    })
    expect(document.querySelector('.today-count')?.textContent).toBe('3 / 3')
    expect(document.querySelectorAll('.today-badge')).toHaveLength(3)
  })

  it('只做了新课：1 / 3，不出现收束文案', () => {
    useCourseStore.setState({ lessonDoneOn: dayStamp() })
    renderCard()

    expect(document.querySelector('.today-done')).toBeNull()
    // 复习项在空数据下不算完成（见「不能假完成」那条），所以只有新课这 1 项
    expect(document.querySelector('.today-count')?.textContent).toBe('1 / 3')
  })

  it('跨天：昨天完成的新课不算今天', () => {
    useCourseStore.setState({ lessonDoneOn: dayStamp() - 1 })
    renderCard()

    const lessonRow = rows().find((r) =>
      r.querySelector('.today-module')?.textContent?.includes('新课'),
    )
    expect(lessonRow?.className).not.toContain('is-done')
  })
})

describe('今日清单 · 复习配额（混合封顶）', () => {
  const seedDueCards = (n: number) => {
    const cards: Record<string, unknown> = {}
    for (let i = 0; i < n; i += 1) {
      cards[`w${i}`] = {
        en: `w${i}`,
        box: 0,
        nextReview: 0,
        lastReview: 0,
        streak: 0,
        reviews: 0,
        modules: ['starlight'],
      }
    }
    useCourseStore.setState({ srsCards: cards as never })
  }

  it('到期少于上限：全部排进今天，不报溢出', () => {
    seedDueCards(12)
    renderCard()

    const reviewRow = rows().find((r) =>
      r.querySelector('.today-module')?.textContent?.includes('复习'),
    )
    expect(reviewRow?.textContent).toContain('12 个单词')
    expect(reviewRow?.textContent).not.toContain('没排进今天')
  })

  it('到期满额超过上限 40：只排 40，并如实报出剩余', () => {
    seedDueCards(100)
    renderCard()

    const reviewRow = rows().find((r) =>
      r.querySelector('.today-module')?.textContent?.includes('复习'),
    )
    const text = reviewRow?.textContent ?? ''
    expect(text).toContain('40 个单词')
    expect(text).toContain('还有 60 个没排进今天')
  })

  it('做满今天排的 40 就算复习完成（不要求清空全部 100）', () => {
    seedDueCards(100)
    // 模拟今天复习了 40 张
    const s = useCourseStore.getState()
    const today = dayStamp()
    const next = { ...s.srsCards }
    let count = 0
    for (const key of Object.keys(next)) {
      if (count >= 40) break
      next[key] = { ...next[key], lastReview: today, nextReview: today + 3 }
      count += 1
    }
    useCourseStore.setState({ srsCards: next })

    renderCard()

    const reviewRow = rows().find((r) =>
      r.querySelector('.today-module')?.textContent?.includes('复习'),
    )
    expect(reviewRow?.className).toContain('is-done')
  })
})

describe('今日清单 · 册次（Starlight 两册一个系列）', () => {
  it('预备级视图：新课链到预备级，不出现第一册的 slug', async () => {
    renderCard()
    await waitFor(() => {
      const lessonRow = rows().find((r) =>
        r.querySelector('.today-module')?.textContent?.includes('新课'),
      )
      expect(lessonRow?.getAttribute('href')).toMatch(/^\/(preview|chinese|eng3a)\//)
    })
  })

  it('第一册视图：新课链到第一册单元（slug 形如 monty-the-artist）', async () => {
    localStorage.setItem(HOME_LEVEL_KEY, 'starlight1')
    renderCard()

    await waitFor(
      () => {
        const lessonRow = rows().find((r) =>
          r.querySelector('.today-module')?.textContent?.includes('新课'),
        )
        expect(lessonRow?.getAttribute('href')).toMatch(/^\/preview\/.+-\/|^\/preview\/.*\d+$/)
      },
      { timeout: FIRST_BOOK_WAIT },
    )
  }, FIRST_BOOK_WAIT)
})