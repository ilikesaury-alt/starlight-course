// 提取 Starlight 预备级前三单元复习数据 -> review-data.json
// 用法: node scripts/gen-review-data.mjs
// 数据来源全部复用 src/data 的真实 TS 模块,零手工转录。
import { build } from 'esbuild'
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const tmp = mkdtempSync(join(tmpdir(), 'review-data-'))
const entry = join(tmp, 'entry.ts')
const out = join(tmp, 'bundle.cjs')

// 用一个虚拟入口 import 所有真实数据模块
writeFileSync(entry, `
export { lessonsByUnit } from ${JSON.stringify(join(root, 'src/data/lessons.ts'))}
export { alphabet } from ${JSON.stringify(join(root, 'src/data/starlight.ts'))}
export { STARLIGHT_FRAMES } from ${JSON.stringify(join(root, 'src/data/sentenceFrame.ts'))}
export { READING_PASSAGES } from ${JSON.stringify(join(root, 'src/data/reading/index.ts'))}
export { LESSON_DIALOGUE } from ${JSON.stringify(join(root, 'src/data/lessonDialogue.ts'))}
export { STARLIGHT_BOOK } from ${JSON.stringify(join(root, 'src/data/starlight-book.ts'))}
export { modules } from ${JSON.stringify(join(root, 'src/data/starlight.ts'))}
`)

await build({
  entryPoints: [entry],
  outfile: out,
  bundle: true,
  format: 'cjs',
  platform: 'node',
  logLevel: 'silent',
})

const data = (await import(pathToFileURL(out).href)).default ?? (await import(pathToFileURL(out).href))

function pickPassage(p) {
  return {
    title: p.title,
    titleZh: p.titleZh,
    sentences: p.paragraphs.flat().map((s) => ({ en: s.en, zh: s.zh })),
  }
}

const units = []
for (let u = 1; u <= 3; u++) {
  const mod = data.modules.find((m) => m.id === u)
  const lessons = data.lessonsByUnit[u]
  units.push({
    id: u,
    title: mod.title,
    titleZh: mod.titleZh,
    emoji: mod.emoji,
    lessons: lessons.map((les) => {
      const key = `${u}-${les.id}`
      const book = data.STARLIGHT_BOOK[key]
      // 从课本原文里捞「唱歌/ chant」相关的句子,作为歌曲素材
      let songs = []
      if (book?.sections) {
        for (const sec of book.sections) {
          const chapter = `${sec.chapter || ''} ${sec.chapterZh || ''}`
          if (/sing|song|chant|唱歌|歌/.test(chapter)) {
            for (const pg of sec.pages || []) {
              songs.push({ en: pg.text, zh: pg.textZh || '' })
            }
          }
          for (const pg of sec.pages || []) {
            if (/tra la la|sing a song|sing together/i.test(pg.text || '')) {
              const already = songs.some((s) => s.en === pg.text)
              if (!already) songs.push({ en: pg.text, zh: pg.textZh || '' })
            }
          }
        }
      }
      return {
        id: les.id,
        title: les.title,
        titleZh: les.titleZh,
        words: les.words.map((w) => ({ en: w.en, zh: w.zh, emoji: w.emoji, ipa: w.ipa || '' })),
        sentences: les.sentences.map((s) => ({ en: s.en, zh: s.zh, hint: s.hint || '' })),
        frames: data.STARLIGHT_FRAMES.filter((f) => f.unitSlug === mod.slug && f.lessonId === les.id).map((f) => ({
          pattern: f.pattern,
          zh: f.zh,
          hint: f.hint || '',
          blanks: f.blanks.map((b) => ({ options: b.options, answer: b.answer })),
        })),
        reading: data.READING_PASSAGES[key] ? pickPassage(data.READING_PASSAGES[key]) : null,
        dialogue: data.LESSON_DIALOGUE[key]
          ? data.LESSON_DIALOGUE[key].turns.map((t) => ({ speaker: t.speaker, en: t.en, zh: t.zh || '' }))
          : [],
        songs,
      }
    }),
  })
}

const result = {
  meta: { title: 'Starlight 预备级 · 前三单元复习', generatedAt: new Date().toISOString() },
  alphabet: data.alphabet.map((l) => ({ upper: l.upper, lower: l.lower, word: l.word, emoji: l.emoji, ipa: l.ipa })),
  units,
}

const dest = join(root, 'review-data.json')
writeFileSync(dest, JSON.stringify(result, null, 2), 'utf8')
rmSync(tmp, { recursive: true, force: true })

const wc = units.map((u) => ({
  unit: u.id,
  lessons: u.lessons.length,
  words: u.lessons.reduce((n, l) => n + l.words.length, 0),
  sentences: u.lessons.reduce((n, l) => n + l.sentences.length, 0),
  frames: u.lessons.reduce((n, l) => n + l.frames.length, 0),
  readings: u.lessons.filter((l) => l.reading).length,
  dialogues: u.lessons.reduce((n, l) => n + l.dialogue.length, 0),
  songs: u.lessons.reduce((n, l) => n + l.songs.length, 0),
}))
console.log('写出:', dest)
console.table(wc)
