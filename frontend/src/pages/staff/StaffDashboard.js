import React from 'react';
import './StaffDashboard.css';

const dashboardStats = [
  {
    label: 'Assigned Tasks',
    value: '24',
    helper: '12% vs yesterday',
    helperType: 'positive',
    icon: 'clipboard'
  },
  {
    label: 'Pending',
    value: '8',
    helper: 'Requires attention',
    icon: 'calendar'
  },
  {
    label: 'Completed Today',
    value: '16',
    helper: 'On schedule',
    helperType: 'positive',
    icon: 'check'
  }
];

const todaysTasks = [
  {
    description: 'Morning Feeding - Primates',
    location: 'Sector B',
    priority: 'High',
    status: 'Pending'
  },
  {
    description: 'Routine Health Check - Leo',
    location: 'Enclosure 4',
    priority: 'Normal',
    status: 'Pending'
  },
  {
    description: 'Water Quality Test - Aquarium',
    location: 'Aqua Dome',
    priority: 'High',
    status: 'Completed',
    completed: true
  },
  {
    description: 'Inventory Check - Medical Supplies',
    location: 'Clinic A',
    priority: 'Low',
    status: 'Pending'
  }
];

const animals = [
  {
    name: 'Leo',
    species: 'African Lion',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=120&q=80',
    status: 'healthy'
  },
  {
    name: 'Mei',
    species: 'Red Panda',
    image: 'https://images.unsplash.com/photo-1625859043880-56acbcb6a6ac?auto=format&fit=crop&w=120&q=80',
    status: 'attention'
  }
];

const recentActivity = [
  {
    text: 'Completed Water Quality Test',
    time: '10:30 AM',
    type: 'completed'
  },
  {
    text: 'Logged feeding for Primates',
    time: '09:15 AM',
    type: 'normal'
  },
  {
    text: 'Mei needs follow-up care',
    time: '08:40 AM',
    type: 'warning'
  }
];

const Icon = ({ type }) => {
  const icons = {
    clipboard: (
      <path d="M8 3h8v3H8V3Zm-2 2h2v2h8V5h2v16H6V5Zm3 7h6v1.5H9V12Zm0 4h6v1.5H9V16Z" />
    ),
    calendar: (
      <path d="M7 3h2v3H7V3Zm8 0h2v3h-2V3ZM5 6h14v14H5V6Zm2 5h4v4H7v-4Zm8 4.2a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm-.4 1.2h.8v2.1l1.4.8-.4.7-1.8-1.1v-2.5Z" />
    ),
    check: (
      <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-2.05-4.95l-5.3 5.3-2.6-2.6-1.4 1.4 4 4 6.7-6.7A9 9 0 0 0 12 3Z" />
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="staff-icon">
      {icons[type]}
    </svg>
  );
};

const StaffDashboard = () => {
  return (
    <div className="staff-dashboard">
      <header className="staff-topbar">
        <label className="staff-search" aria-label="Search ZooLogix">
          <span className="staff-search-icon">⌕</span>
          <input type="search" placeholder="Search ZooLogix..." />
        </label>
        <div className="staff-top-actions" aria-label="Staff shortcuts">
          <button type="button" aria-label="Notifications">⌂</button>
          <button type="button" aria-label="Settings">⚙</button>
          <div className="staff-avatar" aria-label="Staff profile" />
        </div>
      </header>

      <section className="staff-hero">
        <h1>Good Morning, Dr. Sarah Jenkins</h1>
        <p>Here is your operational overview for today.</p>
      </section>

      <section className="staff-stats-grid" aria-label="Daily task summary">
        {dashboardStats.map((stat) => (
          <article className="staff-stat-card" key={stat.label}>
            <div className="staff-stat-heading">
              <span>{stat.label}</span>
              <Icon type={stat.icon} />
            </div>
            <strong>{stat.value}</strong>
            <p className={stat.helperType === 'positive' ? 'positive' : ''}>{stat.helper}</p>
          </article>
        ))}

        <article className="staff-stat-card staff-progress-card">
          <span>Task Progress</span>
          <div className="staff-progress-ring" style={{ '--progress': '66%' }}>
            <strong>66%</strong>
          </div>
          <p>Completion Rate</p>
        </article>
      </section>

      <section className="staff-dashboard-grid">
        <article className="staff-panel staff-task-panel">
          <div className="staff-panel-header">
            <h2>Today's Tasks</h2>
            <button type="button">View All</button>
          </div>

          <div className="staff-task-table" role="table" aria-label="Today's tasks">
            <div className="staff-task-row staff-task-head" role="row">
              <span>Task Description</span>
              <span>Location</span>
              <span>Priority</span>
              <span>Status</span>
            </div>

            {todaysTasks.map((task) => (
              <div className="staff-task-row" role="row" key={task.description}>
                <span className={task.completed ? 'task-completed' : ''}>{task.description}</span>
                <span>{task.location}</span>
                <span>
                  <em className={`staff-pill priority-${task.priority.toLowerCase()}`}>{task.priority}</em>
                </span>
                <span>
                  <em className={`staff-pill status-${task.status.toLowerCase()}`}>{task.status}</em>
                </span>
              </div>
            ))}
          </div>
        </article>

        <aside className="staff-side-column">
          <article className="staff-panel">
            <h2>Animals Under My Care</h2>
            <div className="staff-animal-list">
              {animals.map((animal) => (
                <div className="staff-animal-card" key={animal.name}>
                  <img src={animal.image} alt={`${animal.name} ${animal.species}`} />
                  <div>
                    <strong>{animal.name}</strong>
                    <span>{animal.species}</span>
                  </div>
                  <i className={`animal-status ${animal.status}`} aria-label={animal.status} />
                </div>
              ))}
            </div>
            <button type="button" className="staff-secondary-action">View All Animals</button>
          </article>

          <article className="staff-panel staff-activity-panel">
            <h2>Recent Activity</h2>
            <div className="staff-activity-list">
              {recentActivity.map((activity) => (
                <div className="staff-activity-item" key={`${activity.text}-${activity.time}`}>
                  <i className={`activity-dot ${activity.type}`} />
                  <div>
                    <strong>{activity.text}</strong>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
};

export default StaffDashboard;
