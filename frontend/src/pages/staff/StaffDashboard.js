// TODO: Duy - Staff Task and Daily Care

import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';

const StaffDashboard = () => {
  return (
    <PlaceholderPage 
      title="STAFF DASHBOARD"
      roleName="Staff"
      description="Manage your daily tasks and care routines for assigned animals."
      functions={[
        "View assigned tasks",
        "Update task status",
        "View assigned animals",
        "Record daily animal care",
        "View care history"
      ]}
    />
  );
};

export default StaffDashboard;
