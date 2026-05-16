'use client';
import { useState, useEffect, useMemo } from 'react';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const getErrorSpan = (wrong, correct) => {
  const w = wrong.split(' ');
  const c = correct.split(' ');
  let start = 0;
  while (start < w.length && start < c.length && w[start] === c[start]) start++;
  let endW = w.length - 1;
  let endC = c.length - 1;
  while (endW >= start && endC >= start && w[endW] === c[endC]) { endW--; endC--; }
  if (endW < start) endW = start; // Handle missing words by pointing to the word before it or the end
  return { start, endW };
};

export default function MistakesExercise({ data, startIndex = 0, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [step, setStep] = useState(1); // 1 = find error word, 2 = choose correct option
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState([]);

  useEffect(() => {
    setCurrentIndex(startIndex);
    setStep(1);
    setSelectedWordIndex(null);
    setSelectedOpt(null);
    setWrongAttempts([]);
    setCompleted(false);
  }, [startIndex]);

  const mistakes = data; // Note: data is now the sliced array of mistakes for the current module
  const currentItem = mistakes[currentIndex];

  const errorSpan = useMemo(() => {
    if (!currentItem) return { start: 0, endW: 0 };
    return getErrorSpan(currentItem.wrong, currentItem.correct);
  }, [currentItem]);

  const options = useMemo(() => {
    if (!currentItem) return [];
    // We want 3 wrong options from OTHER mistakes
    const otherMistakes = mistakes.filter(x => x.id !== currentItem.id);
    const wrongOptions = shuffleArray(otherMistakes).slice(0, 3).map(x => x.correct);
    return shuffleArray([currentItem.correct, ...wrongOptions]);
  }, [currentIndex, currentItem, mistakes]);

  const handleWordClick = (index) => {
    if (step !== 1) return;
    if (index >= errorSpan.start && index <= errorSpan.endW) {
      setSelectedWordIndex(index);
      setTimeout(() => setStep(2), 600);
    } else {
      if (!wrongAttempts.includes(index)) {
        setWrongAttempts([...wrongAttempts, index]);
      }
    }
  };

  const handleSelect = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    if (opt === currentItem.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStep(1);
      setSelectedWordIndex(null);
      setSelectedOpt(null);
      setWrongAttempts([]);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }} className="animate-slide-up">
        <div style={{ 
          width: 80, height: 80, borderRadius: '50%', background: 'var(--grad-primary)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          boxShadow: '0 0 30px var(--primary-glow)'
        }}>
          <span className="mi" style={{ fontSize: 40, color: 'white' }}>celebration</span>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Module Complete!</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>Great job mastering these errors.</p>
        
        <div className="glass-card" style={{ padding: '30px', maxWidth: 300, margin: '0 auto 32px' }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{score}/{mistakes.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>Correct Answers</div>
        </div>

        <button className="premium-btn" style={{ margin: '0 auto' }} onClick={onComplete}>
          <span className="mi">list</span> Back to Modules
        </button>
      </div>
    );
  }

  if (!currentItem) return null;

  const words = currentItem.wrong.split(' ');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Question</span>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{currentIndex + 1} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 16 }}>/ {mistakes.length}</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Accuracy</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--secondary)' }}>{Math.round((score / (currentIndex || 1)) * 100) || 0}%</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px', marginBottom: 24, minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4 }} />
        <h3 style={{ fontSize: 14, color: step === 1 ? 'var(--error)' : 'var(--success)', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mi" style={{ fontSize: 18 }}>{step === 1 ? 'bug_report' : 'check_circle'}</span> 
          {step === 1 ? 'STEP 1: FIND THE ERROR WORD' : 'STEP 2: FIX THE ERROR'}
        </h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 6px', direction: 'ltr' }}>
          {words.map((word, i) => {
            const isError = i >= errorSpan.start && i <= errorSpan.endW;
            const isSelected = selectedWordIndex === i;
            const isWrongAttempt = wrongAttempts.includes(i);
            
            let bg = 'transparent';
            let color = 'white';
            let border = '1px solid transparent';
            
            if (step === 2 && isError) {
              bg = 'rgba(255, 82, 82, 0.2)';
              color = 'var(--error)';
              border = '1px dashed var(--error)';
            } else if (isSelected) {
              bg = 'var(--success)';
              color = 'black';
            } else if (isWrongAttempt) {
              bg = 'rgba(255, 82, 82, 0.2)';
              color = 'var(--error)';
            }

            return (
              <button
                key={i}
                onClick={() => handleWordClick(i)}
                disabled={step !== 1}
                style={{
                  background: bg,
                  color: color,
                  border: border,
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 22,
                  fontWeight: 600,
                  cursor: step === 1 ? 'pointer' : 'default',
                  transition: '0.2s',
                  lineHeight: 1.4
                }}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      {step === 2 && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <h4 style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Select the correct sentence:</h4>
          {options.map((opt, i) => {
            const isSelected = selectedOpt === opt;
            const isCorrect = selectedOpt && opt === currentItem.correct;
            const isWrong = selectedOpt && isSelected && opt !== currentItem.correct;
            
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: 14, textAlign: 'left',
                  background: isCorrect ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isSelected ? 'rgba(124, 77, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--primary)' : 'var(--border-glass)'}`,
                  color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'white',
                  transition: 'all 0.2s', cursor: selectedOpt ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12, direction: 'ltr'
                }}
              >
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', border: '2px solid currentColor',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {isSelected && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'currentColor' }} />}
                </div>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {selectedOpt && (
        <div className="animate-slide-up">
          <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mi" style={{ fontSize: 18, color: 'var(--text-dim)' }}>menu_book</span>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-dim)' }}>
              <strong style={{ color: 'white' }}>Rule:</strong> {currentItem.topic}
            </div>
          </div>

          <button className="premium-btn" style={{ width: '100%', padding: '20px' }} onClick={handleNext}>
            Next Question <span className="mi">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
