import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../hooks/useAuth';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Don't show sidebar/topbar on landing page even if logged in
  const isLandingPage = location.pathname === '/';
  const showNav = user && !isLandingPage;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {showNav && (
        <aside className="fixed left-0 top-0 h-screen w-64 z-30">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </aside>
      )}
      {showNav && (
        <header className="fixed top-0 left-0 w-full z-20" style={{ marginLeft: showNav ? 256 : 0 }}>
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
        </header>
      )}
      <div
        className={
          `pt-16 ${showNav ? 'pl-64' : ''} h-screen bg-gray-50` // pt-16 for topbar, pl-64 for sidebar
        }
      >
        <main className="h-full overflow-y-auto px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};