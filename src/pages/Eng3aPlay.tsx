// 英语小剧场（板块首页）：教材附录 three plays 的入口页。
// 剧本是「读」的，不是「做题」的 —— 所以这里的互动只有两件事：
// 选角色、逐句跟着念。完成状态复用英语模块已有的打卡/完成字段
// （key 直接用剧本 slug），不需要新增 store 字段。

import { Link } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import { eng3aPlays, ENG3A_THEME } from '@/data/eng3a'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

export default function Eng3aPlay() {
  const recite = useCourseStore((s) => s.eng3aRecite)
  const completed = useCourseStore((s) => s.completedEng3a)

  return (
    <div className="page en3-play-index" style={moduleThemeVars(ENG3A_THEME)}>
      <div className="page-head" style={moduleThemeVars(ENG3A_THEME)}>
        <span className="page-emoji">🎭</span>
        <div>
          <div className="page-kicker">English Theatre</div>
          <h1 className="page-title">英语小剧场</h1>
        </div>
      </div>

      <p className="lead">
        课本最后有三出小戏。挑一个角色，跟着念台词 —— 念熟了就和爸爸妈妈演一遍，
        英语会记得特别牢。
      </p>

      <SafeBoundary label="剧本列表">
        <div className="en3-play-list">
          {eng3aPlays.map((p) => {
            const read = (recite[p.slug]?.length ?? 0) > 0
            const done = completed.includes(p.slug)
            return (
              <Link
                key={p.slug}
                to={`/eng3a/play/${p.slug}`}
                className="en3-play-card"
                style={moduleThemeVars(p.theme)}
              >
                <span className="en3-play-emoji">{p.emoji}</span>
                <div className="en3-play-body">
                  <div className="en3-play-title">{p.title}</div>
                  <div className="en3-play-zh">{p.titleZh}</div>
                  <div className="en3-play-chars">
                    {p.characters.map((c) => (
                      <span key={c} className="en3-play-char">
                        {p.charactersZh[c] ?? c}
                      </span>
                    ))}
                  </div>
                  <div className="en3-play-meta">
                    🎬 {p.lines.length} 句台词 · 🔤 {p.words.length} 个重点词
                  </div>
                  <div className="en3-play-moral">💡 {p.moral}</div>
                </div>
                <div className="en3-play-status">
                  {done && <span className="cn-done">🎓演</span>}
                  {read && <span className="cn-done">✅读</span>}
                  <span className="en3-play-arrow">›</span>
                </div>
              </Link>
            )
          })}
        </div>
      </SafeBoundary>

      <div className="page-nav">
        <Link to="/eng3a" className="back-link">← 英语课程</Link>
        <Link to="/smart" className="back-link">🧠 去复习英语单词</Link>
      </div>
    </div>
  )
}
