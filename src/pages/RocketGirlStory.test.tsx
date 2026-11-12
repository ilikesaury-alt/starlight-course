// @vitest-environment jsdom
// Rocket Girl 关卡页「并入阅读模块」的集成回归。
//
// 钉死四件事：
//  ① 三个 Tab 都在（通关 / 星数 / 单词卡 / 测验一个都不能丢）；
//  ② 「例句」Tab 渲染的是 ReadingZone（.reading-zone + .reading-sent），
//     点词弹层有中文 —— 这正是家长报的「点词没中文」；
//  ③ 例句分页可用，切页后仍只有一个阅读器；
//  ④ Fly Guy 不传 reading 时仍走原来的例句列表（零回归）。

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RocketGirlStory from './RocketGirlStory'
import FlyGuyStory from './FlyGuyStory'
import { useCourseStore } from '@/store/useCourseStore'
import { rocketGirlStories } from '@/data/rocketgirl'
import { rgStoryPages } from '@/data/rocketgirlReading'

beforeAll(() => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
})

afterEach(cleanup)

const renderStory = (slug: string, page: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[`/rocketgirl/${slug}`]}>
      <Routes>
        <Route path="/rocketgirl/:slug" element={page} />
      </Routes>
    </MemoryRouter>,
  )

// ⚠️ 用 .tab-btn 精确定位：页面里还有 SpeakButton 的 aria-label「听例句」，
// 用 getByRole({name:/例句/}) 会同时命中两个，strict mode 直接炸。
const tab = (name: RegExp) => {
  const btns = Array.from(document.querySelectorAll('.tab-btn')) as HTMLElement[]
  const hit = btns.find((b) => name.test(b.textContent ?? ''))
  if (!hit) throw new Error('找不到 Tab: ' + name)
  return hit
}
const openSentences = () => fireEvent.click(tab(/例句|绘本原文/))

describe('RocketGirlStory · 例句 Tab 复用阅读器', () => {
  it('三个 Tab 都在：单词卡 / 例句 / 闯关', () => {
    renderStory('rg-1', <RocketGirlStory />)
    expect(tab(/单词卡/)).toBeTruthy()
    expect(tab(/例句/)).toBeTruthy()
    expect(tab(/闯关/)).toBeTruthy()
  })

  it('例句 Tab 渲染 ReadingZone，而非旧的逐词 span 列表', () => {
    const { container } = renderStory('rg-1', <RocketGirlStory />)
    openSentences()
    expect(container.querySelector('.reading-zone')).toBeTruthy()
    expect(container.querySelectorAll('.reading-sent').length).toBeGreaterThan(0)
    // 旧的 .sent-card 列表不该再出现
    expect(container.querySelectorAll('.sent-card')).toHaveLength(0)
    // 阅读器自带「听整篇 / 显示中文」工具
    expect(container.querySelector('[data-testid="reading-play-all"]')).toBeTruthy()
    expect(container.querySelector('[data-testid="reading-zh-toggle"]')).toBeTruthy()
  })

  it('点词弹层有中文（家长报的「单词不在字典中」已根治）', () => {
    const { container } = renderStory('rg-1', <RocketGirlStory />)
    openSentences()
    // 找第一个有中文释义的按钮点上去
    const words = Array.from(container.querySelectorAll('.tt-word')) as HTMLElement[]
    const withZh = words.find((w) => w.getAttribute('title')?.includes('点击听发音') === false)
    expect(withZh, '至少有一个词能查到中文').toBeTruthy()
    fireEvent.click(withZh!)
    const pop = container.querySelector('.tt-pop')
    expect(pop).toBeTruthy()
    const zh = pop!.querySelector('.tt-pop-zh')?.textContent ?? ''
    expect(zh).toBeTruthy()
    expect(zh).not.toContain('词典里还没这个词')
  })

  it('例句按 ≤10 句分页，翻页后仍只有一个阅读器', () => {
    const { container } = renderStory('rg-1', <RocketGirlStory />)
    openSentences()
    const firstPage = rgStoryPages(rocketGirlStories[0])[0]
    const expected = firstPage.paragraphs.flat().length
    expect(container.querySelectorAll('.reading-sent')).toHaveLength(expected)
    expect(expected).toBeLessThanOrEqual(10)

    const next = screen.queryByRole('button', { name: /下一页/ })
    if (next && !(next as HTMLButtonElement).disabled) {
      fireEvent.click(next)
      expect(container.querySelectorAll('.reading-zone')).toHaveLength(1)
      expect(screen.getByText(/第 2 \/ \d+ 页/)).toBeTruthy()
    }
  })

  it('切到「显示中文」后译文出现，且阅读器不卸载（引用稳定）', () => {
    const { container } = renderStory('rg-1', <RocketGirlStory />)
    openSentences()
    const toggle = container.querySelector('[data-testid="reading-zh-toggle"]') as HTMLElement
    fireEvent.click(toggle)
    expect(container.querySelector('.reading-zone.is-zh')).toBeTruthy()
    expect(container.querySelectorAll('.reading-zh').length).toBeGreaterThan(0)
  })

  it('切回单词卡后阅读器卸载（不在别的 Tab 里继续念）', () => {
    const { container } = renderStory('rg-1', <RocketGirlStory />)
    openSentences()
    expect(container.querySelector('.reading-zone')).toBeTruthy()
    fireEvent.click(tab(/单词卡/))
    expect(container.querySelector('.reading-zone')).toBeNull()
  })

  it('通关按钮仍在：本关完成标记没被改造弄丢', () => {
    renderStory('rg-1', <RocketGirlStory />)
    expect(screen.getByRole('button', { name: /标记本关完成/ })).toBeTruthy()
  })
})

describe('并入边界：Fly Guy 零回归', () => {
  it('Fly Guy 仍走原来的例句列表（不出现 ReadingZone）', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/flyguy/fg-1']}>
        <Routes>
          <Route path="/flyguy/:slug" element={<FlyGuyStory />} />
        </Routes>
      </MemoryRouter>,
    )
    // Fly Guy 第一本有 bookText → 切到「绘本原文」后走 BookTextView
    const tabBtn = Array.from(container.querySelectorAll('.tab-btn')).find((b) =>
      /绘本原文|例句/.test(b.textContent ?? ''),
    ) as HTMLElement
    fireEvent.click(tabBtn)
    expect(container.querySelector('.book-original')).toBeTruthy()
    expect(container.querySelector('.reading-zone')).toBeNull()
  })
})
