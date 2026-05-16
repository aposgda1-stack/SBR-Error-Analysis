'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const MISTAKES = sectionsData.identify_error_data.the_130_mistakes;

// Generate wrong-word options from the correct sentence
function getOptions(item) {
  // The wrong word is the one that differs between wrong and correct
  const wrongWords = item.wrong.split(/\s+/);
  const correctWords = item.correct.split(/\s+/);

  // Find all differing words
  let wrongWord = '', correctWord = '';
  for (let i = 0; i < Math.max(wrongWords.length, correctWords.length); i++) {
    if (wrongWords[i] !== correctWords[i]) {
      wrongWord = wrongWords[i] || '';
      correctWord = correctWords[i] || '';
      break;
    }
  }

  // Build 3 options: the correct one + 2 plausible distractors from other items
  const pool = MISTAKES
    .filter(m => m.id !== item.id)
    .map(m => {
      const mWrong = m.wrong.split(/\s+/);
      const mCorrect = m.correct.split(/\s+/);
      for (let i = 0; i < Math.max(mWrong.length, mCorrect.length); i++) {
        if (mWrong[i] !== mCorrect[i]) return mCorrect[i] || '';
      }
      return '';
    })
    .filter(w => w && w !== correctWord && w.length < 10)
    .slice(0, 5);

  const opts = [correctWord, ...pool.slice(0, 2)].sort(() => Math.random() - 0.5);
  return { wrongWord, correctWord, opts };
}

function renderSentence(sentence, wrongWord, onClickWord, clickedWord) {
  const words = sentence.split(/(\s+)/);
  return words.map((w, i) => {
    const clean = w.replace(/[.,!?'"]/g, '');
    const isWrong = clean.toLowerCase() === wrongWord.toLowerCase();
    return (
      <span key={i}>
        {isWrong ? (
          <button
            onClick={() => onClickWord(w)}
            style={{
              display: 'inline-block', padding: '2px 8px', margin: '0 2px',
              background: clickedWord ? 'var(--surface-variant)' : 'transparent',
              border: `1px solid var(--primary)`,
              color: 'var(--primary)', borderRadius: 6,
              fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 700,
              cursor: 'pointer', animation: 'pulse-glow 2s infinite',
              boxShadow: '0 0 8px rgba(255,87,26,0.3)',
            }}
          >{w}</button>
        ) : w}
      </span>
    );
  });
}

export default function ErrorArena() {
  const router = useRouter();
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('click'); // click | choose | feedback
  const [clickedWord, setClickedWord] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [options, setOptions] = useState({ wrongWord: '', correctWord: '', opts: [] });
  const [sessionScore, setSessionScore] = useState({ right: 0, wrong: 0 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Build session queue (wrong items first, then shuffle rest)
    try {
      const saved = JSON.parse(localStorage.getItem('sbr_progress') || '{}');
      const wrongIds = new Set(saved.errors?.wrong || []);
      const doneIds = new Set(saved.errors?.done || []);
      const wrongFirst = MISTAKES.filter(m => wrongIds.has(m.id));
      const fresh = MISTAKES.filter(m => !doneIds.has(m.id) && !wrongIds.has(m.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 20 - wrongFirst.length);
      const q = [...wrongFirst, ...fresh];
      if (q.length === 0) {
        // All done, show all again
        setQueue(MISTAKES.slice().sort(() => Math.random() - 0.5).slice(0, 20));
      } else {
        setQueue(q);
      }
    } catch (e) {
      setQueue(MISTAKES.slice().sort(() => Math.random() - 0.5).slice(0, 20));
    }
  }, []);

  useEffect(() => {
    if (queue.length > 0 && index < queue.length) {
      setOptions(getOptions(queue[index]));
      setPhase('click');
      setClickedWord(null);
      setChosen(null);
      setIsCorrect(null);
    }
  }, [queue, index]);

  const handleWordClick = () => {
    setClickedWord(true);
    setPhase('choose');
  };

  const handleChoice = (opt) => {
    const correct = opt.toLowerCase().replace(/[.,!?]/g, '') === options.correctWord.toLowerCase().replace(/[.,!?]/g, '');
    setChosen(opt);
    setIsCorrect(correct);
    setPhase('feedback');
    setSessionScore(s => ({ ...s, [correct ? 'right' : 'wrong']: s[correct ? 'right' : 'wrong'] + 1 }));

    // Persist to localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('sbr_progress') || '{}');
      if (!saved.errors) saved.errors = { done: [], wrong: [] };
      const id = queue[index].id;
      if (correct) {
        if (!saved.errors.done.includes(id)) saved.errors.done.push(id);
        saved.errors.wrong = saved.errors.wrong.filter(w => w !== id);
      } else {
        if (!saved.errors.wrong.includes(id)) saved.errors.wrong.push(id);
      }
      localStorage.setItem('sbr_progress', JSON.stringify(saved));
    } catch (e) {}
  };

  const handleNext = () => {
    if (index + 1 >= queue.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
    }
  };

  if (queue.length === 0) {
    return <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface)' }}>جاري التحميل...</div>;
  }

  if (done) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
        <TopBar title="نتيجة الجلسة" />
        <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 40 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--primary)' }}>emoji_events</span>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 28, color: 'var(--on-surface)', textAlign: 'center' }}>انتهت الجلسة!</h2>
          <div style={{ background: 'var(--surface-container)', borderRadius: 16, padding: 24, width: '100%', border: '1px solid var(--outline-variant)', display: 'flex', gap: 24, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{sessionScore.right}</div>
              <div style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>صح ✓</div>
            </div>
            <div style={{ width: 1, background: 'var(--outline-variant)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--error)', fontFamily: 'JetBrains Mono' }}>{sessionScore.wrong}</div>
              <div style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>غلط ✗</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <button onClick={() => { setIndex(0); setDone(false); setQueue(q => [...q].sort(() => Math.random() - 0.5)); setSessionScore({ right: 0, wrong: 0 }); }} style={{ flex: 1, background: 'var(--primary-container)', color: 'var(--on-primary-container)', border: 'none', borderRadius: 12, padding: '14px', fontFamily: 'Inter', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              جلسة جديدة
            </button>
            <button onClick={() => router.push('/')} style={{ flex: 1, background: 'var(--surface-container-high)', color: 'var(--on-surface)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: '14px', fontFamily: 'Inter', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              الرئيسية
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const item = queue[index];
  const { wrongWord, correctWord, opts } = options;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
      <TopBar title="Arena 1: صائد الأخطاء" />

      <main style={{ padding: '16px', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 8 }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 22, textAlign: 'center', color: 'var(--on-surface)' }}>
            Arena 1: صائد الأخطاء
          </h2>
          {/* Progress Bar */}
          <div style={{ width: '100%', maxWidth: 360 }}>
            <div style={{ height: 6, background: 'var(--surface-container-high)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                width: `${((index + 1) / queue.length) * 100}%`, height: '100%',
                background: 'linear-gradient(90deg, var(--secondary-fixed-dim), var(--primary))',
                borderRadius: 999, transition: 'width 0.4s ease',
                boxShadow: '0 0 8px rgba(255,181,158,0.5)',
              }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 6, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--on-surface-variant)', letterSpacing: '0.08em' }}>
              {index + 1} / {queue.length} SENTENCES
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'var(--surface-container)', border: '1px solid var(--outline-variant)',
          borderRadius: 16, padding: '28px 20px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.3s ease',
        }}>
          {/* Top glow line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', opacity: 0.6 }} />

          {/* Topic tag */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <span style={{
              background: 'var(--surface-container-highest)', color: 'var(--primary)',
              fontFamily: 'JetBrains Mono', fontSize: 11, padding: '4px 12px',
              borderRadius: 4, border: '1px solid var(--outline-variant)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              [{item.topic}]
            </span>
          </div>

          {/* Sentence */}
          <div style={{ textAlign: 'center', marginBottom: 28, direction: 'ltr', lineHeight: 2 }}>
            <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: 'var(--on-surface)' }}>
              {phase === 'click'
                ? renderSentence(item.wrong, wrongWord, handleWordClick, false)
                : renderSentence(item.wrong, wrongWord, () => {}, true)}
            </p>
          </div>

          {/* Phase: click instruction */}
          {phase === 'click' && (
            <div style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: 14, fontFamily: 'Inter' }}>
              👆 اضغط على الكلمة الخاطئة في الجملة
            </div>
          )}

          {/* Phase: choose correct word */}
          {phase === 'choose' && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', direction: 'ltr' }}>
              {opts.map(opt => (
                <button key={opt} onClick={() => handleChoice(opt)} style={{
                  background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)',
                  color: 'var(--on-surface)', borderRadius: 10, padding: '12px 22px',
                  fontFamily: 'Inter', fontSize: 17, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Phase: feedback */}
          {phase === 'feedback' && (
            <div style={{
              borderRadius: 10, padding: '14px 16px', textAlign: 'center',
              background: isCorrect ? 'rgba(27,47,33,0.9)' : 'rgba(60,0,0,0.7)',
              border: `1px solid ${isCorrect ? '#2e5238' : '#5c0000'}`,
            }}>
              <p style={{
                fontFamily: 'Inter', fontSize: 14, direction: 'rtl',
                color: isCorrect ? '#88e2a5' : '#ffb4ab',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{isCorrect ? 'check_circle' : 'cancel'}</span>
                {isCorrect
                  ? `ممتاز! الإجابة الصحيحة: "${correctWord}"`
                  : `الإجابة الصحيحة: "${correctWord}" — تذكر: ${item.topic}`}
              </p>
            </div>
          )}
        </div>

        {/* Next Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={phase === 'feedback' ? handleNext : undefined}
            disabled={phase !== 'feedback'}
            style={{
              background: phase === 'feedback' ? 'var(--primary)' : 'var(--surface-container-highest)',
              color: phase === 'feedback' ? 'var(--on-primary)' : 'var(--on-surface-variant)',
              border: 'none', borderRadius: 30, padding: '14px 40px',
              fontFamily: 'Inter', fontWeight: 800, fontSize: 17,
              cursor: phase === 'feedback' ? 'pointer' : 'not-allowed',
              opacity: phase === 'feedback' ? 1 : 0.5,
              boxShadow: phase === 'feedback' ? '0 0 15px rgba(255,87,26,0.4)' : 'none',
              transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            التالي <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>

      </main>
      <BottomNav />
    </div>
  );
}
