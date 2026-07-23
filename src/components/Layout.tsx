import { Link, NavLink } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="brand-star">★</span>
          <span className="brand-text">Starlight 学习伙伴</span>
        </Link>
        <span className="brand-sub">预备级 · 一对一菲教</span>
      </header>

      <nav className="topnav">
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          首页
        </NavLink>
        <NavLink to="/preview" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          预习
        </NavLink>
        <NavLink to="/review" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          复习
        </NavLink>
        <NavLink to="/alphabet" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          字母
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          进度
        </NavLink>
      </nav>

      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        <span>Starlight Starter · 预习 + 复习 · 点击 🔊 听发音</span>
      </footer>
    </div>
  )
}
