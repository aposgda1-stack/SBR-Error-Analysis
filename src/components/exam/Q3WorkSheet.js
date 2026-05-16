'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

export default function Q3WorkSheet({ onScore }) {
  const data = sectionsData.office_and_business_data.task_2_nouns;
  const correctAnswers = data.answers;

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleSubmit = () => {
    let correct = 0;
    Object.keys(correctAnswers).forEach(key => {
      if (answers[key]?.toLowerCase().trim() === correctAnswers[key].toLowerCase().trim()) correct++;
    });
    const s = correct; // 20 questions, 1 pt each? or 20 pts total?
    // Let's assume 1 pt each for 20 pts
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid #ffea00' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 3: Work Vocabulary</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Fill in the blanks with the correct professional terms. (20 questions × 1 = 20 pts)</p>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: 32, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: 11, color: '#ffea00', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>Word Bank</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {data.box_words.map(word => (
            <span key={word} className="glass-card" style={{ padding: '6px 14px', fontSize: 13, color: 'white', borderRadius: 12, background: 'rgba(255, 234, 0, 0.1)' }}>
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px', marginBottom: 40, lineHeight: 1.8, fontSize: 17, color: 'white', direction: 'ltr' }}>
        {data.text.split('___').map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <input 
                type="text" 
                placeholder={i + 1}
                onChange={(e) => setAnswers({ ...answers, [i + 1]: e.target.value })}
                disabled={submitted}
                className="premium-input"
                style={{ 
                  width: 100, display: 'inline-block', margin: '0 8px', textAlign: 'center', height: 32, padding: 0,
                  borderColor: submitted ? (answers[i+1]?.toLowerCase().trim() === correctAnswers[i+1].toLowerCase().trim() ? 'var(--success)' : 'var(--error)') : 'var(--border-glass)',
                  background: submitted ? (answers[i+1]?.toLowerCase().trim() === correctAnswers[i+1].toLowerCase().trim() ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 82, 82, 0.1)') : 'rgba(255,255,255,0.05)'
                }}
              />
            )}
          </span>
        ))}
      </div>

      {!submitted && (
        <button className="premium-btn" style={{ width: '100%', padding: 20 }} onClick={handleSubmit}>
          Validate Section 3 <span className="material-symbols-rounded">playlist_add_check</span>
        </button>
      )}
    </div>
  );
}
