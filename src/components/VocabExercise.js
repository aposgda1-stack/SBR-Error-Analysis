'use client';
import { useState } from 'react';

export default function VocabExercise({ task, onFinish }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const correctAnswers = task.answers || {};

  const handleChange = (id, val) => {
    setAnswers({ ...answers, [id]: val });
  };

  const handleSubmit = () => {
    let currentScore = 0;
    Object.keys(correctAnswers).forEach(key => {
      if (answers[key]?.toLowerCase().trim() === correctAnswers[key].toLowerCase().trim()) {
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

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'white' }}>{task.title}</h3>
      <p style={{ color: 'var(--text-dim)', marginBottom: 32, fontSize: 15 }}>{task.instruction}</p>
      
      <div className="glass-panel" style={{ padding: '20px', marginBottom: 32, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1.5 }}>Word Bank</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {task.box_words?.map(word => (
            <span key={word} className="glass-card" style={{ padding: '6px 14px', fontSize: 13, color: 'white', borderRadius: 12, background: 'rgba(124, 77, 255, 0.1)' }}>
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px', marginBottom: 32, position: 'relative' }}>
        <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, opacity: 0.5 }} />
        <p style={{ lineHeight: '1.8', fontSize: 17, color: 'var(--text-dim)', direction: 'ltr' }}>{task.text}</p>
        
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {Object.keys(correctAnswers).map(num => {
            const isWrong = submitted && answers[num]?.toLowerCase().trim() !== correctAnswers[num].toLowerCase().trim();
            const isRight = submitted && answers[num]?.toLowerCase().trim() === correctAnswers[num].toLowerCase().trim();
            
            return (
              <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>GAP ({num})</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Type word..."
                    onChange={(e) => handleChange(num, e.target.value)}
                    disabled={submitted}
                    className="premium-input"
                    style={{ 
                      width: '100%',
                      paddingRight: submitted ? 40 : 16,
                      borderColor: isRight ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--border-glass)',
                      background: isRight ? 'rgba(0, 230, 118, 0.05)' : isWrong ? 'rgba(255, 82, 82, 0.05)' : 'rgba(255, 255, 255, 0.03)'
                    }}
                  />
                  {submitted && (
                    <span className="mi" style={{ 
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      color: isRight ? 'var(--success)' : 'var(--error)', fontSize: 20
                    }}>
                      {isRight ? 'check_circle' : 'cancel'}
                    </span>
                  )}
                </div>
                {submitted && isWrong && (
                  <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, paddingLeft: 4 }}>
                    Correct: {correctAnswers[num]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!submitted ? (
        <button className="premium-btn" style={{ width: '100%', padding: '18px' }} onClick={handleSubmit}>
          Validate Answers <span className="mi">done_all</span>
        </button>
      ) : (
        <div style={{ textAlign: 'center' }} className="animate-slide-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '16px 32px', borderRadius: 20, background: 'var(--grad-primary)', boxShadow: '0 10px 30px var(--primary-glow)' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>{score} / {Object.keys(correctAnswers).length}</span>
            <div style={{ height: 30, width: 1, background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Well done!</span>
          </div>
          <br />
          <button
            style={{ marginTop: 24, background: 'transparent', border: 'none', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => onFinish ? onFinish() : window.location.reload()}
          >
            Try another session
          </button>
        </div>
      )}
    </div>
  );
}
