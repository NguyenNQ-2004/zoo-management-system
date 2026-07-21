import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './StaffOperationsExtra.css';

const careTypes = [
  { value: '', label: 'All Types' },
  { value: 'FEEDING', label: 'Feeding' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'OBSERVATION', label: 'Observation' },
  { value: 'ENRICHMENT', label: 'Enrichment' },
];

const StaffCareLogsPage = () => {
  const [logData, setLogData] = useState(null);
  const [search, setSearch] = useState('');
  const [careType, setCareType] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = async (filters = { search, careType, date }) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getStaffCareLogs(filters);
      setLogData(data);
    } catch (requestError) {
      setError(requestError.message || 'Failed to load care logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs({ search, careType, date });
    }, 250);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, careType, date]);

  const logs = logData?.logs || [];
  const summary = useMemo(() => logData?.summary || {}, [logData]);
  const summaryCards = useMemo(() => ([
    ['Total Logs', summary.total || 0],
    ['Filtered', summary.filtered ?? logs.length],
    ['Today', summary.today || 0],
    ['Feeding', summary.feeding || 0],
    ['Cleaning', summary.cleaning || 0],
    ['Observation', summary.observation || 0],
  ]), [summary, logs.length]);

  const clearFilters = () => {
    setSearch('');
    setCareType('');
    setDate('');
    loadLogs({ search: '', careType: '', date: '' });
  };

  return (
    <div className="staff-extra-page">
      <header className="staff-extra-header">
        <span>Care Logs</span>
        <h1>My Care History</h1>
        <p>Search and review every feeding, cleaning, observation and enrichment log you recorded.</p>
      </header>

      <form className="staff-extra-filter" onSubmit={(event) => { event.preventDefault(); loadLogs(); }}>
        <label>
          <span>Search</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Animal, task, or notes..." />
        </label>
        <label>
          <span>Type</span>
          <select value={careType} onChange={(event) => setCareType(event.target.value)}>
            {careTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </label>
        <label>
          <span>Date</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <button type="submit">Apply</button>
        <button type="button" className="secondary" onClick={clearFilters}>Clear</button>
      </form>

      {error && <div className="staff-extra-message error">{error}</div>}

      <section className="staff-extra-summary six">
        {summaryCards.map(([label, value]) => (
          <article className="summary-tile" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="staff-extra-panel">
        <div className="staff-extra-panel-header">
          <div>
            <span>Log registry</span>
            <h2>{logs.length} record(s)</h2>
          </div>
          <button type="button" className="staff-extra-button secondary" onClick={() => loadLogs()}>Refresh</button>
        </div>

        {loading ? (
          <div className="staff-extra-empty">Loading care logs...</div>
        ) : logs.length === 0 ? (
          <div className="staff-extra-empty">No care logs matched the current filters.</div>
        ) : (
          <div className="care-log-list">
            {logs.map((log) => (
              <article className="care-log-row" key={log.id}>
                <div>
                  <strong>{log.animalName}</strong>
                  <p>{log.animalSpecies || 'Animal care'}</p>
                </div>
                <div>
                  <em>{log.careType}</em>
                  <span>{log.date} | {log.time}</span>
                </div>
                <p>{log.notes || 'No notes'}</p>
                <div className="care-log-actions">
                  {log.taskId && <Link to={`/staff/tasks/${log.taskId}`}>Task</Link>}
                  {log.animalId && <Link to={`/staff/animals/${log.animalId}/care`}>Animal</Link>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StaffCareLogsPage;
