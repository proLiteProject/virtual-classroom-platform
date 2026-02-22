import React, { useEffect } from 'react'

export const ConfirmDialog = ({
  open,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  closeOnOverlay = true,
}) => {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <>
      <style>
        {`
          .confirm-overlay {
            position: fixed;
            inset: 0;
            background: rgba(16, 24, 40, 0.55);
            z-index: 1060;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            backdrop-filter: blur(2px);
          }

          .confirm-card {
            width: min(92vw, 420px);
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 14px 40px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            animation: pop-in 0.2s ease;
          }

          @keyframes pop-in {
            from { transform: scale(0.98); opacity: 0.5; }
            to { transform: scale(1); opacity: 1; }
          }

          .confirm-header {
            padding: 16px 18px;
            background: linear-gradient(135deg, #fff5f5, #ffffff);
            border-bottom: 1px solid #f1f3f5;
          }

          .confirm-title {
            margin: 0;
            font-size: 1.05rem;
            font-weight: 700;
            color: #2c3e50;
          }

          .confirm-body {
            padding: 16px 18px;
            color: #495057;
            font-size: 0.95rem;
          }

          .confirm-footer {
            padding: 14px 18px 18px;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }
        `}
      </style>
      <div className="confirm-overlay" onClick={closeOnOverlay ? onCancel : undefined}>
        <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
          <div className="confirm-header">
            <h5 className="confirm-title">{title}</h5>
          </div>
          <div className="confirm-body">{message}</div>
          <div className="confirm-footer">
            <button className="btn btn-outline-secondary btn-sm" onClick={onCancel} disabled={loading}>
              {cancelText}
            </button>
            <button className="btn btn-danger btn-sm" onClick={onConfirm} disabled={loading}>
              {loading ? 'Please wait...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
