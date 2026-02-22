import React, { useEffect } from 'react'

export const SlideModal = ({
  open,
  onClose,
  title,
  width = 480,
  position = 'right',
  closeOnOverlay = true,
  showClose = true,
  footer = null,
  children,
}) => {
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <style>
        {`
          .slide-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(16, 24, 40, 0.55);
            z-index: 1050;
            display: flex;
            justify-content: ${position === 'left' ? 'flex-start' : 'flex-end'};
            align-items: stretch;
            backdrop-filter: blur(2px);
          }

          .slide-modal-panel {
            width: min(95vw, ${width}px);
            height: 100%;
            background: #ffffff;
            box-shadow: -8px 0 24px rgba(0, 0, 0, 0.15);
            transform: translateX(${position === 'left' ? '-100%' : '100%'});
            animation: slide-in 0.25s ease forwards;
            display: flex;
            flex-direction: column;
          }

          @keyframes slide-in {
            to { transform: translateX(0); }
          }

          .slide-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 20px;
            border-bottom: 1px solid #e9ecef;
            background: linear-gradient(135deg, #f8f9fa, #ffffff);
          }

          .slide-modal-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #2c3e50;
            margin: 0;
          }

          .slide-modal-close {
            border: none;
            background: transparent;
            font-size: 1.4rem;
            line-height: 1;
            color: #6c757d;
            cursor: pointer;
          }

          .slide-modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
          }

          .slide-modal-footer {
            padding: 16px 20px;
            border-top: 1px solid #e9ecef;
            background: #fafbfc;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }
        `}
      </style>
      <div
        className="slide-modal-overlay"
        onClick={closeOnOverlay ? onClose : undefined}
      >
        <div
          className="slide-modal-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="slide-modal-header">
            <h4 className="slide-modal-title">{title}</h4>
            {showClose && (
              <button className="slide-modal-close" onClick={onClose} aria-label="Close">
                ×
              </button>
            )}
          </div>
          <div className="slide-modal-body">{children}</div>
          {footer && <div className="slide-modal-footer">{footer}</div>}
        </div>
      </div>
    </>
  )
}
