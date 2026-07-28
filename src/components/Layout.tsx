import { Link, NavLink } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { to: '/', label: '首页', emoji: '🏠', end: true },
    { to: '/alphabet', label: '字母', emoji: '🔤', end: false },
    { to: '/progress', label: '进度', emoji: '📊', end: false },
  ]

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="brand-star">★</span>
          <span className="brand-text">Starlight 学习伙伴</span>
        </Link>
        <span className="brand-sub">预备级 · 一对一菲教</span>
      </header>

      <main className="app-main">{children}</main>

      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              'bottom-nav-item' + (isActive ? ' active' : '')
            }
          >
            <span className="nav-emoji">{item.emoji}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
