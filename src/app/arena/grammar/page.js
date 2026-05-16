'use client';
import { useState, useMemo } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const GRAMMAR = sectionsData.grammar_guide;

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildMCQ = (topicKey) => {
  const data = GRAMMAR[topicKey];
  if (!data || !data.practice) return [];

  // Collect all answers from ALL topics for cross-topic distractors
  const allAnswers = Object.values(GRAMMAR)
    .flatMap(g => g.practice || [])
    .map(p => p.answer)
    .filter(Boolean)
    .flatMap(a => a.split(' / '));

  const questions = [];

  data.practice.forEach((item, i) => {
    if (item.sentence && item.answer) {
      // Standard fill-in-the-blank MCQ
      const correctAns = item.answer.split(' / ')[0]; // take first if multiple
      
      // Build distractors from same topic first, then cross-topic
      const sameTopicAnswers = data.practice
        .filter((_, idx) => idx !== i)
        .map(p => p.answer)
        .filter(Boolean)
        .flatMap(a => a.split(' / '))
        .filter(a => a.toLowerCase() !== correctAns.toLowerCase());

      const crossTopicAnswers = allAnswers.filter(
        a => a.toLowerCase() !== correctAns.toLowerCase()
      );

      const distractor_pool = shuffleArray([
        ...sameTopicAnswers,
        ...crossTopicAnswers.slice(0, 10)
      ]);

      const distractors = [...new Set(distractor_pool)].slice(0, 3);
      const options = shuffleArray([correctAns, ...distractors]);

      questions.push({
        id: `g_${topicKey}_${i}`,
        type: 'fill',
        sentence: item.sentence,
        hint: `Fill in the blank with the correct form.`,
        answer: correctAns,
        options,
        topic: topicKey.replace(/_/g, ' ')
      });

    } else if (item.wrong && item.correct) {
      // Error-identification MCQ: show wrong version, 4 options for correction
      // The blank is the error word
      const wrongWords = item.wrong.trim().split(/\s+/);
      const correctWords = item.correct.trim().split(/\s+/);

      // Find the differing word position
      let diffIdx = -1;
      for (let j = 0; j < Math.min(wrongWords.length, correctWords.length); j++) {
        if (wrongWords[j].replace(/[.,!?]/g, '') !== correctWords[j].replace(/[.,!?]/g, '')) {
          diffIdx = j;
          break;
        }
      }

      if (diffIdx >= 0) {
        const wrongWord = wrongWords[diffIdx].replace(/[.,!?]/g, '');
        const correctWord = correctWords[diffIdx].replace(/[.,!?]/g, '');

        const distractors = shuffleArray(
          allAnswers.filter(a => a.toLowerCase() !== correctWord.toLowerCase() && a.toLowerCase() !== wrongWord.toLowerCase())
        ).slice(0, 2);

        const options = shuffleArray([correctWord, wrongWord, ...distractors]);

        const highlighted = item.wrong.replace(wrongWords[diffIdx], `[${wrongWords[diffIdx]}]`);

        questions.push({
          id: `g_${topicKey}_${i}_err`,
          type: 'error',
          sentence: highlighted,
          hint: `The bracketed word is incorrect. Choose the correct replacement.`,
          answer: correctWord,
          options,
          topic: topicKey.replace(/_/g, ' ')
        });
      }
    }
  });

  return shuffleArray(questions);
};

export default function GrammarArena() {
  const [activeModule, setActiveModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const startModule = (topicKey) => {
    const qs = buildMCQ(topicKey);
    setQuestions(qs);
    setActiveModule(topicKey);
    setCurrentIndex(0);
    setSelectedOpt(null);
    setScore(0);
    setCompleted(false);
  };

  const current = questions[currentIndex];

  const handleSelect = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    if (opt.toLowerCase() === current.answer.toLowerCase()) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOpt(null);
    } else {
      setCompleted(true);
      const uId = JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
      if (uId && score > 0) {
        fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sync', userId: uId, incXp: score, incDone: 1,
            pushHistory: { date: new Date(), xp: score, type: 'Grammar Blitz', accuracy: Math.round((score / questions.length) * 100) }
          })
        }).catch(console.error);
      }
    }
  };

  const topicKeys = Object.keys(GRAMMAR).filter(k => GRAMMAR[k].practice);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {activeModule === null ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <div style={{ padding: '8px 12px', display: 'inline-block', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--secondary)', borderRadius: 12, color: 'var(--secondary)', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
                MODULE 01
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Grammar Blitz</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>MCQ questions testing each grammar rule topic by topic.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topicKeys.map((topicKey, i) => {
                const qCount = buildMCQ(topicKey).length;
                const title = topicKey.replace(/_/g, ' ').toUpperCase();
                return (
                  <button
                    key={topicKey}
                    onClick={() => startModule(topicKey)}
                    className="glass-card"
                    style={{
                      width: '100%', padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--border-glass)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--secondary)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Module {i + 1}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{qCount} questions</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                      <span className="mi">quiz</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="animate-slide-up">
            <button
              onClick={() => setActiveModule(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 24 }}
            >
              <span className="mi" style={{ fontSize: 18 }}>arrow_back</span> Back to Modules
            </button>

            {!completed ? (
              <div className="animate-fade-in" key={currentIndex}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Question</div>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{currentIndex + 1} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 14 }}>/ {questions.length}</span></div>
                  </div>
                  <div style={{ background: 'var(--grad-primary)', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 800, color: 'white' }}>
                    {score} pts
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${((currentIndex) / questions.length) * 100}%`,
                    background: 'var(--secondary)', borderRadius: 4, transition: '0.5s'
                  }} />
                </div>

                {/* Question Card */}
                <div className="glass-card" style={{ padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                  <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3 }} />

                  {/* Hint */}
                  <div style={{ fontSize: 10, color: current?.type === 'error' ? 'var(--error)' : 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                    {current?.type === 'error' ? '⚠ Find the correct replacement' : '📝 Fill in the blank'}
                  </div>

                  {/* Topic tag */}
                  <div style={{ display: 'inline-block', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 8, padding: '3px 10px', fontSize: 9, color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                    {current?.topic}
                  </div>

                  {/* Sentence */}
                  <p style={{ fontSize: 20, fontWeight: 600, color: 'white', lineHeight: 1.6, direction: 'ltr' }}>
                    &ldquo;{current?.sentence}&rdquo;
                  </p>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {current?.options.map((opt, i) => {
                    const isSelected = selectedOpt === opt;
                    const isCorrect = selectedOpt && opt.toLowerCase() === current.answer.toLowerCase();
                    const isWrong = selectedOpt && isSelected && opt.toLowerCase() !== current.answer.toLowerCase();

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(opt)}
                        style={{
                          width: '100%', padding: '16px 20px', borderRadius: 14, textAlign: 'left',
                          cursor: selectedOpt ? 'default' : 'pointer',
                          background: isCorrect ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isSelected ? 'rgba(0,229,255,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--secondary)' : 'var(--border-glass)'}`,
                          color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'white',
                          transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', gap: 14, direction: 'ltr'
                        }}
                      >
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                          background: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--secondary)' : 'rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: isCorrect || isWrong ? 16 : 12,
                          fontWeight: 900, color: isCorrect || isWrong || isSelected ? 'white' : 'var(--text-muted)'
                        }}>
                          {isCorrect ? <span className="mi" style={{ fontSize: 16 }}>check</span> : isWrong ? <span className="mi" style={{ fontSize: 16 }}>close</span> : OPTION_LABELS[i]}
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback after answering */}
                {selectedOpt && (
                  <div className="animate-slide-up" style={{ marginBottom: 20 }}>
                    <div style={{
                      padding: '12px 16px', borderRadius: 12,
                      background: selectedOpt.toLowerCase() === current.answer.toLowerCase() ? 'rgba(0,230,118,0.05)' : 'rgba(255,82,82,0.05)',
                      border: `1px solid ${selectedOpt.toLowerCase() === current.answer.toLowerCase() ? 'var(--success)' : 'var(--error)'}`,
                      fontSize: 13, color: 'var(--text-dim)'
                    }}>
                      {selectedOpt.toLowerCase() !== current.answer.toLowerCase() && (
                        <strong style={{ color: 'var(--success)', display: 'block', marginBottom: 4 }}>
                          ✓ Correct: {current.answer}
                        </strong>
                      )}
                      Topic: <strong style={{ color: 'white' }}>{current.topic}</strong>
                    </div>
                  </div>
                )}

                {selectedOpt && (
                  <button className="premium-btn" style={{ width: '100%', padding: 18 }} onClick={handleNext}>
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                    <span className="mi">arrow_forward</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="animate-slide-up" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                  boxShadow: '0 0 40px var(--primary-glow)'
                }}>
                  <span className="mi" style={{ fontSize: 48, color: 'white' }}>military_tech</span>
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Module Complete!</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>
                  You answered <strong style={{ color: 'var(--secondary)' }}>{score}/{questions.length}</strong> correctly.
                </p>
                <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--secondary)', fontFamily: 'monospace' }}>{score}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>of {questions.length} correct</div>
                  <div style={{ marginTop: 8, fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>+{score} XP Earned</div>
                </div>
                <button className="premium-btn" onClick={() => setActiveModule(null)} style={{ margin: '0 auto' }}>
                  Back to Modules <span className="mi">list</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
