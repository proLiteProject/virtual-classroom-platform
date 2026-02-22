import React from 'react'

export const LoadingScreen = ({ label = 'Loading...' }) => {
  return (
    <>
      <style>
        {`
          .loading-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            min-height: 400px;
            gap: 12px;
          }

          .loading-ring {
            width: 56px;
            height: 56px;
            border: 4px solid #e9ecef;
            border-top-color: #047bfb;
            border-radius: 50%;
            animation: spin 0.9s linear infinite;
          }

          .loading-label {
            font-size: 0.95rem;
            color: #6c757d;
            font-weight: 600;
            letter-spacing: 0.2px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className="loading-screen">
        <div className="loading-ring" />
        <div className="loading-label">{label}</div>
      </div>
    </>
  )
}
