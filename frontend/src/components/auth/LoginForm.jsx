// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';

export const LoginForm = ({ role, title, subtitle, gradientClass, iconClass }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        if (result.user.role !== role) {
          setApiError(`This login is for ${role} only. Your role is ${result.user.role}.`);
          setLoading(false);
          return;
        }
        
        switch (result.user.role) {
          case 'ADMIN':
            navigate(ROUTES.ADMIN_DASHBOARD);
            break;
          case 'TEACHER':
            navigate(ROUTES.TEACHER_DASHBOARD);
            break;
          case 'STUDENT':
            navigate(ROUTES.STUDENT_DASHBOARD);
            break;
          default:
            navigate(ROUTES.HOME);
        }
      } else {
        setApiError(result.message);
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container-fluid ${gradientClass} vh-100 d-flex align-items-center justify-content-center`}>
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg fade-in">
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className={`${iconClass} fa-4x`}></i>
                </div>
                <h2 className="card-title font-weight-bold">{title}</h2>
                <p className="text-muted">{subtitle}</p>
              </div>

              {/* Error Alert */}
              {apiError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {apiError}
                  <button 
                    type="button" 
                    className="close" 
                    onClick={() => setApiError('')}
                  >
                    <span>&times;</span>
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope mr-2"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <i className="fas fa-lock mr-2"></i>
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center mt-4">
                <button
                  onClick={() => navigate(ROUTES.CHOOSE_ROLE)}
                  className="btn btn-link text-muted"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to role selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};