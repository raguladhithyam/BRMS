import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuth } from '../../hooks/useAuth';

export const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <main className={user ? 'pt-16' : ''}>
        <Outlet />
      </main>
    </div>
  );
};