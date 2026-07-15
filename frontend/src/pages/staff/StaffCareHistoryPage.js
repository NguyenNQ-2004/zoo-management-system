import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './StaffCareHistoryPage.css';

const StaffCareHistoryPage = () => {
  const { animalId } = useParams();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getAnimalCareLogs(animalId);
        setHistory(data);
      } catch (err) {
        setError(err.message || 'Failed to load care history');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [animalId]);

  const logs = history?.logs || [];
  const animal = history?.animal;

  return (
    <div className="care-history-page">
      <header className="care-history-header">
        <div>
          <nav><Link to={`/staff/animals/${animalId}/care`}>Daily Care</Link> / Care History</nav>
          <h1>Care History</h1>
          <p>{animal ? `${animal.name} - ${animal.species}` : 'Historical daily care records.'}</p>
        </div>
        <Link to={`/staff/animals/${animalId}/care-logs/new`}>Add Care Log</Link>
      </header>

      {error && <div className="care-history-message error">{error}</div>}
      {loading && <div className="care-history-message">Loading care history...</div>}

      {!loading && (
        <section className="care-history-panel">
          <div className="care-history-panel-header">
            <h2>Historical Care Logs</h2>
            <span>{logs.length} records</span>
          </div>

          <div className="care-history-table" role="table" aria-label="Animal care history">
            <div className="care-history-row care-history-head" role="row">
              <span>Date & Time</span>
              <span>Type</span>
              <span>Staff</span>
              <span>Task</span>
              <span>Notes</span>
            </div>

            {logs.length === 0 ? (
              <div className="care-history-empty">No care logs found.</div>
            ) : logs.map((log) => (
              <div className="care-history-row" role="row" key={log.id}>
                <span>{log.time}</span>
                <span><em>{log.careType}</em></span>
                <span>{log.staffName || 'Staff'}</span>
                <span>{log.taskTitle || 'No linked task'}</span>
                <span>{log.notes || 'No notes'}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StaffCareHistoryPage;
