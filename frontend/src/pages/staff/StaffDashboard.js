import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './StaffDashboard.css';

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (error) {
    return null;
  }
};

const toPriorityClass = (priority) => {
  const normalized = (priority || '').toLowerCase();
  if (normalized === 'medium') return 'normal';
  return normalized || 'normal';
};

const toStatusClass = (status) => {
  return (status || '').toLowerCase().replace(/[_\s]+/g, '-') || 'pending';
};

const toCareStatusClass = (status) => {
  return (status || 'healthy').toLowerCase().replace(/[_\s]+/g, '-');
};

const formatDetailTime = (value) => {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const StaffDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getStaffDashboard();
        if (isMounted) {
          setDashboard(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load staff dashboard');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentUser = getCurrentUser();
  const staffName = dashboard?.staff?.name || currentUser?.fullName || currentUser?.email || 'Staff';
  const summary = dashboard?.summary || {};
  const tasks = dashboard?.tasks || [];
  const animals = dashboard?.animals || [];
  const recentActivity = dashboard?.recentActivity || [];
  const progress = Number(summary.taskProgress || 0);
  const firstAnimalId = animals[0]?.id;

  const dashboardStats = useMemo(() => ([
    {
      label: 'Assigned Tasks',
      value: summary.assignedTasks ?? 0,
      helper: 'All tasks assigned to your shift'
    },
    {
      label: 'Pending Work',
      value: summary.pendingTasks ?? 0,
      helper: 'Tasks waiting for action'
    },
    {
      label: 'Completed Today',
      value: summary.completedToday ?? 0,
      helper: 'Finished tasks and care logs'
    },
    {
      label: 'Completion Rate',
      value: `${progress}%`,
      helper: 'Current task progress'
    }
  ]), [summary.assignedTasks, summary.pendingTasks, summary.completedToday, progress]);

  return (
    <div className="staff-dashboard-page">
      <header className="staff-dashboard-header">
        <div>
          <span>Dashboard</span>
          <h1>Staff Operations Dashboard</h1>
          <p>Track assigned tasks, animal care coverage, and daily care activity from live staff data.</p>
        </div>
        <div className="staff-dashboard-profile" aria-label="Signed in staff">
          <span>Signed in as</span>
          <strong>{staffName}</strong>
        </div>
      </header>

      {error && (
        <div className="staff-dashboard-message error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="staff-dashboard-message">Loading dashboard data...</div>
      ) : (
        <>
          <section className="staff-dashboard-summary-grid" aria-label="Staff work summary">
            {dashboardStats.map((stat) => (
              <article key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <p>{stat.helper}</p>
              </article>
            ))}
          </section>

          <section className="staff-dashboard-content">
            <article className="staff-dashboard-panel staff-dashboard-task-panel">
              <div className="staff-dashboard-panel-header">
                <div>
                  <span>Operations</span>
                  <h2>Assigned Tasks</h2>
                </div>
                <Link to="/staff/tasks">View all tasks</Link>
              </div>

              <div className="dashboard-task-table" role="table" aria-label="Assigned staff tasks">
                <div className="dashboard-task-row dashboard-task-head" role="row">
                  <span>Task</span>
                  <span>Animal / Area</span>
                  <span>Due</span>
                  <span>Priority</span>
                  <span>Status</span>
                </div>

                {tasks.length === 0 ? (
                  <div className="dashboard-empty-row">No assigned tasks found.</div>
                ) : tasks.map((task) => (
                  <Link className="dashboard-task-row" role="row" to={`/staff/tasks/${task.id}`} key={task.id}>
                    <span>
                      <strong className={task.completed ? 'dashboard-completed-text' : ''}>{task.title}</strong>
                      <small>{task.description || 'No additional instructions'}</small>
                    </span>
                    <span>
                      <strong>{task.animalName || task.location || 'General area'}</strong>
                      <small>{task.location || 'No location'}</small>
                    </span>
                    <span>{formatDetailTime(task.dueDate || task.scheduledTime)}</span>
                    <span>
                      <em className={`dashboard-pill priority-${toPriorityClass(task.priority)}`}>{task.priority || 'Normal'}</em>
                    </span>
                    <span>
                      <em className={`dashboard-pill status-${toStatusClass(task.status)}`}>{task.status || 'Pending'}</em>
                    </span>
                  </Link>
                ))}
              </div>
            </article>

            <aside className="staff-dashboard-side">
              <article className="staff-dashboard-panel">
                <div className="staff-dashboard-panel-header compact">
                  <div>
                    <span>Actions</span>
                    <h2>Quick Links</h2>
                  </div>
                </div>
                <div className="dashboard-action-list">
                  <Link to="/staff/tasks">Manage task status</Link>
                  <Link to="/staff/animals">View assigned animals</Link>
                  <Link to={firstAnimalId ? `/staff/animals/${firstAnimalId}/care-logs/new` : '/staff/animals'}>
                    Add daily care log
                  </Link>
                </div>
              </article>

              <article className="staff-dashboard-panel">
                <div className="staff-dashboard-panel-header compact">
                  <div>
                    <span>Animal Care</span>
                    <h2>Animals Under My Care</h2>
                  </div>
                  <Link to="/staff/animals">View All</Link>
                </div>

                <div className="dashboard-animal-list">
                  {animals.length === 0 ? (
                    <div className="dashboard-empty-box">No assigned animals found.</div>
                  ) : animals.map((animal) => (
                    <Link className="dashboard-animal-card" to={`/staff/animals/${animal.id}/care`} key={animal.id}>
                      <div className="dashboard-animal-initial">{animal.name?.charAt(0) || 'A'}</div>
                      <div>
                        <strong>{animal.name}</strong>
                        <span>{animal.species || animal.type || 'Animal'}</span>
                      </div>
                      <em className={`dashboard-care-status status-${toCareStatusClass(animal.status)}`}>
                        {animal.status || 'Healthy'}
                      </em>
                    </Link>
                  ))}
                </div>
              </article>

              <article className="staff-dashboard-panel">
                <div className="staff-dashboard-panel-header compact">
                  <div>
                    <span>Care Logs</span>
                    <h2>Recent Activity</h2>
                  </div>
                </div>

                <div className="dashboard-activity-list">
                  {recentActivity.length === 0 ? (
                    <div className="dashboard-empty-box">No care logs yet.</div>
                  ) : recentActivity.map((activity) => (
                    <div className="dashboard-activity-item" key={activity.id}>
                      <i aria-hidden="true" />
                      <div>
                        <strong>{activity.text}</strong>
                        <span>{activity.time || activity.note || 'Recently updated'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </aside>
          </section>
        </>
      )}
    </div>
  );
};

export default StaffDashboard;
