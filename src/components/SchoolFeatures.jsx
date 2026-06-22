import React, { useState, useEffect } from 'react';

const SchoolFeatures = () => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(350);

  const subjects = [
    { name: 'Mathematics', icon: '📐', progress: 75 },
    { name: 'Science', icon: '🔬', progress: 40 },
    { name: 'History', icon: '📜', progress: 90 },
    { name: 'Literature', icon: '📚', progress: 60 }
  ];

  const [streak, setStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(true);

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem('school_streak') || '0', 10);
    const lastClaim = localStorage.getItem('school_last_claim');
    const today = new Date().toDateString();

    if (lastClaim === today) {
      setCanClaim(false);
      setStreak(savedStreak);
    } else if (lastClaim) {
      // Check if it was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastClaim === yesterday.toDateString()) {
        setStreak(savedStreak);
      } else {
        setStreak(0); // Streak broken
      }
    }
  }, []);

  const claimDaily = () => {
    if (!canClaim) return;
    const newStreak = streak + 1;
    setStreak(newStreak);
    setCanClaim(false);
    localStorage.setItem('school_streak', newStreak.toString());
    localStorage.setItem('school_last_claim', new Date().toDateString());
    // Also give some XP
    setXp(prev => Math.min(prev + 50, 500));
  };

  return (
    <div className="school-features-container" style={{ padding: '20px', color: 'var(--text)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '5px' }}>School Isle Adventures</h2>
          <p style={{ color: 'var(--text-muted)' }}>Embark on learning quests and level up your skills!</p>
        </div>
        <div style={{ textAlign: 'right', background: 'var(--glass-bg)', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Explorer Level {level}</div>
          <div style={{ width: '150px', height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${(xp / 500) * 100}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }}></div>
          </div>
          <div style={{ fontSize: '0.8rem', marginTop: '5px', color: 'var(--text-muted)' }}>{xp} / 500 XP</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {subjects.map(sub => (
          <div key={sub.name} className="glass-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{sub.icon}</div>
            <h3 style={{ marginBottom: '10px' }}>{sub.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
              <span>Quest Progress</span>
              <span>{sub.progress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
              <div style={{ width: `${sub.progress}%`, height: '100%', background: sub.progress > 80 ? '#10b981' : 'var(--accent)', borderRadius: '3px' }}></div>
            </div>
            <button className="share-action-btn" style={{ width: '100%', marginTop: '15px' }}>Continue Quest</button>
          </div>
        ))}
      </div>

      {/* Daily Habit Streak */}
      <div className="glass-card" style={{ marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔥</span> Daily Habit Streak
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>Log in every day to grow your pirate beanstalk!</p>
          <div style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Current Streak: {streak} Day{streak !== 1 ? 's' : ''}
          </div>
        </div>
        <div>
          <button 
            className={`share-action-btn ${!canClaim ? 'disabled' : ''}`} 
            onClick={claimDaily}
            disabled={!canClaim}
            style={{ opacity: canClaim ? 1 : 0.5, cursor: canClaim ? 'pointer' : 'not-allowed' }}
          >
            {canClaim ? 'Claim Daily XP' : 'Come back tomorrow!'}
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '30px' }}>
        <h3>Parent & Teacher Port</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Review recent reports, upcoming parent-teacher meetings, and performance analytics.</p>
        <button className="share-action-btn">Open Parent Dashboard</button>
      </div>
    </div>
  );
};

export default SchoolFeatures;
