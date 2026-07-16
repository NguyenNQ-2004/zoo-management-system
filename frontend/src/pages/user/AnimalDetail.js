import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldAlert, Heart, Scale, Clock, Info } from 'lucide-react';
import './AnimalDetail.css';
import { animalApi } from '../../services/api';

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const data = await animalApi.getById(id);
        
        const animalImages = [
          'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=1200&q=80',
          'https://images.unsplash.com/photo-1561731216-c3a428c4e0f4?w=1200&q=80',
          'https://images.unsplash.com/photo-1542880941-18edbfce011a?w=1200&q=80',
          'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1200&q=80',
          'https://images.unsplash.com/photo-1580428581643-421f1c7f5c53?w=1200&q=80',
          'https://images.unsplash.com/photo-1540126034813-121bf29033d2?w=1200&q=80'
        ];
        
        const imgIndex = parseInt(id.slice(-4), 16) % animalImages.length || 0;

        setAnimal({
          ...data,
          image: animalImages[imgIndex],
          description: data.description || `Discover more about this magnificent ${data.species || 'animal'} at our zoo.`,
          funFact: data.funFact || 'Every animal here contributes to our global conservation efforts.',
          weight: data.weight || 'Varies',
          lifespan: data.lifespan || 'Unknown',
          diet: data.diet || 'Specialized'
        });
      } catch (err) {
        console.error('Failed to fetch animal details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimal();
  }, [id]);

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>;
  if (!animal) return <div style={{ padding: '80px', textAlign: 'center' }}>Animal not found.</div>;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="animal-hero" style={{ backgroundImage: `url(${animal.image})` }}>
        <div className="hero-gradient"></div>
        <button className="btn-back-floating" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <div className="animal-hero-content">
          <div className="animal-badges">
            <span className={`badge-status ${animal.status === 'Active' ? 'endangered' : ''}`} style={{backgroundColor: '#fff', color: '#111'}}><ShieldAlert size={14}/> {animal.healthStatus || animal.status}</span>
            <span className="badge-zone"><MapPin size={14}/> {animal.origin || 'Zoo Area'}</span>
          </div>
          <h1>{animal.name}</h1>
          <h3>{animal.species}</h3>
        </div>
      </div>

      <div className="animal-content-wrapper">
        <div className="animal-main">
           <h2>About {animal.name}</h2>
           <p className="animal-desc">{animal.description}</p>
           
           <div className="fun-fact-card">
              <h4>Did you know?</h4>
              <p>{animal.funFact}</p>
           </div>
        </div>
        <div className="animal-sidebar">
           <div className="quick-stats-card">
             <h3>Quick Stats</h3>
             <div className="stat-row">
               <div className="stat-icon"><Info size={18}/></div>
               <div>
                 <div className="stat-label">Gender</div>
                 <div className="stat-val">{animal.gender || 'Unknown'}</div>
               </div>
             </div>
             <div className="stat-row">
               <div className="stat-icon"><Clock size={18}/></div>
               <div>
                 <div className="stat-label">Age</div>
                 <div className="stat-val">{animal.age ? `${animal.age} years` : 'Unknown'}</div>
               </div>
             </div>
             <div className="stat-row">
               <div className="stat-icon"><Heart size={18}/></div>
               <div>
                 <div className="stat-label">Behavior</div>
                 <div className="stat-val">{animal.behavior || 'Normal'}</div>
               </div>
             </div>
           </div>
           
           <button className="btn-primary" style={{width: '100%', padding: '16px', borderRadius: '12px'}} onClick={() => navigate('/user/book')}>
             Book Tickets to See Me
           </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetail;
