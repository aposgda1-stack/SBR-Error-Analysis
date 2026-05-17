'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import sectionsData from '../../../data/sections.json';
import audioManager from '../../utils/audio.js';

export default function PanicMode() {
  const router = useRouter();
  const [gameState, setGameState] = useState('lobby'); // lobby | playing | result
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [speedBonuses, setSpeedBonuses] = useState(0); // count of speed bonuses
  const [streakBonuses, setStreakBonuses] = useState(0); // count of streak bonuses
  const [activeToasts, setActiveToasts] = useState([]); // array of { id, text, isError }
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const questionStartRef = useRef(Date.now());

  const mistakes = sectionsData.identify_error_data.the_130_mistakes;

  const getDiffWord = (wrong, correct) => {
    const normalize = (s) => s.replace(/[.,!?]$/, '').trim().split(/\s+/);
    const w = normalize(wrong);
    const c = normalize(correct);
    let start = 0;
    while (start < w.length && start < c.length && w[start] === c[start]) start++;
    let endW = w.length - 1, endC = c.length - 1;
    while (endW >= start && endC >= start && w[endW] === c[endC]) { endW--; endC--; }
    return c.slice(start, Math.max(start, endC + 1)).join(' ');
  };

  const generateQuestion = () => {
    const q = mistakes[Math.floor(Math.random() * mistakes.length)];
    const correctWord = getDiffWord(q.wrong, q.correct);
    const dist = ['the', 'is', 'at', 'with', 'from', 'to', 'for', 'by', 'on', 'in', 'an', 'a', 'as', 'but', 'so', 'yet'];
    const filteredDist = dist.filter(d => d.toLowerCase() !== correctWord.toLowerCase());
    const opts = shuffleArray([correctWord, ...filteredDist.sort(() => 0.5 - Math.random()).slice(0, 3)]);
    
    setCurrentQuestion({ ...q, correctWord });
    setOptions(opts);
  };

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) { 
      audioManager.play('VICTORY');
      setGameState('result'); 
      return; 
    }
    const iv = setInterval(() => {
      if (timeLeft <= 10) audioManager.play('TICK');
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [gameState, timeLeft]);

  const startPanic = () => {
    audioManager.play('CLICK');
    setCorrectCount(0);
    setTotalAttempts(0);
    setTotalXp(0);
    setStreak(0);
    setMaxStreak(0);
    setSpeedBonuses(0);
    setStreakBonuses(0);
    setActiveToasts([]);
    setTimeLeft(60);
    setGameState('playing');
    generateQuestion();
    questionStartRef.current = Date.now();
  };

  const handleAnswer = (opt) => {
    const elapsed = Date.now() - questionStartRef.current;
    setTotalAttempts(a => a + 1);

    if (opt.toLowerCase() === currentQuestion.correctWord.toLowerCase()) {
      audioManager.play('SUCCESS');
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      let earnedXp = 10; // Base XP
      const addedBonuses = [];

      // Speed bonus: < 3 seconds
      const isSpeedy = elapsed < 3000;
      if (isSpeedy) {
        earnedXp += 5;
        setSpeedBonuses(s => s + 1);
        addedBonuses.push('⚡ Speed +5');
      }

      // Streak bonus: every 3 correct answers
      if (newStreak > 0 && newStreak % 3 === 0) {
        earnedXp += 15;
        setStreakBonuses(s => s + 1);
        addedBonuses.push(`🔥 Streak x${newStreak} +15`);
      }

      setTotalXp(x => x + earnedXp);

      // Trigger beautiful arcade style floating notification
      const id = Date.now() + Math.random();
      const toastText = `+${earnedXp} XP ${addedBonuses.length > 0 ? `(${addedBonuses.join(' ')})` : ''}`;
      setActiveToasts(prev => [...prev, { id, text: toastText, key: id }]);
      
      // Auto-remove floating notification after 1.2s
      setTimeout(() => {
        setActiveToasts(prev => prev.filter(t => t.id !== id));
      }, 1200);

    } else {
      audioManager.play('ERROR');
      setStreak(0);
      
      // Floating error indicator
      const id = Date.now() + Math.random();
      setActiveToasts(prev => [...prev, { id, text: '❌ Wrong', isError: true, key: id }]);
      setTimeout(() => {
        setActiveToasts(prev => prev.filter(t => t.id !== id));
      }, 1200);
    }
    
    generateQuestion();
    questionStartRef.current = Date.now();
  };

  const syncPanic = () => {
    const uId = JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
    if (uId && totalXp > 0) {
      const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
      fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            action: 'sync', userId: uId, incXp: totalXp, incDone: 1,
            pushHistory: { date: new Date(), xp: totalXp, type: 'Panic Mode', accuracy }
        })
      });
    }
    router.push('/dashboard');
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 110 }}>
      <TopBar />
      
      <div style={{ padding: '32px 20px', maxWidth: 480, margin: '0 auto' }}>
        {gameState === 'lobby' && (
          <div className="animate-slide-up" style={{ textAlign: 'center', marginTop: 40 }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', 
              border: '2px solid var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', boxShadow: '0 0 40px rgba(239, 68, 68, 0.3)'
            }}>
              <span className="mi animate-pulse" style={{ fontSize: 48, color: 'var(--error)' }}>bolt</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: 'white', marginBottom: 8 }}>PANIC MODE</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>60 Seconds. Infinite Questions. How many can you get right?</p>
            
            {/* Premium Scoring Info Card */}
            <div className="glass-panel" style={{ padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', textAlign: 'left', marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--error)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>⚡ PREMIUM ARCADE SCORING</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--text-dim)' }}>✓ Correct Answer</span><span style={{ fontWeight: 700, color: 'white' }}>+10 XP</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--text-dim)' }}>⚡ Speed Bonus (&lt;3s)</span><span style={{ fontWeight: 700, color: 'var(--primary)' }}>+5 XP</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--text-dim)' }}>🔥 Streak Bonus (every 3)</span><span style={{ fontWeight: 700, color: '#f87171' }}>+15 XP</span></div>
              </div>
            </div>

            <button onClick={startPanic} className="premium-btn" style={{ width: '100%', padding: 20, fontSize: 18, background: 'var(--error)' }}>
              RELEASE THE CHAOS
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="animate-fade-in">
             <style>{`
               @keyframes arcadeFloat {
                 0% { transform: translateY(20px) scale(0.8); opacity: 0; }
                 20% { transform: translateY(0) scale(1.1); opacity: 1; }
                 80% { transform: translateY(-20px) scale(1); opacity: 1; }
                 100% { transform: translateY(-45px) scale(0.9); opacity: 0; }
               }
               .arcade-toast {
                 animation: arcadeFloat 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
               }
             `}</style>

             {/* Floating Arcade Toasts */}
             <div style={{ position: 'fixed', top: '25%', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
               {activeToasts.map(t => (
                 <div key={t.key} className="arcade-toast" style={{ background: t.isError ? 'rgba(255, 82, 82, 0.95)' : 'rgba(0, 229, 255, 0.95)', color: 'white', padding: '8px 16px', borderRadius: 12, fontWeight: 900, fontSize: 18, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
                   {t.text}
                 </div>
               ))}
             </div>

             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 20px', borderRadius: 16 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 800 }}>TIME</span>
                    <div style={{ fontSize: 24, fontWeight: 900, color: timeLeft < 10 ? 'var(--error)' : 'white' }}>{timeLeft}s</div>
                </div>
                {streak >= 3 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(248, 113, 113, 0.1)', padding: '6px 12px', borderRadius: 12, border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: '#f87171' }}>🔥 {streak} STREAK</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 18px', borderRadius: 16, border: '1px solid var(--border-glass)' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>XP</span>
                      <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary)' }}>{totalXp}</div>
                  </div>
                  <div style={{ background: 'var(--grad-primary)', padding: '12px 20px', borderRadius: 16, textAlign: 'right' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>CORRECT</span>
                      <div style={{ fontSize: 24, fontWeight: 900, color: 'white' }}>{correctCount}</div>
                  </div>
                </div>
             </div>

             <div className="glass-panel" style={{ padding: 32, marginBottom: 32, textAlign: 'center', border: '1px solid var(--error)' }}>
                <div style={{ fontSize: 10, color: 'var(--error)', fontWeight: 800, marginBottom: 12 }}>FIND THE ERROR</div>
                <p style={{ fontSize: 20, fontWeight: 600, color: 'white', lineHeight: 1.4 }}>&ldquo;{currentQuestion?.wrong}&rdquo;</p>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(opt)}
                    className="glass-card"
                    style={{ padding: 20, fontSize: 16, fontWeight: 800, color: 'white', cursor: 'pointer' }}
                  >
                    {opt}
                  </button>
                ))}
             </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="animate-slide-up" style={{ textAlign: 'center', marginTop: 40 }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--error), #ef4444)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
              boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)'
            }}>
              <span className="mi animate-bounce" style={{ fontSize: 48, color: 'white' }}>bolt</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: 'white' }}>Chaos Survived!</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>
              You answered <strong style={{ color: 'var(--error)' }}>{correctCount}</strong> questions correctly out of {totalAttempts} attempts.
            </p>
            
            <div className="glass-card" style={{ padding: 24, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, margin: '0 auto 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Base XP</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'white' }}>{correctCount * 10}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>⚡ Speed Bonuses ({speedBonuses})</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--primary)' }}>+{speedBonuses * 5}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>🔥 Streak Bonuses ({streakBonuses})</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: '#f87171' }}>+{streakBonuses * 15}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>🎯 Accuracy</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--success)' }}>
                  {totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0}%
                </span>
              </div>
              <div style={{ height: 1, background: 'var(--border-glass)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Total XP</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>+{totalXp}</span>
              </div>
            </div>

            <button onClick={syncPanic} className="premium-btn" style={{ width: '100%', padding: 18, background: 'var(--error)' }}>
              SYNC & EXIT
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
