// src/pages/auth/TeacherLogin.jsx
import { LoginForm } from '../../components/auth/LoginForm';
import { ROLES } from '../../utils/constants';

export const TeacherLogin = () => {
  return (
    <LoginForm
      role={ROLES.TEACHER}
      title="Teacher Login"
      subtitle="Sign in to manage your classrooms"
    />
  );
};