import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';

const formatMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
const formatDate = (value) => new Date(value).toLocaleDateString('en-GB');

const StatusBreakdown = ({ title, rows }) => (
  <article className="admin-card">
    <div className="admin-card-header">
      <div>
        <span className="admin-card-kicker">Breakdown</span>
        <h2>{title}</h2>
      </div>
    </div>
    <div className="admin-bar-list">
      {rows.map((row) => {
        const max = Math.max(...rows.map((item) => item.count), 1);
        return (
          <div className="admin-bar-row" key={row.status}>
            <div className="admin-bar-label-row">
              <span>{row.status}</span>
              <strong>{row.count}</strong>
            </div>
            <div className="admin-bar-track">
              <div className="admin-bar-fill" style={{ width: `${(row.count / max) * 100}%`, backgroundColor: '#1b5e3c' }} />
            </div>
          </div>
        );
      })}
    </div>
  </article>
);

const AdminReportsPage = () => {
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
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const summary = report?.summary || {};

  return (
    <div className="admin-screen">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">Reports</span>
          <h1>Operations and revenue report</h1>
          <p>Review revenue, bookings, task progress and animal health signals from current MongoDB data.</p>
        </div>
        <div className="admin-hero-panel">
          <span className="admin-panel-label">Paid revenue</span>
          <strong>{formatMoney(summary.revenue)}</strong>
          <p>{summary.pendingBookings || 0} booking(s) are still pending.</p>
        </div>
      </section>

      {error && (
        <section className="admin-card">
          <div className="admin-inline-feedback admin-inline-feedback-error">{error}</div>
        </section>
      )}

      {loading ? (
        <section className="admin-card">
          <div className="admin-empty-state">Loading reports...</div>
        </section>
      ) : report && (
        <>
          <section className="admin-metrics-grid">
            <article className="admin-metric-card"><span className="admin-metric-label">Revenue</span><strong className="admin-metric-value admin-metric-money">{formatMoney(summary.revenue)}</strong><span className="admin-metric-note">Paid bookings</span></article>
            <article className="admin-metric-card"><span className="admin-metric-label">Bookings</span><strong className="admin-metric-value">{summary.bookings}</strong><span className="admin-metric-note">{summary.pendingBookings} pending</span></article>
            <article className="admin-metric-card"><span className="admin-metric-label">Open tasks</span><strong className="admin-metric-value">{summary.openTasks}</strong><span className="admin-metric-note">TODO and in progress</span></article>
            <article className="admin-metric-card"><span className="admin-metric-label">Animal alerts</span><strong className="admin-metric-value">{summary.monitoringAnimals}</strong><span className="admin-metric-note">Observation or treatment</span></article>
          </section>

          <section className="admin-metrics-grid">
            <article className="admin-metric-card"><span className="admin-metric-label">Users</span><strong className="admin-metric-value">{summary.users}</strong><span className="admin-metric-note">{summary.staff} staff and vets</span></article>
            <article className="admin-metric-card"><span className="admin-metric-label">Areas</span><strong className="admin-metric-value">{summary.areas}</strong><span className="admin-metric-note">Operating zones</span></article>
            <article className="admin-metric-card"><span className="admin-metric-label">Animals</span><strong className="admin-metric-value">{summary.animals}</strong><span className="admin-metric-note">Managed profiles</span></article>
            <article className="admin-metric-card"><span className="admin-metric-label">Products</span><strong className="admin-metric-value">{summary.tickets + summary.services}</strong><span className="admin-metric-note">Tickets and services</span></article>
          </section>

          <section className="admin-content-grid">
            <StatusBreakdown title="Booking status" rows={report.bookingStatus} />
            <StatusBreakdown title="Task status" rows={report.taskStatus} />
          </section>

          <section className="admin-content-grid">
            <StatusBreakdown title="Animal status" rows={report.animalStatus} />

            <article className="admin-card">
              <div className="admin-card-header">
                <div>
                  <span className="admin-card-kicker">Sales</span>
                  <h2>Top tickets</h2>
                </div>
              </div>
              <div className="admin-list">
                {report.topTickets.length === 0 ? (
                  <div className="admin-empty-state">No ticket sales yet.</div>
                ) : report.topTickets.map((ticket) => (
                  <div className="admin-list-row" key={ticket.name}>
                    <div>
                      <strong>{ticket.name}</strong>
                      <p>{ticket.quantity} sold</p>
                    </div>
                    <div className="admin-list-meta">
                      <strong>{formatMoney(ticket.revenue)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="admin-card-kicker">Bookings</span>
                <h2>Recent bookings</h2>
              </div>
              <button type="button" className="admin-button admin-button-secondary" onClick={loadReport}>Refresh</button>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>Booking</th><th>Customer</th><th>Visit date</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
                <tbody>
                  {report.recentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td><strong>{booking.bookingCode}</strong></td>
                      <td>{booking.user?.fullName || booking.user?.email || 'Unknown'}</td>
                      <td>{formatDate(booking.visitDate)}</td>
                      <td>{formatMoney(booking.totalAmount)}</td>
                      <td><span className={`admin-badge admin-badge-${booking.status.toLowerCase()}`}>{booking.status}</span></td>
                      <td><span className={`admin-badge admin-badge-${booking.paymentStatus.toLowerCase()}`}>{booking.paymentStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminReportsPage;
