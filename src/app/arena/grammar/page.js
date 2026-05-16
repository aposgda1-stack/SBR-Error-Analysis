'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const GRAMMAR = sectionsData.grammar_guide;
// Drills are built dynamically in buildDrills to avoid crashes with inconsistent data format.

// Robust drill builder that handles different data formats and avoids crashes
const buildDrills = () => {
  const pool = [];
  
  // 1. Process grammar_guide entries
  Object.entries(GRAMMAR).forEach(([topic, data]) => {
    if (!data.practice) return;
    const topicLabel = topic.replace(/_/g, ' ');
    
    data.practice.forEach((item, i) => {
      if (item.sentence && item.answer) {
        pool.push({
          id: `g_${topic}_${i}`,
          topic: topicLabel,
          sentence: item.sentence,
          answer: item.answer,
          isBool: false
        });
      } else if (item.wrong && item.correct) {
        pool.push({
          id: `g_${topic}_${i}_t`,
          topic: topicLabel,
          sentence: item.correct,
          correctAnswer: true,
          isBool: true
        });
        pool.push({
          id: `g_${topic}_${i}_f`,
          topic: topicLabel,
          sentence: item.wrong,
          correctAnswer: false,
          isBool: true
        });
      }
    });
  });

  // 2. Mix and create final 20 drills
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const finalDrills = shuffled.slice(0, 40).map(item => {
    if (item.isBool) return item;
    
    // For fill-in-the-blank items, randomly make them True or False
    const makeTrue = Math.random() > 0.5;
    if (makeTrue) {
      return {
        ...item,
        sentence: (item.sentence || '').replace('___', item.answer),
        correctAnswer: true
      };
    } else {
      // Find a random distractor from the pool
      const distractor = pool.find(x => x.answer && x.answer !== item.answer)?.answer || 'incorrectly';
      return {
        ...item,
        sentence: (item.sentence || '').replace('___', distractor),
        correctAnswer: false
      };
    }
  });

  return finalDrills.sort(() => Math.random() - 0.5).slice(0, 20);
};

export default function GrammarArena() {
  const router = useRouter();
  const [drills] = useState(buildDrills);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [done, setDone] = useState(false);

  const handleAnswer = (ans) => {
    if (feedback) return;
    const correct = ans === drills[index].correctAnswer;
    setFeedback(correct ? 'correct' : 'wrong');
    setScore(s => ({ ...s, [correct ? 'right' : 'wrong']: s[correct ? 'right' : 'wrong'] + 1 }));

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 >= drills.length) setDone(true);
      else setIndex(i => i + 1);
    }, 800);
  };

  if (done) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
        <TopBar title="Grammar Drill" />
        <main style={{ padding: 24, maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 40 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--tertiary)' }}>bolt</span>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 28, color: 'var(--on-surface)', textAlign: 'center' }}>انتهت المهمة!</h2>
          <div style={{ background: 'var(--surface-container)', borderRadius: 16, padding: 24, width: '100%', border: '1px solid var(--outline-variant)', display: 'flex', gap: 24, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{score.right}</div><div style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>صح ✓</div></div>
            <div style={{ width: 1, background: 'var(--outline-variant)' }} />
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 36, fontWeight: 800, color: 'var(--error)', fontFamily: 'JetBrains Mono' }}>{score.wrong}</div><div style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>غلط ✗</div></div>
          </div>
          <button onClick={() => router.push('/')} style={{ width: '100%', background: 'var(--tertiary-container)', color: 'var(--on-tertiary)', border: 'none', borderRadius: 12, padding: 16, fontFamily: 'Inter', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>العودة للرئيسية</button>
        </main>
        <BottomNav />
      </div>
    );
  }

  const current = drills[index];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
      <TopBar title="Arena 4: Grammar Drill" />
      <main style={{ padding: '16px', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 8 }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 22, color: 'var(--on-surface)' }}>Arena 4: Grammar Drill</h2>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <div style={{ height: 6, background: 'var(--surface-container-high)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${((index + 1) / drills.length) * 100}%`, height: '100%', background: 'var(--tertiary)', borderRadius: 999, transition: 'width 0.4s' }} />
            </div>
          </div>
        </div>

        <div style={{
          background: feedback === 'correct' ? 'rgba(27,47,33,0.8)' : (feedback === 'wrong' ? 'rgba(60,0,0,0.6)' : 'var(--surface-container)'),
          border: `1px solid ${feedback === 'correct' ? '#2e5238' : (feedback === 'wrong' ? '#5c0000' : 'var(--outline-variant)')}`,
          borderRadius: 24, padding: '48px 24px', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          transition: 'all 0.2s', position: 'relative'
        }}>
          <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 11, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{current.topic}</span>
          <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: 'var(--on-surface)', direction: 'ltr', lineHeight: 1.6 }}>
            "{current.sentence}"
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <button 
            onClick={() => handleAnswer(true)}
            style={{
              background: 'rgba(136,226,165,0.1)', border: '2px solid #2e5238', color: '#88e2a5',
              padding: '20px', borderRadius: 16, fontSize: 20, fontWeight: 800, cursor: 'pointer'
            }}
          >صح (True)</button>
          <button 
            onClick={() => handleAnswer(false)}
            style={{
              background: 'rgba(255,180,171,0.1)', border: '2px solid #5c0000', color: 'var(--error)',
              padding: '20px', borderRadius: 16, fontSize: 20, fontWeight: 800, cursor: 'pointer'
            }}
          >غلط (False)</button>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: 13, fontFamily: 'Inter' }}>هل الجملة أعلاه صحيحة نحوياً؟</p>
      </main>
      <BottomNav />
    </div>
  );
}
