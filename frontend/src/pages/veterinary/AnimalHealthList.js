import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Edit, Eye, AlertTriangle, Activity, Users, Calendar } from 'lucide-react';
import StatusBadge from '../../components/vet/StatusBadge';
import { api } from '../../services/api';

const AnimalHealthList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  
  const [animals, setAnimals] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;
        if (areaFilter) params.area = areaFilter;

        const response = await api.getVetAnimalHealthStatus(params);
        const data = response.data || response;
        setAnimals(Array.isArray(data) ? data : []);
        const areas = Array.from(new Set((Array.isArray(data) ? data : []).map((animal) => animal.area).filter(Boolean)));
        setAvailableAreas(areas);
      } catch (error) {
        console.error('Error fetching animals:', error);
        setAnimals([]);
        setAvailableAreas([]);
      }
      setLoading(false);
    };

    const delay = setTimeout(() => {
      fetchAnimals();
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, statusFilter, areaFilter]);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-dark)' }}>
            Animal Health Status
          </h1>
          <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '14px' }}>
            Real-time monitoring of clinical conditions across all zoo sectors.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/vet/archive')}
            style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e5e7eb', 
            borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: 'var(--text-dark)'
          }}>
            <Filter size={18} /> Advanced Filters
          </button>
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', backgroundColor: 'var(--primary-green)', border: 'none', 
            borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: 'white'
          }}>
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #fee2e2', borderLeft: '4px solid #dc2626' }}>
          <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Critical Alerts</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{animals.filter(a => a.status === 'CRITICAL').length.toString().padStart(2, '0')}</span>
            <AlertTriangle size={24} color="#dc2626" />
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #fef3c7', borderLeft: '4px solid #d97706' }}>
          <div style={{ fontSize: '12px', color: '#d97706', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Under Treatment</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{animals.filter(a => a.status === 'TREATMENT').length.toString().padStart(2, '0')}</span>
            <Activity size={24} color="#d97706" />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid var(--primary-green)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Total Population</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{animals.length}</span>
            <Users size={24} color="var(--primary-green)" />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Scheduled Checks</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-dark)' }}>08</span>
            <Calendar size={24} color="#3b82f6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search by Animal, Species, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }}
            />
          </div>
          
          <select 
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: '#f9fafb', width: '200px', outline: 'none' }}
          >
            <option value="">All Areas</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: '#f9fafb', width: '200px', outline: 'none' }}
          >
            <option value="">All Statuses</option>
            <option value="HEALTHY">Healthy</option>
            <option value="MONITORING">Monitoring</option>
            <option value="TREATMENT">Under Treatment</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-gray)' }}>ANIMAL</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-gray)' }}>SPECIES</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-gray)' }}>ZOO AREA</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-gray)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-gray)' }}>LAST CHECK</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-gray)', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-gray)' }}>Loading data...</td></tr>
            ) : (
              <>
                {animals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((animal, idx) => (
                  <tr 
                    key={animal.id} 
                    onClick={() => navigate(`/vet/health/${animal.id}`)}
                    style={{ borderBottom: idx === animals.length - 1 ? 'none' : '1px solid #f3f4f6', cursor: 'pointer' }}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                           <img src={animal.image} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{animal.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{animal.code}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-dark)' }}>{animal.species}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-gray)' }}>{animal.area}</td>
                    <td style={{ padding: '16px 24px' }}><StatusBadge status={animal.status} /></td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-gray)' }}>{animal.lastCheck}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => navigate(`/vet/health/${animal.id}/update`)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-gray)', padding: '4px' }}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => navigate(`/vet/health/${animal.id}`)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-green)', padding: '4px' }}
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {animals.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-gray)' }}>
                      No animals found matching your criteria.
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e5e7eb', backgroundColor: 'white' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-gray)' }}>
            Showing {animals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, animals.length)} of {animals.length} animals
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{ padding: '6px 10px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', color: 'var(--text-gray)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              {'<'}
            </button>
            {Array.from({ length: Math.ceil(animals.length / itemsPerPage) || 1 }, (_, i) => i + 1).map((page) => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{ 
                  padding: '6px 12px', 
                  backgroundColor: currentPage === page ? 'var(--primary-green)' : 'white', 
                  border: currentPage === page ? '1px solid var(--primary-green)' : '1px solid #e5e7eb', 
                  borderRadius: '6px', 
                  color: currentPage === page ? 'white' : 'var(--text-dark)', 
                  cursor: 'pointer', 
                  fontWeight: '500' 
                }}
              >
                {page}
              </button>
            ))}
            <button 
              disabled={currentPage === Math.ceil(animals.length / itemsPerPage) || Math.ceil(animals.length / itemsPerPage) === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(animals.length / itemsPerPage)))}
              style={{ padding: '6px 10px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', color: 'var(--text-gray)', cursor: (currentPage === Math.ceil(animals.length / itemsPerPage) || Math.ceil(animals.length / itemsPerPage) === 0) ? 'not-allowed' : 'pointer', opacity: (currentPage === Math.ceil(animals.length / itemsPerPage) || Math.ceil(animals.length / itemsPerPage) === 0) ? 0.5 : 1 }}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AnimalHealthList;
