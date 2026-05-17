'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import audioManager from '../../../utils/audio.js';
import { getArabicExplanation } from '../../../utils/feedback.js';
import { calcAnswerXP, calcEndBonus, syncXP, XP_BASE, STREAK_THRESHOLD } from '../../../utils/scoring.js';

/* ── XP Toast ── */
function XPToast({ bonuses, totalXp, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', pointerEvents: 'none' }}>
      <div style={{ background: 'var(--grad-primary)', color: 'white', padding: '10px 20px', borderRadius: 16, fontWeight: 900, fontSize: 20, boxShadow: '0 8px 30px var(--primary-glow)', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        +{totalXp} XP
      </div>
      {bonuses.map((b, i) => (
        <div key={i} style={{ background: 'rgba(12,8,25,0.9)', border: '1px solid var(--border-bright)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 12, fontWeight: 700, fontSize: 13, animation: `slideUp 0.4s cubic-bezier(0.16,1,0.3,1) ${0.1 * (i + 1)}s both` }}>
          {b}
        </div>
      ))}
    </div>
  );
}

/* ── Streak badge ── */
function StreakBadge({ streak }) {
  if (streak < 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {Array.from({ length: STREAK_THRESHOLD }).map((_, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < streak % STREAK_THRESHOLD || (streak % STREAK_THRESHOLD === 0 && streak > 0) ? '#f87171' : 'rgba(255,255,255,0.1)', boxShadow: i < streak % STREAK_THRESHOLD ? '0 0 8px #f87171' : 'none', transition: '0.3s' }} />
      ))}
      <span style={{ fontSize: 12, fontWeight: 800, color: '#f87171' }}>🔥 {streak}</span>
    </div>
  );
}

const PHRASAL_DATA = sectionsData.phrasal_verbs || {};

const SINGLE_WORD_PARTICLES = ['up', 'down', 'in', 'out', 'off', 'on', 'across', 'away', 'into', 'through', 'to', 'with', 'over', 'by', 'for', 'about'];
const MULTI_WORD_PARTICLES = ['down with', 'up against', 'away with', 'up to', 'out in', 'out of', 'up with', 'in for', 'along with', 'on with'];

// Build MCQ questions from phrasal verb data
const buildQuestions = (rootKey) => {
  const verbs = PHRASAL_DATA[rootKey] || [];
  
  return verbs.map((item, i) => {
    const verbParts = item.verb.split(' ');
    const rootWord = verbParts[0];
    const correctParticle = verbParts.slice(1).join(' ');

    let distractors = [];

    if (correctParticle === "himself up") {
      distractors = ['himself in', 'himself out', 'himself over', 'himself down'];
    } else if (correctParticle === "up one's mind") {
      distractors = ["up one's papers", "up one's room", "up one's books"];
    } else {
      const isMultiWord = correctParticle.includes(' ');
      if (isMultiWord) {
        distractors = MULTI_WORD_PARTICLES.filter(p => p.toLowerCase() !== correctParticle.toLowerCase());
      } else {
        distractors = SINGLE_WORD_PARTICLES.filter(p => p.toLowerCase() !== correctParticle.toLowerCase());
      }
    }

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
  const [completedSections, setCompletedSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [toast, setToast] = useState(null); // { xp, bonuses }
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem('sbr_completed_sections') || '[]');
      setCompletedSections(local);
    } catch (e) {
      console.error(e);
    }
  }, [activeRoot]);

  // Reset timer on question change
  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [currentIndex]);

  const startModule = (root) => {
    audioManager.play('CLICK');
    const qs = buildQuestions(root);
    setQuestions(qs);
    setActiveRoot(root);
    setCurrentIndex(0);
    setSelectedOpt(null);
    setCorrectCount(0);
    setTotalXp(0);
    setStreak(0);
    setCompleted(false);
    questionStartRef.current = Date.now();
  };

  const current = questions[currentIndex];

  const handleSelect = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    if (opt === current.correctParticle) {
      audioManager.play('SUCCESS');
      const newStreak = streak + 1;
      const newCorrect = correctCount + 1;
      const elapsed = Date.now() - questionStartRef.current;

      const { xp, bonuses } = calcAnswerXP({ elapsedMs: elapsed, streak: newStreak, firstTry: true });
      setTotalXp(p => p + xp);
      setStreak(newStreak);
      setCorrectCount(newCorrect);
      setToast({ xp, bonuses });
      syncXP({ incXp: xp });
    } else {
      audioManager.play('ERROR');
      setStreak(0);
    }
  };

  const handleNext = () => {
    audioManager.play('CLICK');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOpt(null);
    } else {
      audioManager.play('VICTORY');
      const { xp: bonusXp, isPerfect } = calcEndBonus(correctCount, questions.length);
      const finalXp = totalXp + bonusXp;
      setCompleted(true);
      
      syncXP({
        incXp: bonusXp,
        incDone: 1,
        historyEntry: { date: new Date(), xp: finalXp, type: 'Phrasal Verbs', accuracy: Math.round((correctCount / questions.length) * 100) },
        completedSection: 'p_' + activeRoot
      });
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
                const isDone = completedSections.includes('p_' + rootKey);
                return (
                  <button
                    key={rootKey}
                    onClick={() => startModule(rootKey)}
                    className="glass-card"
                    style={{
                      width: '100%', padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', cursor: 'pointer', transition: '0.2s',
                      border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-glass)',
                      background: isDone ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, transparent 100%)' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <div style={{ fontSize: 13, color: isDone ? 'var(--success)' : 'var(--accent)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                          Module {i + 1}
                        </div>
                        {isDone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: 6, fontSize: 9, fontWeight: 900, color: 'var(--success)' }}>
                            <span className="mi" style={{ fontSize: 10 }}>check</span> COMPLETED
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: isDone ? 'rgba(255,255,255,0.9)' : 'white', textTransform: 'capitalize' }}>{rootKey} Verbs</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{count} MCQ questions</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 64, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDone ? 'var(--success)' : 'var(--accent)' }}>
                      <span className="mi">{isDone ? 'check' : 'quiz'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="animate-slide-up" key={activeRoot}>
            <button
              onClick={() => setActiveRoot(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 24 }}
            >
              <span className="mi" style={{ fontSize: 18 }}>arrow_back</span> Back to Modules
            </button>

            {!completed ? (
              <div className="animate-fade-in" key={currentIndex}>
                {toast && <XPToast xp={toast.xp} bonuses={toast.bonuses} totalXp={toast.xp} onDone={() => setToast(null)} />}
                {/* Progress header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
                    Question {currentIndex + 1} of {questions.length}
                  </div>
                  <StreakBadge streak={streak} />
                  <div style={{ background: 'var(--grad-primary)', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 800, color: 'white' }}>
                    {totalXp} XP
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
                      padding: '16px 20px', borderRadius: 12,
                      background: selectedOpt === current.correctParticle ? 'rgba(0,230,118,0.05)' : 'rgba(255,82,82,0.05)',
                      border: `1px solid ${selectedOpt === current.correctParticle ? 'var(--success)' : 'var(--error)'}`,
                      fontSize: 14, color: 'var(--text-dim)'
                    }}>
                      <h4 style={{ fontSize: 18, fontWeight: 800, color: selectedOpt === current.correctParticle ? 'var(--primary)' : 'var(--error)', marginBottom: 12 }}>
                        {selectedOpt === current.correctParticle ? 'Excellent! 🎉' : 'Incorrect ❌'}
                      </h4>
                      {selectedOpt !== current.correctParticle && (
                        <div style={{ marginBottom: 12 }}>
                          <strong style={{ color: 'var(--success)', display: 'block', marginBottom: 4 }}>
                            ✓ Correct Answer: {current.correctParticle}
                          </strong>
                        </div>
                      )}
                      <div style={{ marginBottom: 12 }}>
                        <p style={{ fontWeight: 600, color: 'white', marginBottom: 4 }}>Completed Phrasal Verb:</p>
                        <p style={{ color: 'var(--primary)', fontStyle: 'italic', fontSize: 16 }}>
                          &ldquo;{current.rootWord} {current.correctParticle}&rdquo;
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        {Object.entries(getArabicExplanation(current, 'phrasal_verbs')).map(([title, content]) => (
                          <div key={title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 12, padding: '10px 14px', direction: 'rtl', textAlign: 'right' }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', marginBottom: 4, textTransform: 'uppercase' }}>{title}</div>
                            <div style={{ color: 'white', lineHeight: 1.5, fontSize: 13, whiteSpace: 'pre-line' }}>{content}</div>
                          </div>
                        ))}
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
                  width: 100, height: 100, borderRadius: '50%', background: calcEndBonus(correctCount, questions.length).isPerfect ? 'linear-gradient(135deg,#f59e0b,#fbbf24)' : 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                  boxShadow: calcEndBonus(correctCount, questions.length).isPerfect ? '0 0 40px rgba(251,191,36,0.5)' : '0 0 40px var(--primary-glow)'
                }}>
                  {calcEndBonus(correctCount, questions.length).isPerfect ? '🏆' : <span className="mi" style={{ fontSize: 48, color: 'white' }}>military_tech</span>}
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{calcEndBonus(correctCount, questions.length).isPerfect ? '🏆 Perfect Score!' : 'Module Complete!'}</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>
                  You scored <strong style={{ color: 'var(--primary)' }}>{correctCount}/{questions.length}</strong> on {activeRoot} phrasal verbs.
                </p>
                <div className="glass-card" style={{ padding: 24, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, margin: '0 auto 32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Base XP</span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900 }}>{correctCount * XP_BASE}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Bonuses</span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--primary)' }}>+{totalXp - correctCount * XP_BASE}</span></div>
                  {calcEndBonus(correctCount, questions.length).isPerfect && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--gold)', fontSize: 13 }}>💎 Perfect Bonus</span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--gold)' }}>+30</span></div>}
                  <div style={{ height: 1, background: 'var(--border-glass)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 15, fontWeight: 800 }}>Total XP</span><span style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>+{totalXp + calcEndBonus(correctCount, questions.length).xp}</span></div>
                </div>
                {(() => {
                  const phrasalRoots = Object.keys(PHRASAL_DATA);
                  const currentIdx = phrasalRoots.indexOf(activeRoot);
                  const nextRoot = (currentIdx !== -1 && currentIdx < phrasalRoots.length - 1) ? phrasalRoots[currentIdx + 1] : null;
                  return nextRoot ? (
                    <button 
                      className="premium-btn" 
                      onClick={() => startModule(nextRoot)} 
                      style={{ margin: '0 auto', width: '100%' }}
                    >
                      Next Set (الانتقال للقسم التالي) <span className="mi">arrow_forward</span>
                    </button>
                  ) : (
                    <button className="premium-btn" onClick={() => setActiveRoot(null)} style={{ margin: '0 auto', width: '100%' }}>
                      Finish & Exit <span className="mi">done_all</span>
                    </button>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
