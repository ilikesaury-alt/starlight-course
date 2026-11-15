import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  type SrsCard,
  createNewCard,
  scheduleNext,
  isDue,
  dueOf,
  sortDueCards,
  dayStamp,
} from '../data/srs'
import { MODULE_LIST, type ModuleId } from '../data/modules'
import { modules as starlightModules, type Word } from '../data/starlight'
import type { SentenceFrame } from '../data/sentenceFrame'
import { frameCardKey } from '../data/sentenceFrame'
import { migrateFromLeitner } from '../data/fsrsScheduler'
import { EXT_LIMIT, type ExtWord } from '../data/extensionTopics'

// Starlight 预备级:单元 slug -> 全部课 id。仅用于迁移旧数据(那时只有预备级的完成记录)。
//
// ⚠️ store 不再自己去查教材数据:两册教材加起来近 1MB 源码,而 store 被几乎每个页面
// 引用 —— 在 store 里 import 课程数据等于把课程数据塞进首屏 chunk(实测 +125KB gzip)。
// 运行时需要的课表由页面传进来(见 markPreviewDone / markLessonDone 的参数)。
const lessonsOf = (unitId: string) => starlightModules.find((m) => m.slug === unitId)?.lessons ?? []

/** 拓展词属于哪一册:预备级的 lessonKey 形如 `${单元}-${课}`,第一册形如 `s1-${单元}-${课}`。 */
const moduleOfLessonKey = (lessonKey: string): ModuleId =>
  lessonKey.startsWith('s1-') ? 'starlight1' : 'starlight'

export interface WrongWord {
  en: string
  zh: string
  emoji: string
  from: string
  /** 所属模块，用于错题本按模块分组/筛选 */
  module: ModuleId
}

/**
 * 孩子档案（学习主体）。
 *
 * 为什么需要：应用此前是「一台电脑一份进度」，没有「这是谁在学」的概念 ——
 * 家长的设置、孩子的成绩混在同一视图里，也没法做成长报告。
 *
 * 本阶段只支持**单档案**，但结构上留好位置：
 * - `id` 是稳定标识，将来多档位时按它隔离数据，不必再改数据结构；
 * - **不要**把它做成可选/可空 —— 空档案会让每个页面都要写 `profile?.name` 判断。
 *   用「`name` 为空串 = 还没设置昵称」表达未初始化状态。
 */
export interface Profile {
  /** 稳定 id：当前只有 'main'，预留多档位 */
  id: string
  /** 昵称。空串 = 还没设置（首启引导会请孩子填） */
  name: string
  /** 头像 emoji（不用图片文件：零资源、任意缩放不糊、孩子自己挑一个） */
  avatar: string
  /** 建立档案的日期戳（dayStamp），将来算「学龄」用 */
  createdAt: number
}

/** 未设置昵称时的默认档案 */
export function defaultProfile(): Profile {
  return { id: 'main', name: '', avatar: '🐣', createdAt: dayStamp() }
}

/**
 * 把任意来源的档案补齐成完整形状（逐字段兜底，保留有效值）。
 *
 * 为什么不能只靠 persist 的 `migrate`：**migrate 只在版本号变化时才跑**。
 * 所以「同版本但字段残缺」的数据（手改过的 localStorage、被别的构建写过一半、
 * 或将来某个新增字段在旧同版本数据里不存在）永远等不到迁移。这里提供一个
 * 幂等的规范化入口，由 rehydrate 后无条件调用一次（见 normalizeState）。
 */
export function normalizeProfile(raw: unknown): Profile {
  const p = (raw ?? {}) as Partial<Profile>
  return {
    id: typeof p.id === 'string' && p.id ? p.id : 'main',
    // ⚠️ 不能填假名字：空串才是「还没设置」的唯一表示
    name: typeof p.name === 'string' ? p.name.slice(0, 12) : '',
    avatar:
      typeof p.avatar === 'string' && PROFILE_AVATARS.includes(p.avatar)
        ? p.avatar
        : defaultProfile().avatar,
    createdAt: typeof p.createdAt === 'number' ? p.createdAt : dayStamp(),
  }
}

/** 可选头像：够挑、不至于挑花眼 */
export const PROFILE_AVATARS = ['🐣', '🐱', '🐶', '🐼', '🦊', '🐰', '🐨', '🦁', '🐯', '🐸', '🦄', '🚀']

interface CourseStore {
  // 状态
  /** 孩子档案。永不为空 —— 未设置昵称时 name 为空串（见 defaultProfile） */
  profile: Profile
  wrongWords: WrongWord[]
  totalStars: number
  completedPreviews: string[]
  completedQuizzes: string[]
  /** Starlight 主课课级完成记录:unit slug -> 已完成 lesson id 列表。
   *  单元级 completedPreviews 由它派生(全部课时完成即单元完成),展示粒度更细。 */
  lessonCompleted: Record<string, number[]>
  /** 故事类模块(Fly Guy / Rocket Girl)的通关记录,与 completedPreviews(Starlight 单元预习)语义分离 */
  completedStories: string[]
  /** SRS 智能记忆卡片,key 为单词 en */
  srsCards: Record<string, SrsCard>
  /** E 课堂拓展词:lessonKey(`${unitId}-${lessonId}`) -> 该课现场录入的拓展词。
   *  与教材 lessons.ts 解耦(FR-C0.4):教材数据保持只读,拓展词只存本地。
   *  每课上限 EXT_LIMIT(5) 个;自动填充写入的词带 auto 标记,换一批时整体替换。 */
  starlightExtensions: Record<string, ExtWord[]>
  /** 自动填充轮次:lessonKey -> 第几轮(0/缺省 = 从未自动填充)。
   *  同时充当「已自动填充过」的标记 —— 用户删空后不会被反复自动填回;
   *  换一批时 +1,用于轮换候选词窗口。 */
  extensionRound: Record<string, number>

  // 中文课程(三年级上册语文)进度——独立于英语 SRS,仅做打卡/自测记录
  // 打卡记录设计取舍:不做历史裁剪。按每天多次打卡估算每年仅增长约 10KB(localStorage 预算内),
  // 而裁剪会破坏「累计打卡次数」与「连续打卡天数」的统计口径,得不偿失。
  /** 背诵打卡:lesson slug -> 已打卡日期戳(dayStamp 整数)列表 */
  reciteCheckins: Record<string, number[]>
  /** 自测成绩:lesson slug -> 最近一次 { score, total, date(dayStamp) } */
  chineseQuiz: Record<string, { score: number; total: number; date: number }>

  // 三年级上册英语（外研版）进度——独立于英语 SRS,仅做跟读打卡/自测记录
  /** 跟读打卡:lesson slug -> 已打卡日期戳(dayStamp 整数)列表 */
  eng3aRecite: Record<string, number[]>
  /** 自测成绩:lesson slug -> 最近一次 { score, total, date(dayStamp) } */
  eng3aQuiz: Record<string, { score: number; total: number; date: number }>

  // 课级「学完」记录(与打卡/成绩解耦):自测 ≥80% 自动点亮,或手动标记。
  // 与 Starlight 的 lessonCompleted 对齐,让全部模块共享同一套完成语义。
  /** 语文已完成课 slug 列表 */
  completedChinese: string[]
  /** 英语3A 已完成课 slug 列表 */
  completedEng3a: string[]

  // 动作
  addWrongWord: (w: WrongWord) => void
  removeWrongWord: (en: string, module?: ModuleId) => void
  clearWrongWords: () => void
  addStars: (n: number) => void
  markPreviewDone: (slug: string, lessonIds?: number[]) => void
  /** 标记 Starlight 某课的课级完成(闯关全对自动触发 / 手动按钮触发)。
   *  该单元全部课时完成时自动同步单元级完成标记。
   *  totalLessons:该单元总课数,由页面传入(页面已经拿到了课表),用于判断是否已学完。 */
  markLessonDone: (unitId: string, lessonId: number, totalLessons?: number) => void
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
  /** 标记语文某课已学完(自测 ≥80% 自动触发 / 手动按钮触发) */
  markChineseDone: (slug: string) => void
  /** 标记英语3A 某课已学完(自测 ≥80% 自动触发 / 手动按钮触发) */
  markEng3aDone: (slug: string) => void
  /** 更新孩子档案（昵称 / 头像）。只合并传入的字段，不清空其它。 */
  updateProfile: (patch: Partial<Omit<Profile, 'id' | 'createdAt'>>) => void
  /** 清空学习数据。**保留档案** —— 档案不是学习数据，重置进度不该把孩子名字也抹了。 */
  resetAll: () => void

  // SRS 智能复习相关
  /** 确保某词已建卡(预习时调用)，并归入所属模块 */
  seedCard: (en: string, module: ModuleId) => void
  /** 记录一次复习结果,自动调度下次时间；可补登记所属模块 */
  recordReview: (en: string, correct: boolean, module?: ModuleId) => void
  /** 批量种子化(进单元/故事预习页时调用)，并归入所属模块 */
  seedCards: (ens: string[], module: ModuleId) => void
  /** 录入一个拓展词:自动播种进复习池。返回 false 表示校验失败(空 en / 本课重复) */
  addExtensionWord: (lessonKey: string, w: Word) => boolean
  /** 删除拓展词:同时把该词的拓展来源卡片移出复习池 */
  removeExtensionWord: (lessonKey: string, en: string) => void
  /** 自动填充 / 换一批:先移除本课 auto 标记的词,再写入 candidates(截断到 EXT_LIMIT),
   *  并记录本轮次。返回实际写入条数(0 = 候选为空或都已存在)。 */
  fillExtensionWords: (lessonKey: string, candidates: Word[], round: number) => number
  /** 播种句子框架卡(kind='sentence',en=frame:<hash>),与单词卡共享复习池但键空间隔离 */
  seedSentenceFrames: (frames: SentenceFrame[], module: ModuleId) => void
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
      profile: defaultProfile(),
      wrongWords: [],
      totalStars: 0,
      completedPreviews: [],
      completedQuizzes: [],
      lessonCompleted: {},
      completedStories: [],
      srsCards: {},
      starlightExtensions: {},
      extensionRound: {},
      reciteCheckins: {},
      chineseQuiz: {},
      eng3aRecite: {},
      eng3aQuiz: {},
      completedChinese: [],
      completedEng3a: [],

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

      markPreviewDone: (slug, lessonIds) =>
        set((s) => {
          // 手动标记单元完成时,同步把该单元全部课时标为课级完成,两种粒度保持一致
          const lessons = lessonIds ?? lessonsOf(slug).map((l) => l.id)
          const completedPreviews = s.completedPreviews.includes(slug)
            ? s.completedPreviews
            : [...s.completedPreviews, slug]
          if (lessons.length === 0) return { completedPreviews }
          const prev = s.lessonCompleted[slug] ?? []
          const merged = [...prev]
          let changed = false
          for (const id of lessons) {
            if (!merged.includes(id)) {
              merged.push(id)
              changed = true
            }
          }
          return changed
            ? { completedPreviews, lessonCompleted: { ...s.lessonCompleted, [slug]: merged } }
            : { completedPreviews }
        }),

      markLessonDone: (unitId, lessonId, totalLessons) =>
        set((s) => {
          const prev = s.lessonCompleted[unitId] ?? []
          if (prev.includes(lessonId)) return s
          const next = { ...s.lessonCompleted, [unitId]: [...prev, lessonId] }
          // 全部课时完成后自动同步单元级完成标记(保持 completedPreviews 语义不变)
          const total = totalLessons ?? lessonsOf(unitId).length
          const allDone = total > 0 && next[unitId].length >= total
          const completedPreviews =
            allDone && !s.completedPreviews.includes(unitId)
              ? [...s.completedPreviews, unitId]
              : s.completedPreviews
          return { lessonCompleted: next, completedPreviews }
        }),

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

      markChineseDone: (slug) =>
        set((s) =>
          s.completedChinese.includes(slug)
            ? s
            : { completedChinese: [...s.completedChinese, slug] }
        ),

      markEng3aDone: (slug) =>
        set((s) =>
          s.completedEng3a.includes(slug)
            ? s
            : { completedEng3a: [...s.completedEng3a, slug] }
        ),

      updateProfile: (patch) =>
        set((s) => ({
          // id / createdAt 不允许被外部改动（不在 patch 的类型里），
          // name 去首尾空白并截断 —— 昵称不该是一串空格或 200 字
          profile: {
            ...s.profile,
            ...patch,
            name: patch.name !== undefined ? patch.name.trim().slice(0, 12) : s.profile.name,
            avatar: patch.avatar !== undefined ? patch.avatar : s.profile.avatar,
          },
        })),

      resetAll: () =>
        set((s) => ({
          // ⚠️ 不动 profile：重置的是「学习进度」，不是「这是谁」。
          // 把孩子的昵称一起抹掉会让重置后的界面退回未初始化状态，是更糟的体验。
          profile: s.profile,
          wrongWords: [],
          totalStars: 0,
          completedPreviews: [],
          completedQuizzes: [],
          lessonCompleted: {},
          completedStories: [],
          srsCards: {},
          starlightExtensions: {},
          extensionRound: {},
          reciteCheckins: {},
          chineseQuiz: {},
          eng3aRecite: {},
          eng3aQuiz: {},
          completedChinese: [],
          completedEng3a: [],
        })),

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

      seedSentenceFrames: (frames, module) =>
        set((s) => {
          let changed = false
          const next = { ...s.srsCards }
          for (const f of frames) {
            const en = frameCardKey(f)
            const existing = next[en]
            if (existing) {
              if (!existing.modules.includes(module)) {
                next[en] = { ...existing, modules: [...existing.modules, module] }
                changed = true
              }
            } else {
              next[en] = { ...createNewCard(en, module), kind: 'sentence', frame: f }
              changed = true
            }
          }
          return changed ? { srsCards: next } : s
        }),

      addExtensionWord: (lessonKey, w) => {
        const en = (w.en ?? '').trim()
        if (!en) return false
        let ok = false
        set((s) => {
          const list = s.starlightExtensions[lessonKey] ?? []
          // 每课上限:满了就不再接受手动录入(UI 同步禁用「➕ 加词」)
          if (list.length >= EXT_LIMIT) return s
          const dup = list.some((x) => x.en.toLowerCase() === en.toLowerCase())
          if (dup) return s
          const word: ExtWord = { en, zh: w.zh ?? '', emoji: w.emoji || '📝', ipa: w.ipa }
          ok = true
          // 播种:已有卡(如教材词同形)只归模块,不覆盖来源;无卡则按 extension 来源建卡
          const existing = s.srsCards[en]
          const srsCards = existing
            ? { ...s.srsCards }
            : {
                ...s.srsCards,
                [en]: createNewCard(en, moduleOfLessonKey(lessonKey), dayStamp(), 'extension'),
              }
          return {
            starlightExtensions: { ...s.starlightExtensions, [lessonKey]: [...list, word] },
            srsCards,
          }
        })
        return ok
      },

      removeExtensionWord: (lessonKey, en) =>
        set((s) => {
          const list = s.starlightExtensions[lessonKey]
          if (!list) return s
          const nextList = list.filter((x) => x.en !== en)
          const starlightExtensions = { ...s.starlightExtensions }
          if (nextList.length === 0) delete starlightExtensions[lessonKey]
          else starlightExtensions[lessonKey] = nextList
          // 只清 extension 来源的卡:若该词已是教材课内词,卡片需保留
          const card = s.srsCards[en]
          const srsCards = card && card.source === 'extension'
            ? Object.fromEntries(Object.entries(s.srsCards).filter(([k]) => k !== en))
            : s.srsCards
          return { starlightExtensions, srsCards }
        }),

      fillExtensionWords: (lessonKey, candidates, round) => {
        let added = 0
        set((s) => {
          const list = s.starlightExtensions[lessonKey] ?? []
          const kept = list.filter((x) => !x.auto) // 手动录入的词永远保留
          const dropped = list.filter((x) => x.auto) // 上一批自动词整体换掉
          let srsCards = s.srsCards
          // copy-on-write:只有真的动卡片时才复制,避免每次填充都克隆整个复习池
          const touch = () => {
            if (srsCards === s.srsCards) srsCards = { ...s.srsCards }
            return srsCards
          }
          // 被换掉的自动词:仅当卡片来源是 extension 时移出复习池(教材同形词必须留下)
          for (const d of dropped) {
            const card = srsCards[d.en]
            if (card && card.source === 'extension') delete touch()[d.en]
          }
          const have = new Set(kept.map((x) => x.en.toLowerCase()))
          const picked: ExtWord[] = []
          for (const c of candidates) {
            if (kept.length + picked.length >= EXT_LIMIT) break // 每课硬上限
            const en = (c.en ?? '').trim()
            if (!en) continue
            const base = en.toLowerCase()
            if (have.has(base)) continue // 课内同形/已录词不重复占用名额
            have.add(base)
            picked.push({
              ...c,
              en,
              zh: c.zh ?? '',
              emoji: c.emoji || '📝',
              ipa: c.ipa,
              auto: true,
            })
            // 播种:已有卡只保留,无卡按 extension 来源建卡(与 addExtensionWord 同口径)
            if (!srsCards[en]) {
              touch()[en] = createNewCard(en, moduleOfLessonKey(lessonKey), dayStamp(), 'extension')
            }
          }
          added = picked.length
          const nextList = [...kept, ...picked]
          const starlightExtensions = { ...s.starlightExtensions }
          if (nextList.length === 0) delete starlightExtensions[lessonKey]
          else starlightExtensions[lessonKey] = nextList
          // 轮次始终记录:即使候选为空也标记「已尝试过」,避免空列表时反复自动填充
          return {
            starlightExtensions,
            srsCards,
            extensionRound: { ...s.extensionRound, [lessonKey]: round },
          }
        })
        return added
      },

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
        // 走 dueOf 而非直接读 nextReview：否则这里会与 isDue / sortDueCards
        // 形成第三套独立判据，卡片一旦不同步就出现「明天到期数」与实际队列对不上
        return Object.values(get().srsCards).filter((c) => dueOf(c) === tomorrow).length
      },

      getWrongWords: (module) => {
        const all = get().wrongWords
        return module ? all.filter((w) => w.module === module) : all
      },
    }),
    {
      name: 'starlight-course',
      // v9: 新增 profile（孩子档案）。字段只增不改语义，迁移只需补默认值。
      version: 9,
      // 只持久化数据字段,避免函数/瞬态状态被写入 localStorage
      partialize: (state) => ({
        profile: state.profile,
        wrongWords: state.wrongWords,
        totalStars: state.totalStars,
        completedPreviews: state.completedPreviews,
        completedQuizzes: state.completedQuizzes,
        lessonCompleted: state.lessonCompleted,
        completedStories: state.completedStories,
        srsCards: state.srsCards,
        starlightExtensions: state.starlightExtensions,
        extensionRound: state.extensionRound,
        reciteCheckins: state.reciteCheckins,
        chineseQuiz: state.chineseQuiz,
        eng3aRecite: state.eng3aRecite,
        eng3aQuiz: state.eng3aQuiz,
        completedChinese: state.completedChinese,
        completedEng3a: state.completedEng3a,
      }),
      // 迁移：补上模块维度字段 + 拆分 completedPreviews 语义
      migrate: (persistedState: unknown, version: number) => {
        // version 由 zustand 注入,这里仅用于触发迁移逻辑
        void version
        const s = (persistedState ?? {}) as Partial<CourseStore> & {
          // 遗留字段(已从状态中移除),仅在迁移旧数据时读取
          masteredWords?: string[]
        }
        const today = dayStamp()
        // 旧版 masteredWords 自动升级为 box 3(掌握级),下次复习为 7 天后
        const mastered: string[] = s.masteredWords ?? []
        type LegacyCard = Partial<SrsCard>
        const existingCards = (s.srsCards ?? {}) as Record<string, LegacyCard>
        const srsCards: Record<string, LegacyCard> = { ...existingCards }
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
        // v6:旧卡片只有 Leitner 字段,按 box 估算 FSRS 状态(due 沿用旧 nextReview,进度不丢)
        for (const en of Object.keys(srsCards)) {
          const c = srsCards[en]
          if (!c.fsrs) {
            srsCards[en] = {
              ...c,
              fsrs: migrateFromLeitner(c.box ?? 0, c.nextReview ?? today),
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
        // v5:旧数据只有单元级完成,补全课级记录(单元完成 ⇒ 该单元全部课时完成)
        const rawLessonCompleted = (s.lessonCompleted ?? {}) as Record<string, number[]>
        const lessonCompleted: Record<string, number[]> = { ...rawLessonCompleted }
        for (const slug of completedPreviews) {
          const lessons = lessonsOf(slug)
          if (lessons.length === 0) continue
          const prev = lessonCompleted[slug] ?? []
          if (prev.length >= lessons.length) continue
          lessonCompleted[slug] = [...new Set([...prev, ...lessons.map((l) => l.id)])]
        }
        // v9:补孩子档案。旧数据没有这个字段 ⇒ 给默认档案（name 为空串，
        // 首启会提示孩子填昵称）。规范化逻辑与 normalizeProfile 共用一份，
        // 避免「迁移链」和「同版本兜底」两处写法分叉。
        const profile = normalizeProfile((s as { profile?: unknown }).profile)
        return {
          ...s,
          profile,
          srsCards,
          starlightExtensions: s.starlightExtensions ?? {},
          // v8:补自动填充轮次标记(缺省 = 从未自动填充过,进课时空词表才会自动填一次)
          extensionRound: s.extensionRound ?? {},
          wrongWords,
          completedPreviews,
          completedStories,
          lessonCompleted,
          completedChinese: s.completedChinese ?? [],
          completedEng3a: s.completedEng3a ?? [],
        } as CourseStore
      },
      /**
       * 水合后无条件规范化。
       *
       * `migrate` 只在版本号变化时跑，所以「同版本但字段残缺」的数据等不到迁移
       * （手改过 localStorage / 写到一半 / 备份导入 / 数据文件被外部编辑）。
       * 这里每次水合都跑一次幂等的兜底，只补不删 —— 有效值一律保留。
       */
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const fixed = normalizeProfile(state.profile)
        // 只在真的需要时 setState，避免每次启动都触发一次多余写盘
        if (JSON.stringify(fixed) !== JSON.stringify(state.profile)) {
          useCourseStore.setState({ profile: fixed })
        }
      },
    }
  )
)
