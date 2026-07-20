import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../services/api';

const ticketTypes = ['ADULT', 'CHILD', 'STUDENT', 'VIP', 'GROUP'];
const serviceCategories = ['FOOD', 'GUIDE', 'PHOTO', 'EVENT', 'RENTAL'];
const bookingStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'USED'];
const paymentStatuses = ['UNPAID', 'PAID', 'REFUNDED'];

const emptyTicketForm = {
  code: '',
  name: '',
  ticketType: 'ADULT',
  price: '',
  description: '',
  isActive: true,
};

const emptyServiceForm = {
  code: '',
  name: '',
  category: 'EVENT',
  price: '',
  durationMinutes: '',
  description: '',
  isActive: true,
};

const formatMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
const formatDate = (value) => new Date(value).toLocaleDateString('en-GB');
const isNonNegativeNumber = (value) => Number.isFinite(Number(value)) && Number(value) >= 0;
const isPositiveNumber = (value) => Number.isFinite(Number(value)) && Number(value) > 0;

const AdminTicketsPage = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ticketForm, setTicketForm] = useState(emptyTicketForm);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [submitting, setSubmitting] = useState(false);
  const [expandedBookingId, setExpandedBookingId] = useState('');

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (error) {
      return null;
    }
  })();

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [ticketsResponse, servicesResponse, bookingsResponse] = await Promise.all([
        adminApi.getTickets(),
        adminApi.getServices(),
        adminApi.getBookings(),
      ]);
      setTickets(ticketsResponse.data || []);
      setServices(servicesResponse.data || []);
      setBookings(bookingsResponse.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTickets = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return tickets.filter((ticket) =>
      !search ||
      ticket.name.toLowerCase().includes(search) ||
      ticket.code.toLowerCase().includes(search) ||
      ticket.ticketType.toLowerCase().includes(search)
    );
  }, [tickets, searchTerm]);

  const filteredServices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return services.filter((service) =>
      !search ||
      service.name.toLowerCase().includes(search) ||
      service.code.toLowerCase().includes(search) ||
      service.category.toLowerCase().includes(search)
    );
  }, [services, searchTerm]);

  const filteredBookings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return bookings.filter((booking) =>
      !search ||
      booking.bookingCode.toLowerCase().includes(search) ||
      booking.user?.email?.toLowerCase().includes(search) ||
      booking.user?.fullName?.toLowerCase().includes(search)
    );
  }, [bookings, searchTerm]);

  const summary = {
    tickets: tickets.length,
    services: services.length,
    bookings: bookings.length,
    revenue: bookings.filter((booking) => booking.paymentStatus === 'PAID').reduce((total, booking) => total + booking.totalAmount, 0),
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
    setTicketForm(emptyTicketForm);
    setServiceForm(emptyServiceForm);
  };

  const openTicketModal = (ticket = null) => {
    setSelectedItem(ticket);
    setTicketForm(ticket ? {
      code: ticket.code,
      name: ticket.name,
      ticketType: ticket.ticketType,
      price: ticket.price,
      description: ticket.description || '',
      isActive: ticket.isActive,
    } : emptyTicketForm);
    setModalType('ticket');
  };

  const openServiceModal = (service = null) => {
    setSelectedItem(service);
    setServiceForm(service ? {
      code: service.code,
      name: service.name,
      category: service.category,
      price: service.price,
      durationMinutes: service.durationMinutes,
      description: service.description || '',
      isActive: service.isActive,
    } : emptyServiceForm);
    setModalType('service');
  };

  const handleTicketChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTicketForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleServiceChange = (event) => {
    const { name, value, type, checked } = event.target;
    setServiceForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveTicket = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (!isNonNegativeNumber(ticketForm.price)) {
        throw new Error('Ticket price must be a number greater than or equal to 0.');
      }

      const payload = {
        ...ticketForm,
        price: Number(ticketForm.price),
      };

      const response = selectedItem
        ? await adminApi.updateTicket(selectedItem._id, payload)
        : await adminApi.createTicket(payload);

      setMessage(response.message || 'Ticket saved successfully.');
      closeModal();
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveService = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const duplicateService = services.find((service) => {
        const isSameService = selectedItem?._id === service._id;
        return !isSameService && service.name?.trim().toLowerCase() === serviceForm.name.trim().toLowerCase();
      });

      if (duplicateService) {
        throw new Error('Service name already exists.');
      }

      if (!isNonNegativeNumber(serviceForm.price || 0)) {
        throw new Error('Service price must be a number greater than or equal to 0.');
      }

      if (!isPositiveNumber(serviceForm.durationMinutes)) {
        throw new Error('Service duration must be greater than 0 minutes.');
      }

      const payload = {
        ...serviceForm,
        price: Number(serviceForm.price || 0),
        durationMinutes: Number(serviceForm.durationMinutes || 0),
      };

      const response = selectedItem
        ? await adminApi.updateService(selectedItem._id, payload)
        : await adminApi.createService(payload);

      setMessage(response.message || 'Service saved successfully.');
      closeModal();
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTicket = async (ticket) => {
    const shouldDelete = window.confirm(`Delete ticket "${ticket.name}"?`);
    if (!shouldDelete) return;

    try {
      setSubmitting(true);
      const response = await adminApi.deleteTicket(ticket._id);
      setMessage(response.message || 'Ticket deleted successfully.');
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (service) => {
    const shouldDelete = window.confirm(`Delete service "${service.name}"?`);
    if (!shouldDelete) return;

    try {
      setSubmitting(true);
      const response = await adminApi.deleteService(service._id);
      setMessage(response.message || 'Service deleted successfully.');
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookingUpdate = async (booking, field, value) => {
    try {
      if (field === 'status' && booking.status === 'CANCELLED' && value === 'USED') {
        throw new Error('Cancelled bookings cannot be marked as used directly.');
      }

      setSubmitting(true);
      setError('');
      const response = await adminApi.updateBookingStatus(booking._id, {
        status: field === 'status' ? value : booking.status,
        paymentStatus: field === 'paymentStatus' ? value : booking.paymentStatus,
        action: 'STATUS_UPDATE',
        note: `Manual ${field} update from admin screen.`,
        changedBy: currentUser?.id,
      });
      setMessage(response.message || 'Booking updated successfully.');
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookingAction = async (booking, action) => {
    const actionLabels = {
      CONFIRM_PAYMENT: 'confirm payment',
      CANCEL_REFUND: 'cancel and refund',
      MARK_USED: 'mark as used',
    };
    const shouldProceed = window.confirm(`Do you want to ${actionLabels[action]} for booking "${booking.bookingCode}"?`);
    if (!shouldProceed) return;

    try {
      setSubmitting(true);
      setError('');
      setMessage('');
      const response = await adminApi.updateBookingStatus(booking._id, {
        action,
        note: actionLabels[action],
        changedBy: currentUser?.id,
      });
      setMessage(response.message || 'Booking updated successfully.');
      setExpandedBookingId(booking._id);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getHistoryText = (entry) => {
    const statusPart = `${entry.fromStatus || 'N/A'} -> ${entry.toStatus}`;
    const paymentPart = `${entry.fromPaymentStatus || 'N/A'} -> ${entry.toPaymentStatus}`;
    return `${entry.action}: ${statusPart}, ${paymentPart}`;
  };

  return (
    <div className="admin-screen">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">Commercial Operations</span>
          <h1>Tickets and bookings</h1>
          <p>Manage admission products, paid services and booking status from one operational screen.</p>
        </div>
        <div className="admin-hero-panel">
          <span className="admin-panel-label">Paid revenue</span>
          <strong>{formatMoney(summary.revenue)}</strong>
          <p>{summary.bookings} booking(s) currently recorded.</p>
        </div>
      </section>

      <section className="admin-metrics-grid">
        <article className="admin-metric-card"><span className="admin-metric-label">Tickets</span><strong className="admin-metric-value">{summary.tickets}</strong><span className="admin-metric-note">Admission products</span></article>
        <article className="admin-metric-card"><span className="admin-metric-label">Services</span><strong className="admin-metric-value">{summary.services}</strong><span className="admin-metric-note">Paid experiences</span></article>
        <article className="admin-metric-card"><span className="admin-metric-label">Bookings</span><strong className="admin-metric-value">{summary.bookings}</strong><span className="admin-metric-note">Visitor orders</span></article>
        <article className="admin-metric-card"><span className="admin-metric-label">Revenue</span><strong className="admin-metric-value admin-metric-money">{formatMoney(summary.revenue)}</strong><span className="admin-metric-note">Paid bookings</span></article>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-card-kicker">Controls</span>
            <h2>Commercial registry</h2>
          </div>
          <div className="admin-inline-actions">
            <button type="button" className={`admin-button ${activeTab === 'tickets' ? 'admin-button-primary' : 'admin-button-secondary'}`} onClick={() => setActiveTab('tickets')}>Tickets</button>
            <button type="button" className={`admin-button ${activeTab === 'services' ? 'admin-button-primary' : 'admin-button-secondary'}`} onClick={() => setActiveTab('services')}>Services</button>
            <button type="button" className={`admin-button ${activeTab === 'bookings' ? 'admin-button-primary' : 'admin-button-secondary'}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
          </div>
        </div>

        <div className="admin-filter-grid">
          <label className="admin-field">
            <span>Search</span>
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search code, name, type, customer or booking" />
          </label>
          <div className="admin-inline-actions admin-align-end">
            {activeTab === 'tickets' && <button type="button" className="admin-button admin-button-primary" onClick={() => openTicketModal()}>Create ticket</button>}
            {activeTab === 'services' && <button type="button" className="admin-button admin-button-primary" onClick={() => openServiceModal()}>Create service</button>}
            <button type="button" className="admin-button admin-button-secondary" onClick={loadData}>Refresh</button>
          </div>
        </div>
      </section>

      {(error || message) && (
        <section className="admin-card">
          {error && <div className="admin-inline-feedback admin-inline-feedback-error">{error}</div>}
          {message && <div className="admin-inline-feedback admin-inline-feedback-success">{message}</div>}
        </section>
      )}

      <section className="admin-card">
        {loading ? (
          <div className="admin-empty-state">Loading commercial data...</div>
        ) : activeTab === 'tickets' ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Ticket</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td><strong>{ticket.name}</strong><span className="admin-table-subtext">{ticket.code}</span></td>
                    <td>{ticket.ticketType}</td>
                    <td>{formatMoney(ticket.price)}</td>
                    <td><span className={`admin-badge admin-badge-${ticket.isActive ? 'active' : 'locked'}`}>{ticket.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
                    <td><div className="admin-table-actions"><button className="admin-text-button" onClick={() => openTicketModal(ticket)}>Edit</button><button className="admin-text-button admin-text-button-danger" onClick={() => handleDeleteTicket(ticket)} disabled={submitting}>Delete</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'services' ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Service</th><th>Category</th><th>Price</th><th>Duration</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service._id}>
                    <td><strong>{service.name}</strong><span className="admin-table-subtext">{service.code}</span></td>
                    <td>{service.category}</td>
                    <td>{formatMoney(service.price)}</td>
                    <td>{service.durationMinutes} min</td>
                    <td><span className={`admin-badge admin-badge-${service.isActive ? 'active' : 'locked'}`}>{service.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
                    <td><div className="admin-table-actions"><button className="admin-text-button" onClick={() => openServiceModal(service)}>Edit</button><button className="admin-text-button admin-text-button-danger" onClick={() => handleDeleteService(service)} disabled={submitting}>Delete</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Booking</th><th>Customer</th><th>Visit</th><th>Total</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <React.Fragment key={booking._id}>
                    <tr>
                      <td>
                        <strong>{booking.bookingCode}</strong>
                        <span className="admin-table-subtext">{booking.items.length} item(s)</span>
                        {booking.statusHistory?.length > 0 && (
                          <span className="admin-table-subtext">Last: {booking.statusHistory[booking.statusHistory.length - 1].action}</span>
                        )}
                      </td>
                      <td>{booking.user?.fullName || booking.user?.email || 'Unknown'}</td>
                      <td>{formatDate(booking.visitDate)}</td>
                      <td>{formatMoney(booking.totalAmount)}</td>
                      <td><select className="admin-inline-select" value={booking.status} onChange={(event) => handleBookingUpdate(booking, 'status', event.target.value)} disabled={submitting}>{bookingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                      <td><select className="admin-inline-select" value={booking.paymentStatus} onChange={(event) => handleBookingUpdate(booking, 'paymentStatus', event.target.value)} disabled={submitting}>{paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                      <td>
                        <div className="admin-table-actions">
                          <button type="button" className="admin-text-button" onClick={() => handleBookingAction(booking, 'CONFIRM_PAYMENT')} disabled={submitting || booking.status === 'CANCELLED' || booking.status === 'USED'}>Confirm payment</button>
                          <button type="button" className="admin-text-button" onClick={() => handleBookingAction(booking, 'MARK_USED')} disabled={submitting || booking.status === 'CANCELLED' || booking.status === 'USED' || booking.paymentStatus !== 'PAID'}>Mark used</button>
                          <button type="button" className="admin-text-button admin-text-button-danger" onClick={() => handleBookingAction(booking, 'CANCEL_REFUND')} disabled={submitting || booking.status === 'USED' || booking.status === 'CANCELLED'}>Cancel/refund</button>
                          <button type="button" className="admin-text-button" onClick={() => setExpandedBookingId(expandedBookingId === booking._id ? '' : booking._id)}>{expandedBookingId === booking._id ? 'Hide history' : 'History'}</button>
                        </div>
                      </td>
                    </tr>
                    {expandedBookingId === booking._id && (
                      <tr>
                        <td colSpan="7">
                          <div className="admin-details-grid">
                            <div className="admin-detail-item">
                              <span>Booking items</span>
                              <strong>{booking.items.map((item) => `${item.ticket?.name || 'Ticket'} x${item.quantity}`).join(', ') || 'No items'}</strong>
                            </div>
                            <div className="admin-detail-item">
                              <span>Current state</span>
                              <strong>{booking.status} / {booking.paymentStatus}</strong>
                            </div>
                          </div>
                          <div className="admin-timeline" style={{ marginTop: '14px' }}>
                            {(booking.statusHistory || []).length === 0 ? (
                              <div className="admin-empty-state">No status history yet.</div>
                            ) : booking.statusHistory.slice().reverse().map((entry, index) => (
                              <div className="admin-timeline-item" key={`${entry.changedAt}-${index}`}>
                                <span className="admin-timeline-dot" />
                                <div>
                                  <strong>{getHistoryText(entry)}</strong>
                                  <span>{formatDate(entry.changedAt)} by {entry.changedBy?.fullName || 'Admin'}</span>
                                  {entry.note && <span className="admin-table-subtext">{entry.note}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalType === 'ticket' && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-card-header"><div><span className="admin-card-kicker">Ticket product</span><h2>{selectedItem ? 'Edit ticket' : 'Create ticket'}</h2></div><button className="admin-text-button" onClick={closeModal}>Close</button></div>
            <form className="admin-form-grid" onSubmit={handleSaveTicket}>
              <label className="admin-field"><span>Code</span><input name="code" value={ticketForm.code} onChange={handleTicketChange} required /></label>
              <label className="admin-field"><span>Name</span><input name="name" value={ticketForm.name} onChange={handleTicketChange} required /></label>
              <label className="admin-field"><span>Type</span><select name="ticketType" value={ticketForm.ticketType} onChange={handleTicketChange}>{ticketTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
              <label className="admin-field"><span>Price</span><input name="price" type="number" min="0" step="0.01" value={ticketForm.price} onChange={handleTicketChange} required /></label>
              <label className="admin-field admin-field-full"><span>Description</span><textarea name="description" rows="3" value={ticketForm.description} onChange={handleTicketChange} /></label>
              <label className="admin-checkbox"><input name="isActive" type="checkbox" checked={ticketForm.isActive} onChange={handleTicketChange} /> Active</label>
              <div className="admin-inline-actions"><button className="admin-button admin-button-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save ticket'}</button><button type="button" className="admin-button admin-button-secondary" onClick={closeModal}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {modalType === 'service' && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-card-header"><div><span className="admin-card-kicker">Zoo service</span><h2>{selectedItem ? 'Edit service' : 'Create service'}</h2></div><button className="admin-text-button" onClick={closeModal}>Close</button></div>
            <form className="admin-form-grid" onSubmit={handleSaveService}>
              <label className="admin-field"><span>Code</span><input name="code" value={serviceForm.code} onChange={handleServiceChange} required /></label>
              <label className="admin-field"><span>Name</span><input name="name" value={serviceForm.name} onChange={handleServiceChange} required /></label>
              <label className="admin-field"><span>Category</span><select name="category" value={serviceForm.category} onChange={handleServiceChange}>{serviceCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
              <label className="admin-field"><span>Price</span><input name="price" type="number" min="0" step="0.01" value={serviceForm.price} onChange={handleServiceChange} /></label>
              <label className="admin-field"><span>Duration minutes</span><input name="durationMinutes" type="number" min="1" value={serviceForm.durationMinutes} onChange={handleServiceChange} required /></label>
              <label className="admin-field admin-field-full"><span>Description</span><textarea name="description" rows="3" value={serviceForm.description} onChange={handleServiceChange} /></label>
              <label className="admin-checkbox"><input name="isActive" type="checkbox" checked={serviceForm.isActive} onChange={handleServiceChange} /> Active</label>
              <div className="admin-inline-actions"><button className="admin-button admin-button-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save service'}</button><button type="button" className="admin-button admin-button-secondary" onClick={closeModal}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketsPage;
