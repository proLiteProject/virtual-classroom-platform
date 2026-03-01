import React from 'react'
import { Layout } from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'

export const TeacherProfile = () => {
  const { user } = useAuth()

  return (
    <Layout>
      <style>
        {`
          .page-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 16px;
          }

          .profile-card {
            background: #fff;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
        `}
      </style>

      <div className="page-title">
        <i className="fas fa-user mr-2 text-info"></i>
        Profile
      </div>

      <div className="profile-card">
        <table className="table table-borderless mb-0">
          <tbody>
            <tr>
              <th style={{ width: '140px' }}>Name</th>
              <td>{user?.name || '-'}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user?.email || '-'}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{user?.role || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
