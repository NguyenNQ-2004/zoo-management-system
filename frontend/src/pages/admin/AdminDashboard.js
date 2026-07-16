import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const response = await adminApi.getDashboard();
        if (mounted) setData(response.data);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load dashboard data');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="admin-screen"><div className="admin-empty-state">Loading dashboard...</div></div>;
  if (error) return <div className="admin-screen"><div className="admin-empty-state admin-inline-feedback-error">{error}</div></div>;

  const dashboardMetrics = [
    { label: 'Total Accounts', value: data?.metrics?.totalUsers || 0, note: 'All system roles' },
    { label: 'Staff & Vets', value: data?.metrics?.operationalStaff || 0, note: 'Operational workforce' },
    { label: 'Active Areas', value: data?.metrics?.activeAreas || 0, note: 'Ready for visitors' },
    { label: 'Animals Tracked', value: data?.metrics?.totalAnimals || 0, note: 'Mapped to enclosures' },
    { label: 'Pending Bookings', value: data?.metrics?.pendingBookings || 0, note: 'Need follow-up' },
    { label: 'Overdue Tasks', value: data?.metrics?.overdueTasks || 0, note: 'Admin escalation' },
  ];

  const chartRows = data?.chartRows || [];
  const maxChartValue = Math.max(...chartRows.map((row) => row.value), 1);
  const adminAlerts = data?.alerts || [];
  const adminActivity = data?.activity || [];
  const adminTasks = data?.tasks || [];

  return (
    <div className="admin-screen">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">Admin Control Center</span>
          <h1>Dashboard overview</h1>
          <p>
            Track people, animal operations, bookings and urgent issues from one place.
          </p>
        </div>
        <div className="admin-hero-panel">
          <span className="admin-panel-label">Today&apos;s focus</span>
          <strong>{data?.metrics?.overdueTasks || 0} overdue tasks, {data?.metrics?.pendingBookings || 0} pending bookings</strong>
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
            {adminAlerts.length === 0 ? <p style={{color: '#666'}}>No active alerts.</p> : adminAlerts.map((alert) => (
              <div key={alert.title} className={`admin-alert admin-alert-${alert.tone}`}>
                <strong>{alert.title}</strong>
                <p>{alert.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminDashboard;
