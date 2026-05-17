'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import audioManager from '../utils/audio.js';
import { calcEndBonus, syncXP, XP_BASE } from '../utils/scoring.js';
import { getArabicExplanation } from '../utils/feedback.js';

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

export default function VocabExercise({ task, onFinish, completedSectionKey }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeGap, setActiveGap] = useState(null);
  const [score, setScore] = useState(0);

  const [bonuses, setBonuses] = useState([]);
  const [speedBonus, setSpeedBonus] = useState(0);
  const [streakBonus, setStreakBonus] = useState(0);
  const [firstTryBonus, setFirstTryBonus] = useState(0);
  const [toast, setToast] = useState(null);

  const startTimeRef = useRef(Date.now());
  const modifiedGapsRef = useRef(new Set());

  const correctAnswers = task.answers || {};
  const gaps = Object.keys(correctAnswers);

  const wordBox = useMemo(() => {
    return (task.box_words || []).map((w, i) => ({ word: w, id: `w_${i}` }));
  }, [task.box_words]);

  const usedWordIds = useMemo(() => {
    if ((task.box_words || []).length < gaps.length) return new Set();
    return new Set(Object.values(answers).map(a => a.id).filter(Boolean));
  }, [answers, task.box_words, gaps.length]);

  const handleWordSelect = (wordObj) => {
    if (submitted || !activeGap) return;
    audioManager.play('CLICK');

    // If this gap was already filled, mark it as modified (no longer eligible for First Try bonus)
    if (answers[activeGap]) {
      modifiedGapsRef.current.add(activeGap);
    }

    setAnswers(prev => ({ ...prev, [activeGap]: wordObj }));
    // Move to next gap automatically if available
    const nextGap = gaps[gaps.indexOf(activeGap) + 1];
    setActiveGap(nextGap || null);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let firstTryCount = 0;

    gaps.forEach(key => {
      const isCorrect = answers[key]?.word?.toLowerCase().trim() === correctAnswers[key]?.toLowerCase().trim();
      if (isCorrect) {
        correctCount++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);

        // If they never changed this gap's word, it counts as a First Try!
        if (!modifiedGapsRef.current.has(key)) {
          firstTryCount++;
        }
      } else {
        currentStreak = 0;
      }
    });

    const baseXp = correctCount * XP_BASE;
    const { xp: perfectXp, isPerfect } = calcEndBonus(correctCount, gaps.length);

    // Speed Bonus (elapsed time is less than 8 seconds per gap)
    const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
    const isSpeedy = elapsedSeconds < gaps.length * 8;
    const speedXp = isSpeedy && correctCount > 0 ? 15 : 0;

    // Streak Bonus
    let streakXp = 0;
    if (maxStreak >= 5) {
      streakXp = 30;
    } else if (maxStreak >= 3) {
      streakXp = 15;
    }

    // First Try Bonus (+5 XP per correct first-try answer)
    const firstTryXp = firstTryCount * 5;

    const totalXp = baseXp + perfectXp + speedXp + streakXp + firstTryXp;

    setSpeedBonus(speedXp);
    setStreakBonus(streakXp);
    setFirstTryBonus(firstTryXp);
    setScore(totalXp);
    setSubmitted(true);

    const calculatedBonuses = [];
    if (isPerfect) calculatedBonuses.push(`💎 Perfect Ending +${perfectXp}`);
    if (speedXp > 0) calculatedBonuses.push(`⚡ Speed Bonus +${speedXp}`);
    if (streakXp > 0) calculatedBonuses.push(`🔥 Streak x${maxStreak} +${streakXp}`);
    if (firstTryXp > 0) calculatedBonuses.push(`🎯 First Try x${firstTryCount} +${firstTryXp}`);
    
    setBonuses(calculatedBonuses);
    setToast({ xp: totalXp, bonuses: calculatedBonuses });

    if (isPerfect) audioManager.play('VICTORY');
    else if (correctCount > 0) audioManager.play('SUCCESS');
    else audioManager.play('ERROR');

    syncXP({ incXp: totalXp, incDone: 1, completedSection: completedSectionKey });
  };


  const sentenceMap = useMemo(() => {
    const map = {};
    if (!task.text) return map;
    const segments = task.text.split(/\n\n+/);
    segments.forEach(segment => {
      const gapMatches = [...segment.matchAll(/\((\d+)\)/g)];
      gapMatches.forEach(m => {
        const gapId = m[1];
        let cleanText = segment.trim();
        cleanText = cleanText.replace(/^\d+\.\s+/, '');
        map[gapId] = cleanText;
      });
    });
    return map;
  }, [task.text]);

  const processedText = useMemo(() => {
    let text = task.text || '';
    gaps.forEach(key => {
      const correctAns = correctAnswers[key];
      if (correctAns) {
        const escapedWord = correctAns.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\(${key}\\)\\s*${escapedWord}`, 'g');
        text = text.replace(regex, `(${key}) ___`);
      }
    });
    return text;
  }, [task.text, correctAnswers, gaps]);

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'white' }}>{task.title}</h3>
      <p style={{ color: 'var(--text-dim)', marginBottom: 32, fontSize: 15 }}>{task.instruction}</p>
      
      {/* Word Box */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: 32, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1.5 }}>Word Bank</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {wordBox.map(w => {
            const isUsed = usedWordIds.has(w.id);
            return (
              <button 
                key={w.id} 
                onClick={() => handleWordSelect(w)}
                disabled={submitted || isUsed}
                className="glass-card" 
                style={{ 
                    padding: '8px 16px', fontSize: 14, color: isUsed ? 'var(--text-muted)' : 'white', borderRadius: 12, 
                    background: isUsed ? 'rgba(255, 255, 255, 0.02)' : 'rgba(124, 77, 255, 0.1)',
                    border: isUsed ? '1px solid transparent' : '1px solid rgba(124, 77, 255, 0.3)',
                    cursor: (submitted || isUsed) ? 'default' : 'pointer',
                    transition: '0.3s',
                    textDecoration: isUsed ? 'line-through' : 'none'
                }}
              >
                {w.word}
              </button>
            );
          })}
        </div>
      </div>
 
      <div className="glass-card" style={{ padding: '32px', marginBottom: 32, position: 'relative' }}>
        <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, opacity: 0.5 }} />
        
        {/* Interactive Text Area */}
        <div style={{ lineHeight: '2.5', fontSize: 18, color: 'var(--text-dim)', direction: 'ltr' }}>
          {processedText.split('___').map((part, i, arr) => {
            const gapId = String(i + 1);
            const isLast = i === arr.length - 1;
            const answer = answers[gapId];
            const isActive = activeGap === gapId;
            const isRight = submitted && answer?.word?.toLowerCase().trim() === correctAnswers[gapId]?.toLowerCase().trim();
            const isWrong = submitted && answer && answer?.word?.toLowerCase().trim() !== correctAnswers[gapId]?.toLowerCase().trim();

            return (
              <span key={i}>
                {part}
                {!isLast && (
                  <button
                    onClick={() => !submitted && setActiveGap(gapId)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 100, height: 32, margin: '0 8px', borderRadius: 8,
                      background: isRight ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isActive ? 'rgba(124, 77, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isRight ? 'var(--success)' : isWrong ? 'var(--error)' : isActive ? 'var(--primary)' : 'var(--border-glass)'}`,
                      color: isRight ? 'var(--success)' : isWrong ? 'var(--error)' : answer ? 'white' : 'var(--text-muted)',
                      fontSize: 14, fontWeight: 800, cursor: submitted ? 'default' : 'pointer',
                      verticalAlign: 'middle', transition: '0.2s', position: 'relative',
                      padding: '0 12px'
                    }}
                  >
                    {answer?.word || (isActive ? '...' : `#${gapId}`)}
                    {submitted && (
                       <span className="mi" style={{ marginLeft: 6, fontSize: 14 }}>{isRight ? 'check' : 'close'}</span>
                    )}
                  </button>
                )}
              </span>
            );
          })}
        </div>
        
        {submitted && (
            <div style={{ marginTop: 32, padding: 20, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 16, border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Correction & Explanation Key</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {gaps.map(g => {
                        const answer = answers[g];
                        const isRight = answer?.word?.toLowerCase().trim() === correctAnswers[g].toLowerCase().trim();
                        const sentence = sentenceMap[g] || `(${g}) ___`;
                        
                        const makeReconstructed = (word) => {
                          const wText = word || '___';
                          return sentence
                            .replace(new RegExp(`\\(${g}\\)\\s*___`, 'g'), `[${wText}]`)
                            .replace(new RegExp(`\\(${g}\\)`, 'g'), `[${wText}]`);
                        };

                        const itemMock = {
                          sentence: sentence,
                          answer: correctAnswers[g],
                          correct: correctAnswers[g]
                        };

                        return (
                          <div key={g} style={{ 
                            padding: '12px 16px', borderRadius: 12, 
                            background: isRight ? 'rgba(0, 230, 118, 0.03)' : 'rgba(255, 82, 82, 0.03)',
                            borderLeft: `4px solid ${isRight ? 'var(--success)' : 'var(--error)'}`,
                            fontSize: 14, color: 'var(--text-dim)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <span className="mi" style={{ fontSize: 18, color: isRight ? 'var(--success)' : 'var(--error)' }}>
                                {isRight ? 'check_circle' : 'cancel'}
                              </span>
                              <strong style={{ color: 'white' }}>Sentence {g}:</strong>
                            </div>
                            <div style={{ paddingLeft: 26, direction: 'ltr', marginBottom: 12 }}>
                              {!isRight && (
                                <div style={{ marginBottom: 4, textDecoration: 'line-through', opacity: 0.6 }}>
                                  {makeReconstructed(answer?.word)}
                                </div>
                              )}
                              <div style={{ color: isRight ? 'white' : 'var(--success)', fontWeight: isRight ? 400 : 700 }}>
                                {makeReconstructed(correctAnswers[g])}
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 26 }}>
                              {Object.entries(getArabicExplanation(itemMock, task.title || 'confusing_words')).map(([title, content]) => (
                                <div key={title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 10, padding: '8px 12px', direction: 'rtl', textAlign: 'right' }}>
                                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', marginBottom: 3, textTransform: 'uppercase' }}>{title}</div>
                                  <div style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, fontSize: 12, whiteSpace: 'pre-line' }}>{content}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>

      {!submitted ? (
        <button className="premium-btn" style={{ width: '100%', padding: '20px' }} onClick={handleSubmit}>
          Finalize Assessment <span className="mi">stars</span>
        </button>
      ) : (
        <div style={{ textAlign: 'center' }} className="animate-slide-up">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 28px', borderRadius: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', marginBottom: 20 }}>
            {(() => {
              const correct = gaps.filter(k => answers[k]?.word?.toLowerCase().trim() === correctAnswers[k].toLowerCase().trim()).length;
              const base = correct * XP_BASE;
              const { xp: bonus, isPerfect } = calcEndBonus(correct, gaps.length);
              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Correct</span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900 }}>{correct}/{gaps.length}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Base XP</span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900 }}>{base}</span></div>
                  {isPerfect && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--gold)', fontSize: 13 }}>💎 Perfect Bonus</span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--gold)' }}>+30</span></div>}
                  <div style={{ height: 1, background: 'var(--border-glass)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Total XP</span><span style={{ fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 900, color: 'var(--primary)' }}>+{base + bonus}</span></div>
                </>
              );
            })()}
          </div>
          <br />
          <button
            style={{ marginTop: 24, background: 'transparent', border: 'none', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => onFinish ? onFinish() : window.location.reload()}
          >
            Exit Module <span className="mi">logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

