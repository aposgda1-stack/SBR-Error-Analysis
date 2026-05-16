'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

const ALL = sectionsData.identify_error_data.the_130_mistakes;

function findDiff(wrong, correct) {
  const wWords = wrong.split(' ');
  const cWords = correct.split(' ');
  for (let i = 0; i < Math.max(wWords.length, cWords.length); i++) {
    const w = (wWords[i] || '').replace(/[.,!?'"]/g, '');
    const c = (cWords[i] || '').replace(/[.,!?'"]/g, '');
    if (w.toLowerCase() !== c.toLowerCase() && w && c) return { wrongWord: wWords[i], correctWord: cWords[i] };
  }
  return { wrongWord: wWords[wWords.length - 1], correctWord: cWords[cWords.length - 1] };
}

function buildOptions(correctWord, allItems, currentId) {
  const pool = allItems
    .filter(m => m.id !== currentId)
    .map(m => findDiff(m.wrong, m.correct).correctWord)
    .filter(w => w && w.toLowerCase() !== correctWord.toLowerCase() && w.length < 12)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  return [correctWord, ...pool].sort(() => Math.random() - 0.5);
}

export default function Q1ErrorHunter({ onScore }) {
  const questions = useMemo(() => ALL.sort(() => Math.random() - 0.5).slice(0, 20), []);
  const [answers, setAnswers] = useState({}); // { id: { clicked: bool, chosen: string } }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Pre-compute all options and diffs BEFORE render (fixes React Hooks violation)
  const questionData = useMemo(() => {
    return questions.map(q => {
      const { wrongWord, correctWord } = findDiff(q.wrong, q.correct);
      const opts = buildOptions(correctWord, ALL, q.id);
      return { ...q, wrongWord, correctWord, opts };
    });
  }, [questions]);

  const handleSubmit = () => {
    let correct = 0;
    questionData.forEach(q => {
      const ans = answers[q.id];
      if (ans?.chosen?.toLowerCase().replace(/[.,!?]/g,'') === q.correctWord.toLowerCase().replace(/[.,!?]/g,'')) correct++;
    });
    const s = correct * 2; // 20 questions × 2 marks = 40
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div dir="ltr">
      <div style={{ background:'var(--surface-container)', borderRadius:16, padding:'20px', marginBottom:20, border:'1px solid var(--outline-variant)', direction:'rtl' }}>
        <h2 style={{ fontSize:18, fontWeight:800, color:'var(--primary)', marginBottom:8 }}>Question 1: Identify the Error and Correct It</h2>
        <p style={{ fontSize:13, color:'var(--on-surface-variant)' }}>اضغط على الكلمة الخاطئة في كل جملة، ثم اختر التصحيح الصحيح. (20 جملة × 2 = 40 درجة)</p>
        {submitted && <div style={{ marginTop:12, fontSize:22, fontWeight:900, color:'var(--primary)', fontFamily:'JetBrains Mono' }}>Score: {score} / 40</div>}
      </div>

      {questionData.map((q, idx) => {
        const { wrongWord, correctWord, opts } = q;
        const ans = answers[q.id];
        const isCorrect = submitted && ans?.chosen?.toLowerCase().replace(/[.,!?]/g,'') === correctWord.toLowerCase().replace(/[.,!?]/g,'');

        return (
          <div key={q.id} style={{
            background: submitted ? (isCorrect ? 'rgba(27,47,33,0.5)' : 'rgba(60,0,0,0.4)') : 'var(--surface-container)',
            border: `1px solid ${submitted ? (isCorrect ? '#2e5238' : '#5c0000') : 'var(--outline-variant)'}`,
            borderRadius:16, padding:'20px', marginBottom:16
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, direction:'rtl' }}>
              <span style={{ background:'var(--surface-container-highest)', color:'var(--primary)', fontFamily:'JetBrains Mono', fontSize:11, padding:'2px 8px', borderRadius:6 }}>#{idx+1}</span>
              <span style={{ fontSize:11, color:'var(--on-surface-variant)', textTransform:'uppercase' }}>{q.topic}</span>
            </div>

            {/* Sentence with clickable wrong word */}
            <p style={{ fontSize:17, fontWeight:600, color:'var(--on-surface)', lineHeight:2, marginBottom:16, wordBreak:'break-word' }}>
              {q.wrong.split(' ').map((word, wi) => {
                const clean = word.replace(/[.,!?'"]/g, '');
                const isWrong = clean.toLowerCase() === (wrongWord||'').replace(/[.,!?'"]/g,'').toLowerCase();
                if (isWrong) return (
                  <span key={wi}>
                    <button onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: { ...a[q.id], clicked: true } }))} style={{
                      display:'inline-block', padding:'2px 8px', margin:'0 2px',
                      background: ans?.clicked ? 'rgba(255,87,26,0.2)' : 'transparent',
                      border:'2px solid var(--primary)', color:'var(--primary)', borderRadius:6,
                      fontWeight:800, fontSize:'inherit', cursor:submitted?'default':'pointer',
                    }}>{word}</button>{' '}
                  </span>
                );
                return <span key={wi}>{word} </span>;
              })}
            </p>

            {/* Options - only show after clicking */}
            {(ans?.clicked || submitted) && (
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {opts.map(opt => {
                  let bg = 'var(--surface-container-high)';
                  let border = '1px solid var(--outline-variant)';
                  let color = 'var(--on-surface)';
                  if (submitted) {
                    if (opt.toLowerCase().replace(/[.,!?]/g,'') === correctWord.toLowerCase().replace(/[.,!?]/g,'')) { bg='rgba(27,47,33,0.9)'; border='1px solid #2e5238'; color='#88e2a5'; }
                    else if (opt === ans?.chosen) { bg='rgba(60,0,0,0.7)'; border='1px solid #5c0000'; color='var(--error)'; }
                  } else if (ans?.chosen === opt) { bg='rgba(255,87,26,0.15)'; border='1px solid var(--primary)'; }
                  return (
                    <button key={opt} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: { ...a[q.id], clicked:true, chosen:opt } }))} style={{ background:bg, border, color, borderRadius:10, padding:'10px 18px', fontFamily:'JetBrains Mono', fontSize:14, fontWeight:600, cursor:submitted?'default':'pointer', transition:'all 0.15s' }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {submitted && (
              <div style={{ marginTop:12, fontSize:13, color: isCorrect ? '#88e2a5' : 'var(--error)', direction:'rtl' }}>
                Error: <strong>{wrongWord}</strong> → Correct: <strong>{correctWord}</strong>
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={handleSubmit} style={{ width:'100%', background:'var(--primary-container)', color:'var(--on-primary-container)', border:'none', borderRadius:16, padding:18, fontWeight:900, fontSize:17, cursor:'pointer', marginTop:8 }}>
          Submit Q1 ({Object.values(answers).filter(a => a?.chosen).length}/{questions.length} answered)
        </button>
      )}
    </div>
  );
}
