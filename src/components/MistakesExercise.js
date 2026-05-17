'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import audioManager from '../utils/audio.js';
import { calcAnswerXP, calcEndBonus, syncXP, XP_BASE, STREAK_THRESHOLD } from '../utils/scoring.js';
import { getArabicExplanation } from '../utils/feedback.js';

/* ── helpers ── */
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const getErrorSpan = (wrong, correct) => {
  const norm = (s) => s.replace(/[.,!?]$/, '').trim().split(/\s+/);
  const w = norm(wrong), c = norm(correct);
  let start = 0;
  while (start < w.length && start < c.length && w[start] === c[start]) start++;
  let endW = w.length - 1, endC = c.length - 1;
  while (endW >= start && endC >= start && w[endW] === c[endC]) { endW--; endC--; }
  if (endW < start) endW = start;
  return { start, endW };
};

const getDiffWord = (wrong, correct) => {
  const norm = (s) => s.replace(/[.,!?]$/, '').trim().split(/\s+/);
  const w = norm(wrong), c = norm(correct);
  let start = 0;
  while (start < w.length && start < c.length && w[start] === c[start]) start++;
  let endW = w.length - 1, endC = c.length - 1;
  while (endW >= start && endC >= start && w[endW] === c[endC]) { endW--; endC--; }
  if (endC < start) endC = start;
  return { word: c.slice(start, endC + 1).join(' '), start, endW };
};

const generateDistractors = (correctWord, wrongWord) => {
  const c = correctWord.toLowerCase();
  const w = (wrongWord || '').toLowerCase();
  let pool = [];
  if (['in','on','at','to','for','with','by','of','from','about','as','like','among','between'].includes(c))
    pool = ['in','on','at','to','for','with','by','of','from','about','as','like','among','between'];
  else if (['a','an','the','some','any','much','many','few','little'].includes(c))
    pool = ['a','an','the','some','any','much','many','few','little'];
  else if (['is','are','was','were','has','have','had','do','does','did','make','makes','made','can','must','should'].includes(c))
    pool = ['is','are','was','were','has','have','had','do','does','did','make','makes','made','can','must','should'];
  else if (['he','she','it','they','we','i','you','him','her','them','us','me'].includes(c))
    pool = ['he','she','it','they','we','I','you','him','her','them','us','me'];
  else if (['very','too','enough','quite','rather','so','such','well','badly','good','bad','hard','hardly'].includes(c))
    pool = ['very','too','enough','quite','rather','so','such','well','badly','good','bad','hard','hardly'];
  else
    pool = ['different','similar','other','another'];
  return shuffleArray(pool.filter(x => x.toLowerCase() !== c && x.toLowerCase() !== w)).slice(0, 3);
};

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

/* ── Streak indicator ── */
function StreakBadge({ streak }) {
  if (streak < 1) return null;
  const pct = (streak % STREAK_THRESHOLD) / STREAK_THRESHOLD;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: STREAK_THRESHOLD }).map((_, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < streak % STREAK_THRESHOLD || (streak % STREAK_THRESHOLD === 0 && streak > 0) ? 'var(--error)' : 'rgba(255,255,255,0.1)', boxShadow: i < streak % STREAK_THRESHOLD ? '0 0 8px var(--error)' : 'none', transition: '0.3s' }} />
        ))}
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--error)' }}>🔥 {streak}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
export default function MistakesExercise({ data, startIndex = 0, onComplete, isComprehensive = false }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [step, setStep] = useState(1);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [totalXp, setTotalXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState([]);
  const [firstTryCorrect, setFirstTryCorrect] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [toast, setToast] = useState(null); // { xp, bonuses }
  const [activeToasts, setActiveToasts] = useState([]); // array of { id, text, isError }
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    setCurrentIndex(startIndex);
    setStep(1); setSelectedWordIndex(null); setSelectedOpt(null);
    setWrongAttempts([]); setCompleted(false); setTotalXp(0);
    setStreak(0); setCorrectCount(0);
  }, [startIndex]);

  // Reset timer when question changes
  useEffect(() => { questionStartRef.current = Date.now(); }, [currentIndex, step]);

  const mistakes = data;
  const currentItem = mistakes[currentIndex];

  const errorSpan = useMemo(() => {
    if (!currentItem) return { start: 0, endW: 0 };
    return getErrorSpan(currentItem.wrong, currentItem.correct);
  }, [currentItem]);

  const correctOptionObj = useMemo(() => {
    if (!currentItem) return { word: '', start: 0, endW: 0 };
    return getDiffWord(currentItem.wrong, currentItem.correct);
  }, [currentItem]);
  const correctOption = correctOptionObj.word;

  const wrongOptionWord = useMemo(() => {
    if (!currentItem) return '';
    return getDiffWord(currentItem.correct, currentItem.wrong).word;
  }, [currentItem]);

  const options = useMemo(() => {
    if (!currentItem) return [];
    let wrongOptions = generateDistractors(correctOption, wrongOptionWord);
    if (wrongOptions.includes('different') || wrongOptions.length < 3) {
      const others = mistakes.filter(x => x.id !== currentItem.id)
        .map(x => getDiffWord(x.wrong, x.correct).word)
        .filter(x => x.toLowerCase() !== correctOption.toLowerCase() && x.toLowerCase() !== wrongOptionWord.toLowerCase());
      const mixed = shuffleArray([...wrongOptions.filter(x => !['different','similar','other','another'].includes(x)), ...others]);
      wrongOptions = Array.from(new Set(mixed)).slice(0, 3);
    }
    return shuffleArray([correctOption, ...wrongOptions]);
  }, [currentItem, correctOption, wrongOptionWord, mistakes]);

  const handleWordClick = (index) => {
    if (step !== 1) return;
    if (index >= errorSpan.start && index <= errorSpan.endW) {
      audioManager.play('CLICK');
      setSelectedWordIndex(index);
      setTimeout(() => setStep(2), 600);
    } else {
      if (!wrongAttempts.includes(index)) {
        setWrongAttempts(p => [...p, index]);
        setFirstTryCorrect(false);
        audioManager.play('ERROR');
      }
    }
  };

  const handleSelect = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);

    if (opt === correctOption) {
      audioManager.play('SUCCESS');
      const newStreak = streak + 1;
      const newCorrect = correctCount + 1;
      const elapsed = Date.now() - questionStartRef.current;

      const { xp, bonuses } = calcAnswerXP({ elapsedMs: elapsed, streak: newStreak, firstTry: firstTryCorrect });
      setTotalXp(p => p + xp);
      setStreak(newStreak);
      setCorrectCount(newCorrect);
      setToast({ xp, bonuses });
      syncXP({ incXp: xp });

      const id = Date.now() + Math.random();
      const toastText = `+${xp} XP ${bonuses.length > 0 ? `(${bonuses.join(' ')})` : ''}`;
      setActiveToasts(prev => [...prev, { id, text: toastText, key: id }]);
      setTimeout(() => setActiveToasts(prev => prev.filter(t => t.id !== id)), 1200);

    } else {
      audioManager.play('ERROR');
      setStreak(0);
      
      const id = Date.now() + Math.random();
      setActiveToasts(prev => [...prev, { id, text: '❌ Wrong', isError: true, key: id }]);
      setTimeout(() => setActiveToasts(prev => prev.filter(t => t.id !== id)), 1200);
    }
  };

  const handleNext = () => {
    audioManager.play('CLICK');
    if (wrongAttempts.length > 0 || (selectedOpt && selectedOpt !== correctOption)) {
      const localVault = JSON.parse(localStorage.getItem('sbr_vault') || '[]');
      if (!localVault.some(v => v.id === currentItem.id)) {
        const newItem = { ...currentItem, date: new Date() };
        localStorage.setItem('sbr_vault', JSON.stringify([...localVault, newItem]));
        syncXP({ pushVault: newItem });
      }
    }
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex(i => i + 1);
      setStep(1); setSelectedWordIndex(null); setSelectedOpt(null);
      setWrongAttempts([]); setFirstTryCorrect(true);
    } else {
      audioManager.play('VICTORY');
      const { xp: bonusXp, isPerfect } = calcEndBonus(correctCount, mistakes.length);
      const finalXp = totalXp + bonusXp;
      const historyType = isComprehensive ? 'Comprehensive Error Hunter' : 'Error Hunter';
      syncXP({
        incXp: bonusXp,
        incDone: 1,
        historyEntry: { date: new Date(), xp: finalXp, type: historyType, accuracy: Math.round((correctCount / mistakes.length) * 100) }
      });
      setCompleted(true);
    }
  };

  const handleComplete = () => onComplete();

  /* ── COMPLETED SCREEN ── */
  if (completed) {
    const accuracy = Math.round((correctCount / mistakes.length) * 100);
    const { isPerfect } = calcEndBonus(correctCount, mistakes.length);
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }} className="animate-slide-up">
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: isPerfect ? 'linear-gradient(135deg,#f59e0b,#fbbf24)' : 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: isPerfect ? '0 0 40px rgba(251,191,36,0.5)' : '0 0 30px var(--primary-glow)', fontSize: 48 }}>
          {isPerfect ? '🏆' : <span className="mi" style={{ fontSize: 48, color: 'white' }}>celebration</span>}
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{isPerfect ? 'Perfect Score!' : 'Module Complete!'}</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>{accuracy}% accuracy · {correctCount}/{mistakes.length} correct</p>

        <div className="glass-card" style={{ padding: 28, maxWidth: 320, margin: '0 auto 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Base XP</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'white' }}>{correctCount * XP_BASE}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Bonuses</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--primary)' }}>+{totalXp - correctCount * XP_BASE + (isPerfect ? 30 : 0)}</span>
          </div>
          {isPerfect && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--gold)', fontSize: 13 }}>💎 Perfect Bonus</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--gold)' }}>+30</span>
            </div>
          )}
          <div style={{ height: 1, background: 'var(--border-glass)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Total XP</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>+{totalXp + (isPerfect ? 30 : 0)}</span>
          </div>
        </div>

        <button className="premium-btn" style={{ margin: '0 auto' }} onClick={handleComplete}>
          <span className="mi">list</span> Back to Modules
        </button>
      </div>
    );
  }

  if (!currentItem) return null;
  const words = currentItem.wrong.trim().split(/\s+/);

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      <style>{`
        @keyframes arcadeFloat {
          0% { transform: translateY(20px) scale(0.8); opacity: 0; }
          20% { transform: translateY(0) scale(1.1); opacity: 1; }
          80% { transform: translateY(-20px) scale(1); opacity: 1; }
          100% { transform: translateY(-45px) scale(0.9); opacity: 0; }
        }
        .arcade-toast {
          animation: arcadeFloat 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
      `}</style>
      
      {/* Floating Arcade Toasts */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        {activeToasts.map(t => (
          <div key={t.key} className="arcade-toast" style={{ background: t.isError ? 'rgba(255, 82, 82, 0.95)' : 'rgba(0, 229, 255, 0.95)', color: 'white', padding: '8px 16px', borderRadius: 12, fontWeight: 900, fontSize: 18, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
            {t.text}
          </div>
        ))}
      </div>

      {toast && !isComprehensive && <XPToast xp={toast.xp} bonuses={toast.bonuses} totalXp={toast.xp} onDone={() => setToast(null)} />}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Question</span>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{currentIndex + 1} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 16 }}>/ {mistakes.length}</span></div>
        </div>

        <StreakBadge streak={streak} />

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>XP Earned</span>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{totalXp}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(currentIndex / mistakes.length) * 100}%`, background: 'var(--grad-primary)', borderRadius: 4, transition: '0.5s' }} />
      </div>

      {/* Question card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: 24, minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4 }} />
        <h3 style={{ fontSize: 13, color: step === 1 ? 'var(--error)' : 'var(--success)', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mi" style={{ fontSize: 18 }}>{step === 1 ? 'bug_report' : 'check_circle'}</span>
          {step === 1 ? 'STEP 1 — TAP THE ERROR WORD' : 'STEP 2 — SELECT THE CORRECT WORD'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 6px', direction: 'ltr' }}>
          {words.map((word, i) => {
            const isError = i >= errorSpan.start && i <= errorSpan.endW;
            const isSelected = selectedWordIndex === i;
            const isWrongAttempt = wrongAttempts.includes(i);
            let bg = 'transparent', color = 'white', border = '1px solid transparent';
            if (step === 2 && isError) { bg = 'rgba(255,82,82,0.2)'; color = 'var(--error)'; border = '1px dashed var(--error)'; }
            else if (isSelected) { bg = 'var(--success)'; color = 'black'; }
            else if (isWrongAttempt) { bg = 'rgba(255,82,82,0.12)'; color = 'var(--error)'; }
            return (
              <button key={i} onClick={() => handleWordClick(i)} disabled={step !== 1} style={{ background: bg, color, border, padding: '4px 8px', borderRadius: 6, fontSize: 'clamp(16px,5vw,22px)', fontWeight: 600, cursor: step === 1 ? 'pointer' : 'default', transition: '0.2s', lineHeight: 1.4 }}>
                {word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Options */}
      {step === 2 && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h4 style={{ fontSize: 13, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>Select the correct replacement:</h4>
            <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>⚡ Quick = +5 XP</span>
          </div>
          {options.map((opt, i) => {
            const isSelected = selectedOpt === opt;
            const isCorrect = selectedOpt && opt === correctOption;
            const isWrong = selectedOpt && isSelected && opt !== correctOption;
            return (
              <button key={i} onClick={() => handleSelect(opt)} style={{ width: '100%', padding: '16px 20px', borderRadius: 14, textAlign: 'left', background: isCorrect ? 'rgba(0,230,118,0.1)' : isWrong ? 'rgba(255,82,82,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--border-glass)'}`, color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'white', transition: 'all 0.2s', cursor: selectedOpt ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 12, direction: 'ltr' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isSelected && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'currentColor' }} />}
                </div>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* After answer */}
      {selectedOpt && (
        <div className="animate-slide-up">
          <div style={{
            padding: '16px 20px', borderRadius: 12, marginBottom: 24,
            background: selectedOpt === correctOption ? 'rgba(0,230,118,0.05)' : 'rgba(255,82,82,0.05)',
            border: `1px solid ${selectedOpt === correctOption ? 'var(--success)' : 'var(--error)'}`,
            fontSize: 14, color: 'var(--text-dim)'
          }}>
            <h4 style={{ fontSize: 18, fontWeight: 800, color: selectedOpt === correctOption ? 'var(--primary)' : 'var(--error)', marginBottom: 12 }}>
              {selectedOpt === correctOption ? 'Excellent! 🎉' : 'Incorrect ❌'}
            </h4>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: 600, color: 'white', marginBottom: 4 }}>The completely correct sentence is:</p>
              <p style={{ color: 'var(--primary)', fontStyle: 'italic', fontSize: 16 }}>&ldquo;{currentItem.correct}&rdquo;</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {Object.entries(getArabicExplanation(currentItem, 'error_correction')).map(([title, content]) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 12, padding: '10px 14px', direction: 'rtl', textAlign: 'right' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', marginBottom: 4, textTransform: 'uppercase' }}>{title}</div>
                  <div style={{ color: 'white', lineHeight: 1.5, fontSize: 13, whiteSpace: 'pre-line' }}>{content}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="premium-btn" style={{ width: '100%', padding: '20px' }} onClick={handleNext}>
            {currentIndex < mistakes.length - 1 ? 'Next Question' : 'See Results'}
            <span className="mi">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
