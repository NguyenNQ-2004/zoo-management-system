import React from 'react';
import { Search, SlidersHorizontal, Clock, MapPin } from 'lucide-react';
import './User.css';
import './GuestServices.css';

const GuestServices = () => {
  const tabs = ['All Services', 'Tours & Education', 'Transport', 'Animal Encounters', 'Accessibility', 'VIP Experiences'];
  
  const services = [
    {
      id: 1,
      title: 'Guided Tour',
      price: '$25.00',
      category: 'TOURS & EDUCATION',
      desc: 'A 90-minute educational journey led by our expert conservationists, exploring rare species and sanctuary efforts.',
      schedule: 'Daily: 09:00 - 15:00',
      location: 'Main Plaza Hub',
      badge: { text: 'Top Rated', type: 'green' },
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Electric Shuttle',
      price: 'Free',
      category: 'TRANSPORT',
      desc: 'Hop-on hop-off zero-emission shuttles running every 10 minutes between major exhibit zones and facilities.',
      schedule: 'Daily: 08:00 - 18:00',
      location: 'Multiple Shuttle Stops',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Animal Feeding',
      price: '$15.00',
      category: 'ANIMAL ENCOUNTERS',
      desc: 'Interactive feeding sessions with giraffes or sea lions under the direct supervision of our veterinary staff.',
      schedule: 'Scheduled Slots',
      location: 'Giraffe Terrace',
      badge: { text: 'Limited Slots', type: 'red' },
      image: 'https://images.unsplash.com/photo-1564750975191-0edd1e8093de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'VIP Safari',
      price: '$120.00',
      category: 'VIP EXPERIENCES',
      desc: 'Private 4x4 safari through the savanna zone with a senior zoologist and exclusive behind-the-scenes access.',
      schedule: 'By Appointment Only',
      location: 'VIP Lounge Entry',
      image: 'https://images.unsplash.com/photo-1547471080-7cb2cb6a5a36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'Photo Workshop',
      price: '$45.00',
      category: 'TOURS & EDUCATION',
      desc: 'Master wildlife photography with professional instructors. Access hidden viewpoints for the perfect shot.',
      schedule: 'Sat & Sun: 07:00',
      location: 'Aviary Entrance',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      title: 'Stroller Rental',
      price: '$10.00',
      category: 'ACCESSIBILITY',
      desc: 'Ergonomic single and double strollers available for daily rental to ensure comfort for your little explorers.',
      schedule: 'Daily: All Day',
      location: 'Visitor Center',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div id="services" style={{ padding: '80px 60px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#fff' }}>
      <div className="services-header">
        <div className="services-title">
          <h1>Guest Services</h1>
          <p>
            Enhance your sanctuary experience with our range of professional guest services, from
            guided scientific tours to eco-friendly transportation.
          </p>
        </div>

        <div className="services-controls">
          <div className="services-search">
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search services..." />
          </div>
          <button className="btn-filter">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="services-tabs">
        {tabs.map((tab, idx) => (
          <div key={idx} className={`service-tab ${idx === 0 ? 'active' : ''}`}>
            {tab}
          </div>
        ))}
      </div>

      <div className="services-grid">
        {services.map(svc => (
          <div key={svc.id} className="service-card">
            <div className="service-image">
              <img src={svc.image} alt={svc.title} />
              <div className="service-category">{svc.category}</div>
              {svc.badge && (
                <div className={`service-badge ${svc.badge.type}`}>
                  {svc.badge.text}
                </div>
              )}
            </div>
            
            <div className="service-content">
              <div className="service-header">
                <h3>{svc.title}</h3>
                <div className="service-price">{svc.price}</div>
              </div>
              <p className="service-desc">{svc.desc}</p>
              
              <div className="service-info">
                <div className="info-row">
                  <Clock size={16} /> {svc.schedule}
                </div>
                <div className="info-row">
                  <MapPin size={16} /> {svc.location}
                </div>
              </div>

              <button className="btn-primary btn-block">View Details</button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-outline">View All 18 Services</button>
    </div>
  );
};

export default GuestServices;
