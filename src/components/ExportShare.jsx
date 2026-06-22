import React, { useState } from 'react'
import './ExportShare.css'

export default function ExportShare() {
  const [showQrModal, setShowQrModal] = useState(false)
  const [copiedStatus, setCopiedStatus] = useState(false)
  const [isTossing, setIsTossing] = useState(false)

  const runTossAnimation = (callback) => {
    setIsTossing(true)
    setTimeout(() => {
      setIsTossing(false)
      if (callback) {
        // Wait briefly for React to apply the setIsTossing(false) DOM updates
        // before executing blocking actions like window.print()
        setTimeout(callback, 100)
      }
    }, 1600)
  }



  const handlePrint = () => {
    runTossAnimation(() => {
      window.print()
    })
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
    runTossAnimation(() => {
      setTimeout(() => setCopiedStatus(false), 2000)
    })
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

    runTossAnimation()
  }

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
      {isTossing && (
        <div className="bottle-toss-overlay">
          <div className="bottle-container">
            <div className="sea-waves">〰️〰️〰️</div>
            <div className="bottle-icon">🍾</div>
          </div>
        </div>
      )}
      <div className="card-title">
        <span className="nav-item-icon">🍾</span>
        <span>Message in a Bottle (Export)</span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '20px' }}>
        Download your college schedules in different document types, print landscape sheets, copy text summaries, or scan/share schedules with mobile devices.
      </p>



      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Print timetable */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div>
            <strong style={{ fontSize: '14px' }}>Seal Parchment (PDF)</strong>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Format timetable as a clean physical sheet.</div>
          </div>
          <button 
            className="share-action-btn toss-action-btn" 
            onClick={handlePrint}
            disabled={isTossing}
            style={{ opacity: isTossing ? 0.5 : 1 }}
          >
            📜 Toss Parchment
          </button>
        </div>

        {/* Copy text summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div>
            <strong style={{ fontSize: '14px' }}>Copy Sea Shanty (Summary)</strong>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Copies clean text outlines of all class hours.</div>
          </div>
          <button 
            className="share-action-btn toss-action-btn" 
            onClick={handleCopySummary}
            disabled={isTossing}
            style={{ opacity: isTossing ? 0.5 : 1 }}
          >
            {copiedStatus ? '✅ Sent!' : '🦜 Toss Shanty'}
          </button>
        </div>

        {/* Download metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div>
            <strong style={{ fontSize: '14px' }}>Download Bottled JSON</strong>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Import schedule configurations in other ships.</div>
          </div>
          <button 
            className="share-action-btn toss-action-btn" 
            onClick={handleDownloadJson}
            disabled={isTossing}
            style={{ opacity: isTossing ? 0.5 : 1 }}
          >
            💾 Toss JSON Bottle
          </button>
        </div>

        {/* Mobile QR sharing */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div>
            <strong style={{ fontSize: '14px' }}>Share Pirate Sigil (QR)</strong>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scan with spyglass (camera) to sync schedule.</div>
          </div>
          <button className="share-action-btn" onClick={() => runTossAnimation(() => setShowQrModal(true))}>
            🧭 Show Sigil
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
                <rect x="70" y="20" width="10" height="10" fill="black" />
                
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
