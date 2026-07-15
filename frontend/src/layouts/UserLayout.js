import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Bell, Search } from 'lucide-react';
import '../pages/user/User.css';

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleScroll = (e, id) => {
    e.preventDefault();
    if (location.pathname !== '/user') {
      navigate('/user');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <nav className="user-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/user" className="nav-logo">
          <Leaf color="#1B5E3C" size={24} />
          ZooLogix
        </Link>
        <div className="nav-links">
          <a href="#home" onClick={(e) => handleScroll(e, 'home')} className="nav-link">Home</a>
          <a href="#explore" onClick={(e) => handleScroll(e, 'explore')} className="nav-link">Explore Zoo</a>
          <a href="#animals" onClick={(e) => handleScroll(e, 'animals')} className="nav-link">Animals</a>
          <a href="#services" onClick={(e) => handleScroll(e, 'services')} className="nav-link">Services</a>
          <Link to="/user/tickets" className="nav-link">My Tickets</Link>
        </div>
        <div className="nav-actions">
          <Bell size={20} style={{ cursor: 'pointer' }} />
          <Search size={20} style={{ cursor: 'pointer' }} />
          <div className="user-avatar" onClick={handleLogout} title="Logout">
            U
          </div>
        </div>
      </nav>
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="footer">
        <div>
          <div className="footer-logo">ZooLogix</div>
          <div className="footer-text">© 2024 ZooLogix Conservation Management. All rights reserved.</div>
        </div>
        <div className="footer-links">
          <a href="#!" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a href="#!" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          <a href="#!" onClick={(e) => e.preventDefault()}>Contact Us</a>
          <a href="#!" onClick={(e) => e.preventDefault()}>Careers</a>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
