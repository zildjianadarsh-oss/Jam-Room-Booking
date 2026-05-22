import { useState, useEffect } from "react";

// ── CONFIG – edit these ──────────────────────────────────────────────
const STUDIO_NAME = "Astral Studios";
const UPI_ID = "zildjianadarsh-3@okhdfcbank";
const RATE_PER_HOUR = 750;               // ← ₹ per hour
const OPEN_HOUR = 9;                     // 9 AM
const CLOSE_HOUR = 23;                   // 11 PM
const WHATSAPP_NUMBER = "919645858385";
// ────────────────────────────────────────────────────────────────────

const DURATIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

// Dummy existing bookings (in a real app, these come from a backend/sheet)
const EXISTING_BOOKINGS = [
  { date: formatDate(new Date()), start: 10, duration: 2, name: "The Noise Boys" },
  { date: formatDate(new Date()), start: 14, duration: 1.5, name: "Rahul & Co" },
  { date: formatDate(addDays(new Date(), 1)), start: 11, duration: 3, name: "Frequency 5" },
];

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate()+n); return r; }
function hhmm(h) {
  const hh = Math.floor(h), mm = h % 1 === 0.5 ? "30" : "00";
  const ampm = hh >= 12 ? "PM" : "AM";
  const disp = hh > 12 ? hh-12 : hh === 0 ? 12 : hh;
  return `${disp}:${mm} ${ampm}`;
}
function googleCalLink({ name, phone, date, start, duration }) {
  const [y,m,d] = date.split("-").map(Number);
  const sh = Math.floor(start), sm = start%1===0.5?30:0;
  const eh = Math.floor(start+duration), em = (start+duration)%1===0.5?30:0;
  const fmt = (y,m,d,h,min) =>
    `${y}${String(m).padStart(2,"0")}${String(d).padStart(2,"0")}T${String(h).padStart(2,"0")}${String(min).padStart(2,"0")}00`;
  const start_str = fmt(y,m,d,sh,sm);
  const end_str   = fmt(y,m,d,eh,em);
  const details = encodeURIComponent(`Booked by ${name} | Phone: ${phone} | UPI Payment received`);
  const title   = encodeURIComponent(`🎸 ${STUDIO_NAME} – ${name}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start_str}/${end_str}&details=${details}`;
}

function isSlotTaken(date, start, duration, bookings) {
  const end = start + duration;
  return bookings.some(b => {
    if (b.date !== date) return false;
    const bEnd = b.start + b.duration;
    return start < bEnd && end > b.start;
  });
}

function getAvailableSlots(date, duration, bookings) {
  const slots = [];
  for (let h = OPEN_HOUR; h + duration <= CLOSE_HOUR; h += 0.5) {
    if (!isSlotTaken(date, h, duration, bookings)) slots.push(h);
  }
  return slots;
}

// ── WEEK CALENDAR ────────────────────────────────────────────────────
function WeekView({ selectedDate, onSelectDate, bookings }) {
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d;
  });
  const today = formatDate(new Date());
  const days = Array.from({length:7}, (_,i) => addDays(weekStart, i));

  function getBookingCount(date) {
    return bookings.filter(b => b.date === date).length;
  }

  return (
    <div style={{marginBottom:32}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <button onClick={() => setWeekStart(addDays(weekStart,-7))} style={navBtn}>‹ Prev</button>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:"#f5c842"}}>
          {MONTHS[weekStart.getMonth()]} {weekStart.getFullYear()}
        </span>
        <button onClick={() => setWeekStart(addDays(weekStart,7))} style={navBtn}>Next ›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
        {days.map(d => {
          const ds = formatDate(d);
          const isPast = ds < today;
          const isSelected = ds === selectedDate;
          const count = getBookingCount(ds);
          return (
            <button key={ds} disabled={isPast} onClick={() => onSelectDate(ds)}
              style={{
                background: isSelected ? "#f5c842" : isPast ? "#1a1a1a" : "#1e1e1e",
                border: isSelected ? "2px solid #f5c842" : "2px solid #333",
                borderRadius:12, padding:"12px 4px", cursor: isPast ? "not-allowed" : "pointer",
                opacity: isPast ? 0.35 : 1, transition:"all .2s",
              }}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,
                color: isSelected?"#111":"#888",letterSpacing:1}}>
                {DAYS[d.getDay()]}
              </div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,
                color: isSelected?"#111":"#fff",lineHeight:1.1}}>
                {d.getDate()}
              </div>
              {count>0 && (
                <div style={{fontSize:9,color:isSelected?"#333":"#f5c842",marginTop:3}}>
                  {count} booked
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── TIMELINE VIEW ───────────────────────────────────────────────────
function TimelineView({ date, bookings }) {
  const hours = Array.from({length: CLOSE_HOUR - OPEN_HOUR}, (_,i) => OPEN_HOUR+i);
  const dayBookings = bookings.filter(b => b.date === date);

  return (
    <div style={{marginBottom:28}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,
        color:"#888",letterSpacing:2,marginBottom:10}}>SCHEDULE FOR THIS DAY</div>
      <div style={{position:"relative",borderLeft:"2px solid #2a2a2a",paddingLeft:16}}>
        {hours.map(h => {
          const booking = dayBookings.find(b => b.start <= h && b.start + b.duration > h);
          const isStart = booking && booking.start === h;
          return (
            <div key={h} style={{display:"flex",alignItems:"flex-start",
              marginBottom:6,minHeight:32}}>
              <span style={{fontSize:11,color:"#555",width:64,flexShrink:0,paddingTop:2,fontFamily:"monospace"}}>
                {hhmm(h)}
              </span>
              {booking && isStart ? (
                <div style={{
                  background:"#2d1f00",border:"1px solid #f5c842",
                  borderRadius:6,padding:"4px 10px",fontSize:12,
                  color:"#f5c842",flexGrow:1,
                }}>
                  🎸 {booking.name} ({booking.duration}hr{booking.duration>1?"s":""})
                </div>
              ) : booking ? (
                <div style={{
                  background:"#1e1700",borderLeft:"3px solid #f5c842",
                  height:20,flexGrow:1,opacity:0.5,borderRadius:"0 4px 4px 0"
                }}/>
              ) : (
                <div style={{height:20,flexGrow:1,
                  borderBottom:"1px solid #1e1e1e"}}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── BOOKING FORM ─────────────────────────────────────────────────────
function BookingForm({ date, bookings, onBooked }) {
  const [duration, setDuration] = useState(2);
  const [slot, setSlot] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("form"); // form | pay | confirm

  const available = getAvailableSlots(date, duration, bookings);
  const amount = RATE_PER_HOUR * duration;

  function handleProceed() {
    if (!slot || !name.trim() || phone.trim().length < 10) return;
    setStep("pay");
  }

  function handleConfirmPayment() {
    const booking = { date, start: slot, duration, name: name.trim(), phone: phone.trim() };
    onBooked(booking);
    setStep("confirm");
  }

  const gcal = step==="confirm"
    ? googleCalLink({name:name.trim(), phone:phone.trim(), date, start:slot, duration})
    : null;

  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I've booked the Jam Room.\n📅 Date: ${date}\n⏰ Time: ${hhmm(slot)} – ${hhmm(slot+duration)}\n⏱ Duration: ${duration} hrs\n💰 Amount: ₹${amount}\n👤 Name: ${name}\n📱 Phone: ${phone}\n\nPayment sent to ${UPI_ID}. Please confirm! 🎸`
  )}`;

  if (step === "confirm") return (
    <div style={{textAlign:"center",padding:"32px 16px"}}>
      <div style={{fontSize:48,marginBottom:12}}>🎉</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,
        color:"#f5c842",letterSpacing:2,marginBottom:8}}>BOOKING REQUEST SENT!</div>
      <p style={{color:"#aaa",fontSize:14,marginBottom:24}}>
        Share your payment screenshot on WhatsApp and the studio will confirm your slot.
      </p>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <a href={wa} target="_blank" rel="noreferrer" style={btnGreen}>
          📲 Message on WhatsApp
        </a>
        <a href={gcal} target="_blank" rel="noreferrer" style={btnYellow}>
          📅 Add to Google Calendar
        </a>
      </div>
      <p style={{color:"#555",fontSize:11,marginTop:20}}>
        Studio owner: tap "Add to Google Calendar" after verifying payment
      </p>
    </div>
  );

  if (step === "pay") return (
    <div style={{padding:"8px 0"}}>
      <div style={{
        background:"#1a1a1a",border:"1px solid #f5c842",borderRadius:12,
        padding:24,marginBottom:20,textAlign:"center"
      }}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,
          color:"#888",letterSpacing:2,marginBottom:8}}>PAY VIA UPI</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,
          color:"#f5c842",letterSpacing:1,marginBottom:4}}>₹{amount}</div>
        <div style={{fontSize:12,color:"#aaa",marginBottom:16}}>
          for {duration} hr{duration!==1?"s":""} · {hhmm(slot)} – {hhmm(slot+duration)}
        </div>
        <div style={{
          background:"#111",borderRadius:8,padding:"10px 20px",
          fontFamily:"monospace",fontSize:18,color:"#fff",
          letterSpacing:2,display:"inline-block",marginBottom:16,
          border:"1px solid #333"
        }}>
          {UPI_ID}
        </div>
        <div style={{fontSize:11,color:"#666"}}>
          Open any UPI app → pay to this ID → screenshot it
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={() => setStep("form")} style={{...btnBase,flex:1,background:"#222",color:"#888"}}>
          ← Back
        </button>
        <button onClick={handleConfirmPayment} style={{...btnBase,flex:2,background:"#f5c842",color:"#111",fontWeight:700}}>
          I've Paid – Send Booking Request
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{marginBottom:20}}>
        <label style={labelStyle}>YOUR NAME</label>
        <input value={name} onChange={e=>setName(e.target.value)}
          placeholder="Band / Artist name" style={inputStyle}/>
      </div>
      <div style={{marginBottom:20}}>
        <label style={labelStyle}>PHONE NUMBER</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)}
          placeholder="10-digit mobile" maxLength={10} style={inputStyle}/>
      </div>
      <div style={{marginBottom:20}}>
        <label style={labelStyle}>DURATION</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {DURATIONS.map(d => (
            <button key={d} onClick={() => { setDuration(d); setSlot(null); }}
              style={{
                padding:"8px 14px",borderRadius:8,border:"2px solid",
                fontFamily:"'Bebas Neue',sans-serif",fontSize:15,cursor:"pointer",
                background: duration===d ? "#f5c842" : "#1a1a1a",
                borderColor: duration===d ? "#f5c842" : "#333",
                color: duration===d ? "#111" : "#aaa",
                transition:"all .15s",
              }}>
              {d}hr{d!==1?"s":""}
            </button>
          ))}
        </div>
        {duration && (
          <div style={{fontSize:11,color:"#888",marginTop:6}}>
            ₹{RATE_PER_HOUR} × {duration} = <span style={{color:"#f5c842",fontWeight:700}}>₹{amount}</span>
          </div>
        )}
      </div>
      <div style={{marginBottom:24}}>
        <label style={labelStyle}>PICK A START TIME</label>
        {available.length === 0 ? (
          <div style={{color:"#f56a42",fontSize:13,padding:"12px 0"}}>
            No slots available for {duration}hrs on this date. Try another day or duration.
          </div>
        ) : (
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {available.map(h => (
              <button key={h} onClick={() => setSlot(h)}
                style={{
                  padding:"8px 12px",borderRadius:8,border:"2px solid",
                  fontFamily:"monospace",fontSize:13,cursor:"pointer",
                  background: slot===h ? "#f5c842" : "#1a1a1a",
                  borderColor: slot===h ? "#f5c842" : "#2a2a2a",
                  color: slot===h ? "#111" : "#ccc",
                  transition:"all .15s",
                }}>
                {hhmm(h)}
              </button>
            ))}
          </div>
        )}
        {slot && (
          <div style={{fontSize:12,color:"#aaa",marginTop:8}}>
            Session: <span style={{color:"#f5c842"}}>{hhmm(slot)} – {hhmm(slot+duration)}</span>
          </div>
        )}
      </div>
      <button
        onClick={handleProceed}
        disabled={!slot || !name.trim() || phone.trim().length < 10}
        style={{
          ...btnBase,width:"100%",
          background: (!slot||!name.trim()||phone.trim().length<10) ? "#2a2a2a" : "#f5c842",
          color: (!slot||!name.trim()||phone.trim().length<10) ? "#555" : "#111",
          fontSize:18,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,
          cursor: (!slot||!name.trim()||phone.trim().length<10) ? "not-allowed" : "pointer",
        }}>
        PROCEED TO PAYMENT →
      </button>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
  const [bookings, setBookings] = useState(EXISTING_BOOKINGS);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  function handleBooked(booking) {
    setBookings(prev => [...prev, booking]);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        body { background:#0d0d0d; color:#fff; font-family:'DM Sans',sans-serif; min-height:100vh; }
        input::placeholder { color:#444; }
        input:focus { outline:none; border-color:#f5c842 !important; }
        button:hover:not(:disabled) { filter: brightness(1.1); }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#111; }
        ::-webkit-scrollbar-thumb { background:#333; border-radius:3px; }
      `}</style>

      {/* Header */}
      <div style={{
        background:"linear-gradient(135deg,#1a1200 0%,#0d0d0d 60%)",
        borderBottom:"1px solid #1e1e1e",
        padding:"28px 20px 20px",textAlign:"center",
        position:"relative",overflow:"hidden",
      }}>
        <div style={{
          position:"absolute",top:-40,right:-40,
          width:200,height:200,borderRadius:"50%",
          background:"radial-gradient(circle,#f5c84220,transparent 70%)",
          pointerEvents:"none",
        }}/>
        <div style={{fontSize:32,marginBottom:4}}>🎸</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:38,
          letterSpacing:4,color:"#f5c842",lineHeight:1}}>
          {STUDIO_NAME}
        </div>
        <div style={{fontSize:12,color:"#666",marginTop:6,letterSpacing:3}}>
          BOOK YOUR JAM SESSION
        </div>
        <div style={{
          display:"inline-block",marginTop:12,padding:"4px 16px",
          background:"#1a1a1a",borderRadius:20,fontSize:11,
          color:"#888",border:"1px solid #222",
        }}>
          {hhmm(OPEN_HOUR)} – {hhmm(CLOSE_HOUR)} · ₹{RATE_PER_HOUR}/hr
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:640,margin:"0 auto",padding:"24px 16px 60px"}}>
        
        {/* Week picker */}
        <section style={card}>
          <WeekView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            bookings={bookings}
          />
          <TimelineView date={selectedDate} bookings={bookings} />
        </section>

        {/* Booking form */}
        <section style={card}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,
            letterSpacing:2,color:"#f5c842",marginBottom:20}}>
            BOOK FOR {selectedDate}
          </div>
          <BookingForm
            key={selectedDate}
            date={selectedDate}
            bookings={bookings}
            onBooked={handleBooked}
          />
        </section>

        <div style={{textAlign:"center",fontSize:11,color:"#333",marginTop:24}}>
          Bookings are confirmed only after payment verification · {UPI_ID}
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const card = {
  background:"#111",border:"1px solid #1e1e1e",
  borderRadius:16,padding:20,marginBottom:20,
};
const labelStyle = {
  display:"block",fontFamily:"'Bebas Neue',sans-serif",
  fontSize:12,letterSpacing:2,color:"#666",marginBottom:8,
};
const inputStyle = {
  width:"100%",background:"#0d0d0d",border:"1px solid #2a2a2a",
  borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:15,
  fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s",
};
const btnBase = {
  padding:"14px 20px",borderRadius:10,border:"none",
  fontFamily:"'DM Sans',sans-serif",fontSize:14,
  cursor:"pointer",transition:"all .2s",
};
const btnGreen = {
  ...btnBase,background:"#1a3a1a",color:"#4ade80",
  border:"1px solid #2d5a2d",textDecoration:"none",
  display:"inline-block",
};
const btnYellow = {
  ...btnBase,background:"#f5c842",color:"#111",
  fontWeight:700,textDecoration:"none",
  display:"inline-block",
};
const navBtn = {
  background:"#1a1a1a",border:"1px solid #333",color:"#aaa",
  borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:14,
};
