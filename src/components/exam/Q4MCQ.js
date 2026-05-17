'use client';
import { useState } from 'react';

const QUESTIONS = [
  {
    id: 'q4_1',
    sentence: 'My hotel room was clean ___ uncomfortable.',
    options: ['but', 'and', 'or', 'so'],
    correct: 'but',
    topic: 'And, But, Or'
  },
  {
    id: 'q4_2',
    sentence: 'I haven\'t been to China ___ Japan.',
    options: ['or', 'and', 'but', 'because'],
    correct: 'or',
    topic: 'And, But, Or'
  },
  {
    id: 'q4_3',
    sentence: 'He has been playing tennis ___ two hours.',
    options: ['for', 'since', 'during', 'in'],
    correct: 'for',
    topic: 'During, For, Since'
  },
  {
    id: 'q4_4',
    sentence: 'I\'ve been studying here ___ last January.',
    options: ['since', 'for', 'during', 'from'],
    correct: 'since',
    topic: 'During, For, Since'
  },
  {
    id: 'q4_5',
    sentence: 'I haven\'t seen my friends ___ two years.',
    options: ['for', 'since', 'during', 'in'],
    correct: 'for',
    topic: 'During, For, Since'
  },
  {
    id: 'q4_6',
    sentence: 'You ___ turn on the printer before you use it.',
    options: ['must', 'should', 'would', 'can'],
    correct: 'must',
    topic: 'Modal Verbs'
  },
  {
    id: 'q4_7',
    sentence: 'It ___ me 25 minutes to get to school this morning.',
    options: ['took', 'spent', 'had', 'passed'],
    correct: 'took',
    topic: 'Have, Pass, Spend, Take'
  },
  {
    id: 'q4_8',
    sentence: 'When I\'m waiting for a bus, I usually ___ the time reading magazines.',
    options: ['pass', 'spend', 'take', 'have'],
    correct: 'pass',
    topic: 'Have, Pass, Spend, Take'
  },
  {
    id: 'q4_9',
    sentence: 'Frank lived in Beijing for ten years, so he ___ speak Chinese very well.',
    options: ['could', 'can', 'should', 'must'],
    correct: 'could',
    topic: 'Modal Verbs'
  },
  {
    id: 'q4_10',
    sentence: 'Mary Jane\'s doctor says that she ___ stop smoking right away.',
    options: ['must', 'should', 'could', 'would'],
    correct: 'must',
    topic: 'Modal Verbs'
  },
  {
    id: 'q4_11',
    sentence: 'Ben and Luke hiked for miles today. They ___ be very tired.',
    options: ['must', 'can', 'should', 'would'],
    correct: 'must',
    topic: 'Modal Verbs'
  },
  {
    id: 'q4_12',
    sentence: '___ you pass me the salt, please?',
    options: ['Could', 'Must', 'Should', 'May'],
    correct: 'Could',
    topic: 'Modal Verbs'
  },
  {
    id: 'q4_13',
    sentence: 'I ___ I had worked harder for the exam. I\'m sure I\'ve failed.',
    options: ['wish', 'hope', 'want', 'would'],
    correct: 'wish',
    topic: 'Hope vs Wish'
  },
  {
    id: 'q4_14',
    sentence: 'He\'s going to take an exam. I ___ he passes.',
    options: ['hope', 'wish', 'want', 'expect'],
    correct: 'hope',
    topic: 'Hope vs Wish'
  },
  {
    id: 'q4_15',
    sentence: 'He\'s not mean. ___, he\'s very generous.',
    options: ['On the contrary', 'According to', 'Firstly', 'At first'],
    correct: 'On the contrary',
    topic: 'Opinions & Connectors'
  },
  {
    id: 'q4_16',
    sentence: 'We think our work here is of ___ importance.',
    options: ['great', 'large', 'high', 'wide'],
    correct: 'great',
    topic: 'Big, Great, Large'
  },
  {
    id: 'q4_17',
    sentence: 'I want to give you some ___.',
    options: ['advice', 'advices', 'an advice', 'advises'],
    correct: 'advice',
    topic: 'Countable / Uncountable'
  },
  {
    id: 'q4_18',
    sentence: 'We sat on the sofa and ___ a video.',
    options: ['watched', 'saw', 'looked at', 'viewed'],
    correct: 'watched',
    topic: 'Look, See, Watch'
  },
  {
    id: 'q4_19',
    sentence: 'We live ___ the sea.',
    options: ['near', 'nearby', 'next to', 'nearly'],
    correct: 'near',
    topic: 'Near, Nearby, Next to'
  },
  {
    id: 'q4_20',
    sentence: 'I met a lot of friendly ___.',
    options: ['people', 'peoples', 'person', 'persons'],
    correct: 'people',
    topic: 'Plural Nouns'
  }
];

export default function Q4MCQ({ onScore, reviewMode, sectionScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const isExamFinished = submitted || reviewMode;

  const handleSelect = (qId, option) => {
    if (isExamFinished) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });
    const s = correct * 5; // 20 questions * 5 = 100 points
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid #00e5ff' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 4: Grammar MCQ</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Select the most appropriate answer for each grammatical context. (20 questions × 5 = 100 pts)</p>
        {isExamFinished && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score !== null ? score : (sectionScore !== null && sectionScore !== undefined ? sectionScore : QUESTIONS.filter(q => answers[q.id] === q.correct).length * 5)} / 100 pts</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {QUESTIONS.map((q, idx) => {
          const selected = answers[q.id];
          const isCorrect = isExamFinished && selected === q.correct;
          const isWrong = isExamFinished && selected && selected !== q.correct;

          return (
            <div key={q.id} className="glass-card" style={{ padding: '24px', border: isExamFinished ? `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` : '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Question {idx + 1}</span>
                <span style={{ fontSize: 11, color: 'var(--secondary)', fontWeight: 700 }}>{q.topic}</span>
              </div>
              <p style={{ fontSize: 18, color: 'white', fontWeight: 600, marginBottom: 24, lineHeight: 1.6, direction: 'ltr' }}>
                &ldquo;{q.sentence}&rdquo;
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {q.options.map((opt, i) => {
                  const isSelected = selected === opt;
                  const isOptCorrect = opt === q.correct;

                  let btnBg = 'rgba(255,255,255,0.03)';
                  let btnBorder = '1px solid var(--border-glass)';
                  let btnColor = 'white';

                  if (isSelected) {
                    btnBg = 'rgba(0, 229, 255, 0.15)';
                    btnBorder = '1px solid var(--secondary)';
                    btnColor = 'var(--secondary)';
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
                      key={i}
                      disabled={isExamFinished}
                      onClick={() => handleSelect(q.id, opt)}
                      style={{
                        padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                        cursor: isExamFinished ? 'default' : 'pointer',
                        background: btnBg, border: btnBorder, color: btnColor,
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isExamFinished && !isCorrect && (
                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, background: 'rgba(0, 230, 118, 0.05)', border: '1px dashed var(--success)', fontSize: 14 }}>
                  <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Correct Answer:</span> <span style={{ color: 'white' }}>{q.correct}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isExamFinished && (
        <button className="premium-btn" style={{ width: '100%', marginTop: 40, padding: 20 }} onClick={handleSubmit}>
          Save Section 4 & Complete Exam <span className="mi">stars</span>
        </button>
      )}
    </div>
  );
}
