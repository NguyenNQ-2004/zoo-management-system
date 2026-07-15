import React, { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MyTickets.css';

const MyTickets = () => {
  const [activeTab, setActiveTab] = useState('Active');

  const tickets = [
    {
      id: '#ZLX-8892-A',
      status: 'Valid',
      visitDate: 'Oct 24, 2024',
      bookingDate: 'Oct 10, 2024',
      visitors: '2 Adults, 1 Child',
      total: '$85.00'
    },
    {
      id: '#ZLX-9102-B',
      status: 'Valid',
      visitDate: 'Nov 05, 2024',
      bookingDate: 'Oct 12, 2024',
      visitors: '2 Adults',
      total: '$60.00'
    }
  ];

  return (
    <div style={{ padding: '60px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#1B5E3C', margin: '0 0 10px 0' }}>My Tickets</h1>
          <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>Manage your upcoming and past zoo visits.</p>
        </div>
        <div className="ticket-search">
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search by Ticket ID or Date" />
        </div>
      </div>

      <div className="ticket-tabs">
        <button className={activeTab === 'Active' ? 'active' : ''} onClick={() => setActiveTab('Active')}>Active</button>
        <button className={activeTab === 'Used' ? 'active' : ''} onClick={() => setActiveTab('Used')}>Used</button>
        <button className={activeTab === 'Cancelled' ? 'active' : ''} onClick={() => setActiveTab('Cancelled')}>Cancelled</button>
      </div>

      <div className="tickets-grid">
        {tickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-header">
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>Ticket ID</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>{ticket.id}</div>
              </div>
              <div className="ticket-badge valid">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {ticket.status}
              </div>
            </div>

            <div className="ticket-details">
              <div className="detail-col">
                <div className="detail-label">Visit Date</div>
                <div className="detail-value">{ticket.visitDate}</div>
              </div>
              <div className="detail-col">
                <div className="detail-label">Booking Date</div>
                <div className="detail-value">{ticket.bookingDate}</div>
              </div>
              <div className="detail-col">
                <div className="detail-label">Visitors</div>
                <div className="detail-value">{ticket.visitors}</div>
              </div>
              <div className="detail-col">
                <div className="detail-label">Total Amount</div>
                <div className="detail-value">{ticket.total}</div>
              </div>
            </div>

            <div className="ticket-barcode">
              {[...Array(24)].map((_, i) => (
                <div key={i} style={{ width: `${Math.max(2, Math.random() * 8)}px`, background: '#9ca3af', height: '100%' }}></div>
              ))}
            </div>

            <div className="ticket-actions">
              <button className="btn-view">View Detail</button>
              <button className="btn-cancel">Cancel Ticket</button>
            </div>
          </div>
        ))}

        <div className="book-another-card">
          <div className="book-icon">
            <ShoppingCart size={24} color="#111" />
          </div>
          <h3>Book Another Visit</h3>
          <p>Explore new exhibits or book a guided tour for your next adventure.</p>
          <Link to="/user/book" className="btn-outline-dark">Explore Tickets</Link>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
