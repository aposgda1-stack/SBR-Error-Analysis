'use client';
import { useState, useMemo } from 'react';

const QUESTIONS = [
  { id: 'm3_1', sentence: 'The teacher asked us to look ___ the new words in the dictionary.', answer: 'up' },
  { id: 'm3_2', sentence: 'I can\'t make ___ what he\'s saying—it\'s too noisy.', answer: 'out' },
  { id: 'm3_3', sentence: 'Don\'t pick ___ your little brother like that! It\'s not fair.', answer: 'on' },
  { id: 'm3_4', sentence: 'I\'m too tired to continue this puzzle. I think I\'ll give ___.', answer: 'up' },
  { id: 'm3_5', sentence: 'Can you help me do the dress ___ before the party?', answer: 'up' },
  { id: 'm3_6', sentence: 'Sorry to cut ___, but I have something important to say.', answer: 'in' },
  { id: 'm3_7', sentence: 'The manager will look ___ your report before the meeting.', answer: 'over' }
];

const WORD_BOX = [
  { word: 'up', key: 'm3_up_1' },
  { word: 'up', key: 'm3_up_2' },
  { word: 'up', key: 'm3_up_3' },
  { word: 'in', key: 'm3_in_1' },
  { word: 'over', key: 'm3_over_1' },
  { word: 'out', key: 'm3_out_1' },
  { word: 'on', key: 'm3_on_1' }
];

export default function M3Prepositions({ onScore, reviewMode, sectionScore }) {
  const [answers, setAnswers] = useState({}); // { qId: { word, key } }
  const [activeGap, setActiveGap] = useState(null); // qId
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const isExamFinished = submitted || reviewMode;

  const usedKeys = useMemo(() => {
    return new Set(Object.values(answers).map(a => a?.key).filter(Boolean));
  }, [answers]);

  const handleSelectWord = (word, key) => {
    if (isExamFinished || !activeGap) return;
    setAnswers(prev => ({
      ...prev,
      [activeGap]: { word, key }
    }));
    
    // Auto advance
    const currentIdx = QUESTIONS.findIndex(q => q.id === activeGap);
    const nextQ = QUESTIONS[currentIdx + 1];
    if (nextQ) setActiveGap(nextQ.id);
    else setActiveGap(null);
  };

  const handleClearGap = (qId) => {
    if (isExamFinished) return;
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setActiveGap(qId);
  };

  const handleSubmit = () => {
    let correct = 0;
    QUESTIONS.forEach(q => {
      const ansWord = answers[q.id]?.word || '';
      if (ansWord.toLowerCase() === q.answer.toLowerCase()) {
        correct++;
      }
    });
    const s = correct * 5; // 7 questions * 5 = 35 XP
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid #ffea00' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 3: Prepositions & Phrasal Verbs</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Select a blank, then choose the appropriate preposition from the Word Box. (14 marks = 35 XP)</p>
        {isExamFinished && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score !== null ? score : (sectionScore !== null && sectionScore !== undefined ? sectionScore : QUESTIONS.filter(q => answers[q.id]?.word === q.answer).length * 5)} / 35 XP</span>
          </div>
        )}
      </div>

      {/* Word Box */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: 32, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: 11, color: '#ffea00', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>Word Box (Click a word to fill the selected blank)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {WORD_BOX.map(w => {
            const isUsed = usedKeys.has(w.key);
            return (
              <button
                key={w.key}
                disabled={isExamFinished || isUsed}
                onClick={() => handleSelectWord(w.word, w.key)}
                className="glass-card"
                style={{
                  padding: '8px 16px', fontSize: 13, color: isUsed ? 'var(--text-muted)' : 'white', borderRadius: 12,
                  background: isUsed ? 'rgba(255,255,255,0.02)' : 'rgba(255, 234, 0, 0.12)',
                  border: isUsed ? '1px solid transparent' : '1px solid rgba(255, 234, 0, 0.3)',
                  textDecoration: isUsed ? 'line-through' : 'none', opacity: isUsed ? 0.4 : 1,
                  cursor: (isExamFinished || isUsed) ? 'default' : 'pointer', transition: '0.2s'
                }}
              >
                {w.word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sentences List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {QUESTIONS.map((q, idx) => {
          const ans = answers[q.id];
          const isSelected = activeGap === q.id;
          const isCorrect = isExamFinished && ans?.word?.toLowerCase() === q.answer.toLowerCase();

          return (
            <div
              key={q.id}
              className="glass-card"
              style={{
                padding: '20px 24px',
                border: isExamFinished ? `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` : isSelected ? '1px solid #ffea00' : '1px solid var(--border-glass)',
                transition: '0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Sentence {idx + 1}</span>
                {ans && !isExamFinished && (
                  <button
                    onClick={() => handleClearGap(q.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Clear Choice
                  </button>
                )}
              </div>

              <p style={{ fontSize: 18, color: 'white', lineHeight: 1.6, direction: 'ltr' }}>
                {q.sentence.split('___')[0]}
                <button
                  disabled={isExamFinished}
                  onClick={() => setActiveGap(q.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 90, height: 32, margin: '0 8px', borderRadius: 8,
                    background: isCorrect ? 'rgba(0, 230, 118, 0.1)' : isExamFinished && !isCorrect ? 'rgba(255, 82, 82, 0.1)' : isSelected ? 'rgba(255, 234, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isCorrect ? 'var(--success)' : isExamFinished && !isCorrect ? 'var(--error)' : isSelected ? '#ffea00' : 'var(--border-glass)'}`,
                    color: isCorrect ? 'var(--success)' : isExamFinished && !isCorrect ? 'var(--error)' : ans ? 'white' : 'var(--text-muted)',
                    fontSize: 14, fontWeight: 800, cursor: isExamFinished ? 'default' : 'pointer',
                    verticalAlign: 'middle', transition: '0.2s', padding: '0 12px'
                  }}
                >
                  {ans?.word || (isSelected ? '...' : `#${idx + 1}`)}
                </button>
                {q.sentence.split('___')[1]}
              </p>

              {isExamFinished && !isCorrect && (
                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, background: 'rgba(0, 230, 118, 0.05)', border: '1px dashed var(--success)', fontSize: 14 }}>
                  <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Correct Particle:</span> <span style={{ color: 'white' }}>{q.answer}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isExamFinished && (
        <button className="premium-btn" style={{ width: '100%', marginTop: 40, padding: 20 }} onClick={handleSubmit}>
          Save Section 3 <span className="mi">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
