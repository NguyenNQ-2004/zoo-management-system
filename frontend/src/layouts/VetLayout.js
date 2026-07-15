import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const VetLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: '250px', backgroundColor: '#1B5E3C', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Veterinary Portal</h2>
        <Link to="/vet" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/vet/health" style={{ color: 'white', textDecoration: 'none' }}>Animal Health</Link>
        <Link to="/vet/medical-logs" style={{ color: 'white', textDecoration: 'none' }}>Medical Logs</Link>
        <Link to="/vet/treatments" style={{ color: 'white', textDecoration: 'none' }}>Treatments</Link>
        <Link to="/vet/history" style={{ color: 'white', textDecoration: 'none' }}>Medical History</Link>
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

export default VetLayout;
