import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PublicNavbar } from './PublicNavbar';
import { useAuth } from '../../hooks/useAuth';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Don't show sidebar/topbar on landing page even if logged in
  const isLandingPage = location.pathname === '/';
  const showNav = user && !isLandingPage;
  
  // Show public navbar on public pages (login, register, request-blood) when not logged in
  const publicPages = ['/login', '/register', '/request-blood'];
  const isPublicPage = publicPages.includes(location.pathname);
  const showPublicNav = !user && isPublicPage && !isLandingPage;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Public Navbar for login, register, request-blood pages */}
      {showPublicNav && <PublicNavbar />}
      
      {/* Authenticated Navbar (Sidebar + Topbar) */}
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
          `min-h-screen ${showNav ? 'pt-16 pl-64' : showPublicNav ? 'pt-16' : ''} transition-all duration-300` // pt-16 for topbar, pl-64 for sidebar
        }
      >
        <main className={`w-full ${showNav ? 'px-6 py-8' : showPublicNav ? 'px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};