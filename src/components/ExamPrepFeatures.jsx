import React, { useState, useEffect, useRef } from 'react';

const ExamPrepFeatures = () => {
  // Styles injected for animations & dark mode glassmorphism
  const customStyles = `
    .dark-theme-wrapper {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: #e2e8f0;
      min-height: 100vh;
      padding: 30px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .glassmorphism {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .glassmorphism:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    }
    .accent-text {
      background: linear-gradient(to right, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
    }
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
    .btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .boss-bar-container {
      width: 100%;
      height: 24px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(239, 68, 68, 0.3);
      position: relative;
    }
    .boss-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #ef4444, #b91c1c);
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes pulse {
      0% { transform: scale(1); filter: brightness(1); }
      50% { transform: scale(1.1); filter: brightness(1.3); }
      100% { transform: scale(1); filter: brightness(1); }
    }
    .level-up-anim {
      animation: pulse 0.5s ease-in-out 3;
      color: #fbbf24;
      text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
    }
    .fade-in {
      animation: fadeIn 0.4s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .chat-container::-webkit-scrollbar {
      width: 6px;
    }
    .chat-container::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
    }
    .flashcard-inner {
      transition: transform 0.6s;
      transform-style: preserve-3d;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .flashcard.flipped .flashcard-inner {
      transform: rotateY(180deg);
    }
    .flashcard-front, .flashcard-back {
      backface-visibility: hidden;
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 30px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .flashcard-front {
      background: rgba(255,255,255,0.05);
    }
    .flashcard-back {
      background: linear-gradient(135deg, #312e81, #1e1b4b);
      transform: rotateY(180deg);
    }
  `;

  // --- Gamification States ---
  const [doubloons, setDoubloons] = useState(150);
  const [streak, setStreak] = useState(12);
  const [xp, setXp] = useState(850);
  const [level, setLevel] = useState(5);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const maxBossHp = 5000;
  const [bossHp, setBossHp] = useState(5000);

  // --- Timer States ---
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // --- Flashcard States ---
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState([
    { q: "What is the time complexity of QuickSort in the worst case?", a: "O(n²)" },
    { q: "What is the primary key in a relational database?", a: "A unique identifier for a record in a table." },
    { q: "Explain the difference between process and thread.", a: "A process is an executing program; a thread is a segment of a process." },
    { q: "What does REST stand for?", a: "Representational State Transfer" },
  ]);

  // --- AI Tutor States ---
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hi! I am your AI Tutor. Ask me any syllabus questions!' }
  ]);
  const chatEndRef = useRef(null);

  // --- Leaderboard & Question Bank ---
  const [leaderboard, setLeaderboard] = useState([]);
  
  const questionBank = [
    { q: "What is a closure in JavaScript?", a: "A function bundled together with its lexical environment." },
    { q: "Describe the CAP theorem.", a: "A distributed system can only provide two of: Consistency, Availability, Partition tolerance." },
    { q: "What is the event loop?", a: "A mechanism that handles and executes asynchronous callbacks in Node.js/Browsers." },
    { q: "What does ACID stand for in databases?", a: "Atomicity, Consistency, Isolation, Durability." },
    { q: "What is a foreign key?", a: "A column or group of columns that provides a link between data in two tables." },
    { q: "Explain the Big O notation.", a: "A mathematical notation that describes the limiting behavior of a function." },
    { q: "What is a Promise in JS?", a: "An object representing the eventual completion or failure of an asynchronous operation." },
    { q: "What is horizontal scaling?", a: "Adding more machines to your pool of resources." }
  ];

  // --- Leaderboard States ---
  const [selectedExam, setSelectedExam] = useState('JEE Advanced');

  // --- Effects ---
  useEffect(() => {
    const storedLeaderboard = localStorage.getItem('examPeak_leaderboard');
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    } else {
      const initialLeaderboard = [
        { id: 'u1', name: 'Alex_Dev', xp: 2450 },
        { id: 'u2', name: 'Sarah_J', xp: 2310 },
        { id: 'u3', name: 'Mike_99', xp: 2180 },
        { id: 'u4', name: 'Chris_H', xp: 1900 },
        { id: 'u5', name: 'Emma_W', xp: 1850 },
        { id: 'me', name: 'You', xp: 850 }
      ];
      localStorage.setItem('examPeak_leaderboard', JSON.stringify(initialLeaderboard));
      setLeaderboard(initialLeaderboard);
    }
  }, []);

  useEffect(() => {
    if (leaderboard.length === 0) return;
    const updatedLeaderboard = leaderboard.map(u => u.id === 'me' ? { ...u, xp: xp } : u);
    updatedLeaderboard.sort((a, b) => b.xp - a.xp);
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('examPeak_leaderboard', JSON.stringify(updatedLeaderboard));
  }, [xp]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            addXp(200);
            setDoubloons(d => d + 50);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isTimerRunning && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // --- Helpers ---
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addXp = (amount) => {
    setXp(prev => {
      const next = prev + amount;
      if (Math.floor(next / 1000) > Math.floor(prev / 1000)) {
        setLevel(l => l + 1);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000);
      }
      return next;
    });
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const newChat = [...chatHistory, { role: 'user', text: chatInput }];
    setChatHistory(newChat);
    const userText = chatInput.toLowerCase();
    setChatInput('');
    
    setTimeout(() => {
      let aiResponse = "I'm not sure about that. Could you ask about data structures, databases, or web development?";
      
      if (userText.includes("database") || userText.includes("sql") || userText.includes("nosql")) {
        aiResponse = "Databases are crucial. Remember that SQL databases are relational and use structured schemas, while NoSQL databases are non-relational and more flexible.";
      } else if (userText.includes("react") || userText.includes("frontend")) {
        aiResponse = "In React, component state and props govern how the UI renders. Hooks like useState and useEffect are essential for functional components.";
      } else if (userText.includes("sort") || userText.includes("algorithm")) {
        aiResponse = "Sorting algorithms are common in exams. QuickSort averages O(n log n) but degrades to O(n²) in the worst case, whereas MergeSort is always O(n log n).";
      } else if (userText.includes("time complexity") || userText.includes("big o")) {
        aiResponse = "Time complexity describes how the runtime of an algorithm scales. O(1) is constant, O(n) is linear, and O(n²) is quadratic.";
      } else if (userText.includes("hello") || userText.includes("hi")) {
        aiResponse = "Hello! Ready to study? Ask me anything about your syllabus.";
      }

      setChatHistory(prev => [
        ...prev, 
        { role: 'ai', text: aiResponse }
      ]);
    }, 1000);
  };

  const generateAIQuestions = () => {
    if (doubloons < 20) {
      alert("Not enough Doubloons! You need 20 🪙 to use AI generation.");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const availableQuestions = questionBank.filter(q => !flashcards.some(f => f.q === q.q));
      const newQuestions = [];
      for (let i = 0; i < 2; i++) {
        if (availableQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableQuestions.length);
          newQuestions.push(availableQuestions.splice(randomIndex, 1)[0]);
        }
      }
      
      if (newQuestions.length > 0) {
        setFlashcards(prev => [...prev, ...newQuestions]);
      } else {
        alert("No more unique questions available!");
      }
      
      setIsGenerating(false);
      setDoubloons(d => d - 20);
    }, 1500);
  };

  const handleFlashcardResult = (success) => {
    if (success) {
      setBossHp(prev => Math.max(0, prev - 500));
      addXp(50);
      setDoubloons(d => d + 5);
    }
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 300); // Wait for flip animation
  };

  return (
    <div className="dark-theme-wrapper">
      <style>{customStyles}</style>

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2.5rem' }} className="accent-text">Exam Peak: God Mode</h2>
          <p style={{ margin: '5px 0 0', color: '#94a3b8', fontSize: '1.1rem' }}>High-intensity AI-powered competitive exam prep.</p>
        </div>
        <div className="glassmorphism" style={{ padding: '12px 24px', display: 'flex', gap: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span title="Daily Streak" style={{ color: '#f97316' }}>🔥 {streak}</span>
          <span title="Doubloons" style={{ color: '#fbbf24' }}>🪙 {doubloons}</span>
          <span className={showLevelUp ? "level-up-anim" : ""} title="Level" style={{ color: '#38bdf8' }}>⭐ Lvl {level}</span>
          <span title="Experience" style={{ color: '#10b981' }}>✨ {xp} XP</span>
        </div>
      </div>

      {/* Top Grid: Timer, Boss, Tutor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Focus Timer */}
        <div className="glassmorphism fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 20px', color: '#e2e8f0' }}>⏱️ Focus Timer</h3>
          <div style={{ fontSize: '4.5rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#38bdf8', textShadow: '0 0 20px rgba(56, 189, 248, 0.4)', marginBottom: '20px', letterSpacing: '-2px' }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => setIsTimerRunning(!isTimerRunning)} style={{ width: '120px' }}>
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button className="btn-secondary" onClick={() => { setIsTimerRunning(false); setTimeLeft(1500); }}>
              Reset
            </button>
          </div>
        </div>

        {/* Boss Battle */}
        <div className="glassmorphism fade-in" style={{ padding: '24px', animationDelay: '0.1s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ margin: '0 0 5px', color: '#e2e8f0', width: '100%' }}>🐲 Major Exam Boss</h3>
          <p style={{ margin: '0 0 15px', fontSize: '0.9rem', color: '#94a3b8', width: '100%' }}>Defeat the Data Structures Midterm!</p>
          
          <div style={{ fontSize: '4rem', margin: '15px 0', filter: 'drop-shadow(0 0 15px rgba(239,68,68,0.5))' }}>
             {bossHp > 0 ? '👾' : '💀'}
          </div>
          
          <div className="boss-bar-container">
             <div className="boss-bar-fill" style={{ width: `${(bossHp / maxBossHp) * 100}%` }}></div>
             <div style={{ position: 'absolute', width: '100%', textAlign: 'center', top: '2px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white', textShadow: '1px 1px 2px black' }}>
               {bossHp} / {maxBossHp} HP
             </div>
          </div>
          {bossHp === 0 && <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '10px' }}>Boss Defeated! +500 XP</p>}
        </div>

        {/* AI Tutor Bot */}
        <div className="glassmorphism fade-in" style={{ padding: '24px', animationDelay: '0.2s', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 15px', color: '#e2e8f0' }}>🤖 AI Tutor</h3>
          <div className="chat-container" style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '15px', overflowY: 'auto', maxHeight: '180px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(255,255,255,0.1)', border: msg.role !== 'user' ? '1px solid rgba(255,255,255,0.05)' : 'none', padding: '10px 14px', borderRadius: '14px', borderBottomRightRadius: msg.role === 'user' ? '4px' : '14px', borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '14px', fontSize: '0.9rem', maxWidth: '85%', lineHeight: '1.4' }}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask a syllabus question..." 
              style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} 
            />
            <button onClick={handleChatSubmit} className="btn-primary">Send</button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Flashcards & Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Smart Flashcards */}
        <div className="glassmorphism fade-in" style={{ padding: '24px', animationDelay: '0.3s', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#e2e8f0' }}>🧠 Smart Flashcards</h3>
            <button onClick={generateAIQuestions} className="btn-secondary" disabled={isGenerating} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {isGenerating ? '⏳ Generating...' : '✨ Auto-Generate (20 🪙)'}
            </button>
          </div>
          
          <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} style={{ perspective: '1000px', height: '220px', cursor: 'pointer' }} onClick={() => !isFlipped && setIsFlipped(true)}>
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <span style={{ color: '#94a3b8', marginBottom: '15px', fontSize: '0.9rem' }}>Question {currentCardIndex + 1} of {flashcards.length} (Tap to flip)</span>
                <h4 style={{ fontSize: '1.3rem', textAlign: 'center', margin: 0, lineHeight: '1.4' }}>{flashcards[currentCardIndex].q}</h4>
              </div>
              <div className="flashcard-back">
                <span style={{ color: '#94a3b8', marginBottom: '15px', fontSize: '0.9rem' }}>Answer</span>
                <h4 style={{ fontSize: '1.2rem', textAlign: 'center', margin: 0, lineHeight: '1.4', color: '#e2e8f0' }}>{flashcards[currentCardIndex].a}</h4>
              </div>
            </div>
          </div>
          
          <div style={{ height: '50px', marginTop: '20px' }}>
            {isFlipped ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', animation: 'fadeIn 0.3s' }}>
                <button onClick={(e) => { e.stopPropagation(); handleFlashcardResult(false); }} className="btn-secondary" style={{ borderColor: 'rgba(239, 68, 68, 0.5)', color: '#fca5a5', flex: 1 }}>
                  ❌ Needs Work
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleFlashcardResult(true); }} className="btn-secondary" style={{ borderColor: 'rgba(16, 185, 129, 0.5)', color: '#6ee7b7', flex: 1 }}>
                  ✅ Nailed It! (+Damage)
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b', fontSize: '0.9rem' }}>
                Answer truthfully to train your predictive model.
              </div>
            )}
          </div>
        </div>

        {/* Analytics & Leaderboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glassmorphism fade-in" style={{ padding: '24px', animationDelay: '0.4s' }}>
            <h3 style={{ margin: '0 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#e2e8f0' }}>📈 Predictive Score Analytics</span>
              <span style={{ fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 10px', borderRadius: '12px' }}>Target: 95%</span>
            </h3>
            <div style={{ width: '100%', height: '140px', position: 'relative' }}>
              <svg viewBox="0 0 400 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                
                <polyline 
                  points="0,100 60,90 120,70 180,80 240,50 300,40" 
                  fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.4))' }}
                />
                <circle cx="0" cy="100" r="5" fill="#3b82f6" />
                <circle cx="60" cy="90" r="5" fill="#3b82f6" />
                <circle cx="120" cy="70" r="5" fill="#3b82f6" />
                <circle cx="180" cy="80" r="5" fill="#3b82f6" />
                <circle cx="240" cy="50" r="5" fill="#3b82f6" />
                <circle cx="300" cy="40" r="6" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="2" />

                <polyline 
                  points="300,40 350,25 400,15" 
                  fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(251, 191, 36, 0.4))' }}
                >
                   <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
                </polyline>
                <circle cx="400" cy="15" r="6" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
                
                <text x="250" y="25" fill="#e2e8f0" fontSize="12" fontWeight="bold">Current: {Math.min(100, Math.floor(xp / 10))}%</text>
                <text x="320" y="5" fill="#fbbf24" fontSize="12" fontWeight="bold">Predicted: {Math.min(100, Math.floor(xp / 10) + 7)}%</text>
              </svg>
            </div>
          </div>

          <div className="glassmorphism fade-in" style={{ padding: '24px', animationDelay: '0.5s' }}>
            <h3 style={{ margin: '0 0 15px', color: '#e2e8f0' }}>🏆 Global Leaderboards</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {leaderboard.slice(0, 3).map((user, index) => {
                const rankColors = ['#fbbf24', '#9ca3af', '#b45309'];
                const isMe = user.id === 'me';
                return (
                  <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: isMe ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)', border: isMe ? '1px solid rgba(16, 185, 129, 0.3)' : 'none', borderRadius: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: rankColors[index] || '#cbd5e1', width: '20px' }}>{index + 1}</span>
                      <span style={{ color: isMe ? '#fff' : '#e2e8f0', fontWeight: isMe ? 'bold' : 'normal' }}>{isMe ? '🧑‍🎓 ' : ''}{user.name}</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: isMe ? '#34d399' : '#cbd5e1' }}>{user.xp} XP</span>
                  </div>
          
        </div>
      </div>
    </div>
  );
};

export default ExamPrepFeatures;
