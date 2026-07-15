import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../services/api';

const animalStatuses = ['HEALTHY', 'OBSERVATION', 'TREATMENT', 'TRANSFERRED'];
const genderOptions = ['MALE', 'FEMALE', 'UNKNOWN'];
const appetiteOptions = ['GOOD', 'NORMAL', 'LOW'];
const conditionOptions = ['STABLE', 'MONITORING', 'CRITICAL'];

const emptyAnimalForm = {
  code: '',
  name: '',
  species: '',
  scientificName: '',
  gender: 'UNKNOWN',
  dateOfBirth: '',
  origin: '',
  diet: '',
  status: 'HEALTHY',
  area: '',
  caretaker: '',
  notes: '',
  health: {
    weightKg: '',
    temperatureC: '',
    appetite: 'NORMAL',
    condition: 'STABLE',
    notes: '',
    lastCheckDate: '',
  },
};

const toDateInput = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-GB');
};

const AdminAnimalsPage = () => {
  const [animals, setAnimals] = useState([]);
  const [areas, setAreas] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [caretakerFilter, setCaretakerFilter] = useState('ALL');
  const [modalMode, setModalMode] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [formData, setFormData] = useState(emptyAnimalForm);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [animalsResponse, areasResponse, staffResponse] = await Promise.all([
        adminApi.getAnimals(),
        adminApi.getAreas(),
        adminApi.getStaff(),
      ]);
      setAnimals(animalsResponse.data || []);
      setAreas(areasResponse.data || []);
      setStaff(staffResponse.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAnimals = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return animals.filter((animal) => {
      const matchesSearch =
        !search ||
        animal.name.toLowerCase().includes(search) ||
        animal.code.toLowerCase().includes(search) ||
        animal.species.toLowerCase().includes(search) ||
        animal.caretaker?.fullName?.toLowerCase().includes(search);
      const matchesArea = areaFilter === 'ALL' || animal.area?._id === areaFilter;
      const matchesStatus = statusFilter === 'ALL' || animal.status === statusFilter;
      const matchesCaretaker = caretakerFilter === 'ALL' || animal.caretaker?._id === caretakerFilter;

      return matchesSearch && matchesArea && matchesStatus && matchesCaretaker;
    });
  }, [animals, searchTerm, areaFilter, statusFilter, caretakerFilter]);

  const summary = {
    total: animals.length,
    healthy: animals.filter((animal) => animal.status === 'HEALTHY').length,
    monitoring: animals.filter((animal) => ['OBSERVATION', 'TREATMENT'].includes(animal.status)).length,
    withoutCaretaker: animals.filter((animal) => !animal.caretaker).length,
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAnimal(null);
    setFormData(emptyAnimalForm);
  };

  const openCreateModal = () => {
    setMessage('');
    setSelectedAnimal(null);
    setFormData({
      ...emptyAnimalForm,
      area: areas[0]?._id || '',
      caretaker: staff[0]?._id || '',
      health: {
        ...emptyAnimalForm.health,
        lastCheckDate: new Date().toISOString().slice(0, 10),
      },
    });
    setModalMode('create');
  };

  const buildFormFromAnimal = (animal) => ({
    code: animal.code || '',
    name: animal.name || '',
    species: animal.species || '',
    scientificName: animal.scientificName || '',
    gender: animal.gender || 'UNKNOWN',
    dateOfBirth: toDateInput(animal.dateOfBirth),
    origin: animal.origin || '',
    diet: animal.diet || '',
    status: animal.status || 'HEALTHY',
    area: animal.area?._id || '',
    caretaker: animal.caretaker?._id || '',
    notes: animal.notes || '',
    health: {
      weightKg: animal.health?.weightKg ?? '',
      temperatureC: animal.health?.temperatureC ?? '',
      appetite: animal.health?.appetite || 'NORMAL',
      condition: animal.health?.condition || 'STABLE',
      notes: animal.health?.notes || '',
      lastCheckDate: toDateInput(animal.health?.lastCheckDate),
    },
  });

  const openViewModal = async (id) => {
    try {
      setSubmitting(true);
      const response = await adminApi.getAnimalById(id);
      setSelectedAnimal(response.data);
      setModalMode('view');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = async (id) => {
    try {
      setSubmitting(true);
      const response = await adminApi.getAnimalById(id);
      setSelectedAnimal(response.data);
      setFormData(buildFormFromAnimal(response.data));
      setModalMode('edit');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('health.')) {
      const healthField = name.replace('health.', '');
      setFormData((current) => ({
        ...current,
        health: {
          ...current.health,
          [healthField]: value,
        },
      }));
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const buildPayload = () => ({
    ...formData,
    caretaker: formData.caretaker || null,
    dateOfBirth: formData.dateOfBirth || null,
    health: {
      ...formData.health,
      weightKg: formData.health.weightKg === '' ? 0 : Number(formData.health.weightKg),
      temperatureC: formData.health.temperatureC === '' ? null : Number(formData.health.temperatureC),
      lastCheckDate: formData.health.lastCheckDate || new Date().toISOString(),
    },
  });

  const handleSubmitAnimal = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const payload = buildPayload();

      if (modalMode === 'create') {
        const response = await adminApi.createAnimal(payload);
        setMessage(response.message || 'Animal created successfully.');
      }

      if (modalMode === 'edit' && selectedAnimal) {
        const response = await adminApi.updateAnimal(selectedAnimal._id, payload);
        setMessage(response.message || 'Animal updated successfully.');
      }

      closeModal();
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnimal = async (animal) => {
    const shouldDelete = window.confirm(`Delete animal "${animal.name}"? Related task references will be cleared.`);
    if (!shouldDelete) return;

    try {
      setSubmitting(true);
      setError('');
      const response = await adminApi.deleteAnimal(animal._id);
      setMessage(response.message || 'Animal deleted successfully.');
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-screen">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">Animal Operations</span>
          <h1>Animal management</h1>
          <p>Manage animal profiles, enclosure assignment, caretaker ownership and health summary data.</p>
        </div>
        <div className="admin-hero-panel">
          <span className="admin-panel-label">Health attention</span>
          <strong>{summary.monitoring} animal(s) under monitoring</strong>
          <p>{summary.withoutCaretaker} animal(s) currently have no caretaker assigned.</p>
        </div>
      </section>

      <section className="admin-metrics-grid">
        <article className="admin-metric-card">
          <span className="admin-metric-label">Total animals</span>
          <strong className="admin-metric-value">{summary.total}</strong>
          <span className="admin-metric-note">All managed profiles</span>
        </article>
        <article className="admin-metric-card">
          <span className="admin-metric-label">Healthy</span>
          <strong className="admin-metric-value">{summary.healthy}</strong>
          <span className="admin-metric-note">Stable status</span>
        </article>
        <article className="admin-metric-card">
          <span className="admin-metric-label">Monitoring</span>
          <strong className="admin-metric-value">{summary.monitoring}</strong>
          <span className="admin-metric-note">Observation or treatment</span>
        </article>
        <article className="admin-metric-card">
          <span className="admin-metric-label">No caretaker</span>
          <strong className="admin-metric-value">{summary.withoutCaretaker}</strong>
          <span className="admin-metric-note">Need assignment</span>
        </article>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-card-kicker">Filters</span>
            <h2>Animal registry controls</h2>
          </div>
          <div className="admin-inline-actions">
            <button type="button" className="admin-button admin-button-primary" onClick={openCreateModal}>Create animal</button>
            <button type="button" className="admin-button admin-button-secondary" onClick={loadData}>Refresh</button>
          </div>
        </div>

        <div className="admin-filter-grid admin-filter-grid-four">
          <label className="admin-field">
            <span>Search</span>
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search name, code, species or caretaker" />
          </label>
          <label className="admin-field">
            <span>Area</span>
            <select value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)}>
              <option value="ALL">ALL</option>
              {areas.map((area) => <option key={area._id} value={area._id}>{area.name}</option>)}
            </select>
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ALL">ALL</option>
              {animalStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className="admin-field">
            <span>Caretaker</span>
            <select value={caretakerFilter} onChange={(event) => setCaretakerFilter(event.target.value)}>
              <option value="ALL">ALL</option>
              {staff.map((member) => <option key={member._id} value={member._id}>{member.fullName}</option>)}
            </select>
          </label>
        </div>
      </section>

      {(error || message) && (
        <section className="admin-card">
          {error && <div className="admin-inline-feedback admin-inline-feedback-error">{error}</div>}
          {message && <div className="admin-inline-feedback admin-inline-feedback-success">{message}</div>}
        </section>
      )}

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-card-kicker">Animal registry</span>
            <h2>{filteredAnimals.length} animal(s) matched</h2>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">Loading animals...</div>
        ) : filteredAnimals.length === 0 ? (
          <div className="admin-empty-state">No animals matched the current filters.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Area</th>
                  <th>Caretaker</th>
                  <th>Health</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnimals.map((animal) => (
                  <tr key={animal._id}>
                    <td>
                      <strong>{animal.name}</strong>
                      <span className="admin-table-subtext">{animal.code} | {animal.species}</span>
                    </td>
                    <td>{animal.area?.name || 'No area'}</td>
                    <td>{animal.caretaker?.fullName || 'Unassigned'}</td>
                    <td>
                      <div className="admin-mini-stats">
                        <span>{animal.health?.condition || 'No health'}</span>
                        <span>{animal.health?.weightKg ?? 0} kg</span>
                        <span>{animal.health?.appetite || 'N/A'}</span>
                      </div>
                    </td>
                    <td><span className={`admin-badge admin-badge-${animal.status.toLowerCase()}`}>{animal.status}</span></td>
                    <td>
                      <div className="admin-table-actions">
                        <button type="button" className="admin-text-button" onClick={() => openViewModal(animal._id)}>View</button>
                        <button type="button" className="admin-text-button" onClick={() => openEditModal(animal._id)}>Edit</button>
                        <button type="button" className="admin-text-button admin-text-button-danger" onClick={() => handleDeleteAnimal(animal)} disabled={submitting}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalMode && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal admin-modal-wide" onClick={(event) => event.stopPropagation()}>
            <div className="admin-card-header">
              <div>
                <span className="admin-card-kicker">
                  {modalMode === 'create' ? 'Create profile' : modalMode === 'edit' ? 'Edit profile' : 'Animal details'}
                </span>
                <h2>{modalMode === 'create' ? 'New animal' : selectedAnimal?.name || 'Animal details'}</h2>
              </div>
              <button type="button" className="admin-text-button" onClick={closeModal}>Close</button>
            </div>

            {modalMode === 'view' && selectedAnimal && (
              <div className="admin-details-grid">
                <div className="admin-detail-item"><span>Code</span><strong>{selectedAnimal.code}</strong></div>
                <div className="admin-detail-item"><span>Species</span><strong>{selectedAnimal.species}</strong></div>
                <div className="admin-detail-item"><span>Area</span><strong>{selectedAnimal.area?.name || 'No area'}</strong></div>
                <div className="admin-detail-item"><span>Caretaker</span><strong>{selectedAnimal.caretaker?.fullName || 'Unassigned'}</strong></div>
                <div className="admin-detail-item"><span>Status</span><strong>{selectedAnimal.status}</strong></div>
                <div className="admin-detail-item"><span>Date of birth</span><strong>{formatDate(selectedAnimal.dateOfBirth)}</strong></div>
                <div className="admin-detail-item"><span>Condition</span><strong>{selectedAnimal.health?.condition || 'N/A'}</strong></div>
                <div className="admin-detail-item"><span>Weight</span><strong>{selectedAnimal.health?.weightKg ?? 0} kg</strong></div>
                <div className="admin-detail-item"><span>Temperature</span><strong>{selectedAnimal.health?.temperatureC ?? 'N/A'} C</strong></div>
                <div className="admin-detail-item"><span>Appetite</span><strong>{selectedAnimal.health?.appetite || 'N/A'}</strong></div>
              </div>
            )}

            {(modalMode === 'create' || modalMode === 'edit') && (
              <form className="admin-form-grid" onSubmit={handleSubmitAnimal}>
                <label className="admin-field"><span>Code</span><input name="code" value={formData.code} onChange={handleFormChange} required /></label>
                <label className="admin-field"><span>Name</span><input name="name" value={formData.name} onChange={handleFormChange} required /></label>
                <label className="admin-field"><span>Species</span><input name="species" value={formData.species} onChange={handleFormChange} required /></label>
                <label className="admin-field"><span>Scientific name</span><input name="scientificName" value={formData.scientificName} onChange={handleFormChange} /></label>
                <label className="admin-field"><span>Gender</span><select name="gender" value={formData.gender} onChange={handleFormChange}>{genderOptions.map((gender) => <option key={gender} value={gender}>{gender}</option>)}</select></label>
                <label className="admin-field"><span>Date of birth</span><input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleFormChange} /></label>
                <label className="admin-field"><span>Status</span><select name="status" value={formData.status} onChange={handleFormChange}>{animalStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
                <label className="admin-field"><span>Area</span><select name="area" value={formData.area} onChange={handleFormChange} required>{areas.map((area) => <option key={area._id} value={area._id}>{area.name}</option>)}</select></label>
                <label className="admin-field"><span>Caretaker</span><select name="caretaker" value={formData.caretaker} onChange={handleFormChange}><option value="">Unassigned</option>{staff.map((member) => <option key={member._id} value={member._id}>{member.fullName}</option>)}</select></label>
                <label className="admin-field"><span>Origin</span><input name="origin" value={formData.origin} onChange={handleFormChange} /></label>
                <label className="admin-field admin-field-full"><span>Diet</span><input name="diet" value={formData.diet} onChange={handleFormChange} /></label>

                <div className="admin-form-section admin-field-full">
                  <span className="admin-card-kicker">Health summary</span>
                </div>
                <label className="admin-field"><span>Weight kg</span><input name="health.weightKg" type="number" min="0" step="0.1" value={formData.health.weightKg} onChange={handleFormChange} /></label>
                <label className="admin-field"><span>Temperature C</span><input name="health.temperatureC" type="number" step="0.1" value={formData.health.temperatureC} onChange={handleFormChange} /></label>
                <label className="admin-field"><span>Appetite</span><select name="health.appetite" value={formData.health.appetite} onChange={handleFormChange}>{appetiteOptions.map((appetite) => <option key={appetite} value={appetite}>{appetite}</option>)}</select></label>
                <label className="admin-field"><span>Condition</span><select name="health.condition" value={formData.health.condition} onChange={handleFormChange}>{conditionOptions.map((condition) => <option key={condition} value={condition}>{condition}</option>)}</select></label>
                <label className="admin-field admin-field-full"><span>Health check date</span><input name="health.lastCheckDate" type="date" value={formData.health.lastCheckDate} onChange={handleFormChange} /></label>
                <label className="admin-field admin-field-full"><span>Animal notes</span><textarea name="notes" rows="3" value={formData.notes} onChange={handleFormChange} /></label>
                <label className="admin-field admin-field-full"><span>Health notes</span><textarea name="health.notes" rows="3" value={formData.health.notes} onChange={handleFormChange} /></label>

                <div className="admin-inline-actions">
                  <button type="submit" className="admin-button admin-button-primary" disabled={submitting}>{submitting ? 'Saving...' : modalMode === 'create' ? 'Create animal' : 'Save changes'}</button>
                  <button type="button" className="admin-button admin-button-secondary" onClick={closeModal}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnimalsPage;
