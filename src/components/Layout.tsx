import { Link, NavLink } from 'react-router-dom'
import { House, BookOpen, Type, ChartColumn, Sparkles, Lock, Unlock } from 'lucide-react'
import { useViewMode } from '@/hooks/useViewMode'

// 主导航项（桌面：顶栏横排；窄屏：底部图标栏）
const navItems = [
  { to: '/', label: '首页', icon: House, end: true },
  { to: '/courses', label: '课程', icon: BookOpen, end: false },
  { to: '/alphabet', label: '字母', icon: Type, end: false },
  { to: '/progress', label: '进度', icon: ChartColumn, end: false },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  // 「孩子 / 家长」模式。默认孩子模式；切换入口是顶栏右侧角落的小锁 ——
  // 不放进主导航：那是孩子每天要点的四个位置，塞一个家长开关进去会稀释它。
  // 也不做密码：这是产品分层不是安全边界（详见 data/viewMode.ts 头注释）。
  const [mode, setMode] = useViewMode()
  const isParent = mode === 'parent'

  return (
    <div className="app" data-mode={mode}>
      {/* 顶栏：品牌字标 + 主导航（桌面）；窄屏只留字标，导航移到底部 */}
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Sparkles size={19} strokeWidth={2.2} />
          </span>
          <span className="brand-text">Starlight 学习伙伴</span>
        </Link>

        {/* 家长模式标记 + 角落切换：家长模式开着时给一条明确的横幅，
            免得家长做完设置忘了切回去，孩子下次打开看到的是家长界面。 */}
        <button
          type="button"
          className={'mode-toggle' + (isParent ? ' is-parent' : '')}
          onClick={() => setMode(isParent ? 'kid' : 'parent')}
          title={isParent ? '回到孩子模式' : '家长设置'}
          aria-label={isParent ? '回到孩子模式' : '进入家长模式'}
          aria-pressed={isParent}
        >
          {isParent ? <Unlock size={15} strokeWidth={2.1} /> : <Lock size={15} strokeWidth={2.1} />}
          {/* 孩子模式下只说「家长」两个字（小、安静），进去后变成明确的「退出家长」，
              让家长一眼知道当前在哪个模式、怎么回去。 */}
          <span className="mode-toggle-text">{isParent ? '退出家长' : '家长'}</span>
        </button>

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
