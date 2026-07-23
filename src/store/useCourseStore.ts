import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      masteredWords: [],
      wrongWords: [],
      totalStars: 0,
      completedPreviews: [],
      completedQuizzes: [],

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
        }),
    }),
    {
      name: 'starlight-course',
      version: 1,
    }
  )
)
