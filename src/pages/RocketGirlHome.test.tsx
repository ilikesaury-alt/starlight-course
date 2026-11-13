// @vitest-environment jsdom
// Rocket Girl 阅读页（/rocketgirl）—— 整体并入阅读模块后的页面级回归。
//
// 钉死七件事：
//  ① 页面就是阅读模块的白纸页骨架（.reading-sheet + .reading-module），不是旧 StoryHome；
//  ② 108 集按 27 条故事弧分组，每弧 4 集（rm-lesson-rg-*，不与 Starlight 数字键冲突）；
//  ③ 点一条就地展开 ReadingZone，一次只展开一篇，再点收起；
//  ④ 点词弹层有中文（父辈报的「词典里还没这个词」不再出现）；
//  ⑤ 面包屑是「🏠 › Rocket Girl 阅读」；
//  ⑥ 彻底砍掉旧 RG 的东西：没有 Tab / 测验 / 标记本关完成 / 搜索框 / 绘本馆；
//  ⑦ 不渲染 Starlight 系列切换条（/reading 的 e2e 钉死它恰好 2 项）。
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RocketGirlHome from './RocketGirlHome'
import { useCourseStore } from '@/store/useCourseStore'
import { rgArcCount, rgStoryCount } from '@/data/rocketgirlReading'

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
      <RocketGirlHome />
    </MemoryRouter>,
  )

const lessonCards = () =>
  Array.from(document.querySelectorAll('[data-testid^="rm-lesson-rg-"]'))

describe('Rocket Girl 阅读 · 页面骨架', () => {
  it('是阅读模块的白纸页（.reading-sheet / .reading-module），不是旧故事首页', () => {
    renderPage()
    const root = document.querySelector('.page.reading-module.reading-sheet')
    expect(root).toBeTruthy()
    expect(document.querySelector('h1.rm-hero-title')?.textContent).toContain('Rocket Girl 阅读')
    expect(document.querySelector('.rm-hero-statement')?.textContent).toContain('Roxy')
    // 旧 StoryHome 的结构一个都不该在
    expect(document.querySelector('.rg-search')).toBeNull()
    expect(document.querySelector('.rg-books')).toBeNull()
    expect(document.querySelector('.rg-card')).toBeNull()
  })

  it('面包屑是「🏠 › Rocket Girl 阅读」', () => {
    renderPage()
    const bc = document.querySelector('.breadcrumb')
    expect(bc?.textContent).toContain('🏠')
    expect(bc?.textContent).toContain('Rocket Girl 阅读')
    expect(bc?.querySelector('a[href="/"]')).toBeTruthy()
  })

  it('没有 Tab / 测验 / 标记本关完成这些旧 RG 关卡件', () => {
    renderPage()
    expect(document.querySelectorAll('.tab-bar')).toHaveLength(0)
    expect(document.querySelectorAll('.tab-btn')).toHaveLength(0)
    expect(document.querySelectorAll('.quiz-engine')).toHaveLength(0)
    expect(document.body.textContent).not.toContain('标记本关完成')
    expect(document.body.textContent).not.toContain('闯关')
  })

  it('不渲染 Starlight 系列切换条（/reading 的切换条必须仍恰好 2 项）', () => {
    renderPage()
    expect(document.querySelectorAll('.sl-series-tab')).toHaveLength(0)
  })
})

describe('Rocket Girl 阅读 · 故事弧目录', () => {
  it('27 条故事弧，每条 4 集，共 108 条课', () => {
    renderPage()
    expect(document.querySelectorAll('.rm-unit')).toHaveLength(rgArcCount)
    expect(rgArcCount).toBe(27)
    for (let arc = 1; arc <= rgArcCount; arc++) {
      expect(
        document.querySelectorAll(`[data-testid^="rm-lesson-rg-${arc}-"]`),
        `第 ${arc} 条弧课数不对`,
      ).toHaveLength(4)
    }
    expect(lessonCards()).toHaveLength(rgStoryCount)
    expect(rgStoryCount).toBe(108)
  })

  it('单元标题直接印故事弧名（不套 Module N 前缀）', () => {
    renderPage()
    const first = document.querySelector('.rm-unit[data-unit="1"] .rm-unit-title')
    expect(first?.textContent).toContain('Rocket Girl and the Aliens')
    expect(first?.textContent).not.toContain('Module')
  })

  it('展开一条弧能看到这一组的宝藏词（可点）', () => {
    renderPage()
    const unit = document.querySelector('.rm-unit[data-unit="1"]') as HTMLDetailsElement
    unit.open = true
    fireEvent(unit, new Event('toggle', { bubbles: false }))
    const words = unit.querySelectorAll('.rm-treasure-word')
    expect(words.length).toBeGreaterThan(0)
    expect(unit.querySelector('.rm-unit-treasure')?.textContent).toContain(String(words.length))
  })
})

describe('Rocket Girl 阅读 · 就地阅读器', () => {
  it('默认不预渲染任何阅读器（108 集不一次性铺开）', () => {
    renderPage()
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(0)
  })

  it('点一条就地展开 ReadingZone；一次只展开一篇；再点收起', () => {
    renderPage()
    fireEvent.click(screen.getByTestId('rm-lesson-rg-1-1'))
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(1)
    expect(document.querySelectorAll('.reading-sent').length).toBeGreaterThan(0)
    expect(document.querySelectorAll('.reading-sent').length).toBeLessThanOrEqual(10)
    const firstTitle = document.querySelector('.reading-title')?.textContent

    fireEvent.click(screen.getByTestId('rm-lesson-rg-2-1'))
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(1)
    const secondTitle = document.querySelector('.reading-title')?.textContent
    expect(secondTitle).not.toBe(firstTitle)

    fireEvent.click(screen.getByTestId('rm-lesson-rg-2-1'))
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(0)
  })

  it('点词弹层有中文，不出现「词典里还没这个词」', () => {
    renderPage()
    fireEvent.click(screen.getByTestId('rm-lesson-rg-1-1'))
    const words = Array.from(document.querySelectorAll('.tt-word')) as HTMLElement[]
    // 挑一个词级查不到的词（title 退化成「点击听发音」），正是家长报的场景
    const unknown = words.find((w) => w.getAttribute('title') === '点击听发音')
    expect(unknown, '至少有一个词级查不到的词用于验证整句兜底').toBeTruthy()
    fireEvent.click(unknown!)
    const zh = document.querySelector('.tt-pop .tt-pop-zh')?.textContent ?? ''
    expect(zh).toBeTruthy()
    expect(zh).not.toContain('词典里还没这个词')
  })

  it('阅读器的中文/整篇按钮在，且用软按钮类名', () => {
    renderPage()
    fireEvent.click(screen.getByTestId('rm-lesson-rg-1-1'))
    for (const id of ['reading-play-all', 'reading-zh-toggle']) {
      const btn = screen.getByTestId(id)
      expect(btn.className).toContain('btn--soft')
    }
    fireEvent.click(screen.getByTestId('reading-zh-toggle'))
    expect(document.querySelectorAll('.reading-zh').length).toBeGreaterThan(0)
  })
})
