import React, { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './AiAssistant.css'

function OracleCrystal({ oracleState }) {
  const meshRef = useRef()
  
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    // Base floating
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    
    if (oracleState === 'thinking') {
      meshRef.current.rotation.y += delta * 5
      meshRef.current.rotation.x += delta * 5
      meshRef.current.material.color.lerp(new THREE.Color('#fbbf24'), 0.1) // Orange
      meshRef.current.material.emissive.lerp(new THREE.Color('#fbbf24'), 0.1)
    } else if (oracleState === 'speaking') {
      meshRef.current.rotation.y += delta * 1
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.1)
      meshRef.current.material.color.lerp(new THREE.Color('#10b981'), 0.1) // Green
      meshRef.current.material.emissive.lerp(new THREE.Color('#10b981'), 0.1)
    } else {
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      meshRef.current.material.color.lerp(new THREE.Color('#3b82f6'), 0.1) // Blue
      meshRef.current.material.emissive.lerp(new THREE.Color('#1d4ed8'), 0.1)
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          wireframe={true}
          color="#3b82f6" 
          emissive="#1d4ed8"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
        <mesh>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      </mesh>
    </group>
  )
}

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Squawk! I be the Ship\'s Oracle. Ask me anything like:\n• "What be my next voyage?"\n• "Who captains React JS?"\n• "Where is the Armory (Lab-3)?"' }
  ])
  const [input, setInput] = useState('')
  const [oracleState, setOracleState] = useState('idle')

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
    setOracleState('thinking')

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

      setOracleState('speaking')
      setMessages(prev => [...prev, { sender: 'bot', text: reply }])
      
      setTimeout(() => {
        setOracleState('idle')
      }, 3000)
    }, 1500)
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
      { type: 'strict', day: 'Monday', subject: 'DBMS Mid-Term Deadline', time: '09:00 AM - 11:00 AM', color: '#ef4444' },
      { type: 'flexible', day: 'Monday', subject: 'Read 1 Chapter (Habit)', time: 'Flexible 1 hr', color: '#10b981' },
      { type: 'strict', day: 'Wednesday', subject: 'React Component Project', time: '10:00 AM - 01:00 PM', color: '#f59e0b' },
      { type: 'flexible', day: 'Wednesday', subject: 'Daily Meditation', time: 'Flexible 20 min', color: '#10b981' },
      { type: 'strict', day: 'Friday', subject: 'OS Multi-threading Lab Exam', time: '02:00 PM - 05:00 PM', color: '#ef4444' },
      { type: 'flexible', day: 'Friday', subject: 'Review Notes & Relax', time: 'Flexible Evening', color: '#3b82f6' }
    ])
  }

  return (
    <div className="analytics-dashboard" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
      
      {/* COLUMN 1: AI Chat Assistant */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="card-title">
          <span className="nav-item-icon">🦜</span>
          <span>The Ship's Oracle</span>
        </div>

        {/* 3D Oracle Canvas */}
        <div style={{ height: '220px', width: '100%', background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', borderRadius: '12px', marginBottom: '15px' }}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <OracleCrystal oracleState={oracleState} />
          </Canvas>
        </div>

        <div className="oracle-container" style={{ flex: 1 }}>
          <div className="oracle-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`oracle-message ${msg.sender}`}>
                {msg.text.split('\n').map((line, lIdx) => <div key={lIdx}>{line}</div>)}
              </div>
            ))}
          </div>

          <div className="oracle-input-area">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the Oracle a question..."
            />
            <button className="oracle-send-btn" onClick={handleSend}>
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
            <span className="nav-item-icon">🐙</span>
            <span>Kraken Radar (Clash Detection)</span>
          </div>
          
          <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '14px' }}>
            Scan the timetable for scheduling conflicts, room double-bookings, or faculty overlaps.
          </p>

          <button 
            className="share-action-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={checkClashes}
          >
            Scan for Sea Monsters (Overlaps)
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
            <span className="nav-item-icon">📜</span>
            <span>Quartermaster's Itinerary (Balanced Blend)</span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '14px' }}>
            Automatically generate a complementary self-study schedule fitted perfectly around your free periods.
          </p>

          <button 
            className="share-action-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={generateStudySchedule}
          >
            Auto-Generate Schedule
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
                    <strong style={{ color: item.color }}>{item.subject}</strong>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.day} • {item.type === 'strict' ? 'Strict Deadline' : 'Flexible Habit'}</div>
                  </div>
                  <span style={{ color: item.color, fontWeight: 600 }}>{item.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
