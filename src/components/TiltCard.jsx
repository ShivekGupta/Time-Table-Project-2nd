import React, { useRef, useState } from 'react';

export default function TiltCard({ 
  title, 
  subtitle, 
  description, 
  artwork, 
  stats = [], 
  backContent = null 
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e) => {
    // If card is flipped, disable the tilt effect to allow reading the back content easily
    if (isFlipped || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Coordinates relative to card center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Max rotation angles (20 degrees)
    const maxRotate = 20;
    const rotateX = -(y / (rect.height / 2)) * maxRotate;
    const rotateY = (x / (rect.width / 2)) * maxRotate;
    
    // Glare position percentage
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;

    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`,
      transition: 'transform 0.05s ease-out',
    });

    setGlareStyle({
      opacity: 0.35,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`,
    });
  };

  const handleMouseLeave = () => {
    if (isFlipped) return;
    
    // Smooth reset on mouse leave
    setStyle({
      transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease',
    });
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    // Reset tilt style when flipping to avoid distortion on back content
    setStyle({
      transform: !isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease',
    });
  };

  return (
    <div className="tilt-container" onClick={handleCardClick}>
      <div 
        ref={cardRef}
        className={`tilt-card ${isFlipped ? 'flipped' : ''}`}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* CARD FRONT FACE */}
        <div className="card-face card-front">
          {/* Shiny Overlay */}
          <div className="tilt-glare" style={glareStyle} />
          
          {/* Background Glow */}
          <div className="tilt-bg-glow" />

          {/* 3D Floating Artwork Layer */}
          <div className="tilt-artwork">
            <img src={artwork} alt={title} className="artwork-img" />
          </div>

          {/* Floating Info Layer */}
          <div className="tilt-info">
            <span className="tilt-subtitle">{subtitle}</span>
            <h3 className="tilt-title">{title}</h3>
            <p className="tilt-description">{description}</p>
            
            {stats.length > 0 && (
              <div className="tilt-stats">
                {stats.map((stat, idx) => (
                  <div key={idx} className="tilt-stat-col">
                    <span className="tilt-stat-val">{stat.value}</span>
                    <span className="tilt-stat-lbl">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD BACK FACE */}
        <div className="card-face card-back">
          <div className="tilt-bg-glow" />
          
          <div className="card-back-header">
            <span className="tilt-subtitle">{subtitle}</span>
            <h3 className="tilt-title">{title}</h3>
          </div>

          <div className="card-back-body">
            {backContent ? (
              backContent
            ) : (
              <div className="placeholder-back-content">
                <div className="parchment-log">
                  <h4>📜 Ship's Log Entry</h4>
                  <p>A vital part of the Grand Voyage crew. This card represents a milestone of your academic exploration across the uncharted seas of knowledge.</p>
                </div>
                <div className="stats-list">
                  <div className="stat-row">
                    <span>Power Rank</span>
                    <span>★★★★★</span>
                  </div>
                  <div className="stat-row">
                    <span>Rarity</span>
                    <span style={{ color: '#ffd700', fontWeight: 'bold' }}>LEGENDARY</span>
                  </div>
                  <div className="stat-row">
                    <span>Origin</span>
                    <span>Aether Archipelago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card-back-footer">
            <span>Click to flip card</span>
          </div>
        </div>
      </div>
    </div>
  );
}
