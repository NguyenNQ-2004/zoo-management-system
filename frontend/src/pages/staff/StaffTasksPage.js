import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './StaffTasksPage.css';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Normal' },
  { value: 'LOW', label: 'Low' },
];

const dueOptions = [
  { value: '', label: 'All Due Dates' },
  { value: 'TODAY', label: 'Due Today' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'UPCOMING', label: 'Upcoming' },
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

const toPriorityClass = (priority) => {
  const normalized = (priority || '').toLowerCase();
  if (normalized === 'medium') return 'normal';
  return normalized || 'normal';
};

const toStatusClass = (status) => {
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '-');
  if (normalized === 'in-progress') return 'in-progress';
  if (normalized === 'completed') return 'completed';
  return normalized || 'pending';
};

const StaffTasksPage = () => {
  const [taskData, setTaskData] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [due, setDue] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  const loadTasks = async (filters = { search, status, priority, due }) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getStaffTasks(filters);
      setTaskData(data);
    } catch (err) {
      setError(err.message || 'Failed to load staff tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks({ search, status, priority, due });
    }, 250);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, priority, due]);

  const tasks = taskData?.tasks || [];
  const summary = taskData?.summary || {};

  const summaryCards = useMemo(() => ([
    { label: 'All Tasks', value: summary.total ?? tasks.length },
    { label: 'Filtered', value: summary.filtered ?? tasks.length },
    { label: 'To Do', value: summary.todo ?? 0 },
    { label: 'In Progress', value: summary.inProgress ?? 0 },
    { label: 'Done', value: summary.done ?? 0 },
    { label: 'Overdue', value: summary.overdue ?? 0 },
  ]), [summary.total, summary.filtered, summary.todo, summary.inProgress, summary.done, summary.overdue, tasks.length]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    loadTasks({ search, status, priority, due });
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setDue('');
    loadTasks({ search: '', status: '', priority: '', due: '' });
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    try {
      setUpdatingId(taskId);
      setError('');
      await api.updateStaffTaskStatus(taskId, nextStatus);
      await loadTasks({ search, status, priority, due });
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className="staff-tasks-page">
      <header className="staff-tasks-header">
        <div>
          <span>Operations</span>
          <h1>My Tasks</h1>
          <p>Manage and track daily conservation and operational assignments.</p>
        </div>
      </header>

      <form className="task-filter-panel" onSubmit={handleFilterSubmit}>
        <label>
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search task name or animal..."
          />
        </label>

        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Priority</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Due</span>
          <select value={due} onChange={(event) => setDue(event.target.value)}>
            {dueOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <button type="submit">Apply Filters</button>
        <button type="button" className="secondary" onClick={handleClearFilters}>Clear</button>
      </form>

      {error && (
        <div className="staff-tasks-message error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="staff-tasks-message">Loading assigned tasks...</div>
      ) : (
        <>
          <section className="staff-task-summary-grid" aria-label="Task status summary">
            {summaryCards.map((card) => (
              <article key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </section>

          <section className="staff-task-list-panel">
            <div className="staff-task-list-header">
              <h2>Task List</h2>
              <span>{tasks.length} records</span>
            </div>

            <div className="assigned-task-table" role="table" aria-label="Assigned staff tasks">
              <div className="assigned-task-row assigned-task-head" role="row">
                <span>Task</span>
                <span>Animal</span>
                <span>Location</span>
                <span>Due</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {tasks.length === 0 ? (
                <div className="assigned-task-empty">No assigned tasks found.</div>
              ) : tasks.map((task) => (
                <div className="assigned-task-row" role="row" key={task.id}>
                  <span>
                    <strong>{task.title}</strong>
                    <small>{task.description || task.taskType}</small>
                  </span>
                  <span>
                    <strong>{task.animalName || 'No animal'}</strong>
                    <small>{task.animalSpecies || task.taskType}</small>
                  </span>
                  <span>{task.location}</span>
                  <span>{formatDateTime(task.dueDate)}</span>
                  <span>
                    <em className={`task-pill priority-${toPriorityClass(task.rawPriority || task.priority)}`}>
                      {task.priority}
                    </em>
                  </span>
                  <span>
                    <select
                      className={`task-status-select status-${toStatusClass(task.status)}`}
                      value={task.rawStatus}
                      disabled={updatingId === task.id}
                      onChange={(event) => handleStatusChange(task.id, event.target.value)}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </span>
                  <span>
                    <Link className="task-row-link" to={`/staff/tasks/${task.id}`}>Detail</Link>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default StaffTasksPage;
