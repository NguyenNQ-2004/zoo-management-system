import { vetApi } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus } from 'lucide-react';

const TreatmentPlanList = () => {
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const json = await vetApi.getAllTreatments();
        if (json.success) {
          setTreatments(json.data);
        }
      } catch (error) {
        console.error('Error fetching treatments:', error);
      }
      setLoading(false);
    };
    fetchTreatments();
  }, []);

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading treatment plans...</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-dark)' }}>Treatment Plans</h1>
          <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '14px' }}>Manage and monitor ongoing clinical pathways for sanctuary residents.</p>
        </div>
        <button onClick={() => navigate('/vet/health/1/treatments/new')} style={{ padding: '10px 20px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', cursor: 'pointer' }}>
          <Plus size={18} /> Create Treatment Plan
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px', color: 'var(--text-gray)' }}>PLANNED</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-dark)' }}>12</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '8px', color: '#065f46' }}>IN PROGRESS</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-dark)' }}>28</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px', color: '#dc2626' }}>URGENT</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-dark)' }}>04</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Filter size={18} color="var(--text-gray)" />
          <div style={{ fontWeight: '600', color: 'var(--text-dark)', marginRight: '16px' }}>FILTERS</div>
          <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}><option>Status: All</option></select>
          <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}><option>Animal: All</option></select>
          <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}><option>Vet: All Personnel</option></select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ color: 'var(--text-gray)', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>TREATMENT ID</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>ANIMAL</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>DIAGNOSIS</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>VET IN CHARGE</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>TIMELINE</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((t, i) => (
              <tr key={t._id || i} style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }} onClick={() => navigate(`/vet/treatments/${t._id}`)}>
                <td style={{ padding: '16px 20px', fontWeight: '500', color: 'var(--primary-green)' }}>#TX-{t._id?.substring(0,4).toUpperCase() || '0000'}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6' }}></div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{t.animal?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{t.animal?.species || 'Species'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', maxWidth: '200px' }}>{t.title}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: '500' }}>Dr. {(t.vet?.name) || 'S. Vance'}</div>
                </td>
                <td style={{ padding: '16px 20px', color: 'var(--text-gray)', fontSize: '13px' }}>
                  {new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                  {t.endDate ? new Date(t.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Ongoing'}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: t.status === 'IN PROGRESS' || t.status === 'ONGOING' ? '#d1fae5' : '#f3f4f6', color: t.status === 'IN PROGRESS' || t.status === 'ONGOING' ? '#059669' : '#4b5563' }}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
            {treatments.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-gray)' }}>No treatment plans found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreatmentPlanList;
