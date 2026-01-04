import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import api from '../../services/api'

export const ManageRole = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/manage-role');
      setUsers(response.data.data.userData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  let editTrigger = async (user) => {
    console.log(user);
  };

  let deleteTriggger = async (user) => {
    console.log(user);
  };

  const adminUsers = users.filter(u => u.role === 'ADMIN');
  const teacherUsers = users.filter(u => u.role === 'TEACHER');
  const studentUsers = users.filter(u => u.role === 'STUDENT');

  return (
    <Layout>
      <style>
        {`
          .role-section {
            margin-bottom: 40px;
          }

          .role-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid;
          }

          .role-header.admin {
            border-color: #047BFB;
          }

          .role-header.teacher {
            border-color: #58C1C2;
          }

          .role-header.student {
            border-color: #989EFD;
          }

          .role-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
          }

          .role-icon.admin {
            background: linear-gradient(135deg, #047BFB, #0056b3);
          }

          .role-icon.teacher {
            background: linear-gradient(135deg, #58C1C2, #3a9a9b);
          }

          .role-icon.student {
            background: linear-gradient(135deg, #989EFD, #6f5dd3);
          }

          .role-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin: 0;
          }

          .role-count {
            background: #f8f9fa;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            color: #495057;
          }

          .styled-table {
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            background: white;
          }

          .styled-table thead {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          }

          .styled-table thead th {
            padding: 16px;
            font-weight: 600;
            color: #495057;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
            border: none;
          }

          .styled-table tbody td {
            padding: 16px;
            color: #495057;
            border-bottom: 1px solid #f1f3f5;
            vertical-align: middle;
          }

          .styled-table tbody tr:last-child td {
            border-bottom: none;
          }

          .styled-table tbody tr:hover {
            background: #f8f9fa;
            transition: all 0.2s ease;
          }

          .user-name1 {
            font-weight: 600;
            color: #2c3e50;
          }

          .user-email {
            color: #6c757d;
            font-size: 0.9rem;
          }

          .badge-qualification {
            background: #e7f3ff;
            color: #0066cc;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
          }

          .loading-spinner {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
          }

          .empty-state {
            text-align: center;
            padding: 40px;
            color: #6c757d;
          }

          .empty-state i {
            font-size: 3rem;
            opacity: 0.3;
            margin-bottom: 15px;
          }

          @media (max-width: 768px) {
            .role-header {
              flex-wrap: wrap;
            }

            .role-title {
              font-size: 1.2rem;
            }

            .styled-table {
              font-size: 0.85rem;
            }

            .styled-table thead th,
            .styled-table tbody td {
              padding: 10px;
            }
          }
        `}
      </style>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* ADMIN Section */}
          <div className="role-section">
            <div className="role-header admin">
              <div className="role-icon admin">
                <i className="fas fa-user-shield"></i>
              </div>
              <h3 className="role-title">Administrators</h3>
              <span className="role-count">{adminUsers.length} users</span>
            </div>
            {adminUsers.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th><i className="fas fa-user mr-2"></i>Name</th>
                    <th><i className="fas fa-envelope mr-2"></i>Email</th>
                    <th><i className="fas fa-graduation-cap mr-2"></i>Qualification</th>
                    <th><i className="fas fa-calendar mr-2"></i>Joined</th>
                    <th><i className="fas fa-eye mr-2"></i>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="user-name1">{user.name}</td>
                      <td className="user-email">{user.email}</td>
                      <td><span className="badge-qualification">{user.qualification}</span></td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => editTrigger(user)} className='btn btn-outline-success btn-sm'><i className="fas fa-pencil"></i></button>
                        <button onClick={() => deleteTriggger(user)} className='btn btn-outline-danger btn-sm ml-2'><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <i className="fas fa-user-shield"></i>
                <p>No administrators found</p>
              </div>
            )}
          </div>

          {/* TEACHER Section */}
          <div className="role-section">
            <div className="role-header teacher">
              <div className="role-icon teacher">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3 className="role-title">Teachers</h3>
              <span className="role-count">{teacherUsers.length} users</span>
            </div>
            {teacherUsers.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th><i className="fas fa-user mr-2"></i>Name</th>
                    <th><i className="fas fa-envelope mr-2"></i>Email</th>
                    <th><i className="fas fa-graduation-cap mr-2"></i>Qualification</th>
                    <th><i className="fas fa-calendar mr-2"></i>Joined</th>
                    <th><i className="fas fa-eye mr-2"></i>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="user-name1">{user.name}</td>
                      <td className="user-email">{user.email}</td>
                      <td><span className="badge-qualification">{user.qualification}</span></td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => editTrigger(user)} className='btn btn-outline-success btn-sm'><i className="fas fa-pencil"></i></button>
                        <button onClick={() => deleteTriggger(user)} className='btn btn-outline-danger btn-sm ml-2'><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <i className="fas fa-chalkboard-teacher"></i>
                <p>No teachers found</p>
              </div>
            )}
          </div>

          {/* STUDENT Section */}
          <div className="role-section">
            <div className="role-header student">
              <div className="role-icon student">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3 className="role-title">Students</h3>
              <span className="role-count">{studentUsers.length} users</span>
            </div>
            {studentUsers.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th><i className="fas fa-id-card mr-2"></i>Roll No</th>
                    <th><i className="fas fa-user mr-2"></i>Name</th>
                    <th><i className="fas fa-envelope mr-2"></i>Email</th>
                    <th><i className="fas fa-phone mr-2"></i>Phone</th>
                    <th><i className="fas fa-calendar mr-2"></i>Joined</th>
                    <th><i className="fas fa-eye mr-2"></i>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentUsers.map((user, index) => (
                    <tr key={index}>
                      <td><strong>{user.roll_no}</strong></td>
                      <td className="user-name1">{user.name}</td>
                      <td className="user-email">{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => editTrigger(user)} className='btn btn-outline-success btn-sm'><i className="fas fa-pencil"></i></button>
                        <button onClick={() => deleteTriggger(user)} className='btn btn-outline-danger btn-sm ml-2'><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <i className="fas fa-user-graduate"></i>
                <p>No students found</p>
              </div>
              )}
          </div>
        </>
      )}
    </Layout>
  )
}