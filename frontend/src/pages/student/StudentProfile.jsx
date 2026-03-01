import React from 'react'
import { Layout } from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'

export const StudentProfile = () => {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="card p-4">
        <h5>Profile</h5>
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
