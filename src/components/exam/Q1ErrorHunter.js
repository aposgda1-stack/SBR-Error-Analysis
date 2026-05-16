'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

export default function Q1ErrorHunter({ onScore }) {
  const mistakes = sectionsData.identify_error_data.the_130_mistakes;
  
  const questions = useMemo(() => {
    return [...mistakes].sort(() => Math.random() - 0.5).slice(0, 10).map((m, i) => ({
      ...m,
      id: `q1_${i}`,
      options: [m.correct, ...mistakes.filter(x => x.id !== m.id).sort(() => Math.random() - 0.5).slice(0, 2).map(x => x.correct)].sort(() => Math.random() - 0.5)
    }));
  }, []);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct) correct++; });
    const s = correct * 2;
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 1: Error Identification</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Identify the correct version for each stylistic error below. (10 questions × 2 = 20 pts)</p>
        {submitted && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score} / 20</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>Points Earned</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {questions.map((q, idx) => (
          <div key={q.id} className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Question {idx + 1}</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 20, lineHeight: 1.5, direction: 'ltr' }}>
              &ldquo;{q.wrong}&rdquo;
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt;
                const isCorrect = submitted && opt === q.correct;
                const isWrong = submitted && isSelected && opt !== q.correct;
                
                return (
                  <button
                    key={i}
                    onClick={() => !submitted && setAnswers({ ...answers, [q.id]: opt })}
                    style={{
                      width: '100%', padding: '16px 20px', borderRadius: 14, textAlign: 'left',
                      background: isCorrect ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isSelected ? 'rgba(124, 77, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--primary)' : 'var(--border-glass)'}`,
                      color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'white',
                      transition: 'all 0.2s', cursor: submitted ? 'default' : 'pointer',
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
          </div>
        ))}
      </div>

      {!submitted && (
        <button className="premium-btn" style={{ width: '100%', marginTop: 40, padding: 20 }} onClick={handleSubmit}>
          Save & Next Section <span className="mi">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
