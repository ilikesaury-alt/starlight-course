// 统一测验结算编排（学习会话契约的「评」层）：
//   加星   —— 全模块一套星规 quizStars(全对5/≥80% 3/参与1)
//   错题   —— 错词全量入错题本,释义优先取词表、缺失时逐词词典兜底
//   SRS    —— 作答即播种 + recordReview,同词去重避免盒子抖动
// 各页面差异（完成判定等）通过 settle 的 after 回调注入,不在页面里重复编排。

import { useRef } from 'react'
import { useCourseStore } from '@/store/useCourseStore'
import { quizStars } from '@/utils/stars'
import { lookupZh, wordBase } from '@/utils/bookDict'
import type { ModuleId } from '@/data/modules'

/** 可用于错题释义查找的词条（各模块词表的公共子集） */
export interface WrongWordSource {
  en: string
  zh?: string
  emoji?: string
}

interface SettleQuizOptions {
  module: ModuleId
  /** 错题来源标注，如「Module 1 · Lesson 2」或故事标题 */
  from: string
  /** 错词无自带 emoji 时的兜底图标 */
  fallbackEmoji?: string
}

export function useSettleQuiz({ module, from, fallbackEmoji = '📖' }: SettleQuizOptions) {
  const addStars = useCourseStore((s) => s.addStars)
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const recordReview = useCourseStore((s) => s.recordReview)
  const seedCards = useCourseStore((s) => s.seedCards)
  // 一场测验内已结算过 SRS 的词集合:同一词被多题重复考时只结算一次,
  // 避免 recordReview 来回升/降盒导致 SRS 调度失真
  const reviewedRef = useRef<Set<string>>(new Set())

  /** 每次作答时调用：播种 + 记录 SRS（同词去重） */
  const recordPick = (en: string, correct: boolean) => {
    seedCards([en], module)
    if (reviewedRef.current.has(en)) return
    reviewedRef.current.add(en)
    recordReview(en, correct, module)
  }

  /** 点「再做一次」时重置去重范围 */
  const restart = () => {
    reviewedRef.current = new Set()
  }

  /**
   * 测验结束统一结算：
   * @param words 本课/本故事的词表,用于错题释义与 emoji 的优先来源
   * @param after 页面专属副作用（如 markLessonDone / markStoryDone）
   */
  const settle = (
    correct: number,
    total: number,
    wrongEns: string[],
    words: WrongWordSource[] = [],
    after?: () => void,
  ) => {
    addStars(quizStars(correct, total))
    wrongEns.forEach((raw) => {
      const w = words.find((x) => x.en.toLowerCase() === raw.toLowerCase())
      addWrongWord({
        en: w?.en ?? raw,
        // 词表里没有的课文词,用逐词词典兜底,避免错题本出现无释义裸词
        zh: w?.zh ?? lookupZh(wordBase(raw)) ?? '',
        emoji: w?.emoji ?? fallbackEmoji,
        from,
        module,
      })
    })
    after?.()
    // 结算后清空去重范围,下一轮测验重新计数
    reviewedRef.current = new Set()
  }

  return { recordPick, restart, settle }
}
