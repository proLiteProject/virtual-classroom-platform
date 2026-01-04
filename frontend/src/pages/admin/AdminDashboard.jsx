// src/pages/admin/AdminDashboard.jsx
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teacherCount: 0,
    studentCount: 0,
    classCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/table-data-count');

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <style>
        {`
          .dashboard-header {
            margin-bottom: 30px;
          }

          .dashboard-title {
            font-size: 2rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
          }

          .dashboard-subtitle {
            color: #7f8c8d;
            font-size: 1rem;
          }

          .stat-card {
            border-radius: 16px;
            border: none;
            transition: all 0.3s ease;
            height: 100%;
            margin-bottom: 20px;
          }

          .stat-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          }

          .stat-card .card-body {
            padding: 25px;
          }

          .stat-icon {
            opacity: 0.3;
          }

          .info-card {
            border-radius: 16px;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .info-card .card-header {
            background: white;
            border-bottom: 2px solid #f0f0f0;
            border-radius: 16px 16px 0 0;
            padding: 20px 25px;
          }

          .info-card .card-body {
            padding: 25px;
          }

          .info-table th {
            color: #7f8c8d;
            font-weight: 600;
            padding: 12px 0;
            width: 150px;
          }

          .info-table td {
            color: #2c3e50;
            padding: 12px 0;
          }

          .role-badge {
            font-size: 0.9rem;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(4, 123, 251, 0.3);
          }

          /* Mobile Responsive Styles */
          @media (max-width: 768px) {
            .dashboard-title {
              font-size: 1.5rem;
            }

            .dashboard-title i {
              font-size: 1.3rem;
            }

            .dashboard-subtitle {
              font-size: 0.9rem;
            }

            .stat-card {
              margin-bottom: 15px;
            }

            .stat-card .card-body {
              padding: 20px;
            }

            .stat-card h2 {
              font-size: 2rem;
            }

            .stat-card h6 {
              font-size: 0.85rem;
            }

            .stat-icon {
              font-size: 2rem !important;
            }

            .info-card .card-header {
              padding: 15px 20px;
            }

            .info-card .card-header h5 {
              font-size: 1rem;
            }

            .info-card .card-body {
              padding: 20px;
            }

            .info-table {
              font-size: 0.9rem;
            }

            .info-table th {
              width: 100px;
              padding: 10px 0;
            }

            .info-table td {
              padding: 10px 0;
              word-break: break-word;
            }

            .role-badge {
              font-size: 0.8rem;
              padding: 6px 12px;
            }
          }

          /* Small phones */
          @media (max-width: 480px) {
            .dashboard-header {
              margin-bottom: 20px;
            }

            .dashboard-title {
              font-size: 1.3rem;
            }

            .stat-card h2 {
              font-size: 1.8rem;
            }

            .stat-card h6 {
              font-size: 0.8rem;
            }

            .stat-card .card-body {
              padding: 15px;
            }

            .info-table {
              font-size: 0.85rem;
            }

            .info-table th {
              width: 80px;
            }
          }

          /* Tablet */
          @media (min-width: 769px) and (max-width: 1024px) {
            .dashboard-title {
              font-size: 1.8rem;
            }

            .stat-card .card-body {
              padding: 22px;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <i className="fas fa-tachometer-alt mr-2 mr-md-3" style={{ color: '#047BFB' }}></i>
          Admin Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Welcome back, {user?.name}! Here's what's happening today.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
          <button
            type="button"
            className="close"
            onClick={() => setError('')}
          >
            <span>&times;</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading statistics...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4 mt-2">
              <div className="stat-card card text-white" style={{ backgroundColor: '#047BFB' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-2" style={{ opacity: 0.9 }}>Total Classrooms</h6>
                      <h2 className="mb-0 font-weight-bold">{stats.classCount}</h2>
                    </div>
                    <i className="fas fa-chalkboard fa-3x stat-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4 mt-2">
              <div className="stat-card card text-white" style={{ backgroundColor: '#58C1C2' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-2" style={{ opacity: 0.9 }}>Total Teachers</h6>
                      <h2 className="mb-0 font-weight-bold">{stats.teacherCount}</h2>
                    </div>
                    <i className="fas fa-chalkboard-teacher fa-3x stat-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4 mt-2">
              <div className="stat-card card text-white" style={{ backgroundColor: '#989EFD' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-2" style={{ opacity: 0.9 }}>Total Students</h6>
                      <h2 className="mb-0 font-weight-bold">{stats.studentCount}</h2>
                    </div>
                    <i className="fas fa-user-graduate fa-3x stat-icon"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card info-card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-user-circle mr-2" style={{ color: '#047BFB' }}></i>
                    Account Information
                  </h5>
                </div>
                <div className="card-body">
                  <table className="table table-borderless info-table mb-0">
                    <tbody>
                      <tr>
                        <th>
                          <i className="fas fa-envelope mr-2"></i>
                          Email
                        </th>
                        <td>{user?.email}</td>
                      </tr>
                      <tr>
                        <th>
                          <i className="fas fa-user mr-2"></i>
                          Name
                        </th>
                        <td>{user?.name}</td>
                      </tr>
                      <tr>
                        <th>
                          <i className="fas fa-id-badge mr-2"></i>
                          Role
                        </th>
                        <td>
                          <span className="badge badge-primary role-badge">
                            <i className="fas fa-shield-alt mr-2"></i>
                            {user?.role}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};