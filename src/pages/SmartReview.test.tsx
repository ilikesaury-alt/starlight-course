// @vitest-environment jsdom
// SmartReview 句子框架卡分支的回归测试。
//
// 这个分支此前完全没有覆盖：句子卡即使被播种进池子，复习页也渲染不出来，
// 等于 T3.5「写了但到不了」。这里钉住两件事：
//   ① 句子卡确实能出现在队列并渲染成「说出整句」卡片
//   ② 单词卡的渲染路径不受影响（frameCard 分支不能吃掉普通卡）

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SmartReview from './SmartReview'
import { useCourseStore } from '@/store/useCourseStore'
import { STARLIGHT_FRAMES, frameCardKey } from '@/data/sentenceFrame'

beforeAll(() => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

beforeEach(() => {
  localStorage.clear()
  useCourseStore.getState().resetAll()
})

afterEach(cleanup)

/** 只播种一张句子卡 + 一个单词卡，让句子卡「有资格」进队列 */
function seedSentenceCardOnly() {
  const s = useCourseStore.getState()
  s.seedSentenceFrames([STARLIGHT_FRAMES[0]], 'starlight')
  s.seedCards(['doll'], 'starlight')
}

const renderReview = () =>
  render(
    <MemoryRouter>
      <SmartReview />
    </MemoryRouter>
  )

describe('SmartReview 句子框架卡分支', () => {
  it('队列里有句子卡时不显示空状态，进入复习会话', async () => {
    seedSentenceCardOnly()
    renderReview()
    // metaReady 之前是加载态，之后要么空状态要么复习会话
    await waitFor(
      () => expect(screen.queryByText('正在准备复习内容…')).toBeNull(),
      { timeout: 15000 }
    )
    expect(screen.queryByText('今天没有需要复习的单词')).toBeNull()
    expect(screen.getByText(/第 1 \/ \d+ 张/)).toBeTruthy()
  }, 20000)

  it('句子卡渲染成「说出整句」卡片（含中文提示与跟读器）', async () => {
    seedSentenceCardOnly()
    renderReview()
    await waitFor(
      () => expect(screen.queryByText('正在准备复习内容…')).toBeNull(),
      { timeout: 15000 }
    )

    const frame = STARLIGHT_FRAMES[0]
    // 句型骨架：空位显示为（ ），而不是直接泄露答案
    expect(screen.getByText('📍 句型框架 · 说出整句')).toBeTruthy()
    expect(screen.getByText(`💡 ${frame.zh}`)).toBeTruthy()
    // 跟读器已挂载（原句为填好答案后的完整句）
    const answer = frame.blanks[0].options[frame.blanks[0].answer]
    expect(document.querySelector('.sr-sentence')?.textContent).toContain(answer)
  }, 20000)

  it('句子卡不展示单词卡的「翻面回忆」交互', async () => {
    seedSentenceCardOnly()
    renderReview()
    await waitFor(
      () => expect(screen.queryByText('正在准备复习内容…')).toBeNull(),
      { timeout: 15000 }
    )
    // frameCard 分支下不该出现单词卡的翻面按钮
    expect(screen.queryByRole('button', { name: /想想.*然后翻面/ })).toBeNull()
  }, 20000)

  it('回归：句型卡上「记得/忘了」始终可点（否则无麦孩子会卡死）', async () => {
    // 句型卡没有「翻面」环节，若按钮沿用 revealed 门控就永远 disabled，
    // 孩子既说不出、也点不了记得/忘了，流程彻底卡住。
    seedSentenceCardOnly()
    renderReview()
    await waitFor(
      () => expect(screen.queryByText('正在准备复习内容…')).toBeNull(),
      { timeout: 15000 }
    )
    await waitFor(() => expect(screen.getByText(/句型框架 · 说出整句/)).toBeTruthy(), {
      timeout: 15000,
    })
    expect(screen.queryByRole('button', { name: /翻面/ })).toBeNull()
    expect(screen.getByRole('button', { name: /记得/ }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: /忘了/ }).hasAttribute('disabled')).toBe(false)
  }, 20000)

  it('单词卡仍走原有的「翻面 → 记得/忘了」流程（回归保护）', async () => {
    // 只播种单词卡，不播种句子卡
    useCourseStore.getState().seedCards(['doll'], 'starlight')
    renderReview()
    await waitFor(
      () => expect(screen.queryByText('正在准备复习内容…')).toBeNull(),
      { timeout: 15000 }
    )
    expect(screen.getByRole('button', { name: /翻面/ })).toBeTruthy()
    // 作答按钮在翻面前禁用
    expect(screen.getByRole('button', { name: /记得/ }).hasAttribute('disabled')).toBe(true)
  }, 20000)

  it('句子卡 key 与单词卡不冲突（frame: 前缀）', () => {
    const key = frameCardKey(STARLIGHT_FRAMES[0])
    expect(key.startsWith('frame:')).toBe(true)
    expect(useCourseStore.getState().srsCards[key]).toBeUndefined()
    seedSentenceCardOnly()
    const cards = useCourseStore.getState().srsCards
    expect(cards[key].kind).toBe('sentence')
    expect(cards.doll.kind).toBeUndefined()
  })
})
