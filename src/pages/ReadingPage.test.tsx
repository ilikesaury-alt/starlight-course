// @vitest-environment jsdom
// ReadingPage（独立阅读模块 /reading）页面级回归测试。
//
// 这个模块把「每课阅读短文」从 LessonPreview 的 Tab 提升为独立入口，
// 下面四件事一旦被静默改坏，孩子就看不到/读不了短文，且不会报错：
//   ① 12 单元 × 8 课 = 96 篇必须都在（漏一篇就是某一课没得读）
//   ② 点课卡片能内联展开 ReadingZone（读不了等于模块白建）
//   ③ 一次只展开一篇 —— 两个 ReadingZone 同时挂载会有两条朗读串行链互抢，
//     表现为「点听整篇结果两篇一起念 / 停不下来」
//   ④ 阅读器交互（本课词高亮 / 中文开关）在新上下文下仍可用
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReadingPage from './ReadingPage'
import { useCourseStore } from '@/store/useCourseStore'
import { modules } from '@/data/starlight'
import { getReadingPassage } from '@/data/reading'

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
      <ReadingPage />
    </MemoryRouter>
  )

/** 点开某课（key 形如 '1-1'） */
function openLesson(key: string) {
  fireEvent.click(screen.getByTestId(`rm-lesson-${key}`))
}

describe('ReadingPage · 全量覆盖', () => {
  it('渲染 12 个单元、96 课阅读入口', () => {
    renderPage()
    // 12 单元折叠容器
    expect(document.querySelectorAll('.rm-unit')).toHaveLength(12)
    // 96 课卡片（12 × 8）
    const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0)
    expect(totalLessons).toBe(96)
    expect(document.querySelectorAll('[data-testid^="rm-lesson-"]')).toHaveLength(96)
  })

  it('每个课入口都对应一条真实短文数据（没有死链）', () => {
    renderPage()
    const missing: string[] = []
    for (const m of modules) {
      for (const l of m.lessons) {
        if (!getReadingPassage(m.id, l.id)) missing.push(`${m.id}-${l.id}`)
      }
    }
    expect(missing, '这些课没有阅读短文，点开会是空白').toEqual([])
  })
})

describe('ReadingPage · 内联阅读', () => {
  it('默认不挂载任何阅读器（96 篇不一次性铺开）', () => {
    renderPage()
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(0)
  })

  it('点课卡片就地展开短文本体：标题、句子、本课词高亮都在', () => {
    renderPage()
    openLesson('1-1')

    const zone = document.querySelector('.reading-zone')
    expect(zone).toBeTruthy()
    // 真实渲染出句子，不是空壳
    expect(document.querySelectorAll('.reading-sent').length).toBeGreaterThanOrEqual(8)
    // 标题中英文（数据里 1-1 的中文标题必须露出来，家长才知道在读什么）
    expect(document.querySelector('.reading-title')).toBeTruthy()
    expect(document.querySelector('.reading-title-zh')?.textContent?.trim()).toBeTruthy()
    // 本课词高亮：1-1 的 hello/good/great/name/friend 必然出现
    expect(document.querySelectorAll('.reading-zone .tt-word--mark').length).toBeGreaterThanOrEqual(5)
  })

  it('一次只展开一篇：点另一课会收起上一篇（避免两条朗读链互抢）', () => {
    renderPage()
    openLesson('1-1')
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(1)
    const firstTitle = document.querySelector('.reading-title')?.textContent

    openLesson('1-2')
    // 仍然只有一个阅读器
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(1)
    // 且已换成第 2 课的短文（标题不同）
    const secondTitle = document.querySelector('.reading-title')?.textContent
    expect(secondTitle).not.toBe(firstTitle)
    expect(secondTitle).toContain(getReadingPassage(1, 2)!.title)
  })

  it('再点同一课会收起（不留一个关不掉的阅读器）', () => {
    renderPage()
    openLesson('1-1')
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(1)
    openLesson('1-1')
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(0)
  })

  // 回归（对抗审查抓到的 P1）：单元折叠容器是原生 <details>，收起它只是把子树
  // **藏起来**而不卸载。若不在收起时清掉 openKey，阅读器会继续按句朗读，
  // 而 ⏸ 停止朗读按钮随内容一起隐入折叠区 —— 屏幕上看不到任何能停的地方。
  it('收起单元会卸载阅读器（否则朗读停不下来）', () => {
    renderPage()
    openLesson('1-1')
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(1)

    const unit1 = document.querySelector('.rm-unit[data-unit="1"]') as HTMLDetailsElement

    // 模拟用户先展开单元（jsdom 里 <details> 默认是关的，不展开就谈不上「收起」）
    unit1.open = true
    fireEvent(unit1, new Event('toggle', { bubbles: false }))
    // 展开不应误杀阅读器
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(1)

    // 用户点 summary 收起：open 变 false，浏览器随后派发 toggle
    unit1.open = false
    fireEvent(unit1, new Event('toggle', { bubbles: false }))

    expect(document.querySelectorAll('.reading-zone')).toHaveLength(0)
    // 课按钮的展开态也要同步复位，不能「看不见内容却自称已展开」
    expect(
      screen.getByTestId('rm-lesson-1-1').getAttribute('aria-expanded')
    ).toBe('false')
  })

  it('收起其他单元不会误杀当前的阅读（只清本单元的）', () => {
    renderPage()
    openLesson('1-1')
    const unit2 = document.querySelector('.rm-unit[data-unit="2"]') as HTMLDetailsElement
    unit2.open = false
    fireEvent(unit2, new Event('toggle', { bubbles: false }))
    expect(document.querySelectorAll('.reading-zone')).toHaveLength(1)
  })
})

describe('ReadingPage · 阅读器交互在新上下文可用', () => {
  it('中文对照默认关，点开关后每句都显示中文', () => {
    renderPage()
    openLesson('1-1')

    expect(document.querySelectorAll('.reading-zh')).toHaveLength(0)
    fireEvent.click(screen.getByTestId('reading-zh-toggle'))

    const sentCount = document.querySelectorAll('.reading-sent').length
    expect(document.querySelectorAll('.reading-zh')).toHaveLength(sentCount)
  })

  it('慢速 / 记忆状态开关随阅读器一起出现（转场未被丢掉）', () => {
    renderPage()
    openLesson('1-1')
    expect(screen.getByTestId('slow-toggle')).toBeTruthy()
    expect(screen.getByTestId('memory-toggle')).toBeTruthy()
  })

  // 回归：记忆状态着色的 CSS 是 `.sr-mem .tt-word--*`，这个类原本只由
  // LessonPreview 挂在 .lesson-shell 上。阅读搬家后若不同步挂类，开关会变成
  // 「能点、文案也变、但整篇一个字都不变色」的假按钮（E2E 真实抓到过）。
  it('记忆状态开关真的驱动 .sr-mem 着色类（不是假按钮）', () => {    renderPage()
    openLesson('1-1')
    const root = document.querySelector('.reading-module')!
    expect(root.classList.contains('sr-mem')).toBe(false)

    fireEvent.click(screen.getByTestId('memory-toggle'))
    expect(root.classList.contains('sr-mem')).toBe(true)

    fireEvent.click(screen.getByTestId('memory-toggle'))
    expect(root.classList.contains('sr-mem')).toBe(false)
  })

  // 对抗审查指出：上面那条「打开开关就有底色」的 E2E 断言其实**自证** ——
  // boxLevel(undefined) 也返回 'unknown'，即使 boxOf 完全没接线，
  // 整篇也会被染成灰色而测试全绿。真正要钉的是「boxOf 真的把 SRS 盒号传进去了」。
  it('boxOf 真的接线：SRS 盒号 ≥4 的词展示为 known 档', () => {
    // 造一个熟词：hello 已在 1-1 词表里，直接抬到 box 5
    // （recordReview 走 FSRS，同一天连答不会把盒号抬到 4+，所以这里直接写卡片）
    useCourseStore.getState().seedCards(['hello'], 'starlight')
    useCourseStore.setState((s) => ({
      srsCards: { ...s.srsCards, hello: { ...s.srsCards.hello, box: 5 } },
    }))

    renderPage()
    openLesson('1-1')

    // 盒号确实传到了点词组件：hello 带 known 档类名（而非一律 unknown）
    const helloBtn = Array.from(document.querySelectorAll('.reading-zone .tt-word')).find(
      (el) => el.textContent?.toLowerCase().startsWith('hello')
    ) as HTMLElement | undefined
    expect(helloBtn, '1-1 里应该有 hello 这个词').toBeTruthy()
    expect(helloBtn!.className).toContain('tt-word--known')
  })
})