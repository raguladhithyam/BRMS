import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, Menu, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unread = typeof unreadCount === 'number' ? unreadCount : 0;

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm flex items-center justify-between px-4 md:px-8 z-50 md:left-64 md:w-[calc(100%-16rem)]">
      {/* Hamburger menu for mobile */}
      <button
        className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex items-center space-x-4 md:space-x-6 ml-auto">
        {/* Date and Time */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200/50">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 font-medium text-sm">
            {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-gray-500 text-sm">
            {dateTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        {/* Notifications */}
        <Link
          to="/notifications"
          className="relative p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
        >
          <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 p-1.5 pr-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-200"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </button>
          {isProfileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/50 py-2 z-50 backdrop-blur-md">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  <p className="text-xs text-primary-600 font-medium capitalize mt-1">{user?.role}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-3 text-gray-400" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}; 