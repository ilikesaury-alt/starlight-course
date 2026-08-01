import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  /** 出错时渲染的兜底内容；缺省时展示「回首页」童趣卡片 */
  fallback?: ReactNode;
  /** 仅用于标识包裹区域,便于排查问题,不参与渲染 */
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * 轻量错误边界:子组件抛错时只卸载自己,不影响整个页面。
 * 主要用于包裹发音按钮等可能在不稳定浏览器上抛错的组件。
 * 出错时默认展示可操作的童趣兜底卡片（含「回首页」按钮），避免整屏白屏。
 */
export default class SafeBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // 静默处理,避免控制台噪声掩盖真正的问题
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div className="safe-boundary" role="alert">
        <div className="safe-boundary-emoji">🛠️</div>
        <h2 className="safe-boundary-title">哎呀，这里打了个盹儿～</h2>
        <p>再试一次，或者回到首页重新开始吧！</p>
        <div className="safe-boundary-actions">
          <button
            type="button"
            className="btn btn-soft"
            onClick={() => this.setState({ hasError: false })}
          >
            🔁 再试一次
          </button>
          <Link to="/" className="btn">🏠 回首页</Link>
        </div>
      </div>
    );
  }
}
