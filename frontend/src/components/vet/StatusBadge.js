import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = '#f3f4f6';
  let textColor = '#374151';
  let label = status;

  switch (status.toUpperCase()) {
    case 'HEALTHY':
      bgColor = 'var(--status-healthy-bg)';
      textColor = 'var(--status-healthy-text)';
      label = 'Healthy';
      break;
    case 'MONITORING':
    case 'OBSERVATION':
      bgColor = 'var(--status-monitoring-bg)';
      textColor = 'var(--status-monitoring-text)';
      label = 'Monitoring';
      break;
    case 'URGENT':
    case 'ALERT':
      bgColor = 'var(--status-urgent-bg)';
      textColor = 'var(--status-urgent-text)';
      label = 'Urgent';
      break;
    case 'CRITICAL':
      bgColor = 'var(--status-critical-bg)';
      textColor = 'var(--status-critical-text)';
      label = 'Critical';
      break;
    case 'UNDER TREATMENT':
    case 'TREATMENT':
      bgColor = 'var(--status-alert-bg)';
      textColor = 'var(--status-alert-text)';
      label = 'Treatment';
      break;
    case 'SCHEDULED':
      bgColor = 'var(--status-scheduled-bg)';
      textColor = 'var(--status-scheduled-text)';
      label = 'Scheduled';
      break;
    default:
      break;
  }

  return (
    <span style={{
      backgroundColor: bgColor,
      color: textColor,
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {label}
    </span>
  );
};

export default StatusBadge;
