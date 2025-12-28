// src/pages/teacher/TeacherDashboard.jsx
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.CHOOSE_ROLE);
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-info shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand font-weight-bold" href="#">
            <i className="fas fa-chalkboard-teacher mr-2"></i>
            Teacher Portal
          </a>
          <div className="ml-auto d-flex align-items-center">
            <span className="text-white mr-3">
              <i className="fas fa-user-circle mr-2"></i>
              Welcome, {user?.name}
            </span>
            <button onClick={handleLogout} className="btn btn-danger">
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
              <i className="fas fa-tachometer-alt mr-2 text-info"></i>
              Teacher Dashboard
            </h2>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card card-hover bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-white-50 mb-2">My Classrooms</h6>
                    <h2 className="mb-0 font-weight-bold">5</h2>
                  </div>
                  <i className="fas fa-chalkboard fa-3x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card card-hover bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-white-50 mb-2">Total Students</h6>
                    <h2 className="mb-0 font-weight-bold">120</h2>
                  </div>
                  <i className="fas fa-user-graduate fa-3x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card card-hover bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-white-50 mb-2">Assignments</h6>
                    <h2 className="mb-0 font-weight-bold">15</h2>
                  </div>
                  <i className="fas fa-tasks fa-3x opacity-50"></i>
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
                  <i className="fas fa-info-circle mr-2 text-info"></i>
                  User Information
                </h5>
              </div>
              <div className="card-body">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <th style={{width: '150px'}}>ID:</th>
                      <td>{user?.id}</td>
                    </tr>
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
                        <span className="badge badge-info badge-pill px-3 py-2">
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
  );
};