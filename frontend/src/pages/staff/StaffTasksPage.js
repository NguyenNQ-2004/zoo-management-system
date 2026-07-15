import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import './StaffTasksPage.css';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getStaffTasks();
        if (isMounted) {
          setTaskData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load staff tasks');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const tasks = taskData?.tasks || [];
  const summary = taskData?.summary || {};

  const summaryCards = useMemo(() => ([
    { label: 'All Tasks', value: summary.total ?? tasks.length },
    { label: 'To Do', value: summary.todo ?? 0 },
    { label: 'In Progress', value: summary.inProgress ?? 0 },
    { label: 'Done', value: summary.done ?? 0 },
  ]), [summary.total, summary.todo, summary.inProgress, summary.done, tasks.length]);

  return (
    <div className="staff-tasks-page">
      <header className="staff-tasks-header">
        <div>
          <span>Operations</span>
          <h1>Assigned Tasks</h1>
          <p>Tasks assigned to you from current zoo operations.</p>
        </div>
      </header>

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
                    <em className={`task-pill status-${toStatusClass(task.status)}`}>
                      {task.status}
                    </em>
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
