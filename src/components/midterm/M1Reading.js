'use client';
import { useState } from 'react';

const QUESTIONS = [
  {
    id: 'm1_1',
    text: '1. Based on the details in this passage, where is the narrator probably staying?',
    options: [
      { key: 'A', text: 'in the mountains', isCorrect: true },
      { key: 'B', text: 'in a city', isCorrect: false },
      { key: 'C', text: 'in the desert', isCorrect: false },
      { key: 'D', text: 'on an island', isCorrect: false }
    ]
  },
  {
    id: 'm1_2',
    text: '2. What are two details that helped you draw this conclusion?',
    options: [
      { key: 'A', text: 'The cabin and the piled-up snow blocking the door.', isCorrect: true },
      { key: 'B', text: 'The palm trees and the sandy beach.', isCorrect: false },
      { key: 'C', text: 'The tall skyscrapers and traffic noises.', isCorrect: false },
      { key: 'D', text: 'The lack of water and cactus plants.', isCorrect: false }
    ]
  },
  {
    id: 'm1_3',
    text: '3. What conclusion can you draw about how the narrator feels?',
    options: [
      { key: 'A', text: 'Worried, concerned about cold, and anxious for help.', isCorrect: true },
      { key: 'B', text: 'Relaxed, happy, and enjoying the peaceful vacation.', isCorrect: false },
      { key: 'C', text: 'Angry, aggressive, and eager to fight someone.', isCorrect: false },
      { key: 'D', text: 'Bored, calm, and indifferent about survival.', isCorrect: false }
    ]
  },
  {
    id: 'm1_4',
    text: '4. Which of the following conclusions does NOT seem correct, based on the passage?',
    options: [
      { key: 'A', text: 'The narrator is worried.', isCorrect: false },
      { key: 'B', text: 'Three people are there.', isCorrect: true },
      { key: 'C', text: 'The writer is concerned about the cold.', isCorrect: false },
      { key: 'D', text: 'The ground is covered with snow.', isCorrect: false }
    ]
  },
  {
    id: 'm1_5',
    text: '5. Which of the following conclusions seems correct, based on the passage?',
    options: [
      { key: 'A', text: 'a landslide has occurred', isCorrect: false },
      { key: 'B', text: 'a blizzard has occurred', isCorrect: true },
      { key: 'C', text: 'a hurricane has occurred', isCorrect: false },
      { key: 'D', text: 'a tornado has occurred', isCorrect: false }
    ]
  }
];

export default function M1Reading({ onScore, reviewMode, sectionScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const isExamFinished = submitted || reviewMode;

  const handleSelect = (qId, optionKey) => {
    if (isExamFinished) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    QUESTIONS.forEach(q => {
      const selected = q.options.find(o => o.key === answers[q.id]);
      if (selected && selected.isCorrect) correct++;
    });
    const s = correct * 5; // 5 questions * 5 = 25 XP
    setScore(s);
    setSubmitted(true);
    onScore(s);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>Part 1: Reading Comprehension</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Read the paragraph carefully and answer the 5 questions. (10 marks = 25 XP)</p>
        {isExamFinished && (
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: 'var(--grad-primary)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{score !== null ? score : (sectionScore !== null && sectionScore !== undefined ? sectionScore : QUESTIONS.filter(q => q.options.find(o => o.key === answers[q.id])?.isCorrect).length * 5)} / 25 XP</span>
          </div>
        )}
      </div>

      {/* Paragraph Block */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: 32, lineHeight: '1.8', fontSize: 17, color: 'white', direction: 'ltr', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
        <p style={{ fontWeight: 600 }}>
          "I had been stuck in the cabin for four days already. The snow piled up in front of the door made it impossible to get out. Even if I could get out, I wouldn't be able to find the road. I checked my food supplies, and it looked as if I could last another week, but no more than that. What worried me most was that I had no more wood to burn. How would I keep the cabin warm? Perhaps the more important question was this: Was anyone coming up here to help me?"
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {QUESTIONS.map((q, idx) => {
          const selected = answers[q.id];
          const correctOpt = q.options.find(o => o.isCorrect);
          const isCorrect = isExamFinished && selected === correctOpt.key;

          return (
            <div key={q.id} className="glass-card" style={{ padding: '24px', border: isExamFinished ? `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` : '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>Question {idx + 1}</div>
              <p style={{ fontSize: 16, color: 'white', fontWeight: 700, marginBottom: 20, lineHeight: 1.5, direction: 'ltr' }}>
                {q.text}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.options.map((opt) => {
                  const isSelected = selected === opt.key;
                  let btnBg = 'rgba(255,255,255,0.03)';
                  let btnBorder = '1px solid var(--border-glass)';
                  let btnColor = 'white';

                  if (isSelected) {
                    btnBg = 'rgba(0, 229, 255, 0.15)';
                    btnBorder = '1px solid var(--secondary)';
                    btnColor = 'var(--secondary)';
                  }

                  if (isExamFinished) {
                    if (opt.isCorrect) {
                      btnBg = 'rgba(0, 230, 118, 0.15)';
                      btnBorder = '1px solid var(--success)';
                      btnColor = 'var(--success)';
                    } else if (isSelected && !opt.isCorrect) {
                      btnBg = 'rgba(255, 82, 82, 0.15)';
                      btnBorder = '1px solid var(--error)';
                      btnColor = 'var(--error)';
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      disabled={isExamFinished}
                      onClick={() => handleSelect(q.id, opt.key)}
                      style={{
                        padding: '14px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                        cursor: isExamFinished ? 'default' : 'pointer',
                        background: btnBg, border: btnBorder, color: btnColor,
                        transition: 'all 0.2s', textAlign: 'left', display: 'flex', gap: 12
                      }}
                    >
                      <span style={{ fontWeight: 800 }}>{opt.key}.</span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {isExamFinished && !isCorrect && (
                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, background: 'rgba(0, 230, 118, 0.05)', border: '1px dashed var(--success)', fontSize: 14 }}>
                  <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Correct Answer:</span> <span style={{ color: 'white' }}>{correctOpt.key} ({correctOpt.text})</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isExamFinished && (
        <button className="premium-btn" style={{ width: '100%', marginTop: 40, padding: 20 }} onClick={handleSubmit}>
          Save Section 1 <span className="mi">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
