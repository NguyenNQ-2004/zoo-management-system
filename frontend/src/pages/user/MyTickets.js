import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './MyTickets.css';

const MyTickets = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('zoo_tickets') || 'null');
    if (loaded) {
      setTickets(loaded);
    } else {
      const defaults = [
        { id: 'ZLX-8892-A', status: 'Valid', ticketType: 'VIP Safari Tour', visitDate: 'Oct 24, 2024', bookingDate: 'Oct 10, 2024', visitors: '2 Adults, 1 Child', total: '$225.00', adults: 2, children: 1 },
        { id: 'ZLX-9102-B', status: 'Used', ticketType: 'General Admission', visitDate: 'Oct 05, 2024', bookingDate: 'Sep 20, 2024', visitors: '2 Adults', total: '$60.00', adults: 2, children: 0 }
      ];
      setTickets(defaults);
      localStorage.setItem('zoo_tickets', JSON.stringify(defaults));
    }
  }, []);

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this ticket?')) {
      const updated = tickets.map(t => t.id === id ? { ...t, status: 'Cancelled' } : t);
      setTickets(updated);
      localStorage.setItem('zoo_tickets', JSON.stringify(updated));
    }
  };

  const displayTickets = tickets.filter(t => {
    let matchesTab = false;
    if (activeTab === 'Active') matchesTab = t.status === 'Valid';
    else if (activeTab === 'Used') matchesTab = t.status === 'Used';
    else if (activeTab === 'Cancelled') matchesTab = t.status === 'Cancelled';
    
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.visitDate.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ padding: '60px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#1B5E3C', margin: '0 0 10px 0' }}>My Tickets</h1>
          <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>Manage your upcoming and past zoo visits.</p>
        </div>
        <div className="ticket-search">
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search by Ticket ID or Date" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="ticket-tabs">
        <button className={activeTab === 'Active' ? 'active' : ''} onClick={() => setActiveTab('Active')}>Active ({tickets.filter(t => t.status === 'Valid').length})</button>
        <button className={activeTab === 'Used' ? 'active' : ''} onClick={() => setActiveTab('Used')}>Used ({tickets.filter(t => t.status === 'Used').length})</button>
        <button className={activeTab === 'Cancelled' ? 'active' : ''} onClick={() => setActiveTab('Cancelled')}>Cancelled ({tickets.filter(t => t.status === 'Cancelled').length})</button>
      </div>

      <div className="tickets-grid">
        {displayTickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-header">
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>Ticket ID</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>#{ticket.id}</div>
              </div>
              <div className={`ticket-badge ${ticket.status === 'Valid' ? 'valid' : ''}`} style={{ background: ticket.status === 'Cancelled' ? '#fee2e2' : ticket.status === 'Used' ? '#f3f4f6' : '#dcfce7', color: ticket.status === 'Cancelled' ? '#991b1b' : ticket.status === 'Used' ? '#4b5563' : '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {ticket.status === 'Valid' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                {ticket.status}
              </div>
            </div>

            <div className="ticket-details">
              <div className="detail-col">
                <div className="detail-label">Visit Date</div>
                <div className="detail-value">{ticket.visitDate}</div>
              </div>
              <div className="detail-col">
                <div className="detail-label">Ticket Type</div>
                <div className="detail-value" style={{ color: ticket.ticketType === 'VIP Safari Tour' ? '#9333ea' : ticket.ticketType === 'Animal Feeding Experience' ? '#d97706' : '#111', fontWeight: ticket.ticketType && ticket.ticketType !== 'General Admission' ? 700 : 500 }}>{ticket.ticketType || 'General Admission'}</div>
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
              <button className="btn-view" onClick={() => navigate(`/user/tickets/${ticket.id}`)}>View Detail</button>
              {ticket.status === 'Valid' && <button className="btn-cancel" onClick={() => handleCancel(ticket.id)}>Cancel Ticket</button>}
            </div>
          </div>
        ))}

        {displayTickets.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#6b7280', fontSize: '16px', background: '#f9fafb', borderRadius: '16px', border: '1px dashed #d1d5db' }}>
            No {activeTab.toLowerCase()} tickets found matching your search.
          </div>
        )}

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
