import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Activity, AlertTriangle, Calendar, AlertOctagon } from 'lucide-react';
import StatusBadge from '../../components/vet/StatusBadge';

const UpdateHealthStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [formData, setFormData] = useState({
    condition: 'STABLE',
    weightKg: '',
    temperatureC: '',
    appetite: 'NORMAL',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/vet/animals/${id}/health`);
        const json = await res.json();
        if (json.success) {
          setAnimal(json.data.animal);
          if (json.data.health) {
            setFormData({
              condition: json.data.health.condition || 'STABLE',
              weightKg: json.data.health.weightKg || '',
              temperatureC: json.data.health.temperatureC || '',
              appetite: json.data.health.appetite || 'NORMAL',
              notes: json.data.health.notes || '',
              date: new Date().toISOString().split('T')[0]
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/vet/animals/${id}/health-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        navigate(`/vet/health/${id}`);
      }
    } catch (error) {
      console.error('Error updating health status:', error);
    }
  };

  const statusOptions = [
    { value: 'STABLE', label: 'Healthy', icon: <CheckCircle size={18} /> },
    { value: 'MONITORING', label: 'Monitoring', icon: <Activity size={18} /> },
    { value: 'ATTENTION', label: 'Needs Attention', icon: <AlertTriangle size={18} /> },
    { value: 'TREATMENT', label: 'Under Treatment', icon: <Calendar size={18} /> },
    { value: 'CRITICAL', label: 'Critical', icon: <AlertOctagon size={18} /> }
  ];

  if (!animal) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-dark)' }}>Veterinary Records</h1>
      <p style={{ color: 'var(--text-gray)', margin: '0 0 24px 0', fontSize: '14px' }}>Update and manage health statuses for the habitat residents.</p>

      {/* Animal Info Card */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img src={animal.image} alt={animal.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: 'var(--text-dark)' }}>{animal.name} ({animal.species})</h2>
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--text-gray)' }}>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>LAST CHECKUP</div>
                <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Oct 31, 2024</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>CURRENT WEIGHT</div>
                <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{formData.weightKg || '--'} kg</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-gray)', marginBottom: '4px' }}>CURRENT STATUS</div>
          <StatusBadge status={animal.status} />
        </div>
      </div>

      {/* Update Form */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#064e3b', padding: '16px 24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Update Health Status
          </h3>
          <span style={{ fontSize: '13px', opacity: 0.8 }}>Animal ID: {animal.code}</span>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '12px' }}>NEW HEALTH STATUS</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {statusOptions.map(opt => (
                <button 
                  type="button" 
                  key={opt.value}
                  onClick={() => setFormData({ ...formData, condition: opt.value })}
                  style={{ 
                    padding: '12px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '8px',
                    backgroundColor: formData.condition === opt.value ? '#f0fdf4' : 'white',
                    border: formData.condition === opt.value ? '2px solid var(--primary-green)' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: formData.condition === opt.value ? 'var(--primary-green)' : 'var(--text-gray)',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '12px'
                  }}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>DATE</label>
              <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>WEIGHT (KG)</label>
              <input type="number" step="0.1" value={formData.weightKg} onChange={e => setFormData({ ...formData, weightKg: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} placeholder="e.g. 230" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>TEMPERATURE (°C)</label>
              <input type="number" step="0.1" value={formData.temperatureC} onChange={e => setFormData({ ...formData, temperatureC: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} placeholder="e.g. 38.6" />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>APPETITE</label>
            <select value={formData.appetite} onChange={e => setFormData({ ...formData, appetite: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }}>
              <option value="NORMAL">Normal</option>
              <option value="REDUCED">Reduced</option>
              <option value="NONE">None</option>
            </select>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>CLINICAL NOTES</label>
            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows="4" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box', resize: 'vertical' }} placeholder="Detail any observations, behavioral changes..."></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: '500', color: 'var(--text-dark)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Save Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHealthStatus;
