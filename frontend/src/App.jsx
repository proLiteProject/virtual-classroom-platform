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
import { StudentClasses } from './pages/student/StudentClasses';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentGrades } from './pages/student/StudentGrades';
import { StudentProfile } from './pages/student/StudentProfile';
import { ROUTES, ROLES } from './utils/constants';
import { ManageRole } from './pages/admin/ManageRole';
import { ManageClasses } from './pages/admin/ManageClasses';
import { StudentLog } from './pages/admin/StudentLog';
import { StudentClassManagement } from './pages/admin/StudentClassManagement';
import { SubjectManagement } from './pages/admin/SubjectManagement';
import { ChatLog } from './pages/admin/ChatLog';
import { TeacherClasses } from './pages/teacher/TeacherClasses';
import { TeacherSubjects } from './pages/teacher/TeacherSubjects';
import { TeacherClassSubjects } from './pages/teacher/TeacherClassSubjects';
import { TeacherAssignments } from './pages/teacher/TeacherAssignments';
import { TeacherStudents } from './pages/teacher/TeacherStudents';
import { TeacherGrades } from './pages/teacher/TeacherGrades';
import { TeacherProfile } from './pages/teacher/TeacherProfile';

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
            path={ROUTES.TEACHER_CLASSES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                <TeacherClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/classes/:id/subjects"
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                <TeacherClassSubjects />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TEACHER_SUBJECTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                <TeacherSubjects />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TEACHER_ASSIGNMENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                <TeacherAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TEACHER_STUDENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                <TeacherStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TEACHER_GRADES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                <TeacherGrades />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TEACHER_PROFILE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                <TeacherProfile />
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
          <Route
            path={ROUTES.STUDENT_CLASSES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_ASSIGNMENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_GRADES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentGrades />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_PROFILE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route path='admin/users' element={<ManageRole />} />
          <Route path='admin/classes' element={<ManageClasses />} />
          <Route path='admin/student-logs' element={<StudentLog />} />
          <Route path='admin/student-classes' element={< StudentClassManagement/>} />
          <Route path='admin/subjects' element={< SubjectManagement/>} />
          <Route path='admin/chat-logs' element={< ChatLog/>} />
          {/* 404 */}
          <Route path="*" element={<Navigate to={ROUTES.CHOOSE_ROLE} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
