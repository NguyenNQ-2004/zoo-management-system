import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, XCircle, Map, Utensils, HeadphonesIcon, Info, CheckCircle2, User, Clock, Calendar, MapPin } from 'lucide-react';
import './MyTickets.css'; // Reusing styles

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [profile, setProfile] = useState({ fullName: '' });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const savedProfile = JSON.parse(localStorage.getItem('zoo_user_profile') || '{}');
    setProfile({
      fullName: currentUser.fullName || savedProfile.fullName || ''
    });
  }, []);

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('zoo_tickets') || '[]');
    const found = loaded.find(t => t.id === id);
    if (found) {
      setTicket(found);
    } else {
      setTicket({
        id: id,
        status: 'Valid',
        ticketType: 'General Admission',
        visitDate: 'Oct 24, 2024',
        bookingDate: 'Oct 10, 2024',
        visitors: '2 Adults, 1 Child',
        adults: 2,
        children: 1,
        adultPrice: 35,
        childPrice: 20,
        fee: 5,
        subtotal: 90,
        totalAmount: 95,
        total: '$95.00',
        addons: ['Guided Tour']
      });
    }
  }, [id]);

  if (!ticket) return null;

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this ticket?')) {
      const loaded = JSON.parse(localStorage.getItem('zoo_tickets') || '[]');
      const updated = loaded.map(t => t.id === id ? { ...t, status: 'Cancelled' } : t);
      localStorage.setItem('zoo_tickets', JSON.stringify(updated));
      setTicket({ ...ticket, status: 'Cancelled' });
    }
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            Dashboard &nbsp;&gt;&nbsp; Ticket Details
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1B5E3C', margin: 0 }}>Your Entry Pass</h1>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn-outline-dark" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white' }}>
                <Printer size={18} /> Print Ticket
              </button>
              {ticket.status === 'Valid' && (
                <button className="btn-outline-dark" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: '#dc2626', borderColor: '#fca5a5' }} onClick={handleCancel}>
                  <XCircle size={18} /> Cancel Ticket
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Ticket Card */}
        <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          
          {/* Top Half: Image & QR */}
          <div style={{ display: 'flex', height: '300px' }}>
            {/* Left Image */}
            <div style={{ flex: 1, position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1561731216-c3a428c4e0f4?w=800&q=80" alt="Tiger" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: 'white' }}>
                <div style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', display: 'inline-block', marginBottom: '8px' }}>
                  {ticket.ticketType || 'General Admission'}
                </div>
                <h2 style={{ fontSize: '28px', margin: 0, fontWeight: 700 }}>ZooLogix Sanctuary</h2>
              </div>
            </div>
            {/* Right QR */}
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderLeft: '2px dashed #e5e7eb' }}>
               <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`} alt="QR" style={{ width: '120px', height: '120px' }} />
               </div>
               <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Ticket Code</div>
               <div style={{ fontSize: '24px', fontWeight: 800, color: '#1B5E3C', marginBottom: '15px' }}>{ticket.id}</div>
               <div style={{ background: ticket.status === 'Cancelled' ? '#fee2e2' : '#ecfdf5', color: ticket.status === 'Cancelled' ? '#991b1b' : '#059669', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                 {ticket.status === 'Cancelled' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                 {ticket.status === 'Cancelled' ? 'Cancelled' : 'Ready to Scan'}
               </div>
            </div>
          </div>

          {/* Bottom Half: Info & Summary */}
          <div style={{ padding: '40px', display: 'flex', gap: '40px', borderTop: '2px dashed #e5e7eb' }}>
            
            {/* Left: Visitor Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>Visitor Information</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                  <User size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#111' }}>{profile.fullName}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>Premium Member</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '40px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Visit Date</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color="#1B5E3C" /> {ticket.visitDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Time Slot</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} color="#1B5E3C" /> 09:00 AM - 12:00 PM</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Zone Access</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} color="#1B5E3C" /> 
                    {ticket.ticketType === 'VIP Safari Tour' ? 'All Zones + VIP' : 'All Zones'}
                  </div>
                </div>
              </div>
              
              {ticket.addons && ticket.addons.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>Included Add-ons</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {ticket.addons.map(a => (
                      <div key={a} style={{ background: '#f3f4f6', color: '#374151', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                        ✨ {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Payment Summary */}
            <div style={{ width: '350px', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '25px' }}>
               <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>Payment Summary</div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '15px', color: '#4b5563' }}>
                 <span>Adult Tickets (x{ticket.adults || 2})</span>
                 <span style={{ fontWeight: 600, color: '#111' }}>${((ticket.adults || 2) * (ticket.adultPrice || 35)).toFixed(2)}</span>
               </div>
               {ticket.children > 0 && (
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '15px', color: '#4b5563' }}>
                   <span>Child Ticket (x{ticket.children})</span>
                   <span style={{ fontWeight: 600, color: '#111' }}>${((ticket.children) * (ticket.childPrice || 20)).toFixed(2)}</span>
                 </div>
               )}
               {ticket.addons && ticket.addons.includes('Guided Tour') && (
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '15px', color: '#4b5563' }}>
                   <span>Guided Tour (x{(ticket.adults || 2) + (ticket.children || 0)})</span>
                   <span style={{ fontWeight: 600, color: '#111' }}>${(((ticket.adults || 2) + (ticket.children || 0)) * 15).toFixed(2)}</span>
                 </div>
               )}
               {ticket.addons && ticket.addons.includes('Mobility Scooter') && (
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '15px', color: '#4b5563' }}>
                   <span>Mobility Scooter</span>
                   <span style={{ fontWeight: 600, color: '#111' }}>$25.00</span>
                 </div>
               )}
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '15px', color: '#4b5563' }}>
                 <span>Processing Fee</span>
                 <span style={{ fontWeight: 600, color: '#111' }}>${(ticket.fee || 5.00).toFixed(2)}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '20px', fontSize: '18px', fontWeight: 800 }}>
                 <span>Total Paid</span>
                 <span style={{ color: '#1B5E3C' }}>${(ticket.totalAmount || (((ticket.adults || 2) * 35) + ((ticket.children || 0) * 20) + 5.00)).toFixed(2)}</span>
               </div>
            </div>

          </div>
        </div>

        {/* Entrance Instructions */}
        <div style={{ background: '#0f4c28', color: 'white', borderRadius: '16px', padding: '30px', marginTop: '30px', display: 'flex', gap: '20px' }}>
           <div style={{ minWidth: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Info size={20} />
           </div>
           <div>
             <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Entrance Instructions</h4>
             <ul style={{ margin: 0, padding: 0, listStyle: 'none', lineHeight: 1.8, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
               <li style={{ position: 'relative', paddingLeft: '15px' }}><span style={{ position: 'absolute', left: 0 }}>•</span> Please present this QR code at the Main Entrance Gate 4.</li>
               <li style={{ position: 'relative', paddingLeft: '15px' }}><span style={{ position: 'absolute', left: 0 }}>•</span> Photo ID may be required for the primary ticket holder.</li>
               <li style={{ position: 'relative', paddingLeft: '15px' }}><span style={{ position: 'absolute', left: 0 }}>•</span> Your ticket includes priority access to the Aviary Exhibit.</li>
               <li style={{ position: 'relative', paddingLeft: '15px' }}><span style={{ position: 'absolute', left: 0 }}>•</span> Digital or printed versions are both accepted.</li>
             </ul>
           </div>
        </div>

        {/* 3 Quick Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
            <Map size={32} color="#1B5E3C" style={{ margin: '0 auto 15px auto' }} />
            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700 }}>Interactive Map</h4>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>Plan your route before you arrive at the sanctuary.</p>
            <button style={{ background: 'none', border: 'none', color: '#1B5E3C', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>View Map</button>
          </div>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
            <Utensils size={32} color="#1B5E3C" style={{ margin: '0 auto 15px auto' }} />
            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700 }}>Pre-order Meals</h4>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>Save 15% on dining when you book in advance.</p>
            <button style={{ background: 'none', border: 'none', color: '#1B5E3C', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Explore Menus</button>
          </div>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
            <HeadphonesIcon size={32} color="#1B5E3C" style={{ margin: '0 auto 15px auto' }} />
            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700 }}>Need Help?</h4>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>Our support team is available 24/7 for assistance.</p>
            <button style={{ background: 'none', border: 'none', color: '#1B5E3C', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Contact Support</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TicketDetail;
