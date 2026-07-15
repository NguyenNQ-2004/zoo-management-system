import React from 'react';
import './StaffCareDetail.css';

const animal = {
  name: 'Kael',
  species: 'Panthera pardus orientalis',
  identifier: 'AL-0492',
  age: '6 Years, 2 Mos',
  weight: '48.5 kg',
  sex: 'Male (Intact)',
  enclosure: 'North Ridge B',
  image: 'https://images.unsplash.com/photo-1615963244664-5b845b2025ee?auto=format&fit=crop&w=720&q=80'
};

const vitals = [
  { label: 'Heart Rate', value: '72 bpm', level: 66 },
  { label: 'Respiration', value: '24 br/m', level: 45 },
  { label: 'Temperature', value: '38.2 C', level: 54 }
];

const checklist = [
  {
    title: 'Morning Feeding',
    note: '2.5kg raw beef blend + Vitamin supplements.',
    time: '08:30 AM',
    status: 'done'
  },
  {
    title: 'Enclosure Cleaning',
    note: 'Standard structural check and waste removal. North Ridge B.',
    status: 'pending'
  },
  {
    title: 'Water Refresh',
    note: 'Both primary and secondary troughs cleaned and refilled.',
    time: '09:15 AM',
    status: 'done'
  },
  {
    title: 'Behavioral Observation',
    note: 'Requires 15-minute focused observation regarding slight limp noted yesterday.',
    action: 'Start',
    status: 'attention'
  }
];

const logs = [
  {
    datetime: 'Oct 23, 16:45',
    type: 'Feeding',
    icon: 'cutlery',
    notes: 'Ate full portion. Active pacing before meal.'
  },
  {
    datetime: 'Oct 23, 14:10',
    type: 'Observation',
    icon: 'eye',
    notes: 'Slight favoring of left hind leg observed ...'
  },
  {
    datetime: 'Oct 23, 08:30',
    type: 'Cleaning',
    icon: 'cleaning',
    notes: 'Routine cleaning. No abnormalities in wa...'
  }
];

const StaffTopbar = () => (
  <header className="care-topbar">
    <label className="care-search" aria-label="Search records">
      <span>O</span>
      <input type="search" placeholder="Search records..." />
    </label>
    <div className="care-actions">
      <button type="button" aria-label="Notifications">!</button>
      <button type="button" aria-label="Settings">*</button>
      <div className="care-avatar" aria-label="Staff profile" />
    </div>
  </header>
);

const StatusIcon = ({ status }) => {
  if (status === 'done') {
    return <span className="checklist-icon done" />;
  }

  if (status === 'attention') {
    return <span className="checklist-icon attention">!</span>;
  }

  return <span className="checklist-icon pending" />;
};

const StaffCareDetail = () => {
  return (
    <div className="care-detail-page">
      <StaffTopbar />

      <main className="care-content">
        <div className="care-title-row">
          <div>
            <nav className="care-breadcrumb" aria-label="Breadcrumb">
              <span>Veterinary</span>
              <b>&gt;</b>
              <span>Active Cases</span>
              <b>&gt;</b>
              <strong>Daily Care</strong>
            </nav>
            <h1>Daily Care Details</h1>
          </div>

          <button type="button" className="add-care-log-button">
            <span>▣</span>
            Add Care Log
          </button>
        </div>

        <section className="care-detail-grid">
          <aside className="care-left-column">
            <article className="animal-profile-card">
              <div className="animal-photo-wrap">
                <img src={animal.image} alt={`${animal.name} profile`} />
                <span className="healthy-badge">Healthy</span>
              </div>

              <div className="animal-profile-heading">
                <div>
                  <h2>{animal.name}</h2>
                  <p>{animal.species}</p>
                </div>
                <span className="animal-id">ID: {animal.identifier}</span>
              </div>

              <dl className="animal-meta-grid">
                <div>
                  <dt>Age</dt>
                  <dd>{animal.age}</dd>
                </div>
                <div>
                  <dt>Weight</dt>
                  <dd>{animal.weight} +</dd>
                </div>
                <div>
                  <dt>Sex</dt>
                  <dd>{animal.sex}</dd>
                </div>
                <div>
                  <dt>Enclosure</dt>
                  <dd>{animal.enclosure}</dd>
                </div>
              </dl>
            </article>

            <article className="care-panel vital-panel">
              <h2><span>~</span> Recent Vitals</h2>
              <div className="vital-list">
                {vitals.map((vital) => (
                  <div className="vital-item" key={vital.label}>
                    <div>
                      <span>{vital.label}</span>
                      <strong>{vital.value}</strong>
                    </div>
                    <i style={{ '--level': `${vital.level}%` }} />
                  </div>
                ))}
              </div>
            </article>
          </aside>

          <section className="care-right-column">
            <article className="care-panel checklist-panel">
              <div className="care-panel-header">
                <h2>Care Checklist</h2>
                <span>Oct 24, 2024</span>
              </div>

              <div className="checklist-items">
                {checklist.map((item) => (
                  <div className={`checklist-item ${item.status}`} key={item.title}>
                    <StatusIcon status={item.status} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.note}</p>
                    </div>
                    {item.time && <time>{item.time}</time>}
                    {item.status === 'pending' && <em>Pending</em>}
                    {item.action && <button type="button">{item.action}</button>}
                  </div>
                ))}
              </div>
            </article>

            <article className="care-panel logs-panel">
              <div className="care-panel-header">
                <h2>Recent Logs</h2>
                <button type="button" aria-label="Filter logs">≡</button>
              </div>

              <div className="log-table" role="table" aria-label="Recent care logs">
                <div className="log-row log-head" role="row">
                  <span>Date & Time</span>
                  <span>Type</span>
                  <span>Notes</span>
                </div>

                {logs.map((log) => (
                  <div className="log-row" role="row" key={`${log.datetime}-${log.type}`}>
                    <span>{log.datetime}</span>
                    <span><em className="log-type">{log.type}</em></span>
                    <span>{log.notes}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </section>
      </main>
    </div>
  );
};

export default StaffCareDetail;
