// src/pages/auth/ChooseRole.jsx
import { useNavigate } from 'react-router-dom';
import { ROUTES, ROLES } from '../../utils/constants';

export const ChooseRole = () => {
  const navigate = useNavigate();

  const roles = [
    {
      role: ROLES.ADMIN,
      title: 'Admin',
      description: 'Manage platform and users',
      icon: 'fas fa-user-shield',
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: ROUTES.ADMIN_LOGIN
    },
    {
      role: ROLES.TEACHER,
      title: 'Teacher',
      description: 'Create and manage classrooms',
      icon: 'fas fa-chalkboard-teacher',
      color: 'info',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: ROUTES.TEACHER_LOGIN
    },
    {
      role: ROLES.STUDENT,
      title: 'Student',
      description: 'Join classes and learn',
      icon: 'fas fa-user-graduate',
      color: 'success',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      route: ROUTES.STUDENT_LOGIN
    }
  ];

  return (
    <div className="container-fluid gradient-bg vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5 fade-in">
          <h1 className="display-3 font-weight-bold text-white mb-3">
            Virtual Classroom
          </h1>
          <p className="lead text-white-50">
            Choose your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="row justify-content-center">
          {roles.map((item, index) => (
            <div key={item.role} className="col-md-4 mb-4 fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div 
                className="card card-hover h-100 text-center"
                onClick={() => navigate(item.route)}
                style={{cursor: 'pointer'}}
              >
                <div className="card-body p-5">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-center mb-4"
                    style={{
                      width: '100px',
                      height: '100px',
                      background: item.gradient
                    }}
                  >
                    <i className={`${item.icon} fa-3x text-white`}></i>
                  </div>
                  <h3 className="card-title font-weight-bold mb-3">{item.title}</h3>
                  <p className="card-text text-muted mb-4">{item.description}</p>
                  <button className={`btn btn-${item.color} btn-lg`}>
                    Login as {item.title}
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};