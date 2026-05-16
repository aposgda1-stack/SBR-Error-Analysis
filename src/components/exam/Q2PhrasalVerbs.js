'use client';
import { useState, useMemo } from 'react';

const RAW_SENTENCES = [
  { base: 'come', sentence: 'I came ___ an old friend in the market.', answer: 'across' },
  { base: 'come', sentence: 'She came ___ a fortune when her uncle died.', answer: 'into' },
  { base: 'come', sentence: 'He came ___ flu last Monday.', answer: 'down with' },
  { base: 'come', sentence: 'The idea came ___ during the meeting.', answer: 'up' },
  { base: 'come', sentence: 'She finally came ___ after the operation.', answer: 'to' },
  { base: 'come', sentence: 'We came ___ some serious problems.', answer: 'up against' },
  { base: 'come', sentence: 'The sun came ___ after the rain.', answer: 'out' },
  { base: 'cut', sentence: 'You should cut ___ on coffee.', answer: 'down on' },
  { base: 'cut', sentence: 'The phone was cut ___ in the middle of our conversation.', answer: 'off' },
  { base: 'cut', sentence: 'He cut ___ while we were talking.', answer: 'in' },
  { base: 'cut', sentence: 'She decided to cut ___ meat from her diet.', answer: 'out' },
  { base: 'do', sentence: 'Could you do ___ the old sofa? We need more space.', answer: 'away with' },
  { base: 'do', sentence: 'The house needs doing ___ completely.', answer: 'up' },
  { base: 'do', sentence: 'I could do ___ a cup of tea right now.', answer: 'with' },
  { base: 'do', sentence: 'The long hike really did me ___.', answer: 'in' },
  { base: 'give', sentence: 'She gave ___ the secret by accident.', answer: 'away' },
  { base: 'give', sentence: 'After arguing for an hour, he finally gave ___.', answer: 'in' },
  { base: 'give', sentence: 'The teacher gave ___ the exam papers.', answer: 'out' },
  { base: 'give', sentence: 'He gave ___ smoking last year.', answer: 'up' },
  { base: 'give', sentence: 'The fire gave ___ a lot of smoke.', answer: 'off' },
  { base: 'make', sentence: 'I can\'t make ___ what this sign says.', answer: 'out' },
  { base: 'make', sentence: 'She made ___ the whole story.', answer: 'up' },
  { base: 'make', sentence: 'He finally made ___ his mind.', answer: 'up' },
  { base: 'make', sentence: 'What do you make ___ the new manager?', answer: 'of' },
  { base: 'make', sentence: 'She made ___ the property to her son.', answer: 'over' },
];

function buildWordBox(questions) {
  const counts = {};
  questions.forEach(q => { counts[q.answer] = (counts[q.answer] || 0) + 1; });
  return Object.entries(counts).flatMap(([word, count]) =>
    Array.from({ length: count }, (_, i) => ({ word, key: word + '_' + i }))
  ).sort(() => Math.random() - 0.5);
}

export default function Q2PhrasalVerbs({ onScore }) {
  const questions = useMemo(() => {
    return RAW_SENTENCES.sort(() => Math.random() - 0.5).slice(0, 10).map((q, i) => ({ ...q, id: `pv_${i}` }));
  }, []);

  const wordBox = useMemo(() => buildWordBox(questions), [questions]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const usedKeys = useMemo(() => new Set(Object.values(answers).map(a => a?.key).filter(Boolean)), [answers]);

  const handleSelect = (qId, word, key) => {
    if (submitted) return;
    if (usedKeys.has(key) && answers[qId]?.key !== key) return;
    setAnswers(a => ({ ...a, [qId]: { word, key } }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => { if ((answers[q.id]?.word || '').toLowerCase() === q.answer.toLowerCase()) correct++; });
    const s = correct * 2;
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid var(--accent)' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 2: Phrasal Verbs</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Select the correct particle from the word box. (10 questions × 2 = 20 pts)</p>
        {submitted && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score} / 20</span>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: 32, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>Word Box</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {wordBox.map(w => {
            const isUsed = usedKeys.has(w.key);
            return (
              <span key={w.key} className="glass-card" style={{ 
                padding: '6px 14px', fontSize: 13, color: isUsed ? 'var(--text-muted)' : 'white', borderRadius: 12, 
                background: isUsed ? 'rgba(255,255,255,0.02)' : 'rgba(124, 77, 255, 0.1)',
                textDecoration: isUsed ? 'line-through' : 'none', opacity: isUsed ? 0.5 : 1
              }}>
                {w.word}
              </span>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {questions.map((q, idx) => {
          const isCorrect = submitted && answers[q.id]?.word?.toLowerCase() === q.answer.toLowerCase();
          return (
            <div key={q.id} className="glass-card" style={{ padding: '24px', border: submitted ? `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` : '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 12, textTransform: 'uppercase' }}>{idx + 1} • {q.base.toUpperCase()}</div>
              <p style={{ fontSize: 18, color: 'white', lineHeight: 1.6, direction: 'ltr' }}>
                {q.sentence.split('___')[0]}
                <span style={{ 
                  display: 'inline-block', minWidth: 100, padding: '4px 12px', margin: '0 8px',
                  background: 'rgba(255,255,255,0.05)', borderBottom: `2px solid ${answers[q.id] ? 'var(--primary)' : 'var(--border-glass)'}`,
                  color: 'var(--primary)', fontWeight: 800, textAlign: 'center'
                }}>
                  {answers[q.id]?.word || '...'}
                </span>
                {q.sentence.split('___')[1]}
              </p>
              
              {!submitted && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                  {wordBox.map(w => {
                    const isUsed = usedKeys.has(w.key);
                    const isSelected = answers[q.id]?.key === w.key;
                    if (isUsed && !isSelected) return null;
                    return (
                      <button 
                        key={w.key} 
                        onClick={() => handleSelect(q.id, w.word, w.key)}
                        className="premium-input"
                        style={{ padding: '6px 12px', fontSize: 12, cursor: 'pointer', background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)' }}
                      >
                        {w.word}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button className="premium-btn" style={{ width: '100%', marginTop: 40, padding: 20 }} onClick={handleSubmit}>
          Validate Section 2 <span className="mi">check_circle</span>
        </button>
      )}
    </div>
  );
}
