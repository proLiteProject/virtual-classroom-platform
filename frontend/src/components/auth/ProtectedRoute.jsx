// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.CHOOSE_ROLE} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      case 'TEACHER':
        return <Navigate to={ROUTES.TEACHER_DASHBOARD} replace />;
      case 'STUDENT':
        return <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />;
      default:
        return <Navigate to={ROUTES.CHOOSE_ROLE} replace />;
    }
  }

  return children;
};