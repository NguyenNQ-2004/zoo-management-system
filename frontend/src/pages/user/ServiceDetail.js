import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, MapPin } from 'lucide-react';
import './ZooAreaDetail.css'; // Reusing area hero styles

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const servicesData = {
    '1': {
      name: 'Safari Guided Tour',
      category: 'Tours',
      desc: 'Join our expert guides for an immersive 2-hour tour through our largest habitats. Get exclusive access to behind-the-scenes areas and learn about our conservation efforts from the professionals.',
      price: '$25/person',
      availability: 'Daily: 10AM, 2PM',
      location: 'Departs from Main Plaza',
      duration: '2 Hours',
      image: 'https://images.unsplash.com/photo-1544971587-b842c27f8e14?w=1200&q=80'
    },
    '2': {
      name: 'Electric Scooter Rental',
      category: 'Rentals',
      desc: 'Navigate the zoo with ease. Our eco-friendly scooters are available for full or half-day rentals, perfect for exploring our expansive 100-acre sanctuary without fatigue.',
      price: '$30/day',
      availability: 'Available from 08:00 AM to 05:00 PM',
      location: 'Main Gate Rental Kiosk',
      duration: 'Full Day or Half Day',
      image: 'https://images.unsplash.com/photo-1593883733059-e9185a7322d7?w=1200&q=80'
    },
    '3': {
      name: 'Premium Dining Package',
      category: 'Dining',
      desc: 'Enjoy a 3-course meal at the Canopy Restaurant with panoramic views of the Rainforest exhibit. Includes your choice of appetizer, main course, dessert, and non-alcoholic beverages.',
      price: '$45/person',
      availability: '11:00 AM - 08:00 PM',
      location: 'Canopy Restaurant (Zone B)',
      duration: 'Flexible',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'
    }
  };

  const service = servicesData[id] || servicesData['1'];

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
                <div className="info-label">Availability</div>
                <div className="info-val">{service.availability}</div>
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
