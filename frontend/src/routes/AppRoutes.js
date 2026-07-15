import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from '../layouts/UserLayout';
import StaffLayout from '../layouts/StaffLayout';
import VetLayout from '../layouts/VetLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import UserDashboard from '../pages/user/UserDashboard';
import StaffDashboard from '../pages/staff/StaffDashboard';
import VetDashboard from '../pages/veterinary/VetDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminStaffPage from '../pages/admin/AdminStaffPage';
import AdminAssignmentsPage from '../pages/admin/AdminAssignmentsPage';
import AdminAnimalsPage from '../pages/admin/AdminAnimalsPage';
import AdminTicketsPage from '../pages/admin/AdminTicketsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import PlaceholderPage from '../components/PlaceholderPage';

// Route Guards
import RoleRoute from './RoleRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Routes */}
        <Route path="/user" element={<RoleRoute allowedRole="USER"><UserLayout /></RoleRoute>}>
          <Route index element={<UserDashboard />} />
          <Route path="*" element={<PlaceholderPage title="Under Construction" roleName="User" functions={[]} />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<RoleRoute allowedRole="STAFF"><StaffLayout /></RoleRoute>}>
          <Route index element={<StaffDashboard />} />
          <Route path="*" element={<PlaceholderPage title="Under Construction" roleName="Staff" functions={[]} />} />
        </Route>

        {/* Vet Routes */}
        <Route path="/vet" element={<RoleRoute allowedRole="VET"><VetLayout /></RoleRoute>}>
          <Route index element={<VetDashboard />} />
          <Route path="*" element={<PlaceholderPage title="Under Construction" roleName="Veterinary" functions={[]} />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<RoleRoute allowedRole="ADMIN"><AdminLayout /></RoleRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="staff" element={<AdminStaffPage />} />
          <Route path="assignments" element={<AdminAssignmentsPage />} />
          <Route path="animals" element={<AdminAnimalsPage />} />
          <Route path="tickets" element={<AdminTicketsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="*" element={<PlaceholderPage title="Under Construction" roleName="Admin" functions={[]} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
