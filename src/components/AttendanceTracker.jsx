import React, { useState } from 'react'

export default function AttendanceTracker({ attendanceData = {}, onUpdateAttendance }) {
  const [selectedSubject, setSelectedSubject] = useState(Object.keys(attendanceData)[0] || '')
  const [targetPercentage, setTargetPercentage] = useState(75)

  const handleIncrement = (subject, type) => {
    // type is 'attended' or 'total'
    const curVal = attendanceData[subject][type]
    
    if (type === 'attended') {
      const nextAttended = curVal + 1
      const nextTotal = attendanceData[subject].total + 1
      onUpdateAttendance(subject, nextAttended, nextTotal)
    } else {
      const nextTotal = curVal + 1
      onUpdateAttendance(subject, attendanceData[subject].attended, nextTotal)
    }
  }

  const handleDecrement = (subject, type) => {
    const curVal = attendanceData[subject][type]
    if (curVal <= 0) return

    if (type === 'attended') {
      const nextAttended = curVal - 1
      // Decrementing attended also decrements total so we don't have attended > total
      const nextTotal = Math.max(0, attendanceData[subject].total - 1)
      onUpdateAttendance(subject, nextAttended, nextTotal)
    } else {
      // Don't let total drop below attended
      if (curVal <= attendanceData[subject].attended) return
      const nextTotal = curVal - 1
      onUpdateAttendance(subject, attendanceData[subject].attended, nextTotal)
    }
  }

  // Calculate Goal Math
  const getGoalStatus = (subject) => {
    const data = attendanceData[subject]
    if (!data) return null

    const { attended, total } = data
    if (total === 0) return { status: 'empty' }

    const percentage = (attended / total) * 100
    const target = targetPercentage / 100

    if (percentage >= targetPercentage) {
      // Safe: calculate how many classes can be missed
      // (attended) / (total + x) >= target
      // attended >= target * total + target * x
      // target * x <= attended - target * total
      // x <= (attended - target * total) / target
      const maxMiss = Math.floor((attended - target * total) / target)
      return {
        status: 'safe',
        maxMiss: Math.max(0, maxMiss),
        percentage: Math.round(percentage)
      }
    } else {
      // Warning: calculate how many consecutive classes to attend
      // (attended + y) / (total + y) >= target
      // attended + y >= target * total + target * y
      // y * (1 - target) >= target * total - attended
      // y >= (target * total - attended) / (1 - target)
      const consecutiveNeeded = Math.ceil((target * total - attended) / (1 - target))
      return {
        status: 'danger',
        needed: Math.max(1, consecutiveNeeded),
        percentage: Math.round(percentage)
      }
    }
  }

  const activeGoal = selectedSubject ? getGoalStatus(selectedSubject) : null

  const overallStats = (() => {
    let totalAttended = 0
    let totalClasses = 0
    Object.values(attendanceData).forEach(s => {
      totalAttended += s.attended
      totalClasses += s.total
    })
    const percentage = totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100)
    return { attended: totalAttended, total: totalClasses, percentage }
  })()

  // Gamification Math
  const totalXP = overallStats.attended * 15 // 15 XP per class attended
  const currentLevel = Math.floor(totalXP / 100) + 1
  const xpForNextLevel = currentLevel * 100
  const xpProgress = ((totalXP % 100) / 100) * 100

  return (
    <div className="attendance-grid">
      {/* COLUMN 1: Subject List with Toggles */}
      <div className="glass-card">
        <div className="card-title">
          <span className="nav-item-icon">⚓</span>
          <span>Ship's Log & Morale (Attendance)</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.keys(attendanceData).map((subj, idx) => {
            const data = attendanceData[subj]
            const percentage = data.total === 0 ? 0 : Math.round((data.attended / data.total) * 100)
            
            // Warnings colors
            let colorClass = 'warning-safe'
            if (percentage < 75) colorClass = 'warning-critical'
            else if (percentage < 80) colorClass = 'warning-caution'

            return (
              <div 
                key={idx} 
                className="subject-attendance-card"
                style={{ 
                  borderLeft: `4px solid ${subj === selectedSubject ? 'var(--accent)' : 'transparent'}`,
                  background: subj === selectedSubject ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'
                }}
                onClick={() => setSelectedSubject(subj)}
              >
                <div className="subject-attendance-info">
                  <div className="att-name">{subj}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Attended: {data.attended} / {data.total} lectures
                  </div>
                  <div className="progress-container">
                    <div 
                      className="progress-bar"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: percentage >= 75 ? 'var(--success)' : 'var(--danger)'
                      }}
                    />
                  </div>
                </div>

                  <div className="attendance-actions">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '30px' }}>Bounty:</span>
                      <button className="attendance-counter-btn" style={{ width: '24px', height: '24px', fontSize: '10px' }} onClick={() => handleDecrement(subj, 'attended')}>-</button>
                      <button className="attendance-counter-btn" style={{ width: '24px', height: '24px', fontSize: '10px' }} onClick={() => handleIncrement(subj, 'attended')}>+</button>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '30px' }}>Quest:</span>
                      <button className="attendance-counter-btn" style={{ width: '24px', height: '24px', fontSize: '10px' }} onClick={() => handleDecrement(subj, 'total')}>-</button>
                      <button className="attendance-counter-btn" style={{ width: '24px', height: '24px', fontSize: '10px' }} onClick={() => handleIncrement(subj, 'total')}>+</button>
                    </div>
                  </div>
                  
                  <div className={`attendance-percentage ${colorClass}`}>
                    {percentage}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* COLUMN 2: Attendance Diagnostics & Goal Calculator */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* GAMIFICATION WIDGET */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(11,29,58,0.8))', border: '1px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '32px' }}>🏴‍☠️</div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>Pirate Level {currentLevel}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{totalXP} Total XP Earned</div>
              </div>
            </div>
          </div>
          
          <div className="progress-container" style={{ height: '8px', background: 'rgba(0,0,0,0.3)' }}>
            <div 
              className="progress-bar"
              style={{ width: `${xpProgress}%`, backgroundColor: 'var(--accent)' }}
            />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-sub)', textAlign: 'right', marginTop: '6px' }}>
            {100 - (totalXP % 100)} XP to Level {currentLevel + 1}
          </div>
        </div>

        {/* Overall Summary Card */}
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">⛵</span>
            <span>Fleet Integrity (Ship Health)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bounties Claimed</div>
              <div style={{ fontSize: '30px', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
                {overallStats.attended} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ {overallStats.total}</span>
              </div>
            </div>
            
            <div style={{ borderLeft: '1px solid var(--glass-border)', height: '50px' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ship Health</div>
              <div 
                style={{ 
                  fontSize: '36px', 
                  fontWeight: 800, 
                  fontFamily: 'var(--font-title)', 
                  color: overallStats.percentage >= 75 ? 'var(--success)' : 'var(--danger)' 
                }}
              >
                {overallStats.percentage}%
              </div>
            </div>
          </div>

          <div className="progress-container" style={{ height: '12px', marginTop: '16px' }}>
            <div 
              className="progress-bar"
              style={{ 
                width: `${overallStats.percentage}%`,
                backgroundImage: 'linear-gradient(90deg, var(--accent), var(--accent-light))'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span>0% Deficit</span>
            <span>75% Target Threshold</span>
            <span>100% Full</span>
          </div>
        </div>

        {/* Goal Calculator */}
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">🧭</span>
            <span>The Oracle's Compass (Predictive Goal)</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '16px' }}>
            Select a subject to project target percentages and calculate how many classes you must attend or can afford to miss.
          </p>

          <div className="calculator-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div className="calculator-row">
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Active Subject:</span>
              <select 
                className="custom-select" 
                style={{ padding: '6px 12px', fontSize: '12px' }}
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {Object.keys(attendanceData).map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="calculator-row">
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Target Threshold:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input 
                  type="number" 
                  min="50" 
                  max="100" 
                  value={targetPercentage} 
                  onChange={(e) => setTargetPercentage(Math.min(100, Math.max(50, Number(e.target.value))))}
                  style={{ 
                    width: '60px', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--glass-border)', 
                    color: 'var(--text-main)',
                    borderRadius: '4px',
                    padding: '4px',
                    textAlign: 'center',
                    fontWeight: 700
                  }}
                />
                <span style={{ fontSize: '13px' }}>%</span>
              </div>
            </div>

            {activeGoal && (
              <div style={{ marginTop: '16px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status Analysis:</div>
                {activeGoal.status === 'empty' && (
                  <div style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
                    ℹ️ No quests recorded yet. Sail out and claim some bounties!
                  </div>
                )}
                {activeGoal.status === 'safe' && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>
                      🎉 Favorable Winds ({activeGoal.percentage}%)
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '4px' }}>
                      You are commanding the seas! You can safely anchor and rest for up to <strong>{activeGoal.maxMiss}</strong> consecutive voyages without your hull dropping below {targetPercentage}%.
                    </p>
                  </div>
                )}
                {activeGoal.status === 'danger' && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--danger)' }}>
                      ⚠️ Taking on Water! ({activeGoal.percentage}%)
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '4px' }}>
                      To patch the hull and reach {targetPercentage}%, you must set sail and complete the next <strong>{activeGoal.needed}</strong> consecutive quests without failure.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
