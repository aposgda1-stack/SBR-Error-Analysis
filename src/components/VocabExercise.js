'use client';
import { useState } from 'react';

export default function VocabExercise({ data }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const task = data.task_2_nouns; // Using Nouns task as primary example
  const correctAnswers = task.answers;

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
  };

  return (
    <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', borderRadius: 16, padding: '40px' }}>
      <h3 style={{ marginBottom: '20px', color: 'var(--on-surface)' }}>{task.title}</h3>
      <p style={{ color: 'var(--on-surface-variant)', marginBottom: '30px' }}>{task.instruction}</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px', padding: '15px', background: 'var(--surface-container-high)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
        {task.box_words.map(word => (
          <span key={word} style={{ padding: '5px 12px', background: 'rgba(165,200,255,0.15)', border: '1px solid rgba(165,200,255,0.3)', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--tertiary)' }}>
            {word}
          </span>
        ))}
      </div>

      <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--on-surface)' }}>
        <p>{task.text}</p>
        <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {Object.keys(correctAnswers).map(num => (
            <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>({num})</label>
              <input 
                type="text" 
                placeholder="Enter word..."
                onChange={(e) => handleChange(num, e.target.value)}
                disabled={submitted}
                style={{ 
                  background: 'var(--surface-container-high)', 
                  border: `1px solid ${submitted ? (answers[num]?.toLowerCase() === correctAnswers[num] ? '#2e5238' : 'var(--error)') : 'var(--outline-variant)'}`,
                  color: 'var(--on-surface)',
                  padding: '10px',
                  borderRadius: '8px',
                  outline: 'none',
                  fontFamily: 'Inter'
                }}
              />
              {submitted && answers[num]?.toLowerCase() !== correctAnswers[num] && (
                <span style={{ fontSize: '0.8rem', color: '#88e2a5' }}>{correctAnswers[num]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          style={{ marginTop: '40px', width: '100%', background: 'var(--primary-container)', color: 'var(--on-primary-container)', border: 'none', borderRadius: 12, padding: '14px', fontFamily: 'Inter', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
        >Check My Answers</button>
      ) : (
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 28, color: 'var(--primary)' }}>Score: {score} / {Object.keys(correctAnswers).length}</h2>
          <button
            style={{ marginTop: '20px', background: 'var(--surface-container-high)', color: 'var(--on-surface)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: '14px 28px', fontFamily: 'Inter', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => window.location.reload()}
          >Restart</button>
        </div>
      )}
    </div>
  );
}
