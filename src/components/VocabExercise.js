'use client';
import { useState, useMemo } from 'react';

export default function VocabExercise({ task, onFinish }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeGap, setActiveGap] = useState(null);
  const [score, setScore] = useState(0);

  const correctAnswers = task.answers || {};
  const gaps = Object.keys(correctAnswers);

  const wordBox = useMemo(() => {
    return (task.box_words || []).map((w, i) => ({ word: w, id: `w_${i}` }));
  }, [task.box_words]);

  const usedWordIds = useMemo(() => {
    return new Set(Object.values(answers).map(a => a.id).filter(Boolean));
  }, [answers]);

  const handleWordSelect = (wordObj) => {
    if (submitted || !activeGap) return;
    setAnswers(prev => ({ ...prev, [activeGap]: wordObj }));
    // Move to next gap automatically if available
    const nextGap = gaps[gaps.indexOf(activeGap) + 1];
    setActiveGap(nextGap || null);
  };

  const handleSubmit = () => {
    let currentScore = 0;
    gaps.forEach(key => {
      if (answers[key]?.word?.toLowerCase().trim() === correctAnswers[key].toLowerCase().trim()) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);

    const uId = localStorage.getItem('sbr_user_id') || JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
    if (uId && currentScore > 0) {
      fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', userId: uId, incXp: currentScore, incDone: 1 })
      }).catch(console.error);
    }
  };

  const processedText = useMemo(() => {
    let text = task.text;
    gaps.forEach(key => {
      const escapedWord = correctAnswers[key].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\(${key}\\)\\s+${escapedWord}`, 'g');
      text = text.replace(regex, `(${key}) ___`);
    });
    return text;
  }, [task.text, correctAnswers, gaps]);

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'white' }}>{task.title}</h3>
      <p style={{ color: 'var(--text-dim)', marginBottom: 32, fontSize: 15 }}>{task.instruction}</p>
      
      {/* Word Box */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: 32, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1.5 }}>Word Bank</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {wordBox.map(w => {
            const isUsed = usedWordIds.has(w.id);
            return (
              <button 
                key={w.id} 
                onClick={() => handleWordSelect(w)}
                disabled={submitted || isUsed}
                className="glass-card" 
                style={{ 
                    padding: '8px 16px', fontSize: 14, color: isUsed ? 'var(--text-muted)' : 'white', borderRadius: 12, 
                    background: isUsed ? 'rgba(255, 255, 255, 0.02)' : 'rgba(124, 77, 255, 0.1)',
                    border: isUsed ? '1px solid transparent' : '1px solid rgba(124, 77, 255, 0.3)',
                    cursor: (submitted || isUsed) ? 'default' : 'pointer',
                    transition: '0.3s',
                    textDecoration: isUsed ? 'line-through' : 'none'
                }}
              >
                {w.word}
              </button>
            );
          })}
        </div>
      </div>
 
      <div className="glass-card" style={{ padding: '32px', marginBottom: 32, position: 'relative' }}>
        <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, opacity: 0.5 }} />
        
        {/* Interactive Text Area */}
        <div style={{ lineHeight: '2.5', fontSize: 18, color: 'var(--text-dim)', direction: 'ltr' }}>
          {processedText.split('___').map((part, i, arr) => {
            const gapId = String(i + 1);
            const isLast = i === arr.length - 1;
            const answer = answers[gapId];
            const isActive = activeGap === gapId;
            const isRight = submitted && answer?.word?.toLowerCase().trim() === correctAnswers[gapId]?.toLowerCase().trim();
            const isWrong = submitted && answer && answer?.word?.toLowerCase().trim() !== correctAnswers[gapId]?.toLowerCase().trim();

            return (
              <span key={i}>
                {part}
                {!isLast && (
                  <button
                    onClick={() => !submitted && setActiveGap(gapId)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 100, height: 32, margin: '0 8px', borderRadius: 8,
                      background: isRight ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isActive ? 'rgba(124, 77, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isRight ? 'var(--success)' : isWrong ? 'var(--error)' : isActive ? 'var(--primary)' : 'var(--border-glass)'}`,
                      color: isRight ? 'var(--success)' : isWrong ? 'var(--error)' : answer ? 'white' : 'var(--text-muted)',
                      fontSize: 14, fontWeight: 800, cursor: submitted ? 'default' : 'pointer',
                      verticalAlign: 'middle', transition: '0.2s', position: 'relative',
                      padding: '0 12px'
                    }}
                  >
                    {answer?.word || (isActive ? '...' : `#${gapId}`)}
                    {submitted && (
                       <span className="mi" style={{ marginLeft: 6, fontSize: 14 }}>{isRight ? 'check' : 'close'}</span>
                    )}
                  </button>
                )}
              </span>
            );
          })}
        </div>
        
        {submitted && (
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(0, 230, 118, 0.05)', borderRadius: 12, border: '1px dashed var(--success)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--success)', marginBottom: 8, textTransform: 'uppercase' }}>Correction Key</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
                    {gaps.map(g => (
                        <div key={g} style={{ fontSize: 13, color: 'white' }}>
                            <span style={{ color: 'var(--text-muted)' }}>({g})</span> {correctAnswers[g]}
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {!submitted ? (
        <button className="premium-btn" style={{ width: '100%', padding: '20px' }} onClick={handleSubmit}>
          Finalize Assessment <span className="mi">stars</span>
        </button>
      ) : (
        <div style={{ textAlign: 'center' }} className="animate-slide-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '16px 32px', borderRadius: 20, background: 'var(--grad-primary)', boxShadow: '0 10px 30px var(--primary-glow)' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>{score} / {gaps.length}</span>
            <div style={{ height: 30, width: 1, background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Results Locked</span>
          </div>
          <br />
          <button
            style={{ marginTop: 24, background: 'transparent', border: 'none', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => onFinish ? onFinish() : window.location.reload()}
          >
            Exit Module <span className="mi">logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

