import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Clock } from 'lucide-react';
import './ZooAreaDetail.css';
import './AnimalDetail.css'; // For shared hero styles

const ZooAreaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const areasData = {
    '1': {
      name: 'Tropical Rainforest',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1596324121712-5bbc14482174?w=1200&q=80',
      description: 'Step into a lush, humid environment filled with exotic plants and animals. Experience the dense canopy and discover the incredible biodiversity of the world\'s tropical rainforests.',
      schedule: '09:00 AM - 05:00 PM',
      size: '15 Acres',
      animals: [
        { id: 1, name: 'Amur Leopard', image: 'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=400&q=80' },
        { id: 3, name: 'Red Panda', image: 'https://images.unsplash.com/photo-1542880941-18edbfce011a?w=400&q=80' }
      ]
    },
    '2': {
      name: 'Savanna Plains',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
      description: 'A vast open-range habitat designed to replicate the African plains. Watch as herds roam free and predators rest under the acacia trees.',
      schedule: '08:00 AM - 06:00 PM',
      size: '45 Acres',
      animals: [
        { id: 2, name: 'Bengal Tiger', image: 'https://images.unsplash.com/photo-1561731216-c3a428c4e0f4?w=400&q=80' },
        { id: 4, name: 'African Elephant', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&q=80' }
      ]
    },
    '3': {
      name: 'Aquatic Center',
      status: 'Closed for Maintenance',
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200&q=80',
      description: 'Deep water habitats showcasing marine life in highly specialized, controlled aquatic environments.',
      schedule: 'Currently Closed',
      size: '8 Acres',
      animals: []
    }
  };

  const area = areasData[id] || areasData['1'];

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="area-hero" style={{ backgroundImage: `url(${area.image})` }}>
        <div className="hero-gradient"></div>
        <button className="btn-back-floating" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <div className="area-hero-content">
          <span className="badge-status open">{area.status}</span>
          <h1>{area.name}</h1>
        </div>
      </div>

      <div className="area-content-wrapper">
        <div className="area-main">
          <h2>About {area.name}</h2>
          <p className="area-desc">{area.description}</p>
          
          <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Animals in this Area</h3>
          <div className="area-animals-grid">
            {area.animals.map(a => (
              <div key={a.id} className="area-animal-card" onClick={() => navigate(`/user/animals/${a.id}`)}>
                <img src={a.image} alt={a.name} />
                <div className="card-name">{a.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="area-sidebar">
          <div className="info-card">
            <h3>Area Information</h3>
            <div className="info-row">
              <Clock size={18} color="#666"/>
              <div>
                <div className="info-label">Operating Hours</div>
                <div className="info-val">{area.schedule}</div>
              </div>
            </div>
            <div className="info-row">
              <Map size={18} color="#666"/>
              <div>
                <div className="info-label">Area Size</div>
                <div className="info-val">{area.size}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZooAreaDetail;
