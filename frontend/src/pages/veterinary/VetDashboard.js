// TODO: Sơn - Veterinary and Animal Health

import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';

const VetDashboard = () => {
  return (
    <PlaceholderPage 
      title="VETERINARY DASHBOARD"
      roleName="Veterinary"
      description="Monitor and manage animal health, treatments, and medical records."
      functions={[
        "View animal health status",
        "Update health status",
        "Create medical logs",
        "Create treatment plans",
        "Update treatment progress",
        "View medical history"
      ]}
    />
  );
};

export default VetDashboard;
