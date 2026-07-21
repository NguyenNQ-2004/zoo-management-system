import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './StaffLayout.css';

const navItems = [
  { to: '/staff', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/staff/tasks', label: 'Operations', icon: 'team' },
  { to: '/staff/schedule', label: 'Schedule', icon: 'calendar' },
  { to: '/staff/animals', label: 'Animal Care', icon: 'paw' },
  { to: '/staff/care-logs', label: 'Care Logs', icon: 'logs' }
];

const SidebarIcon = ({ type }) => {
  const icons = {
    grid: (
      <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />
    ),
    paw: (
      <path d="M7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm7-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm7 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM9.2 13.2c1.4-2.3 4.2-2.3 5.6 0l1.4 2.4c1.1 1.9-.3 4.2-2.5 3.7l-1.1-.2a3 3 0 0 0-1.2 0l-1.1.2c-2.2.5-3.6-1.8-2.5-3.7l1.4-2.4Z" />
    ),
    team: (
      <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm8-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM3 20a5 5 0 0 1 10 0H3Zm10.5-1.5a6.5 6.5 0 0 0-2.1-4.1A4.5 4.5 0 0 1 20.5 19h-7Z" />
    ),
    calendar: (
      <path d="M7 2h2v3h6V2h2v3h3v17H4V5h3V2Zm11 8H6v10h12V10ZM6 7v1h12V7H6Zm2 5h3v3H8v-3Zm5 0h3v3h-3v-3Z" />
    ),
    logs: (
      <path d="M5 4h14v16H5V4Zm2 3v2h10V7H7Zm0 4v2h10v-2H7Zm0 4v2h7v-2H7Z" />
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
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (error) {
      return null;
    }
  })();
  const staffName = currentUser?.fullName || currentUser?.name || currentUser?.email || 'Staff';

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

        <nav className="staff-nav staff-sidebar-footer" aria-label="Staff utility navigation">
          <button type="button" className="staff-nav-link staff-logout" onClick={handleLogout}>
            <SidebarIcon type="logout" />
            <span>Logout</span>
          </button>
        </nav>

        <div className="staff-user-card" aria-label="Current staff user">
          <div className="staff-user-avatar" />
          <div>
            <strong>{staffName}</strong>
            <span>ZooLogix Staff</span>
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
