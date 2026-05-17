'use client';
import { useState, useMemo } from 'react';

const STORY_PARTS = [
  { part: 'A retail store had a ', gapKey: '1', answer: 'vacancy' },
  { part: ' for the position of ', gapKey: '2', answer: 'assistant manager' },
  { part: ', and decided to advertise for a new ', gapKey: '3', answer: 'employee' },
  { part: '. Many ', gapKey: '4', answer: 'applicants' },
  { part: ' with impressive ', gapKey: '5', answer: 'qualifications' },
  { part: ' and ', gapKey: '6', answer: 'skills' },
  { part: ' applied for the job, and after all the interviews had finished, the managers made a ', gapKey: '7', answer: 'shortlist' },
  { part: ' of the best ', gapKey: '8', answer: 'candidates' },
  { part: ', then invited them to come back for another interview.\n\nThe person who eventually got the job was excited. After all, he would receive an annual ', gapKey: '9', answer: 'salary' },
  { part: ' of £30,000, with a 5% ', gapKey: '10', answer: 'increment' },
  { part: ' every year, a 10% ', gapKey: '11', answer: 'bonus' },
  { part: ' for each item he sold, excellent ', gapKey: '12', answer: 'benefits' },
  { part: ' such as employee discounts and a company car, a company ', gapKey: '13', answer: 'pension' },
  { part: ' to ensure he would be secure when he retired, and the chance of ', gapKey: '14', answer: 'promotion' },
  { part: ' from employee to store ', gapKey: '15', answer: 'manager' },
  { part: ' if he performed well. All in all, his future ', gapKey: '16', answer: 'prospects' },
  { part: ' looked very promising.' }
];

const CORRECT_ANSWERS = {
  '1': 'vacancy',
  '2': 'assistant manager',
  '3': 'employee',
  '4': 'applicants',
  '5': 'qualifications',
  '6': 'skills',
  '7': 'shortlist',
  '8': 'candidates',
  '9': 'salary',
  '10': 'increment',
  '11': 'bonus',
  '12': 'benefits',
  '13': 'pension',
  '14': 'promotion',
  '15': 'manager',
  '16': 'prospects'
};

const WORD_BANK_BASE = [
  { word: 'promotion', id: 'm2_promo' },
  { word: 'applicants', id: 'm2_appl' },
  { word: 'qualifications', id: 'm2_qual' },
  { word: 'bonus', id: 'm2_bonus' },
  { word: 'salary', id: 'm2_salary' },
  { word: 'interview', id: 'm2_interv' },
  { word: 'increment', id: 'm2_inc' },
  { word: 'skills', id: 'm2_skills' },
  { word: 'shortlist', id: 'm2_short' },
  { word: 'pension', id: 'm2_pension' },
  { word: 'employee', id: 'm2_empl' },
  { word: 'manager', id: 'm2_mgr' },
  { word: 'colleague', id: 'm2_colleague' },
  { word: 'contract', id: 'm2_contract' },
  { word: 'prospects', id: 'm2_prosp' },
  { word: 'candidates', id: 'm2_cand' },
  { word: 'assistant manager', id: 'm2_assmgr' },
  { word: 'vacancy', id: 'm2_vac' },
  { word: 'benefits', id: 'm2_ben' },
  { word: 'references', id: 'm2_ref' }
];

export default function M2RetailVocab({ onScore, reviewMode, sectionScore }) {
  const [answers, setAnswers] = useState({}); // { gapKey: { word, id } }
  const [activeGap, setActiveGap] = useState(null); // gapKey
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // BUG 5 FIX: Shuffle inside useMemo
  const WORD_BANK = useMemo(() => [...WORD_BANK_BASE].sort(() => Math.random() - 0.5), []);

  const isExamFinished = submitted || reviewMode;
  const gaps = Object.keys(CORRECT_ANSWERS);

  const usedIds = useMemo(() => {
    return new Set(Object.values(answers).map(a => a?.id).filter(Boolean));
  }, [answers]);

  const handleWordSelect = (word, id) => {
    if (isExamFinished || !activeGap) return;
    setAnswers(prev => ({
      ...prev,
      [activeGap]: { word, id }
    }));
    
    // Auto-advance to the next gap
    const currentIdx = gaps.indexOf(activeGap);
    const nextGap = gaps[currentIdx + 1];
    if (nextGap) setActiveGap(nextGap);
    else setActiveGap(null);
  };

  const handleClearGap = (gapKey) => {
    if (isExamFinished) return;
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[gapKey];
      return copy;
    });
    setActiveGap(gapKey);
  };

  const handleSubmit = () => {
    let correct = 0;
    gaps.forEach(key => {
      const ansWord = answers[key]?.word || '';
      if (ansWord.toLowerCase().trim() === CORRECT_ANSWERS[key].toLowerCase().trim()) {
        correct++;
      }
    });
    const s = Math.round(correct * 2.5); // 16 questions * 2.5 = 40 XP
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid var(--accent)' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 2: Retail Vocabulary</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Fill the blanks in the retail store story. Click a blank, then select the appropriate word from the Word Box. (16 marks = 40 XP)</p>
        {isExamFinished && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            {/* BUG 19 FIX: Use sectionScore from parent when in review mode */}
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score !== null ? score : (sectionScore !== null && sectionScore !== undefined ? sectionScore : Math.round(gaps.filter(key => answers[key]?.word === CORRECT_ANSWERS[key]).length * 2.5))} / 40 XP</span>
          </div>
        )}
      </div>

      {/* Word Box */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: 32, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>Word Box (Click a word to fill the selected blank)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {WORD_BANK.map(w => {
            const isUsed = usedIds.has(w.id);
            return (
              <button
                key={w.id}
                disabled={isExamFinished || isUsed}
                onClick={() => handleWordSelect(w.word, w.id)}
                className="glass-card"
                style={{
                  padding: '8px 16px', fontSize: 13, color: isUsed ? 'var(--text-muted)' : 'white', borderRadius: 12,
                  background: isUsed ? 'rgba(255,255,255,0.02)' : 'rgba(255, 64, 129, 0.12)',
                  border: isUsed ? '1px solid transparent' : '1px solid rgba(255, 64, 129, 0.3)',
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

      {/* Interactive Story Panel */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: 40, lineHeight: '2.5', fontSize: 17, color: 'white', direction: 'ltr', whiteSpace: 'pre-wrap' }}>
        {STORY_PARTS.map((partItem, idx) => {
          const gapKey = partItem.gapKey;
          const answer = answers[gapKey];
          const isSelected = activeGap === gapKey;
          const isCorrect = isExamFinished && answer?.word?.toLowerCase().trim() === CORRECT_ANSWERS[gapKey]?.toLowerCase().trim();

          return (
            <span key={idx}>
              {partItem.part}
              {gapKey && (
                <button
                  disabled={isExamFinished}
                  onClick={() => {
                    if (answer) handleClearGap(gapKey);
                    else setActiveGap(gapKey);
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 100, height: 32, margin: '0 4px', borderRadius: 8,
                    background: isCorrect ? 'rgba(0, 230, 118, 0.1)' : isExamFinished && !isCorrect ? 'rgba(255, 82, 82, 0.1)' : isSelected ? 'rgba(255, 64, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isCorrect ? 'var(--success)' : isExamFinished && !isCorrect ? 'var(--error)' : isSelected ? 'var(--accent)' : 'var(--border-glass)'}`,
                    color: isCorrect ? 'var(--success)' : isExamFinished && !isCorrect ? 'var(--error)' : answer ? 'white' : 'rgba(255,255,255,0.3)',
                    fontSize: 14, fontWeight: 800, cursor: isExamFinished ? 'default' : 'pointer',
                    verticalAlign: 'middle', transition: '0.2s', padding: '0 12px'
                  }}
                >
                  {answer?.word || (isSelected ? '...' : `#${gapKey}`)}
                </button>
              )}
            </span>
          );
        })}
      </div>

      {isExamFinished && (
        <div className="animate-slide-up" style={{ marginTop: -20, marginBottom: 40, padding: '24px', borderRadius: 20, background: 'rgba(0, 230, 118, 0.05)', border: '1px dashed var(--success)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--success)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Correction Key</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {gaps.map(g => (
              <div key={g} style={{ fontSize: 13, color: 'white' }}>
                <span style={{ color: 'var(--text-muted)' }}>({g})</span> {CORRECT_ANSWERS[g]}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isExamFinished && (
        <button className="premium-btn" style={{ width: '100%', padding: 20 }} onClick={handleSubmit}>
          Save Section 2 <span className="mi">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
