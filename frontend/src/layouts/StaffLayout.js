import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const StaffLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: '250px', backgroundColor: '#1B5E3C', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Staff Portal</h2>
        <Link to="/staff" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/staff/tasks" style={{ color: 'white', textDecoration: 'none' }}>My Tasks</Link>
        <Link to="/staff/animals" style={{ color: 'white', textDecoration: 'none' }}>My Animals</Link>
        <Link to="/staff/care-logs" style={{ color: 'white', textDecoration: 'none' }}>Care Logs</Link>
        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={handleLogout} 
            style={{ width: '100%', background: 'transparent', color: 'white', border: '1px solid white', padding: '8px', cursor: 'pointer', borderRadius: '4px' }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
