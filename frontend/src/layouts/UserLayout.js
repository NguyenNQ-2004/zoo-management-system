import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ backgroundColor: '#1B5E3C', padding: '15px 20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginRight: '20px' }}>Zoo System</div>
        <Link to="/user" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/user/explore" style={{ color: 'white', textDecoration: 'none' }}>Explore Zoo</Link>
        <Link to="/user/animals" style={{ color: 'white', textDecoration: 'none' }}>Animals</Link>
        <Link to="/user/services" style={{ color: 'white', textDecoration: 'none' }}>Services</Link>
        <Link to="/user/tickets" style={{ color: 'white', textDecoration: 'none' }}>My Tickets</Link>
        <Link to="/user/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
        <button 
          onClick={handleLogout} 
          style={{ marginLeft: 'auto', background: 'transparent', color: 'white', border: '1px solid white', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Logout
        </button>
      </nav>
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
