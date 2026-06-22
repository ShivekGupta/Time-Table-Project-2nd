import React, { useState, useEffect, useRef } from 'react';
import { audioSynth } from '../utils/audioSynth';

const PirateMap = ({ onNavigate, isAudioPlaying, activeTab, onFindTreasure }) => {
  const containerRef = useRef(null);
  const glassRef = useRef(null);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [visitedIslands, setVisitedIslands] = useState(() => {
    const saved = localStorage.getItem('pirate_map_fog');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Tooltip State for the cloud box
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: '', text: '' });
  
  const [theme, setTheme] = useState('default');
  const [easterEggFound, setEasterEggFound] = useState(false);

  const [doubloons, setDoubloons] = useState(() => {
    const saved = localStorage.getItem('pirate_map_doubloons');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, top: '15%', left: '40%', found: false },
      { id: 2, top: '55%', left: '85%', found: false },
      { id: 3, top: '85%', left: '15%', found: false },
      { id: 4, top: '40%', left: '10%', found: false },
      { id: 5, top: '30%', left: '60%', found: false }
    ];
  });

  const foundCount = doubloons.filter(d => d.found).length;
  let shipIcon = '🛶';
  let shipName = 'Leaky Raft';
  let shipLevel = 1;
  
  if (foundCount >= 1) { shipIcon = '⛵'; shipName = 'Sturdy Sloop'; shipLevel = 2; }
  if (foundCount >= 3) { shipIcon = '🚢'; shipName = 'Mighty Galleon'; shipLevel = 3; }
  if (foundCount >= 5) { shipIcon = '☠️'; shipName = 'Phantom Ship'; shipLevel = 4; }

  useEffect(() => {
    localStorage.setItem('pirate_map_fog', JSON.stringify(visitedIslands));
  }, [visitedIslands]);

  useEffect(() => {
    localStorage.setItem('pirate_map_doubloons', JSON.stringify(doubloons));
  }, [doubloons]);

  const handleDoubloonClick = (d) => {
    if (d.found) return;
    if (isAudioPlaying) audioSynth.playCoinSound();
    setDoubloons(prev => prev.map(db => db.id === d.id ? { ...db, found: true } : db));
    if (onFindTreasure) onFindTreasure();
  };

  const markers = [
    { id: 'dashboard', icon: '⚓', label: 'Dashboard', desc: 'Your central hub, navigation, and crew notices.', top: '20%', left: '30%' },
    { id: 'timetable', icon: '🗺️', label: 'Timetable', desc: 'Unfold the map to see your plotted course for the week.', top: '35%', left: '50%' },
    { id: 'attendance', icon: '👥', label: 'Attendance', desc: 'Monitor your crew\'s standing and keep the ship afloat.', top: '25%', left: '70%' },
    { id: 'directory', icon: '🧭', label: 'Directory', desc: 'Search for seasoned navigators and legendary classrooms.', top: '50%', left: '25%' },
    { id: 'academic', icon: '📜', label: 'Academic', desc: 'Track your pending bounties, duels, and academic treasures.', top: '45%', left: '75%' },
    { id: 'focus', icon: '⏳', label: 'Focus Mode', desc: 'No winds, no distractions. Deep focus timer for long voyages.', top: '65%', left: '40%' },
    { id: 'analytics', icon: '📊', label: 'Analytics', desc: 'Visual workloads, weekly hours distribution, and sailing metrics.', top: '70%', left: '60%' },
    { id: 'assistant', icon: '🦜', label: 'Assistant', desc: 'Consult the Oracle, check for storms, or auto-schedule duties.', top: '80%', left: '30%' },
    { id: 'gallery', icon: '📖', label: 'Gallery', desc: 'Inspect the crew, fleet, and milestones of your voyage.', top: '85%', left: '80%' },
    { id: 'export', icon: '✉️', label: 'Export', desc: 'Print your maps, download logs, and send shareable QRs.', top: '15%', left: '85%' },
    { id: 'settings', icon: '⚙️', label: 'Settings', desc: 'Configure ship colors, accessibility, and favorite routes.', top: '90%', left: '50%' },
    { id: 'school', icon: '🎒', label: 'School Isle', desc: 'Embark on fundamental quests and share progress with parents.', top: '30%', left: '15%' },
    { id: 'college', icon: '🎓', label: 'College Cove', desc: 'Navigate advanced coursework and secure internships.', top: '60%', left: '75%' },
    { id: 'examprep', icon: '⚡', label: 'Exam Peak', desc: 'High-intensity timer tests and mock exams.', top: '45%', left: '40%' },
    { id: 'masters', icon: '🦉', label: 'Scholars Deep', desc: 'Deep dive into literature and research methodologies.', top: '75%', left: '15%' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Shift') setIsShiftDown(true); };
    const handleKeyUp = (e) => { if (e.key === 'Shift') setIsShiftDown(false); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (activeTab && activeTab !== 'map') {
      const marker = markers.find(m => m.id === activeTab);
      if (marker) {
        setVisitedIslands(prev => {
          const last = prev[prev.length - 1];
          if (last && last.id === marker.id) return prev;
          return [...prev, marker];
        });
      }
    }
  }, [activeTab]);

  const handleMarkerClick = (marker) => {
    setVisitedIslands(prev => {
      const last = prev[prev.length - 1];
      if (last && last.id === marker.id) return prev;
      return [...prev, marker];
    });
    if (isAudioPlaying) audioSynth.playClickSound();

    // 3D Spatial camera fly-in transition
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 1s cubic-bezier(0.25, 1, 0.5, 1), filter 1s ease';
      containerRef.current.style.transformOrigin = `${marker.left} ${marker.top}`;
      containerRef.current.style.transform = 'scale(4) translateZ(50px)';
      containerRef.current.style.filter = 'brightness(1.5) contrast(1.2)';
    }

    setTimeout(() => {
      onNavigate(marker.id);
      // Reset after transition so coming back to the map is normal
      if (containerRef.current) {
        setTimeout(() => {
          containerRef.current.style.transition = 'none';
          containerRef.current.style.transform = 'scale(1) translateZ(0)';
          containerRef.current.style.filter = 'none';
        }, 100);
      }
    }, 900);
  };

  const handleGlobalMouseMove = (e) => {
    if (tooltip.visible) {
      setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    }

    if (!containerRef.current || !glassRef.current || !isShiftDown) {
      if (glassRef.current) glassRef.current.style.opacity = '0';
      return;
    }
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const glass = glassRef.current;
    const zoom = 2.5;
    const glassSize = 250;

    let x = e.clientX - left;
    let y = e.clientY - top;

    x = Math.max(0, Math.min(x, width));
    y = Math.max(0, Math.min(y, height));

    const bgWidth = width * zoom;
    const bgHeight = height * zoom;
    const bgPosX = (glassSize / 2) - (x * zoom);
    const bgPosY = (glassSize / 2) - (y * zoom);

    glass.style.opacity = '1';
    glass.style.transform = `translate3d(${x - glassSize / 2}px, ${y - glassSize / 2}px, 0)`;
    glass.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
    glass.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  };

  return (
    <div 
      className="pirate-map-container" 
      style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden', position: 'relative' }}
      onMouseMove={handleGlobalMouseMove}
    >
      <style>{`
        @keyframes drawPath {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        .path-anim {
          animation: drawPath 1.5s ease-out forwards;
        }
        .cloud-tooltip {
          position: fixed;
          background: rgba(255, 250, 240, 0.95);
          border: 2px solid #d97706;
          border-radius: 16px;
          padding: 12px 16px;
          color: #291f14;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          pointer-events: none;
          z-index: 9999;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5), inset 0 0 10px rgba(217, 119, 6, 0.2);
          transform: translate(-100%, -100%);
          margin-top: -15px;
          margin-left: -15px;
          transition: opacity 0.2s ease;
          max-width: 260px;
          white-space: pre-wrap;
          line-height: 1.4;
        }
        .cloud-tooltip::after {
          content: '';
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 30px;
          height: 30px;
          background: inherit;
          border-right: 2px solid #d97706;
          border-bottom: 2px solid #d97706;
          border-radius: 50%;
          z-index: -1;
        }
        @keyframes snowfall {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .snow-layer {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 200%;
          pointer-events: none;
          background-image: 
            radial-gradient(4px 4px at 100px 50px, #fff, transparent),
            radial-gradient(6px 6px at 200px 150px, #fff, transparent),
            radial-gradient(3px 3px at 300px 250px, #fff, transparent),
            radial-gradient(4px 4px at 400px 350px, #fff, transparent),
            radial-gradient(6px 6px at 500px 100px, #fff, transparent),
            radial-gradient(5px 5px at 50px 200px, #fff, transparent);
          background-size: 600px 400px;
          animation: snowfall 10s linear infinite;
          opacity: 0.8;
          z-index: 20;
        }
        .fog-layer {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          background: linear-gradient(to bottom, rgba(200,210,220,0.4), rgba(200,210,220,0.7));
          backdrop-filter: blur(4px);
          z-index: 20;
          animation: float 20s ease-in-out infinite alternate;
        }
      `}</style>
      
      {/* Gamification: Doubloon Shop (Idea 056) */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '10px', border: '1px solid #d97706' }}>
        <h3 style={{ color: '#fbbf24', margin: '0 0 10px 0', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>🏴‍☠️ Pirate Shop</span>
          <span>🪙 {doubloons}</span>
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setTheme('default')}
            style={{ background: theme === 'default' ? 'var(--accent)' : 'rgba(0,0,0,0.5)', border: '1px solid var(--accent)', color: '#fff', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >☀️ Clear Sky</button>
          
          <button 
            onClick={() => {
              const unlocked = JSON.parse(localStorage.getItem('pirate_unlocked_snow') || 'false');
              if (unlocked) { setTheme('snow'); return; }
              if (doubloons >= 10) {
                setDoubloons(d => d - 10);
                localStorage.setItem('pirate_unlocked_snow', 'true');
                setTheme('snow');
                if (isAudioPlaying) audioSynth.playClickSound();
              } else {
                alert("Not enough doubloons! You need 10 to unlock Snow.");
              }
            }}
            style={{ background: theme === 'snow' ? '#3b82f6' : 'rgba(0,0,0,0.5)', border: '1px solid #3b82f6', color: '#fff', padding: '8px 12px', borderRadius: '5px', cursor: JSON.parse(localStorage.getItem('pirate_unlocked_snow') || 'false') ? 'pointer' : 'not-allowed', opacity: JSON.parse(localStorage.getItem('pirate_unlocked_snow') || 'false') ? 1 : 0.7 }}
          >
            ❄️ Snow {JSON.parse(localStorage.getItem('pirate_unlocked_snow') || 'false') ? '' : '(🪙10)'}
          </button>

          <button 
            onClick={() => {
              const unlocked = JSON.parse(localStorage.getItem('pirate_unlocked_fog') || 'false');
              if (unlocked) { setTheme('fog'); return; }
              if (doubloons >= 15) {
                setDoubloons(d => d - 15);
                localStorage.setItem('pirate_unlocked_fog', 'true');
                setTheme('fog');
                if (isAudioPlaying) audioSynth.playClickSound();
              } else {
                alert("Not enough doubloons! You need 15 to unlock Fog.");
              }
            }}
            style={{ background: theme === 'fog' ? '#94a3b8' : 'rgba(0,0,0,0.5)', border: '1px solid #94a3b8', color: '#fff', padding: '8px 12px', borderRadius: '5px', cursor: JSON.parse(localStorage.getItem('pirate_unlocked_fog') || 'false') ? 'pointer' : 'not-allowed', opacity: JSON.parse(localStorage.getItem('pirate_unlocked_fog') || 'false') ? 1 : 0.7 }}
          >
            🌫️ Fog {JSON.parse(localStorage.getItem('pirate_unlocked_fog') || 'false') ? '' : '(🪙15)'}
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        onMouseLeave={() => { if (glassRef.current) glassRef.current.style.opacity = '0'; }}
        style={{ width: '100%', height: '100%', position: 'relative', display: 'block', cursor: isShiftDown ? 'none' : 'auto' }}
      >
        <img 
          src="/assets/pirate_map_classic_1782070123141.png" 
          alt="Pirate Map" 
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
        />
        
        {/* SVG Overlays */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="30" />
            </filter>
            <filter id="ink-bleed">
              <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
              <feDisplacementMap in="blur" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feComponentTransfer in="displaced">
                <feFuncA type="linear" slope="1.5" intercept="-0.2" />
              </feComponentTransfer>
            </filter>
            <mask id="fog-mask">
              <rect width="100%" height="100%" fill="white" />
              {visitedIslands.map((m, i) => (
                <circle key={`circle-${i}`} cx={m.left} cy={m.top} r="15%" fill="black" filter="url(#ink-bleed)" />
              ))}
            </mask>
            {visitedIslands.length > 1 && visitedIslands.map((m, i) => {
              if (i === 0) return null;
              const prev = visitedIslands[i-1];
              return (
                <mask id={`path-mask-${i}`} key={`mask-${i}`}>
                  <line 
                    x1={prev.left} y1={prev.top} 
                    x2={m.left} y2={m.top}
                    stroke="white"
                    strokeWidth="10"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    className="path-anim"
                  />
                </mask>
              );
            })}
          </defs>

          {/* Fog of War */}
          <rect width="100%" height="100%" fill="rgba(5, 11, 20, 0.75)" mask="url(#fog-mask)" />

          {/* Animated Ship Paths */}
          {visitedIslands.length > 1 && visitedIslands.map((m, i) => {
            if (i === 0) return null;
            const prev = visitedIslands[i-1];
            return (
              <line 
                key={`line-${i}`}
                x1={prev.left} y1={prev.top} 
                x2={m.left} y2={m.top}
                stroke="#fbbf24"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeLinecap="round"
                filter="drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))"
                mask={`url(#path-mask-${i})`}
              />
            );
          })}
        </svg>

        {/* Day/Night Cycle Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 20, 60, 0.2)', mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 1 }} />
        
        {/* Ambient Animations */}
        <div className="cloud-shadow" style={{ top: '20%', animationDelay: '0s' }} />
        <div className="cloud-shadow" style={{ top: '60%', animationDelay: '-15s', animationDuration: '35s' }} />
        <div className="cloud-shadow" style={{ top: '80%', animationDelay: '-25s', animationDuration: '50s' }} />
        
        <div style={{ position: 'absolute', top: '30%', left: '50%', pointerEvents: 'none', zIndex: 6 }}>
          <div className="seagull" style={{ animationDelay: '0s' }} />
          <div className="seagull" style={{ animationDelay: '-5s' }} />
          <div className="seagull" style={{ animationDelay: '-10s' }} />
        </div>

        {/* Hidden Doubloons */}
        {doubloons.map(d => !d.found && (
          <div 
            key={d.id}
            className="hidden-doubloon"
            style={{ top: d.top, left: d.left }}
            onClick={(e) => { e.stopPropagation(); handleDoubloonClick(d); }}
            title="A hidden doubloon!"
          />
        ))}

        {/* Kraken Zone (Deep Ocean Easter Egg) */}
        <div 
          style={{ position: 'absolute', top: '75%', left: '15%', width: '100px', height: '100px', cursor: 'help', zIndex: 3, borderRadius: '50%' }}
          onClick={(e) => { 
            e.stopPropagation(); 
            if (isAudioPlaying) audioSynth.playSplash(); 
          }}
          title="Here Be Monsters..."
        />

        {/* Hidden Easter Egg Clickable */}
        {!easterEggFound && (
          <div 
            style={{ position: 'absolute', top: '10%', left: '10%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 40, background: 'transparent' }}
            onClick={(e) => {
              e.stopPropagation();
              if (isAudioPlaying) audioSynth.playClickSound();
              setEasterEggFound(true);
            }}
            title="Mysterious Starfish"
          />
        )}
        {easterEggFound && (
          <div style={{ position: 'absolute', top: '10%', left: '10%', color: '#fbbf24', fontSize: '1.5rem', fontWeight: 'bold', zIndex: 40, textShadow: '0 0 10px #fbbf24' }}>
            🌟 Easter Egg Found! Title Unlocked: "The Keen-Eyed"
          </div>
        )}

        {/* Weather Overlays */}
        {theme === 'snow' && <div className="snow-layer" />}
        {theme === 'fog' && <div className="fog-layer" />}

        {/* Markers */}
        {markers.map(marker => {
          const isCurrent = activeTab === marker.id;
          return (
          <div 
            key={marker.id}
            className={`map-marker ${isCurrent ? 'active-marker' : ''}`}
            style={{ position: 'absolute', top: marker.top, left: marker.left, cursor: 'pointer', transform: 'translate(-50%, -50%)', textAlign: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onClick={() => handleMarkerClick(marker)}
            onMouseEnter={(e) => {
              if (isAudioPlaying) audioSynth.playHoverSound();
              setTooltip({ visible: true, x: e.clientX, y: e.clientY, title: marker.label, text: marker.desc });
            }}
            onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
          >
            <div className="marker-pin" style={{
              width: '48px', height: '48px', margin: '0 auto',
              background: isCurrent ? 'rgba(217, 119, 6, 0.85)' : 'rgba(10, 18, 30, 0.75)',
              backdropFilter: 'blur(8px)',
              border: isCurrent ? '2px solid #fbbf24' : '2px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem',
              boxShadow: isCurrent ? '0 0 25px rgba(217, 119, 6, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.3)' : '0 8px 16px rgba(0,0,0,0.6), inset 0 0 5px rgba(255,255,255,0.1)',
              transform: isCurrent ? 'scale(1.15) translateY(-4px)' : 'scale(1) translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: isCurrent ? 10 : 1
            }}>
              <span style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}>{marker.icon}</span>
            </div>
            {/* Tooltip cloud box replaces standard inline label */}
          </div>
        )})}

        {/* The Spyglass Overlay */}
        <div
          ref={glassRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            border: '4px solid #b8860b',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.8)',
            backgroundImage: 'url(/assets/pirate_map_classic_1782070123141.png)',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            opacity: 0,
            zIndex: 100,
            willChange: 'transform, background-position'
          }}
        />
      </div>

      {/* Cloud Box Tooltip */}
      {tooltip.visible && (
        <div className="cloud-tooltip" style={{ top: tooltip.y, left: tooltip.x }}>
          <div style={{ fontSize: '1.2rem', color: '#b45309', marginBottom: '4px', borderBottom: '1px solid rgba(217, 119, 6, 0.3)', paddingBottom: '4px' }}>{tooltip.title}</div>
          <div style={{ fontWeight: 500, color: '#543f2a' }}>{tooltip.text}</div>
        </div>
      )}

      {/* Ship Avatar UI */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(10, 18, 30, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '2px solid rgba(212, 175, 55, 0.6)',
        borderRadius: '16px',
        padding: '15px 25px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        zIndex: 50,
        color: '#f8fafc',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>
          {shipIcon}
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Level {shipLevel} Captain
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>
            {shipName}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            {foundCount} / 5 Doubloons Found
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PirateMap);
