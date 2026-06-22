import React, { useState } from 'react'

export default function Analytics() {
  const [activeChart, setActiveChart] = useState('subjects') // 'subjects' | 'faculty'

  // Data Aggregations (Mock calculations based on dataset)
  const subjectHours = [
    { name: 'DBMS', hours: 5, color: '#3b82f6' },
    { name: 'React JS', hours: 6, color: '#10b981' },
    { name: 'Operating Systems', hours: 5, color: '#ec4899' },
    { name: 'Mathematics III', hours: 3, color: '#8b5cf6' },
    { name: 'Discrete Math', hours: 3, color: '#06b6d4' },
    { name: 'Computer Networks', hours: 4, color: '#14b8a6' }
  ]

  const facultyWorkload = [
    { name: 'Dr. Sharma', workload: 14, color: '#3b82f6' },
    { name: 'Prof. Gupta', workload: 16, color: '#10b981' },
    { name: 'Dr. N. Verma', workload: 10, color: '#8b5cf6' },
    { name: 'Prof. R. Singh', workload: 14, color: '#ec4899' },
    { name: 'Dr. P. Iyer', workload: 12, color: '#06b6d4' },
    { name: 'Prof. V. Desai', workload: 11, color: '#14b8a6' }
  ]

  // Render variables
  const maxSubjectHours = Math.max(...subjectHours.map(s => s.hours))
  const maxFacultyWorkload = Math.max(...facultyWorkload.map(f => f.workload))

  return (
    <div className="analytics-dashboard">
      
      {/* COLUMN 1: SVG Bar Chart & Table */}
      <div className="glass-card">
        <div className="card-title" style={{ justifyContent: 'space-between' }}>
          <span>💰 Loot Distribution (Weekly Hours)</span>
          <div className="filter-btn-group">
            <button 
              className={`filter-btn ${activeChart === 'subjects' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => setActiveChart('subjects')}
            >
              Voyages
            </button>
            <button 
              className={`filter-btn ${activeChart === 'faculty' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => setActiveChart('faculty')}
            >
              Captain's Burdens
            </button>
          </div>
        </div>

        {activeChart === 'subjects' ? (
          /* SUBJECTS BAR CHART */
          <div>
            <div className="chart-wrapper">
              <svg className="bar-chart-svg" viewBox="0 0 400 200">
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.06)" />
                <line x1="40" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.06)" />
                <line x1="40" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.06)" />
                <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                
                {/* Y-Axis labels */}
                <text x="30" y="25" fill="var(--text-muted)" fontSize="9" textAnchor="end">6 hrs</text>
                <text x="30" y="75" fill="var(--text-muted)" fontSize="9" textAnchor="end">4 hrs</text>
                <text x="30" y="125" fill="var(--text-muted)" fontSize="9" textAnchor="end">2 hrs</text>
                <text x="30" y="175" fill="var(--text-muted)" fontSize="9" textAnchor="end">0 hrs</text>

                {/* Bars */}
                {subjectHours.map((sub, idx) => {
                  const barWidth = 35
                  const spacing = 55
                  const x = 50 + idx * spacing
                  const barHeight = (sub.hours / 6) * 150
                  const y = 170 - barHeight

                  return (
                    <g key={idx} className="chart-bar-group" style={{ cursor: 'pointer' }}>
                      {/* Interactive Bar */}
                      <rect 
                        x={x} 
                        y={y} 
                        width={barWidth} 
                        height={barHeight} 
                        fill={sub.color} 
                        rx="4"
                        style={{ transition: 'all 0.3s ease' }}
                      />
                      
                      {/* Hours tag on hover/static */}
                      <text 
                        x={x + barWidth / 2} 
                        y={y - 6} 
                        fill="var(--text-main)" 
                        fontSize="10" 
                        fontWeight="700" 
                        textAnchor="middle"
                      >
                        {sub.hours}h
                      </text>

                      {/* X-axis labels */}
                      <text 
                        x={x + barWidth / 2} 
                        y="188" 
                        fill="var(--text-muted)" 
                        fontSize="8" 
                        textAnchor="middle"
                      >
                        {sub.name.slice(0, 5)}...
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subjectHours.map((sub, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: sub.color }} />
                    <span>{sub.name}</span>
                  </div>
                  <strong>{sub.hours} Leagues / Week</strong>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* FACULTY WORKLOAD CHART */
          <div>
            <div className="chart-wrapper">
              <svg className="bar-chart-svg" viewBox="0 0 400 200">
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.06)" />
                <line x1="40" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.06)" />
                <line x1="40" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.06)" />
                <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                
                {/* Y-Axis labels */}
                <text x="30" y="25" fill="var(--text-muted)" fontSize="9" textAnchor="end">18 hrs</text>
                <text x="30" y="75" fill="var(--text-muted)" fontSize="9" textAnchor="end">12 hrs</text>
                <text x="30" y="125" fill="var(--text-muted)" fontSize="9" textAnchor="end">6 hrs</text>
                <text x="30" y="175" fill="var(--text-muted)" fontSize="9" textAnchor="end">0 hrs</text>

                {/* Bars */}
                {facultyWorkload.map((fac, idx) => {
                  const barWidth = 32
                  const spacing = 56
                  const x = 46 + idx * spacing
                  const barHeight = (fac.workload / 18) * 150
                  const y = 170 - barHeight

                  return (
                    <g key={idx} className="chart-bar-group" style={{ cursor: 'pointer' }}>
                      <rect 
                        x={x} 
                        y={y} 
                        width={barWidth} 
                        height={barHeight} 
                        fill={fac.color} 
                        rx="4"
                      />
                      <text 
                        x={x + barWidth / 2} 
                        y={y - 6} 
                        fill="var(--text-main)" 
                        fontSize="9" 
                        fontWeight="700" 
                        textAnchor="middle"
                      >
                        {fac.workload}h
                      </text>
                      <text 
                        x={x + barWidth / 2} 
                        y="188" 
                        fill="var(--text-muted)" 
                        fontSize="7.5" 
                        textAnchor="middle"
                      >
                        {fac.name.split(' ')[1] || fac.name}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {facultyWorkload.map((fac, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: fac.color }} />
                    <span>{fac.name}</span>
                  </div>
                  <strong>{fac.workload} Bounties Assigned</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* COLUMN 2: Free Period Analysis & Utilizations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Occupied vs Free Doughnut Breakdown */}
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">⭕</span>
            <span>Fleet Deployment Analysis</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* SVG Doughnut */}
            <div style={{ width: '130px', height: '130px', position: 'relative' }}>
              <svg width="130" height="130" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4.2" />
                
                {/* 62% Occupied slots, 38% Free slots */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.91" 
                  fill="none" 
                  stroke="var(--accent)" 
                  strokeWidth="4.2" 
                  strokeDasharray="62 38" 
                  strokeDashoffset="25" 
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-title)' }}>62%</span>
                <span style={{ fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Occupied</span>
              </div>
            </div>

            {/* Explanations */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>⛵ At Sea:</span>
                  <strong>26 Sessions</strong>
                </div>
                <div className="progress-container" style={{ height: '6px', marginTop: '4px' }}>
                  <div className="progress-bar" style={{ width: '62%', backgroundColor: 'var(--accent)' }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>⚓ Anchored:</span>
                  <strong>16 Sessions</strong>
                </div>
                <div className="progress-container" style={{ height: '6px', marginTop: '4px' }}>
                  <div className="progress-bar" style={{ width: '38%', backgroundColor: 'var(--success)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productivity & Hours Card */}
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">📜</span>
            <span>Quartermaster's Intel</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ padding: '10px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
              🏴‍☠️ <strong>Wednesday</strong> is your busiest sailing day, with 5 scheduled voyages totaling 6 hours. Expect heavy storms.
            </div>
            
            <div style={{ padding: '10px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px' }}>
              ⚓ Your most frequent voyage is <strong>React JS</strong>, accounting for 6 total nautical hours weekly.
            </div>

            <div style={{ padding: '10px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px' }}>
              🗺️ You have <strong>2 continuous hours</strong> of heavy plundering on Monday, Tuesday, Wednesday, and Friday.
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
