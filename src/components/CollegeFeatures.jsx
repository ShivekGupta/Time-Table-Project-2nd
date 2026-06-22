import React, { useState } from 'react';

const CollegeFeatures = () => {
  const [userProfile, setUserProfile] = useState({
    level: 12,
    xp: 350,
    xpToNext: 500,
    doubloons: 150,
    streak: 5,
    title: "Code Buccaneer"
  });

  const [courses, setCourses] = useState([
    { 
      code: 'CS301', name: 'Data Structures & Algorithms', status: 'In Progress', credits: 4,
      boss: { name: 'Midterm Leviathan', date: 'Oct 15', hp: 100, reward: 50 },
      aiPrediction: 'Optimal study time: 8:00 PM tonight'
    },
    { 
      code: 'ENG205', name: 'Technical Writing', status: 'Upcoming', credits: 3,
      boss: { name: 'Essay Kraken', date: 'Nov 1', hp: 50, reward: 20 },
      aiPrediction: 'Optimal study time: 4:00 PM tomorrow'
    },
    { 
      code: 'PHY102', name: 'Quantum Mechanics', status: 'Completed', credits: 4,
      boss: null,
      aiPrediction: null
    }
  ]);

  const initialSkills = [
    { id: 's1', name: 'Basic CS', level: 1, maxLevel: 1, req: null, cost: 0 },
    { id: 's2', name: 'Data Structures', level: 0, maxLevel: 3, req: 's1', cost: 10 },
    { id: 's3', name: 'Algorithms', level: 0, maxLevel: 3, req: 's2', cost: 20 },
    { id: 's4', name: 'Machine Learning', level: 0, maxLevel: 5, req: 's3', cost: 50 },
    { id: 's5', name: 'Web Dev', level: 0, maxLevel: 3, req: 's1', cost: 15 },
  ];

  const [skills, setSkills] = useState(initialSkills);
  const [activeAITask, setActiveAITask] = useState(null);

  // Matchmaker state
  const [matchProfiles, setMatchProfiles] = useState([
    { id: 1, name: 'Alice', major: 'Comp Sci', focus: 'Data Structures', matchScore: 92, status: 'pending' },
    { id: 2, name: 'Bob', major: 'Math', focus: 'Discrete Math', matchScore: 85, status: 'pending' },
    { id: 3, name: 'Charlie', major: 'Design', focus: 'UI/UX', matchScore: 78, status: 'pending' }
  ]);
  const [currentProfileIdx, setCurrentProfileIdx] = useState(0);

  const handleSwipe = (action) => {
    setMatchProfiles(prev => prev.map((p, i) => i === currentProfileIdx ? { ...p, status: action } : p));
    setTimeout(() => {
      setCurrentProfileIdx(prev => prev + 1);
    }, 300);
  };

  const upgradeSkill = (id) => {
    const skill = skills.find(s => s.id === id);
    if (!skill || skill.level === skill.maxLevel) return;

    if (skill.req) {
      const reqSkill = skills.find(p => p.id === skill.req);
      if (!reqSkill || reqSkill.level === 0) return; // Locked
    }

    if (userProfile.doubloons < skill.cost) {
      alert("Not enough Doubloons!");
      return;
    }

    setUserProfile(prev => ({ ...prev, doubloons: prev.doubloons - skill.cost }));
    setSkills(prev => prev.map(s => s.id === id ? { ...s, level: s.level + 1 } : s));
  };

  const handleDefeatBoss = (code) => {
    setCourses(prev => prev.map(c => {
      if (c.code === code && c.boss) {
        setUserProfile(up => {
          let newXp = up.xp + 100;
          let newLevel = up.level;
          let newXpToNext = up.xpToNext;
          if (newXp >= newXpToNext) {
            newLevel += 1;
            newXp -= newXpToNext;
            newXpToNext += 100; // Increase threshold for next level
          }
          return {
            ...up,
            doubloons: up.doubloons + c.boss.reward,
            xp: newXp,
            level: newLevel,
            xpToNext: newXpToNext
          };
        });
        return { ...c, boss: null, status: 'Completed' };
      }
      return c;
    }));
  };

  const renderSkillTree = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start', position: 'relative' }}>
        {/* Simple vertical visual tree */}
        <div style={{ position: 'absolute', left: '20px', top: '20px', bottom: '20px', width: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
        {skills.map((skill) => {
          const isLocked = skill.req && skills.find(s => s.id === skill.req)?.level === 0;
          return (
            <div 
              key={skill.id} 
              onClick={() => upgradeSkill(skill.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.4 : 1,
                zIndex: 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (!isLocked) e.currentTarget.style.transform = 'translateX(5px)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ 
                width: '40px', height: '40px', 
                borderRadius: '50%', 
                background: skill.level === skill.maxLevel ? '#10b981' : skill.level > 0 ? '#fbbf24' : 'var(--glass-bg)',
                border: `2px solid ${skill.level > 0 ? 'transparent' : 'rgba(255,255,255,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '0.8rem',
                boxShadow: skill.level > 0 ? '0 0 10px rgba(251, 191, 36, 0.3)' : 'none'
              }}>
                {skill.level}/{skill.maxLevel}
              </div>
              <div style={{ background: 'var(--glass-bg)', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span>{skill.name}</span>
                  {skill.level < skill.maxLevel && skill.cost > 0 && <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>🪙 {skill.cost}</span>}
                </div>
                {isLocked && <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>Locked (Req: {skills.find(s => s.id === skill.req)?.name})</div>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderAIModal = () => {
    if (!activeAITask) return null;
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div className="glass-card" style={{ width: '400px', maxWidth: '90%', padding: '20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
          <h3 style={{ marginBottom: '15px', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeAITask.type === 'quiz' ? '✨ AI Quiz Generator' : '🧠 AI Tutor'}
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            {activeAITask.type === 'quiz' 
              ? `Generating a custom practice quiz for ${activeAITask.courseId} based on your recent notes...`
              : `Hello! I'm your AI Tutor for ${activeAITask.courseId}. What concept would you like me to explain?`
            }
          </p>
          {activeAITask.type === 'tutor' && (
            <textarea 
              placeholder="E.g., Explain dynamic programming..."
              style={{ width: '100%', height: '80px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px', color: '#fff', marginBottom: '15px', resize: 'none' }}
            />
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="share-action-btn" onClick={() => setActiveAITask(null)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
            <button className="share-action-btn" onClick={() => {
              alert(activeAITask.type === 'quiz' ? 'Quiz Generated!' : 'Message Sent!');
              setActiveAITask(null);
            }} style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              {activeAITask.type === 'quiz' ? 'Start Quiz' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="college-features-container" style={{ padding: '20px', color: 'var(--text)' }}>
      {renderAIModal()}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '5px' }}>College Cove</h2>
          <p style={{ color: 'var(--text-muted)' }}>Advanced coursework, career planning, and internship tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'var(--glass-bg)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{userProfile.title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lvl {userProfile.level} • 🔥 {userProfile.streak} Day Streak</div>
          </div>
          <div style={{ width: '100px' }}>
            <div style={{ fontSize: '0.8rem', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
              <span>XP</span>
              <span>{userProfile.xp}/{userProfile.xpToNext}</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
              <div style={{ width: `${(userProfile.xp/userProfile.xpToNext)*100}%`, height: '100%', background: '#10b981', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: '#fbbf24', fontSize: '1.2rem' }}>
            🪙 {userProfile.doubloons}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <div className="glass-card" style={{ marginBottom: '20px', background: 'linear-gradient(45deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem' }}>🤖</div>
            <div>
              <h4 style={{ color: '#a78bfa', margin: '0 0 5px 0' }}>AI Study Predictor</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Based on your coursework, your optimal study time today is <strong style={{ color: '#fff' }}>8:00 PM</strong>. Preparing for Midterm Leviathan!</p>
            </div>
          </div>

          <h3 style={{ marginBottom: '15px' }}>Current Semester Coursework</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {courses.map(c => (
              <div key={c.code} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{c.code} - {c.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>Credits: {c.credits}</div>
                  </div>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '15px', 
                    fontSize: '0.8rem',
                    background: c.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : c.status === 'In Progress' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(255,255,255,0.1)',
                    color: c.status === 'Completed' ? '#10b981' : c.status === 'In Progress' ? '#fbbf24' : '#fff',
                    fontWeight: 'bold'
                  }}>
                    {c.status}
                  </span>
                </div>
                
                {c.boss && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                      <span style={{ color: '#f87171', fontWeight: 'bold' }}>👾 Boss: {c.boss.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{c.boss.date}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '12px' }}>
                      <div style={{ width: `${c.boss.hp}%`, height: '100%', background: '#ef4444', borderRadius: '4px' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 'bold' }}>Reward: 🪙 {c.boss.reward} & 100 XP</span>
                      <button className="share-action-btn" onClick={() => handleDefeatBoss(c.code)} style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#ef4444'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}>Defeat Boss</button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="share-action-btn" onClick={() => setActiveAITask({ type: 'quiz', courseId: c.code })} style={{ flex: 1, padding: '10px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                    ✨ Generate AI Quiz
                  </button>
                  <button className="share-action-btn" onClick={() => setActiveAITask({ type: 'tutor', courseId: c.code })} style={{ flex: 1, padding: '10px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                    🧠 Ask Tutor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="glass-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Skill Tree</h3>
            {renderSkillTree()}
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '15px' }}>Internship Tracker</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Google (SWE)</span>
                <span style={{ color: '#fbbf24' }}>Interviewing</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Microsoft (PM)</span>
                <span style={{ color: '#10b981' }}>Offer Received</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Startup Inc</span>
                <span style={{ color: 'var(--text-muted)' }}>Applied</span>
              </div>
            </div>
            <button className="share-action-btn" style={{ width: '100%', marginTop: '15px', padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>+ Add Application</button>
          </div>

          {/* Study Group Matchmaker */}
          <div className="glass-card" style={{ marginTop: '20px', position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ marginBottom: '15px' }}>Study Partner Matchmaker</h3>
            {currentProfileIdx < matchProfiles.length ? (
              <div 
                style={{ 
                  background: 'var(--accent)', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  textAlign: 'center', 
                  position: 'relative',
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  transform: matchProfiles[currentProfileIdx].status === 'connect' ? 'translateX(100%) rotate(10deg)' : matchProfiles[currentProfileIdx].status === 'pass' ? 'translateX(-100%) rotate(-10deg)' : 'translateX(0)',
                  opacity: matchProfiles[currentProfileIdx].status !== 'pending' ? 0 : 1
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🧑‍🎓</div>
                <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.2rem' }}>{matchProfiles[currentProfileIdx].name}</h4>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '15px' }}>
                  {matchProfiles[currentProfileIdx].major} • Focusing on {matchProfiles[currentProfileIdx].focus}
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '5px 10px', display: 'inline-block', fontSize: '0.85rem', marginBottom: '20px', color: '#10b981', fontWeight: 'bold' }}>
                  {matchProfiles[currentProfileIdx].matchScore}% Match
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  <button onClick={() => handleSwipe('pass')} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)' }}>✖</button>
                  <button onClick={() => handleSwipe('connect')} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)' }}>❤️</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔭</div>
                No more matches nearby. Check back later!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeFeatures;
