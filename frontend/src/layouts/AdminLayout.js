import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const sidebarStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#004528',
    color: 'white',
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 20,
  },
  logo: {
    padding: '0 24px',
    marginBottom: '32px',
  },
  logoTitle: {
    fontSize: '24px',
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    color: '#ffffff',
    margin: 0,
  },
  logoSubtitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: '2px',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 24px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.02em',
    transition: 'all 0.2s',
    borderLeft: '3px solid transparent',
  },
  navLinkActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    fontWeight: 600,
    borderLeftColor: '#a4f4bf',
  },
  navLinkHover: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '16px 24px 0',
    marginTop: 'auto',
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    transition: 'color 0.2s',
  },
  main: {
    flex: 1,
    marginLeft: '280px',
    backgroundColor: '#f8faf9',
    minHeight: '100vh',
  },
  topBar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #E5E7EB',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  topTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#004528',
    fontFamily: "'Inter', sans-serif",
  },
};

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
  { path: '/admin/areas', label: 'Khu vực', icon: 'landscape' },
  { path: '/admin/animals', label: 'Động vật', icon: 'pets' },
  { path: '/admin/services', label: 'Dịch vụ', icon: 'room_service' },
  { path: '/admin/users', label: 'Người dùng', icon: 'group' },
  { path: '/admin/staff', label: 'Nhân viên', icon: 'badge' },
  { path: '/admin/reports', label: 'Báo cáo', icon: 'assessment' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const getPageTitle = () => {
    const active = navItems.find(item => isActive(item));
    return active ? active.label : 'Admin';
  };

  return (
    <div style={sidebarStyles.container}>
      {/* Sidebar */}
      <aside style={sidebarStyles.sidebar}>
        <div style={sidebarStyles.logo}>
          <h1 style={sidebarStyles.logoTitle}>ZooLogix</h1>
          <p style={sidebarStyles.logoSubtitle}>Management Console</p>
        </div>
        <nav style={sidebarStyles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...sidebarStyles.navLink,
                ...(isActive(item) ? sidebarStyles.navLinkActive : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive(item)) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={sidebarStyles.footer}>
          <button
            onClick={handleLogout}
            style={sidebarStyles.logoutBtn}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={sidebarStyles.main}>
        <header style={sidebarStyles.topBar}>
          <span style={sidebarStyles.topTitle}>{getPageTitle()}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }}>
              <span className="material-symbols-outlined" style={{ color: '#404942' }}>notifications</span>
            </button>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', backgroundColor: '#e6e9e8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 600, color: '#004528',
            }}>
              AD
            </div>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
