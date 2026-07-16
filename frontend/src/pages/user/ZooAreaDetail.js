import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Clock } from 'lucide-react';
import './ZooAreaDetail.css';
import './AnimalDetail.css';
import { areaApi, animalApi } from '../../services/api';

const ZooAreaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [area, setArea] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areaData, animalsData] = await Promise.all([
          areaApi.getById(id),
          animalApi.getAll({ area: id })
        ]);

        const areaImages = [
          'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
          'https://images.unsplash.com/photo-1596324121712-5bbc14482174?w=1200&q=80',
          'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200&q=80'
        ];
        // Hash id to pick image
        const imgIndex = parseInt(id.slice(-4), 16) % areaImages.length || 0;

        setArea({
          ...areaData,
          image: areaImages[imgIndex]
        });

        const animalImages = [
          'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=400&q=80',
          'https://images.unsplash.com/photo-1561731216-c3a428c4e0f4?w=400&q=80',
          'https://images.unsplash.com/photo-1542880941-18edbfce011a?w=400&q=80',
          'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&q=80',
          'https://images.unsplash.com/photo-1580428581643-421f1c7f5c53?w=400&q=80',
          'https://images.unsplash.com/photo-1540126034813-121bf29033d2?w=400&q=80'
        ];

        setAnimals(animalsData.map((a, idx) => ({
          ...a,
          image: animalImages[idx % animalImages.length]
        })));
      } catch (error) {
        console.error('Failed to fetch area data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!area) {
    return <div style={{ padding: '80px', textAlign: 'center' }}>Area not found.</div>;
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="area-hero" style={{ backgroundImage: `url(${area.image})` }}>
        <div className="hero-gradient"></div>
        <button className="btn-back-floating" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <div className="area-hero-content">
          <span className={`badge-status ${area.status === 'Open' ? 'open' : ''}`} style={{ backgroundColor: area.status === 'Open' ? '#dcfce7' : '#fee2e2', color: area.status === 'Open' ? '#166534' : '#991b1b' }}>
            {area.status}
          </span>
          <h1>{area.name}</h1>
        </div>
      </div>

      <div className="area-content-wrapper">
        <div className="area-main">
          <h2>About {area.name}</h2>
          <p className="area-desc">{area.description || 'Discover the amazing wildlife in this beautifully crafted habitat.'}</p>
          
          <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Animals in this Area</h3>
          <div className="area-animals-grid">
            {animals.length > 0 ? animals.map(a => (
              <div key={a._id} className="area-animal-card" onClick={() => navigate(`/user/animals/${a._id}`)}>
                <img src={a.image} alt={a.name} />
                <div className="card-name">{a.name} ({a.species})</div>
              </div>
            )) : <p>No animals found in this area.</p>}
          </div>
        </div>

        <div className="area-sidebar">
          <div className="info-card">
            <h3>Area Information</h3>
            <div className="info-row">
              <Clock size={18} color="#666"/>
              <div>
                <div className="info-label">Operating Hours</div>
                <div className="info-val">08:00 AM - 06:00 PM</div>
              </div>
            </div>
            <div className="info-row">
              <Map size={18} color="#666"/>
              <div>
                <div className="info-label">Capacity</div>
                <div className="info-val">{area.capacity || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZooAreaDetail;
