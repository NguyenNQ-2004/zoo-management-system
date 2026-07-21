import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { userApi } from '../../services/api';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')} VND`;
const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-GB') : 'N/A');

const cardStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 20,
  boxShadow: '0 10px 28px rgba(17, 24, 39, 0.06)',
};

const UserDashboard = () => {
  const location = useLocation();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const activeSection = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts[1] || 'home';
  }, [location.pathname]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userApi.getDashboard();
      setDashboard(data);
    } catch (requestError) {
      setError(requestError.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const user = dashboard?.user || {};
  const summary = dashboard?.summary || {};
  const areas = dashboard?.areas || [];
  const animals = dashboard?.animals || [];
  const services = dashboard?.services || [];
  const tickets = dashboard?.tickets || [];
  const bookings = dashboard?.bookings || [];

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 24 }}>
      <section style={{ ...cardStyle, background: '#f5fbf7' }}>
        <span style={{ color: '#1B5E3C', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>
          Visitor Portal
        </span>
        <h1 style={{ margin: '8px 0', fontSize: 34 }}>Welcome, {user.fullName || 'Visitor'}</h1>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Explore zoo areas, animals, services and your ticket history from live backend data.
        </p>
      </section>

      {error && (
        <div style={{ ...cardStyle, color: '#b91c1c', background: '#fef2f2', borderColor: '#fecaca' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={cardStyle}>Loading visitor data...</div>
      ) : (
        <>
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              ['Open areas', summary.openAreas || 0],
              ['Animals', summary.animals || 0],
              ['Services', summary.services || 0],
              ['Ticket types', summary.tickets || 0],
              ['My bookings', summary.bookings || 0],
            ].map(([label, value]) => (
              <article key={label} style={cardStyle}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>{label}</span>
                <strong style={{ display: 'block', marginTop: 8, fontSize: 28, color: '#12301f' }}>{value}</strong>
              </article>
            ))}
          </section>

          {(activeSection === 'home' || activeSection === 'explore') && (
            <section style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Zoo areas</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                {areas.map((area) => (
                  <article key={area._id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                    <strong>{area.name}</strong>
                    <p style={{ color: '#4b5563' }}>{area.description || area.habitatType}</p>
                    <span>{area.location || area.code}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(activeSection === 'home' || activeSection === 'animals') && (
            <section style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Animals</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {animals.map((animal) => (
                  <article key={animal._id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                    <strong>{animal.name}</strong>
                    <p style={{ color: '#4b5563' }}>{animal.scientificName || animal.species}</p>
                    <span>{animal.area?.name || 'Zoo habitat'} | {animal.healthStatus}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(activeSection === 'home' || activeSection === 'services') && (
            <section style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Services</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {services.map((service) => (
                  <article key={service._id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                    <strong>{service.name}</strong>
                    <p style={{ color: '#4b5563' }}>{service.description || service.category}</p>
                    <span>{formatMoney(service.price)} | {service.durationMinutes || 0} min</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(activeSection === 'home' || activeSection === 'tickets') && (
            <section style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Tickets and bookings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {tickets.length === 0 ? (
                  <div>No active ticket products found.</div>
                ) : tickets.map((ticket) => (
                  <article key={ticket._id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                    <strong>{ticket.name}</strong>
                    <p style={{ color: '#4b5563' }}>{ticket.ticketType}</p>
                    <span>{formatMoney(ticket.price)}</span>
                  </article>
                ))}
              </div>

              <div style={{ marginTop: 18 }}>
                <h3>My bookings</h3>
                {bookings.length === 0 ? (
                  <p style={{ color: '#4b5563' }}>No bookings recorded for this account.</p>
                ) : bookings.map((booking) => (
                  <div key={booking._id} style={{ borderTop: '1px solid #e5e7eb', padding: '12px 0' }}>
                    <strong>{booking.bookingCode}</strong>
                    <span style={{ marginLeft: 12 }}>{formatDate(booking.visitDate)}</span>
                    <span style={{ marginLeft: 12 }}>{formatMoney(booking.totalAmount)}</span>
                    <span style={{ marginLeft: 12 }}>{booking.status}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'profile' && (
            <section style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Profile</h2>
              <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div><dt>Email</dt><dd>{user.email}</dd></div>
                <div><dt>Phone</dt><dd>{user.phone || 'N/A'}</dd></div>
                <div><dt>Status</dt><dd>{user.status}</dd></div>
                <div><dt>Joined</dt><dd>{formatDate(user.createdAt)}</dd></div>
              </dl>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;
