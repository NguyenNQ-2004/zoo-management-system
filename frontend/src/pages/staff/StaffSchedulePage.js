import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './StaffOperationsExtra.css';

const sections = [
  { key: 'overdue', title: 'Overdue', tone: 'danger' },
  { key: 'today', title: 'Due Today', tone: 'warning' },
  { key: 'upcoming', title: 'Upcoming', tone: 'info' },
  { key: 'completed', title: 'Completed', tone: 'success' },
];

const formatDateTime = (value) => {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const StaffSchedulePage = () => {
  const [scheduleData, setScheduleData] = useState(null);
  const [activeSection, setActiveSection] = useState('today');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getStaffSchedule();
      setScheduleData(data);
    } catch (requestError) {
      setError(requestError.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const summary = useMemo(() => scheduleData?.summary || {}, [scheduleData]);
  const schedule = useMemo(() => scheduleData?.schedule || {}, [scheduleData]);
  const visibleTasks = useMemo(() => schedule[activeSection] || [], [schedule, activeSection]);

  const handleQuickStatus = async (taskId, status) => {
    try {
      setUpdatingId(taskId);
      setError('');
      await api.updateStaffTaskStatus(taskId, status);
      await loadSchedule();
    } catch (requestError) {
      setError(requestError.message || 'Failed to update task status');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className="staff-extra-page">
      <header className="staff-extra-header">
        <span>Schedule</span>
        <h1>Work Schedule</h1>
        <p>Review overdue, today and upcoming assignments in one operational view.</p>
      </header>

      {error && <div className="staff-extra-message error">{error}</div>}

      <section className="staff-extra-summary">
        {sections.map((section) => (
          <button
            key={section.key}
            type="button"
            className={`summary-tile tone-${section.tone}${activeSection === section.key ? ' active' : ''}`}
            onClick={() => setActiveSection(section.key)}
          >
            <span>{section.title}</span>
            <strong>{summary[section.key] || 0}</strong>
          </button>
        ))}
      </section>

      <section className="staff-extra-panel">
        <div className="staff-extra-panel-header">
          <div>
            <span>{sections.find((section) => section.key === activeSection)?.title}</span>
            <h2>{visibleTasks.length} task(s)</h2>
          </div>
          <button type="button" className="staff-extra-button secondary" onClick={loadSchedule}>Refresh</button>
        </div>

        {loading ? (
          <div className="staff-extra-empty">Loading schedule...</div>
        ) : visibleTasks.length === 0 ? (
          <div className="staff-extra-empty">No tasks in this schedule group.</div>
        ) : (
          <div className="schedule-list">
            {visibleTasks.map((task) => (
              <article className="schedule-card" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.description || task.taskType}</p>
                  <span>{task.animalName || 'No animal'} | {task.location || 'No location'}</span>
                </div>
                <div className="schedule-meta">
                  <time>{formatDateTime(task.dueDate)}</time>
                  <em>{task.priority}</em>
                  <strong>{task.status}</strong>
                </div>
                <div className="schedule-actions">
                  {task.rawStatus === 'TODO' && (
                    <button type="button" disabled={updatingId === task.id} onClick={() => handleQuickStatus(task.id, 'IN_PROGRESS')}>
                      Start
                    </button>
                  )}
                  {task.rawStatus !== 'DONE' && (
                    <button type="button" disabled={updatingId === task.id} onClick={() => handleQuickStatus(task.id, 'DONE')}>
                      Done
                    </button>
                  )}
                  <Link to={`/staff/tasks/${task.id}`}>Detail</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StaffSchedulePage;
