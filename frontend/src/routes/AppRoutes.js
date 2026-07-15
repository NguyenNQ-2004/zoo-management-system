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
import StaffDashboard from '../pages/staff/StaffDashboard';
import VetDashboard from '../pages/veterinary/VetDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
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
          <Route path="*" element={<PlaceholderPage title="Under Construction" roleName="Admin" functions={[]} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
