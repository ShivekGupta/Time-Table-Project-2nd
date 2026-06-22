import React, { useState, useEffect } from 'react'

import './FocusMode.css'

const VIRTUAL_USERS = [
  { id: 1, name: 'Alex', avatar: '🧑‍✈️' },
  { id: 2, name: 'Sam', avatar: '👩‍🔬' }
];

export default function FocusMode({ onSetAudio }) {
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 min default
  const [mode, setMode] = useState('focus') // 'focus' or 'break'
  const [isCoopMode, setIsCoopMode] = useState(false) // Solo vs Co-op

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Auto switch or alert
      setIsActive(false)
      if (mode === 'focus') {
        alert('Focus time is up! Time for a shore leave (break).')
        setMode('break')
        setTimeLeft(5 * 60)
      } else {
        alert('Break is over! Back to the rigging.')
        setMode('focus')
        setTimeLeft(25 * 60)
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, mode])

  useEffect(() => {
    if (onSetAudio) {
      if (isActive && mode === 'focus') {
        onSetAudio(true);
      } else {
        onSetAudio(false);
      }
    }

    return () => {
      if (onSetAudio) {
        onSetAudio(false);
      }
    };
  }, [isActive, mode, onSetAudio])

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60)
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const maxTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = 1 - (timeLeft / maxTime);

  const fleetStatus = isActive
    ? (mode === 'focus' ? { text: 'Focusing', className: 'focusing' } : { text: 'On Break', className: 'break' })
    : { text: 'Paused', className: 'paused' };

  return (
    <div className="focus-mode-container">
      <div className="kraken-card">
        <h2 className="kraken-title">
          {mode === 'focus' ? '⏳ The Kraken Hourglass' : '🏝️ Shore Leave'}
        </h2>
        <p className="kraken-subtitle">
          {mode === 'focus' 
            ? 'The Kraken circles the ship. Do not break focus. Let the sand fall.'
            : 'The beast slumbers. Drop the anchor and rest.'}
        </p>

        {/* Co-op Toggle */}
        <div className="coop-toggle-wrapper">
          <div className="coop-toggle-container">
            <button 
              onClick={() => setIsCoopMode(false)}
              className={`coop-toggle-btn ${!isCoopMode ? 'active-solo' : ''}`}
            >
              Solo
            </button>
            <button 
              onClick={() => setIsCoopMode(true)}
              className={`coop-toggle-btn ${isCoopMode ? 'active-coop' : ''}`}
            >
              Co-op Fleet
            </button>
          </div>
        </div>

        <div className="hourglass-wrapper">
          <svg className="hourglass-svg" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="10" width="160" height="20" rx="4" className="wood-cap" />
            <rect x="20" y="230" width="160" height="20" rx="4" className="wood-cap" />

            <path 
              className="glass" 
              d="M 40 30 C 40 80, 80 120, 90 130 C 100 140, 100 140, 110 130 C 120 120, 160 80, 160 30 Z" 
            />
            <path 
              className="glass" 
              d="M 90 130 C 80 140, 40 180, 40 230 L 160 230 C 160 180, 120 140, 110 130 Z" 
            />

            <defs>
              <clipPath id="top-glass-clip">
                <path d="M 40 30 C 40 80, 80 120, 90 130 C 100 140, 100 140, 110 130 C 120 120, 160 80, 160 30 Z" />
              </clipPath>
              <clipPath id="bottom-glass-clip">
                <path d="M 90 130 C 80 140, 40 180, 40 230 L 160 230 C 160 180, 120 140, 110 130 Z" />
              </clipPath>
            </defs>

            <g clipPath="url(#top-glass-clip)">
              <rect 
                className="sand" 
                x="30" 
                y={30 + (progress * 100)} 
                width="140" 
                height={Math.max(0, 100 - (progress * 100))} 
              />
            </g>

            <g clipPath="url(#bottom-glass-clip)">
              <rect 
                className="sand" 
                x="30" 
                y={230 - (progress * 100)} 
                width="140" 
                height={Math.max(0, progress * 100)} 
              />
            </g>

            {isActive && timeLeft > 0 && (
              <line 
                x1="100" y1="130" x2="100" y2={230 - (progress * 100)} 
                className="sand-stream" 
              />
            )}
            
            <path 
              d="M 50 40 C 45 60, 80 100, 90 120" 
              fill="transparent" 
              stroke="rgba(255,255,255,0.4)" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            <path 
              d="M 50 220 C 45 200, 80 160, 90 140" 
              fill="transparent" 
              stroke="rgba(255,255,255,0.4)" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
          </svg>

          <div className="nautical-time">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="nautical-btn-group">
          <button 
            onClick={toggleTimer}
            className={`nautical-btn primary ${isActive ? 'active' : ''}`}
          >
            {isActive ? 'Drop Anchor (Pause)' : 'Set Sail (Start)'}
          </button>
          <button 
            onClick={resetTimer}
            className="nautical-btn secondary"
          >
            Mutiny (Reset)
          </button>
        </div>

        <div className="nautical-modes">
          <button 
            onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }}
            className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
          >
            Deep Focus (25m)
          </button>
          <button 
            onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
            className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
          >
            Shore Leave (5m)
          </button>
        </div>

        {/* Co-op Users Sync UI */}
        {isCoopMode && (
          <div className="coop-fleet-container">
            <h4 className="coop-fleet-title">👥 Synced Fleet ({VIRTUAL_USERS.length + 1} Captains Online)</h4>
            <div className="coop-fleet-users">
              {VIRTUAL_USERS.map((user, index) => (
                <React.Fragment key={user.id}>
                  <div className="coop-user-card">
                    <div className={`coop-user-avatar ${isActive ? 'synced' : ''}`}>{user.avatar}</div>
                    <div className="coop-user-name">{user.name}</div>
                    <div className={`coop-user-status ${fleetStatus.className}`}>{fleetStatus.text}</div>
                  </div>
                  {/* Insert current user indicator in the middle */}
                  {index === Math.floor(VIRTUAL_USERS.length / 2) - 1 && (
                    <div className="coop-user-card">
                      <div className={`coop-user-avatar ${isActive ? 'synced' : ''}`}>🟢</div>
                      <div className="coop-user-name">You</div>
                      <div className={`coop-user-status ${fleetStatus.className}`}>{fleetStatus.text}</div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
