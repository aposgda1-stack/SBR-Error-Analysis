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
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);

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
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateQuestion();
  };

  const handleAnswer = (opt) => {
    if (opt.toLowerCase() === currentQuestion.correctWord.toLowerCase()) {
      audioManager.play('SUCCESS');
      setScore(s => s + 1);
    } else {
      audioManager.play('ERROR');
    }
    generateQuestion();
  };

  const syncPanic = () => {
    const uId = JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
    if (uId && score > 0) {
      fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            action: 'sync', userId: uId, incXp: score, incDone: 1,
            pushHistory: { date: new Date(), xp: score, type: 'Panic Mode', accuracy: 100 }
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
            <h2 style={{ fontSize: 32, fontWeight: 900, color: 'white' }}>PANIC MODE</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: 40 }}>60 Seconds. Infinite Questions. How many can you get right?</p>
            <button onClick={startPanic} className="premium-btn" style={{ width: '100%', padding: 20, fontSize: 18, background: 'var(--error)' }}>
              RELEASE THE CHAOS
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="animate-fade-in">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 20px', borderRadius: 16 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 800 }}>TIME</span>
                    <div style={{ fontSize: 24, fontWeight: 900, color: timeLeft < 10 ? 'var(--error)' : 'white' }}>{timeLeft}s</div>
                </div>
                <div style={{ background: 'var(--grad-primary)', padding: '12px 20px', borderRadius: 16, textAlign: 'right' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>SCORE</span>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'white' }}>{score}</div>
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
            <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white' }}>{score}</h2>
            <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 40 }}>Questions Correct</p>
            <div className="glass-panel" style={{ padding: 24, marginBottom: 32 }}>
                <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 800, marginBottom: 8 }}>+ {score} XP EARNED</div>
                <p style={{ fontSize: 14, color: 'var(--text-dim)' }}>Your accuracy was tested. Keep it up!</p>
            </div>
            <button onClick={syncPanic} className="premium-btn" style={{ width: '100%', padding: 18 }}>
              SYNC & EXIT
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
