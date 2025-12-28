// src/pages/auth/AdminLogin.jsx
import { LoginForm } from '../../components/auth/LoginForm';
import { ROLES } from '../../utils/constants';

export const AdminLogin = () => {
  return (
    <LoginForm
      role={ROLES.ADMIN}
      title="Admin Login"
      subtitle="Sign in to manage the platform"
      gradientClass="gradient-bg"
      iconClass="fas fa-user-shield text-primary"
    />
  );
};