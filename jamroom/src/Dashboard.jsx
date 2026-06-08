import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "Astral101";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxR-5TTaiTEIcijuwjyN052fFbHnGs1Hoieb1qZXcQtTouDp38yJtEp8T7V1JYGDYL9/exec";
const LOGO_B64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCADeAZADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD4yooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAopyqWYAAknjiul1jwJ4n0bwxB4i1TSpLXT7iQRxvIwDEkZGV6gHB5IoA5iiiigAopQCaSgAooooAKKUgikoAKKKXFACUUuDSUAFFFKATQAlFFFABRRTtp25xQA2iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKuaRpt7q2oQWGnWst1dTttjijXLMas+FdA1XxJrdvpOkWrXN1M2Ao6KO7MewHc16prWr6N8JdOl8PeFZYb7xXMmzUdXCgrag9Y4vf/ACfYA634QfD3QPDviW3sdVEOs+KEj+0TxJ80GmJ23HoZCSMf5NcN+0l46fxH4rfQ7KYtpeluU+U8SzdGb3A6D8a6zw7PJ8N/gVe+KLhyfEHiNv3LyHMg3A7Tk8nC5c+5FfP9tC97eRxedEjSuAZJn2qCT1Zuw96AK1a3hXQdR8Sa5a6PpUJmurlwqDsB3Y+gA5JrrNM8AaGxQaj8RvD1vIxAEVssly5J7DAAJr1i20zwR8GtHnt9S1m/k1bWYSq3NvbD7RFDjBCqT8nJ6nnP0oA8e+J/9iaNcW/h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";
const OPEN_HOUR = 9;
const CLOSE_HOUR = 23;
const RATE = 750;

// ── Helpers ──────────────────────────────────────────────────────────
function cleanDate(raw) {
  if (!raw) return "";
  const s = String(raw);
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // Try parsing
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return d.getFullYear() + "-" +
      String(d.getMonth()+1).padStart(2,"0") + "-" +
      String(d.getDate()).padStart(2,"0");
  }
  return s;
}

function cleanTime(raw) {
  if (!raw) return "";
  const s = String(raw);
  if (/\d+:\d+\s*(AM|PM)/i.test(s)) return s;
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const disp = h > 12 ? h-12 : h === 0 ? 12 : h;
    return disp + ":" + String(m).padStart(2,"0") + " " + ampm;
  }
  return s;
}

function parseTimeToHour(timeStr) {
  const s = cleanTime(timeStr);
  const parts = s.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!parts) return 0;
  let h = parseInt(parts[1]);
  const m = parseInt(parts[2]);
  const ampm = parts[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h + m / 60;
}

function formatDateDisplay(raw) {
  const d = cleanDate(raw);
  if (!d) return raw;
  const [y,m,day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const dateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(day));
  return days[dateObj.getDay()] + " " + parseInt(day) + " " + months[parseInt(m)-1];
}

function todays() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

// ── Day Timeline ─────────────────────────────────────────────────────
function DayTimeline({ bookings }) {
  const total = CLOSE_HOUR - OPEN_HOUR;
  const now = new Date();
  const nowH = now.getHours() + now.getMinutes()/60;
  const markers = [9,11,13,15,17,19,21,23];

  return (
    <div style={{marginBottom:8}}>
      <div style={{position:"relative",height:32,background:"#0d0d0d",borderRadius:8,overflow:"hidden",border:"1px solid #1e1e1e"}}>
        {bookings.map((b,i) => {
          const start = parseTimeToHour(b.startTime);
          const end = parseTimeToHour(b.endTime);
          const left = ((start - OPEN_HOUR) / total) * 100;
          const width = ((end - start) / total) * 100;
          const color = b.status==="Confirmed"?"#f5c842":b.status==="Cancelled"?"#333":"#f59e42";
          return (
            <div key={i} style={{
              position:"absolute",left:left+"%",width:width+"%",
              top:4,bottom:4,background:color,borderRadius:4,
              display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"
            }} title={b.name}>
              <span style={{fontSize:8,color:"#111",fontWeight:700,whiteSpace:"nowrap",padding:"0 4px",overflow:"hidden",textOverflow:"ellipsis"}}>
                {b.name}
              </span>
            </div>
          );
        })}
        {/* Now line */}
        {nowH >= OPEN_HOUR && nowH <= CLOSE_HOUR && (
          <div style={{position:"absolute",left:((nowH-OPEN_HOUR)/total*100)+"%",top:0,bottom:0,width:2,background:"#fff",opacity:0.7,zIndex:2}}/>
        )}
      </div>
      <div style={{position:"relative",height:14,marginTop:2}}>
        {markers.map(h => (
          <span key={h} style={{
            position:"absolute",left:((h-OPEN_HOUR)/total*100)+"%",
            fontSize:8,color:"#444",fontFamily:"monospace",
            transform:"translateX(-50%)",whiteSpace:"nowrap"
          }}>{h>12?h-12+"p":h===12?"12p":h+"a"}</span>
        ))}
      </div>
    </div>
  );
}

// ── Booking Card ─────────────────────────────────────────────────────
function BookingCard({ b, isOpen, onToggle, onUpdate, isUpdating }) {
  const sc = b.status==="Confirmed"?"#4ade80":b.status==="Cancelled"?"#c44":"#f59e42";
  const bg = b.status==="Confirmed"?"#0a1a0a":b.status==="Cancelled"?"#1a0505":"#1a1200";
  const waMsg = "Hi " + b.name + "! Your Astral Studios jam session is confirmed!\nDate: " + formatDateDisplay(b.date) + " | Time: " + cleanTime(b.startTime) + " to " + cleanTime(b.endTime) + ". See you! - Astral Studios";

  return (
    <div onClick={onToggle} style={{
      background:"#111",border:"1px solid "+(isOpen?"#f5c842":"#1e1e1e"),
      borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"all .15s"
    }}>
      {/* Status bar */}
      <div style={{height:3,background:sc,opacity:0.7}}/>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:"#fff"}}>{b.name}</div>
            <div style={{fontSize:11,color:"#666",marginTop:2}}>{"📱 "}{b.phone}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#f5c842",lineHeight:1}}>{"₹"}{parseFloat(b.amount)||0}</div>
            <div style={{fontSize:10,color:sc,marginTop:3,fontWeight:600}}>{b.status}</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div style={{background:"#0d0d0d",borderRadius:6,padding:"6px 10px"}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:2}}>DATE</div>
            <div style={{fontSize:12,color:"#ccc",fontWeight:600}}>{formatDateDisplay(b.date)}</div>
          </div>
          <div style={{background:"#0d0d0d",borderRadius:6,padding:"6px 10px"}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:2}}>TIME</div>
            <div style={{fontSize:12,color:"#ccc",fontWeight:600}}>{cleanTime(b.startTime)} – {cleanTime(b.endTime)}</div>
          </div>
          <div style={{background:"#0d0d0d",borderRadius:6,padding:"6px 10px"}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:2}}>DURATION</div>
            <div style={{fontSize:12,color:"#ccc",fontWeight:600}}>{b.duration} hr{b.duration!=="1"?"s":""}</div>
          </div>
          <div style={{background:"#0d0d0d",borderRadius:6,padding:"6px 10px"}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:2}}>BOOKED AT</div>
            <div style={{fontSize:10,color:"#888"}}>{b.bookedAt}</div>
          </div>
        </div>

        {isOpen && (
          <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #1e1e1e"}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {b.status !== "Confirmed" && (
                <button onClick={e=>{e.stopPropagation();onUpdate("Confirmed");}} disabled={isUpdating}
                  style={{flex:1,minWidth:90,background:"#0d2a0d",color:"#4ade80",border:"1px solid #1a4a1a",borderRadius:8,padding:"10px",cursor:"pointer",fontSize:13,fontWeight:600}}>
                  {isUpdating?"...":"✅ Confirm"}
                </button>
              )}
              <a href={"https://wa.me/91"+b.phone+"?text="+encodeURIComponent(waMsg)}
                target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
                style={{flex:1,minWidth:90,background:"#0d2a0d",color:"#4ade80",border:"1px solid #1a4a1a",borderRadius:8,padding:10,fontSize:13,fontWeight:600,textAlign:"center",display:"block"}}>
                {"📲 WhatsApp"}
              </a>
              {b.status !== "Cancelled" && (
                <button onClick={e=>{e.stopPropagation();onUpdate("Cancelled");}} disabled={isUpdating}
                  style={{background:"#1a0505",color:"#c44",border:"1px solid #3a0a0a",borderRadius:8,padding:"10px 14px",cursor:"pointer",fontSize:13}}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stats Card ───────────────────────────────────────────────────────
function StatsBar({ bookings }) {
  const confirmed = bookings.filter(b=>b.status==="Confirmed");
  const pending = bookings.filter(b=>b.status==="Pending");
  const revenue = confirmed.reduce((s,b)=>s+(parseFloat(b.amount)||0),0);
  const totalHours = confirmed.reduce((s,b)=>s+(parseFloat(b.duration)||0),0);
  const today = todays();
  const todayB = bookings.filter(b=>cleanDate(b.date)===today);
  const upcoming = bookings.filter(b=>cleanDate(b.date)>today);

  // Hours booked per day of week
  const dowCounts = [0,0,0,0,0,0,0];
  confirmed.forEach(b => {
    const d = new Date(cleanDate(b.date));
    if (!isNaN(d)) dowCounts[d.getDay()] += parseFloat(b.duration)||0;
  });
  const maxDow = Math.max(...dowCounts, 1);
  const dowLabels = ["S","M","T","W","T","F","S"];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
      {/* Main stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {[
          {label:"TODAY",val:todayB.length,sub:"sessions",col:"#f5c842"},
          {label:"UPCOMING",val:upcoming.length,sub:"booked",col:"#a78bfa"},
          {label:"PENDING",val:pending.length,sub:"to verify",col:"#f59e42"},
          {label:"REVENUE",val:"₹"+(revenue/1000).toFixed(1)+"k",sub:"confirmed",col:"#4ade80"},
        ].map((s,i)=>(
          <div key={i} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:"#555",letterSpacing:2,marginBottom:3}}>{s.label}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:s.col,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:9,color:"#444",marginTop:2}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:10,padding:"12px 14px"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:"#555",letterSpacing:2,marginBottom:8}}>HOURS BOOKED BY DAY</div>
          <div style={{display:"flex",gap:4,alignItems:"flex-end",height:36}}>
            {dowCounts.map((v,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:"100%",background:v>0?"#f5c842":"#1e1e1e",borderRadius:2,height:Math.max(2,v/maxDow*28)+"px",transition:"height .3s"}}/>
                <span style={{fontSize:7,color:"#555"}}>{dowLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:10,padding:"12px 14px"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:"#555",letterSpacing:2,marginBottom:6}}>JAM ROOM STATS</div>
          <div style={{fontSize:11,color:"#888",lineHeight:1.8}}>
            <div>🎸 <span style={{color:"#f5c842",fontWeight:700}}>{totalHours}h</span> total booked</div>
            <div>✅ <span style={{color:"#4ade80",fontWeight:700}}>{confirmed.length}</span> confirmed</div>
            <div>📊 <span style={{color:"#a78bfa",fontWeight:700}}>{bookings.length > 0 ? Math.round(confirmed.length/bookings.length*100) : 0}%</span> confirm rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────
export default function Dashboard() {
  const [auth,setAuth] = useState(false);
  const [pw,setPw] = useState("");
  const [err,setErr] = useState(false);
  const [bookings,setBookings] = useState([]);
  const [loading,setLoading] = useState(false);
  const [view,setView] = useState("today");
  const [sel,setSel] = useState(null);
  const [updating,setUpdating] = useState(null);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch(SHEET_URL + "?t=" + Date.now());
      const data = await res.json();
      if (Array.isArray(data)) {
        const cleaned = data.map(b => ({
          ...b,
          date: cleanDate(b.date),
          startTime: cleanTime(b.startTime),
          endTime: cleanTime(b.endTime),
        }));
        setBookings(cleaned);
      }
    } catch(e) { console.log("Fetch error",e); }
    setLoading(false);
  }

  useEffect(() => { if (auth) fetchBookings(); }, [auth]);

  async function updateStatus(b, newStatus) {
    const key = b.name + b.date + b.startTime;
    setUpdating(key);
    try {
      await fetch(SHEET_URL, {
        method:"POST", mode:"no-cors",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          action:"updateStatus",
          name:b.name, phone:b.phone,
          date:b.date, startTime:b.startTime,
          status:newStatus
        })
      });
      setBookings(prev => prev.map(bk =>
        bk.name===b.name && bk.date===b.date && bk.startTime===b.startTime
          ? {...bk, status:newStatus} : bk
      ));
    } catch(e) { console.log("Update error",e); }
    setUpdating(null);
    setSel(null);
  }

  function login() {
    if (pw === ADMIN_PASSWORD) { setAuth(true); setErr(false); }
    else setErr(true);
  }

  const today = todays();
  const todayB = bookings.filter(b => b.date === today);
  const upcomingB = bookings.filter(b => b.date > today).sort((a,b)=>a.date.localeCompare(b.date));
  const allB = [...bookings].sort((a,b)=>b.date.localeCompare(a.date));
  const list = view==="today"?todayB:view==="upcoming"?upcomingB:allB;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'DM Sans',sans-serif;background:#0d0d0d;color:#fff;}
    input:focus{outline:none;}
    button:hover:not(:disabled){filter:brightness(1.1);}
    a{text-decoration:none;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-thumb{background:#222;border-radius:2px;}
  `;

  if (!auth) return (
    <div style={{minHeight:"100vh",background:"#0d0d0d",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{css}</style>
      <div style={{width:"100%",maxWidth:360,textAlign:"center"}}>
        <img src={LOGO_B64} style={{width:200,height:55,objectFit:"contain",display:"block",margin:"0 auto 24px"}} alt="Astral Studios"/>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"#f5c842",letterSpacing:3,marginBottom:4}}>ADMIN DASHBOARD</div>
        <div style={{fontSize:11,color:"#555",marginBottom:28,letterSpacing:2}}>ASTRAL STUDIOS</div>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Enter admin password"
          style={{width:"100%",background:"#111",border:"1px solid "+(err?"#c44":"#2a2a2a"),borderRadius:10,padding:"13px 16px",color:"#fff",fontSize:15,marginBottom:10}}/>
        {err && <div style={{color:"#c44",fontSize:12,marginBottom:10}}>Wrong password</div>}
        <button onClick={login} style={{width:"100%",background:"#f5c842",color:"#111",border:"none",borderRadius:10,padding:14,fontSize:16,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,cursor:"pointer"}}>
          LOGIN
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0d0d0d",color:"#fff"}}>
      <style>{css}</style>

      {/* Header */}
      <div style={{background:"#111",borderBottom:"1px solid #1a1a1a",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src={LOGO_B64} style={{height:30,objectFit:"contain"}} alt="logo"/>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:"#f5c842",letterSpacing:2}}>ASTRAL STUDIOS</div>
            <div style={{fontSize:9,color:"#555",letterSpacing:1}}>JAM ROOM DASHBOARD</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={fetchBookings} disabled={loading}
            style={{background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#888",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:11}}>
            {loading?"⏳":"↻"} {loading?"Loading...":"Refresh"}
          </button>
          <button onClick={()=>setAuth(false)}
            style={{background:"none",border:"1px solid #222",color:"#444",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11}}>
            Exit
          </button>
        </div>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"14px 14px 60px"}}>

        <StatsBar bookings={bookings}/>

        {/* Today timeline */}
        {todayB.length > 0 && (
          <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:12,padding:"14px 16px",marginBottom:14}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:"#f5c842",letterSpacing:2,marginBottom:10}}>TODAY'S TIMELINE — {formatDateDisplay(today)}</div>
            <DayTimeline bookings={todayB}/>
            <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
              {todayB.map((b,i)=>(
                <div key={i} style={{fontSize:10,color:"#888",background:"#0d0d0d",borderRadius:4,padding:"3px 8px",border:"1px solid #1e1e1e"}}>
                  {cleanTime(b.startTime)} {b.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {[
            ["today","Today","("+todayB.length+")"],
            ["upcoming","Upcoming","("+upcomingB.length+")"],
            ["all","All","("+allB.length+")"]
          ].map(([v,l,c])=>(
            <button key={v} onClick={()=>{setView(v);setSel(null);}} style={{
              flex:1,padding:"9px 6px",borderRadius:8,border:"2px solid",cursor:"pointer",
              fontFamily:"'Bebas Neue',sans-serif",fontSize:13,letterSpacing:1,
              background:view===v?"#f5c842":"#111",
              borderColor:view===v?"#f5c842":"#222",
              color:view===v?"#111":"#666",
            }}>{l} <span style={{fontSize:11}}>{c}</span></button>
          ))}
        </div>

        {loading ? (
          <div style={{textAlign:"center",padding:"40px 20px",color:"#555",fontSize:13}}>
            Loading bookings from Google Sheets...
          </div>
        ) : list.length === 0 ? (
          <div style={{textAlign:"center",padding:"40px 20px",color:"#333",fontSize:13}}>
            No bookings {view==="today"?"today":view==="upcoming"?"upcoming yet":"found"}
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {list.map((b,i) => {
              const gi = bookings.indexOf(b);
              const key = b.name+b.date+b.startTime;
              return (
                <BookingCard
                  key={i}
                  b={b}
                  isOpen={sel===gi}
                  onToggle={()=>setSel(sel===gi?null:gi)}
                  onUpdate={status=>updateStatus(b,status)}
                  isUpdating={updating===key}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
