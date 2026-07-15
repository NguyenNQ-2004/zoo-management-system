import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import StatusBadge from '../../components/vet/StatusBadge';
import { api } from '../../services/api';

const HealthRecordsArchive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [vetId, setVetId] = useState('');
  const [area, setArea] = useState('');
  
  const [cards, setCards] = useState([]);
  const [logs, setLogs] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (category) params.category = category;
      if (dateRange) params.date = dateRange;
      if (vetId) params.vetId = vetId;
      if (area) params.area = area;

      const response = await api.getVetHealthRecords(params);
      const data = response.data || response;
      if (data) {
        setCards(data.cards || []);
        setLogs(data.logs || []);
        const areas = Array.from(new Set((data.logs || []).map((record) => record.area).filter(Boolean)));
        setAvailableAreas(areas);
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
      setCards([]);
      setLogs([]);
      setAvailableAreas([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplySearch = () => {
    fetchRecords();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setDateRange('');
    setVetId('');
    setArea('');
    // We can fetch immediately or wait for user to click Apply Search
    // But it's better to fetch immediately
    setTimeout(() => {
      fetchRecords();
    }, 0);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-dark)' }}>
            Health Records Archive
          </h1>
          <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '14px' }}>
            Comprehensive animal health tracking and veterinary history.
          </p>
        </div>
        <div>
          <span style={{ backgroundColor: '#f3f4f6', color: 'var(--text-gray)', padding: '6px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '600' }}>
            {logs.length} records found
          </span>
        </div>
      </div>

      {/* Filter Card */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        {/* Large Search Input */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Search by Animal ID, Species, or Diagnosis..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '16px 16px 16px 48px', 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: '#f9fafb', 
              fontSize: '15px',
              outline: 'none'
            }}
          />
        </div>
        
        {/* Dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-gray)', marginBottom: '8px', textTransform: 'uppercase' }}>Health Category</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: 'white', outline: 'none' }}>
              <option value="">All Categories</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Surgery">Surgery</option>
              <option value="Vaccination">Vaccination</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-gray)', marginBottom: '8px', textTransform: 'uppercase' }}>Date</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="date" 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: 'white', outline: 'none' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-gray)', marginBottom: '8px', textTransform: 'uppercase' }}>Vet In Charge</label>
            <select 
              value={vetId} onChange={(e) => setVetId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: 'white', outline: 'none' }}>
              <option value="">Any Personnel</option>
              <option value="dr_thorne">Dr. A. Thorne</option>
              <option value="dr_vance">Dr. E. Vance</option>
              <option value="dr_holloway">Dr. M. Holloway</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-gray)', marginBottom: '8px', textTransform: 'uppercase' }}>Habitat Area</label>
            <select 
              value={area} onChange={(e) => setArea(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: 'white', outline: 'none' }}>
              <option value="">All Enclosures</option>
              {availableAreas.map((optionArea) => (
                <option key={optionArea} value={optionArea}>{optionArea}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
          <button 
            onClick={handleClearFilters}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#dc2626', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '8px 0' }}>
            <AlertTriangle size={16} /> Clear all filters
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '10px 20px', borderRadius: '24px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: 'var(--text-dark)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Export Results
            </button>
            <button 
              onClick={handleApplySearch}
              style={{ padding: '10px 24px', borderRadius: '24px', border: 'none', backgroundColor: 'var(--primary-green)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Apply Search
            </button>
          </div>
        </div>
      </div>

      {/* Animal Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
            {cards.map((animal) => (
              <div key={animal.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <img src={animal.image} alt={animal.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                  <StatusBadge status={animal.status} />
                </div>
                
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--text-dark)' }}>{animal.name} ({animal.id})</h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--text-gray)' }}>{animal.procedure}</p>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-gray)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>DATE</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>{animal.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-gray)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>VET</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>{animal.vet}</div>
                  </div>
                </div>
                
                <button style={{ width: '100%', padding: '10px', backgroundColor: '#f9fafb', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)', cursor: 'pointer', marginTop: 'auto' }}>
                  View Full History
                </button>
              </div>
            ))}
          </div>

      {/* Recent Diagnostics Log */}
      <div style={{ backgroundColor: '#f9fafb', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--primary-green)' }}>Recent Diagnostics Log</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ color: 'var(--text-gray)', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px 0', fontWeight: '600' }}>REFERENCE ID</th>
              <th style={{ padding: '12px 0', fontWeight: '600' }}>SUBJECT</th>
              <th style={{ padding: '12px 0', fontWeight: '600' }}>TYPE</th>
              <th style={{ padding: '12px 0', fontWeight: '600' }}>OUTCOME</th>
              <th style={{ padding: '12px 0', fontWeight: '600' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={log.ref} style={{ borderBottom: idx === logs.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 0', fontWeight: '500', color: 'var(--text-dark)' }}>{log.ref}</td>
                <td style={{ padding: '16px 0', fontWeight: '600', color: 'var(--text-dark)' }}>{log.subject}</td>
                <td style={{ padding: '16px 0', color: 'var(--text-gray)' }}>{log.type}</td>
                <td style={{ padding: '16px 0' }}>
                  <span style={{ 
                    backgroundColor: log.outcome === 'NEGATIVE' ? '#d1fae5' : '#f3f4f6', 
                    color: log.outcome === 'NEGATIVE' ? '#065f46' : '#6b7280', 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' 
                  }}>
                    {log.outcome}
                  </span>
                </td>
                <td style={{ padding: '16px 0' }}>
                  <button type="button" style={{ color: 'var(--primary-green)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: 'var(--text-gray)', fontSize: '13px' }}>
          <span>Showing 1-{Math.min(10, logs.length)} of {logs.length} records</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{'<'}</button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{'>'}</button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default HealthRecordsArchive;
