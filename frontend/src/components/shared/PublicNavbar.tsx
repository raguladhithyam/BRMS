import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from './Button';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Don't show on landing page (it has its own nav)
  if (location.pathname === '/') {
    return null;
  }

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-gray-200/50 w-full"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-xl shadow-lg">
                <Heart className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  BloodConnect
                </span>
                <p className="text-xs text-gray-500 -mt-1 font-medium">Life. Connected.</p>
              </div>
            </Link>
          </motion.div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/request-blood" 
              className={`text-gray-600 hover:text-red-600 transition-colors font-medium ${
                location.pathname === '/request-blood' ? 'text-red-600 font-semibold' : ''
              }`}
            >
              Request Blood
            </Link>
            <Link 
              to="/register" 
              className={`text-gray-600 hover:text-red-600 transition-colors font-medium ${
                location.pathname === '/register' ? 'text-red-600 font-semibold' : ''
              }`}
            >
              Become Donor
            </Link>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/student'}>
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

