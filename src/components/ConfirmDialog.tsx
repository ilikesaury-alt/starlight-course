// 儿童友好确认弹窗：替代原生 window.confirm。
// 大按钮 + emoji + 童语文案，降低低龄用户误触不可逆操作的概率。
// 用法：父组件维护 open 状态，onConfirm / onCancel 分别处理确定与取消。

interface ConfirmDialogProps {
  open: boolean
  emoji?: string
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  /** 危险操作（清空/重置）用红色确认钮 */
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  emoji = '🤔',
  title,
  message,
  confirmText = '好的',
  cancelText = '先不啦',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-emoji">{emoji}</div>
        <h2 className="confirm-title">{title}</h2>
        {message && <p className="confirm-message">{message}</p>}
        <div className="confirm-actions">
          <button type="button" className="btn btn-soft" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={danger ? 'btn btn-danger' : 'btn btn-sun'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
