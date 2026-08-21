// 模块注册表：把五个「预习模块」（Starlight 主课 / Fly Guy / Rocket Girl / 语文 / 英语3A）
// 统一抽象为一个可枚举的注册表，供复习系统按模块筛选与导航。
//
// 数据加载策略：
//   - 单元类模块（starlight/chinese/eng3a）的元数据与取词同步可得；
//   - 故事类模块（flyguy/rocketgirl）词表体积大(合计 ~600KB 源码)，经 load() 动态
//     import() 按需加载，避免被打进首屏 chunk；注册表只保留主题与标签等轻量字段。
//   - 同步的 items/getWords 对故事类返回空壳,完整数据一律走 load()。

import { modules as starlightModules, getModule, STARLIGHT_THEME } from './starlight'
import { chineseUnits, CHINESE_THEME } from './chinese'
import { eng3aUnits, ENG3A_THEME } from './eng3a'
import { FG_THEME, RG_THEME } from './story-themes'

export type ModuleId = 'starlight' | 'flyguy' | 'rocketgirl' | 'chinese' | 'eng3a'

export interface ReviewItem {
  /** 单元 slug（Starlight）或故事 slug（故事类） */
  id: string
  title: string
  titleZh: string
  emoji: string
}

export interface ReviewWord {
  en: string
  zh: string
  emoji?: string
}

/** 模块完整数据：复习项列表 + 取词函数 */
export interface ModuleData {
  items: ReviewItem[]
  getWords: (itemId: string) => ReviewWord[]
}

export interface ModuleMeta {
  id: ModuleId
  label: string
  labelZh: string
  color: string
  colorSoft: string
  /** unit = 按单元组织（Starlight）；story = 按故事组织（Fly Guy / Rocket Girl） */
  kind: 'unit' | 'story'
  /** 同步可得的复习项;故事类为空数组(数据在 load 后才有) */
  items: ReviewItem[]
  /** 同步取词;故事类未 load 时返回空 */
  getWords: (itemId: string) => ReviewWord[]
  /** 动态加载模块完整数据(故事类触发按需 chunk 下载) */
  load: () => Promise<ModuleData>
}

const starlightMeta: ModuleMeta = {
  id: 'starlight',
  label: 'Starlight',
  labelZh: '主课',
  color: STARLIGHT_THEME.color,
  colorSoft: STARLIGHT_THEME.colorSoft,
  kind: 'unit',
  items: starlightModules.map((m) => ({
    id: m.slug,
    title: m.title,
    titleZh: m.titleZh,
    emoji: m.emoji,
  })),
  getWords: (itemId) => {
    const mod = getModule(itemId)
    if (!mod) return []
    return mod.lessons.flatMap((l) => l.words).map((w) => ({ en: w.en, zh: w.zh, emoji: w.emoji }))
  },
  load: async () => ({ items: starlightMeta.items, getWords: starlightMeta.getWords }),
}

// 语文模块（三年级上册）：生字（汉字）作为 SRS 记忆卡，key = 汉字，zh = 拼音 · 组词，
// module='chinese'。进语文课（ChineseLesson）即播种到 SRS，统一走「智能复习」(/smart) 到期调度；
// 古诗/课文段落则在课程页内「自测练习」完成，不进 SRS。
const chineseMeta: ModuleMeta = {
  id: 'chinese',
  label: '语文',
  labelZh: '语文',
  color: CHINESE_THEME.color,
  colorSoft: CHINESE_THEME.colorSoft,
  kind: 'unit',
  items: chineseUnits.map((u) => ({
    id: u.slug,
    title: u.title,
    titleZh: u.titleZh,
    emoji: u.emoji,
  })),
  getWords: (unitSlug) => {
    const u = chineseUnits.find((x) => x.slug === unitSlug)
    if (!u) return []
    const seen = new Set<string>()
    const out: ReviewWord[] = []
    for (const lesson of u.lessons) {
      for (const h of lesson.hanzi ?? []) {
        if (seen.has(h.char)) continue
        seen.add(h.char)
        out.push({ en: h.char, zh: `${h.pinyin} · ${h.group.join('、')}`, emoji: '🔤' })
      }
    }
    return out
  },
  load: async () => ({ items: chineseMeta.items, getWords: chineseMeta.getWords }),
}

// 三年级上册英语（外研版）：单词作为 SRS 记忆卡,key = 单词英文,zh = 中文释义,
// module='eng3a'。进英语课（Eng3aLesson）即播种到 SRS,统一走「智能复习」(/smart) 到期调度。
const eng3aMeta: ModuleMeta = {
  id: 'eng3a',
  label: '英语',
  labelZh: '英语',
  color: ENG3A_THEME.color,
  colorSoft: ENG3A_THEME.colorSoft,
  kind: 'unit',
  items: eng3aUnits.map((u) => ({
    id: u.slug,
    title: u.title,
    titleZh: u.titleZh,
    emoji: u.emoji,
  })),
  getWords: (unitSlug) => {
    const u = eng3aUnits.find((x) => x.slug === unitSlug)
    if (!u) return []
    const seen = new Set<string>()
    const out: ReviewWord[] = []
    for (const lesson of u.lessons) {
      for (const w of lesson.words ?? []) {
        if (seen.has(w.en)) continue
        seen.add(w.en)
        out.push({ en: w.en, zh: w.zh, emoji: w.emoji ?? '🔤' })
      }
    }
    return out
  },
  load: async () => ({ items: eng3aMeta.items, getWords: eng3aMeta.getWords }),
}

// ---- 故事类模块:轻量壳 + 动态加载数据 ----

const flyGuyMeta: ModuleMeta = {
  id: 'flyguy',
  label: 'Fly Guy',
  labelZh: '苍蝇小子',
  color: FG_THEME.color,
  colorSoft: FG_THEME.colorSoft,
  kind: 'story',
  items: [],
  getWords: () => [],
  load: async () => {
    const { flyGuyStories } = await import('./flyguy')
    return {
      items: flyGuyStories.map((s) => ({
        id: s.slug,
        title: s.title,
        titleZh: '',
        emoji: s.emoji,
      })),
      getWords: (itemId) => {
        const st = flyGuyStories.find((s) => s.slug === itemId)
        return st ? st.words.map((w) => ({ en: w.en, zh: w.zh, emoji: w.emoji })) : []
      },
    }
  },
}

const rocketGirlMeta: ModuleMeta = {
  id: 'rocketgirl',
  label: 'Rocket Girl',
  labelZh: '火箭女孩',
  color: RG_THEME.color,
  colorSoft: RG_THEME.colorSoft,
  kind: 'story',
  items: [],
  getWords: () => [],
  load: async () => {
    const { rocketGirlStories } = await import('./rocketgirl')
    return {
      items: rocketGirlStories.map((s) => ({
        id: s.slug,
        title: s.title,
        titleZh: '',
        emoji: s.emoji,
      })),
      getWords: (itemId) => {
        const st = rocketGirlStories.find((s) => s.slug === itemId)
        return st ? st.words.map((w) => ({ en: w.en, zh: w.zh, emoji: w.emoji })) : []
      },
    }
  },
}

export const MODULES: Record<ModuleId, ModuleMeta> = {
  starlight: starlightMeta,
  flyguy: flyGuyMeta,
  rocketgirl: rocketGirlMeta,
  chinese: chineseMeta,
  eng3a: eng3aMeta,
}

export const MODULE_LIST: ModuleMeta[] = [starlightMeta, flyGuyMeta, rocketGirlMeta, chineseMeta, eng3aMeta]

export function getModuleMeta(id: string | undefined): ModuleMeta | undefined {
  if (!id) return undefined
  return MODULES[id as ModuleId]
}

/** 取某模块的 {color, colorSoft}，供 moduleThemeVars 展开为全套主题令牌 */
export function moduleThemeOf(id: string | undefined): { color: string; colorSoft: string } {
  const meta = getModuleMeta(id)
  if (meta) return { color: meta.color, colorSoft: meta.colorSoft }
  return { color: STARLIGHT_THEME.color, colorSoft: STARLIGHT_THEME.colorSoft }
}
