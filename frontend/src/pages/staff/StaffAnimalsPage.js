import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './StaffAnimalsPage.css';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'HEALTHY', label: 'Healthy' },
  { value: 'OBSERVATION', label: 'Observation' },
  { value: 'TREATMENT', label: 'Treatment' },
];

const StaffAnimalsPage = () => {
  const [animalData, setAnimalData] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnimals = async (filters = { search, status }) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getStaffAnimals(filters);
      setAnimalData(data);
    } catch (err) {
      setError(err.message || 'Failed to load assigned animals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals({ search: '', status: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animals = animalData?.animals || [];
  const summary = animalData?.summary || {};

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    loadAnimals({ search, status });
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    loadAnimals({ search: '', status: '' });
  };

  return (
    <div className="staff-animals-page">
      <header className="staff-animals-header">
        <div>
          <span>Animals</span>
          <h1>Assigned Animals</h1>
          <p>Manage and monitor the daily welfare of assigned wildlife residents.</p>
        </div>
      </header>

      <form className="animal-filter-panel" onSubmit={handleFilterSubmit}>
        <label>
          <span>Search</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search assigned animals..." />
        </label>
        <label>
          <span>Care Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <button type="submit">Apply Filter</button>
        <button type="button" className="secondary" onClick={clearFilters}>Clear</button>
      </form>

      {error && <div className="animal-message error">{error}</div>}
      {loading && <div className="animal-message">Loading assigned animals...</div>}

      {!loading && (
        <>
          <section className="animal-summary-grid">
            <article><span>Total</span><strong>{summary.total || animals.length}</strong></article>
            <article><span>Healthy</span><strong>{summary.healthy || 0}</strong></article>
            <article><span>Observation</span><strong>{summary.observation || 0}</strong></article>
            <article><span>Treatment</span><strong>{summary.treatment || 0}</strong></article>
          </section>

          <section className="animal-card-grid">
            {animals.length === 0 ? (
              <div className="animal-message">No assigned animals found.</div>
            ) : animals.map((animal) => (
              <article className="animal-charge-card" key={animal.id}>
                <div className={`animal-card-media status-${animal.status.toLowerCase()}`}>
                  <span>{animal.name?.charAt(0) || 'A'}</span>
                  <em>{animal.status}</em>
                </div>
                <div className="animal-card-body">
                  <h2>{animal.name}</h2>
                  <p>{animal.scientificName || animal.species}</p>
                  <dl>
                    <div>
                      <dt>Area</dt>
                      <dd>{animal.area || animal.areaLocation || 'Unassigned'}</dd>
                    </div>
                    <div>
                      <dt>Diet</dt>
                      <dd>{animal.diet || 'Not recorded'}</dd>
                    </div>
                    <div>
                      <dt>Last Care</dt>
                      <dd>{animal.lastCareLog?.time || 'No log yet'}</dd>
                    </div>
                    <div>
                      <dt>Tasks</dt>
                      <dd>{animal.taskCount || 0}</dd>
                    </div>
                  </dl>
                  <Link to={`/staff/animals/${animal.id}/care`}>View Daily Care</Link>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default StaffAnimalsPage;
