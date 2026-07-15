import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './StaffCareDetail.css';

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'HEALTHY', label: 'Healthy' },
  { value: 'OBSERVATION', label: 'Observation' },
  { value: 'TREATMENT', label: 'Treatment' },
];

const formatDate = (value) => {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};

const StaffTopbar = () => (
  <header className="care-topbar">
    <label className="care-search" aria-label="Search records">
      <span>O</span>
      <input type="search" placeholder="Search records..." />
    </label>
    <div className="care-actions">
      <button type="button" aria-label="Notifications">!</button>
      <div className="care-avatar" aria-label="Staff profile" />
    </div>
  </header>
);

const StatusIcon = ({ status, disabled, onClick }) => {
  if (status === 'completed') {
    return <span className="checklist-icon done" />;
  }

  return (
    <button
      type="button"
      className="checklist-icon pending"
      disabled={disabled}
      onClick={onClick}
      aria-label="Mark checklist item completed"
    />
  );
};

const StaffCareDetail = () => {
  const { animalId } = useParams();
  const location = useLocation();
  const [careData, setCareData] = useState(null);
  const [status, setStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updatingCareType, setUpdatingCareType] = useState('');
  const [error, setError] = useState('');

  const loadCare = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getAnimalCare(animalId);
      setCareData(data);
      setStatus(data.animal?.status || '');
    } catch (err) {
      setError(err.message || 'Failed to load care detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalId, location.state?.refreshCareDetailAt]);

  const handleStatusUpdate = async (event) => {
    event.preventDefault();
    try {
      setUpdating(true);
      setError('');
      await api.updateAnimalCareStatus(animalId, status, statusNotes);
      setStatusNotes('');
      await loadCare();
    } catch (err) {
      setError(err.message || 'Failed to update care status');
    } finally {
      setUpdating(false);
    }
  };

  const handleChecklistComplete = async (item) => {
    if (item.status === 'completed' || updatingCareType) return;

    try {
      setUpdatingCareType(item.type);
      setError('');
      await api.createAnimalCareLog(animalId, {
        careType: item.type,
        notes: `${item.title} completed from daily care checklist.`,
      });
      await loadCare();
    } catch (err) {
      setError(err.message || 'Failed to update checklist item');
    } finally {
      setUpdatingCareType('');
    }
  };

  const animal = careData?.animal;
  const health = careData?.health;
  const checklist = careData?.checklist || [];
  const recentLogs = useMemo(() => (
    [...(careData?.logs || [])].sort((first, second) => {
      const firstTime = new Date(first.loggedAt || first.time || 0).getTime();
      const secondTime = new Date(second.loggedAt || second.time || 0).getTime();
      return secondTime - firstTime;
    })
  ), [careData?.logs]);

  return (
    <div className="care-detail-page">
      <StaffTopbar />

      <main className="care-content">
        <div className="care-title-row">
          <div>
            <nav className="care-breadcrumb" aria-label="Breadcrumb">
              <Link to="/staff/animals">Animals</Link>
              <b>&gt;</b>
              <strong>Daily Care</strong>
            </nav>
            <h1>Daily Care Detail</h1>
          </div>

          {animal && (
            <Link className="add-care-log-button" to={`/staff/animals/${animal.id}/care-logs/new`}>
              <span>+</span>
              Add Care Log
            </Link>
          )}
        </div>

        {error && <div className="care-message error">{error}</div>}
        {loading && <div className="care-message">Loading care detail...</div>}

        {!loading && animal && (
          <section className="care-detail-grid">
            <aside className="care-left-column">
              <article className="animal-profile-card">
                <div className="animal-photo-wrap animal-initial-wrap">
                  <strong>{animal.name?.charAt(0) || 'A'}</strong>
                  <span className="healthy-badge">{animal.status}</span>
                </div>

                <div className="animal-profile-heading">
                  <div>
                    <h2>{animal.name}</h2>
                    <p>{animal.scientificName || animal.species}</p>
                  </div>
                  <span className="animal-id">ID: {animal.code}</span>
                </div>

                <dl className="animal-meta-grid">
                  <div>
                    <dt>Sex</dt>
                    <dd>{animal.gender}</dd>
                  </div>
                  <div>
                    <dt>Weight</dt>
                    <dd>{health?.weightKg ? `${health.weightKg} kg` : 'N/A'}</dd>
                  </div>
                  <div>
                    <dt>Diet</dt>
                    <dd>{animal.diet || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt>Habitat</dt>
                    <dd>{animal.area || animal.areaLocation || 'N/A'}</dd>
                  </div>
                </dl>
              </article>

              <article className="care-panel vital-panel">
                <h2><span>~</span> Recent Vitals</h2>
                <div className="vital-list">
                  <div className="vital-item">
                    <div><span>Weight</span><strong>{health?.weightKg ? `${health.weightKg} kg` : 'N/A'}</strong></div>
                    <i style={{ '--level': '70%' }} />
                  </div>
                  <div className="vital-item">
                    <div><span>Temperature</span><strong>{health?.temperatureC ? `${health.temperatureC} C` : 'N/A'}</strong></div>
                    <i style={{ '--level': '58%' }} />
                  </div>
                  <div className="vital-item">
                    <div><span>Condition</span><strong>{health?.condition || animal.status}</strong></div>
                    <i style={{ '--level': animal.status === 'HEALTHY' ? '80%' : '45%' }} />
                  </div>
                </div>
              </article>
            </aside>

            <section className="care-right-column">
              <article className="care-panel checklist-panel">
                <div className="care-panel-header">
                  <h2>Daily Care Checklist</h2>
                  <span>{formatDate(new Date())}</span>
                </div>

                <div className="checklist-items">
                  {checklist.map((item) => (
                    <div className={`checklist-item ${item.status}`} key={item.type}>
                      <StatusIcon
                        status={item.status}
                        disabled={updatingCareType === item.type || Boolean(updatingCareType)}
                        onClick={() => handleChecklistComplete(item)}
                      />
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.notes || (item.status === 'completed' ? 'Completed today.' : 'No log recorded today.')}</p>
                      </div>
                      {item.time && <time>{item.time}</time>}
                      {item.status === 'pending' && (
                        <button
                          type="button"
                          className="checklist-complete-button"
                          disabled={updatingCareType === item.type || Boolean(updatingCareType)}
                          onClick={() => handleChecklistComplete(item)}
                        >
                          {updatingCareType === item.type ? 'Saving...' : 'Mark as Done'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </article>

              <article className="care-panel care-status-panel">
                <h2>Care Status</h2>
                <form onSubmit={handleStatusUpdate}>
                  <select value={status} onChange={(event) => setStatus(event.target.value)}>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <input value={statusNotes} onChange={(event) => setStatusNotes(event.target.value)} placeholder="Optional status note..." />
                  <button type="submit" disabled={updating}>{updating ? 'Updating...' : 'Update Status'}</button>
                </form>
              </article>

              <article className="care-panel logs-panel">
                <div className="care-panel-header">
                  <h2>Recent Care History</h2>
                  <Link to={`/staff/animals/${animal.id}/care-logs`}>View All</Link>
                </div>

                <div className="log-table" role="table" aria-label="Recent care logs">
                  <div className="log-row log-head" role="row">
                    <span>Date & Time</span>
                    <span>Type</span>
                    <span>Notes</span>
                  </div>

                  {recentLogs.length === 0 ? (
                    <div className="care-empty-row">No care logs found.</div>
                  ) : recentLogs.slice(0, 8).map((log) => (
                    <div className="log-row" role="row" key={log.id}>
                      <span>{log.time}</span>
                      <span><em className="log-type">{log.careType}</em></span>
                      <span>{log.notes || 'No notes'}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </section>
        )}
      </main>
    </div>
  );
};

export default StaffCareDetail;
