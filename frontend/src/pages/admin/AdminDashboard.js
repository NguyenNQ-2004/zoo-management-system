// TODO: Ngọc - Admin and Account Management

import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';

const AdminDashboard = () => {
  return (
    <PlaceholderPage 
      title="ADMIN DASHBOARD"
      roleName="Admin"
      description="System administration and overview of all operations."
      functions={[
        "View dashboard statistics",
        "Manage users",
        "Manage staff",
        "Manage staff roles",
        "Assign tasks",
        "View tickets",
        "View reports"
      ]}
    />
  );
};

export default AdminDashboard;
