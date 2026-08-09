// 原文阅读视图：Fly Guy / Rocket Girl 的「绘本原文」与 Starlight 的「课本原文」共用。
// 逐词可点（点单词听发音、悬停看中文），整句可朗读；句子中文优先用数据里的 textZh，
// 没有时退化成逐词词典拼出的粗略释义，保证任何一句都有中文提示。

import SpeakButton from './SpeakButton'
import { speakText } from '@/utils/speak'
import { lookupZh, wordBase, cleanForSpeak } from '@/utils/bookDict'
import type { BookTextChapter } from '@/data/story-types'

interface Props {
  chapters: BookTextChapter[]
  mc: React.CSSProperties
  /** 顶部说明文字，不同模块文案不同 */
  lead?: React.ReactNode
  /** 是否显示 p.N 页码（课本原文页码意义不大时可关掉） */
  showPageNum?: boolean
}

export default function BookTextView({ chapters, mc, lead, showPageNum = true }: Props) {
  if (!chapters || chapters.length === 0) {
    return <div className="empty"><p>这一课还没有原文内容。</p></div>
  }

  return (
    <>
      {lead && <p className="lead">{lead}</p>}
      <div className="book-original">
        {chapters.map((ch, ci) => (
          <section key={ci} className="bo-chapter">
            {ch.chapter && (
              <h3 className="bo-chapter-title">
                <span className="bo-chapter-en">{ch.chapter}</span>
                {ch.chapterZh && <span className="bo-chapter-zh">{ch.chapterZh}</span>}
                <SpeakButton text={ch.chapter} label="听指令" />
              </h3>
            )}
            <div className="bo-pages">
              {ch.pages.map((p, pi) => {
                const toks = p.text.split(/\s+/).filter(Boolean).map((tk) => ({ tk, zh: lookupZh(wordBase(tk)) }))
                const autoZh = p.textZh ? null : toks.map((t) => t.zh).filter(Boolean).join(' ')
                return (
                  <div key={pi} className="bo-page" style={mc}>
                    <div className="bo-page-head">
                      {showPageNum && p.page != null && <span className="bo-page-num">p.{p.page}</span>}
                      <SpeakButton text={p.text} label="听原文" />
                    </div>
                    <p className="bo-text">
                      {toks.map((t, j) => (
                        <span
                          key={j}
                          className="rg-word-inline"
                          onClick={() => speakText(cleanForSpeak(t.tk))}
                          title={t.zh ? `${t.zh}（点击听发音）` : '点击听发音'}
                          {...(t.zh ? { 'data-zh': t.zh } : {})}
                        >
                          {t.tk}
                        </span>
                      ))}
                    </p>
                    {p.textZh ? (
                      <p className="bo-text-zh">{p.textZh}</p>
                    ) : autoZh ? (
                      <p className="bo-text-zh bo-text-zh--auto">{autoZh}</p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
