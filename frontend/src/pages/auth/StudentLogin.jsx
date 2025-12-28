// src/pages/auth/StudentLogin.jsx
import { LoginForm } from '../../components/auth/LoginForm';
import { ROLES } from '../../utils/constants';

export const StudentLogin = () => {
  return (
    <LoginForm
      role={ROLES.STUDENT}
      title="Student Login"
      subtitle="Sign in to access your classes"
      gradientClass="gradient-bg-green"
      iconClass="fas fa-user-graduate text-success"
    />
  );
};