import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ChooseRole } from './pages/auth/ChooseRole';
import { AdminLogin } from './pages/auth/AdminLogin';
import { TeacherLogin } from './pages/auth/TeacherLogin';
import { StudentLogin } from './pages/auth/StudentLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ROUTES, ROLES } from './utils/constants';
import { ManageRole } from './pages/admin/ManageRole';
import { ManageClasses } from './pages/admin/ManageClasses';
import { StudentLog } from './pages/admin/StudentLog';
import { StudentClassManagement } from './pages/admin/StudentClassManagement';
import { SubjectManagement } from './pages/admin/SubjectManagement';
import { ChatLog } from './pages/admin/ChatLog';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.CHOOSE_ROLE} replace />} />
          <Route path={ROUTES.CHOOSE_ROLE} element={<ChooseRole />} />
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
          <Route path={ROUTES.TEACHER_LOGIN} element={<TeacherLogin />} />
          <Route path={ROUTES.STUDENT_LOGIN} element={<StudentLogin />} />

          {/* Protected Routes */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TEACHER_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path='admin/users' element={<ManageRole />} />
          <Route path='admin/classes' element={<ManageClasses />} />
          <Route path='admin/student-logs' element={<StudentLog />} />
          <Route path='admin/student-classes' element={< StudentClassManagement/>} />
          <Route path='admin/subjetcs' element={< SubjectManagement/>} />
          <Route path='admin/chat-logs' element={< ChatLog/>} />
          {/* 404 */}
          <Route path="*" element={<Navigate to={ROUTES.CHOOSE_ROLE} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;