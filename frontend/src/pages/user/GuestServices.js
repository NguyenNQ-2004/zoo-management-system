import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './User.css';
import './GuestServices.css';
import { serviceApi } from '../../services/api';

const GuestServices = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Services');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceApi.getAll();
        const mapped = data.map((svc) => ({
          id: svc._id,
          title: svc.name,
          price: svc.price === 0 ? 'Free' : `$${svc.price.toFixed(2)}`,
          category: svc.category ? svc.category.toUpperCase() : 'OTHER',
          desc: svc.description,
          schedule: svc.duration > 0 ? `${svc.duration} mins` : 'Flexible',
          location: 'Sanctuary Area',
          badge: svc.isActive ? null : { text: 'Currently Unavailable', type: 'red' },
          image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }));
        setServices(mapped);
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(svc => {
    const matchesTab = activeTab === 'All Services' || svc.category === activeTab.toUpperCase();
    const matchesSearch = svc.title.toLowerCase().includes(searchQuery.toLowerCase()) || svc.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const dynamicTabs = ['All Services', ...new Set(services.map(s => s.category).filter(Boolean))].map(t => t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '));

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
            <input type="text" placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button className="btn-filter">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="services-tabs">
        {dynamicTabs.map((tab, idx) => (
          <div 
            key={idx} 
            className={`service-tab ${activeTab === tab.toUpperCase() || (tab === 'All Services' && activeTab === 'All Services') ? 'active' : ''}`}
            onClick={() => setActiveTab(tab === 'All Services' ? tab : tab.toUpperCase())}
            style={{ cursor: 'pointer' }}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="services-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map(svc => (
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

                <button className="btn-primary btn-block" onClick={() => navigate(`/user/services/${svc.id}`)}>View Details</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#6b7280', fontSize: '16px' }}>
            No services found matching your criteria. Try adjusting your search or filters.
          </div>
        )}
      </div>

      <button className="btn-outline">View All 18 Services</button>
    </div>
  );
};

export default GuestServices;
