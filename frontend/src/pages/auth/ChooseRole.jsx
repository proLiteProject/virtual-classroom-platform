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
      icon: '👨‍💼',
      color: 'from-purple-500 to-purple-600',
      route: ROUTES.ADMIN_LOGIN
    },
    {
      role: ROLES.TEACHER,
      title: 'Teacher',
      description: 'Create and manage classrooms',
      icon: '👨‍🏫',
      color: 'from-blue-500 to-blue-600',
      route: ROUTES.TEACHER_LOGIN
    },
    {
      role: ROLES.STUDENT,
      title: 'Student',
      description: 'Join classes and learn',
      icon: '👨‍🎓',
      color: 'from-green-500 to-green-600',
      route: ROUTES.STUDENT_LOGIN
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Virtual Classroom
          </h1>
          <p className="text-xl text-gray-600">
            Choose your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((item) => (
            <button
              key={item.role}
              onClick={() => navigate(item.route)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 transform hover:-translate-y-2"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.description}
              </p>
              <div className="mt-6 flex items-center justify-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                Login as {item.title}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};