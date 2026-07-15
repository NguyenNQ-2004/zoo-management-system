import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './StaffLayout.css';

const navItems = [
  { to: '/staff', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/staff/animals', label: 'Animals', icon: 'paw' },
  { to: '/staff/veterinary', label: 'Veterinary', icon: 'case' },
  { to: '/staff/tasks', label: 'Operations', icon: 'team' },
  { to: '/staff/inventory', label: 'Inventory', icon: 'box' },
  { to: '/staff/analytics', label: 'Analytics', icon: 'chart' }
];

const footerItems = [
  { to: '/staff/settings', label: 'Settings', icon: 'gear' },
  { to: '/staff/support', label: 'Support', icon: 'help' }
];

const SidebarIcon = ({ type }) => {
  const icons = {
    grid: (
      <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />
    ),
    paw: (
      <path d="M7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm7-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm7 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM9.2 13.2c1.4-2.3 4.2-2.3 5.6 0l1.4 2.4c1.1 1.9-.3 4.2-2.5 3.7l-1.1-.2a3 3 0 0 0-1.2 0l-1.1.2c-2.2.5-3.6-1.8-2.5-3.7l1.4-2.4Z" />
    ),
    case: (
      <path d="M9 4h6v3h4v13H5V7h4V4Zm2 3h2V6h-2v1Zm0 3h2v3h3v2h-3v3h-2v-3H8v-2h3v-3Z" />
    ),
    team: (
      <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm8-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM3 20a5 5 0 0 1 10 0H3Zm10.5-1.5a6.5 6.5 0 0 0-2.1-4.1A4.5 4.5 0 0 1 20.5 19h-7Z" />
    ),
    box: (
      <path d="M4 5h16v15H4V5Zm2 4h12V7H6v2Zm3 3v5h6v-5H9Z" />
    ),
    chart: (
      <path d="M5 19h14v2H3V4h2v15Zm2-2V9h3v8H7Zm5 0V5h3v12h-3Zm5 0v-6h3v6h-3Z" />
    ),
    gear: (
      <path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.2-2-3.4-2.2 1a8 8 0 0 0-2.6-1.5L14.4 3h-4l-.3 2.4A8 8 0 0 0 7.6 7L5.3 6l-2 3.4 2 1.2a7.8 7.8 0 0 0 0 3l-2 1.2 2 3.4 2.3-1a8 8 0 0 0 2.5 1.5l.3 2.4h4l.3-2.4a8 8 0 0 0 2.6-1.5l2.2 1 2-3.4-2.1-1.3ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
    ),
    help: (
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 17a1.2 1.2 0 1 1 0-2.4A1.2 1.2 0 0 1 12 19Zm1.2-4.1h-2v-.5c0-1.2.7-1.9 1.6-2.5.9-.6 1.5-1 1.5-1.9 0-.9-.7-1.5-1.9-1.5-1 0-1.9.5-2.6 1.4L8.5 8.6A4.7 4.7 0 0 1 12.6 7c2.3 0 3.9 1.2 3.9 3 0 1.6-1 2.4-2 3.1-.8.5-1.3.9-1.3 1.6v.2Z" />
    ),
    logout: (
      <path d="M5 4h8v2H7v12h6v2H5V4Zm10.6 4.4L17 7l5 5-5 5-1.4-1.4 2.6-2.6H11v-2h7.2l-2.6-2.6Z" />
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[type]}
    </svg>
  );
};

const StaffLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <div className="staff-brand">
          <strong>ZooLogix MS</strong>
          <span>Management Console</span>
        </div>

        <nav className="staff-nav" aria-label="Staff navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `staff-nav-link${isActive ? ' active' : ''}`}
            >
              <SidebarIcon type={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="staff-new-report">
          <span>+</span>
          New Report
        </button>

        <nav className="staff-nav staff-sidebar-footer" aria-label="Staff utility navigation">
          {footerItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="staff-nav-link">
              <SidebarIcon type={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button type="button" className="staff-nav-link staff-logout" onClick={handleLogout}>
            <SidebarIcon type="logout" />
            <span>Logout</span>
          </button>
        </nav>

        <div className="staff-user-card" aria-label="Current staff user">
          <div className="staff-user-avatar" />
          <div>
            <strong>Admin User</strong>
            <span>ZooLogix Admin</span>
          </div>
        </div>
      </aside>

      <main className="staff-main">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
