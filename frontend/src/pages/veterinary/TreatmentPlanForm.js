import { vetApi } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TreatmentPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [animal, setAnimal] = useState(null);
  const [animalsList, setAnimalsList] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    medication: '',
    dosage: '',
    schedule: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  const isValidObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (isValidObjectId(id)) {
          // Valid MongoDB ID, fetch single animal
          const json = await vetApi.getAnimalHealthDetail(id);
          if (json.success) {
            setAnimal(json.data.animal);
            setSelectedAnimalId(json.data.animal.id);
          }
        } else {
          // ID is not valid or is '1' (from general page), fetch list of all animals
          const json = await vetApi.getAnimalHealthStatus();
          if (json.success) {
            setAnimalsList(json.data || []);
            // Automatically select first animal if list is not empty
            if (json.data && json.data.length > 0) {
              const firstAnimal = json.data[0];
              setSelectedAnimalId(firstAnimal.id);
              // Fetch that first animal details
              const animalRes = await vetApi.getAnimalHealthDetail(firstAnimal.id);
              const animalJson = animalRes;
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
      const json = await vetApi.getAnimalHealthDetail(newId);
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
    if (!formData.title.trim()) {
      alert('Please enter a Primary Diagnosis (Title).');
      return;
    }
    try {
      const res = await vetApi.createTreatmentPlan(selectedAnimalId, formData);
      if (res) {
        alert('Treatment plan created successfully!');
        navigate(`/vet/treatments`);
      }
    } catch (error) {
      console.error('Error submitting treatment:', error);
      alert('Failed to save treatment plan: ' + error.message);
    }
  };

  if (loading && !animal) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-dark)' }}>Create Treatment Plan</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" onClick={() => { alert('Draft saved to local storage.'); navigate('/vet/treatments'); }} style={{ padding: '10px 20px', backgroundColor: 'white', color: 'var(--text-dark)', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Save Draft</button>
          <button type="button" onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#064e3b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Create Plan</button>
        </div>
      </div>

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

        {/* Basic Info */}
        {animal && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              {/* Animal Info */}
              <div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                  <img src={animal.image} alt={animal.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-dark)' }}>{animal.name}</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div style={{ color: 'var(--text-gray)' }}>Age</div><div style={{ fontWeight: '500' }}>8 Years</div>
                  <div style={{ color: 'var(--text-gray)' }}>Weight</div><div style={{ fontWeight: '500' }}>190.0 kg</div>
                  <div style={{ color: 'var(--text-gray)' }}>Status</div>
                  <div><span style={{ padding: '2px 6px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{animal.status}</span></div>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>PRIMARY DIAGNOSIS</label>
                  <input type="text" placeholder="e.g. Posterior Cruciate Ligament (PCL) Strain" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>TREATMENT DESCRIPTION & GOALS</label>
                  <textarea placeholder="Describe the therapeutic objectives..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>START DATE</label>
                    <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>ESTIMATED END DATE</label>
                    <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medication */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Medication & Regimen</h3>
            <button type="button" style={{ fontSize: '13px', color: 'var(--primary-green)', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Medication</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-gray)', marginBottom: '4px' }}>MEDICATION NAME</label>
              <input type="text" placeholder="Meloxicam (NSAID)" value={formData.medication} onChange={e => setFormData({ ...formData, medication: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-gray)', marginBottom: '4px' }}>DOSAGE</label>
              <input type="text" placeholder="40 mg" value={formData.dosage} onChange={e => setFormData({ ...formData, dosage: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-gray)', marginBottom: '4px' }}>FREQUENCY</label>
              <input type="text" placeholder="Once daily (SID)" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanForm;
