import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: '250px', backgroundColor: '#1B5E3C', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Admin Portal</h2>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link>
        <Link to="/admin/staff" style={{ color: 'white', textDecoration: 'none' }}>Staff</Link>
        <Link to="/admin/assignments" style={{ color: 'white', textDecoration: 'none' }}>Task Assignment</Link>
        <Link to="/admin/tickets" style={{ color: 'white', textDecoration: 'none' }}>Tickets</Link>
        <Link to="/admin/reports" style={{ color: 'white', textDecoration: 'none' }}>Reports</Link>
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

export default AdminLayout;
