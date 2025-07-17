import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, FileText, Users, Award, Activity, Bell, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const adminNavItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/requests', icon: FileText, label: 'Requests' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/certificates', icon: Award, label: 'Certificates' },
    { path: '/admin/logs', icon: Activity, label: 'Logs' },
    { path: '/admin/management', icon: Users, label: 'Management' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const studentNavItems = [
    { path: '/student', icon: Home, label: 'Dashboard' },
    { path: '/student/requests', icon: FileText, label: 'Blood Requests' },
    { path: '/student/certificates', icon: Award, label: 'My Certificates' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  // Responsive: show as drawer on mobile, fixed on desktop
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          'fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity md:hidden',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'md:fixed md:top-0 md:left-0 md:h-screen md:w-64 md:z-40',
          'fixed top-0 left-0 h-full w-64 flex flex-col transition-transform duration-200',
          'md:shadow-lg md:border-r md:bg-white bg-white',
          'md:translate-x-0 md:block',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:static md:translate-x-0'
        )}
        style={{ maxWidth: '16rem' }}
      >
        {/* Mobile close button */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200 justify-between">
          <Link to={user?.role === 'admin' ? '/admin' : '/student'} className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-xl text-gray-900">BloodConnect</span>
          </Link>
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full ml-2"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
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
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}; 