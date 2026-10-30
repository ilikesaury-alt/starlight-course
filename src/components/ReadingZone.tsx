// 📚 阅读短文区：每课一段连贯小故事，供孩子自主阅读。
//
// 只做几件用户点名的事，不再加花样：
//   1. 逐词点读 —— 复用 TappableWords（全站一致的点词发音 + 弹词义）
//   2. 本课词高亮 —— 通过 TappableWords 的 mark prop 打标，孩子能看出「这些我学过」
//   3. 阅读友好排版 —— 大字号 / 宽行距 / 段距，且限制单行长度，读起来不跳行
//   4. 逐句朗读 + 整篇连读 + 中文按需 —— 朗读按句串行（不整段丢给 TTS，长文本会被云 TTS
//      超时、也会被自动播放策略拦）；每句右侧一个小喇叭，点一下只读这一句。
//
// 「读到哪了」的三件套（借鉴 docs/lesson-detail-ui-research.md 调研的两个开源实现）：
//   · **focus dimming**（readalong-reader）：整篇连读时，非当前句降到 32% 不透明度，
//     当前句 100%。这是「跟着声音走」最轻量的实现 —— 不需要自动滚动就能锁住注意力。
//   · **自动滚动**（readalong-reader / OpenReader）：当前句滚到视口中间，长文也不会
//     「声音在读第 8 句，眼睛停在最后一句」。
//   · **正在读的句子高亮**（readalong-reader / TouchRead.js 的 child-visible feedback）：
//     每次点击都有明确视觉状态，绝不静默。
//
// 中文对照默认关，点「🇨🇳 显示中文」才整篇展开（阅读区是要「读英文」的地方，
// 常驻中文会把英文稀释掉；课文区同理，见 LessonDialogueBox）。
//
// 不做的事（CONTEXT.md 已裁决）：不引入跟读 STT、不播种 SRS、不做阅读理解测验。

import { useEffect, useMemo, useRef, useState } from 'react'
import TappableWords from './TappableWords'
import PlayTools from './PlayTools'
import { speakText, cancelSpeech } from '@/utils/speak'
import { cleanForSpeak } from '@/utils/bookDict'
import { useSlowMode } from '@/utils/slowMode'
import type { ReadingPassage } from '@/data/reading'
import type { Word } from '@/data/starlight'

interface Props {
  passage: ReadingPassage
  /** 本课词表：点词弹词义 + 高亮 */
  vocab: Word[]
  /** en → 记忆盒号，来自 SRS（沿用全站三色记忆状态） */
  boxOf?: (en: string) => number | undefined
}

export default function ReadingZone({ passage, vocab, boxOf }: Props) {
  const [showZh, setShowZh] = useState(false)
  const [playing, setPlaying] = useState(false)
  // 朗读（整篇连读）时高亮当前句；逐句点击朗读也点亮对应句
  const [nowIdx, setNowIdx] = useState(-1)
  // 当前正在单独朗读的句子下标（仅用于「这一句在播」的小喇叭/占位，不用于整篇连读高亮）
  const [busyIdx, setBusyIdx] = useState(-1)
  // 朗读串行的「还在继续吗」开关：用 ref，不能等 state（连播时 state 还没更新）
  const chainRef = useRef(false)
  // 单句朗读的会话代次：防止「上一句还没结束就点下一句」导致高亮错乱
  const sentSid = useRef(0)
  // 句子 DOM 引用：当前句自动滚动用
  const sentRefs = useRef<(HTMLDivElement | null)[]>([])
  // 「正在单独朗读哪一句」的同步真相源。busyIdx 是它的渲染投影，但点击处理必须读 ref：
  // 同一句连点两次时，第二次点击发生在 setBusyIdx 提交之前，读 state 会拿到旧值 -1，
  // 于是「再点一次停止」失效（表现为小喇叭一直转、停不下来）。
  const busyRef = useRef(-1)
  // 全局慢速开关：点词与整句共用同一套语速（TouchRead「same pronunciation profile」）
  const slow = useSlowMode()

  const sentences = useMemo(() => passage.paragraphs.flat(), [passage])
  // 每段的起始下标：朗读高亮要按「全篇第几句」定位，不能每格 indexOf 扫一遍
  const paraStart = useMemo(() => {
    const acc: number[] = []
    let n = 0
    for (const para of passage.paragraphs) {
      acc.push(n)
      n += para.length
    }
    return acc
  }, [passage])
  const lessonWords = useMemo(
    () => new Set(vocab.map((w) => w.en.toLowerCase())),
    [vocab]
  )

  const stop = () => {
    chainRef.current = false
    sentSid.current++
    busyRef.current = -1
    setPlaying(false)
    setNowIdx(-1)
    setBusyIdx(-1)
    cancelSpeech()
  }

  // 当前句滚到视口中间：长文朗读时「声音在第 8 句、眼睛还停在最后一句」很难受。
  // smooth 在 reduced-motion 下由浏览器自动降级，无需额外判断。
  const scrollToSent = (i: number) => {
    sentRefs.current[i]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  // 按句串行朗读：第 i 句播完（onEnd）接第 i+1 句；播到末尾自己收尾。
  // speakService 保证 onEnd 必达（请求级硬预算），所以这条链不会卡死。
  const playFrom = (i: number) => {
    if (i >= sentences.length) {
      chainRef.current = false
      setPlaying(false)
      setNowIdx(-1)
      return
    }
    setNowIdx(i)
    scrollToSent(i)
    speakText(cleanForSpeak(sentences[i].en), {
      slow,
      onStart: () => setPlaying(true),
      onEnd: () => { if (chainRef.current) playFrom(i + 1) },
    })
  }

  const playAll = () => {
    // 再点一次正在播的按钮 = 停止，别让孩子以为卡住了
    if (playing) { stop(); return }
    chainRef.current = true
    playFrom(0)
  }

  // 单独朗读某一句（逐句朗读）：和整篇连读**互锁**——先断链再起句。
  // 不能依赖「speakText 内部会抢占上一个会话」：它会**先同步触发**链上上一句的
  // onEnd，链内立刻 playFrom(i+1) 另起一个新会话；等外层回到 speakText 继续执行时，
  // 自己的 sid 已过期（guard 全失败）却把 activeEnd 覆盖成自己的 done。
  // 现象：孩子点的这一句不读，反而跳到下一句。
  const playOne = (i: number) => {
    // 再点一次正在播的这一句 = 停止。必须读 busyRef：读 busyIdx state 会因渲染未提交
    // 而拿到旧值，导致连点同句停不下来。
    if (busyRef.current === i) { stop(); return }
    if (chainRef.current) stop()
    const sid = ++sentSid.current
    busyRef.current = i
    setBusyIdx(i)
    scrollToSent(i)
    speakText(cleanForSpeak(sentences[i].en), {
      slow,
      onStart: () => { if (sentSid.current === sid) setPlaying(true) },
      onEnd: () => {
        if (sentSid.current !== sid) return
        busyRef.current = -1
        setBusyIdx(-1)
        if (!chainRef.current) setPlaying(false)
      },
    })
  }

  // 离开这一区/换课/卸载：立刻停声并断开串行链，否则会在别的 Tab 里继续念
  useEffect(() => {
    chainRef.current = false
    sentSid.current++
    busyRef.current = -1
    return () => { chainRef.current = false; cancelSpeech() }
  }, [passage])

  return (
    // is-playing：整篇/单句朗读中，用于 focus dimming（非当前句降到 32%）
    <div className={'reading-zone' + (playing ? ' is-playing' : '')}>
      <PlayTools hint="点单词听发音 · 金色波浪线的是本课学过的词（宝藏词）">
        <button type="button" className="btn btn--soft" onClick={playAll} data-testid="reading-play-all">
          {playing ? '⏸ 停止朗读' : '🔊 听整篇'}
        </button>
        <button
          type="button"
          className={'btn btn--soft' + (showZh ? ' active' : '')}
          onClick={() => setShowZh((v) => !v)}
          aria-pressed={showZh}
          data-testid="reading-zh-toggle"
        >
          {showZh ? '🇨🇳 隐藏中文' : '🇨🇳 显示中文'}
        </button>
      </PlayTools>

      <article className="reading-body">
        <h3 className="reading-title">
          {passage.title}
          <span className="reading-title-zh">{passage.titleZh}</span>
        </h3>

        {passage.paragraphs.map((para, pi) => (
          <div key={pi} className="reading-para">
            {para.map((s, si) => {
              const idx = paraStart[pi] + si
              const isNow = idx === nowIdx
              const isBusy = idx === busyIdx
              return (
                <div
                  key={si}
                  ref={(el) => { sentRefs.current[idx] = el }}
                  className={'reading-sent' + (isNow ? ' reading-sent--now' : '') + (isBusy ? ' reading-sent--busy' : '')}
                >
                  <div className="reading-sent-row">
                    <TappableWords
                      text={s.en}
                      vocab={vocab}
                      boxOf={boxOf}
                      mark={(base) => lessonWords.has(base)}
                    />
                    <button
                      type="button"
                      className={'reading-say' + (isBusy ? ' is-playing' : '')}
                      data-busy={isBusy ? '1' : '0'}
                      onClick={() => playOne(idx)}
                      aria-label={isBusy ? '停止朗读' : `朗读这一句`}
                      title={isBusy ? '停止朗读' : '朗读这一句'}
                    >
                      {isBusy ? '⏸' : '🔊'}
                    </button>
                  </div>
                  {showZh && <div className="reading-zh">{s.zh}</div>}
                </div>
              )
            })}
          </div>
        ))}
      </article>
    </div>
  )
}
