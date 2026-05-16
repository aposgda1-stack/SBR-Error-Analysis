'use client';
import { useState, useMemo } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const PHRASAL_DATA = sectionsData.phrasal_verbs || {};

// Build MCQ questions from phrasal verb data
const buildQuestions = (rootKey) => {
  const verbs = PHRASAL_DATA[rootKey] || [];
  
  // Get all particles across ALL roots for distractors
  const allParticles = Object.values(PHRASAL_DATA)
    .flat()
    .map(v => {
      // Extract particle from verb: "come across" -> "across"
      const parts = v.verb.split(' ');
      return parts.slice(1).join(' ');
    })
    .filter(Boolean);

  return verbs.map((item, i) => {
    const verbParts = item.verb.split(' ');
    const rootWord = verbParts[0];
    const correctParticle = verbParts.slice(1).join(' ');

    // Build distractors from other particles
    const distractors = [...new Set(
      allParticles.filter(p => p.toLowerCase() !== correctParticle.toLowerCase())
    )];

    const shuffledDistractors = distractors
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [correctParticle, ...shuffledDistractors].sort(() => Math.random() - 0.5);

    return {
      id: `pv_${rootKey}_${i}`,
      rootWord,
      correctParticle,
      definition: item.def,
      options,
      // Show the sentence with blank
      sentence: item.def 
        ? `"${item.def.charAt(0).toUpperCase() + item.def.slice(1)}" — Complete: ${rootWord} ___`
        : `${rootWord} ___`,
    };
  });
};

export default function PhrasalArena() {
  const [activeRoot, setActiveRoot] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const startModule = (root) => {
    const qs = buildQuestions(root);
    setQuestions(qs);
    setActiveRoot(root);
    setCurrentIndex(0);
    setSelectedOpt(null);
    setScore(0);
    setCompleted(false);
  };

  const current = questions[currentIndex];

  const handleSelect = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    if (opt === current.correctParticle) {
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
      if (uId) {
        fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'sync', userId: uId, incXp: score, incDone: 1,
            pushHistory: { date: new Date(), xp: score, type: 'Phrasal Verbs', accuracy: Math.round((score / questions.length) * 100) }
          })
        }).catch(console.error);
      }
    }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {activeRoot === null ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <div style={{ padding: '8px 12px', display: 'inline-block', background: 'rgba(255, 64, 129, 0.1)', border: '1px solid var(--accent)', borderRadius: 12, color: 'var(--accent)', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
                MODULE 02
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Phrasal Mastery</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>MCQ questions on phrasal verbs grouped by root word.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.keys(PHRASAL_DATA).map((rootKey, i) => {
                const count = PHRASAL_DATA[rootKey].length;
                return (
                  <button
                    key={rootKey}
                    onClick={() => startModule(rootKey)}
                    className="glass-card"
                    style={{
                      width: '100%', padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--border-glass)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Module {i + 1}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'white', textTransform: 'capitalize' }}>{rootKey} Verbs</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{count} MCQ questions</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255, 64, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
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
              onClick={() => setActiveRoot(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 24 }}
            >
              <span className="mi" style={{ fontSize: 18 }}>arrow_back</span> Back to Modules
            </button>

            {!completed ? (
              <div className="animate-fade-in" key={currentIndex}>
                {/* Progress header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
                    Question {currentIndex + 1} of {questions.length}
                  </div>
                  <div style={{ background: 'var(--grad-primary)', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 800, color: 'white' }}>
                    {score} pts
                  </div>
                </div>

                {/* Question Card */}
                <div className="glass-card" style={{ padding: '28px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                  <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3 }} />

                  <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
                    Complete the phrasal verb
                  </div>

                  {/* Definition hint */}
                  <div style={{ background: 'rgba(255, 64, 129, 0.05)', border: '1px solid rgba(255, 64, 129, 0.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>Meaning</div>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, direction: 'ltr' }}>{current?.definition}</p>
                  </div>

                  {/* Sentence with blank */}
                  <p style={{ fontSize: 22, fontWeight: 800, color: 'white', direction: 'ltr', textAlign: 'center' }}>
                    {current?.rootWord}{' '}
                    {selectedOpt ? (
                      <span style={{ 
                        color: selectedOpt === current.correctParticle ? 'var(--success)' : 'var(--error)',
                        textDecoration: 'underline', textDecorationStyle: 'wavy'
                      }}>
                        {selectedOpt}
                      </span>
                    ) : (
                      <span style={{ 
                        display: 'inline-block', minWidth: 80, borderBottom: '3px solid var(--accent)',
                        color: 'rgba(255,255,255,0.3)', fontWeight: 400
                      }}>___</span>
                    )}
                  </p>
                </div>

                {/* Options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                  {current?.options.map((opt, i) => {
                    const isSelected = selectedOpt === opt;
                    const isCorrect = selectedOpt && opt === current.correctParticle;
                    const isWrong = selectedOpt && isSelected && opt !== current.correctParticle;

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(opt)}
                        style={{
                          padding: '18px 12px', borderRadius: 16, fontSize: 16, fontWeight: 800,
                          cursor: selectedOpt ? 'default' : 'pointer',
                          background: isCorrect ? 'rgba(0, 230, 118, 0.15)' : isWrong ? 'rgba(255, 82, 82, 0.15)' : isSelected ? 'rgba(255,64,129, 0.15)' : 'rgba(255,255,255,0.04)',
                          border: `2px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--accent)' : 'var(--border-glass)'}`,
                          color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'white',
                          transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8
                        }}
                      >
                        <span>{opt}</span>
                        {isCorrect && <span className="mi" style={{ fontSize: 18 }}>check_circle</span>}
                        {isWrong && <span className="mi" style={{ fontSize: 18 }}>cancel</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Correct answer explanation after answering */}
                {selectedOpt && (
                  <div className="animate-slide-up" style={{ marginBottom: 24 }}>
                    <div style={{ 
                      padding: '14px 18px', borderRadius: 12,
                      background: selectedOpt === current.correctParticle ? 'rgba(0,230,118,0.05)' : 'rgba(255,82,82,0.05)',
                      border: `1px solid ${selectedOpt === current.correctParticle ? 'var(--success)' : 'var(--error)'}`,
                      display: 'flex', alignItems: 'center', gap: 12
                    }}>
                      <span className="mi" style={{ color: selectedOpt === current.correctParticle ? 'var(--success)' : 'var(--error)', fontSize: 20 }}>
                        {selectedOpt === current.correctParticle ? 'verified' : 'info'}
                      </span>
                      <div>
                        {selectedOpt !== current.correctParticle && (
                          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 800, marginBottom: 2 }}>
                            Correct answer: {current.rootWord} {current.correctParticle}
                          </div>
                        )}
                        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                          {current.rootWord} {current.correctParticle} = {current.definition}
                        </div>
                      </div>
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
                  You scored <strong style={{ color: 'var(--primary)' }}>{score}/{questions.length}</strong> on {activeRoot} phrasal verbs.
                </p>
                <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--accent)', fontFamily: 'monospace' }}>{score}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>of {questions.length} correct</div>
                  <div style={{ marginTop: 12, fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>+{score} XP</div>
                </div>
                <button className="premium-btn" onClick={() => setActiveRoot(null)} style={{ margin: '0 auto' }}>
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
