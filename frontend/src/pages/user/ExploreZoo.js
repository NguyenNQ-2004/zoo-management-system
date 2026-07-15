import React, { useState } from 'react';
import { ArrowRight, Search, ChevronDown, ChevronLeft, ChevronRight, PawPrint, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './User.css';

const ExploreZoo = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const exhibits = [
    {
      id: 1,
      title: 'Tropical Rainforest',
      desc: 'Immerse yourself in a multi-level canopy experience featuring free-flying birds, primates, and dense tropical flora.',
      species: 45,
      zone: 'Zone A',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1596324121712-5bbc14482174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Savanna Plains',
      desc: 'A vast open-range habitat designed to replicate the African plains, home to our largest grazing herds and predators.',
      species: 28,
      zone: 'Zone C',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Aquatic Center',
      desc: 'Deep water habitats showcasing marine life in highly specialized, controlled aquatic environments.',
      species: 120,
      zone: 'Zone B',
      status: 'Closed for Maintenance',
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredExhibits = exhibits.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ex.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Open') {
      matchesStatus = ex.status === 'Open';
    } else if (statusFilter === 'Closed') {
      matchesStatus = ex.status.includes('Closed');
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div id="explore" style={{ padding: '80px 60px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f9fafb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 800, margin: '0 0 15px 0', color: '#111' }}>Explore Our Exhibits</h1>
          <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
            Discover diverse ecosystems and the incredible wildlife that call our<br/>
            sanctuary home. Plan your journey through our carefully curated habitats.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search exhibits..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '12px 15px 12px 40px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '250px', outline: 'none' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '12px 40px 12px 15px', border: '1px solid #e5e7eb', borderRadius: '8px', appearance: 'none', background: 'white', minWidth: '150px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            <ChevronDown size={18} color="#9ca3af" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      <div className="explore-grid">
        {filteredExhibits.length > 0 ? (
          filteredExhibits.map(ex => (
            <div key={ex.id} className="exhibit-card">
              <div className="exhibit-image-wrapper">
                <img src={ex.image} alt={ex.title} />
                <div className={`status-badge ${ex.status === 'Open' ? 'badge-green' : 'badge-red'}`}>
                  <div className="status-dot" style={{ backgroundColor: ex.status === 'Open' ? '#16a34a' : '#dc2626' }}></div>
                  {ex.status}
                </div>
              </div>
              <div className="exhibit-content">
                <h3 className="exhibit-title">{ex.title}</h3>
                <p className="exhibit-desc">{ex.desc}</p>
                
                <div className="exhibit-stats">
                  <div className="stat-item">
                    <PawPrint size={16} /> {ex.species} Species
                  </div>
                  <div className="stat-item">
                    <Map size={16} /> {ex.zone}
                  </div>
                </div>

                {ex.status === 'Open' ? (
                  <button className="btn-primary btn-block" onClick={() => navigate(`/user/explore/${ex.id}`)}>Explore Exhibit <ArrowRight size={16} /></button>
                ) : (
                  <button className="btn-secondary btn-block btn-disabled" onClick={() => navigate(`/user/explore/${ex.id}`)}>Exhibit Details</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#6b7280', fontSize: '16px' }}>
            No exhibits found matching your criteria. Try adjusting your search or filters.
          </div>
        )}
      </div>

      <div className="pagination">
        <button className="page-btn"><ChevronLeft size={18} /></button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <div style={{ display: 'flex', alignItems: 'flex-end', padding: '0 5px' }}>...</div>
        <button className="page-btn">8</button>
        <button className="page-btn"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
};

export default ExploreZoo;
