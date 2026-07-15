import React from 'react';
import { 
  HeartPulse, 
  AlertTriangle, 
  Calendar, 
  Activity,
  Download,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../../components/vet/StatCard';

const mockHealthTrends = [
  { name: 'Mon', healthy: 320, treatment: 15 },
  { name: 'Tue', healthy: 325, treatment: 12 },
  { name: 'Wed', healthy: 322, treatment: 14 },
  { name: 'Thu', healthy: 330, treatment: 10 },
  { name: 'Fri', healthy: 335, treatment: 8 },
  { name: 'Sat', healthy: 338, treatment: 12 },
  { name: 'Sun', healthy: 342, treatment: 15 },
];

const mockComplianceData = [
  { name: 'Completed', value: 75, color: '#065F46' },
  { name: 'In Progress', value: 15, color: '#34D399' },
  { name: 'Pending', value: 10, color: '#E5E7EB' },
];

const VetDashboard = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-dark)' }}>
            <span style={{ color: '#EAB308' }}>Veterinary</span> Overview
          </h1>
          <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '14px' }}>
            Real-time health analytics for the sanctuary population.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e5e7eb', 
            borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: 'var(--text-dark)'
          }}>
            <Download size={18} /> Export PDF
          </button>
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', backgroundColor: 'var(--primary-green)', border: 'none', 
            borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: 'white'
          }}>
            <Plus size={18} /> Log Checkup
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <StatCard 
          title="HEALTHY ANIMALS" 
          value="1,248" 
          icon={<HeartPulse size={20} />} 
          trend="+2%" 
          trendUp={true}
          bgColor="var(--status-healthy-bg)" 
          textColor="var(--status-healthy-text)"
          borderColor="var(--status-healthy-text)"
        />
        <StatCard 
          title="MONITORING" 
          value="42" 
          icon={<Activity size={20} />} 
          bgColor="var(--status-monitoring-bg)" 
          textColor="var(--status-monitoring-text)"
          borderColor="var(--status-monitoring-text)"
        />
        <StatCard 
          title="NEEDS ATTENTION" 
          value="08" 
          icon={<AlertTriangle size={20} />} 
          subtitle="Urgent"
          bgColor="var(--status-urgent-bg)" 
          textColor="var(--status-urgent-text)"
          borderColor="var(--status-urgent-text)"
        />
        <StatCard 
          title="UNDER TREATMENT" 
          value="15" 
          icon={<Calendar size={20} />} 
          subtitle="Ongoing"
          bgColor="var(--status-alert-bg)" 
          textColor="var(--status-alert-text)"
          borderColor="var(--status-alert-text)"
        />
      </div>

      {/* Charts & Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Chart */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-dark)' }}>Health Distribution by Species</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '12px', backgroundColor: 'var(--primary-green)', color: 'white', padding: '4px 8px', borderRadius: '4px' }}>7 Days</span>
                <span style={{ fontSize: '12px', color: 'var(--text-gray)', padding: '4px 8px', borderRadius: '4px' }}>30 Days</span>
              </div>
            </div>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockHealthTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="healthy" fill="#86efac" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="treatment" fill="#fca5a5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Critical Care Watchlist */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-dark)' }}>Critical Care Watchlist</h3>
              <a href="#" style={{ color: 'var(--primary-green)', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>View All Critical</a>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ color: 'var(--text-gray)', borderBottom: '1px solid #f3f4f6' }}>
                  <th style={{ padding: '12px 0', fontWeight: '600' }}>ANIMAL NAME</th>
                  <th style={{ padding: '12px 0', fontWeight: '600' }}>SPECIES</th>
                  <th style={{ padding: '12px 0', fontWeight: '600' }}>STATUS</th>
                  <th style={{ padding: '12px 0', fontWeight: '600' }}>MAIN ISSUE</th>
                  <th style={{ padding: '12px 0', fontWeight: '600' }}>LAST CHECKUP</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 0', fontWeight: '500' }}>Kovu</td>
                  <td style={{ padding: '16px 0', color: 'var(--text-gray)' }}>African Lion</td>
                  <td style={{ padding: '16px 0' }}><span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>CRITICAL</span></td>
                  <td style={{ padding: '16px 0' }}>Respiratory Infection</td>
                  <td style={{ padding: '16px 0', color: 'var(--text-gray)' }}>2h ago</td>
                </tr>
                <tr>
                  <td style={{ padding: '16px 0', fontWeight: '500' }}>Matilda</td>
                  <td style={{ padding: '16px 0', color: 'var(--text-gray)' }}>Green Sea Turtle</td>
                  <td style={{ padding: '16px 0' }}><span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>CRITICAL</span></td>
                  <td style={{ padding: '16px 0' }}>Shell Fracture</td>
                  <td style={{ padding: '16px 0', color: 'var(--text-gray)' }}>4h ago</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Treatment Compliance */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Treatment Compliance</h3>
            
            <div style={{ height: '200px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockComplianceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {mockComplianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-dark)' }}>90%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '1px' }}>Success</div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mockComplianceData.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></div>
                    {item.name}
                  </div>
                  <div style={{ fontWeight: '600' }}>{item.value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-dark)' }}>Today's Schedule</h3>
              <Calendar size={18} color="var(--primary-green)" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', marginTop: '4px' }}>09:00</div>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', flex: 1, borderLeft: '3px solid var(--primary-green)' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Vaccination Drive</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '4px' }}>Avian House | All Species</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', marginTop: '4px' }}>11:30</div>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', flex: 1, borderLeft: '3px solid #dc2626' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Leo Surgery Post-Op</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '4px' }}>Medical Wing | Dr. Jenkins</div>
                  <div style={{ marginTop: '8px' }}><span style={{ backgroundColor: '#0f766e', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>HIGH PRIORITY</span></div>
                </div>
              </div>
            </div>

            <button style={{ width: '100%', marginTop: '20px', padding: '10px', border: '1px dashed #d1d5db', backgroundColor: 'transparent', borderRadius: '8px', color: 'var(--text-gray)', fontWeight: '500', cursor: 'pointer' }}>
              + Add Appointment
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default VetDashboard;
