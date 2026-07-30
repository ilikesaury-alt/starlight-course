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
import { MODULE_LIST, type ModuleId } from '../data/modules'

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
  /** 故事类模块(Fly Guy / Rocket Girl)的通关记录,与 completedPreviews(Starlight 单元预习)语义分离 */
  completedStories: string[]
  /** SRS 智能记忆卡片,key 为单词 en */
  srsCards: Record<string, SrsCard>

  // 中文课程(三年级上册语文)进度——独立于英语 SRS,仅做打卡/自测记录
  /** 背诵打卡:lesson slug -> 已打卡日期戳(dayStamp 整数)列表 */
  reciteCheckins: Record<string, number[]>
  /** 自测成绩:lesson slug -> 最近一次 { score, total, date(dayStamp) } */
  chineseQuiz: Record<string, { score: number; total: number; date: number }>

  // 三年级上册英语（外研版）进度——独立于英语 SRS,仅做跟读打卡/自测记录
  /** 跟读打卡:lesson slug -> 已打卡日期戳(dayStamp 整数)列表 */
  eng3aRecite: Record<string, number[]>
  /** 自测成绩:lesson slug -> 最近一次 { score, total, date(dayStamp) } */
  eng3aQuiz: Record<string, { score: number; total: number; date: number }>

  // 动作
  markMastered: (en: string) => void
  unmarkMastered: (en: string) => void
  addWrongWord: (w: WrongWord) => void
  removeWrongWord: (en: string, module?: ModuleId) => void
  clearWrongWords: () => void
  addStars: (n: number) => void
  markPreviewDone: (slug: string) => void
  markQuizDone: (slug: string) => void
  /** 标记故事类模块某故事已通关(与 markPreviewDone 区分语义) */
  markStoryDone: (slug: string) => void
  /** 中文课背诵打卡:记录今天已背该课(同一天重复点击不重复计数) */
  markRecite: (slug: string) => void
  /** 中文课自测:记录最近一次成绩 */
  markChineseQuiz: (slug: string, score: number, total: number) => void
  /** 三年级英语跟读打卡:记录今天已读该课(同一天重复点击不重复计数) */
  markEng3aRecite: (slug: string) => void
  /** 三年级英语自测:记录最近一次成绩 */
  markEng3aQuiz: (slug: string, score: number, total: number) => void
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
      completedStories: [],
      srsCards: {},
      reciteCheckins: {},
      chineseQuiz: {},
      eng3aRecite: {},
      eng3aQuiz: {},

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

      markStoryDone: (slug) =>
        set((s) =>
          s.completedStories.includes(slug)
            ? s
            : { completedStories: [...s.completedStories, slug] }
        ),

      markRecite: (slug) =>
        set((s) => {
          const today = dayStamp()
          const prev = s.reciteCheckins[slug] ?? []
          if (prev.includes(today)) return s
          return { reciteCheckins: { ...s.reciteCheckins, [slug]: [...prev, today] } }
        }),

      markChineseQuiz: (slug, score, total) =>
        set((s) => ({
          chineseQuiz: {
            ...s.chineseQuiz,
            [slug]: { score, total, date: dayStamp() },
          },
        })),

      markEng3aRecite: (slug) =>
        set((s) => {
          const today = dayStamp()
          const prev = s.eng3aRecite[slug] ?? []
          if (prev.includes(today)) return s
          return { eng3aRecite: { ...s.eng3aRecite, [slug]: [...prev, today] } }
        }),

      markEng3aQuiz: (slug, score, total) =>
        set((s) => ({
          eng3aQuiz: {
            ...s.eng3aQuiz,
            [slug]: { score, total, date: dayStamp() },
          },
        })),

      resetAll: () =>
        set({
          masteredWords: [],
          wrongWords: [],
          totalStars: 0,
          completedPreviews: [],
          completedQuizzes: [],
          completedStories: [],
          srsCards: {},
          reciteCheckins: {},
          chineseQuiz: {},
          eng3aRecite: {},
          eng3aQuiz: {},
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
      version: 4,
      // 只持久化数据字段,避免函数/瞬态状态被写入 localStorage
      partialize: (state) => ({
        masteredWords: state.masteredWords,
        wrongWords: state.wrongWords,
        totalStars: state.totalStars,
        completedPreviews: state.completedPreviews,
        completedQuizzes: state.completedQuizzes,
        completedStories: state.completedStories,
        srsCards: state.srsCards,
        reciteCheckins: state.reciteCheckins,
        chineseQuiz: state.chineseQuiz,
        eng3aRecite: state.eng3aRecite,
        eng3aQuiz: state.eng3aQuiz,
      }),
      // 迁移：补上模块维度字段 + 拆分 completedPreviews 语义
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
        // 语义拆分:旧 completedPreviews 混入了故事 slug,按"是否 Starlight 单元 slug"
        // 二分回 单元预习 / 故事通关,历史数据不丢失。
        const starlightUnitIds =
          MODULE_LIST.find((m) => m.id === 'starlight')?.items.map((it) => it.id) ?? []
        const rawPreviews: string[] = Array.isArray(s.completedPreviews) ? s.completedPreviews : []
        const completedPreviews = rawPreviews.filter((slug) => starlightUnitIds.includes(slug))
        const completedStories = rawPreviews.filter((slug) => !starlightUnitIds.includes(slug))
        return {
          ...s,
          srsCards,
          wrongWords,
          completedPreviews,
          completedStories,
        } as CourseStore
      },
    }
  )
)
