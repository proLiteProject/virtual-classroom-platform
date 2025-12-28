// src/pages/admin/AdminDashboard.jsx
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.CHOOSE_ROLE);
  };

  return (
    <>
    <style>
        {`
          .admin-navbar {
            background-color: #ffffff;
            margin: 16px;
            padding: 14px 20px;
            border-radius: 14px;
            box-shadow:
              0 8px 20px rgba(0, 0, 0, 0.12),
              0 2px 6px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease-in-out;
          }

          .admin-navbar:hover {
            box-shadow:
              0 12px 28px rgba(0, 0, 0, 0.16),
              0 4px 10px rgba(0, 0, 0, 0.1);
          }

          .admin-navbar .navbar-brand i,
          .admin-navbar .welcome i {
            color: #0d6efd;
          }

          .logout-btn {
            box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
          }
          .shadow-custom {
            border-radius: 16px;
            border: none;
            background-color: #ffffff;

            /* Bulged shadow */
            box-shadow:
              0 10px 26px rgba(0, 0, 0, 0.12),
              0 4px 10px rgba(0, 0, 0, 0.08);

            transition: all 0.3s ease;
          }

          .shadow-custom:hover {
            transform: translateY(-4px);
            box-shadow:
              0 16px 36px rgba(0, 0, 0, 0.16),
              0 6px 14px rgba(0, 0, 0, 0.12);
          }

          .shadow-custom .card-header {
            border-bottom: 1px solid #f0f0f0;
            border-radius: 16px 16px 0 0;
            font-weight: 600;
          }

          .shadow-custom .badge-primary {
            font-size: 0.85rem;
            box-shadow: 0 4px 8px rgba(13, 110, 253, 0.35);
          }

          .shadow-custom table th {
            color: #6c757d;
            font-weight: 600;
          }
        `}
      </style>

    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      {/* Navbar */}
      <nav className="navbar admin-navbar">
        <div className="container-fluid">
          <span className="navbar-brand font-weight-bold">
            <i className="fas fa-user-shield mr-2"></i>
            Admin Panel
          </span>

          <div className="ml-auto d-flex align-items-center">
            <span className="welcome text-dark mr-3">
              <i className="fas fa-user-circle mr-2"></i>
              Welcome, {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm logout-btn"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container-fluid py-5">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">
              <i className="fas fa-tachometer-alt mr-2 text-primary"></i>
              Admin Dashboard
            </h2>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card card-hover text-white" style={{backgroundColor:'#047BFB'}}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <b className="text-white-100 mb-2">Total Users</b>
                    <h2 className="mb-0 font-weight-bold"></h2>
                  </div>
                  <i className="fas fa-users fa-3x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card card-hover text-white" style={{backgroundColor:'#58C1C2'}}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <b className="text-white-100 mb-2">Total Classrooms</b>
                    <h2 className="mb-0 font-weight-bold"></h2>
                  </div>
                  <i className="fas fa-chalkboard fa-3x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card card-hover text-white" style={{backgroundColor:'#989EFD'}}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <b className="text-white-100 mb-2">Active Teachers</b>
                    <h2 className="mb-0 font-weight-bold"></h2>
                  </div>
                  <i className="fas fa-chalkboard-teacher fa-3x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-custom">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle mr-2 text-primary"></i>
                  User Information
                </h5>
              </div>

              <div className="card-body" style={{overflow : 'auto'}}>
                <table className="table table-borderless mb-0">
                  <tbody>
                    {/* <tr>
                      <th style={{ width: '150px' }}>ID:</th>
                      <td>{user?.id}</td>
                    </tr> */}
                    <tr>
                      <th>Email:</th>
                      <td>{user?.email}</td>
                    </tr>
                    <tr>
                      <th>Name:</th>
                      <td>{user?.name}</td>
                    </tr>
                    <tr>
                      <th>Role:</th>
                      <td>
                        <span className="badge badge-primary badge-pill px-3 py-2">
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
      </div>
    </div>
    </>
  );
};