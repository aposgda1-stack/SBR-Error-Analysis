'use client';
import { useState } from 'react';

export default function MistakesExercise({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const mistakes = data.the_130_mistakes;
  const currentItem = mistakes[currentIndex];

  const handleNext = (correct) => {
    if (correct) setScore(score + 1);
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 28, color: 'var(--primary)', marginBottom: 16 }}>Great Job!</h2>
        <p style={{ margin: '20px 0', fontSize: '1.2rem', color: 'var(--on-surface)' }}>You've completed the Mistakes Module.</p>
        <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', borderRadius: 16, padding: '30px', display: 'inline-block' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{score} / {mistakes.length}</p>
          <p style={{ color: 'var(--on-surface-variant)', marginTop: 8 }}>Success Rate: {Math.round((score / mistakes.length) * 100)}%</p>
        </div>
        <br />
        <button
          style={{ marginTop: '30px', background: 'var(--primary-container)', color: 'var(--on-primary-container)', border: 'none', borderRadius: 12, padding: '14px 28px', fontFamily: 'Inter', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
          onClick={() => window.location.reload()}
        >Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span style={{ color: 'var(--primary)' }}>Question {currentIndex + 1} of {mistakes.length}</span>
        <span style={{ color: 'var(--tertiary)' }}>Score: {score}</span>
      </div>

      <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', borderRadius: 16, padding: '40px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '4px', 
          background: 'var(--surface-container-highest)'
        }}>
          <div style={{ 
            width: `${((currentIndex + 1) / mistakes.length) * 100}%`, 
            height: '100%', 
            background: 'var(--primary)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <h3 style={{ marginBottom: '20px', color: 'var(--on-surface-variant)' }}>Identify the Error:</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '30px', fontStyle: 'italic', color: 'var(--on-surface)', direction: 'ltr' }}>
          &ldquo;{currentItem.wrong}&rdquo;
        </p>

        {!showAnswer ? (
          <button 
            onClick={() => setShowAnswer(true)}
            style={{ width: '100%', background: 'var(--primary-container)', color: 'var(--on-primary-container)', border: 'none', borderRadius: 12, padding: '14px 28px', fontFamily: 'Inter', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
          >
            Reveal Correct Version &amp; Explanation
          </button>
        ) : (
          <div style={{ animation: 'slideUp 0.3s ease' }}>
            <div style={{ 
              padding: '20px', 
              background: 'rgba(27,47,33,0.8)', 
              border: '1px solid #2e5238',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#88e2a5', marginBottom: '10px' }}>Correct Answer:</h4>
              <p style={{ fontSize: '1.2rem', color: 'var(--on-surface)', direction: 'ltr' }}>{currentItem.correct}</p>
            </div>
            
            <p style={{ color: 'var(--on-surface-variant)', marginBottom: '30px' }}>
              <strong>Topic:</strong> {currentItem.topic}
            </p>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => handleNext(true)}
                style={{ flex: 1, background: '#2e5238', color: '#88e2a5', border: '1px solid #88e2a5', borderRadius: 12, padding: '15px', fontFamily: 'Inter', fontWeight: 700, cursor: 'pointer' }}
              >
                I got it right!
              </button>
              <button 
                onClick={() => handleNext(false)}
                style={{ flex: 1, background: 'var(--surface-container-high)', color: 'var(--on-surface)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: '15px', fontFamily: 'Inter', fontWeight: 700, cursor: 'pointer' }}
              >
                I missed it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
