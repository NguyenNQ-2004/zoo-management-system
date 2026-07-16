import { vetApi } from '../../services/api';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Plus, Activity, Thermometer, Heart, Clock } from 'lucide-react';
import StatusBadge from '../../components/vet/StatusBadge';

const AnimalHealthDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await vetApi.getAnimalHealthDetail(id);
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;
  if (!data) return <div style={{ padding: '24px' }}>Animal not found</div>;

  const { animal, health, logs, treatments } = data;
  const activeTreatment = treatments.find(t => t.status === 'ONGOING' || t.status === 'PLANNED');

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img src={animal.image} alt={animal.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: 'var(--text-dark)' }}>{animal.name} ({animal.species})</h1>
            <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-gray)', alignItems: 'center' }}>
              <span>ID: {animal.code}</span>
              <span>•</span>
              <span>Enclosure: {animal.area}</span>
              <span>•</span>
              <StatusBadge status={animal.status} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate(`/vet/health/${animal.id}/update`)} style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
            <Edit size={16} /> Update Status
          </button>
          <button onClick={() => navigate(`/vet/health/${animal.id}/medical-logs/new`)} style={{ padding: '8px 16px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
            <Plus size={16} /> Add Medical Log
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', marginBottom: '12px', fontSize: '13px', fontWeight: '600' }}>
                <Activity size={16} /> Current Weight
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{health.weightKg || '--'} <span style={{ fontSize: '14px', color: 'var(--text-gray)', fontWeight: 'normal' }}>kg</span></div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', marginBottom: '12px', fontSize: '13px', fontWeight: '600' }}>
                <Thermometer size={16} /> Temperature
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{health.temperatureC || '--'} <span style={{ fontSize: '14px', color: 'var(--text-gray)', fontWeight: 'normal' }}>°C</span></div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', marginBottom: '12px', fontSize: '13px', fontWeight: '600' }}>
                <Heart size={16} /> Heart Rate
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-dark)' }}>-- <span style={{ fontSize: '14px', color: 'var(--text-gray)', fontWeight: 'normal' }}>bpm</span></div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Clinical Summary</h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              {health.notes || "No clinical summary available. Regular checkups indicate normal health parameters."}
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-dark)' }}>Health Timeline</h3>
              <button type="button" onClick={() => navigate(`/vet/medical-history/${animal.id}`)} style={{ color: 'var(--primary-green)', background: 'none', border: 'none', padding: 0, fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>View History</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {logs.slice(0, 3).map((log, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)', flexShrink: 0 }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '4px' }}>{new Date(log.date).toLocaleString()}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '4px' }}>{log.type}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-gray)' }}>{log.notes || log.diagnosis}</div>
                  </div>
                </div>
              ))}
              {logs.length === 0 && <div style={{ fontSize: '14px', color: 'var(--text-gray)' }}>No logs recorded.</div>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Treatment */}
          <div style={{ backgroundColor: '#064e3b', padding: '24px', borderRadius: '12px', color: 'white' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Active Treatment</h3>
            {activeTreatment ? (
              <>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.9 }}>{activeTreatment.title}</p>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{activeTreatment.medication}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>{activeTreatment.dosage} - {activeTreatment.schedule}</div>
                </div>
                <button onClick={() => navigate(`/vet/treatments/${activeTreatment._id}`)} style={{ width: '100%', padding: '12px', backgroundColor: 'white', color: '#064e3b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  View Treatment
                </button>
              </>
            ) : (
              <p style={{ fontSize: '14px', opacity: 0.8 }}>No active treatments.</p>
            )}
            <button onClick={() => navigate(`/vet/health/${animal.id}/treatments/new`)} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}>
              + Create Plan
            </button>
          </div>

          {/* Recent Medical Logs */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Recent Medical Logs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {logs.slice(0, 3).map(log => (
                <div key={log._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>{log.type}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{new Date(log.date).toLocaleDateString()}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '4px' }}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate(`/vet/medical-logs`)} style={{ width: '100%', marginTop: '16px', padding: '10px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', cursor: 'pointer' }}>
              See All {logs.length} Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalHealthDetail;
