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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Teacher Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            👨‍🏫 Teacher Dashboard
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">My Classrooms</h3>
              <p className="text-3xl font-bold text-blue-600">5</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-green-600">120</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Assignments</h3>
              <p className="text-3xl font-bold text-yellow-600">15</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">User Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>ID:</strong> {user?.id}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Role:</strong> <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded">{user?.role}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};