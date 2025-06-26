import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuth } from '../../hooks/useAuth';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Don't show navbar on landing page even if logged in
  const isLandingPage = location.pathname === '/';
  const showNavbar = user && !isLandingPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? 'pt-16' : ''}>
        <Outlet />
      </main>
    </div>
  );
};