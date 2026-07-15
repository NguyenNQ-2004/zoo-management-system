// TODO: Nguyên - User and Ticket Booking
// TODO: Mạnh - Zoo Area, Animal and Service Management

import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';

const UserDashboard = () => {
  return (
    <PlaceholderPage 
      title="USER DASHBOARD"
      roleName="User"
      description="Welcome to the Zoo! Book tickets and explore our amazing animals."
      functions={[
        "Explore Zoo Areas",
        "View Animals",
        "View Zoo Services",
        "Book Tickets",
        "View My Tickets",
        "Update Profile"
      ]}
    />
  );
};

export default UserDashboard;
