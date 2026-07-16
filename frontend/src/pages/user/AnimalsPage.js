import React from 'react';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AnimalsPage.css';

const AnimalsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#f9fafb' }}>
      <div id="home" className="animals-hero" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' }}></div>
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontSize: '48px', marginBottom: '24px' }}>Experience the Wild with Elegance</h1>
          <p className="hero-subtitle" style={{ fontSize: '16px', maxWidth: '700px', margin: '0 auto 40px' }}>
            Immerse yourself in world-class conservation habitats. Discover rare species
            in meticulously designed environments that prioritize animal welfare and
            visitor education.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" style={{ padding: '14px 32px' }} onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}>Explore Zoo</button>
            <button className="btn-secondary" style={{ padding: '14px 32px', background: 'white', color: '#111', border: 'none' }} onClick={() => navigate('/user/book')}>Book Ticket</button>
          </div>
        </div>
      </div>

      <div className="animals-booking-widget">
        <div className="booking-field">
          <label>Select Date</label>
          <div className="booking-field-input">
            <span>mm/dd/yyyy</span>
            <Calendar size={18} color="#9ca3af" />
          </div>
        </div>
        <div className="booking-field">
          <label>Visitors</label>
          <div className="booking-field-input">
            <span>2 Adults, 1 Child</span>
            <Users size={18} color="#9ca3af" />
          </div>
        </div>
        <button className="btn-primary" style={{ padding: '16px 32px', height: '52px', margin: 0 }} onClick={() => navigate('/user/book')}>Find Availability</button>
      </div>

      <div className="habitats-container">
        <h2 className="habitats-title">Featured Habitats</h2>
        
        <div className="habitats-layout">
          <div className="habitats-left">
            {/* Savanna Plains */}
            <div className="habitat-card" style={{ height: '350px' }}>
              <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Savanna Plains" />
              <div className="habitat-overlay">
                <div className="habitat-badge">Zone A</div>
                <h3 className="habitat-title">Savanna Plains</h3>
                <p className="habitat-desc">Experience the vastness of Africa</p>
                <div className="habitat-arrow"><ArrowRight size={20} /></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', height: '250px' }}>
              {/* Oceanic Depths */}
              <div className="habitat-card" style={{ flex: '0 0 35%' }}>
                <img src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Oceanic Depths" />
                <div className="habitat-overlay" style={{ padding: '24px' }}>
                  <div className="habitat-badge">Zone C</div>
                  <h3 className="habitat-title" style={{ fontSize: '20px' }}>Oceanic Depths</h3>
                </div>
              </div>

              {/* Conservation Center */}
              <div className="conservation-card" style={{ flex: 1 }}>
                <div className="conservation-content">
                  <h3>Conservation Center</h3>
                  <p>
                    Learn about our ongoing efforts to protect endangered species and habitats globally.
                  </p>
                  <a href="#">Discover More <ArrowRight size={14} /></a>
                </div>
                <div className="conservation-image">
                  <img src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Conservation Center Vet" />
                </div>
              </div>
            </div>
          </div>

          <div className="habitats-right">
            {/* Rainforest Canopy */}
            <div className="habitat-card" style={{ height: '100%' }}>
              <img src="https://images.unsplash.com/photo-1596324121712-5bbc14482174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Rainforest Canopy" />
              <div className="habitat-overlay">
                <div className="habitat-badge">Zone B</div>
                <h3 className="habitat-title">Rainforest Canopy</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalsPage;
