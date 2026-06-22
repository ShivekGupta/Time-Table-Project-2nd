import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace the `return (` block.
start_index = content.find('  return (')
end_index = content.rfind('}')

# Let's extract the header part from original content
header_start = content.find('<header className="top-header">')
header_end = content.find('</header>') + len('</header>')
header_content = content[header_start:header_end]
# Make header absolute
header_content = header_content.replace('<header className="top-header">', '<header className="top-header" style={{ position: \'absolute\', top: 0, left: 0, right: 0, zIndex: 10 }}>')

settings_start = content.find('{activeTab === \'settings\' && (')
settings_end = content.find('</section>')

settings_content = content[settings_start:settings_end]

new_return = f"""  return (
    <div className="app-container">
      {{use3DBackground ? <ThreeCanvas /> : <OceanWaves />}}
      
      <div className="map-background" style={{{{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}}}>
        <PirateMap onNavigate={{setActiveTab}} />
      </div>

      {header_content}

      {{activeTab !== 'map' && (
        <div className="map-modal-overlay">
          <div className="map-modal-content">
            <button className="map-modal-close-btn" onClick={{() => setActiveTab('map')}}>
              ✖ Close
            </button>
            <main className="main-content" style={{{{ padding: '20px', overflowY: 'auto', maxHeight: '80vh', width: '100%', margin: 0, maxWidth: '100%' }}}}>
              <section style={{{{ animation: 'fade-in 0.3s ease-out' }}}}>
                {{activeTab === 'dashboard' && <Dashboard onNavigate={{setActiveTab}} attendanceData={{attendanceData}} themeColor={{colorTheme}} />}}
                {{activeTab === 'timetable' && <TimetableSection favorites={{favorites}} onToggleFavorite={{handleToggleFavorite}} />}}
                {{activeTab === 'attendance' && <AttendanceTracker attendanceData={{attendanceData}} onUpdateAttendance={{handleUpdateAttendance}} />}}
                {{activeTab === 'directory' && <FacultyClassrooms />}}
                {{activeTab === 'academic' && <AcademicHub />}}
                {{activeTab === 'focus' && <FocusMode />}}
                {{activeTab === 'analytics' && <Analytics />}}
                {{activeTab === 'assistant' && <AiAssistant />}}
                {{activeTab === 'export' && <ExportShare />}}
                {{activeTab === 'gallery' && <PirateGallery />}}
                {settings_content}
              </section>
            </main>
          </div>
        </div>
      )}}
    </div>
  )
}}
"""

new_content = content[:start_index] + new_return
with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
