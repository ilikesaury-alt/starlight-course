// @vitest-environment jsdom
// /reading1（第一册）页面级回归测试。
//
// 与 ReadingPage.test.tsx（预备级）成对：同一个 ReadingBook 组件，换一册数据源。
// 这里钉死「换册不串书」—— 第一册只列真正有短文的课，首屏示例词来自第一册，
// 切换条指到阅读模块自己的两个路由，而不是主课目录页。
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReadingPage1 from './ReadingPage1'
import { useCourseStore } from '@/store/useCourseStore'
import { modules1, getReadingPassage1 } from '@/data/starlight1'

beforeAll(() => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
})

afterEach(cleanup)

const renderPage = () =>
  render(
    <MemoryRouter>
      <ReadingPage1 />
    </MemoryRouter>
  )

describe('/reading1 · 系列与目录', () => {
  it('渲染 9 个单元；课卡片数 = 有短文的课数，且每张卡都不是死链', () => {
    renderPage()
    const units = document.querySelectorAll('.rm-unit')
    expect(units).toHaveLength(9)

    const cards = Array.from(document.querySelectorAll('[data-testid^="rm-lesson-"]'))
    const expected = modules1.reduce(
      (n, m) => n + m.lessons.filter((l) => !!getReadingPassage1(m.id, l.id)).length,
      0,
    )
    expect(cards.length).toBe(expected)
    expect(expected).toBeGreaterThan(0)
    // 每张课卡片都能从 testid 反查到一篇真实短文
    for (const card of cards) {
      const key = card.getAttribute('data-testid')!.replace('rm-lesson-', '')
      const [u, l] = key.split('-').map(Number)
      expect(getReadingPassage1(u, l), `${key} 是死链`).toBeDefined()
    }
    // 死链过滤真的生效：不能把 96 课全铺出来
    expect(cards.length).toBeLessThan(96)
  })

  it('系列切换条有预备级 / 第一册两项，指向阅读模块自己的路由、当前册高亮', () => {
    renderPage()
    const tabs = document.querySelectorAll('.sl-series-tab')
    expect(tabs).toHaveLength(2)
    expect(tabs[0].getAttribute('href')).toContain('/reading')
    expect(tabs[1].getAttribute('href')).toContain('/reading1')
    expect(tabs[1].classList.contains('is-on')).toBe(true)
    expect(tabs[1].getAttribute('aria-current')).toBe('page')
    expect(tabs[0].classList.contains('is-on')).toBe(false)
  })

  it('首屏宝藏词示例来自第一册 Unit 1，不是预备级的 hello/friend', () => {
    renderPage()
    const teasers = Array.from(document.querySelectorAll('.rm-hero-word'))
    expect(teasers.length).toBe(5)
    const unit1Words = new Set(
      modules1[0].lessons.flatMap((l) => l.words.map((w) => w.en.toLowerCase())),
    )
    for (const t of teasers) {
      expect(unit1Words.has(t.textContent!.toLowerCase())).toBe(true)
    }
    expect(teasers.map((t) => t.textContent)).not.toContain('hello')
  })

  it('单元卡的「💎 N 词」= 该单元课本词去重计数', () => {
    renderPage()
    for (const m of modules1) {
      const badge = document.querySelector(`.rm-unit[data-unit="${m.id}"] .rm-unit-treasure`)
      const expected = new Set(
        m.lessons.flatMap((l) => l.words.map((w) => w.en.toLowerCase())),
      ).size
      expect(badge?.textContent).toContain(String(expected))
    }
  })

  it('面包屑带上「第一册」，h1 仍是「阅读小故事」', () => {
    renderPage()
    expect(document.querySelector('h1.rm-hero-title')?.textContent).toContain('阅读小故事')
    expect(document.querySelector('.breadcrumb')?.textContent).toContain('第一册')
  })
})

describe('/reading1 · 内联阅读器', () => {
  it('点开有短文的课，就地展开阅读器；再点收起', () => {
    renderPage()
    // 第一册 Unit 1 的第 4 课有「蓝色手印」
    const key = '1-4'
    expect(getReadingPassage1(1, 4)).toBeDefined()

    fireEvent.click(screen.getByTestId(`rm-lesson-${key}`))
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(1)
    expect(document.querySelector('.reading-title')?.textContent).toBeTruthy()

    fireEvent.click(screen.getByTestId(`rm-lesson-${key}`))
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(0)
  })

  it('默认不预渲染任何阅读器', () => {
    renderPage()
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(0)
  })
})
