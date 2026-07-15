import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import './StaffDashboard.css';

const Icon = ({ type }) => {
  const icons = {
    clipboard: (
      <path d="M8 3h8v3H8V3Zm-2 2h2v2h8V5h2v16H6V5Zm3 7h6v1.5H9V12Zm0 4h6v1.5H9V16Z" />
    ),
    calendar: (
      <path d="M7 3h2v3H7V3Zm8 0h2v3h-2V3ZM5 6h14v14H5V6Zm2 5h4v4H7v-4Zm8 4.2a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm-.4 1.2h.8v2.1l1.4.8-.4.7-1.8-1.1v-2.5Z" />
    ),
    check: (
      <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-2.05-4.95l-5.3 5.3-2.6-2.6-1.4 1.4 4 4 6.7-6.7A9 9 0 0 0 12 3Z" />
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="staff-icon">
      {icons[type]}
    </svg>
  );
};

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
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '-');
  if (normalized === 'in-progress') return 'pending';
  return normalized || 'pending';
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

  const dashboardStats = useMemo(() => ([
    {
      label: 'Assigned Tasks',
      value: summary.assignedTasks ?? 0,
      helper: 'Total assigned work',
      helperType: 'positive',
      icon: 'clipboard'
    },
    {
      label: 'Pending',
      value: summary.pendingTasks ?? 0,
      helper: 'Requires attention',
      icon: 'calendar'
    },
    {
      label: 'Completed Today',
      value: summary.completedToday ?? 0,
      helper: 'Tasks and care logs',
      helperType: 'positive',
      icon: 'check'
    }
  ]), [summary.assignedTasks, summary.pendingTasks, summary.completedToday]);

  return (
    <div className="staff-dashboard">
      <header className="staff-topbar">
        <label className="staff-search" aria-label="Search ZooLogix">
          <span className="staff-search-icon">O</span>
          <input type="search" placeholder="Search ZooLogix..." />
        </label>
        <div className="staff-top-actions" aria-label="Staff shortcuts">
          <button type="button" aria-label="Notifications">!</button>
          <button type="button" aria-label="Settings">*</button>
          <div className="staff-avatar" aria-label="Staff profile" />
        </div>
      </header>

      <section className="staff-hero">
        <h1>Good Morning, {staffName}</h1>
        <p>Here is your operational overview for today.</p>
      </section>

      {error && (
        <div className="staff-dashboard-message error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="staff-dashboard-message">Loading dashboard data...</div>
      ) : (
        <>
          <section className="staff-stats-grid" aria-label="Daily task summary">
            {dashboardStats.map((stat) => (
              <article className="staff-stat-card" key={stat.label}>
                <div className="staff-stat-heading">
                  <span>{stat.label}</span>
                  <Icon type={stat.icon} />
                </div>
                <strong>{stat.value}</strong>
                <p className={stat.helperType === 'positive' ? 'positive' : ''}>{stat.helper}</p>
              </article>
            ))}

            <article className="staff-stat-card staff-progress-card">
              <span>Task Progress</span>
              <div className="staff-progress-ring" style={{ '--progress': `${progress}%` }}>
                <strong>{progress}%</strong>
              </div>
              <p>Completion Rate</p>
            </article>
          </section>

          <section className="staff-dashboard-grid">
            <article className="staff-panel staff-task-panel">
              <div className="staff-panel-header">
                <h2>Today's Tasks</h2>
                <button type="button">View All</button>
              </div>

              <div className="staff-task-table" role="table" aria-label="Today's tasks">
                <div className="staff-task-row staff-task-head" role="row">
                  <span>Task Description</span>
                  <span>Location</span>
                  <span>Priority</span>
                  <span>Status</span>
                </div>

                {tasks.length === 0 ? (
                  <div className="staff-empty-row">No assigned tasks found.</div>
                ) : tasks.map((task) => (
                  <div className="staff-task-row" role="row" key={task.id}>
                    <span className={task.completed ? 'task-completed' : ''}>{task.title}</span>
                    <span>{task.location}</span>
                    <span>
                      <em className={`staff-pill priority-${toPriorityClass(task.priority)}`}>{task.priority}</em>
                    </span>
                    <span>
                      <em className={`staff-pill status-${toStatusClass(task.status)}`}>{task.status}</em>
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <aside className="staff-side-column">
              <article className="staff-panel">
                <h2>Animals Under My Care</h2>
                <div className="staff-animal-list">
                  {animals.length === 0 ? (
                    <div className="staff-empty-box">No assigned animals found.</div>
                  ) : animals.map((animal) => (
                    <div className="staff-animal-card" key={animal.id}>
                      <div className="staff-animal-initial">{animal.name?.charAt(0) || 'A'}</div>
                      <div>
                        <strong>{animal.name}</strong>
                        <span>{animal.species}</span>
                      </div>
                      <i className={`animal-status ${animal.status === 'HEALTHY' ? 'healthy' : 'attention'}`} aria-label={animal.status} />
                    </div>
                  ))}
                </div>
                <button type="button" className="staff-secondary-action">View All Animals</button>
              </article>

              <article className="staff-panel staff-activity-panel">
                <h2>Recent Activity</h2>
                <div className="staff-activity-list">
                  {recentActivity.length === 0 ? (
                    <div className="staff-empty-box">No care logs yet.</div>
                  ) : recentActivity.map((activity) => (
                    <div className="staff-activity-item" key={activity.id}>
                      <i className="activity-dot completed" />
                      <div>
                        <strong>{activity.text}</strong>
                        <span>{activity.time || activity.note}</span>
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
