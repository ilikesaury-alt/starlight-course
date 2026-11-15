// 学习数据备份 / 恢复。
//
// 为什么需要它：全部进度都在 localStorage 里，卸载重装或一次误点「重置」就永久丢失，
// 而这是孩子几个月积累的数据。本模块提供「导出成文件 / 从文件恢复」，
// 是后续任何数据层改造（落盘、多档案、云备份）的安全网。
//
// 设计要点：
// - **字段清单不另写一份**：直接问 store 自己的 `persist.partialize` 要。
//   它是「哪些字段会落盘」的唯一真源，以后 store 加字段，备份自动跟上，不会漏。
// - **恢复必须走 store 自己的 migrate**，不能直接 setState 塞进去：
//   旧备份文件可能是 v6/v7 的结构，跳过迁移链等于把旧数据写成坏数据。
//   因此校验时**只检查当前字段的类型，旧版本字段原样透传**给 migrate。
// - 导入文件是**不可信输入**：按当前状态的值类型逐字段校验，
//   坏文件要给出人话错误，而不是崩页面或写脏数据。
// - 不依赖 Electron：网页版用 Blob 下载 + input[type=file] 读取，桌面版同一套代码。
//
// ⚠️ 本项目 tsconfig 是 `strict: false`，**判别联合（{ok:true,...} | {ok:false,...}）
//    无法按 ok 收窄**（缺 strictNullChecks 时 TS 不做这个收窄）。所以 RestoreResult
//    用「一个可选字段结构 + ok 布尔」表示，调用方先看 ok 再取字段。

import { useCourseStore } from '@/store/useCourseStore'

/** 备份文件的类型标识，防止把任意 JSON 当成备份导进来 */
export const BACKUP_KIND = 'starlight-course-backup'
/** 备份格式自身的版本（与 store 的 version 是两件事：前者是信封，后者是数据） */
export const BACKUP_SCHEMA = 1

/** 持久化子集：store 里会被落盘 / 备份的那部分状态（形状由 partialize 决定） */
export type PersistedState = Record<string, unknown>

export interface BackupFile {
  kind: typeof BACKUP_KIND
  schema: number
  /** 导出时的 store version，用于决定恢复时是否需要跑迁移 */
  storeVersion: number
  exportedAt: string
  data: PersistedState
}

/** 备份内容的规模摘要，用于界面上的「导出了什么」与导入前确认 */
export interface BackupSummary {
  stars: number
  wrongWords: number
  srsCards: number
  completedPreviews: number
  completedStories: number
  lessonsDone: number
  chineseDone: number
  eng3aDone: number
}

/**
 * 导入结果。
 * ok=true 时 data/summary 必有；ok=false 时 error 必有。
 * 用可选字段而非判别联合：tsconfig 的 strict:false 会让联合收窄失效（见文件头注释）。
 */
export interface RestoreResult {
  ok: boolean
  data?: PersistedState
  summary?: BackupSummary
  /** 备份来自旧版本时，记录原版本号，界面提示「会自动升级」 */
  migratedFrom?: number
  error?: string
}

// ---- 与 store 的接线 ----

/** 取 store 的 persist 配置（partialize / migrate / version 的唯一来源） */
function persistOptions() {
  return useCourseStore.persist.getOptions()
}

/** 当前持久化结构版本 */
export function storeVersion(): number {
  return persistOptions().version ?? 0
}

/**
 * 从完整 store 状态里挑出会被持久化的字段。
 * 直接复用 store 的 partialize —— 不另写一份字段清单，避免两边不同步。
 */
export function pickPersisted(state: unknown = useCourseStore.getState()): PersistedState {
  const partialize = persistOptions().partialize
  if (typeof partialize === 'function') {
    // partialize 的入参是完整 store 状态；这里用 unknown 中转，
    // 因为 CourseStore 没有索引签名，直接断言成 Record 会被 TS 拒绝。
    return partialize(state as never) as unknown as PersistedState
  }
  // 没有 partialize 时（不该发生）退化为「去掉函数字段」
  const out: PersistedState = {}
  for (const [k, v] of Object.entries((state ?? {}) as Record<string, unknown>)) {
    if (typeof v !== 'function') out[k] = v
  }
  return out
}

// ---- 导出 ----

/** 组装当前进度的备份对象（纯函数，便于单测） */
export function buildBackup(data: PersistedState, now: Date = new Date()): BackupFile {
  return {
    kind: BACKUP_KIND,
    schema: BACKUP_SCHEMA,
    storeVersion: storeVersion(),
    exportedAt: now.toISOString(),
    data,
  }
}

/** 从 store 当前状态组装备份 */
export function buildCurrentBackup(now: Date = new Date()): BackupFile {
  return buildBackup(pickPersisted(), now)
}

/** 备份文件名：带本地日期，方便家长在文件夹里认出哪份是哪天的 */
export function backupFileName(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `starlight-学习数据-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.json`
}

/** 统计备份内容的规模 */
export function summarize(data: PersistedState): BackupSummary {
  const arrLen = (v: unknown) => (Array.isArray(v) ? v.length : 0)
  const objLen = (v: unknown) =>
    typeof v === 'object' && v !== null ? Object.keys(v as object).length : 0
  const lessons = data.lessonCompleted
  const lessonsDone =
    typeof lessons === 'object' && lessons !== null
      ? Object.values(lessons as Record<string, unknown>).reduce<number>(
          (n, v) => n + (Array.isArray(v) ? v.length : 0),
          0
        )
      : 0
  const stars = data.totalStars
  return {
    stars: typeof stars === 'number' && Number.isFinite(stars) ? stars : 0,
    wrongWords: arrLen(data.wrongWords),
    srsCards: objLen(data.srsCards),
    completedPreviews: arrLen(data.completedPreviews),
    completedStories: arrLen(data.completedStories),
    lessonsDone,
    chineseDone: arrLen(data.completedChinese),
    eng3aDone: arrLen(data.completedEng3a),
  }
}

/**
 * 触发浏览器下载备份文件。
 * 用 <a download> 而不是 Electron 的保存对话框：网页版与桌面版共用一套，
 * 桌面版的下载行为由 Electron 默认处理（落到系统下载目录）。
 */
export function downloadBackup(file: BackupFile = buildCurrentBackup()): string {
  const name = backupFileName()
  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  // 交给下一轮事件循环回收：立即 revoke 在部分 Chromium 版本上会中断下载
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return name
}

// ---- 导入 ----

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * 校验并归一化备份数据。
 *
 * 两条规则，缺一不可：
 * 1. **当前字段**：按当前状态里同名值的类型校验（数组/对象/有限数字），
 *    类型不对就整体拒绝 —— 这是「不是本应用导出的文件」的主要判据。
 * 2. **旧版本字段**（当前状态里已经没有的，如 v8 之前的 `masteredWords`）：
 *    **原样保留**，不能丢。迁移链正是靠这些字段把旧进度升级成新结构；
 *    丢掉它们等于把旧备份恢复成空进度（这个 bug 真的发生过）。
 *
 * 不深挖字段内部语义 —— 那是 migrate 的活。
 */
function validateData(raw: unknown, current: PersistedState): RestoreResult {
  if (!isPlainObject(raw)) return { ok: false, error: '备份文件里没有找到学习数据。' }

  const errors: string[] = []
  const out: PersistedState = {}

  for (const key of Object.keys(current)) {
    if (!(key in raw)) continue // 旧备份缺新字段：交给 migrate 补默认值
    const v = raw[key]
    const ref = current[key]

    if (Array.isArray(ref)) {
      if (Array.isArray(v)) out[key] = v
      else errors.push(key)
    } else if (isPlainObject(ref)) {
      if (isPlainObject(v)) out[key] = v
      else errors.push(key)
    } else if (typeof ref === 'number') {
      if (typeof v === 'number' && Number.isFinite(v)) out[key] = Math.max(0, v)
      else errors.push(key)
    } else {
      out[key] = v
    }
  }

  // 旧版本遗留字段：当前状态里没有，但 migrate 需要它们（例：masteredWords）。
  // 只透传「基本类型 / 数组 / 对象」这类可序列化值，函数之类一律不接。
  for (const key of Object.keys(raw)) {
    if (key in out) continue
    if (key in current) continue // 当前字段但类型校验失败 → 已在 errors 里，不重复收
    const v = raw[key]
    if (v === null || ['string', 'number', 'boolean', 'object'].includes(typeof v)) {
      out[key] = v
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      error: `备份文件有字段格式不对：${errors.join('、')}。可能不是本应用导出的文件。`,
    }
  }
  // 判「空备份」要看当前字段：只有旧字段（如 masteredWords）也算有数据，
  // 因为它能被 migrate 变成真实的 SRS 卡片。
  if (Object.keys(out).length === 0) {
    return { ok: false, error: '这个文件里没有任何可恢复的学习数据。' }
  }
  return { ok: true, data: out }
}

/**
 * 解析备份文本。不写任何状态 —— 调用方先确认，再调 applyBackup。
 * 这样「选错文件」不会直接覆盖孩子的进度。
 */
export async function parseBackup(text: string): Promise<RestoreResult> {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: '这不是一个有效的 JSON 文件。' }
  }
  if (!isPlainObject(parsed)) return { ok: false, error: '备份文件格式不对。' }

  const currentVersion = storeVersion()

  // 允许两种输入：本应用的备份信封，或直接是 persist 落盘的原始 JSON
  //（zustand persist 存的是 { state, version }，家长从开发者工具里导出的往往是这种）
  let payload: unknown
  let fileVersion = currentVersion
  if (parsed.kind === BACKUP_KIND) {
    payload = parsed.data
    if (typeof parsed.storeVersion === 'number') fileVersion = parsed.storeVersion
  } else if (isPlainObject(parsed.state)) {
    payload = parsed.state
    if (typeof parsed.version === 'number') fileVersion = parsed.version
  } else {
    return { ok: false, error: '认不出这个文件。请选择从本应用「导出」得到的备份文件。' }
  }

  const checked = validateData(payload, pickPersisted())
  if (!checked.ok || !checked.data) return { ok: false, error: checked.error ?? '备份数据无效。' }

  // 跑 store 自己的迁移链：旧版本备份在这里被补齐成当前结构，
  // 之后 applyBackup 才能安全地写回去。迁移函数是幂等的，重复跑无副作用。
  const migrate = persistOptions().migrate
  let data: PersistedState
  try {
    data = migrate
      ? ((migrate(checked.data, fileVersion) as unknown) as PersistedState)
      : checked.data
  } catch (e) {
    return { ok: false, error: `备份数据升级失败：${String(e)}` }
  }

  // migrate 会把旧字段折叠成新字段，但不会删掉旧键；只回填当前持久化字段，
  // 避免把 masteredWords 这类遗留键写进 store。
  const current = pickPersisted()
  const cleaned: PersistedState = {}
  for (const key of Object.keys(current)) {
    if (key in data) cleaned[key] = data[key]
  }
  if (Object.keys(cleaned).length === 0) {
    return { ok: false, error: '这个备份升级后没有任何可恢复的数据。' }
  }

  return {
    ok: true,
    data: cleaned,
    summary: summarize(cleaned),
    migratedFrom: fileVersion !== currentVersion ? fileVersion : undefined,
  }
}

/**
 * 把校验过的备份写入 store。
 * 用 setState 的合并语义（不 replace），避免把 actions 一起冲掉；
 * 随后 persist 中间件会自动把新状态写进 localStorage。
 */
export function applyBackup(data: PersistedState): void {
  useCourseStore.setState(data as never, false)
}

/** 读一个用户选中的文件并解析（不写入状态） */
export async function readBackupFile(file: File): Promise<RestoreResult> {
  if (file.size === 0) return { ok: false, error: '这个文件是空的。' }
  // 20MB 足够覆盖最坏情况（几万张 SRS 卡），再大基本可以断定选错了文件
  if (file.size > 20 * 1024 * 1024) return { ok: false, error: '文件太大了，不像是学习数据备份。' }
  try {
    const text = await file.text()
    return await parseBackup(text)
  } catch (e) {
    return { ok: false, error: `读取文件失败：${String(e)}` }
  }
}
