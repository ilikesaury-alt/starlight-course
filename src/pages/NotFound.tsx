// 兜底页：路径不匹配时显示，而不是留一片白屏。
// 面向儿童：大白话 + 两个明确出口（回首页 / 看课程），不出现技术术语。

import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <div className="home en3-notfound">
      <section className="hero">
        <div className="hero-emoji">🧭</div>
        <h1 className="hero-title">这一页走丢了</h1>
        <p className="hero-sub">
          没有找到这个地址：<code className="en3-notfound-path">{pathname}</code>
          <br />
          它可能被改过名字，或者链接打错了。别急，从下面回去就好。
        </p>
      </section>

      <div className="page-nav">
        <Link to="/" className="back-link">← 回首页</Link>
        <Link to="/courses" className="back-link">看看全部课程 →</Link>
      </div>
    </div>
  )
}
