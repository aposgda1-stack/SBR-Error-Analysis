'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const buildExercises = () => {
  const exercises = [];
  const sources = [
    { key: 'work_data', label: 'WORK' },
    { key: 'employment_data', label: 'EMPLOYMENT' },
    { key: 'working_life_data', label: 'WORKING LIFE' },
  ];
  sources.forEach(({ key, label }) => {
    const section = sectionsData[key];
    if (!section) return;
    Object.entries(section).forEach(([taskKey, task]) => {
      if (!task?.items) return;
      task.items.forEach((item, i) => {
        if (item.definition) {
          exercises.push({
            id: `${key}_${taskKey}_${i}`,
            label,
            word: item.word,
            definition: item.definition,
            allWords: task.items.map(x => x.word).filter(Boolean),
          });
        }
      });
    });
  });
  return exercises;
};

const ALL_EXERCISES = buildExercises();

function WorkCard({ item, onResult }) {
  const [chosen, setChosen] = useState(null);
  const pool = item.allWords.filter(w => w !== item.word).sort(() => Math.random() - 0.5).slice(0, 2);
  const opts = [item.word, ...pool].sort(() => Math.random() - 0.5);

  const handleChoose = (opt) => {
    if (chosen) return;
    setChosen(opt);
    setTimeout(() => onResult(opt === item.word), 1100);
  };

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <span style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 20, border: '1px solid rgba(167,139,250,0.3)' }}>{item.label}</span>
      </div>
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 12, padding: '18px', marginBottom: 24, direction: 'ltr' }}>
        <p style={{ fontFamily: 'Inter', fontSize: 16, color: 'var(--on-surface)', lineHeight: 1.6, textAlign: 'center' }}>"{item.definition}"</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opts.map((opt, i) => {
          let bg = 'var(--surface-container-high)';
          let border = '1px solid var(--outline-variant)';
          let color = 'var(--on-surface)';
          if (chosen) {
            if (opt === item.word) { bg = 'rgba(27,47,33,0.9)'; border = '1px solid #2e5238'; color = '#88e2a5'; }
            else if (opt === chosen) { bg = 'rgba(60,0,0,0.7)'; border = '1px solid #5c0000'; color = 'var(--error)'; }
          }
          return (
            <button key={i} onClick={() => handleChoose(opt)} style={{ background: bg, border, color, borderRadius: 10, padding: '13px 16px', fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 500, textAlign: 'center', direction: 'ltr', cursor: chosen ? 'default' : 'pointer', transition: 'all 0.2s' }}>{opt}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkArena() {
  const router = useRouter();
  const [exercises] = useState(() => ALL_EXERCISES.sort(() => Math.random() - 0.5).slice(0, 20));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [done, setDone] = useState(false);

  const handleResult = (correct) => {
    setScore(s => ({ ...s, [correct ? 'right' : 'wrong']: s[correct ? 'right' : 'wrong'] + 1 }));
    try {
      const saved = JSON.parse(localStorage.getItem('sbr_progress') || '{}');
      if (!saved.work) saved.work = { done: [], wrong: [] };
      const id = exercises[index]?.id;
      if (id) {
        if (correct) {
          if (!saved.work.done.includes(id)) saved.work.done.push(id);
          saved.work.wrong = saved.work.wrong.filter(w => w !== id);
        } else {
          if (!saved.work.wrong.includes(id)) saved.work.wrong.push(id);
        }
        localStorage.setItem('sbr_progress', JSON.stringify(saved));
      }
    } catch (e) {}
    setTimeout(() => {
      if (index + 1 >= exercises.length) setDone(true);
      else setIndex(i => i + 1);
    }, 1200);
  };

  if (done) return (
    <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
      <TopBar title="Work Vocab Result" />
      <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--on-surface)' }}>Session Complete!</h2>
        <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)', margin: '20px 0' }}>{score.right}/{exercises.length}</div>
        <button onClick={() => router.push('/')} style={{ width: '100%', background: 'var(--primary-container)', color: 'var(--on-primary-container)', border: 'none', borderRadius: 12, padding: 16, fontWeight: 700, cursor: 'pointer' }}>Back Home</button>
      </main>
    </div>
  );

  if (exercises.length === 0) return null;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
      <TopBar title="Arena 3: Work Vocab" />
      <main style={{ padding: '16px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', borderRadius: 16, padding: '28px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <WorkCard item={exercises[index]} onResult={handleResult} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
