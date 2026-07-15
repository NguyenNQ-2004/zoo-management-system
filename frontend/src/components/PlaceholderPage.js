import React from 'react';

const PlaceholderPage = ({ title, roleName, description, functions }) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1B5E3C' }}>{title}</h1>
      <p>This is the {roleName} interface.</p>
      {description && <p>{description}</p>}
      
      <div style={{ marginTop: '20px' }}>
        <h3>Main functions:</h3>
        <ul>
          {functions && functions.map((func, index) => (
            <li key={index}>{func}</li>
          ))}
        </ul>
      </div>
      
      <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#666' }}>
        Feature status: Not implemented yet.
      </p>
    </div>
  );
};

export default PlaceholderPage;
