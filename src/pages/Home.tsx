import { Link } from 'react-router-dom'
import { modules } from '@/data/starlight'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">课前预习 · 课后复习</h1>
        <p className="hero-sub">
          配合一对一菲教课，每单元都有 <b>预习导学</b>、<b>单词卡</b>、<b>句型对话</b>、<b>互动测验</b>。
        </p>
        <div className="hero-tags">
          <span>👂 听</span>
          <span>👄 说</span>
          <span>📖 读</span>
          <span>✍️ 写</span>
        </div>
      </section>

      <h2 className="section-title">快速入口</h2>
      <div className="quick-row">
        <Link to="/preview" className="quick-card">📖 课前预习</Link>
        <Link to="/review" className="quick-card">🔁 课后复习</Link>
      </div>
      <div className="quick-row" style={{ marginTop: '12px' }}>
        <Link to="/alphabet" className="quick-card">🔤 字母表</Link>
        <Link to="/progress" className="quick-card">📊 学习进度</Link>
      </div>

      <h2 className="section-title">12 个学习模块</h2>
      <div className="module-grid">
        {modules.map((m) => (
          <Link key={m.id} to={`/preview/${m.slug}`} className="module-card" style={{ '--mc': m.color } as React.CSSProperties}>
            <div className="module-emoji">{m.emoji}</div>
            <div className="module-info">
              <div className="module-num">Module {m.id}</div>
              <div className="module-title">{m.title}</div>
              <div className="module-zh">{m.titleZh}</div>
            </div>
            <div className="module-arrow">›</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
