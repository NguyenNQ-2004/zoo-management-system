import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../services/api';

const taskTypes = ['CARE', 'CLEANING', 'MEDICAL_SUPPORT', 'MAINTENANCE'];
const priorities = ['LOW', 'MEDIUM', 'HIGH'];
const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];
const filterStatuses = ['ALL', ...statuses];
const assignableRoles = ['STAFF', 'VET'];

const emptyTaskForm = {
  title: '',
  description: '',
  taskType: 'CARE',
  priority: 'MEDIUM',
  assignedTo: '',
  area: '',
  animal: '',
  dueDate: '',
  status: 'TODO',
};

const toDateTimeInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const isPastDateTime = (value) => {
  if (!value) return false;
  const selectedDate = new Date(value);
  if (Number.isNaN(selectedDate.getTime())) return true;

  const currentMinute = new Date();
  currentMinute.setSeconds(0, 0);
  return selectedDate < currentMinute;
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

const AdminAssignmentsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [modalMode, setModalMode] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState(emptyTaskForm);
  const [submitting, setSubmitting] = useState(false);

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
      const [tasksResponse, staffResponse, areasResponse, animalsResponse, usersResponse] = await Promise.all([
        adminApi.getTasks(),
        adminApi.getStaff(),
        adminApi.getAreas(),
        adminApi.getAnimals(),
        adminApi.getUsers(),
      ]);

      setTasks(tasksResponse.data || []);
      setStaff(staffResponse.data || []);
      setAreas(areasResponse.data || []);
      setAnimals(animalsResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const adminUser = useMemo(() => {
    return users.find((user) => user.email === currentUser?.email) || users.find((user) => user.role === 'ADMIN');
  }, [users, currentUser?.email]);

  const filteredTasks = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title?.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search) ||
        task.assignedTo?.fullName?.toLowerCase().includes(search) ||
        task.area?.name?.toLowerCase().includes(search) ||
        task.animal?.name?.toLowerCase().includes(search);
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesAssignee = assigneeFilter === 'ALL' || task.assignedTo?._id === assigneeFilter;

      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [tasks, searchTerm, statusFilter, assigneeFilter]);

  const summary = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'TODO').length,
    inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    done: tasks.filter((task) => task.status === 'DONE').length,
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTask(null);
    setFormData(emptyTaskForm);
  };

  const openCreateModal = () => {
    setMessage('');
    setSelectedTask(null);
    setFormData({
      ...emptyTaskForm,
      assignedTo: staff[0]?._id || '',
      area: areas[0]?._id || '',
      animal: '',
    });
    setModalMode('create');
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      taskType: task.taskType,
      priority: task.priority,
      assignedTo: task.assignedTo?._id || '',
      area: task.area?._id || '',
      animal: task.animal?._id || '',
      dueDate: toDateTimeInput(task.dueDate),
      status: task.status,
    });
    setModalMode('edit');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const buildTaskPayload = () => ({
    ...formData,
    assignedBy: adminUser?._id,
    area: formData.area || null,
    animal: formData.animal || null,
    dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
  });

  const handleSubmitTask = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (modalMode === 'create' && isPastDateTime(formData.dueDate)) {
        throw new Error('Due date cannot be in the past. Please choose the current time or a future time.');
      }

      if (!adminUser?._id) {
        throw new Error('Admin user was not found in the database. Run seed again or refresh users.');
      }

      const assignee = staff.find((member) => member._id === formData.assignedTo);
      if (!assignee || !assignableRoles.includes(assignee.role)) {
        throw new Error('Task assignee must be STAFF or VET.');
      }

      const payload = buildTaskPayload();

      if (modalMode === 'create') {
        const response = await adminApi.createTask(payload);
        setMessage(response.message || 'Task created successfully.');
      }

      if (modalMode === 'edit' && selectedTask) {
        const response = await adminApi.updateTask(selectedTask._id, payload);
        setMessage(response.message || 'Task updated successfully.');
      }

      closeModal();
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (task) => {
    const shouldDelete = window.confirm(`Delete task "${task.title}"?`);
    if (!shouldDelete) return;

    try {
      setSubmitting(true);
      setError('');
      const response = await adminApi.deleteTask(task._id);
      setMessage(response.message || 'Task deleted successfully.');
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickStatus = async (task, status) => {
    try {
      setSubmitting(true);
      setError('');
      const response = await adminApi.updateTask(task._id, {
        title: task.title,
        description: task.description,
        taskType: task.taskType,
        priority: task.priority,
        assignedTo: task.assignedTo?._id,
        assignedBy: task.assignedBy?._id || adminUser?._id,
        area: task.area?._id || null,
        animal: task.animal?._id || null,
        dueDate: task.dueDate,
        status,
      });
      setMessage(response.message || 'Task status updated.');
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
          <span className="admin-kicker">Task Assignment</span>
          <h1>Operational assignments</h1>
          <p>Create, edit, track and close staff tasks for daily care, cleaning, support and maintenance work.</p>
        </div>
        <div className="admin-hero-panel">
          <span className="admin-panel-label">Assignment owner</span>
          <strong>{adminUser?.fullName || currentUser?.email || 'Admin'}</strong>
          <p>{summary.todo + summary.inProgress} open task(s) need coordination.</p>
        </div>
      </section>

      <section className="admin-metrics-grid">
        <article className="admin-metric-card"><span className="admin-metric-label">Total tasks</span><strong className="admin-metric-value">{summary.total}</strong><span className="admin-metric-note">All assignments</span></article>
        <article className="admin-metric-card"><span className="admin-metric-label">TODO</span><strong className="admin-metric-value">{summary.todo}</strong><span className="admin-metric-note">Waiting to start</span></article>
        <article className="admin-metric-card"><span className="admin-metric-label">In progress</span><strong className="admin-metric-value">{summary.inProgress}</strong><span className="admin-metric-note">Being handled</span></article>
        <article className="admin-metric-card"><span className="admin-metric-label">Done</span><strong className="admin-metric-value">{summary.done}</strong><span className="admin-metric-note">Completed</span></article>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-card-kicker">Filters</span>
            <h2>Task board controls</h2>
          </div>
          <div className="admin-inline-actions">
            <button type="button" className="admin-button admin-button-primary" onClick={openCreateModal}>Create task</button>
            <button type="button" className="admin-button admin-button-secondary" onClick={loadData}>Refresh</button>
          </div>
        </div>

        <div className="admin-filter-grid">
          <label className="admin-field">
            <span>Search</span>
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search title, staff, area or animal" />
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {filterStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className="admin-field">
            <span>Assignee</span>
            <select value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)}>
              <option value="ALL">ALL</option>
              {staff.map((member) => <option key={member._id} value={member._id}>{member.fullName}</option>)}
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
            <span className="admin-card-kicker">Assignment registry</span>
            <h2>{filteredTasks.length} task(s) matched</h2>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="admin-empty-state">No tasks matched the current filters.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Scope</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <strong>{task.title}</strong>
                      <span className="admin-table-subtext">{task.taskType} | {task.priority}</span>
                    </td>
                    <td>{task.assignedTo?.fullName || 'Unassigned'}</td>
                    <td>
                      <div className="admin-mini-stats">
                        <span>{task.area?.name || 'No area'}</span>
                        <span>{task.animal?.name || 'No animal'}</span>
                      </div>
                    </td>
                    <td>{formatDateTime(task.dueDate)}</td>
                    <td><span className={`admin-badge admin-badge-${task.status?.toLowerCase() || 'todo'}`}>{task.status}</span></td>
                    <td>
                      <div className="admin-table-actions">
                        <button type="button" className="admin-text-button" onClick={() => openEditModal(task)}>Edit</button>
                        {task.status !== 'DONE' && (
                          <button type="button" className="admin-text-button" onClick={() => handleQuickStatus(task, 'DONE')} disabled={submitting}>Done</button>
                        )}
                        {task.status === 'TODO' && (
                          <button type="button" className="admin-text-button" onClick={() => handleQuickStatus(task, 'IN_PROGRESS')} disabled={submitting}>Start</button>
                        )}
                        <button type="button" className="admin-text-button admin-text-button-danger" onClick={() => handleDeleteTask(task)} disabled={submitting}>Delete</button>
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
                <span className="admin-card-kicker">{modalMode === 'create' ? 'Create assignment' : 'Edit assignment'}</span>
                <h2>{modalMode === 'create' ? 'New task' : selectedTask?.title}</h2>
              </div>
              <button type="button" className="admin-text-button" onClick={closeModal}>Close</button>
            </div>

            <form className="admin-form-grid" onSubmit={handleSubmitTask}>
              <label className="admin-field admin-field-full">
                <span>Title</span>
                <input name="title" value={formData.title} onChange={handleFormChange} required />
              </label>
              <label className="admin-field admin-field-full">
                <span>Description</span>
                <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" />
              </label>
              <label className="admin-field">
                <span>Task type</span>
                <select name="taskType" value={formData.taskType} onChange={handleFormChange}>
                  {taskTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="admin-field">
                <span>Priority</span>
                <select name="priority" value={formData.priority} onChange={handleFormChange}>
                  {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                </select>
              </label>
              <label className="admin-field">
                <span>Assignee</span>
                <select name="assignedTo" value={formData.assignedTo} onChange={handleFormChange} required>
                  <option value="">Select staff</option>
                  {staff.map((member) => <option key={member._id} value={member._id}>{member.fullName}</option>)}
                </select>
              </label>
              <label className="admin-field">
                <span>Status</span>
                <select name="status" value={formData.status} onChange={handleFormChange}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label className="admin-field">
                <span>Area</span>
                <select name="area" value={formData.area} onChange={handleFormChange}>
                  <option value="">No area</option>
                  {areas.map((area) => <option key={area._id} value={area._id}>{area.name}</option>)}
                </select>
              </label>
              <label className="admin-field">
                <span>Animal</span>
                <select name="animal" value={formData.animal} onChange={handleFormChange}>
                  <option value="">No animal</option>
                  {animals.map((animal) => <option key={animal._id} value={animal._id}>{animal.name} ({animal.species})</option>)}
                </select>
              </label>
              <label className="admin-field admin-field-full">
                <span>Due date</span>
                <input name="dueDate" type="datetime-local" min={modalMode === 'create' ? toDateTimeInput(new Date()) : undefined} value={formData.dueDate} onChange={handleFormChange} required />
              </label>
              <div className="admin-inline-actions">
                <button type="submit" className="admin-button admin-button-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : modalMode === 'create' ? 'Create task' : 'Save changes'}
                </button>
                <button type="button" className="admin-button admin-button-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssignmentsPage;
