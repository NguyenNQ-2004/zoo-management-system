import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  ClipboardList, 
  Syringe, 
  History, 
  Bell, 
  Settings, 
  LogOut,
  HelpCircle
} from 'lucide-react';

const VetLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const navItems = [
    { path: '/vet', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/vet/health', label: 'Animal Health', icon: Activity },
    { path: '/vet/medical-logs', label: 'Medical Logs', icon: ClipboardList },
    { path: '/vet/treatments', label: 'Treatments', icon: Syringe },
    { path: '/vet/history', label: 'Medical History', icon: History },
    { path: '/vet/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'var(--bg-sidebar)', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0
      }}>
        {/* Logo/Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>ZooLogix MS</h1>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>Management Console</div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/vet' && location.pathname.startsWith(item.path)) ||
                             (item.path === '/vet/health' && location.pathname.startsWith('/vet/archive'));
            return (
              <Link 
                key={item.path}
                to={item.path} 
                style={{ 
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)', 
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}

          <button 
            onClick={() => navigate('/vet/notifications?new=true')}
            style={{
              marginTop: '20px',
              backgroundColor: '#A7F3D0', // Light green
              color: '#065F46',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            + New Report
          </button>
        </nav>

        {/* Footer Nav */}
        <div style={{ padding: '20px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/vet/settings" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
              <Settings size={18} /> Settings
            </Link>
            <button 
              onClick={handleLogout} 
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: 'none', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', textAlign: 'left' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', /* Same as sidebar width */
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default VetLayout;
