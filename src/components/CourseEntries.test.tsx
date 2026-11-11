// @vitest-environment jsdom
// 首页 / 课程中心 Starlight 册次切换的回归测试。
//
// 钉死三件事：
//  ① 切换条默认预备级、两个册次都在、当前册高亮；
//  ② 点「第一册」后主课卡与阅读卡的链接/文案/徽章一起换册（不再各摆一张卡）；
//  ③ 偏好写进 localStorage，重新挂载后仍在第一册；野值回落预备级。

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CourseEntries from './CourseEntries'
import { HOME_LEVEL_KEY } from '@/data/homeLevel'
import { useCourseStore } from '@/store/useCourseStore'

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
      <CourseEntries />
    </MemoryRouter>,
  )

const opt = (level: string) => document.querySelector(`.sl-level-opt[data-level="${level}"]`) as HTMLElement

describe('首页 Starlight 册次切换', () => {
  it('默认预备级：两个册次都在，预备级高亮，主课/阅读都指向预备级', () => {
    const { container } = renderPage()
    expect(opt('starlight').getAttribute('aria-pressed')).toBe('true')
    expect(opt('starlight1').getAttribute('aria-pressed')).toBe('false')

    const sl = container.querySelector('.sl-home-entry')!
    const rd = container.querySelector('.rd-home-entry')!
    expect(sl.getAttribute('href')).toBe('/starlight')
    expect(rd.getAttribute('href')).toBe('/reading')
    expect(sl.textContent).toContain('预备级')
    expect(rd.textContent).toContain('预备级')
    expect(screen.getByText(/Starlight 主课/)).toBeTruthy()
  })

  it('点「第一册」后两张卡一起换册：链接、文案、单元/课数都跟着变', () => {
    const { container } = renderPage()
    fireEvent.click(opt('starlight1'))

    expect(opt('starlight1').getAttribute('aria-pressed')).toBe('true')
    const sl = container.querySelector('.sl-home-entry')!
    const rd = container.querySelector('.rd-home-entry')!
    expect(sl.getAttribute('href')).toBe('/starlight1')
    expect(rd.getAttribute('href')).toBe('/reading1')
    expect(sl.textContent).toContain('第一册')
    expect(sl.textContent).toContain('9 单元 / 96 课')
    expect(rd.textContent).toContain('第一册')
    expect(rd.textContent).toContain('96 篇')
    expect(localStorage.getItem(HOME_LEVEL_KEY)).toBe('starlight1')
  })

  it('偏好持久化：localStorage 里是第一册时，重新挂载仍是第一册', () => {
    localStorage.setItem(HOME_LEVEL_KEY, 'starlight1')
    const { container } = renderPage()
    expect(opt('starlight1').getAttribute('aria-pressed')).toBe('true')
    expect(container.querySelector('.sl-home-entry')!.getAttribute('href')).toBe('/starlight1')
    expect(container.querySelector('.rd-home-entry')!.getAttribute('href')).toBe('/reading1')
  })

  it('野值回落预备级，不把首页弄崩', () => {
    localStorage.setItem(HOME_LEVEL_KEY, 'not-a-level')
    const { container } = renderPage()
    expect(opt('starlight').getAttribute('aria-pressed')).toBe('true')
    expect(container.querySelector('.sl-home-entry')!.getAttribute('href')).toBe('/starlight')
  })

  it('既有 e2e 锚点都还在：.sl-home-entry / .rd-home-entry / .rd1-home-entry 各一个', () => {
    const { container } = renderPage()
    for (const cls of ['sl-home-entry', 'rd-home-entry', 'rd1-home-entry']) {
      expect(container.querySelectorAll(`.${cls}`).length, `${cls} 应恰好一个`).toBe(1)
    }
    const direct = container.querySelector('.rd1-home-entry')!
    expect(direct.getAttribute('href')).toBe('/reading1')
    expect(direct.textContent).toContain('阅读小故事')
  })

  it('切回预备级后链接恢复，localStorage 同步', () => {
    localStorage.setItem(HOME_LEVEL_KEY, 'starlight1')
    const { container } = renderPage()
    fireEvent.click(opt('starlight'))
    expect(container.querySelector('.sl-home-entry')!.getAttribute('href')).toBe('/starlight')
    expect(container.querySelector('.rd-home-entry')!.getAttribute('href')).toBe('/reading')
    expect(localStorage.getItem(HOME_LEVEL_KEY)).toBe('starlight')
  })
})
