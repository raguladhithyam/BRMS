import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/shared/Layout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { BloodRequestForm } from '@/pages/public/BloodRequestForm';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminRequests } from '@/pages/admin/AdminRequests';
import { AdminStudents } from '@/pages/admin/AdminStudents';
import { AdminCertificates } from '@/pages/admin/AdminCertificates';
import { AdminManagement } from '@/pages/admin/AdminManagement';
import AdminLogs from '@/pages/admin/AdminLogs';

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentRequests } from '@/pages/student/StudentRequests';
import { StudentCertificates } from '@/pages/student/StudentCertificates';

// Shared Pages
import { NotificationsPage } from '@/pages/shared/NotificationsPage';
import { ProfilePage } from '@/pages/shared/ProfilePage';
import { UnauthorizedPage } from '@/pages/shared/UnauthorizedPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route path="/*" element={<Navigate to="/" replace />} />
        {/* Public Routes */}
        <Route index element={<LandingPage />} />
        <Route path="request-blood" element={<BloodRequestForm />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Routes */}
        <Route path="admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/requests" element={
          <ProtectedRoute requiredRole="admin">
            <AdminRequests />
          </ProtectedRoute>
        } />
        <Route path="admin/students" element={
          <ProtectedRoute requiredRole="admin">
            <AdminStudents />
          </ProtectedRoute>
        } />
        <Route path="admin/certificates" element={
          <ProtectedRoute requiredRole="admin">
            <AdminCertificates />
          </ProtectedRoute>
        } />
        <Route path="admin/logs" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLogs />
          </ProtectedRoute>
        } />
        <Route path="admin/management" element={
          <ProtectedRoute requiredRole="admin">
            <AdminManagement />
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="student" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="student/requests" element={
          <ProtectedRoute requiredRole="student">
            <StudentRequests />
          </ProtectedRoute>
        } />
        <Route path="student/certificates" element={
          <ProtectedRoute requiredRole="student">
            <StudentCertificates />
          </ProtectedRoute>
        } />

        {/* Shared Protected Routes */}
        <Route path="notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};