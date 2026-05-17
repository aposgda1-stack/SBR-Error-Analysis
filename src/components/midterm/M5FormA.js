'use client';
import { useState } from 'react';

const QUESTIONS = [
  {
    id: 'm5_1',
    topic: 'confusing words',
    wrong: 'He acts as a child.',
    correct: 'He acts like a child.',
    correctWord: 'like',
    errorWordIdx: 2,
    options: ['like', 'as', 'about', 'for']
  },
  {
    id: 'm5_2',
    topic: 'job vs work',
    wrong: 'He did all the jobs alone and was exhausted.',
    correct: 'He did all the work alone and was exhausted.',
    correctWord: 'work',
    errorWordIdx: 4,
    options: ['work', 'jobs', 'careers', 'tasks']
  },
  {
    id: 'm5_3',
    topic: 'flour vs flower',
    wrong: 'Baking bread requires flower, water, and yeast.',
    correct: 'Baking bread requires flour, water, and yeast.',
    correctWord: 'flour,',
    errorWordIdx: 3,
    options: ['flour,', 'flower,', 'powder,', 'meal,']
  },
  {
    id: 'm5_4',
    topic: 'already vs still',
    wrong: 'He still has arrived, but it\'s only 8 AM.',
    correct: 'He has already arrived, but it\'s only 8 AM.',
    correctWord: 'already',
    errorWordIdx: 1,
    options: ['already', 'still', 'yet', 'ever']
  },
  {
    id: 'm5_5',
    topic: 'mustn\'t vs can\'t',
    wrong: 'You mustn\'t be serious — that\'s impossible!',
    correct: 'You can\'t be serious — that\'s impossible!',
    correctWord: 'can\'t',
    errorWordIdx: 1,
    options: ['can\'t', 'mustn\'t', 'shouldn\'t', 'may not']
  },
  {
    id: 'm5_6',
    topic: 'so vs so that',
    wrong: 'Keep your password safe so hackers can\'t steal it.',
    correct: 'Keep your password safe so that hackers can\'t steal it.',
    correctWord: 'so that',
    errorWordIdx: 4,
    options: ['so that', 'so', 'because', 'lest']
  },
  {
    id: 'm5_7',
    topic: 'while vs during',
    wrong: 'During I was cooking, the phone rang.',
    correct: 'While I was cooking, the phone rang.',
    correctWord: 'While',
    errorWordIdx: 0,
    options: ['While', 'During', 'For', 'Since']
  },
  {
    id: 'm5_8',
    topic: 'who vs whose',
    wrong: 'Do you know who backpack was left in the classroom?',
    correct: 'Do you know whose backpack was left in the classroom?',
    correctWord: 'whose',
    errorWordIdx: 3,
    options: ['whose', 'who', 'whom', 'who\'s']
  },
  {
    id: 'm5_9',
    topic: 'can\'t vs mustn\'t',
    wrong: 'You can\'t smoke here — it\'s strictly prohibited by law.',
    correct: 'You mustn\'t smoke here — it\'s strictly prohibited by law.',
    correctWord: 'mustn\'t',
    errorWordIdx: 1,
    options: ['mustn\'t', 'can\'t', 'don\'t have to', 'needn\'t']
  },
  {
    id: 'm5_10',
    topic: 'diary vs dairy',
    wrong: 'She bought fresh dairy from the farm to record her thoughts.',
    correct: 'She bought fresh diary from the farm to record her thoughts.',
    correctWord: 'diary',
    errorWordIdx: 3,
    options: ['diary', 'dairy', 'daily', 'paper']
  },
  {
    id: 'm5_11',
    topic: 'countryside vs country',
    wrong: 'Let\'s go hiking and enjoy the countryside wildlife.',
    correct: 'Let\'s go hiking and enjoy the country wildlife.',
    correctWord: 'country',
    errorWordIdx: 6,
    options: ['country', 'countryside', 'nature', 'forest']
  },
  {
    id: 'm5_12',
    topic: 'driver vs chauffeur',
    wrong: 'The famous actor hired a private driver to drive his limousine.',
    correct: 'The famous actor hired a private chauffeur to drive his limousine.',
    correctWord: 'chauffeur',
    errorWordIdx: 6,
    options: ['chauffeur', 'driver', 'captain', 'pilot']
  },
  {
    id: 'm5_13',
    topic: 'sensible vs sensitive',
    wrong: 'This medicine is highly sensible to light.',
    correct: 'This medicine is highly sensitive to light.',
    correctWord: 'sensitive',
    errorWordIdx: 4,
    options: ['sensitive', 'sensible', 'sensational', 'sensory']
  },
  {
    id: 'm5_14',
    topic: 'official vs officer',
    wrong: 'The police official gave a press conference.',
    correct: 'The police officer gave a press conference.',
    correctWord: 'officer',
    errorWordIdx: 2,
    options: ['officer', 'official', 'agent', 'deputy']
  },
  {
    id: 'm5_15',
    topic: 'wage vs salary',
    wrong: 'Her wage is $60,000 per year.',
    correct: 'Her salary is $60,000 per year.',
    correctWord: 'salary',
    errorWordIdx: 1,
    options: ['salary', 'wage', 'payment', 'income']
  }
];

export default function M5FormA({ onScore, reviewMode, sectionScore }) {
  const [answers, setAnswers] = useState({}); // { qId: { tappedWordIdx, selectedCorrectWord } }
  const [activeStep, setActiveStep] = useState({}); // { qId: 1 | 2 }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const isExamFinished = submitted || reviewMode;

  const handleWordTap = (qId, idx, expectedIdx) => {
    if (isExamFinished) return;
    if (idx === expectedIdx) {
      setAnswers(prev => ({
        ...prev,
        [qId]: { ...prev[qId], tappedWordIdx: idx }
      }));
      setActiveStep(prev => ({ ...prev, [qId]: 2 }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [qId]: { ...prev[qId], wrongTapIdx: idx }
      }));
    }
  };

  const handleSelectCorrect = (qId, option) => {
    if (isExamFinished) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], selectedCorrectWord: option }
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    QUESTIONS.forEach(q => {
      const ans = answers[q.id];
      if (ans && ans.tappedWordIdx === q.errorWordIdx && ans.selectedCorrectWord === q.correctWord) {
        correctCount++;
      }
    });
    // BUG 6 FIX: Math.round prevents non-integer score (e.g. 37.5)
    const s = Math.round(correctCount * 2.5); // 15 questions * 2.5 = max 37.5 → 38
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 5: Common Errors Form A</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Tap the incorrect word in each sentence, then choose the correct replacement. (15 marks = 37.5 XP)</p>
        {isExamFinished && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            {/* BUG 19 FIX: Use sectionScore from parent when in review mode */}
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score !== null ? score : (sectionScore !== null && sectionScore !== undefined ? sectionScore : Math.round(QUESTIONS.filter(q => answers[q.id]?.tappedWordIdx === q.errorWordIdx && answers[q.id]?.selectedCorrectWord === q.correctWord).length * 2.5))} / 38 XP</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {QUESTIONS.map((q, idx) => {
          const ans = answers[q.id] || {};
          const step = activeStep[q.id] || 1;
          const words = q.wrong.split(' ');
          const isCorrect = isExamFinished && ans.tappedWordIdx === q.errorWordIdx && ans.selectedCorrectWord === q.correctWord;

          return (
            <div key={q.id} className="glass-card" style={{ padding: '24px', border: isExamFinished ? `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` : '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Question {idx + 1}</span>
                <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>{q.topic}</span>
              </div>

              {!isExamFinished && (
                <div style={{ fontSize: 12, color: step === 1 ? 'var(--error)' : 'var(--success)', fontWeight: 800, marginBottom: 12 }}>
                  {step === 1 ? '👉 STEP 1: TAP THE INCORRECT WORD' : '👉 STEP 2: CHOOSE THE CORRECT WORD'}
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', direction: 'ltr', marginBottom: 20 }}>
                {words.map((word, wIdx) => {
                  const isTapped = ans.tappedWordIdx === wIdx;
                  const isWrongTap = ans.wrongTapIdx === wIdx;
                  let bg = 'transparent';
                  let color = 'white';
                  let border = '1px solid transparent';
                  let textDecoration = 'none';

                  if (isTapped) {
                    bg = 'rgba(0, 230, 118, 0.15)';
                    color = 'var(--success)';
                    border = '1px dashed var(--success)';
                  } else if (isWrongTap) {
                    bg = 'rgba(255, 82, 82, 0.1)';
                    color = 'var(--error)';
                  }

                  if (isExamFinished && wIdx === q.errorWordIdx) {
                    bg = 'rgba(255, 82, 82, 0.15)';
                    color = 'var(--error)';
                    border = '1px dashed var(--error)';
                    textDecoration = 'line-through';
                  }

                  return (
                    <button
                      key={wIdx}
                      disabled={isExamFinished || step === 2}
                      onClick={() => handleWordTap(q.id, wIdx, q.errorWordIdx)}
                      style={{
                        background: bg, color, border, textDecoration,
                        padding: '4px 8px', borderRadius: 8, fontSize: 18, fontWeight: 600,
                        cursor: (isExamFinished || step === 2) ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {(step === 2 || isExamFinished) && (
                <div className="animate-slide-up" style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8, textTransform: 'uppercase' }}>Select Correct Replacement:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = ans.selectedCorrectWord === opt;
                      const isOptCorrect = opt === q.correctWord;

                      let btnBg = 'rgba(255,255,255,0.03)';
                      let btnBorder = '1px solid var(--border-glass)';
                      let btnColor = 'white';

                      if (isSelected) {
                        btnBg = 'rgba(124, 77, 255, 0.15)';
                        btnBorder = '1px solid var(--primary)';
                        btnColor = 'var(--primary)';
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
                          key={oIdx}
                          disabled={isExamFinished}
                          onClick={() => handleSelectCorrect(q.id, opt)}
                          style={{
                            padding: '12px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                            background: btnBg, border: btnBorder, color: btnColor,
                            cursor: isExamFinished ? 'default' : 'pointer',
                            transition: 'all 0.2s', textAlign: 'center'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isExamFinished && !isCorrect && (
                <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8, background: 'rgba(0, 230, 118, 0.05)', border: '1px dashed var(--success)', fontSize: 14 }}>
                  <div style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Correct Correction:</div>
                  <div style={{ color: 'white', marginTop: 4 }}>
                    Error: <span style={{ color: 'var(--error)', textDecoration: 'line-through' }}>{words[q.errorWordIdx]}</span> → Correct: <span style={{ color: 'var(--success)', fontWeight: 800 }}>{q.correctWord}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Full: "{q.correct}"</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isExamFinished && (
        <button className="premium-btn" style={{ width: '100%', marginTop: 40, padding: 20 }} onClick={handleSubmit}>
          Save Section 5 <span className="mi">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
