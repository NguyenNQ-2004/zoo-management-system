import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { api } from '../../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.login(email, password);
      localStorage.setItem('currentUser', JSON.stringify({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        token: user.token
      }));
      
      switch(user.role) {
        case 'USER': navigate('/user'); break;
        case 'STAFF': navigate('/staff'); break;
        case 'VET': navigate('/vet'); break;
        case 'ADMIN': navigate('/admin'); break;
        default: navigate('/login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Left Image Section */}
      <div style={{
        flex: 1,
        backgroundImage: 'url("https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1373&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px',
        color: 'white'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))' }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px', lineHeight: 1.1 }}>Conservation<br/>at Scale.</h1>
          <p style={{ fontSize: '18px', lineHeight: 1.5, opacity: 0.9 }}>
            Empowering veterinary and operational teams with precision tools for high-end sanctuary management.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '60px', backgroundColor: '#fff', overflowY: 'auto' }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <Leaf color="#1B5E3C" size={32} />
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1B5E3C' }}>ZooLogix</span>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#111' }}>Welcome back</h2>
          <p style={{ color: '#666', marginBottom: '40px', fontSize: '15px' }}>
            Please enter your credentials to access the management console.
          </p>

          {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@sanctuary.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none' }}
                  required 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '14px 45px 14px 45px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none', letterSpacing: password ? '3px' : 'normal' }}
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-5px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#1B5E3C' }} />
                <span style={{ fontSize: '13px', color: '#666' }}>Remember me</span>
              </label>
              <button
                type="button"
                style={{ fontSize: '13px', color: '#333', textDecoration: 'none', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>

            <button disabled={loading} type="submit" style={{ padding: '16px', backgroundColor: '#1B5E3C', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '16px', marginTop: '10px', transition: 'background-color 0.2s', opacity: loading ? 0.8 : 1 }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Don't have an account? <Link to="/register" style={{ color: '#0f4c28', fontWeight: 'bold', textDecoration: 'none' }}>Request Access</Link>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80' }}></div>
            <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>System Online</span>
          </div>

          {/* Demo Accounts */}
          <div style={{ marginTop: '30px', fontSize: '12px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#999', textAlign: 'center' }}>
            <p style={{ marginBottom: '10px' }}>Demo Accounts (Click to fill):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
              {['admin', 'staff', 'vet', 'user'].map(role => (
                <button key={role} type="button" onClick={() => handleFillDemo(`${role}@zoo.com`)} style={{ padding: '4px 8px', fontSize: '11px', background: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#4b5563' }}>
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
