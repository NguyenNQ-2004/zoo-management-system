import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MedicalLogEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [animal, setAnimal] = useState(null);
  const [animalsList, setAnimalsList] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    treatmentPlan: '',
    notes: '',
    type: 'CHECKUP',
    severity: 'LOW',
    weight: '',
    temp: '',
    heartRate: ''
  });

  const isValidObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (isValidObjectId(id)) {
          // Valid MongoDB ID, fetch single animal
          const res = await fetch(`http://localhost:5000/api/vet/animals/${id}/health`);
          const json = await res.json();
          if (json.success) {
            setAnimal(json.data.animal);
            setSelectedAnimalId(json.data.animal.id);
          }
        } else {
          // ID is not valid or is '1' (from general page), fetch list of all animals
          const res = await fetch('http://localhost:5000/api/vet/animals/health-status');
          const json = await res.json();
          if (json.success) {
            setAnimalsList(json.data || []);
            // Automatically select first animal if list is not empty
            if (json.data && json.data.length > 0) {
              const firstAnimal = json.data[0];
              setSelectedAnimalId(firstAnimal.id);
              // Fetch that first animal details
              const animalRes = await fetch(`http://localhost:5000/api/vet/animals/${firstAnimal.id}/health`);
              const animalJson = await animalRes.json();
              if (animalJson.success) {
                setAnimal(animalJson.data.animal);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    loadInitialData();
  }, [id]);

  const handleAnimalChange = async (e) => {
    const newId = e.target.value;
    setSelectedAnimalId(newId);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/vet/animals/${newId}/health`);
      const json = await res.json();
      if (json.success) {
        setAnimal(json.data.animal);
      }
    } catch (error) {
      console.error('Error loading animal:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAnimalId) {
      alert('Please select an animal.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/vet/animals/${selectedAnimalId}/medical-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        navigate(`/vet/health/${selectedAnimalId}`);
      } else {
        alert('Failed to save medical log.');
      }
    } catch (error) {
      console.error('Error submitting log:', error);
    }
  };

  if (loading && !animal) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-dark)' }}>Medical Log Entry</h1>
        <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
          Save Medical Log
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Animal Selector Dropdown */}
          {!isValidObjectId(id) && animalsList.length > 0 && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>Select Patient / Animal</label>
              <select value={selectedAnimalId} onChange={handleAnimalChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }}>
                {animalsList.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.species}) - {a.code}</option>
                ))}
              </select>
            </div>
          )}

          {/* Animal Card */}
          {animal && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                <img src={animal.image} alt={animal.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{animal.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>ID: {animal.code}</div>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-gray)', marginBottom: '8px' }}>Species: <b>{animal.species}</b></div>
              <div style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Enclosure: <b>{animal.area}</b></div>
            </div>
          )}

          {/* Vitals */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Vitals</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)' }}>Body Temp</label>
                <input type="text" placeholder="38.5 °C" value={formData.temp} onChange={e => setFormData({ ...formData, temp: e.target.value })} style={{ width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)' }}>Weight</label>
                <input type="text" placeholder="185 kg" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} style={{ width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)' }}>Heart Rate</label>
                <input type="text" placeholder="82 bpm" value={formData.heartRate} onChange={e => setFormData({ ...formData, heartRate: e.target.value })} style={{ width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Clinical Examination */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-dark)', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Clinical Examination</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)', marginBottom: '8px' }}>Observed Symptoms</label>
              <textarea placeholder="Describe current behavioral changes..." value={formData.symptoms} onChange={e => setFormData({ ...formData, symptoms: e.target.value })} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)', marginBottom: '8px' }}>Diagnostic Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }}>
                  <option value="CHECKUP">Routine Checkup</option>
                  <option value="ILLNESS">Illness Assessment</option>
                  <option value="INJURY">Injury</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)', marginBottom: '8px' }}>Severity Level</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setFormData({ ...formData, severity: 'LOW' })} style={{ flex: 1, padding: '8px', backgroundColor: formData.severity === 'LOW' ? '#ecfdf5' : 'white', border: formData.severity === 'LOW' ? '1px solid #059669' : '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: formData.severity === 'LOW' ? '#059669' : 'var(--text-gray)' }}>Low</button>
                  <button type="button" onClick={() => setFormData({ ...formData, severity: 'MEDIUM' })} style={{ flex: 1, padding: '8px', backgroundColor: formData.severity === 'MEDIUM' ? '#fffbeb' : 'white', border: formData.severity === 'MEDIUM' ? '1px solid #d97706' : '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: formData.severity === 'MEDIUM' ? '#d97706' : 'var(--text-gray)' }}>Medium</button>
                  <button type="button" onClick={() => setFormData({ ...formData, severity: 'HIGH' })} style={{ flex: 1, padding: '8px', backgroundColor: formData.severity === 'HIGH' ? '#fef2f2' : 'white', border: formData.severity === 'HIGH' ? '1px solid #dc2626' : '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: formData.severity === 'HIGH' ? '#dc2626' : 'var(--text-gray)' }}>High</button>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)', marginBottom: '8px' }}>Clinical Findings & Diagnosis</label>
              <textarea placeholder="Enter diagnosis..." value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
            </div>
          </div>

          {/* Treatment & Plan */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-dark)', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Treatment & Plan</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)', marginBottom: '8px' }}>Prescribed Treatment</label>
              <textarea placeholder="Specify details..." value={formData.treatmentPlan} onChange={e => setFormData({ ...formData, treatmentPlan: e.target.value })} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)', marginBottom: '8px' }}>Veterinarian Notes</label>
              <textarea placeholder="Internal notes..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalLogEntry;
