'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const getDiffWord = (wrong, correct) => {
  // Normalize by removing trailing punctuation and extra spaces
  const normalize = (s) => s.replace(/[.,!?]$/, '').trim().split(/\s+/);
  const w = normalize(wrong);
  const c = normalize(correct);
  
  let start = 0;
  while (start < w.length && start < c.length && w[start] === c[start]) start++;
  
  let endW = w.length - 1;
  let endC = c.length - 1;
  while (endW >= start && endC >= start && w[endW] === c[endC]) {
    endW--;
    endC--;
  }
  
  if (endC < start) endC = start;
  return c.slice(start, endC + 1).join(' ');
};

const generateDistractors = (correctWord, wrongWord) => {
  const c = correctWord.toLowerCase();
  const w = (wrongWord || '').toLowerCase();
  let pool = [];
  
  if (['in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'from', 'about', 'as', 'like', 'among', 'between'].includes(c)) {
    pool = ['in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'from', 'about', 'as', 'like', 'among', 'between'];
  } else if (['a', 'an', 'the', 'some', 'any', 'much', 'many', 'few', 'little'].includes(c)) {
    pool = ['a', 'an', 'the', 'some', 'any', 'much', 'many', 'few', 'little'];
  } else if (['is', 'are', 'was', 'were', 'has', 'have', 'had', 'do', 'does', 'did', 'make', 'makes', 'made', 'can', 'must', 'should'].includes(c)) {
    pool = ['is', 'are', 'was', 'were', 'has', 'have', 'had', 'do', 'does', 'did', 'make', 'makes', 'made', 'can', 'must', 'should'];
  } else if (['he', 'she', 'it', 'they', 'we', 'i', 'you', 'him', 'her', 'them', 'us', 'me'].includes(c)) {
    pool = ['he', 'she', 'it', 'they', 'we', 'I', 'you', 'him', 'her', 'them', 'us', 'me'];
  } else if (['very', 'too', 'enough', 'quite', 'rather', 'so', 'such', 'well', 'badly', 'good', 'bad', 'hard', 'hardly'].includes(c)) {
    pool = ['very', 'too', 'enough', 'quite', 'rather', 'so', 'such', 'well', 'badly', 'good', 'bad', 'hard', 'hardly'];
  } else {
    pool = ['different', 'similar', 'other', 'another'];
  }
  
  return shuffleArray(pool.filter(word => word.toLowerCase() !== c && word.toLowerCase() !== w)).slice(0, 3);
};

export default function Q1ErrorHunter({ onScore }) {
  const mistakes = sectionsData.identify_error_data.the_130_mistakes;
  
  const questions = useMemo(() => {
    return shuffleArray(mistakes).slice(0, 10).map((m, i) => {
      const correctOption = getDiffWord(m.wrong, m.correct);
      const wrongOptionWord = getDiffWord(m.correct, m.wrong);
      
      let wrongOptions = generateDistractors(correctOption, wrongOptionWord);
      
      if (wrongOptions.includes('different') || wrongOptions.length < 3) {
        const otherPhrases = mistakes
          .filter(x => x.id !== m.id)
          .map(x => getDiffWord(x.wrong, x.correct))
          .filter(x => x.toLowerCase() !== correctOption.toLowerCase() && x.toLowerCase() !== wrongOptionWord.toLowerCase());
        
        const mixed = shuffleArray([...wrongOptions.filter(x => x !== 'different' && x !== 'similar' && x !== 'other' && x !== 'another'), ...otherPhrases]);
        wrongOptions = Array.from(new Set(mixed)).slice(0, 3);
      }

      return {
        ...m,
        id: `q1_${i}`,
        correctOption,
        options: shuffleArray([correctOption, ...wrongOptions])
      };
    });
  }, [mistakes]);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correctOption) correct++; });
    const s = correct * 2.5;
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 1: Error Correction</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Identify the correct replacement word/phrase for the error in each sentence. (10 questions × 2.5 = 25 pts)</p>
        {submitted && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score} / 25</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>Points Earned</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {questions.map((q, idx) => (
          <div key={q.id} className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Question {idx + 1}</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 20, lineHeight: 1.5, direction: 'ltr' }}>
              &ldquo;{q.wrong}&rdquo;
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt;
                const isCorrect = submitted && opt === q.correctOption;
                const isWrong = submitted && isSelected && opt !== q.correctOption;
                
                return (
                  <button
                    key={i}
                    onClick={() => !submitted && setAnswers({ ...answers, [q.id]: opt })}
                    style={{
                      width: '100%', padding: '16px 20px', borderRadius: 14, textAlign: 'left',
                      background: isCorrect ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isSelected ? 'rgba(124, 77, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--primary)' : 'var(--border-glass)'}`,
                      color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'white',
                      transition: 'all 0.2s', cursor: submitted ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12, direction: 'ltr'
                    }}
                  >
                    <div style={{ 
                      width: 24, height: 24, borderRadius: '50%', border: '2px solid currentColor',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {isSelected && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'currentColor' }} />}
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <button className="premium-btn" style={{ width: '100%', marginTop: 40, padding: 20 }} onClick={handleSubmit}>
          Save & Next Section <span className="mi">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
