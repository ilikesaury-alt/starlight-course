import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import SafeBoundary from '@/components/SafeBoundary'
import { phraseCategories } from '@/data/phrases'
import { moduleThemeVars } from '@/utils/theme'

const THEME = { color: '#fb7185', colorSoft: '#ffe4e6' }

export default function PhrasesPage() {
  const [activeId, setActiveId] = useState(phraseCategories[0].id)
  const cat = phraseCategories.find((c) => c.id === activeId) ?? phraseCategories[0]
  const idx = phraseCategories.findIndex((c) => c.id === activeId)
  const prev = phraseCategories[idx - 1]
  const next = phraseCategories[idx + 1]

  const listTopRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeId])

  return (
    <div className="page phrases" style={moduleThemeVars(THEME)}>
      <div className="page-head phrases-hero">
        <span className="page-emoji">🗣️</span>
        <div>
          <div className="page-kicker">Teacher Talk</div>
          <h1 className="page-title">菲教课堂用语</h1>
          <div className="ph-hero-sub">点句子听外教怎么说 · 每天上课前熟悉几句</div>
        </div>
      </div>

      <SafeBoundary label="课堂用语">
        <p className="lead phrases-lead">
          选中一类，点 🔊 跟读。中文意思就在下面，让孩子上课不慌张。
        </p>

        <div className="ph-tabbar" role="tablist" aria-label="课堂用语分类">
          {phraseCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === activeId}
              className={`ph-tab${c.id === activeId ? ' active' : ''}`}
              onClick={() => setActiveId(c.id)}
            >
              <span className="ph-tab-emoji">{c.emoji}</span>
              <span className="ph-tab-text">{c.shortZh}</span>
              {c.id === activeId && <span className="ph-tab-spark">✨</span>}
            </button>
          ))}
        </div>

        <div className="ph-cat-head" ref={listTopRef}>
          <span className="ph-cat-emoji">{cat.emoji}</span>
          <div className="ph-cat-text">
            <div className="ph-cat-title">{cat.title}</div>
            <div className="ph-cat-sub">
              {cat.zh} · {cat.items.length} 句
            </div>
          </div>
        </div>

        <ul className="ph-list">
          {cat.items.map((it, i) => (
            <li key={i} className="ph-row">
              <div className="ph-row-main">
                <span className="ph-num">{i + 1}</span>
                <span className="ph-en-text">{it.en}</span>
                <SpeakButton text={it.en} label={it.en} slow />
              </div>
              <div className="ph-zh">{it.zh}</div>
              {it.tip && <div className="ph-tip">💡 {it.tip}</div>}
            </li>
          ))}
        </ul>

        <div className="ph-switch">
          <button
            type="button"
            className="ph-switch-btn ph-switch-btn--prev"
            disabled={!prev}
            onClick={() => prev && setActiveId(prev.id)}
          >
            <span className="ph-switch-arrow">←</span>
            <span className="ph-switch-label">
              {prev ? (
                <>
                  <span className="ph-switch-emoji">{prev.emoji}</span>
                  {prev.shortZh}
                </>
              ) : (
                '已经是第一个'
              )}
            </span>
          </button>
          <button
            type="button"
            className="ph-switch-btn ph-switch-btn--next"
            disabled={!next}
            onClick={() => next && setActiveId(next.id)}
          >
            <span className="ph-switch-label">
              {next ? (
                <>
                  <span className="ph-switch-emoji">{next.emoji}</span>
                  {next.shortZh}
                </>
              ) : (
                '已经是最后一个'
              )}
            </span>
            <span className="ph-switch-arrow">→</span>
          </button>
        </div>
      </SafeBoundary>

      <div className="ph-home">
        <Link to="/" className="ph-home-link">
          ← 返回首页
        </Link>
      </div>
    </div>
  )
}
