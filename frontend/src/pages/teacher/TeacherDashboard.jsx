// src/pages/teacher/TeacherDashboard.jsx
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import api from '../../services/api';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/classrooms');
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <style>
        {`
          .teacher-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2c3e50;
          }

          .stat-card {
            border: none;
            border-radius: 14px;
            color: #fff;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          }

          .stat-card .card-body {
            padding: 20px;
          }

          .stat-card .stat-icon {
            opacity: 0.5;
          }
        `}
      </style>

      {loading ? (
        <LoadingScreen label="Loading teacher dashboard..." />
      ) : (
        <>
          <div className="mb-4">
            <div className="teacher-title">
              <i className="fas fa-chalkboard-teacher mr-2 text-info"></i>
              Teacher Dashboard
            </div>
            <div className="text-muted">Welcome back, {user?.name}</div>
          </div>

          <div className="row mb-4">
            <div className="col-12 col-md-4 mb-3">
              <div className="card stat-card" style={{ backgroundColor: '#58C1C2' }}>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50">My Classes</div>
                    <div className="h2 mb-0">{classes.length}</div>
                  </div>
                  <i className="fas fa-chalkboard fa-3x stat-icon"></i>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <div className="card stat-card" style={{ backgroundColor: '#989EFD' }}>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50">Assignments</div>
                    <div className="h2 mb-0">0</div>
                  </div>
                  <i className="fas fa-tasks fa-3x stat-icon"></i>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <div className="card stat-card" style={{ backgroundColor: '#047BFB' }}>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50">Students</div>
                    <div className="h2 mb-0">0</div>
                  </div>
                  <i className="fas fa-user-graduate fa-3x stat-icon"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="fas fa-info-circle mr-2 text-info"></i>
                Account Information
              </h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <th style={{ width: '140px' }}>ID</th>
                    <td>{user?.id}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{user?.name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>
                    <th>Role</th>
                    <td>
                      <span className="badge badge-info badge-pill px-3 py-2">
                        {user?.role}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};
