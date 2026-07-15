import React from 'react';
import AnimalsPage from './AnimalsPage';
import MeetResidents from './MeetResidents';
import ExploreZoo from './ExploreZoo';
import GuestServices from './GuestServices';

const UserDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <AnimalsPage />
      <MeetResidents />
      <ExploreZoo />
      <GuestServices />
    </div>
  );
};

export default UserDashboard;
