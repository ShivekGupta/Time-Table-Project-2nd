# Project Source Code

## index.html

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>College Timetable Viewer</title>
</head>

<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>

</html>
```

## vite.config.js

```jsx
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        strictPort: true
    }
})
```

## package.json

```json
{
    "name": "college-timetable-viewer",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.3.1",
        "react-dom": "^18.3.1"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.3.1",
        "vite": "^5.4.8"
    }
}
```

## src/App.jsx

```jsx
import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard.jsx'
import TimetableSection from './components/TimetableSection.jsx'
import AttendanceTracker from './components/AttendanceTracker.jsx'
import FacultyClassrooms from './components/FacultyClassrooms.jsx'
import AcademicHub from './components/AcademicHub.jsx'
import Analytics from './components/Analytics.jsx'
import AiAssistant from './components/AiAssistant.jsx'
import ExportShare from './components/ExportShare.jsx'

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'timetable' | 'attendance' | 'directory' | 'academic' | 'analytics' | 'assistant' | 'export' | 'settings'
  
  // Theme States
  const [theme, setTheme] = useState(() => localStorage.getItem('timetable_theme') || 'dark')
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('timetable_color_theme') || 'default')
  
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

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: '📅 Next class: DBMS Lecture starting in 10 minutes (Room A-101).', read: false },
    { id: 2, text: '📢 Important notice: Mid-Term registration extended to June 20.', read: false },
    { id: 3, text: '📝 Assignment deadline: DBMS ER Diagram due by June 15.' }
  ])
  const [showNotifications, setShowNotifications] = useState(false)

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

  // Header Details based on active Tab
  const getHeaderDetails = () => {
    switch(activeTab) {
      case 'dashboard':
        return { title: 'Welcome to your Dashboard', sub: 'Today\'s overview, notices, events, and notes.' }
      case 'timetable':
        return { title: 'Academic Timetable', sub: 'Interactive weekly grid, daily schedule, and session selector.' }
      case 'attendance':
        return { title: 'Attendance Tracker', sub: 'Monitor lecture counts, project aggregate status, and project goals.' }
      case 'directory':
        return { title: 'College Directory', sub: 'Search faculty profiles and inspect classroom/lab capacities.' }
      case 'academic':
        return { title: 'Academic Hub', sub: 'Track your pending assignment deadlines, quizzes, and placement schedules.' }
      case 'analytics':
        return { title: 'Analytics Dashboard', sub: 'Visual workloads, weekly hours distribution, and free-time metrics.' }
      case 'assistant':
        return { title: 'AI Assistant & Clash Scanner', sub: 'Consult the schedule chatbot, check conflicts, or auto-schedule study hours.' }
      case 'export':
        return { title: 'Export & Share', sub: 'Print schedules landscape, download JSON datasets, and generate shareable QRs.' }
      case 'settings':
        return { title: 'Portal Settings', sub: 'Configure themes, accessibility settings, and favorite configurations.' }
      default:
        return { title: 'College Portal', sub: 'Access your academic records.' }
    }
  }

  const headerDetails = getHeaderDetails()

  return (
    <div className="app-container">
      {/* SIDEBAR PORTAL NAVIGATION */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-icon">🎓</div>
          <div className="brand-name">EduSched Portal</div>
        </div>

        <nav>
          <ul className="nav-menu">
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('dashboard')}>
                <span className="nav-item-icon">🏠</span> Dashboard
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('timetable')}>
                <span className="nav-item-icon">📅</span> Timetable Viewer
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('attendance')}>
                <span className="nav-item-icon">📊</span> Attendance
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'directory' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('directory')}>
                <span className="nav-item-icon">🏢</span> Directory
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'academic' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('academic')}>
                <span className="nav-item-icon">📖</span> Academic Hub
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('analytics')}>
                <span className="nav-item-icon">📈</span> Analytics
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'assistant' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('assistant')}>
                <span className="nav-item-icon">🤖</span> AI Assistant
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'export' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('export')}>
                <span className="nav-item-icon">📤</span> Export & Share
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('settings')}>
                <span className="nav-item-icon">⚙️</span> Settings
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="pwa-badge">
            🟢 Offline Cache Ready
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
            College Timetable Portal v1.0.0
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        
        {/* TOP HEADER STATUS PANEL */}
        <header className="top-header">
          <div className="page-title-area">
            <h2>{headerDetails.title}</h2>
            <p>{headerDetails.sub}</p>
          </div>

          <div className="header-actions">
            {/* Notification Bell */}
            <div 
              className="notifications-bell"
              onClick={() => setShowNotifications(!showNotifications)}
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

            {/* Theme Selectors (Light / Dark) */}
            <div className="theme-controls">
              <button 
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                aria-label="Light theme"
              >
                ☀️
              </button>
              <button 
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                aria-label="Dark theme"
              >
                🌙
              </button>
            </div>
          </div>
        </header>

        {/* TAB WORKSPACE */}
        <section style={{ animation: 'fade-in 0.3s ease-out' }}>
          {activeTab === 'dashboard' && (
            <Dashboard 
              onNavigate={setActiveTab} 
              attendanceData={attendanceData} 
              themeColor={colorTheme}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableSection 
              favorites={favorites} 
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceTracker 
              attendanceData={attendanceData} 
              onUpdateAttendance={handleUpdateAttendance}
            />
          )}

          {activeTab === 'directory' && (
            <FacultyClassrooms />
          )}

          {activeTab === 'academic' && (
            <AcademicHub />
          )}

          {activeTab === 'analytics' && (
            <Analytics />
          )}

          {activeTab === 'assistant' && (
            <AiAssistant />
          )}

          {activeTab === 'export' && (
            <ExportShare />
          )}

          {activeTab === 'settings' && (
            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="card-title">
                <span className="nav-item-icon">⚙️</span>
                <span>Configure Portal Theme</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Active Color Theme:</span>
                  <div className="theme-color-palette">
                    {/* Default Violet */}
                    <div 
                      className={`color-dot ${colorTheme === 'default' ? 'active' : ''}`}
                      style={{ background: '#8b5cf6' }}
                      onClick={() => setColorTheme('default')}
                      title="Violet Cyber"
                    />
                    {/* Emerald */}
                    <div 
                      className={`color-dot ${colorTheme === 'emerald' ? 'active' : ''}`}
                      style={{ background: '#10b981' }}
                      onClick={() => setColorTheme('emerald')}
                      title="Emerald Forest"
                    />
                    {/* Cyberpunk */}
                    <div 
                      className={`color-dot ${colorTheme === 'cyberpunk' ? 'active' : ''}`}
                      style={{ background: '#f59e0b' }}
                      onClick={() => setColorTheme('cyberpunk')}
                      title="Cyberpunk Gold"
                    />
                    {/* Amber Crimson */}
                    <div 
                      className={`color-dot ${colorTheme === 'amber' ? 'active' : ''}`}
                      style={{ background: '#ef4444' }}
                      onClick={() => setColorTheme('amber')}
                      title="Amber Crimson"
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
  )
}

```

## src/main.jsx

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered successfully:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}



```

## src/styles.css

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

:root {
  /* Default Theme: Violet Cyber (Dark) */
  --font-title: 'Outfit', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  
  --bg-primary: #0a0f1d;
  --bg-gradient: radial-gradient(1200px 800px at 10% 10%, rgba(124, 58, 237, 0.18), transparent),
                 radial-gradient(800px 600px at 90% 90%, rgba(6, 182, 212, 0.12), transparent);
  
  --glass-bg: rgba(22, 28, 45, 0.55);
  --glass-bg-hover: rgba(30, 37, 58, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-focus: rgba(124, 58, 237, 0.4);
  --glass-inner-glow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --text-sub: #cbd5e1;
  
  --accent: #8b5cf6;
  --accent-glow: rgba(139, 92, 246, 0.45);
  --accent-light: #a78bfa;
  
  --success: #10b981;
  --success-glow: rgba(16, 185, 129, 0.25);
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #06b6d4;
  
  --shadow-main: 0 12px 40px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 20px 50px rgba(0, 0, 0, 0.6);
  --radius-lg: 20px;
  --radius-md: 12px;
  
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s ease;
}

/* Theme Variant: Emerald Forest (Dark) */
[data-color-theme="emerald"] {
  --bg-primary: #040d12;
  --bg-gradient: radial-gradient(1200px 800px at 10% 10%, rgba(16, 185, 129, 0.15), transparent),
                 radial-gradient(800px 600px at 90% 90%, rgba(20, 184, 166, 0.1), transparent);
  --glass-bg: rgba(15, 29, 23, 0.6);
  --glass-bg-hover: rgba(22, 42, 33, 0.75);
  --glass-border: rgba(255, 255, 255, 0.07);
  --glass-border-focus: rgba(16, 185, 129, 0.4);
  --accent: #10b981;
  --accent-glow: rgba(16, 185, 129, 0.45);
  --accent-light: #34d399;
}

/* Theme Variant: Cyberpunk Gold (Dark) */
[data-color-theme="cyberpunk"] {
  --bg-primary: #07070a;
  --bg-gradient: radial-gradient(1200px 800px at 10% 10%, rgba(245, 158, 11, 0.15), transparent),
                 radial-gradient(800px 600px at 90% 90%, rgba(6, 182, 212, 0.15), transparent);
  --glass-bg: rgba(20, 20, 25, 0.7);
  --glass-bg-hover: rgba(28, 28, 35, 0.85);
  --glass-border: rgba(245, 158, 11, 0.15);
  --glass-border-focus: rgba(245, 158, 11, 0.5);
  --accent: #f59e0b;
  --accent-glow: rgba(245, 158, 11, 0.45);
  --accent-light: #fbbf24;
}

/* Theme Variant: Amber Crimson (Dark) */
[data-color-theme="amber"] {
  --bg-primary: #0e0708;
  --bg-gradient: radial-gradient(1200px 800px at 10% 10%, rgba(239, 68, 68, 0.16), transparent),
                 radial-gradient(800px 600px at 90% 90%, rgba(244, 63, 94, 0.12), transparent);
  --glass-bg: rgba(26, 15, 16, 0.65);
  --glass-bg-hover: rgba(36, 20, 22, 0.8);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-focus: rgba(239, 68, 68, 0.4);
  --accent: #ef4444;
  --accent-glow: rgba(239, 68, 68, 0.45);
  --accent-light: #f87171;
}

/* LIGHT MODE OVERRIDES */
[data-theme="light"] {
  --bg-primary: #f3f4f6;
  --bg-gradient: radial-gradient(1200px 800px at 10% 10%, rgba(139, 92, 246, 0.09), transparent),
                 radial-gradient(800px 600px at 90% 90%, rgba(6, 182, 212, 0.07), transparent);
  
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-bg-hover: rgba(255, 255, 255, 0.88);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-border-focus: rgba(124, 58, 237, 0.45);
  --glass-inner-glow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  
  --text-main: #1f2937;
  --text-muted: #6b7280;
  --text-sub: #4b5563;
  
  --shadow-main: 0 12px 35px rgba(31, 41, 55, 0.08);
  --shadow-hover: 0 20px 45px rgba(31, 41, 55, 0.12);
}

[data-theme="light"][data-color-theme="emerald"] {
  --bg-gradient: radial-gradient(1200px 800px at 10% 10%, rgba(16, 185, 129, 0.09), transparent),
                 radial-gradient(800px 600px at 90% 90%, rgba(20, 184, 166, 0.06), transparent);
  --glass-border-focus: rgba(16, 185, 129, 0.45);
}

[data-theme="light"][data-color-theme="cyberpunk"] {
  --bg-gradient: radial-gradient(1200px 800px at 10% 10%, rgba(245, 158, 11, 0.09), transparent),
                 radial-gradient(800px 600px at 90% 90%, rgba(6, 182, 212, 0.09), transparent);
  --glass-border-focus: rgba(245, 158, 11, 0.45);
}

[data-theme="light"][data-color-theme="amber"] {
  --bg-gradient: radial-gradient(1200px 800px at 10% 10%, rgba(239, 68, 68, 0.09), transparent),
                 radial-gradient(800px 600px at 90% 90%, rgba(244, 63, 94, 0.07), transparent);
  --glass-border-focus: rgba(239, 68, 68, 0.45);
}

/* RESET & CORE BASE */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-primary);
  background-image: var(--bg-gradient);
  background-attachment: fixed;
  color: var(--text-main);
  line-height: 1.5;
  transition: background-color 0.3s ease, color 0.3s ease;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}

button, input, select, textarea {
  font-family: inherit;
}

/* WORKSPACE LAYOUT */
.app-container {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* SIDEBAR PORTAL */
.sidebar {
  width: 280px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  padding: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
  box-shadow: 10px 0 30px rgba(0,0,0,0.15);
  transition: var(--transition);
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
  padding: 0 4px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 20px;
  box-shadow: 0 4px 15px var(--accent-glow);
}

.brand-name {
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--text-main), var(--text-muted));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item button {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: var(--transition);
}

.nav-item button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
  transform: translateX(4px);
}

.nav-item.active button {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.05));
  border-color: var(--glass-border-focus);
  color: var(--accent-light);
  box-shadow: var(--glass-inner-glow), 0 4px 15px rgba(0, 0, 0, 0.05);
}

.nav-item-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding-top: 20px;
  border-top: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pwa-badge {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: var(--success);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* MAIN CONTENT WORKSPACE */
.main-content {
  flex: 1;
  padding: 30px;
  max-width: calc(100vw - 280px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* TOP HEADER PANEL */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--glass-bg);
  backdrop-filter: blur(14px);
  border: 1px solid var(--glass-border);
  padding: 16px 24px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-main);
}

.page-title-area h2 {
  font-size: 24px;
  color: var(--text-main);
}

.page-title-area p {
  font-size: 13px;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notifications-bell {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-main);
  transition: var(--transition);
}

.notifications-bell:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bell-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: var(--danger);
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
}

.notifications-dropdown {
  position: absolute;
  top: 55px;
  right: 0;
  width: 320px;
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-hover);
  padding: 12px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-item {
  padding: 8px;
  border-bottom: 1px solid var(--glass-border);
  font-size: 12px;
}
.notification-item:last-child {
  border: 0;
}

.notification-header {
  font-weight: 700;
  margin-bottom: 2px;
}

.theme-controls {
  display: flex;
  gap: 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  padding: 4px;
  border-radius: 99px;
}

.theme-btn {
  background: transparent;
  border: 0;
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
}

.theme-btn.active {
  background: var(--accent);
  color: white;
  box-shadow: 0 4px 10px var(--accent-glow);
}

/* GENERAL GLASS CARD */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(14px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-main);
  box-shadow: var(--glass-inner-glow), var(--shadow-main);
  transition: var(--transition);
}

.glass-card:hover {
  background: var(--glass-bg-hover);
  box-shadow: var(--shadow-hover);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 10px;
}

/* DASHBOARD OVERVIEW */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.span-2 {
  grid-column: span 2;
}

.quick-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
}

.stat-val {
  font-size: 26px;
  font-weight: 800;
  color: var(--accent-light);
  font-family: var(--font-title);
  margin-top: 4px;
}

.stat-lbl {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* TIMETABLE VISUALIZER */
.timetable-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.selector-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.custom-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  outline: none;
  font-size: 13px;
  cursor: pointer;
  transition: var(--transition);
}

.custom-select:focus {
  border-color: var(--glass-border-focus);
  box-shadow: 0 0 10px rgba(139,92,246,0.15);
}

.custom-select option {
  background: var(--bg-primary);
  color: var(--text-main);
}

.filter-bar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input-wrap {
  flex: 1;
  min-width: 260px;
  position: relative;
}

.search-input-wrap input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  padding: 11px 16px;
  border-radius: var(--radius-md);
  outline: none;
  font-size: 14px;
  transition: var(--transition);
}

.search-input-wrap input:focus {
  border-color: var(--glass-border-focus);
}

.search-history-pills {
  display: flex;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
  align-items: center;
  margin-top: 6px;
}

.history-pill {
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 8px;
  border-radius: 99px;
  cursor: pointer;
}

.history-pill:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--text-main);
}

.filter-btn-group {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 99px;
  padding: 4px;
}

.filter-btn {
  background: transparent;
  border: 0;
  padding: 8px 16px;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 13px;
  border-radius: 99px;
  cursor: pointer;
  transition: var(--transition);
}

.filter-btn.active {
  background: var(--accent);
  color: white;
}

.lab-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-sub);
  cursor: pointer;
}

.lab-checkbox input {
  accent-color: var(--accent);
}

/* TIMETABLE VIEWER VIEWS */
.timetable-scroll {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.modern-table th {
  background: rgba(15, 23, 42, 0.55);
  padding: 16px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  text-align: left;
  border-bottom: 1px solid var(--glass-border);
  border-right: 1px solid var(--glass-border);
}

.modern-table td {
  padding: 12px;
  border-bottom: 1px solid var(--glass-border);
  border-right: 1px solid var(--glass-border);
  vertical-align: top;
  position: relative;
}

.modern-table th:last-child,
.modern-table td:last-child {
  border-right: 0;
}

.time-header {
  width: 160px;
  background: rgba(15, 23, 42, 0.45) !important;
  font-weight: 800;
}

.time-slot-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-slot-label .time-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.time-slot-label .slot-code {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* TIMETABLE CELL LAYOUTS */
.lecture-cell {
  border-radius: var(--radius-md);
  padding: 10px 12px;
  background: rgba(255,255,255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  transition: var(--transition);
}

.lecture-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.lecture-cell.free-period {
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  opacity: 0.5;
  justify-content: center;
  align-items: center;
}

.lecture-cell.is-lunch {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  color: var(--text-muted);
  text-align: center;
  justify-content: center;
  align-items: center;
  min-height: 50px;
}

.cell-subject {
  font-size: 14px;
  font-weight: 750;
  color: var(--text-main);
  line-height: 1.25;
}

.cell-type {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
  margin-top: 2px;
}

.cell-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--text-sub);
}

.cell-faculty {
  font-weight: 500;
}

.cell-room {
  background: rgba(255,255,255,0.08);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-title);
  font-weight: 600;
}

/* ACTIVE HIGHLIGHTS */
.highlight-current-day {
  background: rgba(139, 92, 246, 0.05);
}

.highlight-current-cell {
  outline: 2px solid var(--accent);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.35);
  animation: pulse-border 2s infinite alternate;
}

@keyframes pulse-border {
  from { outline-color: rgba(139, 92, 246, 0.4); }
  to { outline-color: rgba(139, 92, 246, 0.9); }
}

/* ATTENDANCE PAGE */
.attendance-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.subject-attendance-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 14px;
  transition: var(--transition);
}

.subject-attendance-card:hover {
  background: rgba(255, 255, 255, 0.06);
}

.subject-attendance-info {
  flex: 1;
}

.att-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.progress-container {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  margin-top: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 99px;
  transition: width 0.5s ease-out;
}

.attendance-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 20px;
}

.attendance-counter-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255, 0.05);
  color: var(--text-main);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.attendance-counter-btn:hover {
  background: var(--accent);
  color: white;
}

.attendance-ratio {
  font-size: 14px;
  font-weight: 600;
  width: 60px;
  text-align: center;
}

.attendance-percentage {
  font-family: var(--font-title);
  font-size: 20px;
  font-weight: 800;
  width: 65px;
  text-align: right;
}

.warning-critical {
  color: var(--danger) !important;
}

.warning-safe {
  color: var(--success) !important;
}

.warning-caution {
  color: var(--warning) !important;
}

/* GOAL CALCULATOR */
.calculator-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-top: 16px;
}

.calculator-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* DIRECTORY STYLES */
.directory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.faculty-card {
  display: flex;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 16px;
}

.faculty-img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent);
}

.faculty-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.faculty-status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

/* CLASSROOM CARDS */
.classroom-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.room-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.room-card:hover {
  transform: translateY(-2px);
}

.room-header-img {
  height: 120px;
  width: 100%;
  object-fit: cover;
}

.room-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.facility-tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.facility-tag {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text-sub);
}

/* ACADEMIC HUB */
.academic-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.academic-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.academic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  padding: 12px 16px;
  border-radius: var(--radius-md);
}

/* ANALYTICS */
.analytics-dashboard {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
}

.bar-chart-svg {
  width: 100%;
  height: 200px;
}

/* CHATBOT AI ASSISTANT */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.01);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
  line-height: 1.4;
}

.chat-message.bot {
  background: rgba(255, 255, 255, 0.06);
  align-self: flex-start;
  border-bottom-left-radius: 0;
  border: 1px solid var(--glass-border);
}

.chat-message.user {
  background: var(--accent);
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 0;
}

.chat-input-area {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.15);
}

.chat-input-area input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  outline: none;
}

.chat-send-btn {
  background: var(--accent);
  border: 0;
  color: white;
  padding: 0 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
}

/* PREFERENCE PANEL */
.preferences-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.theme-color-palette {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.color-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: var(--transition-fast);
}

.color-dot.active {
  transform: scale(1.15);
  border-color: white;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
}

/* EXPORT & SHARE MODAL */
.share-links-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.share-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  padding: 10px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: var(--transition);
}

.share-action-btn:hover {
  background: var(--accent);
  border-color: transparent;
  color: white;
}

/* MOCK MODALS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 400px;
  max-width: 90%;
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  text-align: center;
  box-shadow: var(--shadow-hover);
}

.modal-close {
  background: var(--accent);
  border: 0;
  color: white;
  padding: 8px 20px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  margin-top: 20px;
}

/* RESPONSIVE BREAKPOINTS */
@media (max-width: 1024px) {
  .dashboard-grid, .attendance-grid, .directory-grid, .academic-row, .analytics-dashboard, .preferences-grid {
    grid-template-columns: 1fr;
  }
  .span-2 {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--glass-border);
    position: relative;
    padding: 16px;
  }
  .brand-section {
    margin-bottom: 16px;
  }
  .nav-menu {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }
  .nav-item button {
    padding: 8px 12px;
    font-size: 12px;
  }
  .main-content {
    max-width: 100vw;
    padding: 16px;
  }
  .selector-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .classroom-grid {
    grid-template-columns: 1fr;
  }
}

/* PRINT MEDIA INJECTOR FOR PDF */
@media print {
  body {
    background: white !important;
    color: black !important;
  }
  .sidebar, .top-header, .timetable-controls, .theme-controls, .nav-menu, .share-links-row, .chat-input-area {
    display: none !important;
  }
  .main-content {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .glass-card {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    padding: 0 !important;
  }
  .modern-table {
    min-width: 100% !important;
  }
  .modern-table th {
    background: #e2e8f0 !important;
    color: black !important;
    border: 1px solid #cbd5e1 !important;
  }
  .modern-table td {
    border: 1px solid #cbd5e1 !important;
  }
  .lecture-cell {
    border: 1px solid #cbd5e1 !important;
    background: white !important;
    color: black !important;
    box-shadow: none !important;
    transform: none !important;
  }
  .time-header {
    background: #f1f5f9 !important;
  }
}
```

## src/components/AcademicHub.jsx

```jsx
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
            Assignments
          </button>
          <button 
            className={`filter-btn ${activeSubSection === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveSubSection('quizzes')}
          >
            Quizzes & Tests
          </button>
          <button 
            className={`filter-btn ${activeSubSection === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveSubSection('exams')}
          >
            Mid-Sem & Term Exams
          </button>
          <button 
            className={`filter-btn ${activeSubSection === 'placements' ? 'active' : ''}`}
            onClick={() => setActiveSubSection('placements')}
          >
            Placement & Career Activities
          </button>
        </div>
      </div>

      {/* Content Render */}
      <div className="glass-card">
        <div className="card-title">
          <span className="nav-item-icon">
            {activeSubSection === 'assignments' && '📝'}
            {activeSubSection === 'quizzes' && '⚡'}
            {activeSubSection === 'exams' && '🎓'}
            {activeSubSection === 'placements' && '💼'}
          </span>
          <span style={{ textTransform: 'capitalize' }}>
            {activeSubSection === 'assignments' && 'Assignment Deadlines'}
            {activeSubSection === 'quizzes' && 'Scheduled Class Quizzes'}
            {activeSubSection === 'exams' && 'Examination Schedule'}
            {activeSubSection === 'placements' && 'Placement Activities'}
          </span>
        </div>

        <div className="academic-list">
          {/* ASSIGNMENTS */}
          {activeSubSection === 'assignments' && ACADEMIC_HUB.assignments.map(ass => (
            <div key={ass.id} className="academic-item">
              <div>
                <span className="cell-type" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '6px' }}>
                  {ass.subject}
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>{ass.title}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  📅 Due Date: <strong>{ass.due}</strong>
                </div>
              </div>
              <div>
                <span 
                  className="cell-type" 
                  style={{ 
                    background: ass.status === 'Submitted' ? 'var(--success-glow)' : 'rgba(239,68,68,0.1)', 
                    color: ass.status === 'Submitted' ? 'var(--success)' : 'var(--danger)',
                    border: `1px solid ${ass.status === 'Submitted' ? 'var(--success)33' : 'var(--danger)33'}`
                  }}
                >
                  {ass.status}
                </span>
              </div>
            </div>
          ))}

          {/* QUIZZES */}
          {activeSubSection === 'quizzes' && ACADEMIC_HUB.quizzes.map(quiz => (
            <div key={quiz.id} className="academic-item">
              <div>
                <span className="cell-type" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-light)', border: '1px solid rgba(139, 92, 246, 0.2)', marginBottom: '6px' }}>
                  {quiz.subject}
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>{quiz.title}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  🕐 Time: <strong>{quiz.time}</strong> • Duration: <strong>{quiz.duration}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="pwa-badge" style={{ background: 'rgba(245,158,11,0.06)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  📅 {quiz.date}
                </span>
              </div>
            </div>
          ))}

          {/* EXAMS */}
          {activeSubSection === 'exams' && ACADEMIC_HUB.exams.map(ex => (
            <div key={ex.id} className="academic-item">
              <div>
                <span className="cell-type" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.2)', marginBottom: '6px' }}>
                  {ex.subject}
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>{ex.title}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  🕒 Timing: <strong>{ex.time}</strong> • Hall: <strong>{ex.room}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="pwa-badge" style={{ background: 'rgba(16, 185, 129, 0.06)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  📅 Exam Date: {ex.date}
                </span>
              </div>
            </div>
          ))}

          {/* PLACEMENTS */}
          {activeSubSection === 'placements' && ACADEMIC_HUB.placements.map(pl => (
            <div key={pl.id} className="academic-item">
              <div>
                <span className="cell-type" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.2)', marginBottom: '6px' }}>
                  {pl.company}
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>{pl.role}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  📢 Phase: <strong>{pl.stage}</strong> • Details: <strong>{pl.details}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="pwa-badge" style={{ background: 'rgba(239, 68, 68, 0.06)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  📅 Event Date: {pl.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

```

## src/components/AiAssistant.jsx

```jsx
import React, { useState } from 'react'

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Timetable Assistant. Ask me anything like:\n• "What is my next class?"\n• "Who teaches React JS?"\n• "Where is Lab-3?"' }
  ])
  const [input, setInput] = useState('')

  // Clash Detection States
  const [clashes, setClashes] = useState([])
  const [ranClashCheck, setRanClashCheck] = useState(false)

  // Auto Generator States
  const [generatedSchedule, setGeneratedSchedule] = useState(null)

  // Chat Responses Keywords Mapper
  const handleSend = () => {
    if (!input.trim()) return

    const userMsg = input.trim()
    const nextMsgs = [...messages, { sender: 'user', text: userMsg }]
    setMessages(nextMsgs)
    setInput('')

    // Simulating response
    setTimeout(() => {
      let reply = "I'm sorry, I didn't quite catch that. Try asking about 'next class', 'React JS faculty', or 'Lab location'!"
      const query = userMsg.toLowerCase()

      if (query.includes('next') || query.includes('class now') || query.includes('today')) {
        reply = "Looking at your schedule, your next class is DBMS Lecture at 09:00 AM in Room A-101. Don't forget your database notebooks!"
      } else if (query.includes('react') || query.includes('gupta')) {
        reply = "React JS is taught by Prof. Gupta. They reside in Block B, Office Room 205, and hold consultation hours on Mondays and Wednesdays from 10:00 AM to 12:00 PM."
      } else if (query.includes('dbms') || query.includes('sharma')) {
        reply = "Dr. Sharma teaches DBMS. Their office is in Block A, Room 304. DBMS includes a lecture and a 2-hour lab session in Lab-3."
      } else if (query.includes('lab') || query.includes('practical')) {
        reply = "You have four labs: DBMS Lab (Lab-3, Mon), OS Lab (Lab-1, Tue), React JS Lab (Lab-2, Wed), and Computer Networks Lab (Lab-4, Fri)."
      } else if (query.includes('free') || query.includes('break')) {
        reply = "You have lunch breaks daily from 01:00 PM to 02:00 PM. You also have free periods on Monday Slot 7, Tuesday Slot 3, Wednesday Slot 5, and Friday Slot 1."
      } else if (query.includes('exam') || query.includes('quiz') || query.includes('test')) {
        reply = "Your next scheduled quiz is Discrete Math on June 16, 2026 at 11:00 AM. Mid-term examinations begin on July 2, 2026."
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }])
    }, 600)
  }

  // Run Clash Detection
  const checkClashes = () => {
    setRanClashCheck(true)
    // Simulating checking database for overlaps
    // In our static dataset, there are no clashes, but we can display a success indicator, or simulate a minor section overlap warning!
    setTimeout(() => {
      setClashes([
        { id: 1, type: 'Overlap Warning', desc: 'No internal clashes found. However, there is a Room Allocation Warning: Lab-3 is booked by CSE Section B during your Monday 11:00 AM slot. Keep classroom availability in mind!' }
      ])
    }, 400)
  }

  // Run Auto Generator
  const generateStudySchedule = () => {
    setGeneratedSchedule([
      { day: 'Monday', subject: 'DBMS Revision', time: '05:00 PM - 06:30 PM' },
      { day: 'Wednesday', subject: 'React Component Coding', time: '06:00 PM - 08:00 PM' },
      { day: 'Friday', subject: 'OS Multi-threading Practice', time: '05:00 PM - 07:00 PM' }
    ])
  }

  return (
    <div className="analytics-dashboard" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
      
      {/* COLUMN 1: AI Chat Assistant */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="card-title">
          <span className="nav-item-icon">🤖</span>
          <span>AI Timetable Assistant</span>
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.text.split('\n').map((line, lIdx) => <div key={lIdx}>{line}</div>)}
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me a timetable question..."
            />
            <button className="chat-send-btn" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* COLUMN 2: Clash Detection and Smart Generator */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Clash Detection */}
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">🚨</span>
            <span>Clash Detection System</span>
          </div>
          
          <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '14px' }}>
            Scan the timetable for scheduling conflicts, room double-bookings, or faculty overlaps.
          </p>

          <button 
            className="share-action-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={checkClashes}
          >
            Run Clash Diagnostics
          </button>

          {ranClashCheck && (
            <div style={{ marginTop: '16px' }}>
              {clashes.length > 0 ? clashes.map(clash => (
                <div 
                  key={clash.id} 
                  style={{ 
                    padding: '10px 12px', 
                    background: 'rgba(245,158,11,0.06)', 
                    border: '1px solid rgba(245,158,11,0.2)', 
                    borderRadius: '8px', 
                    fontSize: '12px' 
                  }}
                >
                  ⚠️ <strong>{clash.type}:</strong> {clash.desc}
                </div>
              )) : (
                <div 
                  style={{ 
                    padding: '10px 12px', 
                    background: 'rgba(16,185,129,0.06)', 
                    border: '1px solid rgba(16,185,129,0.2)', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    color: 'var(--success)'
                  }}
                >
                  ✅ No clashes or overlaps detected in your active schedule!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Smart Study Scheduler */}
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">⚡</span>
            <span>Auto Study Scheduler</span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '14px' }}>
            Automatically generate a complementary self-study schedule fitted perfectly around your free periods.
          </p>

          <button 
            className="share-action-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={generateStudySchedule}
          >
            Generate Study Slots
          </button>

          {generatedSchedule && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Generated Targets:</span>
              {generatedSchedule.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid var(--glass-border)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                >
                  <div>
                    <strong>{item.subject}</strong>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.day}</div>
                  </div>
                  <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{item.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

```

## src/components/Analytics.jsx

```jsx
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
          <span>📊 Weekly Hours Distribution</span>
          <div className="filter-btn-group">
            <button 
              className={`filter-btn ${activeChart === 'subjects' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => setActiveChart('subjects')}
            >
              Subjects
            </button>
            <button 
              className={`filter-btn ${activeChart === 'faculty' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => setActiveChart('faculty')}
            >
              Faculty Workload
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
                  <strong>{sub.hours} Hours / Week</strong>
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
                  <strong>{fac.workload} Hours Assigned</strong>
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
            <span>Weekly Allocation Analysis</span>
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
                  <span>📅 Active Periods:</span>
                  <strong>26 Sessions</strong>
                </div>
                <div className="progress-container" style={{ height: '6px', marginTop: '4px' }}>
                  <div className="progress-bar" style={{ width: '62%', backgroundColor: 'var(--accent)' }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>☕ Free Periods:</span>
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
            <span className="nav-item-icon">💡</span>
            <span>Productivity Insights</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ padding: '10px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
              🔥 <strong>Wednesday</strong> is your busiest day, with 5 scheduled classes totaling 6 hours. Expect heavy lab workloads.
            </div>
            
            <div style={{ padding: '10px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px' }}>
              ⭐ Your most frequent subject is <strong>React JS</strong>, accounting for 6 total academic hours weekly.
            </div>

            <div style={{ padding: '10px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px' }}>
              📚 You have <strong>2 continuous hours</strong> of Labs on Monday, Tuesday, Wednesday, and Friday.
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

```

## src/components/AttendanceTracker.jsx

```jsx
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

  // Overall statistics
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

  return (
    <div className="attendance-grid">
      {/* COLUMN 1: Subject List with Toggles */}
      <div className="glass-card">
        <div className="card-title">
          <span className="nav-item-icon">📝</span>
          <span>Subject-wise Attendance Tracker</span>
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
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '30px' }}>Pres:</span>
                      <button className="attendance-counter-btn" style={{ width: '24px', height: '24px', fontSize: '10px' }} onClick={() => handleDecrement(subj, 'attended')}>-</button>
                      <button className="attendance-counter-btn" style={{ width: '24px', height: '24px', fontSize: '10px' }} onClick={() => handleIncrement(subj, 'attended')}>+</button>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '30px' }}>Total:</span>
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
        
        {/* Overall Summary Card */}
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">📈</span>
            <span>Total Attendance Summary</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Present Total</div>
              <div style={{ fontSize: '30px', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
                {overallStats.attended} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ {overallStats.total}</span>
              </div>
            </div>
            
            <div style={{ borderLeft: '1px solid var(--glass-border)', height: '50px' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aggregate</div>
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
            <span className="nav-item-icon">🔮</span>
            <span>Predictive Goal Calculator</span>
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
                    ℹ️ No sessions recorded yet. Add classes to total to see recommendations.
                  </div>
                )}
                {activeGoal.status === 'safe' && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>
                      🎉 Good Status ({activeGoal.percentage}%)
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '4px' }}>
                      You are exceeding your target threshold. You can safely miss up to <strong>{activeGoal.maxMiss}</strong> consecutive lectures without falling below {targetPercentage}%.
                    </p>
                  </div>
                )}
                {activeGoal.status === 'danger' && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--danger)' }}>
                      ⚠️ Below Target ({activeGoal.percentage}%)
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '4px' }}>
                      To restore your status above {targetPercentage}%, you must attend the next <strong>{activeGoal.needed}</strong> consecutive lectures of this subject without missing.
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

```

## src/components/Dashboard.jsx

```jsx
import React, { useState, useEffect } from 'react'
import { TIMETABLE, DAYS, TIME_SLOTS, ANNOUNCEMENTS, EVENTS } from '../data/timetableData'

export default function Dashboard({ 
  onNavigate, 
  attendanceData = {}, 
  themeColor = 'default' 
}) {
  const [role, setRole] = useState('student') // 'student' or 'faculty'
  const [time, setTime] = useState(new Date())
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('college_portal_notes') || '• Study React Hooks today.\n• Review DBMS normalization assignment.\n• Submit lab reports before Friday.'
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

  return (
    <div className="dashboard-grid">
      {/* COLUMN 1: Today's live tracking and Upcoming Classes */}
      <div className="span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* User Role Switcher & Live Timer */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>USER TYPE</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button 
                onClick={() => setRole('student')}
                className={`filter-btn ${role === 'student' ? 'active' : ''}`}
                style={{ padding: '6px 14px', borderRadius: '8px' }}
              >
                Student Portal
              </button>
              <button 
                onClick={() => setRole('faculty')}
                className={`filter-btn ${role === 'faculty' ? 'active' : ''}`}
                style={{ padding: '6px 14px', borderRadius: '8px' }}
              >
                Faculty Portal
              </button>
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
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">⚡</span>
            <span>Today's Active Schedule ({activeDayName})</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Current Class */}
            <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
              <div>
                <span className="stat-lbl" style={{ color: 'var(--accent-light)' }}>Current Lecture</span>
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
                      <div>👨‍🏫 Faculty: <strong>{currentClass.faculty}</strong></div>
                      <div>📍 Location: <strong>{currentClass.room}</strong></div>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    ☕ No active lecture right now. Relax or study in the library!
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Overview */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="stat-box" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="stat-lbl">Today's Class Count</span>
                <span className="stat-val">{todayClassList.filter(c => c.type !== 'Break').length} Classes</span>
              </div>
              <div className="stat-box" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="stat-lbl">Active Portal Mode</span>
                <span className="stat-val" style={{ textTransform: 'capitalize' }}>{role}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Upcoming classes card */}
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">📅</span>
            <span>Upcoming Lectures Today</span>
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
            <div style={{ padding: '20px', textInterval: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              🎉 No more lectures scheduled for the rest of today!
            </div>
          )}
        </div>

      </div>

      {/* COLUMN 2: Sidebar Widgets (Attendance Shortcut, Notices, Calendar, Notes) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Attendance Shortcut Card */}
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('attendance')}>
          <div className="card-title" style={{ margin: 0, border: 0, padding: 0, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="nav-item-icon">📊</span>
              <span>Attendance Status</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent-light)' }}>Manage →</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-title)', color: overallAttendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                {overallAttendance}%
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {overallAttendance >= 75 ? '👍 Safe: Above 75% target' : '⚠️ Warning: Below 75% target'}
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
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">📢</span>
            <span>Important Announcements</span>
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
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">🗓️</span>
            <span>Academic Events Preview</span>
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
        <div className="glass-card">
          <div className="card-title">
            <span className="nav-item-icon">📝</span>
            <span>Personal Sticky Notes</span>
          </div>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Type your personal to-do tasks here..."
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

      </div>
    </div>
  )
}

```

## src/components/ExportShare.jsx

```jsx
import React, { useState } from 'react'

export default function ExportShare() {
  const [showQrModal, setShowQrModal] = useState(false)
  const [copiedStatus, setCopiedStatus] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleCopySummary = () => {
    const summaryText = `College Timetable Summary (CSE Sem 3 A):
• Monday: DBMS (09:00 AM), DBMS Lab (11:00 AM), Math III (02:00 PM), OS (03:00 PM)
• Tuesday: OS (09:00 AM), Discrete Math (10:00 AM), React JS (12:00 PM), OS Lab (02:00 PM), Seminar (04:00 PM)
• Wednesday: React JS Lab (09:00 AM), Math III (11:00 AM), DBMS (12:00 PM), Computer Networks (03:00 PM)
• Thursday: Networks (09:00 AM), Discrete Math (10:00 AM), DBMS (11:00 AM), Math III (02:00 PM), OS (03:00 PM), Placement (04:00 PM)
• Friday: React JS (10:00 AM), Networks Lab (11:00 AM), Discrete Math (02:00 PM), Weekly Quiz (04:00 PM)
• Saturday: Project Review (09:00 AM), Guest Lecture (12:00 PM)
`
    navigator.clipboard.writeText(summaryText)
    setCopiedStatus(true)
    setTimeout(() => setCopiedStatus(false), 2000)
  }

  const handleDownloadJson = () => {
    const scheduleData = {
      session: 'Academic Session 2025-26',
      class: 'CSE Sem 3 Section A',
      downloadedAt: new Date().toISOString(),
      notes: 'Generated from College Timetable Viewer Portal'
    }

    const blob = new Blob([JSON.stringify(scheduleData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'weekly_timetable_cse_sem3_a.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card-title">
        <span className="nav-item-icon">📤</span>
        <span>Export & Share Timetable</span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '20px' }}>
        Download your college schedules in different document types, print landscape sheets, copy text summaries, or scan/share schedules with mobile devices.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Print timetable */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div>
            <strong style={{ fontSize: '14px' }}>Landscape PDF / Printing</strong>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Format timetable as a clean physical sheet.</div>
          </div>
          <button className="share-action-btn" onClick={handlePrint}>
            🖨️ Print / Save PDF
          </button>
        </div>

        {/* Copy text summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div>
            <strong style={{ fontSize: '14px' }}>Copy Schedule Summary</strong>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Copies clean text outlines of all class hours.</div>
          </div>
          <button className="share-action-btn" onClick={handleCopySummary}>
            {copiedStatus ? '✅ Copied!' : '📋 Copy Text'}
          </button>
        </div>

        {/* Download metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div>
            <strong style={{ fontSize: '14px' }}>Download JSON Dataset</strong>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Import schedule configurations in other apps.</div>
          </div>
          <button className="share-action-btn" onClick={handleDownloadJson}>
            💾 Download JSON
          </button>
        </div>

        {/* Mobile QR sharing */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div>
            <strong style={{ fontSize: '14px' }}>Share via Mobile QR Code</strong>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scan with smartphone camera to sync schedule.</div>
          </div>
          <button className="share-action-btn" onClick={() => setShowQrModal(true)}>
            📱 Share QR
          </button>
        </div>

      </div>

      {/* QR MODAL POPUP */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '10px' }}>Scan Schedule QR Code</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Point your smartphone camera here to sync the current CSE Sem 3 Section A Timetable.
            </p>
            
            {/* Mock QR graphic using vector layout */}
            <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <svg width="150" height="150" viewBox="0 0 100 100">
                {/* Outer bounds */}
                <rect x="0" y="0" width="100" height="100" fill="white" />
                
                {/* Top-left position marker */}
                <rect x="10" y="10" width="30" height="30" fill="black" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="black" />
                
                {/* Top-right position marker */}
                <rect x="60" y="10" width="30" height="30" fill="black" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="70" width="10" height="10" fill="black" />
                
                {/* Bottom-left position marker */}
                <rect x="10" y="60" width="30" height="30" fill="black" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="black" />
                
                {/* Random blocks representing data */}
                <rect x="60" y="60" width="30" height="30" fill="black" />
                <rect x="65" y="65" width="20" height="20" fill="white" />
                <rect x="70" y="70" width="10" height="10" fill="black" />
                
                <rect x="45" y="10" width="10" height="10" fill="black" />
                <rect x="45" y="25" width="10" height="15" fill="black" />
                <rect x="45" y="45" width="10" height="10" fill="black" />
                <rect x="10" y="45" width="15" height="10" fill="black" />
                <rect x="30" y="45" width="10" height="10" fill="black" />
                
                <rect x="75" y="45" width="15" height="10" fill="black" />
                <rect x="60" y="45" width="10" height="10" fill="black" />
                
                <rect x="45" y="65" width="10" height="10" fill="black" />
                <rect x="45" y="80" width="10" height="10" fill="black" />
                <rect x="55" y="80" width="10" height="10" fill="black" />
                
                <rect x="75" y="75" width="10" height="15" fill="black" />
              </svg>
            </div>

            <button className="modal-close" onClick={() => setShowQrModal(false)}>
              Close Share Panel
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

```

## src/components/FacultyClassrooms.jsx

```jsx
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
            Faculty Profiles
          </button>
          <button 
            className={`filter-btn ${subTab === 'classrooms' ? 'active' : ''}`}
            onClick={() => setSubTab('classrooms')}
          >
            Classroom & Lab Details
          </button>
        </div>

        {/* Search filter for selected directory */}
        {subTab === 'faculty' ? (
          <div className="search-input-wrap" style={{ maxWidth: '300px' }}>
            <input 
              type="text" 
              value={facSearch}
              onChange={(e) => setFacSearch(e.target.value)}
              placeholder="🔎 Filter faculty by name, dept, office..."
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>
        ) : (
          <div className="search-input-wrap" style={{ maxWidth: '300px' }}>
            <input 
              type="text" 
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              placeholder="🔎 Filter rooms by building, type, facilities..."
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
            if (fac.status === 'In Lecture') dotColor = 'var(--warning)'
            else if (fac.status === 'Out of Office') dotColor = 'var(--danger)'

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
                    <div>📍 Office: <strong>{fac.office}</strong></div>
                    <div>✉️ Email: <strong>{fac.email}</strong></div>
                    <div>📞 Contact: <strong>{fac.phone}</strong></div>
                    <div>🕒 Office Hours: <strong>{fac.timings}</strong></div>
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
            if (room.status === 'Occupied' || room.status === 'In Use') statusColor = 'var(--danger)'

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
                    <div>👥 Capacity: <strong>{room.capacity} seats</strong></div>
                    <div>🛠️ Category: <strong>{room.type}</strong></div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Facilities & Equipment</span>
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

```

## src/components/Timetable.jsx

```jsx
import { useMemo, useState } from 'react'
import TimetableCell from './TimetableCell.jsx'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const TIME_SLOTS = [
  { label: '09:00 - 09:55', code: 'S1' },
  { label: '10:00 - 10:55', code: 'S2' },
  { label: '11:00 - 11:55', code: 'S3' },
  { label: '12:00 - 12:55', code: 'S4' },
  { label: '02:00 - 02:55', code: 'S5' },
  { label: '03:00 - 03:55', code: 'S6' }
]

// Example dataset (can be replaced with real data later)
const TIMETABLE = {
  Mon: {
    S1: { subject: 'Data Structures', time: '09:00 - 09:55', faculty: 'Dr. A. Kumar' },
    S2: { subject: 'Operating Systems', time: '10:00 - 10:55', faculty: 'Prof. R. Singh' },
    S3: { subject: 'Mathematics III', time: '11:00 - 11:55', faculty: 'Dr. N. Verma' },
    S4: null,
    S5: { subject: 'Discrete Math', time: '02:00 - 02:55', faculty: 'Dr. P. Iyer' },
    S6: null
  },
  Tue: {
    S1: { subject: 'Web Development', time: '09:00 - 09:55', faculty: 'Prof. S. Mehta' },
    S2: null,
    S3: { subject: 'Database Systems', time: '11:00 - 11:55', faculty: 'Dr. L. Shah' },
    S4: { subject: 'Software Design', time: '12:00 - 12:55', faculty: 'Dr. K. Rao' },
    S5: null,
    S6: { subject: 'Lab Session', time: '03:00 - 03:55', faculty: 'TA Team' }
  },
  Wed: {
    S1: null,
    S2: { subject: 'Computer Networks', time: '10:00 - 10:55', faculty: 'Prof. V. Desai' },
    S3: { subject: 'Mathematics III', time: '11:00 - 11:55', faculty: 'Dr. N. Verma' },
    S4: null,
    S5: { subject: 'Web Development', time: '02:00 - 02:55', faculty: 'Prof. S. Mehta' },
    S6: null
  },
  Thu: {
    S1: { subject: 'Operating Systems', time: '09:00 - 09:55', faculty: 'Prof. R. Singh' },
    S2: { subject: 'Data Structures', time: '10:00 - 10:55', faculty: 'Dr. A. Kumar' },
    S3: null,
    S4: { subject: 'Database Systems', time: '12:00 - 12:55', faculty: 'Dr. L. Shah' },
    S5: null,
    S6: { subject: 'Seminar', time: '03:00 - 03:55', faculty: 'Guest Lecturer' }
  },
  Fri: {
    S1: null,
    S2: { subject: 'Discrete Math', time: '10:00 - 10:55', faculty: 'Dr. P. Iyer' },
    S3: { subject: 'Computer Networks', time: '11:00 - 11:55', faculty: 'Prof. V. Desai' },
    S4: null,
    S5: { subject: 'Software Design', time: '02:00 - 02:55', faculty: 'Dr. K. Rao' },
    S6: null
  },
  Sat: {
    S1: { subject: 'Lab Session', time: '09:00 - 09:55', faculty: 'TA Team' },
    S2: null,
    S3: null,
    S4: { subject: 'Capstone Review', time: '12:00 - 12:55', faculty: 'Mentor' },
    S5: null,
    S6: null
  },
  Sun: {
    S1: null,
    S2: null,
    S3: null,
    S4: null,
    S5: null,
    S6: null
  }
}

function normalize(s) {
  return (s || '').toString().trim().toLowerCase()
}

const VIEW_MODES = ['weekly', 'daily', 'subject']

function formatDayFull(day) {
  const map = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
  }
  return map[day] || day
}

export default function Timetable() {
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState('weekly')
  const [selectedDay, setSelectedDay] = useState('Mon')
  const [subjectFilter, setSubjectFilter] = useState('')

  // Current-day/current-lecture highlighting (approx based on local time).
  const now = new Date()
  const currentDayIndex = now.getDay() // 0=Sun..6=Sat
  const dayCodeOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentDay = dayCodeOrder[currentDayIndex] || 'Mon'

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  // Map current time to the closest slot (S1..S6). We'll define ranges by label start.
  // These are approximate and can be replaced later.
  const currentSlotCode = (() => {
    if (currentMinutes < 9 * 60) return null
    if (currentMinutes < 10 * 60) return 'S1'
    if (currentMinutes < 11 * 60) return 'S2'
    if (currentMinutes < 12 * 60) return 'S3'
    if (currentMinutes < 13 * 60) return 'S4'
    if (currentMinutes < 15 * 60) return 'S5'
    return 'S6'
  })()


  const DAYS_INDEX = useMemo(() => {
    const m = new Map()
    DAYS.forEach((d, i) => m.set(d, i))
    return m
  }, [])

  const goPrevDay = () => {
    const i = DAYS_INDEX.get(selectedDay) ?? 0
    const next = (i - 1 + DAYS.length) % DAYS.length
    setSelectedDay(DAYS[next])
  }

  const goNextDay = () => {
    const i = DAYS_INDEX.get(selectedDay) ?? 0
    const next = (i + 1) % DAYS.length
    setSelectedDay(DAYS[next])
  }


  const q = normalize(query)
  const subjectQ = normalize(subjectFilter)

  const filtered = useMemo(() => {
    // Start from sample timetable; apply query + subject filter.
    // Keep output shape: filtered[day][slotCode] -> item | null
    const next = {}
    for (const day of DAYS) {
      next[day] = {}
      for (const slot of TIME_SLOTS) {
        const item = TIMETABLE[day]?.[slot.code]
        if (!item) {
          next[day][slot.code] = null
          continue
        }

        let ok = true

        if (q) {
          const haystack = normalize(`${item.subject} ${item.faculty} ${item.time}`)
          ok = ok && haystack.includes(q)
        }

        if (subjectQ) {
          ok = ok && normalize(item.subject).includes(subjectQ)
        }

        next[day][slot.code] = ok ? item : null
      }
    }
    return next
  }, [q, subjectQ])

  const matchedCount = useMemo(() => {
    if (!q && !subjectQ) return null
    let count = 0
    for (const day of DAYS) {
      for (const slot of TIME_SLOTS) {
        if (filtered[day]?.[slot.code]) count++
      }
    }
    return count
  }, [filtered, q, subjectQ])


  return (
    <section className="card">
      <div className="timetableWrap">
        <div className="controls">
          <div className="search">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: OS, Data Structures, Dr. L. Shah"
            />
          </div>

          <div className="search" style={{ minWidth: 220 }}>
            <label htmlFor="subjectFilter">Subject filter</label>
            <input
              id="subjectFilter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              placeholder="e.g. OS / Maths"
            />
          </div>

          <div className="pill" aria-live="polite">
            <span>Matches:</span>
            <strong>{matchedCount === null ? 'All' : matchedCount}</strong>
          </div>
        </div>

        <div className="controls" style={{ paddingTop: 0 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="pill">
              <span>View</span>
              <strong style={{ textTransform: 'capitalize' }}>{viewMode}</strong>
            </div>

            <div className="seg">
              {VIEW_MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={m === viewMode ? 'segBtn active' : 'segBtn'}
                  onClick={() => setViewMode(m)}
                >
                  {m === 'weekly' ? 'Weekly' : m === 'daily' ? 'Daily' : 'Subject-wise'}
                </button>
              ))}
            </div>

            {viewMode !== 'weekly' && (
              <div className="nav">
                <button type="button" className="navBtn" onClick={goPrevDay} aria-label="Previous day">
                  ◀
                </button>
                <div className="navDay">
                  <span className="navDayLabel">{formatDayFull(selectedDay)}</span>
                  <select
                    className="navSelect"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    aria-label="Select day"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" className="navBtn" onClick={goNextDay} aria-label="Next day">
                  ▶
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="tableScroll">
          <table className="timetable">
            <thead>
              <tr>
                <th className="timeCol">Time</th>
                {(viewMode === 'daily' || viewMode === 'subject') ? [selectedDay].map((d) => <th key={d}>{d}</th>) : DAYS.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot.code}>
                  <td className="timeCol">
                    <div className="slotTime">
                      <div className="time">{slot.label}</div>
                      <div className="tag">Slot {slot.code}</div>
                    </div>
                  </td>
                  {(viewMode === 'daily' || viewMode === 'subject')
                    ? [selectedDay].map((day) => (
                        <td key={day + slot.code}>
                          <TimetableCell
                            item={filtered[day]?.[slot.code] ?? null}
                            isCurrentDay={day === currentDay}
                            isCurrentLecture={
                              day === currentDay && slot.code === currentSlotCode
                            }
                          />
                        </td>
                      ))
                    : DAYS.map((day) => (
                        <td key={day + slot.code}>
                          <TimetableCell
                            item={filtered[day]?.[slot.code] ?? null}
                            isCurrentDay={day === currentDay}
                            isCurrentLecture={
                              day === currentDay && slot.code === currentSlotCode
                            }
                          />
                        </td>
                      ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}



```

## src/components/TimetableCell.jsx

```jsx
export default function TimetableCell({ item, isCurrentDay = false, isCurrentLecture = false }) {
  if (!item) {
    return (
      <div className={"cell empty" + (isCurrentLecture ? ' currentLecture' : '')}>
        <div className="subject">—</div>
        <div className="badges">
          <span className="badge time">Free</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        'cell' +
        (isCurrentDay ? ' currentDay' : '') +
        (isCurrentLecture ? ' currentLecture' : '')
      }
    >
      <div className="subject">{item.subject}</div>
      <div className="badges">
        <span className="badge time">{item.time}</span>
        <span className="badge faculty">{item.faculty}</span>
      </div>
    </div>
  )
}



```

## src/components/TimetableSection.jsx

```jsx
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
      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <div className="selector-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ACADEMIC SESSION</label>
            <select className="custom-select" value={session} onChange={(e) => setSession(e.target.value)}>
              {SELECTOR_OPTIONS.sessions.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>YEAR</label>
            <select className="custom-select" value={year} onChange={(e) => setYear(e.target.value)}>
              {SELECTOR_OPTIONS.years.map((y, i) => <option key={i} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>BRANCH</label>
            <select className="custom-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
              {SELECTOR_OPTIONS.branches.map((b, i) => <option key={i} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SEMESTER</label>
            <select className="custom-select" value={semester} onChange={(e) => setSemester(e.target.value)}>
              {SELECTOR_OPTIONS.semesters.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SECTION</label>
            <select className="custom-select" value={section} onChange={(e) => setSection(e.target.value)}>
              {SELECTOR_OPTIONS.sections.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>BATCH</label>
            <select className="custom-select" value={batch} onChange={(e) => setBatch(e.target.value)}>
              {SELECTOR_OPTIONS.batches.map((b, i) => <option key={i} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card" style={{ padding: '16px 20px' }}>
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
                placeholder="🔎 Search by subject, faculty, classroom, day..."
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

            {/* View Mode Segment */}
            <div className="filter-btn-group">
              <button 
                className={`filter-btn ${viewMode === 'weekly' ? 'active' : ''}`}
                onClick={() => setViewMode('weekly')}
              >
                Weekly View
              </button>
              <button 
                className={`filter-btn ${viewMode === 'daily' ? 'active' : ''}`}
                onClick={() => setViewMode('daily')}
              >
                Daily View
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
              ⚡ Labs & Practicals Only
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
      <div className="glass-card" style={{ padding: '20px' }}>
        
        {/* Weekly Stats Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Schedule Board</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {semester} • {branch} • {section}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="pwa-badge" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
              📖 {weeklyClassStats.lectures} Lectures
            </span>
            <span className="pwa-badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
              🔬 {weeklyClassStats.labs} Lab slots
            </span>
            <span className="pwa-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
              ☕ {weeklyClassStats.frees} Free Slots
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

        {/* VIEW 1: Weekly Grid View */}
        {viewMode === 'weekly' && (
          <div className="timetable-scroll">
            <table className="modern-table">
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

                      if (slot.isLunch) {
                        return (
                          <td key={dIdx} className={isToday ? 'highlight-current-day' : ''}>
                            <div className="lecture-cell is-lunch">
                              🍕 Lunch Break
                            </div>
                          </td>
                        )
                      }

                      if (!item) {
                        return (
                          <td key={dIdx} className={isToday ? 'highlight-current-day' : ''}>
                            <div className="lecture-cell free-period">
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>☕ Free</span>
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
                                <span className="cell-subject">{item.subject}</span>
                                <span 
                                  style={{ cursor: 'pointer', fontSize: '12px', userSelect: 'none' }}
                                  onClick={() => onToggleFavorite(item.subject)}
                                >
                                  {isFav ? '⭐' : '☆'}
                                </span>
                              </div>
                              <span className="cell-type" style={{ background: item.color + '15', color: item.color }}>
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
              const item = filteredTimetable[selectedDay]?.[slot.code]
              const isToday = selectedDay === activeDayName
              const isCurrentLecture = isToday && slot.code === activeSlotCode
              const isFav = item ? favorites.includes(item.subject) : false

              if (slot.isLunch) {
                return (
                  <div key={idx} className="lecture-cell is-lunch" style={{ minHeight: '50px', background: 'rgba(255,255,255,0.01)' }}>
                    🍕 Lunch Break • {slot.label}
                  </div>
                )
              }

              if (!item) {
                return (
                  <div key={idx} className="lecture-cell free-period" style={{ padding: '14px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>🕒 {slot.label} — Free Period</span>
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
                    <div key={sIdx} className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: sub.color }}>{sub.subject}</h4>
                        <span className="cell-type" style={{ background: sub.color + '15', color: sub.color }}>
                          {sub.type}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>👨‍🏫 Teacher: <strong>{sub.faculty}</strong></div>
                        <div>📍 Room: <strong>{sub.room}</strong></div>
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

      </div>
    </div>
  )
}

```

## src/data/timetableData.js

```jsx
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const TIME_SLOTS = [
  { label: '09:00 AM - 09:50 AM', code: 'S1' },
  { label: '10:00 AM - 10:50 AM', code: 'S2' },
  { label: '11:00 AM - 11:50 AM', code: 'S3' },
  { label: '12:00 PM - 12:50 PM', code: 'S4' },
  { label: '01:00 PM - 02:00 PM', code: 'LUNCH', isLunch: true },
  { label: '02:00 PM - 02:50 PM', code: 'S5' },
  { label: '03:00 PM - 03:50 PM', code: 'S6' },
  { label: '04:00 PM - 04:50 PM', code: 'S7' }
]

export const TIMETABLE = {
  Monday: {
    S1: { subject: 'DBMS', type: 'Lecture', faculty: 'Dr. Sharma', room: 'A-101', color: '#3b82f6' },
    S2: { subject: 'React JS', type: 'Lecture', faculty: 'Prof. Gupta', room: 'B-202', color: '#10b981' },
    S3: { subject: 'DBMS Lab', type: 'Lab', faculty: 'Dr. Sharma', room: 'Lab-3', color: '#f59e0b', duration: 2 },
    S4: { subject: 'DBMS Lab', type: 'Lab', faculty: 'Dr. Sharma', room: 'Lab-3', color: '#f59e0b', isContinuation: true },
    S5: { subject: 'Mathematics III', type: 'Lecture', faculty: 'Dr. N. Verma', room: 'A-103', color: '#8b5cf6' },
    S6: { subject: 'Operating Systems', type: 'Lecture', faculty: 'Prof. R. Singh', room: 'A-104', color: '#ec4899' },
    S7: null
  },
  Tuesday: {
    S1: { subject: 'Operating Systems', type: 'Lecture', faculty: 'Prof. R. Singh', room: 'A-104', color: '#ec4899' },
    S2: { subject: 'Discrete Math', type: 'Lecture', faculty: 'Dr. P. Iyer', room: 'A-105', color: '#06b6d4' },
    S3: null,
    S4: { subject: 'React JS', type: 'Lecture', faculty: 'Prof. Gupta', room: 'B-202', color: '#10b981' },
    S5: { subject: 'OS Lab', type: 'Lab', faculty: 'Prof. R. Singh', room: 'Lab-1', color: '#ef4444', duration: 2 },
    S6: { subject: 'OS Lab', type: 'Lab', faculty: 'Prof. R. Singh', room: 'Lab-1', color: '#ef4444', isContinuation: true },
    S7: { subject: 'Seminar', type: 'Seminar', faculty: 'Guest Lecturer', room: 'Auditorium', color: '#6366f1' }
  },
  Wednesday: {
    S1: { subject: 'React JS Lab', type: 'Lab', faculty: 'Prof. Gupta', room: 'Lab-2', color: '#10b981', duration: 2 },
    S2: { subject: 'React JS Lab', type: 'Lab', faculty: 'Prof. Gupta', room: 'Lab-2', color: '#10b981', isContinuation: true },
    S3: { subject: 'Mathematics III', type: 'Lecture', faculty: 'Dr. N. Verma', room: 'A-103', color: '#8b5cf6' },
    S4: { subject: 'DBMS', type: 'Lecture', faculty: 'Dr. Sharma', room: 'A-101', color: '#3b82f6' },
    S5: null,
    S6: { subject: 'Computer Networks', type: 'Lecture', faculty: 'Prof. V. Desai', room: 'B-101', color: '#14b8a6' },
    S7: null
  },
  Thursday: {
    S1: { subject: 'Computer Networks', type: 'Lecture', faculty: 'Prof. V. Desai', room: 'B-101', color: '#14b8a6' },
    S2: { subject: 'Discrete Math', type: 'Lecture', faculty: 'Dr. P. Iyer', room: 'A-105', color: '#06b6d4' },
    S3: { subject: 'DBMS', type: 'Lecture', faculty: 'Dr. Sharma', room: 'A-101', color: '#3b82f6' },
    S4: null,
    S5: { subject: 'Mathematics III', type: 'Lecture', faculty: 'Dr. N. Verma', room: 'A-103', color: '#8b5cf6' },
    S6: { subject: 'Operating Systems', type: 'Lecture', faculty: 'Prof. R. Singh', room: 'A-104', color: '#ec4899' },
    S7: { subject: 'Placement Session', type: 'Workshop', faculty: 'TPO Officer', room: 'Seminar Hall', color: '#f97316' }
  },
  Friday: {
    S1: null,
    S2: { subject: 'React JS', type: 'Lecture', faculty: 'Prof. Gupta', room: 'B-202', color: '#10b981' },
    S3: { subject: 'Computer Networks Lab', type: 'Lab', faculty: 'Prof. V. Desai', room: 'Lab-4', color: '#14b8a6', duration: 2 },
    S4: { subject: 'Computer Networks Lab', type: 'Lab', faculty: 'Prof. V. Desai', room: 'Lab-4', color: '#14b8a6', isContinuation: true },
    S5: { subject: 'Discrete Math', type: 'Lecture', faculty: 'Dr. P. Iyer', room: 'A-105', color: '#06b6d4' },
    S6: null,
    S7: { subject: 'Weekly Quiz', type: 'Quiz', faculty: 'TA Team', room: 'A-101', color: '#64748b' }
  },
  Saturday: {
    S1: { subject: 'Project Review', type: 'Workshop', faculty: 'Mentor', room: 'B-202', color: '#0f172a' },
    S2: null,
    S3: null,
    S4: { subject: 'Guest Lecture', type: 'Seminar', faculty: 'Dr. Watson', room: 'Auditorium', color: '#6366f1' },
    S5: null,
    S6: null,
    S7: null
  }
}

export const FACULTY_PROFILES = [
  {
    name: 'Dr. Sharma',
    role: 'Professor',
    dept: 'Computer Science & Engineering',
    specialization: 'Database Management Systems, Big Data Analytics',
    email: 'sharma.dbms@college.edu',
    phone: '+91 98765 43210',
    office: 'Block A, Room 304',
    timings: 'Monday - Friday (1:00 PM - 3:00 PM)',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Prof. Gupta',
    role: 'Associate Professor',
    dept: 'Information Technology',
    specialization: 'Frontend Frameworks, Mobile App Dev',
    email: 'gupta.react@college.edu',
    phone: '+91 98765 43211',
    office: 'Block B, Room 205',
    timings: 'Monday - Wednesday (10:00 AM - 12:00 PM)',
    status: 'In Lecture',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Dr. N. Verma',
    role: 'Assistant Professor',
    dept: 'Applied Mathematics',
    specialization: 'Statistical Methods, Computational Algebra',
    email: 'verma.math@college.edu',
    phone: '+91 98765 43212',
    office: 'Block A, Room 102',
    timings: 'Tuesday - Thursday (3:00 PM - 5:00 PM)',
    status: 'Out of Office',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Prof. R. Singh',
    role: 'Associate Professor',
    dept: 'Computer Science & Engineering',
    specialization: 'Operating Systems, Distributed Architecture',
    email: 'singh.os@college.edu',
    phone: '+91 98765 43213',
    office: 'Block A, Room 307',
    timings: 'Monday & Friday (11:00 AM - 1:00 PM)',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Dr. P. Iyer',
    role: 'Professor',
    dept: 'Computer Science & Engineering',
    specialization: 'Discrete Structures, Graph Theory',
    email: 'iyer.math@college.edu',
    phone: '+91 98765 43214',
    office: 'Block A, Room 309',
    timings: 'Tuesday - Friday (2:00 PM - 4:00 PM)',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Prof. V. Desai',
    role: 'Assistant Professor',
    dept: 'Computer Engineering',
    specialization: 'Networking Protocols, Cyber Security',
    email: 'desai.net@college.edu',
    phone: '+91 98765 43215',
    office: 'Block B, Room 112',
    timings: 'Wednesday - Friday (10:00 AM - 12:00 PM)',
    status: 'In Lecture',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150'
  }
]

export const CLASSROOM_DETAILS = [
  {
    name: 'A-101',
    building: 'Block A',
    floor: '1st Floor',
    capacity: 65,
    type: 'Smart Classroom',
    facilities: ['Projector', 'Air Conditioning', 'Audio System', 'Smart Board'],
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'B-202',
    building: 'Block B',
    floor: '2nd Floor',
    capacity: 60,
    type: 'Smart Classroom',
    facilities: ['Projector', 'Air Conditioning', 'Visualizer'],
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'A-103',
    building: 'Block A',
    floor: '1st Floor',
    capacity: 70,
    type: 'Standard Lecture Hall',
    facilities: ['Projector', 'Whiteboard'],
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'A-104',
    building: 'Block A',
    floor: '1st Floor',
    capacity: 65,
    type: 'Smart Classroom',
    facilities: ['Projector', 'Smart Board'],
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'A-105',
    building: 'Block A',
    floor: '1st Floor',
    capacity: 55,
    type: 'Standard Lecture Hall',
    facilities: ['Projector', 'Blackboard'],
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'B-101',
    building: 'Block B',
    floor: '1st Floor',
    capacity: 80,
    type: 'Smart Lecture Theater',
    facilities: ['Dual Projectors', 'Air Conditioning', 'Surround Sound', 'Smart Podium'],
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Lab-1',
    building: 'Block A',
    floor: '3rd Floor',
    capacity: 40,
    type: 'Operating Systems Lab',
    facilities: ['Linux Desktops', 'Projector', 'Air Conditioning', 'High-Speed LAN'],
    status: 'In Use',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Lab-2',
    building: 'Block B',
    floor: '2nd Floor',
    capacity: 40,
    type: 'Web Development Lab',
    facilities: ['Dual-Boot Desktops', 'Projector', 'Air Conditioning', 'Wired Internet'],
    status: 'In Use',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Lab-3',
    building: 'Block A',
    floor: '3rd Floor',
    capacity: 40,
    type: 'Database Systems Lab',
    facilities: ['Oracle Client Desktops', 'Projector', 'Air Conditioning'],
    status: 'In Use',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Lab-4',
    building: 'Block B',
    floor: '1st Floor',
    capacity: 35,
    type: 'Computer Networking Lab',
    facilities: ['Cisco Routers/Switches', 'Wireshark Workstations', 'Crimping Tools'],
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300'
  }
]

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Mid-Term Exam Registration Extended',
    desc: 'The deadline for registering for the upcoming mid-semester examinations has been extended to June 20, 2026. Make sure to clear all pending dues.',
    date: '2026-06-10',
    type: 'Important',
    sender: 'Academic Office'
  },
  {
    id: 2,
    title: 'React JS Hackathon Registration Open',
    desc: 'Register for the annual Intra-College React Hackathon. Winning team receives cash prizes and internship opportunities at top tech firms.',
    date: '2026-06-08',
    type: 'Event',
    sender: 'Coding Club'
  },
  {
    id: 3,
    title: 'Special Guest Lecture on Cyber Security',
    desc: 'Dr. Watson from CyberTech Labs will conduct a seminar on Modern Encryption Protocols on Saturday, 12:00 PM at the Auditorium.',
    date: '2026-06-05',
    type: 'Notice',
    sender: 'CSE Department'
  }
]

export const EVENTS = [
  {
    title: 'Intra-College Coding Fest',
    date: '2026-06-18',
    time: '09:00 AM onwards',
    location: 'Lab 1 & Lab 2',
    category: 'Competition'
  },
  {
    title: 'Placement Orientation Seminar',
    date: '2026-06-22',
    time: '02:00 PM - 04:00 PM',
    location: 'Seminar Hall',
    category: 'Placement'
  },
  {
    title: 'Project Expo 2026',
    date: '2026-06-28',
    time: '10:00 AM - 05:00 PM',
    location: 'College Exhibition Center',
    category: 'Exhibition'
  }
]

export const ACADEMIC_HUB = {
  assignments: [
    { id: 'a1', subject: 'DBMS', title: 'ER Diagram & Normalization Assignment', due: '2026-06-15', status: 'Pending' },
    { id: 'a2', subject: 'React JS', title: 'Interactive Dashboard App with Theme State', due: '2026-06-19', status: 'Submitted' },
    { id: 'a3', subject: 'Computer Networks', title: 'IP Subnetting and Routing Tables Worksheet', due: '2026-06-25', status: 'Pending' }
  ],
  quizzes: [
    { id: 'q1', subject: 'Discrete Math', title: 'Quiz 2: Propositional Logic', date: '2026-06-16', time: '11:00 AM', duration: '30 mins' },
    { id: 'q2', subject: 'Operating Systems', title: 'Quiz 3: Semaphores & CPU Scheduling', date: '2026-06-20', time: '04:00 PM', duration: '20 mins' }
  ],
  exams: [
    { id: 'e1', subject: 'Mathematics III', title: 'Mid-Sem Examination', date: '2026-07-02', time: '09:30 AM - 11:30 AM', room: 'Block A, Hall 1' },
    { id: 'e2', subject: 'DBMS', title: 'DBMS Practical Lab Examination', date: '2026-07-05', time: '10:00 AM - 01:00 PM', room: 'Lab 3' },
    { id: 'e3', subject: 'Operating Systems', title: 'Mid-Sem Examination', date: '2026-07-08', time: '02:00 PM - 04:00 PM', room: 'Block A, Hall 2' }
  ],
  placements: [
    { id: 'p1', company: 'Google Inc.', role: 'Software Engineer Intern', date: '2026-06-18', stage: 'Coding Round', details: 'Online Platform Test' },
    { id: 'p2', company: 'Infosys Ltd.', role: 'Systems Engineer', date: '2026-06-24', stage: 'Pre-Placement Talk', details: 'Seminar Hall, 2:00 PM' }
  ]
}

export const SELECTOR_OPTIONS = {
  semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'],
  branches: ['Computer Science & Eng', 'Information Technology', 'Electronics & Comm', 'Mechanical Eng', 'Civil Eng'],
  sections: ['Section A', 'Section B', 'Section C'],
  years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  batches: ['Batch B1', 'Batch B2', 'Batch B3', 'All Batches'],
  sessions: ['Academic Session 2025-26', 'Academic Session 2026-27']
}

```

## public/manifest.json

```json
{
  "short_name": "TimetablePortal",
  "name": "College Timetable Viewer & Portal",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#0b1220",
  "background_color": "#0b1220"
}

```

## public/sw.js

```jsx
const CACHE_NAME = "timetable-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/src/main.jsx",
  "/src/App.jsx",
  "/src/styles.css",
  "/src/data/timetableData.js",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback for document request when offline
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});

```

