'use client';
import { useState, useMemo } from 'react';
import sectionsData from '../../../data/sections.json';

// Combine all practice questions for MCQ coverage
const buildPool = () => {
  const pool = [];
  
  // Modal Verbs
  if (sectionsData.modal_verbs) {
    sectionsData.modal_verbs.forEach(q => pool.push({ ...q, type: 'Modal' }));
  }
  
  // Connectors
  if (sectionsData.grammar_guide?.and_but_or?.practice) {
    sectionsData.grammar_guide.and_but_or.practice.forEach(q => pool.push({ ...q, type: 'Connectors' }));
  }
  
  // Prepositions
  if (sectionsData.grammar_guide?.during_for_since?.practice) {
    sectionsData.grammar_guide.during_for_since.practice.forEach(q => pool.push({ ...q, type: 'Prepositions' }));
  }
  
  // Verb Patterns
  if (sectionsData.grammar_guide?.to_infinitive_vs_ing?.practice) {
    sectionsData.grammar_guide.to_infinitive_vs_ing.practice.forEach(q => pool.push({ ...q, type: 'Verb Pattern' }));
  }

  // Mistakes (converted to MCQ)
  if (sectionsData.identify_error_data?.the_130_mistakes) {
    sectionsData.identify_error_data.the_130_mistakes.slice(0, 50).forEach(m => {
      pool.push({
        sentence: m.correct.replace(m.topic.split(' & ')[0] || m.topic, '___'),
        answer: m.topic.split(' & ')[0] || m.topic,
        distractors: [m.topic.split(' & ')[1] || 'wrong'].filter(d => d !== 'wrong'),
        type: 'Vocabulary'
      });
    });
  }

  return pool;
};

const ALL_POOL = buildPool();

function getOptions(correct, pool) {
  const distractors = pool
    .map(p => p.answer)
    .filter(a => a !== correct && a && a.length < 20)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  return [correct, ...distractors].sort(() => Math.random() - 0.5);
}

export default function Q4MCQ({ onScore }) {
  const questions = useMemo(() => {
    return ALL_POOL.sort(() => Math.random() - 0.5).slice(0, 20);
  }, []);

  const optionsMap = useMemo(() => {
    const map = {};
    questions.forEach(q => {
      map[q.sentence] = getOptions(q.answer, ALL_POOL);
    });
    return map;
  }, [questions]);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.sentence] === q.answer) correct++;
    });
    const s = correct; // 20 questions * 1 mark = 20
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div dir="ltr">
      <div style={{ background: 'var(--surface-container)', borderRadius: 16, padding: '20px', marginBottom: 20, border: '1px solid var(--outline-variant)', direction: 'rtl' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>Question 4: Multiple Choice Questions (MCQ)</h2>
        <p style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>اختر الإجابة الصحيحة لكل جملة. (20 سؤال × 1 = 20 درجة)</p>
        {submitted && <div style={{ marginTop: 12, fontSize: 22, fontWeight: 900, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>Score: {score} / 20</div>}
      </div>

      {questions.map((q, idx) => {
        const opts = optionsMap[q.sentence];
        const isCorrect = submitted && answers[q.sentence] === q.answer;
        
        return (
          <div key={idx} style={{ 
            background: submitted ? (isCorrect ? 'rgba(27,47,33,0.5)' : 'rgba(60,0,0,0.4)') : 'var(--surface-container)', 
            border: `1px solid ${submitted ? (isCorrect ? '#2e5238' : '#5c0000') : 'var(--outline-variant)'}`, 
            borderRadius: 16, padding: '20px', marginBottom: 14 
          }}>
            <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontFamily: 'JetBrains Mono' }}>#{idx + 1} [{q.type}]</span>
            <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--on-surface)', margin: '10px 0', lineHeight: 1.8 }}>
              {q.sentence.includes('___') ? q.sentence : q.sentence + ' (Choose the correct word)'}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
              {opts.map((opt, oi) => {
                const letter = ['a', 'b', 'c', 'd'][oi];
                const isSelected = answers[q.sentence] === opt;
                const isActualCorrect = opt === q.answer;
                
                let btnBg = 'var(--surface-container-high)';
                let btnBorder = '1px solid var(--outline-variant)';
                let btnColor = 'var(--on-surface)';

                if (submitted) {
                  if (isActualCorrect) {
                    btnBg = '#2e5238'; btnColor = '#88e2a5'; btnBorder = '1px solid #88e2a5';
                  } else if (isSelected) {
                    btnBg = '#5c0000'; btnColor = 'var(--error)'; btnBorder = '1px solid var(--error)';
                  }
                } else if (isSelected) {
                  btnBg = 'var(--primary-container)'; btnColor = 'var(--on-primary-container)'; btnBorder = '1px solid var(--primary)';
                }

                return (
                  <button 
                    key={oi} 
                    disabled={submitted}
                    onClick={() => setAnswers(a => ({ ...a, [q.sentence]: opt }))}
                    style={{
                      background: btnBg, border: btnBorder, color: btnColor,
                      padding: '12px', borderRadius: 12, textAlign: 'left',
                      fontFamily: 'Inter', fontSize: 14, fontWeight: 600, cursor: submitted ? 'default' : 'pointer',
                      transition: 'all 0.2s', display: 'flex', gap: 10
                    }}
                  >
                    <span style={{ opacity: 0.6 }}>{letter})</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            
            {submitted && !isCorrect && (
              <div style={{ fontSize: 13, color: 'var(--error)', marginTop: 12, direction: 'ltr' }}>
                Correct Answer: <strong>{q.answer}</strong>
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={handleSubmit} style={{ width: '100%', background: 'var(--primary-container)', color: 'var(--on-primary-container)', border: 'none', borderRadius: 16, padding: 18, fontWeight: 900, fontSize: 17, cursor: 'pointer', marginTop: 8 }}>
          Submit Q4 ({Object.keys(answers).length}/{questions.length} answered)
        </button>
      )}
    </div>
  );
}
