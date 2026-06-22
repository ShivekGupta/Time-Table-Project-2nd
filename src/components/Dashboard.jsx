import React, { useState, useEffect } from 'react'
import { TIMETABLE, DAYS, TIME_SLOTS, ANNOUNCEMENTS, EVENTS } from '../data/timetableData'

export default function Dashboard({ 
  onNavigate, 
  attendanceData = {}, 
  themeColor = 'default',
  doubloons,
  setDoubloons,
  setAvatar
}) {
  const [role, setRole] = useState('student') // 'student' or 'faculty'
  const [time, setTime] = useState(new Date())
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('college_portal_notes') || '• Plot a course through React Hooks today.\n• Hunt down the DBMS normalization bounty.\n• Scrub the lab reports before Friday.'
  })

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleNotesChange = (e) => {
    setNotes(e.target.value)
    localStorage.setItem('college_portal_notes', e.target.value)
  }

  // Calculate current day and slot
  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const currentDayName = daysMap[time.getDay()]
  
  // Test override: If Sunday, let's mock Monday for demo purposes
  const activeDayName = currentDayName === 'Sunday' ? 'Monday' : currentDayName
  
  const currentMinutes = time.getHours() * 60 + time.getMinutes()

  const getCurrentSlot = () => {
    if (currentMinutes < 9 * 60) return null // Before classes
    if (currentMinutes < 9 * 60 + 50) return 'S1'
    if (currentMinutes < 10 * 60 + 50) return 'S2'
    if (currentMinutes < 11 * 60 + 50) return 'S3'
    if (currentMinutes < 12 * 60 + 50) return 'S4'
    if (currentMinutes < 14 * 60) return 'LUNCH'
    if (currentMinutes < 14 * 60 + 50) return 'S5'
    if (currentMinutes < 15 * 60 + 50) return 'S6'
    if (currentMinutes < 16 * 60 + 50) return 'S7'
    return null // Classes ended
  }

  const activeSlotCode = getCurrentSlot()

  // Get Today's Classes
  const todayClasses = TIMETABLE[activeDayName] || {}
  
  const getTodayClassList = () => {
    const list = []
    TIME_SLOTS.forEach(slot => {
      const classItem = todayClasses[slot.code]
      if (classItem) {
        list.push({
          ...classItem,
          slotCode: slot.code,
          slotLabel: slot.label,
          isCurrent: slot.code === activeSlotCode
        })
      } else if (slot.isLunch) {
        list.push({
          subject: 'Lunch Break',
          type: 'Break',
          room: 'Cafeteria',
          slotCode: 'LUNCH',
          slotLabel: slot.label,
          isCurrent: activeSlotCode === 'LUNCH',
          color: '#475569'
        })
      }
    })
    return list
  }

  const todayClassList = getTodayClassList()

  const currentClass = todayClassList.find(c => c.isCurrent)
  const upcomingClasses = todayClassList.filter(c => {
    // Return classes that haven't occurred yet
    const slotCode = c.slotCode
    if (slotCode === 'LUNCH') return false
    if (!activeSlotCode) return true // All classes if class day hasn't started
    return slotCode > activeSlotCode
  })

  // Attendance summary metrics
  const calculateOverallAttendance = () => {
    let totalAttended = 0
    let totalHeld = 0
    Object.values(attendanceData).forEach(subject => {
      totalAttended += subject.attended
      totalHeld += subject.total
    })
    if (totalHeld === 0) return 0
    return Math.round((totalAttended / totalHeld) * 100)
  }

  const overallAttendance = calculateOverallAttendance()

  const getPirateTitle = (att) => {
    if (att >= 90) return 'Pirate King 👑';
    if (att >= 75) return 'First Mate ⚓';
    if (att >= 50) return 'Deckhand 🧹';
    return 'Swab 🧽';
  };
  
  const pirateTitle = getPirateTitle(overallAttendance);

  return (
    <div className="dashboard-grid">
      {/* COLUMN 1: Today's live tracking and Upcoming Classes */}
      <div className="span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* User Role Switcher & Live Timer */}
        <div className="glass-card theme-transition" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>PIRATE TITLE</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <div style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--accent-light)', fontWeight: 'bold' }}>
                {pirateTitle}
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Live lecture panel */}
        <div className="glass-card ink-reveal theme-transition">
          <div className="card-title">
            <span className="nav-item-icon">🧭</span>
            <span>Today's Voyage Map ({activeDayName})</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Current Class */}
            <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
              <div>
                <span className="stat-lbl" style={{ color: 'var(--accent-light)' }}>Current Destination</span>
                {currentClass ? (
                  <div style={{ marginTop: '12px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>{currentClass.subject}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span className="cell-type" style={{ background: currentClass.color + '22', color: currentClass.color, border: `1px solid ${currentClass.color}44` }}>
                        {currentClass.type}
                      </span>
                      <span className="cell-type" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-sub)' }}>
                        {currentClass.slotLabel}
                      </span>
                    </div>
                    
                    <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>🏴‍☠️ Captain: <strong>{currentClass.faculty}</strong></div>
                      <div>🏝️ Island: <strong>{currentClass.room}</strong></div>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    ☕ The seas are calm. No active destinations right now. Rest in the tavern!
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Overview */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="stat-box" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="stat-lbl">Today's Waypoints</span>
                <span className="stat-val">{todayClassList.filter(c => c.type !== 'Break').length} Islands</span>
              </div>
              <div className="stat-box" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="stat-lbl">Active Portal Mode</span>
                <span className="stat-val" style={{ textTransform: 'capitalize' }}>{role}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Upcoming classes card */}
        <div className="glass-card ink-reveal theme-transition">
          <div className="card-title">
            <span className="nav-item-icon">🔭</span>
            <span>Upcoming Waypoints Today</span>
          </div>
          
          {upcomingClasses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingClasses.map((item, index) => (
                <div key={index} className="subject-attendance-card" style={{ padding: '12px 16px', margin: 0 }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{item.subject}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      🕒 {item.slotLabel} • Room {item.room}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="cell-type" style={{ background: item.color + '22', color: item.color, border: `1px solid ${item.color}44` }}>
                      {item.type}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {item.faculty}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              🎉 No more voyages scheduled for the rest of today!
            </div>
          )}
        </div>

      </div>

      {/* COLUMN 2: Sidebar Widgets (Attendance Shortcut, Notices, Calendar, Notes) */}
      <div className="dashboard-sidebar theme-transition" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Attendance Shortcut Card */}
        <div className="glass-card ink-reveal theme-transition" style={{ cursor: 'pointer' }} onClick={() => onNavigate('attendance')}>
          <div className="card-title" style={{ margin: 0, border: 0, padding: 0, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="nav-item-icon">⚓</span>
              <span>Ship's Integrity (Attendance)</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent-light)' }}>Inspect →</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-title)', color: overallAttendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                {overallAttendance}%
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {overallAttendance >= 75 ? '👍 Safe waters: Hull is strong' : '⚠️ Danger: Taking on water!'}
              </p>
            </div>
            
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(var(--accent) ${overallAttendance}%, rgba(255,255,255,0.05) 0)`, display: 'flex', alignItems: 'center', justify: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                ⭐
              </div>
            </div>
          </div>
        </div>

        {/* Important Announcements Section */}
        <div className="glass-card theme-transition">
          <div className="card-title">
            <span className="nav-item-icon">📜</span>
            <span>The Captain's Orders</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ANNOUNCEMENTS.map(ann => (
              <div key={ann.id} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: ann.type === 'Important' ? 'var(--danger)' : 'var(--accent-light)' }}>
                    {ann.type}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{ann.date}</span>
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0 2px' }}>{ann.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-sub)', lineContent: '1.4' }}>{ann.desc}</p>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
                  — {ann.sender}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Calendar Preview */}
        <div className="glass-card theme-transition">
          <div className="card-title">
            <span className="nav-item-icon">✨</span>
            <span>Constellation Events</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {EVENTS.map((evt, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '6px', textAlign: 'center', minWidth: '50px' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {new Date(evt.date).toLocaleDateString([], { month: 'short' })}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
                    {new Date(evt.date).getDate()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700 }}>{evt.title}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    📍 {evt.location} • {evt.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Notes Widget */}
        <div className="glass-card theme-transition">
          <div className="card-title">
            <span className="nav-item-icon">🖋️</span>
            <span>The Navigator's Log</span>
          </div>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Scribble your course and daily bounties here..."
            style={{
              width: '100%',
              height: '100px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              padding: '10px',
              fontSize: '13px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
            Saved automatically in browser storage
          </div>
        </div>

        {/* Pirate Shop Widget */}
        <div className="glass-card ink-reveal">
          <div className="card-title">
            <span className="nav-item-icon">🛍️</span>
            <span>Pirate Shop</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Parrot Avatar</span>
              <button 
                onClick={() => {
                  if (doubloons >= 50) {
                    setDoubloons(d => d - 50);
                    setAvatar('🦜');
                  } else {
                    alert('Not enough doubloons! You need 50.');
                  }
                }}
                className="filter-btn" 
                style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--accent)', color: '#fff' }}
              >
                Buy (50🪙)
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Captain Hat</span>
              <button 
                onClick={() => {
                  if (doubloons >= 100) {
                    setDoubloons(d => d - 100);
                    setAvatar('🎩');
                  } else {
                    alert('Not enough doubloons! You need 100.');
                  }
                }}
                className="filter-btn" 
                style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--accent)', color: '#fff' }}
              >
                Buy (100🪙)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
