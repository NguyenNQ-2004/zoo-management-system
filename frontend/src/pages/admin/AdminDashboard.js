import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')} VND`;
const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-GB') : 'N/A');

const AdminDashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReport = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminApi.getReports();
      setReport(response.data);
    } catch (requestError) {
      setError(requestError.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const summary = useMemo(() => report?.summary || {}, [report]);
  const metrics = useMemo(() => ([
    { label: 'Total Accounts', value: summary.users || 0, note: `${summary.staff || 0} staff and vets` },
    { label: 'Animals Tracked', value: summary.animals || 0, note: `${summary.monitoringAnimals || 0} need attention` },
    { label: 'Pending Bookings', value: summary.pendingBookings || 0, note: `${summary.bookings || 0} total bookings` },
    { label: 'Revenue', value: formatMoney(summary.revenue), note: 'Paid bookings' },
    { label: 'Open Tasks', value: summary.openTasks || 0, note: 'TODO and in progress' },
    { label: 'Products', value: (summary.tickets || 0) + (summary.services || 0), note: 'Tickets and services' },
  ]), [summary]);

  const roleRows = [
    { label: 'Users', value: summary.users || 0 },
    { label: 'Staff/Vets', value: summary.staff || 0 },
    { label: 'Animals', value: summary.animals || 0 },
    { label: 'Areas', value: summary.areas || 0 },
  ];
  const maxRoleValue = Math.max(...roleRows.map((row) => row.value), 1);

  return (
    <div className="admin-screen">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">Admin Control Center</span>
          <h1>Dashboard overview</h1>
          <p>Track people, animals, bookings, revenue and operational task load from current MongoDB data.</p>
        </div>
        <div className="admin-hero-panel">
          <span className="admin-panel-label">Today&apos;s focus</span>
          <strong>{summary.openTasks || 0} open task(s), {summary.pendingBookings || 0} pending booking(s)</strong>
          <p>{summary.monitoringAnimals || 0} animal(s) are marked for observation or treatment.</p>
        </div>
      </section>

      {error && (
        <section className="admin-card">
          <div className="admin-inline-feedback admin-inline-feedback-error">{error}</div>
        </section>
      )}

      {loading ? (
        <section className="admin-card">
          <div className="admin-empty-state">Loading admin dashboard...</div>
        </section>
      ) : (
        <>
          <section className="admin-metrics-grid">
            {metrics.map((metric) => (
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
                  <span className="admin-card-kicker">Live overview</span>
                  <h2>System mix</h2>
                </div>
                <button type="button" className="admin-button admin-button-secondary" onClick={loadReport}>Refresh</button>
              </div>

              <div className="admin-bar-list">
                {roleRows.map((row) => (
                  <div key={row.label} className="admin-bar-row">
                    <div className="admin-bar-label-row">
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                    <div className="admin-bar-track">
                      <div className="admin-bar-fill" style={{ width: `${(row.value / maxRoleValue) * 100}%`, backgroundColor: '#1b5e3c' }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-card">
              <div className="admin-card-header">
                <div>
                  <span className="admin-card-kicker">Quick actions</span>
                  <h2>Manage records</h2>
                </div>
              </div>
              <div className="admin-list">
                <Link className="admin-list-row" to="/admin/users"><strong>Users</strong><p>Create, edit and lock accounts</p></Link>
                <Link className="admin-list-row" to="/admin/staff"><strong>Staff</strong><p>Assign area coverage and review workload</p></Link>
                <Link className="admin-list-row" to="/admin/assignments"><strong>Tasks</strong><p>Create and close operational assignments</p></Link>
                <Link className="admin-list-row" to="/admin/tickets"><strong>Tickets</strong><p>Manage tickets, services and bookings</p></Link>
              </div>
            </article>
          </section>

          <section className="admin-content-grid">
            <article className="admin-card">
              <div className="admin-card-header">
                <div>
                  <span className="admin-card-kicker">Animal health</span>
                  <h2>Status breakdown</h2>
                </div>
              </div>
              <div className="admin-bar-list">
                {(report?.animalStatus || []).map((row) => {
                  const max = Math.max(...report.animalStatus.map((item) => item.count), 1);
                  return (
                    <div key={row.status} className="admin-bar-row">
                      <div className="admin-bar-label-row"><span>{row.status}</span><strong>{row.count}</strong></div>
                      <div className="admin-bar-track"><div className="admin-bar-fill" style={{ width: `${(row.count / max) * 100}%`, backgroundColor: '#2f7d57' }} /></div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="admin-card">
              <div className="admin-card-header">
                <div>
                  <span className="admin-card-kicker">Recent bookings</span>
                  <h2>Visitor activity</h2>
                </div>
              </div>
              <div className="admin-list">
                {(report?.recentBookings || []).length === 0 ? (
                  <div className="admin-empty-state">No bookings recorded.</div>
                ) : report.recentBookings.map((booking) => (
                  <div key={booking._id} className="admin-list-row">
                    <div>
                      <strong>{booking.bookingCode}</strong>
                      <p>{booking.user?.fullName || booking.user?.email || 'Unknown'} | {formatDate(booking.visitDate)}</p>
                    </div>
                    <div className="admin-list-meta">
                      <span className={`admin-badge admin-badge-${booking.status.toLowerCase()}`}>{booking.status}</span>
                      <strong>{formatMoney(booking.totalAmount)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
