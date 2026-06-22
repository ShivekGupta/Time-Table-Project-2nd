import React, { useState, useEffect } from 'react';

const ExamPeak = () => {
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Smart Flashcard States
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = [
    { q: "What is the time complexity of QuickSort in the worst case?", a: "O(n²)" },
    { q: "What is the primary key in a relational database?", a: "A unique identifier for a record in a table." },
    { q: "Explain the difference between process and thread.", a: "A process is an executing program; a thread is a segment of a process." },
    { q: "What does REST stand for?", a: "Representational State Transfer" },
  ];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (!isTimerRunning && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const mockLeaderboardData = [
    { rank: 1, name: "Aarav P.", score: 98, isCurrentUser: false },
    { rank: 2, name: "Sneha R.", score: 95, isCurrentUser: false },
    { rank: 3, name: "You", score: 92, isCurrentUser: true },
    { rank: 4, name: "Karan M.", score: 89, isCurrentUser: false },
    { rank: 5, name: "Priya S.", score: 85, isCurrentUser: false },
  ];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- MOCK EXAM & ANALYTICS ---
  const [scores, setScores] = useState([20, 25, 40, 35, 55, 70]);
  const [mockExamActive, setMockExamActive] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);

  const mockQuestions = [
    { id: 1, text: "Which HTTP method is idempotent?", options: ["GET", "POST", "PATCH", "CONNECT"], answer: "GET" },
    { id: 2, text: "In React, what hook is used to manage side effects?", options: ["useState", "useEffect", "useMemo", "useContext"], answer: "useEffect" },
    { id: 3, text: "What is the result of 2 + '2' in JS?", options: ["4", "22", "NaN", "Error"], answer: "22" },
  ];

  const startMockExam = () => {
    setMockExamActive(true);
    setSelectedAnswers({});
    setExamResult(null);
  };

  const selectAnswer = (qId, option) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const submitExam = () => {
    let correct = 0;
    mockQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) correct++;
    });
    const finalScore = Math.round((correct / mockQuestions.length) * 100);
    setExamResult(finalScore);
    setScores(prev => [...prev.slice(-5), finalScore]);
    setMockExamActive(false);
  };

  const renderChart = () => {
    const recentScores = scores.slice(-6);
    const points = recentScores.map((score, index) => {
      const x = index * 50;
      const y = 100 - score; 
      return `${x},${y}`;
    }).join(' ');

    const lastX = (recentScores.length - 1) * 50;
    const lastY = 100 - (recentScores[recentScores.length - 1] || 0);
    
    // Predictive Line points
    const predX1 = lastX + 50;
    const predY1 = Math.max(10, lastY - 10);
    const predX2 = lastX + 100;
    const predY2 = Math.max(5, lastY - 15);
    const predX3 = lastX + 150;
    const predY3 = Math.max(0, lastY - 20);

    const predictivePoints = `${lastX},${lastY} ${predX1},${predY1} ${predX2},${predY2} ${predX3},${predY3}`;

    const currentScore = recentScores[recentScores.length - 1] || 0;
    const predictedScore = Math.min(100, currentScore + 10);

    return (
      <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Grid Lines */}
        <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        
        {/* Past Scores Line */}
        <polyline 
          points={points} 
          fill="none" stroke="#3b82f6" strokeWidth="3" 
          style={{ filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.5))' }}
        />
        {/* Past Score Points */}
        {recentScores.map((score, index) => (
          <circle key={index} cx={index * 50} cy={100 - score} r="4" fill="#3b82f6" />
        ))}

        {/* Predictive Line (Dotted) */}
        <polyline 
          points={predictivePoints} 
          fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="6 6"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(251, 191, 36, 0.5))' }}
        />
        <circle cx={predX3} cy={predY3} r="5" fill="#fbbf24" />
        
        {/* Labels */}
        <text x={Math.max(0, lastX - 40)} y={Math.max(lastY - 10, 10)} fill="#fff" fontSize="12" fontWeight="bold">Current: {currentScore}%</text>
        <text x={predX3 - 50} y={Math.max(predY3 - 5, 10)} fill="#fbbf24" fontSize="12" fontWeight="bold">Predicted: {predictedScore}%</text>
      </svg>
    );
  };

  return (
    <div className="exam-prep-container" style={{ padding: '20px', color: 'var(--text)' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '5px' }}>Exam Peak</h2>
        <p style={{ color: 'var(--text-muted)' }}>High-intensity competitive exam preparation module.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Focus Timer (Pomodoro)</h3>
          <div style={{ fontSize: '4rem', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent-light)', textShadow: '0 0 10px rgba(217,119,6,0.5)', marginBottom: '20px' }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="share-action-btn" 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              style={{ width: '100px' }}
            >
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button 
              className="share-action-btn" 
              onClick={() => { setIsTimerRunning(false); setTimeLeft(1500); }}
              style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text)' }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Mock Exams</h3>
          
          {!mockExamActive ? (
            <div>
              <p style={{ marginBottom: '15px', color: 'var(--text-muted)' }}>Take a quick mock exam to test your knowledge.</p>
              <button 
                className="share-action-btn" 
                onClick={startMockExam}
              >
                Start Mock Exam
              </button>
              {examResult !== null && (
                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>Last Score: {examResult}%</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              {mockQuestions.map(q => (
                <div key={q.id} style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{q.text}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {q.options.map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`question-${q.id}`} 
                          checked={selectedAnswers[q.id] === opt}
                          onChange={() => selectAnswer(q.id, opt)}
                          style={{ accentColor: 'var(--accent)' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="share-action-btn" onClick={submitExam}>Submit Exam</button>
                <button 
                  className="share-action-btn" 
                  onClick={() => setMockExamActive(false)}
                  style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Predictive Score Analytics</span>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'normal' }}>Target: 95%</span>
          </h3>
          <div style={{ width: '100%', height: '120px', position: 'relative' }}>
            {renderChart()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>
            <span>Week 1</span>
            <span>Week 3</span>
            <span>Today</span>
            <span style={{ color: '#fbbf24' }}>Exam Day</span>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '15px' }}>Global Leaderboard</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mockLeaderboardData.map((user, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px 15px', 
                  background: user.isCurrentUser ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: user.isCurrentUser ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
                  borderRadius: '8px',
                  fontWeight: user.isCurrentUser ? 'bold' : 'normal'
                }}
              >
                <div style={{ display: 'flex', gap: '15px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>#{user.rank}</span>
                  <span>{user.name}</span>
                </div>
                <span style={{ color: 'var(--accent)' }}>{user.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '15px' }}>Smart Flashcards (AI Generated)</h3>
          
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ 
              padding: '30px 20px', 
              background: isFlipped ? 'var(--accent)' : 'rgba(255,255,255,0.05)', 
              color: isFlipped ? '#fff' : 'var(--text)',
              borderRadius: '8px', 
              textAlign: 'center', 
              cursor: 'pointer', 
              border: '1px solid var(--glass-border)',
              minHeight: '150px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              position: 'relative'
            }}
          >
            <div style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.9rem' }}>
              {isFlipped ? 'Answer' : 'Question (Tap to flip)'}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {isFlipped ? flashcards[currentCardIndex].a : flashcards[currentCardIndex].q}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
            <button 
              className="share-action-btn" 
              style={{ padding: '6px 16px', fontSize: '0.9rem' }}
              onClick={handleNextCard}
            >
              Next Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPeak;
