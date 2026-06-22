import React, { useState, useEffect, useCallback, useRef } from 'react'
import Dashboard from './components/Dashboard.jsx'
import TimetableSection from './components/TimetableSection.jsx'
import AttendanceTracker from './components/AttendanceTracker.jsx'
import FacultyClassrooms from './components/FacultyClassrooms.jsx'
import AcademicHub from './components/AcademicHub.jsx'
import Analytics from './components/Analytics.jsx'
import AiAssistant from './components/AiAssistant.jsx'
import ExportShare from './components/ExportShare.jsx'
import OceanWaves from './components/OceanWaves.jsx'
import FocusMode from './components/FocusMode.jsx'
import ThreeCanvas from './components/ThreeCanvas.jsx'
import GlobalCanvas from './components/GlobalCanvas.jsx'
import PirateGallery from './components/PirateGallery.jsx'
import PirateMap from './components/PirateMap.jsx'
import SchoolFeatures from './components/SchoolFeatures.jsx'
import CollegeFeatures from './components/CollegeFeatures.jsx'
import ExamPeak from './components/ExamPeak.jsx'
import MastersFeatures from './components/MastersFeatures.jsx'
import { audioSynth } from './utils/audioSynth.js'
import Gamification from './components/Gamification.jsx'

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('map') // 'map' | 'dashboard' | 'timetable' | 'attendance' | 'directory' | 'academic' | 'focus' | 'analytics' | 'assistant' | 'export' | 'settings' | 'gallery'
  
  // Theme States
  const [theme, setTheme] = useState(() => localStorage.getItem('timetable_theme') || 'dark')
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('timetable_color_theme') || 'default')
  
  // Immersive Background & Audio States
  const [use3DBackground, setUse3DBackground] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [isLofiPlaying, setIsLofiPlaying] = useState(false)
  const [treasureCount, setTreasureCount] = useState(() => {
    const saved = localStorage.getItem('pirate_map_treasure');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isGhostShip, setIsGhostShip] = useState(false)
  const [avatar, setAvatar] = useState('🏴‍☠️')
  const [burstTrigger, setBurstTrigger] = useState(0)

  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) {
      setBurstTrigger(Date.now())
    } else {
      isMounted.current = true
    }
    localStorage.setItem('pirate_map_treasure', treasureCount.toString());
  }, [treasureCount]);

  const currentLevel = Math.floor(treasureCount / 5) + 1;
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(currentLevel);

  useEffect(() => {
    if (currentLevel > prevLevel) {
      if (isAudioPlaying) audioSynth.playPowerUp(); // Optional, or just ignore audio here if not defined
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      setPrevLevel(currentLevel);
    }
  }, [currentLevel, prevLevel, isAudioPlaying]);


  // Favorites Subjects
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('timetable_favorites')) || ['React JS', 'DBMS']
  })

  // Attendance Tracker state
  const [attendanceData, setAttendanceData] = useState(() => {
    const saved = localStorage.getItem('timetable_attendance')
    if (saved) return JSON.parse(saved)
    return {
      'DBMS': { attended: 12, total: 15 },
      'React JS': { attended: 14, total: 16 },
      'Operating Systems': { attended: 11, total: 15 },
      'Mathematics III': { attended: 8, total: 10 },
      'Discrete Math': { attended: 7, total: 10 },
      'Computer Networks': { attended: 9, total: 12 }
    }
  })

  // Gamification: Daily Login Streak (Idea 051)
  const [loginStreak, setLoginStreak] = useState(() => {
    const lastLogin = localStorage.getItem('pirate_last_login');
    const currentStreak = parseInt(localStorage.getItem('pirate_login_streak') || '0', 10);
    const today = new Date().toDateString();
    
    if (lastLogin === today) {
      return currentStreak; // Already logged in today
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastLogin === yesterday.toDateString()) {
      // Logged in yesterday, increment streak
      const newStreak = currentStreak + 1;
      localStorage.setItem('pirate_last_login', today);
      localStorage.setItem('pirate_login_streak', newStreak.toString());
      return newStreak;
    } else {
      // Missed a day, reset streak to 1
      localStorage.setItem('pirate_last_login', today);
      localStorage.setItem('pirate_login_streak', '1');
      return 1;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: '📅 Next class: DBMS Lecture starting in 10 minutes (Room A-101).', read: false },
    { id: 2, text: '📢 Important notice: Mid-Term registration extended to June 20.', read: false },
    { id: 3, text: '📝 Assignment deadline: DBMS ER Diagram due by June 15.' }
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  // Floating Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Ahoy, Captain! Need some help navigating your coursework?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Sync themes to HTML document attributes for CSS styling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('timetable_theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme)
    localStorage.setItem('timetable_color_theme', colorTheme)
  }, [colorTheme])

  // Handlers
  const handleToggleFavorite = (subject) => {
    let next = [...favorites]
    if (next.includes(subject)) {
      next = next.filter(f => f !== subject)
    } else {
      next.push(subject)
    }
    setFavorites(next)
    localStorage.setItem('timetable_favorites', JSON.stringify(next))
  }

  const handleUpdateAttendance = (subject, attended, total) => {
    const next = {
      ...attendanceData,
      [subject]: { attended, total }
    }
    setAttendanceData(next)
    localStorage.setItem('timetable_attendance', JSON.stringify(next))
  }

  const handleNavigate = useCallback((tab) => setActiveTab(tab), []);
  const handleFindTreasure = useCallback(() => setTreasureCount(t => t + 1), []);

  const handleSetAudio = useCallback((isPlaying) => {
    setIsAudioPlaying(isPlaying);
    if (isPlaying) {
      audioSynth.startOceanAmbience();
    } else {
      audioSynth.stopOceanAmbience();
    }
  }, []);

  const toggleAudio = () => {
    handleSetAudio(!isAudioPlaying);
  }

  const toggleLofi = () => {
    const nextState = !isLofiPlaying;
    setIsLofiPlaying(nextState);
    if (nextState) {
      audioSynth.startLofiBeats();
    } else {
      audioSynth.stopLofiBeats();
    }
  }

  // Header Details based on active Tab
  const getHeaderDetails = () => {
    switch(activeTab) {
      case 'dashboard':
        return { title: 'The Captain\'s Cabin', sub: 'Your central hub, navigation, and crew notices.' }
      case 'timetable':
        return { title: 'The Sea Chart', sub: 'Unfold the map to see your plotted course for the week.' }
      case 'attendance':
        return { title: 'Ship\'s Log & Morale', sub: 'Monitor your crew\'s standing and keep the ship afloat.' }
      case 'directory':
        return { title: 'Guild of Scholars', sub: 'Search for seasoned navigators and legendary classrooms.' }
      case 'academic':
        return { title: 'Bounties & Quests', sub: 'Track your pending bounties, duels, and academic treasures.' }
      case 'focus':
        return { title: 'The Doldrums', sub: 'No winds, no distractions. Deep focus timer for long voyages.' }
      case 'analytics':
        return { title: 'Captain\'s Log', sub: 'Visual workloads, weekly hours distribution, and sailing metrics.' }
      case 'assistant':
        return { title: 'The Ship\'s Parrot', sub: 'Consult the Oracle, check for storms, or auto-schedule duties.' }
      case 'export':
        return { title: 'Message in a Bottle', sub: 'Print your maps, download logs, and send shareable QRs.' }
      case 'settings':
        return { title: 'Ship Settings', sub: 'Configure ship colors, accessibility, and favorite routes.' }
      case 'gallery':
        return { title: "Captain's Logbook & Gallery", sub: "Inspect the crew, fleet, and milestones of your voyage." }
      case 'school':
        return { title: "School Isle", sub: "Embark on learning quests and build your fundamental skills." }
      case 'college':
        return { title: "College Cove", sub: "Navigate advanced coursework, build your resume, and secure internships." }
      case 'examprep':
        return { title: "Exam Peak", sub: "High-intensity focus timers, mock exams, and analytics for competitive prep." }
      case 'masters':
        return { title: "Scholars Deep", sub: "Deep dive into literature, thesis drafting, and advanced research tools." }
      default:
        return { title: 'The Grand Voyage', sub: 'Chart your course.' }
    }
  }

  const headerDetails = getHeaderDetails()

  return (
    <div className={`app-container ${isGhostShip ? 'ghost-ship-mode' : ''} theme-transition`}>
      {showLevelUp && (
        <div className="level-up-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
          <div style={{ animation: 'bounce-scale 0.5s ease', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '10px' }}>🌟</div>
            <h1 style={{ color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.8)', margin: 0, fontSize: '3rem' }}>Level Up!</h1>
            <p style={{ color: '#fff', fontSize: '1.5rem', marginTop: '10px' }}>You reached Level {currentLevel}</p>
          </div>
        </div>
      )}

      {use3DBackground ? <ThreeCanvas /> : <OceanWaves />}
      
      <div className="map-background" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <GlobalCanvas activeTab={activeTab} avatar={avatar} burstTrigger={burstTrigger} isChatOpen={isChatOpen} messageCount={chatMessages.length} onFindTreasure={handleFindTreasure} />
        <PirateMap onNavigate={handleNavigate} isAudioPlaying={isAudioPlaying} activeTab={activeTab} onFindTreasure={handleFindTreasure} />
      </div>

      <header className="top-header theme-transition" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
          <div className="page-title-area">
            {activeTab !== 'map' && (
              <button 
                onClick={() => { if (isAudioPlaying) audioSynth.playPaperRustle(); setActiveTab('map'); }}
                style={{ background: 'var(--accent)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px', boxShadow: '0 4px 10px rgba(217, 119, 6, 0.4)', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '1.2rem' }}>🧭</span> Back to Map
              </button>
            )}
            <h2>{headerDetails.title}</h2>
            <p>{headerDetails.sub}</p>
          </div>

          <div className="header-actions">
            {/* Avatar & Gamification */}
            <div className="avatar-display" style={{ fontSize: '1.5rem', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{avatar}</span>
              <span style={{ fontSize: '0.9rem', color: '#ffd700', fontWeight: 'bold' }}>Lvl {currentLevel}</span>
            </div>

            {/* Gamification: Daily Streak (Idea 051) */}
            <div className="streak-counter has-tooltip" data-tooltip="Login Streak" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.6)', padding: '6px 16px', borderRadius: '20px', color: '#ff6b6b', fontWeight: 'bold', border: '1px solid #ff6b6b', boxShadow: '0 0 10px rgba(255, 107, 107, 0.2)' }}>
              <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🔥</span> <span style={{ fontSize: '1.1rem' }}>{loginStreak} Day</span>
            </div>

            {/* Treasure Counter */}
            <div className="treasure-counter has-tooltip" data-tooltip="Doubloons" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.6)', padding: '6px 16px', borderRadius: '20px', color: '#ffd700', fontWeight: 'bold', border: '1px solid #ffd700', boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)' }}>
              <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🪙</span> <span style={{ fontSize: '1.1rem' }}>{treasureCount}</span>
            </div>

            {/* 3D & Audio Controls */}
            <div className="header-toggle-group">
              <Gamification isAudioPlaying={isAudioPlaying} onToggleGhostShip={() => setIsGhostShip(prev => !prev)} />
              <button 
                className={`toggle-icon-btn has-tooltip ${isLofiPlaying ? 'active' : ''}`}
                onClick={toggleLofi}
                data-tooltip="Toggle Lofi Beats"
              >
                {isLofiPlaying ? '🎵 Lofi' : '🔇 Lofi'}
              </button>
              <button 
                className={`toggle-icon-btn has-tooltip ${isAudioPlaying ? 'active' : ''}`}
                onClick={toggleAudio}
                data-tooltip="Toggle Ambient Waves"
              >
                {isAudioPlaying ? '🔊 Waves' : '🔇 Waves'}
              </button>
              <button 
                className={`toggle-icon-btn has-tooltip ${use3DBackground ? 'active' : ''}`}
                onClick={() => { if (isAudioPlaying) audioSynth.playPaperRustle(); setUse3DBackground(!use3DBackground); }}
                data-tooltip="Toggle 3D Space Background"
              >
                {use3DBackground ? '🌌 3D' : '🌊 2D'}
              </button>
            </div>

            {/* Notification Bell */}
            <div 
              className="notifications-bell has-tooltip theme-transition"
              data-tooltip="Notifications"
              onClick={() => { if (isAudioPlaying) audioSynth.playPaperRustle(); setShowNotifications(!showNotifications); }}
            >
              🔔
              {notifications.some(n => !n.read) && <span className="bell-badge" />}
              
              {showNotifications && (
                <div className="notifications-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div style={{ fontWeight: 700, paddingBottom: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                    System Alerts & Reminders
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className="notification-item">
                      {n.text}
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      setNotifications([])
                      setShowNotifications(false)
                    }}
                    className="modal-close"
                    style={{ marginTop: '10px', width: '100%', padding: '6px' }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <div className="avatar-container has-tooltip" data-tooltip="User Profile">
              🧑‍✈️
            </div>

            {/* Theme Selectors (Light / Dark) */}
            <div className="theme-controls theme-transition">
              <button 
                className={`theme-btn has-tooltip ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                aria-label="Light theme"
                data-tooltip="Light Theme"
              >
                ☀️
              </button>
              <button 
                className={`theme-btn has-tooltip ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                aria-label="Dark theme"
                data-tooltip="Dark Theme"
              >
                🌙
              </button>
            </div>
          </div>
        </header>

      {activeTab !== 'map' && (
        <div className="map-modal-overlay">
          <div className="map-modal-content parchment-modal">
            <button className="map-modal-close-btn wax-seal-btn" onClick={() => { if (isAudioPlaying) audioSynth.playPaperRustle(); setActiveTab('map'); }} data-tooltip="Close Scroll">
              <span className="wax-cross">✖</span>
            </button>
            <main className="main-content" style={{ padding: '20px', overflowY: 'auto', maxHeight: '80vh', width: '100%', margin: 0, maxWidth: '100%' }}>
              <section style={{ animation: 'fade-in 0.3s ease-out' }}>
                {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} attendanceData={attendanceData} themeColor={colorTheme} doubloons={treasureCount} setDoubloons={setTreasureCount} setAvatar={setAvatar} />}
                {activeTab === 'timetable' && <TimetableSection favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
                {activeTab === 'attendance' && <AttendanceTracker attendanceData={attendanceData} onUpdateAttendance={handleUpdateAttendance} />}
                {activeTab === 'directory' && <FacultyClassrooms />}
                {activeTab === 'academic' && <AcademicHub />}
                {activeTab === 'focus' && <FocusMode onSetAudio={handleSetAudio} />}
                {activeTab === 'analytics' && <Analytics />}
                {activeTab === 'assistant' && <AiAssistant />}
                {activeTab === 'export' && <ExportShare />}
                {activeTab === 'gallery' && <PirateGallery isAudioPlaying={isAudioPlaying} />}
                {activeTab === 'school' && <SchoolFeatures />}
                {activeTab === 'college' && <CollegeFeatures />}
                {activeTab === 'examprep' && <ExamPeak />}
                {activeTab === 'masters' && <MastersFeatures />}
                {activeTab === 'settings' && (
            <div className="glass-card theme-transition" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="card-title">
                <span className="nav-item-icon">⚙️</span>
                <span>Configure Portal Theme</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Active Color Theme:</span>
                  <div className="theme-color-palette">
                    {/* Default Nautical */}
                    <div 
                      className={`color-dot ${colorTheme === 'default' ? 'active' : ''}`}
                      style={{ background: '#0B1D3A' }}
                      onClick={() => setColorTheme('default')}
                      title="Nautical Night"
                    />
                    {/* Ghost Ship */}
                    <div 
                      className={`color-dot ${colorTheme === 'emerald' ? 'active' : ''}`}
                      style={{ background: '#059669' }}
                      onClick={() => setColorTheme('emerald')}
                      title="Ghost Ship"
                    />
                    {/* Galleon */}
                    <div 
                      className={`color-dot ${colorTheme === 'cyberpunk' ? 'active' : ''}`}
                      style={{ background: '#d97706' }}
                      onClick={() => setColorTheme('cyberpunk')}
                      title="Royal Galleon"
                    />
                    {/* Blood Sail */}
                    <div 
                      className={`color-dot ${colorTheme === 'amber' ? 'active' : ''}`}
                      style={{ background: '#991b1b' }}
                      onClick={() => setColorTheme('amber')}
                      title="Blood Sail"
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Favorite Subjects Summary ({favorites.length}):</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {favorites.map((fav, i) => (
                      <span key={i} className="facility-tag" style={{ fontSize: '12px', padding: '6px 12px', background: 'var(--accent)22', border: '1px solid var(--accent)44', color: 'var(--accent-light)' }}>
                        ⭐ {fav}
                      </span>
                    ))}
                    {favorites.length === 0 && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No subjects favorited yet.</span>}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Accessibility Options:</span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button className="share-action-btn" style={{ padding: '6px 12px' }} onClick={() => alert('Custom large font-size activated')}>
                      Aa+ Increase Font Size
                    </button>
                    <button className="share-action-btn" style={{ padding: '6px 12px' }} onClick={() => alert('Screen reader compatibility optimization activated')}>
                      🔊 Screen Reader Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        
              </section>
            </main>
          </div>
        </div>
      )}

      {/* Floating Chatbot Tutor */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        {isChatOpen && (
          <div style={{ width: '300px', height: '400px', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', borderRadius: '16px', marginBottom: '15px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>🦜 Oracle Tutor</span>
              <button onClick={() => setIsChatOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '1.2rem' }}>✖</button>
            </div>
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--accent)' : 'rgba(255,255,255,0.1)', color: msg.sender === 'user' ? '#fff' : 'var(--text)', padding: '8px 12px', borderRadius: '12px', maxWidth: '80%', fontSize: '0.9rem' }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div style={{ padding: '10px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
                    setChatInput('');
                    setTimeout(() => {
                      setChatMessages(prev => [...prev, { sender: 'ai', text: "I'll add that to my logs, Captain. Check the syllabus for more info." }]);
                    }, 1000);
                  }
                }}
                placeholder="Ask me anything..." 
                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '8px', color: 'var(--text)' }} 
              />
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid #fbbf24', color: '#fff', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(217,119,6,0.6)', transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Open AI Tutor"
        >
          🦜
        </button>
      </div>

    </div>
  )
}
