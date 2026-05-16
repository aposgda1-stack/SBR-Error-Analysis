'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

// Work sheet word box questions based on sections.json work_vocabulary
const WORK_QUESTIONS = [
  { id:'w1', sentence:'A computer company had a (1) ___ for the position of salesman.', answer:'vacancy' },
  { id:'w2', sentence:'A lot of (2) ___ with good qualifications applied for the job.', answer:'applicants' },
  { id:'w3', sentence:'The directors made a (3) ___ of the best candidates.', answer:'shortlist' },
  { id:'w4', sentence:'He would receive an annual (4) ___ of £25,000.', answer:'salary' },
  { id:'w5', sentence:'He also received a 15% (5) ___ for each computer he sold.', answer:'commission' },
  { id:'w6', sentence:'Excellent (6) ___ included private health insurance and a company car.', answer:'perks' },
  { id:'w7', sentence:'He could be (7) ___ from salesman to sales manager.', answer:'promoted' },
  { id:'w8', sentence:'Writing the budget is hard (8) ___. I wish I didn\'t have to do it!', answer:'work' },
  { id:'w9', sentence:'I\'m the company manager. It is my (9) ___ to solve problems.', answer:'job' },
  { id:'w10', sentence:'She was (10) ___ from her job because of poor performance.', answer:'dismissed' },
];

const WORD_BOX = ['vacancy','applicants','shortlist','salary','commission','perks','promoted','work','job','dismissed','resigned','qualifications','pension','candidates','manager'];

function buildWordBox(questions) {
  const answers = questions.map(q => q.answer);
  const extra = WORD_BOX.filter(w => !answers.includes(w)).sort(() => Math.random() - 0.5).slice(0, 5);
  return [...answers, ...extra].sort(() => Math.random() - 0.5);
}

export default function Q3WorkSheet({ onScore }) {
  const questions = useMemo(() => WORK_QUESTIONS, []);
  const wordBox = useMemo(() => buildWordBox(questions), [questions]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => { if ((answers[q.id]||'').toLowerCase() === q.answer.toLowerCase()) correct++; });
    const s = correct * 2;
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div dir="ltr">
      <div style={{ background:'var(--surface-container)', borderRadius:16, padding:'20px', marginBottom:20, border:'1px solid var(--outline-variant)', direction:'rtl' }}>
        <h2 style={{ fontSize:18, fontWeight:800, color:'var(--primary)', marginBottom:8 }}>Question 3: Work Sheet – Word Box</h2>
        <p style={{ fontSize:13, color:'var(--on-surface-variant)' }}>اختر الكلمة المناسبة من الـ Word Box لإكمال كل فراغ.</p>
        {submitted && <div style={{ marginTop:12, fontSize:22, fontWeight:900, color:'var(--primary)', fontFamily:'JetBrains Mono' }}>Score: {score} / 20</div>}
      </div>

      {/* Word Box */}
      <div style={{ background:'var(--surface-container-high)', borderRadius:16, padding:'16px', marginBottom:24, border:'1px solid #a78bfa', direction:'rtl' }}>
        <div style={{ fontSize:12, color:'#a78bfa', fontFamily:'JetBrains Mono', marginBottom:12, textTransform:'uppercase' }}>📦 Word Box</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {wordBox.map((w, i) => {
            const used = Object.values(answers).includes(w);
            return (
              <span key={i} style={{
                background: used?'var(--surface-container-highest)':'rgba(167,139,250,0.2)',
                color: used?'var(--on-surface-variant)':'#a78bfa',
                padding:'6px 14px', borderRadius:20, fontFamily:'JetBrains Mono', fontSize:13, fontWeight:600,
                textDecoration: used?'line-through':'none', direction:'ltr', opacity: used?0.4:1,
              }}>{w}</span>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, idx) => {
        const isCorrect = submitted && answers[q.id]?.toLowerCase() === q.answer.toLowerCase();
        return (
          <div key={q.id} style={{ background:submitted?(isCorrect?'rgba(27,47,33,0.5)':'rgba(60,0,0,0.4)'):'var(--surface-container)', border:`1px solid ${submitted?(isCorrect?'#2e5238':'#5c0000'):'var(--outline-variant)'}`, borderRadius:16, padding:'18px', marginBottom:14 }}>
            <p style={{ fontSize:16, fontWeight:500, color:'var(--on-surface)', marginBottom:12, lineHeight:1.7, direction:'ltr' }}>
              {q.sentence.split('___')[0]}
              <select
                disabled={submitted}
                value={answers[q.id] || ''}
                onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                style={{ display:'inline-block', background:'var(--surface-container-high)', border:`1px solid ${answers[q.id]?'var(--primary)':'var(--outline-variant)'}`, borderRadius:8, padding:'4px 8px', color:'var(--on-surface)', fontFamily:'JetBrains Mono', fontSize:14, margin:'0 4px', minWidth:120, cursor:submitted?'default':'pointer' }}
              >
                <option value="">— choose —</option>
                {wordBox.map((w, i) => <option key={i} value={w}>{w}</option>)}
              </select>
              {q.sentence.split('___')[1]}
            </p>
            {submitted && (
              <div style={{ fontSize:13, color:isCorrect?'#88e2a5':'var(--error)', direction:'rtl' }}>
                {isCorrect ? `✓ Correct: ${q.answer}` : `✗ Answer: ${q.answer} — You chose: ${answers[q.id]||'nothing'}`}
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={handleSubmit} style={{ width:'100%', background:'rgba(167,139,250,0.2)', color:'#a78bfa', border:'1px solid rgba(167,139,250,0.4)', borderRadius:16, padding:18, fontWeight:900, fontSize:17, cursor:'pointer', marginTop:8 }}>
          Submit Q3 ({Object.keys(answers).length}/{questions.length} answered)
        </button>
      )}
    </div>
  );
}
