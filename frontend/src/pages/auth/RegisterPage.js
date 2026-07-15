import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { api } from '../../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = await api.register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });

      localStorage.setItem('currentUser', JSON.stringify({ email: user.email, role: user.role }));
      
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
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px', lineHeight: 1.1 }}>Advanced<br/>Conservation<br/>Technology</h1>
          <p style={{ fontSize: '18px', lineHeight: 1.5, opacity: 0.9 }}>
            Manage the delicate balance of your sanctuary with surgical precision and natural intuition.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '60px', backgroundColor: '#fff', overflowY: 'auto' }}>
        <div style={{ maxWidth: '450px', width: '100%', margin: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <Leaf color="#1B5E3C" size={32} />
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1B5E3C' }}>ZooLogix</span>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#111' }}>Join the Sanctuary</h2>
          <p style={{ color: '#666', marginBottom: '40px', fontSize: '15px' }}>
            Create your account to start managing your wildlife operations.
          </p>

          {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
              <input 
                type="text" 
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none' }}
                required 
              />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@sanctuary.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none' }}
                  required 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none' }}
                  required 
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Verify password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none' }}
                required 
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
              <input type="checkbox" required style={{ marginTop: '4px', width: '16px', height: '16px', accentColor: '#1B5E3C' }} />
              <span style={{ fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                I agree to the <span style={{ fontWeight: 'bold', color: '#333' }}>Terms of Service</span> and <span style={{ fontWeight: 'bold', color: '#333' }}>Privacy Policy</span> regarding conservation data handling.
              </span>
            </div>

            <button disabled={loading} type="submit" style={{ padding: '16px', backgroundColor: '#0f4c28', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '16px', marginTop: '20px', transition: 'background-color 0.2s', opacity: loading ? 0.8 : 1 }}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '14px', color: '#666', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            Already have a sanctuary account? <Link to="/login" style={{ color: '#0f4c28', fontWeight: 'bold', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
