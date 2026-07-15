import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './StaffCareLogFormPage.css';

const careTypes = ['FEEDING', 'CLEANING', 'OBSERVATION', 'ENRICHMENT'];

const toDateTimeLocalValue = (date = new Date()) => {
  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
};

const StaffCareLogFormPage = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();
  const [careData, setCareData] = useState(null);
  const [form, setForm] = useState({
    careType: 'FEEDING',
    taskId: '',
    loggedAt: toDateTimeLocalValue(),
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnimal = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getAnimalCare(animalId);
        setCareData(data);
      } catch (err) {
        setError(err.message || 'Failed to load animal care data');
      } finally {
        setLoading(false);
      }
    };

    loadAnimal();
  }, [animalId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      const result = await api.createAnimalCareLog(animalId, {
        ...form,
        taskId: form.taskId || undefined,
        loggedAt: form.loggedAt ? new Date(form.loggedAt).toISOString() : undefined,
      });
      navigate(`/staff/animals/${animalId}/care`, {
        state: {
          refreshCareDetailAt: Date.now(),
          newCareLogId: result?.log?.id,
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to submit care log');
    } finally {
      setSaving(false);
    }
  };

  const animal = careData?.animal;
  const tasks = careData?.tasks || [];

  return (
    <div className="care-log-form-page">
      <header className="care-log-form-header">
        <div>
          <nav><Link to={`/staff/animals/${animalId}/care`}>Daily Care</Link> / New Care Entry</nav>
          <h1>New Care Entry</h1>
          <p>Record routine observations and care activity for the current shift.</p>
        </div>
      </header>

      {error && <div className="care-form-message error">{error}</div>}
      {loading && <div className="care-form-message">Loading form data...</div>}

      {!loading && animal && (
        <form className="care-log-form-grid" onSubmit={handleSubmit}>
          <section className="care-form-panel">
            <h2>Animal Identification</h2>
            <div className="care-form-fields two">
              <label>
                <span>Animal</span>
                <input value={`${animal.name} (${animal.species})`} readOnly />
              </label>
              <label>
                <span>Care Date and Time</span>
                <input type="datetime-local" name="loggedAt" value={form.loggedAt} onChange={handleChange} />
              </label>
            </div>
          </section>

          <section className="care-form-panel">
            <h2>Care Metrics</h2>
            <div className="care-form-fields two">
              <label>
                <span>Care Type</span>
                <select name="careType" value={form.careType} onChange={handleChange}>
                  {careTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label>
                <span>Related Task</span>
                <select name="taskId" value={form.taskId} onChange={handleChange}>
                  <option value="">No linked task</option>
                  {tasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="care-form-panel notes-panel">
            <h2>Qualitative Log</h2>
            <label>
              <span>General Observations</span>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any physical anomalies, habitat issues, appetite, behavior, or keeper notes..." required />
            </label>
            <button type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit Care Log'}</button>
          </section>
        </form>
      )}
    </div>
  );
};

export default StaffCareLogFormPage;
