import React from 'react';

const StatCard = ({ title, value, subtitle, icon, trend, trendUp, bgColor, textColor, borderColor }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: `1px solid ${borderColor || '#e5e7eb'}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '40px', 
          height: '40px', 
          borderRadius: '8px', 
          backgroundColor: bgColor || '#f3f4f6', 
          color: textColor || '#6b7280' 
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: trendUp ? '#059669' : '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
          {title}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '4px' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
