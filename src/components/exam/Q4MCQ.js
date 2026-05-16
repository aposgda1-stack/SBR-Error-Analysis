'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

export default function Q4MCQ({ onScore }) {
  const grammar = sectionsData.grammar_guide;
  
  const questions = useMemo(() => {
    const pool = [];
    Object.entries(grammar).forEach(([topic, data]) => {
      if (!data.practice) return;
      data.practice.forEach((item, i) => {
        if (item.sentence && item.answer) {
          pool.push({
            id: `q4_${topic}_${i}`,
            sentence: item.sentence,
            correct: item.answer,
            options: [item.answer, ...Object.values(grammar).flatMap(g => g.practice || []).filter(x => x.answer && x.answer !== item.answer).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.answer)].sort(() => Math.random() - 0.5)
          });
        }
      });
    });
    return pool.sort(() => Math.random() - 0.5).slice(0, 20);
  }, []);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct) correct++; });
    const s = correct; // 20 questions, 1 pt each
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid #00e5ff' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 4: Grammar MCQ</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Select the most appropriate answer for each grammatical context. (20 questions × 1 = 20 pts)</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {questions.map((q, idx) => (
          <div key={q.id} className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 12, textTransform: 'uppercase' }}>Question {idx + 1}</div>
            <p style={{ fontSize: 18, color: 'white', fontWeight: 600, marginBottom: 24, lineHeight: 1.6, direction: 'ltr' }}>
              &ldquo;{q.sentence}&rdquo;
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt;
                const isCorrect = submitted && opt === q.correct;
                const isWrong = submitted && isSelected && opt !== q.correct;
                
                return (
                  <button
                    key={i}
                    onClick={() => !submitted && setAnswers({ ...answers, [q.id]: opt })}
                    style={{
                      padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: submitted ? 'default' : 'pointer',
                      background: isCorrect ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isSelected ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--secondary)' : 'var(--border-glass)'}`,
                      color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <button className="premium-btn" style={{ width: '100%', marginTop: 40, padding: 20 }} onClick={handleSubmit}>
          Complete Exam <span className="material-symbols-rounded">stars</span>
        </button>
      )}
    </div>
  );
}
