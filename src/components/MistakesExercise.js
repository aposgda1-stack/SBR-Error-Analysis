'use client';
import { useState, useEffect } from 'react';

export default function MistakesExercise({ data, startIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCurrentIndex(startIndex);
    setShowAnswer(false);
    setCompleted(false);
  }, [startIndex]);

  const mistakes = data.the_130_mistakes;
  const currentItem = mistakes[currentIndex];

  const handleNext = (correct) => {
    if (correct) setScore(score + 1);
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }} className="animate-slide-up">
        <div style={{ 
          width: 80, height: 80, borderRadius: '50%', background: 'var(--grad-primary)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          boxShadow: '0 0 30px var(--primary-glow)'
        }}>
          <span className="mi" style={{ fontSize: 40, color: 'white' }}>celebration</span>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Session Complete!</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>Your progress has been synchronized.</p>
        
        <div className="glass-card" style={{ padding: '30px', maxWidth: 300, margin: '0 auto 32px' }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{score}/{mistakes.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>Correct Answers</div>
        </div>

        <button className="premium-btn" style={{ margin: '0 auto' }} onClick={() => window.location.reload()}>
          <span className="mi">refresh</span> Restart Session
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Progress Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Question</span>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{currentIndex + 1} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 16 }}>/ {mistakes.length}</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Accuracy</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--secondary)' }}>{Math.round((score / (currentIndex || 1)) * 100)}%</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: 32, minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4 }} />
        
        <h3 style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mi" style={{ fontSize: 18 }}>find_replace</span> FIND THE ERROR
        </h3>
        
        <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.6, color: 'white', direction: 'ltr' }}>
          &ldquo;{currentItem.wrong}&rdquo;
        </p>
      </div>

      {!showAnswer ? (
        <button className="premium-btn" style={{ width: '100%', padding: '20px' }} onClick={() => setShowAnswer(true)}>
          Reveal Solution <span className="mi">visibility</span>
        </button>
      ) : (
        <div className="animate-slide-up">
          <div className="glass-panel" style={{ padding: '24px', marginBottom: 24, borderLeft: '4px solid var(--success)', background: 'rgba(0, 230, 118, 0.05)' }}>
            <h4 style={{ color: 'var(--success)', fontSize: 12, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase' }}>Correct Version</h4>
            <p style={{ fontSize: 18, color: 'white', direction: 'ltr', fontWeight: 500 }}>{currentItem.correct}</p>
          </div>
          
          <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mi" style={{ fontSize: 18, color: 'var(--text-dim)' }}>book</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              <strong>Rule:</strong> {currentItem.topic}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <button 
              onClick={() => handleNext(true)}
              style={{ flex: 1, background: 'rgba(0, 230, 118, 0.1)', border: '1px solid var(--success)', color: 'var(--success)' }}
              className="premium-btn"
            >
              I got it!
            </button>
            <button 
              onClick={() => handleNext(false)}
              style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', color: 'white' }}
              className="premium-btn"
            >
              Missed it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
