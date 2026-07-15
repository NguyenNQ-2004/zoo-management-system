import { vetApi } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ClipboardList, Activity, ArrowRightLeft, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import StatusBadge from '../../components/vet/StatusBadge';

const MedicalHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [logs, setLogs] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [animalsList, setAnimalsList] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [loading, setLoading] = useState(true);

  // UI state
  const [expandedExamIdx, setExpandedExamIdx] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const isValidObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (isValidObjectId(id)) {
          // Valid MongoDB ID, fetch history for this single animal
          const json = await vetApi.getMedicalHistory(id);
          if (json.success) {
            setAnimal(json.data.animal);
            setLogs(json.data.logs || []);
            setTreatments(json.data.treatments || []);
            setDiagnoses(json.data.diagnoses || []);
            setSelectedAnimalId(json.data.animal.id);
          }
        } else {
          // General entry (e.g. from sidebar), fetch all animals first
          const json = await vetApi.getAnimalHealthStatus();
          if (json.success) {
            setAnimalsList(json.data || []);
            if (json.data && json.data.length > 0) {
              const firstAnimal = json.data[0];
              setSelectedAnimalId(firstAnimal.id);
              // Fetch details for first animal
              const historyJson = await vetApi.getMedicalHistory(firstAnimal.id);
              if (historyJson.success) {
                setAnimal(historyJson.data.animal);
                setLogs(historyJson.data.logs || []);
                setTreatments(historyJson.data.treatments || []);
                setDiagnoses(historyJson.data.diagnoses || []);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading history data:', error);
      }
      setLoading(false);
    };
    loadInitialData();
  }, [id]);

  const handleAnimalChange = async (e) => {
    const newId = e.target.value;
    setSelectedAnimalId(newId);
    setLoading(true);
    try {
      const json = await vetApi.getMedicalHistory(newId);
      if (json.success) {
        setAnimal(json.data.animal);
        setLogs(json.data.logs || []);
        setTreatments(json.data.treatments || []);
        setDiagnoses(json.data.diagnoses || []);
      }
    } catch (error) {
      console.error('Error loading animal medical history:', error);
    }
    setLoading(false);
  };

  if (loading && !animal) return <div style={{ padding: '24px' }}>Loading medical history...</div>;

  const toggleExam = (idx) => {
    if (expandedExamIdx === idx) {
      setExpandedExamIdx(null);
    } else {
      setExpandedExamIdx(idx);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      (log.diagnosis && log.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.symptoms && log.symptoms.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'All' || log.type === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Selector dropdown at top if general search */}
      {!isValidObjectId(id) && animalsList.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '8px' }}>Select Patient to View History</label>
          <select value={selectedAnimalId} onChange={handleAnimalChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }}>
            {animalsList.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.species}) - {a.code}</option>
            ))}
          </select>
        </div>
      )}

      {animal && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Left Column: Profile Card & Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Animal Profile Card */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                <img src={animal.image} alt={animal.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', color: 'var(--text-dark)' }}>{animal.name} ({animal.code})</h2>
                  <StatusBadge status={animal.status} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '20px' }}>
                <div>
                  <div style={{ color: 'var(--text-gray)', marginBottom: '4px' }}>SPECIES</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{animal.species}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-gray)', marginBottom: '4px' }}>AGE / SEX</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>8 Years / Male</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-gray)', marginBottom: '4px' }}>ENCLOSURE</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{animal.area}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-gray)', marginBottom: '4px' }}>LAST EXAM</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Oct 12, 2024</div>
                </div>
              </div>

              <button onClick={() => navigate(`/vet/health/${animal.id}/medical-logs/new`)} style={{ width: '100%', padding: '12px', backgroundColor: '#064e3b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ClipboardList size={16} /> Record Medical Update
              </button>
            </div>

            {/* Health Timeline */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Health Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {logs.map((log, idx) => (
                  <div key={log._id || idx} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-green)', marginTop: '6px', flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{new Date(log.date).toLocaleDateString()}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)' }}>{log.diagnosis || log.type}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-gray)', marginTop: '2px' }}>{log.symptoms}</div>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && <div style={{ fontSize: '13px', color: 'var(--text-gray)' }}>No timeline history.</div>}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', width: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                  <FileText size={16} /> Export Medical PDF
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', width: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                  <ArrowRightLeft size={16} /> Transfer Record
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', width: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                  <Activity size={16} /> Order Lab Tests
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Search, Exams, Diagnoses, Treatments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Search Bar & Filters */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                <input type="text" placeholder="Filter by keyword..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
              </div>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <option value="All">All Records</option>
                <option value="CHECKUP">Routine Checkups</option>
                <option value="ILLNESS">Illness Logs</option>
                <option value="INJURY">Injury logs</option>
              </select>
            </div>

            {/* Medical Exams List */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Medical Exams</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredLogs.map((log, idx) => (
                  <div key={log._id || idx} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                    <div onClick={() => toggleExam(idx)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f9fafb', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--text-dark)' }}>{log.diagnosis || 'Routine Checkup'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '4px' }}>{new Date(log.date).toLocaleDateString()} • Dr. Vance</div>
                      </div>
                      {expandedExamIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {expandedExamIdx === idx && (
                      <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.6' }}>
                        <div><b>Symptoms:</b> {log.symptoms || 'None recorded.'}</div>
                        <div style={{ marginTop: '8px' }}><b>Treatment Plan:</b> {log.treatmentPlan || 'None required.'}</div>
                        <div style={{ marginTop: '8px' }}><b>Notes:</b> {log.notes || 'No comments.'}</div>
                      </div>
                    )}
                  </div>
                ))}
                {filteredLogs.length === 0 && <div style={{ fontSize: '13px', color: 'var(--text-gray)' }}>No matching exams.</div>}
              </div>
            </div>

            {/* Diagnoses */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Diagnoses</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {diagnoses.map((diag, i) => (
                  <div key={i} style={{ border: '1px solid #e5e7eb', borderLeft: diag.type === 'CHRONIC' ? '4px solid #dc2626' : '4px solid #059669', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', fontWeight: 'bold' }}>
                      <span style={{ color: diag.type === 'CHRONIC' ? '#dc2626' : '#059669' }}>{diag.type}</span>
                      <span style={{ color: 'var(--text-gray)' }}>{diag.date}</span>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--text-dark)', marginBottom: '8px' }}>{diag.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{diag.notes}</div>
                  </div>
                ))}
                {diagnoses.length === 0 && <div style={{ fontSize: '13px', color: 'var(--text-gray)', colSpan: 2 }}>No diagnoses listed.</div>}
              </div>
            </div>

            {/* Current & Recent Treatments */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Current & Recent Treatments</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ color: 'var(--text-gray)', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 8px', fontWeight: '600' }}>TREATMENT / MED</th>
                    <th style={{ padding: '12px 8px', fontWeight: '600' }}>DOSAGE</th>
                    <th style={{ padding: '12px 8px', fontWeight: '600' }}>DURATION</th>
                    <th style={{ padding: '12px 8px', fontWeight: '600' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((t, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === treatments.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontWeight: 'bold' }}>{t.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{t.medication}</div>
                      </td>
                      <td style={{ padding: '12px 8px' }}>{t.dosage} / {t.schedule}</td>
                      <td style={{ padding: '12px 8px' }}>
                        {new Date(t.startDate).toLocaleDateString()} - {t.endDate ? new Date(t.endDate).toLocaleDateString() : 'Ongoing'}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: t.status === 'COMPLETED' ? '#f3f4f6' : '#d1fae5', color: t.status === 'COMPLETED' ? '#4b5563' : '#065f46' }}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {treatments.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '12px 8px', color: 'var(--text-gray)', textAlign: 'center' }}>No treatments recorded.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
