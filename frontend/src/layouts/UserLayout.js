import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Bell, Search } from 'lucide-react';
import '../pages/user/User.css';

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

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
          <div style={{ position: 'relative' }}>
            <div onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#dc2626', borderRadius: '50%', border: '2px solid white' }}></div>
            </div>
            
            {showNotifications && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 190 }} onClick={() => setShowNotifications(false)}></div>
                <div style={{ position: 'absolute', top: '35px', right: '-10px', width: '320px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', overflow: 'hidden', zIndex: 200, textAlign: 'left' }}>
                  <div style={{ padding: '15px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111' }}>Notifications</h4>
                    <span style={{ fontSize: '12px', color: '#1B5E3C', cursor: 'pointer', fontWeight: 600 }}>Mark all as read</span>
                  </div>
                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    <div style={{ padding: '15px 20px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: '#f0fdf4' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>Booking Confirmed! 🎟️</div>
                      <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.4 }}>Your tickets for the VIP Safari Tour on Oct 24 have been confirmed.</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>2 minutes ago</div>
                    </div>
                    <div style={{ padding: '15px 20px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: 'white' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>Welcome to ZooLogix! 🌿</div>
                      <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.4 }}>Thank you for joining our conservation community. Start exploring today.</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>1 day ago</div>
                    </div>
                    <div style={{ padding: '15px 20px', cursor: 'pointer', background: 'white' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>Upcoming Event: Night Safari 🌙</div>
                      <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.4 }}>Don't miss our exclusive night safari this weekend. Book your spot now!</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>3 days ago</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '13px', color: '#1B5E3C', fontWeight: 600, cursor: 'pointer', background: '#f9fafb' }}>
                    View All Notifications
                  </div>
                </div>
              </>
            )}
          </div>
          <Search size={20} style={{ cursor: 'pointer' }} />
          <div className="user-avatar" onClick={() => navigate('/user/profile')} title="Profile" style={{ padding: 0, overflow: 'hidden', background: 'none' }}>
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
