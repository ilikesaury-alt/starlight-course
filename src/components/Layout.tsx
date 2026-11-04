import { Link, NavLink } from 'react-router-dom'
import { House, BookOpen, Type, ChartColumn, Sparkles } from 'lucide-react'

// 主导航项（桌面：顶栏横排；窄屏：底部图标栏）
const navItems = [
  { to: '/', label: '首页', icon: House, end: true },
  { to: '/courses', label: '课程', icon: BookOpen, end: false },
  { to: '/alphabet', label: '字母', icon: Type, end: false },
  { to: '/progress', label: '进度', icon: ChartColumn, end: false },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      {/* 顶栏：品牌字标 + 主导航（桌面）；窄屏只留字标，导航移到底部 */}
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Sparkles size={19} strokeWidth={2.2} />
          </span>
          <span className="brand-text">Starlight 学习伙伴</span>
        </Link>

        <nav className="app-nav" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'app-nav-link' + (isActive ? ' is-active' : '')}
            >
              <item.icon size={17} strokeWidth={1.9} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-main">{children}</main>

      {/* 底部图标栏：只在窄屏出现（桌面由顶栏导航承担） */}
      <nav className="bottom-nav" aria-label="底部导航">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              'bottom-nav-item' + (isActive ? ' active' : '')
            }
          >
            <item.icon size={21} strokeWidth={1.9} className="nav-icon" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
