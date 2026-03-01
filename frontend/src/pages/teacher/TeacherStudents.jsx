import React from 'react'
import { Layout } from '../../components/layout/Layout'

export const TeacherStudents = () => {
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
        <i className="fas fa-user-graduate mr-2 text-info"></i>
        Students
      </div>

      <div className="empty-card">
        <i className="fas fa-users fa-2x mb-3 text-muted"></i>
        <div className="text-muted">Student list will appear here.</div>
      </div>
    </Layout>
  )
}
