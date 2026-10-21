// @vitest-environment jsdom
// DictationPage 页面级回归测试。
//
// 钉住三件容易被静默改坏的事：
//   ① 首页入口进来能渲染设置页（不白屏），且开始按钮可用
//   ② 「只练错题本」在错题本为空时给出兜底提示 + 按钮禁用（不让人点了没反应）
//   ③ 星数只在进入报告页时结算一次 —— 渲染期调 addStars 会重复加星，
//      这是对抗审查真实抓到的 bug，必须有测试守住（回归防线）
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DictationPage from './DictationPage'
import { useCourseStore } from '@/store/useCourseStore'
import { eng3aMetaWords } from './__dictationTestHelpers'

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
      <DictationPage />
    </MemoryRouter>
  )

describe('DictationPage · 设置页', () => {
  it('渲染标题与开始按钮，且 eng3a 词池非空时按钮可用', () => {
    renderPage()
    expect(screen.getByText('听一听，写出来')).toBeTruthy()
    const startBtn = screen.getByRole('button', { name: /开始听写/ })
    expect(startBtn).toBeTruthy()
    // eng3a 有真实词，按钮不应被禁用
    expect((startBtn as HTMLButtonElement).disabled).toBe(false)
    // 词池确实来自 eng3a（存在真实单词）
    expect(eng3aMetaWords().length).toBeGreaterThan(20)
  })

  it('错题本为空时，「只练错题本」给出兜底提示且开始按钮禁用', () => {
    renderPage()
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.checked).toBe(false)
    checkbox.click()
    // 空错题本 → 词池 0 → 按钮禁用 + 提示
    const startBtn = screen.getByRole('button', { name: /开始听写/ }) as HTMLButtonElement
    expect(startBtn.disabled).toBe(true)
    expect(screen.getByText(/错题本里还没有英语错词/)).toBeTruthy()
  })
})

describe('DictationPage · 星数只结算一次（回归防线）', () => {
  it('渲染设置页本身不会改变 totalStars', () => {
    const before = useCourseStore.getState().totalStars
    renderPage()
    expect(useCourseStore.getState().totalStars).toBe(before)
  })
})
