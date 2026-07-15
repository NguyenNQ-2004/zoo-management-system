import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldAlert, Heart, Scale, Clock } from 'lucide-react';
import './AnimalDetail.css';

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock animal data dictionary
  const animalsData = {
    '1': {
      name: 'Amur Leopard',
      scientific: 'Panthera pardus orientalis',
      status: 'Endangered',
      zone: 'Zone B: Rainforest',
      image: 'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=1200&q=80',
      description: 'The Amur leopard is a leopard subspecies native to the Primorye region of southeastern Russia and northern China. It is listed as Critically Endangered on the IUCN Red List.',
      weight: '32 - 48 kg',
      lifespan: '10 - 15 years',
      diet: 'Carnivore',
      funFact: 'Amur leopards have longer legs than other leopards, which helps them walk in deep snow.'
    },
    '2': {
      name: 'Bengal Tiger',
      scientific: 'Panthera tigris tigris',
      status: 'Endangered',
      zone: 'Zone A: Savanna',
      image: 'https://images.unsplash.com/photo-1561731216-c3a428c4e0f4?w=1200&q=80',
      description: 'The Bengal tiger is a tiger from a specific population of the Panthera tigris tigris subspecies that is native to the Indian subcontinent. It is one of the biggest wild cats alive today.',
      weight: '140 - 280 kg',
      lifespan: '8 - 10 years',
      diet: 'Carnivore',
      funFact: 'A tiger\'s roar can be heard as far as three miles away.'
    },
    '3': {
      name: 'Red Panda',
      scientific: 'Ailurus fulgens',
      status: 'Endangered',
      zone: 'Zone B: Rainforest',
      image: 'https://images.unsplash.com/photo-1542880941-18edbfce011a?w=1200&q=80',
      description: 'The red panda is a carnivoran native to the eastern Himalayas and southwestern China. It has dense reddish-brown fur with a black belly and legs, white-lined ears, and a mostly white muzzle.',
      weight: '3.2 - 15 kg',
      lifespan: '8 - 10 years',
      diet: 'Omnivore',
      funFact: 'Red pandas use their long, bushy tails like a blanket to keep warm in the winter.'
    },
    '4': {
      name: 'African Elephant',
      scientific: 'Loxodonta africana',
      status: 'Vulnerable',
      zone: 'Zone A: Savanna',
      image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1200&q=80',
      description: 'The African bush elephant is the largest living terrestrial animal. They have a massive body, large ears, and a long trunk which has many functions including breathing, smelling, and lifting objects.',
      weight: '3,000 - 6,000 kg',
      lifespan: '60 - 70 years',
      diet: 'Herbivore',
      funFact: 'Elephants can communicate using seismic vibrations through the ground over long distances.'
    }
  };

  const animal = animalsData[id] || animalsData['1'];

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="animal-hero" style={{ backgroundImage: `url(${animal.image})` }}>
        <div className="hero-gradient"></div>
        <button className="btn-back-floating" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <div className="animal-hero-content">
          <div className="animal-badges">
            <span className="badge-status endangered"><ShieldAlert size={14}/> {animal.status}</span>
            <span className="badge-zone"><MapPin size={14}/> {animal.zone}</span>
          </div>
          <h1>{animal.name}</h1>
          <h3>{animal.scientific}</h3>
        </div>
      </div>

      <div className="animal-content-wrapper">
        <div className="animal-main">
           <h2>About the {animal.name}</h2>
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
               <div className="stat-icon"><Scale size={18}/></div>
               <div>
                 <div className="stat-label">Weight</div>
                 <div className="stat-val">{animal.weight}</div>
               </div>
             </div>
             <div className="stat-row">
               <div className="stat-icon"><Clock size={18}/></div>
               <div>
                 <div className="stat-label">Lifespan</div>
                 <div className="stat-val">{animal.lifespan}</div>
               </div>
             </div>
             <div className="stat-row">
               <div className="stat-icon"><Heart size={18}/></div>
               <div>
                 <div className="stat-label">Diet</div>
                 <div className="stat-val">{animal.diet}</div>
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
