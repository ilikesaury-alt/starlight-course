import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** 出错时渲染的兜底内容,默认 null */
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
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
