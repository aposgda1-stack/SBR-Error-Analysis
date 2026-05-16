'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

export default function Q3WorkSheet({ onScore }) {
  const data = sectionsData.work_vocabulary.task_2_nouns;
  const correctAnswers = data.answers;

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Function to process the text and remove answers for the exam
  const processedText = useMemo(() => {
    let text = data.text;
    Object.keys(correctAnswers).forEach(key => {
      const answer = correctAnswers[key];
      // Replace "(1) vacancy" with " (1) ___ "
      text = text.replace(`(${key}) ${answer}`, `(${key}) ___`);
    });
    return text;
  }, [data.text, correctAnswers]);

  const handleSubmit = () => {
    let correct = 0;
    Object.keys(correctAnswers).forEach(key => {
      if (answers[key]?.toLowerCase().trim() === correctAnswers[key].toLowerCase().trim()) correct++;
    });
    const s = Math.round((correct / Object.keys(correctAnswers).length) * 20);
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid #ffea00' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 3: Work Vocabulary</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Fill in the blanks with the correct professional terms. (20 pts total)</p>
        {submitted && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score} / 20</span>
          </div>
        )}
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

      <div className="glass-card" style={{ padding: '32px', marginBottom: 40, lineHeight: 2, fontSize: 16, color: 'white', direction: 'ltr' }}>
        {processedText.split('___').map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <input 
                type="text" 
                placeholder={`#${i + 1}`}
                onChange={(e) => setAnswers({ ...answers, [i + 1]: e.target.value })}
                disabled={submitted}
                className="premium-input"
                style={{ 
                  width: 90, display: 'inline-block', margin: '0 4px', textAlign: 'center', height: 28, padding: '0 8px',
                  fontSize: 14,
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
          Validate Section 3 <span className="mi">playlist_add_check</span>
        </button>
      )}
    </div>
  );
}
