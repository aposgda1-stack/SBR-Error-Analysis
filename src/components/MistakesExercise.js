'use client';
import { useState, useEffect, useMemo } from 'react';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function MistakesExercise({ data, startIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCurrentIndex(startIndex);
    setSelectedOpt(null);
    setCompleted(false);
  }, [startIndex]);

  const mistakes = data.the_130_mistakes;
  const currentItem = mistakes[currentIndex];

  const options = useMemo(() => {
    if (!currentItem) return [];
    const wrongOptions = shuffleArray(mistakes.filter(x => x.id !== currentItem.id)).slice(0, 3).map(x => x.correct);
    return shuffleArray([currentItem.correct, ...wrongOptions]);
  }, [currentIndex, currentItem, mistakes]);

  const handleSelect = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    if (opt === currentItem.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOpt(null);
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
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Practice Complete!</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>Great job mastering the error analysis.</p>
        
        <div className="glass-card" style={{ padding: '30px', maxWidth: 300, margin: '0 auto 32px' }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{score}/{mistakes.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>Correct Answers</div>
        </div>

        <button className="premium-btn" style={{ margin: '0 auto' }} onClick={() => window.location.reload()}>
          <span className="mi">refresh</span> Start Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
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

      <div className="glass-card" style={{ padding: '32px', marginBottom: 24, minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4 }} />
        <h3 style={{ fontSize: 14, color: 'var(--error)', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mi" style={{ fontSize: 18 }}>bug_report</span> INCORRECT SENTENCE
        </h3>
        <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.6, color: 'white', direction: 'ltr' }}>
          &ldquo;{currentItem.wrong}&rdquo;
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {options.map((opt, i) => {
          const isSelected = selectedOpt === opt;
          const isCorrect = selectedOpt && opt === currentItem.correct;
          const isWrong = selectedOpt && isSelected && opt !== currentItem.correct;
          
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              style={{
                width: '100%', padding: '16px 20px', borderRadius: 14, textAlign: 'left',
                background: isCorrect ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isSelected ? 'rgba(124, 77, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--primary)' : 'var(--border-glass)'}`,
                color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'white',
                transition: 'all 0.2s', cursor: selectedOpt ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, direction: 'ltr'
              }}
            >
              <div style={{ 
                width: 24, height: 24, borderRadius: '50%', border: '2px solid currentColor',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {isSelected && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'currentColor' }} />}
              </div>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {selectedOpt && (
        <div className="animate-slide-up">
          <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mi" style={{ fontSize: 18, color: 'var(--text-dim)' }}>menu_book</span>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-dim)' }}>
              <strong style={{ color: 'white' }}>Rule:</strong> {currentItem.topic}
            </div>
          </div>

          <button className="premium-btn" style={{ width: '100%', padding: '20px' }} onClick={handleNext}>
            Next Question <span className="mi">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
