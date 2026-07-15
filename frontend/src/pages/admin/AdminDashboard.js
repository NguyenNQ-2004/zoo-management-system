import React from 'react';
import {
  adminActivity,
  adminAlerts,
  adminAnimals,
  adminAreas,
  adminBookings,
  adminTasks,
  adminUsers,
} from './adminMockData';

const dashboardMetrics = [
  {
    label: 'Total Accounts',
    value: adminUsers.length,
    note: 'All system roles',
  },
  {
    label: 'Staff & Vets',
    value: adminUsers.filter((user) => user.role === 'STAFF' || user.role === 'VET').length,
    note: 'Operational workforce',
  },
  {
    label: 'Active Areas',
    value: adminAreas.filter((area) => area.status === 'OPEN').length,
    note: 'Ready for visitors',
  },
  {
    label: 'Animals Tracked',
    value: adminAnimals.length,
    note: 'Mapped to enclosures',
  },
  {
    label: 'Pending Bookings',
    value: adminBookings.filter((booking) => booking.status === 'PENDING').length,
    note: 'Need follow-up',
  },
  {
    label: 'Overdue Tasks',
    value: adminTasks.filter((task) => task.status === 'OVERDUE').length,
    note: 'Admin escalation',
  },
];

const chartRows = [
  { label: 'Users', value: adminUsers.filter((user) => user.role === 'USER').length, color: '#1b5e3c' },
  { label: 'Staff', value: adminUsers.filter((user) => user.role === 'STAFF').length, color: '#2f7d57' },
  { label: 'Vets', value: adminUsers.filter((user) => user.role === 'VET').length, color: '#4e9f75' },
  { label: 'Admins', value: adminUsers.filter((user) => user.role === 'ADMIN').length, color: '#7dc8a1' },
];

const maxChartValue = Math.max(...chartRows.map((row) => row.value), 1);

const AdminDashboard = () => {
  return (
    <div className="admin-screen">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">Admin Control Center</span>
          <h1>Dashboard overview</h1>
          <p>
            Track people, animal operations, bookings and urgent issues from one place.
            This screen is ready to wire up to backend admin APIs later.
          </p>
        </div>
        <div className="admin-hero-panel">
          <span className="admin-panel-label">Today&apos;s focus</span>
          <strong>1 overdue task, 1 pending booking, 1 animal under observation</strong>
          <p>Review assignments first, then confirm visitor revenue items.</p>
        </div>
      </section>

      <section className="admin-metrics-grid">
        {dashboardMetrics.map((metric) => (
          <article key={metric.label} className="admin-metric-card">
            <span className="admin-metric-label">{metric.label}</span>
            <strong className="admin-metric-value">{metric.value}</strong>
            <span className="admin-metric-note">{metric.note}</span>
          </article>
        ))}
      </section>

      <section className="admin-content-grid">
        <article className="admin-card">
          <div className="admin-card-header">
            <div>
              <span className="admin-card-kicker">Role distribution</span>
              <h2>Account mix</h2>
            </div>
            <span className="admin-badge admin-badge-neutral">Current seed data</span>
          </div>

          <div className="admin-bar-list">
            {chartRows.map((row) => (
              <div key={row.label} className="admin-bar-row">
                <div className="admin-bar-label-row">
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{
                      width: `${(row.value / maxChartValue) * 100}%`,
                      backgroundColor: row.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-header">
            <div>
              <span className="admin-card-kicker">Attention needed</span>
              <h2>Admin alerts</h2>
            </div>
          </div>

          <div className="admin-alert-list">
            {adminAlerts.map((alert) => (
              <div key={alert.title} className={`admin-alert admin-alert-${alert.tone}`}>
                <strong>{alert.title}</strong>
                <p>{alert.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-content-grid">
        <article className="admin-card">
          <div className="admin-card-header">
            <div>
              <span className="admin-card-kicker">Recent operations</span>
              <h2>Activity feed</h2>
            </div>
          </div>

          <div className="admin-timeline">
            {adminActivity.map((item) => (
              <div key={item.title} className="admin-timeline-item">
                <div className="admin-timeline-dot" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-header">
            <div>
              <span className="admin-card-kicker">Task queue</span>
              <h2>Operational assignments</h2>
            </div>
          </div>

          <div className="admin-list">
            {adminTasks.map((task) => (
              <div key={task.id} className="admin-list-row">
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.assignedTo}</p>
                </div>
                <div className="admin-list-meta">
                  <span className={`admin-badge admin-badge-${task.status.toLowerCase()}`}>{task.status}</span>
                  <small>{task.dueLabel}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminDashboard;
