// @vitest-environment jsdom
// 首页「今日任务」的回归测试。
//
// 钉死四件事：
//  ① Starlight 是两册一个系列，任务只推**当前册**一条（不能两册各一条占满列表）；
//  ② 每个模块各占一行、**全部可见**（曾经 slice(0,2)，永远有 3 个模块看不见）；
//  ③ 切册当场换任务（靠 data/homeLevel.ts 的订阅广播，localStorage 同页不通知）；
//  ④ 预备级视图下不白拉第一册数据 chunk。
//
// ⚠️ 第一册教材数据约 350KB 源码，在 jsdom 里 `import()` 实测要 5~6 秒
// （vite 现场 transform + 模块求值），远超 waitFor 默认 1s / 用例默认 5s。
// 凡是要等第一册任务出现的用例，都必须显式放宽到 FIRST_BOOK_WAIT。

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TodayTasks from './TodayTasks'
import { HOME_LEVEL_KEY, writeHomeLevel } from '@/data/homeLevel'
import { useCourseStore } from '@/store/useCourseStore'

/** 等第一册 chunk 加载完成的上限（实测 5~6s，留足余量） */
const FIRST_BOOK_WAIT = 60_000

beforeAll(() => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
})

afterEach(cleanup)

const renderCard = () =>
  render(
    <MemoryRouter>
      <TodayTasks />
    </MemoryRouter>,
  )

const rowModules = () =>
  Array.from(document.querySelectorAll('.today-row .today-module')).map((el) =>
    (el.textContent ?? '').replace(' · 继续学', ''),
  )

describe('首页今日任务', () => {
  it('预备级视图：Starlight 只出一条（当前册），不出现第一册那条', async () => {
    renderCard()
    await waitFor(() => {
      const mods = rowModules()
      expect(mods).toContain('Starlight')
      expect(mods).not.toContain('Starlight 1')
    })
    // 不能两册各一条 —— 那会把列表挤满
    expect(rowModules().filter((m) => m.startsWith('Starlight'))).toHaveLength(1)
  })

  it('每个模块各占一行、全部可见（不再只露 2 条）', async () => {
    renderCard()
    // 等故事模块动态 import 完成（Fly Guy / Rocket Girl 两个）
    await waitFor(() => {
      const mods = rowModules()
      // 空数据下 5 个模块都有「下一课」：Starlight / 语文 / 英语 / Fly Guy / Rocket Girl
      expect(mods).toEqual(
        expect.arrayContaining(['Starlight', '语文', '英语', 'Fly Guy', 'Rocket Girl']),
      )
      expect(mods).toHaveLength(5)
    })
  })

  it('5 行任务全部是可达链接，没有死链', async () => {
    const { container } = renderCard()
    await waitFor(() => expect(container.querySelectorAll('.today-row')).toHaveLength(5))
    for (const row of Array.from(container.querySelectorAll('.today-row'))) {
      const href = row.getAttribute('href')
      expect(href, '每个任务行都要有 href').toBeTruthy()
      expect(href).toMatch(/^\/(preview|chinese|eng3a|flyguy|rocketgirl)\//)
    }
  })

  it('第一册视图：推第一册一条，且不再出现预备级那条', async () => {
    localStorage.setItem(HOME_LEVEL_KEY, 'starlight1')
    renderCard()
    await waitFor(
      () => {
        const mods = rowModules()
        expect(mods).toContain('Starlight 1')
        expect(mods).not.toContain('Starlight')
      },
      { timeout: FIRST_BOOK_WAIT },
    )
  }, FIRST_BOOK_WAIT)

  it('切册时任务当场换册（订阅广播，不靠刷新）', async () => {
    renderCard()
    await waitFor(() => expect(rowModules()).toContain('Starlight'))

    writeHomeLevel('starlight1')
    await waitFor(
      () => {
        const mods = rowModules()
        expect(mods).toContain('Starlight 1')
        expect(mods).not.toContain('Starlight')
      },
      { timeout: FIRST_BOOK_WAIT },
    )

    writeHomeLevel('starlight')
    await waitFor(() => {
      const mods = rowModules()
      expect(mods).toContain('Starlight')
      expect(mods).not.toContain('Starlight 1')
    })
  }, FIRST_BOOK_WAIT)

  it('第一册任务链到第一册预习页，不是预备级的课', async () => {
    localStorage.setItem(HOME_LEVEL_KEY, 'starlight1')
    const { container } = renderCard()
    await waitFor(
      () => {
        const rows = Array.from(container.querySelectorAll('.today-row'))
        const sl1 = rows.find((r) =>
          r.querySelector('.today-module')?.textContent?.includes('Starlight 1'),
        )
        expect(sl1).toBeTruthy()
        // 第一册单元 slug 形如 monty-the-artist，与预备级主题 slug 不同
        expect(sl1!.getAttribute('href')).toMatch(/^\/preview\/monty-the-artist\/\d+$/)
      },
      { timeout: FIRST_BOOK_WAIT },
    )
  }, FIRST_BOOK_WAIT)

  it('学完的模块从列表消失，其余模块不受影响', async () => {
    const { container } = renderCard()
    await waitFor(() => expect(rowModules()).toContain('语文'))

    // 把语文全部标成已完成
    const { chineseUnits } = await import('@/data/chinese')
    const done = chineseUnits.flatMap((u) => u.lessons.map((l) => l.slug))
    useCourseStore.setState({ completedChinese: done })

    await waitFor(() => {
      expect(rowModules()).not.toContain('语文')
      // 别的模块还在
      expect(rowModules()).toContain('Starlight')
      expect(container.querySelectorAll('.today-row').length).toBe(4)
    })
  })

  it('今日无到期复习时不显示复习入口，任务行照常', async () => {
    renderCard()
    expect(screen.queryByText(/今日复习/)).toBeNull()
    await waitFor(() => expect(rowModules().length).toBeGreaterThan(0))
  })
})
