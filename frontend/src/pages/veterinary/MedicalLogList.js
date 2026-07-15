import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download } from 'lucide-react';

const MedicalLogList = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/vet/health-records'); // or a new endpoint for all logs
        const json = await res.json();
        if (json.success && json.data && json.data.logs) {
          setLogs(json.data.logs);
        } else {
          // fetch from dashboard or specific endpoint if needed, for now we will reuse health-records
          setLogs([]);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading medical logs...</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-dark)' }}>Medical Exam Logs</h1>
      </div>

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
          <input type="text" placeholder="Search by Animal Name or Species..." style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
        </div>
        <div style={{ width: '200px' }}>
          <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <option>All Vets</option>
          </select>
        </div>
        <div style={{ width: '200px' }}>
          <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-dark)' }}>Log History</h2>
          <button style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Download size={18} color="var(--text-gray)" />
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ color: 'var(--text-gray)', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>LOG ID</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>ANIMAL</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>DATE</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>VET</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>DIAGNOSIS/SUMMARY</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>STATUS</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 20px', fontWeight: '500' }}>#{log.id?.substring(0,6) || '---'}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6' }}></div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{log.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{log.species || 'Unknown'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>{log.date}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-gray)' }}>{log.vet || 'N/A'}</td>
                <td style={{ padding: '16px 20px' }}>{log.procedure || log.diagnosis || '--'}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', backgroundColor: '#ecfdf5', color: '#065f46' }}>Healthy</span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <button 
                    onClick={() => log.animalId && navigate(`/vet/health/${log.animalId}`)}
                    style={{ padding: '6px 12px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    View Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ backgroundColor: '#064e3b', color: 'white', padding: '24px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '8px' }}>TOTAL RECORDS</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>342</div>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>+12.4% from last month</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-gray)', marginBottom: '8px' }}>RECENT CASES</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '8px' }}>14</div>
          <div style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Requiring follow-up within 48h</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-gray)', marginBottom: '8px' }}>ACTIVE VETS</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '8px' }}>08</div>
          <div style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Currently on-site and logged in</div>
        </div>
      </div>
    </div>
  );
};

export default MedicalLogList;
