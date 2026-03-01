import React from 'react'
import { Layout } from '../../components/layout/Layout'

export const TeacherAssignments = () => {
  return (
    <Layout>
      <style>
        {`
          .empty-card {
            background: #fff;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .page-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 16px;
          }
        `}
      </style>

      <div className="page-title">
        <i className="fas fa-tasks mr-2 text-info"></i>
        Assignments
      </div>

      <div className="empty-card">
        <i className="fas fa-clipboard-list fa-2x mb-3 text-muted"></i>
        <div className="text-muted">Assignments module is coming soon.</div>
      </div>
    </Layout>
  )
}
