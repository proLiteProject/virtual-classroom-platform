// src/components/layout/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, ROLES } from '../../utils/constants';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [window.location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.CHOOSE_ROLE);
  };

  // Menu items based on role
  const getMenuItems = () => {
    switch (user?.role) {
      case ROLES.ADMIN:
        return [
          {
            path: ROUTES.ADMIN_DASHBOARD,
            icon: 'fas fa-tachometer-alt',
            label: 'Dashboard',
          },
          {
            path: '/admin/users',
            icon: 'fas fa-users',
            label: 'Manage Users',
          },
          {
            path: '/admin/classes',
            icon: 'fas fa-chalkboard',
            label: 'Manage Classes',
          },
          {
            path: '/admin/reports',
            icon: 'fas fa-chart-line',
            label: 'Reports',
          },
          {
            path: '/admin/settings',
            icon: 'fas fa-cog',
            label: 'Settings',
          },
        ];

      case ROLES.TEACHER:
        return [
          {
            path: ROUTES.TEACHER_DASHBOARD,
            icon: 'fas fa-tachometer-alt',
            label: 'Dashboard',
          },
          {
            path: '/teacher/classes',
            icon: 'fas fa-chalkboard',
            label: 'My Classes',
          },
          {
            path: '/teacher/assignments',
            icon: 'fas fa-tasks',
            label: 'Assignments',
          },
          {
            path: '/teacher/students',
            icon: 'fas fa-user-graduate',
            label: 'Students',
          },
          {
            path: '/teacher/grades',
            icon: 'fas fa-star',
            label: 'Grades',
          },
          {
            path: '/teacher/profile',
            icon: 'fas fa-user',
            label: 'Profile',
          },
        ];

      case ROLES.STUDENT:
        return [
          {
            path: ROUTES.STUDENT_DASHBOARD,
            icon: 'fas fa-tachometer-alt',
            label: 'Dashboard',
          },
          {
            path: '/student/classes',
            icon: 'fas fa-book-open',
            label: 'My Classes',
          },
          {
            path: '/student/assignments',
            icon: 'fas fa-clipboard-list',
            label: 'Assignments',
          },
          {
            path: '/student/grades',
            icon: 'fas fa-chart-bar',
            label: 'My Grades',
          },
          {
            path: '/student/profile',
            icon: 'fas fa-user',
            label: 'Profile',
          },
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Role-based colors
  const getRoleColor = () => {
    switch (user?.role) {
      case ROLES.ADMIN:
        return '#989EFD';
      case ROLES.TEACHER:
        return '#989EFD';
      case ROLES.STUDENT:
        return '#989EFD';
      default:
        return '#989EFD';
    }
  };

  const roleColor = getRoleColor();

  const handleMenuClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      <style>
        {`
          /* Mobile Menu Toggle Button */
          .mobile-menu-toggle {
            display: none;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1100;
            background: ${roleColor};
            border: none;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }

          .mobile-menu-toggle:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          }

          .mobile-menu-toggle i {
            font-size: 1.3rem;
          }

          /* Mobile Overlay */
          .mobile-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .mobile-overlay.active {
            opacity: 1;
          }

          /* Sidebar */
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            background: linear-gradient(180deg, ${roleColor} 0%, ${roleColor}dd 100%);
            box-shadow: 4px 0 20px rgba(233, 8, 8, 0.1);
            transition: all 0.3s ease;
            z-index: 1000;
            overflow-y: auto;
            overflow-x: hidden;
          }

          .sidebar.expanded {
            width: 260px;
          }

          .sidebar.collapsed {
            width: 80px;
          }

          .sidebar-header {
            padding: 20px 15px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(0, 0, 0, 0.1);
          }

          .sidebar-brand {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .sidebar-brand i {
            font-size: 1.8rem;
          }

          .sidebar-toggle {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.3s ease;
          }

          .sidebar-toggle:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .user-info {
            padding: 20px 15px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(0, 0, 0, 0.1);
          }

          .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            font-size: 1.8rem;
            color: ${roleColor};
          }

          .user-name {
            color: white;
            font-weight: 600;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-role {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .sidebar-menu {
            padding: 20px 0;
          }

          .menu-item {
            display: flex;
            align-items: center;
            padding: 14px 20px;
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            transition: all 0.3s ease;
            border-left: 4px solid transparent;
            position: relative;
          }

          .menu-item:hover {
            background: rgba(255, 255, 255, 0.15);
            color: white;
            padding-left: 25px;
          }

          .menu-item.active {
            background: rgba(255, 255, 255, 0.2);
            border-left-color: white;
            color: white;
            font-weight: 600;
          }

          .menu-item i {
            font-size: 1.2rem;
            min-width: 35px;
            text-align: center;
          }

          .menu-item span {
            white-space: nowrap;
            margin-left: 5px;
          }

          .collapsed .menu-item span,
          .collapsed .user-name,
          .collapsed .user-role,
          .collapsed .sidebar-brand span {
            display: none;
          }

          .collapsed .user-avatar {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }

          .sidebar-footer {
            position: sticky;
            bottom: 0;
            width: 100%;
            padding: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(0, 0, 0, 0.1);
          }

          .logout-btn {
            width: 100%;
            padding: 12px 20px;
            background: rgba(220, 53, 69, 0.9);
            border: none;
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .logout-btn:hover {
            background: rgba(220, 53, 69, 1);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
          }

          .collapsed .logout-btn span {
            display: none;
          }

          /* Scrollbar styling */
          .sidebar::-webkit-scrollbar {
            width: 6px;
          }

          .sidebar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }

          .sidebar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
          }

          .sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }

          /* Mobile Responsive Styles */
          @media (max-width: 768px) {
            .mobile-menu-toggle {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .mobile-overlay {
              display: block;
            }

            .mobile-overlay.active {
              display: block;
            }

            .sidebar {
              transform: translateX(-100%);
              width: 280px !important;
            }

            .sidebar.mobile-open {
              transform: translateX(0);
            }

            .sidebar.collapsed {
              width: 280px !important;
            }

            .collapsed .menu-item span,
            .collapsed .user-name,
            .collapsed .user-role,
            .collapsed .sidebar-brand span,
            .collapsed .logout-btn span {
              display: block !important;
            }

            .collapsed .user-avatar {
              width: 60px;
              height: 60px;
              font-size: 1.8rem;
            }

            .sidebar-toggle {
              display: none;
            }

            .sidebar-header {
              padding-top: 25px;
            }
          }

          /* Tablet */
          @media (min-width: 769px) and (max-width: 1024px) {
            .sidebar.expanded {
              width: 220px;
            }
          }

          /* Small phones */
          @media (max-width: 480px) {
            .sidebar {
              width: 260px !important;
            }

            .mobile-menu-toggle {
              width: 45px;
              height: 45px;
              top: 15px;
              left: 15px;
            }

            .sidebar-brand {
              font-size: 1.3rem;
            }

            .user-avatar {
              width: 50px !important;
              height: 50px !important;
              font-size: 1.5rem !important;
            }
          }
        `}
      </style>

      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        <i className={`fas fa-${isMobileOpen ? 'times' : 'bars'}`}></i>
      </button>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* User Info */}
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          {!isCollapsed && (
            <>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </>
          )}
        </div>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <i className="fas fa-graduation-cap"></i>
            <span>Virtual Class</span>
          </div>
          {/* <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <i className={`fas fa-${isCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button> */}
        </div>

        {/* Menu Items */}
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleMenuClick}
              className={({ isActive }) =>
                `menu-item ${isActive ? 'active' : ''}`
              }
              title={isCollapsed ? item.label : ''}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};