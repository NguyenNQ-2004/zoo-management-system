import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MeetResidents.css';

const MeetResidents = () => {
  const navigate = useNavigate();
  const animals = [
    {
      id: 1,
      name: 'Amur Leopard',
      scientific: 'Panthera pardus orientalis',
      zone: 'Zone B: Rainforest',
      status: 'ACTIVE',
      image: 'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'Bengal Tiger',
      scientific: 'Panthera tigris tigris',
      zone: 'Zone A: Savanna',
      status: 'HEALTHY',
      image: 'https://images.unsplash.com/photo-1561731216-c3a428c4e0f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Red Panda',
      scientific: 'Ailurus fulgens',
      zone: 'Zone B: Rainforest',
      status: 'ACTIVE',
      image: 'https://images.unsplash.com/photo-1542880941-18edbfce011a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'African Elephant',
      scientific: 'Loxodonta africana',
      zone: 'Zone A: Savanna',
      status: 'HEALTHY',
      image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div id="animals" style={{ padding: '80px 60px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#fff', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111', margin: '0 0 10px 0' }}>Meet Our Residents</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>Discover the amazing wildlife that calls ZooLogix home.</p>
        </div>
        <a href="#" style={{ color: '#111', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
          View All Animals <ArrowRight size={16} />
        </a>
      </div>

      <div className="residents-grid">
        {animals.map(animal => (
          <div key={animal.id} className="resident-card">
            <div className="resident-image">
              <img src={animal.image} alt={animal.name} />
            </div>
            <div className="resident-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111' }}>{animal.name}</h3>
                <span className={`resident-badge ${animal.status === 'HEALTHY' ? 'badge-healthy' : 'badge-active'}`}>
                  {animal.status}
                </span>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                {animal.scientific}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563', fontSize: '13px', marginBottom: '20px' }}>
                <MapPin size={14} /> {animal.zone}
              </div>
              <button className="btn-outline-green" onClick={() => navigate(`/user/animals/${animal.id}`)}>View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetResidents;
