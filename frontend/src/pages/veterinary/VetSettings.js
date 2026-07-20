import React, { useState, useEffect } from 'react';
import { Edit2, Shield, User, Lock, Calendar, Stethoscope, LogOut, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VetSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [role, setRole] = useState('VET');
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const savedProfile = JSON.parse(localStorage.getItem('vet_user_profile') || '{}');
    
    setProfile({
      fullName: currentUser.fullName || savedProfile.fullName || 'Dr. Sarah Jenkins',
      email: currentUser.email || savedProfile.email || 'sarah.j@zoologix.com',
      phone: savedProfile.phone || currentUser.phone || '+1 (555) 123-4567'
    });
    setRole(currentUser.role || 'VET');
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setIsEditing(true);
  };

  const handleSave = () => {
    localStorage.setItem('vet_user_profile', JSON.stringify(profile));
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    localStorage.setItem('currentUser', JSON.stringify({
      ...currentUser,
      fullName: profile.fullName,
      email: profile.email
    }));
    
    setIsEditing(false);
  };

  const handleDiscard = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const savedProfile = JSON.parse(localStorage.getItem('vet_user_profile') || '{}');
    
    setProfile({
      fullName: currentUser.fullName || savedProfile.fullName || 'Dr. Sarah Jenkins',
      email: currentUser.email || savedProfile.email || 'sarah.j@zoologix.com',
      phone: savedProfile.phone || currentUser.phone || '+1 (555) 123-4567'
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.current && passwordForm.new) {
      alert('Password updated successfully!');
      setPasswordForm({ current: '', new: '' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Top Banner */}
      <div style={{ background: '#064e3b', height: '200px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-50px', top: '-50px', opacity: 0.1 }}>
          <Stethoscope size={400} color="white" />
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end', marginTop: '-60px', marginBottom: '40px' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover', border: '6px solid #f9fafb', background: 'white' }} />
            <button style={{ position: 'absolute', bottom: '10px', right: '-10px', width: '36px', height: '36px', borderRadius: '50%', background: '#064e3b', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Edit2 size={16} />
            </button>
          </div>
          <div style={{ paddingBottom: '10px' }}>
            <h1 style={{ fontSize: '36px', margin: '0 0 10px 0', fontWeight: 800, color: '#111' }}>{profile.fullName}</h1>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#166534', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
              <Shield size={14} /> Senior Veterinarian
            </div>
          </div>
        </div>

        {/* Forms Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Personal Information */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '30px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '20px', margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#111' }}>
              <User size={22} color="#064e3b" /> Personal Information
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', color: '#111', boxSizing: 'border-box', outlineColor: '#064e3b' }} />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>Email Address</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', color: '#111', boxSizing: 'border-box', outlineColor: '#064e3b' }} />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>Contact Number</label>
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', color: '#111', boxSizing: 'border-box', outlineColor: '#064e3b' }} />
            </div>
          </div>

          {/* Account Information */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '30px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '20px', margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#111' }}>
              <Shield size={22} color="#064e3b" /> Account Details
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>System Role</label>
              <div style={{ position: 'relative' }}>
                <input type="text" readOnly value={role} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '15px', color: '#4b5563', boxSizing: 'border-box' }} />
                <Lock size={16} color="#9ca3af" style={{ position: 'absolute', right: '15px', top: '15px' }} />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>Date Joined</label>
              <div style={{ position: 'relative' }}>
                <input type="text" readOnly value="March 2022" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '15px', color: '#4b5563', boxSizing: 'border-box' }} />
                <Calendar size={16} color="#9ca3af" style={{ position: 'absolute', right: '15px', top: '15px' }} />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>Specialization</label>
              <div style={{ position: 'relative' }}>
                <input type="text" readOnly value="Large Mammals & Felines" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '15px', color: '#4b5563', boxSizing: 'border-box' }} />
                <Stethoscope size={16} color="#9ca3af" style={{ position: 'absolute', right: '15px', top: '15px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Password & Security */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '30px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginTop: '30px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#111' }}>
            <Key size={22} color="#064e3b" /> Password & Security
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>Current Password</label>
              <input type="password" name="current" value={passwordForm.current} onChange={handlePasswordChange} placeholder="••••••••" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', color: '#111', boxSizing: 'border-box', outlineColor: '#064e3b' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>New Password</label>
              <input type="password" name="new" value={passwordForm.new} onChange={handlePasswordChange} placeholder="Enter new password" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', color: '#111', boxSizing: 'border-box', outlineColor: '#064e3b' }} />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button onClick={handlePasswordSubmit} style={{ background: 'white', color: '#111', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: '0.2s', opacity: (passwordForm.current && passwordForm.new) ? 1 : 0.5 }}>Update Password</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', marginBottom: '40px' }}>
          <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', transition: '0.2s' }}>
            <LogOut size={16} /> Log Out
          </button>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            {isEditing && (
              <button onClick={handleDiscard} style={{ background: 'transparent', border: 'none', fontWeight: 700, color: '#4b5563', cursor: 'pointer', fontSize: '15px' }}>Discard Changes</button>
            )}
            <button onClick={handleSave} style={{ background: '#064e3b', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', opacity: isEditing ? 1 : 0.6 }}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Clinic Notifications Preferences */}
        <div style={{ background: '#064e3b', borderRadius: '20px', padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: 700 }}>Clinic Notification Preferences</h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>You are currently receiving all CRITICAL and URGENT alerts.</p>
            </div>
          </div>
          <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '10px 20px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Manage Alerts</button>
        </div>

      </div>
    </div>
  );
};

export default VetSettings;
