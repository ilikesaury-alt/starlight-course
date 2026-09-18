// 三年级上册英语（外研版）课页。
// 结构骨架由 SelfStudyLesson 共享（知识点 / 打卡 / 自测），
// 本文件只负责「按关卡类型渲染知识点」以及数据接线。
//
// 五关的知识点各有各的互动：
//   words   翻卡认读 + 补充词表
//   talk    对话跟读 + 句子连线
//   sing    歌谣朗读 + 字母认读
//   explore 知识小卡 + 对照提示
//   quiz    （知识点页留一句引导，重点在自测页）

import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import SelfStudyLesson from '@/components/SelfStudyLesson'
import EngFlipWords from '@/components/EngFlipWords'
import EngMatchPairs from '@/components/EngMatchPairs'
import { getEngLesson, stageOf, type EngLesson as Lesson } from '@/data/eng3a'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { useSettleSelfStudy } from '@/hooks/useSettleQuiz'

export default function Eng3aLesson() {
  const { unitId = '', lessonId = '' } = useParams()
  const found = getEngLesson(unitId, lessonId)
  const markRecite = useCourseStore((s) => s.markEng3aRecite)
  const markQuiz = useCourseStore((s) => s.markEng3aQuiz)
  const markDone = useCourseStore((s) => s.markEng3aDone)
  const completed = useCourseStore((s) => s.completedEng3a)
  const seedCards = useCourseStore((s) => s.seedCards)
  const reciteDays = useCourseStore((s) => (found ? s.eng3aRecite[found.lesson.slug] : undefined)) ?? []
  const quizResult = useCourseStore((s) =>
    found ? s.eng3aQuiz[found.lesson.slug] : undefined,
  )

  // 进课即把本课「单词」播种进 SRS（module='eng3a'），进入智能复习到期调度
  useEffect(() => {
    if (!found) return
    const ens = [...(found.lesson.words ?? []), ...(found.lesson.moreWords ?? [])].map((w) => w.en)
    if (ens.length) seedCards(ens, 'eng3a')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found?.lesson.slug])

  // 自测交卷统一结算:星规加星 / ≥80% 自动完成 / 错题(key 题)入错题本并记 SRS(hook 内统一口径)
  const settleQuiz = useSettleSelfStudy({
    module: 'eng3a',
    from: `${found?.unit.title ?? ''} · ${found?.lesson.title ?? ''}`,
    fallbackEmoji: found?.lesson.emoji,
  })

  if (!found) {
    return (
      <div className="empty">
        <p>没有找到这一课。</p>
        <Link to="/eng3a" className="btn">返回英语课程</Link>
      </div>
    )
  }

  const { unit, lesson, lessonIdx } = found
  const prevLesson = unit.lessons[lessonIdx - 1]
  const nextLesson = unit.lessons[lessonIdx + 1]
  const mcStyle = {
    '--mc': unit.theme.color,
    '--mc-soft': unit.theme.colorSoft,
  } as React.CSSProperties

  // 自测交卷:存成绩由页面注入,其余走共享结算
  const handleSubmitQuiz = (score: number, total: number, wrongKeys: { en: string; zh: string }[]) => {
    settleQuiz(score, total, wrongKeys, {
      onSubmitted: () => markQuiz(lesson.slug, score, total),
      onPass: () => markDone(lesson.slug),
    })
  }

  return (
    <SelfStudyLesson
      moduleId="eng3a"
      theme={unit.theme}
      emoji={lesson.emoji}
      kicker={`${unit.title} · ${stageOf(lesson).emoji} ${stageOf(lesson).label}`}
      title={lesson.title}
      safeLabel="英语课"
      cover={unit.cover}
      knowledge={<KnowledgeTab lesson={lesson} mcStyle={mcStyle} />}
      reciteLabel="🔊 跟读练习"
      reciteLead={
        stageOf(lesson).key === 'sing'
          ? '先点 🔊 听整首歌谣，再一句一句跟着唱；唱完点下面的按钮打卡。'
          : '点 🔊 听一听，跟着大声读出来吧！读完这一关，点下面的按钮打个卡～'
      }
      reciteStreakLabel="连续跟读(天)"
      reciteCta="📅 今天读过了，打卡！"
      reciteDoneHint="真棒！明天也来读一读吧～"
      reciteDays={reciteDays}
      onCheckin={() => markRecite(lesson.slug)}
      quiz={lesson.exercise}
      lastResult={quizResult}
      onSubmitQuiz={handleSubmitQuiz}
      done={completed.includes(lesson.slug)}
      onMarkDone={() => markDone(lesson.slug)}
      backTo={{ to: `/eng3a/${unit.slug}`, label: '课程列表' }}
      prevTo={prevLesson ? `/eng3a/${unit.slug}/${prevLesson.slug}` : undefined}
      nextTo={nextLesson ? `/eng3a/${unit.slug}/${nextLesson.slug}` : undefined}
    />
  )
}

// ===================== 知识点展示（按关卡类型分块）=====================
function KnowledgeTab({ lesson, mcStyle }: { lesson: Lesson; mcStyle: React.CSSProperties }) {
  const stage = stageOf(lesson)
  const hasAnything =
    !!lesson.words?.length ||
    !!lesson.dialogs?.length ||
    !!lesson.chant ||
    !!lesson.letters?.length ||
    !!lesson.explore?.length

  return (
    <div className="cn-knowledge">
      <div className="en3-stage-banner" style={mcStyle}>
        <span className="en3-stage-banner-emoji">{stage.emoji}</span>
        <div>
          <div className="en3-stage-banner-title">
            {stage.label}
            <span className="en3-path-en">{stage.en}</span>
          </div>
          <div className="en3-stage-banner-desc">{stage.desc}</div>
        </div>
      </div>

      {/* ---------- 认单词：翻卡认读 ---------- */}
      {lesson.words && lesson.words.length > 0 && (
        <section className="en3-words" style={mcStyle}>
          <div className="cn-section-title">
            🔤 重点词（{lesson.words.length} 个 · 点卡片翻面看意思）
          </div>
          <EngFlipWords words={lesson.words} />
        </section>
      )}

      {/* 补充词表：教材词汇表里余下的功能词，紧凑展示，保证词汇全覆盖 */}
      {lesson.moreWords && lesson.moreWords.length > 0 && (
        <section className="en3-more-words" style={mcStyle}>
          <div className="cn-section-title">📎 补充词（{lesson.moreWords.length} 个）</div>
          <p className="en3-more-lead">
            这些词在课文里会反复出现，先混个脸熟，不用背。
          </p>
          <div className="en3-more-grid">
            {lesson.moreWords.map((w, i) => (
              <span className="en3-more-chip" key={i}>
                <b>{w.en}</b>
                <span>{w.zh}</span>
                <SpeakButton text={w.en} label={w.en} />
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ---------- 说句子：对话跟读 + 句子连线 ---------- */}
      {lesson.dialogs && lesson.dialogs.length > 0 && (
        <section className="en3-dialogs">
          <div className="cn-section-title">💬 句型对话（{lesson.dialogs.length} 句）</div>
          {lesson.dialogs.map((d, i) => (
            <div className="en3-dialog" key={i}>
              <div className="en3-dialog-line">
                {d.speaker && <span className="en3-dialog-speaker">{d.speaker}</span>}
                <span className="en3-dialog-en">{d.en}</span>
                <SpeakButton text={d.en} label={d.en} slow />
              </div>
              {d.zh && <div className="en3-dialog-zh">{d.zh}</div>}
            </div>
          ))}
        </section>
      )}

      {lesson.dialogs && lesson.dialogs.filter((d) => d.zh).length >= 2 && (
        <section className="en3-match-wrap">
          <div className="cn-section-title">🎮 玩一玩：句子连线</div>
          <EngMatchPairs dialogs={lesson.dialogs} />
        </section>
      )}

      {/* ---------- 唱起来：歌谣 + 字母 ---------- */}
      {lesson.chant && (
        <section className="en3-chant">
          <div className="cn-section-title">🎵 {lesson.chant.title ?? '歌谣'}</div>
          <div className="en3-chant-lines">
            {lesson.chant.lines.map((ln, i) => (
              <div className="en3-chant-line" key={i}>{ln}</div>
            ))}
          </div>
          <button
            type="button"
            className="cn-read-all"
            onClick={() => speakText(lesson.chant!.lines.join('. '), { lang: 'en' })}
          >
            🔊 朗读歌谣
          </button>
          {lesson.chant.zh && <div className="en3-chant-tip">💡 {lesson.chant.zh}</div>}
        </section>
      )}

      {lesson.letters && lesson.letters.length > 0 && (
        <section className="en3-letters">
          <div className="cn-section-title">🔡 字母（{lesson.letters.length} 个 · 点 🔊 听读音）</div>
          <div className="en3-letters-grid">
            {lesson.letters.map((L, i) => (
              <div className="en3-letter-card" key={i}>
                <span className="en3-letter">{L}</span>
                <SpeakButton text={L[0]} label={L} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- 长知识：知识小卡 + 对照提示 ---------- */}
      {lesson.explore && lesson.explore.length > 0 && (
        <section className="en3-explore">
          <div className="cn-section-title">🧪 长知识（{lesson.explore.length} 张小卡）</div>
          <div className="en3-explore-list">
            {lesson.explore.map((c, i) => (
              <div className="en3-explore-card" key={i} style={mcStyle}>
                <div className="en3-explore-head">
                  <span className="en3-explore-emoji">{c.emoji}</span>
                  <span className="en3-explore-title">{c.title}</span>
                  {c.en && <SpeakButton text={c.en} label={c.en} slow />}
                </div>
                {c.en && <div className="en3-explore-en">{c.en}</div>}
                <div className="en3-explore-zh">{c.zh}</div>
                {c.bullets && c.bullets.length > 0 && (
                  <ul className="en3-explore-bullets">
                    {c.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {lesson.tips && lesson.tips.length > 0 && (
        <section className="en3-tips" style={mcStyle}>
          <div className="cn-section-title">📌 记一记</div>
          <div className="en3-tips-list">
            {lesson.tips.map((t, i) => (
              <div className="en3-tip-row" key={i}>
                <span className="en3-tip-from">{t.from}</span>
                <span className="en3-tip-eq">=</span>
                <span className="en3-tip-to">{t.to}</span>
                {t.zh && <span className="en3-tip-zh">{t.zh}</span>}
                <SpeakButton text={t.to} label={t.to} />
              </div>
            ))}
          </div>
        </section>
      )}

      {!hasAnything && (
        <div className="en3-quiz-only">
          <p>🏁 这一关没有新知识要读 —— 直接去「📝 自测练习」闯关吧！</p>
          <p className="en3-quiz-only-sub">
            上面已经学过：{stage.desc}
          </p>
        </div>
      )}
    </div>
  )
}
