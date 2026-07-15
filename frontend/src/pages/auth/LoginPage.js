import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_ACCOUNTS = [
  { email: 'user@zoo.com', password: '123456', role: 'USER' },
  { email: 'staff@zoo.com', password: '123456', role: 'STAFF' },
  { email: 'vet@zoo.com', password: '123456', role: 'VET' },
  { email: 'admin@zoo.com', password: '123456', role: 'ADMIN' },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = DEMO_ACCOUNTS.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify({ email: user.email, role: user.role }));
      
      switch(user.role) {
        case 'USER': navigate('/user'); break;
        case 'STAFF': navigate('/staff'); break;
        case 'VET': navigate('/vet'); break;
        case 'ADMIN': navigate('/admin'); break;
        default: navigate('/login');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  const handleFillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#1B5E3C', marginBottom: '20px' }}>Zoo Management System</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>
          <button type="submit" style={{ padding: '12px', backgroundColor: '#1B5E3C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
            Login
          </button>
        </form>

        <div style={{ marginTop: '30px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Demo accounts (click to fill):</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button 
                key={acc.email} 
                type="button"
                onClick={() => handleFillDemo(acc.email)}
                style={{ padding: '8px', border: '1px solid #1B5E3C', background: 'transparent', color: '#1B5E3C', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                {acc.email} (Role: {acc.role})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
