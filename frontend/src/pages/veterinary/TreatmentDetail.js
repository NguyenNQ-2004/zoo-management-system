import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

const TreatmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/vet/treatments/${id}`);
        const json = await res.json();
        if (json.success) {
          setTreatment(json.data);
          setStatus(json.data.status);
        }
      } catch (error) {
        console.error('Error fetching treatment:', error);
      }
    };
    fetchTreatment();
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/vet/treatments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        alert('Status updated successfully');
        navigate('/vet/treatments');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (!treatment) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-dark)' }}>Treatment Detail: {treatment.animal?.name || 'Animal'}</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '10px 20px', backgroundColor: 'white', color: 'var(--text-dark)', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Export Medical Record</button>
          <button style={{ padding: '10px 20px', backgroundColor: '#064e3b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Edit Treatment</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Info */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '24px' }}>
              <img src={`https://ui-avatars.com/api/?name=${treatment.animal?.name}&background=random`} alt="Animal" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-gray)' }}>ACTIVE TREATMENT</span>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#d1fae5', color: '#065f46' }}>{treatment.status}</span>
                </div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: 'var(--text-dark)' }}>{treatment.title}</h2>
                <div style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Started {new Date(treatment.startDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-gray)', marginBottom: '4px' }}>PRIMARY DIAGNOSIS</div>
                <div style={{ fontWeight: '600', color: '#065f46' }}>{treatment.title}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-gray)', marginBottom: '4px' }}>ATTENDING VET</div>
                <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Dr. {treatment.vet?.name || 'S. Vance'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-gray)', marginBottom: '4px' }}>SUCCESS RATE EST.</div>
                <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>High (92%)</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Care Instructions</h3>
              <ol style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-dark)', fontSize: '14px', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '12px' }}>Restrict mobility to Level 1 (recovery crate) for 22 hours daily.</li>
                <li style={{ marginBottom: '12px' }}>Apply cold compress to the affected area for 15 mins every 4 hours.</li>
                <li style={{ marginBottom: '12px' }}>Monitor wound site for inflammation or discharge twice daily.</li>
                <li>No enrichment items that encourage jumping or climbing.</li>
              </ol>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Active Medications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{treatment.medication || 'Medication'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{treatment.dosage || 'Dosage'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#065f46' }}>{treatment.schedule || 'Schedule'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-dark)' }}>Progress Notes</h3>
              <button style={{ color: 'var(--primary-green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>+ Add Note</button>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-gray)', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              No progress notes yet.
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Update Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: status === 'PLANNED' ? '2px solid #065f46' : '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" name="status" checked={status === 'PLANNED'} onChange={() => setStatus('PLANNED')} style={{ width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Planned</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Scheduled for future execution</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: status === 'ONGOING' || status === 'IN PROGRESS' ? '2px solid #065f46' : '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" name="status" checked={status === 'ONGOING' || status === 'IN PROGRESS'} onChange={() => setStatus('IN PROGRESS')} style={{ width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>In Progress</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Treatment is currently active</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: status === 'COMPLETED' ? '2px solid #065f46' : '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" name="status" checked={status === 'COMPLETED'} onChange={() => setStatus('COMPLETED')} style={{ width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Completed</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Discharge and final review done</div>
                </div>
              </label>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>STATUS UPDATE REMARK</label>
              <textarea placeholder="Enter reason for status change..." value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
            </div>
            <button onClick={handleUpdateStatus} style={{ width: '100%', padding: '12px', backgroundColor: '#064e3b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Update Treatment Status
            </button>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-gray)', textTransform: 'uppercase' }}>Animal Quick-Facts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', marginBottom: '16px' }}>
              <div style={{ color: 'var(--text-gray)' }}>Weight</div><div style={{ fontWeight: '600', textAlign: 'right' }}>42.5 kg</div>
              <div style={{ color: 'var(--text-gray)' }}>Age</div><div style={{ fontWeight: '600', textAlign: 'right' }}>4 years, 2 mos</div>
              <div style={{ color: 'var(--text-gray)' }}>Enclosure</div><div style={{ fontWeight: '600', textAlign: 'right' }}>{treatment.animal?.area || 'Zone C'}</div>
              <div style={{ color: 'var(--text-gray)' }}>Allergies</div><div style={{ fontWeight: '600', textAlign: 'right', color: '#dc2626' }}>None Recorded</div>
            </div>
            <div style={{ height: '120px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Skeleton View Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDetail;
