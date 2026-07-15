import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../services/api';

const roleOptions = ['ALL', 'ADMIN', 'STAFF', 'VET', 'USER'];
const editableRoleOptions = ['ADMIN', 'STAFF', 'VET', 'USER'];
const statusOptions = ['ALL', 'ACTIVE', 'LOCKED'];
const editableStatusOptions = ['ACTIVE', 'LOCKED'];

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  role: 'USER',
  phone: '',
  assignedArea: 'Visitor',
  status: 'ACTIVE',
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const buildUserCode = (id) => `USR-${String(id).slice(-6).toUpperCase()}`;

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [modalMode, setModalMode] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (error) {
      return null;
    }
  })();

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminApi.getUsers();
      setUsers(response.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !search ||
        user.fullName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        buildUserCode(user._id).toLowerCase().includes(search);

      const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'ALL' || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const summary = {
    total: users.length,
    admins: users.filter((user) => user.role === 'ADMIN').length,
    operators: users.filter((user) => user.role === 'STAFF' || user.role === 'VET').length,
    locked: users.filter((user) => user.status === 'LOCKED').length,
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
    setFormData(emptyForm);
  };

  const openCreateModal = () => {
    setActionMessage('');
    setFormData(emptyForm);
    setModalMode('create');
  };

  const openViewModal = async (id) => {
    try {
      setSubmitting(true);
      const response = await adminApi.getUserById(id);
      setSelectedUser(response.data);
      setModalMode('view');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = async (id) => {
    try {
      setSubmitting(true);
      const response = await adminApi.getUserById(id);
      const user = response.data;
      setSelectedUser(user);
      setFormData({
        fullName: user.fullName,
        email: user.email,
        password: '',
        role: user.role,
        phone: user.phone || '',
        assignedArea: user.assignedArea || 'Visitor',
        status: user.status,
      });
      setModalMode('edit');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateOrUpdate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setActionMessage('');

    try {
      if (modalMode === 'create') {
        await adminApi.createUser(formData);
        setActionMessage('User created successfully.');
      }

      if (modalMode === 'edit' && selectedUser) {
        const payload = { ...formData };
        if (!payload.password) {
          delete payload.password;
        }
        await adminApi.updateUser(selectedUser._id, payload);
        setActionMessage('User updated successfully.');
      }

      await loadUsers();
      closeModal();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLock = async (user) => {
    try {
      setSubmitting(true);
      setError('');
      setActionMessage('');
      const nextStatus = user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
      const response = await adminApi.updateUserStatus(user._id, nextStatus);
      setActionMessage(response.message || 'Status updated successfully.');
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-screen">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">Account Administration</span>
          <h1>User management</h1>
          <p>
            Search, create, inspect, edit and lock user accounts with live data from
            the backend admin API.
          </p>
        </div>
        <div className="admin-hero-panel">
          <span className="admin-panel-label">Signed in as</span>
          <strong>{currentUser?.email || 'Unknown admin'}</strong>
          <p>Role: {currentUser?.role || 'N/A'}</p>
        </div>
      </section>

      <section className="admin-metrics-grid">
        <article className="admin-metric-card">
          <span className="admin-metric-label">Total users</span>
          <strong className="admin-metric-value">{summary.total}</strong>
          <span className="admin-metric-note">Stored in MongoDB</span>
        </article>
        <article className="admin-metric-card">
          <span className="admin-metric-label">Admins</span>
          <strong className="admin-metric-value">{summary.admins}</strong>
          <span className="admin-metric-note">High privilege accounts</span>
        </article>
        <article className="admin-metric-card">
          <span className="admin-metric-label">Staff & vets</span>
          <strong className="admin-metric-value">{summary.operators}</strong>
          <span className="admin-metric-note">Operational accounts</span>
        </article>
        <article className="admin-metric-card">
          <span className="admin-metric-label">Locked</span>
          <strong className="admin-metric-value">{summary.locked}</strong>
          <span className="admin-metric-note">Need admin review</span>
        </article>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-card-kicker">Filters</span>
            <h2>Find the right account fast</h2>
          </div>
          <div className="admin-inline-actions">
            <button type="button" className="admin-button admin-button-primary" onClick={openCreateModal}>
              Create user
            </button>
          </div>
        </div>

        <div className="admin-filter-grid">
          <label className="admin-field">
            <span>Search</span>
            <input
              type="text"
              placeholder="Search by name, email or user code"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>Role</span>
            <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Status</span>
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {(error || actionMessage) && (
        <section className="admin-card">
          {error && <div className="admin-inline-feedback admin-inline-feedback-error">{error}</div>}
          {actionMessage && <div className="admin-inline-feedback admin-inline-feedback-success">{actionMessage}</div>}
        </section>
      )}

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-card-kicker">User registry</span>
            <h2>{filteredUsers.length} account(s) matched</h2>
          </div>
          <button type="button" className="admin-button admin-button-secondary" onClick={loadUsers}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-empty-state">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty-state">No users matched the current filters.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Assigned area</th>
                  <th>Last active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar">{user.fullName.charAt(0)}</div>
                        <div>
                          <strong>{user.fullName}</strong>
                          <span>{user.email}</span>
                          <small>{buildUserCode(user._id)}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge-${user.role.toLowerCase()}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge-${user.status.toLowerCase()}`}>{user.status}</span>
                    </td>
                    <td>{user.assignedArea || 'Visitor'}</td>
                    <td>{formatDateTime(user.lastActiveAt)}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button type="button" className="admin-text-button" onClick={() => openViewModal(user._id)}>
                          View
                        </button>
                        <button type="button" className="admin-text-button" onClick={() => openEditModal(user._id)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-text-button"
                          onClick={() => handleToggleLock(user)}
                          disabled={submitting}
                        >
                          {user.status === 'LOCKED' ? 'Unlock' : 'Lock'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalMode && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-card-header">
              <div>
                <span className="admin-card-kicker">
                  {modalMode === 'create' ? 'Create account' : modalMode === 'edit' ? 'Edit account' : 'User details'}
                </span>
                <h2>
                  {modalMode === 'create'
                    ? 'New user'
                    : modalMode === 'edit'
                      ? selectedUser?.fullName || 'Edit user'
                      : selectedUser?.fullName || 'User details'}
                </h2>
              </div>
              <button type="button" className="admin-text-button" onClick={closeModal}>
                Close
              </button>
            </div>

            {modalMode === 'view' && selectedUser && (
              <div className="admin-details-grid">
                <div className="admin-detail-item">
                  <span>User code</span>
                  <strong>{buildUserCode(selectedUser._id)}</strong>
                </div>
                <div className="admin-detail-item">
                  <span>Email</span>
                  <strong>{selectedUser.email}</strong>
                </div>
                <div className="admin-detail-item">
                  <span>Role</span>
                  <strong>{selectedUser.role}</strong>
                </div>
                <div className="admin-detail-item">
                  <span>Status</span>
                  <strong>{selectedUser.status}</strong>
                </div>
                <div className="admin-detail-item">
                  <span>Phone</span>
                  <strong>{selectedUser.phone || 'N/A'}</strong>
                </div>
                <div className="admin-detail-item">
                  <span>Assigned area</span>
                  <strong>{selectedUser.assignedArea || 'Visitor'}</strong>
                </div>
                <div className="admin-detail-item">
                  <span>Created at</span>
                  <strong>{formatDateTime(selectedUser.createdAt)}</strong>
                </div>
                <div className="admin-detail-item">
                  <span>Last active</span>
                  <strong>{formatDateTime(selectedUser.lastActiveAt)}</strong>
                </div>
              </div>
            )}

            {(modalMode === 'create' || modalMode === 'edit') && (
              <form className="admin-form-grid" onSubmit={handleCreateOrUpdate}>
                <label className="admin-field">
                  <span>Full name</span>
                  <input name="fullName" value={formData.fullName} onChange={handleFormChange} required />
                </label>

                <label className="admin-field">
                  <span>Email</span>
                  <input name="email" type="email" value={formData.email} onChange={handleFormChange} required />
                </label>

                <label className="admin-field">
                  <span>Password {modalMode === 'edit' ? '(leave blank to keep current)' : ''}</span>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required={modalMode === 'create'}
                  />
                </label>

                <label className="admin-field">
                  <span>Phone</span>
                  <input name="phone" value={formData.phone} onChange={handleFormChange} />
                </label>

                <label className="admin-field">
                  <span>Role</span>
                  <select name="role" value={formData.role} onChange={handleFormChange}>
                    {editableRoleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-field">
                  <span>Status</span>
                  <select name="status" value={formData.status} onChange={handleFormChange}>
                    {editableStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-field admin-field-full">
                  <span>Assigned area</span>
                  <input name="assignedArea" value={formData.assignedArea} onChange={handleFormChange} />
                </label>

                <div className="admin-inline-actions">
                  <button type="submit" className="admin-button admin-button-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : modalMode === 'create' ? 'Create user' : 'Save changes'}
                  </button>
                  <button type="button" className="admin-button admin-button-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
