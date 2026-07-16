import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, MapPin } from 'lucide-react';
import './ZooAreaDetail.css';
import { serviceApi } from '../../services/api';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const services = await serviceApi.getAll();
        const found = services.find(s => s._id === id);

        const images = [
          'https://images.unsplash.com/photo-1544971587-b842c27f8e14?w=1200&q=80',
          'https://images.unsplash.com/photo-1593883733059-e9185a7322d7?w=1200&q=80',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80'
        ];
        
        if (found) {
          const imgIndex = parseInt(id.slice(-4), 16) % images.length || 0;
          setService({
            ...found,
            image: images[imgIndex],
            category: found.category || 'Service',
            desc: found.description || 'Enjoy our wonderful services designed for your best experience.',
            price: found.price ? `$${found.price}` : 'Free',
            availability: found.isActive ? 'Available' : 'Currently Unavailable',
            duration: found.duration ? `${found.duration} mins` : 'Flexible',
            location: 'Main Zoo Area'
          });
        }
      } catch (err) {
        console.error('Failed to fetch service detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>;
  if (!service) return <div style={{ padding: '80px', textAlign: 'center' }}>Service not found.</div>;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="area-hero" style={{ backgroundImage: `url(${service.image})` }}>
        <div className="hero-gradient" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }}></div>
        <button className="btn-back-floating" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <div className="area-hero-content">
          <span className="badge-status open" style={{ background: '#dcfce7', color: '#166534' }}>{service.category}</span>
          <h1>{service.name}</h1>
        </div>
      </div>

      <div className="area-content-wrapper">
        <div className="area-main">
          <h2>About this Service</h2>
          <p className="area-desc">{service.desc}</p>
        </div>

        <div className="area-sidebar">
          <div className="info-card">
            <h3>Service Details</h3>
            <div className="info-row">
              <DollarSign size={18} color="#666"/>
              <div>
                <div className="info-label">Price</div>
                <div className="info-val">{service.price}</div>
              </div>
            </div>
            <div className="info-row">
              <Clock size={18} color="#666"/>
              <div>
                <div className="info-label">Availability / Duration</div>
                <div className="info-val">{service.availability} - {service.duration}</div>
              </div>
            </div>
            <div className="info-row">
              <MapPin size={18} color="#666"/>
              <div>
                <div className="info-label">Location</div>
                <div className="info-val">{service.location}</div>
              </div>
            </div>
            
            <button className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '16px', borderRadius: '8px' }} onClick={() => navigate('/user/book')}>
              Book This Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
