// 模块注册表：把三个“预习模块”（Starlight 主课 / Fly Guy / Rocket Girl）
// 统一抽象为一个可枚举的注册表，供复习系统按模块筛选与导航。
// 每个模块声明自己的复习项（Starlight = 单元，故事类 = 故事）与取词函数。

import { modules as starlightModules, getModule, STARLIGHT_THEME } from './starlight'
import { flyGuyStories, FG_THEME } from './flyguy'
import { rocketGirlStories, RG_THEME } from './rocketgirl'
import { chineseUnits, CHINESE_THEME } from './chinese'

export type ModuleId = 'starlight' | 'flyguy' | 'rocketgirl' | 'chinese'

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

export interface ModuleMeta {
  id: ModuleId
  label: string
  labelZh: string
  color: string
  colorSoft: string
  /** unit = 按单元组织（Starlight）；story = 按故事组织（Fly Guy / Rocket Girl） */
  kind: 'unit' | 'story'
  items: ReviewItem[]
  /** 取某复习项下的全部单词（用于词汇复习 / 播种） */
  getWords: (itemId: string) => ReviewWord[]
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
}

const flyGuyMeta: ModuleMeta = {
  id: 'flyguy',
  label: 'Fly Guy',
  labelZh: '苍蝇小子',
  color: FG_THEME.color,
  colorSoft: FG_THEME.colorSoft,
  kind: 'story',
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

const rocketGirlMeta: ModuleMeta = {
  id: 'rocketgirl',
  label: 'Rocket Girl',
  labelZh: '火箭女孩',
  color: RG_THEME.color,
  colorSoft: RG_THEME.colorSoft,
  kind: 'story',
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

// 语文模块（三年级上册）：生字（汉字）作为 SRS 记忆卡，key = 汉字，zh = 拼音 · 组词，
// module='chinese'。进语文课（ChineseLesson）即播种到 SRS，统一走「智能复习」(/smart) 到期调度；
// 古诗/课文段落则在课程页内「自测练习」完成，不进 SRS。
const chineseMeta: ModuleMeta = {
  id: 'chinese',
  label: '语文',
  labelZh: '三年级上册',
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
}

export const MODULES: Record<ModuleId, ModuleMeta> = {
  starlight: starlightMeta,
  flyguy: flyGuyMeta,
  rocketgirl: rocketGirlMeta,
  chinese: chineseMeta,
}

export const MODULE_LIST: ModuleMeta[] = [starlightMeta, flyGuyMeta, rocketGirlMeta, chineseMeta]

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
