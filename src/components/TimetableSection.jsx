import React, { useState, useMemo, useEffect } from 'react'
import { TIMETABLE, DAYS, TIME_SLOTS, SELECTOR_OPTIONS } from '../data/timetableData'

export default function TimetableSection({ favorites = [], onToggleFavorite }) {
  // Session States
  const [semester, setSemester] = useState(SELECTOR_OPTIONS.semesters[2]) // Sem 3 default
  const [branch, setBranch] = useState(SELECTOR_OPTIONS.branches[0]) // CSE default
  const [section, setSection] = useState(SELECTOR_OPTIONS.sections[0])
  const [year, setYear] = useState(SELECTOR_OPTIONS.years[1]) // 2nd year default
  const [batch, setBatch] = useState(SELECTOR_OPTIONS.batches[3]) // All Batches
  const [session, setSession] = useState(SELECTOR_OPTIONS.sessions[0])

  const [isLoading, setIsLoading] = useState(false)

  const handleSelectChange = (setter) => (e) => {
    setIsLoading(true)
    setter(e.target.value)
    setTimeout(() => setIsLoading(false), 800)
  }

  // View States
  const [viewMode, setViewMode] = useState('weekly') // 'weekly' | 'daily' | 'subject'
  const [selectedDay, setSelectedDay] = useState('Monday')
  
  // Search & Filter States
  const [query, setQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('timetable_search_history')) || ['DBMS', 'React JS', 'Dr. Sharma', 'Lab-3']
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [labFilter, setLabFilter] = useState(false)

  // System time for live lecture highlights
  const [systemTime, setSystemTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  // Calculate current active day & lecture slot
  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const currentDayName = daysMap[systemTime.getDay()]
  const activeDayName = currentDayName === 'Sunday' ? 'Monday' : currentDayName
  
  const currentMinutes = systemTime.getHours() * 60 + systemTime.getMinutes()

  const getCurrentSlotCode = () => {
    if (currentMinutes < 9 * 60) return null
    if (currentMinutes < 9 * 60 + 50) return 'S1'
    if (currentMinutes < 10 * 60 + 50) return 'S2'
    if (currentMinutes < 11 * 60 + 50) return 'S3'
    if (currentMinutes < 12 * 60 + 50) return 'S4'
    if (currentMinutes < 14 * 60) return 'LUNCH'
    if (currentMinutes < 14 * 60 + 50) return 'S5'
    if (currentMinutes < 15 * 60 + 50) return 'S6'
    if (currentMinutes < 16 * 60 + 50) return 'S7'
    return null
  }

  const activeSlotCode = getCurrentSlotCode()

  // Navigation handlers
  const handlePrevDay = () => {
    const idx = DAYS.indexOf(selectedDay)
    const prevIdx = (idx - 1 + DAYS.length) % DAYS.length
    setSelectedDay(DAYS[prevIdx])
  }

  const handleNextDay = () => {
    const idx = DAYS.indexOf(selectedDay)
    const nextIdx = (idx + 1) % DAYS.length
    setSelectedDay(DAYS[nextIdx])
  }

  // Handle Search Submission & History updates
  const addToHistory = (term) => {
    if (!term.trim()) return
    const filtered = searchHistory.filter(h => h.toLowerCase() !== term.toLowerCase())
    const next = [term, ...filtered].slice(0, 5)
    setSearchHistory(next)
    localStorage.setItem('timetable_search_history', JSON.stringify(next))
  }

  // Generate Autocomplete Suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    const results = new Set()
    const lowerQ = query.toLowerCase()

    Object.values(TIMETABLE).forEach(slots => {
      Object.values(slots).forEach(item => {
        if (!item) return
        if (item.subject.toLowerCase().includes(lowerQ)) results.add(item.subject)
        if (item.faculty.toLowerCase().includes(lowerQ)) results.add(item.faculty)
        if (item.room.toLowerCase().includes(lowerQ)) results.add(item.room)
      })
    })

    return Array.from(results).slice(0, 4)
  }, [query])

  // Timetable normalization & query application
  const filteredTimetable = useMemo(() => {
    const next = {}
    const lowerQ = query.toLowerCase().trim()

    DAYS.forEach(day => {
      next[day] = {}
      TIME_SLOTS.forEach(slot => {
        const item = TIMETABLE[day]?.[slot.code]
        if (!item) {
          next[day][slot.code] = null
          return
        }

        // Apply filters
        if (labFilter && item.type !== 'Lab') {
          next[day][slot.code] = null
          return
        }

        if (lowerQ) {
          const matchSubject = item.subject.toLowerCase().includes(lowerQ)
          const matchFaculty = item.faculty.toLowerCase().includes(lowerQ)
          const matchRoom = item.room.toLowerCase().includes(lowerQ)
          const matchDay = day.toLowerCase().includes(lowerQ)
          
          if (!matchSubject && !matchFaculty && !matchRoom && !matchDay) {
            next[day][slot.code] = null
            return
          }
        }

        next[day][slot.code] = item
      })
    })

    return next
  }, [query, labFilter])

  // Count total classes in weekly view
  const weeklyClassStats = useMemo(() => {
    let lectures = 0
    let labs = 0
    let frees = 0

    DAYS.forEach(day => {
      TIME_SLOTS.forEach(slot => {
        if (slot.isLunch) return
        const item = filteredTimetable[day]?.[slot.code]
        if (!item) {
          frees++
        } else if (item.type === 'Lab') {
          labs++
        } else {
          lectures++
        }
      })
    })

    return { lectures, labs, frees }
  }, [filteredTimetable])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Session Selectors Card */}
      <div className="glass-card theme-transition" style={{ padding: '16px 20px' }}>
        <div className="selector-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SAILING SEASON</label>
            <select className="custom-select" value={session} onChange={handleSelectChange(setSession)}>
              {SELECTOR_OPTIONS.sessions.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>FLEET YEAR</label>
            <select className="custom-select" value={year} onChange={handleSelectChange(setYear)}>
              {SELECTOR_OPTIONS.years.map((y, i) => <option key={i} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>MASTERY</label>
            <select className="custom-select" value={branch} onChange={handleSelectChange(setBranch)}>
              {SELECTOR_OPTIONS.branches.map((b, i) => <option key={i} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>VOYAGE LEG (SEM)</label>
            <select className="custom-select" value={semester} onChange={handleSelectChange(setSemester)}>
              {SELECTOR_OPTIONS.semesters.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CREW DIVISION</label>
            <select className="custom-select" value={section} onChange={handleSelectChange(setSection)}>
              {SELECTOR_OPTIONS.sections.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>WATCH BATCH</label>
            <select className="custom-select" value={batch} onChange={handleSelectChange(setBatch)}>
              {SELECTOR_OPTIONS.batches.map((b, i) => <option key={i} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card theme-transition" style={{ padding: '16px 20px' }}>
        <div className="timetable-controls">
          <div className="filter-bar">
            {/* Search Input */}
            <div className="search-input-wrap">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onBlur={() => {
                  // Delay list collapse to handle clicks on suggestion list
                  setTimeout(() => setShowSuggestions(false), 200)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addToHistory(query)
                    setShowSuggestions(false)
                  }
                }}
                placeholder="🔎 Search by subject, captain, island, day..."
              />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="notifications-dropdown" style={{ top: '48px', width: '100%', position: 'absolute' }}>
                  {suggestions.map((sug, idx) => (
                    <div 
                      key={idx} 
                      className="notification-item" 
                      style={{ cursor: 'pointer', padding: '10px 14px' }}
                      onMouseDown={() => {
                        setQuery(sug)
                        addToHistory(sug)
                        setShowSuggestions(false)
                      }}
                    >
                      💡 Suggestion: <strong>{sug}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-btn-group">
              <button 
                className={`filter-btn ${viewMode === 'weekly' ? 'active' : ''}`}
                onClick={() => setViewMode('weekly')}
              >
                Weekly Sea Chart
              </button>
              <button 
                className={`filter-btn ${viewMode === 'daily' ? 'active' : ''}`}
                onClick={() => setViewMode('daily')}
              >
                Daily Logbook
              </button>
              <button 
                className={`filter-btn ${viewMode === 'subject' ? 'active' : ''}`}
                onClick={() => setViewMode('subject')}
              >
                Subject-wise
              </button>
            </div>

            {/* Lab Filter */}
            <label className="lab-checkbox">
              <input 
                type="checkbox" 
                checked={labFilter} 
                onChange={(e) => setLabFilter(e.target.checked)} 
              />
              ⚔️ Expeditions & Drills Only
            </label>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="search-history-pills">
              <span>Recent:</span>
              {searchHistory.map((hist, idx) => (
                <span 
                  key={idx} 
                  className="history-pill"
                  onClick={() => {
                    setQuery(hist)
                    addToHistory(hist)
                  }}
                >
                  {hist}
                </span>
              ))}
              <span 
                className="history-pill" 
                style={{ background: 'transparent', color: 'var(--danger)', fontStyle: 'italic' }}
                onClick={() => {
                  setSearchHistory([])
                  localStorage.removeItem('timetable_search_history')
                }}
              >
                Clear
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Timetable Visualizer Display */}
      <div className="ships-ledger-container">
        <div className="ink-splatter" style={{ top: '-10px', right: '20px' }}></div>
        <div className="ink-splatter" style={{ bottom: '10px', left: '10px', transform: 'rotate(45deg) scale(0.6)' }}></div>
        
        <div className="ledger-header">The Ship's Ledger</div>
        
        {/* Weekly Stats Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>The Navigator's Map</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {semester} • {branch} • {section}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="pwa-badge" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
              📖 {weeklyClassStats.lectures} Lectures
            </span>
            <span className="pwa-badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
              ⚔️ {weeklyClassStats.labs} Expeditions
            </span>
            <span className="pwa-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
              ⚓ {weeklyClassStats.frees} Free Slots
            </span>
          </div>
        </div>

        {/* Daily view navigation bar */}
        {viewMode === 'daily' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', marginBottom: '16px' }}>
            <button className="attendance-counter-btn" onClick={handlePrevDay}>◀</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>{selectedDay}</span>
              <select 
                className="custom-select" 
                style={{ padding: '4px 8px', fontSize: '12px' }}
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {DAYS.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>
            <button className="attendance-counter-btn" onClick={handleNextDay}>▶</button>
          </div>
        )}

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px 0' }}>
            {TIME_SLOTS.map((_, i) => <div key={i} className="skeleton-box"></div>)}
          </div>
        ) : (
          <>
            {/* VIEW 1: Weekly Grid View */}
            {viewMode === 'weekly' && (
          <div className="timetable-scroll">
            <table className="modern-table theme-transition">
              <thead>
                <tr>
                  <th className="time-header">Time Slot</th>
                  {DAYS.map((day, idx) => (
                    <th key={idx} className={day === activeDayName ? 'highlight-current-day' : ''}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot, sIdx) => (
                  <tr key={sIdx}>
                    <td className="time-header">
                      <div className="time-slot-label">
                        <span className="time-text">{slot.label}</span>
                        <span className="slot-code">{slot.isLunch ? 'Break' : `Slot ${slot.code}`}</span>
                      </div>
                    </td>
                    
                    {DAYS.map((day, dIdx) => {
                      const item = filteredTimetable[day]?.[slot.code]
                      const isToday = day === activeDayName
                      const isCurrentLecture = isToday && slot.code === activeSlotCode
                      const isFav = item ? favorites.includes(item.subject) : false

                      if (isLoading) {
                        return (
                          <td key={dIdx} className={isToday ? 'highlight-current-day' : ''}>
                            <div className="skeleton-box"></div>
                          </td>
                        )
                      }

                      if (slot.isLunch) {
                        return (
                          <td key={dIdx} className={isToday ? 'highlight-current-day' : ''}>
                            <div className="lecture-cell is-lunch">
                              🍖 Rations & Rum
                            </div>
                          </td>
                        )
                      }

                      if (!item) {
                        return (
                          <td key={dIdx} className={isToday ? 'highlight-current-day' : ''}>
                            <div className="lecture-cell free-period">
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>⚓ Anchored</span>
                            </div>
                          </td>
                        )
                      }

                      return (
                        <td key={dIdx} className={isToday ? 'highlight-current-day' : ''}>
                          <div 
                            className={`lecture-cell ${isCurrentLecture ? 'highlight-current-cell' : ''}`}
                            style={{ borderLeft: `4px solid ${item.color || 'var(--accent)'}` }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span className="cell-subject" style={{ color: '#3e2723', fontWeight: 'bold' }}>{item.subject}</span>
                                <span 
                                  className="ledger-favorite-btn"
                                  onClick={() => onToggleFavorite(item.subject)}
                                >
                                  {isFav ? '⭐' : '☆'}
                                </span>
                              </div>
                              <span className="cell-type" style={{ background: 'transparent', color: '#1b1008', borderBottom: '1px dotted #1b1008' }}>
                                {item.type}
                              </span>
                            </div>
                            
                            <div className="cell-footer">
                              <span className="cell-faculty">{item.faculty}</span>
                              <span className="cell-room">{item.room}</span>
                            </div>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 2: Daily Card Timeline View */}
        {viewMode === 'daily' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {TIME_SLOTS.map((slot, idx) => {
              if (isLoading) {
                return (
                  <div key={idx} className="skeleton-box" style={{ margin: '0', padding: '16px 20px', minHeight: '80px' }}></div>
                )
              }

              const item = filteredTimetable[selectedDay]?.[slot.code]
              const isToday = selectedDay === activeDayName
              const isCurrentLecture = isToday && slot.code === activeSlotCode
              const isFav = item ? favorites.includes(item.subject) : false

              if (slot.isLunch) {
                return (
                  <div key={idx} className="lecture-cell is-lunch" style={{ minHeight: '50px', background: 'rgba(255,255,255,0.01)' }}>
                    🍖 Rations & Rum • {slot.label}
                  </div>
                )
              }

              if (!item) {
                return (
                  <div key={idx} className="lecture-cell free-period" style={{ padding: '14px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>🕒 {slot.label} — ⚓ Anchored (Free Period)</span>
                  </div>
                )
              }

              return (
                <div 
                  key={idx}
                  className={`subject-attendance-card ${isCurrentLecture ? 'highlight-current-cell' : ''}`}
                  style={{ borderLeft: `5px solid ${item.color || 'var(--accent)'}`, margin: 0, padding: '16px 20px' }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '8px 12px', borderRadius: '8px', textAlign: 'center', minWidth: '70px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Slot</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: item.color }}>{slot.code}</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 800 }}>{item.subject}</h4>
                        <span 
                          style={{ cursor: 'pointer', fontSize: '14px' }}
                          onClick={() => onToggleFavorite(item.subject)}
                        >
                          {isFav ? '⭐' : '☆'}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        🕒 {slot.label} • Room {item.room}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="cell-type" style={{ background: item.color + '22', color: item.color, border: `1px solid ${item.color}44` }}>
                      {item.type}
                    </span>
                    <div style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '4px' }}>
                      {item.faculty}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* VIEW 3: Subject-wise Grouped List */}
        {viewMode === 'subject' && (
          <div>
            {(() => {
              // Group lectures by subject
              const subjectsMap = {}
              DAYS.forEach(day => {
                TIME_SLOTS.forEach(slot => {
                  const item = filteredTimetable[day]?.[slot.code]
                  if (!item) return
                  
                  if (!subjectsMap[item.subject]) {
                    subjectsMap[item.subject] = {
                      subject: item.subject,
                      color: item.color,
                      faculty: item.faculty,
                      room: item.room,
                      type: item.type,
                      occurrences: []
                    }
                  }
                  subjectsMap[item.subject].occurrences.push({
                    day,
                    time: slot.label,
                    slot: slot.code
                  })
                })
              })

              const subjectsList = Object.values(subjectsMap)

              if (isLoading) {
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="skeleton-box" style={{ minHeight: '150px' }}></div>
                    ))}
                  </div>
                )
              }

              if (subjectsList.length === 0) {
                return (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No matching subjects found in filter.
                  </div>
                )
              }

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {subjectsList.map((sub, sIdx) => (
                    <div key={sIdx} className="glass-card theme-transition" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: sub.color }}>{sub.subject}</h4>
                        <span className="cell-type" style={{ background: sub.color + '15', color: sub.color }}>
                          {sub.type}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>🏴‍☠️ Captain: <strong>{sub.faculty}</strong></div>
                        <div>🏝️ Island: <strong>{sub.room}</strong></div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Weekly Slots</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                          {sub.occurrences.map((oc, oIdx) => (
                            <div key={oIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                              <strong style={{ color: 'var(--accent-light)' }}>{oc.day}</strong>
                              <span style={{ color: 'var(--text-muted)' }}>{oc.time} ({oc.slot})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  )
}
