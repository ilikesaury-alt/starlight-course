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
import type { ModuleId } from '../data/modules'

export interface WrongWord {
  en: string
  zh: string
  emoji: string
  from: string
  /** 所属模块，用于错题本按模块分组/筛选 */
  module: ModuleId
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
  addWrongWord: (w: WrongWord) => void
  removeWrongWord: (en: string, module?: ModuleId) => void
  clearWrongWords: () => void
  addStars: (n: number) => void
  markPreviewDone: (slug: string) => void
  markQuizDone: (slug: string) => void
  resetAll: () => void

  // SRS 智能复习相关
  /** 确保某词已建卡(预习时调用)，并归入所属模块 */
  seedCard: (en: string, module: ModuleId) => void
  /** 记录一次复习结果,自动调度下次时间；可补登记所属模块 */
  recordReview: (en: string, correct: boolean, module?: ModuleId) => void
  /** 批量种子化(进单元/故事预习页时调用)，并归入所属模块 */
  seedCards: (ens: string[], module: ModuleId) => void
  /** 获取今日到期卡片(已排序),可限制数量；module 非空时只取该模块的卡 */
  getDueCards: (limit?: number, module?: ModuleId) => SrsCard[]
  /** 今日到期卡片数量；module 非空时只计该模块 */
  getTodayDueCount: (module?: ModuleId) => number
  /** 明日即将到期的卡片数量(用于结果页提示) */
  getTomorrowDueCount: () => number
  /** 取错题本；module 非空时只取该模块 */
  getWrongWords: (module?: ModuleId) => WrongWord[]
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

      addWrongWord: (w) =>
        set((s) =>
          s.wrongWords.some((x) => x.en === w.en && x.module === w.module)
            ? s
            : { wrongWords: [...s.wrongWords, w] }
        ),

      removeWrongWord: (en, module) =>
        set((s) => ({
          wrongWords: s.wrongWords.filter(
            (w) => !(w.en === en && (module === undefined || w.module === module))
          ),
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
      seedCard: (en, module) =>
        set((s) => {
          const existing = s.srsCards[en]
          if (existing) {
            if (existing.modules.includes(module)) return s
            return {
              srsCards: {
                ...s.srsCards,
                [en]: { ...existing, modules: [...existing.modules, module] },
              },
            }
          }
          return {
            srsCards: { ...s.srsCards, [en]: createNewCard(en, module) },
          }
        }),

      seedCards: (ens, module) =>
        set((s) => {
          const today = dayStamp()
          let changed = false
          const next = { ...s.srsCards }
          for (const en of ens) {
            const existing = next[en]
            if (existing) {
              if (!existing.modules.includes(module)) {
                next[en] = { ...existing, modules: [...existing.modules, module] }
                changed = true
              }
            } else {
              next[en] = createNewCard(en, module, today)
              changed = true
            }
          }
          return changed ? { srsCards: next } : s
        }),

      recordReview: (en, correct, module) =>
        set((s) => {
          const today = dayStamp()
          const existing = s.srsCards[en] ?? createNewCard(en, module ?? 'starlight', today)
          const next = scheduleNext(existing, correct, today)
          const modules = [...(existing.modules ?? [])]
          if (module && !modules.includes(module)) modules.push(module)
          const updatedCard: SrsCard = { ...existing, ...next, en, modules }
          return {
            srsCards: { ...s.srsCards, [en]: updatedCard },
          }
        }),

      getDueCards: (limit, module) => {
        const today = dayStamp()
        let all = Object.values(get().srsCards).filter((c) => isDue(c, today))
        if (module) all = all.filter((c) => c.modules.includes(module))
        const sorted = sortDueCards(all, today)
        return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
      },

      getTodayDueCount: (module) => {
        const today = dayStamp()
        let all = Object.values(get().srsCards)
        if (module) all = all.filter((c) => c.modules.includes(module))
        return all.filter((c) => isDue(c, today)).length
      },

      getTomorrowDueCount: () => {
        const tomorrow = dayStamp() + 1
        return Object.values(get().srsCards).filter((c) => c.nextReview === tomorrow).length
      },

      getWrongWords: (module) => {
        const all = get().wrongWords
        return module ? all.filter((w) => w.module === module) : all
      },
    }),
    {
      name: 'starlight-course',
      version: 3,
      // 迁移：补上模块维度字段
      migrate: (persistedState: unknown, version: number) => {
        // version 由 zustand 注入,这里仅用于触发迁移逻辑
        void version
        const s = (persistedState ?? {}) as Partial<CourseStore>
        const today = dayStamp()
        // 已有 masteredWords 自动升级为 box 3(掌握级),下次复习为 7 天后
        const mastered: string[] = s.masteredWords ?? []
        const existingCards: Record<string, any> = (s.srsCards ?? {}) as Record<string, any>
        const srsCards: Record<string, any> = { ...existingCards }
        for (const en of mastered) {
          if (!srsCards[en]) {
            srsCards[en] = {
              en,
              box: 3,
              nextReview: today + 7,
              lastReview: today,
              streak: 3,
              reviews: 3,
              modules: ['starlight'],
            }
          }
        }
        // 旧卡片缺 modules 字段时,默认归入 starlight
        for (const en of Object.keys(srsCards)) {
          const c = srsCards[en]
          if (!Array.isArray(c.modules) || c.modules.length === 0) {
            srsCards[en] = { ...c, modules: ['starlight'] }
          }
        }
        // 旧错题缺 module 字段时,默认归入 starlight
        const wrongWords: WrongWord[] = (s.wrongWords ?? []).map((w) =>
          'module' in w ? (w as WrongWord) : { ...(w as WrongWord), module: 'starlight' as ModuleId }
        )
        return { ...s, srsCards, wrongWords } as CourseStore
      },
    }
  )
)
