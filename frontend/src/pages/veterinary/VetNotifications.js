import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, AlertTriangle, Info, CheckCircle, Plus, X } from 'lucide-react';
import { vetApi } from '../../services/api';

const VetNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Report State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  
  const location = useLocation();

  useEffect(() => {
    fetchNotifications();
    
    // Check if we need to open the modal from URL params
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('new') === 'true') {
      setIsModalOpen(true);
    }
  }, [location]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await vetApi.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await vetApi.markNotificationRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      await vetApi.createReport({
        title,
        message,
        priority,
        targetRole: 'ALL'
      });
      setIsModalOpen(false);
      setTitle('');
      setMessage('');
      setPriority('NORMAL');
      fetchNotifications();
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to create report.');
    }
  };

  const getPriorityIcon = (prio) => {
    switch (prio) {
      case 'URGENT':
      case 'CRITICAL': return <AlertTriangle size={20} color="#dc2626" />;
      case 'LOW': return <Info size={20} color="#3b82f6" />;
      default: return <Bell size={20} color="#d97706" />;
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-dark)' }}>
            Notifications & Reports
          </h1>
          <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '14px' }}>
            Stay updated with system alerts and submit new veterinary reports.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '10px 20px', backgroundColor: 'var(--primary-green)', border: 'none', 
            borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: 'white'
          }}>
          <Plus size={18} /> New Report
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-gray)' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-gray)' }}>
            No notifications or reports found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map((notif, idx) => (
              <div 
                key={notif._id} 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  padding: '20px', 
                  borderBottom: idx === notifications.length - 1 ? 'none' : '1px solid #f3f4f6',
                  backgroundColor: notif.read ? 'white' : '#f0fdf4'
                }}
              >
                <div style={{ marginTop: '4px' }}>
                  {getPriorityIcon(notif.priority)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-dark)', fontWeight: notif.read ? '500' : '700' }}>
                      {notif.title}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-gray)', lineHeight: '1.5' }}>
                    {notif.message}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e5e7eb', color: 'var(--text-dark)' }}>
                        {notif.type}
                      </span>
                      {notif.sender && (
                        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                          From: {notif.sender.fullName || 'System'}
                        </span>
                      )}
                    </div>
                    
                    {!notif.read && (
                      <button 
                        onClick={() => handleMarkAsRead(notif._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-green)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckCircle size={14} /> Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Report Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-dark)' }}>Create New Report</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-gray)' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitReport} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Report Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. Facility inspection required"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Priority Level</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', backgroundColor: 'white' }}
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Message / Details</label>
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the details of your report..."
                  rows={4}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', color: 'var(--text-dark)', fontWeight: '500', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '10px 16px', backgroundColor: 'var(--primary-green)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VetNotifications;
