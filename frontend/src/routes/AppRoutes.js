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
import AnimalHealthList from '../pages/veterinary/AnimalHealthList';
import HealthRecordsArchive from '../pages/veterinary/HealthRecordsArchive';
import AnimalHealthDetail from '../pages/veterinary/AnimalHealthDetail';
import UpdateHealthStatus from '../pages/veterinary/UpdateHealthStatus';
import MedicalLogList from '../pages/veterinary/MedicalLogList';
import MedicalLogEntry from '../pages/veterinary/MedicalLogEntry';
import TreatmentPlanList from '../pages/veterinary/TreatmentPlanList';
import TreatmentPlanForm from '../pages/veterinary/TreatmentPlanForm';
import TreatmentDetail from '../pages/veterinary/TreatmentDetail';
import MedicalHistory from '../pages/veterinary/MedicalHistory';
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
          <Route path="health" element={<AnimalHealthList />} />
          <Route path="archive" element={<HealthRecordsArchive />} />
          
          <Route path="health/:id" element={<AnimalHealthDetail />} />
          <Route path="health/:id/update" element={<UpdateHealthStatus />} />
          
          <Route path="medical-logs" element={<MedicalLogList />} />
          <Route path="health/:id/medical-logs/new" element={<MedicalLogEntry />} />
          
          <Route path="treatments" element={<TreatmentPlanList />} />
          <Route path="health/:id/treatments/new" element={<TreatmentPlanForm />} />
          <Route path="treatments/:id" element={<TreatmentDetail />} />
          <Route path="history" element={<MedicalHistory />} />
          <Route path="history/:id" element={<MedicalHistory />} />

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
