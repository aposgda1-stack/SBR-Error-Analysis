'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const PV = sectionsData.phrasal_verbs;

// Build a flat list of exercises from all phrasal verb groups
const ALL_EXERCISES = [
  ...Object.entries(PV).flatMap(([verb, items]) =>
    items.map((item, i) => ({
      id: `${verb}_${i}`,
      verb: verb.toUpperCase(),
      sentence: `فعل [${item.verb}] — المعنى: ___`,
      options: item.def,
      correct: item.def,
      phrasal: item.verb,
      defPool: items.map(x => x.def),
    }))
  )
];

// Word-box style exercise: match phrasal verb to its definition
function PhrasalCard({ item, onResult }) {
  const [chosen, setChosen] = useState(null);

  // Create 3 options: correct + 2 random from same verb group
  const pool = item.defPool.filter(d => d !== item.correct);
  const opts = [item.correct, ...pool.sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5);

  const handleChoose = (opt) => {
    if (chosen) return;
    setChosen(opt);
    setTimeout(() => onResult(opt === item.correct), 1000);
  };

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Verb chip */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <span style={{
          background: 'var(--primary-container)', color: 'var(--on-primary-container)',
          fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600,
          padding: '4px 14px', borderRadius: 20, letterSpacing: '0.06em',
        }}>
          {item.verb}
        </span>
      </div>

      {/* Phrasal verb */}
      <div style={{ textAlign: 'center', marginBottom: 28, direction: 'ltr' }}>
        <p style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 26, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
          {item.phrasal}
        </p>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, marginTop: 4 }}>اختر المعنى الصحيح:</p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opts.map((opt, i) => {
          let bg = 'var(--surface-container-high)';
          let border = '1px solid var(--outline-variant)';
          let color = 'var(--on-surface)';
          if (chosen) {
            if (opt === item.correct) { bg = 'rgba(27,47,33,0.9)'; border = '1px solid #2e5238'; color = '#88e2a5'; }
            else if (opt === chosen) { bg = 'rgba(60,0,0,0.7)'; border = '1px solid #5c0000'; color = 'var(--error)'; }
          }
          return (
            <button key={i} onClick={() => handleChoose(opt)} style={{
              background: bg, border, color,
              borderRadius: 10, padding: '14px 16px',
              fontFamily: 'Inter', fontSize: 15, textAlign: 'right',
              cursor: chosen ? 'default' : 'pointer', transition: 'all 0.2s', direction: 'ltr',
            }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PhrasalArena() {
  const router = useRouter();
  const [exercises] = useState(() => ALL_EXERCISES.sort(() => Math.random() - 0.5).slice(0, 20));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);

  const handleResult = (correct) => {
    setScore(s => ({ ...s, [correct ? 'right' : 'wrong']: s[correct ? 'right' : 'wrong'] + 1 }));
    try {
      const saved = JSON.parse(localStorage.getItem('sbr_progress') || '{}');
      if (!saved.phrasal) saved.phrasal = { done: [], wrong: [] };
      const id = exercises[index].id;
      if (correct) {
        if (!saved.phrasal.done.includes(id)) saved.phrasal.done.push(id);
        saved.phrasal.wrong = saved.phrasal.wrong.filter(w => w !== id);
      } else {
        if (!saved.phrasal.wrong.includes(id)) saved.phrasal.wrong.push(id);
      }
      localStorage.setItem('sbr_progress', JSON.stringify(saved));
    } catch (e) {}

    setTimeout(() => {
      if (index + 1 >= exercises.length) setDone(true);
      else { setIndex(i => i + 1); setKey(k => k + 1); }
    }, 1200);
  };

  if (done) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
        <TopBar title="Phrasal Verbs" />
        <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 40 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--primary)' }}>link</span>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 28, color: 'var(--on-surface)', textAlign: 'center' }}>انتهت الجلسة!</h2>
          <div style={{ background: 'var(--surface-container)', borderRadius: 16, padding: 24, width: '100%', border: '1px solid var(--outline-variant)', display: 'flex', gap: 24, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{score.right}</div><div style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>صح ✓</div></div>
            <div style={{ width: 1, background: 'var(--outline-variant)' }} />
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 36, fontWeight: 800, color: 'var(--error)', fontFamily: 'JetBrains Mono' }}>{score.wrong}</div><div style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>غلط ✗</div></div>
          </div>
          <button onClick={() => router.push('/')} style={{ width: '100%', background: 'var(--primary-container)', color: 'var(--on-primary-container)', border: 'none', borderRadius: 12, padding: 16, fontFamily: 'Inter', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>العودة للرئيسية</button>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
      <TopBar title="Arena 2: Phrasal Verbs" />
      <main style={{ padding: '16px', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 8 }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 22, color: 'var(--on-surface)' }}>Arena 2: Phrasal Verbs</h2>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <div style={{ height: 6, background: 'var(--surface-container-high)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${((index + 1) / exercises.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--tertiary), var(--primary))', borderRadius: 999, transition: 'width 0.4s', boxShadow: '0 0 8px rgba(165,200,255,0.5)' }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 6, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--on-surface-variant)', letterSpacing: '0.08em' }}>{index + 1} / {exercises.length}</div>
          </div>
        </div>

        <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', borderRadius: 16, padding: '28px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <PhrasalCard key={key} item={exercises[index]} onResult={handleResult} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
