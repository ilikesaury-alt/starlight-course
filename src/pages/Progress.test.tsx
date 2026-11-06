// @vitest-environment jsdom
// /progress 页面级回归：两册进度必须各显示一行、各算各的分母。
//
// 纯数据层已在 starlightProgress.test.ts 钉死；这里钉的是「页面真的把两行
// 渲染出来、链接指到各自的目录页、进度条不溢出」——数据对了但页面仍写死
// 一行的话，孩子看到的还是错的。
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Progress from './Progress'
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
      <Progress />
    </MemoryRouter>
  )

function rows() {
  return Array.from(document.querySelectorAll('.module-progress-row'))
}

function rowByName(name: string) {
  return rows().find((r) => r.querySelector('.mp-name')?.textContent?.includes(name))
}

describe('/progress · 两册分开统计', () => {
  it('各模块进度里有预备级与第一册两行，且各指各的目录页', () => {
    renderPage()
    expect(rows()).toHaveLength(6) // 2 册 Starlight + 语文 + 英语 + Fly Guy + Rocket Girl

    const starter = rowByName('预备级')
    const book1 = rowByName('第一册')
    expect(starter).toBeTruthy()
    expect(book1).toBeTruthy()
    expect(starter!.getAttribute('href')).toContain('/starlight')
    expect(starter!.getAttribute('href')).not.toContain('/starlight1')
    expect(book1!.getAttribute('href')).toContain('/starlight1')
  })

  it('空数据时两册都是 0/96', () => {
    renderPage()
    expect(rowByName('预备级')!.querySelector('.mp-status')?.textContent).toContain('0/96')
    expect(rowByName('第一册')!.querySelector('.mp-status')?.textContent).toContain('0/96')
  })

  it('回归：只学第一册的课，预备级仍显示 0/96，第一册显示 3/96', () => {
    useCourseStore.setState({
      lessonCompleted: { 'monty-the-artist': [1, 2, 3] },
      completedQuizzes: ['monty-the-artist'],
    })
    renderPage()

    const starter = rowByName('预备级')!
    const book1 = rowByName('第一册')!
    expect(starter.querySelector('.mp-status')?.textContent).toContain('0/96')
    expect(starter.querySelector('.mp-status')?.textContent).not.toContain('已闯关')
    expect(book1.querySelector('.mp-status')?.textContent).toContain('3/96')
    expect(book1.querySelector('.mp-status')?.textContent).toContain('已闯关 1 关')
  })

  it('两册都学时，各自只统计自己的课，进度条都不溢出 100%', () => {
    useCourseStore.setState({
      lessonCompleted: {
        hello: [1, 2, 3],
        'monty-the-artist': [1, 2, 3, 4],
        'lola-the-doctor': [1],
      },
      completedQuizzes: ['hello', 'monty-the-artist'],
    })
    renderPage()

    const starter = rowByName('预备级')!
    const book1 = rowByName('第一册')!
    expect(starter.querySelector('.mp-status')?.textContent).toContain('3/96')
    expect(book1.querySelector('.mp-status')?.textContent).toContain('5/96')
    for (const r of [starter, book1]) {
      const width = (r.querySelector('.mp-bar-fill') as HTMLElement).style.width
      expect(parseFloat(width)).toBeLessThanOrEqual(100)
    }
  })

  it('旧数据里认不出的野 slug 不虚增任何一册', () => {
    useCourseStore.setState({
      lessonCompleted: { 'legacy-unit': [1, 2, 3, 4, 5], hello: [1] },
    })
    renderPage()
    expect(rowByName('预备级')!.querySelector('.mp-status')?.textContent).toContain('1/96')
    expect(rowByName('第一册')!.querySelector('.mp-status')?.textContent).toContain('0/96')
  })
})
