'use client';
import { useState } from 'react';

const QUESTIONS = [
  {
    id: 'm4_1',
    text: 'Drinking enough water every day is essential for good health. Water helps regulate body temperature, keeps joints lubricated, and prevents infections.',
    options: ['to inform', 'to persuade', 'to entertain'],
    correct: 'to inform'
  },
  {
    id: 'm4_2',
    text: 'Don\'t miss out on the biggest sale of the year! Come to Bright Mart this weekend and get up to 50% off on all electronics. Hurry before it\'s too late!',
    options: ['to inform', 'to persuade', 'to entertain'],
    correct: 'to persuade'
  },
  {
    id: 'm4_3',
    text: 'As the clumsy cat leapt onto the table, it knocked over a vase, sending flowers flying and water splashing all over Grandma\'s knitting!',
    options: ['to inform', 'to persuade', 'to entertain'],
    correct: 'to entertain'
  },
  {
    id: 'm4_4',
    text: 'Imagine a world where you could fly with the birds, touch the clouds, and chase the stars. That\'s exactly what Max did when he discovered his magical wings.',
    options: ['to inform', 'to persuade', 'to entertain'],
    correct: 'to entertain'
  },
  {
    id: 'm4_5',
    text: 'The Eiffel Tower, located in Paris, France, was completed in 1889. It stands 324 meters tall and is one of the most visited landmarks in the world.',
    options: ['to inform', 'to persuade', 'to entertain'],
    correct: 'to inform'
  }
];

export default function M4AuthorPurpose({ onScore, reviewMode, sectionScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const isExamFinished = submitted || reviewMode;

  const handleSelect = (qId, option) => {
    if (isExamFinished) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });
    const s = correct * 5; // 5 questions * 5 = 25 XP
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid #00e5ff' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 4: Mini Texts & Author Purpose</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Read each text and identify its primary purpose: to inform, to persuade, or to entertain. (10 marks = 25 XP)</p>
        {isExamFinished && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score !== null ? score : (sectionScore !== null && sectionScore !== undefined ? sectionScore : QUESTIONS.filter(q => answers[q.id] === q.correct).length * 5)} / 25 XP</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {QUESTIONS.map((q, idx) => {
          const selected = answers[q.id];
          const isCorrect = isExamFinished && selected === q.correct;

          return (
            <div key={q.id} className="glass-card" style={{ padding: '24px', border: isExamFinished ? `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` : '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>Mini Text {idx + 1}</div>
              <p style={{ fontSize: 16, color: 'white', fontWeight: 600, marginBottom: 24, lineHeight: 1.6, direction: 'ltr', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: 12 }}>
                &ldquo;{q.text}&rdquo;
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {q.options.map((opt, i) => {
                  const isSelected = selected === opt;
                  const isOptCorrect = opt === q.correct;

                  let btnBg = 'rgba(255,255,255,0.03)';
                  let btnBorder = '1px solid var(--border-glass)';
                  let btnColor = 'white';

                  if (isSelected) {
                    btnBg = 'rgba(0, 229, 255, 0.15)';
                    btnBorder = '1px solid var(--secondary)';
                    btnColor = 'var(--secondary)';
                  }

                  if (isExamFinished) {
                    if (isOptCorrect) {
                      btnBg = 'rgba(0, 230, 118, 0.15)';
                      btnBorder = '1px solid var(--success)';
                      btnColor = 'var(--success)';
                    } else if (isSelected && !isOptCorrect) {
                      btnBg = 'rgba(255, 82, 82, 0.15)';
                      btnBorder = '1px solid var(--error)';
                      btnColor = 'var(--error)';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isExamFinished}
                      onClick={() => handleSelect(q.id, opt)}
                      style={{
                        padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                        cursor: isExamFinished ? 'default' : 'pointer',
                        background: btnBg, border: btnBorder, color: btnColor,
                        transition: 'all 0.2s', textTransform: 'capitalize'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isExamFinished && !isCorrect && (
                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, background: 'rgba(0, 230, 118, 0.05)', border: '1px dashed var(--success)', fontSize: 14 }}>
                  <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Correct Purpose:</span> <span style={{ color: 'white', textTransform: 'capitalize' }}>{q.correct}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isExamFinished && (
        <button className="premium-btn" style={{ width: '100%', marginTop: 40, padding: 20 }} onClick={handleSubmit}>
          Save Section 4 <span className="mi">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
