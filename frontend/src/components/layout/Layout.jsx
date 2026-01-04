// src/components/layout/Layout.jsx
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  return (
    <>
      <style>
        {`
          .main-content {
            margin-left: 260px;
            min-height: 100vh;
            background-color: #f8f9fa;
            transition: margin-left 0.3s ease;
          }

          .content-wrapper {
            padding: 30px;
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .main-content {
              margin-left: 0;
              padding-top: 80px; /* Space for mobile menu button */
            }

            .content-wrapper {
              padding: 20px 15px;
            }
          }

          /* Tablet */
          @media (min-width: 769px) and (max-width: 1024px) {
            .main-content {
              margin-left: 220px;
            }

            .content-wrapper {
              padding: 25px 20px;
            }
          }

          /* Small phones */
          @media (max-width: 480px) {
            .content-wrapper {
              padding: 15px 10px;
            }
          }
        `}
      </style>

      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </>
  );
};