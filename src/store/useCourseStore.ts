import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  type SrsCard,
  createNewCard,
  scheduleNext,
  isDue,
  sortDueCards,
  dayStamp,
} from '../data/srs'

export interface WrongWord {
  en: string
  zh: string
  emoji: string
  from: string
}

interface CourseStore {
  // 状态
  masteredWords: string[]
  wrongWords: WrongWord[]
  totalStars: number
  completedPreviews: string[]
  completedQuizzes: string[]
  /** SRS 智能记忆卡片,key 为单词 en */
  srsCards: Record<string, SrsCard>

  // 动作
  markMastered: (en: string) => void
  unmarkMastered: (en: string) => void
  isMastered: (en: string) => boolean
  addWrongWord: (w: WrongWord) => void
  removeWrongWord: (en: string) => void
  clearWrongWords: () => void
  addStars: (n: number) => void
  markPreviewDone: (slug: string) => void
  markQuizDone: (slug: string) => void
  resetAll: () => void

  // SRS 智能复习相关
  /** 确保某词已建卡(预习时调用) */
  seedCard: (en: string) => void
  /** 记录一次复习结果,自动调度下次时间 */
  recordReview: (en: string, correct: boolean) => void
  /** 批量种子化(进单元预习页时调用) */
  seedCards: (ens: string[]) => void
  /** 获取今日到期卡片(已排序),可限制数量 */
  getDueCards: (limit?: number) => SrsCard[]
  /** 今日到期卡片数量 */
  getTodayDueCount: () => number
  /** 明日即将到期的卡片数量(用于结果页提示) */
  getTomorrowDueCount: () => number
  /** 取某词的卡片(无则 undefined) */
  getCard: (en: string) => SrsCard | undefined
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      masteredWords: [],
      wrongWords: [],
      totalStars: 0,
      completedPreviews: [],
      completedQuizzes: [],
      srsCards: {},

      markMastered: (en) =>
        set((s) =>
          s.masteredWords.includes(en)
            ? s
            : { masteredWords: [...s.masteredWords, en] }
        ),

      unmarkMastered: (en) =>
        set((s) => ({
          masteredWords: s.masteredWords.filter((w) => w !== en),
        })),

      isMastered: (en) => get().masteredWords.includes(en),

      addWrongWord: (w) =>
        set((s) =>
          s.wrongWords.some((x) => x.en === w.en)
            ? s
            : { wrongWords: [...s.wrongWords, w] }
        ),

      removeWrongWord: (en) =>
        set((s) => ({
          wrongWords: s.wrongWords.filter((w) => w.en !== en),
        })),

      clearWrongWords: () => set({ wrongWords: [] }),

      addStars: (n) => set((s) => ({ totalStars: s.totalStars + n })),

      markPreviewDone: (slug) =>
        set((s) =>
          s.completedPreviews.includes(slug)
            ? s
            : { completedPreviews: [...s.completedPreviews, slug] }
        ),

      markQuizDone: (slug) =>
        set((s) =>
          s.completedQuizzes.includes(slug)
            ? s
            : { completedQuizzes: [...s.completedQuizzes, slug] }
        ),

      resetAll: () =>
        set({
          masteredWords: [],
          wrongWords: [],
          totalStars: 0,
          completedPreviews: [],
          completedQuizzes: [],
          srsCards: {},
        }),

      // ============ SRS ============
      seedCard: (en) =>
        set((s) => {
          if (s.srsCards[en]) return s
          return {
            srsCards: { ...s.srsCards, [en]: createNewCard(en) },
          }
        }),

      seedCards: (ens) =>
        set((s) => {
          const today = dayStamp()
          let changed = false
          const next = { ...s.srsCards }
          for (const en of ens) {
            if (!next[en]) {
              next[en] = createNewCard(en, today)
              changed = true
            }
          }
          return changed ? { srsCards: next } : s
        }),

      recordReview: (en, correct) =>
        set((s) => {
          const today = dayStamp()
          const existing = s.srsCards[en] ?? createNewCard(en, today)
          const next = scheduleNext(existing, correct, today)
          const updatedCard: SrsCard = { ...existing, ...next, en }
          return {
            srsCards: { ...s.srsCards, [en]: updatedCard },
          }
        }),

      getDueCards: (limit) => {
        const today = dayStamp()
        const all = Object.values(get().srsCards).filter((c) => isDue(c, today))
        const sorted = sortDueCards(all, today)
        return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
      },

      getTodayDueCount: () => {
        const today = dayStamp()
        return Object.values(get().srsCards).filter((c) => isDue(c, today)).length
      },

      getTomorrowDueCount: () => {
        const tomorrow = dayStamp() + 1
        return Object.values(get().srsCards).filter((c) => c.nextReview === tomorrow).length
      },

      getCard: (en) => get().srsCards[en],
    }),
    {
      name: 'starlight-course',
      version: 2,
      // v1 → v2 迁移:把已有的 masteredWords 自动转为 box 3 卡片(7 天后复习)
      migrate: (persistedState: unknown, version: number) => {
        // version 由 zustand 注入,这里仅用于触发迁移逻辑
        void version
        const s = (persistedState ?? {}) as Partial<CourseStore>
        const today = dayStamp()
        // 已有 masteredWords 自动升级为 box 3(掌握级),下次复习为 7 天后
        const mastered: string[] = s.masteredWords ?? []
        const existingCards: Record<string, SrsCard> = s.srsCards ?? {}
        const srsCards: Record<string, SrsCard> = { ...existingCards }
        for (const en of mastered) {
          if (!srsCards[en]) {
            srsCards[en] = {
              en,
              box: 3,
              nextReview: today + 7,
              lastReview: today,
              streak: 3,
              reviews: 3,
            }
          }
        }
        return { ...s, srsCards } as CourseStore
      },
    }
  )
)
