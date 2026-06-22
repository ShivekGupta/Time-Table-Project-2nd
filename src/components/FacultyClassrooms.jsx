import React, { useState, useMemo } from 'react'
import { FACULTY_PROFILES, CLASSROOM_DETAILS } from '../data/timetableData'

export default function FacultyClassrooms() {
  const [subTab, setSubTab] = useState('faculty') // 'faculty' | 'classrooms'
  const [facSearch, setFacSearch] = useState('')
  const [roomSearch, setRoomSearch] = useState('')

  // Filter Faculty
  const filteredFaculty = useMemo(() => {
    const q = facSearch.toLowerCase().trim()
    if (!q) return FACULTY_PROFILES

    return FACULTY_PROFILES.filter(f => 
      f.name.toLowerCase().includes(q) ||
      f.dept.toLowerCase().includes(q) ||
      f.specialization.toLowerCase().includes(q) ||
      f.office.toLowerCase().includes(q)
    )
  }, [facSearch])

  // Filter Classrooms
  const filteredRooms = useMemo(() => {
    const q = roomSearch.toLowerCase().trim()
    if (!q) return CLASSROOM_DETAILS

    return CLASSROOM_DETAILS.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.building.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.facilities.some(f => f.toLowerCase().includes(q))
    )
  }, [roomSearch])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Directory Tab Selection Bar */}
      <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div className="filter-btn-group">
          <button 
            className={`filter-btn ${subTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setSubTab('faculty')}
          >
            🏴‍☠️ Crew Manifest
          </button>
          <button 
            className={`filter-btn ${subTab === 'classrooms' ? 'active' : ''}`}
            onClick={() => setSubTab('classrooms')}
          >
            ⚓ Ship Compartments
          </button>
        </div>

        {/* Search filter for selected directory */}
        {subTab === 'faculty' ? (
          <div className="search-input-wrap" style={{ maxWidth: '300px' }}>
            <input 
              type="text" 
              value={facSearch}
              onChange={(e) => setFacSearch(e.target.value)}
              placeholder="🔎 Filter crew by name, rank, bunk..."
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>
        ) : (
          <div className="search-input-wrap" style={{ maxWidth: '300px' }}>
            <input 
              type="text" 
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              placeholder="🔎 Filter compartments by type, cannons..."
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>
        )}
      </div>

      {/* Directory Content Area */}
      {subTab === 'faculty' ? (
        <div className="directory-grid">
          {filteredFaculty.map((fac, idx) => {
            // Determine dot color based on availability
            let dotColor = 'var(--success)'
            if (fac.status === 'At Sea') dotColor = 'var(--warning)'
            else if (fac.status === 'Marooned') dotColor = 'var(--danger)'

            return (
              <div key={idx} className="glass-card faculty-card">
                <img src={fac.image} alt={fac.name} className="faculty-img" />
                <div className="faculty-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{fac.name}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {fac.role} • {fac.dept}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                      <span className="faculty-status-dot" style={{ backgroundColor: dotColor }} />
                      {fac.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: '6px 0 10px', fontStyle: 'italic' }}>
                    Specialization: {fac.specialization}
                  </p>

                  <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--glass-border)', paddingTop: '8px' }}>
                    <div>⚓ Bunk: <strong>{fac.office}</strong></div>
                    <div>✉️ Parrot Mail: <strong>{fac.email}</strong></div>
                    <div>📞 Shell Horn: <strong>{fac.phone}</strong></div>
                    <div>🕒 Watch Duty: <strong>{fac.timings}</strong></div>
                  </div>
                </div>
              </div>
            )
          })}
          {filteredFaculty.length === 0 && (
            <div style={{ padding: '40px', gridColumn: 'span 2', textAlign: 'center', color: 'var(--text-muted)' }}>
              No faculty members matched your search criteria.
            </div>
          )}
        </div>
      ) : (
        /* Classroom Directory Tab */
        <div className="classroom-grid">
          {filteredRooms.map((room, idx) => {
            let statusColor = 'var(--success)'
            if (room.status === 'Under Siege' || room.status === 'Sailing') statusColor = 'var(--danger)'

            return (
              <div key={idx} className="glass-card room-card">
                <img src={room.image} alt={room.name} className="room-header-img" />
                <div className="room-details">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Room {room.name}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {room.building} • {room.floor}
                      </span>
                    </div>
                    <span 
                      className="cell-type" 
                      style={{ 
                        background: statusColor + '15', 
                        color: statusColor, 
                        border: `1px solid ${statusColor}33` 
                      }}
                    >
                      {room.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '4px', margin: '4px 0 10px' }}>
                    <div>👥 Crew Limit: <strong>{room.capacity} sailors</strong></div>
                    <div>🛠️ Category: <strong>{room.type}</strong></div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ship Upgrades & Gear</span>
                    <div className="facility-tag-group" style={{ marginTop: '6px' }}>
                      {room.facilities.map((facil, fIdx) => (
                        <span key={fIdx} className="facility-tag">
                          {facil}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {filteredRooms.length === 0 && (
            <div style={{ padding: '40px', gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-muted)' }}>
              No classrooms or laboratories matched your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
