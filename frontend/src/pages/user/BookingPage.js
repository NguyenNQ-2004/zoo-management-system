import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, Check, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [selectedDate, setSelectedDate] = useState('Oct 24, 2024');
  const [ticketType, setTicketType] = useState('General Admission');
  const [createdTicketId, setCreatedTicketId] = useState('');
  const [profile, setProfile] = useState({ fullName: 'Sarah Jenkins' });
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('zoo_user_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleAddonToggle = (addon) => {
    if (addons.includes(addon)) {
      setAddons(addons.filter(a => a !== addon));
    } else {
      setAddons([...addons, addon]);
    }
  };

  const steps = ['Visit Info', 'Tickets', 'Review', 'Success'];

  const handleNext = async () => {
    if (step === 3) {
      const newTicket = {
        id: 'ZLX-' + Math.floor(1000 + Math.random() * 9000) + '-XP',
        status: 'Valid',
        ticketType,
        visitDate: selectedDate,
        bookingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        visitors: `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`,
        total: `$${total}.00`,
        adults,
        children,
        adultPrice: 35 * multiplier,
        childPrice: 20 * multiplier,
        subtotal: subtotal,
        fee: fee,
        totalAmount: total,
        addons
      };
      const existing = JSON.parse(localStorage.getItem('zoo_tickets') || 'null');
      if (!existing) {
        const defaults = [
          { id: 'ZLX-8892-A', status: 'Valid', ticketType: 'VIP Safari Tour', visitDate: 'Oct 24, 2024', bookingDate: 'Oct 10, 2024', visitors: '2 Adults, 1 Child', total: '$225.00', adults: 2, children: 1, adultPrice: 87.5, childPrice: 50, subtotal: 225, fee: 5, totalAmount: 230, addons: ['Guided Tour'] }
        ];
        localStorage.setItem('zoo_tickets', JSON.stringify([newTicket, ...defaults]));
      } else {
        localStorage.setItem('zoo_tickets', JSON.stringify([newTicket, ...existing]));
      }
      setCreatedTicketId(newTicket.id);

      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        await api.createBooking({
          ticketType,
          date: selectedDate,
          adults,
          children,
          total: total.toString(),
          userEmail: currentUser.email || 'user@zoo.com'
        });
      } catch (err) {
        console.error('Failed to sync booking to admin', err);
      }
    }
    setStep(s => Math.min(4, s + 1));
  };
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const getMultiplier = () => {
    if (ticketType === 'VIP Safari Tour') return 2.5;
    if (ticketType === 'Animal Feeding Experience') return 1.5;
    return 1;
  };
  const multiplier = getMultiplier();
  const addonsTotal = (addons.includes('Guided Tour') ? 15 * (adults + children) : 0) + (addons.includes('Mobility Scooter') ? 25 : 0);
  const subtotal = (adults * 35 * multiplier) + (children * 20 * multiplier) + addonsTotal;
  const fee = 5.00;
  const total = subtotal + fee;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Stepper Header */}
        <div className="stepper-header">
          {steps.map((label, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <React.Fragment key={stepNum}>
                <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="step-circle">
                    {isCompleted ? <Check size={14} strokeWidth={4} /> : stepNum}
                  </div>
                  <div className="step-label">{label}</div>
                </div>
                {index < 3 && <div className={`step-line ${isCompleted ? 'completed' : ''}`}></div>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 1: Visit Info */}
        {step === 1 && (
          <div className="booking-layout">
            <div className="booking-main">
              <h2 className="booking-title">Select Visit Details</h2>
              <p className="booking-desc">Choose your preferred visit date and the number of visitors in your party.</p>

              <div className="booking-card">
                <div className="card-header"><CalendarIcon size={16}/> VISIT DATE</div>
                <div className="calendar-mock">
                   <div className="cal-header">
                     <span>October 2024</span>
                     <div><ChevronLeft size={20} style={{cursor:'pointer'}}/> <ChevronRight size={20} style={{cursor:'pointer'}}/></div>
                   </div>
                   <div className="cal-grid">
                     {['S','M','T','W','T','F','S'].map(d => <div key={d} className="cal-day-name">{d}</div>)}
                     {/* Empty slots for Oct 2024 starts on Tue */}
                     <div></div><div></div>
                     {/* Days */}
                     {[...Array(31)].map((_, i) => {
                       const d = i + 1;
                       const isSelected = selectedDate === `Oct ${d}, 2024`;
                       return <div key={d} className={`cal-day ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedDate(`Oct ${d}, 2024`)}>{d}</div>
                     })}
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                  <div className="visitor-counter">
                    <div>
                      <strong>Adults</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>Ages 13+</div>
                    </div>
                    <div className="counter-controls">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))}>−</button>
                      <span>{adults}</span>
                      <button onClick={() => setAdults(adults + 1)}>+</button>
                    </div>
                  </div>
                  <div className="visitor-counter">
                    <div>
                      <strong>Children</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>Ages 3-12</div>
                    </div>
                    <div className="counter-controls">
                      <button onClick={() => setChildren(Math.max(0, children - 1))}>−</button>
                      <span>{children}</span>
                      <button onClick={() => setChildren(children + 1)}>+</button>
                    </div>
                  </div>
                </div>

              </div>

              <div className="booking-card" style={{ marginTop: '30px' }}>
                <div className="card-header">EXPERIENCE TYPE</div>
                <select value={ticketType} onChange={e => setTicketType(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '16px', outline: 'none', background: 'white' }}>
                  <option value="General Admission">General Admission</option>
                  <option value="Animal Feeding Experience">Animal Feeding Experience</option>
                  <option value="VIP Safari Tour">VIP Safari Tour</option>
                </select>
              </div>

              <div className="booking-actions">
                 <button className="btn-back" onClick={() => navigate('/user')}>Back</button>
                 <button className="btn-next" onClick={handleNext}>Continue to Tickets</button>
              </div>
            </div>

            <div className="booking-sidebar">
              <div className="summary-card dark-green">
                <h3>Visit Summary</h3>
                <div className="summary-row">
                  <span>Selected Date</span>
                  <strong>{selectedDate}</strong>
                </div>
                <div className="summary-row">
                  <span>Adult Visitors</span>
                  <strong>{adults}</strong>
                </div>
                <div className="summary-row">
                  <span>Child Visitors</span>
                  <strong>{children}</strong>
                </div>
                <div className="summary-total-box">
                  <div>
                    <div style={{ fontWeight: 700, letterSpacing: '1px' }}>TOTAL VISITORS</div>
                    <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px', maxWidth:'180px' }}>Visitor count affects ticket availability and priority seating.</div>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 800 }}>{adults + children}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Tickets */}
        {step === 2 && (
          <div className="booking-layout">
            <div className="booking-main">
              <h2 className="booking-title">Select Tickets</h2>
              <p className="booking-desc">Confirm your ticket quantities and any add-ons.</p>

              <div className="ticket-select-list">
                <div className="ticket-select-item">
                  <img src="https://images.unsplash.com/photo-1561731216-c3a428c4e0f4?w=100" alt="Adult" />
                  <div className="ticket-select-info">
                    <h4>Adult Ticket</h4>
                    <p>Ages 13 - 64. Full access to all exhibits.</p>
                  </div>
                  <div className="ticket-select-price">${35 * multiplier}</div>
                  <div className="counter-controls small">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))}>−</button>
                    <span>{adults}</span>
                    <button onClick={() => setAdults(adults + 1)}>+</button>
                  </div>
                </div>

                <div className="ticket-select-item">
                  <img src="https://images.unsplash.com/photo-1542880941-18edbfce011a?w=100" alt="Child" />
                  <div className="ticket-select-info">
                    <h4>Child Ticket</h4>
                    <p>Ages 3 - 12. Must be accompanied by an adult.</p>
                  </div>
                  <div className="ticket-select-price">${20 * multiplier}</div>
                  <div className="counter-controls small">
                    <button onClick={() => setChildren(Math.max(0, children - 1))}>−</button>
                    <span>{children}</span>
                    <button onClick={() => setChildren(children + 1)}>+</button>
                  </div>
                </div>
              </div>

              <div className="booking-card" style={{ marginTop: '30px' }}>
                <div className="card-header">ADD-ON SERVICES</div>
                <div style={{ padding: '5px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <input type="checkbox" checked={addons.includes('Guided Tour')} onChange={() => handleAddonToggle('Guided Tour')} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#1B5E3C' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#111', fontSize: '15px' }}>Expert Guided Tour</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>1-hour walking tour with a zoo expert.</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#1B5E3C' }}>+$15 / person</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <input type="checkbox" checked={addons.includes('Mobility Scooter')} onChange={() => handleAddonToggle('Mobility Scooter')} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#1B5E3C' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#111', fontSize: '15px' }}>Mobility Scooter Rental</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>All-day rental for easy navigation.</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#1B5E3C' }}>+$25 / day</div>
                  </div>
                </div>
              </div>

              <div className="booking-actions">
                 <button className="btn-back" onClick={handlePrev}>Back</button>
                 <button className="btn-next" onClick={handleNext}>Review Order</button>
              </div>
            </div>

            <div className="booking-sidebar">
              <div className="summary-card">
                <h3>Booking Summary</h3>
                <div className="summary-row">
                  <span>Adult Tickets ({adults})</span>
                  <strong>${adults * 35 * multiplier}.00</strong>
                </div>
                <div className="summary-row">
                  <span>Child Tickets ({children})</span>
                  <strong>${children * 20 * multiplier}.00</strong>
                </div>
                {addons.includes('Guided Tour') && (
                  <div className="summary-row">
                    <span>Guided Tour (x{adults + children})</span>
                    <strong>${15 * (adults + children)}.00</strong>
                  </div>
                )}
                {addons.includes('Mobility Scooter') && (
                  <div className="summary-row">
                    <span>Mobility Scooter (x1)</span>
                    <strong>$25.00</strong>
                  </div>
                )}
                <div className="divider"></div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>${subtotal}.00</strong>
                </div>
                
                <div className="total-price-box">
                  <div>TOTAL PRICE</div>
                  <div className="price">${subtotal}.00</div>
                </div>

                <button className="btn-checkout" onClick={handleNext}>Review Order</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="booking-layout">
            <div className="booking-main">
              <h2 className="booking-title">Review Your Visit</h2>
              <p className="booking-desc">Please confirm your booking details before proceeding to payment.</p>

              <div className="review-details-card">
                 <div className="review-grid">
                   <div>
                     <div className="detail-label">VISITOR NAME</div>
                     <div className="detail-value">{profile.fullName}</div>
                   </div>
                   <div>
                     <div className="detail-label">ENTRY TIME</div>
                     <div className="detail-value">09:30 AM - {ticketType}</div>
                   </div>
                   <div>
                     <div className="detail-label">ZONE ACCESS</div>
                     <div className="detail-value">{ticketType === 'VIP Safari Tour' ? 'All Zones + VIP Safari' : 'All Zones'}</div>
                   </div>
                   <div>
                     <div className="detail-label">VISIT DATE</div>
                     <div className="detail-value">{selectedDate}</div>
                   </div>
                   <div>
                     <div className="detail-label">BOOKING REFERENCE</div>
                     <div className="detail-value">ZL - 8294 - XP</div>
                   </div>
                 </div>

                 <div className="divider" style={{ margin: '30px 0' }}></div>

                 <div className="detail-label" style={{ marginBottom: '15px' }}>TICKETS</div>
                 <div className="review-ticket-row">
                    <div><Users size={16}/> Adult</div>
                    <div>x {adults}</div>
                 </div>
                 <div className="review-ticket-row">
                    <div><Users size={16}/> Child (Under 12)</div>
                    <div>x {children}</div>
                 </div>
              </div>

              <div className="conservation-banner">
                 <ShieldCheck size={32} color="#fff" />
                 <div>
                   <h4>Conservation Contribution</h4>
                   <p>Your booking includes a $5.00 donation to the Global Wildlife Preservation fund. Thank you for supporting our mission.</p>
                 </div>
              </div>
            </div>

            <div className="booking-sidebar">
              <div className="summary-card">
                <h3>Payment Summary</h3>
                <div className="summary-row">
                  <span>Adult Tickets ({adults} x ${35 * multiplier})</span>
                  <strong>${adults * 35 * multiplier}.00</strong>
                </div>
                <div className="summary-row">
                  <span>Child Ticket ({children} x ${20 * multiplier})</span>
                  <strong>${children * 20 * multiplier}.00</strong>
                </div>
                {addons.includes('Guided Tour') && (
                  <div className="summary-row">
                    <span>Guided Tour (x{adults + children})</span>
                    <strong>${15 * (adults + children)}.00</strong>
                  </div>
                )}
                {addons.includes('Mobility Scooter') && (
                  <div className="summary-row">
                    <span>Mobility Scooter (x1)</span>
                    <strong>$25.00</strong>
                  </div>
                )}
                <div className="summary-row">
                  <span>Conservation Fee</span>
                  <strong>$5.00</strong>
                </div>
                <div className="divider"></div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>${subtotal}.00</strong>
                </div>
                
                <div className="total-price-box light-green">
                  <div>Total Amount</div>
                  <div className="price">${total}.00</div>
                  <div style={{fontSize:'10px', opacity:0.7, fontWeight:'normal', marginTop:'5px'}}>USD INC. TAX</div>
                </div>

                <button className="btn-checkout" onClick={handleNext}>Confirm Booking</button>
                <button className="btn-back-outline" onClick={handlePrev}>Back to Details</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="success-screen">
             <div className="success-icon"><Check size={40} color="#166534" /></div>
             <h2>Booking Confirmed!</h2>
             <p>Your tickets have been successfully created and sent to your email.</p>
             <div className="success-ref">Reference: <strong>#{createdTicketId}</strong></div>
             
             <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
               <button className="btn-back-outline" onClick={() => navigate('/user')} style={{ width: 'auto', padding: '14px 30px' }}>Return Home</button>
               <button className="btn-checkout" onClick={() => navigate('/user/tickets')} style={{ width: 'auto', padding: '14px 30px' }}>View My Tickets</button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingPage;
