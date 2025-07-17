import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  FileText, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Home,
  Award,
  Activity
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { cn } from '../../utils/cn';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminNavItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/requests', icon: FileText, label: 'Requests' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/certificates', icon: Award, label: 'Certificates' },
    { path: '/admin/logs', icon: Activity, label: 'Logs' },
    { path: '/admin/management', icon: Users, label: 'Management' },
  ];

  const studentNavItems = [
    { path: '/student', icon: Home, label: 'Dashboard' },
    { path: '/student/requests', icon: FileText, label: 'Blood Requests' },
    { path: '/student/certificates', icon: Award, label: 'My Certificates' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link to={user?.role === 'admin' ? '/admin' : '/student'} className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary-600" />
          <span className="font-bold text-xl text-gray-900">BloodConnect</span>
        </Link>
      </div>
      {/* Navigation */}
      <nav className="flex-1 py-6 px-2 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-md text-base font-medium transition-colors",
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Bottom section: Notifications and Profile */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};