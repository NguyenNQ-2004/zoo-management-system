import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const navLinkStyle = ({ isActive }) => ({
  color: 'white',
  textDecoration: 'none',
  padding: '10px 12px',
  borderRadius: '10px',
  backgroundColor: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
  border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px',
});

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f4f7f2' }}>
      <aside style={{ width: '260px', background: 'linear-gradient(180deg, #174b31 0%, #1B5E3C 55%, #2c7a52 100%)', color: 'white', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '12px 0 32px rgba(18, 48, 33, 0.18)' }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: 0, opacity: 0.72, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Zoo Management</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '24px' }}>Admin Portal</h2>
        </div>
        <NavLink to="/admin" end style={navLinkStyle}>Dashboard</NavLink>
        <NavLink to="/admin/areas" style={navLinkStyle}>Khu vực</NavLink>
        <NavLink to="/admin/animals" style={navLinkStyle}>Động vật</NavLink>
        <NavLink to="/admin/services" style={navLinkStyle}>Dịch vụ</NavLink>
        <NavLink to="/admin/users" style={navLinkStyle}>Users</NavLink>
        <NavLink to="/admin/staff" style={navLinkStyle}>Staff</NavLink>
        <NavLink to="/admin/assignments" style={navLinkStyle}>Task Assignment</NavLink>
        <NavLink to="/admin/tickets" style={navLinkStyle}>Tickets</NavLink>
        <NavLink to="/admin/reports" style={navLinkStyle}>Reports</NavLink>
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '10px', cursor: 'pointer', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Đăng xuất
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '28px', backgroundColor: '#f4f7f2' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
