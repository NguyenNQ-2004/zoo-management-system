import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleRoute = ({ children, allowedRole }) => {
  const currentUserString = localStorage.getItem('currentUser');
  let currentUser = null;
  
  if (currentUserString) {
    try {
      currentUser = JSON.parse(currentUserString);
    } catch (e) {
      console.error("Failed to parse user from local storage");
    }
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    // If they are logged in but trying to access another role's route, send them to their own dashboard
    switch (currentUser.role) {
      case 'USER': return <Navigate to="/user" replace />;
      case 'STAFF': return <Navigate to="/staff" replace />;
      case 'VET': return <Navigate to="/vet" replace />;
      case 'ADMIN': return <Navigate to="/admin" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default RoleRoute;
