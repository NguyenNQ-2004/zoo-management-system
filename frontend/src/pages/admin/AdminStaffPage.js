import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../services/api';

const roleOptions = ['ALL', 'STAFF', 'VET'];
const statusOptions = ['ALL', 'ACTIVE', 'LOCKED'];

const AdminStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [assigningStaff, setAssigningStaff] = useState(null);
  const [areaId, setAreaId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [staffResponse, areaResponse] = await Promise.all([
        adminApi.getStaff(),
        adminApi.getAreas(),
      ]);
      setStaff(staffResponse.data || []);
      setAreas(areaResponse.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStaff = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return staff.filter((member) => {
      const matchesSearch =
        !search ||
        member.fullName.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.assignedArea.toLowerCase().includes(search);
      const matchesRole = selectedRole === 'ALL' || member.role === selectedRole;
      const matchesStatus = selectedStatus === 'ALL' || member.status === selectedStatus;
      const matchesArea = selectedArea === 'ALL' || member.assignedArea === selectedArea;

      return matchesSearch && matchesRole && matchesStatus && matchesArea;
    });
  }, [staff, searchTerm, selectedRole, selectedStatus, selectedArea]);

  const summary = {
    total: staff.length,
    staff: staff.filter((member) => member.role === 'STAFF').length,
    vets: staff.filter((member) => member.role === 'VET').length,
    openTasks: staff.reduce(
      (total, member) => total + member.taskStats.todo + member.taskStats.inProgress,
      0
    ),
  };

  const openAssignModal = (member) => {
    const currentArea = areas.find((area) => area.name === member.assignedArea);
    setAssigningStaff(member);
    setAreaId(currentArea?._id || areas[0]?._id || '');
    setMessage('');
  };

  const closeAssignModal = () => {
    setAssigningStaff(null);
    setAreaId('');
  };

  const handleAssignArea = async (event) => {
    event.preventDefault();
    if (!assigningStaff || !areaId) return;

    try {
      setSubmitting(true);
      setError('');
      const response = await adminApi.assignStaffArea(assigningStaff._id, areaId);
      setMessage(response.message || 'Staff area updated successfully.');
      closeAssignModal();
      await loadData();
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
          <span className="admin-kicker">Workforce Operations</span>
          <h1>Staff management</h1>
          <p>Manage staff and veterinary accounts, area assignment, workload and active task balance.</p>
        </div>
        <div className="admin-hero-panel">
          <span className="admin-panel-label">Coverage</span>
          <strong>{areas.length} active operating area(s)</strong>
          <p>{summary.openTasks} open task(s) currently assigned to staff and vets.</p>
        </div>
      </section>

      <section className="admin-metrics-grid">
        <article className="admin-metric-card">
          <span className="admin-metric-label">Total workforce</span>
          <strong className="admin-metric-value">{summary.total}</strong>
          <span className="admin-metric-note">Staff and vets</span>
        </article>
        <article className="admin-metric-card">
          <span className="admin-metric-label">Staff</span>
          <strong className="admin-metric-value">{summary.staff}</strong>
          <span className="admin-metric-note">Daily operations</span>
        </article>
        <article className="admin-metric-card">
          <span className="admin-metric-label">Vets</span>
          <strong className="admin-metric-value">{summary.vets}</strong>
          <span className="admin-metric-note">Medical operations</span>
        </article>
        <article className="admin-metric-card">
          <span className="admin-metric-label">Open tasks</span>
          <strong className="admin-metric-value">{summary.openTasks}</strong>
          <span className="admin-metric-note">TODO and in progress</span>
        </article>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-card-kicker">Filters</span>
            <h2>Find team members</h2>
          </div>
          <button type="button" className="admin-button admin-button-secondary" onClick={loadData}>
            Refresh
          </button>
        </div>

        <div className="admin-filter-grid admin-filter-grid-four">
          <label className="admin-field">
            <span>Search</span>
            <input
              type="text"
              placeholder="Search name, email or area"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Role</span>
            <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Area</span>
            <select value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)}>
              <option value="ALL">ALL</option>
              {areas.map((area) => (
                <option key={area._id} value={area.name}>{area.name}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {(error || message) && (
        <section className="admin-card">
          {error && <div className="admin-inline-feedback admin-inline-feedback-error">{error}</div>}
          {message && <div className="admin-inline-feedback admin-inline-feedback-success">{message}</div>}
        </section>
      )}

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-card-kicker">Workforce registry</span>
            <h2>{filteredStaff.length} member(s) matched</h2>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">Loading staff...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="admin-empty-state">No staff matched the current filters.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Area</th>
                  <th>Tasks</th>
                  <th>Animals</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar">{member.fullName.charAt(0)}</div>
                        <div>
                          <strong>{member.fullName}</strong>
                          <span>{member.email}</span>
                          <small>{member.phone || 'No phone'}</small>
                        </div>
                      </div>
                    </td>
                    <td><span className={`admin-badge admin-badge-${member.role.toLowerCase()}`}>{member.role}</span></td>
                    <td>{member.assignedArea || 'Unassigned'}</td>
                    <td>
                      <div className="admin-mini-stats">
                        <span>{member.taskStats.todo} TODO</span>
                        <span>{member.taskStats.inProgress} active</span>
                        <span>{member.taskStats.done} done</span>
                      </div>
                    </td>
                    <td>{member.animalCount}</td>
                    <td>
                      <button type="button" className="admin-text-button" onClick={() => openAssignModal(member)}>
                        Assign area
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {assigningStaff && (
        <div className="admin-modal-backdrop" onClick={closeAssignModal}>
          <div className="admin-modal admin-modal-small" onClick={(event) => event.stopPropagation()}>
            <div className="admin-card-header">
              <div>
                <span className="admin-card-kicker">Area assignment</span>
                <h2>{assigningStaff.fullName}</h2>
              </div>
              <button type="button" className="admin-text-button" onClick={closeAssignModal}>Close</button>
            </div>

            <form className="admin-form-grid" onSubmit={handleAssignArea}>
              <label className="admin-field admin-field-full">
                <span>Area</span>
                <select value={areaId} onChange={(event) => setAreaId(event.target.value)} required>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name} ({area.code})
                    </option>
                  ))}
                </select>
              </label>
              <div className="admin-inline-actions">
                <button type="submit" className="admin-button admin-button-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Assign area'}
                </button>
                <button type="button" className="admin-button admin-button-secondary" onClick={closeAssignModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffPage;
