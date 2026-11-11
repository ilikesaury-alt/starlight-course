// @vitest-environment jsdom
// 首页「今日任务」的回归测试。
//
// 钉死这次修的核心问题：Starlight 是两册一个系列，但「今日任务」只显示前 2 条。
// 原来两册各推一条 → 两条 Starlight 占满，语文/英语/绘本永远轮不上。
// 现在跟着册次偏好只推当前册的一条，第 2 格还给别的模块。
//
// 另外钉死：切册要**当场**换掉任务（靠 data/homeLevel.ts 的订阅广播，
// localStorage 本身同页不通知），且预备级视图下不白拉第一册数据。
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
  it('预备级视图：只推预备级一条 Starlight，第 2 格给别的模块', async () => {
    renderCard()
    await waitFor(() => {
      const mods = rowModules()
      expect(mods).toHaveLength(2)
      expect(mods).toContain('Starlight')
      expect(mods).not.toContain('Starlight 1')
    })
    // 两格不能都是 Starlight —— 这正是修复前的病
    expect(rowModules().filter((m) => m.startsWith('Starlight'))).toHaveLength(1)
  })

  it('第一册视图：推第一册一条，且不再出现预备级那条', async () => {
    localStorage.setItem(HOME_LEVEL_KEY, 'starlight1')
    renderCard()
    await waitFor(
      () => {
        const mods = rowModules()
        expect(mods).toHaveLength(2)
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

  it('第一册全部学完时不留空任务行', async () => {
    localStorage.setItem(HOME_LEVEL_KEY, 'starlight1')
    const { container } = renderCard()
    // 等第一册任务出现（说明数据已加载完）
    await waitFor(() => expect(rowModules()).toContain('Starlight 1'), {
      timeout: FIRST_BOOK_WAIT,
    })

    // 把第一册全部课标成已完成
    const { modulesOfLevel } = await import('@/data/starlightSeriesData')
    const done: Record<string, number[]> = {}
    for (const m of modulesOfLevel('starlight1')) {
      done[m.slug] = m.lessons.map((l) => l.id)
    }
    useCourseStore.setState({ lessonCompleted: done })

    await waitFor(() => {
      expect(rowModules()).not.toContain('Starlight 1')
      expect(container.querySelectorAll('.today-row').length).toBeLessThanOrEqual(2)
    })
  }, FIRST_BOOK_WAIT)

  it('今日无到期复习时不显示复习入口，任务行照常', async () => {
    renderCard()
    expect(screen.queryByText(/今日复习/)).toBeNull()
    await waitFor(() => expect(rowModules().length).toBe(2))
  })
})
