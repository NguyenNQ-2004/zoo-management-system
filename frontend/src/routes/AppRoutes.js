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
<<<<<<< HEAD
import ExploreZoo from '../pages/user/ExploreZoo';
import GuestServices from '../pages/user/GuestServices';
import AnimalsPage from '../pages/user/AnimalsPage';
import AnimalDetail from '../pages/user/AnimalDetail';
import BookingPage from '../pages/user/BookingPage';
import MyTickets from '../pages/user/MyTickets';
import TicketDetail from '../pages/user/TicketDetail';
import ZooAreaDetail from '../pages/user/ZooAreaDetail';
import ServiceDetail from '../pages/user/ServiceDetail';
import UserProfile from '../pages/user/UserProfile';
=======
import StaffAnimalsPage from '../pages/staff/StaffAnimalsPage';
import StaffCareHistoryPage from '../pages/staff/StaffCareHistoryPage';
>>>>>>> 2e89f4b39847a4408deba65c4680803b95c43387
import StaffDashboard from '../pages/staff/StaffDashboard';
import StaffCareDetail from '../pages/staff/StaffCareDetail';
import StaffCareLogFormPage from '../pages/staff/StaffCareLogFormPage';
import StaffTaskDetailPage from '../pages/staff/StaffTaskDetailPage';
import StaffTasksPage from '../pages/staff/StaffTasksPage';
import VetDashboard from '../pages/veterinary/VetDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AreaManagement from '../pages/admin/AreaManagement';
import AnimalManagement from '../pages/admin/AnimalManagement';
import ServiceManagement from '../pages/admin/ServiceManagement';

// Develop Pages
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
          <Route path="explore" element={<ExploreZoo />} />
          <Route path="explore/:id" element={<ZooAreaDetail />} />
          <Route path="services" element={<GuestServices />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="animals" element={<AnimalsPage />} />
          <Route path="animals/:id" element={<AnimalDetail />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="tickets" element={<MyTickets />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="*" element={<PlaceholderPage title="Under Construction" roleName="User" functions={[]} />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<RoleRoute allowedRole="STAFF"><StaffLayout /></RoleRoute>}>
          <Route index element={<StaffDashboard />} />
          <Route path="animals" element={<StaffAnimalsPage />} />
          <Route path="animals/:animalId/care" element={<StaffCareDetail />} />
          <Route path="animals/:animalId/care-logs" element={<StaffCareHistoryPage />} />
          <Route path="animals/:animalId/care-logs/new" element={<StaffCareLogFormPage />} />
          <Route path="tasks" element={<StaffTasksPage />} />
          <Route path="tasks/:taskId" element={<StaffTaskDetailPage />} />
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
          <Route path="areas" element={<AreaManagement />} />
          <Route path="animals" element={<AnimalManagement />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="staff" element={<AdminStaffPage />} />
          <Route path="assignments" element={<AdminAssignmentsPage />} />
          <Route path="tickets" element={<AdminTicketsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="admin-animals" element={<AdminAnimalsPage />} />
          <Route path="*" element={<PlaceholderPage title="Under Construction" roleName="Admin" functions={[]} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
