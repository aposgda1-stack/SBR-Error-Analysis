'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

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
  
  const [answers, setAnswers] = useState({}); // { qId: { word: string, key: string } }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const usedKeys = useMemo(() => {
    return new Set(Object.values(answers).map(a => a?.key).filter(Boolean));
  }, [answers]);

  const handleSelect = (qId, word, key) => {
    if (submitted) return;
    
    // If the key is already used by another question, we can't use it
    if (usedKeys.has(key) && answers[qId]?.key !== key) return;

    setAnswers(a => ({ ...a, [qId]: { word, key } }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => { 
      if ((answers[q.id]?.word || '').toLowerCase() === q.answer.toLowerCase()) correct++; 
    });
    const s = correct * 2;
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div dir="ltr">
      <div style={{ background: 'var(--surface-container)', borderRadius: 16, padding: '20px', marginBottom: 20, border: '1px solid var(--outline-variant)', direction: 'rtl' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>Question 2: Phrasal Verbs – Word Box</h2>
        <p style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>اختر حرف الجر المناسب من الـ Word Box لإكمال كل جملة. (10 جمل × 2 = 20 درجة)</p>
        {submitted && <div style={{ marginTop: 12, fontSize: 22, fontWeight: 900, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>Score: {score} / 20</div>}
      </div>

      {/* Word Box */}
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 16, padding: '16px', marginBottom: 24, border: '1px solid var(--primary)', direction: 'rtl' }}>
        <div style={{ fontSize: 12, color: 'var(--primary)', fontFamily: 'JetBrains Mono', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📦 Word Box</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {wordBox.map(w => {
            const isUsed = usedKeys.has(w.key);
            return (
              <span key={w.key} style={{
                background: isUsed ? 'var(--surface-container-highest)' : 'var(--primary-container)',
                color: isUsed ? 'var(--on-surface-variant)' : 'var(--on-primary-container)',
                padding: '6px 14px', borderRadius: 20, fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600,
                textDecoration: isUsed ? 'line-through' : 'none', direction: 'ltr',
                opacity: isUsed ? 0.4 : 1,
              }}>{w.word}</span>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, idx) => {
        const isCorrect = submitted && answers[q.id]?.word?.toLowerCase() === q.answer.toLowerCase();
        return (
          <div key={q.id} style={{ 
            background: submitted ? (isCorrect ? 'rgba(27,47,33,0.5)' : 'rgba(60,0,0,0.4)') : 'var(--surface-container)', 
            border: `1px solid ${submitted ? (isCorrect ? '#2e5238' : '#5c0000') : 'var(--outline-variant)'}`, 
            borderRadius: 16, padding: '20px', marginBottom: 14 
          }}>
            <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontFamily: 'JetBrains Mono' }}>#{idx + 1} [{q.base.toUpperCase()}]</span>
            <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--on-surface)', margin: '10px 0', lineHeight: 1.8 }}>
              {q.sentence.split('___')[0]}
              <button 
                onClick={() => {
                  if (submitted) return;
                  if (answers[q.id]) {
                    setAnswers(a => { const n = { ...a }; delete n[q.id]; return n; });
                  }
                }}
                style={{
                  display: 'inline-block', minWidth: 80, padding: '4px 12px', margin: '0 4px',
                  background: answers[q.id] ? 'rgba(255,87,26,0.15)' : 'transparent',
                  border: `2px dashed ${answers[q.id] ? 'var(--primary)' : 'var(--outline)'}`,
                  color: answers[q.id] ? 'var(--primary)' : 'var(--on-surface-variant)',
                  borderRadius: 8, fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}
              >
                {answers[q.id]?.word || '  ?  '}
              </button>
              {q.sentence.split('___')[1]}
            </p>
            
            {/* Options */}
            {!submitted && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {wordBox.map(w => {
                  const isUsed = usedKeys.has(w.key);
                  if (isUsed && answers[q.id]?.key !== w.key) return null;
                  return (
                    <button 
                      key={w.key} 
                      disabled={isUsed && answers[q.id]?.key !== w.key}
                      onClick={() => handleSelect(q.id, w.word, w.key)} 
                      style={{
                        background: isUsed ? 'var(--primary-container)' : 'var(--surface-container-high)', 
                        border: isUsed ? '1px solid var(--primary)' : '1px solid var(--outline-variant)', 
                        color: isUsed ? 'var(--on-primary-container)' : 'var(--on-surface)', 
                        borderRadius: 20, padding: '6px 14px', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer',
                        opacity: isUsed && answers[q.id]?.key !== w.key ? 0.3 : 1
                      }}
                    >
                      {w.word}
                    </button>
                  );
                })}
              </div>
            )}
            
            {submitted && <div style={{ fontSize: 13, color: isCorrect ? '#88e2a5' : 'var(--error)', marginTop: 8, direction: 'ltr' }}>
              Answer: <strong>{q.answer}</strong>{!isCorrect && <> — You chose: <em>{answers[q.id]?.word || 'nothing'}</em></>}
            </div>}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={handleSubmit} style={{ width: '100%', background: 'var(--primary-container)', color: 'var(--on-primary-container)', border: 'none', borderRadius: 16, padding: 18, fontWeight: 900, fontSize: 17, cursor: 'pointer', marginTop: 8 }}>
          Submit Q2 ({Object.keys(answers).length}/{questions.length} answered)
        </button>
      )}
    </div>
  );
}
