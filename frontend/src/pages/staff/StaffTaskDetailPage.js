import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './StaffTaskDetailPage.css';

const statusSteps = ['TODO', 'IN_PROGRESS', 'DONE'];

const statusLabels = {
  TODO: 'Pending',
  IN_PROGRESS: 'In Progress',
  DONE: 'Completed',
};

const formatDateTime = (value) => {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const StaffTaskDetailPage = () => {
  const { taskId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const loadTask = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getStaffTask(taskId);
      setDetail(data);
    } catch (err) {
      setError(err.message || 'Failed to load task detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true);
      setError('');
      await api.updateStaffTaskStatus(taskId, status);
      await loadTask();
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    } finally {
      setUpdating(false);
    }
  };

  const task = detail?.task;
  const activeIndex = Math.max(0, statusSteps.indexOf(task?.rawStatus));

  return (
    <div className="task-detail-page">
      <header className="task-detail-header">
        <div>
          <nav><Link to="/staff/tasks">My Tasks</Link> / Task Detail</nav>
          <h1>{task?.title || 'Task Detail'}</h1>
          <p>{task?.location || 'Assigned task information'}</p>
        </div>
        {task && (
          <div className="task-detail-actions">
            <button type="button" disabled={updating || task.rawStatus === 'IN_PROGRESS'} onClick={() => handleStatusUpdate('IN_PROGRESS')}>
              Start Task
            </button>
            <button type="button" disabled={updating || task.rawStatus === 'DONE'} onClick={() => handleStatusUpdate('DONE')}>
              Mark as Done
            </button>
          </div>
        )}
      </header>

      {error && <div className="task-detail-message error">{error}</div>}
      {loading && <div className="task-detail-message">Loading task detail...</div>}

      {!loading && task && (
        <>
          <section className="task-progress-card">
            {statusSteps.map((step, index) => (
              <div className={`task-progress-step ${index <= activeIndex ? 'active' : ''}`} key={step}>
                <i>{index < activeIndex || task.rawStatus === 'DONE' ? '✓' : index + 1}</i>
                <span>{statusLabels[step]}</span>
              </div>
            ))}
          </section>

          <section className="task-detail-grid">
            <article className="task-detail-panel">
              <h2>General Information</h2>
              <div className="task-info-grid">
                <div>
                  <span>Assigned By</span>
                  <strong>{task.assignedBy?.name || 'Admin'}</strong>
                </div>
                <div>
                  <span>Related Animal</span>
                  <strong>{task.animal?.name || task.animalName || 'No animal'}</strong>
                </div>
                <div>
                  <span>Deadline</span>
                  <strong>{formatDateTime(task.dueDate)}</strong>
                </div>
                <div>
                  <span>Area</span>
                  <strong>{task.area?.name || task.areaName || task.location}</strong>
                </div>
                <div>
                  <span>Priority</span>
                  <strong>{task.priority}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{task.status}</strong>
                </div>
              </div>
            </article>

            <article className="task-detail-panel task-description-panel">
              <h2>Detailed Instructions</h2>
              <p>{task.description || 'No detailed instructions were provided for this task.'}</p>
              <ul>
                <li>Review the assigned animal and area before starting.</li>
                <li>Complete required care or operational work.</li>
                <li>Record a care log when animal care is involved.</li>
              </ul>
            </article>

            <aside className="task-detail-panel task-activity-panel">
              <h2>Task Activity</h2>
              {detail.logs.length === 0 ? (
                <p>No care logs linked to this task yet.</p>
              ) : detail.logs.map((log) => (
                <div className="task-activity-item" key={log.id}>
                  <strong>{log.careType}</strong>
                  <span>{log.time} by {log.staffName}</span>
                  <p>{log.notes}</p>
                </div>
              ))}
            </aside>
          </section>
        </>
      )}
    </div>
  );
};

export default StaffTaskDetailPage;
