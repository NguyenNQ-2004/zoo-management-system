import React, { useState } from 'react';
import { Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, Check, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [selectedDate, setSelectedDate] = useState('Oct 24, 2024');

  const steps = ['Visit Info', 'Tickets', 'Review', 'Success'];

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const totalVisitors = adults + children;
  const subtotal = (adults * 35) + (children * 20);
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
                  <div style={{ fontSize: '36px', fontWeight: 800 }}>{totalVisitors}</div>
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
                  <div className="ticket-select-price">$35</div>
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
                  <div className="ticket-select-price">$20</div>
                  <div className="counter-controls small">
                    <button onClick={() => setChildren(Math.max(0, children - 1))}>−</button>
                    <span>{children}</span>
                    <button onClick={() => setChildren(children + 1)}>+</button>
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
                  <strong>${adults * 35}.00</strong>
                </div>
                <div className="summary-row">
                  <span>Child Tickets ({children})</span>
                  <strong>${children * 20}.00</strong>
                </div>
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
                     <div className="detail-value">Nguyen User</div>
                   </div>
                   <div>
                     <div className="detail-label">ENTRY TIME</div>
                     <div className="detail-value">09:30 AM - General Admission</div>
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
                  <span>Adult Tickets ({adults} x $35)</span>
                  <strong>${adults * 35}.00</strong>
                </div>
                <div className="summary-row">
                  <span>Child Ticket ({children} x $20)</span>
                  <strong>${children * 20}.00</strong>
                </div>
                <div className="summary-row">
                  <span>Conservation Fee</span>
                  <strong>$5.00</strong>
                </div>
                <div className="divider"></div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>${subtotal + 5}.00</strong>
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
             <div className="success-ref">Reference: <strong>#ZLX-8294-XP</strong></div>
             
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
