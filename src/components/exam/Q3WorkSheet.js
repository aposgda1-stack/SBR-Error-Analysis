'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

export default function Q3WorkSheet({ onScore }) {
  const data = sectionsData.work_vocabulary.task_2_nouns;
  const correctAnswers = data.answers;
  const gaps = Object.keys(correctAnswers);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeGap, setActiveGap] = useState(null);
  const [score, setScore] = useState(null);

  const wordBox = useMemo(() => {
    return (data.box_words || []).map((w, i) => ({ word: w, id: `w3_${i}` }));
  }, [data.box_words]);

  const usedWordIds = useMemo(() => {
    return new Set(Object.values(answers).map(a => a.id).filter(Boolean));
  }, [answers]);

  const handleWordSelect = (wordObj) => {
    if (submitted || !activeGap) return;
    setAnswers(prev => ({ ...prev, [activeGap]: wordObj }));
    const nextIndex = gaps.indexOf(activeGap) + 1;
    if (nextIndex < gaps.length) setActiveGap(gaps[nextIndex]);
    else setActiveGap(null);
  };

  const processedText = useMemo(() => {
    let text = data.text;
    gaps.forEach(key => {
      text = text.replace(`(${key}) ${correctAnswers[key]}`, `(${key}) ___`);
    });
    return text;
  }, [data.text, correctAnswers, gaps]);

  const handleSubmit = () => {
    let correct = 0;
    gaps.forEach(key => {
      if (answers[key]?.word?.toLowerCase().trim() === correctAnswers[key].toLowerCase().trim()) correct++;
    });
    const s = Math.round((correct / gaps.length) * 25);
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid #ffea00' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 3: Work Vocabulary</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Select terms from the word box to fill the professional text. (25 pts total)</p>
        {submitted && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score} / 25</span>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: 32, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: 11, color: '#ffea00', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>Word Bank</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {wordBox.map(w => {
            const isUsed = usedWordIds.has(w.id);
            return (
              <button 
                key={w.id} 
                onClick={() => handleWordSelect(w)}
                disabled={submitted || isUsed}
                className="glass-card" 
                style={{ 
                  padding: '6px 14px', fontSize: 13, color: isUsed ? 'var(--text-muted)' : 'white', borderRadius: 12, 
                  background: isUsed ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 234, 0, 0.1)',
                  textDecoration: isUsed ? 'line-through' : 'none', opacity: isUsed ? 0.5 : 1,
                  cursor: (submitted || isUsed) ? 'default' : 'pointer', border: '1px solid transparent'
                }}
              >
                {w.word}
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px', marginBottom: 40, lineHeight: '2.5', fontSize: 17, color: 'white', direction: 'ltr' }}>
        {processedText.split('___').map((part, i, arr) => {
          const gapId = String(i + 1);
          const isLast = i === arr.length - 1;
          const answer = answers[gapId];
          const isActive = activeGap === gapId;
          const isRight = submitted && answer?.word?.toLowerCase().trim() === correctAnswers[gapId]?.toLowerCase().trim();
          const isWrong = submitted && answer && answer?.word?.toLowerCase().trim() !== correctAnswers[gapId]?.toLowerCase().trim();

          return (
            <span key={i}>
              {part}
              {!isLast && (
                <button
                  onClick={() => !submitted && setActiveGap(gapId)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 90, height: 32, margin: '0 4px', borderRadius: 8,
                    background: isRight ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isActive ? 'rgba(255, 234, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isRight ? 'var(--success)' : isWrong ? 'var(--error)' : isActive ? '#ffea00' : 'var(--border-glass)'}`,
                    color: isRight ? 'var(--success)' : isWrong ? 'var(--error)' : answer ? 'white' : 'rgba(255,255,255,0.3)',
                    fontSize: 14, fontWeight: 800, cursor: submitted ? 'default' : 'pointer',
                    verticalAlign: 'middle', transition: '0.2s'
                  }}
                >
                  {answer?.word || (isActive ? '...' : `#${gapId}`)}
                </button>
              )}
            </span>
          );
        })}
      </div>

      {!submitted && (
        <button className="premium-btn" style={{ width: '100%', padding: 20 }} onClick={handleSubmit}>
          Validate Section 3 <span className="mi">playlist_add_check</span>
        </button>
      )}
    </div>
  );
}
