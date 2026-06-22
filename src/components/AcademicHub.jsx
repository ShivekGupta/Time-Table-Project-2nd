import React, { useState } from 'react'
import { ACADEMIC_HUB } from '../data/timetableData'

export default function AcademicHub() {
  const [activeSubSection, setActiveSubSection] = useState('assignments') // 'assignments' | 'quizzes' | 'exams' | 'placements'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Tab select toolbar */}
      <div className="glass-card" style={{ padding: '12px 20px' }}>
        <div className="filter-btn-group">
          <button 
            className={`filter-btn ${activeSubSection === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveSubSection('assignments')}
          >
            📜 Bounties
          </button>
          <button 
            className={`filter-btn ${activeSubSection === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveSubSection('quizzes')}
          >
            ⚔️ Skirmishes
          </button>
          <button 
            className={`filter-btn ${activeSubSection === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveSubSection('exams')}
          >
            🏴‍☠️ Boss Battles
          </button>
          <button 
            className={`filter-btn ${activeSubSection === 'placements' ? 'active' : ''}`}
            onClick={() => setActiveSubSection('placements')}
          >
            💰 Treasure Hunts
          </button>
        </div>
      </div>

      {/* Content Render */}
      <div className="glass-card bounty-board-backdrop">
        <div className="card-title">
          <span className="nav-item-icon">
            {activeSubSection === 'assignments' && '📝'}
            {activeSubSection === 'quizzes' && '⚡'}
            {activeSubSection === 'exams' && '🎓'}
            {activeSubSection === 'placements' && '💼'}
          </span>
          <span style={{ textTransform: 'capitalize' }}>
            {activeSubSection === 'assignments' && 'Active Wanted Bounties'}
            {activeSubSection === 'quizzes' && 'Upcoming Skirmishes'}
            {activeSubSection === 'exams' && 'Legendary Boss Battles'}
            {activeSubSection === 'placements' && 'Grand Treasure Hunts'}
          </span>
        </div>

        <div className="bounty-board-container">
          {/* ASSIGNMENTS */}
          {activeSubSection === 'assignments' && ACADEMIC_HUB.assignments.map(ass => (
            <div key={ass.id} className="wanted-poster">
              <div className="poster-nail"></div>
              <div className="poster-header">WANTED: DEAD OR ALIVE</div>
              <h4 className="poster-title">{ass.title}</h4>
              <div className="poster-subject">{ass.subject}</div>
              
              <div className="poster-details">
                <p><strong>Bounty Expiry:</strong> {ass.due}</p>
                <p><strong>Reward:</strong> {Math.floor(Math.random() * 500) + 100} Doubloons</p>
              </div>

              <div className="poster-footer">
                <span className={`poster-stamp ${ass.status === 'Submitted' ? 'stamp-claimed' : 'stamp-wanted'}`}>
                  {ass.status === 'Submitted' ? 'CLAIMED' : 'WANTED'}
                </span>
              </div>
            </div>
          ))}

          {/* QUIZZES */}
          {activeSubSection === 'quizzes' && ACADEMIC_HUB.quizzes.map(quiz => (
            <div key={quiz.id} className="wanted-poster">
              <div className="poster-nail"></div>
              <div className="poster-header">SKIRMISH ALERT</div>
              <h4 className="poster-title">{quiz.title}</h4>
              <div className="poster-subject">{quiz.subject}</div>
              
              <div className="poster-details">
                <p><strong>Engage At:</strong> {quiz.time}</p>
                <p><strong>Battle Time:</strong> {quiz.duration}</p>
                <p><strong>Date:</strong> {quiz.date}</p>
              </div>

              <div className="poster-footer">
                <span className="poster-stamp stamp-skirmish">
                  PREPARE
                </span>
              </div>
            </div>
          ))}

          {/* EXAMS */}
          {activeSubSection === 'exams' && ACADEMIC_HUB.exams.map(ex => (
            <div key={ex.id} className="wanted-poster">
              <div className="poster-nail"></div>
              <div className="poster-header">BOSS BATTLE</div>
              <h4 className="poster-title">{ex.title}</h4>
              <div className="poster-subject">{ex.subject}</div>
              
              <div className="poster-details">
                <p><strong>Engage At:</strong> {ex.time}</p>
                <p><strong>Arena:</strong> {ex.room}</p>
                <p><strong>Clash Date:</strong> {ex.date}</p>
              </div>

              <div className="poster-footer">
                <span className="poster-stamp stamp-boss">
                  DEADLY
                </span>
              </div>
            </div>
          ))}

          {/* PLACEMENTS */}
          {activeSubSection === 'placements' && ACADEMIC_HUB.placements.map(pl => (
            <div key={pl.id} className="wanted-poster">
              <div className="poster-nail"></div>
              <div className="poster-header">GRAND TREASURE HUNT</div>
              <h4 className="poster-title">{pl.role}</h4>
              <div className="poster-subject">{pl.company}</div>
              
              <div className="poster-details">
                <p><strong>Stage:</strong> {pl.stage}</p>
                <p><strong>Intel:</strong> {pl.details}</p>
                <p><strong>Date:</strong> {pl.date}</p>
              </div>

              <div className="poster-footer">
                <span className="poster-stamp stamp-wanted">
                  PIRATE KING
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
